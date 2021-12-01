/**
 * 私教账户 - 编辑页 - 业务范围 组件
 */
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Table, Popconfirm, Button, Modal, Select } from 'antd';
import React, { Component } from 'react';

import { DistrictState } from '../../../../../application/define';
import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import { CommonSelectSuppliers, CommonSelectPlatforms, CommonSelectCities, CommonSelectDistricts } from '../../../../../components/common/index';

import styles from '../style/index.less';

const { Option } = Select;
class ScopeCard extends Component {
  static propTypes = {
    onGetChangeList: PropTypes.func,      // 人员详情
    teamCoachScopeList: PropTypes.object, // 业务范围数据
    // eslint-disable-next-line react/no-unused-prop-types
    coachName: PropTypes.array,  // 用于姓名查找的私教数据
  }

  static defaultProps = {
    teamCoachScopeList: {},
    coachName: [],
  }

  static getDerivedStateFromProps(props, state) {
    if (props.coachName.length !== state.coachName.length) {
      return {
        coachName: props.coachName,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      isShowCreateScopeModal: false,    //  是否显示新增业务范围弹窗
      isShowChangeScopeModal: false,     //  是否显示变更业务承揽弹窗
      managerDetail: {},            // 根据姓名获取的私教信息
      changeCoachDate: {},     //  变更的私教数据
      coachName: [],        // 用于姓名查找的私教数据

      namespace: 'teamManagerUpdate',
      suppliers: [],  // 供应商
      platforms: [],  // 平台
      cities: [],     // 城市
      districts: [],  // 商圈
    };
    this.private = {
      // 搜索的参数
      searchParams: {
        meta: { page: 1, limit: 30 },
      },
    };
  }

  // 获取详情数据
  componentDidMount() {
    const { id } = this.props;
    const params = { id };
    this.props.dispatch({ type: 'teamAccount/fetchCoachScopeList', payload: params });
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
    // 保存搜索的参数
    const { searchParams } = this.private;
    const { id } = this.props;
    this.private.searchParams = {
      ...searchParams,
      ...params,
      id,
    };
    this.props.dispatch({
      type: 'teamAccount/fetchCoachScopeList',
      payload: this.private.searchParams,
    });
  }


  // 更换供应商
  onChangeSuppliers = (e) => {
    const { suppliers } = this.state;
    const { setFieldsValue } = this.props.form;

    // 判断原选项是否改变, 如果没有被删除则返回true，如果被删除则返回false
    const isOrigin = suppliers.every(item => e.includes(item));
    // 如果原选项没有改变，则不重置下级菜单
    if (isOrigin) {
      return this.setState({ suppliers: e });
    }

    // 修改选项，同时重置下级菜单
    this.setState({
      suppliers: e,
      cities: [],
      districts: [],
    });

    // 清空选项
    setFieldsValue({ cities: [], districts: [] });
  }

  // 更换平台
  onChangePlatforms = (e) => {
    const { platforms } = this.state;
    const { setFieldsValue } = this.props.form;

    // 判断原选项是否改变, 如果没有被删除则返回true，如果被删除则返回false
    const isOrigin = platforms.every(item => e.includes(item));
    // 如果原选项没有改变，则不重置下级菜单
    if (isOrigin) {
      return this.setState({ platforms: e });
    }

    // 修改选项，同时重置下级菜单
    this.setState({
      platforms: e,
      suppliers: [],
      cities: [],
      districts: [],
    });

    // 清空选项
    setFieldsValue({ suppliers: [], cities: [], districts: [] });
  }

  // 更换城市
  onChangeCity = (e) => {
    const { cities } = this.state;
    const { setFieldsValue } = this.props.form;

    // 判断原选项是否改变, 如果没有被删除则返回true，如果被删除则返回false
    const isOrigin = cities.every(item => e.includes(item));
    // 如果原选项没有改变，则不重置下级菜单
    if (isOrigin) {
      return this.setState({ cities: e });
    }

    // 修改选项，同时重置下级菜单
    this.setState({
      cities: e,
      districts: [],
    });

    // 清空选项
    setFieldsValue({ districts: [] });
  }


  //  新增业务范围按钮
  onCreateScope = () => {
    this.setState({
      isShowCreateScopeModal: true,
    });
  }


  // 变更业务承揽
  onChangeScope = (text) => {
    this.setState({
      isShowChangeScopeModal: true,
      changeCoachDate: text,
    });
  }

  // 终止业务承揽
  onStopScope = (rowData) => {
    const { id } = this.props;
    const { onSuccessCallBack } = this;
    const params = { id, districts: [rowData.biz_district_id], onSuccessCallBack };
    this.props.dispatch({ type: 'teamAccount/fetchCoachCancelScope', payload: params });
  }

  // 添加业务范围确定
  onClickCreateScopeOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.setState({
        isShowCreateScopeModal: false,
        suppliers: [],
        platforms: [],
        cities: [],
        districts: [],
      });
      const { id } = this.props;
      const { onSuccessCallBack } = this;
      const params = { id, districts: values.districts, onSuccessCallBack };
      this.props.dispatch({ type: 'teamAccount/fetchCoachCreateScope', payload: params });
      this.props.form.setFieldsValue({ platforms: [], suppliers: [], cities: [], districts: [] });
    });
  }

  onSuccessCallBack = () => {
    this.props.onGetChangeList();
  }

  // 添加业务范围取消
  onClickCreateScopeCancel = () => {
    this.props.form.setFieldsValue({ platforms: [], suppliers: [], cities: [], districts: [] });
    this.setState({
      isShowCreateScopeModal: false,
      suppliers: [],
      platforms: [],
      cities: [],
      districts: [],
    });
  }

  // 变更业务承揽确定
  onClickChangeScopeOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (values.id) {
        this.setState({
          isShowChangeScopeModal: false,
          coachName: [],
          managerDetail: {},
        });
        const { id } = this.props;
        const { changeCoachDate } = this.state;
        const { onSuccessCallBack } = this;
        const params = { id, districts: [changeCoachDate.biz_district_id], onSuccessCallBack, nextId: values.id };
        this.props.dispatch({ type: 'teamAccount/fetchCoachUpdateScope', payload: params });
        this.props.dispatch({ type: 'teamAccount/resetCoachName' });
        this.props.form.setFieldsValue({
          id: undefined,
        });
      }
    });
  }

  // 变更业务承揽取消
  onClickChangeScopeCancel = () => {
    this.props.form.resetFields();
    this.setState({
      isShowChangeScopeModal: false,
      coachName: [],
      managerDetail: {},
    });
    this.props.dispatch({ type: 'teamAccount/resetCoachName' });
    this.props.form.setFieldsValue({
      id: undefined,
    });
  }
  onChangeCoach = () => {
    this.setState({
      managerDetail: this.state.coachName[0],
    });
  }

  onChooseCoach = (value) => {
    // 有值才进行查询
    if (value) {
      this.props.dispatch({
        type: 'teamAccount/fetchCoachName',
        payload: {
          name: value,
        },
      });
    }
  }
  // 渲染业务范围
  renderScope = () => {
    const { page } = this.private.searchParams.meta;
    const { teamCoachScopeList: scopeData } = this.props;
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
          return DistrictState.description(text) || '--';
        },
      },
      {
        title: '业主姓名',
        dataIndex: ['owner_info', 'name'],
        key: 'owner_info.name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '业主身份证号',
        dataIndex: ['owner_info', 'intentity_id'],
        key: 'owner_info.intentity_id',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '开始时间',
        dataIndex: 'start_month',
        key: 'start_month',
        render: (text) => {
          return text ? moment(`${text}01`).format('YYYY年MM月DD日') : '--';
        },
      },
      {
        title: '结束时间',
        dataIndex: 'end_month',
        key: 'end_month',
        render: (text) => {
          return text ? moment(`${text}01`).format('YYYY年MM月DD日') : '--';
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 140,
        render: (text, rowData) => {
          return (
            <React.Fragment>
              <span
                className="app-global-compoments-cursor"
                onClick={() => this.onChangeScope(rowData)}
              >变更</span>
              <Popconfirm
                title="是否确认终止?"
                onConfirm={this.onStopScope.bind(this, rowData)}
                okText="确定"
                cancelText="取消"
              >
                <span
                  className="app-global-compoments-cursor"
                >终止</span>
              </Popconfirm>
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
    const titleExt = (<Button type="primary" onClick={this.onCreateScope}>添加业务范围</Button>);
    return (
      <CoreContent
        title={'业务范围'}
        titleExt={titleExt}
      >
        <Table
          rowKey={(record, index) => {
            return index;
          }}
          pagination={pagination}
          dataSource={scopeData.data}
          columns={columns}
          bordered
        />
      </CoreContent>
    );
  }

  // 渲染新增业务范围弹窗
  renderCreateScopeModal = () => {
    const { getFieldDecorator } = this.props.form;
    const { namespace, suppliers, platforms, cities, districts, isShowCreateScopeModal } = this.state;

    const formItems = [
      {
        label: '平台',
        form: getFieldDecorator('platforms', { initialValue: platforms })(
          <CommonSelectPlatforms
            namespace={namespace}
            allowClear
            showSearch
            optionFilterProp="children"
            mode="multiple"
            showArrow
            placeholder="请选择平台"
            onChange={this.onChangePlatforms}
            style={{ width: 260 }}
          />,
        ),
      },
      {
        label: '供应商',
        form: getFieldDecorator('suppliers', { initialValue: suppliers })(
          <CommonSelectSuppliers
            namespace={namespace}
            allowClear showSearch
            platforms={platforms}
            optionFilterProp="children"
            mode="multiple"
            showArrow
            placeholder="请选择供应商"
            isCascade
            onChange={this.onChangeSuppliers}
            style={{ width: 260 }}
          />,
        ),
      },
      {
        label: '城市',
        form: getFieldDecorator('cities', { initialValue: cities })(
          <CommonSelectCities
            namespace={namespace}
            allowClear
            showSearch
            optionFilterProp="children"
            mode="multiple"
            showArrow
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
          initialValue: districts,
        })(
          <CommonSelectDistricts
            namespace={namespace}
            allowClear
            showSearch
            optionFilterProp="children"
            mode="multiple"
            showArrow
            placeholder="请选择商圈"
            platforms={platforms}
            suppliers={suppliers}
            cities={cities}
            onChange={this.onChangeDistrict}
            style={{ width: 260 }}
          />,
        ),
      },
    ];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <Modal
        title="添加业务范围"
        visible={isShowCreateScopeModal}
        onOk={this.onClickCreateScopeOk}
        onCancel={this.onClickCreateScopeCancel}
      >
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </Modal>
    );
  }

  // 渲染变更业务承揽弹窗
  renderChangeScopeModal = () => {
    const { getFieldDecorator } = this.props.form;
    const { isShowChangeScopeModal, managerDetail, changeCoachDate, coachName } = this.state;
    const layoutScope = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    const layoutChangeBefore = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    const layoutChangeAfter = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    let team = '--';
    if (changeCoachDate.coach_info && changeCoachDate.coach_info.coach_team_info) {
      team = changeCoachDate.coach_info.coach_team_info.map((item, index) => { if (item.name) { return <span key={index} className={styles['app-comp-team-teacher-margin-right']}>{item.name}</span>; } });
    }
    const formItemsScope = [
      {
        label: '平台',
        form: dot.get(changeCoachDate, 'biz_district_info.platform_name', '--'),
      },
      {
        label: '供应商',
        form: dot.get(changeCoachDate, 'biz_district_info.supplier_name', '--'),
      },
      {
        label: '城市',
        form: dot.get(changeCoachDate, 'biz_district_info.city_name', '--'),
      },
      {
        label: '商圈',
        form: dot.get(changeCoachDate, 'biz_district_info.name', '--'),
      },
    ];
    const formItemsChangeBefore = [
      {
        label: '私教姓名',
        form: dot.get(changeCoachDate, 'coach_info.name', '--'),
      },
      {
        label: '系统用户',
        form: dot.get(changeCoachDate, 'coach_info.coach_account_info.name', '--'),
        layout: { labelCol: { span: 10 }, wrapperCol: { span: 14 } },
      },
      {
        label: '所属私教团队',
        form: <span>{team}</span>,
      },
    ];
    const formItemsChangeAfter = [
      {
        label: '私教姓名',
        form: getFieldDecorator('id', {
          rules: [{ required: true, message: '请输入私教姓名' }],
        })(
          <Select
            showSearch
            className="app-global-componenth-width300"
            optionFilterProp="children"
            onSearch={this.onChooseCoach}
            onChange={this.onChangeCoach}
          >
            {coachName.map((item) => {
              return (<Option value={item._id} key={item._id}>
                {`${item.name}（${item.coach_account_info.phone}）`}
              </Option>);
            })}
          </Select>,
        ),
        span: 24,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 16 } },
      },
      {
        label: '系统用户',
        form: dot.get(managerDetail, 'name', '--'),
      },
      {
        label: '私教团队',
        form: managerDetail.coach_team_info ? <span>{managerDetail.coach_team_info.map((item, index) => {
          return <span key={index}>{item.name}</span>;
        })}</span> : '--',
      },
    ];
    return (
      <Modal
        title="变更业务范围"
        width="800px"
        visible={isShowChangeScopeModal}
        onOk={this.onClickChangeScopeOk}
        onCancel={this.onClickChangeScopeCancel}
        okText="确定变更"
      >
        <p>业务范围信息</p>
        <DeprecatedCoreForm items={formItemsScope} cols={2} layout={layoutScope} />
        <p>变更前私教</p>
        <DeprecatedCoreForm items={formItemsChangeBefore} cols={3} layout={layoutChangeBefore} />
        <p>变更后私教</p>
        <DeprecatedCoreForm items={formItemsChangeAfter} cols={1} layout={layoutChangeAfter} />
      </Modal>
    );
  }

  render() {
    return (
      <div>

        {/* 业务范围卡片 */}
        {this.renderScope()}

        {/* 新增业务范围弹窗*/}
        {this.renderCreateScopeModal()}

        {/* 变更业务弹窗 */}
        {this.renderChangeScopeModal()}

      </div>
    );
  }
}

const mapStateToProps = ({ teamAccount: { teamCoachScopeList, coachName } }) => {
  return { teamCoachScopeList, coachName };
};

export default connect(mapStateToProps)(ScopeCard);
