/**
 * 社保参保方案名称 - 下拉组件
 */
import { connect } from 'dva';
import { Select } from 'antd';
import React, { useEffect } from 'react';

const { Option } = Select;
const SelectPlanName = ({ city, societyPlanList = {}, dispatch, onChange, initValue = undefined }) => {
  // 请求
  useEffect(() => {
    dispatch({
      type: 'society/fetchSocietyPlanList',
      payload: { city },
    });
    // 重置下拉列表数据
    return () => dispatch({
      type: 'society/reduceSocietyPlanList',
      payload: {},
    });
  }, [dispatch, city]);

  const onSelectChange = (value) => {
    if (onChange) {
      onChange(value);
    }
  };
  const data = societyPlanList.data || [];
  // 渲染下拉框
  return (
    <Select
      showSearch
      placeholder="请选择"
      onChange={onSelectChange}
      allowClear
      defaultValue={initValue}
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

const mapStateToProps = ({ society: { societyPlanList } }) => ({ societyPlanList });

export default connect(mapStateToProps)(SelectPlanName);
