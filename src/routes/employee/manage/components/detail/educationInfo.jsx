/**
 * 银行卡信息
 * */
import dot from 'dot-prop';
import React from 'react';

import { CoreContent, DeprecatedCoreForm, CorePhotosAmazon } from '../../../../../components/core';
import { HighestEducation } from '../../../../../application/define';

function EducationInfo(props) {
  // 学历照片信息
  const renderDegreePhotos = () => {
    const employeeDetail = dot.get(props, 'employeeDetail', {});
    // 使用身份证，作为命名空间
    const namespace = `ComponentDetailEducationInfo-${dot.get(employeeDetail, 'identity_card_no', '--')}`;

    const value = {
      keys: dot.get(employeeDetail, 'degree', []),
      urls: dot.get(employeeDetail, 'degree_url', []),
    };
    const item = {
      // span: 24,
      label: '学位证照片',
      form: <CorePhotosAmazon domain="staff" isDisplayMode value={value} namespace={namespace} />,
    };

    return item;
  };

  const employeeDetail = dot.get(props, 'employeeDetail', {});
  const academyList = dot.get(employeeDetail, 'academy_list', []) || [];

  const formItems = [
    {
      label: '最高学历',
      form: HighestEducation.description(employeeDetail.highest_education),
    }, {
      label: '专业职称',
      form: dot.get(employeeDetail, 'professional', '--') || '--',
    }, {
      label: '外语及等级',
      form: dot.get(employeeDetail, 'language_level', '--') || '--',
    },
  ];
  const photoFormItem = renderDegreePhotos();
  const photoFormItems = [photoFormItem];
  const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

  return (
    <CoreContent title="教育经历">
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      {
        academyList.map((item, index) => {
          const arr = [
            {
              label: '院校名称',
              form: dot.get(item, 'institution_name', '--') || '--',
            }, {
              label: '学历',
              form: dot.get(item, 'education', '--') || '--',
            }, {
              label: '专业',
              form: dot.get(item, 'profession', '--') || '--',
            }, {
              label: '时间',
              form: dot.get(item, 'start_time') && dot.get(item, 'end_time') ? `${dot.get(item, 'start_time')} - ${dot.get(item, 'end_time')}` : '--',
            },
          ];
          return <DeprecatedCoreForm key={index} items={arr} cols={3} layout={layout} />;
        })
      }
      <DeprecatedCoreForm items={photoFormItems} cols={3} layout={layout} />
    </CoreContent>
  );
}

export default EducationInfo;
