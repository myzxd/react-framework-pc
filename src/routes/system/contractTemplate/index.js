/**
 * 合同模版管理
*/
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { Table, Popconfirm, Button } from 'antd';
import { connect } from 'dva';

import { CoreContent } from '../../../components/core';
import { utils } from '../../../application';
import { ContractTemplateState } from '../../../application/define';
import Operate from '../../../application/define/operate';

import Search from './search';
import CreateModal from './createModal';
import PreviewTemplate from './previewTemplate';

function ContractTemplate(props) {
  const { dispatch, contractTemplates } = props;
  const meta = { page: 1, limit: 30 };
  const [searchParams, setSearchParams] = useState({ meta });
  const [visible, setVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewId, setPreviewId] = useState();
  useEffect(() => {
    dispatch({
      type: 'systemContractTemplate/fetchContractTemplates',
      payload: {
        state: ContractTemplateState.on,
        ...searchParams,
      } });
    return () => {
      dispatch({ type: 'systemContractTemplate/reduceContractTemplates', payload: {} });
    };
  }, [dispatch, searchParams]);
  // 查询
  const onSearch = (values) => {
    setSearchParams({
      ...values,
      meta,
    });
  };

  // 分页
  const onChangePage = (page, limit) => {
    setSearchParams({
      ...searchParams,
      meta: { page, limit },
    });
  };

  // 成功回调
  const onSuccessCallback = () => {
    dispatch({
      type: 'systemContractTemplate/fetchContractTemplates',
      payload: {
        state: ContractTemplateState.on,
        ...searchParams,
      } });
  };

  // 刷新
  const onClickRefresh = (record) => {
    dispatch({
      type: 'systemContractTemplate/fetchRefreshContractTemplate',
      payload: {
        id: utils.dotOptimal(record, '_id', undefined),
        onSuccessCallback,
      },
    });
  };

  // 删除
  const onDelete = (record) => {
    dispatch({
      type: 'systemContractTemplate/deleteContractTemplates',
      payload: {
        id: utils.dotOptimal(record, '_id', undefined),
        onSuccessCallback,
      },
    });
  };

  // 关闭弹框
  const onCancel = () => {
    setVisible(false);
  };

  const onClickCreate = () => {
    setVisible(true);
  };

  // 预览
  const onClickPreview = (record) => {
    setPreviewId(record._id);
    setPreviewVisible(true);
  };

  // 预览 - 关闭
  const onCancelPreview = () => {
    setPreviewVisible(false);
    setPreviewId(undefined);
  };

  // 渲染列表
  const renderContent = () => {
    const { page, limit } = searchParams.meta;
    const dataSource = utils.dotOptimal(contractTemplates, 'data', []); // 数据列表

    const columns = [
      {
        title: '编号',
        dataIndex: 'number',
        key: 'number',
        render: (text, record, index) => {
          const num = (limit * (page - 1)) + index + 1;
          return <div>{num}</div>;
        },
      },
      {
        title: '合同模板编码',
        dataIndex: '_id',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '合同模板名称',
        width: 450,
        dataIndex: 'name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '操作人',
        dataIndex: ['operator_info', 'name'],
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '操作时间',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
        },
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: (text) => {
          return ContractTemplateState.description(text);
        },
      },
      {
        title: '操作',
        dataIndex: 'operate',
        render: (text, record) => {
          return (
            <div>
              <a style={{ marginRight: 10 }} onClick={() => onClickRefresh(record)}>刷新</a>
              <Popconfirm title="您是否确认删除此合同模版？" onConfirm={() => onDelete(record)}>
                <a>删除</a>
              </Popconfirm>
              <a style={{ marginLeft: 10 }} onClick={() => onClickPreview(record)}>预览合同模板</a>
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
      onShowSizeChange: onChangePage, // 展示每页数据数
      showTotal: total => `总共${total}条`,     // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: utils.dotOptimal(contractTemplates, '_meta.result_count', 0), // 数据总条数
    };
    return (
      <CoreContent title="合同模版列表">
        <Table
          rowKey={(record) => { return record._id; }}
          bordered
          pagination={pagination}
          dataSource={dataSource}
          columns={columns}
        />
      </CoreContent>

    );
  };

  return (
    <React.Fragment>
      <Search
        onSearch={onSearch}
        operations={
          <React.Fragment>
            <Button type="primary" onClick={onClickCreate}>新增合同模板</Button>
            {
              // 判断是否有权限
              Operate.canOperateSystemContractTemplateComponentDetail() ? (
                <Button
                  type="primary"
                  style={{ marginLeft: 10 }}
                  onClick={() => {
                    window.location.href = '/#/System/ContractTemplate/ComponentDetail';
                  }}
                >查看组件详情</Button>
              ) : null
            }
          </React.Fragment>
        }
      />
      {/* 渲染列表 */}
      {renderContent()}

      {/* 预览合同模版 */}
      {
        previewVisible ? (
          <PreviewTemplate onCancel={onCancelPreview} previewId={previewId} />
        ) : null
      }

      <CreateModal visible={visible} onCancel={onCancel} onSuccessCallback={onSuccessCallback} />
    </React.Fragment>
  );
}

function mapStateToProps({ systemContractTemplate: { contractTemplates } }) {
  return { contractTemplates };
}

export default connect(mapStateToProps)(ContractTemplate);
