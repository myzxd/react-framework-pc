/**
 * 劳动者档案 - 编辑 - 基本信息tab
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

import { cryptoRandomString } from '../../../../../../application/utils';
import PersonalForm from './personalForm';
import RecommendedSourceForm from './recommendedSourceForm';
import EducationForm from './educationForm';
import WorkForm from './workForm';
import IdentityInfo from '../detail/identityInfo';
import BankInfo from '../detail/bankInfo';
import onResetForm from './resetLaborer.js';

import style from './style.less';

const BaseInfoForm = forwardRef(({
  employeeDetail, // 员工档案详情
  onSave, // 保存
  onBack, // 返回
}, ref) => {
  const [form] = Form.useForm();

  // 重置状态值
  const [resetState, setResetState] = useState(undefined);

  // 暴露ref
  useImperativeHandle(ref, () => form);

  // 编辑重置
  const onResetUpdate = () => {
    setResetState(cryptoRandomString(32));
    onResetForm(employeeDetail, { basicFormRef: { current: form } });
  };

  // 保存
  const onCurSave = () => {
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

  const props = {
    form,
    employeeDetail,
    resetState,
  };

  return (
    <React.Fragment>
      <div
        className={style['contract-tab-content-wrap']}
      >
        <div
          className={style['contract-tab-scroll-content']}
        >
          <PersonalForm {...props} />
          <RecommendedSourceForm {...props} />
          <EducationForm {...props} />
          <WorkForm {...props} />
          <IdentityInfo {...props} />
          <BankInfo {...props} />
        </div>
        <div
          className={style['contract-tab-scroll-button']}
        >
          <Button
            onClick={onBack}
            style={{
              marginRight: 10,
            }}
          >
          返回
        </Button>
          <Button
            onClick={onResetUpdate}
            style={{
              marginRight: 10,
            }}
          >重置</Button>
          <Button
            onClick={onCurSave}
            type="primary"
          >提交</Button>
        </div>
      </div>
    </React.Fragment>
  );
});

export default BaseInfoForm;
