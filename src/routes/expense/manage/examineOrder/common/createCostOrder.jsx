/**
 * 付款审批 - 审核记录创建模块
 */
import is from 'is_js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, message } from 'antd';

import { authorize } from '../../../../../application';
import { ExpenseCostOrderTemplateType, OaApplicationOrderType } from '../../../../../application/define';
import SelectExpenseTypes from './expenseType';
import styles from './style.less';

const platforms = authorize.platform();

class ExpenseCreateCostOrderComponent extends Component {
  static propTypes = {
    orderId: PropTypes.string.isRequired, // 审批单id
    flowId: PropTypes.string.isRequired, // 审批流id
    applicationOrderType: PropTypes.number, // 审批单类型
    approvalKey: PropTypes.string, // 审批单列表页tab key
    platformCode: PropTypes.array, // 审批流使用平台
    examineDetail: PropTypes.object, // 审批单详情
    examineFlowConfig: PropTypes.object, // 审批流配置
  };

  static defaultProps = {
    orderId: '',
    flowId: '',
    applicationOrderType: PropTypes.number,
    approvalKey: '',
    platformCode: [],
    examineDetail: {},
    examineFlowConfig: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      expenseTypeId: undefined, // 费用分组id
      expenseTypeName: undefined, // 费用分组name
      template: undefined, // 模板类型
    };
  }

  componentDidMount = () => {
    const params = {
      feature: 'house_contract',
      platforms: platforms.map(val => val.id), // 平台
    };
    this.props.dispatch({ type: 'expenseExamineFlow/fetchExamineFlowConfig', payload: params });
  }

  // 选中项目赋值
  onChangeExpenseType = (type, name, template) => {
    this.setState({
      expenseTypeId: type,
      expenseTypeName: name,
      template: Number(template),
    });
  }

  // 创建新的数据
  onClickCreate = () => {
    const {
      orderId,
      flowId,
      examineFlowConfig = {},
      applicationOrderType,
      approvalKey,
      platformCode,
      examineDetail = {},
    } = this.props;

    const { expenseTypeId, expenseTypeName, template } = this.state;

    let platformParam;
    if (platformCode && platformCode.length > 0) {
    // 处理特殊字符，使用encodeURIComponent编码
      platformParam = platformCode[0] && typeof platformCode[0] === 'string' ? encodeURIComponent(platformCode[0]) : undefined;
    }

    const {
      platformCodes = [], // 审批流使用平台
    } = examineDetail;

    // 处理特殊字符，使用encodeURIComponent编码
    const platform = platformCodes[0] && typeof platformCodes[0] === 'string' ? encodeURIComponent(platformCodes[0]) : undefined;

    // 遍历房屋审批流配置 判断科目是否可选择
    // TODO: for嵌套
    if (examineFlowConfig && expenseTypeId && flowId) {
      for (const k in examineFlowConfig) {
        if (Object.prototype.hasOwnProperty.call(examineFlowConfig, k)) {
          for (const v in examineFlowConfig[k]) {
            if (examineFlowConfig[k][v].flow_id === flowId && examineFlowConfig[k][v].cost_group_id === expenseTypeId) {
              return message.error('该分组只适用于房屋费用申请');
            }
          }
        }
      }
    }

    // 判断是否设置了费用分组，没有设置则不能进行创建
    if (is.empty(expenseTypeId) || is.not.existy(expenseTypeId)) {
      return message.error('请选择费用分组');
    }

    // 跳转到差旅报销的创建页面
    if (applicationOrderType === OaApplicationOrderType.travel) {
      window.location.href = (`/#/Expense/Manage/ExamineOrder/BusinessTravel/Create?orderId=${orderId}&expenseTypeId=${expenseTypeId}&expenseTypeName=${expenseTypeName}&approvalKey=${approvalKey}&platformParam=${platformParam}&platform=${platform}`);
      return;
    }

    // 跳转到报销的创建页面
    if (template === ExpenseCostOrderTemplateType.refund) {
      window.location.href = (`/#/Expense/Manage/Template/Create?orderId=${orderId}&expenseTypeId=${expenseTypeId}&expenseTypeName=${expenseTypeName}&template=${template}&approvalKey=${approvalKey}&platformParam=${platformParam}&applicationOrderType=${applicationOrderType}&platform=${platform}`);
      return;
    }

    // 跳转到租房的创建页面
    if (template === ExpenseCostOrderTemplateType.rent) {
      // TODO: @曹毅 @郭庆 功能预留接口
      return message.info('暂时不支持租房申请');
    }

    // NOTE：如添加新模版类型支持，只需要在 ExpenseCostOrderTemplateType 中添加后处理即可
    message.error('错误的房屋模版类型');
  }

  render() {
    const { flowId } = this.props;
    return (
      <div>
        <span className={styles['app-comp-expense-create-cost-order-label']}>费用分组:</span>
        {/* 渲染费用分组选择框及新建按钮 */}
        <SelectExpenseTypes flowId={flowId} onChange={this.onChangeExpenseType} placeholder="请选择费用分组" className={styles['app-comp-expense-create-cost-order-selector']} />
        <Button type="primary" onClick={this.onClickCreate}>新建</Button>
      </div>
    );
  }
}

function mapStateToProps({ expenseExamineFlow: { examineDetail, examineFlowConfig } }) {
  return { examineDetail, examineFlowConfig };
}

export default connect(mapStateToProps)(ExpenseCreateCostOrderComponent);
