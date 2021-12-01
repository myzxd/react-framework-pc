const aoaoBossTools = {

  // 判断是否是数组
  isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  },

  /**
   * 提取数据源为数组中object元素中某个key及value
   * @params data {array} 数据源
   * @params key {string} 键
   * @return array {array} 新的数组
   */
  getArrayFormObject(data, key) {
    const array = [];
    try {
      if (Array.isArray(data) && key !== undefined) {
        for (let i = 0; i < data.length; i += 1) {
          if (data[i] && data[i][key] !== undefined) {
            array.push(data[i][key]);
          }
        }
        return array;
      } else {
        // return new Error('type not found');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
    }
  },

  /**
   * 骑士付款方式转换
   * @params way {string} 骑士付款方式
   * @param data {object} 骑士信息
   * @return price {string} 骑士付款金额
   */
  knightPaywayToPrice(way, data) {
    try {
      const ways = way;
      // 合并对象，过滤掉nan或undefined
      const dataValue = Object.assign({}, data);
      // console.log('DEBUG:' + ways, typeof ways, dataValue);
      let price = '';
      switch (ways) {
        case 301:
          price = dataValue.purchase_price;
          break;
        case 302:
          price = dataValue.monthly_fee;
          // console.log('DEBUG:' + dataValue.monthly_fee);
          break;
        case 303:
          price = dataValue.deposit;
          break;
        default:
          throw new Error('typeError');
      }
      return price;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
    }
  },
  /**
   * 解决window.open 浏览器阻止弹窗的问题
   *
   */
  popUpCompatible(url, query) {
    try {
      const a = window.document.createElement('a');
      if (query) {
        a.setAttribute('href', `${url}/?${query}`);
      } else {
        a.setAttribute('href', `${url}`);
      }

      a.setAttribute('target', '_blank');
      a.setAttribute('id', url);
      // 防止反复添加
      if (!window.document.getElementById(url)) window.document.body.appendChild(a);
      a.click();
    } catch (e) {
      console.error(e.message);
    }
  },
};

export default aoaoBossTools;
