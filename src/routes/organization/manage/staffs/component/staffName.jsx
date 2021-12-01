/**
 * 组织架构 - 岗位编制Tab - 添加/编辑岗位 - 岗位名称select
 */
import { connect } from 'dva';
import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

const Option = Select.Option;

class StaffName extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'organizationStaff/getStaffList', payload: { page: 1, limit: 9999 } });
  }

  onChange = (val, options) => {
    const { onChange } = this.props;
    onChange && onChange(val, options);
  }

  render() {
    const { staffList = {}, value, disabled } = this.props;
    const { data = [] } = staffList;
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
          data.map((staff) => {
            return <Option key={staff._id} value={staff._id} rank={staff.rank}>{staff.name}({staff.code})</Option>;
          })
        }
      </Select>
    );
  }
}

StaffName.protoType = {
  staffList: PropTypes.object,
  onChange: PropTypes.func,
  value: PropTypes.string,
  disabled: PropTypes.bool,
};

StaffName.defaultProps = {
  staffList: {},
  onChange: () => {},
  value: undefined,
  disabled: false,
};

function mapStateToProps({
  organizationStaff: {
    staffList, // 部门详情
  },
}) {
  return { staffList };
}

export default connect(mapStateToProps)(StaffName);
