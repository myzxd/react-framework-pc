/**
 * 个户注册数据
 * */
import moment from 'moment';
import dot from 'dot-prop';
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Table } from 'antd';

import { CoreTabs, CoreContent } from '../../../components/core';
import Search from './search';

let searchParams = { page: 1, limit: 30 };
function Index(props) {
  const [yesterday] = useState(moment().subtract(1, 'days').format('YYYY.MM.DD 23:00:00'));


  const onInterface = () => {
    props.dispatch({ type: 'employeeStatisticsData/fetchEmployeeStatisticsData', payload: searchParams });
  };

  useEffect(() => {
// 调用接口
    onInterface();
  }, []);


  const onSearch = (params) => {
    const payload = {
      ...params,
    };
    searchParams = payload;
    onInterface();
  };

   // 导出
  const onClickExport = () => {
    props.dispatch({ type: 'employeeStatisticsData/exportEmployeeStatisticsData', payload: searchParams });
  };

   // 渲染tab
  const renderTabs = () => {
    const items = [
      {
        title: '个户注册数据',
        key: '个户注册数据',
      },
    ];
    return (
      <Row>
        <Col span={22}>
          <CoreTabs
            items={items}
          />
        </Col>
        <Col span={2}>
          <Button type="primary" onClick={onClickExport}>导出</Button>
        </Col>
      </Row>
    );
  };


    // 修改分页
  const onChangePage = (page, limit) => {
    searchParams.page = page;
    searchParams.limit = limit;
    onSearch(searchParams);
  };

       // 改变每页展示条数
  const onShowSizeChange = (page, limit) => {
    searchParams.page = page;
    searchParams.limit = limit;
    onSearch(searchParams);
  };

  // 渲染表格
  const renderTables = () => {
    const columns = [
      {
        title: '平台',
        dataIndex: 'platform_name',
        key: 'platform_name',
      },
      {
        title: '供应商',
        dataIndex: 'supplier_name',
        key: 'supplier_name',
        width: 200,
      },
      {
        title: '城市',
        dataIndex: ['city_info', 'city_name'],
        key: 'city_info.city_name',
        width: 100,
      },
      {
        title: '有效个户协议数量',
        dataIndex: 'succeeded_amount',
        key: 'succeeded_amount',
      },
      {
        title: '45天内个户协议到期数量',
        dataIndex: '45天内个户协议到期数量',
        key: '45天内个户协议到期数量',
        render: () => 0,
      },
      {
        title: '个户协议过期数量',
        dataIndex: '个户协议过期数量',
        key: '个户协议过期数量',
        render: () => 0,
      },
      {
        title: '未签署个户协议数量',
        dataIndex: 'unsuccessful_amount',
        key: 'unsuccessful_amount',
      },
    ];
    const dataSource = dot.get(props, 'statisticsData', {});
    // 分页
    const pagination = {
      // 每次点击查询, 重置页码为1
      current: searchParams.page,
      pageSize: searchParams.limit,          // 默认数据条数
      onChange: onChangePage,  // 切换分页
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,        // 显示分页
      onShowSizeChange,              // 展示每页数据数
      showTotal: total => `总共${total}条`,                  // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(dataSource, '_meta.result_count', 0),  // 数据总条数
    };

    return (
      <CoreContent>
        <div style={{ marginBottom: 10 }}>最近更新时间：{yesterday}</div>
        <Table rowKey={(record, index) => { return index; }} pagination={pagination} columns={columns} dataSource={dataSource.data} bordered scroll={{ y: 500 }} />
      </CoreContent>
    );
  };

  return (
    <div>
      {/* 渲染tab */}
      {renderTabs()}

      {/* 查询 */}
      <Search onSearch={onSearch} />

      {renderTables()}
    </div>
  );
}

const mapStateToProps = ({ employeeStatisticsData: { statisticsData } }) => {
  return { statisticsData };
};

export default connect(mapStateToProps)(Index);
