/**
 * 发起审批 - 费控申请 - 页面路由 - 配置管理业务页面路由，方便代理转换
 */
import is from 'is_js';
import dot from 'dot-prop';

import { OaApplicationOrderType } from '../../../application/define';
import {
  canOperateExpenseManageCreate,
} from '../../../application/define/operate';

// 所有的单据类型
const PagesTypes = [
  {
    key: OaApplicationOrderType.business,
    icon: '006.png',
    isShow: canOperateExpenseManageCreate(),
    title: '出差申请',
  },
];

// 页面大类
const PageCateogries = {
  Other: 1, // 其他
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.Other: return '其他';
      default: return '--';
    }
  },
};

// 单据页面相关的帮助方法
const PagesHelper = {

  // 获取当前大类下的页面数据
  pagesByCategory(category) {
    let keys = [];
    // 其他模块key集合
    if (category === PageCateogries.Other) {
      keys = [8];
    }
    return PagesTypes.filter(page => keys.includes(page.key));
  },

  // 根据key值获取页面信息
  pageByKey(key) {
    const page = PagesTypes.filter(item => Number(key) === item.key);
    if (is.not.existy(page) || is.empty(page) || is.not.array(page)) {
      return undefined;
    }
    return dot.get(page, '0');
  },

  // 根据页面key，获取标题
  titleByKey(key) {
    const page = this.pageByKey(key);
    return dot.get(page, 'title', '--');
  },

};

// 入口配置定义
const PagesDefinition = [
  { // 其他页面
    title: PageCateogries.description(PageCateogries.Other),
    routes: PagesHelper.pagesByCategory(PageCateogries.Other),
  },
];

export {
  // 单据类型类型
  PagesTypes,
  // 入口配置定义
  PagesDefinition,
  // 页面帮助方法
  PagesHelper,
};
