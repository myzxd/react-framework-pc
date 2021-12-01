/**
 * 私教管理 - 私教业务记录
 */
import dot from 'dot-prop';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Table, Modal, Select } from 'antd';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import Search from '../../components/search';
import { CoreContent, DeprecatedCoreForm } from '../../../../components/core';
import { DistrictState } from '../../../../application/define';

const { Option } = Select;
class CoachLog extends Component {
  static propTypes = {
    businessList: PropTypes.array,
    // eslint-disable-next-line react/no-unused-prop-types
    coachName: PropTypes.array,
  }

  static defaultProps = {
    businessList: [],
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
      isShowChangeScopeModal: false,    // 是否显示变更业务承揽弹窗
      managerDetail: {},             //  需要变更的业主信息
      coachData: {},                //  保留的弹窗信息
      coachName: [],
    };
    this.private = {
      searchParams: {
        meta: { page: 1, limit: 30 },
      },
    };
  }

  // 默认加载数据
  componentDidMount() {
    this.props.dispatch({ type: 'teamAccount/fetchCoachBusinessList', payload: this.private.searchParams });
  }

  // 搜索
  onSearch = (params) => {
    //  保存搜索的参数
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
    this.props.dispatch({ type: 'teamAccount/fetchCoachBusinessList', payload: this.private.searchParams });
  }

  // 修改分页
  onChangePage = (page, limit) => {
    this.private.searchParams.meta.page = page;
    this.private.searchParams.meta.limit = limit;
    this.onSearch(this.private.searchParams.meta);
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    this.private.searchParams.meta.page = page;
    this.private.searchParams.meta.limit = limit;
    this.onSearch(this.private.searchParams.meta);
  }


  //  变更业务承揽
  onChangeScope = (rowData) => {
    this.setState({
      isShowChangeScopeModal: true,
      coachData: rowData,
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

  // 变更业务承揽确定
  onClickChangeScopeOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.setState({
        isShowChangeScopeModal: false,
        coachName: [],
        managerDetail: {},
      });
      const { coachData } = this.state;
      const params = { id: coachData.coach_id, districts: [coachData.biz_district_id], onSuccessCallBack: this.onSearch, nextId: values.id };
      this.props.dispatch({ type: 'teamAccount/fetchCoachUpdateScope', payload: params });
    });
    this.props.dispatch({ type: 'teamAccount/resetCoachName' });
    this.props.form.setFieldsValue({
      id: undefined,
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

  // 渲染搜索
  renderSearch = () => {
    const { onSearch } = this;
    return (
      <Search onSearch={onSearch} />
    );
  }

  // 渲染列表内容
  renderContent = () => {
    const { page } = this.private.searchParams.meta;
    const { businessList: procurementData } = this.props;
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
        title: '私教姓名',
        dataIndex: ['coach_info', 'name'],
        key: 'coach_info.name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '系统用户',
        dataIndex: ['coach_info', 'coach_account_info', 'phone'],
        key: 'coach_info.coach_account_info.phone',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '私教团队',
        dataIndex: ['coach_info', 'coach_team_info'],
        key: 'coach_info.coach_team_info',
        render: (text) => {
          return text ? (<span>{text.map((item, index) => {
            return <span key={index}>{item.name}</span>;
          })}</span>) : '--';
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
              >变更业务范围</span>
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
      total: dot.get(procurementData, '_meta.result_count', 0), // 数据总条数
    };
    return (
      <CoreContent >
        <Table
          rowKey={(record, index) => {
            return index;
          }}
          pagination={pagination}
          dataSource={procurementData}
          columns={columns}
          bordered
        />
      </CoreContent>
    );
  }

  // 渲染变更业务承揽弹窗
  renderChangeScopeModal = () => {
    const { getFieldDecorator } = this.props.form;
    const { isShowChangeScopeModal, managerDetail, coachData, coachName } = this.state;
    const layoutScope = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    const layoutChangeBefore = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    const layoutChangeAfter = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    if (!coachData.biz_district_info) {
      return null;
    }
    const formItemsScope = [
      {
        label: '平台',
        form: coachData.biz_district_info.platform_name || '--',
      },
      {
        label: '供应商',
        form: coachData.biz_district_info.supplier_name || '--',
      },
      {
        label: '城市',
        form: coachData.biz_district_info.city_name || '--',
      },
      {
        label: '商圈',
        form: coachData.biz_district_info.name || '--',
      },
    ];
    const formItemsChangeBefore = [
      {
        label: '私教姓名',
        form: coachData.coach_info.name || '--',
      },
      {
        label: '系统用户',
        form: coachData.coach_info.coach_account_info.phone || '--',
        layout: { labelCol: { span: 10 }, wrapperCol: { span: 14 } },
      },
      {
        label: '所属私教团队',
        form: coachData.coach_info.coach_team_info ? <span>{coachData.coach_info.coach_team_info.map((item, index) => {
          return <span key={index}>{item.name}</span>;
        })}</span> : '--',
      },
    ];
    const formItemsChangeAfter = [
      {
        label: '姓名',
        form: getFieldDecorator('id', {
          rules: [{ required: true, message: '请输入姓名' }],
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
        {/* 渲染搜索 */}
        {this.renderSearch()}

        {/* 渲染列表内容 */}
        {this.renderContent()}

        {/* 变更业务承揽弹窗 */}
        {this.renderChangeScopeModal()}
      </div>
    );
  }
}
function mapStateToProps({ teamAccount: { businessList, coachName } }) {
  return { businessList, coachName };
}
export default connect(mapStateToProps)(Form.create()(CoachLog));

