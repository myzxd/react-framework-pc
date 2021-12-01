/**
 * 组织架构 - 部门管理 - 岗位编制 - 删除岗位（button）
 */
import { connect } from 'dva';
import React, { useState } from 'react';
import {
  message,
  Popconfirm,
} from 'antd';
import { utils } from '../../../../../../application';

import CheckResultModal from '../../../components/checkResultModal';

const DeletePostBtn = ({
  dispatch,
  breakDepartmentList,
  postInfo = {}, // 岗位详情
  departmentDetail = {}, // 部门详情
}) => {
  const {
    _id: departmentId, // 部门id
  } = departmentDetail;

  // 错误提示校验modal visible
  const [messageVisible, setMessageVisible] = useState(false);
  // 错误提示
  const [checkMessage, setCheckMessage] = useState([]);

  // 删除前校验
  const onCheckDelete = async () => {
   // 操作前校验接口
    const checkRes = await dispatch({
      type: 'department/checkDepartmentUpdate',
      payload: {
        departmentId,
        organizationSubType: 70,
        jobId: utils.dotOptimal(postInfo, 'job_id', undefined),
      },
    });

    // 接口失败处理
    if (checkRes && checkRes.zh_message) {
      message.error(checkRes.zh_message);
      return;
    }

    // 接口成功处理
    if (checkRes && checkRes.ok === false) {
      // 设置check message
      setCheckMessage(checkRes.hint_list);
      // 设置错误提示modal visible
      setMessageVisible(true);
    }

    // 无校验，直接调用删除接口
    if (checkRes && checkRes.ok) {
      onDelete();
    }
  };

  // 删除岗位
  const onDelete = async () => {
    // 占编人数
    const count = utils.dotOptimal(postInfo, 'organization_num', 0);
    // 岗位id
    const relaId = utils.dotOptimal(postInfo, '_id', undefined);

    // 岗位下有成员时，不能删除
    if (count > 0) {
      message.error('请先移出该岗位下成员，再执行删除操作');
      return false;
    }

    const res = await dispatch({
      type: 'organizationStaffs/onDeletePost',
      payload: { relaId },
    });

    if (res && res.zh_message) {
      message.error(res.zh_message);
      return false;
    }

    if (res && res.ok) {
      message.success('请求成功');
      breakDepartmentList && breakDepartmentList();
      return true;
    }
    return true;
  };

  // 错误提示modal
  const renderMessageModal = () => {
    if (!messageVisible) return;
    return (
      <CheckResultModal
        visible={messageVisible}
        onChangeCheckResult={val => setMessageVisible(val)}
        checkMessage={checkMessage}
        messageTitle={`调整类型：组织架构-删除岗位(${utils.dotOptimal(postInfo, 'job_info.name', '--')})`}
        onSubmitDepartment={onDelete}
      />
    );
  };

  return (
    <React.Fragment>
      <Popconfirm
        title="您是否确认删除该岗位"
        okText="确认"
        cancelText="取消"
        onConfirm={onCheckDelete}
      >
        <a>删除</a>
      </Popconfirm>

      {/* 错误校验 */}
      {renderMessageModal()}
    </React.Fragment>
  );
};

export default connect()(DeletePostBtn);
