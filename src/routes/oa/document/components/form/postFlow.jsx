/**
 * 事务性表单 - 岗位（审批流联动）
 */
import dot from 'dot-prop';
import is from 'is_js';
import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';

const Option = Select.Option;

const PostFlow = ({
  accountDep = {},
  value,
  onChange,
  departmentId,
  setRank,
  disabled,
}) => {
  // 过滤对应部门下的岗位
  const { postList = [] } = accountDep;
  const data = postList.filter(i => i.department_info._id === departmentId);
  useEffect(() => {
    // 判断value为空，并且有数据，数据只有一条时添加默认值
    if ((is.not.existy(value) || is.empty(value)) &&
      (is.existy(data) && is.not.empty(data))
      && data.length === 1) {
      const item = data[0] || {};
      // 重置职级
      setRank && (setRank(dot.get(item, 'job_info.rank', undefined)));
      onChange && onChange(dot.get(item, 'job_info._id', undefined));
    }
  }, [value, data]);
  const onChangeVal = (val, options) => {
    const { rank } = options;
    // 重置职级
    setRank && (setRank(rank));
    // 重置表单岗位id
    onChange && (onChange(val));
  };

  return (
    <Select
      value={value}
      onChange={onChangeVal}
      placeholder="请选择"
      disabled={disabled}
    >
      {
        data.map((i) => {
          return (
            <Option
              value={i.job_info._id}
              rank={i.job_info.rank}
              key={i.job_info._id}
            >{i.job_info.name}</Option>
          );
        })
      }
    </Select>
  );
};

function mapStateToProp({ oaCommon: { accountDep } }) {
  return { accountDep };
}

export default connect(mapStateToProp)(PostFlow);
