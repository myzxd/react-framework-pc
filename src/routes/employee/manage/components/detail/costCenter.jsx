/**
 *  成本中心(详情)
 * */
import is from 'is_js';
import dot from 'dot-prop';
import React from 'react';
import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import { ExpenseCostCenterType } from '../../../../../application/define';

function CostCenterDetail(props) {
  // 渲染表单信息
  const renderForm = () => {
    const employeeDetail = dot.get(props, 'employeeDetail', {});
    const platformNames = dot.get(employeeDetail, 'platform_names', []);
    const supplierNames = dot.get(employeeDetail, 'supplier_names', []);
    const cityNames = dot.get(employeeDetail, 'city_names', []);
    const formItems = [
      {
        label: '平台',
        form: <span>{is.existy(platformNames) && is.not.empty(platformNames) ?
          platformNames : '--'}</span>,
      },
      {
        label: '供应商',
        form: <span>{is.existy(supplierNames) && is.not.empty(supplierNames) ?
          supplierNames : '--'}</span>,
      },
      {
        label: '城市',
        form: <span>{is.existy(cityNames) && is.not.empty(cityNames) ?
          cityNames : '--'}</span>,
      },
    ];
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
    );
  };

  // 渲染成本中心
  const renderCostCenter = () => {
    const employeeDetail = dot.get(props, 'employeeDetail', {});
    const formItems = [
      {
        label: '成本中心',
        key: 'costCenter',
        form: employeeDetail.cost_center_type ?
        ExpenseCostCenterType.description(employeeDetail.cost_center_type) : '--',
      },
    ];
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
    );
  };

  const employeeDetail = dot.get(props, 'employeeDetail', {});
  return (
    <CoreContent title="成本信息">

      {/* 渲染成本中心 */}
      {renderCostCenter()}
      {/* 渲染表单信息 */}
      {employeeDetail.cost_center_type ? renderForm() : null}
    </CoreContent>
  );
}

export default CostCenterDetail;
