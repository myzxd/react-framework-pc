/**
 * 组织架构 - 岗位管理 = 查询组件
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

import {
  DeprecatedCoreSearch,
  CoreContent,
} from '../../../components/core';
import AllPost from './component/allPost';

class Search extends React.Component {
  static propTypes = {
    onSearch: PropTypes.func,
    onReset: PropTypes.func,
  }

  static defaultProps = {
    onSearch: () => {},
    onReset: () => {},
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    const { resetSearch } = nextProps;
    // 重置查询条件
    if (resetSearch === true && prevState.form.resetFields) {
      prevState.form.resetFields();
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      form: {},
    };
  }

  onHookForm = (form) => {
    this.setState({
      form,
    });
  }

  onSearchVal = (val) => {
    const { onSearch } = this.props;
    onSearch({ ...val, limit: 30, page: 1 });
  };

  renderSearch = () => {
    const { onReset } = this.props;
    const items = [
      {
        label: '岗位名称',
        form: form => (form.getFieldDecorator('staffName')(
          <AllPost />,
        )),
      },
      {
        label: '岗位编号',
        form: form => (form.getFieldDecorator('code')(
          <Input placeholder="请输入岗位编号" />,
        )),
      },
      {
        label: '岗位职级',
        form: form => (form.getFieldDecorator('rank')(
          <Input placeholder="请输入岗位职级" />,
        )),
      },
      {
        label: '审批岗标签',
        form: form => (form.getFieldDecorator('tags')(
          <Input placeholder="请输入审批岗位标签" />,
        )),
      },
    ];

    const searchProps = {
      items,
      onSearch: this.onSearchVal,
      onHookForm: this.onHookForm,
      onReset,
    };

    return <CoreContent><DeprecatedCoreSearch {...searchProps} /></CoreContent>;
  }

  render() {
    return this.renderSearch();
  }
}

export default Search;

