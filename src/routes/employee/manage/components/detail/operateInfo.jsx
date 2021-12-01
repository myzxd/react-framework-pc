/**
 * 操作信息
 * */
import dot from 'dot-prop';
import React from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import { CoreContent } from '../../../../../components/core';

function OperateInfo(props) {
  const renderItems = (infoList, span) => {
    return (
      <Row>
        {
          infoList.map((item) => {
            return (
              <Col span={span} key={item.key}>
                <span>{item.key}</span>
                <span>{item.value}</span>
              </Col>
            );
          })
        }
      </Row>
    );
  };

  const employeeDetail = dot.get(props, 'employeeDetail', {});
  const infoList = [
    {
      key: '创建时间：',
      value: dot.get(employeeDetail, 'created_at') ? moment(dot.get(employeeDetail, 'created_at')).format('YYYY-MM-DD HH:mm') : '--',
    },
    {
      key: '更新时间：',
      value: dot.get(employeeDetail, 'updated_at') ? moment(dot.get(employeeDetail, 'updated_at')).format('YYYY-MM-DD HH:mm') : '--',
    },
    {
      key: '最新操作人：',
      value: dot.get(employeeDetail, 'operator_info.name', '--') || '--',
    },
  ];
  const span = 8;

  return (
    <CoreContent>
      {renderItems(infoList, span)}
    </CoreContent>
  );
}


export default OperateInfo;
