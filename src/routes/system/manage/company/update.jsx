/**
 * 合同归属 - 合同归属编辑
 */
import dot from 'dot-prop';
import is from 'is_js';
import { connect } from 'dva';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Table, Tooltip, Button, Popconfirm, Form } from 'antd';

import { CoreContent, CoreForm } from '../../../../components/core';
import { ThirdCompanyState, AllowElectionSign } from '../../../../application/define';

import CreateModal from './components/createModal';
import UpdateModal from './components/updateModal';
import PreviewContract from './components/previewContract';
import styles from './style/index.less';

function Update(props) {
  // 编辑对话框的可见状态
  const [updateVisible, setUpdateVisible] = useState(false);
  // 新建对话框的可见状态
  const [createVisible, setCreateVisible] = useState(false);
  // 编辑数据
  const [updateData, setUpdateData] = useState({});
  // 编辑数据
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewId, setPreviewId] = useState();

  const privates = {
    // 搜索的参数
    searchParams: {
      meta: { page: 1, limit: 30 },
    },
  };

  useEffect(() => {
    const { id } = props.location.query;
    if (id !== undefined) {
      props.dispatch({ type: 'systemManage/fetchContractDetail', payload: { id } });
      props.dispatch({ type: 'systemManage/fetchContractConfigurationList', payload: { id } });
    }
  }, []);


  // 显示编辑对话框
  const onShowUpdateModal = (record) => {
    setUpdateVisible(true);
    setUpdateData(record);
  };

  // 删除成功的回调
  const onSuccessCallBack = () => {
    const { id } = props.location.query;
    const { page, limit } = privates.searchParams;
    props.dispatch({ type: 'systemManage/fetchContractConfigurationList', payload: { id, page, limit } });
  };
  // 删除合同甲方配置
  const onConfirmOK = (id) => {
    props.dispatch({ type: 'systemManage/deleteContractConfiguration', payload: { id, onSuccessCallback: onSuccessCallBack } });
  };

  // 修改分页
  const onChangePage = (page, limit) => {
    const { id } = props.location.query;
    privates.searchParams.page = page;
    privates.searchParams.limit = limit;
    props.dispatch({ type: 'systemManage/fetchContractConfigurationList', payload: { id, page, limit } });
  };

  // 改变每页展示条数
  const onShowSizeChange = (page, limit) => {
    const { id } = props.location.query;
    privates.searchParams.page = page;
    privates.searchParams.limit = limit;
    props.dispatch({ type: 'systemManage/fetchContractConfigurationList', payload: { id, page, limit } });
  };

  // 显示创建对话框
  const onShowCreateModal = () => {
    setCreateVisible(true);
  };

  // 隐藏创建对话框
  const onHideCreateModal = () => {
    setCreateVisible(false);
  };


  // 隐藏编辑对话框
  const onHideUpdateModal = () => {
    setUpdateVisible(false);
    setUpdateData({});
  };

  // 预览合同
  const onClickPreview = (record) => {
    setPreviewVisible(true);
    setPreviewId(record._id);
  };

  // 关闭预览弹框
  const onCancelPreview = () => {
    setPreviewVisible(false);
    setPreviewId(undefined);
  };

  // 渲染头部详情信息
  const renderDetailInfo = () => {
    // css换行处理
    const LineFeedStyle = {
      wordWrap: 'break-word',
      wordreBak: 'break-all',
    };
    const detailData = dot.get(props, 'contractDetail', {}); // 详情数据
    const layout = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
    const formItems = [
      <Form.Item label="公司名称" {...layout}>
        <div style={LineFeedStyle}>{dot.get(detailData, 'name', undefined) || '--'}</div>
      </Form.Item>,
      <Form.Item label="统一社会信用代码" {...layout}>
        <div style={LineFeedStyle}>{dot.get(detailData, 'credit_no', undefined) || '--'}</div>
      </Form.Item>,
      <Form.Item label="法人" {...layout}>
        <div style={LineFeedStyle}>{dot.get(detailData, 'legal_person', undefined) || '--'}</div>
      </Form.Item>,
      <Form.Item label="电话" {...layout}>
        <div style={LineFeedStyle}>{dot.get(detailData, 'phone', undefined) || '--'}</div>
      </Form.Item>,
      <Form.Item label="地址" {...layout}>
        <div style={LineFeedStyle}>{dot.get(detailData, 'address', undefined) || '--'}</div>
      </Form.Item>,
      <Form.Item label="是否允许电子签" {...layout}>
        <div style={LineFeedStyle}>{AllowElectionSign.description(dot.get(detailData, 'is_electronic_sign', false))}</div>
      </Form.Item>,
      <Form.Item label="状态" {...layout}>
        <div>{dot.get(detailData, 'state', undefined) ? ThirdCompanyState.description(dot.get(detailData, 'state', undefined)) : '--'}</div>
      </Form.Item>,
    ];
    return (
      <CoreContent>
        <CoreForm items={formItems} cols={3} />
      </CoreContent>
    );
  };


  // 渲染列表
  const renderListInfo = () => {
    const dataList = dot.get(props, 'configurationData.data', []); // 合同归属配置数据
    const dataCount = dot.get(props, 'configurationData._meta.result_count', 0); // 合同归属配置数据条数
    const { page = 1 } = privates.searchParams;
    const columns = [
      {
        title: '平台',
        dataIndex: 'platform_name',
        key: 'platform_name',
        render: (text) => {
          return text || '--';
        },
      }, {
        title: '供应商',
        dataIndex: 'supplier_name',
        key: 'supplier_name',
        render: (text) => {
          return text || '--';
        },
      }, {
        title: '城市',
        dataIndex: 'city_list',
        key: 'city_list',
        render: (text) => {
          // 判断数据是否存在
          if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
            return '全部';
          }
          // 只有一行数据数据则直接返回
          if (text.length === 1) {
            return text[0].city_name;
          }
          // 默认使用弹窗显示数据
          return (
            <Tooltip title={text.map(item => item.city_name).join(' , ')}>
              <span>{dot.get(text, '0.city_name')} 等{text.length}条</span>
            </Tooltip>
          );
        },
      }, {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render(text) {
          return text ? moment(text).format('YYYY-MM-DD HH:mm') : '--';
        },
      }, {
        title: '最新操作人',
        dataIndex: 'operator_info',
        key: 'operator_info',
        render(text) {
          if (!text) {
            return '--';
          }
          return text.name || text.phone ? text.name && text.phone ? `${text.name}(${text.phone})` : text.name : '--';
        },
      }, {
        title: '合同模板名称',
        dataIndex: ['template_info', 'name'],
        key: ['template_info', 'name'],
        render: (text) => {
          return text || '--';
        },
      }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => {
          // 如果是启用的状态，则显示禁用按钮
          return (
            <div>
              <a className={styles['app-comp-system-update-btn']} onClick={() => { onShowUpdateModal(record); }}>编辑</a>
              <Popconfirm
                title="确定要删除吗?"
                onConfirm={() => onConfirmOK(record._id)}
                okText="确定"
                cancelText="取消"
              >
                <a>删除</a>
              </Popconfirm>
              {
                record.template_id ? (
                  <a style={{ marginLeft: 10 }} onClick={() => onClickPreview(record)}>预览合同</a>
                ) : null
              }
            </div>
          );
        },
      },
    ];

    // 分页
    const pagination = {
      // 每次点击查询, 重置页码为1
      current: page,
      defaultPageSize: 30,          // 默认数据条数
      onChange: onChangePage,  // 切换分页
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,        // 显示分页
      onShowSizeChange,              // 展示每页数据数
      showTotal: total => `总共${total}条`,                  // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dataCount,  // 数据总条数
    };

    // 新增按钮
    const createBtn = <Button type="primary" onClick={onShowCreateModal}>新增</Button>;

    return (
      <CoreContent title={'合同甲方配置列表'} titleExt={createBtn}>
        <Table rowKey={(record, index) => { return index; }} pagination={pagination} columns={columns} dataSource={dataList} bordered />
      </CoreContent>
    );
  };

  // 渲染弹窗
  const renderModal = () => {
    const { id } = props.location.query;
    return (
      <div>
        {/* 创建的弹窗 */}
        <CreateModal onCancel={onHideCreateModal} visible={createVisible} id={id} />
        {/* 编辑的弹窗 */}
        <UpdateModal onCancel={onHideUpdateModal} visible={updateVisible} data={updateData} id={id} />
      </div>
    );
  };

  return (
    <div>
      {/* 渲染详情信息 */}
      {renderDetailInfo()}

      {/* 渲染合同归属配置列表 */}
      {renderListInfo()}
      {/* 渲染弹窗 */}
      {renderModal()}
      {previewVisible ? <PreviewContract onCancel={onCancelPreview} previewId={previewId} /> : null}
    </div>
  );
}

function mapStateToProps(
  { systemManage: { contractDetail = {}, configurationData = {} } },
) {
  return { contractDetail, configurationData };
}

export default connect(mapStateToProps)(Update);
