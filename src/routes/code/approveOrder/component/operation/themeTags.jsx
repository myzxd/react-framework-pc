/**
 * code - 审批单 - 主题标签
 */
import { connect } from 'dva';
import dot from 'dot-prop';
import React, { useEffect } from 'react';
import {
  Form,
  Select,
} from 'antd';
import {
  ExpenseExamineOrderProcessState,
} from '../../../../../application/define';
import { authorize } from '../../../../../application';

// themeTags layout
const tagFormLayout = { labelCol: { span: 2 }, wrapperCol: { span: 22 } };

const ThemeTags = ({
  orderId,
  dispatch,
  approveOrderThemeTags = {}, // 主题标签
  isUpdate,
}) => {
  const [form] = Form.useForm();
  // 审批单id
  const {
    theme_label_list: themeLabelList = [],
    current_account_ids: currentAccountIds = [], // 当前审批流转记录可操作人
    state,
    plugin_extra_meta: pluginExtraMeta = {}, // 外部审批单标识
    plugin_theme_label_list: pluginThemeLabelList = [], // 外部审批单主题标签
  } = approveOrderThemeTags;

  // 是否可操作（流程状态进行中 && 审批单可操作人为当前账号）|| 外部审批单不可编辑
  let isDisabled = false;
  // 创建和编辑可编辑
  if (isUpdate) {
    isDisabled = true;
    // 外部审批单不可编辑
  } else if (dot.get(pluginExtraMeta, 'is_plugin_order', false)) {
    isDisabled = false;
  } else {
    // 流程状态进行中&& 审批单当前审批人包含当前账号
    // 可编辑
    isDisabled = state === ExpenseExamineOrderProcessState.processing &&
      currentAccountIds.includes(authorize.account.id);
  }
  useEffect(() => {
    orderId && dispatch({ type: 'codeOrder/getApproveOrderThemeTags', payload: { orderId } });
    return () => {
      dispatch({ type: 'codeOrder/reduceApproveOrderThemeTags', payload: { } });
    };
  }, [dispatch, orderId]);

  useEffect(() => {
    form.setFieldsValue({
      themeTags: [...themeLabelList, ...pluginThemeLabelList],
    });
  }, [form, themeLabelList, pluginThemeLabelList]);

  const onSucessCallback = () => {
    orderId && dispatch({
      type: 'codeOrder/getApproveOrderThemeTags',
      payload: { orderId },
    });
  };

  // 保存标签
  const onSaveThemeTags = async (values = []) => {
    // 过滤外部审批单标签
    const valueThemeTags = values.filter(v => !pluginThemeLabelList.includes(v));
    dispatch({
      type: 'codeOrder/saveOrderThemeTags',
      payload: {
        orderId,
        tags: valueThemeTags,
        onSucessCallback,
      },
    });
  };

  // 改变
  const onChangeThemeTags = (values) => {
    onSaveThemeTags(values);
  };

  return (
    <Form form={form} className="affairs-flow-basic">
      <Form.Item
        label="主题标签"
        {...tagFormLayout}
        className="code-approve-order-theme-tag"
      >
        <Form.Item
          name="themeTags"
          style={{ width: '50%' }}
          getValueFromEvent={val => (val.map(i => i.replace(/\s+/g, '')).filter(i => i !== ''))}
        >
          <Select
            mode="tags"
            notFoundContent=""
            tokenSeparators={[',', '，']}
            placeholder="请输入"
            allowClear
            disabled={!isDisabled}
            onChange={onChangeThemeTags}
          />
        </Form.Item>
      </Form.Item>
    </Form>
  );
};
const mapStateToProps = ({
  codeOrder: { approveOrderThemeTags },
}) => {
  return { approveOrderThemeTags };
};

export default connect(mapStateToProps)(ThemeTags);
