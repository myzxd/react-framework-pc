/**
 * 费用管理 - 考勤管理 - 请假管理 - 查询组件
 */
import dot from 'dot-prop';
import moment from 'moment';
import React, { Component } from 'react';
import { Select, Input, DatePicker, message, Button, Popconfirm } from 'antd';

import { DeprecatedCoreSearch, CoreContent } from '../../../../components/core';

import { CommonSelectCities, CommonSelectDistricts, CommonSelectPlatforms } from '../../../../components/common';
import {
  ExpenseExamineOrderProcessState,
  ExpenseBorrowRepaymentsTabType,
  ExpenseAttendanceTakeLeaveType,
} from '../../../../application/define';

import Operate from '../../../../application/define/operate';
import CreateModal from './model/create';

import { authorize } from '../../../../application';

import style from './style.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: undefined,  // 搜索的form
      search: {
        platforms: [],                 // 平台
        cities: [],                    // 城市(页面组件选中使用)
        districts: [],                 // 商圈
      },
      citySpelling: [],
    };
  }

  // 更换平台
  onChangePlatforms = (e) => {
    const { search, form } = this.state;
    search.platforms = e;
    search.cities = [];
    search.districts = [];
    this.setState({ search, citySpelling: [] });

    // 清空选项
    form.setFieldsValue({ cities: undefined });
    form.setFieldsValue({ districts: undefined });
  }

  // 更换城市
  onChangeCity = (e, options) => {
    const { search, form } = this.state;
    const citySpelling = options.map(option => dot.get(option, 'props.spell', []));

    // 保存城市参数
    search.cities = e;
    search.districts = [];
    this.setState({ search, citySpelling });
    form.setFieldsValue({ districts: undefined });
  }

  // 更换区域
  onChangeDistrict = (e) => {
    const { search } = this.state;
    // 保存商圈参数
    search.districts = e;
    this.setState({ search });
  }

  // 重置
  onReset = () => {
    const { onSearch } = this.props;
    const params = {
      page: 1,
      limit: 30,
    };

    // 重置搜索
    if (onSearch) {
      onSearch(params);
    }
  }

  // 处理数据
  onDealWithData = (val) => {
    const {
      platforms,
      cities,
      districts,
      takeLeaveType,
      takeLeaveId,
      state,
      expectStartTime,               // 开始时间
      expectDoneTime,                // 结束时间
    } = val;

    // 处理时间
    const startMinDate = dot.has(expectStartTime, '0') ? moment(expectStartTime[0]).format('YYYY-MM-DD HH:mm:ss') : ''; // 开始最小时间
    const startMaxDate = dot.has(expectStartTime, '0') ? moment(expectStartTime[1]).format('YYYY-MM-DD HH:mm:ss') : '';  // 开始最大时间
    const endMinDate = dot.has(expectDoneTime, '0') ? moment(expectDoneTime[0]).format('YYYY-MM-DD HH:mm:ss') : ''; // 结束最小时间
    const endMaxDate = dot.has(expectDoneTime, '0') ? moment(expectDoneTime[1]).format('YYYY-MM-DD HH:mm:ss') : ''; // 结束最大时间

    // 定义参数
    const params = {
      platforms,
      cities,
      districts,
      takeLeaveType,
      takeLeaveId,
      state,
      startMinDate,
      startMaxDate,
      endMinDate,
      endMaxDate,
    };

    return params;
  }

  // 查询
  onSearch = (values) => {
    const { onSearch } = this.props;
    const params = this.onDealWithData(values);

    if (onSearch) {
      onSearch(params);
    }
  };

  // 导出EXCEL
  onCreateExportTask = () => {
    const {
      form,
    } = this.state;

    const {
      dispatch = () => {},
      activeKey,
    } = this.props;

    form.validateFields((err, values) => {
      if (err) return;

      const params = {
        ...this.onDealWithData(values),
        onSuccessCallback: () => message.success('请求成功'),
      };

      // 如果tab时‘我的’，则传入登录账号
      if (Number(activeKey) === ExpenseBorrowRepaymentsTabType.mine) {
        params.applyAccountId = authorize.account.id;
      }

      dispatch({ type: 'expenseTakeLeave/exportTakeLeave', payload: params });
    });
  }

  // 展开，收起
  onToggle = (expand) => {
    const { onToggle } = this.props;
    if (onToggle) {
      onToggle(expand);
    }
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 可选时间为当天及之前
  disableDateOfMonth = (current) => {
    return current && current > new Date();
  };

  // 渲染查询表单
  renderSearchForm = () => {
    const { expand } = this.props;
    const { platforms } = this.state.search;
    const { citySpelling } = this.state;

    // 导出
    const exportButton = (
      <Popconfirm title="创建下载任务？" onConfirm={this.onCreateExportTask} okText="确认" cancelText="取消" key="export">
        <Button type="primary" className={style['app-comp-expense-takeLeave-export']}>导出EXCEL</Button>
      </Popconfirm>
    );

    // 创建弹窗
    const operations = [];
    // 判断新建按钮是否显示
    if (ExpenseBorrowRepaymentsTabType.mine === Number(this.props.activeKey)) {
      operations.push(<CreateModal key="createModal" />);
    }

    if (Operate.canOperateExpenseAttendanceTakeLeaveAll()) {
      operations.push(exportButton);
    }

    const items = [{
      label: '请假类型',
      form: form => (form.getFieldDecorator('takeLeaveType')(
        <Select allowClear placeholder="请选择请假类型">
          <Option value={ExpenseAttendanceTakeLeaveType.things}>{ExpenseAttendanceTakeLeaveType.description(ExpenseAttendanceTakeLeaveType.things)}</Option>
          <Option value={ExpenseAttendanceTakeLeaveType.disease}>{ExpenseAttendanceTakeLeaveType.description(ExpenseAttendanceTakeLeaveType.disease)}</Option>
          <Option value={ExpenseAttendanceTakeLeaveType.years}>{ExpenseAttendanceTakeLeaveType.description(ExpenseAttendanceTakeLeaveType.years)}</Option>
          <Option value={ExpenseAttendanceTakeLeaveType.marriage}>{ExpenseAttendanceTakeLeaveType.description(ExpenseAttendanceTakeLeaveType.marriage)}</Option>
          <Option value={ExpenseAttendanceTakeLeaveType.maternity}>{ExpenseAttendanceTakeLeaveType.description(ExpenseAttendanceTakeLeaveType.maternity)}</Option>
          <Option value={ExpenseAttendanceTakeLeaveType.paternal}>{ExpenseAttendanceTakeLeaveType.description(ExpenseAttendanceTakeLeaveType.paternal)}</Option>
          <Option value={ExpenseAttendanceTakeLeaveType.bereavement}>{ExpenseAttendanceTakeLeaveType.description(ExpenseAttendanceTakeLeaveType.bereavement)}</Option>
          <Option value={ExpenseAttendanceTakeLeaveType.goOut}>{ExpenseAttendanceTakeLeaveType.description(ExpenseAttendanceTakeLeaveType.goOut)}</Option>
        </Select>,
      )),
    }, {
      label: '请假单号',
      form: form => (form.getFieldDecorator('takeLeaveId')(
        <Input placeholder="请输入借款单号" />,
      )),
    }, {
      label: '流程状态',
      form: form => (form.getFieldDecorator('state')(
        <Select allowClear placeholder="请选择流程状态">
          <Option value={ExpenseExamineOrderProcessState.processing}>{ExpenseExamineOrderProcessState.description(ExpenseExamineOrderProcessState.processing)}</Option>
          <Option value={ExpenseExamineOrderProcessState.finish}>{ExpenseExamineOrderProcessState.description(ExpenseExamineOrderProcessState.finish)}</Option>
          <Option value={ExpenseExamineOrderProcessState.close}>{ExpenseExamineOrderProcessState.description(ExpenseExamineOrderProcessState.close)}</Option>
        </Select>,
      )),
    }, {
      label: '申请请假开始时间',
      form: form => (form.getFieldDecorator('expectStartTime', { initialValue: null })(
        <RangePicker
          key="expect-start-time"
          format={'YYYY-MM-DD'}
          showTime={{
            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
          }}
          className={style['app-comp-expense-takeLeave-search-time']}
        />,
      )),
    },
    {
      label: '申请请假结束时间',
      form: form => (form.getFieldDecorator('expectDoneTime', { initialValue: null })(
        <RangePicker
          key="expect-done-time"
          format={'YYYY-MM-DD'}
          showTime={{
            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
          }}
          className={style['app-comp-expense-takeLeave-search-time']}
        />,
      )),
    }];

    // 根据切换类型判断来是否增加项目,城市,商圈
    if (ExpenseBorrowRepaymentsTabType.all === Number(this.props.activeKey)) {
      items.unshift(
        {
          label: '项目',
          form: form => (form.getFieldDecorator('platforms', { initialValue: undefined })(
            <CommonSelectPlatforms mode="multiple" showArrow allowClear showSearch optionFilterProp="children" placeholder="请选择平台" onChange={this.onChangePlatforms} />,
          )),
        },
        {
          label: '城市',
          form: form => (form.getFieldDecorator('cities', { initialValue: undefined })(
            <CommonSelectCities mode="multiple" showArrow namespace="cities" isExpenseModel allowClear showSearch optionFilterProp="children" placeholder="请选择城市" platforms={platforms} onChange={this.onChangeCity} />,
          )),
        },
        {
          label: '商圈',
          form: form => (form.getFieldDecorator('districts', { initialValue: undefined })(
            <CommonSelectDistricts
              showArrow
              mode="multiple"
              allowClear
              showSearch
              namespace="districts"
              optionFilterProp="children"
              placeholder="请选择商圈"
              platforms={platforms}
              cities={citySpelling}
              disabled={this.state.isShowDistricts}
              onChange={this.onChangeDistrict}
            />,
          )),
        },
      );
    }

    const props = {
      items,
      expand,
      operations,
      isExpenseModel: true,       // 费用模块使用fix city_code
      onReset: this.onReset,
      onSearch: this.onSearch,
      onToggle: this.onToggle,
      onHookForm: this.onHookForm,
      namespace: `borrow${this.props.activeKey}`,
    };
    return (
      <CoreContent>
        <DeprecatedCoreSearch {...props} />
      </CoreContent>
    );
  }

  render = () => {
    return (
      <div>
        {this.renderSearchForm()}
      </div>
    );
  }
}

export default Search;
