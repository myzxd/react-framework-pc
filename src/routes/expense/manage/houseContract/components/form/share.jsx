/**
 * 房屋管理/新建(编辑)/分摊信息
 */

import React, { Component } from 'react';
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import {
  Radio,
  Input,
  DatePicker,
} from 'antd';
import {
  CoreContent,
  DeprecatedCoreForm,
  CoreSelect,
} from '../../../../../../components/core';
import CoreUpload from '../../../../components/uploadAmazon';
import Ascription from './ascription';
import style from './style.css';

const { Group: RadioGroup } = Radio;
const { RangePicker } = DatePicker;
const { Option } = CoreSelect;
const { TextArea } = Input;

// 附件的form字段
const attachmentKey = 'attachments';

class HouseInfo extends Component {

  static propTypes = {
    onChangeMigrateFlag: PropTypes.func, // 改变存量合同模式
  };

  constructor(props) {
    super(props);
    this.state = {
      houseContractData: dot.get(''), // 房屋合同信息
      fileList: [],   // 文件列表
    };
    // 上传文件的随机key
    this.private = {
      namespace: `namespace${Math.floor(Math.random() * 100000)}`,
    };
  }

  componentDidMount() {
    const { fileList } = this.state;
    const { form } = this.props;

    // 注册隐藏的表单
    form.getFieldDecorator(attachmentKey, { initialValue: fileList })(<Input hidden />);
  }

  // 存量合同模式改变
  onChangeMigrateFlagR = (e) => {
    const { onChangeMigrateFlag } = this.props;
    if (onChangeMigrateFlag) {
      onChangeMigrateFlag(e.target.value);
    }
  }

  // 上传文件成功回调
  onUploadSuccess = (e) => {
    const list = this.state.fileList;
    list.push(e);
    this.setState({
      fileList: list,
    });
    this.props.form.setFieldsValue({ [attachmentKey]: list });
  }

  // 删除文件
  onDeleteFile = (index) => {
    const list = this.state.fileList;
    list.splice(index, 1);
    this.setState({
      fileList: list,
    });
    this.props.form.setFieldsValue({ [attachmentKey]: list });
  }

