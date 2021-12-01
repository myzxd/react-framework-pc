/**
 * 人员详情
 * */
import dot from 'dot-prop';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import React from 'react';

import { CoreTabs } from '../../../components/core';
import { FileType } from '../../../application/define';
import { system } from '../../../application';
// import OperateInfo from './components/detail/operateInfo';
import FileInformation from './components/detail/fileInfo';
import ComponentDetailContractInfo from './components/detail/contractInfo';
import ComponentDetailIdentityInfo from './components/detail/identityInfo';
import RecommendedSource from './components/detail/recommendedSource';
import ComponentDetailBankInfo from './components/detail/bankInfo';
import ComponentDetailBaseInfo from './components/detail/baseInfo';
import EducationInfo from './components/detail/educationInfo';
import WorkExperience from './components/detail/workExperience';
// import CostCenterDetail from './components/detail/costCenter';
import WageInfoDetail from './components/detail/wageInfoDetail';
import WorkInfo from './components/detail/workInfo';
import EmployeeContractInfo from './components/detail/employeeContract';
import SocialSecurityInfo from './components/detail/socialSecurityInfo';   // 社保/公积金
import ComponentAccountingCenter from './components/detail/accountingCenter'; // 核算中心

const codeFlag = system.isShowCode(); // 判断是否是code

function Index(props) {
  // 档案信息
  const renderArchivesInfo = () => {
    const employeeDetail = dot.get(props, 'employeeManage.employeeDetail', {});

    return (
      <React.Fragment>
        {/* 操作信息 */}
        {/* <OperateInfo employeeDetail={employeeDetail} /> */}
        {/* 档案信息 */}
        <FileInformation
          isStaff={props.location.query.fileType === 'staff'}
          employeeDetail={employeeDetail}
        />
        {/* 个人信息 */}
        <ComponentDetailBaseInfo employeeDetail={employeeDetail} />
        {/* 工作信息 */}
        {
          FileType.staff !== Number(employeeDetail.profile_type)
          ? <WorkInfo employeeDetail={employeeDetail} />
          : null
        }
        {/* 合同信息 */}
        {
          FileType.staff === Number(employeeDetail.profile_type)
          ? <EmployeeContractInfo employeeDetail={employeeDetail} />
          : <ComponentDetailContractInfo employeeDetail={employeeDetail} />
        }
        {/* 身份信息 */}
        <ComponentDetailIdentityInfo employeeDetail={employeeDetail} />
        {/* 银行卡信息 */}
        <ComponentDetailBankInfo employeeDetail={employeeDetail} />
        {/* 推荐信息 */}
        <RecommendedSource employeeDetail={employeeDetail} flag={FileType.staff === Number(employeeDetail.profile_type)} />
        {/* 学历信息 */}
        <EducationInfo employeeDetail={employeeDetail} />
        {/* 工作经历 */}
        <WorkExperience employeeDetail={employeeDetail} />
        {/* 成本信息*/}

        {/* {
          FileType.staff === Number(employeeDetail.profile_type)
            ? <CostCenterDetail employeeDetail={employeeDetail} />
            : null
        } */}
        {/* 工资信息 */}
        {
          FileType.staff === Number(employeeDetail.profile_type)
          && <WageInfoDetail employeeDetail={employeeDetail} />
        }
        {/* 社保/公积金信息 */}
        {
          FileType.staff === Number(employeeDetail.profile_type)
          && <SocialSecurityInfo employeeDetail={employeeDetail} />
        }
      </React.Fragment>
    );
  };

   // 核算中心
  const renderAccountingCenter = () => {
    const employeeDetail = dot.get(props, 'employeeManage.employeeDetail', {});
    return (
      <React.Fragment>
        {/* 核算中心 */}
        <ComponentAccountingCenter employeeDetail={employeeDetail} />
      </React.Fragment>
    );
  };

    // 渲染tab
  const renderTabs = () => {
    const employeeDetail = dot.get(props, 'employeeManage.employeeDetail', {});
    const {
        profile_type: fileType,
      } = employeeDetail;
    const items = [
      {
        title: '档案信息',
        content: renderArchivesInfo(),
        key: '档案信息',
      },
    ];
      // 判断code审批插件是否存在并且员工档案显示tab，劳动者档案根据接口判断是否可显示tab
    if (codeFlag === true && (FileType.staff === Number(fileType) || employeeDetail.is_tab)) {
      items.push(
        {
          title: 'TEAM成本中心',
          content: renderAccountingCenter(),
          key: 'TEAM成本中心',
        },
        );
    }
    return (
      <CoreTabs
        items={items}
      />
    );
  };

  return (
    <Form layout="horizontal">
      {/* 渲染tab */}
      {renderTabs()}
    </Form>
  );
}

function mapStateToProps({ employeeManage }) {
  return { employeeManage };
}

export default connect(mapStateToProps)(Form.create()(Index));
