/**
 * 白名单编辑页
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Button, Col, Row, Radio, Form } from 'antd';

import { CoreContent, CoreForm } from '../../../components/core';
import { ServiceProvidersType } from '../../../application/define';

import styles from './style/index.less';


const Update = ({ location, dispatch, history, data = {} }) => {
  const { id } = location.query;
  const [form] = Form.useForm();
  // 获取详情接口数据
  useEffect(() => {
    if (id !== undefined) {
      dispatch({ type: 'systemMerchants/fetchMerchantsDetail', payload: { id } });
    }
  }, [id]);

  // 设置默认值
  useEffect(() => {
    if (data) {
      form.setFieldsValue({ serviceProviders: dot.get(data, 'individual_source', undefined) });
    }
  }, [data]);

  // 重置数据返回首页
  const onReset = () => {
    // 返回首页
    history.push('/System/Merchants');
    // 重置表单
    form.resetFields();
  };

  // 提交
  const onSubmit = async () => {
    const formValues = await form.validateFields();
    const { serviceProviders } = formValues;
    const params = { serviceProviders, id };
    dispatch({ type: 'systemMerchants/updateMerchants', payload: { params } });
  };

  // 渲染商圈
  const renderDistrict = () => {
    const district = dot.get(data, 'biz_district_list', []);
    if (is.not.existy(district) || is.empty(district) || is.not.array(district)) {
      return '全部';
    }
    return district.map(item => item.name).join(' , ');
  };

  // 渲染城市
  const renderCity = () => {
    const city = dot.get(data, 'city_list', []);
    if (is.not.existy(city) || is.empty(city) || is.not.array(city)) {
      return '全部';
    }
    return city.map(item => item.city_name).join(' , ');
  };

  // 白名单应用范围
  const renderRange = () => {
    const layout = { labelCol: { span: 2 }, wrapperCol: { span: 20 } };
    const fromitems = [
      <Form.Item
        label="平台"
        {...layout}
      >
        <span>{dot.get(data, 'platform_name', '--')}</span>
      </Form.Item>,
      <Form.Item
        label="供应商"
        {...layout}
      >
        <span>{dot.get(data, 'supplier_name') || '全部'}</span>
      </Form.Item>,
      <Form.Item
        label="城市"
        {...layout}
      >
        <span>{renderCity()}</span>
      </Form.Item>,
      <Form.Item
        label="商圈"
        {...layout}
      >
        <span>{renderDistrict()}</span>
      </Form.Item>,
    ];
    return (
      <CoreContent title="选择应用范围">
        <CoreForm items={fromitems} cols={1} />
      </CoreContent>
    );
  };
  console.log(dot.get(data, 'individual_source'));
  // 个体工商户注册
  const renderMerchantsRegistered = () => {
    const formItems = [
      <Form.Item
        label="选择服务商"
        name="serviceProviders"
        rules={[{ required: true, message: '请选择服务商' }]}
        {...layout}
      >
        <Radio.Group name="serviceProviders">
          <Radio value={ServiceProvidersType.bodu}>{ServiceProvidersType.description(ServiceProvidersType.bodu)}</Radio>
          <Radio disabled value={ServiceProvidersType.mengda}>{ServiceProvidersType.description(ServiceProvidersType.mengda)}</Radio>
          <Radio value={ServiceProvidersType.zhongjian}>{ServiceProvidersType.description(ServiceProvidersType.zhongjian)}</Radio>
          <Radio value={ServiceProvidersType.caixingbang}>{ServiceProvidersType.description(ServiceProvidersType.caixingbang)}</Radio>
        </Radio.Group>
      </Form.Item>,
    ];
    const layout = { labelCol: { span: 3 }, wrapperCol: { span: 10 } };
    return (
      <CoreContent title="个体工商户注册" style={{ backgroundColor: '#FAFAFA' }}>
        <CoreForm items={formItems} cols={1} layout={layout} />
      </CoreContent>
    );
  };

  // 更提交
  const renderOperationButton = () => {
    return (<Row>
      <Col span={8} offset={8} className={styles['app-comp-white-list-update-operate-wrap']}>
        <Button type="default" onClick={onReset}>
          取消
        </Button>
        <Button type="primary" htmlType="submit" onClick={onSubmit}>
          保存
        </Button>
      </Col>
    </Row>);
  };

  return (
    <Form layout="horizontal" form={form}>
      {/* 渲染范围内容 */}
      {renderRange()}

      {/* 渲染个体工商户 */}
      {renderMerchantsRegistered()}

      {/* 渲染操作按钮 */}
      {renderOperationButton()}
    </Form>
  );
};

function mapStateToProps({ systemMerchants: { detailData = {} } }) {
  return { data: detailData };
}

export default connect(mapStateToProps)(Update);

