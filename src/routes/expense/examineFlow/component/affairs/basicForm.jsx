/**
 * 审批流设置，事务性审批流编辑页基本表单组件
 */
import dot from 'dot-prop';
import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
} from 'react';
import {
  Form,
  Input,
  Select,
  Tooltip,
  message,
} from 'antd';
import is from 'is_js';
import {
  InfoCircleOutlined,
} from '@ant-design/icons';
import {
  AffairsFlowMergeRule,
  AffairsFlowHighestPostType,
  AffairsFlowCooperationSpecify,
  AffairsFlowCooperationPerson,
  ExpenseDepartmentSubtype,
} from '../../../../../application/define';
import { utils } from '../../../../../application';
import { CoreForm, CoreContent } from '../../../../../components/core';
import {
  CommonSelectScene,
  CommonStampType,
} from '../../../../../components/common';
import Rank from './rank';
import HighestPost from './highestPost';
import DepTreeSelect from './depTreeSelect';
import ViewRange from './viewRange';
import TypeForm from './type';
import ContractTypeComponent from './contractTypeComponent';
import ContractChildTypeComponent from './contractChildTypeComponent';
import { PagesHelper } from '../../../../oa/document/define';

const { Option } = Select;
const { TextArea } = Input;
// form layout
const formLayout = { labelCol: { span: 3 }, wrapperCol: { span: 14 } };

// 指定字段部门key
const specifyDepKey = [101, 102, 105, 108, 109];

// 指定字段相关人
const specifyPerKey = [107, 303, 301, 302, 306, 405, 406, 309];
// 适用类型
const applyRankEnumer = {
  departmentalAddendum: 102, // 部门增编
};

