/**
 * 系统管理 - 服务商配置 - 创建
 */
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import React, { useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Button, Col, Row, message } from 'antd';
import ApplyRange from './components/create/scope';
import Merchants from './components/create/merchants';
import styles from './style/index.less';

const Create = ({ history, dispatch, form = {} }) => {
  //  全部选择的级别 ： 4为 都没有选择全部， 1为供应商是全部，2为城市全部，3为商圈全部
  const [allSelectorLevel, setAllSelectorLevel] = useState(allSelectorLevel);

  // 更改全部选择回调
  const onChangeSelectAll = (num) => {
    setAllSelectorLevel(num);
  };

  // 提交
  const onSubmit = () => {
    form.validateFields((errs, values) => {
      if (!values.platform) {
        message.error('平台不能为空');
        return;
      }

      if (!values.supplier) {
        message.error('供应商不能为空');
        return;
      }

      // 城市不为空（默认是空字符串）  || 城市数组长度不为0
      if (!values.city || values.city.length === 0) {
        message.error('城市不能为空');
        return;
      }

      // 商圈不为空（默认是空字符串）  || 商圈数组长度不为0
      if (!values.districtsArray || values.districtsArray.length === 0) {
        message.error('商圈不能为空');
        return;
      }
      if (errs) {
        return;
      }
      const { platform, supplier, city, districtsArray, serviceProviders } = values;
      const params = { platform, supplier, city, districtsArray, serviceProviders, allSelectorLevel };
      dispatch({ type: 'systemMerchants/fetchMerchantsCreate', payload: params });
    });
  };

  // 重置数据返回首页
  const onReset = () => {
    // 重置表单
    form.resetFields();
    // 返回首页
    history.push('/System/Merchants');
  };

  // 渲染范围
  const renderScope = () => {
    return <ApplyRange onChangeSelectAll={onChangeSelectAll} form={form} />;
  };

  // 渲染个体工商注册
  const renderMerchantsRegistered = () => {
    return <Merchants form={form} />;
  };

  // 渲染操作按钮
  const renderOperationButton = () => {
    return (
      <Row>
        <Col span={8} offset={8} className={styles['app-comp-white-list-create-operate-wrap']}>
          <Button type="default" onClick={onReset}>
            取消
          </Button>
          <Button type="primary" htmlType="submit" onClick={onSubmit}>
            新增
          </Button>
        </Col>
      </Row>
    );
  };

  return (
    <Form layout="horizontal" form={form} >
      {/* 渲染服务商配置范围 */}
      {renderScope()}

      {/* 渲染个体工商注册 */}
      {renderMerchantsRegistered()}

      {/* 渲染操作按钮 */}
      {renderOperationButton()}
    </Form>
  );
};

function mapStateToProps({ applicationCommon, systemMerchants }) {
  return { applicationCommon, systemMerchants };
}

export default connect(mapStateToProps)(Form.create()(Create));