  // 渲染首行信息
  renderFirstLineInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const formItems = [
      {
        label: '存量合同录入模式',
        form: getFieldDecorator('migrateFlag', {
          rules: [{
            required: true,
            message: '请选择',
          }],
        })(
          <RadioGroup
            onChange={this.onChangeMigrateFlagR}
          >
            <Radio value={0}>否</Radio>
            <Radio value={1}>是</Radio>
          </RadioGroup>,
        ),
      },
      {
        label: '原OA审批单号',
        form: getFieldDecorator('migrateOaNote', {
          rules: [{
            required: false,
          }],
        })(
          <Input />,
        ),
      },
    ];

    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    return (
      <DeprecatedCoreForm
        items={formItems}
        cols={3}
        layout={layout}
      />
    );
  }

  // 渲染房屋基本信息
  renderBaseInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const formItems = [
      {
        label: '合同租期',
        form: getFieldDecorator('contractDate', {
          initialValue: null,
          rules: [{
            required: true,
            message: '请选择',
          }],
        })(
          <RangePicker />,
        ),
      },
      {
        label: '房屋面积',
        form: getFieldDecorator('area', {
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <Input
            addonAfter={'㎡'}
            type="number"
          />,
        ),
      },
      {
        label: '用途',
        form: getFieldDecorator('usage', {
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <Input />,
        ),
      },
      // {
      //   label: '是否开票',
      //   form: getFieldDecorator('todo', {
      //     rules: [{
      //       required: true,
      //       message: '请选择',
      //     }],
      //   })(
      //     <CoreSelect placeholder="请选择">
      //       <Option value="1">是</Option>
      //       <Option value="0">否</Option>
      //     </CoreSelect>,
      //   ),
      // },
      {
        label: '付款周期（月／次）',
        form: getFieldDecorator('periodMonthNum', {
          rules: [{
            required: true,
            message: '请选择',
          }],
        })(
          <CoreSelect placeholder="请选择付款月数">
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
            <Option value="5">5</Option>
            <Option value="6">6</Option>
            <Option value="7">7</Option>
            <Option value="8">8</Option>
            <Option value="9">9</Option>
            <Option value="10">10</Option>
            <Option value="11">11</Option>
            <Option value="12">12</Option>
          </CoreSelect>,
        ),
      },
      {
        label: '提前付款天数',
        form: getFieldDecorator('planPrepareDays', {
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <Input
            addonAfter={'天'}
            type="number"
          />,
        ),
      },
      {
        label: '月租金',
        form: getFieldDecorator('monthMoney', {
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <Input
            addonAfter={'元'}
            type="number"
          />,
        ),
      },
      {
        label: '已支付租金金额',
        form: getFieldDecorator('initPaidMoney', {
          rules: [{
            required: false,
          }],
        })(
          <Input
            addonAfter={'元'}
            type="number"
          />,
        ),
      },
      {
        label: '已支付租金月数',
        form: getFieldDecorator('initPaidMonthNum', {
          rules: [{
            required: false,
          }],
        })(
          <Input
            addonAfter={'月'}
            type="number"
          />,
        ),
      },
    ];

    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    return (
      <DeprecatedCoreForm
        items={formItems}
        cols={3}
        layout={layout}
      />
    );
  }

  // 渲染归属信息
  renderAscriptionInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const ascriptionKey = 'rent';
    const formItems = [
      {
        label: '',
        form: getFieldDecorator(ascriptionKey, {
          rules: [{
            required: true,
          }],
        })(
          <Ascription
            form={this.props.form}
            objKey={ascriptionKey}
          />,
        ),
      },
    ];

    const layout = {
      labelCol: {
        span: 0,
      },
      wrapperCol: {
        span: 24,
      },
    };

    return (
      <DeprecatedCoreForm
        items={formItems}
        cols={1}
        layout={layout}
      />
    );
  }

  // 渲染收款信息
  renderReceiptInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const formItems = [
      {
        label: '房租收款人',
        form: getFieldDecorator('todo', {
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <Input
            placeholder="请输入姓名"
          />,
        ),
      },
      {
        label: '收款账号',
        form: getFieldDecorator('todo', {
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <Input
            placeholder="请输入卡号"
          />,
        ),
      },
      {
        label: '开户支行',
        form: getFieldDecorator('todo', {
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <Input
            placeholder="请输入全称"
          />,
        ),
      },
    ];

    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    return (
      <DeprecatedCoreForm
        items={formItems}
        cols={3}
        layout={layout}
      />
    );
  }

  // 渲染其他信息
  renderExtraInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const { fileList } = this.state;
    const formItems = [
      {
        label: '备注',
        form: getFieldDecorator('note', {
          rules: [{
            required: false,
          }],
        })(
          <TextArea form={this.props.form} />,
        ),
      },
      {
        label: '上传附件',
        form: (
          <div>
            <CoreUpload
              domain="cost"
              namespace={this.private.namespace}
              onSuccess={this.onUploadSuccess}
              onFailure={this.onUploadFailure}
            />
            {
              fileList.map((item, index) => {
                return (
                  <p key={index}>{item}<span onClick={() => { this.onDeleteFile(index); }} className={style['app-comp-expense-house-contract-from-upload']}>删除</span></p>
                );
              })
            }
          </div>
        ),
      },
    ];
    const layout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 22,
      },
    };
    return (
      <DeprecatedCoreForm
        items={formItems}
        cols={1}
        layout={layout}
      />
    );
  }

  render = () => {
    return (
      <CoreContent title="房屋信息">

        {/* 渲染首行 */}
        {this.renderFirstLineInfo()}

        {/* 渲染基本信息 */}
        {this.renderBaseInfo()}

        {/* 渲染归属信息 */}
        {this.renderAscriptionInfo()}

        {/* 渲染收款信息 */}
        {this.renderReceiptInfo()}

        {/* 渲染其他 */}
        {this.renderExtraInfo()}

      </CoreContent>
    );
  }
}

export default HouseInfo;
