/**
 * 组织架构 - 部门管理 - 编辑/新建部门弹窗 - 上级部门select
 */
import { connect } from 'dva';
import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

const Option = Select.Option;

class Pid extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'department/getDepartmentTree', payload: { isAuthorized: true } });
  }

  onChange = (val, option) => {
    const { onChangePid } = this.props;
    onChangePid && onChangePid(val, option);
  }

  render() {
    const { departmentTree = [], value, disabled, curDepId, otherChild } = this.props;

    // 根据是否为根部门，处理数据
    const data = [...departmentTree].filter(i => i._id !== curDepId);

    if (value !== '0') {
      data.shift();
    }

    const renderOptions = () => {
      // otherChild不存在 || otherChild在data中存在
      if (!otherChild._id || data.some(item => item._id === otherChild._id)) {
        return data.map((i) => {
          return (
            <Option key={i._id} value={i._id}>
              {i.code ? `${i.name}（${i.code}）` : i.name}
            </Option>
          );
        });
      }
      // 渲染data及otherChild
      return [...data, otherChild].map((i) => {
        // otherChild仅展示不可选中
        if (i._id === otherChild._id) {
          return (
            <Option disabled key={i._id} value={i._id}>
              {i.code ? `${i.name}（${i.code}）` : i.name}
            </Option>
          );
        }
        // data中的数据正常展示
        return (
          <Option key={i._id} value={i._id}>
            {i.code ? `${i.name}（${i.code}）` : i.name}
          </Option>
        );
      });
    };

    return (
      <Select
        style={{ width: '100%' }}
        placeholder="请选择上级部门"
        onChange={this.onChange}
        value={value}
        disabled={disabled}
        allowClear
        showSearch
        optionFilterProp="children"
      >
        {renderOptions()}
      </Select>
    );
  }
}

Pid.protoType = {
  departmentTree: PropTypes.array,  // 部门树信息
  onChangePid: PropTypes.func,      // 修改上级部门回调
  value: PropTypes.string,          // 表单值
  disabled: PropTypes.bool,         // Select disabled
  otherChild: PropTypes.object,     // 展示其他的child（仅展示不可选择）
};

Pid.defaultProps = {
  departmentTree: [],
  onChangePid: () => {},
  value: undefined,
  disabled: false,
  otherChild: {},
};

function mapStateToProps({
  department: {
    departmentTree, // 部门树信息
  },
}) {
  return { departmentTree };
}

export default connect(mapStateToProps)(Pid);
