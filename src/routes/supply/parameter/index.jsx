/**
 * 物资管理 - 物资台账页面  Supply/Parameter
 */
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Table, Tooltip } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

import Search from './search';
import style from './style.css';

import { CoreContent } from '../../../components/core';
import { Unit, SupplyNameType, SupplyPurchaseWayType } from '../../../application/define';

class Deductions extends Component {
  static propTypes = {
    supplyDetailsData: PropTypes.object,
  };

  static defaultProps = {
    supplyDetailsData: {},
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
    this.props.dispatch({ type: 'supplyDetails/fetchSupplyDetailsList' });
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
    this.props.dispatch({ type: 'supplyDetails/fetchSupplyDetailsList', payload: this.private.searchParams });
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
    const { supplyDetailsData = {} } = this.props;
    const detailsData = dot.get(supplyDetailsData, 'data', []);
    const detailsCount = dot.get(supplyDetailsData, 'meta.count', 0);

    // 采购总金额的算法
    const procurementInfo = <div><p>自采: 单价/租金*数量+税费合计</p><p>租赁: 单价/租金*租赁周期*数量+押金+税费合计</p></div>;

    // 采购总金额title
    const aquireTotalMoney = <div><span className={style['app-comp-supply-parameter-list-procurement-text']}>采购总金额(元)</span><Tooltip title={procurementInfo}><InfoCircleOutlined className={style['app-comp-supply-parameter-list-procurement-icon']} /></Tooltip></div>;

    // 三方押金
    const costomDepositMoney = <div><span className={style['app-comp-supply-parameter-list-parties-text']}>三方押金(元)</span><Tooltip title="租赁: 押金合计"><InfoCircleOutlined className={style['app-comp-supply-parameter-list-parties-icon']} /></Tooltip></div>;

    // 人员押金
    const staffDepositMoney = <div><span className={style['app-comp-supply-parameter-list-personnel-text']}>人员押金(元)</span><Tooltip title="自采/租赁: 押金实际扣还款合计"><InfoCircleOutlined className={style['app-comp-supply-parameter-list-personnel-icon']} /></Tooltip></div>;

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
      width: 120,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '采购方式',
      dataIndex: 'aquire_type',
      width: 90,
      key: 'aquire_type',
      render: (text) => {
        return SupplyPurchaseWayType.description(text) || '--';
      },
    }, {
      title: '物资分类',
      dataIndex: 'material_item_group',
      key: 'material_item_group',
      render: (text) => {
        return SupplyNameType.description(text) || '--';
      },
    }, {
      title: '物资名称',
      dataIndex: 'material_item_name',
      key: 'material_item_name',
      width: 100,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '物资编号',
      dataIndex: 'material_item_code',
      key: 'material_item_code',
      width: 120,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '采购总数',
      dataIndex: 'purchase_history_qty',
      key: 'purchase_history_qty',
      width: 130,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: aquireTotalMoney,
      dataIndex: 'aquire_total_money',
      key: 'aquire_total_money',
      width: 140,
      render: (text) => {
        return Unit.exchangePriceToYuan(text) || '--';
      },
    }, {
      title: '领用出库合计',
      dataIndex: 'dispatch_total_qty',
      key: 'dispatch_total_qty',
      width: 130,
      render: (text) => {
        return text || 0;
      },
    }, {
      title: '库存',
      dataIndex: 'stock_qty',
      key: 'stock_qty',
      width: 130,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '退厂出库',
      dataIndex: 'return_factory_qty',
      key: 'return_factory_qty',
      width: 130,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '报废出库合计',
      dataIndex: 'damage_qty',
      key: 'damage_qty',
      width: 130,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: costomDepositMoney,
      dataIndex: 'costom_deposit_money',
      key: 'costom_deposit_money',
      width: 130,
      render: (text) => {
        return Unit.exchangePriceToYuan(text) || 0;
      },
    }, {
      title: staffDepositMoney,
      dataIndex: 'staff_deposit_money',
      key: 'staff_deposit_money',
      width: 130,
      render: (text) => {
        return 0 || Unit.exchangePriceToYuan(text);
      },
    }];

    // 分页配置
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: limit || 30, // 默认下拉页数
      onShowSizeChange: this.onShowSizeChange, // 展示每页数据
      total: detailsCount,
      showTotal: total => `总共${total}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: this.onChangePage,  // 切换分页
    };
    if (page) {
      pagination.current = page; // 当前页数
    }
    return (
      <CoreContent title="物资台账列表">
        {/* 渲染的内容 */}
        <Table
          columns={columns}
          pagination={pagination}
          rowKey={(record, index) => { return index; }}
          scroll={{ x: 1860, y: 400 }}
          dataSource={detailsData}
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

function mapStateToProps({ supplyDetails: { supplyDetailsData } }) {
  return { supplyDetailsData };
}
export default connect(mapStateToProps)(Deductions);

