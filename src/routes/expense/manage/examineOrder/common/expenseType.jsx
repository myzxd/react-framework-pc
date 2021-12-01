/**
 * 付款审批创建 - 费用分组选择组件
 */
import is from 'is_js';
import dot from 'dot-prop';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { CoreSelect } from '../../../../../components/core';
import { omit } from '../../../../../application/utils';

const Option = CoreSelect.Option;

class SelectExpenseTypes extends React.Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired,
    examineDetail: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    flowId: '',
    examineDetail: {},
    dispatch: () => {},
    onChange: () => {},
  };

  componentDidMount() {
    const { flowId, dispatch } = this.props;
    if (flowId) {
      dispatch({ type: 'expenseExamineFlow/fetchExamineDetail', payload: { id: flowId } });
    }
  }

  componentDidUpdate(oriProps) {
    const { flowId: oriFlowId } = oriProps;
    const { flowId, dispatch } = this.props;

    if (oriFlowId !== flowId && flowId) {
      dispatch({ type: 'expenseExamineFlow/fetchExamineDetail', payload: { id: flowId } });
    }
  }

  // 清除数据
  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'expenseExamineFlow/resetExamineFlowDetail' });
  }

  // 回调事件
  onChange = (type, option) => {
    const { onChange, examineDetail } = this.props;
    // 默认的模版类型
    const defaultTemplate = dot.get(examineDetail, 'extraUiOptions.form_template');
    // 自定义模版项目
    const costForms = dot.get(examineDetail, 'extraUiOptions.cost_forms', {});

    // 自定义模版
    let customTemplate;
    if (is.existy(costForms) && is.not.empty(costForms)) {
      // 根据数据id获取模版类型
      customTemplate = dot.get(costForms, type);
    }

    // 类型名称
    const name = option.props.children;

    // 判断回调函数是否存在
    if (!onChange) {
      return;
    }

    // 判断自定义的模版类型是否设置
    if (is.existy(customTemplate) && is.not.empty(customTemplate)) {
      return onChange(type, name, customTemplate);
    } else {
      return onChange(type, name, defaultTemplate);
    }
  }

  render = () => {
    const { examineDetail } = this.props;
    const { costCatalogScopeList = [] } = examineDetail;
    // 获取当前审批流下的费用分组，置为选项
    const options = costCatalogScopeList.map((data) => {
      return <Option key={data.id} value={`${data.id}`}>{data.name}</Option>;
    });

    // 默认传递所有上级传入的参数
    const props = { ...this.props, onChange: this.onChange };

    // 去除antd不需要的props
    const omitedProps = omit([
      'dispatch',
      'flowId',
      'examineDetail',
    ], props);

    return (
      <CoreSelect {...omitedProps} >
        {options}
      </CoreSelect>
    );
  }
}

function mapStateToProps({ expenseExamineFlow: { examineDetail } }) {
  return { examineDetail };
}

export default connect(mapStateToProps)(SelectExpenseTypes);
