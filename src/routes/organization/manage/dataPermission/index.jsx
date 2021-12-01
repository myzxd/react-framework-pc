/**
 * 组织架构 - 部门管理 - 数据权限范围Tab
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Button, Empty } from 'antd';

import { CoreContent } from '../../../../components/core';
import Content from './component/content';
import Update from './component/update';
import EmptyData from '../empty';

import { utils } from '../../../../application';
import Operate from '../../../../application/define/operate';
import style from './index.less';
// 页面类型
const PageType = {
  detail: 10,
  update: 20,
};

// 操作类型
const OperateType = {
  create: 10,
  update: 20,
};

function Index(props) {
  const [pageType, setPageType] = useState(PageType.detail);
  const [operateType, setOperateType] = useState(OperateType.create);
  const { dispatch, departmentId, activeKey } = props;
  // 重置
  const onReset = () => {
    setPageType(PageType.detail);
    setOperateType(OperateType.create);
  };
  useEffect(() => {
    onReset();
    dispatch({ type: 'organizationBusiness/getBusiness', payload: { departmentId } });
    return () => {
      onReset();
      dispatch({ type: 'organizationBusiness/resetBusiness', payload: {} });
    };
  }, [dispatch, departmentId, activeKey]);

    // page onChange
  const onChangeType = (val, operate) => {
    setPageType(val);
    setOperateType(operate);
  };

    // 获取部门下业务信息
  const onSuccessCallback = () => {
    dispatch({ type: 'organizationBusiness/getBusiness', payload: { departmentId } });
  };

    // 有数据
  const renderContent = () => {
    const { businessTag = {} } = props;
    const detail = businessTag.biz_data_business_info || {};
    return <Content data={detail} onChangeType={onChangeType} />;
  };
    // 无数据
  const renderEmpty = () => {
    return (
      <CoreContent title="数据权限范围">
        <div className={style['app-organization-busines-create-operate']}>
          {
              Operate.canOperateOrganizationManageDataPermissionCreate() ?
                (
                  <Button
                    type="primary"
                    onClick={() => onChangeType(PageType.update, OperateType.create)}
                  >新增数据权限范围</Button>
                )
              : <Empty />
            }
        </div>
      </CoreContent>
    );
  };

    // detail
  const renderDetail = () => {
    const { businessTag } = props;
    const detail = businessTag.biz_data_business_info || {};
    // 判断业务信息标签是否为空, 为空则不显示内容
    if (Object.keys(detail).length <= 0) {
      return renderEmpty();
    }

    // 渲染内容
    return renderContent();
  };

    // update
  const renderUpdate = () => {
    const { businessTag } = props;
    const detail = businessTag.biz_data_business || {};
    const teamAttrs = businessTag.team_attrs || [];
    const initPlatformList = utils.dotOptimal(businessTag, 'biz_data_business_info.platform_list', []);
    return (
      <Update
        data={detail}
        teamAttrs={teamAttrs}
        dispatch={dispatch}
        operateType={operateType}
        departmentId={departmentId}
        initPlatformList={initPlatformList}
        onChangeType={() => onChangeType(PageType.detail)}
        onSuccessCallback={onSuccessCallback}
      />
    );
  };

  // 判断是否有部门id
  if (!departmentId || departmentId === 'undefined') {
    return <EmptyData />;
  }
  // 详情页面
  if (pageType === PageType.detail) {
    return renderDetail();
  }

    // 编辑页面
  if (pageType === PageType.update) {
    return renderUpdate();
  }

  return <EmptyData />;
}

function mapStateToProps({
  organizationBusiness: {
    businessTag, // 部门下业务标签
  },
}) {
  return { businessTag };
}

export default connect(mapStateToProps)(Index);
