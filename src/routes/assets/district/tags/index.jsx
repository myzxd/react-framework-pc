/**
 * 资产管理 - 商圈管理 - 商圈标签管理
 **/
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import Search from './search';
import Content from './content';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.private = {
      searchParams: {
        limit: 30,
        page: 1,
      },
    };
  }

  componentDidMount() {
    this.getDistrictTags({ ...this.private.searchParams });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'districtTag/resetDistrictTags', payload: {} });
  }

  // 查询
  onSearch = (val = {}) => {
    const {
      searchParams,
    } = this.private;

    const params = {
      ...searchParams,
      ...val,
    };

    this.private.searchParams = { ...params };
    this.getDistrictTags(params);
  }

  // 重置
  onReset = () => {
    const params = {
      limit: 30,
      page: 1,
    };

    this.private.searchParams = { ...params };

    this.getDistrictTags(params);
  }

  // 修改分页
  onChangePage = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
  }

  // 获取标签列表
  getDistrictTags = (params) => {
    const { dispatch } = this.props;
    dispatch({ type: 'districtTag/getDistrictTags', payload: params });
  }

  render() {
    const { districtTags, dispatch } = this.props;
    const { page } = this.private.searchParams;
    return (
      <div>
        <Search onSearch={this.onSearch} onReset={this.onReset} />
        <Content data={districtTags} dispatch={dispatch} onChangePage={this.onChangePage} onSearch={this.onSearch} page={page} />
      </div>
    );
  }
}

function mapStateToProps({
  districtTag: {
    districtTags,
  },
}) {
  return { districtTags };
}

Index.propTypes = {
  districtTags: PropTypes.object,
};

Index.defaultProps = {
  districtTags: {},
};

export default connect(mapStateToProps)(Index);
