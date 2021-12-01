/**
 * 房屋管理/新建(编辑)/基础信息
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../../components/core';

class BaseInfo extends Component {

  static propTypes = {
    houseContractDetail: PropTypes.object, // 房屋详情数据
  };

  static defaultProps = {
    houseContractDetail: {}, // 默认为空
  }

  render = () => {
    const { houseContractDetail = {} } = this.props;
    const formItems = [
      {
        label: '合同编号',
        form: houseContractDetail.id,
      },
      {
        label: '房屋编号',
        form: houseContractDetail.houseNo,
      },
      /* {
        label: '旧合同编号',
        form: houseContractDetail.fromContractId,
      } */
    ];

    const layout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    return (
      <CoreContent title="基础信息">
        <DeprecatedCoreForm
          items={formItems}
          cols={3}
          layout={layout}
        />
      </CoreContent>
    );
  }
}

export default BaseInfo;
