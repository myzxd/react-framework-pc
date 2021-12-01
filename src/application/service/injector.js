/**
 * 注入脚本服务
 */
/* eslint no-underscore-dangle: ["error", { "allow": ["_list"] }] */
/* eslint max-classes-per-file: ["error", 2] */

import { options } from "less";

/* global document */
class Script extends Object {
  constructor({ id = 'inject', src, callback = () => { } , options ={ }}) {
    super();
    this.id = id;               // 注入元素id
    this.src = src;             // 脚本地址
    this.callback = callback;   // 加载脚本后的回调
    this.options = options;     // 额外参数
  }
}

class InjectService extends Object {
  constructor() {
    super();
    this._list = [];  // 脚本清单
  }

  // 获取当前注入的所有脚本信息
  get scripts() {
    return this._list;
  }

  // 是否注入成功
  isInjected = (id) => (!!document.getElementById(id))

  /**
   * 注入脚本到页面服务
   */
  inject = (script) => {
    // 判断元素是否存在，不存在则直接报错
    if (!script.id) {
      console.log('element id not existy, injected failure');
    }

    // 判断脚本配置是否存在, 不存在则直接退出
    if (!script.src) {
      console.log('script not existy, injected failure');
      return;
    }

    // 判断如果已经注入脚本，则直接调用回调
    if (this.isInjected(script.id) && script.callback) {
      script.callback();
      return;
    }

    // 注入脚本
    const dom = document.createElement('script');
    dom.id = script.id;
    dom.src = script.src;
    if (script.options) {
      Object.keys(script.options).forEach((key)=>{
        dom.setAttribute(key, script.options[key]);
      })
    }
    document.body.appendChild(dom);
    dom.onload = () => {
      // 脚本加载后的回调
      if (script.callback) {
        script.callback();
      }
      // console.log(`script ${script.id} onload `);
    };

    // 添加脚本信息到当前数据中，记录注入脚本数量（TODO: 预留给脚本注入管理）
    this._list.push(script);
    // console.log(`script ${script.id} injected `);
  }
}

InjectService.Script = Script;

export default InjectService;
