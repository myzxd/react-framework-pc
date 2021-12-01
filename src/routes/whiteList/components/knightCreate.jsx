/**
 * 白名单 - 骑士创建   WhiteList/Components/KnightCreate
 */
import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Radio, Card, Checkbox } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../components/core';
import { WhiteListTeamType, WhiteListWorkType, WhiteListAddressBookState } from '../../../application/define';
import styles from './style/index.less';


const CheckboxGroup = Checkbox.Group;

const KnightCreate = (props = {}) => {
  const {
    form = {},
    onDefaultParams = () => { },
  } = props;

  // 改变通讯录 TODO:@@
  const onAddressBookChange = (e) => {
    const addressBook = e.target.value; // 是否显示通讯录
    const params = {
      addressBook,
    };

    // 通过通讯录值得改变修改通讯录默认值
    if (onDefaultParams) {
      onDefaultParams(params);
    }
  };

  // 加入团队改变
  const onTeamChange = () => {
    form.setFieldsValue({ isShowInfor: undefined });
  };

  // 加入团队
  const renderJoin = () => {
    const { getFieldDecorator, getFieldValue } = form;
    const formItems = [
      {
        label: '扫码加入团队方式是否需要管理员审核？',
        form: getFieldDecorator('isNeedAudit', { rules: [{ required: true, message: '请选择是否需要管理员审核' }] })(
          <Radio.Group>
            <Radio value={WhiteListTeamType.is}>{WhiteListTeamType.description(WhiteListTeamType.is)}</Radio>
            <Radio value={WhiteListTeamType.no}>{WhiteListTeamType.description(WhiteListTeamType.no)}</Radio>
          </Radio.Group>,
        ),
      },
      {
        label: '个户身份是否为加入团队必填项？',
        form: getFieldDecorator('isTeam', { rules: [{ required: true, message: '请选择个户身份是否为加入团队必填项' }] })(
          <Radio.Group onChange={onTeamChange}>
            <Radio value={WhiteListTeamType.is}>{WhiteListTeamType.description(WhiteListTeamType.is)}</Radio>
            <Radio value={WhiteListTeamType.no}>{WhiteListTeamType.description(WhiteListTeamType.no)}</Radio>
          </Radio.Group>,
        ),
      },
      {
        label: '工作档案中是否展示个户信息？',
        form: getFieldDecorator('isShowInfor', { rules: [{ required: true, message: '请选择工作档案中是否展示个户信息' }] })(
          <Radio.Group>
            <Radio value={WhiteListTeamType.is}>{WhiteListTeamType.description(WhiteListTeamType.is)}</Radio>
            <Radio value={WhiteListTeamType.no} disabled={getFieldValue('isTeam')}>{WhiteListTeamType.description(WhiteListTeamType.no)}</Radio>
          </Radio.Group>,
        ),
      },
    ];
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } };
    return (
      <Card bordered={false} className={styles['app-comp-white-list-create-card']}>
        <p className={styles['app-comp-white-list-create-card-title']}>加入团队</p>
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </Card>
    );
  };

  // 通讯录
  const renderAddressList = () => {
    const { getFieldDecorator } = form;
    const formItems = [
      {
        form: getFieldDecorator('addressBook', { rules: [{ required: true, message: '请选择应用终端范围' }], initialValue: WhiteListAddressBookState.show })(
          <Radio.Group name="radiogroup" onChange={onAddressBookChange}>
            <Radio value={WhiteListAddressBookState.hide}>{WhiteListAddressBookState.description(WhiteListAddressBookState.hide)}</Radio>
            <Radio value={WhiteListAddressBookState.show}>{WhiteListAddressBookState.description(WhiteListAddressBookState.show)}</Radio>
          </Radio.Group>,
        ),
      },
    ];
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 10 } };
    return (
      <Card bordered={false} className={styles['app-comp-white-list-create-card']}>
        <p className={styles['app-comp-white-list-create-card-title']}>通讯录</p>
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </Card>
    );
  };

  // 工作台
  const renderWorkBench = () => {
    const { getFieldDecorator } = form;
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
      {
        form: getFieldDecorator('workBench', { rules: [{ required: true, message: '请选择应用终端范围' }] })(
          <CheckboxGroup options={options}>{options.label}</CheckboxGroup>,
        ),
      },
    ];
    const layout = { labelCol: { span: 24 }, wrapperCol: { span: 24 } };
    return (
      <Card bordered={false} className={styles['app-comp-white-list-create-card']}>
        <p className={styles['app-comp-white-list-create-card-title']}>工作台</p>
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </Card>
    );
  };

  return (
    <CoreContent title="选择功能模块" style={{ backgroundColor: '#FAFAFA' }}>

      {renderJoin()}

      {renderAddressList()}

      {renderWorkBench()}
    </CoreContent>
  );
};

export default Form.create()(KnightCreate);
