/**
 * 获取岗位名称下拉
 */
import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';
import PropTypes from 'prop-types';

import { omit, dotOptimal } from '../../../../application/utils';

const { Option } = Select;

PostNameSelect.propTypes = {
  isFetchData: PropTypes.bool, // 是否需要请求接口
  clearnOptionList: PropTypes.array, // 需要过滤的option
  staffList: PropTypes.object, // 岗位列表
};
PostNameSelect.defaultProps = {
  isFetchData: true,
  clearnOptionList: [],
  staffList: {},
};

function PostNameSelect(props) {
  const {
    isFetchData,
    clearnOptionList,
    staffList,
    getStaffList,
  } = props;

  useEffect(() => {
    if (!isFetchData || (Array.isArray(staffList.data) && staffList.data.length > 0)) return;
    getStaffList({ page: 1, limit: 9999 });
  }, []);

  if (dotOptimal(staffList, 'data', []).length < 1) {
    return <Select placeholder="请选择" />;
  }

  // 过滤props
  const omitedProps = omit([
    'dispatch',
    'isFetchData',
    'clearnOptionList',
    'staffList',
    'getStaffList',
  ], props);

  // 获取岗位数据
  const options = dotOptimal(staffList, 'data', []).filter((item) => {
    // 过滤clearnOptionList
    return clearnOptionList.length <= 0 || clearnOptionList.every(itm => itm.jobId !== item._id);
  }).map((staff) => {
    return (<Option value={staff._id} key={staff._id} info={staff}>
      {dotOptimal(staff, 'code', undefined) ? `${staff.name}(${staff.code})` : staff.name}
    </Option>);
  });

  return (
    <Select
      showSearch
      optionFilterProp="children"
      {...omitedProps}
    >
      {options}
    </Select>
  );
}

const mapStateToProps = ({ organizationStaff: { staffList } }) => ({ staffList });
const mapDispatchToProps = dispatch => ({
  // 获取岗位列表
  getStaffList: payload => dispatch({
    type: 'organizationStaff/getStaffList',
    payload,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostNameSelect);
