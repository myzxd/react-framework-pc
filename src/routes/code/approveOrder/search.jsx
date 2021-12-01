/**
 * code - 审批单列表 - 查询组件
 */
import is from 'is_js';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import {
  Form,
  Select,
  Input,
  DatePicker,
  InputNumber,
  Button,
  Modal,
  Checkbox,
  message,
  Row,
  Col,
} from 'antd';
import {
  CoreSearch,
  CoreContent,
} from '../../../components/core';
import {
  Unit,
  CodeApproveOrderTabKey,
  CodeCostCenterType,
  CodeApproveOrderPayState,
  ExpenseTicketState,
  ExpenseExamineOrderProcessState,
  Events,
} from '../../../application/define';
// import Project from './component/form/project';
import Flow from '../typeConfig/payment/component/flow';
import TicketTag from '../../expense/manage/components/ticketTag';
import Subject from '../../amortization/component/subject'; // 科目名称
import Scenes from '../../amortization/component/scenes'; // 场景
import Platform from '../../amortization/component/platform'; // 平台
import MainBody from '../../amortization/component/mainBody'; // 主体
import Project from '../../amortization/component/project'; // 项目
import City from '../../amortization/component/city'; // 城市
import Invoice from '../../amortization/component/invoice'; // 发票抬头

import getFormValues from './dealSearchValues';

const { Option } = Select;
const { RangePicker, MonthPicker } = DatePicker;

const formLayout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };

