/**
 * 记录明细 - 操作页 /Expense/Manage/Records
 * 未使用
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, Button, Table, Popconfirm, message } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import { ExpenseHouseState, Unit } from '../../../../../application/define';
import style from './style.css';

const { Option } = Select;

class SummaryFormRent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recordId: dot.get(props, 'location.query.recordId'),    // 汇总记录id
      houseState: dot.get(props, 'location.query.houseState'),  // 房屋状态(续签，退租，续租，断租)
      examineId: undefined,                                     // 审批流id, (当前页面选择的参数)
      detail: dot.get(props, 'approval.summaryRecordDetail'),   // 汇总记录，详情数据
      dataSource: dot.get(props, 'approval.summaryRecordData'),     // 汇总记录，列表数据
      examineList: dot.get(props, 'approval.examineSimpleNameList', []) || [], // 审批流数据列表
    };
    this.private = {
      dispatch: props.dispatch,
    };
  }

  componentDidMount = () => {
    // 判断是否是审批页 isbatch不是审批就不调接口
    if (this.props.location.query.isBatch) {
      return;
    }
    // 获取汇总审批单的详情
    this.props.dispatch({ type: 'approval/fetchSummaryRecordDetail', payload: { id: this.state.recordId } });

    this.props.dispatch({
      type: 'approval/fetchSummaryRecordData',
      payload: {
        examineflowId: this.state.recordId, limit: 30, page: 1,
      },
    });
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(props) {
    // 更新状态
    this.setState({
      detail: dot.get(props, 'approval.summaryRecordDetail'), // 汇总记录，详情数据
      dataSource: dot.get(props, 'approval.summaryRecordData'),   // 汇总记录，列表数据
      examineList: dot.get(props, 'approval.examineSimpleNameList', []) || [], // 审批流数据列表
    });
  }

  // 提交服务器
  onSubmit = () => {
    // 检测提交前是否选择了审批流，如果没选就提示
    const { examineId } = this.state;
    if (examineId === undefined) {
      message.error('请选择审批流');
      return;
    }

    // 提交服务器的参数
    const params = {
      examineId: dot.get(this.props, 'location.query.recordId'),    // 汇总记录id
      examineflowId: examineId,    // 审批流id
    };

    // 提交审批
    this.props.dispatch({
      type: 'approval/submitTypeApplyGroupE',
      payload: params,
    });
  }

  // 设置审批流id
  onChangeExamine = (e) => {
    this.setState({
      examineId: e,
    });
  }

  // 删除列表中的数据
  onClickDelete = (e) => {
    // 删除记录
    this.props.dispatch({
      type: 'approval/typeApplyDeleteE',
      payload: {
        examineId: this.state.recordId,   // 汇总单id
        orderId: e,    // 单条id
        state: -1,    // 枚举值 -1删除 0-停用 1-启用
        onSuccessCallback: this.onSuccessCallback, // 删除成功回调
      },
    });
  }

  // 删除成功回调
  onSuccessCallback = (resultCount) => {
    // 没有数据时，跳转到付款审批页面
    if (resultCount - 1 === 0) {
      window.location.href = '/#/Expense/Manage/Records';
    }
  }

  // 修改分页
  onChangePage = (page) => {
    const { recordId } = this.state;
    // 分页获取列表数据
    this.private.dispatch({ type: 'fetchSummaryRecordData', payload: { examineflowId: recordId, limit: 30, page } });
  }

  // 渲染基本信息
  renderBaseInfo = () => {
    const { detail, examineList } = this.state;

    const formItems = [
      {
        label: '申请人',
        form: dot.get(detail, 'account_name', '--'),
      }, {
        label: '总金额',
        form: Unit.exchangePriceToMathFormat(dot.get(detail, 'total_money', '--')),
      }, {
        label: '费用分组',
        form: dot.get(detail, 'costclass_name', '--'),
      }, {
        label: '审批流程',
        form: (
          <Select placeholder="请选择审批流程" onChange={this.onChangeExamine}>
            {
              examineList.map((item, index) => {
                return <Option key={index} value={item._id}>{item.name}</Option>;
              })
            }
          </Select>
        ),
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent>
        <Form layout="horizontal">
          <DeprecatedCoreForm items={formItems} cols={4} layout={layout} />
        </Form>
      </CoreContent>
    );
  }

  // 渲染列表数据
  renderListInfo = () => {
    const { dataSource, houseState } = this.state;
    const columns = [{
      title: '单笔流水号',
      dataIndex: '_id',
      key: '_id',
    }, {
      title: '供应商',
      dataIndex: 'supplier_name_list',
      key: 'supplier_name_list',
      render: (text = []) => {
        let data = '';
        text.forEach((item) => {
          data += ` ${item}`;
        });
        return data === '' ? '--' : data;
      },
    }, {
      title: '平台',
      dataIndex: 'platform_name_list',
      key: 'platform_name_list',
      render: (text = []) => {
        let data = '';
        text.forEach((item) => {
          data += ` ${item}`;
        });
        return data === '' ? '--' : data;
      },
    }, {
      title: '城市',
      dataIndex: 'city_name_list',
      key: 'city_name_list',
      render: (text = []) => {
        let data = '';
        text.forEach((item) => {
          data += ` ${item}`;
        });
        return data === '' ? '--' : data;
      },
    }, {
      title: '商圈',
      dataIndex: 'district_name_list',
      key: 'district_name_list',
      render: (text = []) => {
        let data = '';
        text.forEach((item) => {
          data += ` ${item}`;
        });
        return data === '' ? '--' : data;
      },
    }, {
      title: '科目',
      dataIndex: 'catalog_name',
      key: 'catalog_name',
    }, {
      title: '房屋状态',
      dataIndex: 'thing_state',
      key: 'thing_state',
      render: text => ExpenseHouseState.description(text),
    }, {
      title: '金额（元）',
      dataIndex: 'total_money',
      key: 'total_money',
      render: (text) => {
        return Unit.exchangePriceToMathFormat(text);
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => {
        // 当前数据id
        const recordId = record._id;
        return (
          <div>
            <a href={`/#/Expense/Manage/Records/Form?recordId=${recordId}&houseState=${houseState}`} className={style['app-comp-expense-records-summary-form-rent']}>编辑</a>
            <Popconfirm title="确定执行操作？" onConfirm={() => { this.onClickDelete(recordId); }} okText="确定" cancelText="取消">
              <a className={style['app-comp-expense-records-summary-form-rent']}>删除</a>
            </Popconfirm>
          </div>
        );
      },
    }];

    // 分页
    const pagination = {
      defaultPageSize: 30,          // 默认数据条数
      onChange: this.onChangePage,  // 切换分页
      total: dot.get(dataSource, '_meta.result_count', 0), // 数据总条数
      showTotal: total => `总共${total}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,        // 每页数据显示条数
    };

    return (
      <CoreContent title="流水单数据">
        <Table rowKey={record => record._id} dataSource={dataSource.data} columns={columns} pagination={pagination} bordered />
      </CoreContent>
    );
  }

  render = () => {
    return (
      <div>
        {/* 渲染基本信息 */}
        {this.renderBaseInfo()}

        {/* 渲染列表数据 */}
        {this.renderListInfo()}

        {/* 表单提交按钮 */}
        <CoreContent style={{ textAlign: 'center', backgroundColor: '#ffffff' }} >
          <Button type="primary" onClick={this.onSubmit}>提交</Button>
        </CoreContent>
      </div>
    );
  }
}

function mapStateToProps({ approval }) {
  return { approval };
}
export default connect(mapStateToProps)(SummaryFormRent);
