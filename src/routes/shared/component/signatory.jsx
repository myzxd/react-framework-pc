/*
 * 共享登记 -  签订人组件
 */
import React, { useEffect } from 'react';
import { connect } from 'dva';

import { Select } from 'antd';

const Option = Select.Option;

const Signatory = (props) => {
  const { dispatch, ticketTags = {}, onChange, value } = props;

  const { data = [] } = ticketTags;

  useEffect(() => {
    const payload = {
      page: 1,
      limit: 9999,
    };

    dispatch({ type: 'ticketTag/getTicketTags', payload });
  }, []);

  return (
    <Select
      placeholder="请选择"
      allowClear
      onChange={onChange}
      showSearch
      value={value}
      optionFilterProp="children"
    >
      {
        data.map((tag) => {
          return <Option value={tag._id} key={tag._id}>{tag.name}</Option>;
        })
      }
    </Select>
  );
};

const mapStateToProps = ({ ticketTag: { ticketTags } }) => ({ ticketTags });

export default connect(mapStateToProps)(Signatory);
