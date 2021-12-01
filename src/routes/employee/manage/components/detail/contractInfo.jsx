/**
 *  劳动者档案/合同/协议信息
 * */
import moment from 'moment';
import dot from 'dot-prop';
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';

import {
  ContractEffectiveState,
  SignContractType,
  ContractCycleUnit,
} from '../../../../../application/define';
import { CoreContent, CoreTabs } from '../../../../../components/core';
import Operate from '../../../../../application/define/operate';

function ComponentFormContractInfo(props) {
  const [isShowInfo, setIsShowInfo] = useState(false);
  const [activeKey, setActiveKey] = useState(ContractEffectiveState.signedTwo);

  useEffect(() => {
    return () => {
      props.dispatch({
        type: 'employeeManage/reduceEmployeeContractInfo',
        payload: {},
      });
    };
  }, []);

  // 收起信息
  const onPackUpInfo = () => {
    setIsShowInfo(false);
  };

  // 调用接口
  const onInterface = () => {
    const employeeDetail = dot.get(props, 'employeeDetail', {}); // 员工详情信息
    const {
      identity_card_id: idCard,
      _id,
    } = employeeDetail;

    if (!_id || !idCard) {
      return;
    }
    // 传递参数
    const payload = {
      // industry: industry_code, // 所属场景  2019-12-18 妍杰要求注释
      identity: idCard, // 身份证
      id: _id,                    // 员工id
    };
    // 待签约
    if (Number(activeKey) === ContractEffectiveState.toBeSign) {
      payload.state = [ContractEffectiveState.toBeSign, ContractEffectiveState.signed];
    }
    // 已签署
    if (Number(activeKey) === ContractEffectiveState.signedTwo) {
      payload.state = [ContractEffectiveState.signedTwo];
    }
    props.dispatch({ type: 'employeeManage/fetchContractInfoData', payload });
  };

  // 展开信息
  const onAnInfo = () => {
    setIsShowInfo(true);
    // 调用接口
    onInterface();
  };

  // 选择tab
  const onChangeTab = (key) => {
    setActiveKey(key);
   // 调用接口
    onInterface();
  };

  // 渲染主体内容
  const renderContent = () => {
    const { employeeDetail } = props;
    const columns = [
      {
        title: '协议编号',
        dataIndex: 'contract_no',
        key: 'contract_no',
        render: text => text || '--',
      },
      {
        title: '甲方',
        dataIndex: ['third_part_info', 'name'],
        key: 'third_part_info.name',
        render: text => text || '--',
      },
      {
        title: '业务主体',
        dataIndex: 'supplier_name',
        key: 'supplier_name',
        render: text => text || '--',
      },
      {
        title: '城市',
        dataIndex: 'city_name',
        key: 'city_name',
        render: text => text || '--',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: text => (text ? ContractEffectiveState.description(text) : '--'),
      },
      {
        title: '周期',
        dataIndex: 'contract_cycle',
        key: 'contract_cycle',
        render: (text) => {
          return text ? `${text}${ContractCycleUnit.description(employeeDetail.sign_cycle_unit)}` : '--';
        },
      },
      {
        title: '生效日期',
        dataIndex: 'signed_date',
        key: 'signed_date',
        render: (text, record) => {
          const {
            expired_at: expiredAt,
          } = record;
          // 生效日期
          const effective = text && expiredAt
            ? `${text}-${expiredAt}`
            : '--';
          return effective;
        },
      },
      {
        title: '签约方式',
        dataIndex: 'sign_type',
        key: 'sign_type',
        render: text => (text ? SignContractType.description(text) : '--'),
      },
      {
        title: '签约完成时间',
        dataIndex: 'done_at',
        key: 'done_at',
        render: text => (text ? moment(text).format('YYYY-MM-DD') : '--'),
      },
      {
        title: '操作',
        dataIndex: 'contract_asset_url',
        key: 'contract_asset_url',
        render: text => (text ? <a
          target="_blank"
          rel="noopener noreferrer"
          href={text}
          download
        >下载电子合同</a> : '--'),
      },
    ];
    return (
      <Table
        rowKey={({ _id: id }) => id}
        columns={columns}
        pagination={false}
        dataSource={dot.get(props, 'contractData.data', [])}
        bordered
      />
    );
  };


  // 渲染内容容器
  const renderContentWrap = () => {
    const items = [
      {
        title: '已签署',
        content: renderContent(),
        key: ContractEffectiveState.signedTwo,
      },
      {
        title: '待签约',
        content: renderContent(),
        key: ContractEffectiveState.toBeSign,
      },
    ];
    return (
      <CoreTabs
        items={items}
        onChange={onChangeTab}
      />
    );
  };


  const employeeDetail = dot.get(props, 'employeeDetail', {}); // 员工详情信息
  const {
    identity_card_id: idCard,
    _id: staffId,
    name,
  } = employeeDetail;
  // 是否展开收起
  let operations = '';
  if (isShowInfo) {
    operations = (<a onClick={onPackUpInfo}>收起</a>);
  } else {
    operations = (<a onClick={onAnInfo}>展开</a>);
  }

  return (
    <CoreContent
      title="合同/承揽协议"
      titleExt={<div>
        {
          // 判断是否有权限
          Operate.canOperateModuleEmployeeDetailHistoryInfo() ? (
            <a
              style={{ margin: '0 10px' }}
              target="_blank"
              rel="noopener noreferrer"
              href={`/#/Employee/Detail/HistoryContractInfo?staffId=${staffId}&identityCardId=${idCard}&name=${name}`}
            >历史合同信息</a>
          ) : null
        }
        {operations}
      </div>}
    >
      {/* 渲染合同信息 */}
      {
        isShowInfo
          ? renderContentWrap()
          : null
      }
    </CoreContent>
  );
}

function mapStateToProps({ employeeManage: { contractData } }) {
  return { contractData };
}
export default connect(mapStateToProps)(ComponentFormContractInfo);
