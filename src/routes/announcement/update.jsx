/**
 * 系统管理 - 用户管理 - 编辑用户
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Radio, Row, Col, Button, message } from 'antd';

import { DeprecatedCoreForm, CoreContent } from '../../components/core';
import { CommonSelectPositions, CommonSelectPlatforms, CommonSelectSuppliers, CommonSelectCities, CommonSelectDistricts, CommonSelectMembers } from '../../components/common';
import { AnnouncementSendPermissions, AnnouncementScope, SupplierState } from '../../application/define';

class Update extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        platforms: [],  // 平台
        suppliers: [],  // 供应商(页面组件选中使用)
        cities: [],     // 城市(页面组件选中使用)
        districts: [],  // 商圈
      },
      id: dot.get(props, 'location.query.id', undefined), // 用户id
    };
  }

  componentDidMount() {
    const { id } = this.state;
    if (id !== undefined) {
      this.props.dispatch({ type: 'permissions/fetchPermissionsDetails', payload: { id } });  // 权限详情数据
    }
  }

  componentWillUnmount = () => {
    this.componentReset();
    this.props.dispatch({ type: 'permissions/resetPermissionsDetails' });  // 重置权限详情数据
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

  // 更改公告发送权限
  onPermissionChange = (e) => {
    const { form } = this.props;
    if (e.target.value === AnnouncementSendPermissions.no) {
      // 清空选项
      form.setFieldsValue({ scope: undefined });
      form.setFieldsValue({ platforms: [] });
      form.setFieldsValue({ suppliers: [] });
      form.setFieldsValue({ cities: [] });
      form.setFieldsValue({ districts: [] });
    }
  }

  // 更改公告接收人范围
  onScopeChange = (e) => {
    const { form } = this.props;
    if (e.target.value === AnnouncementScope.all) {
      // 清空选项
      form.setFieldsValue({ platforms: [] });
      form.setFieldsValue({ suppliers: [] });
      form.setFieldsValue({ cities: [] });
      form.setFieldsValue({ districts: [] });
    }
  }

  // 返回首页
  onReturnHom = () => {
    this.props.history.push('/Announcement/Permissions');
  }

  // 成功的回调函数
  onSuccessCallback = () => {
    message.success('更新成功');
    this.props.history.push('/Announcement/Permissions');
  }

  // 编辑用户
  onSubmit = (e) => {
    const { id } = this.state;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const { positions, permission, scope, platforms, suppliers, cities, districts } = values;
      const params = { positions, members: id, permission, scope, platforms, suppliers, cities, districts };
      this.props.dispatch({
        type: 'permissions/updatePermissions',
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
      },
    });
    // 重置表单
    this.props.form.resetFields();
  }

  // 渲染基本信息
  renderBasicInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const { editRecord } = this.props;
    const formItems = [
      {
        label: '角色',
        form: getFieldDecorator('positions', { rules: [{ required: true, message: '请选择角色' }], initialValue: `${dot.get(editRecord, 'gid', '')}` })(
          <CommonSelectPositions onlyShowOperable placeholder="请选择角色" onChange={this.onChangePoistions} disabled />,
        ),
      }, {
        label: '成员',
        form: getFieldDecorator('members', { rules: [{ required: true, message: '请选择成员' }], initialValue: `${dot.get(editRecord, 'name', '')}` })(
          <CommonSelectMembers allowClear showArrow mode="multiple" placeholder="请选择成员" onChange={this.onChangeMembers} disabled />,
        ),
      },
    ];
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
    );
  }

  // 渲染组织信息
  renderAccessConfiguration = () => {
    const { getFieldDecorator } = this.props.form;
    const editRecord = dot.get(this.props, 'permissions.permissionsDetail', {});
    const formItems = [
      {
        label: '公告发送权限',
        form: getFieldDecorator('permission', { rules: [{ required: true, message: '请选择状态' }], initialValue: dot.get(editRecord, 'notice_permission') })(
          <Radio.Group onChange={this.onPermissionChange}>
            <Radio value={AnnouncementSendPermissions.yes}>{AnnouncementSendPermissions.description(AnnouncementSendPermissions.yes)}</Radio>
            <Radio value={AnnouncementSendPermissions.no}>{AnnouncementSendPermissions.description(AnnouncementSendPermissions.no)}</Radio>
          </Radio.Group>,
        ),
      },
    ];

    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
    );
  }

  // 渲染业务范围
  renderBusinessScope = () => {
    const { getFieldDecorator } = this.props.form;
    const editRecord = dot.get(this.props, 'permissions.permissionsDetail', {});
    const { getFieldValue } = this.props.form;
    let { platforms, suppliers, cities, districts } = this.state.fields;

    // 详情选中的数据（平台）
    const recordPlatfroms = dot.get(editRecord, 'platform_info_list', []).map(item => item.platform_code);
    // 详情选中的数据（供应商）
    const recordSuppliers = dot.get(editRecord, 'supplier_info_list', []).map(item => item._id);
    // 详情选中的数据（城市）
    const recordCities = dot.get(editRecord, 'city_info_list', []).map(item => item.city_spelling);
    // 详情选中的数据（商圈）
    const recordDistricts = dot.get(editRecord, 'biz_district_info_list', []).map(item => item._id);

    // 判断选中的平台数据是否为空，为空则使用详情数据
    if (is.empty(platforms) && is.not.empty(recordPlatfroms)) {
      platforms = recordPlatfroms;
    }
    // 判断选中的供应商数据是否为空，为空则使用详情数据
    if (is.empty(suppliers) && is.not.empty(recordSuppliers)) {
      suppliers = recordSuppliers;
    }
    // 判断选中的城市数据是否为空，为空则使用详情数据
    if (is.empty(cities) && is.not.empty(recordCities)) {
      cities = recordCities;
    }
    // 判断选中的团队数据是否为空，为空则使用详情数据
    if (is.empty(districts) && is.not.empty(recordDistricts)) {
      districts = recordDistricts;
    }
    const formItems = [
      {
        label: '接收人范围',
        form: getFieldDecorator('scope', { rules: [{ required: false, message: '请选择接收人范围' }], initialValue: dot.get(editRecord, 'domain') })(
          <Radio.Group onChange={this.onScopeChange}>
            <Radio value={AnnouncementScope.all}>{AnnouncementScope.description(AnnouncementScope.all)}</Radio>
            <Radio value={AnnouncementScope.custom}>{AnnouncementScope.description(AnnouncementScope.custom)}</Radio>
          </Radio.Group>,
        ),
      },
    ];
    const scope = getFieldValue('scope') || dot.get(editRecord, 'domain');
    // 根据接收人的范围判断平台,供应商是否显示
    if (scope === AnnouncementScope.custom) {
      formItems.push(
        {
          label: '平台',
          form: getFieldDecorator('platforms', { rules: [{ required: false, message: '请选择平台' }], initialValue: recordPlatfroms })(
            <CommonSelectPlatforms allowClear showArrow mode="multiple" placeholder="请选择平台" onChange={this.onChangePlatforms} />,
          ),
        }, {
          label: '供应商',
          form: getFieldDecorator('suppliers', { rules: [{ required: false, message: '请选择供应商' }], initialValue: recordSuppliers })(
            <CommonSelectSuppliers state={SupplierState.enable} showArrow allowClear mode="multiple" placeholder="请选择供应商" platforms={platforms} onChange={this.onChangeSuppliers} disabled={platforms.length <= 0} />,
          ),
        }, {
          label: '城市',
          form: getFieldDecorator('cities', { rules: [{ required: false, message: '请选择城市' }], initialValue: recordCities })(
            <CommonSelectCities
              className="maxHeight"
              enableSelectAll
              allowClear
              showArrow
              mode="multiple"
              placeholder="请选择城市"
              suppliers={suppliers}
              platforms={platforms}
              onChange={this.onChangeCity}
              disabled={suppliers.length <= 0}
              style={{ maxHeight: '300px', overflow: 'hidden' }}
            />,
          ),
        }, {
          label: '团队',
          form: getFieldDecorator('districts', { rules: [{ required: false, message: '请选择商圈' }], initialValue: recordDistricts })(
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
              style={{ maxHeight: '300px', overflow: 'hidden' }}
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
        <Col span={11} style={{ textAlign: 'right' }}>
          <Button onClick={this.onReturnHom}>返回</Button>
        </Col>
        <Col span={11} offset={1} style={{ textAlign: 'left' }}>
          <Button type="primary" onClick={this.onSubmit}>提交</Button>
        </Col>
      </Row>
    );
  }
  renderContent = () => {
    const { getFieldValue } = this.props.form;
    const editRecord = dot.get(this.props, 'permissions.permissionsDetail', {});
    const permission = `${getFieldValue('permission')}` === 'undefined' ? `${dot.get(editRecord, 'notice_permission')}` : `${getFieldValue('permission')}`;
    if (`${permission}` === `${AnnouncementSendPermissions.yes}`) {
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

          <CoreContent title="权限范围" >
            {/* 渲染权限范围 */}
            {this.renderBusinessScope()}
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
  render = () => {
    return (
      <div>
        {/* 渲染编辑内容 */}
        {this.renderContent()}
      </div>
    );
  };
}

function mapStateToProps({ permissions: { permissionsDetail = {} } }) {
  return { editRecord: permissionsDetail };
}

export default connect(mapStateToProps)(Form.create()(Update));
