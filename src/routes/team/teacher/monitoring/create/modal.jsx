/**
 * 无私教业主团队监控 - 创建
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Form, Modal, Select } from 'antd';
import React, { useState, useEffect } from 'react';

import { CoreForm } from '../../../../../components/core';

const { Option } = Select;

function CreateModal(props) {
  const { visibles, onHideModal, partmentData, clearData, monitoringInfo, getMonitoringData, cerateMonitoring, getMonitoringPartment } = props;
  const [form] = Form.useForm();
  const [ownerDetail, setOwnerDetail] = useState({});
  useEffect(() => {
    return () => clearData();
  }, [clearData]);

  // 隐藏弹窗
  const onCancel = () => {
    if (onHideModal) {
      onHideModal();
    }
    // 重置数据
    onReset();
  };

  // 重置数据
  const onReset = () => {
    // 重置表单
    form.resetFields();
    setOwnerDetail({});
    clearData();
  };

    // 提交
  const onSubmit = () => {
    form.validateFields().then((values) => {
      const params = {
        ...values,
        id: dot.get(monitoringInfo, '_id', undefined),
        onSuccessCallback: () => {
          // 更新列表
          getMonitoringData({ meta: props.meta, ...props.searchParams });
          onCancel();
        },
      };
      cerateMonitoring(params);
    });
  };

  // 选择业主名字
  const onHandleChange = (value) => {
    if (!value) {
      form.setFieldsValue({
        name: undefined,
      });
      return setOwnerDetail({});
    }
    const result = partmentData.find(item => item._id === value);
    form.setFieldsValue({
      name: value,
    });
    setOwnerDetail(result);
  };

  // 搜索业主名字
  const onHandleSearch = _.debounce((value) => {
    // 如果搜索值是空，就不能搜索
    if (!value.trim()) {
      return;
    }
    getMonitoringPartment({ name: value });
  }, 800);


  // 渲染表单
  const renderFrom = function () {
    const formLayoutC3 = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
    const formItems = [
      <Form.Item
        label="私教部门名称"
        name="name"
        rules={[{ required: true, message: '请选择私教部门名称' }]}
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
            partmentData.map((item) => {
              // 有业主信息才显示
              return <Option key={item._id} value={item._id}>{`${item.name}(${item.code})`}</Option>;
            })
          }
        </Select>
      </Form.Item >,
      <Form.Item
        label="私教部门编号"
        {...formLayoutC3}
      >
        {dot.get(ownerDetail, 'code', '--')}
      </Form.Item >,
      <Form.Item
        label="私教部门负责人"
        {...formLayoutC3}
      >
        {dot.get(ownerDetail, 'administrator_info.name', '--')}
      </Form.Item >,
      <Form.Item
        label="生效日期"
        {...formLayoutC3}
      >
        {'立即生效'}
      </Form.Item >,
    ];
    return (
      <CoreForm items={formItems} cols={1} />
    );
  };
  return (
    <Modal
      title="添加私教管理"
      visible={visibles}
      onOk={onSubmit}
      onCancel={onCancel}
      okText="确定"
      cancelText="取消"
    >
      <Form form={form} layout="horizontal">
        {/* 渲染表单 */}
        {renderFrom()}
      </Form>
    </Modal>
  );
}

const mapStateToProps = ({ teamTeacher: { partmentData } }) => {
  return { partmentData };
};

const mapDispatchToProps = dispatch => ({
  clearData: () => dispatch({
    type: 'teamTeacher/resetTeamMonitoringdePartmentList',
    payload: {},
  }),
  getMonitoringData: params => dispatch({
    type: 'teamTeacher/fetchTeamTeacherMonitoringList',
    payload: params,
  }),
  cerateMonitoring: params => dispatch({
    type: 'teamTeacher/createTeamTeacherMonitoring',
    payload: params,
  }),
  getMonitoringPartment: params => dispatch({
    type: 'teamTeacher/fetachTeamMonitoringdePartmentList',
    payload: params,
  }),
});

CreateModal.propTypes = {
  visibles: PropTypes.bool, // 是否显示弹窗
  monitoringInfo: PropTypes.object, // 监控信息
};
CreateModal.defaultProps = {
  visibles: false,
  monitoringInfo: {},
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateModal);
