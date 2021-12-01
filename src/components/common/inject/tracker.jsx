/**
 * 业务组件，页面统计脚本注入
 */
import React, { useEffect } from 'react';
import InjectService from '../../../application/service/injector';
import { config, tracker, injector } from '../../../application';

const { Script } = InjectService;

const CommonInjectTracker = () => {
  useEffect(() => {
    const script = new Script({
      id: 'script_countly',
      src: config.countly_script,
      callback: () => {
        tracker.init();
      },
    });
    injector.inject(script);
  });
  return (
    <React.Fragment />
  );
};

export default CommonInjectTracker;
