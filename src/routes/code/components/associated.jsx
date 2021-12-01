/**
 * 付款审批 - 关联审批
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Table, Button, message, Row, Col, Input, Tooltip, Collapse } from 'antd';
import {
  Unit,
  ExpenseExamineOrderProcessState,
  CodeCostCenterType,
  CodeOrderType,
  OaApplicationOrderType,
} from '../../../application/define';
import styles from './style.less';
import { PagesHelper } from '../../oa/document/define';
import Operate from '../../../application/define/operate';

const { Panel } = Collapse;

class Associated extends Component {
  static propTypes = {
    orderId: PropTypes.string, // 审批单id
  };

  static defaultProps = {
    orderId: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      associatedId: undefined, // 关联id
    };
  }

  componentDidMount() {
    this.onInterfaceDetail();
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'codeOrder/reduceRelationOrderList',
      payload: {},
    });
  }

  onInterfaceDetail = () => {
    const { orderId } = this.props;
    this.props.dispatch({
      type: 'codeOrder/getRelationOrderList',
      payload: {
        orderId, // 关联单id列表
      },
    });
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
    // 判断费用单是否保存了
    if (this.props.getIsShowSave) {
      if (this.props.getIsShowSave()) {
        return message.error('请将当前费用单数据保存后再进行操作');
      }
    }

    dispatch({
      type: 'codeOrder/deleteAssociatedAccount',
      payload: {
        associatedId: orderId, // 审批单id
        id: value, // 关联账号id
        onSuccessCallback: this.onSuccessDeleteAssociatedCallback,
      },
    });
  }

  // 删除关联审批单成功的回调
  onSuccessDeleteAssociatedCallback = () => {
    this.onInterfaceDetail();
  }

  // 关联账号成功的回调函数
  onSuccessAssociatedCallback = () => {
    message.success('关联成功');
    // 调用详情接口
    if (this.onInterfaceDetail) {
      this.onInterfaceDetail();
    }
  }

  // 提交关联账号信息
  onSubmitAssociated = () => {
    const { associatedId } = this.state;
    const { orderId } = this.props;
    if (associatedId) {
      const params = {
        associatedId, // 关联账号id
        orderId, // 审批单id
      };
      this.props.dispatch({
        type: 'codeOrder/updateAssociatedAccount',
        payload: {
          params,
          onSuccessCallback: this.onSuccessAssociatedCallback,
        },
      });
    }
  }

  // 渲染标签
  renderTags = (tagsList, type) => {
    // 标签数据大于三个
    if (Array.isArray(tagsList) && tagsList.length > 3) {
      const title = type === 'inspect' ?
        tagsList.map(t => t.name).join(' 、 ')
        : tagsList.map(t => t).join(' 、 ');
      return (
        <Tooltip title={title}>
          <div>
            {
              type === 'inspect' ?
                tagsList.slice(0, 3).map(t => t.name).join(' 、 ')
                : tagsList.slice(0, 3).map(t => t).join(' 、 ')
            }...</div>
        </Tooltip>
      );
    }

    // 标签数据小于三个
    if (Array.isArray(tagsList) && tagsList.length <= 3 && tagsList.length > 0) {
      return (
        <div>
          {
            type === 'inspect' ?
              tagsList.map(t => t.name).join('、')
              : tagsList.map(t => t).join('、')
          }
        </div>
      );
    }

    return '--';
  }


  // 渲染关联列表
  renderAssociatedList = () => {
    const { relationOrderList = {} } = this.props;
    const dataSource = dot.get(relationOrderList, 'data', []);
    // 费用单关联title
    const columns = [
      {
        title: '审批单标题',
        dataIndex: 'name',
        fixed: 'left',
        width: 150,
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '审批单号',
        dataIndex: '_id',
        fixed: 'left',
        width: 120,
        render: (text) => {
          return text || '--';
        },
      }, {
        title: '主题标签',
        width: 150,
        dataIndex: 'theme_label_list',
        render: text => this.renderTags(text),
      }, {
        title: '验票标签',
        dataIndex: 'inspect_bill_label_list',
        width: 150,
        render: text => this.renderTags(text, 'inspect'),
      }, {
        title: '归属',
        width: 120,
        dataIndex: 'cost_center_type',
        render: (text, record) => {
          // code审批单
          if (record.order_type === CodeOrderType.new) {
            return text ? CodeCostCenterType.description(text) : '--';
          }
          // 费用单
          if (record.order_type === CodeOrderType.old) {
            // 判断大于100的是事务类的审批单
            if (text >= 100) {
              return PagesHelper.titleByKey(text);
            }
            return text ? OaApplicationOrderType.description(text) : '--';
          }
          return '--';
        },
      },
      {
        title: '发票抬头',
        dataIndex: 'invoice_title',
        width: 150,
        render: text => text || '--',
      },
      {
        title: '付款金额',
        dataIndex: 'paid_money',
        width: 120,
        render: text => (text ? Unit.exchangePriceCentToMathFormat(text) : '0.00'),
      },
      {
        title: '申请人',
        dataIndex: ['apply_account_info', 'name'],
        width: 120,
        render: text => (text || '--'),
      },
      {
        title: '提报时间',
        dataIndex: 'submit_at',
        width: 150,
        render: (text) => {
          if (text) {
            return moment(text).format('YYYY-MM-DD HH:mm:ss');
          }
          return '--';
        },
      },
      {
        title: '付款时间',
        dataIndex: 'paid_at',
        width: 150,
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
      },
      {
        title: '流程状态',
        dataIndex: 'state',
        width: 120,
        render: text => ExpenseExamineOrderProcessState.description(text) || '--',
      }, {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 80,
        render: (text, record) => {
          if (ExpenseExamineOrderProcessState.pendding === record.state
            || !Operate.canOperateModuleCodeOrderDetail()
          ) {
            return '--';
          }
          // code审批单
          if (record.order_type === CodeOrderType.new) {
            return (<a
              key="delete"
              target="_blank"
              rel="noopener noreferrer"
              href={`/#/Code/PayOrder/Detail?orderId=${record._id}&isShowOperation=true`}
            >
              查看</a>);
          }
          // 费用审批单
          if (record.order_type === CodeOrderType.old) {
            return (
              <a
                key="detail"
                href={`javascript:void(window.open('/#/Expense/Manage/ExamineOrder/Detail?orderId=${record._id}'));`}
                rel="noopener noreferrer"
                className={styles['app-comp-expense-exam-order-Table-operate-btn']}
              >查看
            </a>
            );
          }
          return '--';
        },
      }];
    return (<Table
      rowKey={record => record._id}
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      bordered
      scroll={{ x: 1580 }}
    />);
  }

  // 渲染关联信息
  renderAssociatedInfo = () => {
    const { associatedId } = this.state;
    const { relationOrderList } = this.props;
    const dataSource = dot.get(relationOrderList, 'data', []);
    const ids = dataSource.map(v => v._id);
    // 关联单号
    const content = (
      <span className={styles['app-comp-expense-associated-info-wrap']} key="success">
        {
          ids.map((item, index) => {
            return (
              <span key={index}>
                <a
                  key="delete"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['app-comp-expense-associated-info-link']}
                  href={`/#/Code/PayOrder/Detail?orderId=${item}&isShowOperation=true`}
                >
                  {item}
                </a>
                <CloseCircleOutlined
                  className={styles['app-comp-expense-associated-info-icon']}
                  onClick={() => this.onDeleteAssociatedOrder(item)}
                />
              </span>
            );
          })
        }
      </span>
    );
    return (
      <React.Fragment>
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
              <Col span={12} className={styles['app-comp-expense-associated-info-content']}>
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
      </React.Fragment>
    );
  }
  render() {
    return (
      <Collapse>
        <Panel header="关联信息">
          {/* 关联审批单信息 */}
          {this.renderAssociatedInfo()}
        </Panel>
      </Collapse>
    );
  }
}

const mapStateToProps = ({
  codeOrder: { relationOrderList },
}) => {
  return { relationOrderList };
};

export default connect(mapStateToProps)(Associated);
