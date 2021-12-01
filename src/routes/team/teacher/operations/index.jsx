/**
 * 私教资产隶属管理 - 私教运营管理页面
 */
import dot from 'dot-prop';
import moment from 'moment';
import { Table, Modal, Button, DatePicker, InputNumber, message, Tooltip } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { InfoCircleOutlined } from '@ant-design/icons';

import Search from '../../components/search';
import Operate from '../../../../application/define/operate';
import { CoreContent, DeprecatedCoreForm } from '../../../../components/core';
import { CommonTreeSelectDepartments } from '../../../../components/common/index';
import { DistrictState, Unit } from '../../../../application/define';

import Style from './style.less';

const canOperateTeamTeacherManageOperationsEdit = Operate.canOperateTeamTeacherManageOperationsEdit();          // 修改按钮权限
const canOperateTeamTeacherManageOperationsBatchEdit = Operate.canOperateTeamTeacherManageOperationsBatchEdit();          // 批量修改按钮权限

const { MonthPicker } = DatePicker;
class Operations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowChangeModal: false,           // 默认不显示修改信息弹窗
      changeData: {},                      // 需要修改的数据
      selectedRowKeys: [],                         // 复选框选中的数据
    };
    this.private = {
      searchParams: {
        meta: { page: 1, limit: 30 },
        month: new Date(),
      },
    };
  }

  // 默认加载数据
  componentDidMount() {
    this.props.dispatch({ type: 'modelCoachOperations/fetchCoachOperationsList', payload: this.private.searchParams });
  }

  // 搜索
  onSearch = (params) => {
    //  保存搜索的参数
    if (params) {
      const { page, limit, platforms, suppliers, cities, districts, department, month = new Date(), singleCost, singleIncome } = params;
      this.private.searchParams = {
        meta: {
          page,
          limit,
        },
        platforms,
        suppliers,
        cities,
        districts,
        department,     // 私教部门
        month,          // 归属月份
        singleCost,     // 单成本
        singleIncome,   // 单收入
      };
    }
    this.setState({
      selectedRowKeys: [],      // 重置复选框
    });
    //  调用搜索
    this.props.dispatch({ type: 'modelCoachOperations/fetchCoachOperationsList', payload: this.private.searchParams });
  }

  // 修改分页
  onChangePage = (page, limit) => {
    this.private.searchParams.meta.page = page;
    this.private.searchParams.meta.limit = limit;
    this.onSearch();
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    this.private.searchParams.meta.page = page;
    this.private.searchParams.meta.limit = limit;
    this.onSearch();
  }


  //  修改信息
  onChangeMoney = (rowData) => {
    // 数据回显
    this.props.form.setFieldsValue({
      changeIncome: (rowData.forecast_order_income || rowData.forecast_order_income === 0) ? Unit.exchangePriceToYuan(rowData.forecast_order_income) : undefined,
      changeCost: (rowData.forecast_order_cost || rowData.forecast_order_cost === 0) ? Unit.exchangePriceToYuan(rowData.forecast_order_cost) : undefined,
    });
    this.setState({
      isShowChangeModal: true,
      changeData: rowData,
    });
  }

  // 弹窗确定
  onClickChangeOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { changeIncome, changeCost } = values;
        const { changeData } = this.state;
        // (!单收入无值 && 不能为0) && (!单成本无值 && 不能为0)      判断2个值都没有填写值就直接返回
        if ((!changeIncome && changeIncome !== 0) && (!changeCost && changeCost !== 0)) {
          return false;
        }
        const params = {
          ids: [changeData._id],
          changeIncome,     // 单收入
          changeCost,       // 单成本
          onSuccessCallback: this.onSuccessCallback,  // 成功的回调
        };
        this.props.dispatch({ type: 'modelCoachOperations/updateMoney', payload: params });
      }
    });
  }
  // 成功的回调
  onSuccessCallback = () => {
    message.success('修改成功！');
    // 数据回显
    this.props.form.setFieldsValue({
      changeIncome: undefined,
      changeCost: undefined,
    });
    this.setState({
      isShowChangeModal: false,
      changeData: {},
    });
    this.onSearch();
  }

  // 弹窗取消
  onClickChangeCancel = () => {
    // 弹窗数据清空
    this.props.form.setFieldsValue({
      changeIncome: undefined,
      changeCost: undefined,
    });
    this.setState({
      changeData: {},
      isShowChangeModal: false,
    });
    this.props.form.setFieldsValue({
      changeIncome: undefined,
      changeCost: undefined,
    });
  }

  // 批量操作复选框
  onSelectChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  }

  // 去批量修改页面
  goBatchPage = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length > 30) {
      return message.warning('最多同时操作30个单子');
    }
    if (selectedRowKeys.length <= 0) {
      return message.warning('请勾选需要批量操作的单子');
    }
    const result = JSON.stringify(selectedRowKeys);
    window.location.href = `/#/Team/Teacher/Manage/Operations/Update?selectedRowKeys=${result}`;
  }

  // 不可选时间
  disabledDate = (current) => {
    // 不能选择下个月以后的月份
    return current > moment().month(moment().month() + 1);
  }

  // 字符串超出num个字符，就省略显示，鼠标移上去显示全部
  showMoreStr = (text, num) => {
    if (text.length <= num) {
      return text;
    } else {
      return (<Tooltip placement="right" title={text}>
        {`${text.slice(0, num)}...`}
      </Tooltip>);
    }
  }

  // 渲染搜索
  renderSearch = () => {
    const { onSearch } = this;
    const currentTime = moment(new Date());
    const items = [
      {
        label: '私教部门',
        form: form => (form.getFieldDecorator('department')(
          <CommonTreeSelectDepartments isAuthorized multiple isOnlyShowCoach allowClear namespace="filter-department" placeholder="请选择私教部门" />,
        )),
      },
      {
        label: '归属月份',
        form: form => (form.getFieldDecorator('month', { initialValue: currentTime })(
          <MonthPicker allowClear={false} disabledDate={this.disabledDate} placeholder="请选择月份" className={Style['app-comp-team-teacher-operations-w100']} />,
        )),
      },
    ];
    return (
      <Search onSearch={onSearch} items={items} isExpenseModel />
    );
  }

  // 渲染列表内容
  renderContent = () => {
    const { showMoreStr } = this;
    const { page, limit } = this.private.searchParams.meta;
    const { selectedRowKeys } = this.state;
    const { data = [], _meta = {} } = this.props.coachOperationsList;
    const columns = [
      {
        title: '私教部门',
        dataIndex: 'department_info',
        key: 'department_info.name',
        fixed: 'left',
        width: 100,
        render: text => (text && text.name) || '--',
      },
      {
        title: '私教部门ID',
        dataIndex: '_id',
        key: '_id',
        fixed: 'left',
        width: 150,
        render: text => text || '--',
      },
      {
        title: '业主',
        dataIndex: 'owner_info',
        key: 'owner_info.staff_info.name',
        width: 100,
        render: text => (text && text.staff_info && text.staff_info.name) || '--',
      },
      {
        title: '业主团队ID',
        dataIndex: 'owner_info',
        key: 'owner_info.staff_info._id',
        width: 150,
        render: text => (text && text.staff_info && text.staff_info._id) || '--',
      },
      {
        title: '平台',
        dataIndex: 'platform_name',
        key: 'platform_name',
        render: text => showMoreStr(text || '--', 10),
      },
      {
        title: '供应商',
        dataIndex: 'supplier_info',
        key: 'supplier_info.name',
        render: text => showMoreStr((text && text.name) || '--', 10),
      },
      {
        title: '城市',
        dataIndex: 'city_name',
        key: 'city_name',
        render: text => showMoreStr(text || '--', 10),
      },
      {
        title: '商圈',
        dataIndex: 'biz_district_info',
        key: 'biz_district_info.name',
        render: text => showMoreStr((text && text.name) || '--', 10),
      },
      {
        title: '商圈状态',
        dataIndex: 'biz_district_info',
        key: 'biz_district_info.state',
        width: 100,
        render: text => ((text && text.state) ? DistrictState.description(text.state) : '--'),
      },
      {
        title: '操作日期',
        dataIndex: 'updated_at',
        key: 'updated_at',
        width: 150,
        render: text => (text ? moment(text).format('YYYY年MM月DD日') : '--'),
      },
      {
        title: '归属月份',
        dataIndex: 'month',
        key: 'month',
        width: 150,
        render: text => (text ? moment(`${text}01`).format('YYYY年MM月') : '--'),
      },
      {
        title: '操作人',
        dataIndex: 'operator_info',
        key: 'operator_info.name',
        width: 100,
        render: text => (text && text.name) || '--',
      },
      {
        title: '预估当月单收入(元)',
        dataIndex: 'forecast_order_income',
        key: 'forecast_order_income',
        width: 150,
        render: text => ((text || text === 0) ? Unit.exchangePriceToYuan(text) : '--'),
      },
      {
        title: '预估当月单成本(元)',
        dataIndex: 'forecast_order_cost',
        key: 'forecast_order_cost',
        width: 150,
        render: text => ((text || text === 0) ? Unit.exchangePriceToYuan(text) : '--'),
      },
      {
        title: '操作',
        dataIndex: 'can_update',
        key: 'can_update',
        fixed: 'right',
        width: 100,
        render: (text, rowData) => {
          if (text && canOperateTeamTeacherManageOperationsEdit) {
            return (
              <React.Fragment>
                <span
                  className="app-global-compoments-cursor"
                  onClick={this.onChangeMoney.bind(this, rowData)}
                >修改</span>
              </React.Fragment>
            );
          }
          return null;
        },
      },
    ];

    // 分页
    const pagination = {
      current: page,
      defaultPageSize: 30,                      // 默认数据条数
      pageSize: limit,                          // 每页展示条数
      onChange: this.onChangePage,              // 切换分页
      showQuickJumper: true,                    // 显示快速跳转
      showSizeChanger: true,                    // 显示分页
      onShowSizeChange: this.onShowSizeChange,  // 展示每页数据数
      showTotal: total => `总共${total}条`,      // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(_meta, 'result_count', 0), // 数据总条数
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    // 右侧标题
    const titleExt = (
      <div>
        <InfoCircleOutlined
          className={Style['app-comp-team-teacher-operations-icon']}
        />
        <span
          className={Style['app-comp-team-teacher-operations-title-ext']}
        >
          请于本月填写次月“预估当月单收入、当月单成本”数据
        </span>
        {
          canOperateTeamTeacherManageOperationsBatchEdit
            ?
            (<Button
              onClick={this.goBatchPage}
              type="primary"
              className={Style['app-comp-team-teacher-operations-title-btn']}
            >
              批量修改
            </Button>)
            :
            null
        }
      </div>
    );
    return (
      <CoreContent
        title="列表信息"
        titleExt={titleExt}
      >
        <Table
          rowKey={(record) => {
            return record._id;
          }}
          pagination={pagination}
          dataSource={data}
          columns={columns}
          bordered
          rowSelection={canOperateTeamTeacherManageOperationsBatchEdit ? rowSelection : null}
          scroll={{ x: 2030 }}
        />
      </CoreContent>
    );
  }

  // 渲染变更业务承揽弹窗
  renderChangeModal = () => {
    const { getFieldDecorator } = this.props.form;
    const { isShowChangeModal } = this.state;
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 12 } };
    const formItems = [
      {
        label: '预估当月单收入',
        form: getFieldDecorator('changeIncome')(
          <InputNumber min={0} precision={2} placeholder="请输入单收入" formatter={value => `${value}元`} className={Style['app-comp-team-teacher-operations-w100']} />,
        ),
      },
      {
        label: '预估当月单成本',
        form: getFieldDecorator('changeCost')(
          <InputNumber min={0} precision={2} placeholder="请输入单成本" formatter={value => `${value}元`} className={Style['app-comp-team-teacher-operations-w100']} />,
        ),
      },
    ];
    return (
      <Modal
        title="修改信息"
        visible={isShowChangeModal}
        onOk={this.onClickChangeOk}
        onCancel={this.onClickChangeCancel}
        okText="修改"
      >
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
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

        {/* 修改弹窗 */}
        {this.renderChangeModal()}
      </div>
    );
  }
}
function mapStateToProps({ modelCoachOperations: { coachOperationsList } }) {
  return { coachOperationsList };
}
export default connect(mapStateToProps)(Form.create()(Operations));

