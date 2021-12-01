/**
 *  城市详情
 */

import moment from 'moment';
import React, { useEffect } from 'react';
import { connect } from 'dva';
import '@ant-design/compatible/assets/index.css';
import { Button, Form } from 'antd';

import { CoreContent, CoreForm } from '../../../components/core';
import styles from './style/index.less';

const ComponentCityDetail = (props) => {
  const {
    dispatch,
    location,
    details = {},
  } = props;

  // 城市id
  const { id } = location.query;
  useEffect(() => {
    if (id) {
      const params = {
        id, // 详情id
      };
      dispatch({ type: 'systemCity/fetchCityDetail', payload: params });
    }
  }, [id]);

  // 渲染头部信息
  const renderHeaders = () => {
    const creatorInfo = details.creator_info || {}; // 创建人
    const operatorInfo = details.operator_info || {}; // 操作人
    const fromitems = [
      <Form.Item label="创建人">
        <span>{creatorInfo.name || '--'}</span>
      </Form.Item>,
      <Form.Item label="创建时间">
        <span>{details.created_at ? moment(details.created_at).format('YYYY-MM-DD HH:mm:ss') : '--'}</span>
      </Form.Item>,
      <Form.Item label="最后更新者">
        <span>{operatorInfo.name || '--'}</span>
      </Form.Item>,
      <Form.Item label="更新时间">
        <span>{details.updated_at ? moment(details.updated_at).format('YYYY-MM-DD HH:mm:ss') : '--'}</span>
      </Form.Item>,
      <Form.Item label="所属场景">
        <span>{details.industry_name || '--'}</span>
      </Form.Item>,
      <Form.Item label="平台">
        <span>{details.name || '--'}</span>
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
      <Form.Item label="行政城市名称">
        <span>{v.city_name || '--'}</span>
      </Form.Item>,
      <Form.Item label="行政城市code">
        <span>{v.city_code || '--'}</span>
      </Form.Item>,
      <Form.Item label="平台城市名称">
        <span>{v.city_custom_name || '--'}</span>
      </Form.Item>,
      <Form.Item label="平台城市代码">
        <span>{v.city_spelling || '--'}</span>
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
    const dataScource = details.city_codes || [];
    return (
      <CoreContent title="平台城市方案">
        {
          dataScource.map((v, index) => {
            // 渲染文本
            return renderItemsLabel(v, index);
          })
        }
      </CoreContent>
    );
  };

  return (
    <div>
      {/* 渲染头部信息 */}
      {renderHeaders()}

      {/* 平台城市方案 */}
      {renderItems()}
      <div className={styles['app-comp-system-detail-back-btn-wrap']}>
        <Button
          onClick={() => {
            window.location.href = '/#/System/City';
          }}
        >返回</Button>
      </div>
    </div>
  );
};

function mapStateToProps({ systemCity: { cityDetail = {} } }) {
  return { details: cityDetail };
}

export default connect(mapStateToProps)(ComponentCityDetail);
