/**
 * 推荐公司管理 - 详情页 system/recommendedcompany/detail
 */
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Table, Button } from 'antd';
import dot from 'dot-prop';

import { CoreContent, DeprecatedCoreForm } from '../../../components/core';
import {
  RecommendedCompanyState,
  RecommendedCompanyServiceRangeState,
  RecommendedCompanyServiceRangeDomain,
} from '../../../application/define';
import Update from './update';
import Create from './components/servicerange/create';
import Operate from '../../../application/define/operate';
import styles from './style/index.less';

function Detail(props) {
  // 是否显示编辑推荐公司基本信息的modal
  const [isShowUpdateModal, setIsShowUpdateModal] = useState(false);
  // 是否显示新增推荐公司服务范围的modal
  const [isShowCreateModal, setIsShowCreateModal] = useState(false);

  const privates = {
    recommendedCompanyId: dot.get(props, 'location.query.id', undefined),
  };

   // 获取服务范围列表
  const fetchServiceRange = () => {
    props.dispatch({
      type: 'systemRecommendedCompany/fetchServiceRange',
      payload: { recommendedCompanyId: privates.recommendedCompanyId },
    });
  };

  // 获取推荐公司详情
  const fetchCompanyDetail = () => {
    props.dispatch({
      type: 'systemRecommendedCompany/fetchCompanyDetail',
      payload: { recommendedCompanyId: privates.recommendedCompanyId },
    });
  };

  // 重置服务范围列表
  const resetServiceRange = () => {
    props.dispatch({
      type: 'systemRecommendedCompany/resetServiceRange',
    });
  };

  // 重置公司详情
  const resetCompanyDetail = () => {
    props.dispatch({
      type: 'systemRecommendedCompany/resetCompanyDetail',
    });
  };

  useEffect(() => {
 // 拉取数据
    fetchServiceRange();
    fetchCompanyDetail();

    return () => {
      // 重置数据
      resetServiceRange();
      resetCompanyDetail();
    };
  }, []);


  // 改变编辑Modal的显示和隐藏
  const onChangeIsShowUpdateModal = (ShowUpdateModal) => {
    setIsShowUpdateModal(ShowUpdateModal);
  };
  // 渲染基本信息
  const renderBaseInfo = () => {
    const dataSource = dot.get(props, 'companyDetail', {});
    const { name, abbreviation, code, state } = dataSource;
    const lineFeedStyle = {
      wordWrap: 'break-word',
      wordBreak: 'break-all',
    };
    const formItems = [
      {
        label: '推荐公司',
        span: 5,
        form: <div style={lineFeedStyle}>{name}</div>,
      },
      {
        label: '公司简称',
        span: 5,
        form: <div style={lineFeedStyle}>{abbreviation}</div> || '--',
      },
      {
        label: '公司代号',
        span: 5,
        form: code ? <div style={lineFeedStyle} className={styles['app-comp-system-detail-form-item-code']}>{code}</div> : '--',
      },
      {
        label: '状态',
        span: 5,
        form: RecommendedCompanyState.description(state),
      },
      {
        label: '',
        span: 4,
        form: Operate.canOperateSystemRecommendedCompanyUpdate() ?
          (<Button
            type="primary"
            onClick={() => onChangeIsShowUpdateModal(true)}
          >
              编辑
          </Button>) : null,
      },
    ];
    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
    return (
      <CoreContent>
        <DeprecatedCoreForm
          items={formItems}
          cols={6}
          layout={layout}
        />
      </CoreContent>
    );
  };

  // 改变服务范围状态
  const onChangeServiceRangeState = (serviceRangeId, state) => {
    props.dispatch({
      type: 'systemRecommendedCompany/changeServiceRangeState',
      payload: {
        serviceRangeId,
        state,
        onSuccessCallback: () => { fetchServiceRange(); },
      },
    });
  };

  // 渲染服务范围列表
  const renderContent = () => {
    const dataSource = dot.get(props, 'serviceRange.data', []);
    const columns = [
      {
        title: '服务平台',
        dataIndex: 'platform_name',
      },
      {
        title: '服务供应商范围',
        render: record => (record.domain === RecommendedCompanyServiceRangeDomain.platform ? '全部' : record.supplier_name),
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: text => RecommendedCompanyServiceRangeState.description(text),
      },
      {
        title: '操作',
        render: (text) => {
          // 操作
          let oprations = null;
          if (Operate.canOperateSystemRecommendedCompanyUpdate() === false) return oprations;
          if (text.state === RecommendedCompanyServiceRangeState.on) {
            // 启用状态下, 展示“停用”按钮
            oprations = (
              <a
                className={styles['app-comp-system-detail-table-btn']}
                onClick={() => onChangeServiceRangeState(text._id, RecommendedCompanyServiceRangeState.off)}
              >停用</a>
            );
          } else if (text.state === RecommendedCompanyServiceRangeState.off) {
            // 停用状态下, 展示“删除”和“启用”按钮
            oprations = (
              <span>
                <a
                  className={styles['app-comp-system-detail-table-btn']}
                  onClick={() => onChangeServiceRangeState(text._id, RecommendedCompanyServiceRangeState.deleted)}
                >删除</a>
                <a
                  className={styles['app-comp-system-detail-table-btn']}
                  onClick={() => onChangeServiceRangeState(text._id, RecommendedCompanyServiceRangeState.on)}
                >启用</a>
              </span>
            );
          }
          return oprations;
        },
      },
    ];
    // 操作按钮
    let operations = null;
    if (Operate.canOperateSystemRecommendedCompanyUpdate()) {
      operations = (
        <Button type="primary" onClick={() => onChangeIsShowCreateModal(true)}>添加</Button>
      );
    }
    return (
      <CoreContent
        title="推荐公司服务范围列表"
        titleExt={operations}
      >
        <Table
          rowKey={({ _id }) => _id}
          pagination={false}
          columns={columns}
          dataSource={dataSource}
        />
      </CoreContent>
    );
  };

   // 编辑基本信息成功回调
  const onUpdateCompanyDetailSuccess = () => {
    // 隐藏modal
    onChangeIsShowUpdateModal(false);
    // 刷新推荐公司基本信息数据
    fetchCompanyDetail();
  };

  // 渲染编辑modal
  const renderUpdateModal = () => {
    const dataSource = dot.get(props, 'companyDetail', {});
    return (
      <Update
        visible={isShowUpdateModal}
        dataSource={dataSource}
        onCreateSuccess={onUpdateCompanyDetailSuccess}
        onCancel={() => onChangeIsShowUpdateModal(false)}
      />
    );
  };

  // 改变新增Modal的显示和隐藏
  const onChangeIsShowCreateModal = (ShowCreateModal) => {
    setIsShowCreateModal(ShowCreateModal);
  };

  // 新增服务范围成功回调
  const onCreateServiceRangeSuccess = () => {
    // 隐藏modal
    onChangeIsShowCreateModal(false);
    // 刷新服务范围数据
    fetchServiceRange();
  };

  // 渲染新增服务范围的modal
  const renderCreateModal = () => {
    const serviceRange = dot.get(props, 'serviceRange.data', []);
    return (
      <Create
        visible={isShowCreateModal}
        recommendedCompanyId={privates.recommendedCompanyId}
        serviceRange={serviceRange}
        onCreateSuccess={onCreateServiceRangeSuccess}
        onCancel={() => onChangeIsShowCreateModal(false)}
      />
    );
  };

  return (
    <div>
      {/* 渲染基本信息 */}
      {renderBaseInfo()}

      {/* 渲染服务范围列表 */}
      {renderContent()}

      {/* 渲染编辑基本信息modal */}
      {renderUpdateModal()}

      {/* 渲染新增服务范围modal */}
      {renderCreateModal()}
    </div>
  );
}

const mapStateToProps = ({
  systemRecommendedCompany: { serviceRange, companyDetail },
}) => {
  return { serviceRange, companyDetail };
};

export default connect(mapStateToProps)(Form.create()(Detail));
