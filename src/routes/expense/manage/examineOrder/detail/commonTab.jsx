/**
 * 付款审批 - tab
 */
import React, { Component } from 'react';
import { CoreTabs } from '../../../../../components/core';
import { Alternatives } from '../../../../../application/define';

import styles from './commontab.less';

class CommonTab extends Component {
  constructor(props) {
    super();
    this.state = {
      visible: false, // 是否显示弹窗
    };
    this.private = {
      dispatch: props.dispatch,
    };
  }

  // // 更新状态
  // componentWillReceiveProps(props) {
  //   this.setState({
  //   });
  // }

  onChangeTab = (v) => {
    if (this.props.onChange) {
      this.props.onChange(v);
    }
  }

  renderTabs = () => {
    const items = [
      {
        title: Alternatives.description(Alternatives.often),
        key: Alternatives.often,
      },
      {
        title: Alternatives.description(Alternatives.finance),
        key: Alternatives.finance,
      },
    ];
    const props = {
      items,
      onChange: this.onChangeTab,
      ...this.props,
    };
    return (
      <CoreTabs {...props} />
    );
  }

  render = () => {
    return (
      <div className="commonTabBox">
        <div className={styles['app-comp-expense-common-tab-title']}>{this.props.title}</div>
        <div>
          {this.renderTabs()}
        </div>
      </div>
    );
  }
}

export default CommonTab;
