/**
 * 控件，界面
 */
import React from 'react';
import { CoreFinder } from '../../../../../components/core';
import mockFiles from './mock';

const { CoreFinderList } = CoreFinder;

function DemoCoreFinder() {
  // 文件列表
  const data = mockFiles.map((item) => {
    return {
      key: item.asset_key,
      url: item.asset_url,
      data: item,
    };
  });

  return (
    <CoreFinderList data={data} />
  );
}
export default DemoCoreFinder;
