/**
 * 审批流设置 - 编辑审批流页面 - 服务费方案 - 组件 /Expense/ExamineFlow/Config
 */
import dot from 'dot-prop';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CopyOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button } from 'antd';
import { DeprecatedCoreForm } from '../../../../../../components/core';
import { authorize } from '../../../../../../application';
import { CommonSelectSuppliers, CommonSelectDistricts, CommonSelectCities, CommonSelectExamineFlows } from '../../../../../../components/common';
import { SupplierState, SalaryPlanExamineFlowApplyRange, ExpenseCostOrderBizType, OaApplicationOrderType } from '../../../../../../application/define';

import style from './style.css';

// 子项目配置项
const itemsConfig = {
  openCreate: 'openCreate',
  openDelete: 'openDelete',
};

class Item extends Component {
  static propTypes = {
    value: PropTypes.object,
    platformCodes: PropTypes.string,
    config: PropTypes.array,
    isEdit: PropTypes.bool,
    onChange: PropTypes.func,
    uniqueKey: PropTypes.string,
    operateKey: PropTypes.number,
    onCreate: PropTypes.func,
    onDelete: PropTypes.func,
    onCopy: PropTypes.func,
  }

  static defaultProps = {
    value: {},
    platformCodes: '',
    config: [],
    isEdit: true,
    onChange: () => {},
    uniqueKey: '',
    operateKey: 0,
    onCreate: () => {},
    onDelete: () => {},
    onCopy: () => {},
  }

  // 回调事件 修改配置项的回调，更新父组件examineFlowConfig(审批流配置)
  onChange = (value) => {
    const { operateKey: key, onChange, uniqueKey } = this.props;
    onChange && onChange(key, { ...value, uniqueKey });
  }

  // 修改审批流
  onChangeExamineFlow = (e, options) => {
    const { value = {} } = this.props;
    const platformName = options.name;
    // 获取审批流name
    this.onChange({
      ...value,
      platformName,
      examineFlow: e,
    });
  }

  // 修改供应商
  onChangeSupplier = (e, options, isSelectedAll) => {
    const { value = {}, form } = this.props;
    const { examineFlow, platformName } = value;
    let { domain } = value;

    // 取出当前选中项对应的name值
    const supplierName = [];
    options.forEach((item) => {
      supplierName.push(dot.get(item, 'props.children', ''));
    });

    // 如果供应商没有全选，则审批流配置适用范围为供应商
    if (isSelectedAll !== true) {
      domain = SalaryPlanExamineFlowApplyRange.supplier;
    }

    // 如果供应商全选，则审批流配置适用范围为平台
    if (isSelectedAll === true) {
      domain = SalaryPlanExamineFlowApplyRange.platform;
    }

    this.onChange({
      examineFlow,
      supplier: e,
      city: [],
      cityCodes: [],
      district: [],
      domain,
      supplierName,
      cityName: [],
      districtName: [],
      platformName,
    });

    // 重置选项
    form.setFieldsValue({ cities: [] });
    form.setFieldsValue({ districts: [] });
  }

  // 修改城市
  onChangeCity = (e, options, isSelectedAll) => {
    const { value = {}, form } = this.props;
    const { examineFlow, supplier, supplierName, platformName } = value;
    let { domain } = value;

    // 取出所选项对应的name值，用于文本显示
    const cityName = [];
    options.forEach((item) => {
      cityName.push(dot.get(item, 'props.children', ''));
    });

    // 如果城市全选
    if (isSelectedAll === true) {
      domain = SalaryPlanExamineFlowApplyRange.supplier;
    }

    // 如果城市全选，并且之前适用范围是平台，那么适用范围为平台
    if (isSelectedAll === true && domain === SalaryPlanExamineFlowApplyRange.platform) {
      domain = SalaryPlanExamineFlowApplyRange.platform;
    }

    // 如果城市全选，并且之前适用范围是供应商，那么适用范围为供应商
    if (isSelectedAll === true && domain === SalaryPlanExamineFlowApplyRange.supplier) {
      domain = SalaryPlanExamineFlowApplyRange.supplier;
    }

    // 如果城市全选，并且之前适用范围为城市或者商圈，则此次适用范围为供应商
    if (isSelectedAll === true && (domain === SalaryPlanExamineFlowApplyRange.city || domain === SalaryPlanExamineFlowApplyRange.district)) {
      domain = SalaryPlanExamineFlowApplyRange.supplier;
    }

    // 如果城市全选，并且选中的城市只有一项，则适用范围为城市
    if (isSelectedAll === true && e.length === 1) {
      domain = SalaryPlanExamineFlowApplyRange.city;
    }

    // 如果城市没有全选，则适用范围为城市
    if (isSelectedAll !== true) {
      domain = SalaryPlanExamineFlowApplyRange.city;
    }

    // city_spelling
    const city = options.map(item => item.props.spell);

    this.onChange({
      examineFlow,
      supplier,
      city,
      cityCodes: e,
      district: [],
      domain,
      platformName,
      supplierName,
      cityName,
      districtName: [],
    });

    // 重置选项
    form.setFieldsValue({ districts: [] });
  }

