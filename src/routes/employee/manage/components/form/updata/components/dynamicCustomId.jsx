/**
 * 人员编辑页第三方ID列表模块
 */
import dot from 'dot-prop';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import moment from 'moment';
import { CustomListType } from '../../../../../../../application/define';

import { DeprecatedCoreForm } from '../../../../../../../components/core';

class DynamicComponent extends Component {

  static propTypes = {
    employeeDetail: PropTypes.object,
  }

  static defaultProps = {
    employeeDetail: {},
  }

  // 渲染三方id
  renderCustomId = () => {
    const { employeeDetail } = this.props;
    const customList = dot.get(employeeDetail, 'custom_data_list', []); // 第三方平台ID
    if (customList.length > 0) {
      return (
        <div>
          {
            customList.map((item, index) => {
              if (item.state !== CustomListType.deleted) {
                const custimIdItems = [];
                custimIdItems.push(
                  {
                    form: item.platform_type ? <span key={index}>{`${item.platform_type_name}_${item.custom_id}`}</span> : item.custom_id,
                  },
                  {
                    form: moment(String(item.able_date)).format('YYYY-MM-DD'),
                  },
                );
                if (item.state === CustomListType.invalid) {
                  custimIdItems.push({
                    form: '（已终止）',
                  });
                }
                return <DeprecatedCoreForm items={custimIdItems} cols={3} key={index} />;
              }
            })
          }
        </div>
      );
    } else {
      return dot.get(employeeDetail, 'custom_id', '--') || '--';
    }
  }

  // 渲染第三方平台ID新建
  renderIDCreate = () => {
    const formItems = [
      {
        label: '第三方平台ID',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 21 } },
        form: this.renderCustomId(),
      },
    ];
    return <DeprecatedCoreForm items={formItems} cols={3} layout={formItems} />;
  }

  render() {
    return (
      <div>
        {/* 第三方平台ID*/}
        {this.renderIDCreate()}
      </div>
    );
  }
}

export default connect()(DynamicComponent);
