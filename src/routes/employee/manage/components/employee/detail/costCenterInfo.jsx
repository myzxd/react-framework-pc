/**
 * 员工档案 - 员工详情 - team成本中心信息tab
 */
import React from 'react';
import {
  Form,
  Button,
} from 'antd';
import {
  CoreForm,
  CoreContent,
} from '../../../../../../components/core';

import style from './style.less';

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

const CostCenterInfo = ({
  employeeDetail = {}, // 员工详情
  onBack,
}) => {
  const items = [
    <Form.Item
      label="归属团队类型"
      {...formLayout}
    >
      {employeeDetail.cost_team_type || '--'}
    </Form.Item>,
    <Form.Item
      label="归属团队"
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
          <CoreContent title="team成本中心">
            <Form
              className="affairs-flow-basic"
            >
              <CoreForm items={items} />
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

export default CostCenterInfo;
