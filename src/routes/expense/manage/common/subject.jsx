/**
 * 科目三级联动选择 & 成本中心数据显示
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select } from 'antd';

import { DeprecatedCoreForm, CoreSelect } from '../../../../components/core';
import { OaCostAccountingState } from '../../../../application/define';

const { Option } = Select;

class CommonSubject extends React.Component {

  static propTypes = {
    showDisabledSubject: PropTypes.bool, // 是否显示停用的科目
    disabled: PropTypes.bool, // 是否只读
    selectedSubjectId: PropTypes.string,  // 默认选中的科目id
    expenseTypeId: PropTypes.string,              // 费用分组id
    expenseTypeDetail: PropTypes.object,     // 费用分组详情
    onChange: PropTypes.func,                      // 回调事件
  }

  static defaultProps = {
    showDisabledSubject: false, // 是否显示停用的科目
    disabled: false, // 是否只读
    selectedSubjectId: '',  // 默认选中的科目id
    expenseTypeId: '',              // 费用分组id
    expenseTypeDetail: {},     // 费用分组详情
    onChange: () => {},                      // 回调事件
  }

  componentDidMount() {
    const { expenseTypeId } = this.props;
    if (is.existy(expenseTypeId) && is.not.empty(expenseTypeId)) {
      // 请求费用分组数据
      this.props.dispatch({ type: 'expenseType/fetchExpenseTypeDetail', payload: { id: expenseTypeId } });
    }
  }

  componentDidUpdate = (prevProps) => {
    const { expenseTypeId } = this.props;
    // 判断费用分组的id，获取费用分组的详情
    if (
      expenseTypeId !== prevProps.expenseTypeId &&
      is.not.empty(expenseTypeId) &&
      is.existy(expenseTypeId)
    ) {
      this.props.dispatch({ type: 'expenseType/fetchExpenseTypeDetail', payload: { id: expenseTypeId } });
    }
  }

  // 回调事件
  onChange = (value, option) => {
    const { onChange } = this.props;
    // 成本中心
    const costCenterType = option.props.costcentertype;
    if (onChange) {
      onChange(value, costCenterType);
    }
  }

  render() {
    const { expenseTypeDetail, selectedSubjectId, disabled } = this.props;
    const { getFieldDecorator } = this.props.form;
    // 科目列表
    const subjects = dot.get(expenseTypeDetail, 'accountingList', []);
    let filtedSubjects = [];
    // 是否展示禁用的科目
    if (this.props.showDisabledSubject) {
      filtedSubjects = subjects.filter(subject => [OaCostAccountingState.normal, OaCostAccountingState.disable].indexOf(subject.state) > -1);
    } else {
      filtedSubjects = subjects.filter(subject => [OaCostAccountingState.normal].indexOf(subject.state) > -1);
    }
    const formItems = [
      {
        label: '科目',
        form: getFieldDecorator('subjectId', {
          initialValue: selectedSubjectId,
          rules: [{ required: true, message: '请选择科目' }],
        })(
          <CoreSelect allowClear showSearch style={{ width: '100%' }} optionFilterProp="children" placeholder="请选择科目" onChange={this.onChange} disabled={disabled}>
            {filtedSubjects.map((subject) => {
              return (<Option
                value={subject.id}
                key={subject.id}
                costcentertype={subject.costCenterType}
                disabled={subject.state === OaCostAccountingState.disable}
              >
                {`${subject.name}(${subject.accountingCode})${subject.state === OaCostAccountingState.disable ? '(停用)' : ''}`}
              </Option>);
            })}
          </CoreSelect>,
        ),
      },
    ];

    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
    );
  }
}

function mapStateToProps({ expenseType }) {
  return { expenseTypeDetail: dot.get(expenseType, 'expenseTypeDetail', {}) };
}

export default Form.create()(connect(mapStateToProps)(CommonSubject));
