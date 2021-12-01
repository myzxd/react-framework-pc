/**
 * 审批流设置，查询 /Expense/ExamineFlow
 */
import React, { useState } from 'react';
import {
  Select,
  Input,
  Form,
  Tooltip,
} from 'antd';
import {
  InfoCircleOutlined,
} from '@ant-design/icons';

import {
  CoreSearch,
  CoreContent,
} from '../../../components/core';
import {
  OaApplicationFlowTemplateState,
  ExpenseCostOrderBizType,
  AffairsFlowSpecifyApplyType,
} from '../../../application/define';
import { system } from '../../../application';

import AppropriateType from './component/common/appropriateType';
import DepAndPostTreeSelect from './component/affairs/depPostTreeSelect';
import DepTreeSelect from './component/affairs/depTreeSelect';
import Post from './component/common/oldPost';
import CostGroup from './component/common/costGroup';
import Platform from './component/common/platform';

const Option = Select.Option;

// 枚举值类型
const EnumeratedType = {
  costOf: 'cost_application_types',
  noCostOf: 'none_cost_application_types',
  transactional: 'work_flow_application_types',
};

const SearchStorageKey = 'old-flow-list-search';

// 获取枚举值类型
const getEnumeratedValue = (type) => {
  let enumeratedType = EnumeratedType.transactional;
  // 成本
  if (type === ExpenseCostOrderBizType.costOf) {
    enumeratedType = EnumeratedType.costOf;
  }

  // 非成本
  if (type === ExpenseCostOrderBizType.noCostOf) {
    enumeratedType = EnumeratedType.noCostOf;
  }

  // 事务
  if (type === ExpenseCostOrderBizType.transactional) {
    enumeratedType = EnumeratedType.transactional;
  }

  return enumeratedType;
};

