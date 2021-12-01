/**
 * 业务范围信息（编辑）
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import { FileType } from '../../../../../../application/define';

class UpdataBusinessInfo extends Component {
  static propTypes = {
    employeeDetail: PropTypes.object, // 人员详情
  }

  static defaultProps = {
    employeeDetail: {},
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 渲染商圈（备用）
  renderBizDistrict = (arr) => {
    if (!Array.isArray(arr)) return;
    return arr.reduce((acc, cur, idx) => {
      if (idx === 0) return cur;
      return `${acc},${cur}`;
    }, '');
  }

  // 渲染表单信息
  renderForm = () => {
    const {
      platform_names: platformNames,             // 平台
      supplier_names: supplierNames,             // 供应商
      city_names: cityNames,                     // 城市
      biz_district_names: bizDistrictNames = [], // 商圈
    } = this.props.employeeDetail;
    const formItems = [
      {
        label: '平台',
        form: <span>{platformNames}</span>,
      },
      {
        label: '主体',
        form: <span>{supplierNames}</span>,
      },
      {
        label: '城市',
        form: <span>{cityNames}</span>,
      },
      {
        label: '商圈',
        form: <span>{bizDistrictNames.length === 0 ? '--' : this.renderBizDistrict(bizDistrictNames)}</span>,
      },
    ];
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
    return (
      <Form layout="horizontal">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </Form>
    );
  }

  render() {
    // 档案类型
    const fileType = this.props.employeeDetail.profile_type;
    // 档案类型为人员档案时不显示业务范围
    return (
      `${fileType}` === `${FileType.staff}`
      || <CoreContent title="业务范围">
          {/* 渲染表单信息 */}
          {this.renderForm()}
        </CoreContent>
    );
  }
}

export default UpdataBusinessInfo;
