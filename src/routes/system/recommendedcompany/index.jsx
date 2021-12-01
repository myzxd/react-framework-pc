/**
 * 推荐公司管理 - 列表页 system/recommendedcompany/index
 */
import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { connect } from 'dva';
import dot from 'dot-prop';
import { Link } from 'dva/router';
import moment from 'moment';

import { CoreContent } from '../../../components/core';
import { RecommendedCompanyState } from '../../../application/define';
import Search from './search';
import Create from './create';
import Operate from '../../../application/define/operate';
import styles from './style/index.less';

// 搜索状态默认不选代表“全部”
const defaultState = undefined;
// 列表默认分页参数
const defaultMeta = {
  page: 1, // 页码: 1
  limit: 30, // 每页数量: 30
};

const privates = {
  // 搜索参数
  searchParams: {
    state: defaultState,
    companyId: undefined,         // 推荐公司id
    companyName: undefined,       // 推荐公司名称
    meta: {
      page: defaultMeta.page,
      limit: defaultMeta.limit,
    },
  },
};

function Index(props) {
  // 创建modal是否显示
  const [isShowCreteModal, setIsShowCreteModal] = useState(false);


  // 调用搜索
  const onSearch = () => {
    props.dispatch({
      type: 'systemRecommendedCompany/fetchCompanyData',
      payload: privates.searchParams,
    });
  };

  // 重置推荐公司列表数据
  const resetCompanyData = () => {
    props.dispatch({
      type: 'systemRecommendedCompany/resetCompanyData',
      payload: privates.searchParams,
    });
  };

  useEffect(() => {
    onSearch();
    return () => {
      // 重置数据
      resetCompanyData();
    };
  }, []);

  // 点击搜索回调
  const onSearchCallback = (params) => {
    // 保存搜索参数
    privates.searchParams = { ...privates.searchParams, ...params };
    // 页码置为默认
    privates.searchParams.meta.page = defaultMeta.page;
    // 调用搜索
    onSearch();
  };

    // 渲染搜索
  const renderSearch = () => {
    return (
      <Search
        defaultState={defaultState} // 默认状态
        onSearch={onSearchCallback} // 点击搜索回调
      />
    );
  };

  // 改变推荐公司状态成功回调
  const onChangeCompanyStateSuccess = () => {
    onSearch();
  };

   // 改变推荐公司状态
  const onChangeCompanyState = (recommendedCompanyId, state) => {
    props.dispatch({
      type: 'systemRecommendedCompany/changeCompanyState',
      payload: {
        state,
        recommendedCompanyId,
        onSuccessCallback: onChangeCompanyStateSuccess,
      },
    });
  };

  // 改变分页信息
  const onChangeMeta = (page, limit) => {
    const { searchParams } = privates;
    searchParams.meta.page = page;
    searchParams.meta.limit = limit;
    onSearch();
  };

  // 改变创建modal显示隐藏
  const onChangeIsShowCreateModal = (ShowCreteModal) => {
    setIsShowCreteModal(ShowCreteModal);
  };

  // 渲染列表
  const renderContent = () => {
    /**
     * 当前页码
     * 注意: 此处未将page放入state中, 所以单独更新此page
     * 不会触发render; 但是在此页面page的改变总是伴随着
     * callSearch方法的调用, 所以会触发render, 使分页信息
     * 的page更新到页面上
     */
    const { page } = privates.searchParams.meta;
    // 条目数量
    const count = dot.get(props, 'companyData._meta.result_count', 0);
    // 数据源
    const dataSource = dot.get(props, 'companyData.data', []);
    // 列信息
    const columns = [
      {
        title: '推荐公司ID',
        dataIndex: '_id',
      },
      {
        title: '推荐公司',
        dataIndex: 'name',
      },
      {
        title: '公司简称',
        dataIndex: 'abbreviation',
        render: text => text || '--',
      },
      {
        title: '公司代号',
        dataIndex: 'code',
        render: (text) => {
          if (!text) {
            return '--';
          }
          return <div className={styles['app-comp-system-recommend-table-td-code']}>{text}</div>;
        },
      },
      {
        title: '平台',
        dataIndex: 'platform_list',
        render: (text) => {
          if (!Array.isArray(text) || text.length <= 0) return '--';
          const platformNames = [];
          text.forEach((platformInfo) => { platformNames.push(platformInfo.platform_name); });
          return platformNames.join('、');
        },
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: text => RecommendedCompanyState.description(text),
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        render: text => moment(text).format('YYYY-MM-DD HH:mm'),
      },
      {
        title: '最后操作时间',
        dataIndex: 'updated_at',
        render: text => moment(text).format('YYYY-MM-DD HH:mm'),
      },
      {
        title: '最新操作人',
        dataIndex: 'operator_info',
        render: text => (text && text.name) || '--',
      },
      {
        title: '操作',
        key: 'opration',
        width: 100,
        render: (record) => {
          // 停用/启用操作
          let stateOpration = null;
          if (Operate.canOperateSystemRecommendedCompanyUpdate()) {
            if (record.state === RecommendedCompanyState.on) {
              // 如果是启用状态, 则显示停用操作
              stateOpration = (
                <Popconfirm
                  title="你确定要停用该推荐公司？"
                  content="停用后骑士将无法选择该公司为推荐公司。"
                  onConfirm={() => onChangeCompanyState(record._id, RecommendedCompanyState.off)}
                  okText="确认"
                  cancelText="取消"
                >
                  <a className={styles['app-comp-system-recommend-table-btn']}>停用</a>
                </Popconfirm>
              );
            } else if (record.state === RecommendedCompanyState.off) {
              // 如果是停用状态, 则显示启用操作
              stateOpration = (
                <Popconfirm
                  title="你确定要启用该推荐公司？"
                  content="启用后骑士可选择该公司为推荐公司。"
                  onConfirm={() => onChangeCompanyState(record._id, RecommendedCompanyState.on)}
                  okText="确认"
                  cancelText="取消"
                >
                  <a className={styles['app-comp-system-recommend-table-btn']}>启用</a>
                </Popconfirm>
              );
              // 如果非停用/启用状态则不展示该按钮
            }
          }
          return (
            <span>
              {/* 启用/停用按钮 */}
              {stateOpration}
              {/* 详情按钮 */}
              {Operate.canOperateSystemRecommendedCompanyDetail() ?
                (<Link
                  className={styles['app-comp-system-recommend-table-detail-btn']}
                  to={{
                    pathname: '/System/RecommendedCompany/Detail',
                    search: `?id=${record._id}`,
                  }}
                  target="_blank"
                >
                  详情
                </Link>) : null}
            </span>
          );
        },
      },
    ];
    // 分页配置
    const pagination = {
      current: page, // 页码
      defaultPageSize: defaultMeta.limit, // 默认数据条数
      showQuickJumper: true, // 显示快速跳转
      showSizeChanger: true, // 显示分页
      showTotal: total => `总共${total}条`, // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: count, // 数据总条数
      onChange: onChangeMeta, // 改变页码
      onShowSizeChange: onChangeMeta, // 改变每页显示条数
    };
    // 操作按钮
    let operations = null;
    if (Operate.canOperateSystemRecommendedCompanyUpdate()) {
      operations = (<Button type="primary" onClick={() => onChangeIsShowCreateModal(true)}>新增推荐公司</Button>);
    }

    return (
      <CoreContent
        title="推荐公司列表"
        titleExt={operations}
      >
        <Table
          rowKey={({ _id }) => _id}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          scroll={{ y: 500 }}
        />
      </CoreContent>
    );
  };


   // 创建成功回调
  const onCreateSuccess = ({ record: { _id: recommendedCompanyId } }) => {
    onChangeIsShowCreateModal(false);
    props.history.push(`/System/RecommendedCompany/Detail?id=${recommendedCompanyId}`);
  };

  // 渲染创建modal
  const renderCreate = () => {
    return (
      <Create
        visible={isShowCreteModal}
        onCreateSuccess={onCreateSuccess}
        onCancel={() => onChangeIsShowCreateModal(false)}
      />
    );
  };

  return (
    <div>
      {/* 渲染搜索区域 */}
      {renderSearch()}

      {/* 渲染列表 */}
      {renderContent()}

      {/* 渲染创建modal */}
      {renderCreate()}
    </div>
  );
}

function mapStateToProps({ systemRecommendedCompany: { companyData } }) {
  return { companyData };
}

export default connect(mapStateToProps)(Index);
