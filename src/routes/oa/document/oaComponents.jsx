/**
 * 发起审批 - 事务申请 /OA/Document
 * */
import React, { useEffect } from 'react';
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Empty } from 'antd';

import { CoreContent } from '../../../components/core';
import { PagesDefinition } from './define';
import { PageFlowButton } from './components';

const OADocumentManageComponents = ({
  dispatch,
  isShowCode,
  viewRange = [], // 事务性提报icon可见范围
  departments,
}) => {
  // 部门数据命名空间
  const departmentsNamespace = 'oa-modal-department';

  useEffect(() => {
    dispatch({ type: 'oaCommon/getViewRange' });

    // 统一在父组件获取部门数据
    if (is.empty(dot.get(departments, departmentsNamespace)) || is.not.existy(dot.get(departments, departmentsNamespace))) {
      dispatch({
        type: 'applicationCommon/fetchDepartments',
        payload: {
          namespace: departmentsNamespace,
          isAuthorized: true,
        },
      });
    }
    return () => {
      dispatch({ type: 'oaCommon/resetViewRange' });
      // 清空部门树数据
      dispatch({ type: 'applicationCommon/resetDepartments', payload: { namespace: departmentsNamespace } });
    };
  }, [dispatch]);

  // 渲染分组数据
  function renderPageGroups(groups = []) {
    return groups.map(({ title = '', routes = [] }) => {
      return (
        <CoreContent title={title} key={`page-${title}`}>
          <div style={{ overflow: 'hidden' }}>
            {renderPageRoutes(routes)}
          </div>
        </CoreContent>
      );
    });
  }

  // 渲染节点数据
  function renderPageRoutes(routes = []) {
    return routes.map(({ key, title, icon, hoverIcon }) => {
      // 根据账户可见范围，过滤可操作的入口
      if (viewRange.includes(key)) {
        return <PageFlowButton isShowCode={isShowCode} key={key} type={key} title={title} icon={icon} hoverIcon={hoverIcon} />;
      }
    });
  }

  // 可见范围没有数据，则不渲染页面
  if (viewRange.length < 1) {
    return (<div
      style={{
        height: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    </div>);
  }

  return renderPageGroups(PagesDefinition);
};

const mapStateToProps = ({
  oaCommon: { viewRange },
  applicationCommon: { departments },
}) => {
  return { viewRange, departments };
};

export default connect(mapStateToProps)(OADocumentManageComponents);
