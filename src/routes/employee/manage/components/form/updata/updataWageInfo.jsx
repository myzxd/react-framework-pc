/**
 * 工资信息（编辑）
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Radio, InputNumber } from 'antd';

import { FileType } from '../../../../../../application/define';
import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';

class UpdataWageInfo extends Component {
  static propTypes = {
    employeeDetail: PropTypes.object, // 人员详情
  }

  static defaultProps = {
    employeeDetail: {},
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 更改工资是否拆分事件
  onChangeIsSplitWage = (param) => {
    if (param.target.value === 0) {
      this.props.form.setFieldsValue({ splitBase: undefined });
    }
  }

  // 渲染工资/社保信息表单
  renderForm = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const {
      is_salary_split: initIsSplitWage,                // 工资是否拆分
      split_base: initSplitBase,                       // 拆分基数
    } = this.props.employeeDetail;
    const formItems = [
      {
        label: '工资是否拆分',
        key: 'isSplitWage',
        form: getFieldDecorator('isSplitWage', {
          initialValue: initIsSplitWage ? 1 : 0,
          rules: [{ required: true, message: '请选择是否拆分' }],
        })(
          <Radio.Group onChange={this.onChangeIsSplitWage}>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>,
        ),
      },
      {
        label: '拆分基数',
        key: 'splitBase',
        form: getFieldDecorator('splitBase', {
          initialValue: initSplitBase ? initSplitBase / 100 : undefined,
          rules: [{ required: Boolean(getFieldValue('isSplitWage')), message: '请填写拆分基数' }],
        })(
          <InputNumber
            disabled={!getFieldValue('isSplitWage')}
            min={1}
          />,
        ),
      },
    ];
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
    return (
      <Form layout="horizontal">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </Form>
    );
  }

  render() {
    const { fileType } = this.props;
    return (
      <React.Fragment>
        {
          `${fileType}` === `${FileType.staff}`
          && <CoreContent title="工资信息">
            {/* 渲染工资/社保信息表单 */}
            {this.renderForm()}
          </CoreContent>
        }
      </React.Fragment>
    );
  }
}

export default UpdataWageInfo;
