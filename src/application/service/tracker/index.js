/* eslint-disable import/no-unresolved */
/* eslint no-underscore-dangle: ["error", { "allow": ["_tracker", '_isInit', '_observer'] }] */
import is from 'is_js';
import Countly from 'countly-sdk-web';
import Config from '../config';
import Observer from './observer';

class Tracker extends Object {
  constructor() {
    super();
    // 实例对象
    this._tracker = undefined;
    // 是否已经初始化
    this._isInit = false;
    // 监听服务
    this._observer = new Observer();
  }

  set tracker(val) {
    this._tracker = val;
  }

  get tracker() {
    return this._tracker;
  }

  // 判断是否初始化, 已经初始化返回true，未初始化返回false
  get isInit() {
    return !!(this._isInit === true && is.existy(window.tracker));
  }

  set isInit(val) {
    this._isInit = !!val;
  }

  // 配置文件
  get config() {
    if (this.isInit !== true) {
      return {};
    }

    return {
      app_key: this.tracker.app_key,
      app_version: this.tracker.app_version,
      url: this.tracker.url,
      debug: this.tracker.debug,
      storage: this.tracker.storage,
      remote_config: this.tracker.remote_config,
      country_code: this.tracker.country_code,
      city: this.tracker.city,
      device_id: this.tracker.device_id,
    };
  }

  // 支持的feature功能
  get features() {
    return this.tracker.features;
  }

  // 初始化
  init = () => {
    // 判断是否已经初始化
    if (this.isInit === true) {
      console.log('data tracker already init');
      return;
    }

    // 判断是否存在配置文件，配置文件不存在，则不加载
    if (!Config.countly_app_key || !Config.countly_server) {
      console.warn('data tracker cant init, config not existy');
      return;
    }

    // 初始化countly对象
    this.tracker = Countly || {};
    this.tracker.q = Countly.q || [];
    this.tracker.app_key = Config.countly_app_key;
    this.tracker.url = Config.countly_server;
    this.tracker.debug = Config.countly_debug;

    // 定义全局变量
    window.tracker = this.tracker;

    // TODO: 下面这部分的数据追踪参数，需要调整
    // #跟踪会话
    this.tracker.q.push(['track_sessions']);
    // Track user clicks
    this.tracker.q.push(['track_clicks']);
    // Track page scrolls
    this.tracker.q.push(['track_scrolls']);
    // Track javascript errors
    this.tracker.q.push(['track_errors']);
    // Generate events for link clicks
    this.tracker.q.push(['track_links']);
    // Generate events for form submissions
    this.tracker.q.push(['track_forms']);
    // Collect user information from forms
    this.tracker.q.push(['collect_from_forms']);

    // 初始化统计服务
    this.tracker.init();

    // 更新为已经初始化
    this.isInit = true;

    // 事件追踪
    const onHook = (event) => {
      this.track({ event });
    };
    // 初始化DOM监听服务
    this.observer(onHook);

    console.log('data tracker init success');
  }

  // 订阅监听
  observer = (hook) => {
    // TODO: 简化注册方式
    this._observer.register('click_observer', hook);
  }

  /**
   * 追踪数据
   * @param  {[type]} [event=undefined] [description]
   * @param  {[type]} [error=undefined] [description]
   * @param  {[type]} [page=undefined}] [description]
   * @return {[type]}                   [description]
   */
  track = ({ event = undefined, error = undefined, page = undefined }) => {
    // 判断是否初始化，
    if (this.isInit !== true) {
      return;
    }

    // 判断事件，追踪事件
    if (is.existy(event) && is.not.empty(event)) {
      this.tracker.q.push(['add_event', event]);
    }

    // 判断错误，追踪错误
    if (is.existy(error) && is.not.empty(error)) {
      this.tracker.q.push(['log_error', error]);
    }

    // 判断页面，追踪页面
    if (is.existy(page) && is.not.empty(page)) {
      this.tracker.q.push(['track_pageview', page]);
    }
  }
}

export default Tracker;
