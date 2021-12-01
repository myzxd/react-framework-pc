/**
 * 人员管理 - 人员档案 - 员工档案 - 办理离职（modal）
 */
import moment from 'moment';
import { connect } from 'dva';
import React from 'react';
import {
  Modal,
  Alert,
  Form,
  DatePicker,
} from 'antd';
import {
  CoreForm,
} from '../../../../../components/core';
import EmployeesSelect from '../../menu/components/employeesSelect';
import { utils } from '../../../../../application';

import styles from './style.less';

// form layout
const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 12 } };

const Resignation = ({
  visible,
  onCancel,
  dispatch,
  staffDetail,
  getStaffList,
}) => {
  const [form] = Form.useForm();

  // disabledDate
  const disabledDate = (cur) => {
    const { entry_date: entryDate } = staffDetail;
    return cur < moment(entryDate, 'YYYYMMDD') || cur > moment();
  };

  // 成功回调
  const onSuccessCallback = () => {
    getStaffList && getStaffList();
    onCancel && onCancel();
  };

  // onOk
  const onOk = async () => {
    const res = await form.validateFields();

    dispatch({
      type: 'employeeManage/employeeOperateDeparture',
      payload: {
        ...res,
        departureDate: res.departureDate.format('YYYYMMDD'),
        staffName: utils.dotOptimal(staffDetail, 'name'),
        staffId: utils.dotOptimal(staffDetail, '_id'),
        onSuccessCallback,
      },
    });
  };

  const formItems = [
    <Form.Item
      label="离职日期"
      name="departureDate"
      rules={[
        { required: true, message: '请选择' },
      ]}
      {...formLayout}
    >
      <DatePicker disabledDate={disabledDate} />
    </Form.Item>,
    <Form.Item
      label="工作接收人"
      name="jobRecipient"
      rules={[
        { required: true, message: '请选择' },
      ]}
      {...formLayout}
    >
      <EmployeesSelect
        allowClear
        showSearch
        optionFilterProp="children"
        placeholder="请选择"
      />
    </Form.Item>,
  ];

  const initialValues = {
    departureDate: moment(),
  };

  const title = (
    <span>
      <span
        className={styles['app-comp-employee-manage-menu-common-line-operation-termination']}
      >办理离职</span>
      <span>
        员工姓名：{utils.dotOptimal(staffDetail, 'name')}
      </span>
    </span>
  );

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
    >
      <Alert
        className={styles['alert-info']}
        message="可选择员工办理离职，办理离职后所选员工将进入待离职状态"
        type="info"
        showIcon
        closable
      />
      <Form
        form={form}
        initialValues={initialValues}
        className="affairs-flow-basic"
      >
        <CoreForm
          items={formItems}
          cols={1}
        />
      </Form>
    </Modal>
  );
};

export default connect()(Resignation);
