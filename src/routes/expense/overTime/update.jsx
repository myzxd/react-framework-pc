/**
 * 审批管理 - 流程审批 - 考勤管理 - 加班管理 - 加班单编辑 /Expense/Attendance/OverTime/Update
 */
import { connect } from 'dva';
import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button } from 'antd';

import BasicInfo from './components/basicInfo';
import { OverTimePerson, OverTimeInfo } from './components/form';
import { OaApplicationOrderType } from '../../../application/define';

import style from './style.css';

class Update extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired, // 表单
    overTimeDetail: PropTypes.object, // 加班单详情
    examineOrderDetail: PropTypes.object, // 审批单详情
  }

  static defaultProps = {
    overTimeDetail: {},
    examineOrderDetail: {},
  }

  componentDidMount() {
    const {
      location,
      dispatch,
    } = this.props;

    const {
      overTimeId, // 加班单id
      applicationOrderId, // 审批单id
    } = location.query;

    dispatch({
      type: 'expenseExamineOrder/fetchExamineOrderDetail',
      payload: {
        id: applicationOrderId,
        flag: true,
        // onFailureCallback: this.onFailureCallback,
        // onSuccessCallback: this.onSuccessCallbackExamineOrderDetail,
      },
    });

    dispatch({
      type: 'expenseOverTime/fetchOverTimeDetail',
      payload: { overTimeId },
    });
  }

  // 点击保存
  onSave = (e) => {
    e.preventDefault();
    this.onSubmit();
  }

  // 点击下一步
  onNext = (e) => {
    e.preventDefault();
    this.onSubmit({
      onSuccessCallback: this.onBack,
    });
  }

  // 审批单编辑页
  onBack = () => {
    const { history, location } = this.props;
    const { applicationOrderId } = location.query; // 审批单id
    history.push(`/Expense/Manage/ExamineOrder/Form?orderId=${applicationOrderId}`);
  }

  // 提交表单数据
  onSubmit = (params) => {
    const {
      form,
      dispatch,
      location,
    } = this.props;

    const {
      overTimeId, // 加班单id
      applicationOrderId, // 审批单id
    } = location.query;

    form.validateFields((errs, values) => {
      if (errs) return;

      const payload = {
        ...values,
        ...params,
        orderId: applicationOrderId, // 审批单id
        overTimeId, // 加班单id
      };

      dispatch({
        type: 'expenseOverTime/updateOverTime',
        payload,
      });
    });
  }

  // 渲染操作
  renderOprations = () => {
    return (
      <div
        className={style['app-comp-overTime-create-operate-wrap']}
      >
        <Button
          type="primary"
          onClick={this.onSave}
        >
          保存
        </Button>
        <Button
          type="primary"
          onClick={this.onNext}
          className={style['app-comp-overTime-create-operate-next']}
        >
          下一步
        </Button>
      </div>
    );
  }

  render() {
    const {
      form,
      examineOrderDetail,
      overTimeDetail,
    } = this.props;

    if (Object.keys(overTimeDetail).length === 0) return null;

    const {
      applyAccountInfo: {
        name, // 申请人
      } = {
        name: undefined,
      },
      flowInfo: {
        name: flowName, // 审批流名称
      } = {
        name: undefined,
      },
    } = examineOrderDetail;

    return (
      <div>
        <BasicInfo
          applyPerson={name}
          approvalType={OaApplicationOrderType.overTime}
          approvalFlow={flowName}
        />
        <OverTimePerson form={form} detail={overTimeDetail} />
        <OverTimeInfo form={form} detail={overTimeDetail} />
        {this.renderOprations()}
      </div>
    );
  }
}

const mapStateToProps = ({
  expenseOverTime: { overTimeDetail },
  expenseExamineOrder: { examineOrderDetail },
}) => {
  return {
    overTimeDetail,
    examineOrderDetail,
  };
};
export default connect(mapStateToProps)(Form.create()(Update));
