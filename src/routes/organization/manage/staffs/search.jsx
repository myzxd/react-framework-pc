/**
 * 组织架构 - 部门管理 = 岗位编制tab -  查询组件
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

import {
  DeprecatedCoreSearch,
  CoreContent,
} from '../../../../components/core';

class Search extends React.Component {
  renderSearch = () => {
    const { onSearch, onReset } = this.props;
    const items = [
      {
        label: '岗位名称',
        form: form => (form.getFieldDecorator('name')(
          <Input placeholder="请输入岗位名称" />,
        )),
      },
    ];

    const searchProps = {
      items,
      onSearch,
      onReset,
    };

    return <CoreContent><DeprecatedCoreSearch {...searchProps} /></CoreContent>;
  }

  render() {
    return this.renderSearch();
  }
}

Search.propTypes = {
  onSearch: PropTypes.func,
  onReset: PropTypes.func,
};

Search.defaultProps = {
  onSearch: () => {},
  onReset: () => {},
};

export default Search;

