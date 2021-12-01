/**
 * 服务费试算 - 提交审审核弹窗
 */
import is from 'is_js';
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Row, Col, message } from 'antd';

import { DeprecatedCoreForm } from '../../../../../components/core';
import { Unit, OaApplicationFlowTemplateApproveMode, OaApplicationFlowAssigned } from '../../../../../application/define';
import ApprovePersonOrPost from '../../../../expense/manage/examineOrder/detail/approvePersonOrPost';
import styles from './style/index.less';

class VerifyModal extends Component {
  static propTypes = {
    isShowVerify: PropTypes.bool,    // 弹窗是否可见
    onHideModal: PropTypes.func,     // 隐藏弹窗的回调函数
    planVersionId: PropTypes.string, // 方案ID
    planId: PropTypes.string,        // 版本ID
    calculateResultsData: PropTypes.object, // 提交审核数据
    auditInfo: PropTypes.object,     // 获取提审信息
    isShowAudit: PropTypes.bool,     // 是否显示提审功能
  }
  static defaultProps = {
    isShowVerify: false,
    onHideModal: () => {},
    planVersionId: '',
    calculateResultsData: {},
    auditInfo: {},
    isShowAudit: false,
  }
  constructor(props) {
    super(props);
    this.state = {
      isVerifyPost: false, // 提交时，是否判断审批岗位
      isDefault: true, // 提交时，是否是初次默认值
      isDisabledPerson: false, // 是否禁用提交用组件的审批岗位下的审批人选择框
    };
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'financePlan/resetPayrollPlanSubmitAudit' });
  }

  // 自定义Form校验
  onVerify = (rule, value, callback) => {
    const { isVerifyPost } = this.state;
    // 判断：如果下一节点审批规则是全部 || (审批规则为任一 && 自动指派 && 选择至审批人),则不用校验
    if (rule.isApprovalAll === true || (rule.isApprovalAll === false && rule.isAutoMatic && isVerifyPost === false)) {
      callback();
      return;
    }
    // 判断：如果下一节点审批规则为任一 && 选择至审批岗位（审批岗位下的审批人必选），则全部校验
    if (rule.isApprovalAll === false && isVerifyPost === true && value.postId && value.personId) {
      callback();
      return;
    }
    // 判断：如果下一节点审批规则为任一 && 指派规则为手动 && 指派人选择至审批人
    if (rule.isApprovalAll === false && rule.isAutoMatic === false && isVerifyPost === false && value.personId) {
      callback();
      return;
    }

    // 如果校验不通过，则提示错误文本
    callback('请选择指派审批人或审批岗位');
  }

  // 提交审核回调
  onVerifyCallback = () => {
    const { planId } = this.props;
    this.props.dispatch({ type: 'financePlan/fetchSalaryPlanDetailData', payload: { id: planId } });
    // 提交后重置
    this.onReset();
  }

  // 失败的回调的错误提示
  onFailurePromptInfo = (res) => {
    message.error(res.zh_message);
  }

  // 提交内容
  onSubmit = () => {
    const { onHideModal, planVersionId, isShowAudit } = this.props;
    const { form } = this.props;
    form.validateFields((errs, values) => {
      if (errs) {
        return;
      }
      // 获取自定义表单的值
      const { assignedPerson = {} } = values;
      const { postId, personId } = assignedPerson;
      const params = {
        planVersionId,    // 版本ID
        accountId: personId,  // 接点人id
        postId, // 岗位id
      };
      if (isShowAudit) {
        this.props.dispatch({
          type: 'financePlan/createSalaryPlanVersion',
          payload: {
            params,
            onSuccessCallback: this.onVerifyCallback,
            onFailureCallback: this.onFailurePromptInfo,
          },
        });
      }
      if (onHideModal) {
        onHideModal();
      }
    });
  }

  // 隐藏弹窗
  onCancel = () => {
    const { onHideModal } = this.props;
    this.setState({
      isVerifyPost: false,
      isDefault: false,
    });
    if (onHideModal) {
      onHideModal();
    }
    // 隐藏弹窗后重置表单
    this.onReset();
  }

  // 修改审批人或审批岗位
  onChangePerson = (isVerifyPost, isDisabledPerson) => {
    this.setState({
      isVerifyPost, // 是否校验审批岗位下的审批人
      isDefault: false, // 提交用组件是否是初次默认值
      isDisabledPerson, // 是否禁用提交用组件的审批岗位下的审批人选择框
    });
  }

  // 重置表单
  onReset = () => {
    // 重置表单
    this.props.form.resetFields();
  }

  // 渲染添加标签的表单
  renderCreateForm = () => {
    const { getFieldDecorator } = this.props.form;
    const { auditInfo, isShowAudit } = this.props;
    const { isDefault } = this.state;

    // 如果不显提审操作，return
    if (!isShowAudit || Object.keys(auditInfo).length === 0) {
      return;
    }

    // 获取下一节点的审批规则
    let approveMode;
    // 获取下一节点的指派方式
    let pickMode;
    // 获取下一节点审批人，用于指派审批人
    let nextNodeAccountList = [];
    // 获取下一节点审批岗位列表
    let nextNodePostList = [];
    // 获取下一节点详情
    let nextNodeInfo = {};
    // 获取当前审批单所属审批流的节点列表
    const nodeList = dot.get(auditInfo, 'node_list');
    // 获取提报节点之后的第一个节点的审批人
    if (is.existy(nodeList) && is.array(nodeList) && is.not.empty(nodeList)) {
      nextNodeInfo = nodeList[0] || {};
      nextNodeAccountList = dot.get(nodeList[0], 'account_list', []);
      nextNodePostList = dot.get(nodeList[0], 'post_list', []);
      pickMode = dot.get(nodeList[0], 'pick_mode');
      approveMode = nodeList[0].approve_mode;
    }
    const rules = {
      message: '请选择审批人或审批岗位',
      isApprovalAll: false,
      isAutoMatic: false,
      required: false,
    };

    // 定义提交表单时的校验规则-审批规则
    if (approveMode === OaApplicationFlowTemplateApproveMode.all) {
      rules.isApprovalAll = true;
    }
    // 定义提交表但是的校验规则-指派规则
    if (pickMode === OaApplicationFlowAssigned.automatic) {
      rules.isAutoMatic = true;
    }

    // 是否必选
    if (!rules.isApprovalAll && !rules.isAutoMatic) {
      rules.required = true;
    }

    // 合并审批人与审批岗位
    const accountIdsData = nextNodeAccountList.concat(nextNodePostList);

    let postId; // 提交用岗位id
    let personId; // 提交用审批人id
    let postPersonId; // 显示用审批岗位/审批人id
    let personShowId; // 显示用审批岗位下的审批人id
    let isDisabledPost = false; // 是否禁用自定义组件的审批岗位/审批人选择框
    let isDisabledPerson = false; // 是否禁用审批岗位下的审批人选择框

    // 只有一个审批人
    if (nextNodePostList.length === 0 && accountIdsData.length === 1) {
      personId = nextNodeAccountList[0]._id;
      personShowId = nextNodeAccountList[0]._id;
      isDisabledPost = true;
    }

    // 只有一个岗位
    if (nextNodePostList.length === 1 && accountIdsData.length === 1) {
      postId = nextNodePostList[0]._id;
      personShowId = nextNodePostList[0]._id;
      isDisabledPost = true;
    }

    // 只有一个审批岗位 && 该岗位下只有一个审批人
    if (nextNodePostList.length === 1 && accountIdsData.length === 1 && nextNodePostList[0].account_ids.length === 1) {
      personId = nextNodePostList[0].account_ids[0];
      postId = nextNodePostList[0]._id;
      postPersonId = nextNodePostList[0].account_ids[0];
      personShowId = nextNodePostList[0]._id;
      isDisabledPost = true;
      isDisabledPerson = true;
    }
    // 定义传入的参数
    const props = {
      nextNodeDetail: nextNodeInfo,
      accountIdsData,
      postPersonList: nextNodePostList,
      onChangePerson: this.onChangePerson,
      isDisabledPost,
      isDisabledPerson: isDefault ? isDisabledPerson : this.state.isDisabledPerson,
      postList: nextNodePostList,
      personList: nextNodeAccountList,
    };

    const formItems = [
      {
        label: '下一节点审批人',
        form: getFieldDecorator('assignedPerson',
          {
            initialValue: { personId, postId, postPersonId, personShowId },
            rules: [{ ...rules, validator: this.onVerify }],
            validateTrigger: this.onSubmit,
          })(
            <ApprovePersonOrPost {...props} />,
          ),
      },
    ];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <div>
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </div>
    );
  }

  render() {
    const { isShowVerify, calculateResultsData, isShowAudit } = this.props;
    const { onSubmit, onCancel } = this;
    // 提审文字信息
    const auditText = isShowAudit ? (<div className={styles['app-comp-finance-CModalhmt']}>
      <p className={styles['app-comp-finance-CModalct']}>请指派下一个节点的审批人</p>
    </div>) : null;

    return (<Modal key="1" title="确认提交" visible={isShowVerify} onOk={onSubmit} onCancel={onCancel} okText="确定" cancelText="取消">
      <div>
        {
          dot.get(calculateResultsData, 'data', []).map((item, index) => {
            return (<Row key={index} className="app-global-mgt10">
              <Row className="app-global-mgt10">
                <Row>
                  <Col span={24} className="app-global-mgl50 app-global-mgt10">1、当前版本号: {item.planVersionId ? item.planVersionId : '--'}</Col>
                </Row>
                <Row>
                  <Col span={24} className="app-global-mgl50 app-global-mgt10">2、最后修改时间: {moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss') ? moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '--'}</Col>
                </Row>
                <Row>
                  <Col span={24} className="app-global-mgl50 app-global-mgt10">3、试算数据流水号: {item.id ? item.id : '--'}</Col>
                </Row>
                <Row>
                  <Col span={24} className="app-global-mgl50 app-global-mgt10">4、试算结果: {Unit.exchangePriceToYuan(item.computeDataSet.trialCalculationAmount[0]) ? Unit.exchangePriceToYuan(item.computeDataSet.trialCalculationAmount[0]) : '--'}</Col>
                </Row>
                <Row>
                  <Col span={24} className="app-global-mgl50 app-global-mgt10">5、试算时间: {item.fromDate ? item.fromDate : '--'} </Col>
                </Row>
                <Col span={24} className="app-global-mgl50 app-global-mgt10">以上将作为审批的依据和附件,请确认试算结果是否符合要求.</Col>
              </Row>
            </Row>);
          })
        }
      </div>
      {/* 提审操作头部信息 */}
      {auditText}
      <Form>
        {this.renderCreateForm()}
      </Form>
    </Modal>);
  }
}
function mapStateToProps({ financePlan: { calculateResultsData, auditInfo } }) {
  return { calculateResultsData, auditInfo };
}
export default connect(mapStateToProps)(Form.create()(VerifyModal));
