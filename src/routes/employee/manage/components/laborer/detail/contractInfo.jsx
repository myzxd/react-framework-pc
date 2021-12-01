/**
 * 员工档案 - 劳动者详情 - 合同信息
 */
import moment from 'moment';
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import {
  Table,
  Tabs,
  Button,
} from 'antd';
import {
  CoreContent,
} from '../../../../../../components/core';
import {
  ContractEffectiveState,
  SignContractType,
  ContractCycleUnit,
} from '../../../../../../application/define';
import Operate from '../../../../../../application/define/operate';

import style from './style.less';

const { TabPane } = Tabs;

const ContractInfo = ({
  dispatch,
  contractData = {},
  employeeDetail = {}, // 合同详情
  onBack,
}) => {
  const { data = [] } = contractData;
  const {
    identity_card_id: identityCardId, // 身份证id
    _id: id, // 合同id
    name,
  } = employeeDetail;

  // 合同状态
  const [contractState, setContractState] = useState(ContractEffectiveState.signedTwo);

  useEffect(() => {
    if (identityCardId && id) {
      const payload = {
        identity: identityCardId,
        id,
      };

      // 已签约
      Number(contractState) === ContractEffectiveState.signedTwo && (
        payload.state = [ContractEffectiveState.signedTwo]
      );

      // 待签约签约
      Number(contractState) === ContractEffectiveState.toBeSign && (
        payload.state = [ContractEffectiveState.toBeSign, ContractEffectiveState.signed]
      );

      dispatch({
        type: 'employeeManage/fetchContractInfoData',
        payload,
      });
    }
  }, [dispatch, contractState, id, identityCardId]);

  // 列表
  const renderTable = () => {
    const columns = [
      {
        title: '协议编号',
        dataIndex: 'contract_no',
        render: text => text || '--',
      },
      {
        title: '甲方',
        dataIndex: ['third_part_info', 'name'],
        render: text => text || '--',
      },
      {
        title: '业务主体',
        dataIndex: 'supplier_name',
        render: text => text || '--',
      },
      {
        title: '城市',
        dataIndex: 'city_name',
        render: text => text || '--',
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: text => (text ? ContractEffectiveState.description(text) : '--'),
      },
      {
        title: '周期',
        dataIndex: 'contract_cycle',
        render: (text) => {
          return text ? `${text}${ContractCycleUnit.description(employeeDetail.sign_cycle_unit)}` : '--';
        },
      },
      {
        title: '生效日期',
        dataIndex: 'signed_date',
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
        render: text => (text ? SignContractType.description(text) : '--'),
      },
      {
        title: '签约完成时间',
        dataIndex: 'done_at',
        render: text => (text ? moment(text).format('YYYY-MM-DD') : '--'),
      },
      {
        title: '操作',
        dataIndex: 'contract_asset_url',
        render: text => (text ? <a
          target="_blank"
          rel="noopener noreferrer"
          href={text}
          download
        >下载电子合同</a> : '--'),
      },
    ];
    return (
      <CoreContent>
        <Table
          pagination={false}
          rowKey={rec => rec._id}
          columns={columns}
          dataSource={data}
          bordered
        />
      </CoreContent>
    );
  };

  // tabs
  const renderTabs = () => {
    return (
      <Tabs
        onChange={val => setContractState(val)}
      >
        <TabPane
          tab="已签署"
          key={ContractEffectiveState.signedTwo}
        >{renderTable()}</TabPane>
        <TabPane
          tab="待签约"
          key={ContractEffectiveState.toBeSign}
        >{renderTable()}</TabPane>
      </Tabs>
    );
  };

  // titleExt
  const renderTitleExt = () => {
    if (Operate.canOperateModuleEmployeeDetailHistoryInfo()) {
      return (
        <a
          style={{ margin: '0 10px' }}
          target="_blank"
          rel="noopener noreferrer"
          href={`/#/Employee/Detail/HistoryContractInfo?staffId=${id}&identityCardId=${identityCardId}&name=${name}`}
        >历史合同信息</a>
      );
    }
    return '';
  };

  return (
    <React.Fragment>
      <div
        className={style['contract-tab-content-wrap']}
      >
        <div
          className={style['contract-tab-scroll-content']}
        >
          <CoreContent
            title="合同/协议信息"
            titleExt={renderTitleExt()}
          >
            {renderTabs()}
          </CoreContent>
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

const mapStateToProps = ({
  employeeManage: { contractData },
}) => {
  return { contractData };
};

export default connect(mapStateToProps)(ContractInfo);
