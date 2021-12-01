/**
 * 房屋管理/房屋详情/归属组件
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  ExpenseCostCenterType,
} from '../../../../../../application/define';
import {
  DeprecatedCoreForm,
  CoreContent,
} from '../../../../../../components/core';

class Ascription extends Component {

  static propTypes = {
    houseContractDetail: PropTypes.object, // 房屋详情数据
  };

  static defaultProps = {
    houseContractDetail: {}, // 默认为空
  }

  // 渲染归属信息
  renderAscriptionInfo = () => {
    const { houseContractDetail = {} } = this.props;
    const {
      costCenterType,
      platformNames = [],
      allocationModeTitle,
    } = houseContractDetail;
    const formItems = [
      {
        label: '成本中心',
        form: costCenterType ? ExpenseCostCenterType.description(costCenterType) : '--',
      },
      {
        label: '平台',
        form: platformNames.length > 0 ? platformNames[0] : '--',
      },
      {
        label: '分摊模式',
        form: allocationModeTitle || '--',
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

    return (
      <DeprecatedCoreForm
        items={formItems}
        layout={layout}
        cols={4}
      />
    );
  }

  // 渲染分摊信息
  renderShareInfo = () => {
    const { houseContractDetail } = this.props;
    const {
      costAllocationList = [],
    } = houseContractDetail;
    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
    const formLines = costAllocationList.map((v) => {
      const { platformName, supplierName, cityName, bizDistrictName } = v;
      let uniqKey = '';
      const formLine = [];
      if (platformName) {
        uniqKey += platformName;
        formLine.push({
          label: '平台',
          form: platformName,
        });
      }
      if (supplierName) {
        uniqKey += supplierName;
        formLine.push({
          label: '供应商',
          form: supplierName,
        });
      }
      if (cityName) {
        uniqKey += cityName;
        formLine.push({
          label: '城市',
          form: cityName,
        });
      }
      if (bizDistrictName) {
        uniqKey += bizDistrictName;
        formLine.push({
          label: '商圈',
          form: bizDistrictName,
        });
      }
      return (
        <DeprecatedCoreForm
          key={uniqKey}
          items={formLine}
          layout={layout}
          cols={4}
        />
      );
    });
    return formLines;
  }

  // 渲染发票抬头
  renderInvoice = () => {
    const { houseContractDetail } = this.props;
    const formItems = [{
      label: '发票抬头',
      form: houseContractDetail.agentInvoiceTitle || '--',
    }];
    const layout = { labelCol: { span: 2 }, wrapperCol: { span: 5 } };

    return (
      <DeprecatedCoreForm items={formItems} layout={layout} cols={1} />
    );
  }

  // 渲染成本归属
  renderAscription = () => {
    return (
      <CoreContent title="成本归属/分摊">

        {/* 渲染归属信息 */}
        {this.renderAscriptionInfo()}

        {/* 渲染分摊信息 */}
        {this.renderShareInfo()}

        {/* 发票抬头 */}
        {this.renderInvoice()}
      </CoreContent>
    );
  }

  render = () => {
    return (
      <div>
        {/* 渲染成本分摊 */}
        {this.renderAscription()}
      </div>
    );
  }
}

export default Ascription;
