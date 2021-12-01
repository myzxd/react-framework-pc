/**
 * 服务费结算 - 基础设置 - 结算指标设置 Finance/Config/Index
 */
import is from 'is_js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'dva';
import { CoreContent } from '../../../../components/core';
import { CommonSelectPlatforms } from '../../../../components/common';
import IndexTemplate from './template';
import { authorize } from '../../../../application';
import styles from './style/index.less';

const platforms = authorize.platform();

class chooseTemplate extends Component {
  static propTypes = {
    salarySpecifications: PropTypes.object,
  };

  static defaultProps = {
    salarySpecifications: {},
  };

  constructor(props) {
    super(props);
    this.state = {};
    let salarySelected;
    if (is.existy(platforms) && is.not.empty(platforms)) {
      salarySelected = platforms[0].id;
    }
    // 默认参数
    this.private = {
      searchParams: {
        page: 1,
        limit: 30,
        salarySelected,  // 查询平台默认值
      },
    };
  }

  // 刷新页面请求数据
  componentDidMount() {
    const { searchParams } = this.private;
    this.props.dispatch({ type: 'financeConfigIndex/fetchSalarySpecifications', payload: searchParams });
  }

  // 查询
  onSearch = (params = {}) => {
    const salarySelected = this.private.searchParams.salarySelected;
    // 保存搜索的参数
    this.private.searchParams = params;
    if (!this.private.searchParams.page) {
      this.private.searchParams.page = 1;
    }
    if (!this.private.searchParams.limit) {
      this.private.searchParams.limit = 30;
    }
    this.private.searchParams.salarySelected = salarySelected;
    this.props.dispatch({ type: 'financeConfigIndex/fetchSalarySpecifications', payload: this.private.searchParams });
  }
  // 切换指标
  onChangeSalarySpecifications = (value) => {
    const { searchParams } = this.private;
    searchParams.salarySelected = value;
    this.onSearch();
  }

  render() {
    const { salarySpecifications } = this.props;
    const { salarySelected } = this.private.searchParams;
    let title;

    if (is.existy(platforms) && is.not.empty(platforms)) {
      title = `${platforms.filter(val => val.id === salarySelected)[0].name}指标库`;
    }
    // 标题
    // 扩展的标题插件（用于选择平台）
    const titleExt = (
      <CommonSelectPlatforms
        value={salarySelected}
        className={styles['app-comp-finance-config-title-ext']}
        onChange={this.onChangeSalarySpecifications}
      />
    );
    // 父传子参数
    const props = {
      salarySpecifications,
      onSearch: this.onSearch,
    };
    return (
      <CoreContent title={title} titleExt={titleExt}>
        {/* 渲染模版 */}
        <IndexTemplate {...props} />
      </CoreContent>
    );
  }
}

function mapStateToProps({ financeConfigIndex: { salarySpecifications } }) {
  return { salarySpecifications };
}

export default connect(mapStateToProps)(chooseTemplate);
