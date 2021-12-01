/*
 * 共享登记 - 合同列表 /Shared/Contract
 */
import React, { useState } from 'react';
import { Tabs } from 'antd';
import Public from './public';

const { TabPane } = Tabs;

const Contract = () => {
  const [tabkey, setTabkey] = useState(undefined);
  const onChangeTab = (key) => {
    setTabkey(key);
  };

  return (
    <div>
      <Tabs defaultActiveKey="tab1" onTabClick={onChangeTab}>
        <TabPane tab="待生效" key="tab1">
          <Public tabKey="tab1" tabKeyState={tabkey} />
        </TabPane>
        <TabPane tab="生效中/已失效" key="tab2">
          <Public tabKey="tab2" tabKeyState={tabkey} />
        </TabPane>
        <TabPane tab="已作废" key="tab3">
          <Public tabKey="tab3" tabKeyState={tabkey} />
        </TabPane>
        <TabPane tab="其他" key="tab4">
          <Public tabKey="tab4" tabKeyState={tabkey} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Contract;
