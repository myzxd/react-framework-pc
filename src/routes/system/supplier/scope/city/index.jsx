/**
 * 系统管理 -- 供应商管理 -- 业务分布情况(城市)
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import dot from 'dot-prop';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Table, Popover, Button, Row } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
import { CoreContent } from '../../../../../components/core';
import { authorize } from '../../../../../application';
import Search from './search';
import styles from './style/index.less';

class Range extends Component {

  constructor(props) {
    super(props);
    this.private = {
      searchParams: { page: 1, limit: 30 },   // 搜索的参数
    };
  }

  componentDidMount() {
    const payload = {
      page: 1,
      limit: 30,
    };
    this.props.dispatch({ type: 'supplierManage/fetchCityDistribution', payload });
  }

  // 修改分页
  onChangePage = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
  }

  // 搜索
  onSearch = (params) => {
    // 保存搜索的参数
    const { searchParams } = this.private;
    this.private.searchParams = {
      ...searchParams,
      ...params,
    };
    // 调用搜索
    this.props.dispatch({ type: 'supplierManage/fetchCityDistribution', payload: this.private.searchParams });
  }

  // 渲染搜索条件
  renderSearch = () => {
    const { onSearch } = this;
    return (
      <Search onSearch={onSearch} />
    );
  }

  // 渲染内容列表
  renderContent = () => {
    const { dataSource } = this.props;
    const { page = 1, limit } = this.private.searchParams;
    const columns = [{
      title: '平台',
      dataIndex: 'platform_code',
      key: 'platform_code',
      render: (text) => {
        return authorize.platformFilter(text);
      },
    },
    {
      title: '城市',
      dataIndex: 'city_name',
      key: 'city_name',
      render: (text) => {
        if (text) {
          return text;
        }
        return '--';
      },
    },
    {
      title: '分配状态',
      dataIndex: 'allot',
      key: 'allot',
      render: (text) => {
        return text === 1 ? '未分配' : '已分配';
      },
    }, {
      title: '当前归属供应商',
      dataIndex: 'supplier_name_list',
      key: 'supplier_name_list',
      render: (data) => {
        let text = data;
        let names = [];
        if (Object.prototype.toString.call(text) === '[object String]') text = [text];
        if (text.length === 0) {
          return '--';
        }
          // 只有一个时
        if (text.length === 1) {
          names = text[0];
        }
          // 多个时
        if (text.length > 1) {
          const content = <p className={styles['app-comp-system-supplier-multiple-supplier-wrap']}>{text.join(',')}</p>;
          names = (
            <Popover placement="top" content={content} trigger="hover">
              {text[0]}等{text.length}个供应商
          </Popover>
          );
        }
        return names;
      },
    }, {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: () => {
        return '启用';
      },
    }, {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => {
        return moment(text).format('YYYY-MM-DD HH:mm');
      },
    }];

    // 分页
    const pagination = {
      // 每次点击查询, 重置页码为1
      current: page,
      pageSize: limit,          // 默认数据条数
      onChange: this.onChangePage,  // 切换分页
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,        // 显示分页
      onShowSizeChange: this.onShowSizeChange,              // 展示每页数据数
      showTotal: total => `总共${total}条`,                  // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(dataSource, '_meta.result_count', 0),  // 数据总条数
    };

    return (
      <CoreContent>
        {/* 数据 */}
        <Table rowKey={(record, index) => { return index; }} dataSource={dot.get(dataSource, 'data', [])} columns={columns} pagination={pagination} bordered scroll={{ x: 1000, y: 550 }} />
        <Row justify={'center'} type="flex" className="app-global-mgt16">
          <Button><Link to="/System/Supplier/Manage">返回</Link></Button>
        </Row>
      </CoreContent>
    );
  }

  render = () => {
    const { renderSearch, renderContent } = this;
    return (
      <div>
        {/* 渲染搜索 */}
        {renderSearch()}

        {/* 渲染内容 */}
        {renderContent()}
      </div>
    );
  }

}

function mapStateToProps({ supplierManage: { cityDistributeList = {} } }) {
  return { dataSource: cityDistributeList };
}

export default Form.create()(connect(mapStateToProps)(Range));
