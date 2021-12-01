/**
 * 系统管理 - 账号管理 - 编辑用户
 */
import is from 'is_js';
import { connect } from 'dva';
import React, { useRef, useEffect, useState } from 'react';
import {
  Form, Input, Radio, Row, Col, Button, Select,
} from 'antd';
import dot from 'dot-prop';

import { CoreForm, CoreContent } from '../../../../components/core';
import { CommonSelectPositions } from '../../../../components/common';
import { AccountState, SigningState } from '../../../../application/define';
import { asyncValidatePhoneNumber } from '../../../../application/utils';
import { system } from '../../../../application';
import CodeModal from './../../../../components/common/modal/codeModal';

import styles from './style/index.less';


const codeFlag = system.isShowCode(); // 判断是否是code
const { Option } = Select;

const Layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
// 签约状态（固定五种）
const SignState = [
  SigningState.pending, SigningState.normal, SigningState.replace,
  SigningState.pendingReview, SigningState.repair,
];


const Update = ({
  dispatch, history, staffProfile, location, ...restProps
}) => {
  const [form] = Form.useForm();

  const submiting = useRef(false);
  const [roleInfos, setRoleInfos] = useState([]);
  const [isShowCodeModal, setIsShowCodeModal] = useState(false);
  const [targetKeys, setTargetKeys] = useState([]);
  const [targetItems, setTargetItems] = useState([]);

  // 用户id
  const { id } = location.query;

  // 用户数据 （防止为null或undefined取值报错）
  const accountDetail = restProps.accountDetail ? restProps.accountDetail : {};

  useEffect(() => {
    // 获取员工档案回调
    const getStaff = (name, phone) => {
      const payload = {
        name,
        phone,
        signState: SigningState,
      };
      dispatch({
        type: 'employeeManage/fetchStaffProfile',
        payload,
      });
    };
    if (id) {
      dispatch({
        type: 'accountManage/fetchAccountsDetails',
        payload: { id, getStaff },
      });
    }
    return () => dispatch({ type: 'accountManage/resetAccountsDetails' });
  }, [id, dispatch]);

  useEffect(() => {
    setRoleInfos(accountDetail.code_biz_group_infos);
    setTargetKeys(accountDetail.allow_biz_group_ids);
    setTargetItems(dot.get(accountDetail, 'allow_biz_group_infos', []));
  }, [accountDetail]);


  // 如果没有数据，返回null，不渲染表单
  if (Object.keys(accountDetail).length < 1) {
    return null;
  }

  // 返回首页
  const onReturnHom = () => {
    history.push('/System/Account/Manage');
  };

  // 成功的回调函数
  const onSuccessCallback = () => {
    history.push('/System/Account/Manage');
  };

  const onFailureCallback = () => {
    submiting.current = false;
  };

  // 清空职位数据
  const onChangeState = () => {
    form.setFieldsValue({ jobs: [] });
  };

  // 改变电话号码
  const onChangePhone = (e) => {
    const phoneValue = e.target.value;
    // 重置员工档案
    form.setFieldsValue({
      staffProfileId: undefined,
    });

    // 输入的手机号为11位 && 输入的姓名有值
    if (phoneValue.length > 10) {
      const payload = {
        phone: phoneValue,
        SignState,
      };
      dispatch({
        type: 'employeeManage/fetchStaffProfile',
        payload,
      });
    } else {
      dispatch({ type: 'employeeManage/resetStaffProfile' });
    }
  };


  // 角色
  const onChangePositions = (e, infos) => {
    setRoleInfos(infos);
  };

  // 关闭code弹框
  const onCancelCodeModal = () => {
    setTargetItems([...targetItems]);
    setIsShowCodeModal(false);
    setTargetKeys([...targetKeys]);
  };

  // code弹框确定
  const onOkCodeModal = (keys, items) => {
    setTargetItems(items);
    setTargetKeys(keys);
    setIsShowCodeModal(false);
  };

  // 编辑用户
  const onSubmit = (values) => {
    // 防止多次提交
    if (submiting.current) {
      return;
    }
    const payload = {
      params: { id, ...values },
      onSuccessCallback,
      onFailureCallback,
    };
    // 判断是否是code系统
    if (codeFlag) {
      payload.allowBizGroupIds = targetKeys;
    }
    dispatch({
      type: 'accountManage/updateAccount',
      payload,
    });
  };

  // 渲染基本信息
  const renderBasicInfo = () => {
    const formItems = [
      <Form.Item
        label="姓名"
        name="name"
        rules={[{ required: true, message: '请输入姓名' }]}
      >
        <Input placeholder="请输入姓名" />
      </Form.Item>,
      <Form.Item
        label="手机号"
        name="phone"
        rules={[{ required: true, validator: asyncValidatePhoneNumber }]}
      >
        <Input placeholder="请输入手机号" onChange={onChangePhone} />
      </Form.Item>,
      <Form.Item label="员工档案" name="staffProfileId">
        <Select
          allowClear
          placeholder="请选择员工档案"
        >
          {staffProfile.map((item, index) =>
            <Option value={item._id} key={index}>{item.name}({item.identity_card_id})</Option>,
          )}
        </Select>
      </Form.Item>,
    ];
    return (
      <CoreForm items={formItems} />
    );
  };

  // 渲染组织信息
  const renderOrganizationInfo = () => {
    const formItems = [
      <Form.Item
        label="角色"
        name="positions"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 10 }}
        rules={[{ required: true, message: '请选择角色' }]}
      >
        <CommonSelectPositions
          onChange={onChangePositions}
          allowClear
          showSearch
          optionFilterProp="children"
          mode="multiple"
          showArrow
          onlyShowOperable
          roleIds={accountDetail.role_ids}
          roleNames={accountDetail.role_names}
          placeholder="请选择角色"
        />
      </Form.Item>,
    ];
    // 判断是否有数据
    if (codeFlag === true) {
      formItems.push(
        <Form.Item
          label="角色数据授权"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 22 }}
        >
          <div>
            {is.existy(roleInfos) && is.not.empty(roleInfos) ? roleInfos.map((v) => {
              return v.name;
            }).join(', ') : '--'
            }
          </div>
        </Form.Item>,
      );
    }
    return (
      <CoreForm items={formItems} cols={1} />
    );
  };

      // 外部数据策略信息
  const renderExternalDataInfo = () => {
    // 判断是否是code系统
    if (codeFlag !== true) {
      return null;
    }
    const formItems = [
      <Form.Item
        label="特殊数据授权"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
      >
        <div>
          <Button
            onClick={() => {
              setIsShowCodeModal(true);
            }}
          >请选择</Button>
          <div>
            {targetItems.map(v => v.name).join(', ')}
          </div>
        </div>
      </Form.Item>,
    ];

    return (
      <CoreContent title="外部数据策略信息">
        <CoreForm items={formItems} cols={1} />
        {
          <CodeModal
            visible={isShowCodeModal}
            roleInfos={roleInfos}
            values={targetKeys}
            onOk={onOkCodeModal}
            onCancel={onCancelCodeModal}
          />}
      </CoreContent>
    );
  };

  // 渲染创建的表单
  const renderStateInfo = () => {
    const formItems = [
      <Form.Item
        label="状态"
        name="state"
        rules={[{ required: true, message: '请选择状态' }]}
      >
        <Radio.Group
          onChange={onChangeState}
        >
          <Radio value={AccountState.on}>{AccountState.description(AccountState.on)}</Radio>
          <Radio value={AccountState.off}>{AccountState.description(AccountState.off)}</Radio>
        </Radio.Group>
      </Form.Item>,
    ];

    return (
      <CoreForm items={formItems} />
    );
  };

  // 渲染提交按钮
  const renderSubmit = () => {
    return (
      <Row>
        <Col span={11} className={styles['app-comp-system--create-operate-back-col']}>
          <Button onClick={onReturnHom}>返回</Button>
        </Col>
        <Col span={11} offset={1}>
          <Button type="primary" htmlType="submit">提交</Button>
        </Col>
      </Row>
    );
  };

  const initialValues = {
    name: accountDetail.name,
    phone: accountDetail.phone,
    staffProfileId: dot.get(accountDetail, 'staff_profile_id', undefined),
    positions: accountDetail.role_ids,
    state: dot.get(accountDetail, 'state', AccountState.on),
  };

  return (
    <Form
      {...Layout}
      initialValues={initialValues}
      form={form}
      layout="horizontal"
      onFinish={onSubmit}
    >
      <CoreContent title="基本信息" >
        {/* 渲染基本信息 */}
        {renderBasicInfo()}
      </CoreContent>

      <CoreContent title="组织信息" >
        {/* 渲染组织信息 */}
        {renderOrganizationInfo()}
      </CoreContent>

      {/* 外部数据策略信息 */}
      {renderExternalDataInfo()}

      <CoreContent title="状态信息" >
        {/* 渲染状态信息 */}
        {renderStateInfo()}
      </CoreContent>

      <CoreContent>
        {/* 渲染状态信息 */}
        {renderSubmit()}
      </CoreContent>
    </Form>
  );
};

function mapStateToProps({
  accountManage: { accountDetail }, employeeManage: { staffProfile },
}) {
  return { accountDetail, staffProfile };
}
export default connect(mapStateToProps)(Update);
