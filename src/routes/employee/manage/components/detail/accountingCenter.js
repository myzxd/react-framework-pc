/**
 * 核算中心
 * */
import dot from 'dot-prop';
import moment from 'moment';
import React from 'react';

import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';

function ComponentAccountingCenter(props) {
  const employeeDetail = dot.get(props, 'employeeDetail', {});

  const formItems = [
    {
      label: '结算周期',
      // 展示查看的当月时间就好
      form: moment().format('YYYY-MM'),
    },
    {
      label: '归属团队类型',
      form: dot.get(employeeDetail, 'cost_team_type', '--'),
    },
    {
      label: '归属团队',
      form: dot.get(employeeDetail, 'cost_team_info.name', '--'),
    },
  ];
  const layout = { labelCol: { span: 2 }, wrapperCol: { span: 16 } };

  return (
    <CoreContent>
      <DeprecatedCoreForm items={formItems} layout={layout} />
    </CoreContent>
  );
}

export default ComponentAccountingCenter;
