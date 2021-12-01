/**
 *  编辑城市
 */
import moment from 'moment';
import React, { useEffect } from 'react';
import { connect } from 'dva';
import is from 'is_js';
import { Button, Form } from 'antd';

import { CoreContent, CoreForm } from '../../../components/core';
import ComponentsCitysItems from './components/citysItems';
import ModalCreate from './components/modal/createModal';
import ModalReast from './components/modal/resetModal';
import styles from './style/index.less';

function ComponentCityUpdate(props) {
  const { dispatch, location } = props;
  const { id } = location.query;
  const [form] = Form.useForm();
  useEffect(() => {
    const params = {
      id, // 详情id
    };
    dispatch({ type: 'systemCity/fetchCityDetail', payload: params });
  }, [dispatch, id]);

    // 渲染头部信息
  const renderHeaders = () => {
    const { details } = props;
    const creatorInfo = details.creator_info || {}; // 创建人
    const operatorInfo = details.operator_info || {}; // 操作人
    const fromitems = [
      <Form.Item
        label="创建人"
      >
        {creatorInfo.name || '--'}
      </Form.Item>,
      <Form.Item
        label="创建时间"
      >
        {details.created_at ? moment(details.created_at).format('YYYY-MM-DD HH:mm:ss') : '--'}
      </Form.Item>,
      <Form.Item
        label="最后更新者"
      >
        {operatorInfo.name || '--'}
      </Form.Item>,
      <Form.Item
        label="更新时间"
      >
        {details.updated_at ? moment(details.updated_at).format('YYYY-MM-DD HH:mm:ss') : '--'}
      </Form.Item>,
      <Form.Item
        label="所属场景"
      >
        {details.industry_name || '--'}
      </Form.Item>,
      <Form.Item
        label="平台"
      >
        {details.name || '--'}
      </Form.Item>,
    ];
    return (
      <CoreContent>
        <CoreForm items={fromitems} cols={4} />
      </CoreContent>
    );
  };
    // 渲染文本
  const renderItemsLabel = (v, index) => {
    const items = [
      <Form.Item
        label="行政城市名称"
      >
        {v.city_name || '--'}
      </Form.Item>,
      <Form.Item
        label="行政城市code"
      >
        {v.city_code || '--'}
      </Form.Item>,
      <Form.Item
        label="平台城市名称"
      >
        {v.city_custom_name || '--'}
      </Form.Item>,
      <Form.Item
        label="平台城市代码"
      >
        {v.city_spelling || '--'}
      </Form.Item>,
    ];
    return (
      <div key={index}>
        <CoreForm items={items} cols={4} />
      </div>
    );
  };
    // 平台城市方案
  const renderItems = () => {
    const dataScource = props.details.city_codes || [];
    const layout = { labelCol: { span: 0 }, wrapperCol: { span: 24 } };
    return (
      <CoreContent title="平台城市方案">
        <div>
          {
              dataScource.map((v, index) => {
                // 渲染文本
                return renderItemsLabel(v, index);
              })
            }
        </div>
        <Form.Item
          label=""
          name="cityList"
          initialValue={[{}]}
          rules={[
            {
              validator: (_, val) => {
                const flag = val.some(v => is.not.existy(v._id) || is.empty(v._id)
                  || is.not.existy(v.city_custom_name) || is.empty(v.city_custom_name));
                // 判断数据是否为空
                if (flag === true) {
                  return Promise.reject(new Error('请填写完整'));
                }
                return Promise.resolve();
              },
            },
          ]}
          {...layout}
        >
          <ComponentsCitysItems style={{ width: '100%' }} {...props} />
        </Form.Item>
      </CoreContent>
    );
  };
  return (
    <Form form={form}>
      {/* 渲染头部信息 */}
      {renderHeaders()}

      {/* 平台城市方案 */}
      {renderItems()}
      <div className={styles['app-comp-system-operate-wrap']}>
        <Button
          onClick={() => {
            window.location.href = '/#/System/City';
          }}
        >返回</Button>
        {/* 重置 */}
        <ModalReast className={styles['app-comp-system-update-operate-btn']} form={form} {...props} />
        {/* 新增 */}
        <ModalCreate className={styles['app-comp-system-update-operate-btn']} form={form} {...props} />
      </div>
    </Form>
  );
}

function mapStateToProps({ systemCity: { cityDetail = {} } }) {
  return { details: cityDetail };
}

export default connect(mapStateToProps)(ComponentCityUpdate);
