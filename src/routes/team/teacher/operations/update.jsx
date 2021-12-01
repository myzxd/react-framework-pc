/**
 * 私教运营管理 - 编辑页
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { Link } from 'dva/router';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Row, Button, InputNumber, Modal, Tooltip } from 'antd';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import Style from './style.less';
import Operate from '../../../../application/define/operate';
import { Unit, DistrictState } from '../../../../application/define';
import { CoreContent, DeprecatedCoreForm } from '../../../../components/core';

const canOperateTeamTeacherManageOperationsBatchEdit = Operate.canOperateTeamTeacherManageOperationsBatchEdit();          // 批量修改按钮权限

class Update extends Component {
  constructor(props) {
    super(props);
    this.private = {
      meta: {
        page: 1,
        limit: 30,
      },
      selectedArray: JSON.parse(this.props.location.query.selectedRowKeys),         // 需要被操作的ids
    };
  }

  // 请求可以批量操作的列表数据
  componentDidMount() {
    const { meta, selectedArray } = this.private;
    const params = {
      meta,
      ids: selectedArray,
    };
    this.props.dispatch({ type: 'modelCoachOperations/fetchCoachOperationsUpdateList', payload: params });
  }

  // 批量操作
  onSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { changeIncome, changeCost } = values;
        // (!单收入无值 && 不能为0) && (!单成本无值 && 不能为0)      判断2个值都没有填写值就直接返回
        if ((!changeIncome && changeIncome !== 0) && (!changeCost && changeCost !== 0)) {
          return false;
        }
        const { selectedArray } = this.private;
        const params = {
          ids: selectedArray,
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
    Modal.success({
      content: '批量操作成功',
    });
    const { meta, selectedArray } = this.private;
    const params = {
      meta,
      ids: selectedArray,
    };
    this.props.dispatch({ type: 'modelCoachOperations/fetchCoachOperationsUpdateList', payload: params });
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

  // 渲染需要编辑的金额
  renderChangeMoney= () => {
    const { getFieldDecorator } = this.props.form;
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
    if (canOperateTeamTeacherManageOperationsBatchEdit) {
      formItems.push(
        {
          form: <Button onClick={this.onSubmit} type="primary">批量操作</Button>,
        },
      );
    }
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <CoreContent>
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 列表信息
  renderListInfo = () => {
    const { showMoreStr } = this;
    const { coachOperationsUpdateList } = this.props;
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
        width: 180,
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
        title: '业主ID',
        dataIndex: 'owner_info',
        key: 'owner_info.staff_info._id',
        width: 180,
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
        render: (text) => { return (text && text.state) ? DistrictState.description(text.state) : '--'; },
      },
      {
        title: '操作日期',
        dataIndex: 'updated_at',
        key: 'updated_at',
        width: 120,
        render: (text) => { return text ? moment(text).format('YYYY年MM月DD日') : '--'; },
      },
      {
        title: '归属月份',
        dataIndex: 'month',
        key: 'month',
        width: 120,
        render: (text) => { return text ? moment(`${text}01`).format('YYYY年MM月') : '--'; },
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
        width: 140,
        render: (text) => { return (text || text === 0) ? Unit.exchangePriceToYuan(text) : '--'; },
      },
      {
        title: '预估当月单成本(元)',
        dataIndex: 'forecast_order_cost',
        key: 'forecast_order_cost',
        width: 140,
        render: (text) => { return (text || text === 0) ? Unit.exchangePriceToYuan(text) : '--'; },
      },
    ];

    return (
      <div>
        <CoreContent
          title="列表信息"
        >
          <Table
            columns={columns}
            dataSource={dot.get(coachOperationsUpdateList, 'data', [])}
            bordered
            rowKey={(record, index) => { return index; }}
            pagination={false}
            scroll={{ x: 1600 }}
          />
        </CoreContent>
        <Row justify={'center'} type="flex" className="app-global-mgt16">
          <Button><Link to="/Team/Teacher/Manage/Operations">返回</Link></Button>
        </Row>
      </div>
    );
  }
  // 渲染
  render() {
    const { renderChangeMoney, renderListInfo } = this;
    return (
      <div>
        {/* 渲染需要编辑的金额 */}
        {renderChangeMoney()}

        {/* 渲染列表信息 */}
        {renderListInfo()}
      </div>
    );
  }
}

function mapStateToProps({ modelCoachOperations: { coachOperationsUpdateList } }) {
  return { coachOperationsUpdateList };
}
export default Form.create()(connect(mapStateToProps)(Update));
