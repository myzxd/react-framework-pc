/**
 * 费用管理 - 付款审批 - 红冲审批单 - 红冲费用单
 */
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { Button, message } from 'antd';

import {
  InvoiceAjustAction,
} from '../../../../../application/define';

import InvoiceAdjustForm from './invoiceAdjust'; // 红冲费用单表单
import InvoiceAdjustDetail from './detail'; // 红冲费用单详情
import onVerify from '../../common/verify';

import style from './style.css';

class Index extends Component {
  static propTypes = {
    uniqueKey: PropTypes.number,
    costOrderId: PropTypes.string, // 费用单id
    originalId: PropTypes.string, // 原费用单id
    invoiceAdjustId: PropTypes.string, // 红冲审批单id
    examineDetail: PropTypes.object, // 审批流详情
    examineOrderDetail: PropTypes.object, // 红冲审批单详情
    onUpdate: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    uniqueKey: '',
    costOrderId: '',
    originalId: '',
    invoiceAdjustId: '',
    examineDetail: {},
    examineOrderDetail: {},
    onCancel: () => {},
    onUpdate: () => {},
  }

  static getDerivedStateFromProps(prevProps, oriState) {
    const { costOrderId: prevCostOrderId } = prevProps;
    const { costOrderId } = oriState;
    if (prevCostOrderId !== costOrderId) {
      return { costOrderId: prevCostOrderId, isUpdate: prevCostOrderId ? false : true };
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      isUpdate: false, // 是否可编辑
      costOrderId: undefined || '',
    };
  }

  // 编辑成功
  onUpdateOrder = (res) => {
    const {
      record = {},
      records = [],
    } = res;

    const {
      onUpdate,
      uniqueKey,
    } = this.props;

    // 费用单id
    let costOrderId;

    // 编辑
    if (Object.keys(record).length > 0) {
      costOrderId = record._id;
    }

    // 新建
    if (records.length > 0 && records.length === 1) {
      costOrderId = records[0]._id;
    }

    // 新建
    if (records.length === 2) {
      costOrderId = records[1]._id;
    }

    onUpdate && onUpdate(costOrderId, uniqueKey);

    this.setState({
      isUpdate: false,
    });
  }

  // 保存
  onSave = () => {
    const {
      form,
      dispatch,
      costOrderId, // 费用单id
      invoiceAdjustId, // 红冲审批单id
      originalId, // 原费用单id
    } = this.props;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const isSubmit = onVerify(values, err);

      // 编辑
      if (isSubmit === true) {
        if (costOrderId) {
          dispatch({
            type: 'expenseCostOrder/updateCostOrder',
            payload: {
              id: costOrderId,
              action: InvoiceAjustAction.invoiceAdjust,
              record: values,
              onSuccessCallback: this.onUpdateOrder,
              onFailureCallback: this.onFailureCallback,
            },
          });
          // 新建
        } else {
          dispatch({
            type: 'expenseCostOrder/createCostOrder',
            payload: {
              orderId: invoiceAdjustId,
              costOrderId: originalId,
              action: InvoiceAjustAction.invoiceAdjust,
              records: [values],
              onSuccessCallback: this.onUpdateOrder,
              onFailureCallback: this.onFailureCallback,
            },
          });
        }
      }
    });
  }

  // 删除
  onCancel = () => {
    const {
      dispatch,
      costOrderId, // 费用单id
      invoiceAdjustId, // 红冲审批单id
    } = this.props;

    // 删除审批单
    dispatch({
      type: 'expenseCostOrder/deleteCostOrder',
      payload: {
        orderId: invoiceAdjustId,
        recordIds: [costOrderId],
        onSuccessCallback: this.onCancelCostOrder,
      },
    });
  }

  // 失败回调
  onFailureCallback = (res) => {
    if (res && res.zh_message) {
      return message.error(res.zh_message);
    }
  }

  // 删除成功
  onCancelCostOrder = () => {
    const {
      onCancel,
      uniqueKey,
    } = this.props;

    onCancel && onCancel(uniqueKey);
  }

  // 编辑
  onUpdate = () => {
    this.setState({
      isUpdate: true,
    });
  }

  onSuccessCallback = (id) => {
    const {
      costOrderId,
      dispatch,
    } = this.props;

    if (id === costOrderId) {
      dispatch({
        type: 'expenseCostOrder/fetchNamespaceCostOrderDetail',
        payload: {
          recordId: id,
          namespace: id,
        },
      });
    }
    this.setState({
      isUpdate: false,
    });
  }

  // 内容
  renderContent = () => {
    const {
      isUpdate,
    } = this.state;

    const {
      form,
      examineDetail, // 审批流详情
      examineOrderDetail, // 审批单详情
      costOrderDetail,
      uniqueKey,
    } = this.props;

    return (
      <div
        className={style['app-comp-expense-manage-invoiceAdjust-cost-wrap']}
      >
        <h2
          className={style['app-comp-expense-manage-invoiceAdjust-cost-title']}
        >
          红冲申请单
        </h2>

        {/* 红冲单 */}
        {
          isUpdate
            ?
              (<InvoiceAdjustForm
                form={form}
                uniqueKey={uniqueKey}
                examineDetail={examineDetail}
                costOrderDetail={costOrderDetail}
              />)
            :
              (<InvoiceAdjustDetail
                detail={costOrderDetail}
                examineOrderDetail={examineOrderDetail}
              />)
        }

        {/* 操作 */}
        {this.renderOperate()}
      </div>
    );
  }

  // 操作
  renderOperate = () => {
    const {
      isUpdate,
    } = this.state;

    const {
      costOrderDetail,
    } = this.props;

    const {
      total_money: totalMoney = 0,
    } = costOrderDetail;

    const disabled = totalMoney < 0;

    if (isUpdate) {
      return (
        <div
          className={style['app-comp-expense-manage-invoiceAdjust-cost-operate']}
        >
          <Button
            type="primary"
            onClick={this.onSave}
            disabled={disabled}
          >
            保存
          </Button>
        </div>
      );
    }

    return (
      <div
        className={style['app-comp-expense-invoiceAdjust-operate-wrap']}
      >
        <Button
          type="primary"
          onClick={this.onCancel}
          disabled={disabled}
        >
          删除
        </Button>
        <Button
          type="primary"
          onClick={this.onUpdate}
          disabled={disabled}
          className={style['app-comp-expense-invoiceAdjust-operate-done']}
        >
          编辑
        </Button>
      </div>
    );
  }

  render() {
    return this.renderContent();
  }
}

export default connect()(Form.create()(Index));
