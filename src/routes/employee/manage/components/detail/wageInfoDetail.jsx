/**
 * 档案信息
 * */
import dot from 'dot-prop';
import React from 'react';

import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';

function WageInfoDetail(props) {
  const employeeDetail = dot.get(props, 'employeeDetail', {});
  const formItems = [
    {
      label: '工资是否拆分',
      form: dot.get(employeeDetail, 'is_salary_split') ? '是' : '否',
    },
    {
      label: '拆分基数',
      form: employeeDetail.split_base ? Number(employeeDetail.split_base) / 100 : '--',
    },
  ];
  const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
  return (
    <CoreContent title="工资信息">
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
    </CoreContent>
  );
}

export default WageInfoDetail;
