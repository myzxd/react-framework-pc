/**
 * 工资信息（创建）(废弃)
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Radio, InputNumber } from 'antd';

import { FileType } from '../../../../../../application/define';
import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';

class WageInfo extends Component {
  static propTypes = {
    fileType: PropTypes.string.isRequired,           // 档案类型
  }

  static defaultProps = {
    fileType: '',
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
    // 工资是否拆分
    const isSplitWage = getFieldValue('isSplitWage') || 0;
    const formItems = [
      {
        label: '工资是否拆分',
        key: 'isSplitWage',
        form: getFieldDecorator('isSplitWage', {
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
          rules: [{ required: Boolean(isSplitWage), message: '请填写拆分基数' }],
        })(
          <InputNumber
            disabled={!(isSplitWage)}
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

export default WageInfo;
