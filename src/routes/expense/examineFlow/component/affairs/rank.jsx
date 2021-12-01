/**
 * 岗位职级
 */
import _ from 'lodash';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Select, Row, Col } from 'antd';
import style from './style.less';

const { Option } = Select;

const Rank = ({
  dispatch,
  staffList = {}, // 岗位列表
  value,
  onChange,
}) => {
  useEffect(() => {
    dispatch({
      type: 'organizationStaff/getStaffList',
      payload: { limit: 999, page: 1 },
    });
  }, [dispatch]);

  // 岗位数据
  const { data = [] } = staffList;

  // 筛选出职级
  const rankData = data.map(i => i.rank).filter(i => i);

  // 去重
  const uniqData = _.uniqWith(rankData, _.isEqual);

  return (
    <Row>
      <Col span={16}>
        <Select
          value={value}
          placeholder="请选择岗位职级"
          mode="multiple"
          onChange={onChange}
          allowClear
          showArrow
        >
          {
            uniqData.map(i => <Option value={i} key={i}>{i}</Option>)
          }
        </Select>
      </Col>
      <Col span={8}>
        <div
          className={style['affairs-flow-update-node-rank']}
        >岗位职级不选择，默认适用所有职级</div>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ organizationStaff: { staffList } }) => {
  return { staffList };
};

export default connect(mapStateToProps)(Rank);
