/**
 * 组织架构 - 操作日志 Organization/OperationLog
 * */
import dot from 'dot-prop';
import { connect } from 'dva';
import moment from 'moment';
import React, { Component } from 'react';
import { Table, Popover } from 'antd';

import { CoreContent } from '../../../components/core';
import Search from './search';


class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchParams: { page: 1, limit: 30, date: [moment().subtract('days', 6), moment()] },
    };
  }

  componentDidMount() {
    // 调用接口
    this.onInterface();
    this.props.dispatch({ type: 'organizationOperationLog/fetchOperationObject', payload: {} });
  }

  // 清除数据
  componentWillUnmount() {
    this.props.dispatch({ type: 'organizationOperationLog/reduceOperationLogList', payload: {} });
    this.props.dispatch({ type: 'organizationOperationLog/reduceOperationObject', payload: {} });
  }

  // 接口
  onInterface() {
    this.props.dispatch({ type: 'organizationOperationLog/fetchOperationLogList', payload: this.state.searchParams });
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    const { searchParams } = this.state;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
  }

  // 修改分页
  onChangePage = (page, limit) => {
    const { searchParams } = this.state;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
  }

  // 查询
  onSearch = (params) => {
    const payload = {
      ...params,
    };
    this.setState({
      searchParams: payload,
    }, () => {
      this.onInterface();
    });
  }

  // 渲染表格
  renderTables = () => {
    const { operationObject } = this.props;
    // 操作对象
    const domains = dot.get(operationObject, 'domains', {});
    // 操作类型
    const events = dot.get(operationObject, 'events', {});
    const columns = [
      {
        title: '时间',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 150,
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm') : '--';
        },
      },
      {
        title: '操作者',
        dataIndex: ['operator_info', 'name'],
        key: 'operator_info.name',
        width: 100,
        render: text => text || '--',
      },
      {
        title: '手机号',
        dataIndex: ['operator_info', 'phone'],
        key: 'operator_info.phone',
        width: 150,
        render: text => text || '--',
      },
      {
        title: '操作对象',
        dataIndex: 'domain',
        key: 'domain',
        width: 150,
        render: (text) => {
          return text ? domains[text] : '--';
        },
      },
      {
        title: '操作类型',
        dataIndex: 'event',
        key: 'event',
        width: 100,
        render: (text) => {
          return text ? events[text] : '--';
        },
      },
      {
        title: '详细数据',
        dataIndex: 'description',
        key: 'description',
        render: (text) => {
          if (!text || text === '') {
            return '--';
          }
          const textArr = text.split('.');
          if (textArr.length <= 2) {
            return textArr.map(v => (<div>
              {v}{v ? '。' : null}
            </div>));
          }
          // 如果数据长度大于14就气泡展示
          return (
            <Popover
              content={
                <div style={{ maxWidth: 400 }}>
                  {textArr.map(v => (<div
                    style={{ textIndent: '2em' }}
                  >
                    {v}{v ? '。' : null}
                  </div>))}
                </div>
            } title="详细数据" trigger="hover"
            >
              <div>{textArr.slice(0, 2).map((v, i) => (<div>
                {v}{v && i !== 1 ? '。' : null} {i === 1 ? '...' : null}
              </div>))}</div>
            </Popover>
          );
        },
      },
    ];
    const dataSource = dot.get(this.props, 'operationLogList', {});

    // 分页
    const pagination = {
      // 每次点击查询, 重置页码为1
      current: this.state.searchParams.page,
      pageSize: this.state.searchParams.limit,          // 默认数据条数
      onChange: this.onChangePage,  // 切换分页
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,        // 显示分页
      onShowSizeChange: this.onShowSizeChange,              // 展示每页数据数
      pageSizeOptions: ['10', '20', '30', '40'],  // 修改页码默认值
      showTotal: total => `总共${total}条`,                  // 数据展示总条数
      total: dot.get(dataSource, '_meta.result_count', 0),  // 数据总条数
    };

    return (
      <CoreContent title="操作日志列表">
        <Table rowKey={(record, index) => { return index; }} pagination={pagination} columns={columns} dataSource={dataSource.data} bordered scroll={{ y: 500 }} />
      </CoreContent>
    );
  }


  render() {
    return (
      <div>
        {/* 查询 */}
        <Search onSearch={this.onSearch} date={this.state.searchParams.date} />

        {/* 渲染表格 */}
        {this.renderTables()}
      </div>
    );
  }
}

const mapStateToProps = ({ organizationOperationLog: { operationLogList, operationObject } }) => {
  return { operationLogList, operationObject };
};

export default connect(mapStateToProps)(Index);
