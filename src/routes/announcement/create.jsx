/**
 * 公告接收人 - 权限列表 -创建
 */
import { connect } from 'dva';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Radio, Row, Col, Button, message } from 'antd';

import { DeprecatedCoreForm, CoreContent } from '../../components/core';
import { CommonSelectPositions, CommonSelectPlatforms, CommonSelectSuppliers, CommonSelectCities, CommonSelectDistricts, CommonSelectMembers } from '../../components/common';
import { AnnouncementScope, SupplierState, AnnouncementSendPermissions } from '../../application/define';

import style from './style.css';

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        platforms: [],  // 平台
        suppliers: [],  // 供应商(页面组件选中使用)
        cities: [],     // 城市(页面组件选中使用)
        districts: [],  // 商圈
        positions: undefined, // 角色
      },
      isShowScope: true,   // 是否显示接收人范围
      isShowCustom: false,  // 是否让自定义信息显示出来
    };
  }

  componentWillUnmount = () => {
    this.componentReset();
  }

  // 更换平台
  onChangePlatforms = (e) => {
    const { form } = this.props;
    const { fields } = this.state;

    fields.platforms = e;
    fields.suppliers = [];
    fields.cities = [];
    fields.districts = [];
    this.setState({ fields });

    // 清空选项
    form.setFieldsValue({ suppliers: [] });
    form.setFieldsValue({ cities: [] });
    form.setFieldsValue({ districts: [] });
  }

  // 更换供应商
  onChangeSuppliers = (e) => {
    const { form } = this.props;
    const { fields } = this.state;

    fields.suppliers = e;
    fields.cities = [];
    fields.districts = [];
    this.setState({ fields });

    // 清空选项
    form.setFieldsValue({ cities: [] });
    form.setFieldsValue({ districts: [] });
  }

  // 更换城市
  onChangeCity = (e) => {
    const { form } = this.props;
    const { fields } = this.state;

    // 保存城市参数
    fields.cities = e;
    fields.districts = [];
    this.setState({ fields });

    form.setFieldsValue({ districts: [] });
  }

  // 更换区域
  onChangeDistrict = (e) => {
    const { fields } = this.state;
    fields.districts = e;
    this.setState({ fields });
  }

  // 更改角色
  onChangePoistions = (value) => {
    const { form } = this.props;
    const { fields } = this.state;

    // 保存角色参数
    fields.positions = value;
    this.setState({ fields });
    form.setFieldsValue({ members: [] });
  }
  // 返回首页
  onReturnHom = () => {
    this.props.history.push('/Announcement/Permissions');
  }

  // 成功的回调函数
  onSuccessCallback = () => {
    message.success('创建成功');
    this.props.history.push('/Announcement/Permissions');
  }

  // 更改公告发送权限
  onPermissionChange = (e) => {
    const { form } = this.props;
    if (e.target.value === AnnouncementSendPermissions.no) {
      this.setState({
        isShowScope: false,
        isShowCustom: false,
      });
      // 清空选项
      form.setFieldsValue({ scope: undefined });
      form.setFieldsValue({ platforms: [] });
      form.setFieldsValue({ suppliers: [] });
      form.setFieldsValue({ cities: [] });
      form.setFieldsValue({ districts: [] });
    } else {
      this.setState({
        isShowScope: true,
      });
    }
  }

  // 更改公告接收人范围
  onScopeChange = (e) => {
    if (e.target.value === AnnouncementScope.custom) {
      this.setState({
        isShowCustom: true,
      });
    } else {
      const { form } = this.props;
      this.setState({
        isShowCustom: false,
      });
      form.setFieldsValue({ platforms: [] });
      form.setFieldsValue({ suppliers: [] });
      form.setFieldsValue({ cities: [] });
      form.setFieldsValue({ districts: [] });
    }
  }

  // 创建用户
  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const { positions, members, permission, scope, platforms, suppliers, cities, districts } = values;
      const params = { positions, members, permission, scope, platforms, suppliers, cities, districts };
      this.props.dispatch({
        type: 'permissions/createPermissions',
        payload: {
          params,
          onSuccessCallback: this.onSuccessCallback,
        },
      });
    });
  }

  // 重置组件
  componentReset = () => {
    this.setState({
      fields: {
        suppliers: [],  // 供应商
        platforms: [],  // 平台
        cities: [],     // 城市
        districts: [],  // 商圈
        positions: undefined, // 角色
      },
    });
    // 重置表单
    this.props.form.resetFields();
  }

  // 渲染基本信息
  renderBasicInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const { positions } = this.state.fields;
    const formItems = [
      {
        label: '角色',
        form: getFieldDecorator('positions', { rules: [{ required: true, message: '请选择角色' }], initialValue: undefined })(
          <CommonSelectPositions onlyShowOperable placeholder="请选择角色" onChange={this.onChangePoistions} />,
        ),
      }, {
        label: '成员',
        form: getFieldDecorator('members', { rules: [{ required: true, message: '请选择成员' }], initialValue: undefined })(
          <CommonSelectMembers allowClear showArrow mode="multiple" placeholder="请选择成员" positions={positions} state={100} onChange={this.onChangeMembers} />,
        ),
      },
    ];
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
    );
  }

  // 渲染权限配置
  renderAccessConfiguration = () => {
    const { getFieldDecorator } = this.props.form;
    const formItems = [
      {
        label: '公告发送权限',
        form: getFieldDecorator('permission', { rules: [{ required: true, message: '请选择状态' }], initialValue: AnnouncementSendPermissions.yes })(
          <Radio.Group onChange={this.onPermissionChange}>
            <Radio value={AnnouncementSendPermissions.yes}>{AnnouncementSendPermissions.description(AnnouncementSendPermissions.yes)}</Radio>
            <Radio value={AnnouncementSendPermissions.no}>{AnnouncementSendPermissions.description(AnnouncementSendPermissions.no)}</Radio>
          </Radio.Group>,
        ),
      },
    ];

    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
    );
  }

  // 渲染业务范围
  renderBusinessScope = () => {
    const { getFieldDecorator } = this.props.form;
    const { platforms, suppliers, cities } = this.state.fields;
    const { isShowCustom } = this.state;
    const formItems = [
      {
        label: '接收人范围',
        form: getFieldDecorator('scope', { rules: [{ required: false, message: '请选择接收人范围' }], initialValue: AnnouncementScope.all })(
          <Radio.Group onChange={this.onScopeChange}>
            <Radio value={AnnouncementScope.all}>{AnnouncementScope.description(AnnouncementScope.all)}</Radio>
            <Radio value={AnnouncementScope.custom}>{AnnouncementScope.description(AnnouncementScope.custom)}</Radio>
          </Radio.Group>,
        ),
      },
    ];
    if (isShowCustom) {
      formItems.push(
        {
          label: '平台',
          form: getFieldDecorator('platforms', { rules: [{ required: false, message: '请选择平台' }], initialValue: undefined })(
            <CommonSelectPlatforms allowClear showArrow mode="multiple" placeholder="请选择平台" onChange={this.onChangePlatforms} />,
          ),
        }, {
          label: '供应商',
          form: getFieldDecorator('suppliers', { rules: [{ required: false, message: '请选择供应商' }], initialValue: undefined })(
            <CommonSelectSuppliers state={SupplierState.enable} allowClear showArrow mode="multiple" placeholder="请选择供应商" platforms={platforms} onChange={this.onChangeSuppliers} disabled={platforms.length <= 0} />,
          ),
        }, {
          label: '城市',
          form: getFieldDecorator('cities', { rules: [{ required: false, message: '请选择城市' }], initialValue: undefined })(
            <CommonSelectCities className="maxHeight" enableSelectAll allowClear showArrow mode="multiple" placeholder="请选择城市" suppliers={suppliers} platforms={platforms} onChange={this.onChangeCity} disabled={suppliers.length <= 0} />,
          ),
        }, {
          label: '团队',
          form: getFieldDecorator('districts', { rules: [{ required: false, message: '请选择商圈' }], initialValue: undefined })(
            <CommonSelectDistricts
              className="maxHeight"
              enableSelectAll
              allowClear
              showArrow
              mode="multiple"
              placeholder="请选择商圈"
              suppliers={suppliers}
              platforms={platforms}
              cities={cities}
              onChange={this.onChangeDistrict}
              disabled={cities.length <= 0}
            />,
          ),
        },
      );
    }
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
    );
  }

  // 渲染提交按钮
  renderSubmit = () => {
    return (
      <Row>
        <Col span={11} className={style.boss_announcement_create_return}>
          <Button onClick={this.onReturnHom}>返回</Button>
        </Col>
        <Col span={11} offset={1} className={style.boss_announcement_create_submit}>
          <Button type="primary" onClick={this.onSubmit}>提交</Button>
        </Col>
      </Row>
    );
  }

  render = () => {
    const { isShowScope } = this.state;
    if (isShowScope !== true) {
      return (
        <Form layout="horizontal">
          <CoreContent title="基本信息" >
            {/* 渲染基本信息 */}
            {this.renderBasicInfo()}
          </CoreContent>

          <CoreContent title="权限配置" >
            {/* 渲染权限配置 */}
            {this.renderAccessConfiguration()}
          </CoreContent>

          <CoreContent>
            {/* 渲染状态信息 */}
            {this.renderSubmit()}
          </CoreContent>
        </Form>
      );
    }
    return (
      <Form layout="horizontal">
        <CoreContent title="基本信息" >
          {/* 渲染基本信息 */}
          {this.renderBasicInfo()}
        </CoreContent>

        <CoreContent title="权限配置" >
          {/* 渲染组织信息 */}
          {this.renderAccessConfiguration()}
        </CoreContent>

        <CoreContent title="权限范围" >
          {/* 渲染业务范围 */}
          {this.renderBusinessScope()}
        </CoreContent>

        <CoreContent>
          {/* 渲染状态信息 */}
          {this.renderSubmit()}
        </CoreContent>
      </Form>
    );
  };
}
function mapStateToProps({ permissions, applicationCommon }) {
  return { permissions, applicationCommon };
}
export default connect(mapStateToProps)(Form.create()(Create));
