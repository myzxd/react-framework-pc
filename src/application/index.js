import Storage from './library/storage';
import System from './service/system';
import Config from './service/config';
import Authorize from './service/authorize';
import Notification from './service/notification';
import Network from './service/network';
import Utils from './utils';
import Tracker from './service/tracker';
import Injector from './service/injector';

// 初始化应用
function createApp() {
  // 系统通知，提供给网络请求使用
  const notification = Notification();

  // 授权信息
  const authorize = new Authorize();

  // 系统信息
  const system = new System();

  // 存储storage
  const storage = new Storage('aoao.boss.app.storage', { container: authorize.account.id });

  // 缓存session
  const session = new Storage('aoao.boss.app.session', { container: authorize.account.id, useSession: true });

  // 工具类
  const utils = Utils;

  // 授权配置文件
  const config = Config;

  // 统计服务
  const tracker = new Tracker();

  // 页面脚本注入服务
  const injector = new Injector();

  // 监听有网的情况
  Network.observerOnline(() => {
    const isRefresh = confirm('网络已恢复正常，是否要刷新页面?');
    if (isRefresh === true) {
      window.location.reload();
    }
  });

  // 监听断网的情况
  Network.observerOffline(() => {
    alert('目前已断网，请检查您的网络链接。');
  });

  return {
    notification,
    authorize,
    storage,
    session,
    system,
    config,
    utils,
    tracker,
    injector,
  };
}

// 上一版 module.exports = createApp();
export default createApp();
export const {
  notification,
  authorize,
  storage,
  session,
  system,
  config,
  utils,
  tracker,
  injector,
} = createApp();
