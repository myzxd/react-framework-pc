/**
 * 费用管理 / 房屋管理 / 续租编辑 / 基本信息
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../../../components/core/';

class BasisInfo extends Component {

  static propTypes = {
    detail: PropTypes.object, // 房屋信息
  };

  static defaultProps = {
    detail: {}, // 默认为空
  }

  // 渲染房屋基本信息
  renderBasisInfo = () => {
    // 房屋信息
    const { detail = {} } = this.props;

    const {
      id, // 合同编号
      houseId, // 房屋编号
      houseAddress, // 房屋地址
    } = detail;

    const formItems = [
      {
        label: '合同编号',
        form: id || '--',
      },
      {
        label: '房屋编号',
        form: houseId || '--',
      },
      {
        label: '房屋地址',
        form: houseAddress || '--',
      },
    ];

    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    // 列表扩展
    const titleExt = (
      <a
        key="detail"
        target="_blank"
        rel="noopener noreferrer"
        href={`/#/Expense/Manage/House/Detail?id=${id}`}
      >
        更多详情
      </a>
    );

    return (
      <CoreContent
        title="基本信息"
        titleExt={titleExt}
      >
        <DeprecatedCoreForm
          items={formItems}
          cols={3}
          layout={layout}
        />
      </CoreContent>
    );
  }

  render = () => {
    return this.renderBasisInfo();
  }
}

export default BasisInfo;
