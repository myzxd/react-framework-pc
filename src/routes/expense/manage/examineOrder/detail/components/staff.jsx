/**
 * 红冲分摊 - 人员组件
 */
import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';

const Option = Select.Option;

const Staff = (props) => {
  const { value, dispatch, onChange, staffMember, teamId } = props;

  useEffect(() => {
    teamId && dispatch({ type: 'expenseExamineOrder/getStaffMember', payload: { staffId: teamId, state: [1, 100] } });
  }, [teamId, dispatch]);

  const { data = [] } = staffMember;

  return (
    <Select
      value={value}
      placeholder="请选择"
      style={{ width: '100%' }}
      onChange={onChange}
      allowClear
      showSearch
      optionFilterProp="children"
    >
      {
        data.map((staff) => {
          return (
            <Option
              key={staff._id}
              profileid={staff._id}
              value={staff.identity_card_id}
            >
              {staff.name}({staff.identity_card_id})
            </Option>
          );
        })
      }
    </Select>
  );
};

const mapStateToProps = ({
   expenseExamineOrder: {
     staffMember, // 部门详情
   },
}) => {
  return { staffMember };
};

export default connect(mapStateToProps)(Staff);