const Search = ({
  onSearch,
  isSetStorageSearchValue = false, // 是否从缓存获取查询参数
  searchParams = {},
}) => {
  // form
  const [form, setForm] = useState({});

  // 缓存中的search value
  const searchValue = system.searchParams(SearchStorageKey) || {};
  // 查询参数bizType
  const searchBizType = Array.isArray(searchValue.bizType) ? (searchValue.bizType)[0] : searchValue.bizType;

  // 初始bizType
  const initBizType = isSetStorageSearchValue ?
    searchBizType
    : ExpenseCostOrderBizType.transactional;

  // 初始enumeratedType
  const initEnumeratedType = isSetStorageSearchValue ?
    getEnumeratedValue(searchBizType)
    : EnumeratedType.transactional;

  // 审批类型
  const [bizType, setBizType] = useState(initBizType);
  // 枚举类型
  const [enumeratedType, setEnumeratedType] = useState(initEnumeratedType);

  // 重置
  const onReset = (val) => {
    // 重置审批类型
    setBizType(ExpenseCostOrderBizType.transactional);
    // 重置枚举类型
    setEnumeratedType(EnumeratedType.transactional);
    // 重置状态为全部
    const state = '*';
    form.setFieldsValue({ state });
    onSearch && onSearch({
      ...val,
      page: 1,
      limit: 30,
      bizType: ExpenseCostOrderBizType.transactional,
      nodeApproalType: AffairsFlowSpecifyApplyType.post,
      state,
    });
  };

  // 审批类型
  const onChangeBizType = (val) => {
    // 设置审批类型state
    setBizType(val);
    // 重置所有表单
    form && form.resetFields();
    // 设置审批类型form value
    form && form.setFieldsValue({
      bizType: val,
      nodeApproalType: val === ExpenseCostOrderBizType.transactional ?
        AffairsFlowSpecifyApplyType.post
        : undefined,
    });

    // 成本
    if (val === ExpenseCostOrderBizType.costOf) {
      setEnumeratedType(EnumeratedType.costOf);
    }

    // 非成本
    if (val === ExpenseCostOrderBizType.noCostOf) {
      setEnumeratedType(EnumeratedType.noCostOf);
    }

    // 事务
    if (val === ExpenseCostOrderBizType.transactional) {
      setEnumeratedType(EnumeratedType.transactional);
    }
  };

  // 事务性审批流，节点审批类型onChange
  const onChangeNodeApproalType = () => {
    form && form.setFieldsValue({
      approveDepartmentJobIds: undefined,
      approveDepartmentIds: undefined,
    });
  };

  // common item
  const commonItems = [
    <Form.Item
      label="审批类型"
      name="bizType"
    >
      <Select
        placeholder="请选择"
        onChange={onChangeBizType}
      >
        <Option
          value={ExpenseCostOrderBizType.costOf}
        >
          {ExpenseCostOrderBizType.description(ExpenseCostOrderBizType.costOf)}
        </Option>
        <Option
          value={ExpenseCostOrderBizType.noCostOf}
        >
          {ExpenseCostOrderBizType.description(ExpenseCostOrderBizType.noCostOf)}
        </Option>
        <Option
          value={ExpenseCostOrderBizType.transactional}
        >
          {ExpenseCostOrderBizType.description(ExpenseCostOrderBizType.transactional)}
        </Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="适用类型"
      name="pageType"
    >
      <AppropriateType enumeratedType={enumeratedType} />
    </Form.Item>,
    <Form.Item
      label="状态"
      name="state"
    >
      <Select placeholder="请选择" allowClear>
        <Option
          value="*"
        >
          全部
        </Option>
        <Option
          value={OaApplicationFlowTemplateState.normal}
        >
          {OaApplicationFlowTemplateState.description(OaApplicationFlowTemplateState.normal)}
        </Option>
        <Option
          value={OaApplicationFlowTemplateState.disable}
        >
          {OaApplicationFlowTemplateState.description(OaApplicationFlowTemplateState.disable)}
        </Option>
        <Option
          value={OaApplicationFlowTemplateState.draft}
        >
          {OaApplicationFlowTemplateState.description(OaApplicationFlowTemplateState.draft)}
        </Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="审批流名称"
      name="name"
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
  ];

  // 岗位label
  const postLabel = (
    <div>
      <Tooltip title="此选项筛选的为协作关系指定部门配置的节点">
        <InfoCircleOutlined />
      </Tooltip>
      <span style={{ marginLeft: 5 }}>节点审批岗位</span>
    </div>
  );

  // 部门label
  const departmentLabel = (
    <div>
      <Tooltip title="此选项筛选的为协作关系指定部门配置的节点">
        <InfoCircleOutlined />
      </Tooltip>
      <span style={{ marginLeft: 5 }}>节点审批部门</span>
    </div>
  );

  // 事务查询条件
  const transactionalItems = [
    <Form.Item
      label="节点审批类型"
      name="nodeApproalType"
    >
      <Select placeholder="请选择" onChange={onChangeNodeApproalType}>
        <Option
          value={AffairsFlowSpecifyApplyType.post}
        >
          {AffairsFlowSpecifyApplyType.description(AffairsFlowSpecifyApplyType.post)}
        </Option>
        <Option
          value={AffairsFlowSpecifyApplyType.principal}
        >
          {AffairsFlowSpecifyApplyType.description(AffairsFlowSpecifyApplyType.principal)}
        </Option>
      </Select>
    </Form.Item>,
    <Form.Item
      noStyle
      key="affairs-node-post-department"
      shouldUpdate={(pev, cur) => pev.nodeApproalType !== cur.nodeApproalType}
    >
      {
        ({ getFieldValue }) => {
          const nodeApproalType = getFieldValue('nodeApproalType');
          if (nodeApproalType === AffairsFlowSpecifyApplyType.post) {
            return (
              <Form.Item
                key="transactional-post"
                name="approveDepartmentJobIds"
                label={postLabel}
              >
                <DepAndPostTreeSelect isDisabledDep isJobId multiple />
              </Form.Item>
            );
          }

          if (nodeApproalType === AffairsFlowSpecifyApplyType.principal) {
            return (
              <Form.Item
                key="transactional-post"
                name="approveDepartmentIds"
                label={departmentLabel}
              >
                <DepTreeSelect multiple />
              </Form.Item>
            );
          }
        }
      }
    </Form.Item>,
    <Form.Item
      label="适用部门"
      name="applianceDepartmentId"
    >
      <DepTreeSelect multiple />
    </Form.Item>,
    <Form.Item
      label="可见部门"
      name="viewDepartmentId"
    >
      <DepTreeSelect multiple />
    </Form.Item>,
  ];

  // 成本类查询条件
  const costOfItem = [
    <Form.Item
      label="节点审批岗位"
      key="costOf-post"
      name="postIds"
    >
      <Post
        showArrow
        placeholder="请选择"
        allowClear
        mode="multiple"
      />
    </Form.Item>,
    <Form.Item
      label="适用范围"
      name="platformCodes"
      key="costOf-platformCodes"
    >
      <Platform
        showArrow
        allowClear
        mode="multiple"
        optionFilterProp="children"
        placeholder="请选择"
        isEnableSelectAll
      />
    </Form.Item>,
    <Form.Item
      label="费用分组"
      name="expenseTypeIds"
    >
      <CostGroup
        showArrow
        allowClear
        mode="multiple"
        optionFilterProp="children"
        placeholder="请选择"
      />
    </Form.Item>,
  ];

  // 非成本类查询条件
  const noCostOfItem = [
    <Form.Item
      label="节点审批岗位"
      key="noCostOf-post"
      name="postIds"
    >
      <Post
        showArrow
        placeholder="请选择"
        allowClear
        mode="multiple"
      />
    </Form.Item>,
    <Form.Item
      label="适用范围"
      name="platformCodes"
      key="noCostOf-platformCodes"
    >
      <Platform
        showArrow
        allowClear
        mode="multiple"
        optionFilterProp="children"
        placeholder="请选择"
        isEnableSelectAll
      />
    </Form.Item>,
  ];

  let items = [
    ...commonItems,
  ];

  // 事务查询条件
  bizType === ExpenseCostOrderBizType.transactional && (
    items = [...items, ...transactionalItems]
  );

  // 成本类查询条件
  bizType === ExpenseCostOrderBizType.costOf && (
    items = [...items, ...costOfItem]
  );

  // 非成本类查询条件
  bizType === ExpenseCostOrderBizType.noCostOf && (
    items = [...items, ...noCostOfItem]
  );

  const props = {
    items,
    onReset,
    onSearch: val => onSearch({ ...val, page: 1, limit: 30 }),
    onHookForm: hForm => setForm(hForm),
    expand: true,
    initialValues: {
      bizType: ExpenseCostOrderBizType.transactional, // 审批类型
      nodeApproalType: AffairsFlowSpecifyApplyType.post, // 节点审批类型
      state: searchParams.state, // 状态
    },
    isSetStorageSearchValue,
    SearchStorageKey,
  };

  return (
    <CoreContent className="affairs-flow-basic">
      <CoreSearch {...props} />
    </CoreContent>
  );
};

export default Search;
