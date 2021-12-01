/**
 * 费用管理 - 审批监控 - 搜索组件 Expense/Statistics
 */
import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Input,
  Select,
  DatePicker,
} from 'antd';

import { DeprecatedCoreSearch } from '../../../components/core/';
import styles from './index.less';

const { Option } = Select;
const { MonthPicker } = DatePicker;

class Search extends Component {
  static propTypes = {
    platforms: PropTypes.array,
    onSearch: PropTypes.func,
    onChangeMonth: PropTypes.func,
  }

  static defaultProps = {
    platforms: [],
    onSearch: () => {},
    onChangeMonth: () => {},
  }

  // 查询
  onSearch = (val) => {
    const { onSearch } = this.props;

    // 处理月份
    const value = { ...val };
    const {
      month,
    } = val;

    // 熟宣月份
    if (month) {
      value.month = moment(month).format('YYYYMM');
    }
    onSearch && onSearch(value);
  }

  // 重置
  onReset = () => {
    const { onSearch } = this.props;
    onSearch && onSearch({});
  }

  // 更改时间
  onChangeMonth = (val) => {
    const { onChangeMonth } = this.props;
    onChangeMonth && onChangeMonth(val);
  }

  // 筛选月份时间限制
  disabledDate = (current) => {
    return current && current > moment(new Date());
  }

  // 渲染查询组件
  renderSearch = () => {
    const { platforms = [] } = this.props;
    const items = [
      {
        label: '平台',
        form: form => (form.getFieldDecorator('platforms')(
          <Select
            showArrow
            placeholder="请选择平台"
            allowClear
            optionFilterProp="children"
            mode="multiple"
          >
            {
              platforms.map((item) => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                );
              })
            }
          </Select>,
        )),
      },
      {
        label: '审批流名称',
        form: form => (form.getFieldDecorator('approvalFlow')(
          <Input
            placeholder="请输入审批流名称"
            allowClear
          />,
        )),
      },
      {
        label: '筛选月份',
        form: form => (form.getFieldDecorator('month', {
          initialValue: moment(new Date()),
        })(
          <MonthPicker
            placeholder="请筛选月份"
            allowClear
            disabledDate={this.disabledDate}
            onChange={this.onChangeMonth}
          />,
        )),
      },
    ];


    const props = {
      items,
      onSearch: this.onSearch,
      onReset: this.onReset,
    };

    return (
      <div className={styles.searchWrap}>
        <DeprecatedCoreSearch {...props} />
      </div>
    );
  }

  render() {
    return this.renderSearch();
  }
}

export default Search;
