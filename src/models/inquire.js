/**
 * 大查询 model
 *
 * @module model/inquireModel
 */

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'inquireModel',
  /**
   * 状态树
   * @prop {array} averageList 平均列表
   * @prop {array} totalList 总量列表
   * @prop {array} dateData 日均统计
   * @prop {array} totalData 总数统计
   * @prop {array} orderDate 单均统计
   * @prop {array} knight 骑士列表
   * @prop {number} count 数据总数
   * @prop {array} tabelHeader TODO: 注释：表头
   * @prop {array} billInfo 账单信息
   * @prop {array} districtLevelData 商圈等级&商圈数据
   */
  state: {
    // 平均列表
    averageList: [],
    // 总量列表
    totalList: [],
    // 日均统计
    dateData: [],
    // 总数统计
    totalData: [],
    // 单均统计
    orderDate: [],
    // 骑士列表
    knight: [],
    // 数据总数
    count: 0,
    // TODO: 注释：表头
    tabelHeader: [],
    // 账单信息
    billInfo: [],
    // 商圈等级&商圈数据
    districtLevelData: [],
  },

  /**
   * @namespace inquireModel/effects
   */
  effects: {

  },

  /**
   * @namespace inquireModel/reducers
   */
  reducers: {
    /**
     * 骑士列表
     * @returns {array} 更新 knight
     * @memberof module:model/inquireModel~inquireModel/reducers
     */
    // TODO: @韩健 命名有问题
    getKnightOfDistrictListR(state, action) {
      return { ...state, knight: action.payload };
    },

    /**
     * search列表
     * @returns {number} 更新 count
     * @returns {array} 更新 averageList
     * @returns {array} 更新 totalList
     * @returns {array} 更新 dateData
     * @returns {array} 更新 orderData
     * @returns {array} 更新 totalData
     * @returns {array} 更新 tabelHeader
     * @memberof module:model/inquireModel~inquireModel/reducers
     */
    // TODO: @韩健 命名有问题
    getSearchListR(state, action) {
      return {
        ...state,
        count: action.payload.count,  // 数据总数
        averageList: action.payload.table_data_list_1,  // 平均列表
        totalList: action.payload.table_data_list_2,    // 总量列表
        dateData: action.payload.data_avg_field,         // 日均统计
        orderData: action.payload.order_avg_field,       // 单均统计
        totalData: action.payload.total_avg_field,       // 总量统计
        tabelHeader: action.payload.table_head,         // 表头
      };
    },

    /** 清空列表
     * @returns {number} 更新 count
     * @returns {array} 更新 averageList
     * @returns {array} 更新 totalList
     * @returns {array} 更新 dateData
     * @returns {array} 更新 orderData
     * @returns {array} 更新 totalData
     * @returns {array} 更新 tabelHeader
     * @memberof module:model/inquireModel~inquireModel/reducers
     */
    // TODO: @韩健 命名有问题
    resetSearchListR(state) {
      return {
        ...state,
        count: 0,  // 数据总数
        averageList: [],  // 平均列表
        totalList: [],    // 总量列表
        dateData: [],         // 日均统计
        orderData: [],       // 单均统计
        totalData: [],       // 总量统计
        tabelHeader: [],         // 表头
      };
    },

    /** 获取账单信息
     * @returns {array} 更新 billInfo
     * @memberof module:model/inquireModel~inquireModel/reducers
     */
    // TODO: 注释
    // TODO: @韩健 命名有问题
    getBillInfoR(state, action) {
      return { ...state, billInfo: action.payload };
    },
  },
};
