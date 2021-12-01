/**
 * 员工档案 - 劳动者详情 - 系统信息
 */
import { connect } from 'dva';
import moment from 'moment';
import React, { useEffect } from 'react';
import {
  Table,
  Tooltip,
  Form,
  Button,
} from 'antd';
import {
  CityIndustryState,
  WorkState,
  StaffTeamRank,
  FileType,
  TeamNoAccountRegistrationReason,
  TeamMemberAttribute,
} from '../../../../../../application/define';
import {
  CoreContent,
  CoreForm,
} from '../../../../../../components/core';
import Operate from '../../../../../../application/define/operate';

import style from './style.less';

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

const WorkInfo = ({
  dispatch,
  employeeDetail = {}, // 劳动者详情
  workData = {}, // 工作信息
  onBack,
}) => {
  const {
    _id: staffId, // 劳动者档案id
    name, // 劳动者档案name
    profile_type: profileType, // 档案类型
  } = employeeDetail;

  useEffect(() => {
    dispatch({
      type: 'employeeManage/fetchWorkInfoData',
      payload: {
        staffId,
      },
    });
    return () => dispatch(
      {
        type: 'employeeManage/reduceEmployeeWorkInfo',
        payload: {},
      });
  }, [dispatch, staffId]);

  // 工作信息
  const renderWorkTable = () => {
    const { data = [] } = workData;
    const columns = [
      {
        title: '所属场景',
        dataIndex: ['team_info', 'industry_code'],
        render: text => (text ? CityIndustryState.description(text) : '--'),
      },
      {
        title: '平台',
        dataIndex: ['team_info', 'platform_name'],
        render: text => text || '--',
      },
      {
        title: '平台证件号',
        dataIndex: 'identity_card_id',
        render: text => text || '--',
      },
      {
        title: '三方ID',
        dataIndex: 'custom_id_list',
        render: (text) => {
          if (!Array.isArray(text) || text.length < 1) return '--';

          return (
            <Tooltip
              placement="top"
              title={text && text.toString()}
            >{text[0]}{text.length > 1 ? `等${text.length}条` : ''}</Tooltip>
          );
        },
      },
      {
        title: '供应商',
        dataIndex: ['team_info', 'supplier_name'],
        render: text => text || '--',
      },
      {
        title: '城市',
        dataIndex: ['team_info', 'city_name'],
        render: text => text || '--',
      },
      {
        title: '商圈',
        dataIndex: ['team_info', 'biz_district_name'],
        render: text => text || '--',
      },
      {
        title: '加入时间',
        dataIndex: 'created_at',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'),
      },
      {
        title: '工作状态',
        dataIndex: 'state',
        render: text => (text ? WorkState.description(text) : '--'),
      },
      {
        title: '团队身份',
        dataIndex: 'role',
        render: text => (text ? StaffTeamRank.description(text) : '--'),
      },
      {
        title: '成员类型',
        dataIndex: 'member_attribute',
        render: text => TeamMemberAttribute.description(text),
      },
    ];

    return (
      <Table
        pagination={false}
        rowKey={rec => rec._id}
        columns={columns}
        dataSource={data}
        bordered
      />
    );
  };

  // 劳动者档案信息
  const renderContactInfo = () => {
    const items = [
      <Form.Item
        label="BOSS人员ID"
        {...formLayout}
      >
        {employeeDetail._id || '--'}
      </Form.Item>,
      <Form.Item
        label="档案类型"
        {...formLayout}
      >
        {
          profileType ?
            `${FileType.description(profileType)}`
            : '--'
        }
      </Form.Item>,
      <Form.Item
        label="所属场景"
        {...formLayout}
      >
        {employeeDetail.industry_name || '--'}
      </Form.Item>,
      <Form.Item
        label="职能"
        {...formLayout}
      >
        {employeeDetail.office || '--'}
      </Form.Item>,
      <Form.Item
        label="个户编号"
        {...formLayout}
      >
        {employeeDetail.personal_company_no || '--'}
      </Form.Item>,
      <Form.Item
        label="个独编号"
        {...formLayout}
      >
        {employeeDetail.company_no || '--'}
      </Form.Item>,
      <Form.Item
        label="个独名称"
        {...formLayout}
      >
        {employeeDetail.company_name || '--'}
      </Form.Item>,
      <Form.Item
        label="无需个户注册原因"
        {...formLayout}
      >
        {TeamNoAccountRegistrationReason.description(employeeDetail.low_income_residents)}
      </Form.Item>,
    ];

    return <CoreForm items={items} />;
  };

  // 业务范围
  const renderBusiness = () => {
    const {
      platform_names: platformNames,
      supplier_names: supplierNames,
      city_names: cityNames,
      biz_district_names: districtNames,
    } = employeeDetail;
    const items = [
      <Form.Item
        label="平台"
        {...formLayout}
      >
        {
          Array.isArray(platformNames) && platformNames.length > 0 ?
            platformNames
            : '--'
        }
      </Form.Item>,
      <Form.Item
        label="供应商"
        {...formLayout}
      >
        {
          Array.isArray(supplierNames) && supplierNames.length > 0 ?
            supplierNames
            : '--'
        }
      </Form.Item>,
      <Form.Item
        label="城市"
        {...formLayout}
      >
        {
          Array.isArray(cityNames) && cityNames.length > 0 ?
            cityNames
            : '--'
        }
      </Form.Item>,
      <Form.Item
        label="商圈"
        {...formLayout}
      >
        {
          Array.isArray(districtNames) && districtNames.length > 0 ?
            districtNames
            : '--'
        }
      </Form.Item>,
    ];

    return <CoreForm items={items} />;
  };

  // 工作信息titleExt
  const renderWorkTitleExt = () => {
    if (!Operate.canOperateModuleEmployeeDetailHistoryInfo()) return <div />;
    return (
      <React.Fragment>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`/#/Employee/Detail/HistoryTripartiteId?staffId=${staffId}&name=${name}`}
        >历史三方ID</a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`/#/Employee/Detail/HistoryWorkInfo?staffId=${staffId}&name=${name}`}
          style={{ margin: '0 10px' }}
        >历史工作信息</a>
      </React.Fragment>
    );
  };

  // 档案信息titleExt
  const renderContactTitleExt = () => {
    if (!Operate.canOperateModuleEmployeeDetailHistoryInfo()) return '';
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`/#/Employee/Detail/Individual?staffId=${staffId}&name=${name}`}
      >个户注册记录</a>
    );
  };

  return (
    <React.Fragment>
      <div
        className={style['contract-tab-content-wrap']}
      >
        <div
          className={style['contract-tab-scroll-content']}
        >
          <CoreContent title="工作信息" titleExt={renderWorkTitleExt()}>
            {renderWorkTable()}
          </CoreContent>
          <CoreContent title="档案信息" titleExt={renderContactTitleExt()}>
            <Form className="affairs-flow-basic">
              {renderContactInfo()}
            </Form>
          </CoreContent>
          <CoreContent title="业务范围">
            <Form className="affairs-flow-basic">
              {renderBusiness()}
            </Form>
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
  employeeManage: { workData },
}) => {
  return { workData };
};

export default connect(mapStateToProps)(WorkInfo);
