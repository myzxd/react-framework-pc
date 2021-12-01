/**
 * 业务承揽 - 业务承揽记录
 */
import is from 'is_js';
import moment from 'moment';
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import { Table, Modal, Radio } from 'antd';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import React, { Component } from 'react';
import { connect } from 'dva';

import Search from '../components/search';
import EmployeeSelect from './components/employee';
import { CoreContent, DeprecatedCoreForm } from '../../../components/core';
import { DistrictState, TeameEffectiveDateType, TeamOwnerManagerState } from '../../../application/define';
import DistrictModal from '../components/districtModal';

const date = new Date(); // 获取当前时间
const year = date.getFullYear(); // 得到年份
const month = date.getMonth();// 得到月份
const time = new Date(year, month + 1, 1);

class ManagerLog extends Component {
  static propTypes = {
    businessList: PropTypes.object, // 业务承揽记录
  };

  static defaultProps = {
    businessList: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isDistrictModal: false,            // 是否关闭商圈弹窗
      isShowChangeScopeModal: false,    // 是否显示变更业务承揽弹窗
      managerDetail: {},             //  需要变更的业主信息
      ownerData: {},                //  保留的弹窗信息
      knightInfo: [],             // 骑士商圈信息
      paramsInfo: {},             // 参数信息
      effectDate: Number(moment(date).format('YYYYMMDD')), // 生效日期
      tiemStamp: Date.parse(new Date()), // 时间戳
    };
    this.private = {
      searchParams: {
        meta: { page: 1, limit: 30 },
      },
      namespace: `namespace${Math.floor(Math.random() * 100000)}`,
    };
  }

  // 默认加载数据
  componentDidMount() {
    const payload = this.private.searchParams;
    this.props.dispatch({ type: 'ownerBusiness/fetchOwnerBusinessList', payload });
  }

  // 搜索
  onSearch = (params) => {
    if (params) {
      const { page, limit, platforms, suppliers, cities, districts } = params;
      this.private.searchParams = {
        meta: {
          page,
          limit,
        },
        platforms,
        suppliers,
        cities,
        districts,
      };
    }
    //  调用搜索
    this.props.dispatch({ type: 'ownerBusiness/fetchOwnerBusinessList', payload: this.private.searchParams });
  }

  // 修改分页
  onChangePage = (page, limit) => {
    this.onSearch({ page, limit, ...this.private.searchParams });
  }

  // 隐藏商圈弹窗
  onDistrictHandleCancel = () => {
    this.setState({
      isDistrictModal: false,
    });
  };

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    this.onSearch({ page, limit, ...this.private.searchParams });
  }


  //  变更业务承揽
  onChangeScope = (rowData) => {
    this.setState({
      isShowChangeScopeModal: true,
      ownerData: rowData,
    });
  }
  // 成功回调
  onSuccessCallBack = () => {
    this.onSearch();
    // 变更业务承揽取消
    this.onClickChangeScopeCancel();
    this.props.dispatch({ type: 'ownerBusiness/effctResetOwnerId' });
    this.props.form.setFieldsValue({
      id: undefined,
    });
    this.setState({
      isShowChangeScopeModal: false,
      managerDetail: {},
    });
  }

  // 回凋信息
  onCallBackInfo = (res, params) => {
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
      const { effectDate, managerDetail, ownerData } = this.state;
      if (!err) {
        const params = {
          id: managerDetail._id,
          district: [ownerData.biz_district_id],
          staffId: managerDetail.staff_id,
          ownerId: ownerData.owner_id,
          effectDate,
          ...values,
        };
        this.setState({
          paramsInfo: params,
        });
        this.props.dispatch({ type: 'teamManager/fetchTeamKnightDistrcit', payload: { ...params, onSuccessCallBack: (res) => { this.onCallBackInfo(res, params); } } });
      }
    });
  }

  // 变更业务承揽取消
  onClickChangeScopeCancel = () => {
    this.props.form.resetFields();
    this.props.form.setFieldsValue({
      id: undefined,
    });
    this.setState({
      isShowChangeScopeModal: false,
      managerDetail: {},
      tiemStamp: Date.parse(new Date()),
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

  // 渲染搜索
  renderSearch = () => {
    const { onSearch } = this;
    return (
      <Search onSearch={onSearch} />
    );
  }

  // 渲染列表内容
  renderContent = () => {
    const { page, limit } = this.private.searchParams.meta;

    // 业务承揽记录
    const { businessList: procurementData = {} } = this.props;
    const { data = [] } = procurementData;
    const columns = [
      {
        title: '平台',
        dataIndex: ['biz_district_info', 'platform_name'],
        key: 'biz_district_info.platform_name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '供应商',
        dataIndex: ['biz_district_info', 'supplier_name'],
        key: 'biz_district_info.supplier_name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '城市',
        dataIndex: ['biz_district_info', 'city_name'],
        key: 'biz_district_info.city_name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '商圈',
        dataIndex: ['biz_district_info', 'name'],
        key: 'biz_district_info.name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '商圈状态',
        dataIndex: ['biz_district_info', 'state'],
        key: 'biz_district_info.state',
        render: (text) => {
          return DistrictState.description(text);
        },
      },
      {
        title: '业主姓名',
        dataIndex: ['owner_info', 'staff_info', 'name'],
        key: 'owner_info.staff_info.name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '身份证号',
        dataIndex: ['owner_info', 'staff_info', 'identity_card_id'],
        key: 'owner_info.staff_info.identity_card_id',
        render: (text, record) => {
          if (record.owner_state === TeamOwnerManagerState.notEffect) {
            return record.owner_info.identity_card_id ? record.owner_info.identity_card_id : '--';
          }
          return text || '--';
        },
      },
      {
        title: '业主手机号',
        dataIndex: ['owner_info', 'staff_info', 'phone'],
        key: 'owner_info.staff_info.phone',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 100,
        render: (text, rowData) => {
          return (
            <React.Fragment>
              <span
                className="app-global-compoments-cursor"
                onClick={this.onChangeScope.bind(this, rowData)}
              >变更业务承揽</span>
            </React.Fragment>
          );
        },
      },
    ];

    // 分页
    const pagination = {
      current: page,
      pageSize: limit,                          // 默认数据条数
      onChange: this.onChangePage,              // 切换分页
      showQuickJumper: true,                    // 显示快速跳转
      showSizeChanger: true,                    // 显示分页
      onShowSizeChange: this.onShowSizeChange,  // 展示每页数据数
      showTotal: total => `总共${total}条`,      // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(procurementData, '_meta.result_count', 0), // 数据总条数
    };
    return (
      <CoreContent >
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

  // 渲染身份证号码
  renderIdentityCardId = () => {
    const { ownerData } = this.state;
    const ownerInfo = ownerData.owner_info || {};
    const staffInfo = ownerInfo.staff_info || {};
    if (ownerData.owner_state === TeamOwnerManagerState.notEffect) {
      return ownerInfo.identity_card_id ? ownerInfo.identity_card_id : '--';
    }
    return staffInfo.identity_card_id || '--';
  }

  // 渲染变更业务承揽弹窗
  renderChangeScopeModal = () => {
    const { getFieldDecorator } = this.props.form;
    const { isShowChangeScopeModal, managerDetail, ownerData, tiemStamp } = this.state;
    const ownerInfo = ownerData.owner_info || {};
    const staffInfo = ownerInfo.staff_info || {};
    const layoutScope = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    const layoutChangeBefore = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    const layoutChangeAfter = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    if (!ownerData.biz_district_info) {
      return null;
    }
    const formItemsScope = [
      {
        label: '平台',
        form: ownerData.biz_district_info.platform_name,
      },
      {
        label: '供应商',
        form: ownerData.biz_district_info.supplier_name,
      },
      {
        label: '城市',
        form: ownerData.biz_district_info.city_name,
      },
      {
        label: '商圈',
        form: ownerData.biz_district_info.name,
      },
    ];
    const formItemsChangeBefore = [
      {
        label: '姓名',
        form: staffInfo.name || '--',
      },
      {
        label: '身份证号',
        form: this.renderIdentityCardId(),
        layout: { labelCol: { span: 10 }, wrapperCol: { span: 14 } },
      },
      {
        label: '手机号',
        form: staffInfo.phone || '--',
      },
    ];
    const formItemsChangeAfter = [
      {
        label: '姓名',
        form: getFieldDecorator('id', {
          rules: [{ required: true, message: '请输入姓名' }],
        })(
          <EmployeeSelect
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
    // 变更的参数
    const changeProps = {
      api: 'teamManager/fetchOwnerUpdateScope',
      isDistrictModal: this.state.isDistrictModal,
      detail: this.state.ownerData,
      knightInfo: this.state.knightInfo,
      onClickUpdateOwner: this.onChangeScope,
      onCancel: this.onClickChangeScopeCancel,
      onDistrictHandleCancel: this.onDistrictHandleCancel,
      updateListCallback: this.onSuccessCallBack,
      paramsInfo: this.state.paramsInfo,
    };
    return <DistrictModal {...changeProps} />;
  }


  render() {
    return (
      <div>
        {/* 渲染搜索 */}
        {this.renderSearch()}

        {/* 渲染列表内容 */}
        {this.renderContent()}

        {/* 变更业务承揽弹窗 */}
        {this.renderChangeScopeModal()}

        {/* 渲染商圈弹窗 */}
        {this.renderDistrictModl()}
      </div>
    );
  }
}
function mapStateToProps({ ownerBusiness: { businessList } }) {
  return { businessList };
}
export default connect(mapStateToProps)(Form.create()(ManagerLog));