// 加入智能分组modal
const AddGroupModal = ({
  visible,
  onCancel,
  searchForm = {},
  dispatch,
  tabKey,
  onUpdateGroup, // 重新获取分组列表与审批单列表
  orderSearchGroup = [], // 分组列表
}) => {
  const [form] = Form.useForm();
  // loading
  const [isLoading, setIsLoading] = useState(false);
  if (!visible) return;

  // 提交
  const onSubmit = async () => {
    const values = await form.validateFields();
    // 查询条件
    const searchValues = searchForm.getFieldsValue && await searchForm.getFieldsValue();

    // 未选择查询条件
    if (!searchValues
      || Object.values(searchValues).every(v => (is.not.existy(v) || is.empty(v)))
     ) {
      return message.error('请添加查询条件');
    }

    setIsLoading(true);

    const res = await dispatch({
      type: 'codeOrder/addIntelligentGroup',
      payload: { tabKey, ...values, ...searchValues },
    });

    if (res && res._id) {
      message.success('请求成功');

      // 重新获取分组列表与审批单列表
      onUpdateGroup && await onUpdateGroup();

      onCancel && onCancel();
    }

    if (res && res.zh_message) {
      message.error(res.zh_message);
    }

    setIsLoading(false);
  };

  return (
    <Modal
      title="智能分组"
      visible={visible}
      onOk={onSubmit}
      onCancel={onCancel}
      confirmLoading={isLoading}
    >
      <Form form={form} className="affairs-flow-basic">
        <Form.Item
          label="分组名称"
          name="groupName"
          rules={[
            { required: true, message: '请输入' },
            { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '分组名称只能是字母数字文字' },
          ]}
          {...formLayout}
        >
          <Input
            placeholder="请输入"
            maxLength={50}
          />
        </Form.Item>
        <Row>
          <Col span={16} offset={4}>
            <Form.Item
              name="isDefault"
            >
              <Checkbox.Group
                disabled={orderSearchGroup.find(d => d.is_default)}
              >
                <Checkbox value={1}>设为默认智能分组</Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

const Search = ({
  onSearch,
  onReset,
  tabKey,
  dispatch,
  defaultGroup = {}, // 默认分组
  onUpdateGroup, // 重新获取分组列表与审批单列表
  orderSearchGroup = [], // 分组列表
}) => {
  // form
  const [form, setForm] = useState(undefined);
  // 加入智能分组modal visible
  const [addGroupVisible, setAddGroupVisible] = useState(false);

  // 设置表单值为默认分组查询条件
  useEffect(() => {
    // 默认分组有值
    defaultGroup && Object.keys(defaultGroup).length > 0 && form && (
      form.setFieldsValue({
        ...defaultGroup,
      })
    );

    // 默认分组无值
    defaultGroup && Object.keys(defaultGroup).length < 1 && form && (
       form.setFieldsValue({
         ...getFormValues({}),
       })
    );
  }, [defaultGroup]);

  const commonSelectProps = {
    placeholder: '请选择',
    allowClear: true,
    mode: 'multiple',
    optionFilterProp: 'children',
    showArrow: true,
  };

  // 公共参数
  const commonItemsOne = [
    <Form.Item
      label="提报类型"
      name="attribution"
    >
      <Select placeholder="请选择" allowClear>
        <Option
          value={CodeCostCenterType.code}
        >{CodeCostCenterType.description(CodeCostCenterType.code)}</Option>
        <Option
          value={CodeCostCenterType.team}
        >{CodeCostCenterType.description(CodeCostCenterType.team)}</Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="审批流"
      name="flowId"
    >
      <Flow />
    </Form.Item>,
    <Form.Item
      label="审批单号"
      name="orderId"
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
  ];

  // 公共参数
  const commonItemsTwo = [
    <Form.Item
      label="付款状态"
      name="payStatus"
    >
      <Select allowClear placeholder="请选择付款状态">
        <Option
          value={CodeApproveOrderPayState.done}
        >
          {CodeApproveOrderPayState.description(CodeApproveOrderPayState.done)}
        </Option>
        <Option
          value={CodeApproveOrderPayState.abnormal}
        >
          {CodeApproveOrderPayState.description(CodeApproveOrderPayState.abnormal)}
        </Option>
        <Option
          value={CodeApproveOrderPayState.untreated}
        >
          {CodeApproveOrderPayState.description(CodeApproveOrderPayState.untreated)}
        </Option>
        <Option
          value={CodeApproveOrderPayState.noNeed}
        >
          {CodeApproveOrderPayState.description(CodeApproveOrderPayState.noNeed)}
        </Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="提报日期"
      name="reportAt"
    >
      <RangePicker
        format={'YYYY-MM-DD'}
        disabledDate={c => (c && c > new Date())}
      />
    </Form.Item>,
    <Form.Item
      label="付款日期"
      name="payAt"
    >
      <RangePicker
        format={'YYYY-MM-DD'}
        disabledDate={c => (c && c > new Date())}
      />
    </Form.Item>,
    <Form.Item
      label="记账月份"
      name="belongTime"
    >
      <MonthPicker
        style={{ width: '100%' }}
        placeholder="请选择记账月份"
        disabledDate={c => (c && c > moment(new Date()).add(1, 'M'))}
      />
    </Form.Item>,
    <Form.Item
      label="验票状态"
      name="ticketStatus"
    >
      <Select
        allowClear
        placeholder="请选择"
      >
        <Option
          value={ExpenseTicketState.already}
        >
          {ExpenseTicketState.description(ExpenseTicketState.already)}
        </Option>
        <Option
          value={ExpenseTicketState.waiting}
        >
          {ExpenseTicketState.description(ExpenseTicketState.waiting)}
        </Option>
        <Option
          value={ExpenseTicketState.abnormal}
        >
          {ExpenseTicketState.description(ExpenseTicketState.abnormal)}
        </Option>
      </Select>
    </Form.Item>,
    <Form.Item
      noStyle
      key="isTicketTag"
      shouldUpdate={
        (prevValues, curValues) => {
          return prevValues.ticketTag !== curValues.ticketTag;
        }}
    >
      {({ getFieldValue }) => (
        <Form.Item
          label="是否有验票标签"
          name="isTicketTag"
        >
          <Select
            allowClear
            placeholder="请选择"
            disabled={is.existy(getFieldValue('ticketTag')) && is.not.empty(getFieldValue('ticketTag'))}
          >
            <Option value="all">全部</Option>
            <Option value>有</Option>
            <Option value={false}>无</Option>
          </Select>
        </Form.Item>
    )}
    </Form.Item>,
    <Form.Item
      noStyle
      key="ticketTag"
      shouldUpdate={
      (prevValues, curValues) => {
        return prevValues.isTicketTag !== curValues.isTicketTag;
      }}
    >
      {({ getFieldValue }) => (
        <Form.Item
          label="验票标签"
          name="ticketTag"
          key="order_search_ticketTag"
        >
          <TicketTag
            showSearch
            optionFilterProp="children"
            disabled={getFieldValue('isTicketTag') || getFieldValue('isTicketTag') === false}
          />
        </Form.Item>
)}
    </Form.Item>,
  ];

  // 主题标签
  const themeTag = (
    <Form.Item
      label="主题标签"
      name="themeTag"
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>
  );

  const processStatus = (
    <Form.Item
      label="流程状态"
      name="processStatus"
    >
      <Select
        allowClear
        placeholder="请选择"
      >
        <Option
          value={ExpenseExamineOrderProcessState.processing}
        >
          {ExpenseExamineOrderProcessState.description(ExpenseExamineOrderProcessState.processing)}
        </Option>
        <Option
          value={ExpenseExamineOrderProcessState.finish}
        >
          {ExpenseExamineOrderProcessState.description(ExpenseExamineOrderProcessState.finish)}
        </Option>
        <Option
          value={ExpenseExamineOrderProcessState.close}
        >
          {ExpenseExamineOrderProcessState.description(ExpenseExamineOrderProcessState.close)}
        </Option>
      </Select>
    </Form.Item>
  );

  // 申请人
  const applicant = (
    <Form.Item
      label="申请人"
      name="applicant"
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>
  );

  // code系统查询参数
  const codeItems = [
    <Form.Item
      label="场景"
      name="industryIds"
      key="order_search_scenes"
    >
      <Scenes {...commonSelectProps} />
    </Form.Item>,
    <Form.Item
      label="平台"
      name="platformIds"
      key="order_search_platform"
    >
      <Platform {...commonSelectProps} />
    </Form.Item>,
    <Form.Item
      label="项目"
      name="projectIds"
      key="order_search_term"
    >
      <Project {...commonSelectProps} />
    </Form.Item>,
    <Form.Item
      label="主体"
      name="supplierIds"
    >
      <MainBody {...commonSelectProps} />
    </Form.Item>,
    <Form.Item
      label="城市"
      name="cityCodes"
      key="order_search_city"
    >
      <City {...commonSelectProps} />
    </Form.Item>,
    <Form.Item
      label="科目"
      name="costAccountingIds"
      key="order_search_subject"
    >
      <Subject {...commonSelectProps} />
    </Form.Item>,
    <Form.Item
      label="费用总金额"
    >
      <div style={{ display: 'flex' }}>
        <Form.Item name="paidMoneyLow">
          <InputNumber
            precision={2}
            min={0.01}
            style={{ width: '100%' }}
            placeholder="请填写金额"
            formatter={Unit.maxMoneyLimitDecimalsFormatter}
            parser={Unit.limitDecimalsParser}
          />
        </Form.Item>
        <span style={{ margin: '0px 5px', lineHeight: '30px' }}>-</span>
        <Form.Item name="paidMoneyTop">
          <InputNumber
            precision={2}
            min={0.01}
            style={{ width: '100%' }}
            placeholder="请填写金额"
            formatter={Unit.maxMoneyLimitDecimalsFormatter}
            parser={Unit.limitDecimalsParser}
          />
        </Form.Item>
      </div>
    </Form.Item>,
    {
      span: 16,
      render: (
        <Form.Item
          label="发票抬头"
          name="invoiceTitleList"
          key="order_search_invoiceTitle"
          {...formLayout}
        >
          <Invoice {...commonSelectProps} />
        </Form.Item>
      ),
    },
  ];

  const formItems = {
    [CodeApproveOrderTabKey.awaitReport]: [...commonItemsOne, themeTag],
    [CodeApproveOrderTabKey.upcoming]: [...commonItemsOne, applicant, ...commonItemsTwo, themeTag, ...codeItems],
    [CodeApproveOrderTabKey.meReport]: [...commonItemsOne, processStatus, ...commonItemsTwo, themeTag, ...codeItems],
    [CodeApproveOrderTabKey.meHandle]: [...commonItemsOne, applicant, processStatus, ...commonItemsTwo, themeTag, ...codeItems],
    [CodeApproveOrderTabKey.copyGive]: [...commonItemsOne, applicant, processStatus, ...commonItemsTwo, themeTag, ...codeItems],
    [CodeApproveOrderTabKey.all]: [...commonItemsOne, applicant, processStatus, ...commonItemsTwo, themeTag, ...codeItems],
  };

  // 操作：添加智能分组
  const operations = tabKey !== CodeApproveOrderTabKey.awaitReport ? (
    <Button
      type="primary"
      onClick={() => setAddGroupVisible(true)}
      disabled={(orderSearchGroup && orderSearchGroup.length > 4)}
      _event={Events.EventCodeOrderGroupAdd}
    >
      加入条件分组
    </Button>
  ) : '';

  const sProps = {
    items: formItems[tabKey],
    onSearch,
    onReset,
    expand: true,
    onHookForm: hForm => setForm(hForm),
    operations,
  };

  // 加入智能分组modal
  const renderAddGroupModal = () => {
    if (!addGroupVisible) return;

    const props = {
      visible: addGroupVisible,
      onCancel: () => setAddGroupVisible(false),
      searchForm: form,
      dispatch,
      tabKey,
      onUpdateGroup,
      defaultGroup,
      orderSearchGroup,
    };

    return (
      <AddGroupModal {...props} />
    );
  };

  return (
    <CoreContent className="affairs-flow-basic">
      <CoreSearch {...sProps} />
      {renderAddGroupModal()}
    </CoreContent>
  );
};

export default Search;
