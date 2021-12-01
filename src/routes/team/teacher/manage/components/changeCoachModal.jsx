/**
 * 私教团队管理 - 编辑页 - 变更私教 组件
 */
import _ from 'lodash';
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import { Form, Modal, Select, Alert } from 'antd';

import { CoreForm } from '../../../../../components/core';

import Styles from './style.less';

const { Option } = Select;

const ChangeCoachModal = ({
  departmentData,       // 私教部门信息
  dispatch,
  ownerId,            // 业主id
  departmentId,         // 原部门id
  relationLogId,      //  操作的信息id
  onOkCallback,       // 点击确定的回调函数
  onCancelCallback,   // 点击取消的回调函数
}) => {
  const [form] = Form.useForm();
  const [coachDetail, setCoachDetail] = useState({});
  // 清除数据
  useEffect(() => {
    return () => {
      dispatch({
        type: 'teamTeacher/resetTeamMonitoringdePartmentList',
      });
    };
  }, [dispatch]);
  //
  const onHandleChange = (value) => {
    if (!value) {
      form.setFieldsValue({
        name: undefined,
      });
      return setCoachDetail({});
    }
    const result = departmentData.find(item => item._id === value);
    form.setFieldsValue({
      name: value,
    });
    setCoachDetail(result);
  };

  // 搜索私教部门
  const onHandleSearch = _.debounce((value) => {
      // 如果搜索值是空，就不能搜索
    if (!value.trim()) {
      return;
    }
    dispatch({
      type: 'teamTeacher/fetachTeamMonitoringdePartmentList',
      payload: { name: value },
    });
  }, 800);

  // 确定
  const onOK = () => {
    form.validateFields().then(() => {
      dispatch({
        type: 'modelCoachDepartment/changeOwner',
        payload: {
          departmentId,
          newDepartmentId: coachDetail._id,
          ownerId,
          relationLogId,
          effectDate: moment().format('YYYYMMDD'),
          onSuccessCallback: onOkCallback,
        },
      });
    });
  };
  // 取消
  const onCancel = () => {
    if (onCancelCallback) {
      onCancelCallback();
    }
  };
   // 渲染表单
  const renderFrom = () => {
    const formLayoutC3 = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
    const formItems = [
      <Form.Item
        label="私教部门名称"
        name="name"
        rules={[{ required: true, message: '请输入' }]}
        {...formLayoutC3}
      >
        <Select
          showSearch
          placeholder="请输入私教部门名称搜索"
          showArrow={false}
          onChange={onHandleChange}
          onSearch={onHandleSearch}
          style={{ width: 240 }}
          filterOption={false}
          allowClear
        >
          {
            departmentData.map((item) => {
              return <Option key={item._id} value={item._id}>{`${item.name}(${item.code})`}</Option>;
            })
          }
        </Select>
      </Form.Item >,
      <Form.Item
        label="私教部门编号"
        {...formLayoutC3}
      >
        {dot.get(coachDetail, 'code', '--')}
      </Form.Item >,
      <Form.Item
        label="私教部门负责人"
        {...formLayoutC3}
      >
        {dot.get(coachDetail, 'administrator_info.name', '--')}
      </Form.Item >,
    ];
    return (
      <CoreForm items={formItems} cols={1} />
    );
  };
  return (
    <Modal
      title="更换私教管理"
      visible
      onOk={onOK}
      onCancel={onCancel}
      okText="确定"
      cancelText="取消"
    >
      <span className={Styles['app-comp-team-teacher-modal-tips']}>
        <Alert
          message="提醒：成功更换私教团队后，该业主团队产生的费用会归集到变更后的私教团队"
          type="warning"
          showIcon
        />
      </span>
      <Form form={form} layout="horizontal">
        {/* 渲染表单 */}
        {renderFrom()}
      </Form>
    </Modal>
  );
};
const mapStateToProps = ({ teamTeacher: { partmentData: departmentData } }) => {
  return { departmentData };
};

export default connect(mapStateToProps)(ChangeCoachModal);
