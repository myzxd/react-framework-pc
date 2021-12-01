/**
 * 断租表单模块
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, DatePicker, Input, message } from 'antd';
import React, { Component } from 'react';
import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import { ExpenseHouseState } from '../../../../../../application/define';
import { authorize } from '../../../../../../application';

// 详情页面，加载历史记录使用
import DetailRent from '../../detail/rent';

const { TextArea } = Input;

class Index extends Component {
  static propTypes = {
    orderRecordDetails: PropTypes.array,
    query: PropTypes.object,
  }

  static defaultProps = {
    orderRecordDetails: [],
    query: {},
  }

  // 提交模版
  onSubmitTemplate = (e) => {
    e.preventDefault();
    const { query = {} } = this.props;
    const { recordId } = query;
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('错误', err);
      }
      const params = {
        order_id: recordId,
        relet_break_date: moment(values.contractDateRanage).format('YYYY-MM-DD'),
        remain_money: parseFloat(values.leftMoney),
        desc: values.note,
      };
      this.props.dispatch({
        type: 'approval/typeApplyEditRentE',
        payload: params,
      });
    });
  }

  // 基础信息
  renderBaseInfo = () => {
    const { orderRecordDetails = [] } = this.props;
    const detail = dot.get(orderRecordDetails, '0', {});

    const formItems = [
      {
        label: '房屋状态',
        form: ExpenseHouseState.description(ExpenseHouseState.break),
      }, {
        label: '申请人',
        form: dot.get(detail, 'applyName', authorize.account.name),
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent title="基础信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 费用信息
  renderRentInfo = () => {
    const { orderRecordDetails = [], form = {} } = this.props;
    const detail = dot.get(orderRecordDetails, '0', {});

    const { getFieldDecorator } = form;

    const formItems = [
      {
        label: '余额(注：断租退回余额)',
        form: getFieldDecorator('leftMoney', {
          initialValue: dot.get(detail, 'remain_money', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="" addonAfter="元" />,
          ),
      }, {
        label: '断租时间',
        form: getFieldDecorator('contractDateRanage', {
          initialValue: moment(dot.get(detail, 'relet_break_date'), 'YYYY-MM-DD'),
          rules: [{ required: true, message: '请填写内容' }] })(
            <DatePicker />,
          ),
      }, {
        label: '备注',
        form: getFieldDecorator('note', { initialValue: undefined })(
          <TextArea rows={2} />,
        ),
      },

    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    return (
      <CoreContent title="费用信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 历史信息
  renderHistoryInfo = () => {
    const { orderRecordDetails = [] } = this.props;
    const detail = dot.get(orderRecordDetails, '0', {});

    const list = dot.get(detail, 'history_id_list', []);
    return (
      <CoreContent title="历史信息">
        {list.map((item, index) => {
          return <DetailRent key={index} detail={item} />;
        })}
      </CoreContent>
    );
  }

  render = () => {
    return (
      <Form layout="horizontal" onSubmit={this.onSubmitTemplate}>
        {/* 基础信息 */}
        {this.renderBaseInfo()}

        {/* 费用信息 */}
        {this.renderRentInfo()}

        {/* 历史信息 */}
        {this.renderHistoryInfo()}

        {/* 表单提交按钮 */}
        <CoreContent style={{ textAlign: 'center', backgroundColor: '#ffffff' }} >
          <Button type="primary" htmlType="submit">提交</Button>
        </CoreContent>
      </Form>
    );
  }
}

function mapStateToProps({ approval: { orderRecordDetails } }) {
  return { orderRecordDetails };
}
export default connect(mapStateToProps)(Form.create()(Index));
