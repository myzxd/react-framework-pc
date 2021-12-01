/* eslint-disable max-classes-per-file */
/* eslint no-underscore-dangle: ["error", { "allow": ["_event", '_data'] }] */
/**
 * 系统模块的定义
 */

const CountlyEvents = {
  event: 'add_event',
  page: 'track_pageview',
};

// 事件对象
class TrackInterface {
  constructor({ id = undefined, event = undefined, data = undefined }) {
    // 全局唯一标识
    this.id = id;
    // 事件名称
    this._event = event;
    // 事件回调数据
    this._data = data;
  }

  // 获取当前的事件定义
  get event() {
    return this._event;
  }

  // 获取当前的事件数据
  get data() {
    return this._data;
  }

  // 获取序列化之后的data数据
  get encode() {
    if (this.data === undefined) {
      return {};
    }
    return JSON.stringify(this.data);
  }
}

// 菜单对象
class Event extends TrackInterface {
  constructor({ id, key, count = 1, sum = 1, dur = undefined, segmentation = {} }) {
    super({ id, event: CountlyEvents.event });

    // key - the name of the event (mandatory)
    this.key = key;
    // count - number of events (default: 1)
    this.count = count;
    // sum - sum to report with the event (optional)
    this.sum = sum;
    // dur - duration expressed in seconds, meant for reporting with the event (optional)
    this.dur = dur;
    // segmentation - an object with key/value pairs to report with the event as segments
    this.segmentation = segmentation;
  }

  get data() {
    const data = {
      key: this.key,
      count: this.count,
    };
    if (this.sum) {
      data.sum = this.sum;
    }
    if (this.dur) {
      data.dur = this.dur;
    }
    if (this.segmentation) {
      data.segmentation = this.segmentation;
    }
    return data;
  }
}

// 页面
class Page extends TrackInterface {
  constructor({ id, path }) {
    super({ id, event: CountlyEvents.page });
    // 路径
    this.path = path;
    // 名称
    this.name = '';
  }

  get data() {
    return {
      name: this.name,
      path: this.path,
    };
  }
}

export { Event, Page };
