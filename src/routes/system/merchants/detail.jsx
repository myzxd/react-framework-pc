/**
 * 系统管理 - 服务上配置 - 详情页
 */
import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Form } from 'antd';

import { CoreContent, CoreForm } from '../../../components/core';
import { ServiceProvidersType } from '../../../application/define';

import styles from './style/index.less';

const Detail = (props = {}) => {
  const {
    history,
    location,
    dispatch,
    data,
  } = props;

  const { id } = location.query;

  // 获取详情接口
  useEffect(() => {
    if (id !== undefined) {
      dispatch({ type: 'systemMerchants/fetchMerchantsDetail', payload: { id } });
    }
  }, [id]);

  // 返回首页
  const onReturnHom = () => {
    history.push('/System/Merchants');
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

  // 渲染白名单范围
  const renderScope = () => {
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
      <CoreContent title="应用范围">
        <CoreForm items={fromitems} cols={1} />
      </CoreContent>
    );
  };

  // 渲染个体工商户注册
  const renderMerchantsRegistered = () => {
    const layout = { labelCol: { span: 2 }, wrapperCol: { span: 20 } };
    const fromitems = [
      <Form.Item
        label="选择服务商"
        {...layout}
      >
        <span>{ServiceProvidersType.description(dot.get(data, 'individual_source')) || '--'}</span>
      </Form.Item>,
      <Form.Item
        label="配置时间"
        {...layout}
      >
        <span>{moment(dot.get(data, 'updated_at')).format('YYYY.MM.DD')}</span>
      </Form.Item>,
    ];
    return (
      <CoreContent title="个体工商户注册">
        <CoreForm items={fromitems} cols={1} />
      </CoreContent>
    );
  };

  // 渲染返回
  const renderReturnButton = () => {
    return (
      <CoreContent>
        <Row>
          <Col span={24} className={styles['app-comp-white-list-detail-back-wrap']}>
            <Button onClick={onReturnHom}>返回</Button>
          </Col>
        </Row>
      </CoreContent>
    );
  };

  return (
    <div>
      {/* 渲染范围内容 */}
      {renderScope()}

      {/* 渲染个体工商户 */}
      {renderMerchantsRegistered()}

      {/* 渲染返回按钮 */}
      {renderReturnButton()}
    </div>
  );
};

function mapStateToProps({ systemMerchants: { detailData = {} } }) {
  return { data: detailData };
}

export default connect(mapStateToProps)(Detail);
