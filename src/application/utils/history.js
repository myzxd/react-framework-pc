import { parse, stringify } from 'qs';
import { createHashHistory } from 'history';


export class Location {
  constructor(location) {
    this.privateLocation = location;
    this.privateCachedQuery = {};
    this.privatePrevsearch = '';
    this.query = this.query();
  }
  // 和dot-prop的Object.prototype.propertyIsEnumerable 相冲突，后期需要改
  query() {
    if (this.privatePrevsearch !== this.privateLocation.search) {
      this.privateCachedQuery = parse(this.privateLocation.search.substr(1), { ignoreQueryPrefix: true });
    }
    return this.privateCachedQuery;
  }
  get pathname() {
    return this.privateLocation.pathname;
  }
  get search() {
    return this.privateLocation.search;
  }
  get state() {
    return this.privateLocation.state;
  }
  get hash() {
    return this.privateLocation.hash;
  }
  get key() {
    return this.privateLocation.key;
  }
}

export class History {
  constructor(props) {
    this.privateHistory = createHashHistory(props);
  }
  get length() {
    return this.privateHistory.length;
  }

  get action() {
    return this.privateHistory.action;
  }

  get location() {
    return new Location(this.privateHistory.location);
  }

  push(aParam, b) {
    const a = aParam;
    if (typeof a === 'string') {
      return this.privateHistory.push(a, b);
    }
    if (a.query !== undefined) {
      a.search = stringify(a.query, { addQueryPrefix: true });
    }
    return this.privateHistory.push(a);
  }

  replace(aParam, b) {
    const a = aParam;
    if (typeof a === 'string') {
      return this.privateHistory.replace(a, b);
    }
    if (a.query !== undefined) {
      a.search = stringify(a.query, { addQueryPrefix: true });
    }
    return this.privateHistory.replace(a);
  }

  go(n) {
    return this.privateHistory.go(n);
  }

  goBack() {
    return this.privateHistory.goBack();
  }
  goForward() {
    return this.privateHistory.goForward();
  }
  block(prompt) {
    return this.privateHistory.block(prompt);
  }

  listen(listener) {
    return this.privateHistory.listen(listener);
  }

  createHref(location) {
    return this.privateHistory.createHref(location);
  }
}
