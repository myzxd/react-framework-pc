/**
 * 公告接收人 - 权限详情页
 */
import is from 'is_js';
import dot from 'dot-prop';
import { Row, Col, Button } from 'antd';
import { connect } from 'dva';
import React, { Component } from 'react';

import { DeprecatedCoreForm, CoreContent } from '../../components/core';
import { AnnouncementSendPermissions } from '../../application/define';

import style from './style.css';

class Detail extends Component {

  // 默认加载数据
  componentDidMount() {
    const id = dot.get(this.props, 'location.query.id', undefined); // 权限id
    if (id !== undefined) {
      this.props.dispatch({ type: 'permissions/fetchPermissionsDetails', payload: { id } });  // 权限详情数据
    }
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'permissions/resetPermissionsDetails' });  // 重置权限详情数据
  }

  // 返回首页
  onReturnHom = () => {
    this.props.history.push('/Announcement/Permissions');
  }

  // 基础信息
  renderBasisInfo = () => {
    const { data } = this.props;
    const formItems = [
      {
        label: '姓名',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(data, 'name', undefined) || '--',
      },
      {
        label: '手机号',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(data, 'phone', undefined) || '--',
      },
      {
        label: '角色',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(data, 'position_name', undefined) || '--',
      },
    ];
    return (
      <CoreContent title="基础信息">
        <DeprecatedCoreForm items={formItems} />
      </CoreContent>
    );
  }

  // 权限信息
  renderPermissionsInfo = () => {
    const { data } = this.props;
    const formItems = [
      {
        label: '是否有公告发送权限',
        span: 7,
        layout: { labelCol: { span: 10 }, wrapperCol: { span: 11 } },
        form: AnnouncementSendPermissions.description(dot.get(data, 'notice_permission')) || '--',
      },
    ];
    return (
      <CoreContent title="权限信息">
        <DeprecatedCoreForm items={formItems} />
      </CoreContent>
    );
  }

  // 渲染平台
  renderPlatform = () => {
    const { data } = this.props;
    const platform = dot.get(data, 'platform_info_list', []);
    if (is.not.existy(platform) || is.empty(platform) || is.not.array(platform)) {
      return '--';
    }
    return platform.map(item => item.name).join(' , ');
  }

  // 渲染供应商
  renderSupplier = () => {
    const { data } = this.props;
    const supplier = dot.get(data, 'supplier_info_list', []);
    if (is.not.existy(supplier) || is.empty(supplier) || is.not.array(supplier)) {
      return '--';
    }
    return supplier.map(item => item.name).join(' , ');
  }

  // 渲染城市
  renderCity = () => {
    const { data } = this.props;
    const city = dot.get(data, 'city_info_list', []);
    if (is.not.existy(city) || is.empty(city) || is.not.array(city)) {
      return '--';
    }
    return city.map(item => item.city_name).join(' , ');
  }

  // 渲染商圈
  renderDistrict = () => {
    const { data } = this.props;
    const district = dot.get(data, 'biz_district_info_list', []);
    if (is.not.existy(district) || is.empty(district) || is.not.array(district)) {
      return '--';
    }
    return district.map(item => item.name).join(' , ');
  }

  // 范围信息
  renderScopeInfo = () => {
    const formItems = [
      {
        label: '平台',
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 20 } },
        form: this.renderPlatform(),
      },
      {
        label: '供应商',
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 20 } },
        form: this.renderSupplier(),
      },
      {
        label: '城市',
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 20 } },
        form: this.renderCity(),
      },
      {
        label: '团队',
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 20 } },
        form: this.renderDistrict(),
      },
    ];
    return (
      <CoreContent title="范围信息">
        <DeprecatedCoreForm items={formItems} />
      </CoreContent>
    );
  }

  // 渲染状态信息
  renderReturnButton = () => {
    return (
      <CoreContent>
        <Row>
          <Col span={24} className={style.boss_announcement_detail}>
            <Button onClick={this.onReturnHom}>返回</Button>
          </Col>
        </Row>
      </CoreContent>
    );
  }

  render = () => {
    const { data } = this.props;
    if (AnnouncementSendPermissions.no === dot.get(data, 'notice_permission', 0)) {
      return (
        <div>
          {/* 基础信息 */}
          {this.renderBasisInfo()}

          {/* 权限信息 */}
          {this.renderPermissionsInfo()}

          {/* 渲染返回按钮 */}
          {this.renderReturnButton()}
        </div>
      );
    }
    return (
      <div>
        {/* 基础信息 */}
        {this.renderBasisInfo()}

        {/* 权限信息 */}
        {this.renderPermissionsInfo()}

        {/* 范围信息 */}
        {this.renderScopeInfo()}

        {/* 渲染返回按钮 */}
        {this.renderReturnButton()}
      </div>
    );
  }
}

function mapStateToProps({ permissions: { permissionsDetail = {} } }) {
  return { data: permissionsDetail };
}

export default connect(mapStateToProps)(Detail);
