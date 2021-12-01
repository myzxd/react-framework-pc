/**
 * 服务费方案 Finance/Summary
 */
import dot from 'dot-prop';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Table, Button } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

import Search from './search';
import Operate from '../../../application/define/operate';

import { CoreContent } from '../../../components/core';
import { ExpenseCostCenterType, FinanceSalaryPlanState } from '../../../application/define';

import CreateModal from './modal/create';
import styles from './style/index.less';

class IndexComponent extends Component {
  static propTypes = {
    planListData: PropTypes.object,
  };

  static defaultProps = {
    planListData: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false, // 显示弹窗
    };
    this.private = {
      searchParams: {},
    };
  }

  // 默认加载数据
  componentDidMount() {
    this.props.dispatch({ type: 'financePlan/fetchSalaryPlanList' });
  }

  // 选择类型显示弹窗
  onShowModal = () => {
    this.setState({
      isShowModal: true,
    });
  }

  // 关闭选择类型弹窗的回调
  onHideModal = () => {
    this.setState({
      isShowModal: false,
    });
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
    this.props.dispatch({ type: 'financePlan/fetchSalaryPlanList', payload: this.private.searchParams });
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
    const { page } = this.private.searchParams;
    const { planListData = {} } = this.props;
    const data = dot.get(planListData, 'data', []);
    const count = dot.get(planListData, 'meta.count', 0);

    // tabel列表
    const columns = [{
      title: '代码',
      dataIndex: 'id',
      fixed: 'left',
      width: 120,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '平台',
      dataIndex: 'platformName',
      width: 60,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '供应商',
      dataIndex: 'supplierName',
      width: 170,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '城市',
      dataIndex: 'cityName',
      width: 70,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '商圈',
      dataIndex: 'bizDistrictName',
      width: 158,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '方案类型',
      dataIndex: 'domain',
      width: 80,
      render: (text) => {
        return ExpenseCostCenterType.description(text);
      },
    }, {
      title: '服务费方案名称',
      dataIndex: 'name',
      render: (text, record) => {
        return <span>{record.bizDistrictName ? `${record.platformName}-${record.supplierName}-${record.cityName}-${record.bizDistrictName}` : `${record.platformName}-${record.supplierName}- ${record.cityName}`}</span>;
      },
    }, {
      title: '创建日期',
      dataIndex: 'createdAt',
      width: 135,
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
      },
    }, {
      title: '创建者',
      dataIndex: ['creatorInfo', 'name'],
      width: 60,
    }, {
      title: '状态',
      dataIndex: 'state',
      width: 60,
      render: text => FinanceSalaryPlanState.description(text),
    }, {
      title: '生效日期',
      dataIndex: 'enabledAt',
      width: 90,
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD') : '--';
      },
    }, {
      title: '最后操作日期',
      dataIndex: 'updatedAt',
      width: 90,
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD') : '--';
      },
    }, {
      title: '最后操作者',
      dataIndex: ['operatorInfo', 'name'],
      width: 80,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '操作',
      fixed: 'right',
      width: 60,
      render: (text, record) => {
        return <span><a className={styles['app-comp-finance-plan-color']} target="_blank" rel="noopener noreferrer" href={`/#/Finance/Rules?id=${record.id}`}>详情</a></span>;
      },
    }];

    // 分页配置
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      defaultPageSize: 30, // 默认下拉页数
      onShowSizeChange: this.onShowSizeChange, // 展示每页数据
      total: count,
      showTotal: total => `总共${total}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: this.onChangePage,  // 切换分页
    };
    if (page) {
      pagination.current = page; // 当前页数
    }
    const operations = (
      <span>
        {!Operate.canOperateFinancePlanCreate() || <Button type="primary" onClick={this.onShowModal}>创建服务费方案</Button>}
      </span>
    );
    return (
      <CoreContent title="服务费方案汇总列表" titleExt={operations}>
        {/* 渲染的内容 */}
        <Table
          columns={columns}
          pagination={pagination}
          rowKey={(record, index) => { return index; }}
          scroll={{ x: 1470 }}
          dataSource={data}
          bordered
        />
      </CoreContent>
    );
  }

  // 渲染创建的弹窗
  renderCreateModal = () => {
    const { onHideModal } = this; // 关闭弹窗回调
    const { isShowModal } = this.state;

    const { planListData = {} } = this.props;
    const data = dot.get(planListData, 'data', []);
    return (
      <CreateModal onHideModal={onHideModal} isShowModal={isShowModal} planListData={data} />
    );
  }

  render() {
    return (
      <div>
        {/* 渲染搜索 */}
        {this.renderSearch()}

        {/* 渲染列表内容 */}
        {this.renderContent()}

        {/* 渲染创建的弹窗 */}
        {this.renderCreateModal()}
      </div>
    );
  }
}
function mapStateToProps({ financePlan: { planListData } }) {
  return { planListData };
}
export default connect(mapStateToProps)(IndexComponent);
