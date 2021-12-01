/**
 * 穿梭框 - 按岗位
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import { Transfer } from 'antd';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ExpenseExaminePostType } from '../../../../application/define';
import style from './style.css';

class PostTransfor extends Component {

  static propTypes = {
    examinePostData: PropTypes.object, // 账号树
  }

  static defaultProps = {
    examinePostData: {},
  }

  componentDidMount = () => {
    const params = {
      meta: { page: 1, limit: 100000 },
      state: ExpenseExaminePostType.normal, // 状态
    };
    // 获取数据
    this.props.dispatch({ type: 'expenseExamineFlow/fetchExaminePost', payload: params });
  }

  // 穿梭框改变值
  onChangetargetKeys = (values) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(values);
    }
  }


  render =() => {
    const { examinePostData } = this.props;
    const dataSource = dot.get(examinePostData, 'data', []);
    return (
      <Transfer
        dataSource={dataSource}
        showSearch
        rowKey={record => record._id}
        onChange={this.onChangetargetKeys}
        targetKeys={this.props.value}
        render={item => item.post_name}
        className={style['app-comp-expense-post-transfor']}
        listStyle={{
          height: 400,
        }}
        titles={['全选／合计', '全选／合计']}
      />
    );
  }
}

function mapStateToProps({ expenseExamineFlow: { examinePostData } }) {
  return { examinePostData };
}
export default connect(mapStateToProps)(PostTransfor);
