/**
 * 物资管理 - 扣款汇总页面 - 搜索组件    Supply/DeductSummarize
 */
import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'redux-saga/utils';

import {
  DatePicker,
  message,
  Select,
} from 'antd';

import { CoreContent } from '../../../components/core';
import { DeprecatedCommonSearchExtension } from '../../../components/common';
import { SupplyNameType } from '../../../application/define';
// import Operate from '../../../application/define/operate';

const { MonthPicker } = DatePicker;
const { Option } = Select;

class Search extends Component {
  static propTypes = {
    onSearch: PropTypes.func,
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    onSearch: noop,
    dispatch: noop,
  }

  constructor(props) {
    super(props);
    this.state = {
      form: undefined, // 搜索的form
    };
  }

  // 搜索
  onSearch = (values) => {
    const { onSearch } = this.props;
    const {
      platforms,
      suppliers,
      cities,
      districts,
      belongTime,
      supplyClass,
    } = values;

    // 归属时间
    const affiliation = belongTime ? moment(belongTime).format('YYYYMM') : '';

    const params = {
      platforms, // 平台
      suppliers, // 供应商
      cities, // 城市
      districts, // 商圈
      page: 1,
      limit: 30,
      belongTime: affiliation, // 归属时间
      supplyClass, // 物资分类
    };

    if (onSearch) {
      onSearch(params);
    }
  }

  // 重置
  onReset = () => {
    const { onSearch } = this.props;

    // 参数
    const params = {
      page: 1,
      limit: 30,
    };

    // 重置搜索
    if (onSearch) {
      onSearch(params);
    }
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 失败回调
  onFailureCallback = (res) => {
    return message.error(res.zh_message);
  }

  // 导出EXCEL,创建下载任务
  onCreateExportTask = () => {
    const { dispatch } = this.props;
    const { getFieldsValue } = this.state.form;

    // 获取form value
    const params = getFieldsValue();
    dispatch({
      type: 'supplyDeductSummarize/fetchDeductSummarizeExport',
      payload: {
        params,
        onSuccessCallback: () => message.success('导出数据成功'),
        onFailureCallback: this.onFailureCallback,
      },
    });
  }

  // 可选时间为当天及之前
  disableDateOfMonth = (current) => {
    return current && current > new Date();
  };

  // 搜索功能
  render = () => {
    // 导出EXCEL(超级管理员)
    // let operations = '';

    // 导出权限
    // if (Operate.canOperateSupplyDeductSummarizeExportAndUpload()) {
    // operations = (
    // <Popconfirm
    // title="创建下载任务？"
    // onConfirm={this.onCreateExportTask}
    // okText="确认"
    // cancelText="取消"
    // >
    // <Button type="primary">导出EXCEL</Button>
    // </Popconfirm>
    // );
    // }

    // 查询条件
    const items = [
      {
        label: '物资分类',
        form: form => (form.getFieldDecorator('supplyClass')(
          <Select
            mode="multiple"
            showArrow
            placeholder="请选择物资分类"
          >
            <Option value={SupplyNameType.electricCars}>{SupplyNameType.description(SupplyNameType.electricCars)}</Option>
            <Option value={SupplyNameType.equipment}>{SupplyNameType.description(SupplyNameType.equipment)}</Option>
            <Option value={SupplyNameType.fixedAssets}>{SupplyNameType.description(SupplyNameType.fixedAssets)}</Option>
          </Select>,
        )),
      }, {
        label: '归属时间',
        form: form => (form.getFieldDecorator('belongTime', { initialValue: null })(
          <MonthPicker
            placeholder="请选择归属时间"
            disabledDate={this.disableDateOfMonth}
          />,
        )),
      },
    ];

    const props = {
      items,
      onReset: this.onReset,
      onSearch: this.onSearch,
      onHookForm: this.onHookForm,
    };

    return (
      <CoreContent>
        <DeprecatedCommonSearchExtension {...props} />
      </CoreContent>
    );
  }

}


export default Search;
