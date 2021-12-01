/**
 * 资产管理 - 商圈管理 - 商圈标签管理 - 查询组件
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

import {
  DeprecatedCoreSearch,
  CoreContent,
} from '../../../../components/core';

class Search extends React.Component {
  static propTypes = {
    onSearch: PropTypes.func,
    onReset: PropTypes.func,
  }

  static defaultProps = {
    onSearch: () => {},
    onReset: () => {},
  }

  renderSearch = () => {
    const { onSearch, onReset } = this.props;
    const items = [
      {
        label: '标签名称',
        form: form => (form.getFieldDecorator('name')(
          <Input placeholder="请输入标签名称" />,
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
  onSearch: {},
  onReset: {},
};

export default Search;

