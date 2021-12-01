/**
 * 摊销管理 - 摊销确认 - search
 */
import moment from 'moment';
import React from 'react';
import {
  Form,
  Select,
  Input,
  DatePicker,
} from 'antd';
import {
  CoreSearch,
  CoreContent,
} from '../../../components/core';
import {
  AmortizationState,
  AmortizationIsConfirmRule,
  AmortizationIsRedPush,
} from '../../../application/define';

import Subject from '../component/subject'; // 科目名称
import Scenes from '../component/scenes'; // 场景
import Platform from '../component/platform'; // 平台
import MainBody from '../component/mainBody'; // 主体
import Project from '../component/project'; // 项目
import AccountCenter from '../component/accountCenter'; // 核算中心
import Invoice from '../component/invoice'; // 发票抬头

const { Option } = Select;
const { MonthPicker } = DatePicker;

const formLayout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };

const Search = ({
  onSearch,
}) => {
  // 公共select属性
  const commonSelectProps = {
    placeholder: '请选择',
    allowClear: true,
    mode: 'multiple',
    optionFilterProp: 'children',
    showArrow: true,
  };

  // 获取默认记账月份
  const getDefaultBookMonth = () => {
    // 当前日期
    const curDate = Number(moment().get('date'));

    // 12号之后，取当前月
    if (curDate > 12) {
      return moment();
    }

    // 12号之前，取上月
    if (curDate <= 12) {
      return moment().subtract(1, 'M');
    }
  };

  // 公共参数
  const items = [
    <Form.Item
      label="科目名称"
      name="subject"
    >
      <Subject {...commonSelectProps} />
    </Form.Item>,
    <Form.Item
      label="场景"
      name="scenes"
    >
      <Scenes {...commonSelectProps} />
    </Form.Item>,
    <Form.Item
      label="平台"
      name="platform"
    >
      <Platform {...commonSelectProps} />
    </Form.Item>,
    <Form.Item
      label="主体"
      name="body"
    >
      <MainBody {...commonSelectProps} />
    </Form.Item>,
    <Form.Item
      label="项目"
      name="project"
    >
      <Project {...commonSelectProps} />
    </Form.Item>,
    <Form.Item
      label="记账月份"
      name="bookMonth"
    >
      <MonthPicker
        placeholder="请选择"
        disabledDate={c => (c && c > getDefaultBookMonth())}
      />
    </Form.Item>,
    <Form.Item
      label="摊销状态"
      name="amortizationState"
    >
      <Select
        allowClear
        placeholder="请选择"
      >
        <Option
          value={AmortizationState.processing}
        >
          {AmortizationState.description(AmortizationState.processing)}
        </Option>
        <Option
          value={AmortizationState.completed}
        >
          {AmortizationState.description(AmortizationState.completed)}
        </Option>
        <Option
          value={AmortizationState.terminated}
        >
          {AmortizationState.description(AmortizationState.terminated)}
        </Option>
        <Option
          value={AmortizationState.notStarted}
        >
          {AmortizationState.description(AmortizationState.notStarted)}
        </Option>
        <Option
          value={AmortizationState.notFund}
        >
          {AmortizationState.description(AmortizationState.notFund)}
        </Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="是否确认规则"
      name="isConfirmRule"
    >
      <Select
        allowClear
        placeholder="请选择"
      >
        <Option
          value={AmortizationIsConfirmRule.right}
        >{AmortizationIsConfirmRule.description(AmortizationIsConfirmRule.right)}</Option>
        <Option
          value={AmortizationIsConfirmRule.negate}
        >{AmortizationIsConfirmRule.description(AmortizationIsConfirmRule.negate)}</Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="是否红冲"
      name="billRedPushState"
    >
      <Select
        allowClear
        placeholder="请选择"
      >
        <Option
          value={AmortizationIsRedPush.right}
        >{AmortizationIsRedPush.description(AmortizationIsRedPush.right)}</Option>
        <Option
          value={AmortizationIsRedPush.negate}
        >{AmortizationIsRedPush.description(AmortizationIsRedPush.negate)}</Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="费用单号"
      name="costId"
    >
      <Input allowClear placeholder="请输入" />
    </Form.Item>,
    <Form.Item
      label="审批单号"
      name="orderId"
    >
      <Input allowClear placeholder="请输入" />
    </Form.Item>,
    <Form.Item
      label="核算中心"
      name="account"
    >
      <AccountCenter {...commonSelectProps} />
    </Form.Item>,
    {
      key: 'invoice',
      span: 16,
      render: (
        <Form.Item
          label="发票抬头"
          name="invoiceTitle"
          {...formLayout}
        >
          <Invoice {...commonSelectProps} />
        </Form.Item>
      ),
    },
  ];

  const sProps = {
    items,
    onSearch,
    onReset: onSearch,
  };

  return (
    <CoreContent className="affairs-flow-basic">
      <CoreSearch {...sProps} />
    </CoreContent>
  );
};

export default Search;
