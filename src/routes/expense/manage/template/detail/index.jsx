/**
 * 详情模版的入口判断页面 /Expense/Manage/Template/Detail
 */
import is from 'is_js';
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import React, { Component } from 'react';

import { authorize } from '../../../../../application';
import { ExpenseCostOrderTemplateType } from '../../../../../application/define';
import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';

import TemplateDetailRefund from './refund';     // 报销详情
import HouseInfo from '../../common/houseInfo';    // 房屋信息
import Travel from './travel';    // 差旅报销详情

class Index extends Component {
  static propTypes = {
    costOrderDetail: PropTypes.object,
    examineOrderDetail: PropTypes.object,
  }

  static defaultProps = {
    costOrderDetail: {},
    examineOrderDetail: {},
  }

  constructor(props) {
    super(props);
    const recordId = dot.get(props, 'location.query.recordId', '');
    const template = dot.get(props, 'location.query.template', '');
    const applicationOrderId = dot.get(props, 'location.query.applicationOrderId', '');

    this.state = {
      recordId,         // 费用单id
      template,         // 模版类型
      applicationOrderId,
    };
    this.private = {
      forms: {},     // 跟模版挂钩的表单，用于一次性遍历数据统一提交
    };
  }

  componentDidMount() {
    const { recordId, applicationOrderId } = this.state;
    if (is.existy(recordId) && is.not.empty(recordId)) {
      this.props.dispatch({ type: 'expenseCostOrder/fetchCostOrderDetail', payload: { recordId } });
    }
    if (applicationOrderId) {
      this.props.dispatch({ type: 'expenseExamineOrder/fetchExamineOrderDetail', payload: { id: applicationOrderId } });
    }
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'expenseCostOrder/resetCostOrderDetail' });
  }

  // 基础信息
  renderBaseInfo = () => {
    const { costOrderDetail = {} } = this.props;
    // 定义是否重置数据（区别于房屋与报销类审批单）
    const isReset = true;
    const formItems = [
      {
        label: '费用分组',
        form: dot.get(costOrderDetail, 'costGroupName'),
      }, {
        label: '申请人',
        form: dot.get(costOrderDetail, 'applyAccountInfo.name', authorize.account.name),
      },
    ];
    if (costOrderDetail.bizExtraHouseContractId) {
      formItems.splice(1, 0, {
        label: '合同编号',
        form: costOrderDetail.bizExtraHouseContractId,
      });
    }
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent title="基础信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
        {
          costOrderDetail.bizExtraHouseContractId
          ?
            <HouseInfo
              contractId={dot.get(costOrderDetail, 'bizExtraHouseContractId', '')}
              isReset={isReset}
            />
          :
            ''
        }
      </CoreContent>
    );
  }

  // 渲染模版内容
  renderTemplates = () => {
    const { costOrderDetail = {}, examineOrderDetail = {} } = this.props;
    const newMoneyRule = dot.get(this.props, 'location.query.newMoneyRule', '1');
    if (Object.keys(costOrderDetail).length <= 0 || Object.keys(examineOrderDetail).length <= 0) return <div />;

    const { template } = this.state;
    let components = [];
    // // 报销模版需要返回的渲染模块
    if (`${template}` === `${ExpenseCostOrderTemplateType.refund}`) {
      components = [
        { component: TemplateDetailRefund, title: '费用信息', props: { isHideHouseNum: true, newMoneyRule } },
      ];
    }
    // 差旅报销单模板
    if (`${template}` === `${ExpenseCostOrderTemplateType.travel}`) {
      components = [
        { component: Travel, title: '差旅信息', props: { isHideHouseNum: true } },
      ];
    }

    // 租房模版需要返回的渲染模块
    // if (`${detailTemplate}` === `${ExpenseCostOrderTemplateType.rent}`) {
    // }

    // NOTE：如添加新模版类型支持，只需要在 ExpenseCostOrderTemplateType 中添加后处理即可

    // 渲染模版
    return components.map((item, index) => {
      // 模版渲染需要的参数
      const props = {
        ...item.props,
        detail: costOrderDetail,
        key: index,                   // antd 元素用key
        formKey: `form-${index}`,     // 表单的唯一标示，用于onHookForm
        onHookForm: this.onHookForm,  // 钩子函数
        examineOrderDetail,
      };

      return <item.component {...props} />;
    });
  }

  render = () => {
    return (
      <div>
        {/* 渲染基础信息 */}
        {this.renderBaseInfo()}
        {/* 渲染模版内容 */}
        {this.renderTemplates()}
      </div>
    );
  }
}

function mapStateToProps({ expenseCostOrder: { costOrderDetail }, expenseExamineOrder: { examineOrderDetail } }) {
  return { costOrderDetail, examineOrderDetail };
}
export default connect(mapStateToProps)(Index);
