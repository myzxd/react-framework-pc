/**
 * 审批管理 - 流程审批 - 考勤管理 - 加班管理 - 查询组件
 */
import moment from 'moment';
import React from 'react';
import {
  Input,
  Select,
  DatePicker,
  Button,
  Popconfirm,
} from 'antd';

import {
  DeprecatedCoreSearch,
} from '../../../components/core';

import {
  ExpenseOverTimeTabType,
  ExpenseOverTimeThemeTag,
  ExpenseExamineOrderProcessState,
} from '../../../application/define';

import Operate from '../../../application/define/operate';

import CreateModal from './components/modal/create';

import style from './style.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Search = (props) => {
  const {
    activeKey, // tab key
    onSearch,
    onReset,
    onHookForm,
    onExportEXCEL, // 导出EXCEL
  } = props;

  // 创建导出任务
  const onCreateExportTask = () => {
    onExportEXCEL && onExportEXCEL();
  };

  // 渲染表单
  const renderContent = () => {
    const items = [
      {
        label: '加班单号',
        form: form => (form.getFieldDecorator('orderId')(
          <Input placeholder="请输入加班单号" />,
        )),
      },
      {
        label: '实际加班人',
        form: form => (form.getFieldDecorator('applyOverTimePerson')(
          <Input placeholder="请输入实际加班人" />,
        )),
      },
      {
        label: '主题标签',
        form: form => (form.getFieldDecorator('themeTag')(
          <Select
            mode="multiple"
            showArrow
            allowClear
            placeholder="请选择主题标签"
          >
            <Option key="1" value={ExpenseOverTimeThemeTag.product}>{`${ExpenseOverTimeThemeTag.description(ExpenseOverTimeThemeTag.product)}`}</Option>
            <Option key="2" value={ExpenseOverTimeThemeTag.data}>{`${ExpenseOverTimeThemeTag.description(ExpenseOverTimeThemeTag.data)}`}</Option>
            <Option key="3" value={ExpenseOverTimeThemeTag.mobile}>{`${ExpenseOverTimeThemeTag.description(ExpenseOverTimeThemeTag.mobile)}`}</Option>
            <Option key="4" value={ExpenseOverTimeThemeTag.rearEnd}>{`${ExpenseOverTimeThemeTag.description(ExpenseOverTimeThemeTag.rearEnd)}`}</Option>
            <Option key="5" value={ExpenseOverTimeThemeTag.frontEnd}>{`${ExpenseOverTimeThemeTag.description(ExpenseOverTimeThemeTag.frontEnd)}`}</Option>
            <Option key="6" value={ExpenseOverTimeThemeTag.implement}>{`${ExpenseOverTimeThemeTag.description(ExpenseOverTimeThemeTag.implement)}`}</Option>
            <Option key="7" value={ExpenseOverTimeThemeTag.qualityInspection}>{`${ExpenseOverTimeThemeTag.description(ExpenseOverTimeThemeTag.qualityInspection)}`}</Option>
          </Select>,
        )),
      },
      {
        label: '流程状态',
        form: form => (form.getFieldDecorator('state')(
          <Select allowClear placeholder="请选择流程状态">
            <Option value={ExpenseExamineOrderProcessState.processing}>{ExpenseExamineOrderProcessState.description(ExpenseExamineOrderProcessState.processing)}</Option>
            <Option value={ExpenseExamineOrderProcessState.finish}>{ExpenseExamineOrderProcessState.description(ExpenseExamineOrderProcessState.finish)}</Option>
            <Option value={ExpenseExamineOrderProcessState.close}>{ExpenseExamineOrderProcessState.description(ExpenseExamineOrderProcessState.close)}</Option>
          </Select>,
        )),
      },
      {
        label: '开始时间',
        form: form => (form.getFieldDecorator('startTime', { initialValue: null })(
          <RangePicker
            format={'YYYY-MM-DD'}
            showTime={{
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
            }}
            className={style['app-comp-expense-overtime-search-time']}
          />,
        )),
      },
      {
        label: '结束时间',
        form: form => (form.getFieldDecorator('endTime', { initialValue: null })(
          <RangePicker
            format={'YYYY-MM-DD'}
            showTime={{
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
            }}
            className={style['app-comp-expense-overtime-search-time']}
          />,
        )),
      },
    ];

    const operations = [];

    // 导出
    const exportButton = (
      <Popconfirm title="创建下载任务？" onConfirm={onCreateExportTask} okText="确认" cancelText="取消" key="export">
        <Button type="primary" className={style['app-comp-expense-overtime-export']}>导出EXCEL</Button>
      </Popconfirm>
    );

    // 待提报的显示创建按钮
    if (Number(activeKey) === ExpenseOverTimeTabType.mine) {
      operations.push(<CreateModal key="createModal" />);
    }

    //  全部tab权限
    if (Operate.canOperateExpenseOverTimeAll()) {
      operations.push(exportButton);
    }

    const itemProps = {
      items,
      onSearch,
      onReset,
      onHookForm,
      operations,
    };

    return <DeprecatedCoreSearch {...itemProps} />;
  };

  return renderContent();
};

export default Search;
