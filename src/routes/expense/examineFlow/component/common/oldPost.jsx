/**
 * 旧岗位select（非组织架构）
 */
import { connect } from 'dva';
import { Select } from 'antd';
import React, { useEffect } from 'react';

import { ExpenseExaminePostType } from '../../../../../application/define';
import { utils } from '../../../../../application';

const { Option } = Select;

const Post = ({
  dispatch,
  examinePostData = {}, // 旧岗位数据
  ...props
}) => {
  useEffect(() => {
    if (examinePostData
      && Object.keys(examinePostData).length > 0
      && utils.dotOptimal(examinePostData, 'data', []).length > 0) return;

    dispatch({
      type: 'expenseExamineFlow/fetchExaminePost',
      payload: {
        meta: { page: 1, limit: 100000 },
        state: ExpenseExaminePostType.normal, // 状态
      },
    });
  }, [dispatch]);

  const { data = [] } = examinePostData;
  if (!data || data.length < 1) return <Select placeholder="请选择" />;

  return (
    <Select
      {...props}
    >
      {
        data.map((p) => {
          return <Option value={p._id} key={p._id}>{p.post_name}</Option>;
        })
      }
    </Select>
  );
};

function mapStateToProps({
  expenseExamineFlow: { examinePostData },
}) {
  return { examinePostData };
}

export default connect(mapStateToProps)(Post);
