/**
 * 下拉选择私教团队
 */
import { connect } from 'dva';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

const { Option } = Select;

class SelectTeachTeam extends Component {
  static propTypes = {
    teamTeachers: PropTypes.object, // 私教团队列表
  }

  static defaultProps = {
    teamTeachers: {
      data: [],
      meta: {},
    },
  }

  componentDidMount() {
    const payload = {
      meta: {
        page: 1,
        limit: 99999,
      },
    };
    this.props.dispatch({
      type: 'teamTeacher/fetchTeamTeachers',
      payload,
    });
  }

  render() {
    const { data } = this.props.teamTeachers;
    return (
      <Select {...this.props}>
        {
          data.map(item => (<Option key={item._id} value={item._id}>{item.name}</Option>))
        }
      </Select>
    );
  }
}

const mapStateToProps = ({ teamTeacher: { teamTeachers } }) => {
  return { teamTeachers };
};

export default connect(mapStateToProps)(SelectTeachTeam);
