/**
 * 添加供应商
 */
import { connect } from 'dva';
import dot from 'dot-prop';
import React, { useState } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input, message, Spin, Select } from 'antd';

import { CommonSelectPlatforms, CommonSelectCities } from '../../../../components/common';
import { CoreContent, DeprecatedCoreForm } from '../../../../components/core';
import { SupplierState } from '../../../../application/define';
import styles from './style/index.less';

const { Option } = Select;

const Index = (props = {}) => {
  const {
    dispatch,
    location,
    editRecord = {},
    form = {},
  } = props;
  const { id } = location.query;
  // 是否是编辑模式
  const [isEditMode] = useState(!!id);
  // 平台
  const [platforms, setPlatforms] = useState([]);
  // 是否正在提交或移除商圈
  const [loading, setLoading] = useState(false);

  // 提交数据
  const onSubmit = () => {
    form.validateFields((err, values) => {
      if (err) {
        return message.error('添加失败,有未填数据', err);
      }
      // 显示loading
      toggleShowLoading(true);

      // 判断是否是编辑模式
      if (isEditMode) {
        onUpdate(values);
      } else {
        onCreate(values);
      }
    });
  };

  // 创建供应商
  const onCreate = (values) => {
    const payload = {
      ...values,
      onSuccessCallback,
      onDefeatCallback,
    };
    dispatch({ type: 'supplierManage/createSupplier', payload });
  };

  // 编辑供应商
  const onUpdate = (values) => {
    const { name, customId } = values;
    const payload = {
      recordId: editRecord._id,
      state: editRecord.state,
      name,
      customId,
      onSuccessCallback,
      onDefeatCallback,
    };
    props.dispatch({ type: 'supplierManage/updateSupplier', payload });
  };

  // 创建或更新成功的回调函数
  const onSuccessCallback = () => {
    // 隐藏loading
    toggleShowLoading(false);
    window.location.href = '#/System/Supplier/Manage';
  };

  // 创建或更新成功的回调函数
  const onDefeatCallback = () => {
    // 隐藏loading
    toggleShowLoading(false);
  };

  // 更换平台
  const onChangePlatforms = (e) => {
    if (!e) return setPlatforms([]);
    setPlatforms(e);
    // 清空城市
    form.setFieldsValue({ cities: undefined });
  };

  // 显示隐藏loading
  const toggleShowLoading = (flag) => {
    setLoading(flag);
  };

  // 渲染基本信息
  const renderBaseInfo = () => {
    const { getFieldDecorator } = form;
    const editRecords = isEditMode ? editRecord : {};
    const formItems = [
      {
        label: '供应商名称',
        form: getFieldDecorator('name', { rules: [{ required: true, message: '请填写供应商名称' }], initialValue: dot.get(editRecords, 'name') })(
          <Input placeholder="请填写供应商名称" />,
        ),
      },
      {
        label: '供应商ID',
        form: getFieldDecorator('customId', { rules: [{ required: true, message: '请填写供应商ID' }], initialValue: dot.get(editRecords, 'supplier_id') })(
          <Input placeholder="请填写供应商ID" />,
        ),
      },
      {
        label: '统一社会信用代码',
        layout: { labelCol: { span: 12 }, wrapperCol: { span: 12 } },
        form: getFieldDecorator('creditNo', { rules: [{ required: true, message: '请填写内容' }], initialValue: dot.get(editRecords, 'credit_no') })(
          <Input placeholder="请填写内容" disabled={isEditMode} />,
        ),
      },
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    return (
      <CoreContent title="基本信息" style={{ backgroundColor: '#FAFAFA' }}>
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  };

  // 渲染业务范围
  const renderScope = () => {
    const { getFieldDecorator } = props.form;
    const editRecords = isEditMode ? editRecord : {};
    const formItems = [
      {
        label: '平台',
        form: getFieldDecorator('platforms', { rules: [{ required: true, message: '请选择平台' }], initialValue: dot.get(editRecords, 'platform_code', '') })(
          <CommonSelectPlatforms allowClear showSearch optionFilterProp="children" placeholder="请选择平台" onChange={onChangePlatforms} disabled={isEditMode} />,
        ),
      },
      {
        label: '城市',
        form: getFieldDecorator('cities', { rules: [{ required: true, message: '请选择城市' }], initialValue: dot.get(editRecords, 'city_list', []).map(item => item.city_name) })(
          <CommonSelectCities
            allowClear
            showSearch
            enableSelectAll
            mode="multiple"
            showArrow
            optionFilterProp="children"
            placeholder="请选择城市"
            platforms={platforms}
            disabled={platforms.length <= 0 || isEditMode}
          />,
        ),
      },
    ];
    if (isEditMode) {
      formItems.push(
        {
          label: '状态',
          form: getFieldDecorator('state', { rules: [{ required: true, message: '请选择状态' }], initialValue: SupplierState.description(dot.get(editRecords, 'state', '')) })(
            <Select placeholder="请选择状态" disabled>
              {/* 启用 */}
              <Option value={`${SupplierState.enable}`} >{SupplierState.description(SupplierState.enable)}</Option>
              {/* 停用 */}
              <Option value={`${SupplierState.stoped}`} >{SupplierState.description(SupplierState.stoped)}</Option>
            </Select>,
          ),
        },
      );
    }
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    return (
      <CoreContent title="业务范围" style={{ backgroundColor: '#FAFAFA' }}>
        <DeprecatedCoreForm items={formItems} cols={4} layout={layout} />
      </CoreContent>
    );
  };

  return (
    <Form layout="horizontal">
      {/* 渲染加载遮罩 */}
      <Spin spinning={loading}>
        {/* 渲染基本信息 */}
        {renderBaseInfo()}

        {/* 渲染业务范围 */}
        {renderScope()}

        {/* 表单提交按钮 */}
        <CoreContent style={{ textAlign: 'center' }}>
          <Button onClick={() => (window.location.href = '#/System/Supplier/Manage')} className={styles['app-comp-system-form-submit-btn']}>返回</Button>
          <Button type="primary" onClick={onSubmit}>提交</Button>
        </CoreContent>
      </Spin>
    </Form>
  );
};

function mapStateToProps({ supplierManage: { supplierDetail = {} } }) {
  return { editRecord: supplierDetail };
}
export default connect(mapStateToProps)(Form.create()(Index));
