import is from 'is_js';
import CoreObject from './core';

// 请求列表数据使用的meta
class RequestMeta extends CoreObject {
  constructor() {
    super();
    this.page = 1;      // 第几页
    this.limit = 30;    // 每页条数
    this.sort = {};     // 排序方式 形式是 {field_name: 1 or -1) 1 正序 -1 倒叙 默认是 {_id:-1}
  }

  // 返回转换的数据
  static mapper(data = {}) {
    const { page, limit, sort } = data;
    const value = {};
    // 页码
    if (is.not.empty(page) && is.existy(page)) {
      value.page = page;
    } else {
      value.page = 1;
    }

    // 条数
    if (is.not.empty(limit) && is.existy(limit)) {
      value.limit = limit;
    } else {
      value.limit = 30;
    }

    // 默认设置数据，为空则穿null，mapper
    if (is.not.empty(sort) && is.existy(sort)) {
      value.sort = sort;
    } else {
      value.sort = null;
    }
    return CoreObject.mapper(value, RequestMeta, false);
  }

  // 数据映射
  static datamap() {
    return {
      page: 'page',
      limit: 'limit',
      sort: 'sort',
    };
  }
}

// 返回列表数据的meta
class ResponseMeta extends CoreObject {
  constructor() {
    super();
    this.hasMore = false; // 是否存在更多数据
    this.count = 0;       // 数据总条数
    this.page = 1; // page
    this.limit = 30; // limit
  }

  static mapper(value) {
    return CoreObject.mapper(value, ResponseMeta, false);
  }

  // 数据映射
  static datamap() {
    return {
      has_more: 'hasMore',
      result_count: 'count',
      page: 'page',
      page_size: 'limit',
    };
  }
}

// 上一版 module.exports
export {
  RequestMeta,    // 请求列表数据使用的meta
  ResponseMeta,   // 返回列表数据的meta
};
