/**
 * 服务费结算 - 基础设置 - 骑士标签设置 Finance/Config/Tags
 */
import is from 'is_js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import Content from './content';
import styles from './style/index.less';

const TabPane = Tabs.TabPane;

class IndexComponent extends Component {
  static propTypes = {
    knightTags: PropTypes.object,
    knightData: PropTypes.object,
    loading: PropTypes.object,
  };

  static defaultProps = {
    knightData: {},
    knightTags: {},
    loading: {},
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.private = {
      searchParams: {
        name: '',      // 姓名
        phone: '',     // 手机号
        workType: undefined, //  人员类型
        selectedTagId: '',                   // 选中的标签ID
        limit: 30,                           // 默认每页30条数据
        page: 1,                             // 默认加载第一页
      },
    };
  }

  // 刷新页面请求默认参数数据
  componentDidMount() {
    const { onFirstLoadSuccessCallback } = this;
    // 触发dispatch 第一次传递 onFirstLoadSuccessCallback 回调函数
    this.props.dispatch({ type: 'financeConfigTags/fetchKnightTags', payload: { onFirstLoadSuccessCallback } }); // 获取骑士标签 获取所有
  }

  // 第一次加载标签数据的回调函数 返回第一个标签的id
  onFirstLoadSuccessCallback = (firstTagId) => {
    const { onSearch } = this;
    const { searchParams } = this.private;
    searchParams.selectedTagId = firstTagId;  // 设置选中标签的id
    onSearch(searchParams);
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
    // 调用搜索 重新获取knightData数据
    this.props.dispatch({ type: 'financeConfigTags/fetchKnightData', payload: this.private.searchParams });
  }

  // 删除成功的回调函数
  onDeleteSuccessCallback = () => {
    const { searchParams } = this.private;
    // 删除成功 更新标签数据
    this.props.dispatch({ type: 'financeConfigTags/fetchKnightTags', payload: {} }); // 更新标签数据
    this.props.dispatch({ type: 'financeConfigTags/fetchKnightData', payload: searchParams });// 重新获取数据
  }

  // 删除骑士标签
  onDeleteKnightTags = (removeParams) => {
    const { searchParams } = this.private;
    const { onDeleteSuccessCallback } = this;
    // 默认查询参数
    const payload = {
      selectedTagId: searchParams.selectedTagId, // 删除哪个标签下的数据
      removeParams,                              // 删除人员id的集合
      onDeleteSuccessCallback,                   // 删除成功的回调函数
    };
    // 调用删除dispatch removeParams为子组件传递过来删除骑士id的数组
    this.props.dispatch({ type: 'financeConfigTags/deleteKnightTags', payload });
  }

  // 点击选择标签事件
  onSelectTag = (selectedTagId) => {
    const { onSearch } = this;
    const params = {
      name: '',      // 姓名
      phone: '',     // 手机号
      workType: undefined, //  人员类型
      selectedTagId,
    };
    onSearch(params);
  }

  // 渲染标签对应的内容
  renderContent = (item) => {
    const { knightData, loading } = this.props;
    const { onDeleteKnightTags, onSearch } = this;
    const { searchParams } = this.private;
    const props = {
      selectedTagId: searchParams.selectedTagId,  // 传递标签id
      itemTag: item,            // 当前标签项
      knightData,               // 数据列表
      onSearch,                 // 查询事件
      onDeleteKnightTags,       // 删除骑士标签事件
      loading,                  // 全局loading
    };
    return (
      <Content {...props} />
    );
  }

  // 渲染标签列表中的标签
  renderTab = (tag) => {
    const { id, name, staffCounter } = tag; // 获取当前标签 id name count
    //  判断 如果多于 1000 条 显示 999+
    let count = staffCounter;
    if (count >= 1000) {
      count = '999+';
    }
    // 标签的标题
    const title = (
      <span className={styles['app-comp-finance-data-span']} onClick={() => this.onSelectTag(id)}>
        {/* 标签名 */}
        <strong className={styles['app-comp-finance-tag-strong']}>{name}</strong>

        {/* 对应标签骑士数量*/}
        <strong className={styles['app-comp-finance-data-strong']}>{count}</strong>
      </span>
    );

    return (
      <TabPane tab={title} key={id}>
        {/* 渲染标签对应的内容 */}
        {this.renderContent(tag)}
      </TabPane>
    );
  }

  render() {
    const { knightTags } = this.props;
    let tabs = [];
    // 判断标签数据是否存在
    if (is.existy(knightTags.data) && is.array(knightTags.data)) {
      tabs = knightTags.data.map((tag) => {
        return this.renderTab(tag);
      });
    }
    return (
      <div className={styles['app-comp-finance-card-container']}>
        {/* tab切换模版 */}
        <Tabs
          tabPosition="left"
          tabBarStyle={{ height: 680 }}
        >
          {tabs}
        </Tabs>
      </div>
    );
  }
}

function mapStateToProps({ financeConfigTags: { knightTags, knightData }, loading }) {
  return { knightData, knightTags, loading };
}
export default connect(mapStateToProps)(IndexComponent);
