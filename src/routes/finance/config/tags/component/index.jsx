/**
 * 服务费结算 - 基础设置 - 骑士标签设置 - 添加骑士标签组件 Finance/Config/Tags
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Alert, Button, Table, Tag } from 'antd';

import { HouseholdType } from '../../../../../application/define';
import { CoreContent } from '../../../../../components/core';
import Search from './search';
import styles from '../style/index.less';

class AddKnightTags extends Component {
  static propTypes = {
    knightAll: PropTypes.object,      // 列表数据
    selectedTagId: PropTypes.string, // 当前选中的标签
    onChangeKnightTagsModal: PropTypes.func, // 隐藏骑士打标签的回调
  }
  static defaultProps = {
    knightAll: {},
    selectedTagId: '',
    onChangeKnightTagsModal: () => {},
  }
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],                                                             // 选择要操作的数据keys
      isShowDataList: false,                                                           // 是否显示数据列表与底部操作按钮
    };
    this.private = {
      searchParams: {
        limit: 10,      // 默认每页10条数据
        page: 1,        // 默认加载第一页
      },                // 搜索的参数
      isSubmit: true,   // 防止多次点击，提交
    };
  }

  // 查询
  onSearch = (params = {}) => {
    // 保存搜索的参数
    this.private.searchParams = params;
    if (is.not.existy(this.private.searchParams.page) || is.empty(this.private.searchParams.page)) {
      this.private.searchParams.page = 1;
    }
    if (is.not.existy(this.private.searchParams.limit) || is.empty(this.private.searchParams.limit)) {
      this.private.searchParams.limit = 10;
    }

    // 调用搜索
    this.props.dispatch({ type: 'financeConfigTags/fetchAllKnight', payload: this.private.searchParams });
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
  }

  // 修改分页
  onChangePage = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
  }

  // 显示查询到的数据列表与底部操作按钮
  onShowDateList = () => {
    this.setState({ isShowDataList: true });
  }

  // 隐藏骑士标签设置组件
  onCloseKnightTags = () => {
    const { onChangeKnightTagsModal } = this.props;
    // 调用回调，隐藏组件
    if (onChangeKnightTagsModal) {
      onChangeKnightTagsModal();
    }
  }

  // 添加按钮，提交数据
  onSubmit = () => {
    const { selectedTagId } = this.props;
    const { selectedRowKeys } = this.state;
    const params = {
      tagId: selectedTagId,
      staffIds: selectedRowKeys,
      onSuccessCallback: this.onSuccessCallback,
    };
    // 防止多次提交
    if (this.private.isSubmit) {
      // 提交后台
      this.props.dispatch({ type: 'financeConfigTags/createKnightTags', payload: params });
      this.private.isSubmit = false;
    }
  }

  // 服务器请求后成功的回调函数
  onSuccessCallback = (params) => {
    // 标签设置成功后，隐藏组件
    const { onChangeKnightTagsModal } = this.props;
    if (onChangeKnightTagsModal) {
      onChangeKnightTagsModal();
    }
    const searchParams = {
      selectedTagId: params,
    };
    // 重新获取标签列表与当前标签下的所有骑士，并刷新页面
    this.props.dispatch({ type: 'financeConfigTags/fetchKnightTags', payload: {} });
    this.props.dispatch({ type: 'financeConfigTags/fetchKnightData', payload: searchParams });
  }

  // 渲染查询组件
  renderSearch = () => {
    const { onSearch } = this;
    return (
      <Search onSearch={onSearch} onShowDateList={this.onShowDateList} />
    );
  }

  // 渲染列表内容
  renderContent = () => {
    const { knightAll } = this.props;
    const { selectedRowKeys, isShowDataList } = this.state;
    // 如果没有查询，则不显示
    if (!isShowDataList) {
      return;
    }
    const { page = 1 } = this.private.searchParams;
    // 表格选择功能的配置
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedKeys) => {
        this.setState({
          selectedRowKeys: selectedKeys,
        });
      },
    };
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        width: 100,
      }, {
        title: '平台',
        dataIndex: 'platformNames',
        key: 'platformNames',
        render: (text) => {
          return text || '--';
        },
      }, {
        title: '供应商',
        dataIndex: 'supplierNames',
        key: 'supplierNames',
        render: (text) => {
          return text || '--';
        },
      }, {
        title: '城市',
        dataIndex: 'cityNames',
        key: 'cityNames',
        render: (text) => {
          return text || '--';
        },
      }, {
        title: '商圈',
        dataIndex: 'bizDistrictNames',
        key: 'bizDistrictNames',
        render: (text) => {
          return text || '--';
        },
      }, {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
      }, {
        title: '身份证号',
        dataIndex: 'identityCardId',
        key: 'identityCardId',
      }, {
        title: '个户类型',
        dataIndex: 'workType',
        key: 'workType',
        render: (text) => { return HouseholdType.description(text); },
      }, {
        title: '标签名称',
        dataIndex: ['tagMapInfo', 'tagList'],
        key: 'tagMapInfo.tagList',
        render: (text) => {
          let Tags = '--';
          if (is.existy(text) && is.array(text)) {
            Tags = text.map((item, index) => <Tag className={styles['app-comp-finance-tags-margin']} key={index} color="orange">{item.name}</Tag>);   // 重新组装标签集合
          }
          return Tags;
        },
      },
    ];
    // 分页
    const pagination = {
      // 每次点击查询, 重置页码为1
      current: page,
      defaultPageSize: 10,                                  // 默认数据条数
      onChange: this.onChangePage,                          // 切换分页
      showQuickJumper: true,                                // 显示快速跳转
      showSizeChanger: true,                                // 显示分页
      onShowSizeChange: this.onShowSizeChange,              // 展示每页数据数
      total: dot.get(knightAll, 'meta.count', 0),          // 数据总条数
      showTotal: total => `总共${total}条`,                  // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
    };
    return (
      <CoreContent>
        <Table rowKey={record => record.id} rowSelection={rowSelection} pagination={pagination} dataSource={knightAll.data} columns={columns} scroll={{ x: 1470 }} />
      </CoreContent>
    );
  }

  // 渲染底部操作按钮
  renderConfirmOrCancel = () => {
    const { selectedRowKeys, isShowDataList } = this.state;
    // 如果没有查询，则不显示
    if (!isShowDataList) {
      return;
    }
    // 判断有没有选择项，如果没有，则不能提交。
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div
        className={styles['app-comp-finance-tags-div-position']}
      >
        <Alert message="选择骑士点击添加按钮添加到当前分组" type="warning" showIcon className={styles['app-comp-finance-tags-alert']} />
        <Button
          type="default"
          className={styles['app-comp-finance-tags-btns']}
          onClick={() => this.onCloseKnightTags()}
        ><CloseOutlined className={styles['app-comp-finance-tags-color']} /></Button>
        <Button type="primary" disabled={!hasSelected} onClick={this.onSubmit}>添加</Button>
      </div>
    );
  }

  render() {
    const { renderSearch, renderContent, renderConfirmOrCancel } = this;
    return (
      <div
        className={styles['app-comp-finance-tags-border']}
      >
        {/* 渲染搜索 */}
        {renderSearch()}

        {/* 渲染内容列表 */}
        {renderContent()}

        {/* 渲染底部按钮 */}
        {renderConfirmOrCancel()}
      </div>
    );
  }
}

function mapStateToProps({ financeConfigTags: { knightAll } }) {
  return { knightAll };
}
export default connect(mapStateToProps)(AddKnightTags);
