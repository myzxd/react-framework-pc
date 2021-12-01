/**
 * 社保参保方案名称 - 下拉组件
 */
import { connect } from 'dva';
import { Select } from 'antd';
import React, { useEffect } from 'react';

const { Option } = Select;
const SelectPlanName = ({ city = {}, staffSocietyPlanList = {}, dispatch, onChange, value }) => {
  // 请求
  useEffect(() => {
    if (city.city) {
      dispatch({
        type: 'society/fetchStaffSocietyPlanList',
        payload: { city, type: 'society' },
      });
    }
    // 重置下拉列表数据
    return () => dispatch({
      type: 'society/reduceStaffSocietyPlanList',
      payload: {},
    });
  }, [dispatch, city]);

  const onSelectChange = (val) => {
    if (onChange) {
      onChange(val);
    }
  };
  const data = staffSocietyPlanList.data || [];
  // 渲染下拉框
  return (
    <Select
      showSearch
      placeholder="请选择"
      onChange={onSelectChange}
      allowClear
      value={value}
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {
        data.map((item, index) => <Option value={item.name} key={index}>{item.name}</Option>)
      }
    </Select>
  );
};

const mapStateToProps = ({ society: { staffSocietyPlanList } }) => ({ staffSocietyPlanList });

export default connect(mapStateToProps)(SelectPlanName);
