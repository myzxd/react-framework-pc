/**
 * 白名单 - 骑士编辑   WhiteList/Components/KnightUpdate
 */

import dot from 'dot-prop';
import React, { useEffect } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Radio, Card, Checkbox, Form } from 'antd';
import { CoreContent, CoreForm } from '../../../components/core';
import { WhiteListTeamType, WhiteListWorkType, WhiteListAddressBookState } from '../../../application/define';
import styles from './style/index.less';

const CheckboxGroup = Checkbox.Group;

const KnightCreate = (props = {}) => {
  const {
    data = {},
    form = {},
    onDefaultParamsCallback = () => { },
  } = props;

  // 默认值
  useEffect(() => {
    form.setFieldsValue({
      isTeam: dot.get(data, 'individual_register_required', undefined),
      isShowInfor: dot.get(data, 'individual_show_in_work_profile', undefined),
      addressBook: dot.get(data, 'address_book_show', undefined),
      workBench: dot.get(data, 'workbench_label', undefined),
      isNeedAudit: dot.get(data, 'qrcode_apply_check', undefined),
    });
  }, [data]);

  // 改变通讯录
  const onAddressBookChange = (e) => {
    const addressBook = e.target.value; // 是否显示通讯录
    const params = {
      addressBook,
    };

    // 通过通讯录值得改变修改通讯录默认值
    if (onDefaultParamsCallback) {
      onDefaultParamsCallback(params);
    }
  };

  // 加入团队改变
  const onTeamChange = () => {
    form.setFieldsValue({ isShowInfor: undefined });
  };

  // 加入团队
  const renderJoin = () => {
    const { getFieldValue } = form;
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } };
    // 是否显示各户信息
    const isShowTeam = getFieldValue('isTeam') !== undefined ? getFieldValue('isTeam') : dot.get(data, 'individual_register_required');
    const formItems = [
      <Form.Item
        label="扫码加入团队方式是否需要管理员审核？"
        name="isNeedAudit"
        rules={[{ required: true, message: '请选择是否需要管理员审核' }]}
        {...layout}
      >
        <Radio.Group>
          <Radio value={WhiteListTeamType.is}>{WhiteListTeamType.description(WhiteListTeamType.is)}</Radio>
          <Radio value={WhiteListTeamType.no}>{WhiteListTeamType.description(WhiteListTeamType.no)}</Radio>
        </Radio.Group>
      </Form.Item>,
      <Form.Item
        label="个户身份是否为加入团队必填项？"
        name="isTeam"
        rules={[{ required: true, message: '请选择个户身份是否为加入团队必填项' }]}
        {...layout}
      >
        <Radio.Group onChange={onTeamChange}>
          <Radio value={WhiteListTeamType.is}>{WhiteListTeamType.description(WhiteListTeamType.is)}</Radio>
          <Radio value={WhiteListTeamType.no}>{WhiteListTeamType.description(WhiteListTeamType.no)}</Radio>
        </Radio.Group>
      </Form.Item>,
      <Form.Item
        label="工作档案中是否展示个户信息？"
        name="isShowInfor"
        rules={[{ required: true, message: '请选择工作档案中是否展示个户信息' }]}
        {...layout}
      >
        <Radio.Group>
          <Radio value={WhiteListTeamType.is}>{WhiteListTeamType.description(WhiteListTeamType.is)}</Radio>
          <Radio value={WhiteListTeamType.no} disabled={isShowTeam}>{WhiteListTeamType.description(WhiteListTeamType.no)}</Radio>
        </Radio.Group>
      </Form.Item>,
    ];
    return (
      <Card bordered={false} className={styles['app-comp-white-list-create-card']}>
        <p className={styles['app-comp-white-list-create-card-title']}>加入团队</p>
        <CoreForm items={formItems} cols={1} layout={layout} />
      </Card>
    );
  };

  // 通讯录
  const renderAddressList = () => {
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 10 } };
    const formItems = [
      <Form.Item
        name="addressBook"
        rules={[{ required: true, message: '请选择应用终端范围' }]}
        {...layout}
      >
        <Radio.Group name="radiogroup" onChange={onAddressBookChange}>
          <Radio value={WhiteListAddressBookState.hide}>{WhiteListAddressBookState.description(WhiteListAddressBookState.hide)}</Radio>
          <Radio value={WhiteListAddressBookState.show}>{WhiteListAddressBookState.description(WhiteListAddressBookState.show)}</Radio>
        </Radio.Group>
      </Form.Item>,
    ];
    return (
      <Card bordered={false} className={styles['app-comp-white-list-create-card']}>
        <p className={styles['app-comp-white-list-create-card-title']}>通讯录</p>
        <CoreForm items={formItems} cols={1} layout={layout} />
      </Card>
    );
  };

  // 工作台
  const renderWorkBench = () => {
    const layout = { labelCol: { span: 24 }, wrapperCol: { span: 24 } };
    const options = [
      { label: WhiteListWorkType.description(WhiteListWorkType.team), value: WhiteListWorkType.team },
      { label: WhiteListWorkType.description(WhiteListWorkType.work), value: WhiteListWorkType.work },
      { label: WhiteListWorkType.description(WhiteListWorkType.data), value: WhiteListWorkType.data },
      { label: WhiteListWorkType.description(WhiteListWorkType.study), value: WhiteListWorkType.study },
      { label: WhiteListWorkType.description(WhiteListWorkType.internal), value: WhiteListWorkType.internal },
      { label: WhiteListWorkType.description(WhiteListWorkType.receive), value: WhiteListWorkType.receive },
      { label: WhiteListWorkType.description(WhiteListWorkType.advance), value: WhiteListWorkType.advance },
      { label: WhiteListWorkType.description(WhiteListWorkType.insurance), value: WhiteListWorkType.insurance },
    ];
    const formItems = [
      <Form.Item
        name="workBench"
        rules={[{ required: true, message: '请选择应用终端范围' }]}
        {...layout}
      >
        <CheckboxGroup options={options}>{options.label}</CheckboxGroup>
      </Form.Item>,
    ];
    return (
      <Card bordered={false} className={styles['app-comp-white-list-create-card']}>
        <p className={styles['app-comp-white-list-create-card-title']}>工作台</p>
        <CoreForm items={formItems} cols={1} layout={layout} />
      </Card>
    );
  };

  return (
    <CoreContent title="选择功能模块" style={{ backgroundColor: '#FAFAFA' }}>

      {/* 加入团队*/}
      {renderJoin()}

      {/* 通讯录*/}
      {renderAddressList()}

      {/* 工作台*/}
      {renderWorkBench()}
    </CoreContent>
  );
};

export default KnightCreate;