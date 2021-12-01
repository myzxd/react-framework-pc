/**
 * 物资管理 - 采购入库明细
 */
import dot from 'dot-prop';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Table, Button, Popconfirm, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

import Search from './search';

import { CoreContent } from '../../../components/core';
import { Unit, SupplyNameType, SupplyPurchaseWayType, SupplyDownloadType } from '../../../application/define';
import Operate from '../../../application/define/operate';

import style from './style.css';

class Deductions extends Component {
  static propTypes = {
    supplyProcurementData: PropTypes.object,
    templateDate: PropTypes.string,
  };

  static defaultProps = {
    supplyProcurementData: {},
    templateDate: '',
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.private = {
      searchParams: {},
    };
  }

  // 默认加载数据
  componentDidMount() {
    const params = {
      type: SupplyDownloadType.purchaseTemplate,
    };
    this.props.dispatch({ type: 'supplyProcurement/fetchSupplyProcurement' });
    this.props.dispatch({ type: 'supplyProcurement/materialTemplateUpdatedDate', payload: params });  // 获取模板最新事件
  }

  // 搜索
  onSearch = (params) => {
    // 保存搜索的参数
    this.private.searchParams = params;
    if (!this.private.searchParams.page) {
      this.private.searchParams.page = 1;
    }
    if (!this.private.searchParams.limit) {
      this.private.searchParams.limit = 30;
    }
    // 调用搜索
    this.props.dispatch({ type: 'supplyProcurement/fetchSupplyProcurement', payload: this.private.searchParams });
  }

  // 修改分页
  onChangePage = (page, limit) => {
    this.private.searchParams.page = page;
    this.private.searchParams.limit = limit;
    this.onSearch(this.private.searchParams);
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    this.private.searchParams.page = page;
    this.private.searchParams.limit = limit;
    this.onSearch(this.private.searchParams);
  }

  // 模板下载成功的回调函数
  onDownloadSuccess = () => {
    message.success('模板下载成功');
  }

  // 模板下载失败的回调函数
  onDownloadFailure = () => {
    message.error('模板下载失败');
  }

  // 模板下载
  onDownload = () => {
    const params = {
      type: SupplyDownloadType.purchaseTemplate,
    };
    this.props.dispatch({
      type: 'supplyProcurement/materialDownloadTemplate',
      payload: {
        params,
        onSuccessCallback: this.onDownloadSuccess,
        onFailureCallback: this.onDownloadFailure,
      },
    });
  }

  // 渲染搜索
  renderSearch = () => {
    const { onSearch } = this;
    return (
      <Search onSearch={onSearch} />
    );
  }

  // 渲染列表内容
  renderContent = () => {
    const { page, limit } = this.private.searchParams;
    const { supplyProcurementData = {}, templateDate = '' } = this.props;
    const procurementData = dot.get(supplyProcurementData, 'data', []);
    const procurementCount = dot.get(supplyProcurementData, 'meta.count', 0);

    // tabel列表
    const columns = [{
      title: '平台',
      dataIndex: 'platform_name',
      key: 'platform_name',
      fixed: 'left',
      width: 70,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '供应商',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      fixed: 'left',
      width: 120,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '城市',
      dataIndex: 'city_name',
      key: 'city_name',
      fixed: 'left',
      width: 70,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '商圈',
      dataIndex: 'biz_district_name',
      key: 'biz_district_name',
      fixed: 'left',
      width: 145,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '物资名称',
      dataIndex: 'material_item_info',
      key: 'material_item_info.name',
      width: 100,
      render: (text) => {
        return text.name || '--';
      },
    }, {
      title: '物资编号',
      dataIndex: 'material_item_info',
      key: 'material_item_info.code',
      render: (text) => {
        return text.code || '--';
      },
    }, {
      title: '供货商',
      dataIndex: 'provider_name',
      key: 'provider_name',
      width: 120,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '物资分类',
      dataIndex: 'material_item_info',
      key: 'material_item_info.group',
      width: 130,
      render: (text) => {
        return SupplyNameType.description(text.group) || '--';
      },
    }, {
      title: '采购方式',
      dataIndex: 'aquire_type',
      key: 'aquire_type',
      width: 100,
      render: (text) => {
        return SupplyPurchaseWayType.description(text) || '--';
      },
    }, {
      title: '单价/租金（元）',
      dataIndex: 'rent_money',
      key: 'rent_money',
      width: 120,
      render: (text) => {
        return Unit.exchangePriceToYuan(text) || 0;
      },
    }, {
      title: '租赁周期（月）',
      dataIndex: 'lease_cycle',
      key: 'lease_cycle',
      width: 120,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '押金（元）',
      dataIndex: 'deposit_money',
      key: 'deposit_money',
      width: 120,
      render: (text) => {
        return Unit.exchangePriceToYuan(text) || 0;
      },
    }, {
      title: '数量',
      dataIndex: 'qty',
      key: 'qty',
      width: 100,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '税费合计（元）',
      dataIndex: 'tax_payment_money',
      key: 'tax_payment_money',
      width: 120,
      render: (text) => {
        return Unit.exchangePriceToYuan(text) || 0;
      },
    }, {
      title: '总金额（元）',
      dataIndex: 'total_money',
      key: 'total_money',
      width: 120,
      render: (text) => {
        return Unit.exchangePriceToYuan(text) || 0;
      },
    }, {
      title: '入库时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD') : '--';
      },
    }];

    // 分页配置
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: limit || 30, // 默认下拉页数
      onShowSizeChange: this.onShowSizeChange, // 展示每页数据
      total: procurementCount,
      showTotal: total => `总共${total}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: this.onChangePage,  // 切换分页
    };
    if (page) {
      pagination.current = page; // 当前页数
    }

    let operations = '';
    // 下载模板的权限
    if (Operate.canOperateSupplyProcurementDownload()) {
      operations = (
        <div>
          <span className={style['app-comp-supply-procurement-operation-date']}>模板更新时间: {templateDate}</span>
          <Popconfirm placement="top" title="是否下载模板?" okText="确认" onConfirm={() => { this.onDownload(); }} cancelText="取消">
            <Button type="primary">下载模板</Button>
          </Popconfirm>
        </div>
      );
    }

    return (
      <CoreContent title="采购入库明细列表" titleExt={operations}>
        {/* 渲染的内容 */}
        <Table
          columns={columns}
          pagination={pagination}
          rowKey={(record, index) => { return index; }}
          scroll={{ x: 1900, y: 400 }}
          dataSource={procurementData}
          bordered
        />
      </CoreContent>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染搜索 */}
        {this.renderSearch()}

        {/* 渲染列表内容 */}
        {this.renderContent()}
      </div>
    );
  }
}
function mapStateToProps({ supplyProcurement: { supplyProcurementData, templateDate } }) {
  return { supplyProcurementData, templateDate };
}
export default connect(mapStateToProps)(Deductions);

