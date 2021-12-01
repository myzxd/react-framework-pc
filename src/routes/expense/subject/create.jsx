/**
 * 科目设置 - 新建科目
 */
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Row, Col, message } from 'antd';

import CreateInfo from './components/createInfo';
import { OaCostAccountingState } from '../../../application/define';

import style from './style.css';

class Create extends Component {
  static propTypes = {
    subjectsData: PropTypes.object,
  };

  static defaultProps = {
    subjectsData: {},
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.savedSubjectId = '';  // 当前保存的科目的subjectId
  }

  // 数据重置
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'expenseSubject/resetSubjectsDetail' });
    dispatch({ type: 'expenseSubject/resetSubjects' });
  }

  // 重置
  onReset = () => {
    // 重置表单
    this.props.form.resetFields();
  }

  // 保存操作
  onSave = () => {
    const { form, subjectsData } = this.props;
    form.validateFields((errs, values) => {
      if (errs) {
        return;
      }

      const params = {
        state: OaCostAccountingState.draft,
        ...values,
      };

      // 上级科目
      const { superior } = values;

      const selectedSuperior = dot.get(subjectsData, 'data', []).filter(subject => subject.id === superior);
      if (selectedSuperior && selectedSuperior.length > 0) {
        params.coding = `${selectedSuperior[0].accountingCode || ''}${params.coding}`;
      }
      // 如果没有已保存的id, 则新建
      if (!this.savedSubjectId || this.savedSubjectId === '') {
        this.props.dispatch({
          type: 'expenseSubject/createSubject',
          payload: {
            params,
            onSuccessCallback: this.onSuccessSaveCreate,
            onFailureCallback: this.onFailureSaveAndAdd,
          },
        });
      } else {
        // 如果有已保存的id, 则更新
        params.id = this.savedSubjectId;
        this.props.dispatch({
          type: 'expenseSubject/updateSubject',
          payload: {
            params,
            onSuccessCallback: this.onSuccessSaveUpdate,
            onFailureCallback: this.onFailureSaveAndAdd,
          },
        });
      }
    });
  }

  // 提交
  onSubmit = () => {
    const { form, subjectsData } = this.props;
    form.validateFields((errs, values) => {
      if (errs) {
        return;
      }

      const params = {
        state: OaCostAccountingState.normal,
        ...values,
      };

      // 上级科目
      const { superior } = values;
      const selectedSuperior = dot.get(subjectsData, 'data', []).filter(subject => subject.id === superior);
      if (selectedSuperior && selectedSuperior.length > 0) {
        params.coding = `${selectedSuperior[0].accountingCode || ''}${params.coding}`;
      }
      // 如果没有已保存的id, 则新建
      if (!this.savedSubjectId || this.savedSubjectId === '') {
        this.props.dispatch({
          type: 'expenseSubject/createSubject',
          payload: {
            params,
            onSuccessCallback: this.onSuccessSubmitCreate,
            onFailureCallback: this.onFailureSaveAndAdd,
          },
        });
      } else {
        // 如果有已保存的id, 则更新
        params.id = this.savedSubjectId;
        this.props.dispatch({
          type: 'expenseSubject/updateSubject',
          payload: {
            params,
            onSuccessCallback: this.onSuccessSubmitUpdate,
            onFailureCallback: this.onFailureSaveAndAdd,
          },
        });
      }
    });
  }

  // 保存并添加下一项(创建)的成功回调
  onSuccessSaveAndAddCreate = () => {
    message.success('科目创建成功');
    // 清空表单
    this.onReset();
  }

  // 保存并添加下一项(更新)的成功回调
  onSuccessSaveAndAddUpdate = () => {
    message.success('科目保存成功');
    // 清空表单
    this.onReset();
    // 清空创建的id
    this.savedSubjectId = '';
  }

  // 保存(创建)成功回调
  onSuccessSaveCreate = (params) => {
    message.success('科目创建成功');
    // 保存创建的id
    this.savedSubjectId = params._id;
  }

  // 保存(更新)成功回调
  onSuccessSaveUpdate = () => {
    message.success('科目保存成功');
  }

  // 提交(创建)成功回调
  onSuccessSubmitCreate = () => {
    message.success('科目创建成功');
    this.props.history.push('/Expense/Subject');
  }

  // 提交(更新)成功回调
  onSuccessSubmitUpdate = () => {
    message.success('科目保存成功');
    this.props.history.push('/Expense/Subject');
  }

  // 创建保存并添加下一项的失败回调
  onFailureSaveAndAdd = (res) => {
    message.error(res.zh_message);
  }

  // 保存并添加下一项
  onSaveAndAdd = () => {
    const { form, subjectsData } = this.props;
    form.validateFields((errs, values) => {
      if (errs) {
        return;
      }

      const params = {
        state: OaCostAccountingState.normal,
        ...values,
      };

      const { superior } = values;

      const selectedSuperior = dot.get(subjectsData, 'data', []).filter(subject => subject.id === superior);
      if (selectedSuperior && selectedSuperior.length > 0) {
        params.coding = `${selectedSuperior[0].accountingCode || ''}${params.coding}`;
      }

      // 如果没有已保存的id, 则新建
      if (!this.savedSubjectId || this.savedSubjectId === '') {
        this.props.dispatch({
          type: 'expenseSubject/createSubject',
          payload: {
            params,
            onSuccessCallback: this.onSuccessSaveAndAddCreate,
            onFailureCallback: this.onFailureSaveAndAdd,
          },
        });
      } else {
        // 如果有已保存的id, 则更新
        params.id = this.savedSubjectId;
        this.props.dispatch({
          type: 'expenseSubject/updateSubject',
          payload: {
            params,
            onSuccessCallback: this.onSuccessSaveAndAddUpdate,
            onFailureCallback: this.onFailureSaveAndAdd,
          },
        });
      }
    });
  }

  // 渲染归属信息
  renderCreateInfo = () => {
    const { form, subjectsData, dispatch } = this.props;
    return (
      <CreateInfo
        form={form}
        dispatch={dispatch}
        subjectsData={subjectsData}
      />
    );
  }

  // 渲染操作按钮
  renderOprations = () => {
    const operations = [(
      <Col key="save" span={9} className={style['app-comp-expense-subject-create-save']}>
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
      <Col key="submit" span={1}>
        <Button
          type="primary"
          size="large"
          onClick={this.onSubmit}
        >
          提交
          </Button>
      </Col>
    ));
    operations.push((
      <Col key="submitAdd" span={12} className={style['app-comp-expense-subject-create-primary']}>
        <Button
          type="primary"
          size="large"
          onClick={this.onSaveAndAdd}
        >
          提交并添加下一项
          </Button>
      </Col>
    ));
    return (
      <Row
        type="flex"
        align="middle"
        justify="space-around"
        className={style['app-comp-expense-subject-create-button']}
      >
        {operations}
      </Row>
    );
  }

  render = () => {
    return (
      <Form layout="horizontal">
        {/* 渲染创建信息 */}
        {this.renderCreateInfo()}

        {/* 渲染操作按钮 */}
        {this.renderOprations()}
      </Form>
    );
  }
}

function mapStateToProps({ expenseSubject: { subjectsData } }) {
  return { subjectsData };
}

export default connect(mapStateToProps)(Form.create()(Create));
