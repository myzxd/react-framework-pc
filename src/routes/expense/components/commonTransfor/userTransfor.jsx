/**
 * 穿梭框 - 按用户
 */
import _ from 'lodash';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Transfer } from 'antd';

import style from './style.css';

class UserTransfor extends Component {

  static propTypes = {
    allAccountNameTree: PropTypes.array, // 账号树
  }

  componentDidMount = () => {
    // 获取数据
    this.props.dispatch({ type: 'applicationCommon/fetchAllAccountName' });
  }

  // 穿梭框改变值
  onChangetargetKeys = (values) => {
    const { onChange, allAccountNameTree } = this.props;

    // 取数组中的交集, 去掉离职人员
    const accountIds = allAccountNameTree.map(item => item.key);
    const intersection = _.intersection(accountIds, values);
    if (onChange) {
      onChange(intersection);
    }
  }


  render =() => {
    return (
      <Transfer
        dataSource={this.props.allAccountNameTree}
        showSearch
        onChange={this.onChangetargetKeys}
        targetKeys={this.props.value}
        render={item => item.title}
        className={style['app-comp-expense-user-transfor']}
        listStyle={{
          height: 400,
        }}
        titles={['全选／合计', '全选／合计']}
      />
    );
  }
}


function mapStateToProps({ applicationCommon }) {
  return { allAccountNameTree: dot.get(applicationCommon, 'allAccount.nameTree', []) };
}

export default connect(mapStateToProps)(UserTransfor);
