/**
 * 部门下职员列表
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import is from 'is_js';
import { connect } from 'dva';
import { Select } from 'antd';

function CommonSelectDepartmentEmployees({
  dataSouce = [],
  fetchData,
  clearData,
  departmentId,
  postId,
  onChange,
  isCurrentDepartment = false,
  fareManagerInfo = {},
  ...restProps
}) {
  useEffect(() => {
    fetchData({ departmentId, postId, is_current_department: isCurrentDepartment });
    return clearData;
  }, [departmentId, postId, fetchData, clearData, isCurrentDepartment]);

  const data = dataSouce;
  const accountIds = data.map(v => v.account_id);
  // 判断传过来的数据是否为空
  if (is.not.empty(fareManagerInfo) && is.existy(fareManagerInfo) && accountIds.includes(fareManagerInfo._id) === false) {
    data.push({
      ...fareManagerInfo,
      account_id: fareManagerInfo._id,
      disabled: true,
    });
  }
  return (
    <Select {...restProps} onChange={onChange}>
      {
        Array.isArray(dataSouce) ?
        dataSouce.map(v => (
          <Select.Option disabled={v.disabled} key={v._id} value={v.account_id} payload={v}>
            {v.name}
          </Select.Option>
        )) : null
      }
    </Select>
  );
}

CommonSelectDepartmentEmployees.propTypes = {
  departmentId: PropTypes.string, // 部门
  postId: PropTypes.string, // 岗位
  fareManagerInfo: PropTypes.object,
};

const mapStateToProps = ({ applicationCommon: { departmentEmployees } }) => ({
  dataSouce: departmentEmployees,
});

const mapDispatchToProps = dispatch => ({
  fetchData: payload => dispatch({
    payload,
    type: 'applicationCommon/fetchDepartmentEmployees',
  }),
  clearData: () => dispatch({
    type: 'applicationCommon/reduceDepartmentEmployees',
    payload: [],
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommonSelectDepartmentEmployees);
