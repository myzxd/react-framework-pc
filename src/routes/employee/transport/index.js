/**
 * 工号管理列表
 * 未使用
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Link } from 'dva/router';
import { Table, Popconfirm, Tooltip } from 'antd';

import { TransportState, TransportType } from '../../../application/define';
import { CoreContent } from '../../../components/core';
import Operate from '../../../application/define/operate';

import Search from './search';
import style from './style.css';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: dot.get(props, 'employeeTransport.transportData', {}),       // 列表数据
    };
    this.private = {
      searchParams: {},   // 搜索的参数
    };
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: dot.get(nextProps, 'employeeTransport.transportData', {}),
    });
  }

  // 跳转到详情页面
  onDirectToDetail = (recordId, record) => {
    const params = {
      id: recordId,
      supplierId: dot.get(record, 'supplier_list.0._id'),
      supplierName: dot.get(record, 'supplier_list.0.name'),
      platformId: dot.get(record, 'platform_list.0.platform_code'),
      platformName: dot.get(record, 'platform_list.0.platform_name'),
      cityId: dot.get(record, 'city_list.0.city_spelling'),
      cityName: dot.get(record, 'city_list.0.city_name_joint'),
    };
    return params;
  }

  // 跳转到编辑页面
  onDirectToUpdate = (recordId, record) => {
    const params = {
      id: recordId,
      supplierId: dot.get(record, 'supplier_list.0._id'),
      supplierName: dot.get(record, 'supplier_list.0.name'),
      platformId: dot.get(record, 'platform_list.0.platform_code'),
      platformName: dot.get(record, 'platform_list.0.platform_name'),
      cityId: dot.get(record, 'city_list.0.city_spelling'),
      cityName: dot.get(record, 'city_list.0.city_name_joint'),
    };
    return params;
  }

  // 启用 或 停用
  onUpdate = (id) => {
    this.props.dispatch({ type: 'employeeTransport/updateTransportKnight', payload: { id, onSuccessCallback: this.onSuccessCallback } });
  }

  // 更新数据成功后的回调函数
  onSuccessCallback = () => {
    // 更新数据
    this.props.dispatch({ type: 'employeeTransport/fetchTransportData', payload: this.private.searchParams });
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
    this.props.dispatch({ type: 'employeeTransport/fetchTransportData', payload: this.private.searchParams });
  }

  // 渲染搜索功能
  renderSearch = () => {
    return (
      <Search onSearch={this.onSearch} />
    );
  };

  // 渲染列表
  renderContent = () => {
    const { dataSource } = this.state;
    const { page = 1 } = this.private.searchParams;

    const columns = [{
      title: '姓名',
      width: 100,
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '手机号',
      width: 100,
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '供应商',
      width: 100,
      dataIndex: 'supplier_list',
      key: 'supplier_list',
      render: (text) => {
        // 判断数据是否存在
        if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
          return '';
        }
        // 只有一行数据数据则直接返回
        if (text.length === 1) {
          return dot.get(text, '0.name');
        }
        // 默认使用弹窗显示数据
        return (
          <Tooltip title={text.map(item => item.name).join(' , ')}>
            <span>{dot.get(text, '0.name')} 等{text.length}条</span>
          </Tooltip>
        );
      },
    }, {
      title: '平台',
      width: 100,
      dataIndex: 'platform_list',
      key: 'platform_list',
      render: (text) => {
        // 判断数据是否存在
        if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
          return '';
        }
        return text.map(item => item.platform_name).join(' , ');
      },
    }, {
      title: '城市',
      width: 100,
      dataIndex: 'city_list',
      key: 'city_list',
      render: (text) => {
        // 判断数据是否存在
        if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
          return '';
        }
        // 只有一行数据数据则直接返回
        if (text.length === 1) {
          return dot.get(text, '0.city_name_joint');
        }
        // 默认使用弹窗显示数据
        return (
          <Tooltip title={text.map(item => item.city_name_joint).join(' , ')}>
            <span>{dot.get(text, '0.city_name_joint')} 等{text.length}条</span>
          </Tooltip>
        );
      },
    },
    {
      title: '商圈',
      width: 100,
      dataIndex: 'biz_district_list',
      key: 'biz_district_list',
      render: (text) => {
        // 判断数据是否存在
        if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
          return '';
        }
        // 只有一行数据数据则直接返回
        if (text.length === 1) {
          return dot.get(text, '0.biz_district_name');
        }
        // 默认使用弹窗显示数据
        return (
          <Tooltip title={text.map(item => item.biz_district_name).join(' , ')}>
            <span>{dot.get(text, '0.biz_district_name')} 等{text.length}条</span>
          </Tooltip>
        );
      },
    },
    {
      title: '职位',
      width: 100,
      dataIndex: 'position_name',
      key: 'position_name',
    },
    {
      title: '运力状态',
      width: 100,
      dataIndex: 'transport_state',
      key: 'transport_state',
      render: text => TransportState.description(text),
    }, {
      title: '工号种类',
      width: 100,
      dataIndex: 'transport_type',
      key: 'transport_type',
      render: text => TransportType.description(text),
    }, {
      title: '操作',
      width: 100,
      dataIndex: 'operate',
      key: 'operate',
      render: (text, record) => {
        // 运力工号
        if (record.transport_type === TransportType.transport) {
          return (
            <div>
              <Link className={style['app-comp-employee-transport-operate-detail']} to={{ pathname: '/Employee/Transport/Detail', query: this.onDirectToDetail(record._id, record) }}>查看详情</Link>
              {/* 判断是否有启用运力工号的权限 */}
              {
                Operate.canOperateEmployeeDeliveryStartButton() ?
                  <div>
                    <Link className={style['app-comp-employee-transport-operate-update']} to={{ pathname: '/Employee/Transport/Update', query: this.onDirectToUpdate(record._id, record) }}>编辑</Link>
                    <Popconfirm title="是否停用该运力工号?" onConfirm={() => this.onUpdate(record._id)} okText="确认" cancelText="取消">
                      <a>停用</a>
                    </Popconfirm>
                  </div> : ''
              }
            </div>
          );
        }

        // 正常工号
        if (record.transport_type === TransportType.normal && Operate.canOperateEmployeeDeliveryStartButton()) {
          return (
            <Popconfirm title="是否启用该骑士成为运力工号?" onConfirm={() => this.onUpdate(record._id)} okText="确认" cancelText="取消">
              <a>启用</a>
            </Popconfirm>
          );
        }

        return <div>{null}</div>;
      },
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
      total: dot.get(dataSource, '_meta.result_count', 0),  // 数据总条数
    };

    return (
      <CoreContent className={style['app-comp-employee-transport']} title="列表">
        <Table rowKey={(record, index) => { return index; }} pagination={pagination} columns={columns} dataSource={dataSource.data} bordered scroll={{ y: 500 }} />
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
      </div>
    );
  }
}

const mapStateToProps = ({ employeeTransport }) => {
  return { employeeTransport };
};

export default connect(mapStateToProps)(Index);
