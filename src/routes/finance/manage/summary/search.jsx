/**
 * 结算模版列表,查询 - Finance/Summary
 */
import is from 'is_js';
import moment from 'moment';
import React, { Component } from 'react';
import { Select, DatePicker } from 'antd';

import { DeprecatedCoreSearch, CoreContent } from '../../../../components/core';
import { CommonSelectSuppliers, CommonSelectPlatforms, CommonSelectCities } from '../../../../components/common/';
import { SalarySummaryState, HouseholdType } from '../../../../application/define';
import styles from './style/index.less';

const { Option } = Select;
const { MonthPicker } = DatePicker;

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: undefined,                // 搜索的form
      search: {
        suppliers: [],                // 供应商
        platform: '',                 // 平台
        cities: [],                   // 城市
        workType: '',                 // 工作性质
        verifyState: [],              // 审核状态（生成结算单的审核状态）
      },
      onSearch: props.onSearch,       // 搜索回调
      operations: props.operations ? props.operations : undefined, // 扩展
    };
    this.private = {
      flag: true,
      searchParams: {},
    };
  }

  // 更换平台
  onChangePlatforms = (e) => {
    const { form, search } = this.state;
    const { flag } = this.private;
    const { onSearchPlatform } = this.props;
    search.platform = e;
    search.suppliers = [];
    search.cities = [];
    this.setState({ search });
    // 初始获取平台的默认值
    if (flag) {
      this.private.searchParams.platform = e;
      const params = {
        platform: e,
        page: 1,
        limit: 30,
      };
      // 判断是否存在
      if (is.existy(onSearchPlatform) && is.not.empty(onSearchPlatform)) {
        onSearchPlatform(params);
      }
      this.private.flag = false;
    }
    // 清空选项
    form.setFieldsValue({ suppliers: [] });
    form.setFieldsValue({ cities: [] });
  }

  // 更换供应商
  onChangeSuppliers = (e) => {
    const { form, search } = this.state;
    search.suppliers = e;
    search.cities = [];
    this.setState({ search });

    // 清空选项
    form.setFieldsValue({ cities: [] });
  }

  // 重置
  onReset = () => {
    const { onSearch } = this.state;
    const { platform } = this.private.searchParams;
    const params = {
      suppliers: [],                  // 供应商
      platform,               // 平台
      cities: [],                     // 城市
      workType: '',        // 人员类型
      verifyState: [],  // 审核状态（生成结算单的审核状态）
      cycle: '',
      page: 1,
      limit: 30,
    };

    // 重置数据
    this.setState({ search: params });
    // 重置搜索
    if (onSearch) {
      onSearch(params);
    }
  }

  // 搜索
  onSearch = (values) => {
    const { onSearch } = this.state;
    const { suppliers, platform, cities, verifyState, workType, cycle } = values;
    const params = {
      suppliers,
      platform,
      cities,
      verifyState,
      workType,
      page: 1,
      limit: 30,
    };
    if (is.existy(cycle) && is.not.empty(cycle)) {
      params.cycle = moment(cycle).format('YYYYMM');
    }

    if (onSearch) {
      onSearch(params);
    }
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }
  // 更换人员类型
  onChangeWorkProperty = (e) => {
    const { search } = this.state;
    search.workType = Number(e);
    this.setState({ search });
  }

  // 搜索功能
  render = () => {
    const { platform, workType, suppliers, cities, verifyState } = this.state.search;
    const operations = this.state.operations;
    const items = [
      {
        label: '平台',
        form: form => (form.getFieldDecorator('platform', { initialValue: platform })(
          <CommonSelectPlatforms
            showSearch
            showDefaultValue
            optionFilterProp="children"
            placeholder="请选择平台"
            onChange={this.onChangePlatforms}
          />,
        )),
      },
      {
        label: '供应商',
        form: form => (form.getFieldDecorator('suppliers', { initialValue: suppliers })(
          <CommonSelectSuppliers
            allowClear
            showSearch
            optionFilterProp="children"
            mode="multiple"
            showArrow
            placeholder="请选择供应商"
            platforms={platform}
            onChange={this.onChangeSuppliers}
          />,
        )),
      },
      {
        label: '城市',
        form: form => (form.getFieldDecorator('cities', { initialValue: cities })(
          <CommonSelectCities
            isExpenseModel
            allowClear
            showSearch
            optionFilterProp="children"
            mode="multiple"
            showArrow
            placeholder="请选择城市"
            platforms={platform ? [platform] : []}
            suppliers={suppliers}
          />,
        )),
      },
      {
        label: '个户类型',
        form: form => (form.getFieldDecorator('workType', { initialValue: workType || undefined })(
          <Select allowClear placeholder="请选择个户类型" onChange={this.onChangeWorkProperty}>
            <Option value={`${HouseholdType.first}`}>{HouseholdType.description(HouseholdType.first)}</Option>
            <Option value={`${HouseholdType.second}`}>{HouseholdType.description(HouseholdType.second)}</Option>
          </Select>,
        )),
      },
      {
        label: '审核状态',
        tips: '结算单汇总的审核状态',
        form: form => (form.getFieldDecorator('verifyState', { initialValue: verifyState })(
          <Select allowClear placeholder="请选择审核状态" showArrow mode="multiple">
            <Option value={`${SalarySummaryState.waiting}`}>{SalarySummaryState.description(SalarySummaryState.waiting)}</Option>
            <Option value={`${SalarySummaryState.processing}`}>{SalarySummaryState.description(SalarySummaryState.processing)}</Option>
            <Option value={`${SalarySummaryState.success}`}>{SalarySummaryState.description(SalarySummaryState.success)}</Option>
          </Select>,
        )),
      },
      {
        label: '结算周期',
        form: form => (form.getFieldDecorator('cycle', { initialValue: null })(
          <MonthPicker
            className={styles['app-comp-finance-summary-search']}
            placeholder="请选择周期"
          />,
        )),
      },
    ];

    const props = {
      items,
      operations,
      onReset: this.onReset,
      onSearch: this.onSearch,
      onHookForm: this.onHookForm,
      expand: true,
    };
    return (
      <CoreContent className={styles['app-comp-finance-summary-background']} >
        <DeprecatedCoreSearch {...props} />
      </CoreContent>
    );
  };
}

export default Search;
