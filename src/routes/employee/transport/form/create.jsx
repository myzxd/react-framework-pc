/**
 * 工号管理，新建运力弹窗
 * 未使用
 */
import is from 'is_js';
import moment from 'moment';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Modal, DatePicker } from 'antd';

import ComponentSelectKnight from './components/knight';
import { DeprecatedCoreForm } from '../../../../components/core';
import { CommonSelectDistricts } from '../../../../components/common';
import { asyncValidatePhoneNumber } from '../../../../application/utils';

const { RangePicker } = DatePicker;

class ModalForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        district: undefined,  // 商圈
        name: '',             // 姓名
        phone: '',            // 手机号
        date: undefined,      // 所属时间
        knight: [],           // 骑士信息
        knightName: '',       // 骑士名称
        knightTransportType: '',  // 替跑工号类型
      },
      record: props.record || {},             // 详情数据
      visible: props.visible || false,        // 弹窗是否可见
      disabledDate: props.disabledDate || [], // 不可选择的时间
      onCancle: props.onCancle ? props.onCancle : undefined,   // 隐藏弹窗的回调函数
      onSuccessCallback: props.onSuccessCallback ? props.onSuccessCallback : undefined, // 创建成功的回调函数
    };

    this.private = {
      dispatch: props.dispatch,
    };
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps = (nextProps) => {
    this.setState({
      record: nextProps.record || {},             // 详情数据
      visible: nextProps.visible || false,        // 弹窗是否可见
      disabledDate: nextProps.disabledDate || [], // 不可选择的时间
      onCancle: nextProps.onCancle ? nextProps.onCancle : undefined,   // 隐藏弹窗的回调函数
      onSuccessCallback: nextProps.onSuccessCallback ? nextProps.onSuccessCallback : undefined, // 创建成功的回调函数
    });

    // 隐藏弹窗的时候，重置所有表单
    if (nextProps.visible === false) {
      this.componentReset();
    }
  };

  componentWillUnmount = () => {
    this.componentReset();
  }

  // 修改手机号
  onChangePhone = (e) => {
    const { fields } = this.state;
    fields.phone = e.target.value;
    fields.knight = [];
    fields.knightName = '';
    fields.knightTransportType = '';
    this.setState({ fields });
    this.props.form.setFieldsValue({ knight: [] });
  }

  // 修改骑士
  onChangeKnight = (e, option, knight) => {
    const { fields } = this.state;
    fields.knight = knight.id;
    fields.knightName = knight.name;
    fields.knightTransportType = knight.transportType;
    this.setState({ fields });
  }

  // 创建用户
  onSubmit = (e) => {
    const { record, fields } = this.state;
    const { recordId, supplierId, platformId, cityId } = record;
    const { knight, knightName, knightTransportType } = fields;

    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const { phone, district, dateRange } = values;
      const params = {
        recordId,
        name: knightName,
        phone,
        transportId: knight,
        supplier: supplierId,
        platform: platformId,
        city: cityId,
        district,
        date: dateRange,
        transportType: knightTransportType,
        onSuccessCallback: this.onSuccessCallback,
      };
      this.private.dispatch({ type: 'employeeTransport/createTransportRecord', payload: params });
    });
  }

  // 创建成功的回调函数
  onSuccessCallback = () => {
    const { onSuccessCallback } = this.state;
    if (onSuccessCallback) {
      onSuccessCallback();
    }
  }

  // 隐藏弹窗
  onCancel = () => {
    const { onCancle } = this.state;
    if (onCancle) {
      onCancle();
    }
  }

  // 不可以选择的时间
  isDateDisable = (current) => {
    const { disabledDate } = this.state;
    // 如果不是当月则不能使用
    if (current.month() !== moment().month()) {
      return true;
    }

    // 如果替跑账号时段为空，则可以使用
    if (is.empty(disabledDate)) {
      return false;
    }

    // 是否禁用
    let isDisable = false;
    disabledDate.forEach((item) => {
      // 时间段的开始和结束
      const startDate = moment(item[0], 'YYYY-MM-DD');
      const endDate = moment(item[1], 'YYYY-MM-DD');

      // 判断是否在时间段之内，并且日期等于开始和结束，都设置为禁用
      if (current.isBetween(startDate, endDate, 'day') || current.isSame(startDate, 'day') || current.isSame(endDate, 'day')) {
        isDisable = true;
      }
    });
    return isDisable;
  }

  // 重置组件
  componentReset = () => {
    this.setState({
      fields: {
        district: undefined,  // 商圈
        name: '',             // 姓名
        phone: '',            // 手机号
        date: undefined,      // 所属时间
        knight: [],           // 骑士信息
        knightName: '',       // 骑士名称
      },
      record: {},
    });
    // 重置表单
    this.props.form.resetFields();
  }

  // 渲染创建的表单
  renderCreateForm = () => {
    const { getFieldDecorator } = this.props.form;
    const { record, fields } = this.state;
    const { phone } = fields;
    const { supplierId, supplierName, platformId, platformName, cityId, cityName } = record;

    // 处理数据，查询商圈
    const suppliers = supplierId ? [supplierId] : [];
    const platforms = platformId ? [platformId] : [];
    const cities = cityId ? [cityId] : [];

    const formItems = [
      {
        label: '选择骑士信息',
      }, {
        label: '供应商',
        form: supplierName || '--',
      }, {
        label: '平台',
        form: platformName || '--',
      }, {
        label: '城市',
        form: cityName || '--',
      }, {
        label: '商圈',
        form: getFieldDecorator('district', { rules: [{ required: true, message: '请选择商圈' }], initialValue: undefined })(
          <CommonSelectDistricts allowClear showSearch optionFilterProp="children" placeholder="请选择商圈" platforms={platforms} suppliers={suppliers} cities={cities} />,
        ),
      }, {
        label: '选择时间',
        form: getFieldDecorator('dateRange', { initialValue: null, rules: [{ required: true, message: '请选择时间范围' }] })(
          <RangePicker disabledDate={this.isDateDisable} />,
        ),
      }, {
        label: '手机号',
        form: getFieldDecorator('phone', {
          rules: [{
            required: true,
            validator: asyncValidatePhoneNumber,
          }],
          initialValue: undefined,
        })(
          <Input placeholder="请输入手机号" onChange={this.onChangePhone} />,
        ),
      }, {
        label: '骑士信息确认',
        form: getFieldDecorator('knight')(
          <ComponentSelectKnight placeholder="请选择骑士信息" phone={phone} onChange={this.onChangeKnight} disabled={phone === ''} />,
        ),
      },
    ];

    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
    );
  }

  render = () => {
    const { visible } = this.state;
    const { onSubmit, onCancel } = this;
    return (
      <Modal title="新建运力" visible={visible} onOk={onSubmit} onCancel={onCancel} okText="确认" cancelText="取消">
        <Form>
          {/* 渲染表单 */}
          {this.renderCreateForm()}
        </Form>
      </Modal>
    );
  };
}

export default Form.create()(ModalForm);
