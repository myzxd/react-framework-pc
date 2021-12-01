/**
 * 费用分组详情页面 /Expense/Type/Detail
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button } from 'antd';
import { CommonSelectScene } from '../../../components/common';
import { CoreContent, DeprecatedCoreForm } from '../../../components/core';


class Index extends Component {
  static propsTypes = {
    expenseTypeDetail: PropTypes.object,
  };

  static defaultProps = {
    expenseTypeDetail: {},
  };

  componentDidMount = () => {
    const id = this.props.location.query.id;
    this.props.dispatch({ type: 'expenseType/fetchExpenseTypeDetail', payload: { id } });
  }

  // 渲染表单
  renderForm = () => {
    const { expenseTypeDetail: detail = {} } = this.props;
    const formItems = [
      {
        label: '费用分组名称',
        form: dot.get(detail, 'name', ''),
      },
      {
        label: '适用场景',
        form: <CommonSelectScene isDetail enumeratedType="subjectScense" value={dot.get(detail, 'industryCodes.0', undefined)} />,
      },
      {
        label: '选择科目',
        form: <p>
          {
            dot.get(detail, 'accountingList', []).map((item, index) => {
              return <span key={index}>{item.name}({item.accountingCode}) </span>;
            })
          }
        </p>,
      },
      {
        label: '备注',
        form: (
          <span className="noteWrap">
            {dot.get(detail, 'note', '')}
          </span>
        ),
      },
    ];
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 12 } };
    return (
      <CoreContent title="编辑费用分组">
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </CoreContent>
    );
  }

  // 表单提交按钮
  renderButton = () => {
    return (
      <CoreContent style={{ textAlign: 'center', backgroundColor: '#ffffff' }} >
        <Button type="default" onClick={() => { window.location.href = '/#/Expense/Type'; }}>返回</Button>
      </CoreContent>
    );
  }

  render = () => {
    return (
      <Form onSubmit={this.onSubmit}>
        {/* 渲染表单 */}
        {this.renderForm()}

        {/* 表单提交按钮 */}
        {this.renderButton()}
      </Form>
    );
  }
}

function mapStateToProps({ expenseType: { expenseTypeDetail } }) {
  return { expenseTypeDetail };
}
export default connect(mapStateToProps)(Form.create()(Index));
