/**
 * 费用管理 - 借还款管理 - 新建/编辑 - 借款人信息组件
 */
import React, { Component } from 'react';
import { Input, message } from 'antd';
import PropTypes from 'prop-types';
import dot from 'dot-prop';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import {
  CommonSelectPlatforms,
  CommonSelectSuppliers,
  CommonSelectCities,
  CommonSelectDistricts,
  CommonSelectDepartmentEmployees,
} from '../../../../../../components/common';
import Utils from '../../../../../../application/utils';
import { DistrictState } from '../../../../../../application/define';

import style from './style.css';

// 命名空间
const namespace = 'BorrowerInfo';
const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

class BorrowerInfo extends Component {

  static propTypes = {
    borrowingDetail: PropTypes.object, // 借款单详情
    form: PropTypes.object, // 表单
    platformCode: PropTypes.string, // 平台
  }

  static defaultProps = {
    borrowingDetail: {}, // 借款单详情
    form: {}, // 表单
    platformCode: '', // 平台
  }

  constructor(props) {
    super(props);
    this.state = {
      cities: dot.get(props.borrowingDetail, 'city_spelling', ''),         // 选中的城市数据
      cityDisabled: false,
      supplierDisabled: false,
    };
  }

  // 修改实际借款人（总部）
  onChangeEmployee = (val, options = {}) => {
    const { form } = this.props;
    const { payload = {} } = options;
    const {
      identity_card_id: identity,
      phone,
      major_department_info: departmentInfo = {},
      name,
    } = payload;

    const departmentName = departmentInfo && Object.keys(departmentInfo).length > 0 ? departmentInfo.name : undefined;

    // 默认带出借款人相关信息
    form.setFieldsValue({ name, identity, phone, teamName: departmentName });
  }

  // 改变平台
  onChangePlatform = (e) => {
    // 平台
    const { platformCode } = this.props;
    if (e && e !== platformCode) {
      message.error('所选平台不在该审批流范围内，请重新选择平台');
      // return;  // 删除return为了清空已选级联数据
    }
    const { setFieldsValue } = this.props.form;
    // 清空已选级联数据
    setFieldsValue({ supplier: '', city: '', district: '' });
    this.setState({ supplierDisabled: true, cityDisabled: true });
  }

  // 改变供应商
  onChangeSupplier = () => {
    const { setFieldsValue } = this.props.form;
    // 清空已选级联数据
    setFieldsValue({ city: '', district: '' });
  }

  // 改变城市
  onChangeCity = (e, options) => {
    const { setFieldsValue } = this.props.form;
    // 商圈接口需要传入city_spell
    if (options && options.props) {
      this.setState({ cities: options.props.spell });
    } else {
      this.setState({ cities: [] });
    }
    // 清空已选级联数据
    setFieldsValue({ district: '' });
  }


