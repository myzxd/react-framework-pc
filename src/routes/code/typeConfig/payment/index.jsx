/**
 * Code/Team审批管理 - 付款类型配置管理
 */
import dot from 'dot-prop';
import React, { useState } from 'react';
import {
  Row,
  Col,
} from 'antd';

import {
  CodeMatterType,
} from '../../../../application/define';
import {
  CoreTabs,
} from '../../../../components/core';

import TypeMenu from './menu';
import TypeContent from './content';

const PaymentTypeConfig = () => {
  // menu tree selectedKey
  const [menuSelectedKey, setMenuSelectedKey] = useState([]);
  const [tabKey, setTabKey] = useState(CodeMatterType.code);

  // tab content
  const renderTabContent = () => {
    // menu props
    const mProps = {
      tabKey,
      onSelect: val => setMenuSelectedKey(val),
      setMenuSelectedKey,
    };

    const cProps = {
      matterId: dot.get(menuSelectedKey, '0', undefined), // tab key
      tabKey,
    };

    return (
      <Row>
        <Col span={6}>
          <TypeMenu {...mProps} />
        </Col>
        <Col span={18}>
          <TypeContent {...cProps} />
        </Col>
      </Row>
    );
  };

  // tab items
  const tabItems = [
    // code
    {
      title: CodeMatterType.description(CodeMatterType.code),
      key: CodeMatterType.code,
    },
    // team
    {
      title: CodeMatterType.description(CodeMatterType.team),
      key: CodeMatterType.team,
    },
  ];

  return (
    <React.Fragment>
      <CoreTabs
        items={tabItems}
        onChange={val => setTabKey(val)}
        defaultActiveKey={tabKey}
      />
      {renderTabContent()}
    </React.Fragment>
  );
};

export default PaymentTypeConfig;
