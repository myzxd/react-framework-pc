/**
 * 系统管理 - 服务商配置 - 创建 - 个体工商户注册
 */
import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Radio } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import { ServiceProvidersType } from '../../../../../application/define';

const Merchants = (props = {}) => {
  const {
    form = {}, // form表单
  } = props;

  // 个体工商户注册
  const renderMerchantsRegistered = () => {
    const { getFieldDecorator } = form;
    const formItems = [
      {
        label: '选择服务商',
        form: getFieldDecorator('serviceProviders', { rules: [{ required: true, message: '请选择服务商' }], initialValue: ServiceProvidersType.bodu })(
          <Radio.Group name="serviceProviders">
            <Radio value={ServiceProvidersType.bodu}>{ServiceProvidersType.description(ServiceProvidersType.bodu)}</Radio>
            <Radio disabled value={ServiceProvidersType.mengda}>{ServiceProvidersType.description(ServiceProvidersType.mengda)}</Radio>
            <Radio value={ServiceProvidersType.zhongjian}>{ServiceProvidersType.description(ServiceProvidersType.zhongjian)}</Radio>
            <Radio value={ServiceProvidersType.caixingbang}>{ServiceProvidersType.description(ServiceProvidersType.caixingbang)}</Radio>
          </Radio.Group>,
        ),
      },
    ];
    const layout = { labelCol: { span: 3 }, wrapperCol: { span: 10 } };
    return (
      <CoreContent title="个体工商户注册" style={{ backgroundColor: '#FAFAFA' }}>
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </CoreContent>
    );
  };
  return (
    <div>
      {/* 渲染个体工商注册 */}
      {renderMerchantsRegistered()}
    </div>
  );
};

export default Form.create()(Merchants);
