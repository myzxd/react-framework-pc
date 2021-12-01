/**
 *  商圈管理
 */
import is from 'is_js';
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Button, Table, Tooltip, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

import Operate from '../../../../application/define/operate';
import { authorize } from '../../../../application';
import { DistrictState, DistrictPlatformState } from '../../../../application/define/index';
import { CoreContent } from '../../../../components/core';
import Search from './search';
import SetTags from './components/setTag';
import styles from './style/index.less';

// 操作类型
const OperateType = {
  singleSet: 10, // 单条
  multipleSet: 20, // 多条
  delete: -100, // 批量移除
};

class Draft extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false, // 设置标签弹窗visible
      districtIds: [], // 批量设置的商圈id
      districtId: undefined, // 设置单个商圈id
      operateType: OperateType.singleSet, // 单条商圈设置标签
      selectedTags: [], // 选中的tags
    };
    this.private = {
      // 搜索的参数
      searchParams: {
        meta: { page: 1, limit: 30 },
      },
    };
  }

  componentDidMount() {
    const { searchParams } = this.private;
    this.props.dispatch({ type: 'districtManage/fetchDistricts', payload: searchParams });
    this.props.dispatch({ type: 'applicationCommon/getEnumeratedValue', payload: { enumeratedType: 'industry' } });
  }

  // 搜索
  onSearch = (params) => {
    // 保存搜索的参数
    const { searchParams } = this.private;
    const payload = { ...searchParams, ...params };

    this.private.searchParams = payload;
    this.props.dispatch({ type: 'districtManage/fetchDistricts', payload });
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.meta.page = page;
    searchParams.meta.limit = limit;
    this.onSearch(searchParams);
  }

  // 修改分页
  onChangePage = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.meta.page = page;
    searchParams.meta.limit = limit;
    this.onSearch(searchParams);
  }

  // 重置
  onReset = () => {
    const { dispatch } = this.props;
    const params = {
      meta: {
        limit: 30,
        page: 1,
      },
    };

    this.private.searchParams = { ...params };

    dispatch({ type: 'districtManage/fetchDistricts', payload: params });
  }


  // 隐藏弹窗
  onCancel = () => {
    this.setState({ visible: false, selectedTags: [] });
  }

  // 显示设置标签弹窗
  onShow = (rec, type) => {
    // 批量选中的商圈id
    const { districtIds = [] } = this.state;
    // 没有选中数据不能批量添加标签
    if ((type === OperateType.multipleSet
      || type === OperateType.delete)
      && districtIds.length < 1) {
      return message.error('请先选择要设置的商圈数据');
    }

    let selectedTags = [];

    // 批量操作不需要传选中的标签
    // 设置标签需要传原有的标签
    type === OperateType.singleSet && (selectedTags = rec.labelInfos);

    this.setState({ visible: true, operateType: type, selectedTags, districtId: rec.id });
  }

  // 设置标签成功回调
  onSuccessCallback = () => {
    const { operateType } = this.state;

    // 重置选中的商圈
    operateType !== OperateType.singleSet && (this.setState({ districtIds: [] }));
    const { dispatch } = this.props;
    message.success('操作成功');

    // 重置商圈数据
    dispatch({ type: 'districtManage/fetchDistricts', payload: this.private.searchParams });
    this.onCancel();
  }

  // 设置标签失败回调
  onFailureCallback = (res) => {
    res.zh_message && message.error(res.zh_message);
    this.onCancel();
  }

  // 点击添加供应商
  addDistrict = () => {
    window.location.href = '#/Assets/District/Create';
  }

  // 渲染搜索区域
  renderSearch = () => {
    // 操作
    const operations = [];
    if (Operate.canOperateAssectsAdministrationCreate()) {
      operations.push(
        <Button
          key="addDistrict"
          type="primary"
          onClick={this.addDistrict}
          className={styles['app-comp-system-district-del-btn']}
        >
          添加商圈
        </Button>,
      );
    }
    // 批量设置标签
    if (Operate.canOperateAssectsAdministrationTagBatchSet()) {
      operations[operations.length] = (
        <Button
          key="addTags"
          type="primary"
          onClick={() => this.onShow({}, OperateType.multipleSet)}
          className={styles['app-comp-system-district-del-btn']}
        >
          批量增加标签
        </Button>
      );
    }
    // 批量移除标签
    if (Operate.canOperateAssectsAdministrationTagBatchDelete()) {
      operations[operations.length] = (
        <Button
          key="deleteTags"
          type="primary"
          onClick={() => this.onShow({}, OperateType.delete)}
        >
          批量移除标签
        </Button>
      );
    }

    return (
      <Search
        onSearch={this.onSearch}
        onReset={this.onReset}
        operations={operations}
      />
    );
  }

  // 渲染列表
  renderContent = () => {
    // 选中的商圈
    const { districtIds } = this.state;

    // 枚举值
    const { enumeratedValue = {} } = this.props;
    const { industry: industryEn = [] } = enumeratedValue;

    const { page } = this.private.searchParams.meta;
    const { data, meta } = this.props.districts;
    const columns = [
      {
        title: '平台商圈ID',
        dataIndex: 'customId',
        key: 'customId',
        render: (text, record) => {
          // 判断是否是美团和饿了么
          if (record.platformCode !== 'meituan') {
            return text || '--';
          }
          const ids = [];
          // 判断平台商圈ID是否存在
          if (text) {
            ids.push(`专送平台_${text}`);
          }
          // 更多平台商圈三方id枚举提取为数组
          const platformStates = Object.values(DistrictPlatformState).filter(v => typeof v !== 'function');
          // 遍利更多平台商圈三方id
          platformStates.forEach((val) => {
            // 判断更多平台商圈三方id是否存在
            if (record[val]) {
              ids.push(`${DistrictPlatformState.description(val)}_${record[val]}`);
            }
          });
          // 判断是否有数据
          if (ids.length > 0) {
            // 判断数据的长度
            if (ids.length === 1) {
              return ids;
            }
            return (
              <Tooltip title={ids.join(', ')}>
                <span>{ids.slice(0, 1).join(', ')} 等{ids.length}条</span>
              </Tooltip>
            );
          }
          return '--';
        },
      },
      {
        title: '商圈',
        dataIndex: 'name',
        key: 'name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '平台',
        dataIndex: 'platformCode',
        key: 'platformCode',
        render: (text) => {
          return authorize.platformFilter(text);
        },
      },
      {
        title: '供应商',
        dataIndex: 'supplierInfo',
        key: 'supplierInfo',
        render: (text) => {
          return text && text.supplierName ? text.supplierName : '--';
        },
      },
      {
        title: '城市',
        dataIndex: 'cityInfo',
        key: 'cityInfo',
        render: (text) => {
          return text && text.cityName ? text.cityName : '--';
        },
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text) => {
          return text ? DistrictState.description(text) : '--';
        },
      },
      {
        title: '当前标签',
        dataIndex: 'labelInfos',
        key: 'labelInfos',
        render: (text) => {
          // 判断数据是否存在
          if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
            return '--';
          }

          // 标签少于两个
          if (text.length <= 2) {
            return text.map(i => i.name).join('、');
          }

          // 气泡
          return (
            <Tooltip title={text.map(item => item.name).join('、')}>
              <span>{dot.get(text, '0.name')}、{dot.get(text, '1.name')}...</span>
            </Tooltip>
          );
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm') : '--';
        },
      },
      {
        title: '停用时间',
        dataIndex: 'forbiddenAt',
        key: 'forbiddenAt',
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm') : '--';
        },
      },
      {
        title: '最新操作人',
        dataIndex: 'operatorInfo',
        key: 'operatorInfo',
        render: (text) => {
          return text && text.name ? text.phone ? `${text.name}(${text.phone})` : text.name : '--';
        },
      },
      {
        title: '所属场景',
        dataIndex: 'industryCode',
        key: 'industryCode',
        render: (text) => {
          if (!text) return '--';
          const currentEn = industryEn.find(en => en.value === text) || {};
          const { name: industry = undefined } = currentEn;
          return industry || '--';
        },
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, record) => {
          // 详情操作o
          const detailOperate = Operate.canOperateAssectsAdministrationCreate() ?
            (
              <a
                href={`#/Assets/District/Detail?id=${record.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles['app-comp-system-district-del-btn']}
              >
              详情</a>
            ) : null;

          // 设置标签操作
          const setTagOperate = Operate.canOperateAssectsAdministrationTagSet() && record.state !== DistrictState.disabled ?
            (
              <a onClick={() => this.onShow(record, OperateType.singleSet)}>设置标签</a>
            ) : null;
          return (
            <div>
              {detailOperate}
              {setTagOperate}
              {(!detailOperate && !setTagOperate) ? '--' : null}
            </div>
          );
        },
      },
    ];
    // 分页
    const pagination = {
      // 每次点击查询, 重置页码为1
      current: page,
      defaultPageSize: 30,                     // 默认数据条数
      onChange: this.onChangePage,             // 切换分页
      showQuickJumper: true,                   // 显示快速跳转
      showSizeChanger: true,                   // 显示分页
      onShowSizeChange: this.onShowSizeChange, // 展示每页数据数
      showTotal: total => `总共${total}条`,     // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: meta.count || 0,                  // 数据总条数
    };

    const rowSelection = {
      selectedRowKeys: districtIds,
      onChange: selectedRowKeys => this.setState({ districtIds: selectedRowKeys }),
      getCheckboxProps: record => ({
        disabled: record.state === DistrictState.disabled,
      }),
    };

    return (
      <CoreContent>
        <Table
          bordered
          rowKey={(record, index) => { return record.id || index; }}
          pagination={pagination}
          dataSource={data}
          columns={columns}
          rowSelection={rowSelection}
        />
      </CoreContent>
    );
  }

  // 弹窗
  renderModal = () => {
    const { visible, operateType, selectedTags = [], districtId, districtIds } = this.state;
    if (!visible) return;

    return (
      <SetTags
        visible={visible}
        operateType={operateType}
        districtId={districtId}
        districtIds={districtIds}
        data={selectedTags.map(tag => tag._id)}
        onCancel={this.onCancel}
        onSuccessCallback={this.onSuccessCallback}
        onFailureCallback={this.onFailureCallback}
      />
    );
  }

  render() {
    return (
      <div>
        {/* 渲染搜索区域 */}
        {this.renderSearch()}
        {/* 渲染列表 */}
        {this.renderContent()}
        {/* 设置标签弹窗 */}
        {this.renderModal()}
      </div>
    );
  }
}

function mapStateToProps({ districtManage: { districts }, applicationCommon: { enumeratedValue } }) {
  return { districts, enumeratedValue };
}

export default connect(mapStateToProps)(Draft);
