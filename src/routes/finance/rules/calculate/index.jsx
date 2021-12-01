/**
 * 服务费试算 Finance/Rules/Calculate
 */
import is from 'is_js';
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Row, Col, message } from 'antd';
import Operate from '../../../../application/define/operate';
import { FinanceSalaryTaskState, OaApplicationFlowTemplateApproveMode } from '../../../../application/define/';

import VerifyModal from './modal/verify';
import CreateModal from './modal/create';

import CalculateResults from './result';
import CalculateHistory from './history';
import styles from './style/index.less';

class CalculateComponent extends Component {
  static propTypes = {
    planVersionId: PropTypes.string, // 版本id
    planId: PropTypes.string,    // 方案id
    domain: PropTypes.number,    // 方案类型
    calculateResultsData: PropTypes.object, // 试算结果列表数据
    planVersionDetailData: PropTypes.object,
  }
  static defaultProps = {
    planVersionId: '',
    planId: '',
    calculateResultsData: {},
    planVersionDetailData: {},
  }
  constructor(props) {
    super(props);
    this.state = {
      isVerifyButton: false,                                                             // 是否开启提交审核按钮
      isShowVerifyModal: false,                                                          // 是否显示审核弹窗
      isShowCalculateModal: false,                                                       // 是否显示试算弹窗
      state: undefined,                                                                  // 获取状态值
      isDisabled: true,                                                                  // 对提交审核的判断
      isShowAudit: false,                                                                // 是否显示提审操作
    };
    this.private = {
      dispatch: props.dispatch,
    };
  }

  // 试算的时间
  onChangeDate = (date, dateString) => {
    const { fields } = this.state;
    fields.trialDate = dateString;
    this.setState({ fields });
  }

  // 提交审核
  onSubmitAudit = () => {
    const { planVersionId, planVersionDetailData } = this.props;
    this.setState({
      isShowVerifyModal: true,
    });
    if (is.not.empty(planVersionDetailData)) {
      // 传递参数获取提审信息
      const params = {
        planVersionId,
        scope: dot.get(planVersionDetailData, `${planVersionId}.domain`, 0),
        platform: dot.get(planVersionDetailData, `${planVersionId}.platformCode`, undefined),
        supplier: dot.get(planVersionDetailData, `${planVersionId}.supplierId`, undefined),
        city: dot.get(planVersionDetailData, `${planVersionId}.citySpelling`, undefined),
        district: dot.get(planVersionDetailData, `${planVersionId}.bizDistrictId`, undefined),
        onSuccessCallback: this.onSuccessAuditInfo,
      };
      this.props.dispatch({ type: 'financePlan/fetchPayrollPlanSubmitAudit', payload: params });
    }
  }

  // 提审信息成功的回调函数
  onSuccessAuditInfo = (result) => {
    const { planVersionId } = this.props;
    // 判断提审信息是否有数据
    if (is.not.empty(result)) {
      // 获取第一个节点信息
      let approveMode;          // 审批规则
      const nodeList = dot.get(result, 'node_list');
      if (is.existy(nodeList) && is.not.empty(nodeList)) {
        approveMode = nodeList[0].approve_mode;
      }
      // 如果审批规则为全部，则不显示弹窗,否则显示弹窗
      if (approveMode === OaApplicationFlowTemplateApproveMode.all) {
        this.setState({
          isShowAudit: false, // 关闭提审
        });
        const params = {
          planVersionId, // 薪资方案版本id
        };
        this.props.dispatch({
          type: 'financePlan/createSalaryPlanVersion',
          payload: {
            params,
            onSuccessCallback: this.onVerifyCallback,
          },
        });
      } else {
        this.setState({
          isShowAudit: true, // 是否显示提审操作
        });
      }
    } else {
      message.error('特殊审批流未配置');
    }
  }

  // 提交审核回调
  onVerifyCallback = () => {
    const { planId } = this.props;
    this.props.dispatch({ type: 'financePlan/fetchSalaryPlanDetailData', payload: { id: planId } });
  }

  // 关闭提交弹窗
  onHideModal = () => {
    this.setState({
      isShowVerifyModal: false,
    });
  }
  // 关闭试算的弹窗
  onHideTrialModal = () => {
    this.setState({
      isShowCalculateModal: false,
    });
  }

  // 开始试算
  onStartTrial = () => {
    this.setState({
      isShowCalculateModal: true,
    });
  }

  // 渲染操作
  renderOperation = () => {
    const { calculateResultsData: { data: resultData = [] } } = this.props;

    // 循环出试算结果的状态需要对状态进行判断提交审核按钮是否隐藏
    const state = resultData.map((item) => {
      return item.state;
    });

    // 转换成Number的类型
    const resultState = Number(state.join(''));

    return (
      <Row className={styles['app-comp-finance-calculate-row-h']}>
        <Col span={11} className={styles['app-comp-finance-calculate-text-rmt']}>
          {
            !Operate.canOperateFinancePlanTrial()
            ||
            <Button
              type="primary"
              disabled={resultState === FinanceSalaryTaskState.pendding}
              onClick={this.onStartTrial}
            >
              开始试算
            </Button>}
        </Col>
        <Col span={11} offset={1} className={styles['app-comp-finance-calculate-text-lmt']}>
          {
            !Operate.canOperateFinancePlanonSubmit()
            ||
            <Button
              type="primary"
              disabled={resultState !== FinanceSalaryTaskState.success}
              onClick={this.onSubmitAudit}
            >
              提交审核
            </Button>}
        </Col>
      </Row>
    );
  }

  // 渲染试算结果
  renderResultContent = () => {
    const { planId, planVersionId, domain } = this.props;
    return (<CalculateResults planVersionId={planVersionId} planId={planId} domain={domain} onOpenVerifyButton={this.onOpenVerifyButtons} />);
  }

  // 渲染试算历史记录
  renderHistoryContent = () => {
    const { planId, planVersionId, domain } = this.props;
    return <CalculateHistory planVersionId={planVersionId} planId={planId} domain={domain} />;
  }

  // 渲染提交审核弹窗
  renderVerifyModal = () => {
    const { planVersionId, planId } = this.props;
    const { isShowVerifyModal, isShowAudit } = this.state;
    return (<VerifyModal isShowVerify={isShowVerifyModal} onHideModal={this.onHideModal} planVersionId={planVersionId} planId={planId} isShowAudit={isShowAudit} />);
  }

  // 渲染试算的创建时间的月份
  renderCreateDateModal = () => {
    const { planVersionId } = this.props;
    const { isShowCalculateModal, workeType } = this.state;
    return <CreateModal isShowCalculate={isShowCalculateModal} onHideTrialModal={this.onHideTrialModal} planVersionId={planVersionId} workeType={workeType} />;
  }
  render() {
    return (
      <div>
        {/* 渲染试算结果内容 */}
        {this.renderResultContent()}

        {/* 渲染试算与提交审核按钮 */}
        {this.renderOperation()}

        {/* 渲染试算历史记录 */}
        {this.renderHistoryContent()}

        {/* 渲染提交审核弹窗*/}
        {this.renderVerifyModal()}

        {/* 渲染开始试算弹窗*/}
        {this.renderCreateDateModal()}
      </div>
    );
  }
}
function mapStateToProps({ financePlan: { calculateResultsData, planVersionDetailData } }) {
  return { calculateResultsData, planVersionDetailData };
}
export default connect(mapStateToProps)(Form.create()(CalculateComponent));
