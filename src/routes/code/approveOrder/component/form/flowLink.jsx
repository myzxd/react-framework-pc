/**
 * Code/Team审批管理 - 付款审批 - 审批流链接Select
 */
import { connect } from 'dva';
import React, { useEffect } from 'react';
import {
  Select,
} from 'antd';

const { Option } = Select;

const FlowLink = ({
  dispatch,
  flowLinkList = [],
  value,
  onChange,
}) => {
  useEffect(() => {
    dispatch({
      type: 'codeOrder/getFlowLinkList',
      payload: { page: 1, limit: 9999 },
    });
    return () => {
      dispatch({ type: 'codeOrder/resetFlowLinkList' });
    };
  }, [dispatch]);

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder="请选择"
      allowClear
      showSearch
      optionFilterProp="children"
    >
      {
        flowLinkList.map((i) => {
          return (
            <Option value={i._id} key={i._id}>
              {i.name}
            </Option>
          );
        })
      }
    </Select>
  );
};

const mapStateToProps = ({
  codeOrder: { flowLinkList },
}) => {
  return { flowLinkList };
};

export default connect(mapStateToProps)(FlowLink);
