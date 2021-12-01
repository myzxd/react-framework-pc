/**
 * 无业主商圈监控
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

import Search from './search';
import { CoreContent } from '../../../../components/core';
import { DistrictState } from '../../../../application/define';
import CreateModal from './model';

function Index(props) {
  const { dispatch } = props;
  const [meta, setMeta] = useState({ page: 1, limit: 30 });
  const [modalParams, onChangeModalParams] = useState({});
  const [searchParams, onSearchParams] = useState({});
  const nothingOwnerData = dot.get(props, 'nothingOwnerData', {});
  useEffect(() => {
    dispatch({
      type: 'nothingOwner/fetchNothingOwnerList',
      payload: {
        meta,
        ...searchParams,
      },
    });
    // 清除数据
    return () => {
      dispatch({
        type: 'nothingOwner/reduceNothingOwner',
        payload: {} });
    };
  }, [dispatch, meta, searchParams]);

  // 成功回调
  const onSuccessCallBack = () => {
    setMeta({ page: 1, limit: 30 });
  };

  // 查询
  const onSearch = (params) => {
    onSearchParams(params);
    setMeta({ page: 1, limit: 30 });
  };

    // 修改分页
  const onChangePage = (page, limit) => {
    setMeta({ page, limit });
  };

    // 改变每页展示条数
  const onShowSizeChange = (page, limit) => {
    setMeta({ page, limit });
  };

  // 渲染搜索
  const renderSearch = () => {
    return (
      <Search onSearch={onSearch} />
    );
  };

  // 渲染table列表
  const renderContent = () => {
    const { page, limit } = meta;

    const columns = [
      {
        title: '商圈名称',
        dataIndex: 'name',
        key: 'name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '商圈三方ID',
        dataIndex: 'custom_id',
        key: 'custom_id',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '商圈BOSS ID',
        dataIndex: '_id',
        key: '_id',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '商圈状态',
        dataIndex: 'state',
        key: 'state',
        render: (text) => {
          return text ? DistrictState.description(text) : '--';
        },
      },
      {
        title: '平台',
        dataIndex: 'platform_name',
        key: 'platform_name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '供应商',
        dataIndex: 'supplier_name',
        key: 'supplier_name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '城市',
        dataIndex: 'city_name',
        key: 'city_name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 150,
        render: (text, record) => {
          return (
            <React.Fragment>
              {/* 显示弹框 */}
              <a onClick={() => onChangeModalParams({ visible: true, districtId: record._id })}>
                添加业务承揽</a>
            </React.Fragment>
          );
        },
      },
    ];

      // 分页
    const pagination = {
      current: page,
      pageSize: limit,                      // 默认数据条数
      onChange: onChangePage,              // 切换分页
      showQuickJumper: true,                    // 显示快速跳转
      showSizeChanger: true,                    // 显示分页
      onShowSizeChange,  // 展示每页数据数
      showTotal: total => `总共${total}条`,      // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(nothingOwnerData, '_meta.result_count', 0), // 数据总条数
    };

    return (
      <CoreContent>
        {/* 数据 */}
        <Table
          rowKey={(record) => {
            return record._id;
          }}
          pagination={pagination}
          dataSource={dot.get(nothingOwnerData, 'data', [])}
          columns={columns}
          bordered
        />
      </CoreContent>
    );
  };
  return (
    <React.Fragment>
      {/* 渲染搜索 */}
      {renderSearch()}

      {/* 渲染table列表 */}
      {renderContent()}

      <CreateModal
        {...modalParams}
        onSuccessCallBack={onSuccessCallBack}
        onChangeModalParams={onChangeModalParams}
      />
    </React.Fragment>
  );
}
function mapStateToProps({ nothingOwner: { nothingOwnerData } }) {
  return { nothingOwnerData };
}
export default connect(mapStateToProps)(Index);
