/**
 * 物资管理 - 分发明细页面  Supply/Distribution
 */
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Popconfirm, message } from 'antd';
import moment from 'moment';

import Search from './search';
import style from './index.css';

import { CoreContent, CoreUploadAmazon } from '../../../components/core';
import {
  Unit,
  SupplyPurchaseWayType,
  SupplyPledgeMoneyType,
  SupplyMoneyDeductionType,
  SupplyTemplateType,
  SupplyStorageType,
  SupplyDownloadType,
  SupplyDistributionState,
} from '../../../application/define';
import Operate from '../../../application/define/operate';

class Deductions extends Component {
  static propTypes = {
    supplyDistributionData: PropTypes.object,
    templateDate: PropTypes.string,
  };

  static defaultProps = {
    supplyDistributionData: {},
    templateDate: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      interval: null, // 清除定时器
      items: 60,      // 时间倒计时
    };
    this.private = {
      searchParams: {},       // 查询参数
      namespace: `namespace${Math.floor(Math.random() * 100000)}`,      // 命名空间
    };
  }
  // 默认加载数据
  componentDidMount() {
    const params = {
      type: SupplyDownloadType.distributionTemplate,
    };
   // 分发明细数据列表
    this.props.dispatch({
      type: 'supplyDistribution/fetchSupplyDistributionList',
      payload: { belongTime: moment(new Date()).format('YYYYMM') },
    });
    // 获取模板最新事件
    this.props.dispatch({
      type: 'supplyProcurement/materialTemplateUpdatedDate',
      payload: params,
    });
  }

  // 数据更新完成需要关闭实时更新的操作
  componentDidUpdate(prevProps) {
    const { interval } = this.state;
    const prevCount = dot.get(prevProps, 'supplyDistributionData.meta.count', 0); // 旧的数据
    const nextCount = dot.get(this.props, 'supplyDistributionData.meta.count', 0); // 最新数据
    // 判断更新数据后的长度与初始的不相等清除数据
    if (prevCount !== nextCount) {
      if (interval) {
        window.clearInterval(interval);
      }
    }
  }

  // 当跳转其它组件停止更新数据
  componentWillUnmount() {
    const { interval } = this.state;
    window.clearInterval(interval);
  }

  // 更新最新的数据
  onUpdateData = () => {
    const updateData = setInterval(() => {
      this.props.dispatch({ type: 'supplyDistribution/fetchSupplyDistributionList' });
    }, 30000);

    // 为了防止同时上传文件是定时器不断地叠加
    if (!this.state.interval) {
      window.clearInterval(updateData);
    }

    this.setState({
      interval: updateData,
    });
  }

  // 数据的更新时间
  onDataUpdateDate = () => {
    const { items, interval } = this.state;
    // 60s倒计时
    let total = items;
    // 清除计时器
    clearInterval(this.private.timer);

    this.private.timer = setInterval(() => {
      total -= 1;
      this.setState({
        items: total,
      });
      if (total === 0) {
        // 当倒计时为零重置
        this.setState({
          items: 60,
        });
        // 倒计时结束
        clearInterval(this.private.timer);
        // 关闭实时更新的数据
        window.clearInterval(interval);
      }
    }, 3000);
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
    this.props.dispatch({
      type: 'supplyDistribution/fetchSupplyDistributionList',
      payload: this.private.searchParams,
    });
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
      type: SupplyDownloadType.distributionTemplate,    // 模板类型
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

  // 上传接口成功的回调函数
  onUploadSuccessDistribution = () => {
    // 每次上次文件重新重置时间
    this.setState({
      items: 60,
    });
    this.onUpdateData(); // 开启实时更新数据的的开关
    this.onDataUpdateDate(); // 开启刷新数据的倒计时
    message.success('分发明细上传文件成功');
  }

  // 上传接口失败的回调函数
  onUploadFailureDistribution = () => {
    message.success('分发明细上传文件失败');
  }

  // 上传文件失败的回调
  onUploadFailure = () => {
    message.error('上传文件失败');
  }

  // 上传七牛文件成功的回调函数
  onUploadSuccess = (file) => {
    const params = {
      type: SupplyTemplateType.distribution,    // 模板类型
      file,
      storage: SupplyStorageType.sevenCattle,
    };
    this.props.dispatch({
      type: 'supplyProcurement/materialUploadFile',
      payload: {
        params,
        onSuccessCallback: this.onUploadSuccessDistribution,
        onFailureCallback: this.onUploadFailureDistribution,
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
    const { supplyDistributionData = {}, templateDate = '' } = this.props;
    const distributionData = dot.get(supplyDistributionData, 'data', []);
    const distributionCount = dot.get(supplyDistributionData, 'meta.count', 0);

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
      width: 140,
      fixed: 'left',
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
      width: 100,
      render: (text) => {
        return text.code || '--';
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
      title: '人员身份证号',
      dataIndex: 'staff_info',
      width: 180,
      key: 'staff_info.identity_card_id',
      render: (text) => {
        return text.identity_card_id || '--';
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
      title: '数量',
      dataIndex: 'qty',
      key: 'qty',
      width: 90,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '押金扣款方式',
      dataIndex: 'pledge_money_type',
      key: 'pledge_money_type',
      width: 120,
      render: (text) => {
        return SupplyPledgeMoneyType.description(text) || '--';
      },
    }, {
      title: '押金(元)',
      dataIndex: 'deposit_money',
      key: 'deposit_money',
      width: 130,
      render: (text) => {
        return Unit.exchangePriceToYuan(text) || 0;
      },
    }, {
      title: '使用费扣款方式',
      dataIndex: 'fee_money_deduction_type',
      key: 'fee_money_deduction_type',
      width: 130,
      render: (text, record) => {
        // 如果是分期扣，显示‘分期扣（期数）’
        if (text === SupplyMoneyDeductionType.installment) {
          return `${SupplyMoneyDeductionType.description(text)} (${record.fee_money_cycle}期)`;
        }
        return SupplyMoneyDeductionType.description(text) || '--';
      },
    }, {
      title: '使用费(元)',
      dataIndex: 'fee_money',
      key: 'fee_money',
      width: 130,
      render: (text) => {
        return Unit.exchangePriceToYuan(text) || 0;
      },
    }, {
      title: '分发周期',
      dataIndex: 'belong_month',
      key: 'belong_month',
      width: 130,
      render: text => text || '--',
    }, {
      title: '分发时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 130,
      render: (text) => {
        if (text) {
          return moment(text).format('YYYY-MM-DD HH:mm:ss');
        }
        return '--';
      },
    }, {
      title: '领用时间',
      dataIndex: 'received_at',
      key: 'received_at',
      width: 100,
      render: (text) => {
        if (text) {
          return moment(text).format('YYYY-MM-DD HH:mm:ss');
        }
        return '--';
      },
    }, {
      title: '状态',
      dataIndex: 'current_state',
      key: 'current_state',
      width: 100,
      render: (text) => {
        return SupplyDistributionState.description(text) || '--';
      },
    }];

    // 分页配置
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: limit || 30, // 默认下拉页数
      onShowSizeChange: this.onShowSizeChange, // 展示每页数据
      total: distributionCount,
      showTotal: total => `总共${total}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: this.onChangePage,  // 切换分页
    };
    if (page) {
      pagination.current = page; // 当前页数
    }

    let operations = '';
    // 上传附件、下载模板的权限
    if (Operate.canOperateSupplyDistributionDownloadAndUpload()) {
      operations = (
        <React.Fragment>
          <span className={style['app-comp-supply-distribution-operations-time']}>模板更新时间: {templateDate}</span>
          <Popconfirm placement="top" title="是否下载模板?" okText="确认" onConfirm={() => { this.onDownload(); }} cancelText="取消">
            <Button type="primary" className={style['app-comp-supply-distribution-operations-download']}>下载模板</Button>
          </Popconfirm>
          <CoreUploadAmazon domain="payment" namespace={this.private.namespace} onSuccess={this.onUploadSuccess} onFailure={this.onUploadFailure} />
        </React.Fragment>
      );
    }

    return (
      <CoreContent title="分发明细列表" titleExt={operations}>
        {/* 渲染的内容 */}
        <Table
          columns={columns}
          pagination={pagination}
          rowKey={(record, index) => { return index; }}
          scroll={{ x: 2050, y: 400 }}
          dataSource={distributionData}
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
function mapStateToProps({ supplyDistribution: { supplyDistributionData }, supplyProcurement: { templateDate } }) {
  return { supplyDistributionData, templateDate };
}
export default connect(mapStateToProps)(Deductions);

