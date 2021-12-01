/**
 * 合同归属设置列表 - 合同归属编辑 - 新增弹窗
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '@ant-design/compatible/assets/index.css';
import { Modal, Form } from 'antd';

import { CoreForm } from '../../../../../components/core';
import { CommonSelectPlatforms, CommonSelectSuppliers, CommonSelectContractCities } from '../../../../../components/common';
import { SupplierState } from '../../../../../application/define';
import TemplateSelect from './templateSelect';

const CreateModal = (props = {}) => {
  const {
    onCancel,  // 可见状态变更回调
    visible,         // 是否显示弹窗
    id = undefined,
    dispatch,
  } = props;
  const [form] = Form.useForm();
  // 平台
  const [platforms, setPlatforms] = useState(undefined);
  // 供应商(页面组件选中使用)
  const [suppliers, setSuppliers] = useState(undefined);
  // 所属场景
  const [industry, setIndustry] = useState(undefined);

  // 清除表单内容
  useEffect(() => {
    onReset();
  }, [visible]);


  // 更新编辑列表页
  const onUpdateList = () => {
    onReset();
    onCancel();
    if (id !== undefined) {
      dispatch({ type: 'systemManage/fetchContractConfigurationList', payload: { id } });
    }
  };

  // 添加项目
  const onSubmit = async () => {
    const formValues = await form.validateFields();
    const params = { ...formValues, industry, id, onSuccessCallback: onUpdateList };
    dispatch({ type: 'systemManage/contractUpdateCreate', payload: params });
  };

  // 取消
  const onHideCancel = () => {
    // 回调函数，提交
    if (onCancel) {
      onCancel();
    }

    // 重置
    onReset();
  };


  // 重制state
  const onReset = () => {
    setIndustry(undefined); // 所属场景
    setPlatforms(undefined); // 平台
    setSuppliers(undefined); // 供应商
    // 重置表单
    form.resetFields();
  };

  // 更换平台
  const onChangePlatforms = (e, option) => {
    // 获取所属场景
    const industrys = dot.get(option, 'props.industry', undefined);
    setIndustry(industrys); // 所属场景
    setPlatforms(e); // 平台
    setSuppliers(undefined); // 供应商
    // 清空选项
    form.setFieldsValue({ suppliers: undefined });
    form.setFieldsValue({ cities: [] });
  };

  // 更换供应商
  const onChangeSuppliers = (e) => {
    setSuppliers(e); // 供应商
    // 清空选项
    form.setFieldsValue({ cities: [] });
  };

  // 更换城市
  const onChangeCity = (value) => {
    value.map((item) => {
      if (item === 'all') {
        return form.setFieldsValue({ cities: ['all'] });
      }
    });
  };
  const layout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } };

  const formItems = [
    <Form.Item
      label="平台"
      name="platforms"
      rules={[{ required: true, message: '请选择平台' }]}
      {...layout}
    >
      <CommonSelectPlatforms allowClear optionFilterProp="children" placeholder="请选择平台" onChange={onChangePlatforms} />
    </Form.Item>,
    <Form.Item
      label="供应商"
      name="suppliers"
      rules={[{ required: true, message: '请选择供应商' }]}
      {...layout}
    >
      <CommonSelectSuppliers state={SupplierState.enable} allowClear placeholder="请选择供应商" platforms={platforms} onChange={onChangeSuppliers} />
    </Form.Item>,
    <Form.Item
      label="城市"
      name="cities"
      rules={[{ required: true, message: '请选择城市' }]}
      {...layout}
    >
      <CommonSelectContractCities className="maxHeight" allowClear showArrow mode="multiple" placeholder="请选择城市" suppliers={suppliers} platforms={platforms} onChange={onChangeCity} isExpenseModel />
    </Form.Item>,
    <Form.Item
      label="合同模版"
      name="template"
      rules={[{ required: true, message: '请选择合同模版' }]}
      {...layout}
    >
      <TemplateSelect
        allowClear
        placeholder="请选择合同模版"
        showSearch
        optionFilterProp="children"
      />
    </Form.Item>,
  ];

  return (
    <Modal title="新增" visible={visible} onOk={onSubmit} onCancel={onHideCancel} okText="确认" cancelText="取消">
      <Form layout="horizontal" form={form}>
        <CoreForm items={formItems} cols={1} />
      </Form>
    </Modal>
  );
};

CreateModal.propTypes = {
  onCancel: PropTypes.func, // 可见状态变化回调
  visible: PropTypes.bool,         // 是否显示弹窗
};

CreateModal.defaultProps = {
  onCancel: () => { },  // 可见状态变更回调
  visible: false,
};

function mapStateToProps({ systemManage }) {
  return { systemManage };
}

export default connect(mapStateToProps)(CreateModal);
