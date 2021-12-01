/**
 * Code/Team审批管理 - 付款类型配置管理 - 内容（事项基本信息）
 */
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import {
  Form,
  Button,
  Empty,
} from 'antd';

import {
  CoreContent,
  CoreForm,
} from '../../../../../components/core';
import UpdateMatterDrawer from './updateMatter';

import Operate from '../../../../../application/define/operate';

const TypeContent = ({
  matterDetail = {}, // 详情
  dispatch,
  matterId, // 事项id
}) => {
  // 编辑菜单visible
  const [updateMatVis, setUpdateMatVis] = useState(false);

  useEffect(() => {
    matterId && dispatch({
      type: 'codeMatter/getMatterDetail',
      payload: { matterId },
    });

    return () => {
      dispatch({ type: 'codeMatter/resetMatterDetail' });
    };
  }, [dispatch, matterId]);

  // 无数据
  if (Object.keys(matterDetail).length < 1) {
    return (
      <CoreContent title="基本信息">
        <Empty />
      </CoreContent>
    );
  }

  // 获取事项详情
  const getMatterDetail = () => {
    dispatch({
      type: 'codeMatter/getMatterDetail',
      payload: { matterId },
    });
  };

  // 隐藏编辑事项弹窗
  const onCloseUpdateMatter = (res) => {
    // 重新获取详情
    if (res) getMatterDetail();
    setUpdateMatVis(false);
  };

  // 基本信息
  const renderBasicInfo = () => {
    const {
      name, // 名称
      note, // 说明
    } = matterDetail;
    // items
    const basicItems = [
      <Form.Item label="分类名称">
        {name || '--'}
      </Form.Item>,
      <Form.Item label="说明">
        {note || '--'}
      </Form.Item>,
    ];

    // titleExt
    const titleExt = Operate.canOperateOperateCodeMatterUpdate() ?
      (
        <Button
          type="primary"
          onClick={() => setUpdateMatVis(true)}
        >编辑</Button>
      ) : '';

    return (
      <CoreContent title="基本信息" titleExt={titleExt}>
        <Form className="wallet-bill-detail-basic-form">
          <CoreForm items={basicItems} cols={3} />
        </Form>
      </CoreContent>
    );
  };

  // 编辑菜单props
  const props = {
    data: matterDetail, // 编辑的数据
    visible: updateMatVis, // visible
    onClose: onCloseUpdateMatter, // onCancel
    matterId, // 事项id
    dispatch,
  };

  return (
    <React.Fragment>
      {/* 基本信息 */}
      {renderBasicInfo()}

      {/* 编辑事项弹窗 */}
      <UpdateMatterDrawer {...props} />
    </React.Fragment>
  );
};

const mapStateToProps = ({
  codeMatter: { matterDetail },
}) => {
  return { matterDetail };
};

export default connect(mapStateToProps)(TypeContent);
