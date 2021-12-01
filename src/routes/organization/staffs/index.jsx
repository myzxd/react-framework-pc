/**
 * 组织架构 - 岗位管理
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import Search from './search';
import Content from './content';

class Index extends React.Component {
  static propTypes = {
    staffList: PropTypes.object, // 岗位数据
  }

  static defaultProps = {
    staffList: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      resetSearch: false,
    };
    this.private = {
      searchParams: {
        limit: 30,
        page: 1,
      },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'organizationStaff/getStaffList', payload: { ...this.private.searchParams } });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'organizationStaff/resetStaffList', payload: {} });
  }

  // 查询
  onSearch = (val = {}, reast = false) => {
    const { dispatch } = this.props;
    const {
      searchParams,
    } = this.private;

    let params = {
      ...searchParams,
      ...val,
    };
    // 清空查询条件
    if (reast === true) {
      params = {
        limit: 30,
        page: 1,
      };
      this.setState({
        resetSearch: reast,
      });
    } else {
      this.setState({
        resetSearch: false,
      });
    }

    this.private.searchParams = { ...params };
    dispatch({ type: 'organizationStaff/getStaffList', payload: params });
  }

  // 重置
  onReset = () => {
    const { dispatch } = this.props;
    const params = {
      limit: 30,
      page: 1,
    };

    this.private.searchParams = { ...params };

    dispatch({ type: 'organizationStaff/getStaffList', payload: params });
  }

  // 修改分页
  onChangePage = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
  }

  renderContent = () => {
    const { staffList = {}, dispatch } = this.props;
    return (
      <div>
        <Search
          onSearch={this.onSearch}
          onReset={this.onReset}
          resetSearch={this.state.resetSearch}
        />
        <Content
          data={staffList}
          dispatch={dispatch}
          onChangePage={this.onChangePage}
          onSearch={this.onSearch}
          limit={this.private.searchParams.limit}
          page={this.private.searchParams.page}
        />
      </div>
    );
  }
  render() {
    return this.renderContent();
  }
}

function mapStateToProps({
  organizationStaff: {
    staffList,
  },
}) {
  return { staffList };
}

export default connect(mapStateToProps)(Index);
