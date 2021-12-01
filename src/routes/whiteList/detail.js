/**
 * 白名单 - 详情页
 */
import is from 'is_js';
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Form } from 'antd';

import { CoreContent, CoreForm } from '../../components/core';
import { WhiteListTeamType, WhiteListWorkType, WhiteListTerminalType, WhiteListAddressBookState } from '../../application/define';
import styles from './style/index.less';

const Detail = (props = {}) => {
  const {
    dispatch,
    location,
    history,
    detailData,
  } = props;
  const { id } = location.query;
    // 获取详情数据
  useEffect(() => {
    dispatch({ type: 'whiteList/fetchWhiteListDetail', payload: { id } });
  }, [id]);

  // 返回首页
  const onReturnHom = () => {
    history.push('/WhiteList');
  };

  // 渲染商圈
  const renderDistrict = (data) => {
    const district = dot.get(data, 'biz_district_list', []);
    if (is.not.existy(district) || is.empty(district) || is.not.array(district)) {
      return '全部';
    }
    return district.map(item => item.name).join(' , ');
  };

  // 渲染城市
  const renderCity = (data) => {
    const city = dot.get(data, 'city_list', []);
    if (is.not.existy(city) || is.empty(city) || is.not.array(city)) {
      return '全部';
    }
    return city.map(item => item.city_name).join(' , ');
  };

  // 渲染白名单范围
  const renderScope = () => {
    const data = detailData;
    const layout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };
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
        <span>{renderCity(data)}</span>
      </Form.Item>,
      <Form.Item
        label="商圈"
        {...layout}
      >
        <span>{renderDistrict(data)}</span>
      </Form.Item>,
    ];
    return (
      <CoreContent title="白名单应用范围">
        <CoreForm items={fromitems} cols={4} />
      </CoreContent>
    );
  };

  // 渲染功能模块
  const renderFunction = () => {
    const data = detailData;
    const fromitems = [
      <Form.Item
        label="商圈"
      >
        <span>{dot.get(data, 'app_code') ? WhiteListTerminalType.description(dot.get(data, 'app_code')) : '--'}</span>
      </Form.Item>,
    ];
    return (
      <CoreContent title="白名单应用终端">
        <CoreForm items={fromitems} cols={4} />
      </CoreContent>
    );
  };

  // 渲染工作台
  const renderworkbench = (data) => {
    const workData = dot.get(data, 'workbench_label', []);
    if (is.not.empty(workData)) {
      return (
        <Col span={24} className={styles['app-comp-white-list-detail-workbench-wrap']}>
          <Row>
            {
              workData.map((item, index) => {
                return <Col span={3} key={index} className={styles['app-comp-white-list-detail-workbench-item']}><h5>{WhiteListWorkType.description(item)}</h5></Col>;
              })
            }
          </Row>
        </Col>);
    } else {
      return '--';
    }
  };

  // 团结队信息
  const renderJoinTeamInfo = (data) => {
    const terminal = dot.get(data, 'app_code', 0);
    if (terminal === WhiteListTerminalType.knight) {
      return (
        <Row>
          <Col span={24} className={styles['app-comp-white-list-detail-join-team-info-title']}>
            <Col span={6} className={styles['app-comp-white-list-detail-join-team-info-label']}><h3>加入团队</h3></Col>
          </Col>
          <Col span={24} className={styles['app-comp-white-list-detail-join-team-info-item']}>
            <Row>
              <Col span={6} className={styles['app-comp-white-list-detail-join-team-info-label']}><h5>扫码加入团队方式是否需要管理员审核？</h5></Col>
              <Col span={6} className={styles['app-comp-white-list-detail-join-team-info-value']}>{WhiteListTeamType.description(dot.get(data, 'qrcode_apply_check'))}</Col>
            </Row>
          </Col>
          <Col span={24} className={styles['app-comp-white-list-detail-join-team-info-item']}>
            <Row>
              <Col span={6} className={styles['app-comp-white-list-detail-join-team-info-label']}><h5>个户身份是否为加入团队必填项？</h5></Col>
              <Col span={6} className={styles['app-comp-white-list-detail-join-team-info-value']}>{WhiteListTeamType.description(dot.get(data, 'individual_register_required'))}</Col>
            </Row>
          </Col>
          <Col span={24} className={styles['app-comp-white-list-detail-join-team-info-item']}>
            <Row>
              <Col span={6} className={styles['app-comp-white-list-detail-join-team-info-label']}><h5>工作档案中是否展示个户信息？</h5></Col>
              <Col span={6} className={styles['app-comp-white-list-detail-join-team-info-value']}>{WhiteListTeamType.description(dot.get(data, 'individual_show_in_work_profile'))}</Col>
            </Row>
          </Col>
        </Row>
      );
    } else {
      return (
        <Row>
          <Col span={24} className={styles['app-comp-white-list-detail-join-team-info-title']}>
            <Col span={6} className={styles['app-comp-white-list-detail-join-team-info-label']}><h3>加入团队</h3></Col>
          </Col>
          <Col span={24} className={styles['app-comp-white-list-detail-join-team-info-item']}>
            <Row>
              <Col span={6} className={styles['app-comp-white-list-detail-join-team-info-label']}><h5>个户身份是否为加入团队必填项？</h5></Col>
              <Col span={6} className={styles['app-comp-white-list-detail-join-team-info-value']}>{WhiteListTeamType.description(dot.get(data, 'individual_register_required'))}</Col>
            </Row>
          </Col>
          <Col span={24} className={styles['app-comp-white-list-detail-join-team-info-item']}>
            <Row>
              <Col span={6} className={styles['app-comp-white-list-detail-join-team-info-label']}><h5>工作档案中是否展示个户信息？</h5></Col>
              <Col span={6} className={styles['app-comp-white-list-detail-join-team-info-value']}>{WhiteListTeamType.description(dot.get(data, 'individual_show_in_work_profile'))}</Col>
            </Row>
          </Col>
        </Row>
      );
    }
  };

  // 渲染应用终端
  const renderTerminal = () => {
    const { detailData: data = {} } = props;
    return (
      <CoreContent title="白名单功能模块">
        {/* 渲染加入团队信息 */}
        {renderJoinTeamInfo(data)}

        <Row className={styles['app-comp-white-list-detail-item']}>
          <Col span={24} className={styles['app-comp-white-list-detail-join-team-info-title']}>
            <Col span={6} className={styles['app-comp-white-list-detail-join-team-info-label']}><h3>通讯录</h3></Col>
          </Col>
          <Col span={24} className={styles['app-comp-white-list-detail-join-team-info-item']}>
            <Col span={2} className={styles['app-comp-white-list-detail-join-team-info-label']}><h5>{WhiteListAddressBookState.description(dot.get(data, 'address_book_show'))}</h5></Col>
          </Col>
        </Row>
        <Row className={styles['app-comp-white-list-detail-item']}>
          <Col span={24} className={styles['app-comp-white-list-detail-join-team-info-title']}>
            <Col span={6} className={styles['app-comp-white-list-detail-join-team-info-label']}><h3>工作台</h3></Col>
          </Col>
          {/* 渲染工作台信息 */}
          {renderworkbench(data)}
        </Row>
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

      {/* 渲染功能模块内容 */}
      {renderFunction()}

      {/* 渲染用用终端内容 */}
      {renderTerminal()}

      {/* 渲染返回按钮 */}
      {renderReturnButton()}
    </div>
  );
};

Detail.propTypes = {
  detailData: PropTypes.object,
};

Detail.defaultProps = {
  detailData: {},
};

function mapStateToProps({ whiteList: { detailData } }) {
  return { detailData };
}

export default connect(mapStateToProps)(Detail);
