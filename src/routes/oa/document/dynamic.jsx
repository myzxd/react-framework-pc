/**
 * OA路由配置, 动态路由
 * NOTE: 动态路由从 PagesRouter 中获取组件key，作为动态组件加载。根据Type加载页面的包装层
 */
import dot from 'dot-prop';
import React from 'react';
import { PageCreateWapper, PageUpdateWapper, PageDetailWapper } from './components/index';
import { PagesRouteTypes, PagesHelper } from './define';

// 页面包装层（创建，编辑，详情）
const PageWapperByType = (type) => {
  switch (type) {
    case PagesRouteTypes.create: return PageCreateWapper; // 创建页面包装层
    case PagesRouteTypes.update: return PageUpdateWapper; // 编辑页面包装层
    case PagesRouteTypes.detail: return PageDetailWapper; // 详情页面包装层
    default: return undefined;
  }
};

const OADocumentPagesRouter = (props) => {
  // 判断路由配置
  const { key, type } = props.match.params;

  // 判断，如果没有对应的页面，则直接跳转到404
  if (PagesHelper.isPageKeyExisty(key) !== true) {
    window.location.href = '/#/404';
  }

  // 判断，如果没有对应类型，则直接跳转到404
  if (PagesHelper.isPageRouteTypeExisty(type) !== true) {
    window.location.href = '/#/404';
  }

  // 判断动态组件，添加路由配置
  try {
    // 外层封装，预留样式包装层
    const DynamicPageWapper = PageWapperByType(type);
    // 动态页面，根据路由，动态获取页面配置
    const DynamicPage = PagesHelper.componentByKey(key, type);
    // 动态页面的属性
    const DynamicPageProps = {
      // 页面get参数传参数
      query: props.location.query || {},
      // 重定向的页面地址
      redirectURL: dot.get(props, 'location.query.redirectURL'),
      // 页面的类型key
      pageType: key,
    };
    return (
      <DynamicPageWapper {...DynamicPageProps}>
        <DynamicPage {...DynamicPageProps} />
      </DynamicPageWapper>
    );
  } catch (e) {
    window.location.href = '/#/404';
  }
};

export default OADocumentPagesRouter;
