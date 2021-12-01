/**
 * Code/Team审批管理 - 付款类型配置管理 - 内容（事项link列表）
 */
/* eslint-disable import/no-dynamic-require */
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  message,
  Popconfirm,
} from 'antd';

import {
  CoreContent,
} from '../../../../../components/core';
import CreateLinkDrawer from './createLink';
import UpdateLinkDrawer from './updateLink';

import Operate from '../../../../../application/define/operate';

const TypeContent = ({
  matterLinkList = {}, // 详情
  dispatch,
  matterId, // 事项id
  tabKey, // 类型（code || team）
}) => {
  // 操作的link id
  const [currentLink, setCurrentLink] = useState(undefined);
  // 新建链接visible
  const [createLinkVis, setCreateLinkVis] = useState(false);
  // 编辑链接visible
  const [updateLinkVis, setUpdateLinkVis] = useState(false);

  useEffect(() => {
    matterId && dispatch({
      type: 'codeMatter/getMatterLinkList',
      payload: { matterId },
    });

    return () => {
      dispatch({ type: 'codeMatter/resetMatterLinkList' });
    };
  }, [matterId]);

  const { data = [] } = matterLinkList;

  // 获取事项详情
  const getMatterLinkList = () => {
    dispatch({
      type: 'codeMatter/getMatterLinkList',
      payload: { matterId },
    });
  };

  // 删除链接
  const onDeleteLink = async (linkId) => {
    const res = await dispatch({
      type: 'codeMatter/deleteMatterLink',
      payload: { id: linkId },
    });

    if (res && res._id) {
      message.success('请求成功');
      getMatterLinkList();
    } else {
      res.zh_message && (message.error(res.zh_message));
    }
  };

  // 查看link modal
  const onViewLink = (curLink) => {
    setCurrentLink(curLink);
    setUpdateLinkVis(true);
  };

  // 隐藏新建链接弹窗
  const onCloseCreateLink = (res) => {
    // 重新获取详情
    if (res) getMatterLinkList();
    setCreateLinkVis(false);
  };

  // 隐藏编辑链接弹窗
  const onCloseUpdateLink = (res) => {
    // 重新获取详情
    if (res) getMatterLinkList();
    setUpdateLinkVis(false);
  };

  // 审批流链接
  const renderFlowLink = () => {
    // 操作权限
    const isSystemAuth = Operate.canOperateOperateCodeMatterLinkOp();

    // titleExt
    const titleExt = isSystemAuth ? (
      <Button
        type="primary"
        onClick={() => setCreateLinkVis(true)}
      >新增链接</Button>
    ) : '';

    // columns
    const columns = [
      {
        dataIndex: 'name',
        render: (text, rec) => {
          const icon = rec.icon ?
            (<img
              role="presentation"
              style={{ marginRight: 5 }}
              src={require(`../../../static/${rec.icon}@1x.png`)}
            />) : '';
          return <span>{icon}{text}</span>;
        },
      },
      {
        dataIndex: '_id',
        key: 'operate',
        render: (text) => {
          const detailOp = (
            <a onClick={() => onViewLink(text)}>查看</a>
          );

          const deleteOp = (
            <Popconfirm
              title="您是否确定删除该链接"
              onConfirm={() => onDeleteLink(text)}
              okText="确定"
              cancelText="取消"
            >
              <a className="common-table-list-operate">删除</a>
            </Popconfirm>
          );

          return (
            <React.Fragment>
              {
                isSystemAuth ? (
                  <span>
                    {detailOp}
                    {deleteOp}
                  </span>
                ) : '--'
              }
            </React.Fragment>
          );
        },
      },
    ];

    return (
      <CoreContent title="链接列表" titleExt={titleExt}>
        <Table
          rowKey={(re, key) => re._id || key}
          pagination={false}
          columns={columns}
          dataSource={data}
          showHeader={false}
        />
      </CoreContent>
    );
  };

  // 新建link props
  const createLinkProps = {
    visible: createLinkVis, // visible
    onClose: onCloseCreateLink, // onCancel
    dispatch,
    tabKey,
    matterId, // 事项id
  };

  // 编辑link props
  const updateLinkProps = {
    linkId: currentLink, // 编辑的数据
    visible: updateLinkVis, // visible
    onClose: onCloseUpdateLink, // onCancel
    setUpdateLinkVis,
    dispatch,
    tabKey,
  };

  return (
    <React.Fragment>
      {/* 审批流链接 */}
      {renderFlowLink()}

      {/* 新建链接弹窗 */}
      {createLinkVis && (<CreateLinkDrawer {...createLinkProps} />)}
      {/* 编辑链接弹窗 */}
      {updateLinkVis && (<UpdateLinkDrawer {...updateLinkProps} />)}
    </React.Fragment>
  );
};

const mapStateToProps = ({
  codeMatter: { matterLinkList },
}) => {
  return { matterLinkList };
};

export default connect(mapStateToProps)(TypeContent);
