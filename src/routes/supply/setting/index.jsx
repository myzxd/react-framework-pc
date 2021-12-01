/**
 * 物资管理 - 物资设置页面 Supply/Setting
 */
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import { Table, Button, Popconfirm, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

import Search from './search';
import style from './style.css';

import { CoreUploadAmazon, CoreContent } from '../../../components/core';
import { Unit, SupplyNameType, SupplyTemplateType, SupplyStorageType, SupplyDownloadType } from '../../../application/define';
import Operate from '../../../application/define/operate';

class Setting extends Component {
  static propTypes = {
    supplySetData: PropTypes.object,
    templateDate: PropTypes.string,
  };

  static defaultProps = {
    supplySetData: {},
    templateDate: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      interval: null, // 清除定时器
      items: 60,  // 倒计时
    };
    this.private = {
      searchParams: {},     // 查询参数
      namespace: `namespace${Math.floor(Math.random() * 100000)}`,      // 民命空间
    };
  }

  // 默认加载数据
  componentDidMount() {
    const params = {
      type: SupplyDownloadType.itemTemplate,      // 模板类型
    };
    this.props.dispatch({ type: 'supplySet/fetchSupplySet' }); // 获取物资设置数据
    this.props.dispatch({ type: 'supplyProcurement/materialTemplateUpdatedDate', payload: params });  // 获取模板最新事件
  }

  // 数据更新完成需要关闭实时更新的操作
  componentDidUpdate(prevProps) {
    const { interval } = this.state;
    const prevCount = dot.get(prevProps, 'supplySetData.meta.count', 0); // 旧的数据
    const nextCount = dot.get(this.props, 'supplySetData.meta.count', 0); // 最新数据
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
      this.props.dispatch({ type: 'supplySet/fetchSupplySet' });
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
    this.props.dispatch({ type: 'supplySet/fetchSupplySet', payload: this.private.searchParams });
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
      type: SupplyDownloadType.itemTemplate,    // 模板类型
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

  // 上传文件失败的回调
  onUploadFailure = () => {
    message.error('上传文件失败');
  }

  // 上传接口成功的回调函数
  onUploadSuccessSetting = () => {
    // 每次上次文件重新重置时间
    this.setState({
      items: 60,
    });
    this.onUpdateData(); // 开启实时更新数据的的开关
    this.onDataUpdateDate(); // 开启数据刷新的倒计时
    message.success('物资设置上传文件成功');
  }

  // 上传接口失败的回调函数
  onUploadFailureSetting = () => {
    message.success('物资设置上传文件失败');
  }

  // 上传七牛文件成功的回调函数
  onUploadSuccess = (file) => {
    const params = {
      type: SupplyTemplateType.item,    // 上传模板类型
      file,
      storage: SupplyStorageType.sevenCattle,
    };
    this.props.dispatch({
      type: 'supplyProcurement/materialUploadFile',
      payload: {
        params,
        onSuccessCallback: this.onUploadSuccessSetting,
        onFailureCallback: this.onUploadFailureSetting,
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
    const { supplySetData = {}, templateDate = '' } = this.props;
    const settingData = dot.get(supplySetData, 'data', []);
    const settingCount = dot.get(supplySetData, 'meta.count', 0);

    // tabel列表
    const columns = [{
      title: '一级分类',
      dataIndex: 'group',
      key: 'group',
      render: (text) => {
        return SupplyNameType.description(text) || '--';
      },
    }, {
      title: '二级分类',
      dataIndex: 'secondary_group',
      key: 'secondary_group',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '物资编号',
      dataIndex: 'code',
      key: 'code',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '物资名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '平台',
      dataIndex: 'platform_name',
      key: 'platform_name',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '押金（元）',
      dataIndex: 'deposit_money',
      key: 'deposit_money',
      render: (text) => {
        return Unit.exchangePriceToYuan(text) || 0;
      },
    }, {
      title: '自采/租赁单价（元）',
      dataIndex: 'purchase_price',
      key: 'purchase_price',
      render: (text) => {
        return Unit.exchangePriceToYuan(text) || 0;
      },
    }, {
      title: '备注',
      dataIndex: 'note',
      key: 'note',
      render: (text) => {
        return text || '--';
      },
    }];

    // 分页配置
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: limit || 30, // 默认下拉页数
      onShowSizeChange: this.onShowSizeChange, // 展示每页数据
      total: settingCount,
      showTotal: total => `总共${total}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: this.onChangePage,  // 切换分页
    };
    if (page) {
      pagination.current = page; // 当前页数
    }

    let operations = '';
    // 上传附件、下载模板的权限
    if (Operate.canOperateSupplySettingDownloadAndUpload()) {
      operations = (
        <React.Fragment>
          <span className={style['app-comp-supply-setting-operation-time']}>模板更新时间: {templateDate}</span>
          <Popconfirm placement="top" title="是否下载模板?" okText="确认" onConfirm={() => { this.onDownload(); }} cancelText="取消">
            <Button type="primary" className={style['app-comp-supply-setting-operation-download']}>下载模板</Button>
          </Popconfirm>
          <CoreUploadAmazon domain="material" namespace={this.private.namespace} onSuccess={this.onUploadSuccess} onFailure={this.onUploadFailure} />
        </React.Fragment>
      );
    }

    return (
      <CoreContent title="物资设置列表" titleExt={operations}>
        {/* 渲染的内容 */}
        <Table
          columns={columns}
          pagination={pagination}
          rowKey={(record, index) => { return index; }}
          dataSource={settingData}
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
function mapStateToProps({ supplySet: { supplySetData }, supplyProcurement: { templateDate } }) {
  return { supplySetData, templateDate };
}
export default connect(mapStateToProps)(Setting);
