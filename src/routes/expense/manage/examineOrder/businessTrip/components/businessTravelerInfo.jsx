/**
 * 出差人信息
 */
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Input, Select } from 'antd';
import React, { Component } from 'react';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import { asyncValidatePhoneNumberNotRequired } from '../../../../../../application/utils';

class BusinessTravelerInfo extends Component {
  static propTypes = {
    businessTripData: PropTypes.object, // 出差申请单详情
    isUpdate: PropTypes.bool,           // 是否是编辑状态
  }

  static defaultProps = {
    businessTripData: {},
    isUpdate: false,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 修改同行人员
  onChangePeerTags = (newValue) => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const noSpaceValue = newValue;
    const newLength = noSpaceValue.length;
    const peerLength = getFieldValue('peer');
    // 当新增标签时去除新增标签的空格
    if (newLength > peerLength) {
      const tmp = noSpaceValue[newLength - 1].replace(/\s+/g, '');
      if (tmp === '') return;
      noSpaceValue[newLength - 1] = tmp;
    }
    setFieldsValue({ peer: noSpaceValue });
  }

  // 渲染表单
  renderForm = () => {
    const { isUpdate, businessTripData } = this.props;
    const {
      apply_user_name: businessTraveler = '', // 实际出差人
      apply_user_phone: phone = '',           // 联系方式
      together_user_names: peer = [],         // 同行人员
    } = businessTripData;
    const { getFieldDecorator } = this.props.form;
    const initBusinessTraveler = isUpdate ? businessTraveler : '';
    const initPhone = isUpdate ? phone : '';
    const initPeer = isUpdate ? peer : [];
    const formItems = [
      {
        label: '实际出差人',
        key: 'businessTraveler',
        form: getFieldDecorator('businessTraveler', {
          initialValue: initBusinessTraveler,
          rules: [{ required: true, message: '请输入内容' }],
        })(
          <Input placeholder="请填写实际出差人" />,
        ),
      },
      {
        label: '联系方式',
        key: 'phone',
        form: getFieldDecorator('phone', {
          initialValue: initPhone,
          rules: [{
            validator: asyncValidatePhoneNumberNotRequired,
          }],
        })(
          <Input placeholder="请填写联系方式" />,
        ),
      },
    ];
    const peerFormItems = [
      {
        label: '同行人员',
        layout: { labelCol: { span: 10 }, wrapperCol: { span: 14 } },
        key: 'peer',
        form: getFieldDecorator('peer', {
          initialValue: initPeer,
        })(
          <Select
            placeholder="请填写同行人员"
            mode="tags"
            notFoundContent=""
            onChange={this.onChangePeerTags}
            tokenSeparators={[',', '，']}
          />,
        ),
      },
      {
        label: '',
        span: 15,
        form: <span>提示：添写完同行人员后，该同行人员将不能进行此次出差申请的重复提报</span>,
      },
    ];
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
    return (
      <div>
        <DeprecatedCoreForm items={formItems} cols={4} layout={layout} />
        <DeprecatedCoreForm items={peerFormItems} cols={4} />
      </div>
    );
  }
  render() {
    return (
      <CoreContent title="出差人信息">
        {this.renderForm()}
      </CoreContent>
    );
  }
}

export default connect()(BusinessTravelerInfo);
