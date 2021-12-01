/**
 * 服务费方案 - 创建弹窗 Finance/Config/Tags
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import moment from 'moment';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Radio, Modal, DatePicker } from 'antd';

import { CommonSelectSuppliers, CommonSelectCities, CommonSelectDistricts, CommonSelectPlatforms } from '../../../../components/common';
import { DeprecatedCoreForm } from '../../../../components/core';
import { SupplierState, ExpenseCostCenterType, FinanceTemplateType } from '../../../../application/define';

const { RangePicker } = DatePicker;

class CreateModal extends Component {
  static propTypes = {
    onHideModal: PropTypes.func,
    isShowModal: PropTypes.bool,
  };

  static defaultProps = {
    onHideModal: () => {},
    isShowModal: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      fields: {
        name: {}, // 创建方案名称
        platforms: '', // 平台
        suppliers: '', // 供应商(页面组件选中使用)
        cities: '', // 城市(页面组件选中使用)
        districts: '', // 商圈
        fromDate: '', // 起始有效时间
        toDate: '', // 结束有效时间
        range: FinanceTemplateType.template, // 选择模板
        scope: ExpenseCostCenterType.city, // 适用范围
      },
      citySpelling: '',
      isShowDistricts: true, // 商圈的是否启用禁用
    };
  }

  // 更换平台
  onChangePlatforms = (e) => {
    const { form } = this.props;
    const { fields } = this.state;
    fields.name.platform = e;
    fields.platforms = e;
    fields.suppliers = '';
    fields.cities = '';
    fields.districts = '';
    this.setState({ fields, citySpelling: '' });

    // 清空选项
    form.setFieldsValue({ suppliers: '' });
    form.setFieldsValue({ cities: '' });
    form.setFieldsValue({ districts: '' });
  }

  // 更换供应商
  onChangeSuppliers = (e) => {
    const { form } = this.props;
    const { fields } = this.state;
    fields.name.supplier = e;
    fields.suppliers = e;
    fields.cities = '';
    fields.districts = '';
    this.setState({ fields, citySpelling: '' });

    // 清空选项
    form.setFieldsValue({ cities: '' });
    form.setFieldsValue({ districts: '' });
  }

  // 更换城市
  onChangeCity = (e, option) => {
    const { form } = this.props;
    const { fields } = this.state;
    const citySpelling = dot.get(option, 'props.spell', '');
    // 保存城市参数
    fields.name.city = e;
    fields.cities = e;
    fields.districts = '';
    this.setState({ fields, citySpelling });
    form.setFieldsValue({ districts: '' });
  }

  // 更换区域
  onChangeDistrict = (e) => {
    const { fields } = this.state;
    // 保存商圈参数
    fields.name.district = e;
    fields.districts = e;
    this.setState({ fields });
  }

  // 适用范围的改变
  onChangeScope = (e) => {
    const { fields } = this.state;
    fields.scope = e.target.value;
    if (e.target.value === ExpenseCostCenterType.district) {
      this.setState({
        isShowDistricts: false,
      });
    } else {
      fields.name.district = '';
      fields.districts = '';
      this.setState({
        fields,
        isShowDistricts: true,
      });
    }
    this.setState({ fields });
  }

  // 更改的时间
  onChangeDate = (date, dateString) => {
    const { fields } = this.state;
    fields.fromDate = dateString[0]; // 起始有效时间
    fields.toDate = dateString[1]; // 结束有效时间
    this.setState({ fields });
  }

  // 选择类型
  onChangeChoice = (e) => {
    const { fields } = this.state;
    fields.range = e.target.value;
    this.setState({ fields });
  }

  // 获取数据的回调函数
  onDirectToInfo = (res) => {
    window.location.href = `/#/Finance/Rules?id=${res.record._id}&type=${res.record.domain}`;
    // 提交后重置
    this.onReset();
  }

  // 提交
  onSubmit = (e) => {
    const { onHideModal } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err) => {
      if (err) {
        return;
      }
      const { fields } = this.state;
      const names = fields.name.district ? `${fields.name.platform}-${fields.name.supplier}-${fields.name.city}-${fields.name.district}` : `${fields.name.platform}-${fields.name.supplier}-${fields.name.city}`;
      const params = {
        name: names,                      // 创建方案名称
        platforms: fields.platforms,            // 平台
        suppliers: fields.suppliers,            // 供应商(页面组件选中使用)
        cities: fields.cities,                  // 城市(页面组件选中使用)
        districts: fields.districts,            // 商圈
        fromDate: Number(moment(fields.fromDate).format('YYYYMMDD')),              // 起始有效时间
        toDate: Number(moment(fields.toDate).format('YYYYMMDD')),                  // 结束有效时间
        range: fields.range,                    // 选择模板
        scope: fields.scope,                    // 适用范围
      };
      this.props.dispatch({
        type: 'financePlan/createSalaryPlanType',
        payload: {
          params,
          onSuccessCallback: this.onDirectToInfo,
        },
      });
      if (onHideModal) {
        onHideModal();
      }
    });
  }
  // 隐藏弹窗
  onCancel = () => {
    const { onHideModal } = this.props;
    if (onHideModal) {
      onHideModal();
    }
    // 重置数据
    this.onReset();
  }

  // 重置数据
  onReset = () => {
    const params = {
      name: [],                 // 创建方案名称
      platforms: '',            // 平台
      suppliers: '',            // 供应商(页面组件选中使用)
      cities: '',               // 城市(页面组件选中使用)
      districts: '',            // 商圈
      fromDate: '',      // 起始有效时间
      toDate: '',       // 结束有效时间
      range: FinanceTemplateType.template, // 选择模板
      scope: ExpenseCostCenterType.city,         // 适用范围
    };
    this.setState({
      fields: params,
      isShowDistricts: true,
      citySpelling: '',
    });
    // 重置表单
    this.props.form.resetFields();
  }

  // 渲染添加标签的表单
  renderCreateForm = () => {
    const { getFieldDecorator } = this.props.form;
    const { platforms, suppliers } = this.state.fields;
    const { citySpelling } = this.state;

    const formItems = [
      {
        label: '平台 :',
        form: getFieldDecorator('platforms', { rules: [{ required: true, message: '请选择平台' }], initialValue: undefined })(
          <CommonSelectPlatforms allowClear showSearch optionFilterProp="children" placeholder="请选择平台" onChange={this.onChangePlatforms} />,
        ),
      }, {
        label: '供应商 :',
        form: getFieldDecorator('suppliers', { rules: [{ required: true, message: '请选择供应商' }], initialValue: undefined })(
          <CommonSelectSuppliers state={SupplierState.enable} allowClear showSearch optionFilterProp="children" platforms={platforms} placeholder="请选择供应商" onChange={this.onChangeSuppliers} />,
        ),
      }, {
        label: '适用范围 :',
        form: getFieldDecorator('state', { rules: [{ required: true, message: '请选择状态' }], initialValue: ExpenseCostCenterType.city })(
          <Radio.Group onChange={this.onChangeScope}>
            <Radio value={ExpenseCostCenterType.city}>{ExpenseCostCenterType.description(ExpenseCostCenterType.city)}</Radio>
            <Radio value={ExpenseCostCenterType.district}>{ExpenseCostCenterType.description(ExpenseCostCenterType.district)}</Radio>
          </Radio.Group>,
        ),
      }, {
        label: '城市 :',
        form: getFieldDecorator('cities', { rules: [{ required: true, message: '请选择城市' }], initialValue: undefined })(
          <CommonSelectCities isExpenseModel enableSelectAll allowClear showSearch optionFilterProp="children" placeholder="请选择城市" platforms={platforms} suppliers={suppliers} onChange={this.onChangeCity} />,
        ),
      }, {
        label: '商圈 :',
        form: getFieldDecorator('districts', { rules: [{ required: !this.state.isShowDistricts, message: '请选择商圈' }], initialValue: undefined })(
          <CommonSelectDistricts
            allowClear
            showSearch
            enableSelectAll
            optionFilterProp="children"
            placeholder="请选择商圈"
            platforms={platforms}
            suppliers={suppliers}
            cities={citySpelling}
            disabled={this.state.isShowDistricts}
            onChange={this.onChangeDistrict}
          />,
        ),
      }, {
        label: '有效时间 :',
        form: getFieldDecorator('effectiveDate', { rules: [{ required: true, message: '请选择有效时间' }], initialValue: null })(
          <RangePicker onChange={this.onChangeDate} format="YYYY-MM-DD" />,
        ),
      },
      {
        label: '选择模板 :',
        form: getFieldDecorator('range', { rules: [{ required: true, message: '请选择状态' }], initialValue: FinanceTemplateType.templates })(
          <Radio.Group onChange={this.onChangeChoice}>
            <Radio value={FinanceTemplateType.templates}>{FinanceTemplateType.description(FinanceTemplateType.templates)}</Radio>
            <Radio value={FinanceTemplateType.empty}>{FinanceTemplateType.description(FinanceTemplateType.empty)}</Radio>
          </Radio.Group>,
        ),
      },
    ];

    const layout = { labelCol: { span: 5 }, wrapperCol: { span: 13 } };
    return (
      <div>
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </div>
    );
  }

  render = () => {
    const { isShowModal: visible = false } = this.props;
    const { onSubmit, onCancel } = this;
    return (
      <Modal title="选择类型" visible={visible} onOk={onSubmit} onCancel={onCancel} okText="创建" cancelText="取消">
        <Form>
          {this.renderCreateForm()}
        </Form>
      </Modal>
    );
  }
}
function mapStateToProps({ financePlan }) {
  return { financePlan };
}
export default connect(mapStateToProps)(Form.create()(CreateModal));
