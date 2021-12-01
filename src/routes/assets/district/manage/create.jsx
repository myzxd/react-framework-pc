/**
 *  添加商圈
 */
import { connect } from 'dva';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Select, Button } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../../components/core';
import { CommonSelectSuppliers, CommonSelectCities, CommonSelectScene } from '../../../../components/common';
import {
  DistrictState,
  DistrictSource,               // 商圈来源
  DistrictManageMode,           // 商圈经营方式
} from '../../../../application/define/index';
import {
  utils,
} from '../../../../application';
import CommonSelectPlatforms from './components/platforms';
import ComponentTripartiteId from './components/tripartiteId.jsx';
import Tags from './components/tag';
import styles from './style/index.less';

const { Option } = Select;
// 标签组件类型
const ComponentType = {
  search: 10,
  create: 20,
};


class AddDistrict extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // 修改所属场景回调
  onChangeBusiness = () => {
    const { form } = this.props;
    form.setFieldsValue({
      platformCode: undefined,
      supplierId: undefined,
      cityId: undefined,
    });
  }

  // 选择平台回调
  onChangePlatformCode = (e) => {
    const { form } = this.props;

    // 平台不等于美团时，更多平台商圈id进行清空
    if (e !== 'meituan') {
      form.setFieldsValue({ tripartiteId: {} });
    }
    form.setFieldsValue({
      supplierId: undefined,
      cityId: undefined,
    });
  }

  // 选择商圈状态回调
  onChangeDistrictState = (value) => {
    const { setFieldsValue } = this.props.form;
    // 判断状态为筹备中时，平台商圈id清空
    if (Number(value) === DistrictState.preparation) {
      setFieldsValue({ customId: '' });
      setFieldsValue({ tripartiteId: {} });
    }
  }

  // 返回上一页
  onBack = () => {
    const { history } = this.props;
    history.push('/Assets/District/Manage');
  }

  // 创建商圈
  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, value) => {
      if (err) return;
      const payload = {
        ...value,
        onSuccessCallBack: this.onBack,
      };
      this.props.dispatch({
        type: 'districtManage/createDistrict',
        payload,
      });
    });
  }

  // 创建并添加下一项
  onKeepAdd = (e) => {
    e.preventDefault();
    const { validateFields } = this.props.form;
    validateFields((err, value) => {
      if (err) return;
      const payload = {
        ...value,
        onSuccessCallBack: this.createSuccessCallBack,
      };
      this.props.dispatch({
        type: 'districtManage/createDistrict',
        payload,
      });
    });
  }

  // 创建商圈请求成功回调
  createSuccessCallBack = () => {
    const { resetFields } = this.props.form;
    // 清空平台商圈Id、商圈名称
    resetFields(['customId', 'name', 'tags', 'tripartiteId']);
  }

  // 渲染业务归属
  renderBusinessAttribution = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItems = [
      {
        label: '所属场景',
        form: getFieldDecorator('business', {
          rules: [{ required: true, message: '请选择所属场景' }],
        })(
          <CommonSelectScene enumeratedType="industry" onChange={this.onChangeBusiness} />,
        ),
      },
      {
        label: '平台',
        form: getFieldDecorator('platformCode', {
          rules: [{ required: true, message: '请选择平台' }],
        })(
          <CommonSelectPlatforms
            allowClear
            showSearch
            placeholder="请选择平台"
            industryCodes={this.props.form.getFieldValue('business')}
            onChange={this.onChangePlatformCode}
          />,
        ),
      },
      {
        label: '供应商',
        form: getFieldDecorator('supplierId', {
          rules: [{ required: true, message: '请选择供应商' }],
        })(
          <CommonSelectSuppliers
            enableSelectAll
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择供应商"
            platforms={getFieldValue('platformCode')}
          />,
        ),
      },
      {
        label: '城市',
        form: getFieldDecorator('cityId', {
          rules: [{ required: true, message: '请选择城市' }],
        })(
          <CommonSelectCities
            enableSelectAll
            isExpenseModel
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择城市"
            platforms={getFieldValue('platformCode')}
          />,
        ),
      },
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <CoreContent title={'业务归属'}>
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 渲染基本信息
  renderBasicInfo = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const customIdRequired = Number(getFieldValue('state')) === DistrictState.enable;
    // 增加关联判断 是否开启三方平台
    const tripartiteChecked = this.props.form.getFieldValue('tripartiteId') && this.props.form.getFieldValue('tripartiteId').checked; // 是否开启三方平台
    let customIdRequiredBool = false;
    if (customIdRequired && !tripartiteChecked) {
      customIdRequiredBool = true;
    }
    const formItems = [
      {
        label: '状态',
        form: getFieldDecorator('state', {
          rules: [{ required: true, message: '请选择状态' }],
        })(
          <Select placeholder="请选择状态" onChange={this.onChangeDistrictState}>
            <Option
              value={`${DistrictState.enable}`}
            >
              {DistrictState.description(DistrictState.enable)}
            </Option>
            <Option
              value={`${DistrictState.preparation}`}
            >
              {DistrictState.description(DistrictState.preparation)}
            </Option>
          </Select>,
        ),
      },
      {
        label: '商圈名称',
        form: getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入商圈名称' }],
        })(
          <Input placeholder="请输入商圈名称" />,
        ),
      },
      {
        label: getFieldValue('platformCode') === 'meituan' ? '平台商圈ID（专送）' : '平台商圈ID', // 美团显示专送
        span: 8,
        form: getFieldDecorator('customId', {
          rules: [{ required: customIdRequiredBool, validator: utils.asyncValidateCustomId }],
        })(
          <Input disabled={!customIdRequired} placeholder="请输入商圈ID" />,
        ),
      },
    ];
    // 更多三方平台商圈ID渲染判断
    if (getFieldValue('platformCode') === 'meituan' &&
      getFieldValue('state') === `${DistrictState.enable}`) {
      formItems.push(
        {
          label: '三方平台商圈ID（非专送）',
          span: 15,
          layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
          form: getFieldDecorator('tripartiteId', {
            initialValue: {},
            rules: [{ required: false, validator: utils.asyncValidateTripartiteId }],
          })(
            <ComponentTripartiteId />,
          ),
        },
      );
    }
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <CoreContent title={'基本信息'}>
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 额外信息
  renderExtraInfo = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const formItems = [
      {
        label: '商圈来源',
        form: getFieldDecorator('source', {
          rules: [{ required: true, message: '请选择商圈来源' }],
        })(
          <Select placeholder="请选择">
            {utils.transOptions(DistrictSource, Option)}
          </Select>,
        ),
      },
      {
        label: '商圈经营方式',
        form: getFieldDecorator('mode', {
          rules: [{ required: true, message: '请选择商圈经营方式' }],
        })(
          <Select placeholder="请选择">
            {utils.transOptions(DistrictManageMode, Option)}
          </Select>,
        ),
      },
    ];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    return (
      <CoreContent title="额外信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 标签
  renderTag = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const formItems = [
      {
        label: '标签名称',
        form: getFieldDecorator('tags')(
          <Tags type={ComponentType.create} />,
        ),
      },
    ];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    return (
      <CoreContent title={'标签'}>
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 渲染操作按钮
  renderButton = () => {
    return (
      <div className={styles['app-comp-system-create-btn-wrap']}>
        <Button onClick={this.onBack}>返回</Button>
        <Button
          type="primary"
          onClick={this.onSubmit}
          className={styles['app-comp-system-create-submit-btn']}
        >
          提交
        </Button>
        <Button
          type="primary"
          onClick={this.onKeepAdd}
          className={styles['app-comp-system-create-next-btn']}
        >
          提交并添加下一项
        </Button>
      </div>
    );
  }

  render() {
    return (
      <div>
        <Form>
          {/* 渲染业务归属 */}
          {this.renderBusinessAttribution()}

          {/* 渲染基本信息 */}
          {this.renderBasicInfo()}

          {/* 渲染额外信息 */}
          {this.renderExtraInfo()}

          {/* 渲染标签 */}
          {this.renderTag()}

          {/* 渲染下方操作按钮 */}
          {this.renderButton()}

        </Form>
      </div>
    );
  }
}


export default Form.create()(connect()(AddDistrict));
