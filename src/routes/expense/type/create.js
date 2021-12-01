/**
 * 费用分组新建页面 /Expense/Type/Create
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, Button, Input } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../components/core';
import { CommonSelectScene } from '../../../components/common';
import { OaCostAccountingState } from '../../../application/define';

import style from './style.css';

const { Option } = Select;
const { TextArea } = Input;

class Index extends Component {

  constructor() {
    super();
    this.state = {
      scense: undefined,
    };
    this.private = {
      searchParams: {},
    };
  }
  // 默认加载数据
  componentDidMount() {
    const params = {
      page: 1,
      limit: 100000,
      state: [OaCostAccountingState.normal],
    };

    // 获取最后一级科目数据
    this.props.dispatch({
      type: 'expenseSubject/fetchExpenseLowlevelSubjects',
      payload: params,
    });
  }

  // 确认创建
  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({ type: 'expenseType/createExpenseType', payload: { ...values, onSuccessCallback: this.onSuccessCallback } });
      }
    });
  }

  onChangeScense = (val) => {
    const { scense } = this.state;
    const { form } = this.props;
    form.setFieldsValue({ accountingIds: undefined });
    // 获取最后一级科目数据
    val !== scense && (this.props.dispatch({
      type: 'expenseSubject/fetchExpenseLowlevelSubjects',
      payload: {
        page: 1,
        limit: 100000,
        state: [OaCostAccountingState.normal],
        scense: val,
      },
    }));

    this.setState({ scense: val });
  }

  // 成功回调
  onSuccessCallback = () => {
    window.location.href = '/#/Expense/Type';
  }

  // 渲染表单
  renderForm = () => {
    const { getFieldDecorator } = this.props.form;

    // 最后一级科目数据
    const { lowLevelSubjectsData } = this.props;

    // 最后一级科目数据
    const subjectsDatas = dot.get(lowLevelSubjectsData, 'data', []);

    const formItems = [
      {
        label: '费用分组名称',
        form: getFieldDecorator('name', { rules: [{ required: true, message: '请填写名称' }, { max: 20, message: '字数过多' }] })(
          <Input placeholder="请输入" />,
        ),
      },
      {
        label: '适用场景',
        form: getFieldDecorator('scense', { rules: [{ required: true, message: '请选择适用场景' }] })(
          <CommonSelectScene enumeratedType="subjectScense" onChange={this.onChangeScense} />,
        ),
      },
      {
        label: '选择科目',
        form: getFieldDecorator('accountingIds', { rules: [{ required: true, message: '请选择科目' }] })(
          <Select
            placeholder="请选择"
            mode="multiple"
            showSearch
            optionFilterProp="children"
            allowClear
            showArrow
          >
            {
              subjectsDatas.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>{item.name}({item.accountingCode}) </Option>
                );
              })
            }
          </Select>,
        ),
      },
      {
        label: '备注',
        form: getFieldDecorator('note', { rules: [{ max: 1000, message: '字数过多' }] })(
          <TextArea autoSize={{ minRows: 5 }} placeholder="(选填)" />,
        ),
      },
    ];
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 12 } };
    return (
      <CoreContent title="新增费用分组">
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </CoreContent>
    );
  }

  // 表单提交按钮
  renderButton = () => {
    return (
      <CoreContent style={{ textAlign: 'center', backgroundColor: '#ffffff' }} >
        <Button type="primary" htmlType="submit" className={style['app-comp-expense-type-accounting-list-create-submit']} >确定</Button>
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

function mapStateToProps({ expenseSubject: { lowLevelSubjectsData } }) {
  return { lowLevelSubjectsData };
}
export default connect(mapStateToProps)(Form.create()(Index));
