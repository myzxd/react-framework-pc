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
import { ExpenseCostCenterType, OaCostAccountingState } from '../../../../application/define';

import Belong from '../common/costBelong';

const { Option } = Select;

class CommonSubject extends React.Component {

  static propTypes = {
    showDisabledSubject: PropTypes.bool, // 是否显示停用的科目
    disabled: PropTypes.bool, // 是否只读
    selectedSubjectId: PropTypes.string,  // 默认选中的科目id
    expenseTypeId: PropTypes.string,              // 费用分组id
    expenseTypeDetail: PropTypes.object,     // 费用分组详情
    onChange: PropTypes.func,                      // 回调事件
    subjectCode: PropTypes.string, // 科目编码
  }

  static defaultProps = {
    showDisabledSubject: false, // 是否显示停用的科目
    disabled: false, // 是否只读
    expenseTypeId: '',              // 费用分组id
    expenseTypeDetail: {},     // 费用分组详情
    onChange: () => {},                      // 回调事件
  }

  constructor(props) {
    super(props);
    this.state = {
      subjectCode: props.subjectCode || undefined, // 科目编码
    };
  }

  componentDidMount() {
    const { expenseTypeId, isPluginOrder } = this.props;
    if (is.existy(expenseTypeId) && is.not.empty(expenseTypeId) && isPluginOrder !== true) {
      this.props.dispatch({ type: 'expenseType/fetchExpenseTypeDetail', payload: { id: expenseTypeId } });
    }
  }

  componentDidUpdate = (prevProps) => {
    const { expenseTypeId, isPluginOrder } = this.props;
    // 判断费用分组的id，获取费用分组的详情
    if (
      expenseTypeId !== prevProps.expenseTypeId &&
      is.not.empty(expenseTypeId) &&
      is.existy(expenseTypeId) && isPluginOrder !== true
    ) {
      this.props.dispatch({ type: 'expenseType/fetchExpenseTypeDetail', payload: { id: expenseTypeId } });
    }
  }

  // 回调事件
  onChange = (value, option) => {
    const { onChangeSubject, onChange, costAttribution, platform } = this.props;
    // 成本中心
    const costCenterType = dot.get(option, 'props.costcentertype', undefined);

    const subjectCode = dot.get(option, 'props.subjectcode', undefined);
    const checkPlatform = ['elem', 'meituan', 'relian', 'zongbu', 'chengtu', 'haluo', 'mobike', 'chengjing', 'lailai'];

    const isPlatform = checkPlatform.findIndex(item => item === platform) > -1;

    if (isPlatform) {
      this.setState({
        subjectCode,
      });
    }

    if (subjectCode === undefined) {
      this.props.form.setFieldsValue({ costAttribution: undefined });
      // 清空成本归属select options
      this.props.dispatch({ type: 'expenseCostOrder/reduceSubjectBelong', payload: { namespace: 'cost' } });
    }

    if (onChangeSubject) {
      onChangeSubject(value, costCenterType);
    }
    // 如果是个人，需要重置个人选项
    if (costAttribution === ExpenseCostCenterType.person) {
      this.props.dispatch({ type: 'expenseExamineOrder/resetStaffMember' });
    }
    onChange && onChange({ subjectId: value, costAttribution });
  }

  // 修改成本归属
  onChangeCostAttribution = (val = {}, isInit) => {
    const {
      onChangeCostAttribution,
      onChange,
      selectedSubjectId,
    } = this.props;

    const { cost_center_type: costCenterType } = val;

    onChangeCostAttribution && onChangeCostAttribution(val, isInit);

    onChange && onChange({ subjectId: selectedSubjectId, costAttribution: costCenterType });
  }

  render() {
    const { subjectCode } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { expenseTypeDetail, selectedSubjectId, disabled, costAttribution, platform, isPluginOrder } = this.props;
    // 科目列表
    const subjects = dot.get(expenseTypeDetail, 'accountingList', []);
    let filtedSubjects = [];
    if (this.props.showDisabledSubject) {
      filtedSubjects = subjects.filter(subject => [OaCostAccountingState.normal, OaCostAccountingState.disable].indexOf(subject.state) > -1);
    } else {
      filtedSubjects = subjects.filter(subject => [OaCostAccountingState.normal].indexOf(subject.state) > -1);
    }

    let formItems = [
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
                subjectcode={subject.accountingCode}
                costcentertype={subject.costCenterType}
                disabled={subject.state === OaCostAccountingState.disable}
              >
                {`${subject.name}(${subject.accountingCode})${subject.state === OaCostAccountingState.disable ? '(停用)' : ''}`}
              </Option>);
            })}
          </CoreSelect>,
        ),
      },
      {
        label: '成本归属',
        form: getFieldDecorator('costAttribution', {
          initialValue: costAttribution,
        })(
          <Belong
            disabled={disabled}
            form={this.props.form}
            subjectCode={subjectCode}
            platform={platform}
            onChangeCostAttribution={this.onChangeCostAttribution}
            namespace={'cost'}
          />,
        ),
      },
    ];
    // 判断是否是外部审批单
    if (isPluginOrder === true) {
      formItems = [];
      // 外部审批单
      formItems = [
        {
          label: '科目',
          form: getFieldDecorator('subjectId', {
            initialValue: selectedSubjectId,
            rules: [{ required: true, message: '请选择科目' }],
          })(
            <span>{dot.get(this.props, 'costAccountingInfo.name', '')}</span>,
          ),
        },
        {
          label: '成本归属',
          form: getFieldDecorator('costAttribution', {
            initialValue: costAttribution,
          })(
            <span>{ExpenseCostCenterType.description(costAttribution)}</span>,
          ),
        },
      ];
    }

    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    return (
      <div>
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </div>
    );
  }
}

function mapStateToProps({ expenseType }) {
  return { expenseTypeDetail: dot.get(expenseType, 'expenseTypeDetail', {}) };
}

export default Form.create()(connect(mapStateToProps)(CommonSubject));
