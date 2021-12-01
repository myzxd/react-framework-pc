/**
 * 费用分组编辑页面 /Expense/Type/Update
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input, Select } from 'antd';

import style from './style.css';

import { CoreContent, DeprecatedCoreForm } from '../../../components/core';
import { CommonSelectScene } from '../../../components/common';
import { OaCostAccountingState } from '../../../application/define';

const { Option } = Select;
const { TextArea } = Input;

class Index extends Component {
  static propsTypes = {
    expenseTypeDetail: PropTypes.object,
    subjectsData: PropTypes.object,
  };

  static defaultProps = {
    expenseTypeDetail: {},
    subjectsData: {},
  };

  constructor() {
    super();
    this.state = {
      scense: undefined,
    };
  }

  // 默认加载数据
  componentDidMount() {
    // 适用场景
    const scense = dot.get(this.props, 'location.query.scense', undefined);
    this.props.dispatch({ type: 'expenseSubject/fetchExpenseSubjects',
      payload: {
        page: 1,
        limit: 100000,
        state: [OaCostAccountingState.normal, OaCostAccountingState.disable], // 状态 默认显示正常的
        scense,
      } });
  }

  onChangeScense = (val) => {
    const { scense } = this.state;
    const { form } = this.props;
    form.setFieldsValue({ accountingIds: undefined });
    // 获取最后一级科目数据
    val !== scense && (this.props.dispatch({
      type: 'expenseSubject/fetchExpenseSubjects',
      payload: {
        page: 1,
        limit: 100000,
        state: [OaCostAccountingState.normal, OaCostAccountingState.disable], // 状态 默认显示正常的
        scense: val,
      },
    }));

    this.setState({ scense: val });
  }

  // 确认编辑
  onSubmit = (e) => {
    const { expenseTypeDetail: detail = {} } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          id: detail.id,
          ...values,
        };
        this.props.dispatch({
          type: 'expenseType/updateExpenseType',
          payload: {
            ...params,
            onSuccessCallback: this.onSuccessCallback,
          },
        });
      }
    });
  }

  // 成功回调
  onSuccessCallback = () => {
    window.location.href = '/#/Expense/Type';
  }

  // 渲染表单
  renderForm = () => {
    const { expenseTypeDetail: detail = {}, subjectsData: { data = [] } = {} } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItems = [
      {
        label: '费用分组名称',
        form: getFieldDecorator('name', { initialValue: dot.get(detail, 'name'), rules: [{ required: true, message: '请填写名称' }, { max: 20, message: '字数过多' }] })(
          <Input placeholder="请输入" />,
        ),
      },
      {
        label: '适用场景',
        form: getFieldDecorator('scense', { rules: [{ required: true, message: '请选择适用场景' }], initialValue: dot.get(detail, 'industryCodes.0', undefined) })(
          <CommonSelectScene enumeratedType="subjectScense" onChange={this.onChangeScense} />,
        ),
      },
      {
        label: '选择科目',
        form: getFieldDecorator('accountingIds', { initialValue: dot.get(detail, 'accountingIds'), rules: [{ required: true, message: '请选择科目' }] })(
          <Select
            placeholder="请选择"
            mode="multiple"
            showSearch
            optionFilterProp="children"
            allowClear
            showArrow
          >
            {
              data.map((item) => {
                return (
                  <Option
                    key={item.id}
                    value={item.id}
                    disabled={item.state === OaCostAccountingState.disable}
                  >
                    {`${item.name}(${item.accountingCode})${item.state === OaCostAccountingState.disable ? '(停用)' : ''}`}
                  </Option>
                );
              })
            }
          </Select>,
        ),
      },
      {
        label: '备注',
        form: getFieldDecorator('note', { rules: [{ max: 1000, message: '字数过多' }], initialValue: detail.note })(
          <TextArea autoSize={{ minRows: 5 }} placeholder="(选填)" />,
        ),
      },
    ];
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 12 } };
    return (
      <CoreContent title="编辑费用分组">
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </CoreContent>
    );
  }

  // 表单提交按钮
  renderButton = () => {
    return (
      <CoreContent style={{ textAlign: 'center', backgroundColor: '#ffffff' }} >
        <Button type="primary" htmlType="submit" className={style['app-comp-expense-type-update-submit']} >确定</Button>
        <Button type="default" onClick={() => { window.location.href = '/#/Expense/Type'; }}>取消</Button>
      </CoreContent>
    );
  }

  render = () => {
    return (
      <Form onSubmit={this.onSubmit}>
        {/* 渲染表单 */}
        {this.renderForm()}

        {/* 表单提交按钮 */}
        {this.renderButton()}
      </Form>
    );
  }
}

function mapStateToProps({
  expenseSubject: { subjectsData },
  expenseType: { expenseTypeDetail } }) {
  return { subjectsData, expenseTypeDetail };
}
export default connect(mapStateToProps)(Form.create()(Index));
