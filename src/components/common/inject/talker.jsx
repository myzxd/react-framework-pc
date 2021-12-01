/**
 * 业务组件，页面聊天脚本注入
 */
import React, { useEffect } from 'react';
import InjectService from '../../../application/service/injector';
import { config, injector } from '../../../application';

const { Script } = InjectService;


const CommonInjectTracker = () => {
  useEffect(() => {
    const chatId = config.ClientServiceChatId;
    const domainId = config.ClientServiceDomainId;

    const script = new Script({
      id: 'kf5-provide-supportBox',
      src: `https://assets-cdn.kf5.com/supportbox/main.js?${(new Date()).getDay()}`,
      options: {
        'kchat-id': chatId,
        'kf5-domain': domainId,
        charset: 'utf-8',
      },
      callback: () => {
        console.log('talker init');
      },
    });
    injector.inject(script);
  });
  return (
    <React.Fragment />
  );
};

export default CommonInjectTracker;
