/**
 * 公用组件，成员列表信息
 */
import is from 'is_js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';

import { CoreSelect } from '../../../../../components/core';
import { omit } from '../../../../../application/utils';

const Option = CoreSelect.Option;

class EmployeeSelect extends Component {
  static propTypes = {
    businessOwner: PropTypes.array,
    tiemStamp: PropTypes.number,
  };

  static defaultProps = {
    businessOwner: [],
    tiemStamp: 0,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'ownerBusiness/reduceBusinessOwner',
      payload: {},
    });
  }

  componentDidUpdate(preProps) {
    const { tiemStamp } = this.props;
    // 判断时间戳是否相等
    if (tiemStamp !== preProps.tiemStamp) {
      this.props.dispatch({
        type: 'ownerBusiness/reduceBusinessOwner',
        payload: {},
      });
    }
  }

  // 搜索身份证号
  onSearch = _.debounce((value) => {
    // 有值才进行查询
    if (value) {
      this.props.dispatch({
        type: 'ownerBusiness/fetchOwnerId',
        payload: {
          name: value,
        },
      });
    }
  }, 800)

  // 回调函数
  onChange=(e) => {
    const { businessOwner: dataSource = [] } = this.props;
    // 过滤数据，匹配当前选项
    const result = dataSource.filter(item => item._id === e);
    if (this.props.onChange) {
      this.props.onChange(e, result[0]);
    }
  }

  render() {
    const { businessOwner: dataSource = [] } = this.props;
    let options;
    if (is.not.empty(dataSource) && is.existy(dataSource)) {
      options = dataSource.map((item) => {
        return <Option value={item._id} key={item._id}>{`${item.staff_info.name}（${item._id}）`}</Option>;
      });
    }

      // 去除Antd Select不需要的props
    const omitedProps = omit([
      'dispatch',
      'businessOwner',
      'tiemStamp',
      'platformCode',
      'supplierId',
    ], this.props);

    // 默认传递所有上级传入的参数
    const props = {
      ...omitedProps,
      placeholder: '请输入姓名搜索',
      showSearch: true,
      defaultActiveFirstOption: false,
      showArrow: false,
      allowClear: true,
      filterOption: false,
      onChange: this.onChange,
      onSearch: this.onSearch,
      notFoundContent: null,
    };
    return (
      <CoreSelect {...props} style={{ width: 260 }}>
        {options}
      </CoreSelect>
    );
  }
}

const mapStateToProps = ({ ownerBusiness: { businessOwner } }) => {
  return { businessOwner };
};

export default connect(mapStateToProps)(EmployeeSelect);
