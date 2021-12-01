/**
 * Code/Team审批管理 - 付款类型配置管理 - 科目Select
 */
import { connect } from 'dva';
import React, { useEffect } from 'react';
import {
  Select,
} from 'antd';

const { Option } = Select;

const Subject = ({
  dispatch,
  subjectList = {},
  value,
  onChange,
  type,
}) => {
  useEffect(() => {
    dispatch({
      type: 'codeFlow/getSubjectList',
      payload: { page: 1, limit: 9999, type },
    });
    return () => {
      dispatch({ type: 'codeFlow/resetSubjectList' });
    };
  }, [dispatch, type]);

  const { data = [] } = subjectList;

  // onChange
  const onChangeVal = (val = []) => {
    if (val.includes('*')) {
      onChange && onChange(['*']);
    } else {
      onChange && onChange(val);
    }
  };

  return (
    <Select
      value={value}
      onChange={onChangeVal}
      placeholder="请选择"
      mode="multiple"
      allowClear
      showSearch
      showArrow
      optionFilterProp="children"
    >
      {data.length > 0 && (<Option value="*" key="*">全部</Option>)}
      {
        data.map((i) => {
          return (
            <Option
              value={i._id}
              key={i._id}
              disabled={(Array.isArray(value) && value.includes('*'))}
            >{i.name}({i.ac_code})</Option>
          );
        })
      }
    </Select>
  );
};

const mapStateToProps = ({
  codeFlow: { subjectList },
}) => {
  return { subjectList };
};

export default connect(mapStateToProps)(Subject);
