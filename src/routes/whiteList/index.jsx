/**
 * 白名单列表页/whiteList
 */
import is from 'is_js';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import dot from 'dot-prop';
import { Table, Button, Popconfirm, Tooltip } from 'antd';

import { CoreContent } from '../../components/core';
import { WhiteListTerminalType } from '../../application/define';
import Operate from '../../application/define/operate';

import Search from './search';
import styles from './style/index.less';

const Index = (props = {}) => {
  const {
    dispatch,
    whiteListData,
  } = props;
  // 搜索信息配置
  const [searchParams, setSearchParams] = useState({ page: 1, limit: 30 });

  // 获取列表数据
  useEffect(() => {
    dispatch({
      type: 'whiteList/fetchWhiteListList',
      payload: searchParams,
    });
  }, [searchParams]);

  // 搜索
  const onSearch = (params) => {
    setSearchParams({ ...params, page: 1, limit: 30 });
  };

  // 修改分页
  const onChangePage = (page, limit) => {
    setSearchParams({ ...searchParams, page, limit });
  };

  // 改变每页展示条数
  const onShowSizeChange = (page, limit) => {
    setSearchParams({ ...searchParams, page, limit });
  };

  // 关闭权限

  const handleClickCloseBtn = async (id) => {
    await dispatch({ type: 'whiteList/fetchWhiteListClosePer', payload: { id } });

    await dispatch({ type: 'whiteList/fetchWhiteListList', payload: searchParams });
  };

  // 渲染搜索功能
  const renderSearch = () => {
    return (
      <Search onSearch={onSearch} />
    );
  };

  // 渲染内容列表
  const renderContent = () => {
    //  获取平台列表在，列表只显示对应平台的信息
    // 权限数据
    const { data = [] } = whiteListData;
    const { page, limit } = searchParams;
    const columns = [
      {
        title: '平台',
        width: 100,
        dataIndex: 'platform_name',
        key: 'platform_name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '供应商',
        width: 100,
        dataIndex: 'supplier_name',
        key: 'supplier_name',
        render: (text) => {
          return text || '全部';
        },
      },
      {
        title: '城市',
        width: 100,
        dataIndex: 'city_list',
        key: 'city_list',
        render: (text) => {
          // 判断数据是否存在
          if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
            return '全部';
          }
          // 只有一行数据数据则直接返回
          if (text.length === 1) {
            return dot.get(text, '0.city_name');
          }
          // 默认使用弹窗显示数据
          return (
            <Tooltip title={text.map(item => item.city_name).join(' , ')}>
              <span>{dot.get(text, '0.city_name')} 等{text.length}条</span>
            </Tooltip>
          );
        },
      },
      {
        title: '商圈',
        width: 100,
        dataIndex: 'biz_district_list',
        key: 'biz_district_list',
        render: (text) => {
          // 判断数据是否存在
          if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
            return '全部';
          }
          // 只有一行数据数据则直接返回
          if (text.length === 1) {
            return dot.get(text, '0.name');
          }
          // 默认使用弹窗显示数据
          return (
            <Tooltip title={text.map(item => item.name).join(' , ')}>
              <span>{dot.get(text, '0.name')} 等{text.length}条</span>
            </Tooltip>
          );
        },
      },
      {
        title: '应用APP',
        width: 100,
        dataIndex: 'app_code',
        key: 'app_code',
        render: (text) => {
          return text ? WhiteListTerminalType.description(text) : '--';
        },
      },
      {
        title: '操作',
        width: 100,
        dataIndex: 'operate',
        key: 'operate',
        render: (text, record) => {
          let operateDetail;
          let operateUpdate;
          let operateDetele;
          // 设置详情权限
          if (Operate.canOperateWhiteListDetail()) {
            operateDetail = <a rel="noopener noreferrer" target="_blank" href={`/#/WhiteList/Detail?id=${record._id}`} className={styles['app-comp-white-list-operate-item']}>详情</a>;
          }
          // 设置编辑权限
          if (Operate.canOperateWhiteListUpdate()) {
            operateUpdate = <a rel="noopener noreferrer" href={`/#/WhiteList/Update?id=${record._id}`} className={styles['app-comp-white-list-operate-item']}>编辑</a>;
          }
          // 设置关闭权限
          if (Operate.canOperateWhiteListDelete()) {
            operateDetele = <Popconfirm placement="top" title={'确定关闭该范围的白名单?'} onConfirm={() => handleClickCloseBtn(record._id)} okText="确定" cancelText="取消"><a className={styles['app-comp-white-list-operate-item']}>关闭</a></Popconfirm>;
          }
          return (<div>
            {/* 详情操作按钮 */}
            {operateDetail}

            {/* 详情编辑按钮 */}
            {operateUpdate}

            {/* 详情关闭按钮 */}
            {operateDetele}
          </div>);
        },
      },
    ];

    // 分页
    const pagination = {
      // 每次点击查询, 重置页码为1
      current: page,
      pageSize: limit || 30,          // 默认数据条数
      onChange: onChangePage,  // 切换分页
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,        // 显示分页
      onShowSizeChange,              // 展示每页数据数
      showTotal: total => `总共${total}条`,                  // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(whiteListData, '_meta.result_count', 0),  // 数据总条数
    };

    // 新增按钮
    let createBtn;

    // 设置创建权限
    if (Operate.canOperateWhiteListCreate()) {
      createBtn = (<a key="create" rel="noopener noreferrer" href="/#/WhiteList/Create" className={styles['app-comp-white-list-operate-add']}><Button type="primary">新增</Button></a>);
    }

    return (
      <CoreContent title={'列表'} titleExt={createBtn}>
        <Table rowKey={(record, index) => { return index; }} pagination={pagination} columns={columns} dataSource={data} bordered scroll={{ y: 500 }} />
      </CoreContent>
    );
  };
  return (
    <div>
      {/* 渲染搜索功能 */}
      {renderSearch()}

      {/* 渲染内容列表 */}
      {renderContent()}
    </div>
  );
};

Index.propTypes = {
  whiteListData: PropTypes.object,
};

Index.defaultProps = {
  whiteListData: {},
};

const mapStateToProps = ({ whiteList: { whiteListData } }) => {
  return { whiteListData };
};

export default connect(mapStateToProps)(Index);
