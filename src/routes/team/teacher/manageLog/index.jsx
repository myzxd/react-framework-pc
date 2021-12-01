/**
 * 私教管理记录
 **/
import dot from 'dot-prop';
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Table, message } from 'antd';
import { CoreContent } from '../../../../components/core';
import Search from './search';
import ChangeCoachModal from '../manage/components/changeCoachModal';

import { utils, authorize } from '../../../../application';

import Modules from '../../../../application/define/modules';

import Operate from '../../../../application/define/operate';

// 判断是否有业主管理编辑页面跳转的权限
const checkAuthor = authorize.modules().some(item => item.id === Modules.ModuleTeamManagerUpdate.id);

const ManageLog = ({ dispatch, manageLogList = {} }) => {
  const { data: dataSource = [] } = manageLogList;
  const [searchParams, setSearchParams] = useState({});
  const [displayChangeModal, setDisplayChangeModal] = useState(false);
  const [ownerData, setOwnerData] = useState({});
  const [meta, setMeta] = useState({ page: 1, limit: 30 });
  useEffect(() => {
    dispatch({
      type: 'teamTeacher/fetchTeamTeacherManageLog',
      payload: { meta, ...searchParams },
    });
    return () => dispatch({
      type: 'teamTeacher/resetTeamTeacherManageLog',
    });
  }, [dispatch, searchParams, meta]);

  // 修改分页
  const onChangePage = (page, limit) => {
    setMeta({ page, limit });
  };

  // 改变每页展示条数
  const onShowSizeChange = (page, limit) => {
    setMeta({ page, limit });
  };

  // 搜索
  const onSearch = (params) => {
    // 重置
    if (!params) {
      setSearchParams({});
      setMeta({ page: 1, limit: 30 });
      return false;
    }
    const { phone, idCard } = params;
    if (phone && phone.trim() && !utils.isProperPhoneNumber(phone)) {
      return message.error('输出的手机号格式有误');
    }
    if (idCard && idCard.trim() && !utils.isProperIdCardNumber(idCard)) {
      return message.error('输出的身份证号格式有误');
    }
    const payload = {
      meta,
      ...params,
    };
    setSearchParams(payload);
  };

  // 点击变更
  const onChangeModalOpen = (data) => {
    setOwnerData({
      department_id: dot.get(data, 'department_info._id', undefined),
      owner_id: dot.get(data, 'owner_info._id', undefined),
      _id: data._id,
    });
    setDisplayChangeModal(true);
  };
  // 变更弹窗成功的回调
  const onOkCallback = () => {
    // 关闭弹窗
    onCancelCallback();
    // 刷新资产隶属列表
    onSearch();
  };
  // 变更弹窗取消的回调
  const onCancelCallback = () => {
    setOwnerData({});
    setDisplayChangeModal(false);
  };

  // 渲染搜索
  const renderSearch = () => {
    return (
      <Search onSearch={onSearch} />
    );
  };

  // 列表
  const renderTable = () => {
    const columns = [
      {
        title: '业主姓名',
        key: 'ownerName',
        dataIndex: 'owner_info',
        render: (text, rowData) => {
          if (checkAuthor && rowData.owner_id) {
            return (<a
              href={`/#/Team/Manager/Update?id=${rowData.owner_id}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {dot.get(text, 'staff_info.name', '--')}
            </a>);
          }
          return dot.get(text, 'staff_info.name', '--');
        },
      },
      {
        title: '业主团队ID',
        key: 'teamId',
        dataIndex: 'owner_id',
        render: text => text || '--',
      },
      {
        title: '业主身份证号',
        key: 'idCard',
        dataIndex: 'owner_info',
        render: text => dot.get(text, 'staff_info.identity_card_id', '--'),
      },
      {
        title: '业主手机号',
        key: 'phone',
        dataIndex: 'owner_info',
        render: text => dot.get(text, 'staff_info.phone', '--'),
      },
      {
        title: '平台',
        dataIndex: 'owner_info',
        key: 'owner_info.platform_names',
        render: text => (text
          && text.platform_names
          && text.platform_names.length > 0
          ? text.platform_names.toString() : '--'),
      },
      {
        title: '供应商',
        dataIndex: 'owner_info',
        key: 'owner_info.supplier_names',
        render: text => (text
          && text.supplier_names
          && text.supplier_names.length > 0
          ? text.supplier_names.toString() : '--'),
      },
      {
        title: '私教部门编号',
        dataIndex: 'department_info',
        render: text => dot.get(text, 'code', '--'),
      },
      {
        title: '私教部门名称',
        dataIndex: 'department_info',
        render: text => dot.get(text, 'name', '--'),
      },
      {
        title: '操作',
        render: (text, record) => {
          if (Operate.canOperateTeamTeacherManageChange()) {
            return <a onClick={() => { onChangeModalOpen(record); }}>更换私教管理</a>;
          }
          return null;
        },
      },
    ];
    // 分页
    const pagination = {
      current: meta.page,
      pageSize: meta.limit,                     // 默认数据条数
      onChange: onChangePage,                   // 切换分页
      showQuickJumper: true,                    // 显示快速跳转
      showSizeChanger: true,                    // 显示分页
      onShowSizeChange,  // 展示每页数据数
      showTotal: total => `总共${total}条`,      // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(manageLogList, '_meta.result_count', 0), // 数据总条数
    };
    return (
      <CoreContent>
        <Table
          pagination={pagination}
          columns={columns}
          rowKey={(re, key) => re._id || key}
          dataSource={dataSource}
        />
      </CoreContent>
    );
  };
  const {
      department_id: departmentId,
      owner_id: ownerId,
      _id: relationLogId,
  } = ownerData;
  const params = {
    departmentId,
    ownerId,
    relationLogId,
    onOkCallback,
    onCancelCallback,
  };
  return (
    <div>
      {/* 渲染搜索 */}
      {renderSearch()}

      {/* 渲染列表 */}
      {renderTable()}

      {/* 渲染变更私教管理弹窗 */}
      { displayChangeModal && <ChangeCoachModal {...params} />}
    </div>
  );
};

const mapStateToProps = ({ teamTeacher: { manageLogList } }) => ({ manageLogList });


export default connect(mapStateToProps)(ManageLog);
