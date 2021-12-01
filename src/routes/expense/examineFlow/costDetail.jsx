/**
 * 审批流设置，审批流详情页面 /Expense/ExamineFlow/Detail
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Row, Col } from 'antd';

import { DeprecatedCoreForm, CoreContent } from '../../../components/core';
import {
  ExpenseExamineFlowAmountAdjust,
  ExpenseCostOrderTemplateType,
  ExpenseCostOrderBizType,
  OaApplicationFlowTemplateApproveMode,
  OaApplicationFlowAssigned,
  AccountState,
} from '../../../application/define';
import styles from './style.less';
import { PagesHelper } from '../../oa/document/define';

const FormItem = Form.Item;

class ExpenseFlowCreact extends Component {
  static propTypes = {
    examineDetail: PropTypes.object,
  };

  static defaultProps = {
    examineDetail: {},
  };

  // 审批节点名称
  renderProcessName = (accountList = [], postList = []) => {
    return (
      <div>
        {/* 用户节点名称 */}
        {
          accountList.map((item, index) => {
            return (
              <span key={index} className={styles['app-comp-expense-examine-flow-deatail-user-name']}>
                {item.name}{Number(item.state) === AccountState.off ?
                  `(${AccountState.description(item.state)})` : ''}
                {index !== accountList.length - 1 ? <strong className={styles['app-comp-expense-examine-flow-deatail-user-text']}>|</strong> : null}
              </span>
            );
          })
        }
        {postList.length > 0 && accountList.length > 0 ? (
          <span className={styles['app-comp-expense-examine-flow-deatail-user-name']}>
            <strong className={styles['app-comp-expense-examine-flow-deatail-user-text']}>|</strong>
          </span>
        ) : ''}
        {/* 岗位节点名称 */}
        {
          postList.map((item, index) => {
            return (
              <span key={index} className={styles['app-comp-expense-examine-flow-deatail-user-name']}>
                {item.post_name}
                {index !== postList.length - 1 ? <strong className={styles['app-comp-expense-examine-flow-deatail-user-text']}>|</strong> : null}
              </span>
            );
          })
        }
      </div>
    );
  }

  // 岗位节点名称
  renderPostListName = (array) => {
    return (
      <div>
        {
          array.map((item, index) => {
            return (
              <span key={index} className={styles['app-comp-expense-examine-flow-deatail-user-name']}>
                {item.post_name}
                {index !== array.length - 1 ? <strong className={styles['app-comp-expense-examine-flow-deatail-user-text']}>|</strong> : null}
              </span>
            );
          })
        }
      </div>
    );
  }

  // 渲染表单
  renderForm = () => {
    const { examineDetail = {}, enumeratedValue = [] } = this.props;
    const layout = { labelCol: { span: 4 }, wrapperCol: { span: 18 } };
    const itemLayout = { labelCol: { span: 2 }, wrapperCol: { span: 20 } };
    // 事务性审批流详情
    const {
      bizType,
      applyRanks = [],
      applyDepartmentList = [],
      name = undefined,
      applyApplicationTypes = [],
      industryCodes = [],
    } = examineDetail;

    // 适用场景枚举
    const {
      examineFlowApplyApplicationTypes: appicationEnumerateData = [],
      subjectScense: subjectEnumeratedData = [],
    } = enumeratedValue;

    // 适用类型
    let applyNameList = '--';
    if (applyApplicationTypes && Array.isArray(applyApplicationTypes) && applyApplicationTypes.length > 0) {
      const nameList = applyApplicationTypes.map((i) => {
        const currentEn = appicationEnumerateData.find(en => en.value === i) || {};
        const { name: applyName } = currentEn;
        if (applyName) return applyName;
      });

      applyNameList = nameList.length <= 0 ? '--' : nameList.join('、');
    }

    // 适用场景
    let scense = '--';
    if (industryCodes && industryCodes.length > 0) {
      const currentScense = subjectEnumeratedData.find(en => en.value === industryCodes[0]) || {};
      scense = currentScense.name || '--';
    }

    if (bizType === ExpenseCostOrderBizType.transactional) {
      // 使用场景
      const scenes = Array.isArray(applyApplicationTypes) && applyApplicationTypes.length > 0
        ? applyApplicationTypes.map(i => PagesHelper.titleByKey(i)).join('、')
        : '--';

      let rank = '--';

      if (Array.isArray(applyRanks) && applyRanks.length > 0) {
        rank = applyRanks.map(i => i).join('、');
      }

      if (Array.isArray(applyRanks) && applyRanks.length === 1 && applyRanks[0] === 'all') {
        rank = '不限';
      }

      // 使用人
      const user = Array.isArray(applyDepartmentList) && applyDepartmentList.length > 0
        ? applyDepartmentList.map(i => i.name).join('、')
        : '--';

      const items = [
        {
          label: '适用审批场景',
          layout: itemLayout,
          form: scenes,
        },
        {
          label: '审批流类型',
          layout: itemLayout,
          form: '事务性',
        },
        {
          label: '使用人',
          layout: itemLayout,
          form: user,
        },
        {
          label: '审批流名称',
          layout: itemLayout,
          form: name || '--',
        },
        {
          label: '审批流职级条件',
          layout: itemLayout,
          form: rank,
        },

      ];
      return (
        <DeprecatedCoreForm items={items} cols={1} layout={itemLayout} />
      );
    }

    // 费用分组
    const costCatalogScopeList = dot.get(examineDetail, 'costCatalogScopeList', []);

    // 获取费用分组
    const costCatalogScopeMapList = costCatalogScopeList.map((item, index) => {
      if (index !== costCatalogScopeList.length - 1) {
        return `${item.name},`;
      }
      return item.name;
    });
    // 获取使用范围 ==> examineDetail.platformNames
    const examineList = examineDetail.platformNames || [];
    const formItems = [
      {
        label: '审批流名称',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 20 } },
        form: examineDetail.name || '---',
      },
      {
        label: '审批流类型',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 18 } },
        form: ExpenseCostOrderBizType.description(examineDetail.bizType),
      },
      {
        label: '适用类型',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 18 } },
        form: applyNameList,
      },
      {
        label: '适用场景',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 18 } },
        form: scense,
      },
      {
        label: '使用范围',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 18 } },
        form: <p>
          {examineList.length === 0 ? '---' : examineList[0]}
        </p>,
      },
    ];

    // 判断是否是成本类 如果是成本类 则渲染 默认模版 和 费用分组
    if (examineDetail.bizType === ExpenseCostOrderBizType.costOf) {
      formItems.push(
        {
          label: '默认模版',
          layout: { labelCol: { span: 2 }, wrapperCol: { span: 18 } },
          form: ExpenseCostOrderTemplateType.description(ExpenseCostOrderTemplateType.refund) || '---',
        },
        {
          label: '费用分组',
          layout: { labelCol: { span: 2 }, wrapperCol: { span: 18 } },
          form: <p>
            {
              costCatalogScopeMapList.length === 0 ? '---' : costCatalogScopeMapList
            }
          </p>,
        },
        {
          label: '审批流描述',
          layout: { labelCol: { span: 2 }, wrapperCol: { span: 18 } },
          form: examineDetail.note || '---',
        },
      );
    } else {
      formItems.push(
        {
          label: '审批流描述',
          layout: { labelCol: { span: 2 }, wrapperCol: { span: 18 } },
          form: examineDetail.note || '---',
        },
      );
    }

    return (
      <div>
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </div>
    );
  }

  // 审批节点类型
  renderSelect = (index) => {
    const { examineDetail = {} } = this.props;
    // 节点列表
    const nodeList = dot.get(examineDetail, 'nodeList', []);
    // 审批流类型
    const { bizType } = examineDetail;
    return (
      <Col span={24}>
        {
          // 成本类显示调控
          bizType === ExpenseCostOrderBizType.costOf ? (
            <Row gutter={0} type="flex" justify="space-around" align="middle" className={styles['app-comp-expense-node-label']}>
              <Col span={10}><span>调&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;控：</span></Col>
              <Col span={4}>{nodeList[index].canUpdateCostRecord ? '是' : '否'}</Col>
              <Col span={10}>{nodeList[index].canUpdateCostRecord ? ExpenseExamineFlowAmountAdjust.description(nodeList[index].costUpdateRule) : null}</Col>
            </Row>
          ) : null
        }

        <Row gutter={0} type="flex" justify="space-around" align="middle" className={styles['app-comp-expense-node-label']}>
          <Col span={10}><span>审批规则：</span></Col>
          <Col span={4}>{OaApplicationFlowTemplateApproveMode.description(nodeList[index].approveMode)}</Col>
          <Col span={10}>
            {nodeList[index].approveMode === OaApplicationFlowTemplateApproveMode.all ?
              '' :
              OaApplicationFlowAssigned.description(nodeList[index].pickMode)}
          </Col>
        </Row>
        <Row gutter={0} type="flex" justify="space-around" align="middle" className={styles['app-comp-expense-node-label']}>
          <Col span={10}><span>标记付款：</span></Col>
          <Col span={14}>{nodeList[index].isPaymentNode ? '是' : '否'}</Col>
        </Row>
        <Row gutter={0} type="flex" justify="space-around" align="middle" className={styles['app-comp-expense-node-label']}>
          <Col span={10}><span>标记验票：</span></Col>
          <Col span={14}>{nodeList[index].isInspectBillNode ? '是' : '否'}</Col>
        </Row>
      </Col>
    );
  }

  // 渲染审批流设置
  renderProcessGroup = () => {
    const { examineDetail = {} } = this.props;
    // 节点列表
    const nodeList = dot.get(examineDetail, 'nodeList', []);

    const content = [];
    // 将审批人列表循环
    nodeList.forEach((item, index) => {
      content.push(
        <Col className={styles['app-comp-expense-node-operate']} key={index}>
          <Row className={styles['app-comp-expense-node-people-container']} span={24}>
            <Col span={24}>
              <Row className={styles['app-comp-expense-node-name']}>
                <Col span={24}><span className={styles['app-comp-expense-round']} />{item.name}</Col>
              </Row>
              <Row className={styles['app-comp-expense-node-approval-people']}>
                {/* 审批节点名称 */}
                {this.renderProcessName(item.accountList, item.postList)}
              </Row>
              <Row className={styles['app-comp-expense-node-people-content']}>
                {this.renderSelect(index)}
              </Row>
            </Col>
          </Row>
        </Col>,
      );

      if (index !== nodeList.length - 1) {
        content.push(
          <Col span={1} key={`key-${index}`} className={styles['app-comp-expense-node-arrow']}><RightOutlined className={styles['app-comp-expense-examine-flow-deatail-setting']} /></Col>,
        );
      }
    });
    return content;
  }

  // 渲染流程图
  renderProcess = () => {
    return (
      <Row gutter={8} type="flex" align="middle">
        {/* 申请人 */}
        <Col span={1} className={styles['app-comp-expense-node']}>
          <Row gutter={8} type="flex" align="middle" className={styles['app-comp-expense-examine-flow-deatail-process']}>
            <Col span={24}><span className={styles['app-comp-expense-examine-flow-deatail-apply']}>申请人</span></Col>
          </Row>
        </Col>
        <Col span={1} className={styles['app-comp-expense-node-arrow']}><RightOutlined className={styles['app-comp-expense-examine-flow-deatail-icon']} /></Col>

        {/* 渲染节点信息 */}
        {this.renderProcessGroup()}
      </Row>
    );
  }

  render = () => {
    const formItemLayoutOperate = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    return (
      <Form layout="vertical">
        <CoreContent title="审批流详情">
          {/* 渲染表单 */}
          {this.renderForm()}
        </CoreContent>
        <CoreContent title="审批流节点详情">
          <FormItem
            {...formItemLayoutOperate}
            key={'operate'}
            className={styles['app-comp-expense-examine-flow-deatail-process-info']}
          >
            <div>
              {this.renderProcess()}
            </div>
          </FormItem>
          <FormItem className={styles['app-comp-expense-examine-flow-deatail-button']}>
            <Button type="default" onClick={() => { window.location.href = '/#/Expense/ExamineFlow/Process?isSetStorageSearchValue=true'; }}>返回</Button>
          </FormItem>
        </CoreContent>
      </Form>
    );
  }
}

function mapStateToProps({ expenseExamineFlow: { examineDetail }, applicationCommon: { enumeratedValue } }) {
  return { examineDetail, enumeratedValue };
}
const WrappedSearchComponent = Form.create()(ExpenseFlowCreact);
export default connect(mapStateToProps)(WrappedSearchComponent);
