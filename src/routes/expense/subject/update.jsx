/**
 * 科目设置 - 编辑
 */
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Row, Col, message } from 'antd';

import UpdateInfo from './components/updateInfo';
import { OaCostAccountingState } from '../../../application/define';

import style from './style.css';

class Update extends Component {
  static propTypes = {
    subjectsDetail: PropTypes.object,
    subjectsData: PropTypes.object,
  };

  static defaultProps = {
    subjectsDetail: {},
    subjectsData: {},
  };

  componentDidMount() {
    const { subjiectId } = this.props.location.query;
    const params = {
      id: subjiectId, // 科目id
    };
    this.props.dispatch({ type: 'expenseSubject/fetchSubjectsDetail', payload: params });
  }

  // 数据重置
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'expenseSubject/resetSubjectsDetail' });
    dispatch({ type: 'expenseSubject/resetSubjects' });
  }

  // 保存操作
  onSave = () => {
    const { form, subjectsData = {}, subjectsDetail = {} } = this.props;
    // 科目id
    const { id = undefined } = subjectsDetail;

    form.validateFields((errs, values) => {
      if (errs) {
        return;
      }

      const params = {
        id,
        state: OaCostAccountingState.draft,
        ...values,
      };

      const { superior = undefined } = values;

      const selectedSuperior = dot.get(subjectsData, 'data', []).filter(subject => subject.id === superior);
      if (selectedSuperior && selectedSuperior.length > 0) {
        params.coding = `${selectedSuperior[0].accountingCode || ''}${params.coding}`;
      }
      this.props.dispatch({
        type: 'expenseSubject/updateSubject',
        payload: {
          params,
          onSuccessCallback: this.onSuccessSave,
          onFailureCallback: this.onFailureSaveSubmit,
        },
      });
    });
  }

  // 提交
  onSubmit = () => {
    const { form, subjectsData = {}, subjectsDetail = {} } = this.props;
    const { id = undefined } = subjectsDetail;
    form.validateFields((errs, values) => {
      if (errs) {
        return;
      }

      const params = {
        id,
        state: OaCostAccountingState.normal,
        ...values,
      };

      const { superior = undefined } = values;

      const selectedSuperior = dot.get(subjectsData, 'data', []).filter(subject => subject.id === superior);
      if (selectedSuperior && selectedSuperior.length > 0) {
        params.coding = `${selectedSuperior[0].accountingCode || ''}${params.coding}`;
      }
      this.props.dispatch({
        type: 'expenseSubject/updateSubject',
        payload: {
          params,
          onSuccessCallback: this.onSuccessSubmit,
          onFailureCallback: this.onFailureSaveSubmit,
        },
      });
    });
  }

  // 提交的成功回调
  onSuccessSubmit = () => {
    message.success('科目编辑成功');
    this.props.history.push('/Expense/Subject');
  }

  // 保存失败回调
  onFailureSaveSubmit = (res) => {
    message.error(res.zh_message);
  }

  // 保存成功回调
  onSuccessSave = () => {
    message.success('科目编辑成功');
  }

  // 渲染信息
  renderUpdateInfo = () => {
    const { form, subjectsDetail } = this.props;
    if (Object.keys(subjectsDetail).length < 1) return null;
    return (
      <UpdateInfo
        form={form}
        subjectsDetail={subjectsDetail}
      />
    );
  }

  // 渲染操作按钮
  renderOprations = () => {
    const operations = [(
      <Col key="save" className={style['app-comp-expense-subject-update-save']}>
        <Button
          type="primary"
          size="large"
          onClick={this.onSave}
        >
          保存
        </Button>
      </Col>
    )];
    operations.push((
      <Col key="submit" className={style['app-comp-expense-subject-update-submit']}>
        <Button
          type="primary"
          size="large"
          onClick={this.onSubmit}
        >
          提交
          </Button>
      </Col>
    ));
    return (
      <Row
        type="flex"
        align="middle"
        justify="center"
        className={style['app-comp-expense-subject-update-button']}
      >
        {operations}
      </Row>
    );
  }

  render = () => {
    return (
      <Form layout="horizontal">
        {/* 渲染编辑信息 */}
        {this.renderUpdateInfo()}

        {/* 渲染操作按钮 */}
        {this.renderOprations()}
      </Form>
    );
  }
}

function mapStateToProps({ expenseSubject: { subjectsDetail, subjectsData } }) {
  return { subjectsDetail, subjectsData };
}

export default connect(mapStateToProps)(Form.create()(Update));
