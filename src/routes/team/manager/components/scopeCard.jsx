/**
 * 业主管理 - 编辑页 - 承揽范围 组件
 */
import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Table, Button, Modal, Radio, Alert } from 'antd';
import React, { Component } from 'react';

import EmployeeSelect from './employee';
import { DistrictState, TeameEffectiveDateType, TeamOwnerManagerState } from '../../../../application/define';
import { CoreContent, DeprecatedCoreForm } from '../../../../components/core';
import { CommonSelectSuppliers, CommonSelectPlatforms, CommonSelectCities, CommonSelectDistricts } from '../../../../components/common/index';
import DistrictModal from '../../components/districtModal';

const date = new Date(); // 获取当前时间
const year = date.getFullYear(); // 得到年份
const month = date.getMonth();// 得到月份
const time = new Date(year, month + 1, 1);

class ScopeCard extends Component {
  static propTypes = {
    teamManagerScopeList: PropTypes.object, // 承揽范围列表
    teamManagerDetailData: PropTypes.object, // 业主详情数据
  };

  static defaultProps = {
    teamManagerScopeList: {},
    teamManagerDetailData: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isDistrictModal: false,            // 是否关闭商圈弹窗
      isShowCreateScopeModal: false,    //  是否显示新增承揽范围弹窗
      isShowChangeScopeModal: false,     //  是否显示变更业务承揽弹窗
      isShowTerminationModal: false,     // 是否显示终止承揽显示弹窗
      managerDetail: {},            // 根据身份证号获取的业主信息
      changeOwnerDate: {},       // 变更业主的数据
      knightInfo: [],             // 骑士商圈信息
      paramsInfo: {},             // 参数信息
      isShowChange: false,        // 是否是变更范围
      isResetData: false,         // 是否重置人员数据

      namespace: 'teamManagerUpdate',
      suppliers: undefined,  // 供应商
      platforms: undefined,  // 平台
      cities: undefined,     // 城市
      districts: undefined,  // 商圈
      effectDate: Number(moment(date).format('YYYYMMDD')), // 生效日期
      tiemStamp: Date.parse(new Date()), // 时间戳
    };
    this.private = {
      // 搜索的参数
      searchParams: {
        meta: { page: 1, limit: 30 },
      },
    };
  }

  // 获取承揽范围列表
  componentDidMount() {
    const { id } = this.props;
    const params = { id };
    this.props.dispatch({ type: 'teamManager/fetchOwnerScopeList', payload: params });
  }

  // 修改分页
  onChangePage = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.meta.page = page;
    searchParams.meta.limit = limit;
    this.onSearch(searchParams);
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.meta.page = page;
    searchParams.meta.limit = limit;
    this.onSearch(searchParams);
  }

  // 搜索
  onSearch = (params) => {
    const { id } = this.props;
    // 保存搜索的参数
    const { searchParams } = this.private;
    this.private.searchParams = {
      ...searchParams,
      ...params,
      id,
    };
    this.props.dispatch({
      type: 'teamManager/fetchOwnerScopeList',
      payload: this.private.searchParams,
    });
  }

  // 更换供应商
  onChangeSuppliers = (e) => {
    const { setFieldsValue } = this.props.form;
    this.setState({ suppliers: e });

    // 修改选项，同时重置下级菜单
    this.setState({
      suppliers: e,
      cities: undefined,
      districts: undefined,
    });

    // 清空选项
    setFieldsValue({ cities: undefined, districts: undefined });
  }

  // 更换平台
  onChangePlatforms = (e) => {
    const { setFieldsValue } = this.props.form;
    this.setState({ platforms: e });

    // 修改选项，同时重置下级菜单
    this.setState({
      platforms: e,
      suppliers: undefined,
      cities: undefined,
      districts: undefined,
    });

    // 清空选项
    setFieldsValue({ suppliers: undefined, cities: undefined, districts: undefined });
  }

  // 更换城市
  onChangeCity = (e) => {
    const { setFieldsValue } = this.props.form;
    this.setState({ cities: e });

    // 修改选项，同时重置下级菜单
    this.setState({
      cities: e,
      districts: undefined,
    });

    // 清空选项
    setFieldsValue({ districts: undefined });
  }


  //  新增承揽范围按钮
  onCreateScope = () => {
    // const { teamManagerDetailData } = this.props;
    // 判断业主是否为空
    // if (!teamManagerDetailData.staff_id) {
    //   return message.error('请先选择业主');
    // }
    this.setState({
      isShowCreateScopeModal: true,
    });
  }


  // 变更业务承揽
  onChangeScope = (text) => {
    const { managerDetail } = this.state;
    if (is.not.empty(managerDetail) && is.existy(managerDetail)) {
      this.setState({
        isResetData: true,
      });
    } else {
      this.setState({
        isResetData: false,
      });
    }
    this.setState({
      isShowChangeScopeModal: true,
      isShowChange: true,
      changeOwnerDate: text,
    });
  }

  // 提交终止承揽的数据回调
  onCallBackTerminationInfo = (res, params) => {
    const { getFieldValue } = this.props.form;
    if (is.not.empty(res) && is.existy(res) && getFieldValue('terminationDate') === TeameEffectiveDateType.immediately) {
      this.setState({
        isShowTerminationModal: false,
        isDistrictModal: true,
        knightInfo: res,
      });
    } else {
      this.props.dispatch({
        type: 'teamManager/fetchOwnerCancelScope',
        payload: {
          ...params,
          onSuccessCallBack: () => {
            this.onTerminationCancel();
            // 更新列表
            this.onSuccessCallBack();
          },
        },
      });
    }
  }

  // 提交终止承揽的数据
  onSubmitTermination = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // const { effectDate } = this.state;
      const effectDate = values.terminationDate === TeameEffectiveDateType.immediately
        ? Number(moment(date).format('YYYYMMDD'))
        : Number(moment(time).format('YYYYMMDD'));
      const { id } = this.props;
      const { changeOwnerDate } = this.state;
      const params = { ownerId: id, staffId: changeOwnerDate.staff_id, district: [changeOwnerDate.biz_district_id], effectDate, ...values };
      this.setState({
        paramsInfo: params,
        // effectDate: Number(moment(time).format('YYYYMMDD')), // 生效日期
      });

      this.props.dispatch({ type: 'teamManager/fetchTeamKnightDistrcit', payload: { ...params, onSuccessCallBack: (res) => { this.onCallBackTerminationInfo(res, params); } } });
    });
  }

  // 弹窗隐藏
  onTerminationCancel = () => {
    this.setState({
      isShowTerminationModal: false,
    });
  }

  // 终止业务承揽
  onStopScope = (rowData) => {
    this.setState({
      isShowTerminationModal: true,
      isShowChange: false,
      changeOwnerDate: rowData,
    });
  }

  // 添加承揽范围确定
  onClickCreateScopeOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          isShowCreateScopeModal: false,
          suppliers: undefined,
          platforms: undefined,
          cities: undefined,
          districts: undefined,
          effectDate: Number(moment(time).format('YYYYMMDD')), // 生效日期
        });
        const { id } = this.props;
        const { onSuccessCallBack } = this;
        const params = { id, districts: values.districts, onSuccessCallBack, effectTime: Number(moment(date).format('YYYYMMDD')) };
        this.props.dispatch({ type: 'teamManager/fetchOwnerCreateScope', payload: params });
        this.props.form.resetFields();
      }
    });
  }


  onSuccessCallBack = () => {
    const { id, dispatch } = this.props;
    // 刷新变更记录列表
    this.props.onGetChangeList(true);
    // 刷新承揽范围列表
    dispatch({ type: 'teamManager/fetchOwnerScopeList', payload: { id } });
    this.onSearch();
    this.setState({
      tiemStamp: Date.parse(new Date()), // 时间戳
    });
    this.props.form.resetFields();
    this.props.form.setFieldsValue({
      id: undefined,
    });
  }
  // 添加承揽范围取消
  onClickCreateScopeCancel = () => {
    this.props.form.resetFields();
    this.setState({
      isShowCreateScopeModal: false,
      suppliers: [],
      platforms: undefined,
      cities: undefined,
      districts: undefined,
    });
  }

  // 变更业务承揽确定回凋信息
  onCallChangeScopeBackInfo = (res, params) => {
    const { getFieldValue } = this.props.form;
    if (is.not.empty(res) && is.existy(res) && getFieldValue('date') === TeameEffectiveDateType.immediately) {
      this.setState({
        isShowChangeScopeModal: false,
        isDistrictModal: true,
        knightInfo: res,
      });
    } else {
      this.props.dispatch({
        type: 'teamManager/fetchOwnerUpdateScope',
        payload: {
          ...params,
          onSuccessCallBack: () => {
            this.onClickChangeScopeCancel();
            // 更新列表
            this.onSuccessCallBack();
          },
        },
      });
    }
  }

  // 变更业务承揽确定
  onClickChangeScopeOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const { effectDate } = this.state;
      if (!err) {
        const { id } = this.props;
        const { changeOwnerDate } = this.state;
        const params = { id, district: [changeOwnerDate.biz_district_id], staffId: changeOwnerDate.staff_id, ownerId: changeOwnerDate.owner_id, effectDate, ...values };
        this.setState({
          // managerDetail: {},
          paramsInfo: params,
          effectDate: Number(moment(date).format('YYYYMMDD')), // 生效日期
        });
        this.props.dispatch({ type: 'teamManager/fetchTeamKnightDistrcit', payload: { ...params, onSuccessCallBack: (res) => { this.onCallChangeScopeBackInfo(res, params); } } });
      }
    });
  }

  // 隐藏商圈弹窗
  onDistrictHandleCancel = () => {
    this.setState({
      isDistrictModal: false,
    });
  };

  // 变更业务承揽取消
  onClickChangeScopeCancel = () => {
    this.props.form.resetFields();
    this.props.form.setFieldsValue({
      id: undefined,
    });
    const obj = {
      isShowChangeScopeModal: false,
      managerDetail: {},
      tiemStamp: Date.parse(new Date()), // 时间戳
    };
    this.setState({
      ...obj,
    });
  }

  // 更新业主信息
  onChangeManager = (id, info) => {
    this.setState({
      managerDetail: info,  // 业主信息
    });
  }

  // 更改生效日期
  onEffectDate = (value) => {
    if (value.target.value === TeameEffectiveDateType.immediately) {
      this.setState({
        effectDate: Number(moment(date).format('YYYYMMDD')), // 生效日期
      });
    } else {
      this.setState({
        effectDate: Number(moment(time).format('YYYYMMDD')), // 生效日期
      });
    }
  }

  // 渲染终止承揽的form表单
  renderTerminationForm = () => {
    const { getFieldDecorator } = this.props.form;
    const { isShowTerminationModal } = this.state;
    if (!isShowTerminationModal) return null;
    const formItem = [
      {
        label: '生效日期',
        form: getFieldDecorator('terminationDate', {
          initialValue: TeameEffectiveDateType.immediately,
          rules: [{ required: true, message: '请选择生效日期' }],
        })(
          <Radio.Group onChange={this.onEffectDate}>
            {/* <Radio value={TeameEffectiveDateType.second}>{TeameEffectiveDateType.description(TeameEffectiveDateType.second)}</Radio> */}
            <Radio value={TeameEffectiveDateType.immediately}>{TeameEffectiveDateType.description(TeameEffectiveDateType.immediately)}</Radio>
          </Radio.Group>,
        ),
      },
    ];
    const layout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };
    return (
      <Modal
        title={<Alert message="是否确认终止承揽？" type="warning" showIcon style={{ background: '#fff', border: 'none' }} />}
        width="800px"
        visible={isShowTerminationModal}
        onOk={this.onSubmitTermination}
        onCancel={this.onTerminationCancel}
        okText="确定"
      >
        <DeprecatedCoreForm items={formItem} cols={1} layout={layout} />
      </Modal>
    );
  }

  // 渲染承揽范围
  renderScope = () => {
    const { page } = this.private.searchParams.meta;

    // 承揽范围列表
    const { teamManagerScopeList: scopeData = {} } = this.props;
    const { data = [] } = scopeData;
    const columns = [
      {
        title: '平台',
        dataIndex: ['biz_district_info', 'platform_name'],
        key: 'biz_district_info.platform_name',
        render: text => text || '--',
      },
      {
        title: '供应商',
        dataIndex: ['biz_district_info', 'supplier_name'],
        key: 'biz_district_info.supplier_name',
        render: text => text || '--',
      },
      {
        title: '城市',
        dataIndex: ['biz_district_info', 'city_name'],
        key: 'biz_district_info.city_name',
        render: text => text || '--',
      },
      {
        title: '商圈',
        dataIndex: ['biz_district_info', 'name'],
        key: 'biz_district_info.name',
        render: text => text || '--',
      },
      {
        title: '商圈状态',
        dataIndex: ['biz_district_info', 'state'],
        key: 'biz_district_info.state',
        render: text => DistrictState.description(text),
      },
      {
        title: '归属月份',
        dataIndex: 'month',
        key: 'month',
        render: text => (text ? moment(`${text}01`).format('YYYY年MM月') : '--'),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 160,
        render: (text, rowData) => {
          return (
            <React.Fragment>
              <span
                className="app-global-compoments-cursor"
                onClick={() => this.onChangeScope(rowData)}
              >变更业务承揽</span>
              <span
                onClick={() => this.onStopScope(rowData)}
                className="app-global-compoments-cursor"
              >终止承揽</span>
            </React.Fragment>
          );
        },
      },
    ];

    // 分页
    const pagination = {
      current: page,
      defaultPageSize: 30,                      // 默认数据条数
      onChange: this.onChangePage,              // 切换分页
      showQuickJumper: true,                    // 显示快速跳转
      showSizeChanger: true,                    // 显示分页
      onShowSizeChange: this.onShowSizeChange,  // 展示每页数据数
      showTotal: total => `总共${total}条`,      // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(scopeData, '_meta.result_count', 0), // 数据总条数
    };
    const titleExt = (<Button type="primary" onClick={this.onCreateScope}>添加承揽范围</Button>);
    return (
      <CoreContent
        title={'承揽范围'}
        titleExt={titleExt}
      >
        <Table
          rowKey={(record, index) => {
            return index;
          }}
          pagination={pagination}
          dataSource={data}
          columns={columns}
          bordered
        />
      </CoreContent>
    );
  }

  // 渲染生效文案
  renderEffectDate = () => {
    const { teamManagerDetailData } = this.props;
    if (teamManagerDetailData.state === TeamOwnerManagerState.notEffect) {
      return '补全档案后生效';
    }
    return '立即生效';
  }

  // 渲染新增承揽范围弹窗
  renderCreateScopeModal = () => {
    const { getFieldDecorator } = this.props.form;
    const { teamManagerScopeList } = this.props;
    const { data = [] } = teamManagerScopeList;
    let info = [];
    if (is.existy(data) && is.not.empty(data)) {
      info = data[0].biz_district_info;
    }
    const { namespace, suppliers, platforms, cities, isShowCreateScopeModal } = this.state;
    if (!isShowCreateScopeModal) return null;
    const formItems = [
      {
        label: '平台',
        form: getFieldDecorator('platforms', {
          rules: [{ required: true, message: '请选择平台' }],
        })(
          <CommonSelectPlatforms
            namespace={namespace}
            isFilter
            platformCode={info.platform_code}
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择平台"
            onChange={this.onChangePlatforms}
            style={{ width: 260 }}
          />,
        ),
      },
      {
        label: '供应商',
        form: getFieldDecorator('suppliers', {
          rules: [{ required: true, message: '请选择供应商' }],
        })(
          <CommonSelectSuppliers
            namespace={namespace}
            allowClear showSearch
            platforms={platforms}
            isFilter
            supplierId={info.supplier_id}
            optionFilterProp="children"
            placeholder="请选择供应商"
            isCascade
            onChange={this.onChangeSuppliers}
            style={{ width: 260 }}
          />,
        ),
      },
      {
        label: '城市',
        form: getFieldDecorator('cities', {
          rules: [{ required: true, message: '请选择城市' }],
        })(
          <CommonSelectCities
            namespace={namespace}
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择城市"
            platforms={platforms}
            suppliers={suppliers}
            onChange={this.onChangeCity}
            style={{ width: 260 }}
          />,
        ),
      },
      {
        label: '商圈',
        form: getFieldDecorator('districts', {
          rules: [{ required: true, message: '请选择商圈' }],
        })(
          <CommonSelectDistricts
            namespace={namespace}
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择商圈"
            platforms={platforms}
            suppliers={suppliers}
            cities={cities}
            onChange={this.onChangeDistrict}
            style={{ width: 260 }}
          />,
        ),
      },
      {
        label: '生效日期',
        form: this.renderEffectDate(),
      },
    ];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <Modal
        title="添加承揽范围"
        visible={isShowCreateScopeModal}
        onOk={this.onClickCreateScopeOk}
        onCancel={this.onClickCreateScopeCancel}
      >
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </Modal>
    );
  }

  // 渲染身份证号码
  renderIdentityCardId = () => {
    const { teamManagerDetailData = {} } = this.props;
    if (teamManagerDetailData.state === TeamOwnerManagerState.notEffect) {
      return teamManagerDetailData.identity_card_id ? teamManagerDetailData.identity_card_id : '--';
    }
    return dot.get(teamManagerDetailData, 'staff_info.identity_card_id', '--');
  }

  // 渲染变更业务承揽弹窗
  renderChangeScopeModal = () => {
    const { getFieldDecorator } = this.props.form;
    const { isShowChangeScopeModal, managerDetail, changeOwnerDate, tiemStamp, isResetData } = this.state;

    // 业主详情
    const { teamManagerDetailData = {} } = this.props;
    const layoutScope = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    const layoutChangeBefore = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    const layoutChangeAfter = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    if (!isShowChangeScopeModal) return null;
    if (!changeOwnerDate.biz_district_info) {
      return;
    }
    const formItemsScope = [
      {
        label: '平台',
        form: changeOwnerDate.biz_district_info.platform_name,
      },
      {
        label: '供应商',
        form: changeOwnerDate.biz_district_info.supplier_name,
      },
      {
        label: '城市',
        form: changeOwnerDate.biz_district_info.city_name,
      },
      {
        label: '商圈',
        form: changeOwnerDate.biz_district_info.name,
      },
    ];
    const formItemsChangeBefore = [
      {
        label: '姓名',
        form: dot.get(teamManagerDetailData, 'staff_info.name', '--'),
      },
      {
        label: '身份证号',
        form: this.renderIdentityCardId(),
        layout: { labelCol: { span: 10 }, wrapperCol: { span: 14 } },
      },
      {
        label: '手机号',
        form: dot.get(teamManagerDetailData, 'staff_info.phone', '--'),
      },
    ];
    const formItemsChangeAfter = [
      {
        label: '业主姓名',
        form: getFieldDecorator('id', {
          initialValue: dot.get(managerDetail, '_id') || undefined,
          rules: [{ required: true, message: '请输入业主姓名' }],
        })(
          <EmployeeSelect
            isResetData={isResetData}
            tiemStamp={tiemStamp}
            onChange={this.onChangeManager}
          />,
        ),
        span: 24,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 16 } },
      },
      {
        label: '身份证号',
        form: dot.get(managerDetail, 'staff_info.identity_card_id', '--'),
      },
      {
        label: '手机号',
        form: dot.get(managerDetail, 'staff_info.phone', '--'),
      },
      {
        label: '团队ID',
        form: dot.get(managerDetail, '_id', '--'),
      },
      {
        label: '生效日期',
        form: getFieldDecorator('date', {
          initialValue: TeameEffectiveDateType.immediately,
          rules: [{ required: true, message: '请选择生效日期' }],
        })(
          <Radio.Group onChange={this.onEffectDate}>
            <Radio value={TeameEffectiveDateType.immediately}>{TeameEffectiveDateType.description(TeameEffectiveDateType.immediately)}</Radio>
            <Radio value={TeameEffectiveDateType.second}>{TeameEffectiveDateType.description(TeameEffectiveDateType.second)}</Radio>
          </Radio.Group>,
        ),
      },
    ];
    return (
      <Modal
        title="变更业务承揽"
        width="800px"
        visible={isShowChangeScopeModal}
        onOk={this.onClickChangeScopeOk}
        onCancel={this.onClickChangeScopeCancel}
        okText="确定变更"
      >
        <p>业务范围信息</p>
        <DeprecatedCoreForm items={formItemsScope} cols={2} layout={layoutScope} />
        <p>变更前业主</p>
        <DeprecatedCoreForm items={formItemsChangeBefore} cols={3} layout={layoutChangeBefore} />
        <p>变更后业主</p>
        <DeprecatedCoreForm items={formItemsChangeAfter} cols={1} layout={layoutChangeAfter} />
      </Modal>
    );
  }

  // 渲染是否移出商圈的弹窗
  renderDistrictModl = () => {
    const { isShowChange, knightInfo } = this.state;
    // 变更的参数
    const changeProps = {
      api: 'teamManager/fetchOwnerUpdateScope',
      isDistrictModal: this.state.isDistrictModal,
      detail: this.state.changeOwnerDate,
      knightInfo,
      onClickUpdateOwner: this.onChangeScope,
      onCancel: this.onClickChangeScopeCancel,
      onDistrictHandleCancel: this.onDistrictHandleCancel,
      updateListCallback: this.onSuccessCallBack,
      paramsInfo: this.state.paramsInfo,
    };
    // 终止的参数
    const terminate = {
      api: 'teamManager/fetchOwnerCancelScope',
      isDistrictModal: this.state.isDistrictModal,
      detail: this.state.changeOwnerDate,
      knightInfo,
      onClickUpdateOwner: this.onStopScope,
      onCancel: this.onTerminationCancel,
      onDistrictHandleCancel: this.onDistrictHandleCancel,
      updateListCallback: this.onSuccessCallBack,
      paramsInfo: this.state.paramsInfo,
    };
    // 判断是否是变更还是终止的操作
    if (isShowChange) {
      return <DistrictModal {...changeProps} />;
    }
    return <DistrictModal {...terminate} />;
  }

  render() {
    return (
      <div>

        {/* 承揽范围卡片 */}
        {this.renderScope()}

        {/* 新增承揽范围弹窗*/}
        {this.renderCreateScopeModal()}

        {/* 变更业务承揽弹窗 */}
        {this.renderChangeScopeModal()}

        {/* 终止承揽弹窗 */}
        {this.renderTerminationForm()}

        {/* 渲染商圈弹窗 */}
        {this.renderDistrictModl()}
      </div>
    );
  }
}

const mapStateToProps = ({ teamManager: { teamManagerScopeList } }) => {
  return { teamManagerScopeList };
};

export default connect(mapStateToProps)(ScopeCard);
