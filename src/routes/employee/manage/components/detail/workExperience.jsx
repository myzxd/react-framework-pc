/**
 *  工作经历
 * */
import dot from 'dot-prop';
import React from 'react';
import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';

import {
  FileType,
} from '../../../../../application/define';

function WorkExperience() {
  const workExperienceForms = (props) => {
    const employeeDetail = dot.get(props, 'employeeDetail', {});
    const workExperience = dot.get(employeeDetail, 'work_experience', []);
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };

    const forms = workExperience.map((item, index) => {
      const formItems = [
        {
          label: '工作单位',
          form: dot.get(item, 'employer', '--') || '--',
        }, {
          label: `${employeeDetail.profile_type}` === `${FileType.staff}` ? '曾任职岗位' : '职位',
          form: dot.get(item, 'position', '--') || '--',
        }, {
          label: '证明人姓名',
          form: dot.get(item, 'certifier_name', '--') || '--',
        }, {
          label: '证明人电话',
          form: dot.get(item, 'proof_phone', '--') || '--',
        }, {
          label: '工作时间',
          form: dot.get(item, 'work_start_time') && dot.get(item, 'work_end_time') ? `${dot.get(item, 'work_start_time')} - ${dot.get(item, 'work_end_time')}` : '--',
        },
      ];
      return <DeprecatedCoreForm key={index} items={formItems} cols={3} layout={layout} />;
    });
    return forms;
  };

  return (
    <CoreContent title="工作经历">
      {workExperienceForms()}
    </CoreContent>
  );
}

export default WorkExperience;
