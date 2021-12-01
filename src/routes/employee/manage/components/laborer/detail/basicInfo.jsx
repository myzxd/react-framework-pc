/**
 * 员工档案 - 劳动者详情 - 基本信息
 */
import React from 'react';
import {
  Button,
} from 'antd';

import PersonalInfo from './personalInfo';
import IdentityInfo from './identityInfo';
import BankInfo from './bankInfo';
import EducationInfo from './educationInfo';
import ExperinceInfo from './experience';
import RecommendedSourceInfo from './recommendedSourceInfo';

import style from './style.less';

const BasicInfo = ({
  employeeDetail, // 员工详情
  onBack,
}) => {
  const props = {
    employeeDetail,
  };

  return (
    <React.Fragment>
      <div
        className={style['contract-tab-content-wrap']}
      >
        <div
          className={style['contract-tab-scroll-content']}
        >
          <PersonalInfo {...props} />
          <RecommendedSourceInfo {...props} />
          <EducationInfo {...props} />
          <ExperinceInfo {...props} />
          <IdentityInfo {...props} />
          <BankInfo {...props} />
        </div>
        <div
          className={style['contract-tab-scroll-button']}
        >
          <Button
            onClick={onBack}
          >返回</Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default BasicInfo;
