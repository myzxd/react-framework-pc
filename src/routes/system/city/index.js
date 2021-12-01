/**
 *  城市管理
 */
import is from 'is_js';
import dot from 'dot-prop';
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

import Operate from '../../../application/define/operate';
import { CoreContent } from '../../../components/core';
import Search from './search';
import styles from './style/index.less';

const Namespace = 'default';

const ComponentCity = (props = {}) => {
  const {
    dispatch,
    cityList = {},
  } = props;
 // 分页
  const [searchParams, setSearchParams] = useState({ meta: { page: 1, limit: 30 } });

  useEffect(() => {
    dispatch({
      type: 'systemCity/fetchCityList',
      payload: searchParams,
    });
  }, [searchParams]);

  // 搜索
  const onSearch = (params) => {
    setSearchParams({ ...params, meta: { page: 1, limit: 30 } });
  };

  // 改变每页展示条数
  const onShowSizeChange = (page, limit) => {
    setSearchParams({ ...searchParams, meta: { page, limit } });
  };

  // 修改分页
  const onChangePage = (page, limit) => {
    setSearchParams({ ...searchParams, meta: { page, limit } });
  };

  // 渲染搜索区域
  const renderSearch = () => {
    return (
      <Search
        onSearch={onSearch}
        dispatch={dispatch}
      />
    );
  };

  // 渲染列表
  const renderContent = () => {
    const { page, limit } = searchParams.meta;
    const dataSource = dot.get(cityList, `${Namespace}.data`, []); // 数据列表
    const dataSourceCount = dot.get(cityList, `${Namespace}._meta.result_count`, 0); // 总数据长度

    const columns = [
      {
        title: '平台',
        dataIndex: 'name',
        key: 'name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '所属场景',
        dataIndex: 'industry_name',
        key: 'industry_name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
        },
      },
      {
        title: '创建者',
        dataIndex: 'creator_info',
        key: 'creator_info',
        render: (text) => {
          if (is.not.existy(text) || is.empty(text)) {
            return '--';
          }
          return text.name || '--';
        },
      },
      {
        title: '最后操作时间',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
        },
      },
      {
        title: '最新操作者',
        dataIndex: 'operator_info',
        key: 'operator_info',
        render: (text) => {
          if (is.not.existy(text) || is.empty(text)) {
            return '--';
          }
          return text.name || '--';
        },
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, record) => {
          return (
            <div>
              {
                Operate.canOperateSystemCityUpdate() ? (
                  <a
                    href={`#/System/City/Update?id=${record._id}`}
                    className={styles['app-comp-system-operate-btn']}
                  >
                  编辑</a>
                ) : ''}
              <a
                href={`#/System/City/Detail?id=${record._id}`}
                className={styles['app-comp-system-operate-btn']}
              >
              查看详情</a>
            </div>
          );
        },
      },
    ];
    // 分页
    const pagination = {
      // 每次点击查询, 重置页码为1
      current: page,
      defaultPageSize: limit,                   // 默认数据条数
      pageSize: limit,                          // 每页条数
      onChange: onChangePage,             // 切换分页
      showQuickJumper: true,                   // 显示快速跳转
      showSizeChanger: true,                   // 显示分页
      onShowSizeChange, // 展示每页数据数
      showTotal: total => `总共${total}条`,     // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dataSourceCount || 0,             // 数据总条数
    };
    return (
      <CoreContent title="平台城市方案列表">
        <Table
          rowKey={(record) => { return record._id; }}
          pagination={pagination}
          dataSource={dataSource}
          columns={columns}
        />
      </CoreContent>

    );
  };

  return (
    <div>
      {/* 渲染搜索区域 */}
      {renderSearch()}
      {/* 渲染列表 */}
      {renderContent()}
    </div>
  );
};

function mapStateToProps({ systemCity: { cityList } }) {
  return { cityList };
}

export default connect(mapStateToProps)(ComponentCity);
