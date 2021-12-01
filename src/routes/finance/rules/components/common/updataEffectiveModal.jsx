/**
 * 服务费规则 - 修改生效时间弹窗
 */
import { connect } from 'dva';
import PropTypes from 'prop-types';
import moment from 'moment';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { DatePicker, Modal } from 'antd';
import { DeprecatedCoreForm } from '../../../../../components/core';

const { RangePicker } = DatePicker;
const noop = () => {};

class UpdataEffectiveModal extends Component {
  static propTypes = {
    visible: PropTypes.bool,                   // 对话框是否展示
    onChangeModalDisplayState: PropTypes.func, // 对话框展示隐藏切换回调
    planVersionId: PropTypes.string,           // 服务费方案版本id
    fromDate: PropTypes.string,                // 有效时间开始日期
    toDate: PropTypes.string,                  // 有效时间结束日期
  }

  static defaultProps = {
    visible: false,
    onChangeModalDisplayState: noop,
    planVersionId: '',
    fromDate: '',
    toDate: '',
  }

  constructor() {
    super();
    this.state = {
      confirmLoading: false, // 确定按钮是否有loading
    };
  }

  // 更改按钮loading状态
  onChangeLoading = (bool) => {
    this.setState({
      confirmLoading: bool,
    });
  }

  // 请求接口成功回调
  onSuccessCallback = (planVersionId) => {
    const { onChangeModalDisplayState } = this.props;
    if (onChangeModalDisplayState) {
      onChangeModalDisplayState();
    }
    this.onChangeLoading(false);
    this.props.dispatch({ type: 'financePlan/fetchPlanVersionDetailData', payload: { id: planVersionId } });
  }

  // 请求接口失败回调
  onFailureCallback = () => {
    this.onChangeLoading(false);
  }

  handleOk = () => {
    const { planVersionId } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { effectiveDate } = values;
        const payload = {
          id: planVersionId,
          effectiveStart: effectiveDate[0].format('YYYYMMDD'),
          effectiveEnd: effectiveDate[1].format('YYYYMMDD'),
          onSuccessCallback: this.onSuccessCallback.bind(this, planVersionId),
          onFailureCallback: this.onFailureCallback,
        };
        this.onChangeLoading(true);
        this.props.dispatch({ type: 'financePlan/updataEffective', payload });
      }
    });
  }

  handleCancel = () => {
    const { onChangeModalDisplayState } = this.props;
    if (onChangeModalDisplayState) {
      onChangeModalDisplayState();
    }
  }

  renderFormItems = () => {
    const { fromDate, toDate } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItems = [
      {
        label: '有效时间',
        form: getFieldDecorator('effectiveDate', {
          initialValue: fromDate && toDate && [moment(fromDate), moment(toDate)],
          rules: [{ required: true, message: '请选择有效时间' }],
        })(
          <RangePicker />,
          ),
      },
    ];
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
    return (
      <div>
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </div>
    );
  }
  render() {
    const { confirmLoading } = this.state;
    const { visible } = this.props;
    return (
      <div>
        <Modal
          title="修改有效时间"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <Form>
            {this.renderFormItems()}
          </Form>
        </Modal>
      </div>
    );
  }
}

export default connect()(Form.create()(UpdataEffectiveModal));
