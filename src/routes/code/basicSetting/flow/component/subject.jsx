/**
 * Code/Team审批管理 - 付款类型配置管理 - 科目Select
 */
import { connect } from 'dva';
import React, { useEffect } from 'react';
import {
  Select,
} from 'antd';
import {
} from '../../../../../application/define';

const { Option } = Select;

const Subject = ({
  dispatch,
  subjectList = {},
  value,
  onChange,
  type,
  selectDisabled,
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

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder="请选择"
      mode="multiple"
      allowClear
      showSearch
      optionFilterProp="children"
      disabled={selectDisabled}
      showArrow
    >
      {
        data.map((i) => {
          return (
            <Option
              value={`${i._id}=${i.ac_code}`}
              key={i._id}
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
