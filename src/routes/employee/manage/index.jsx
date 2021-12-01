/**
 * 人员管理 - 人员档案
 */
import React, { useState } from 'react';
import {
  Tabs,
  Empty,
} from 'antd';

import Operate from '../../../application/define/operate';
import { utils } from '../../../application';

import Second from './second/index';
import Staff from './staff/index';

const { TabPane } = Tabs;

const canOperateEmployeeFileTypeSecond = Operate.canOperateEmployeeFileTypeSecond();
const canOperateEmployeeFileTypeStaff = Operate.canOperateEmployeeFileTypeStaff();

const PersonnelFile = ({
  location = {},
}) => {
  // 默认tab key
  let initFileType;
  canOperateEmployeeFileTypeStaff && (initFileType = 'staff');
  canOperateEmployeeFileTypeSecond && (initFileType = 'second');

  const [tabKey, setTabKey] = useState(utils.dotOptimal(location, 'query.fileType', initFileType));

  // tab onChange
  const onChangeTabs = (key) => {
    setTabKey(key);
  };

  // 无权限
  if (!canOperateEmployeeFileTypeSecond && !canOperateEmployeeFileTypeStaff) {
    return <Empty />;
  }

  return (
    <Tabs
      activeKey={tabKey}
      onChange={onChangeTabs}
    >
      {
        canOperateEmployeeFileTypeSecond && (
          <TabPane
            tab="劳动者档案"
            key="second"
          >
            <Second />
          </TabPane>
        )
      }
      {
        canOperateEmployeeFileTypeStaff && (
          <TabPane
            tab="员工"
            key="staff"
          >
            <Staff />
          </TabPane>
        )
      }
    </Tabs>
  );
};

export default PersonnelFile;
