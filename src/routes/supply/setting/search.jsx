/**
 * 物资管理 - 物资设置 - 搜索组件  Supply/Setting
 */
import is from 'is_js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { CoreContent, DeprecatedCoreSearch } from '../../../components/core';
import { CommonSelectPlatforms } from '../../../components/common';

class Search extends Component {
  static propTypes = {
    onSearch: PropTypes.func, // 搜索回调
  }
  static defaultProps = {
    onSearch: () => {},
  }
  constructor(props) {
    super(props);
    this.state = {
      search: {
        platforms: undefined,  // 平台
      },
    };
  }

  // 重置
  onReset = () => {
    const { onSearch } = this.props;
    const params = {
      page: 1,
      limit: 30,
    };
    this.setState({ search: params });
    // 重置搜索
    if (onSearch) {
      onSearch(params);
    }
  }

  // 搜索
  onSearch = (values) => {
    const { onSearch } = this.props;
    const { platforms } = values;
    const params = {
      page: 1,
      limit: 30,
    };

    // 判断平台是否有值
    if (is.existy(platforms)) {
      params.platforms = platforms;
    }
    if (onSearch) {
      onSearch(params);
    }
  }

  // 搜索功能
  render = () => {
    const { platforms } = this.state;
    const items = [
      {
        label: '平台',
        form: form => (form.getFieldDecorator('platforms', { initialValue: platforms })(
          <CommonSelectPlatforms showArrow allowClear showSearch mode="multiple" optionFilterProp="children" placeholder="请选择平台" />,
        )),
      },
    ];

    const props = {
      items,
      onReset: this.onReset,
      onSearch: this.onSearch,
      onHookForm: this.onHookForm,
    };

    return (
      <CoreContent>
        <DeprecatedCoreSearch {...props} />
      </CoreContent>
    );
  };
}

export default Search;
