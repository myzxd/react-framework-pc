/**
 * 服务费结算 - 基础设置 - 结算指标设置 - 模版组件
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import dot from 'dot-prop';
import { Table } from 'antd';

import styles from './style/index.less';

class IndexTemplate extends Component {
  static propTypes = {
    salarySpecifications: PropTypes.object,
    onSearch: PropTypes.func,
  };

  static defaultProps = {
    salarySpecifications: {},
    onSearch: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {};
    // 默认参数
    this.private = {
      searchParams: {
        page: 1,
        limit: 30,
      },
    };
  }

  // 修改分页
  onChangePage = (page, limit) => {
    const { searchParams } = this.private;
    const { onSearch } = this.props;
    searchParams.page = page;
    searchParams.limit = limit;
    if (onSearch) {
      onSearch(searchParams);
    }
  }
  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    const { searchParams } = this.private;
    const { onSearch } = this.props;
    searchParams.page = page;
    searchParams.limit = limit;
    if (onSearch) {
      onSearch(searchParams);
    }
  }
  render() {
    const { salarySpecifications = {} } = this.props;
    const data = dot.get(salarySpecifications, 'data', []);
    const count = dot.get(salarySpecifications, 'meta.count', 0);

    const columns = [{
      title: '指标名称',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    }, {
      title: '单位',
      dataIndex: 'unitText',
      key: 'unitText',
      width: '10%',
    }, {
      title: '指标定义',
      dataIndex: 'definition',
      key: 'definition',
      width: '70%',
    }];
    // 分页
    const pagination = {
      defaultPageSize: 30,          // 默认数据条数
      onChange: this.onChangePage,  // 切换分页
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,        // 显示分页
      onShowSizeChange: this.onShowSizeChange,              // 展示每页数据数
      total: count,                                         // 数据总条数
      showTotal: total => `总共${total}条`,                  // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
    };
    return (
      <Table
        rowKey={(record, index) => { return index; }}
        className={styles['app-comp-finance-config-table-margin']}
        dataSource={data}
        pagination={pagination}
        columns={columns}
        bordered
      />
    );
  }
}
export default IndexTemplate;
