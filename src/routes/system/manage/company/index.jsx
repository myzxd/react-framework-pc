/**
 * 合同归属设置列表
 */
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import React, { useState } from 'react';
import { Button, Table, Popconfirm } from 'antd';

import Operate from '../../../../application/define/operate';
import { CoreContent } from '../../../../components/core';
import { ThirdCompanyState, AllowElectionSign, ContractAttributionType } from '../../../../application/define';

import CreateModal from './create';
import Search from './search';
import styles from './style/index.less';

function Index(props) {
  // 新建对话框的可见状态
  const [createVisible, setCreateVisible] = useState(false);
  const [searchParams, setSearchParams] = useState({
    state: `${ThirdCompanyState.on}`,
    type: ContractAttributionType.laborder,
    meta: { page: 1, limit: 30 },
  });

  // 搜索
  const onSearch = (params) => {
    // 保存搜索的参数
    const payload = Object.assign(searchParams, params);
    if (params.page && params.limit) {
      payload.meta = {
        page: params.page,
        limit: params.limit,
      };
    }
    setSearchParams(payload);
    props.dispatch({ type: 'systemManage/fetchCompanies', payload });
  };

  // 服务器请求后的回调函数
  const onOperateSuccessCallback = () => {
    // 更新数据
    props.dispatch({ type: 'systemManage/fetchCompanies', payload: searchParams });
  };

  // 启用数据
  const onEnable = (record) => {
    const params = {
      recordId: record._id,
      type: record.type,
      onSuccessCallback: onOperateSuccessCallback,
    };
    props.dispatch({ type: 'systemManage/enableCompany', payload: params });
  };

  // 禁用数据
  const onDisable = (record) => {
    const params = {
      recordId: record._id,
      type: record.type,
      onSuccessCallback: onOperateSuccessCallback,
    };
    props.dispatch({ type: 'systemManage/disableCompany', payload: params });
  };

  // 修改分页
  const onChangePage = (page, limit) => {
    const params = {
      meta: {
        page,
        limit,
      },
    };
    onSearch(params);
  };

  // 改变每页展示条数
  const onShowSizeChange = (page, limit) => {
    const params = {
      meta: {
        page,
        limit,
      },
    };
    onSearch(params);
  };

  // 显示创建对话框
  const onShowCreateModal = () => {
    setCreateVisible(true);
  };

  // 隐藏创建对话框
  const onHideCreateModal = () => {
    setCreateVisible(false);
  };

  // 服务器请求后的回调函数
  const onCreateSuccessCallback = () => {
    // 隐藏弹出框
    onHideCreateModal();
    // 更新数据
    props.dispatch({ type: 'systemManage/fetchCompanies', payload: searchParams });
  };

  // 创建
  const onCreate = (values) => {
    props.dispatch({
      type: 'systemManage/createCompany',
      payload: {
        ...values,
        type: ContractAttributionType.laborder,
        onSuccessCallback: onCreateSuccessCallback,
      },
    });
  };

   // 渲染新建按钮
  const renderModal = () => {
    return (
      <div>
        {/* 创建的弹窗 */}
        <CreateModal onSubmit={onCreate} onCancel={onHideCreateModal} visible={createVisible} />
      </div>
    );
  };

  // 渲染内容列表
  const renderContent = () => {
    const { dataSource } = props;
    const { page = 1, limit } = searchParams.meta;
    const columns = [
      {
        title: '公司名称',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        width: 150,
        render: text => text || '--',
      }, {
        title: '统一社会信用代码',
        dataIndex: 'credit_no',
        render(text) {
          return text || '--';
        },
      }, {
        title: '法人',
        dataIndex: 'legal_person',
        render(text) {
          return text || '--';
        },
      }, {
        title: '电话',
        dataIndex: 'phone',
        render(text) {
          return text || '--';
        },
      }, {
        title: '地址',
        dataIndex: 'address',
        render(text) {
          return text || '--';
        },
      }, {
        title: '是否允许电子签约',
        dataIndex: 'is_electronic_sign',
        render: text => AllowElectionSign.description(text ? AllowElectionSign.yes : AllowElectionSign.no),
      }, {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: text => ThirdCompanyState.description(text),
      }, {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render(text) {
          return text ? moment(text).format('YYYY-MM-DD HH:mm') : '--';
        },
      }, {
        title: '最新操作人',
        dataIndex: 'operator_info',
        key: 'operator_info',
        render(text) {
          if (!text) {
            return '--';
          }
          return text.name || text.phone ? text.name && text.phone ? `${text.name}(${text.phone})` : text.name : '--';
        },
      }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        width: 150,
        render: (text, record) => {
          let operationDetail;
          if (Operate.canOperateSystemManageCompanyDetail()) {
            operationDetail = <a className={styles['app-comp-system-company-btn']} rel="noopener noreferrer" target="_blank" href={`/#/System/Manage/Company/Detail?id=${record._id}`}>详情</a>;
          }
          // 判断是否有编辑权限
          if (Operate.canOperateSystemManageCompanyUpdate() === false) {
            return '';
          }

          // 如果是禁用的状态，则显示启用按钮
          if (record.state === ThirdCompanyState.off) {
            return (
              <div>
                {operationDetail}
                <a className={styles['app-comp-system-company-btn']} href={`/#/System/Manage/Company/Update?id=${record._id}`}>编辑</a>
                <Popconfirm title="确定要执行操作？" onConfirm={() => { onEnable(record); }} okText="确认" cancelText="取消">
                  <a className={styles['app-comp-system-company-btn']}>启用</a>
                </Popconfirm>
              </div>
            );
          }

          // 如果是启用的状态，则显示禁用按钮
          return (
            <div>
              {operationDetail}
              <a className={styles['app-comp-system-company-btn']} href={`/#/System/Manage/Company/Update?id=${record._id}`}>编辑</a>
              <Popconfirm title="确定要执行操作？" onConfirm={() => { onDisable(record); }} okText="确认" cancelText="取消">
                <a className={styles['app-comp-system-company-btn']}>禁用</a>
              </Popconfirm>
            </div>
          );
        },
      }];

    // 分页
    const pagination = {
      // 每次点击查询, 重置页码为1
      current: page,
      pageSize: limit,          // 默认数据条数
      onChange: onChangePage,  // 切换分页
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,        // 显示分页
      onShowSizeChange,              // 展示每页数据数
      showTotal: total => `总共${total}条`,                  // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(dataSource, '_meta.result_count', 0),  // 数据总条数
    };
    // 新增按钮
    let createBtn;

    // 设置创建权限
    if (Operate.canOperateSystemManageCompanyCreate()) {
      createBtn = <Button type="primary" onClick={onShowCreateModal}>新增</Button>;
    }

    return (
      <CoreContent title={'合同甲方列表'} titleExt={createBtn}>
        <Table rowKey={(record) => { return record._id; }} pagination={pagination} columns={columns} dataSource={dataSource.data} bordered scroll={{ x: 1400 }} />
      </CoreContent>
    );
  };

  // 渲染搜索区域
  const renderSearch = () => {
    return (
      <Search onSearch={onSearch} />
    );
  };

  return (
    <div>
      {/* 渲染搜索区域 */}
      {renderSearch()}
      {/* 渲染列表 */}
      {renderContent()}
      {/* 渲染弹窗 */}
      {renderModal()}
    </div>
  );
}

function mapStateToProps({ systemManage: { companies = [] } }) {
  return { dataSource: companies };
}
export default connect(mapStateToProps)(Index);
