/**
 * 布局包装容器
 */
import React from 'react';
import { Collapse } from 'antd';
import { CoreContent } from '../../../../../components/core';

const Panel = Collapse.Panel;

function PageDetailWapper(props) {
  const { query = {} } = props;
  const { id = 'GET参数中获取id' } = query;

  return (
    <CoreContent title="单据详情布局模拟">
      <Collapse bordered={false} activeKey="active">
        <Panel header={`单号: ${id}`} key="active">
          {props.children}
        </Panel>
      </Collapse>
    </CoreContent>
  );
}

export default PageDetailWapper;
