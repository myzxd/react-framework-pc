import { connect } from 'dva';
import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, message } from 'antd';

import BasicInfo from './components/basicInfo';
import { OverTimePerson, OverTimeInfo } from './components/form';
import { OaApplicationOrderType } from '../../../application/define';

import style from './style.css';

class Create extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired, // 表单
    examineOrderDetail: PropTypes.object,
  }

  static defaultProps = {
    examineOrderDetail: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      overTimeId: '', // 加班单id
    };
    this.shouldUpdate = 1;  // 创建页面第二次点击为编辑
  }

  componentDidMount() {
    const {
      dispatch,
      location,
    } = this.props;

    const { applicationOrderId } = location.query;  // 审批单id

    dispatch({
      type: 'expenseExamineOrder/fetchExamineOrderDetail',
      payload: {
        id: applicationOrderId,
        flag: true,
        // onFailureCallback: this.onFailureCallback,
        // onSuccessCallback: this.onSuccessCallbackExamineOrderDetail,
      },
    });
  }

  // 点击保存
  onSave = (e) => {
    e.preventDefault();
    this.onSubmit({
      onSuccessCallback: this.onCreateSuccessCallback,
      onFailureCallback: this.onFailureCallback,
    });
  }

  // 点击下一步
  onNext = (e) => {
    e.preventDefault();
    this.onSubmit({
      onSuccessCallback: this.onBack,
      onFailureCallback: this.onFailureCallback,
    });
  }

  onFailureCallback = (res) => {
    if (res && res.zh_message) {
      message.error(res.zh_message);
    }
  }

  // 审批单编辑页
  onBack = () => {
    const { history, location } = this.props;
    const { applicationOrderId } = location.query; // 审批单id
    history.push(`/Expense/Manage/ExamineOrder/Form?orderId=${applicationOrderId}`);
  }

  // 创建成功回调
  onCreateSuccessCallback = (res) => {
    this.shouldUpdate += 1;
    const {
      record: {
        _id: overTimeId,
      } = { _id: '' },
    } = res;

    if (overTimeId) {
      this.setState({
        overTimeId,
      });
    }
  }

  // 提交表单数据
  onSubmit = (params) => {
    const {
      form,
      dispatch,
      location,
    } = this.props;

    const { overTimeId } = this.state; // 加班单id

    const {
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

      if (overTimeId || this.shouldUpdate >= 2) {
        dispatch({
          type: 'expenseOverTime/updateOverTime',
          payload,
        });
        return;
      }

      this.props.dispatch({
        type: 'expenseOverTime/createOverTime',
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
    } = this.props;

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
        <OverTimePerson form={form} />
        <OverTimeInfo form={form} />
        {this.renderOprations()}
      </div>
    );
  }
}

function mapStateToProps({
  expenseExamineOrder: { examineOrderDetail },
}) {
  return {
    examineOrderDetail,
  };
}
export default connect(mapStateToProps)(Form.create()(Create));
