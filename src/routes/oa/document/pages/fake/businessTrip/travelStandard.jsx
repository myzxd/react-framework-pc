/*
 * code - 事务申请 - 出差申请 - 出差明细标准
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

import {
  Modal,
  Table,
  Button,
} from 'antd';

const TravelStandard = ({
  dispatch,
  travelStandardDetails = {}, // 出差辨准明细
}) => {
  // visible
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'fake/getTravelStandardDetails',
      payload: {},
    });

    return () => dispatch({
      type: 'fake/resetTravelStandardDetails',
      payload: {},
    });
  }, [dispatch]);

  const {
    detail_list: data = [], // 明细列表
    self_driving_desc: selfDrivingDesc, // 自驾说明
    first_tier_city: firstTierCity, // 一线城市
  } = travelStandardDetails;

  // modal
  const renderModal = () => {
    if (!visible) return;
    const tableTitle = (
      <div
        style={{ position: 'replative' }}
      >
        <div
          style={{
            textAlign: 'right',
            height: 11,
            position: 'absolute',
            top: '5px',
            right: '10px',
          }}
        >费用类型</div>
        <div
          style={{
            textAlign: 'left',
            height: 11,
            position: 'absolute',
            bottom: '10px',
          }}
        >职级</div>
        <div
          style={{
            content: '',
            position: 'absolute',
            width: 1,
            height: 132,
            background: '#f0f0f0',
            top: '-41px',
            left: '60px',
            transform: 'rotate(-68deg)',
            display: 'block',
          }}
        />
      </div>
    );

    const columns = [
      {
        title: tableTitle,
        width: 120,
        dataIndex: 'rank',
        render: text => text || '',
      },
      {
        title: '往返交通费',
        width: 150,
        dataIndex: 'transport_costs',
        render: text => text || '',
      },
      {
        title: '市内交通费',
        width: 100,
        dataIndex: 'business_traveling',
        render: text => text || '',
      },
      {
        title: '住宿费（一线城市）',
        width: 140,
        dataIndex: 'first_tier_quarterage',
        render: text => text || '',
      },
      {
        title: '住宿费（非一线城市）',
        width: 140,
        dataIndex: 'not_first_tier_quarterage',
        render: text => text || '',
      },
      {
        title: '出差补贴（餐费）',
        width: 140,
        dataIndex: 'meals',
        render: text => text || '',
      },
    ];

    return (
      <Modal
        title="差旅报销制度"
        visible={visible}
        width={850}
        footer={<Button type="primary" onClick={() => setVisible(false)}>关闭</Button>}
        onCancel={() => setVisible(false)}
      >
        <div
          style={{ fontWeight: 500, marginBottom: 5 }}
        >差旅报销说明：</div>
        <div>{`自驾标准：${selfDrivingDesc || '--'}`}</div>
        <div
          style={{ marginBottom: 5 }}
        >{`一线城市：${firstTierCity || '--'}`}</div>
        <Table
          rowKey={(re, key) => re._id || key}
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
        />
      </Modal>
    );
  };

  return (
    <React.Fragment>
      {renderModal()}
      <a onClick={() => setVisible(true)}>查看差旅报销制度</a>
    </React.Fragment>
  );
};

const mapStateToProps = ({
  fake: { travelStandardDetails },
}) => ({ travelStandardDetails });

export default connect(mapStateToProps)(TravelStandard);
