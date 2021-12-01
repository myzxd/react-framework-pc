/**
 * 费用提报 - 团队信息 - select
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

const Option = Select.Option;

class DepartmentJobs extends React.Component {
  componentDidMount() {
    const { dispatch, type, namespace = 'default', isAuthorized = false } = this.props;
    dispatch({ type: 'department/getExpenseDepartment', payload: { namespace, page: 1, limit: 9999, teamAttr: type, isAuthorized } });
  }

  componentDidUpdate(preProp) {
    const { dispatch, type, namespace = 'default', isAuthorized } = this.props;
    if (preProp.type !== type) {
      dispatch({ type: 'department/getExpenseDepartment', payload: { namespace, page: 1, limit: 9999, teamAttr: type, isAuthorized } });
    }
  }

  componentWillUnmount() {
    const { namespace = 'default' } = this.props;
    // 重置部门岗位信息
    this.props.dispatch({ type: 'department/resetExpenseDepartment', payload: { namespace } });
  }


  onChange = (val, options) => {
    const { onChange } = this.props;
    onChange && onChange(val, options);
  }


  render() {
    const { expenseDepartment = {}, value, disabled, namespace } = this.props;
    const data = dot.get(expenseDepartment, `${namespace}.data`, []);
    return (
      <Select
        style={{ width: '100%' }}
        placeholder="请选择岗位名称"
        onChange={this.onChange}
        value={value}
        disabled={disabled}
        showSearch
        optionFilterProp="children"
      >
        {
          data.map((item) => {
            return <Option key={`${item.code}+${item.name}`} name={item.name} code={item.code} value={item._id}>{item.name}({item.code})</Option>;
          })
        }
      </Select>
    );
  }
}

DepartmentJobs.protoType = {
  expenseDepartment: PropTypes.object,
  onChange: PropTypes.func,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  namespace: PropTypes.string,
};

DepartmentJobs.defaultProps = {
  expenseDepartment: {},
  onChange: () => {},
  value: undefined,
  disabled: false,
  namespace: 'default',
};

function mapStateToProps({
  department: {
    expenseDepartment, // 部门详情
   },
 }) {
  return { expenseDepartment };
}

export default connect(mapStateToProps)(DepartmentJobs);
