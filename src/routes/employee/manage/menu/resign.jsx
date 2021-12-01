/**
 * 确认离职页面
 */
import React, { useEffect, useState } from 'react';
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import { Form, DatePicker, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './style.css';
import { CoreContent, CoreForm } from '../../../../components/core';

Resign.propTypes = {
  employeeDetail: PropTypes.object, // 员工详情
};
Resign.defaultProps = {
  employeeDetail: {},
};

function Resign({ history, dispatch, location, employeeDetail }) {
  const [form] = Form.useForm();
  const [buttonLoading, setButtonLoading] = useState(false);
  const { query: { id } = {} } = location; // 员工id
  const {
    entry_date, // 入职日期
    name, // 员工姓名
    receiver_info, // 工作接收人信息
    pending_order_num: pendingOrderNum, // 待处理的审批单数量
  } = employeeDetail;

  // 请求员工详情
  useEffect(() => {
    dispatch({
      type: 'oaCommon/fetchEmployeeDetail',
      payload: { id },
    });
  }, []);

  // 设置离职日期默认值
  useEffect(() => {
    const { apply_departure_date: applyDepartureDate } = employeeDetail;
    applyDepartureDate && form.setFieldsValue({ departureDate: moment(`${applyDepartureDate}`) });
  }, [employeeDetail]);

  // 限制解约日期选择范围
  const disabledDate = (current) => {
    return current < moment(entry_date, 'YYYYMMDD') || current > moment();
  };

  // 点击取消
  const onClose = () => {
    history.push('Manage?fileType=staff');
  };

  // 点击完成离职
  const onSubmit = async () => {
    const res = await form.validateFields();
    setButtonLoading(true);
    const { departureDate } = res;
    const result = await dispatch({
      type: 'employeeManage/employeeRelease',
      payload: {
        staffId: id,
        departureDate: moment(departureDate).format('YYYYMMDD'),
      },
    });
    if (result && result.ok) {
      setButtonLoading(false);
      history.push('Manage?fileType=staff');
    } else {
      setButtonLoading(false);
    }
  };

  // 表单项
  const formItems = [
    <Form.Item
      name="departureDate"
      label="离职日期"
      labelCol={{ span: 3 }}
      wrapperCol={{ span: 12 }}
      rules={[{ required: true, message: '请选择' }]}
    >
      <DatePicker disabledDate={disabledDate} />
    </Form.Item>,
  ];

  return (
    <div>
      <div className={styles['resign-title']}>{`正在为${name || '--'}办理离职`}</div>
      <CoreContent title="审批" titleExt={<span className={styles['resign-titleExt']}>离职后自动处理</span>}>
        {`该员工尚有${pendingOrderNum}个待处理的审批单，由他待办的事务性审批单将在其离职后转交给工作接收人`}
        <div className={styles['resign-innerbox']}>
          <span className={styles['resign-jobRecipient']}>{`工作接收人：${dot.get(receiver_info, 'name', '--')}`}</span>
        </div>
      </CoreContent>
      <CoreContent title="组织架构" titleExt={<span className={styles['resign-titleExt']}>离职后自动处理</span>}>
        该员工退出组织架构
      </CoreContent>
      <CoreContent title="系统账号" titleExt={<span className={styles['resign-titleExt']}>离职后自动处理</span>}>
        禁用该员工的系统账号
      </CoreContent>
      <Form
        form={form}
      >
        <CoreForm items={formItems} cols={2} />
        <div style={{ textAlign: 'center' }}>
          <Button onClick={onClose} style={{ marginRight: '20px' }}>
            取消
          </Button>
          <Button loading={buttonLoading} type="primary" onClick={onSubmit}>
            完成离职
          </Button>
        </div>
      </Form>
    </div>
  );
}

function mapStateToProps({ oaCommon: { employeeDetail } }) {
  return { employeeDetail };
}

export default connect(mapStateToProps)(Resign);
