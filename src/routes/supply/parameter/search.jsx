/**
 * 物资管理 - 物资台账页面 - 搜索组件  Supply/Parameter
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Popconfirm, Button, message } from 'antd';

import { CoreContent } from '../../../components/core';
import { DeprecatedCommonSearchExtension } from '../../../components/common';
import Operate from '../../../application/define/operate';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: undefined,    // 搜索的form
      search: {

      },
      onSearch: props.onSearch,       // 搜索回调
    };
  }

  // 搜索
  onSearch = (values) => {
    const { onSearch } = this.state;
    const { platforms, suppliers, cities, districts } = values;
    const params = {
      platforms,      // 平台
      suppliers,      // 供应商
      cities,         // 城市
      districts,      // 商圈
      page: 1,
      limit: 30,
    };
    if (onSearch) {
      onSearch(params);
    }
  }

  // 重置
  onReset = () => {
    const { onSearch } = this.state;
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

  // 导出数据的失败的回调函数
  onFailureExportCallback = () => {
    message.error('导出数据失败');
  }

    // 导出EXCEL,创建下载任务
  onCreateExportTask = () => {
    const { dispatch } = this.props;
    this.state.form.validateFields((err, values) => {
      const params = { ...values };
      dispatch({
        type: 'supplyDetails/fetchStandingBookExport',
        payload: {
          params,
          onSuccessCallback: this.onSuccessExportCallback,
          onFailureCallback: this.onFailureExportCallback,
        },
      });
    });
  }

  // 搜索功能
  render = () => {
    // 导出EXCEL(超级管理员)
    let operations = '';
    if (Operate.canOperateSupplyStandBookExport()) {
      operations = (
        <Popconfirm title="创建下载任务？" onConfirm={this.onCreateExportTask} okText="确认" cancelText="取消">
          <Button type="primary">导出EXCEL</Button>
        </Popconfirm>
      );
    }

    const props = {
      operations,
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

function mapStateToProps({ supplyDetails }) {
  return { supplyDetails };
}

export default connect(mapStateToProps)(Search);
