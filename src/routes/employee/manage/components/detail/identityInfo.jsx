/**
 * 身份信息
 * */
import dot from 'dot-prop';
import React from 'react';

import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import { wrapImageElement } from './util';
import { PaperworkType } from '../../../../../application/define';

function ComponentDetailIdentityInfo(props) {
  const renderHC = () => {
    const employeeDetail = dot.get(props, 'employeeDetail', {});

    const formItems = [
      {
        label: '证件类型',
        form: PaperworkType.description(employeeDetail.health_certificate_type),
      }, {
        label: '证件号码',
        form: dot.get(employeeDetail, 'health_certificate_no', '--') || '--',
      },
      {
        label: '有效期',
        form: dot.get(employeeDetail, 'health_certificate_start') && dot.get(employeeDetail, 'health_certificate_end') ? `${dot.get(employeeDetail, 'health_certificate_start')} - ${dot.get(employeeDetail, 'health_certificate_end')}` : '--',
      },
      wrapImageElement({
        label: '证件正面照',
        form: dot.get(employeeDetail, 'health_certificate_url', '--') || '--',
      }), wrapImageElement({
        label: '证件反面照',
        form: dot.get(employeeDetail, 'health_certificate_back_url', '--') || '--',
      }), wrapImageElement({
        label: '手持证件半身照',
        form: dot.get(employeeDetail, 'health_certificate_in_hand_url', '--') || '--',
      }),
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    return (
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
    );
  };

  const renderID = () => {
    const employeeDetail = dot.get(props, 'employeeDetail', {});
    const formItems = [
      {
        label: '证件类型',
        form: PaperworkType.description(employeeDetail.identity_certificate_type),
      },
      {
        label: '证件号码',
        form: dot.get(employeeDetail, 'identity_card_id', '--') || '--',
      },
      { label: '', form: '' }, // 空进行占位
      wrapImageElement({
        label: '身份证正面照',
        form: dot.get(employeeDetail, 'identity_card_front_url', '--') || '--',
      }), wrapImageElement({
        label: '身份证反面照',
        form: dot.get(employeeDetail, 'identity_card_back_url', '--') || '--',
      }), wrapImageElement({
        label: '手持证件半身照',
        form: dot.get(employeeDetail, 'identity_card_in_hand_url', '--') || '--',
      }),
    ];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    return (
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
    );
  };

  const renderDL = () => {
    const employeeDetail = dot.get(props, 'employeeDetail', {});

    const formItems = [
      {
        label: '证件类型',
        form: PaperworkType.description(employeeDetail.drive_certificate_type),
      }, {
        label: '证件号码',
        form: dot.get(employeeDetail, 'drive_certificate_no', '--') || '--',
      },
      { label: '', form: '' }, // 空进行占位
      wrapImageElement({
        label: '证件正面照',
        form: dot.get(employeeDetail, 'drive_certificate_front_url', '--') || '--',
      }), wrapImageElement({
        label: '证件反面照',
        form: dot.get(employeeDetail, 'drive_certificate_back_url', '--') || '--',
      }), wrapImageElement({
        label: '手持证件半身照',
        form: dot.get(employeeDetail, 'drive_certificate_in_hand_url', '--') || '--',
      }),
    ];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    return (
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
    );
  };

  return (
    <CoreContent title="身份信息">
      {/* 身份证件 */}
      {renderID()}
      {/* 健康证件 */}
      {renderHC()}
      {/* 驾驶证件 */}
      {renderDL()}
    </CoreContent>
  );
}


export default ComponentDetailIdentityInfo;
