/**
 * Code/Team审批管理 - 发起审批 - 费控申请 - tree - link
 */
/* eslint-disable import/no-dynamic-require */
import React, { useState } from 'react';
import { Popover, Tooltip } from 'antd';

import { StarOutlined } from '@ant-design/icons';
import styles from './style.less';

const LinkComponent = ({
  detail = {}, // link详情
  onClickFow,
  onCollect,
}) => {
  // 是否显示收藏功能操作
  const [isHoverIcon, setIsHoverIcon] = useState(false);
  // 是否改变颜色
  const [isTool, setIsTool] = useState(false);

  // 收藏功能
  const renderCollect = () => {
    const title = (
      <span>
        <StarOutlined
          className={styles['app-comp-code-link-collect-tooltip-icon']}
          styles={{ color: '#FF7700' }}
        />
        <span
          className={styles['app-comp-code-link-collect-tooltip-content']}
        >点击收藏</span>
      </span>
    );

    if (isHoverIcon) {
      return (
        <Tooltip title={title} visible={isTool}>
          <span
            className={styles['app-comp-code-link-collect-wrap']}
          >
            <StarOutlined
              onClick={() => onCollect(detail._id)}
              onMouseOver={() => setIsTool(true)}
              onMouseOut={() => setIsTool(false)}
            />
          </span>
        </Tooltip>
      );
    }

    return (
      <span className={styles['app-comp-code-link-collect-wrap']}>
        <StarOutlined style={{ opacity: 0 }} />
      </span>
    );
  };

  if (detail.note) {
    return (
      <div
        className={styles['app-tree-node-flow']}
        key={detail._id}
        onMouseOver={() => setIsHoverIcon(true)}
        onMouseOut={() => setIsHoverIcon(false)}
      >
        <Popover
          overlayStyle={{
            zIndex: 99999,
          }}
          content={
            <div
              style={{
                display: 'flex',
                maxWidth: 500,
              }}
            >

              <img
                style={{ width: 12, height: 12, marginRight: 3 }}
                src={require('../../static/light-bulb.png')}
                alt=""
              />
              <span>
                {detail.note}
              </span>
            </div>
          }
          trigger="hover"
          key={detail._id}
        >

          <div
            onClick={() => onClickFow(detail._id)}
          >
            {detail.icon ? (
              <img
                src={require(`../../static/${detail.icon}.png`)}
                alt=""
              />) : null}
            <span className={styles['app-tree-node-flow-title']}>
              {detail.name}
            </span>
          </div>
        </Popover>
        {/* 收藏 */}
        {renderCollect()}
      </div>
    );
  }
  return (
    <div
      key={detail._id}
      className={styles['app-tree-node-flow']}
    >
      <div
        onClick={() => onClickFow(detail._id)}
      >
        {detail.icon ? (
          <img
            src={require(`../../static/${detail.icon}.png`)}
            alt=""
          />) : null}
        <span className={styles['app-tree-node-flow-title']}>
          {detail.name}
        </span>
      </div>
      {/* 收藏 */}
      {renderCollect()}
    </div>
  );
};

export default LinkComponent;

