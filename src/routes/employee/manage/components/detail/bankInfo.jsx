/**
 * 银行卡信息
 * */
import dot from 'dot-prop';
import React from 'react';

import style from './style.css';

import { CoreContent, DeprecatedCoreForm, CorePhotosAmazon } from '../../../../../components/core';
import { EmployeeCollectionType, FileType } from '../../../../../application/define';
import Operate from '../../../../../application/define/operate';

function ComponentFormContractInfo(props) {
  const defaultValueOfEmptyArr = (data, field) => {
    const value = dot.get(data, field);
    if (Array.isArray(value) && value.length > 0) {
      return value.join('/');
    } else {
      return '--';
    }
  };

  // 渲染代收照片
  const renderProtocol = (filesUrl) => {
    return (
      <div>
        {
          filesUrl.map((item, index) => {
            return (
              <p>
                <a className={style['app-comp-expense-borrowing-info-file']} rel="noopener noreferrer" target="_blank" key={index} href={item}>代收协议信息</a>
              </p>
            );
          })
        }
      </div>
    );
  };

  const employeeDetail = dot.get(props, 'employeeDetail', {});
  const fromItemsNextRow = []; // 照片信息
    // 代收协议照片
  const protocol = {
    keys: dot.get(employeeDetail, 'bank_info.collect_protocol', []),
    urls: dot.get(employeeDetail, 'bank_info.collect_protocol_url', []),
  };
    // 命名空间代收协议照片
  const namespaceProtocol = `protocol-${dot.get(employeeDetail, 'identity_card_no', '--')}`;
    // 代收证明照片
    // const provement = {
    //   keys: dot.get(employeeDetail, 'bank_info.collect_provement', []),
    //   urls: dot.get(employeeDetail, 'bank_info.collect_provement_url', []),
    // };
    // 命名空间代收证明照片
    // const namespaceProvement = `provement-${dot.get(employeeDetail, 'identity_card_no', '--')}`;
    // 银行卡正面照
    // bank_card_front这个字段后端已废弃。前端进行特殊处理 @后端：郭建新

  const front = {
    keys: dot.get(employeeDetail, 'bank_info.bank_card_front_url') !== undefined && dot.get(employeeDetail, 'bank_info.bank_card_front_url') !== null ? [dot.get(employeeDetail, 'bank_info.bank_card_front_url')] : [],
    urls: dot.get(employeeDetail, 'bank_info.bank_card_front_url') !== undefined && dot.get(employeeDetail, 'bank_info.bank_card_front_url') !== null ? [dot.get(employeeDetail, 'bank_info.bank_card_front_url')] : [],
  };

    // 判断是否显示图片组件@TODO 使用相同组件 && 无数据时，会抛错
  const isShowPhoto = dot.get(employeeDetail, 'bank_info.bank_card_front_url', undefined);

    // 命名空间银行卡正面照
  const namespaceFront = `front-${dot.get(employeeDetail, 'identity_card_no', '--')}`;
  const formItems = [
    {
      label: '收款模式',
      form: dot.get(employeeDetail, 'bank_info.payment_type', 0) ? EmployeeCollectionType.description(dot.get(employeeDetail, 'bank_info.payment_type', 0)) : '--',
    },
  ];

    // 判断是否是他人代收与本人银行卡渲染不同的内容
  if (dot.get(employeeDetail, 'bank_info.payment_type') === EmployeeCollectionType.collecting) {
      // 他人代个人基本信息
    formItems.push({
      label: '代收人/持卡人姓名',
      form: dot.get(employeeDetail, 'bank_info.card_holder_name', '--') || '--',
    },
        // {
        //   label: '性别',
        //   form: dot.get(employeeDetail, 'bank_info.collect_sex', 0) ? Gender.description(dot.get(employeeDetail, 'bank_info.collect_sex')) : '--',
        // },
        // {
        //   label: '代收人手机号',
        //   form: dot.get(employeeDetail, 'bank_info.collect_phone', '--') || '--',
        // },
      {
        label: '代收人身份证号',
        form: dot.get(employeeDetail, 'bank_info.collect_id_card_no', '--') || '--',
      }, {
        label: '代收银行卡账号',
        form: dot.get(employeeDetail, 'bank_info.card_holder_bank_card_no', '--') || '--',
      },
      {
        label: '开户行',
        form: dot.get(employeeDetail, 'bank_info.bank_branch', '--') || '--',
      }, {
        label: '支行名称',
        form: dot.get(employeeDetail, 'bank_info.bank_branch_name', '--') || '--',
      }, {
        label: '开户行所在地',
        form: dot.get(employeeDetail, 'bank_info.bank_location') ? defaultValueOfEmptyArr(employeeDetail, 'bank_info.bank_location') : '--',
      });
      // 银行照片信息
    fromItemsNextRow.push({
      label: '银行卡正面照',
      form: isShowPhoto ? <CorePhotosAmazon domain="staff" isDisplayMode value={front} namespace={namespaceFront} /> : '--',
    },
      );
      // 员工代收照片显示照片，劳动者显示pdf文档
    if (FileType.staff !== Number(employeeDetail.profile_type)) {
          // 他人代收照片信息
      fromItemsNextRow.push({
        label: '代收协议',
        form: renderProtocol(dot.get(employeeDetail, 'bank_info.collect_protocol_url', [])),
      });
    } else {
        // 他人代收照片信息
      fromItemsNextRow.push({
        label: '代收协议照片',
        form: <CorePhotosAmazon domain="staff" isDisplayMode value={protocol} namespace={namespaceProtocol} />,
      });
    }
  } else {
      // 本人银行卡基本信息
    formItems.push({
      label: '持卡人姓名',
      form: dot.get(employeeDetail, 'bank_info.card_holder_name', '--') || '--',
    },
      {
        label: '银行卡号',
        form: dot.get(employeeDetail, 'bank_info.card_holder_bank_card_no', '--') || '--',
      }, {
        label: '开户行',
        form: dot.get(employeeDetail, 'bank_info.bank_branch', '--') || '--',
      }, {
        label: '支行名称',
        form: dot.get(employeeDetail, 'bank_info.bank_branch_name', '--') || '--',
      }, {
        label: '开户行所在地',
        form: dot.get(employeeDetail, 'bank_info.bank_location') ? defaultValueOfEmptyArr(employeeDetail, 'bank_info.bank_location') : '--',
      });
      // 本人银行卡照片
    fromItemsNextRow.push({
      label: '银行卡正面照',
      form: isShowPhoto ? <CorePhotosAmazon domain="staff" isDisplayMode value={front} namespace={namespaceFront} /> : '--',
    });
  }

  const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
  let historyInfo;
  // 判断是否有权限
  if (Operate.canOperateModuleEmployeeDetailHistoryInfo()) {
    historyInfo = (<a key="history" target="_blank" rel="noopener noreferrer" href={`/#/Employee/Detail/HistoryInfo?id=${dot.get(employeeDetail, '_id', undefined)}&profileType=${dot.get(employeeDetail, 'profile_type', undefined)}`} className={style['app-comp-employee-manage-detail-bankinfo']}>历史记录</a>);
  }

  return (
    <CoreContent title="银行卡信息" titleExt={historyInfo}>
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      <DeprecatedCoreForm items={fromItemsNextRow} cols={3} layout={layout} />
    </CoreContent>
  );
}

export default ComponentFormContractInfo;
