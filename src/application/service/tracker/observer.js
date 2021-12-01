/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/**
 * dom监听服务
 */
import dot from 'dot-prop';
import is from 'is_js';

class DomObserver {
  constructor() {
    this.hooks = {};
  }

  // 将json字符串转json对象
  _toJSON = (str) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return str;
    }
  }

  // 将url格式字符串转json对象
  _URLtoJSON = (url) => {
    const query = {};
    // url为空
    if (!url) {
      return query;
    }
    const pairs = url.split('&');
    for (let i = 0; i < pairs.length; i += 1) {
      const pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
  }

  // 获取事件监听器方法
  register = (id, hook = () => { }) => {
    // 判断是否已经有相同的钩子函数，如果有则不注册
    if (dot.has(this.hooks, id) === false) {
      this.hooks[id] = hook;
    }

    /**
     * 监听 ie 事件
     * 添加监听 attachEvent
     * 移除监听 detachEvent
     */
    if (!window.addEventListener) {
      // 监听事件
      document.body.attachEvent('onclick', (event) => { this.domFilter(event); }, false);
      return;
    }

    /**
     * 监听 chrome 事件
     * 添加监听 addEventListener
     * 移除监听 removeEventListener
     */
    document.body.addEventListener('click', (event) => { this.domFilter(event); }, false);
  }

  domFilter = (event = {}) => {
    if (is.empty(event)) {
      return onCallback(undefined);
    }
    // 获取当前dom节点
    const current = event.target;
    // 获取父级元素
    const parent = current.parentNode;

    const attribute = '_event';
    // 拓展属性 segmentation
    const attributeExtra = '_extra';
    // 获取判断属性
    const attrArray = attribute.split('=');

    // DOM元素是否合格
    let dom;
    let props;
    let segmentation;
    if (attrArray.length === 1) {
      // 赋值属性
      props = current.getAttribute(attrArray[0]) || parent.getAttribute(attrArray[0]);
      segmentation = current.getAttribute(attributeExtra) || parent.getAttribute(attributeExtra);
      if (props) {
        // 赋值DOM 如果当前元素有就取当前元素 否 取父级元素
        dom = current.getAttribute(attrArray[0]) ? current : parent;
      }
    } else {
      // 查找是否包含属性
      const currentAttr = current.getAttribute(attrArray[0]) || '';
      const parentAttr = parent.getAttribute(attrArray[0]) || '';
      props = currentAttr.indexOf(attrArray[1]) !== -1 || parentAttr.indexOf(attrArray[1]) !== -1;
      if (props) {
        // 赋值DOM 如果当前元素有就取当前元素 否 取父级元素
        dom = currentAttr.indexOf(attrArray[1]) !== -1 ? current : parent;
      }
    }
    // 调用回调
    if (dom) {
      this.notify({
        ...this._toJSON(props),
        segmentation: this._URLtoJSON(segmentation),
      });
    }
  }

  // 订阅分发
  notify = (value) => {
    // 判断是否有回调函数，为空则直接返回
    if (is.not.existy(this.hooks) || is.empty(this.hooks)) {
      return;
    }
    const { hooks = {} } = this;
    // 执行回调
    const keys = Object.keys(hooks);
    if (is.not.existy(keys) || is.empty(keys)) {
      return;
    }
    keys.forEach((key) => {
      const func = this.hooks[key];
      if (func) {
        func(value);
      }
    });
  }

  debug = () => {
  }
}

// 导出
export default DomObserver;
