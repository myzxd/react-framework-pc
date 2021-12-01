/**
 * 审批流设置，事务性审批流编辑页基本表单组件
 */
import is from 'is_js';
import dot from 'dot-prop';
import React, {
  useImperativeHandle,
  forwardRef,
  useState,
} from 'react';
import {
  Form,
  Input,
  Select,
  Tooltip,
  Checkbox,
} from 'antd';
import {
  InfoCircleOutlined,
} from '@ant-design/icons';

import {
  AffairsFlowMergeRule,
  CodeCostCenterType,
  CodeFlowState,
} from '../../../../../application/define';
import { CoreForm, CoreContent } from '../../../../../components/core';
import HighestPost from './highestPost';
import CodeForm from './codeForm';
import TeamForm from './teamForm';

const { Option } = Select;
const { TextArea } = Input;
// form layout
const formLayout = { labelCol: { span: 3 }, wrapperCol: { span: 14 } };

const BasicForm = forwardRef(({
  flowDetail = {}, // 审批流详情
  originCodeList = {},
  originTeamList = {},
}, ref) => {
  const [form] = Form.useForm();

  const {
    cost_center_types: costCenterTypes = [], // 适用成本中心场景
    state, // 审批流状态
  } = flowDetail;

  // 适用code是否必填
  const [isRequiredCode, setIsRequiredCode] = useState(costCenterTypes.includes(CodeCostCenterType.code));
  // 适用team是否必填
  const [isRequiredTeam, setIsRequiredTeam] = useState(costCenterTypes.includes(CodeCostCenterType.team));

  // 适用成本中心类型onchange
  const onChangeType = (val) => {
    if (!val.includes(CodeCostCenterType.code)) {
      form.setFieldsValue({ code: [] });
    }
    if (!val.includes(CodeCostCenterType.team)) {
      form.setFieldsValue({ team: [] });
    }
    setIsRequiredCode(val.includes(CodeCostCenterType.code));
    setIsRequiredTeam(val.includes(CodeCostCenterType.team));
  };

  // 最高审批岗位label
  const highestPostTitle = (
    <span>
      最高审批岗位
      <Tooltip title="按照组织架构层级关系审批时设置终点">
        <InfoCircleOutlined style={{ marginLeft: 5 }} />
      </Tooltip>
    </span>
  );

  const formItems = [
    <Form.Item
      label="审批流名称"
      name="name"
      rules={[
        { required: true, message: '请输入审批流名称' },
        { pattern: /^\S+$/, message: '审批流名称不能包含空格' },
      ]}
      {...formLayout}
    >
      <Input placeholder="请填写内容" />
    </Form.Item>,
    <Form.Item
      label="审批流类型"
      className="affairs-detail-form-item"
      {...formLayout}
    >
      <span>付款类</span>
    </Form.Item>,
    <Form.Item
      label="适用成本中心场景"
      name="type"
      rules={[
        { required: true, message: '请输入适用成本中心场景' },
      ]}
      {...formLayout}
    >
      <Checkbox.Group
        onChange={onChangeType}
        disabled={state === CodeFlowState.deactivate}
      >
        <Checkbox
          value={CodeCostCenterType.code}
        >{CodeCostCenterType.description(CodeCostCenterType.code)}</Checkbox>
        <Checkbox
          value={CodeCostCenterType.team}
        >{CodeCostCenterType.description(CodeCostCenterType.team)}</Checkbox>
      </Checkbox.Group>
    </Form.Item>,
    <Form.Item
      label="合并审批"
      name="applicationRule"
      rules={[
        { required: true, message: '请选择合并审批' },
      ]}
      {...formLayout}
    >
      <Select placeholder="请选择合并审批">
        <Option
          value={AffairsFlowMergeRule.continuous}
        >
          {AffairsFlowMergeRule.description(AffairsFlowMergeRule.continuous)}
        </Option>
        <Option
          value={AffairsFlowMergeRule.each}
        >
          {AffairsFlowMergeRule.description(AffairsFlowMergeRule.each)}
        </Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label={highestPostTitle}
      name="highestPost"
      {...formLayout}
    >
      <HighestPost />
    </Form.Item>,
    <Form.Item
      label="描述"
      name="note"
      rules={[
        { max: 200, message: '字数过多' },
      ]}
      {...formLayout}
    >
      <TextArea
        autoSize={{ minRows: 5 }}
        placeholder="请输入审批流描述(选填)"
      />
    </Form.Item>,
  ];

  // 适用code
  const codeFormItem = (
    <Form.Item
      label="适用code"
      name="code"
      rules={[
        { required: isRequiredCode, message: '请选择' },
      ]}
      {...formLayout}
    >
      <CodeForm />
    </Form.Item>
  );

  // 适用team
  const teamFormItem = (
    <Form.Item
      label="适用team"
      name="team"
      rules={[
        { required: isRequiredTeam, message: '请选择' },
      ]}
      {...formLayout}
    >
      <TeamForm />
    </Form.Item>
  );

  // 适用code
  isRequiredCode && (formItems.splice(3, 0, codeFormItem));
  // 适用team
  isRequiredTeam && (formItems.splice(3, 0, teamFormItem));

  // 获取code initialValue
  const getInitialCodeValue = () => {
    const interfaceValue = dot.get(flowDetail, 'code_list', []);
    // 全部
    if (interfaceValue.find(originValue => originValue._id === '*')) {
      return ['*=全部'];
    }
    const originCodeValues = [].concat(...(Object.values(originCodeList)));
    // 获取数据，获取接口的数据
    const initValue = interfaceValue.map((v) => {
      // 过滤数据
      const filterList = originCodeValues.filter(j => j._id === v._id);
      return filterList[0] || {};
    });
    // 过滤空数据
    const filterValue = initValue.filter(v => is.existy(v) && is.not.empty(v));
    // 拼接数据
    return filterValue.map((v = {}) => {
      // 判断是否是否为空
      if (is.existy(v) && is.not.empty(v)) {
        return `${v._id}=${v.name}`;
      }
      return undefined;
    });
  };

  // 获取team initialValue
  const getInitialTeamValue = () => {
    const interfaceValue = dot.get(flowDetail, 'team_list', []);
    // 全部
    if (interfaceValue.find(originValue => originValue._id === '*')) {
      return ['*=全部'];
    }

    const originTeamValues = [].concat(...(Object.values(originTeamList)));
    // 获取数据，获取接口的数据
    const initValue = interfaceValue.map((v) => {
      // 过滤数据
      const filterList = originTeamValues.filter(j => j._id === v._id);
      return filterList[0] || {};
    });
    // 过滤空数据
    const filterValue = initValue.filter(v => is.existy(v) && is.not.empty(v));
    // 拼接数据
    return filterValue.map((v = {}) => {
      // 判断是否是否为空
      if (is.existy(v) && is.not.empty(v)) {
        return `${v._id}=${v.name}`;
      }
      return undefined;
    });
  };

  const initialValues = {
    name: dot.get(flowDetail, 'name'),
    type: dot.get(flowDetail, 'cost_center_types', []),
    code: getInitialCodeValue(),
    team: getInitialTeamValue(),
    applicationRule: dot.get(flowDetail, 'application_rule'),
    note: dot.get(flowDetail, 'note'),
    highestPost: {
      type: dot.get(flowDetail, 'final_type') ? dot.get(flowDetail, 'final_type') : undefined,
      tags: dot.get(flowDetail, 'final_approval_job_tags', []),
      post: dot.get(flowDetail, 'final_approval_job_ids', []),
    },
  };

  // 暴露ref
  useImperativeHandle(ref, () => form);

  return (
    <CoreContent title="审批流详情设置" className="affairs-flow-basic">
      <Form form={form} initialValues={initialValues}>
        <CoreForm items={formItems} cols={1} />
      </Form>
    </CoreContent>
  );
});

export default BasicForm;
