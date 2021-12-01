/**
 * 组织架构 - 部门管理 - 数据权限范围Tab - update组件
 */
import is from 'is_js';
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import { Form, Button, message } from 'antd';

import { CoreContent, CoreForm } from '../../../../../components/core';
import { CommonSelectScene } from '../../../../../components/common';
import Platform from '../../components/platform';
import Supplier from '../../components/supplier';
import City from '../../components/city';
import { OrganizationBizLabelType, ExpenseTeamType } from '../../../../../application/define';

import style from '../index.less';

// 页面类型
const PageType = {
  detail: 10,
  update: 20,
};

// 操作类型
const OperateType = {
  create: 10,
  update: 20,
};

function Update(props) {
  const [form] = Form.useForm();
  const [requiredFlag, onChangeRequiredFlag] = useState(false);
  const [isHeadquarters, setHeadquarters] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isPermission, onChangePermission] = useState(false);
  const {
    data = {},
    allPlatformList = {},
    dispatch,
    initPlatformList = [], // 初始表单平台value
  } = props;
  const {
    platform_codes: platform = [],
    supplier_ids: supppler = [],
    city_codes: city = [],
    industry_codes: industryCodes = [],
  } = data;
  const [scenseVal, setScenseVal] = useState(industryCodes);
  // 获取全量平台
  useEffect(() => {
    dispatch({
      type: 'organizationBusiness/getAllPlatformList',
      payload: {},
    });
  }, [dispatch]);

  useEffect(() => {
    form.validateFields(['platformCodes', 'supplierIds', 'cityCodes']);
  }, [form, requiredFlag]);

  useEffect(() => {
    const fetchDate = async () => {
      const res = await dispatch({ type: 'organizationBusiness/gainDataPermissionValidator' });
      onChangePermission(res);
    };
    fetchDate();
  }, []);

  // scense
  const onChangeScense = (val = []) => {
    // 全量场景list
    const { data: platformList = [] } = allPlatformList;
    setScenseVal(val);

    // 处理平台value
    let curPlatformCodesValue = [];

    // 根据场景与平台的级联关系设置平台value
    if (Array.isArray(val) && val.length > 0) {
      // 获取当前所选择的平台value
      const platformCodesValue = form.getFieldValue('platformCodes');

      // 过滤当前选择的场景list
      const curPlatformList = platformList.filter(i => val.includes(i.industry_code));

      // 过滤对应场景下的已选平台
      curPlatformCodesValue = platformCodesValue.filter(i => curPlatformList.find(p => p.platform_code === i));
    }

    // 设置平台value
    form.setFieldsValue({ platformCodes: curPlatformCodesValue });
  };

  // platform onChange
  const onChangePlatfrom = (val) => {
    const isZongBu = (val && Array.isArray(val) && val.length === 1 && val.filter(i => i === 'zongbu').length > 0) || (val && val === 'zongbu');

    // 所选平台中包含总部，则供应商与城市为不必选
    if (isZongBu) {
      setHeadquarters(true);
      setIsDisabled(true);
      onChangeRequiredFlag(false);
      form.setFieldsValue({ supplierIds: undefined, cityCodes: undefined });
      return;
    } else {
      setIsDisabled(false);
      setHeadquarters(false);
    }

    const cityCodes = form.getFieldValue('cityCodes');
    const supplierIds = form.getFieldValue('supplierIds');
    if ((is.existy(val) && is.not.empty(val)) ||
      (is.existy(cityCodes) && is.not.empty(cityCodes)) ||
    (is.existy(supplierIds) && is.not.empty(supplierIds))) {
      onChangeRequiredFlag(true);
      return;
    }
    onChangeRequiredFlag(false);
  };

    // supplier onChange
  const onChangeSupplier = (val) => {
    // 所选平台中包含总部，则供应商与城市为不必选
    if (isHeadquarters) {
      onChangeRequiredFlag(false);
      return;
    }

    const platformCodes = form.getFieldValue('platformCodes');
    const cityCodes = form.getFieldValue('cityCodes');
    if ((is.existy(val) && is.not.empty(val)) ||
      (is.existy(platformCodes) && is.not.empty(platformCodes)) ||
    (is.existy(cityCodes) && is.not.empty(cityCodes))) {
      onChangeRequiredFlag(true);
      return;
    }
    onChangeRequiredFlag(false);
  };

  // city onChange
  const onChangeCity = (val) => {
    // 所选平台中包含总部，则供应商与城市为不必选
    if (isHeadquarters) {
      onChangeRequiredFlag(false);
      return;
    }

    const platformCodes = form.getFieldValue('platformCodes');
    const supplierIds = form.getFieldValue('supplierIds');
    if ((is.existy(val) && is.not.empty(val)) ||
      (is.existy(platformCodes) && is.not.empty(platformCodes)) ||
    (is.existy(supplierIds) && is.not.empty(supplierIds))) {
      onChangeRequiredFlag(true);
      return;
    }
    onChangeRequiredFlag(false);
  };

    // 失败回调
  const onFailureCallback = (res) => {
    res.zh_message && message.error(res.zh_message);
    // const { onChangeType } = props;
    // onChangeType && onChangeType(PageType.detail);
  };

    // 成功回调
  const onSuccessCallback = () => {
    const { onChangeType } = props;
    onChangeType && onChangeType(PageType.detail);
    props.onSuccessCallback && props.onSuccessCallback();
  };

    // 保存
  const onFinish = (val) => {
    const { departmentId, operateType } = props;
    const params = {
      departmentId,
      type: OrganizationBizLabelType.four,
      ...val,
      onSuccessCallback,
      onFailureCallback,
    };

      // 新建
    operateType === OperateType.create && (dispatch({ type: 'organizationBusiness/createBusinessTag', payload: params }));

      // 编辑
    operateType === OperateType.update && (dispatch({ type: 'organizationBusiness/updateBusinessTag', payload: params }));
  };

  // 取消按钮
  const onCancel = () => {
    const { onChangeType } = props;
    onChangeType && onChangeType(PageType.detail);
  };


  const renderSystemForm = () => {
    const { teamAttrs } = props;
    // 是否为私教
    const isDepartmentCoach = Boolean(`${teamAttrs[0]}` === `${ExpenseTeamType.departmentCoach}`);
    // console.log(teamAttrs);
    const layout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 16,
      },
    };

    // 默认表单平台value
    const initPlatformListVal = Array.isArray(initPlatformList) && initPlatformList.length > 0 ? initPlatformList.map((p) => {
      const pKey = Object.keys(p);
      const pVal = Object.values(p);
      return {
        platform_code: pKey[0],
        name: pVal[0],
      };
    })
      : [];

    const formItems = [
      <Form.Item
        name="scense"
        label="场景"
        {...layout}
        dependencies={['platformCodes']}
        rules={[
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value && getFieldValue('platformCodes')) {
                return Promise.reject('请选择场景');
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <CommonSelectScene
          mode="multiple"
          showArrow
          disabled={isDisabled}
          enumeratedType="subjectScense"
          onChange={onChangeScense}
          style={{ width: '50%' }}
        />
      </Form.Item>,
      <Form.Item
        name="platformCodes"
        label="平台"
        {...layout}
        rules={[
          { required: requiredFlag, message: '请选择平台' },
        ]}
      >
        <Platform
          showSearch
          allowClear={!(isPermission && isDepartmentCoach)}
          mode={(isDepartmentCoach && isPermission) ? '' : 'multiple'}
          optionFilterProp="children"
          onChange={onChangePlatfrom}
          scense={scenseVal}
          initValues={initPlatformListVal}
        />
      </Form.Item>,
      <Form.Item
        name="supplierIds"
        label="供应商"
        {...layout}
        rules={[{ required: requiredFlag, message: '请选择供应商' }]}
      >
        <Supplier
          showSearch
          allowClear={!(isPermission && isDepartmentCoach)}
          mode={(isDepartmentCoach && isPermission) ? '' : 'multiple'}
          optionFilterProp="children"
          onChange={onChangeSupplier}
          disabled={isDisabled}
        />
      </Form.Item>,
      <Form.Item
        name="cityCodes"
        label="城市"
        {...layout}
        rules={[{ required: requiredFlag, message: '请选择城市' }]}
      >
        <City
          showSearch
          enableSelectAll
          allowClear
          mode="multiple"
          showArrow
          optionFilterProp="children"
          onChange={onChangeCity}
          disabled={isDisabled}
        />
      </Form.Item>,
    ];

    return (
      <CoreForm items={formItems} cols={1} />
    );
  };

  // 操作
  const renderOperate = () => {
    return (
      <div className={style['app-organization-busines-update-operate']}>
        <Button style={{ marginRight: 20 }} onClick={onCancel}>取消</Button>
        <Button type="primary" htmlType="submit">提交</Button>
      </div>
    );
  };

  return (
    <Form
      form={form}
      initialValues={{
        platformCodes: platform,
        supplierIds: supppler,
        cityCodes: city,
        scense: industryCodes,
      }}
      onFinish={onFinish}
    >
      <CoreContent title="数据权限范围">
        {/* 系统属性 */}
        {renderSystemForm()}
        {/* 操作 */}
        {renderOperate()}
      </CoreContent>
    </Form>
  );
}

const mapStateToProps = ({
  organizationBusiness: {
    allPlatformList, // 门下岗位编制列表
  },
}) => {
  return { allPlatformList };
};

export default connect(mapStateToProps)(Update);
