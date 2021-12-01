/**
 * 费用提报 - 人员信息 - select
 */
import { connect } from 'dva';
import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

const Option = Select.Option;

class SelectStaff extends React.Component {

  componentDidMount() {
    if (this.props.id) {
      this.props.dispatch({
        type: 'expenseExamineOrder/getStaffMember', payload: { staffId: this.props.id, state: [1, 100] } });
    }
  }

  componentDidUpdate(prevProps) {
    const { id, value, staffMember = {}, onChange } = this.props;
    if (prevProps.id !== id) {
      this.props.dispatch({ type: 'expenseExamineOrder/getStaffMember', payload: { staffId: id, state: [1, 100] } });
    }
    if (value && staffMember.data && staffMember.data.length > 0) {
      const staff = staffMember.data.find(item => item.identity_card_id === value);
      const profileId = staff._id;
      onChange && onChange(undefined, { profileId });
    }
  }

  onChange = (val, options) => {
    const { onChange } = this.props;
    onChange && onChange(val, options);
  }

  render() {
    const { staffMember = {}, value, disabled } = this.props;
    const { data = [] } = staffMember;
    return (
      <Select
        style={{ width: '100%' }}
        placeholder="请选择人员"
        value={value}
        onChange={this.onChange}
        disabled={disabled}
        showSearch
        optionFilterProp="children"
      >
        {
          data.map((staff) => {
            return <Option profileId={staff._id} staffName={staff.name} key={staff.identity_card_id} value={staff.identity_card_id}>{staff.name}({staff.identity_card_id})</Option>;
          })
        }
      </Select>
    );
  }
}

SelectStaff.protoType = {
  staffList: PropTypes.object,
  onChange: PropTypes.func,
  value: PropTypes.string,
  disabled: PropTypes.bool,
};

SelectStaff.defaultProps = {
  staffList: {},
  onChange: () => {},
  value: undefined,
  disabled: false,
};

function mapStateToProps({
     expenseExamineOrder: {
       staffMember, // 部门详情
     },
   }) {
  return { staffMember };
}

export default connect(mapStateToProps)(SelectStaff);
