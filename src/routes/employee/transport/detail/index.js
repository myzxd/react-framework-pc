/**
 * 工号管理, 运力工号记录, 详情页面
 * 未使用
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Table } from 'antd';

import { CoreContent } from '../../../../components/core';

import Search from './search';
import style from './style.css';

class Index extends Component {
  constructor(props) {
    super(props);
    const { id, supplierId, supplierName, platformId, platformName, cityId, cityName } = props.location.query;
    const record = {
      recordId: id,
      supplierId,
      supplierName,
      platformId,
      platformName,
      cityId,
      cityName,
    };
    this.state = {
      record, // 数据记录
      dataSource: dot.get(props, 'employeeTransport.transportRecords', {}),               // 列表数据
    };
    this.private = {
      searchParams: {
        recordId: id,
      },
    };
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: dot.get(nextProps, 'employeeTransport.transportRecords', {}),    // 列表数据
    });
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
  }

  // 修改分页
  onChangePage = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
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
    this.props.dispatch({ type: 'employeeTransport/fetchTransportRecords', payload: this.private.searchParams });
  }

  // 渲染搜索功能
  renderSearch = () => {
    const { record } = this.state;
    return (
      <Search onSearch={this.onSearch} record={record} />
    );
  };

  // 渲染列表
  renderContent = () => {
    const { dataSource } = this.state;
    const { page = 1 } = this.private.searchParams;

    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '平台',
      dataIndex: 'platform_name',
      key: 'platform_name',
    }, {
      title: '城市',
      dataIndex: 'city_name',
      key: 'city_name',
    },
    {
      title: '商圈',
      dataIndex: 'biz_district_name',
      key: 'biz_district_name',
    },
    {
      title: '开始时间',
      dataIndex: 'start_date',
      key: 'start_date',
    }, {
      title: '结束时间',
      dataIndex: 'end_date',
      key: 'end_date',
    }];

    // 分页
    const pagination = {
      // 每次点击查询, 重置页码为1
      current: page,
      defaultPageSize: 30,          // 默认数据条数
      onChange: this.onChangePage,  // 切换分页
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,        // 显示分页
      onShowSizeChange: this.onShowSizeChange,              // 展示每页数据数
      showTotal: total => `总共${total}条`,                  // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(dataSource, 'meta.result_count', 0),  // 数据总条数
    };

    return (
      <CoreContent className={style['app-comp-employee-transport-detail']} title="列表">
        <Table rowKey={(record, index) => { return index; }} pagination={pagination} columns={columns} dataSource={dataSource.result} bordered />
      </CoreContent>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染搜索 */}
        { this.renderSearch() }

        {/* 渲染内容列表 */}
        { this.renderContent() }
      </div>);
  }
}

const mapStateToProps = ({ employeeTransport }) => {
  return { employeeTransport };
};

export default connect(mapStateToProps)(Index);
