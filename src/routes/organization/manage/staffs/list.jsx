/*
 * 组织架构 - 部门管理 - 岗位编制Tab - 列表组件
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';

import Public from './public';
// import Operate from '../../../../../../application/define/operate';

const { TabPane } = Tabs;

const voidFunc = () => {};
StaffsList.propTypes = {
  departmentId: PropTypes.string, // 当前部门id
  onChangePageType: PropTypes.func, // 更改页面类型
  onChangeCheckResult: PropTypes.func, // 更改部门操作校验结果Modal visible、获取部门操作提交事件、获取部门操作校验提示信息
};
StaffsList.defaultProps = {
  onChangePageType: voidFunc,
  onChangeCheckResult: voidFunc,
};

function StaffsList({
  departmentId,
  onChangePageType,
  onChangeCheckResult,
}) {
  const [activeKey, setActiveKey] = useState('tab1');
  useEffect(() => {
    setActiveKey('tab1');
  }, [departmentId]);

  // tab切换
  const changeTab = (key) => {
    setActiveKey(key);
  };
  return (
    <div>
      <Tabs
        activeKey={activeKey}
        onChange={changeTab}
        type="card"
      >
        <TabPane tab="正常" key="tab1">
          <Public
            tabKey={activeKey}
            departmentId={departmentId}
            onChangePageType={onChangePageType}
            onChangeCheckResult={onChangeCheckResult}
          />
        </TabPane>
        <TabPane tab="待生效" key="tab2">
          <Public
            tabKey={activeKey}
            departmentId={departmentId}
            onChangePageType={onChangePageType}
            onChangeCheckResult={onChangeCheckResult}
          />
        </TabPane>
        <TabPane tab="已关闭" key="tab3">
          <Public
            tabKey={activeKey}
            departmentId={departmentId}
            onChangePageType={onChangePageType}
            onChangeCheckResult={onChangeCheckResult}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default StaffsList;
