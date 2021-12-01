/**
 * 付款审批 - 关联审批
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import is from 'is_js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Table, Button, message, Row, Col, Input, Tooltip } from 'antd';
import { CoreContent } from '../../../../../components/core';
import { Unit, ExpenseExamineOrderProcessState, OaApplicationOrderType } from '../../../../../application/define';
import styles from './style.less';

class Associated extends Component {
  static propTypes = {
    relationApplicationOrderId: PropTypes.array, // 关联id
    orderId: PropTypes.string, // 审批单id
    examineOrderDetail: PropTypes.object, // 审批详情数据
  };

  static defaultProps = {
    relationApplicationOrderId: [],
    orderId: '',
    examineOrderDetail: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      associatedAccount: [], // 关联账号
      associatedId: undefined, // 关联id
      isAssociate: true,  // 判断是否关联成功如果成可跳转路由
    };
  }

  // 获取关联账号信息
  onChangeAssociated = (val) => {
    const associatedVal = val.target.value.trim();
    this.setState({
      associatedId: associatedVal,
    });
  }

  // 删除关联审批单
  onDeleteAssociatedOrder = (value) => {
    // 审批单id
    const { orderId } = this.props;
    const { dispatch } = this.props;

    // 重置关联审批单id
    this.setState({
      associatedId: undefined,
      associatedAccount: [],
    });

    dispatch({
      type: 'expenseExamineOrder/deleteAssociatedAccount',
      payload: {
        associatedId: orderId,
        id: value, // 关联账号id
        onSuccessCallback: () => { return this.onSuccessDeleteAssociatedCallback(value); },
        onFailureCallback: (res) => { return message.error(res.zh_message); },
      },
    });
  }

  // 删除关联审批单成功的回调
  onSuccessDeleteAssociatedCallback = (value) => {
    const { orderId, relationApplicationOrderId } = this.props;
    const associatedIds = [];
    // 删除成功,需要过滤审批单id
    relationApplicationOrderId.map((item) => {
      if (item !== value) {
        associatedIds.push(item);
        return associatedIds;
      }
    });
    this.props.dispatch({ type: 'expenseExamineOrder/fetchExamineOrderDetail', payload: { id: orderId } });
    const params = {
      limit: 9999,
      associatedId: associatedIds,
      state: [ExpenseExamineOrderProcessState.close, ExpenseExamineOrderProcessState.pendding, ExpenseExamineOrderProcessState.processing, ExpenseExamineOrderProcessState.finish],
    };
    this.props.dispatch({ type: 'expenseExamineOrder/fetchExamineOrders', payload: params });
  }

  // 关联账号成功的回调函数
  onSuccessAssociatedCallback = () => {
    const { relationApplicationOrderId } = this.props;
    if (is.not.empty(relationApplicationOrderId) && is.existy(relationApplicationOrderId)) {
      const params = {
        limit: 9999,
        associatedId: relationApplicationOrderId,
        state: [ExpenseExamineOrderProcessState.close, ExpenseExamineOrderProcessState.pendding, ExpenseExamineOrderProcessState.processing, ExpenseExamineOrderProcessState.finish],
      };
      this.props.dispatch({ type: 'expenseExamineOrder/fetchExamineOrders', payload: params });
    }
    const { orderId } = this.props;
    this.props.dispatch({ type: 'expenseExamineOrder/fetchExamineOrderDetail', payload: { id: orderId } });
    message.success('关联成功');
    this.setState({
      isAssociate: true,
    });
  }

  // 关联账号成功的回调函数
  onFailureAssociatedCallback = (res) => {
    const { associatedAccount } = this.state;
    // 当关联失败的时候,添加最后一位的值删除
    const associatedIds = associatedAccount;
    associatedIds.pop();

    message.error(res.zh_message);
    this.setState({
      isAssociate: false,
      associatedAccount: associatedIds,
    });
  }

  // 提交关联账号信息
  onSubmitAssociated = () => {
    const { associatedId } = this.state;
    const { orderId, relationApplicationOrderId } = this.props;
    if (associatedId) {
      // 获取已经存在的审批id与新增新的审批id
      const associatedIds = relationApplicationOrderId;
      associatedIds.push(associatedId);
      this.setState({
        associatedAccount: associatedIds,
      });
      const params = {
        associatedId, // 关联账号id
        orderId, // 审批单id
      };
      this.props.dispatch({
        type: 'expenseExamineOrder/updateAssociatedAccount',
        payload: {
          params,
          onSuccessCallback: this.onSuccessAssociatedCallback,
          onFailureCallback: this.onFailureAssociatedCallback,
        },
      });
    }
  }
  // 渲染关联列表
  renderAssociatedList = () => {
    const { examineOrderDetail = {}, isNewMoneyRule } = this.props;
    const dataSource = dot.get(examineOrderDetail, 'relationApplicationOrderListItem', []);
    // 费用单关联title
    const columns = [{
      title: '审批单号',
      dataIndex: '_id',
      fixed: 'left',
      width: 100,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '主题标签',
      dataIndex: 'theme_label_list',
      render: (text) => {
        // 如果标签长度大于3，只显示3条，其余用...显示
        if (is.not.empty(text) && text.length > 3) {
          return (
            <Tooltip title={text.map(item => item).join(' 、 ')}>
              <div className={styles['app-comp-expense-associated-tag']}>
                {dot.get(text, '0')}、{dot.get(text, '1')}、{dot.get(text, '2')}...
              </div>
            </Tooltip>
          );
        }
        // 如果标签长度小于等于3，咋全部渲染
        if (is.not.empty(text) && text.length <= 3) {
          return (
            <div>
              {text.map(item => item).join('、')}
            </div>
          );
        }
        return '--';
      },
    }, {
      title: '平台',
      dataIndex: 'platform_names',
      width: 60,
      render: (text) => {
        // 判断数据是否存在
        if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
          return '--';
        }
        return text.map(item => item).join(' , ');
      },
    }, {
      title: '供应商',
      dataIndex: 'supplier_names',
      width: 170,
      render: (text) => {
        // 判断数据是否存在
        if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
          return '--';
        }
        // 只有一行数据数据则直接返回
        if (text.length === 1) {
          return dot.get(text, '0');
        }
        // 默认使用弹窗显示数据
        return (
          <Tooltip title={text.map(item => item).join(' , ')}>
            <span>{dot.get(text, '0')} 等{text.length}条</span>
          </Tooltip>
        );
      },
    }, {
      title: '城市',
      dataIndex: 'city_names',
      width: 70,
      render: (text) => {
        // 判断数据是否存在
        if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
          return '--';
        }
        // 只有一行数据数据则直接返回
        if (text.length === 1) {
          return dot.get(text, '0');
        }
        // 默认使用弹窗显示数据
        return (
          <Tooltip title={text.map(item => item).join(' , ')}>
            <span>{dot.get(text, '0')} 等{text.length}条</span>
          </Tooltip>
        );
      },
    }, {
      title: '商圈',
      dataIndex: 'biz_district_names',
      width: 158,
      render: (text) => {
        // 判断数据是否存在
        if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
          return '--';
        }
        // 只有一行数据数据则直接返回
        if (text.length === 1) {
          return dot.get(text, '0');
        }
        // 默认使用弹窗显示数据
        return (
          <Tooltip title={text.map(item => item).join(' , ')}>
            <span>{dot.get(text, '0')} 等{text.length}条</span>
          </Tooltip>
        );
      },
    }, {
      title: isNewMoneyRule ? '付款金额(元)' : '总金额（元）',
      dataIndex: 'total_money',
      width: 100,
      render: (text) => {
        if (text) {
          return Unit.exchangePriceCentToMathFormat(text);
        }
        return '--';
      },
    }, {
      title: '提报时间',
      dataIndex: 'submit_at',
      width: 120,
      render: (text) => {
        if (text) {
          return moment(text).format('YYYY-MM-DD HH:mm:ss');
        }
        return '--';
      },
    }, {
      title: '付款时间',
      dataIndex: 'paid_at',
      width: 120,
      render: (text) => {
        if (text) {
          return moment(text).format('YYYY-MM-DD HH:mm:ss');
        }
        return '--';
      },
    }, {
      title: '审批类型',
      dataIndex: 'application_order_type',
      width: 100,
      render: (text) => {
        if (text) {
          return OaApplicationOrderType.description(text);
        }
        return '--';
      },
    }, {
      title: '流程状态',
      dataIndex: 'state',
      width: 100,
      render: text => ExpenseExamineOrderProcessState.description(text) || '--',
    }, {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 100,
      render: (text, record) => {
        if (ExpenseExamineOrderProcessState.pendding === record.state) {
          return '--';
        }
        return (<a key="delete" target="_blank" rel="noopener noreferrer" href={`/#/Expense/Manage/ExamineOrder/Detail?orderId=${record._id}`}>查看</a>);
      },
    }];
    return <Table rowKey={record => record._id} scroll={{ x: 1300 }} dataSource={dataSource} columns={columns} pagination={false} bordered />;
  }

  // 渲染关联信息
  renderAssociatedInfo = () => {
    let associatedIds;
    const { associatedAccount, isAssociate, associatedId } = this.state;
    const { relationApplicationOrderId } = this.props;
    if (is.not.empty(associatedAccount) && is.existy(associatedAccount)) {
      associatedIds = associatedAccount;
    } else {
      associatedIds = relationApplicationOrderId;
    }
    const content = [];
    if (isAssociate) {
      content.push(
        <span className={styles['app-comp-expense-associated-info-wrap']} key="success">
          {
            associatedIds.map((item, index) => {
              return (
                <span key={index}>
                  <a
                    key="delete"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles['app-comp-expense-associated-info-link']}
                    href={`/#/Expense/Manage/ExamineOrder/Detail?orderId=${item}`}
                  >
                    {item}
                  </a>
                  {
                    is.not.empty(associatedIds) && is.existy(associatedIds)
                      ? <CloseCircleOutlined
                        className={styles['app-comp-expense-associated-info-icon']}
                        onClick={() => this.onDeleteAssociatedOrder(item)}
                      />
                      : null
                  }
                </span>
              );
            })
          }
        </span>,
      );
    } else {
      content.push(
        <span className={styles['app-comp-expense-associated-info-wrap']} key="error">
          {
            associatedIds.map((item, index) => {
              return (
                <span key={index}>
                  <a herf="#">
                    {item}
                  </a>
                  {
                    is.not.empty(associatedIds) && is.existy(associatedIds)
                      ? <CloseCircleOutlined
                        className={styles['app-comp-expense-associated-info-icon']}
                        onClick={() => this.onDeleteAssociatedOrder(item)}
                      />
                      : null
                  }
                </span>
              );
            })
          }
        </span>,
      );
    }
    return (
      <CoreContent key="associated" title="关联信息">
        <Row type="flex" align="middle">
          <Col span={24}>
            <Row>
              <Col span={2} className={styles['app-comp-expense-associated-info-input-label']}>
                <span className={styles['app-comp-expense-associated-info-wrap']}>关联审批单:</span>
              </Col>
              <Col span={6} className={styles['app-comp-expense-associated-info-input']}>
                <Input placeholder="请输入关联审批单号" value={associatedId} onChange={this.onChangeAssociated} />
              </Col>
              <Col span={2} className={styles['app-comp-expense-associated-info-btn']}>
                <Button type="primary" onClick={this.onSubmitAssociated}>确定</Button>
              </Col>
              <Col span={10} className={styles['app-comp-expense-associated-info-content']}>
                <span>{content}</span>
              </Col>
            </Row>
          </Col>
          <Col span={24} className={styles['app-comp-expense-associated-info-table-wrap']}>
            <Row>
              <Col span={2} className={styles['app-comp-expense-associated-info-list-table']}>关联审批单列表:</Col>
              <Col span={21} className={styles['app-comp-expense-associated-info-list']}>
                {/* 渲染关联列表 */}
                {this.renderAssociatedList()}
              </Col>
            </Row>
          </Col>
        </Row>
      </CoreContent>
    );
  }
  render() {
    return (
      <div>
        {/* 关联审批单信息 */}
        {this.renderAssociatedInfo()}
      </div>
    );
  }
}

function mapStateToProps({ expenseExamineOrder: { examineOrdersData } }) {
  return { examineOrdersData };
}
export default connect(mapStateToProps)(Associated);
