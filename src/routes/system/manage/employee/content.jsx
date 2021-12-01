/*
 * 人员管理 - 合同归属管理 - 员工合同甲方 - content
 */
import React, { useState } from 'react';
import moment from 'moment';
import {
  Table,
  Popconfirm,
} from 'antd';

import { CoreContent } from '../../../../components/core';
import {
  ThirdCompanyState,
  AllowElectionSign,
} from '../../../../application/define';
import DetailModal from './detailModal';
import CreateModal from './createModal';
import Operate from '../../../../application/define/operate';

const Content = ({
  dispatch,
  companies = {}, // 支付账单list
  onShowSizeChange = () => {},
  onChangePage = () => {},
  getCompanies, // 获取支付账单list
}) => {
  // 详情弹窗visible
  const [detailVisible, setDetailVisible] = useState(false);

  // 当前操作合同甲方id
  const [companyId, setCompanyId] = useState(undefined);
  const { data = [], _meta: meta = {} } = companies;

  // 点击详情
  const onDetail = (id) => {
    setDetailVisible(true);
    setCompanyId(id);
  };

  // 启用
  const onEnable = (rec) => {
    dispatch({
      type: 'systemManage/enableCompany',
      payload: {
        recordId: rec._id,
        type: rec.type,
        onSuccessCallback: getCompanies,
      },
    });
  };

  // 禁用
  const onDisable = (rec) => {
    dispatch({
      type: 'systemManage/disableCompany',
      payload: {
        recordId: rec._id,
        type: rec.type,
        onSuccessCallback: getCompanies,
      },
    });
  };

  // columns
  const columns = [
    {
      title: '公司名称',
      dataIndex: 'name',
      fixed: 'left',
      width: 150,
      render: text => text || '--',
    },
    {
      title: '统一社会信用代码',
      dataIndex: 'credit_no',
      render: text => text || '--',
    },
    {
      title: '法人',
      dataIndex: 'legal_person',
      render: text => text || '--',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      render: text => text || '--',
    },
    {
      title: '地址',
      dataIndex: 'address',
      render: text => text || '--',
    },
    {
      title: '是否允许电子签约',
      dataIndex: 'is_electronic_sign',
      render: text => AllowElectionSign.description(text ? AllowElectionSign.yes : AllowElectionSign.no),
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: text => ThirdCompanyState.description(text),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      render(text) {
        return text ? moment(text).format('YYYY-MM-DD HH:mm') : '--';
      },
    },
    {
      title: '最新操作人',
      dataIndex: 'operator_info',
      render(text) {
        if (!text) {
          return '--';
        }
        return text.name || text.phone ? text.name && text.phone ? `${text.name}(${text.phone})` : text.name : '--';
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 150,
      render: (text, rec) => {
        // 详情
        const detailOption = Operate.canOperateSystemManageCompanyDetail() ?
          (
            <a
              style={{ marginRight: 5 }}
              onClick={() => onDetail(rec._id)}
            >详情</a>
          )
          : '';

        // 启用
        const enableOption = Operate.canOperateSystemManageCompanyUpdate()
          && rec.state === ThirdCompanyState.off
          ? (
            <Popconfirm
              title="确定要执行操作"
              style={{ marginRight: 5 }}
              onConfirm={() => onEnable(rec)}
            >
              <a>启用</a>
            </Popconfirm>
          ) : '';

        // 禁用
        const disabledOption = Operate.canOperateSystemManageCompanyUpdate()
          && rec.state === ThirdCompanyState.on
          ? (
            <Popconfirm
              title="确定要执行操作"
              onConfirm={() => onDisable(rec)}
            >
              <a>禁用</a>
            </Popconfirm>
          ) : '';

        return (
          <React.Fragment>
            {detailOption}
            {enableOption}
            {disabledOption}
          </React.Fragment>
        );
      },
    },
  ];

  // pagination
  const pagination = {
    current: meta.page || 1,
    defaultPageSize: 30,
    pageSize: meta.page_size || 30,
    showQuickJumper: true,
    showSizeChanger: true,
    onChange: onChangePage,
    onShowSizeChange,
    showTotal: showTotal => `总共${showTotal}条`,
    total: meta.result_count,
    pageSizeOptions: ['10', '20', '30', '40'],
  };

  // 新建
  const titleExt = Operate.canOperateSystemManageCompanyCreate() ?
    (
      <CreateModal
        dispatch={dispatch}
        getCompanies={getCompanies}
      />
    ) : '';

  // 详情弹窗
  const renderDetailModal = () => {
    if (!detailVisible) return '';
    return (
      <DetailModal
        visible={detailVisible}
        companyId={companyId}
        setVisible={setDetailVisible}
      />
    );
  };

  return (
    <CoreContent title="合同甲方列表" titleExt={titleExt}>
      <Table
        rowKey={(re, key) => re._id || key}
        columns={columns}
        dataSource={data}
        pagination={pagination}
        bordered
        scroll={{ x: 1400 }}
      />
      {renderDetailModal()}
    </CoreContent>
  );
};

export default Content;
