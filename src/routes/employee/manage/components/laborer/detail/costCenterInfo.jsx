/**
 * 员工档案 - 劳动者详情 - TEAM成本中心
 */
// import moment from 'moment';
import React from 'react';
import {
  Form,
  Button,
} from 'antd';
import {
  CoreContent,
  CoreForm,
} from '../../../../../../components/core';

import style from './style.less';

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

const CostCenterInfo = ({
  employeeDetail = {}, // 劳动者档案
  onBack,
}) => {
  const items = [
    // <Form.Item
      // label="结算周期"
      // {...formLayout}
    // >
      // {moment().format('YYYY-MM')}
    // </Form.Item>,
    <Form.Item
      label="team类型"
      {...formLayout}
    >
      {employeeDetail.cost_team_type || '--'}
    </Form.Item>,
    <Form.Item
      label="team信息"
      {...formLayout}
    >
      {(employeeDetail.cost_team_info && employeeDetail.cost_team_info.name) || '--'}
    </Form.Item>,
  ];

  return (
    <React.Fragment>
      <div
        className={style['contract-tab-content-wrap']}
      >
        <div
          className={style['contract-tab-scroll-content']}
        >
          <CoreContent title="TEAM成本中心">
            <CoreForm items={items} />
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

export default CostCenterInfo;
