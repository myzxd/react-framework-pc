/**
 * 发起审批 - 费控申请 - 页面路由 - 配置管理业务页面路由，方便代理转换
 */
import is from 'is_js';
import dot from 'dot-prop';

import { OaApplicationOrderType } from '../../../application/define';
import {
  canOperateExpenseManageCreate,
  canModuleExpenseBorrowing,
} from '../../../application/define/operate';

// 所有的单据类型
const PagesTypes = [
  // 考勤管理 0~9
  // {
    // key: OaApplicationOrderType.cost,
    // icon: '1.png',
    // hoverIcon: 'hover-1.png',
    // isShow: canOperateExpenseManageCreate(), // 判断是否显示
    // title: '费用申请',
    // desc: '【待提报】审批单请到【付款审批】中查看',
  // },
  // {
    // key: OaApplicationOrderType.travel,
    // icon: '9.png',
    // hoverIcon: 'hover-9.png',
    // isShow: canOperateExpenseManageCreate(),
    // title: '差旅报销',
    // desc: '差旅报销必须关联“我发起过的出差申请单”',
  // },
  {
    key: OaApplicationOrderType.borrowing,
    icon: '6.png',
    hoverIcon: 'hover-6.png',
    isShow: canOperateExpenseManageCreate(),
    title: '借款申请',
    desc: '【待提报】审批单请到【付款审批】中查看',
  },
  {
    key: OaApplicationOrderType.repayments,
    icon: '7.png',
    hoverIcon: 'hover-7.png',
    isShow: canModuleExpenseBorrowing(),
    title: '还款申请',
    desc: '还款仅能选择“我发起过的借款单”进行还款',
  },
  {
    key: OaApplicationOrderType.business,
    icon: '8.png',
    hoverIcon: 'hover-8.png',
    isShow: canOperateExpenseManageCreate(),
    title: '出差申请',
    desc: '差旅报销需关联出差申请，固出差申请暂放在本模块',
  },
];

// 页面大类
const PageCateogries = {
  Payment: 0, // 付款申请
  Other: 1, // 其他

  description(rawValue) {
    switch (Number(rawValue)) {
      case this.Payment: return '付款申请';
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
    // 考勤模块key集合
    if (category === PageCateogries.Payment) {
      keys = [1, 9, 6, 7];
    }
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


  // 面包屑的路径
  breadcrumbByKey(key) {
    return [
      '审批管理',
      '发起审批',
      '费控申请',
      this.titleByKey(key),
    ];
  },
};

// 入口配置定义
const PagesDefinition = [
  {
    title: PageCateogries.description(PageCateogries.Payment),
    routes: PagesHelper.pagesByCategory(PageCateogries.Payment),
  },
  //{ // 其他页面
    //title: PageCateogries.description(PageCateogries.Other),
    //routes: PagesHelper.pagesByCategory(PageCateogries.Other),
  //},
];

export {
  // 单据类型类型
  PagesTypes,
  // 入口配置定义
  PagesDefinition,
  // 页面帮助方法
  PagesHelper,
};
