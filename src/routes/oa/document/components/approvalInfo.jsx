/**
 * tab切换下
 * 关联审批列表 组件
 */
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Table, Button, Row, Col, Input, Collapse, Tooltip, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { PagesHelper } from '../../../oa/document/define';
import Operate from '../../../../application/define/operate';
import {
  Unit,
  ExpenseExamineOrderProcessState,
  CodeCostCenterType,
  CodeOrderType,
  OaApplicationOrderType,
  ApprovalDefaultParams,
} from '../../../../application/define';

import styles from './style.less';

const { Panel } = Collapse;
const enumerThemeParams = {
  inspect: 'inspect', // 主题标签渲染取值类型
};
function ComponentApprovalInfo(props) {
  const [associatedId, setAssociatedId] = useState(null); // 关联审批单号
  const [approvalList, setApprovalList] = useState([]);   // 审批单列表
  const { orderId = undefined } = props;                  // 审批单id *不存在就是创建页面 否则就是编辑页面或者详情页面

  useEffect(() => {
    // 请求已关联的审批单列表数据 *如果审批单id存在就是编辑页面或则详情页面
    if (orderId) {
      props.dispatch({
        type: 'codeOrder/fetchApprovalLists',
        payload: {
          orderId,
          onSuccessCallback: (data) => {
            setApprovalList(data);     // 设置审批单列表
          } } });
    }
  }, []);

  // 设置关联审批单号 *search input onchange
  const onChangeAssociated = (val) => {
    const associatedVal = val.target.value.trim();
    setAssociatedId(associatedVal);
  };


  // 提交 *search input submit
  // 状态1：创建的时候 点击请求的是查询接口
  // 状态2：编辑的时候 请求的是去关联的接口
  const onSubmitAssociated = async () => {
    // 编辑： 如果是编辑页面 需要请求的是关联接口 而不是查询接口
    if (props.isType === 'update' && props.orderId) {
      props.dispatch({
        type: 'humanResource/fetchApproval',
        payload: {
          id: props.orderId,       // 当前编辑的审批单id
          ids: [associatedId],     // 查询搜索后要关联的审批单id *这里是单个
          type: ApprovalDefaultParams.add,   // 增加
          onApprovalIsSuccess: () => {
            message.success('关联成功');
            // 关联成功以后 重新获取关联列表数据
            props.dispatch({ type: 'codeOrder/fetchApprovalLists',
              payload: {
                orderId: props.orderId,
                onSuccessCallback: (data) => {
                  setApprovalList(data);
                } } });
          },
        },
      });
      return;
    }

    // 创建：查询
    const isExistence = approvalList.some(item => item._id === associatedId);
    // 判断添加的审批单id 是否已经添加到state数组中 如果存在 则提示不能重复添加
    if (isExistence) {
      message.error('审批单号已存在，请勿重复添加');
      return;
    }

    // 这里传一个审批单id 后端返回一条关联数据
    if (associatedId) {
      await props.dispatch({
        type: 'codeOrder/fetchApprovalFind',
        payload: {
          associatedId,
          onProcessApprovalData,
        },
      });
    }
  };

  // 创建：处理审批流信息 返回的是一个对象
  const onProcessApprovalData = (object) => {
    setApprovalList([...approvalList, object]);
    // 如果props.setParentIds 存在就把ids传到保存/提交接口里
    if (props.setParentIds) {
      const newList = [...approvalList, object];
      const idData = newList.map(v => v._id);
      props.setParentIds(idData);
    }
  };

  // 删除审批列表
  const onDeleteAssociatedOrder = (id) => {
    // 编辑： 如果是编辑页面 删除需要请求的是关联接口
    if (props.isType === 'update' && props.orderId) {
      props.dispatch({
        type: 'humanResource/fetchApproval',
        payload: {
          id: props.orderId,        // 当前编辑的审批单id
          ids: [id],                // 查询搜索后要关联的审批单id *这里是单个
          type: ApprovalDefaultParams.delete, // 删除
          onApprovalIsSuccess: () => {
            message.success('删除成功');
            props.dispatch({ type: 'codeOrder/fetchApprovalLists',
              payload: {
                orderId: props.orderId,
                onSuccessCallback: (data) => {
                  setApprovalList(data);
                } } });
          },
        },
      });
      return;
    }
    // 创建：如果在创建页面 我们前端操作state 从原数组中删除
    const newList = approvalList.filter(i => i._id !== id);
    setApprovalList(newList);
    // 如果props.setParentIds 存在就把ids传到保存/提交接口里 *参数里面传的id 我们删除的时候也要过滤掉
    if (props.setParentIds) {
      const idData = newList.map(v => v._id);
      props.setParentIds(idData);
    }
  };

  // 渲染关联列表下的标签项
  const renderTags = (tagsList, type) => {
    // 标签数据大于三个
    if (Array.isArray(tagsList) && tagsList.length > 3) {
      let title = tagsList.map(t => t).join(' 、 ');
      // 如果type为inspect 取每一项的name值
      if (type === enumerThemeParams.inspect) {
        title = tagsList.map(t => t.name).join(' 、 ');
      }

      // 默认取每一项的name
      let children = tagsList.slice(0, 3).map(t => t.name).join(' 、 ');
      // 如果type为inspect 取每一项
      if (type === enumerThemeParams.inspect) {
        children = tagsList.slice(0, 3).map(t => t).join(' 、 ');
      }
      return (
        <Tooltip title={title}>
          <div>{ children}...</div>
        </Tooltip>
      );
    }

    // 标签数据小于三个
    if (Array.isArray(tagsList) && tagsList.length <= 3 && tagsList.length > 0) {
      // 默认取每一项
      let child = tagsList.map(t => t).join('、');
      // 如果type为inspect 取每一项的name值
      if (type === enumerThemeParams.inspect) {
        child = tagsList.map(t => t.name).join('、');
      }
      return (
        <div>{child}</div>
      );
    }

    return '--';
  };

  // 渲染关联列表
  const renderAssociatedList = () => {
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
        render: text => renderTags(text),
      }, {
        title: '验票标签',
        dataIndex: 'inspect_bill_label_list',
        width: 150,
        render: text => renderTags(text, 'inspect'),
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
            // fix
            // 判断大于100的是事务类的审批单
            if (text >= OaApplicationOrderType.recruitment) {
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
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
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
          // 如果状态是待提交 || 无权限操作，则返回空 “--”
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
      dataSource={approvalList}
      columns={columns}
      pagination={false}
      bordered
      scroll={{ x: 1580 }}
    />);
  };

  // 渲染关联信息
  const renderAssociatedInfo = () => {
    const idData = approvalList.map(v => v._id);
    // 关联单号
    const content = (
      <span className={styles['app-comp-expense-associated-info-wrap']} key="success">
        {
          idData.map((item, index) => {
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
                  onClick={() => onDeleteAssociatedOrder(item)}
                />
              </span>
            );
          })
        }
      </span>
    );

    const renderSearchApproval = () => {
      if (props.isType === 'detail') return <div />;
      return (
        <Col span={24}>
          <Row>
            <Col span={2} className={styles['app-comp-expense-associated-info-input-label']}>
              <span className={styles['app-comp-expense-associated-info-wrap']}>关联审批单:</span>
            </Col>
            <Col span={6} className={styles['app-comp-expense-associated-info-input']}>
              <Input placeholder="请输入关联审批单号" value={associatedId} onChange={onChangeAssociated} />
            </Col>
            <Col span={2} className={styles['app-comp-expense-associated-info-btn']}>
              <Button type="primary" onClick={onSubmitAssociated}>确定</Button>
            </Col>
            <Col span={12} className={styles['app-comp-expense-associated-info-content']}>
              <span>{content}</span>
            </Col>
          </Row>
        </Col>
      );
    };
    return (
      <React.Fragment>
        <Row type="flex" align="middle">
          {renderSearchApproval()}
          <Col span={24} className={styles['app-comp-expense-associated-info-table-wrap']}>
            <Row>
              <Col span={2} className={styles['app-comp-expense-associated-info-list-table']}>关联审批单列表:</Col>
              <Col span={21} className={styles['app-comp-expense-associated-info-list']}>
                {/* 渲染关联列表 */}
                {renderAssociatedList()}
              </Col>
            </Row>
          </Col>
        </Row>
      </React.Fragment>
    );
  };


  return (
    <Collapse>
      <Panel header="关联信息">
        {/* 关联审批单信息 */}
        {renderAssociatedInfo()}
      </Panel>
    </Collapse>
  );
}

ComponentApprovalInfo.propTypes = {
  isType: PropTypes.string,
  orderId: PropTypes.string,
  setParentIds: PropTypes.func,
};

ComponentApprovalInfo.defaultProps = {
  isType: '',             // 当前页面类型
  orderId: '',            // 当前审批单id
  setParentIds: () => {}, // 存储当前要关联的审批单id *上级组件传下来的 setState函数
};

export default connect()(ComponentApprovalInfo);