  // 修改商圈
  onChangeDistrict = (e, options, isSelectedAll) => {
    const { value = {} } = this.props;
    const { examineFlow, supplier, city, cityCodes, supplierName, cityName, platformName } = value;
    let { domain } = value;

    // 取出所选项对应的name值，用于文本显示
    const districtName = [];
    options.forEach((item) => {
      districtName.push(dot.get(item, 'props.children', ''));
    });

    // 如果商圈全选，并且之前适用范围是平台，则适用范围为平台
    if (isSelectedAll === true && domain === SalaryPlanExamineFlowApplyRange.platform) {
      domain = SalaryPlanExamineFlowApplyRange.platform;
    }

    // 如果商圈全选，并且之前适用范围是供应商，则适用范围为供应商
    if (isSelectedAll === true && domain === SalaryPlanExamineFlowApplyRange.supplier) {
      domain = SalaryPlanExamineFlowApplyRange.supplier;
    }

    // 如果商圈全选，并且之前适用范围是城市，则适用范围为城市
    if (isSelectedAll === true && domain === SalaryPlanExamineFlowApplyRange.city) {
      domain = SalaryPlanExamineFlowApplyRange.city;
    }

    // 如果商圈全选，并且之前适用范围为商圈，则此次适用范围为城市
    if (isSelectedAll === true && domain === SalaryPlanExamineFlowApplyRange.district) {
      domain = SalaryPlanExamineFlowApplyRange.city;
    }

    // 如果商圈全选，并且所选商圈只有一项，则适用范围为商圈
    if (isSelectedAll === true && e.length === 1) {
      domain = SalaryPlanExamineFlowApplyRange.district;
    }

    // 如果商圈全选，并且之前的适用范围为商圈，则此次适用范围为城市
    if (isSelectedAll === true && domain === SalaryPlanExamineFlowApplyRange.district) {
      domain = SalaryPlanExamineFlowApplyRange.city;
    }

    // 如果商圈没有全选，则适用范围为商圈
    if (isSelectedAll !== true) {
      domain = SalaryPlanExamineFlowApplyRange.district;
    }

    this.onChange({
      examineFlow,
      supplier,
      city,
      cityCodes,
      district: e,
      domain,
      platformName,
      supplierName,
      cityName,
      districtName,
    });
  }

  // 创建操作的回调
  onCreate = () => {
    const { operateKey: key, onCreate } = this.props;
    onCreate && onCreate(key);
  }

  // 删除操作的回调
  onDelete = () => {
    const { operateKey: key, onDelete } = this.props;
    onDelete && onDelete(key);
  }

  // 复制操作的回调
  onCopy = () => {
    const { onCopy, value } = this.props;
    if (onCopy) {
      onCopy(value);
    }
  }

