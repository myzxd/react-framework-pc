/**
 * 工作信息
 */
import dot from 'dot-prop';
import is from 'is_js';
import moment from 'moment';
import { Table, Tooltip } from 'antd';
import React, { useState } from 'react';
import { connect } from 'dva';

import { CoreContent } from '../../../../../components/core';
import {
  CityIndustryState,
  WorkState,
  StaffTeamRank,        // 团队身份
} from '../../../../../application/define';
import Operate from '../../../../../application/define/operate';

function WorkInfo(props) {
  const [isShowInfo, setIsShowInfo] = useState(false);


  // 收起信息
  const onPackUpInfo = () => {
    setIsShowInfo(false);
  };

  // 展开信息
  const onAnInfo = () => {
    const { employeeDetail } = props;
    const { _id } = employeeDetail;
    setIsShowInfo(true);
    if (is.not.empty(employeeDetail) && is.existy) {
      const payload = {
        staffId: _id,
      };
      props.dispatch({ type: 'employeeManage/fetchWorkInfoData', payload });
    }
  };

  // 渲染列表内容
  const renderContent = () => {
    // tabel列表
    const columns = [{
      title: '所属场景',
      dataIndex: ['team_info', 'industry_code'],
      key: 'team_info.industry_code',
      render: (text) => {
        return text ? CityIndustryState.description(text) : '--';
      },
    },
    {
      title: '平台',
      dataIndex: ['team_info', 'platform_name'],
      key: 'team_info.platform_name',
      render: (text) => {
        return text || '--';
      },
    },
    {
      title: '平台证件号',
      dataIndex: 'identity_card_id',
      key: 'identity_card_id',
      render: (text) => {
        return text || '--';
      },
    },
    {
      title: '三方ID',
      dataIndex: 'custom_id_list',
      key: 'custom_id_list',
      render: (text) => {
        if (is.empty(text) || is.not.existy(text)) {
          return '--';
        }
        const len = text.length;
        return (
          <Tooltip
            placement="top"
            title={text && text.toString()}
          >{text[0]}{len > 1 ? `等${text.length}条` : ''}</Tooltip>
        );
      },
    },
    {
      title: '供应商',
      dataIndex: ['team_info', 'supplier_name'],
      key: 'team_info.supplier_name',
      render: (text) => {
        return text || '--';
      },
    },
    {
      title: '城市',
      dataIndex: ['team_info', 'city_name'],
      key: 'team_info.city_name',
      render: (text) => {
        return text || '--';
      },
    },
    {
      title: '商圈',
      dataIndex: ['team_info', 'biz_district_name'],
      key: 'team_info.biz_district_name',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '加入时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
      },
    },
    {
      title: '工作状态',
      dataIndex: 'state',
      key: 'state',
      render: (text) => {
        return text ? WorkState.description(text) : '--';
      },
    },
    {
      title: '团队身份',
      dataIndex: 'role',
      key: 'role',
      render: (text) => {
        return text ? StaffTeamRank.description(text) : '--';
      },
    },
    ];
    return (
      <Table
        columns={columns}
        pagination={false}
        rowKey={(record, index) => { return index; }}
        dataSource={dot.get(props, 'workData.data', [])}
        bordered
      />
    );
  };

  const { employeeDetail } = props;
  const { _id, name } = employeeDetail;
  // 是否展开收起
  let operations = '';
  if (isShowInfo) {
    operations = (<a onClick={onPackUpInfo}>收起</a>);
  } else {
    operations = (<a onClick={onAnInfo}>展开</a>);
  }
  return (
    <CoreContent
      title="工作信息" titleExt={<div>
        {
          // 判断是否有权限
          Operate.canOperateModuleEmployeeDetailHistoryInfo() ? (
            <React.Fragment>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`/#/Employee/Detail/HistoryTripartiteId?staffId=${_id}&name=${name}`}
              >历史三方ID</a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`/#/Employee/Detail/HistoryWorkInfo?staffId=${_id}&name=${name}`}
                style={{ margin: '0 10px' }}
              >历史工作信息</a>
            </React.Fragment>
           ) : null
        }

        {operations}</div>}
    >
      {/* 渲染列表内容 */}
      {isShowInfo ? renderContent() : null}
    </CoreContent>
  );
}

function mapStateToProps({ employeeManage: { workData } }) {
  return { workData };
}
export default connect(mapStateToProps)(WorkInfo);