const BasicForm = forwardRef(({
  examineDetail = {}, // 审批流详情
}, ref) => {
  const [form] = Form.useForm();
  // 节点列表
  const { nodeList = [] } = examineDetail;

  // 适用部门（本部门）
  const [selfDep, setSelfDep] = useState(dot.get(examineDetail, 'applyDepartmentIds', []));
  // 适用部门（本加子部门）
  const [childDep, setChildDep] = useState(dot.get(examineDetail, 'applyDepartmentSubIds', []));
  // 可见范围（本部门）
  const [viewDep, setViewDep] = useState(dot.get(examineDetail, 'viewDepartmentIds', []));
  // 可见范围（本加子部门）
  const [viewChildDep, setViewChildDep] = useState(dot.get(examineDetail, 'viewDepartmentSubIds', []));
  // 可见范围（岗位关系id）
  const [viewCusDep, setViewCusDep] = useState(dot.get(examineDetail, 'viewDepartmentJobIds', []));
  // 适用类型
  const [scense, setScense] = useState(dot.get(examineDetail, 'applyApplicationTypes.0', undefined));
  // 组织架构 - 子类型
  const [departmentSubtype, setDepartmentSubtype] = useState(dot.get(examineDetail, 'organization_sub_types', []));
  // 是否展示合同类型
  const [contractTypeState, setContractTypeState] = useState(false);
  // 设置选中的合同类型
  const [contractTypeValueState, setContractTypeValueState] = useState([]);
  // 合同子类型是否有数据
  const [contractCihldIsData, setContractChildIsData] = useState(true);

  useEffect(() => {
    // 如果适用类型 为 合同会审 展示合同类型
    if (is.existy(examineDetail.pactTypes) && is.array(examineDetail.pactTypes)) {
      if (examineDetail.pactTypes.includes(180) || examineDetail.pactTypes.includes(170)) {
        setContractTypeState(true);
      }
    }

    //  展示合同子类型
    if (dot.get(examineDetail, 'pactApplyTypes', []).length > 0) {
      setContractTypeValueState(examineDetail.pactApplyTypes);
    }
  }, []);

  // 最高审批岗位label
  const highestPostTitle = (
    <span>
      最高审批岗位
      <Tooltip title="按照组织架构层级关系审批时设置终点">
        <InfoCircleOutlined style={{ marginLeft: 5 }} />
      </Tooltip>
    </span>
  );

  // 可见范围表单rule
  const viewRangeRule = [{
    required: (viewDep.length < 1 && viewChildDep.length < 1 && viewCusDep.length < 1),
    message: '请选择',
  }];

  // 适用类型
  const onChangeScense = (val) => {
    // 节点列表中指定字段list
    const organizationTypeList = nodeList.map(i => i.organizationApproveType);
    const accountApproveTypeList = nodeList.map(i => i.accountApproveType);

    // 指定字段特殊部门
    // 适用类型部位指定部门中的key，且节点中有指定字段部门
    if (!specifyDepKey.includes(Number(val))
      && organizationTypeList.includes(AffairsFlowCooperationSpecify.fieldDep)
    ) {
      message.error('节点中有设置指定特殊部门，不能切换');
      return scense;
    }

    // 指定字段相关人
    if (!specifyPerKey.includes(val)
      && accountApproveTypeList.includes(AffairsFlowCooperationPerson.fieldAccount)
    ) {
      message.error('节点中有设置指定字段人，不能切换');
      return scense;
    }

    form.setFieldsValue({
      sealType: undefined,
      licenseType: undefined,
      contractType: undefined,
      stampType: undefined,
      departmentSubtype: undefined,
    });

    setScense(val);
    setDepartmentSubtype([]);
    return val;
  };

  // 组织架构 - 子类型
  const onChangeDepartmentSubtype = (val) => {
    // 判断是否是只有增编 true（不是）false（是）
    const flag = val.some(v => v !== ExpenseDepartmentSubtype.addendum);
    // 节点列表中指定字段list
    const organizationTypeList = nodeList.map(i => i.organizationApproveType);

    // 指定字段特殊部门
    // 适用类型部位指定部门中的key，且节点中有指定字段部门
    if (!specifyDepKey.includes(Number(scense))
      && organizationTypeList.includes(AffairsFlowCooperationSpecify.fieldDep)
      && flag === true
    ) {
      message.error('节点中有设置指定特殊部门，不能选择除增编之外的类型');
      return departmentSubtype;
    }
    setDepartmentSubtype(val);
    return val;
  };

  // 会审类型
  const onChangeStampType = (val) => {
     // 清空合同类型的值
    form.setFieldsValue({ pactApplyTypes: undefined });
    setContractTypeValueState([]);
    // 如果包含 先盖章(170)｜后盖章(180) 就展示
    if (val.includes('170') || val.includes('180')) {
      setContractTypeState(true);
      return val;
    }

    // 隐藏合同类型组件
    setContractTypeState(false);
    return val;
  };

  // 获取合同类型的值
  const onChangeContractTypeValue = (val, op, data) => {
    // 默认合同子类型value为[]
    let pactSubTypesValue = [];
        // 合同类型有值
    if (Array.isArray(val) && val.length > 0) {
      // 当前表单合同子类型value
      const pactSubTypes = form.getFieldValue('pactSubTypes') || [];

      if (Array.isArray(pactSubTypes) && pactSubTypes.length > 0) {
        // 当前选中的合同类型下的全量子类型（输出为二维数组）
        const curContractChildTypeList = val.map((v) => {
          // 获取sub_types
          const subTypes = utils.dotOptimal(data, v, {}).sub_types || {};
          return Object.keys(subTypes);
        });

        // 扁平数组
        const flatContractChildTypeList = curContractChildTypeList.flat();

        // 合同子类型
        pactSubTypesValue = pactSubTypes.filter(v => flatContractChildTypeList.includes(v));
      }
    }
    // 设置合同子类型form value
    form.setFieldsValue({ pactSubTypes: pactSubTypesValue });

    setContractTypeValueState(val);
    return val;
  };

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
      <span>事务性</span>
    </Form.Item>,
    <Form.Item
      label="适用类型"
      name="scense"
      rules={[
        { required: true, message: '请选择审批流适用类型' },
      ]}
      getValueFromEvent={onChangeScense}
      {...formLayout}
    >
      <CommonSelectScene
        enumeratedType="affairs"
      />
    </Form.Item>,
    <Form.Item
      key="department_subtype"
      noStyle
      shouldUpdate={(pre, cur) => pre.scense !== cur.scense}
    >
      {
        ({ getFieldValue }) => {
          // 适用类型
          const scenseType = getFieldValue('scense');
          // 不是部门/编制调整 隐藏
          if (scenseType !== PagesHelper.getDepartmentPostKey()) {
            return null;
          }
          return (
            <Form.Item
              label="调整子类型"
              name="departmentSubtype"
              rules={[{ required: true, message: '请选择' }]}
              {...formLayout}
              getValueFromEvent={onChangeDepartmentSubtype}
            >
              <Select
                placeholder="请选择"
                mode="multiple"
                showSearch
                optionFilterProp="children"
                allowClear
                showArrow
              >
                <Option value={ExpenseDepartmentSubtype.newAdd}>{ExpenseDepartmentSubtype.description(ExpenseDepartmentSubtype.newAdd)}</Option>
                <Option value={ExpenseDepartmentSubtype.adjustment}>{ExpenseDepartmentSubtype.description(ExpenseDepartmentSubtype.adjustment)}</Option>
                <Option value={ExpenseDepartmentSubtype.abolition}>{ExpenseDepartmentSubtype.description(ExpenseDepartmentSubtype.abolition)}</Option>
                <Option value={ExpenseDepartmentSubtype.addPost}>{ExpenseDepartmentSubtype.description(ExpenseDepartmentSubtype.addPost)}</Option>
                <Option value={ExpenseDepartmentSubtype.addendum}>{ExpenseDepartmentSubtype.description(ExpenseDepartmentSubtype.addendum)}</Option>
                <Option value={ExpenseDepartmentSubtype.reduceStaff}>{ExpenseDepartmentSubtype.description(ExpenseDepartmentSubtype.reduceStaff)}</Option>
              </Select>
            </Form.Item>
          );
        }
      }
    </Form.Item>,
    <Form.Item
      key="applyRanks"
      shouldUpdate={(pre, cur) => pre.scense !== cur.scense}
      noStyle
    >
      {
        ({ getFieldValue }) => {
          // 适用类型
          const scenseType = getFieldValue('scense');
          // 是部门/编制调整|增编 隐藏
          if (scenseType === PagesHelper.getDepartmentPostKey()
            || scenseType === applyRankEnumer.departmentalAddendum) {
            return null;
          }
          return (
            <Form.Item
              label="岗位职级"
              name="applyRanks"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
            >
              <Rank />
            </Form.Item>
          );
        }
      }
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
    <div style={{ marginBottom: 10, fontWeight: 500 }}>
      适用部门
    </div>,
    <Form.Item
      name="allDep"
      label="适用本部门+子部门"
      {...formLayout}
      rules={[
      { required: (selfDep.length < 1 && childDep.length < 1), message: '请选择' },
      ]}
    >
      <DepTreeSelect
        multiple
        onChange={val => setChildDep(val)}
      />
    </Form.Item>,
    <Form.Item
      name="selfDep"
      label="仅适用本部门"
      {...formLayout}
      rules={[
        { required: (selfDep.length < 1 && childDep.length < 1), message: '请选择' },
      ]}
    >
      <DepTreeSelect
        multiple
        onChange={val => setSelfDep(val)}
      />
    </Form.Item>,
    <div style={{ marginBottom: 10, fontWeight: 500 }}>
      可见范围
    </div>,
    <Form.Item
      name="viewAllDep"
      label="适用本部门+子部门"
      {...formLayout}
      rules={viewRangeRule}
    >
      <ViewRange
        multiple
        isDisabledPost
        onChange={val => setViewChildDep(val)}
      />
    </Form.Item>,
    <Form.Item
      name="viewSelfDep"
      label="仅适用本部门"
      {...formLayout}
      rules={viewRangeRule}
    >
      <ViewRange
        multiple
        isDisabledPost
        onChange={val => setViewDep(val)}
      />
    </Form.Item>,
    <Form.Item
      name="viewRelaJobId"
      label="自定义岗位"
      {...formLayout}
      rules={viewRangeRule}
    >
      <ViewRange
        multiple
        isDisabledDep
        onChange={val => setViewCusDep(val)}
      />
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

  if (scense === 303 || scense === 309) {
    formItems.splice(4, 0, (
      <Form.Item
        name="sealType"
        label="印章类型"
        {...formLayout}
        rules={[
          { required: true, message: '请选择' },
        ]}
      >
        <TypeForm type="flowSealType" />
      </Form.Item>
    ));
  }

  // 证照借用
  if (scense === 306) {
    formItems.splice(4, 0, (
      <Form.Item
        name="licenseType"
        label="类型"
        {...formLayout}
        rules={[
          { required: true, message: '请选择' },
        ]}
      >
        <TypeForm type="license" />
      </Form.Item>
    ));
  }

  // 合同借阅
  if (scense === 406) {
    formItems.splice(4, 0, (
      <Form.Item
        name="contractType"
        label="类型"
        {...formLayout}
        rules={[
          { required: true, message: '请选择' },
        ]}
      >
        <TypeForm type="contract" />
      </Form.Item>
    ));
  }

  if (scense === 405) {
    formItems.splice(3, 0, (
      <Form.Item
        name="stampType"
        label="会审类型"
        {...formLayout}
        rules={[
          { required: true, message: '请选择' },
        ]}
        getValueFromEvent={onChangeStampType}
      >
        <CommonStampType
          mode="multiple"
          showArrow
          placeholder="请选择会审类型"
        />
      </Form.Item>
    ));

    // 只有先盖章 或者 后盖章 才显示
    if (contractTypeState) {
      formItems.splice(5, 0, (
        <Form.Item
          name="pactApplyTypes"
          label="合同类型"
          {...formLayout}
          rules={[
            { required: true, message: '请选择' },
          ]}
        >
          <ContractTypeComponent
            mode="multiple"
            showArrow
            setcontractchildisdata={setContractChildIsData}
            onChange={onChangeContractTypeValue}
          />
        </Form.Item>
      ));

      // 如果合同类型有选中的值就展示
      if (contractTypeValueState.length > 0) {
        formItems.splice(6, 0, (
          <Form.Item
            name="pactSubTypes"
            label="合同子类型" {...formLayout}
            rules={
              contractCihldIsData ? [
            { required: true, message: '请选择' },
              ] : []}
          >
            <ContractChildTypeComponent setContractChildIsData={setContractChildIsData} contractTypeValueState={contractTypeValueState} showArrow mode="multiple" />
          </Form.Item>
        ));
      }
    }
  }
  const initialValues = {
    name: dot.get(examineDetail, 'name'),
    scense: dot.get(examineDetail, 'applyApplicationTypes.0'),
    department: dot.get(examineDetail, 'applyDepartmentIds'),
    departmentSubtype: dot.get(examineDetail, 'organization_sub_types', []),
    applyRanks: dot.get(examineDetail, 'applyRanks'),
    applicationRule: dot.get(examineDetail, 'applicationRule'),
    note: dot.get(examineDetail, 'note'),
    highestPost: {
      type: dot.get(examineDetail, 'finalType', AffairsFlowHighestPostType.post),
      tags: dot.get(examineDetail, 'finalApprovalJobTags', []),
      post: dot.get(examineDetail, 'finalApprovalJobIds', []),
    },
    selfDep: dot.get(examineDetail, 'applyDepartmentIds', []),
    allDep: dot.get(examineDetail, 'applyDepartmentSubIds', []),
    viewSelfDep: dot.get(examineDetail, 'viewDepartmentIds', []),
    viewAllDep: dot.get(examineDetail, 'viewDepartmentSubIds', []),
    viewRelaJobId: dot.get(examineDetail, 'viewDepartmentJobIds', []),
    sealType: dot.get(examineDetail, 'sealTypes', undefined),
    licenseType: dot.get(examineDetail, 'displayTypes', undefined),
    contractType: dot.get(examineDetail, 'pactBorrowTypes', undefined),
    stampType: Array.isArray(examineDetail.stampTypes) ? examineDetail.stampTypes.map(item => `${item}`) : [],
    pactApplyTypes: Array.isArray(examineDetail.pactApplyTypes) ? examineDetail.pactApplyTypes.map(item => `${item}`) : [],
    pactSubTypes: Array.isArray(examineDetail.pactSubTypes) ? examineDetail.pactSubTypes.map(item => `${item}`) : [],
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

