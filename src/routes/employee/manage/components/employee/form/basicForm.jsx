/**
 * 员工档案 - 创建 - 基本信息tab
 */
import React, {
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  Button,
  Form,
} from 'antd';
import {
  EmployeePageSetp,
} from '../../../../../../application/define';

import { cryptoRandomString } from '../../../../../../application/utils';
import IdentityForm from './idnentityForm';
import PersonalForm from './personalForm';
import BankForm from './bankForm';
import EducationForm from './educationForm';
import RecommendedSourceForm from './recommendedSourceForm';
import onResetForm from './resetStaff.js';

import style from './style.less';

const BaseInfoForm = forwardRef(({
  setTabKey,
  onChangeTabKeys,
  employeeDetail, // 员工档案详情
  dispatch,
  employeeId, // 员工id
  onSave, // 编辑保存
  onResetStaff,
  onBack, // 返回
  specialFields,
}, ref) => {
  const [form] = Form.useForm();

  // 重置状态值
  const [resetState, setResetState] = useState(undefined);

  // 暴露ref
  useImperativeHandle(ref, () => form);

  // 下一步
  const onDownStep = () => {
    form.validateFields().then(() => {
      setTabKey(EmployeePageSetp.work);
      onChangeTabKeys(EmployeePageSetp.work);
      // 表单校验，跳转第一个报错字段
    }).catch((error) => {
      // 出生日期错误处理（日期选择框问题）
      const errorName = error.errorFields[0].name[0] === 'born_in' ?
        ['national'] : error.errorFields[0].name;

      form.scrollToField(
        errorName,
        {
          behavior: actions => actions.forEach(({ el, top }) => {
            // eslint-disable-next-line no-param-reassign
            el.scrollTop = top - 5;
          }),
        },
      );
    });
  };

  // 提交
  const onUpdate = () => {
    form.validateFields().then((values) => {
      onSave && onSave(values);
      // 表单校验，跳转第一个报错字段
    }).catch((error) => {
      // 出生日期错误处理（日期选择框问题）
      const errorName = error.errorFields[0].name[0] === 'born_in' ?
        ['national'] : error.errorFields[0].name;

      form.scrollToField(
        errorName,
        {
          behavior: actions => actions.forEach(({ el, top }) => {
            // eslint-disable-next-line no-param-reassign
            el.scrollTop = top - 5;
          }),
        },
      );
    });
  };

  // 创建重置
  const onResetCreate = () => {
    form.resetFields();
    setResetState(cryptoRandomString(32));
    onResetForm({}, { basicFormRef: { current: form } });
  };

  // 编辑重置
  const onResetUpdate = () => {
    setResetState(cryptoRandomString(32));
    onResetForm(employeeDetail, { basicFormRef: { current: form } });
  };

  // 创建页操作
  const renderCreateOperation = () => {
    return (
      <div
        style={{
          margin: '5px 0',
        }}
        className={style['contract-tab-scroll-button']}
      >
        <Button
          onClick={onResetCreate}
          style={{
            marginRight: 10,
          }}
        >重置</Button>
        <Button
          onClick={onDownStep}
          type="primary"
        >下一步</Button>
      </div>
    );
  };

  // 编辑页操作
  const renderUpdateOperation = () => {
    return (
      <div
        style={{
          margin: '5px 0',
        }}
        className={style['contract-tab-scroll-button']}
      >
        <Button
          style={{ marginRight: 10 }}
          onClick={onBack}
        >返回</Button>
        <Button
          style={{ marginRight: 10 }}
          onClick={onResetUpdate}
        >重置</Button>
        <Button
          onClick={onUpdate}
          type="primary"
        >提交</Button>
      </div>
    );
  };

  const props = {
    form,
    employeeDetail,
    onResetStaff,
    resetState,
    employeeId,
    specialFields,
  };

  return (
    <React.Fragment>
      <div
        className={style['contract-tab-content-wrap']}
      >
        <div
          className={style['contract-tab-scroll-content']}
        >
          <IdentityForm {...props} />
          <PersonalForm {...props} />
          <BankForm {...props} />
          <EducationForm {...props} />
          <RecommendedSourceForm {...props} />
        </div>
        {
        employeeId ?
          renderUpdateOperation()
          : renderCreateOperation()
      }
      </div>
    </React.Fragment>
  );
});

export default BaseInfoForm;
