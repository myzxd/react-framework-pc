/**
 * 审批管理 - 流程审批 - 考勤管理 - 加班管理 - 加班单详情 - 加班人信息
 */
import React from 'react';
import {
  Row,
  Col,
} from 'antd';

import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../components/core';

const Person = (props) => {
  const {
    detail, // 加班单详情
  } = props;

  const {
    actual_apply_name: actualApplyName, // 实际加班人
    platform_name: platformName, // 项目
    city_name: cityName, // 城市
    biz_district_name: bizDistrictName, // 团队
  } = detail;

  // 加班人
  const personInfo = [
    {
      label: '实际加班人',
      form: actualApplyName || '--',
    },
  ];

  // 所属
  const belong = [
    {
      label: '项目',
      form: platformName || '--',
    },
    {
      label: '城市',
      form: cityName || '--',
    },
    {
      label: '团队',
      form: bizDistrictName || '--',
    },
  ];

  return (
    <CoreContent title="加班人信息">
      <Row type="flex" align="middle">
        <Col span={24}>
          <DeprecatedCoreForm items={personInfo} cols={3} />
        </Col>
        <Col span={24}>
          <DeprecatedCoreForm items={belong} cols={3} />
        </Col>
      </Row>
    </CoreContent>
  );
};

export default Person;
