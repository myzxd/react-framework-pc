/**
 * code/team - 首页 - 收藏的提报 - 链接
 */
/* eslint-disable import/no-dynamic-require */
import React, { useState } from 'react';
import {
  Col,
  Popover,
  Tooltip,
} from 'antd';
import {
  DeleteOutlined,
} from '@ant-design/icons';

import style from '../style.less';

const LinkComponent = ({
  detail = {}, // link数据
  onCheckSubmit,
  onCancelCollectLink,
}) => {
  // 是否显示收藏功能操作
  const [isHoverIcon, setIsHoverIcon] = useState(false);
  const [isTool, setIsTool] = useState(false);

  // 取消收藏 tooltip
  const deleteCollectTitile = (
    <span>
      <DeleteOutlined className={style['code-home-collect-delete-tooltip-icon']} />
      <span className={style['code-home-collect-delete-tooltip-content']}>取消收藏</span>
    </span>
  );

  return (
    <Col
      span={8}
      key={detail._id}
      className={style['code-home-collect-link-col']}
      onMouseOver={() => setIsHoverIcon(true)}
      onMouseOut={() => setIsHoverIcon(false)}
    >
      <div
        className={style['code-home-collect-link-wrap']}
      >
        <Popover
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
        >
          <div
            className={style['code-home-collect-link-content']}
            onClick={() => onCheckSubmit(detail._id)}
          >
            <img
              className={style['code-home-collect-link-icon']}
              src={require(`../../static/${detail.icon}.png`)}
              alt=""
            />
            <span
              className={style['code-home-collect-link-title']}
            >{detail.name}</span>
          </div>
        </Popover>
        {
          isHoverIcon ?
            (
              <Tooltip title={deleteCollectTitile} visible={isTool}>
                <span
                  className={style['code-home-collect-link-delete-btn']}
                >
                  <DeleteOutlined
                    onClick={() => onCancelCollectLink(detail._id)}
                    onMouseOver={() => setIsTool(true)}
                    onMouseOut={() => setIsTool(false)}
                  />
                </span>
              </Tooltip>
            ) : <span className={style['code-home-collect-link-delete-btn']}><DeleteOutlined style={{ opacity: 0 }} /></span>
        }
      </div>
    </Col>

  );
};

export default LinkComponent;