  // 渲染归属信息
  renderAttribution = () => {
    const { form, borrowingDetail, platformCode } = this.props;

    // 审批流平台为总部时，不显示
    if (platformCode === 'zongbu') return;

    const { getFieldDecorator, getFieldValue } = form;

    const city = dot.get(borrowingDetail, 'city_code', undefined);

    const initialValues = {
      platform: borrowingDetail.platform_code || '', // 平台初始值
      supplier: borrowingDetail.supplier_id || '', // 供应商初始值
      city: city ? `${city}` : '', // 城市初始值
      district: borrowingDetail.biz_district_id || '', // 商圈初始值
    };

    // 当前选中的平台
    const platforms = getFieldValue('platform') ? [getFieldValue('platform')] : initialValues.platform ? [initialValues.platform] : [];
    // 当前选中的供应商
    const suppliers = getFieldValue('supplier') ? [getFieldValue('supplier')] : initialValues.supplier ? [initialValues.supplier] : [];

    // 费用模块使用fiex city_code
    const isExpenseModel = true;
    const formItems = [
      {
        label: '平台',
        span: 6,
        form: getFieldDecorator('platform', { initialValue: initialValues.platform, rules: [{ required: true, message: '请选择' }] })(
          <CommonSelectPlatforms
            allowClear
            showSearch
            optionFilterProp="children"
            namespace={namespace}
            className={style['app-comp-expense-borrowing-form-platform']}
            onChange={this.onChangePlatform}
          />,
        ),
      },
      {
        label: '供应商',
        span: 12,
        form: getFieldDecorator('supplier', { initialValue: initialValues.supplier, rules: [{ required: true, message: '请选择' }] })(
          <CommonSelectSuppliers
            allowClear
            showSearch
            optionFilterProp="children"
            namespace={namespace}
            className={style['app-comp-expense-borrowing-form-supplier']}
            platforms={platforms}
            onChange={this.onChangeSupplier}
          />,
        ),
      },
      {
        label: '城市',
        span: 6,
        form: getFieldDecorator('city', { initialValue: initialValues.city, rules: [{ required: true, message: '请选择' }] })(
          <CommonSelectCities
            allowClear
            showSearch
            optionFilterProp="children"
            namespace={namespace}
            className={style['app-comp-expense-borrowing-form-city']}
            isExpenseModel={isExpenseModel}
            platforms={platforms}
            suppliers={suppliers}
            onChange={this.onChangeCity}
          />,
        ),
      },
      {
        label: '商圈',
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 10 } },
        form: getFieldDecorator('district', { initialValue: initialValues.district })(
          <CommonSelectDistricts
            allowClear
            showSearch
            state={[DistrictState.enable, DistrictState.preparation]}
            optionFilterProp="children"
            namespace={namespace}
            className={style['app-comp-expense-borrowing-form-district']}
            platforms={platforms}
            suppliers={suppliers}
            cities={this.state.cities || dot.get(borrowingDetail, 'city_spelling', undefined)}
          />,
        ),
      },
    ];
    return <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />;
  }

  // 渲染借款人信息
  renderBorrower = () => {
    const { borrowingDetail, platformCode } = this.props;

    // 审批流平台为总部时，不显示
    if (platformCode === 'zongbu') return;

    const { getFieldDecorator } = this.props.form;
    const initialValues = {
      name: dot.get(borrowingDetail, 'actual_loan_info.name', ''), // 借款人初始值
      identity: dot.get(borrowingDetail, 'actual_loan_info.identity', ''), // 身份证号码初始值
      phone: dot.get(borrowingDetail, 'actual_loan_info.phone', ''), // 手机号初始值
    };
    const formItems = [
      {
        label: '实际借款人',
        form: getFieldDecorator('name', { initialValue: initialValues.name, rules: [{ required: true, message: '请填写' }] })(
          <Input />,
        ),
      },
      {
        label: '身份证号码',
        form: getFieldDecorator('identity', { initialValue: initialValues.identity, rules: [{ required: true, validator: Utils.asyncValidateIdCardNumber }] })(
          <Input />,
        ),
      },
      {
        label: '借款人联系方式',
        form: getFieldDecorator('phone', { initialValue: initialValues.phone, rules: [{ required: true, validator: Utils.asyncValidatePhoneNumber }] })(
          <Input />,
        ),
      },
    ];
    return <DeprecatedCoreForm items={formItems} cols={3} />;
  }

  // 渲染收款信息
  renderRecieved = () => {
    const { borrowingDetail } = this.props;
    const { getFieldDecorator } = this.props.form;
    const initialValues = {
      cardNum: dot.get(borrowingDetail, 'payee_account_info.card_num', ''), // 收款账户初始值
      bankName: dot.get(borrowingDetail, 'payee_account_info.bank_details', ''), // 开户支行初始值
    };
    const formItems = [
      {
        label: '收款账户',
        form: getFieldDecorator('cardNum', { initialValue: initialValues.cardNum, rules: [{ required: true, message: '请填写' }] })(
          <Input />,
        ),
      },
      {
        label: '开户支行',
        form: getFieldDecorator('bankName', { initialValue: initialValues.bankName, rules: [{ required: true, message: '请填写' }] })(
          <Input />,
        ),
      },
    ];
    return <DeprecatedCoreForm items={formItems} cols={3} />;
  }

  // 总部借款人信息
  renderHeadquarters = () => {
    const { borrowingDetail, platformCode } = this.props;

    if (platformCode !== 'zongbu') return;

    const { getFieldDecorator } = this.props.form;
    const initialValues = {
      employeeId: dot.get(borrowingDetail, 'actual_loan_info.actual_loan_employee_id', ''), // 借款人初始值
      identity: dot.get(borrowingDetail, 'actual_loan_info.identity', ''), // 身份证号初始值
      phone: dot.get(borrowingDetail, 'actual_loan_info.phone', ''), // 手机号初始值
      teamName: dot.get(borrowingDetail, 'actual_loan_info.department_name', ''), // 团队信息初始值
    };
    const formItems = [
      {
        label: '实际借款人',
        form: getFieldDecorator('employeeId', { initialValue: initialValues.employeeId })(
          <CommonSelectDepartmentEmployees
            showSearch
            allowClear
            optionFilterProp="children"
            onChange={this.onChangeEmployee}
            style={{ width: '100%' }}
          />,
        ),
      },
      {
        label: '团队信息',
        form: getFieldDecorator('teamName', { initialValue: initialValues.teamName, rules: [{ required: true, message: '请填写' }] })(
          <Input disabled />,
        ),
      },
      {
        label: '身份证号码',
        form: getFieldDecorator('identity', { initialValue: initialValues.identity, rules: [{ required: true, validator: Utils.asyncValidateIdCardNumber }] })(
          <Input disabled />,
        ),
      },
      {
        label: '借款人联系方式',
        form: getFieldDecorator('phone', { initialValue: initialValues.phone, rules: [{ required: true, validator: Utils.asyncValidatePhoneNumber }] })(
          <Input disabled />,
        ),
      },
    ];
    return <DeprecatedCoreForm items={formItems} cols={3} />;
  }

  // 渲染隐藏表单（总部）
  renderHiddenForm = () => {
    const { form, borrowingDetail, platformCode } = this.props;

    if (platformCode !== 'zongbu') return;

    const name = dot.get(borrowingDetail, 'actual_loan_info.name', '');

    const formItems = [
      {
        label: '',
        form: form.getFieldDecorator('name', { initialValue: name })(<Input hidden />),
      },
    ];

    return (
      <DeprecatedCoreForm
        style={{ display: 'none' }}
        items={formItems}
        cols={1}
        layout={layout}
      />
    );
  }

  render = () => {
    return (
      <CoreContent title="借款人信息">
        {/* 渲染总部借款人信息 */}
        {this.renderHeadquarters()}
        {/* 渲染归属信息 */}
        {this.renderAttribution()}
        {/* 渲染借款人信息 */}
        {this.renderBorrower()}
        {/* 渲染首款信息 */}
        {this.renderRecieved()}
        {/* 渲染总部隐藏表单 */}
        {this.renderHiddenForm()}
      </CoreContent>
    );
  }
}

export default BorrowerInfo;
