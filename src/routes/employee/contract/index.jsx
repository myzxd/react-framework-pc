/**
 * 合同管理-列表
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table, Button } from 'antd';
import dot from 'dot-prop';

import Search from './search';
import style from './style.css';

import { HouseholdType } from '../../../application/define';
import { CoreContent } from '../../../components/core';

// 默认分页参数
const defaultPagination = {
  page: 1,
  limit: 30,
};

// 默认搜索参数
const defaultSearchParams = {
  suppliers: [],  // 供应商
  platforms: [],  // 平台
  cities: [],     // 城市
  districts: [],  // 商圈
  name: '',       // 姓名
  phone: '',      // 手机号
  contracts: [],  // 合同归属
  platformId: '', // 第三方平台个户id
};

class Contract extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: defaultPagination, // 分页
      selectedRowKeys: [], // 选中行
    };
    this.private = {
      searchParams: defaultSearchParams,
    };
  }

  componentDidMount() {
    this.onSearch();
  }

  // 搜索回调
  onSearch = () => {
    const { page, limit } = this.state.pagination;
    this.props.dispatch({
      type: 'employeeContract/fetchEmployeeContractData',
      payload: { page, limit, ...this.private.searchParams },
    });
  }

  // 点击搜索回调
  onSearchClick = (params) => {
    // 保存搜索参数
    this.private.searchParams = params;
    this.setState(
      { pagination: { ...this.state.pagination, page: defaultPagination.page } },
      () => {
        this.onSearch();
      },
    );
  }

  // 点击重置回调
  /**
   * hack: SearchExtentions组件内部表单的参数虽然置空,
   *       但是无法在onReset的时候传给本组件, 所以直接使用默认参数调用搜索
   */
  onResetClick = () => {
    // 保存搜索参数
    this.private.searchParams = defaultSearchParams;
    this.setState(
      { pagination: defaultPagination },
      () => {
        this.onSearch();
      },
    );
  }

  // 分页改变回调
  onPaginationChange = (page, limit) => {
    this.setState(
      { pagination: { page, limit } },
      () => {
        this.onSearch();
      },
    );
  }

  // 批量导出合同点击回调
  // TODO: 批量导出合同实现
  onExportContractClick = () => {
  }

  // 批量导出合同和身份证点击回调
  // TODO: 批量导出合同和身份证实现
  onExportContractAndCardClick = () => {
  }

  // 渲染搜索
  renderSearch = () => {
    return (
      <Search
        defaultSearchParams={defaultSearchParams}
        onSearch={this.onSearchClick}
        onReset={this.onResetClick}
      />
    );
  }

  // 渲染表格
  renderTable = () => {
    const dataSource = dot.get(this.props, 'employeeContractData.data', []);
    const resultCount = dot.get(this.props, 'employeeContractData.meta.resultCount', 0);
    const { selectedRowKeys, pagination: { limit, page } } = this.state;
    const columns = [
      {
        dataIndex: 'name',
        title: '姓名',
        width: 80,
      },
      {
        dataIndex: 'phone',
        title: '手机号',
        width: 100,
      },
      {
        dataIndex: 'knightType',
        title: '个户类型',
        width: 70,
        render: knightType => HouseholdType.description(knightType),
      },
      {
        dataIndex: 'platformId',
        title: '第三方平台账户ID',
        width: 120,
      },
      {
        dataIndex: 'supplier',
        title: '供应商',
        width: 150,
      },
      {
        dataIndex: 'platform',
        title: '平台',
        width: 70,
      },
      {
        dataIndex: 'city',
        title: '城市',
        width: 100,
      },
      {
        dataIndex: 'district',
        title: '商圈',
        width: 120,
      },
      {
        dataIndex: 'contract',
        title: '合同归属',
        width: 120,
      },
      {
        key: 'opration',
        title: '操作',
        render: record => (
          <div>
            <Link
              to={{
                pathname: '/Employee/Contract/Detail',
                search: `?id=${record.id}`,
              }}
              target="_blank"
            >
              查看详情
            </Link>
            <a src="" className={style['app-comp-employee-contract-opration-download']}>下载</a>
          </div>
        ),
      },
    ];

    const pagination = {
      total: resultCount,           // 数据总数
      pageSize: limit,              // 展示条数
      current: page,                // 当前页码
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,        // 显示分页
      showTotal: total => `总共${total}条`, // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: this.onPaginationChange,
      onShowSizeChange: this.onPaginationChange,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: (keys) => {
        this.setState({ selectedRowKeys: keys });
      },
    };

    return (
      <CoreContent>
        <Button
          type="primary"
          className={style['app-comp-employee-contract-batch-contract']}
          onClick={this.onExportContractClick}
        >
          批量导出合同
        </Button>
        <Button
          type="primary"
          className={style['app-comp-employee-contract-batch-id-card']}
          onClick={this.onExportContractAndCardClick}
        >
          批量导出合同与身份证
        </Button>
        <Table
          bordered
          rowKey={record => record.id}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          rowSelection={rowSelection}
          scroll={{ x: false, y: 380 }}
        />
      </CoreContent>
    );
  }

  render() {
    return (
      <div>
        { this.renderSearch() }
        { this.renderTable() }
      </div>
    );
  }
}

function mapStateToProps({ employeeContract: { employeeContractData } }) {
  return { employeeContractData };
}

export default connect(mapStateToProps)(Contract);
