/**
 * 合同归属 - 详情
 */
import dot from 'dot-prop';
import is from 'is_js';
import { connect } from 'dva';
import moment from 'moment';
import React, { useEffect } from 'react';
import { Table, Tooltip } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../../components/core';
import { ThirdCompanyState, AllowElectionSign } from '../../../../application/define';

function Detail(props) {
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

  // 改变每页展示条数
  const onShowSizeChange = (page, limit) => {
    const { id } = props.location.query;
    props.dispatch({ type: 'systemManage/fetchContractConfigurationList', payload: { id, page, limit } });
  };

  // 修改分页
  const onChangePage = (page, limit) => {
    const { id } = props.location.query;
    props.dispatch({ type: 'systemManage/fetchContractConfigurationList', payload: { id, page, limit } });
  };

  // 渲染头部详情信息
  const renderDetailInfo = () => {
    // css换行处理
    const LineFeedStyle = {
      wordWrap: 'break-word',
      wordreBak: 'break-all',
    };
    const detailData = dot.get(props, 'contractDetail', {}); // 详情数据

    const formItems = [
      {
        label: '公司名称',
        form: <div style={LineFeedStyle}>{dot.get(detailData, 'name', undefined) || '--'}</div>,
      },
      {
        label: '统一社会信用代码',
        form: <div style={LineFeedStyle}>{dot.get(detailData, 'credit_no', undefined) || '--'}</div>,
      },
      {
        label: '法人',
        form: <div style={LineFeedStyle}>{dot.get(detailData, 'legal_person', undefined) || '--'}</div>,
      },
      {
        label: '电话',
        form: <div style={LineFeedStyle}>{dot.get(detailData, 'phone', undefined) || '--'}</div>,
      },
      {
        label: '地址',
        form: <div style={LineFeedStyle}>{dot.get(detailData, 'address', undefined) || '--'}</div>,
      },
      {
        label: '是否允许电子签',
        form: AllowElectionSign.description(dot.get(detailData, 'is_electronic_sign', false)),
      },
      {
        label: '状态',
        form: dot.get(detailData, 'state', undefined) ? ThirdCompanyState.description(dot.get(detailData, 'state', undefined)) : '--',
      },
    ];
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
    return (
      <CoreContent>
        <DeprecatedCoreForm items={formItems} cols={4} layout={layout} />
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


    return (
      <CoreContent title={'合同甲方配置列表'}>
        <Table rowKey={(record, index) => { return index; }} pagination={pagination} columns={columns} dataSource={dataList} bordered />
      </CoreContent>
    );
  };

  return (
    <div>
      {/* 渲染详情信息 */}
      {renderDetailInfo()}

      {/* 渲染合同归属配置列表 */}
      {renderListInfo()}
    </div>
  );
}

function mapStateToProps(
  { systemManage: { contractDetail = {}, configurationData = {} } },
) {
  return { contractDetail, configurationData };
}

export default connect(mapStateToProps)(Detail);
