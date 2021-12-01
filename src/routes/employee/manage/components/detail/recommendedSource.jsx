/**
 *  推荐信息
 * */
import dot from 'dot-prop';
import React from 'react';
import {
  AccountRecruitmentChannel,
  RecommendedPlatform,
  AccountApplyWay,
  RecommendedPlatformStaff,
} from '../../../../../application/define';
import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';

function RecommendedSource(props) {
  const renderItems = () => {
    const employeeDetail = dot.get(props, 'employeeDetail', {});
    const { flag } = props;
    if (flag) {
      const formItems = [
        {
          label: '应聘途径',
          form: AccountApplyWay.description(employeeDetail.application_channel_id),
        },
      ];

      // 当应聘途径是人力资源服务公司 / 猎头公司时
      if (`${dot.get(employeeDetail, 'application_channel_id')}` === `${AccountApplyWay.company}`) {
        formItems.push({
          label: '公司名称',
          form: dot.get(employeeDetail, 'application_company_name', '--') || '--',
        });
      }
      // 当应聘途径为内部推荐时
      if (`${dot.get(employeeDetail, 'application_channel_id')}` === `${AccountApplyWay.recommend}`) {
        formItems.push({
          label: '推荐人身份证号',
          form: dot.get(employeeDetail, 'referrer_identity_no', '--') || '--',
        }, {
          label: '推荐人姓名',
          form: dot.get(employeeDetail, 'referrer_name', '--') || '--',
        }, {
          label: '推荐人手机号',
          form: dot.get(employeeDetail, 'referrer_phone', '--') || '--',
        });
      }
      // 当应聘途径时，显示推招聘渠道表单
      if (`${dot.get(employeeDetail, 'application_channel_id')}` === `${AccountApplyWay.apply}`) {
        formItems.push({
          label: '渠道',
          form: RecommendedPlatformStaff.description(employeeDetail.application_platform),
        });
      }

      // 当应聘途径为内部推荐时
      if (`${dot.get(employeeDetail, 'application_channel_id')}` === `${AccountApplyWay.transfer}`) {
        formItems.push({
          label: '平台',
          form: dot.get(employeeDetail, 'transfer_sign_plateform_name', '--') || '--',
        }, {
          label: '供应商',
          form: dot.get(employeeDetail, 'transfer_sign_supplier_name', '--') || '--',
        }, {
          label: '岗位',
          form: dot.get(employeeDetail, 'transfer_sign_post', '--') || '--',
        });
      }

      const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

      return (
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      );
    }
    const formItems = [
      {
        label: '推荐渠道',
        form: AccountRecruitmentChannel.description(employeeDetail.recruitment_channel_id),
      },
    ];

    // 当推荐渠道为三方服务公司时
    if (`${dot.get(employeeDetail, 'recruitment_channel_id')}` === `${AccountRecruitmentChannel.third}`) {
      formItems.push({
        label: '推荐公司',
        form: dot.get(employeeDetail, 'referrer_company_info.name', '--') || '--',
      });
    }
    // 当推荐渠道为内部推荐时
    if (`${dot.get(employeeDetail, 'recruitment_channel_id')}` === `${AccountRecruitmentChannel.recommend}`) {
      formItems.push({
        label: '推荐人身份证号',
        form: dot.get(employeeDetail, 'referrer_staff_info.identity_card_id', '--') || '--',
      }, {
        label: '推荐人姓名',
        form: dot.get(employeeDetail, 'referrer_staff_info.name', '--') || '--',
      }, {
        label: '推荐人手机号',
        form: dot.get(employeeDetail, 'referrer_staff_info.phone', '--') || '--',
      });
    }
    // 当推荐渠道为三方推广平台时
    if (`${dot.get(employeeDetail, 'recruitment_channel_id')}` === `${AccountRecruitmentChannel.thirdPlatform}`) {
      formItems.push({
        label: '推荐平台',
        form: RecommendedPlatform.description(employeeDetail.referrer_platform),
      });
    }
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    return (
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
    );
  };

  return (
    <CoreContent title="推荐信息">
      {/* 推荐信息 */}
      {renderItems()}
    </CoreContent>
  );
}


export default RecommendedSource;
