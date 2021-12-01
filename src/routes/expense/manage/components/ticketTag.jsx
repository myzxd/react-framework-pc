/*
 * 审批管理 - 基础设置 - 付款审批 - 验票标签
 */
import React, { useEffect } from 'react';
import { connect } from 'dva';

import { Select } from 'antd';

const Option = Select.Option;

const TicketTag = ({
  dispatch,
  ticketTags,
  disabled = false,
  onChange,
  value,
  ...props
}) => {
  const { data = [] } = ticketTags;

  useEffect(() => {
    const payload = {
      page: 1,
      limit: 9999,
    };

    dispatch({ type: 'ticketTag/getTicketTags', payload });
  }, [dispatch]);

  return (
    <Select
      placeholder="请选择"
      allowClear
      disabled={disabled}
      mode="multiple"
      showArrow
      onChange={onChange}
      value={value}
      {...props}
    >
      {
        data.map((tag) => {
          return <Option value={tag._id} key={tag._id} title={tag.name}>{tag.name}</Option>;
        })
      }
    </Select>
  );
};

const mapStateToProps = ({ ticketTag: { ticketTags } }) => ({ ticketTags });

export default connect(mapStateToProps)(TicketTag);
