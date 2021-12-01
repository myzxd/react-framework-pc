/**
 * 工号管理, 运力工号记录, 编辑页面
 * 未使用
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Table, Button, Popconfirm } from 'antd';

import { CoreContent } from '../../../../components/core';

import Search from './search';
import CreateModal from './create';
import UpdateModal from './update';
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
      disabledDate: dot.get(props, 'employeeTransport.transportRecords.date_list', []),   // 不可用的日期

      createVisible: false, // 新建弹窗
      updateVisible: false, // 编辑窗口

      editRecordId: '',     // 记录编辑id
      editTransportId: '',  // 记录运力工号id
      editTimeRange: [],    // 记录当前记录时间段
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
      disabledDate: dot.get(nextProps, 'employeeTransport.transportRecords.date_list', []),   // 不可用的日期
    });
  }

  // 显示新建弹窗
  onShowCreateModal = () => {
    this.setState({ createVisible: true });
  }

  // 隐藏新建弹窗
  onHideCreateModal = () => {
    this.setState({ createVisible: false });
  }

  // 显示编辑弹窗
  onShowUpdateModal = (editRecordId, editTransportId, start, end) => {
    this.setState({
      updateVisible: true,
      editRecordId,
      editTransportId,
      editTimeRange: [start, end],
    });
  }

  // 隐藏编辑弹窗
  onHideUpdateModal = () => {
    this.setState({
      updateVisible: false,
      editRecordId: '',
      editTransportId: '',
      editTimeRange: [],
    });
  }

  // 创建成功的回调函数
  onCreateSuccessCallback = () => {
    // 隐藏弹窗
    this.onHideCreateModal();
    // 调用搜索
    this.props.dispatch({ type: 'employeeTransport/fetchTransportRecords', payload: this.private.searchParams });
  }

  // 创建成功的回调函数
  onUpdateSuccessCallback = () => {
    // 隐藏弹窗
    this.onHideUpdateModal();
    // 调用搜索
    this.props.dispatch({ type: 'employeeTransport/fetchTransportRecords', payload: this.private.searchParams });
  }

  // 删除
  onDelete = (recordId, transportId) => {
    const params = {
      recordId,     // 运力工号
      transportId,  // 替跑工号
      onSuccessCallback: this.onUpdateSuccessCallback,
    };
    this.props.dispatch({ type: 'employeeTransport/deleteTransportRecord', payload: params });
  }

  // 返回列表页
  onDirectToTransport = () => {
    window.location.href = '/#/Employee/Transport';
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

  // 渲染新建弹窗
  renderCreateModal = () => {
    const { record, createVisible, disabledDate } = this.state;

    const props = {
      visible: createVisible,
      record,
      disabledDate,
      dispatch: this.props.dispatch,
      onCancle: this.onHideCreateModal,
      onSuccessCallback: this.onCreateSuccessCallback,
    };

    return <CreateModal {...props} />;
  }

  // 渲染编辑弹窗
  renderUpdateModal = () => {
    const { editRecordId, editTransportId, editTimeRange, disabledDate, updateVisible } = this.state;

    const props = {
      visible: updateVisible,
      editRecordId,
      editTransportId,
      editTimeRange,
      disabledDate,
      dispatch: this.props.dispatch,
      onCancle: this.onHideUpdateModal,
      onSuccessCallback: this.onUpdateSuccessCallback,
    };
    return <UpdateModal {...props} />;
  }

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
    }, {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (text, record) => (
        <div>
          <a className={style['app-comp-employee-transport-form-operate-update']} onClick={() => this.onShowUpdateModal(record._id, record.transport_staff_id, record.start_date, record.end_date)}>编辑</a>
          <Popconfirm title="是否确认删除?" onConfirm={() => this.onDelete(record._id, record.transport_staff_id)} okText="确认" cancelText="取消">
            <a>删除</a>
          </Popconfirm>
        </div>
      ),
    }];
    const ext = (
      <div>
        <Button onClick={this.onShowCreateModal} type="primary">新建</Button>
      </div>
    );

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
      <CoreContent className={style['app-comp-employee-transport-form-list']} title="列表" titleExt={ext}>
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

        {/* 渲染创建弹窗  */}
        { this.renderCreateModal() }

        {/* 渲染编辑弹窗  */}
        { this.renderUpdateModal() }

        <Button className={style['app-comp-employee-transport-form-button']} onClick={this.onDirectToTransport} type="primary">返回</Button>
      </div>);
  }
}

const mapStateToProps = ({ employeeTransport }) => {
  return { employeeTransport };
};

export default connect(mapStateToProps)(Index);
