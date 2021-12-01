/**
 * 单据详情页面模块
 */
import is from 'is_js';
import React from 'react';
import { Collapse } from 'antd';
import { CoreContent } from '../../../../components/core';

import { PagesRouteTypes, PagesHelper } from '../define';

const OADocumentDetail = (props) => {
  const { list: data = [], oaDetail = {}, examineOrderDetail = {} } = props;
  // 根据单据id，显示详情
  const renderDetailPage = (id, key) => {
    // 判断，如果没有对应的页面，则直接跳转到404
    if (PagesHelper.isPageKeyExisty(key) !== true) {
      return <div />;
    }

    // 判断动态组件，添加路由配置
    try {
      // 动态页面，根据路由，动态获取页面配置
      const DynamicPage = PagesHelper.componentByKey(key, PagesRouteTypes.detail);
      // 判断页面组件是否存在
      if (is.empty(DynamicPage)) {
        return <div />;
      }
      // 动态页面的属性
      const DynamicPageProps = {
        // 页面get参数传参数
        query: { id },
        oaDetail,
      };
      return (
        <Collapse.Panel header={`单号: ${id}`} key={id} showArrow>
          <DynamicPage {...DynamicPageProps} examineOrderDetail={examineOrderDetail} />
        </Collapse.Panel>
      );
    } catch (e) {
      console.log(e.message);
    }
    return <div />;
  };

  // 渲染单据列表页
  const renderList = (list) => {
    // 判断单据列表页是否为空
    if (is.empty(list) || is.not.existy(list)) {
      return <div />;
    }
    return list.map(({ id, key }) => {
      return renderDetailPage(id, key);
    });
  };

  const callback = (key) => {
    console.log(key);
  };

  // 数据为空时
  if (!data || (Array.isArray(data) && data.length === 0)) return <div />;

  // 渲染多个详情页面
  return (
    <CoreContent title="相关单据">
      <Collapse bordered={false} onChange={callback}>
        {renderList(props.list)}
      </Collapse>
    </CoreContent>
  );
};

export default OADocumentDetail;
