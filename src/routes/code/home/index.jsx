/**
 * code/team - 首页
 */
import React, { useState } from 'react';
import {
  Spin,
} from 'antd';
import BasicInfo from './components/basicInfo';
import Approval from './components/approval';
import CollectReport from './components/collectReport';

import style from './style.less';

const Home = () => {
  const [loading, setLoading] = useState(true); // 差旅
  return (
    <div className={style['code-home-wrap']}>
      {
        loading
        ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999,
              position: 'absolute',
              top: 0,
              left: 0,
              background: 'rgba(0, 0, 0, .1)',
            }}
          >
            <Spin tip="Loading..." />
          </div>
        ) : null
      }

      {/* 账号信息 */}
      <BasicInfo loading={loading} />
      {/* 我待办审批单统计 */}
      <Approval loading={loading} />
      {/* 收藏的提报 */}
      <CollectReport loading={loading} setLoading={setLoading} />
    </div>
  );
};

export default Home;
