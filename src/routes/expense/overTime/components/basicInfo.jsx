/**
 * 展示加班申请基本信息
 */
import React from 'react';
import PropTypes from 'prop-types';
import { CoreContent, DeprecatedCoreForm } from '../../../../components/core';
import { OaApplicationOrderType } from '../../../../application/define';

export default function BasicInfo(props) {
  const { applyPerson, approvalType, approvalFlow } = props;
  const formItems = [
    { label: '申请人', form: applyPerson },
    { label: '审批类型', form: OaApplicationOrderType.description(approvalType) },
    { label: '审批流程', form: approvalFlow },
  ];
  return (
    <CoreContent title="基本信息">
      <DeprecatedCoreForm cols={3} items={formItems} />
    </CoreContent>
  );
}

BasicInfo.propTypes = {
  applyPerson: PropTypes.string, // 申请人
  approvalType: PropTypes.number, // 审批类型
  approvalFlow: PropTypes.string, // 审批流程
};

BasicInfo.defaultProps = {
  applyPerson: '--', // 申请人
  approvalType: -1, // 审批类型
  approvalFlow: '--', // 审批流程
};
