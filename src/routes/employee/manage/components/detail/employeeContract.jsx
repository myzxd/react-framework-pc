/**
 *  员工合同信息
 * */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import moment from 'moment';

import {
  SignContractType,
  TimeCycle,
  ContractType,
  FileType,
  StaffSate,
  StaffTag,
} from '../../../../../application/define';
import { CoreContent, DeprecatedCoreForm, CorePhotosAmazon } from '../../../../../components/core';

function EmployeeContract(props) {
  useEffect(() => {
    props.dispatch({ type: 'fileChange/fetchNewContractInfo', payload: { id: props.employeeDetail.identity_card_id } });
  }, []);


  // 渲染电子合同信息
  const renderElectronContactInfo = () => {
    const employeeDetail = dot.get(props, 'employeeDetail', {});
    const contractAssetUrl = dot.get(employeeDetail, 'contract_asset_url', '');
    let link;
    if (contractAssetUrl === '' || contractAssetUrl === null) {
      link = '--';
    } else {
      link = <a href={contractAssetUrl} download>下载电子合同</a>;
    }
    const item = { label: '合同照片', form: <div>{link}</div> };

    return item;
  };

   // 渲染纸质合同照片信息
  const renderPaperContactPhotos = () => {
    const newContractInfo = dot.get(props, 'newContractInfo', {});
    // 如果没有上传合同照片 则不显示
    if (!newContractInfo.contract_photo_list || newContractInfo.contract_photo_list.length === 0) {
      return {
        label: '合同照片',
        form: '--',
      };
    }
    // 使用合同编号，作为命名空间
    const namespace = `ComponentDetailContractInfo-${dot.get(newContractInfo, 'contract_no', '--')}`;

    const value = {
      keys: dot.get(newContractInfo, 'contract_photo_list', []),
      urls: dot.get(newContractInfo, 'contract_photo_url_list', []),
    };
    const item = {
      // span: 24,
      label: '合同照片',
      form: <CorePhotosAmazon domain="staff" isDisplayMode value={value} namespace={namespace} />,
    };

    return item;
  };

  // 渲染合同信息
  const renderContactInfo = () => {
    const employeeDetail = dot.get(props, 'employeeDetail', {});
    const { newContractInfo } = props;
    const signType = dot.get(newContractInfo, 'sign_type');
    const formItems = [
      {
        label: '签约类型',
        form: SignContractType.description(newContractInfo.sign_type),
      }, {
        label: `${employeeDetail.profile_type}` === `${FileType.staff}` ? '合作/入职日期' : '合作日期',
        form: dot.get(newContractInfo, 'entry_date') ? moment(`${dot.get(newContractInfo, 'entry_date')}`).format('YYYY-MM-DD') : '--',
      }, {
        label: '合同生效日期',
        form: dot.get(newContractInfo, 'signed_date') ? moment(dot.get(newContractInfo, 'signed_date'), 'YYYYMMDD').format('YYYY-MM-DD') : '--',
      }, {
        label: '合同甲方',
        form: dot.get(newContractInfo, 'contract_belong_info.name', '--') || '--',
      }, {
        label: '签约周期',
        form: newContractInfo.sign_cycle ? `${newContractInfo.sign_cycle}${TimeCycle.description(newContractInfo.sign_cycle_unit)}` : '--',
      }, {
        label: '员工状态',
        form: StaffSate.description(employeeDetail.state),
      }, {
        label: '员工标签',
        form: dot.get(employeeDetail, 'work_label', []).map(i => StaffTag.description(i)).join('、'),
      }, {
        label: '合同类型',
        form: ContractType.description(newContractInfo.contract_type),
      }, {
        label: '合同编号',
        form: dot.get(newContractInfo, 'contract_no', '--') || '--',
      }, {
        label: '合同标签',
        form: dot.get(newContractInfo, 'contract_no', '--') || '--',
      },
    ];
    if (`${employeeDetail.profile_type}` === `${FileType.staff}`) {
      formItems.push(
        {
          label: '预计转正日期',
          form: dot.get(newContractInfo, 'regular_date') ? moment(dot.get(newContractInfo, 'regular_date'), 'YYYYMMDD').format('YYYY-MM-DD') : '--',
        },
        {
          label: '实际转正日期',
          form: dot.get(newContractInfo, 'actual_regular_date') ? moment(dot.get(newContractInfo, 'actual_regular_date'), 'YYYYMMDD').format('YYYY-MM-DD') : '--',
        },
        {
          label: '离职日期',
          form: dot.get(employeeDetail, 'departure_date') ? moment(dot.get(employeeDetail, 'departure_date'), 'YYYYMMDD').format('YYYY-MM-DD') : '--',
        },
      );
    }

     /* 渲染合同照片信息 */
    const contactItem = signType === SignContractType.electronic ?
            renderElectronContactInfo() :
            renderPaperContactPhotos();
    formItems.push(contactItem);

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    return (
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
    );
  };

  return (
    <CoreContent title="合同/协议信息">
      {/* 渲染合同信息 */}
      {renderContactInfo()}
    </CoreContent>
  );
}

function mapStateToProps({ fileChange }) {
  return { newContractInfo: fileChange.newContractInfo };
}

export default connect(mapStateToProps)(EmployeeContract);
