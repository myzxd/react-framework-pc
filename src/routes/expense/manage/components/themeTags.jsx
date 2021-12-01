/**
 * 费用管理 - 付款审批 - 退款审批单 - 基本信息
 */

import { connect } from 'dva';
import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, Button } from 'antd';

import { DeprecatedCoreForm } from '../../../../components/core';

import style from './style.css';

const ThemeTags = (props) => {
  const {
    themeTags = undefined,  // 主题标签
    canEditTags = true,     // 是否可编辑
    orderId,                // 审批单id
    form,
    dispatch,
  } = props;

  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  } = form;

  // 保存主题标签
  const onSaveThemeTags = () => {
    validateFields((err, value) => {
      if (err) {
        return;
      }

      const {
        tags,
      } = value;

      const params = {
        themeTags: tags, // 主题标签
        orderId, // 审批单id
      };
      dispatch({
        type: 'expenseExamineOrder/fetchCostApprovalThemeTag',
        payload: {
          params,
          // onSuccessCallback: this.onSuccessAssociatedCallback,
          // onFailureCallback: this.onFailureAssociatedCallback,
        },
      });
    });
  };

  // 修改主题标签
  const onChangeThemeTags = (newValue) => {
    // 表单标签
    const formTags = getFieldsValue(['tags']);

    const noSpaceValue = newValue;

    const newLength = noSpaceValue.length;

    // 当新增标签时去除新增标签的空格
    if (newLength > formTags.length) {
      const tmp = noSpaceValue[newLength - 1].replace(/\s+/g, '');
      if (tmp === '') return;
      noSpaceValue[newLength - 1] = tmp;
    }
    return noSpaceValue;
  };

  // 渲染内容
  const renderContent = () => {
    const items = [
      {
        label: '主题标签',
        form: getFieldDecorator('tags', {
          initialValue: themeTags,
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <Select
            mode="tags"
            notFoundContent=""
            onChange={onChangeThemeTags}
            tokenSeparators={[',', '，']}
            className={style['app-comp-expense-detail-tag-select']}
            disabled={!canEditTags}
          />,
        ),
      },
    ];

    const layout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 22,
      },
    };

    return (
      <div
        className={style['app-comp-expense-detail-tag-wrap']}
      >
        <DeprecatedCoreForm
          cols={1}
          layout={layout}
          items={items}
          className={style['app-comp-expense-detail-tag-core']}
        />
        <Button
          disabled={!canEditTags}
          type="primary"
          onClick={onSaveThemeTags}
          className={style['app-comp-expense-detail-tag-save']}
        >
          保存
        </Button>
      </div>
    );
  };

  return renderContent();
};

export default connect()(Form.create()(ThemeTags));
