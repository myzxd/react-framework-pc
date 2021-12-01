/**
 * code - 付款审批单
 */
import React, { useEffect, useState } from 'react';
import {
  Tag,
  message,
  Popconfirm,
  Button,
} from 'antd';
import {
  CoreContent,
} from '../../../components/core';
import {
  Events,
} from '../../../application/define';
import {
  tracker,
} from '../../../application/';

const GroupContent = ({
  dispatch,
  orderSearchGroup = [], // 查询条件分组
  onUpdateGroup, // 重新获取分组与审批单列表
  resetState, // 重置状态
}) => {
  // 操作的分组
  const [selectedTag, setSelectedTag] = useState(undefined);

  useEffect(() => {
    // 默认选中的默认分组
    if (Array.isArray(orderSearchGroup) && orderSearchGroup.length > 0) {
      const initGroup = orderSearchGroup.find(d => d.is_default) || {};
      setSelectedTag(initGroup._id);
    } else {
      setSelectedTag(undefined);
    }
  }, [orderSearchGroup]);

  useEffect(() => {
    if (resetState) {
      setSelectedTag(undefined);
    }
  }, [resetState]);

  // 切换tag
  const onChangeTag = (tagId) => {
    // 统计
    tracker.track({ event: Events.EventCodeOrderGroupChange });

    setSelectedTag(tagId);

    onUpdateGroup && onUpdateGroup({ groupId: tagId });
  };

  // 删除分组
  const onClose = async (tag) => {
    // 统计
    tracker.track({ event: Events.EventCodeOrderGroupDelete });

    const res = await dispatch({
      type: 'codeOrder/onDeleteGroup',
      payload: { groupId: tag },
    });

    if (res && res._id) {
      message.success('请求成功');

      // 获取分组列表及审批单列表
      onUpdateGroup && onUpdateGroup();
    }

    if (res && res.zh_message) {
      message.error(res.zh_message);
    }
  };

  // 设置默认分组
  const onSetDefaultGroup = async (isDefault) => {
    // 统计
    tracker.track({ event: Events.EventCodeOrderGroupSet });

    const res = await dispatch({
      type: 'codeOrder/onSetDefaultGroup',
      payload: {
        groupId: selectedTag,
        isDefault,
      },
    });

    if (res && res._id) {
      message.success('请求成功');

      // 获取分组列表及审批单列表
      onUpdateGroup && onUpdateGroup();
    }

    if (res && res.zh_message) {
      message.error(res.zh_message);
    }
  };

  // title
  const title = `条件分组【${orderSearchGroup.length}/5】(如果设置有默认分组，列表中的数据为满足条件分组的数据)`;

  // 选中的tag样式
  const checkedStyle = {
    backgroundColor: 'rgba(255, 119, 0, 0.1)',
    borderColor: 'rgb(255, 119, 0)',
    color: 'rgb(255, 119, 0)',
  };

  const tagStyle = {
    margin: 10,
    borderRadius: '15px',
    height: 30,
    lineHeight: '30px',
    cursor: 'pointer',
  };

  const titleExt = (
    <React.Fragment>
      <Popconfirm
        title="确定设为默认条件分组？"
        disabled={!selectedTag}
        onConfirm={() => onSetDefaultGroup(true)}
      >
        <Button
          type="link"
          disabled={!selectedTag}
        >设为默认分组</Button>
      </Popconfirm>
      <Popconfirm
        title="确定取消默认条件分组？"
        disabled={!selectedTag}
        onConfirm={() => onSetDefaultGroup(false)}
      >
        <Button
          type="link"
          style={{ marginLeft: 10 }}
          disabled={!selectedTag}
        >取消默认选中分组</Button>
      </Popconfirm>
    </React.Fragment>
  );

  return (
    <CoreContent
      title={title}
      titleExt={titleExt}
    >
      {
        orderSearchGroup.map((d, key) => {
          // 是否选中
          const isChecked = selectedTag === d._id;

          return (
            <Tag
              key={d._id || key}
              closable
              onClose={() => onClose(d._id)}
              onClick={() => onChangeTag(d._id)}
              style={
                isChecked ? {
                  ...tagStyle,
                  ...checkedStyle,
                }
                : { ...tagStyle }
              }
            >
              <span
                style={{ padding: '0 10px' }}
              >{d.name}</span>
            </Tag>
          );
        })
      }
    </CoreContent>
  );
};

export default GroupContent;
