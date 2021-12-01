/**
 * 物资管理 - 扣款明细页面   Supply/Deductions
 */
import dot from 'dot-prop';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Table } from 'antd';

import Search from './search';
import style from './index.css';
import { CoreContent } from '../../../components/core';
import { Unit, SupplyPledgeMoneyType, SupplyMoneyDeductionType } from '../../../application/define';

class Deductions extends Component {
  static propTypes = {
    supplyDeductionsData: PropTypes.object,
  };

  static defaultProps = {
    supplyDeductionsData: {},
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.private = {
      searchParams: {},   // 查询参数
    };
  }

  // 默认加载数据
  componentDidMount() {
    this.props.dispatch({ type: 'supplyDeductions/fetchSupplyDeductionsList' });
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
    this.props.dispatch({ type: 'supplyDeductions/fetchSupplyDeductionsList', payload: this.private.searchParams });
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
    const { supplyDeductionsData = {} } = this.props;
    const deductionsData = dot.get(supplyDeductionsData, 'data', []);
    const deductionsCount = dot.get(supplyDeductionsData, 'meta.count', 0);

    // tabel列表
    const columns = [{
      title: '平台',
      dataIndex: 'platform_name',
      key: 'platform_name',
      width: 70,
      fixed: 'left',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '供应商',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      width: 120,
      fixed: 'left',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '城市',
      dataIndex: 'city_name',
      key: 'city_name',
      width: 70,
      fixed: 'left',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '商圈',
      dataIndex: 'biz_district_name',
      key: 'biz_district_name',
      width: 140,
      fixed: 'left',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '物资编号',
      dataIndex: 'material_item_info',
      key: 'material_item_info.code',
      render: (text) => {
        return text.code || '--';
      },
    }, {
      title: '姓名',
      dataIndex: 'staff_info',
      key: 'staff_info.name',
      width: 90,
      render: (text) => {
        return text.name || '--';
      },
    }, {
      title: '人员身份证号',
      dataIndex: 'staff_info',
      key: 'staff_info.identity_card_id',
      width: 140,
      render: (text) => {
        return text.identity_card_id || '--';
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
      title: '数量',
      dataIndex: 'qty',
      key: 'qty',
      width: 80,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '归属时间',
      dataIndex: 'month',
      key: 'month',
      width: 100,
    }, {
      title: '押金扣款方式',
      dataIndex: 'pledge_money_type',
      key: 'pledge_money_type',
      width: 130,
      render: (text) => {
        return SupplyPledgeMoneyType.description(text) || '--';
      },
    }, {
      title: '使用费扣款方式',
      dataIndex: 'fee_money_deduction_type',
      key: 'fee_money_deduction_type',
      width: 130,
      render: (text) => {
        return SupplyMoneyDeductionType.description(text) || '--';
      },
    }, {
      title: '应扣款押金(元)',
      dataIndex: 'deduction_deposit',
      key: 'deduction_deposit',
      width: 140,
      render: (text) => {
        return Unit.exchangePriceToYuan(text) || 0;
      },
    }, {
      title: '应扣款使用费(元)',
      dataIndex: 'deduction_usage_fee',
      key: 'deduction_usage_fee',
      width: 140,
      render: (text) => {
        return Unit.exchangePriceToYuan(text) || 0;
      },
    }, {
      title: '应扣款折损费(元)',
      dataIndex: 'deduction_fee',
      key: 'deduction_fee',
      width: 140,
      render: (text) => {
        return Unit.exchangePriceToYuan(text) || 0;
      },
    }, {
      title: '应退款押金(元)',
      dataIndex: 'refund_deposit',
      key: 'refund_deposit',
      width: 140,
      render: (text) => {
        return Unit.exchangePriceToYuan(text) || 0;
      },
    }];

    // 分页配置
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: limit || 30, // 默认下拉页数
      onShowSizeChange: this.onShowSizeChange, // 展示每页数据
      total: deductionsCount,
      showTotal: total => `总共${total}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: this.onChangePage,  // 切换分页
    };
    if (page) {
      pagination.current = page; // 当前页数
    }

    // 显示提示图标（取消默认spin显示）
    const isShowIcon = true;

    // 表头提示
    const title = (
      <span>
        <InfoCircleOutlined className={style['app-comp-supply-deductions-title-icon']} />
        <span className={style['app-comp-supply-deductions-title-text']}>提示：每月1日自动更新上月扣款明细数据</span>
      </span>
    );

    return (
      <CoreContent title={title} isShowIcon={isShowIcon}>
        {/* 渲染的内容 */}
        <Table
          columns={columns}
          pagination={pagination}
          rowKey={(record, index) => { return index; }}
          scroll={{ x: 1890, y: 400 }}
          dataSource={deductionsData}
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
function mapStateToProps({ supplyDeductions: { supplyDeductionsData } }) {
  return { supplyDeductionsData };
}
export default connect(mapStateToProps)(Deductions);

