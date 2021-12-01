/**
 * 摊销管理 - 科目select
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
  costCenterType, // 科目类型
  namespace = 'all_data', // 数据隔离命名空间
  ...props
}) => {
  useEffect(() => {
    dispatch({
      type: 'costAmortization/getSubjectList',
      payload: {
        page: 1,
        limit: 9999,
        type: costCenterType,
        namespace,
      },
    });
  }, [dispatch, costCenterType, namespace]);

  const data = subjectList[namespace] || [];

  // 编辑状态下，接口有数据才渲染
  if (value && data.length < 1) return <Select style={{ width: '80%' }} />;

  return (
    <Select
      value={value}
      onChange={onChange}
      // dropdownMatchSelectWidth={false}
      {...props}
    >
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
 costAmortization: { subjectList },
}) => {
  return { subjectList };
};

export default connect(mapStateToProps)(Subject);