  // 渲染文本
  renderDetail = () => {
    const {
      value = {},
      form = {},
      platformCodes,
    } = this.props;
    const { getFieldDecorator } = form;
    const {
      supplierName,
      cityName,
      districtName,
      platformName,
    } = value;

    const formItems = [
      {
        label: '审批流',
        span: 5,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('examineFlowName', { rules: [{ required: true }] })(
          <span>{platformName}</span>,
        ),
      }, {
        label: '平台',
        span: 2,
        layout: { labelCol: { span: 12 }, wrapperCol: { span: 12 } },
        form: <span>{ authorize.platformFilter(platformCodes) }</span>,
      }, {
        label: '供应商',
        span: 5,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 16, style: { overflowY: 'auto', maxHeight: '80px' } } },
        form: getFieldDecorator('suppliersName', { rules: [{ required: true }] })(
          <div>{supplierName ? supplierName.map((item, index) => <p key={index}>{item}</p>) : ''}</div>,
        ),
      }, {
        label: '城市',
        span: 4,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 16, style: { overflowY: 'auto', maxHeight: '80px' } } },
        form: getFieldDecorator('citiesName', { rules: [{ required: true }] })(
          <div>{cityName ? cityName.map((item, index) => <p key={index}>{item}</p>) : ''}</div>,
        ),
      }, {
        label: '商圈',
        span: 5,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 18, style: { overflowY: 'auto', maxHeight: '80px' } } },
        form: getFieldDecorator('districtsName', { rules: [{ required: true }] })(
          <div>{districtName ? districtName.map((item, index) => <p key={index}>{item}</p>) : ''}</div>,
        ),
      },
    ];

    return formItems;
  }

  // 渲染表单
  renderForm = () => {
    const {
      value = {},
      form = {},
      uniqueKey = undefined,
      platformCodes,
    } = this.props;

    const { getFieldDecorator } = form;
    const {
      supplier = [], // 供应商
      city = [], // 城市spelling
      cityCodes = [], // 城市code
      district = [], // 商圈
      examineFlow = undefined,
    } = value;

    const formItems = [
      {
        label: '审批流',
        span: 5,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('examineFlow', { rules: [{ required: true, message: '请选择审批流' }], initialValue: examineFlow || [] })(
          <CommonSelectExamineFlows
            className={style['app-comp-expense-salary-plan-component-examine-flow']}
            namespace={uniqueKey}
            placeholder="请选择审批流"
            platformCodes={platformCodes}
            bizType={ExpenseCostOrderBizType.noCostOf}
            onChange={this.onChangeExamineFlow}
            approvalType={OaApplicationOrderType.salaryRules}
          />,
          ),
      }, {
        label: '平台',
        span: 2,
        layout: { labelCol: { span: 12 }, wrapperCol: { span: 12 } },
        form: <span>{ authorize.platformFilter(platformCodes) }</span>,
      }, {
        label: '供应商',
        span: 5,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('suppliers', { rules: [{ required: true, message: '请选择供应商' }], initialValue: supplier || [] })(
          <CommonSelectSuppliers
            style={{ width: '100%' }}
            className="maxHeight"
            mode="multiple"
            showArrow
            allowClear
            enableSelectAll
            optionFilterProp="children"
            placeholder="请选择供应商"
            namespace={uniqueKey}
            state={SupplierState.enable}
            platforms={platformCodes}
            onChange={this.onChangeSupplier}
          />,
        ),
      }, {
        label: '城市',
        span: 4,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('cities', { rules: [{ required: true, message: '请选择城市' }], initialValue: cityCodes || [] })(
          <CommonSelectCities
            style={{ width: '100%' }}
            className="maxHeight"
            mode="multiple"
            showArrow
            allowClear
            enableSelectAll
            isExpenseModel
            placeholder="请选择城市"
            optionFilterProp="children"
            namespace={uniqueKey}
            platforms={platformCodes}
            suppliers={supplier}
            onChange={this.onChangeCity}
          />,
        ),
      }, {
        label: '商圈',
        span: 5,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
        form: getFieldDecorator('districts', { rules: [{ required: true, message: '请选择商圈' }], initialValue: district || [] })(
          <CommonSelectDistricts
            style={{ width: '100%' }}
            className="maxHeight"
            mode="multiple"
            showArrow
            allowClear
            enableSelectAll
            placeholder="请选择商圈"
            optionFilterProp="children"
            namespace={uniqueKey}
            platforms={platformCodes}
            suppliers={supplier}
            cities={city}
            onChange={this.onChangeDistrict}
          />,
        ),
      },
    ];

    return formItems;
  }

  render() {
    const { config = [], isEdit = false } = this.props;
    const formItems = isEdit ? this.renderForm() : this.renderDetail();

    // 根据当前子项目的配置项，判断当前子项目数据在审批流配置数据中的位置
    // 如果子项目是最后一条数据，并且审批流配置数据数组长度不等于1，则显示添加、删除、拷贝按钮
    if (config.includes(itemsConfig.openCreate) && config.includes(itemsConfig.openDelete)) {
      formItems[formItems.length] = {
        span: 3,
        layout: { labelCol: { span: 0 }, wrapperCol: { span: 22, push: 2 } },
        form: (
          <div>
            <Button className={style['app-comp-expense-salary-plan-component-copy']} onClick={this.onCreate} shape="circle" icon={<PlusOutlined />} />
            <Button className={style['app-comp-expense-salary-plan-component-copy']} onClick={this.onDelete} shape="circle" icon={<MinusOutlined />} />
            <Button shape="circle" icon={<CopyOutlined />} onClick={this.onCopy} />
          </div>
        ),
      };
      // 如果子项目是唯一一条数据，则显示添加、拷贝按钮
    } else if (config.includes(itemsConfig.openCreate)) {
      formItems[formItems.length] = {
        span: 3,
        layout: { labelCol: { span: 0 }, wrapperCol: { span: 22, push: 2 } },
        form: (
          <div>
            <Button onClick={this.onCreate} shape="circle" icon={<PlusOutlined />} />
            <Button className={style['app-comp-expense-salary-plan-component-copy-all']} shape="circle" icon={<CopyOutlined />} onClick={this.onCopy} />
          </div>
        ),
      };
      // 如果审批流配置数据数组长度不等于1，并且子项目数据不是最后一项，则显示删除、拷贝按钮
    } else if (config.includes(itemsConfig.openDelete)) {
      formItems[formItems.length] = {
        span: 3,
        layout: { labelCol: { span: 0 }, wrapperCol: { span: 22, push: 2 } },
        form: (
          <div>
            <Button onClick={this.onDelete} shape="circle" icon={<MinusOutlined />} />
            <Button className={style['app-comp-expense-salary-plan-component-copy-all']} shape="circle" icon={<CopyOutlined />} onClick={this.onCopy} />
          </div>
        ),
      };
    }

    return (
      <div>
        <DeprecatedCoreForm items={formItems} />
      </div>
    );
  }
}
const Items = Form.create()(Item);
Items.itemsConfig = itemsConfig;
export default Items;
