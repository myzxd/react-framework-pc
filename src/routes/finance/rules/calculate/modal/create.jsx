/**
 * 服务费试算 - 服务费试算弹窗
 */
import moment from 'moment';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, DatePicker, message } from 'antd';

import { DeprecatedCoreForm } from '../../../../../components/core';

const { MonthPicker } = DatePicker;

class CreateModal extends Component {
  static propTypes = {
    isShowCalculate: PropTypes.bool, // 弹窗是否可见
    onHideTrialModal: PropTypes.func,     // 隐藏弹窗的回调函数
    planVersionId: PropTypes.string, // 服务费版本Id
  }
  static defaultProps = {
    isShowCalculate: false,
    onHideTrialModal: () => {},
    planVersionId: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      startDate: undefined,  // 开始试算时间
      endDate: undefined,    // 结束试算时间
    };
    this.private = {
      dispatch: props.dispatch,
    };
  }

  // 创建时间
  onChangeDate = (date, dateString) => {
    this.setState({
      startDate: dateString,
      endDate: dateString,
    });
  }
  // 试算任务回调函数
  onSalaryCallback = () => {
    const { planVersionId } = this.props;
    const params = {
      planVersionId,
      type: 'now',
    };
    const historyParams = {
      planVersionId,
    };
    // 刷新试算历史列表数据
    this.props.dispatch({ type: 'financePlan/fetchSalaryPlanHistoryData', payload: historyParams });
    // 刷新试算结果列表数据
    this.props.dispatch({ type: 'financePlan/fetchSalaryPlanResultsData', payload: params });
  }

  // 失败的回调的错误提示
  onFailurePromptInfo = (res) => {
    message.error(res.zh_message);
  }
  // 提交内容
  onSubmit = () => {
    const { onHideTrialModal, planVersionId } = this.props;
    const { startDate, endDate } = this.state;
    const params = {
      versionId: planVersionId,                               // 服务费方案ID
      fromDate: Number(moment(startDate).format('YYYYMM')), // 试算开始时间
      toDate: Number(moment(endDate).format('YYYYMM')),     // 结束时间
    };
    this.props.form.validateFieldsAndScroll((err) => {
      if (err) {
        return;
      }
      if (planVersionId) {
        this.props.dispatch({
          type: 'financePlan/createSalaryPlanTask',
          payload: {
            params,
            onSuccessCallback: this.onSalaryCallback,
            onFailureCallback: this.onFailurePromptInfo,
          },
        });
      } else {
        message.error('试算失败');
      }
      if (onHideTrialModal) {
        onHideTrialModal();
      }
    });
  }

  // 隐藏弹窗
  onCancel = () => {
    const { onHideTrialModal } = this.props;
    if (onHideTrialModal) {
      onHideTrialModal();
    }
  }

  // 渲染添加标签的表单
  renderCreateForm = () => {
    const { getFieldDecorator } = this.props.form;
    const formItems = [
      {
        label: '试算月份',
        form: getFieldDecorator('trialDate', { rules: [{ required: true, message: '请选择试算的月份' }], initialValue: null })(
          <MonthPicker onChange={this.onChangeDate} />,
        ),
      },
    ];

    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
    );
  }

  render = () => {
    const { isShowCalculate } = this.props;
    const { onSubmit, onCancel } = this;
    return (
      <Modal title="试算月份" visible={isShowCalculate} onOk={onSubmit} onCancel={onCancel} okText="创建" cancelText="取消">
        <Form>
          {/* 渲染表单 */}
          {this.renderCreateForm()}
        </Form>
      </Modal>
    );
  }
}

export default connect()(Form.create()(CreateModal));
