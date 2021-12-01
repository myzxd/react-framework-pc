/**
 * 费用管理 - 费用预算    Expense/Budget (废弃了)
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import {
  Table,
  message,
  Popconfirm,
  Button,
} from 'antd';

import { CoreContent, CoreUploadAmazon } from '../../../components/core';
import Search from './search.jsx';
import Operate from '../../../application/define/operate';

import style from './style.css';

class Budget extends Component {
  static propTypes = {
    expenseBudgetData: PropTypes.object,
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    expenseBudgetData: {},
    dispatch: () => {},
  }

  constructor(props) {
    super(props);
    this.private = {
      searchParams: {},   // 查询参数
      namespace: `namespace${Math.floor(Math.random() * 100000)}`,      // 命名空间
    };
  }

  // 默认加载数据
  componentDidMount() {
    this.props.dispatch({
      type: 'expenseBudget/fetchExpenseBudgetList',
    });
  }

  // 重置数据
  componentWillUnmount() {
    this.props.dispatch({
      type: 'expenseBudget/reduceExpenseBudget',
      payload: {},
    });

    this.props.dispatch({
      type: 'applicationCommon/resetEnumeratedValue',
      payload: {},
    });
  }

  // 搜索
  onSearch = (params) => {
    // 保存搜索的参数
    this.private.searchParams = params;
    if (!this.private.searchParams.page) {
      this.private.searchParams.page = 1;
    }
    if (!this.private.searchParams.limit) {
      this.private.searchParams.limit = 30;
    }
    // 调用搜索
    this.props.dispatch({
      type: 'expenseBudget/fetchExpenseBudgetList',
      payload: this.private.searchParams,
    });
  }

  // 修改分页
  onChangePage = (page, limit) => {
    this.private.searchParams.page = page;
    this.private.searchParams.limit = limit;
    this.onSearch(this.private.searchParams);
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    this.private.searchParams.page = page;
    this.private.searchParams.limit = limit;
    this.onSearch(this.private.searchParams);
  }

  // 模板下载
  onDownload = () => {
    this.props.dispatch({
      type: 'expenseBudget/downloadTemplate',
      payload: {
        onSuccessCallback: () => message.success('下载模板成功'),
        onFailureCallback: () => message.error('下载模板失败'),
      },
    });
  }

  // 上传成功的回调
  onUploadSuccess = (key) => {
    this.props.dispatch({
      type: 'expenseBudget/uploadExpenseBudget',
      payload: {
        file: key,
        onSuccessCallback: () => message.success('上传费用预算成功'),
        onFailureCallback: () => message.error('上传费用预算失败'),
      },
    });
  }

  // 上传失败的回调
  onUploadFailure = (res) => {
    message.error(res.zh_message);
  }

  // 渲染搜索
  renderSearch = () => {
    const { onSearch } = this;
    return (
      <Search
        onSearch={onSearch}
      />
    );
  }

  // 渲染内容列表
  renderContent = () => {
    const { page } = this.private.searchParams;
    const { expenseBudgetData, enumeratedValue = {} } = this.props;
    const { industry: industryEn = [] } = enumeratedValue;
    // 数据为空，不渲染
    if (Object.keys(expenseBudgetData).length === 0) return null;

    const { data, meta } = expenseBudgetData;
    // tabel列表
    const columns = [{
      title: '所属场景',
      dataIndex: 'industry_code',
      key: 'industry_code',
      render: (text) => {
        if (!text) return '--';
        const currentEn = industryEn.find(en => en.value === text) || {};
        const { name: industry = undefined } = currentEn;
        return industry || '--';
      },
    }, {
      title: '平台',
      dataIndex: 'platform_name',
      key: 'platform_name',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '供应商',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '城市',
      dataIndex: 'city_name',
      key: 'city_name',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '商圈',
      dataIndex: 'biz_district_name',
      key: 'biz_district_name',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '科目编码',
      dataIndex: 'cost_accounting_code',
      key: 'cost_accounting_code',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '科目名称',
      dataIndex: 'cost_accounting_name',
      key: 'cost_accounting_name',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '预算',
      dataIndex: 'budget_money',
      key: 'budget_money',
      render: (text) => {
        return text;
      },
    }, {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '预算周期',
      dataIndex: 'budget_time',
      key: 'budget_time',
      render: text => text || '--',
    }];

    // 分页配置
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      defaultPageSize: 30, // 默认下拉页数
      onShowSizeChange: this.onShowSizeChange, // 展示每页数据
      total: meta.count,
      showTotal: total => `总共${total}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: this.onChangePage,  // 切换分页
    };

    // 上传与下载
    let operations = '';
    // 上传附件的权限
    if (Operate.canOperateExpenseBudgetDownTemplate()) {
      operations = (
        <div>
          <span className={style['app-comp-expense-budget-operation-date']}>模板更新时间：2019-07-16</span>
          <Popconfirm
            placement="top"
            title="是否下载模板?"
            okText="确认"
            onConfirm={() => { this.onDownload(); }}
            cancelText="取消"
          >
            <Button type="primary" className={style['app-comp-expense-budget-operation-download']}>下载模板</Button>
          </Popconfirm>
          {
            Operate.canOperateExpenseBudgetUpload()
              ?
                <CoreUploadAmazon
                  domain="cost"
                  namespace={this.private.namespace}
                  onSuccess={this.onUploadSuccess}
                  onFailure={this.onUploadFailure}
                />
              : null
          }
        </div>
      );
    }

    if (page) {
      pagination.current = page; // 当前页数
    }

    return (
      <CoreContent title="费用预算列表" titleExt={operations}>
        {/* 渲染的内容 */}
        <Table
          columns={columns}
          pagination={pagination}
          rowKey={(record, index) => { return index; }}
          dataSource={data}
          bordered
        />
      </CoreContent>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染查询组件 */}
        {this.renderSearch()}

        {/* 渲染内容列表 */}
        {this.renderContent()}
      </div>
    );
  }
}

function mapStateToProps({ expenseBudget: { expenseBudgetData }, applicationCommon: { enumeratedValue } }) {
  return { expenseBudgetData, enumeratedValue };
}
export default connect(mapStateToProps)(Budget);
