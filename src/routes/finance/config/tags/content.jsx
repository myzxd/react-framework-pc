/**
 * 服务费结算 - 基础设置 - 结算指标设置 - 右侧内容组件
 */
import React, { Component } from 'react';
import is from 'is_js';
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import { Table, Button, Popconfirm, Tag } from 'antd';
import { CoreContent } from '../../../../components/core';
import AddKnightTags from './component';
import { HouseholdType } from '../../../../application/define';
import Search from './search';
import styles from './style/index.less';
import Operate from '../../../../application/define/operate';

class Content extends Component {
  static propTypes = {
    itemTag: PropTypes.object,
    knightData: PropTypes.object,
    loading: PropTypes.object,
    selectedTagId: PropTypes.string,
    onDeleteKnightTags: PropTypes.func,
    onSearch: PropTypes.func,
  };

  static defaultProps = {
    itemTag: {},
    knightData: {},
    loading: {},
    selectedTagId: '',
    onDeleteKnightTags: () => {},
    onSearch: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isShowKnightCreateTagsModal: false,                // 是否显示骑士打标签组件
      isDeleteKnightTags: false,                         // 是否删除骑士标签
      selectedDeleteKnights: [],                         // 保存选中要移除骑士的项
    };
    this.private = {
      // 搜索的参数
      searchParams: {
        selectedTagId: '',  // 带上查询标签id
        name: '',           // 姓名
        phone: '',          // 手机号
      },
    };
  }

  // 修改分页
  onChangePage = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
  }

  // 显示删除骑士标签事件
  onDelete = () => {
    this.setState({ isDeleteKnightTags: true });
  }

  // 确定删除
  onConfirmDelete = (record, bool) => {
    const { selectedDeleteKnights } = this.state;

    // 标签骑士列表数据
    const { knightData = {} } = this.props;
    const data = dot.get(knightData, 'data', []);

    const { onDeleteKnightTags } = this.props;

    // 向后台发送删除骑士id数组
    const deleteKnightTags = [];
    // 判断是删除一项还是多项
    if (bool) {
      deleteKnightTags.push(record.id);
    } else {
      selectedDeleteKnights.forEach((item) => {
        deleteKnightTags.push(data[item].id);
      });
    }

    // 删除骑士回调函数
    if (onDeleteKnightTags) {
      // 隐藏批量删除标签
      this.setState({
        isDeleteKnightTags: false,
        selectedDeleteKnights: [],
      });
      onDeleteKnightTags(deleteKnightTags);
    }
  }

  // 取消删除选中状态
  onCancelDelete = () => {
    this.setState({
      isDeleteKnightTags: false,
      selectedDeleteKnights: [],
    });
  }

  // 是否显示骑士打标组件
  onChangeKnightTagsModal = () => {
    const { isShowKnightCreateTagsModal } = this.state;
    this.setState({
      isShowKnightCreateTagsModal: !isShowKnightCreateTagsModal,
    });
  }

  // 选中项发生变化时的回调
  onSelectChange = (selectedDeleteKnights) => {
    this.setState({ selectedDeleteKnights });
  }

  // 查询
  onSearch = (params) => {
    const { onSearch, selectedTagId } = this.props;
    // 保存搜索的参数
    this.private.searchParams = params;
    if (!this.private.searchParams.page) {
      this.private.searchParams.page = 1;
    }
    if (!this.private.searchParams.limit) {
      this.private.searchParams.limit = 30;
    }
    // 带上查询标签的id
    this.private.searchParams.selectedTagId = selectedTagId;
    // 查询回调函数
    if (onSearch) {
      onSearch(this.private.searchParams);
    }
  }

  // 渲染添加骑士标签按钮
  renderKnightTagsEnter = () => {
    const { isShowKnightCreateTagsModal } = this.state;
    if (isShowKnightCreateTagsModal) {
      return;
    }
    return (
      Operate.canOperateFinanceConfigTagsCreate() ?
        <div
          className={styles['app-comp-finance-tags-btn']}
        >
          <Button type="primary" className={styles['app-comp-finance-tags-font-width']} onClick={() => this.onChangeKnightTagsModal()}>+</Button>
        </div> : ''
    );
  }

  // 渲染添加标签组件
  renderKnightTagsModal = () => {
    const { isShowKnightCreateTagsModal } = this.state;
    const { selectedTagId = '' } = this.props;
    if (!isShowKnightCreateTagsModal) {
      return;
    }
    return (
      <AddKnightTags onChangeKnightTagsModal={this.onChangeKnightTagsModal} selectedTagId={selectedTagId} />
    );
  }

  // 渲染搜索
  renderSearch = () => {
    const { selectedTagId } = this.props;
    const { onSearch } = this;
    const props = {
      selectedTagId,
      onSearch,
    };
    return <Search {...props} />;
  }

  // 渲染蒙层
  renderCover = () => {
    return (
      <div className={styles['app-comp-finance-cover']} />
    );
  }

  // 渲染内容列表
  renderContent = () => {
    const { page = 1 } = this.private.searchParams;
    const { selectedDeleteKnights, isDeleteKnightTags } = this.state;

    // 标签骑士列表数据
    const { knightData = {}, loading } = this.props;
    const data = dot.get(knightData, 'data', []);
    const count = dot.get(knightData, 'meta.count', 0);

    const dataSource = data.map((item) => {  // 数据重新组装
      return {
        tagList: item.tagList,
        ...item.staffInfo,
      };
    });
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        width: 80,
      }, {
        title: '个户类型',
        dataIndex: 'workType',
        key: 'workType',
        render: type => HouseholdType.description(type),
      }, {
        title: '平台',
        dataIndex: 'platformNames',
        key: 'platformNames',
        render: (text) => {
          // 判断数据是否存在
          if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
            return '---';
          }
          return text.join(' , ');
        },
      }, {
        title: '供应商',
        dataIndex: 'supplierNames',
        key: 'supplierNames',
        render: (text) => {
          // 判断数据是否存在
          if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
            return '---';
          }
          return text.join(' , ');
        },
      }, {
        title: '城市',
        dataIndex: 'cityNames',
        key: 'cityNames',
        render: (text) => {
          // 判断数据是否存在
          if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
            return '---';
          }
          return text.join(' , ');
        },
      }, {
        title: '商圈',
        dataIndex: 'bizDistrictNames',
        key: 'bizDistrictNames',
        render: (text) => {
          // 判断数据是否存在
          if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
            return '---';
          }
          return text.join(' , ');
        },
      }, {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
        render: text => text || '---',
      }, {
        title: '身份证号',
        dataIndex: 'identityCardId',
        key: 'identityCardId',
        render: text => text || '---',
      }, {
        title: '标签名称',
        dataIndex: 'tagList',
        key: 'tagList',
        render: (tagList) => {
          let Tags = '---';
          if (is.existy(tagList) && is.array(tagList)) {
            Tags = tagList.map((item, index) => <Tag className="bossTagsmargin" key={index} color="orange">{item.name}</Tag>); // 重新组装标签集合
          }
          return Tags;
        },
      }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        width: 80,
        render: (text, record) => {
          return (
            Operate.canOperateFinanceConfigTagsDelete() ?
              <Popconfirm placement="top" title="确定要移除该骑士的标签?" onConfirm={() => this.onConfirmDelete(record, true)} okText="是" cancelText="否">
                <a>移除</a>
              </Popconfirm> : ''
          );
        },
      },
    ];

    // 分页
    const pagination = {
      // 每次点击查询, 重置页码为1
      current: page,
      defaultPageSize: 30,          // 默认数据条数
      onChange: this.onChangePage,  // 切换分页
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,        // 显示分页
      onShowSizeChange: this.onShowSizeChange, // 展示每页数据数
      total: count,                            // 数据总条数
      showTotal: total => `总共${total}条`,     // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
    };

    // 选中
    const rowSelection = {
      selectedRowKeys: selectedDeleteKnights,
      onChange: this.onSelectChange,
    };

    // 显示批量删除按钮的判断
    let showRemoveButton = Operate.canOperateFinanceConfigTagsDelete() ? <Button onClick={this.onDelete}>批量移除</Button> : '';
    if (isDeleteKnightTags) {
      showRemoveButton = (
        <span>
          <Button className="app-global-componenth-width70 app-global-mgr10" onClick={this.onCancelDelete}>取消</Button>
          <Popconfirm placement="top" title={`确定要移除这${selectedDeleteKnights.length}名骑士的标签?`} onConfirm={this.onConfirmDelete} okText="是" cancelText="否">
            <Button disabled={!selectedDeleteKnights.length} className="app-global-componenth-width70" type="primary">确定</Button>
          </Popconfirm>
        </span>
      );
    }

    // 判断当前派发路径 进而判断列表加载图标是否显示
    const isLoading = dot.get(loading.effects, 'financeConfigTags/fetchKnightData', false);

    return (
      <CoreContent title={showRemoveButton}>
        <Table
          rowKey={(record, index) => { return index; }}
          dataSource={dataSource}
          pagination={pagination}
          columns={columns}
          bordered
          scroll={{ x: 1470 }}
          rowSelection={isDeleteKnightTags ? rowSelection : null}
          loading={isLoading}
        />
      </CoreContent>
    );
  }
  render() {
    const { renderSearch, renderContent, renderKnightTagsModal, renderKnightTagsEnter, renderCover } = this;
    const { isShowKnightCreateTagsModal } = this.state;

    const { itemTag = {} } = this.props;

    // 标签名
    const tagName = dot.get(itemTag, 'name', '标签名');
    return (
      <div>
        {/* 渲染标签名 */}
        <h2 className={styles['app-comp-finance-tags-font']}>{tagName}</h2>

        {/* 渲染添加骑士标签按钮 */}
        {renderKnightTagsEnter()}

        {/* 渲染添加标签组件 */}
        {renderKnightTagsModal()}

        {/* 蒙层容器 */}
        <div className={styles['app-comp-finance-cover-container']}>
          {/* 渲染搜索 */}
          {renderSearch()}

          {/* 渲染内容列表 并 传递该标签列表数据*/}
          {renderContent()}

          {/* 渲染蒙层 */}
          { isShowKnightCreateTagsModal ? renderCover() : null }
        </div>
      </div>
    );
  }
}

export default Content;
