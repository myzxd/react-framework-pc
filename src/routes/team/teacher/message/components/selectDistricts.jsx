/**
 * 私教指导 - 新增指导意见 — 商圈选择
 */
import { connect } from 'dva';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

const { Option } = Select;

class SelectDistricts extends Component {
  static propTypes = {
    teamAccountDistricts: PropTypes.object, // 私教账户商圈信息
  }

  static defaultProps = {
    teamAccountDistricts: {},
  }

  componentDidMount() {
    const payload = {};
    const { _id } = this.props.teamAccountDistricts;
    // 如果store中有数据，则不请求接口
    if (_id) return;
    this.props.dispatch({
      type: 'teamMessage/fetchTeamAccountDistricts',
      payload,
    });
  }

  render() {
    const {
      biz_district_list: bizDistrictList = [],
     } = this.props.teamAccountDistricts;
    return (
      <Select {...this.props}>
        {
          bizDistrictList.map(item => (<Option key={item._id} value={item._id}>{item.name}</Option>))
        }
      </Select>
    );
  }
}

const mapStateToProps = ({ teamMessage: { teamAccountDistricts } }) => {
  return { teamAccountDistricts };
};

export default connect(mapStateToProps)(SelectDistricts);
