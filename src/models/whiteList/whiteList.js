/**
 * 白名单 model
 *
 * @module model/whiteList/whiteList
 */
import is from 'is_js';
import { message } from 'antd';
import { fetchWhiteListData, fetchWhiteListClosePermission, fetchWhiteListCreate, fetchWhiteListDetail, updateWhiteList } from '../../services/whiteList/whiteList';
import { RequestMeta } from '../../application/object/index';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'whiteList',
  /**
   * 状态树
   * @prop {boolean} isOpen 是否可以开启白名单
   * @prop {object} boduRegisterData 委托个户注册列表
   * @prop {object} salaryLoanData 服务费预支权限设置列表
   */
  state: {
    whiteListData: {},
    detailData: {},
  },
  /**
   * @namespace enterprise/whiteList/effects
   */
  effects: {
    /**
     * 白名单列表
     * @param {array} platforms 平台
     * @param {array} suppliers 供应商
     * @param {array} cities 城市
     * @param {array} districts 商圈
     */
    * fetchWhiteListList({ payload = {} }, { call, put }) {
      // 请求列表的meta信息
      const params = {
        type: payload.type,
        _meta: RequestMeta.mapper(payload),
      };
      // 获取平台
      if (is.not.empty(payload.platforms) && is.existy(payload.platforms)) {
        params.platform_codes = payload.platforms;
      }
      // 获取商圈
      if (is.not.empty(payload.districts) && is.existy(payload.districts)) {
        params.biz_district_ids = payload.districts;
      }
       // 获取供应商
      if (is.not.empty(payload.suppliers) && is.existy(payload.suppliers)) {
        params.supplier_ids = payload.suppliers;
      }
      // 获取城市
      if (is.not.empty(payload.cities) && is.existy(payload.cities)) {
        params.city_codes = payload.cities;
      }
       // 获类型
      if (is.not.empty(payload.type) && is.existy(payload.type)) {
        params.type = payload.type;
      }
      // 判断是新增页面发来的请求
      if (payload.whiteAdd) {
        params._meta.limit = 99999;
      }
      const result = yield call(fetchWhiteListData, params);
      if (result === undefined) {
        return;
      }
      yield put({ type: 'reduceWhiteListList', payload: result });
    },
    /**
     * 关闭白名单数据
     * @param {array} id 白名单id
     */
    * fetchWhiteListClosePer({ payload }, { call }) {
      const {
        id,
      } = payload;
      const params = {};
      // id
      if (is.not.empty(id) && is.existy(id)) {
        params.id = id;
      }
      yield call(fetchWhiteListClosePermission, params);
    },
    /**
     * 白名单详情页
     * @param {string} id 关闭服务费预支范围id
     */
    * fetchWhiteListDetail({ payload }, { call, put }) {
      const {
        id,
      } = payload;
      const params = {};
      // id
      if (is.not.empty(id) && is.existy(id)) {
        params.id = id;
      }

      const result = yield call(fetchWhiteListDetail, params);
      if (is.not.empty(result)) {
        yield put({ type: 'reduceWhiteListDetail', payload: result });
      }
    },
    /**
     * 新增白名单权限设置
     * @param {string} platform 平台
     * @param {string} supplier 供应商
     * @param {string} city 城市
     * @param {array} districtsArray 商圈
     * @param {number} domain 级别
     * @param {string} addressBook 通讯录
     * @param {boolean} isNeedAudit 是否是管理审核
     * @param {boolean} isTeam 是否加入团
     * @param {boolean} isShowInfor 是否是各户信息
     * @param {array}  chat  发起聊天
     * @param {array} workBench 工作台信息
     *
     * @param {number} terminal 应用终端类型
     * @param {boolean} addressBook 显示通讯录
     * @param {array} chat 单聊
     * @param {boolean} isNeedAudit  管理员审核
     * @param {boolean} isTeam  加入团队
     * @param {boolean} isShowInfor 展示个人信息
     * @param {array} workBench 工作台信息
     *
     */
    * fetchWhiteListCreate({ payload = {} }, { call }) {
      const params = {
        domain: payload.allSelectorLevel,
      };
      // domain级别为1,是平台级别，只传平台，2为城市是全部，只传递平台和供应商，3为商圈全部，只传平台供应商与城市
      switch (params.domain) {
        case 2:
          // 供应商
          if (is.not.empty(payload.supplier) && is.existy(payload.supplier)) {
            params.supplier_id = payload.supplier;
          }
          break;
        case 3:
          // 供应商
          if (is.not.empty(payload.supplier) && is.existy(payload.supplier)) {
            params.supplier_id = payload.supplier;
          }
          // 城市
          if (is.not.empty(payload.city) && is.existy(payload.city)) {
            params.city_codes = payload.city;
          }
          break;
        case 4:
          // 供应商
          if (is.not.empty(payload.supplier) && is.existy(payload.supplier)) {
            params.supplier_id = payload.supplier;
          }
          // 城市
          if (is.not.empty(payload.city) && is.existy(payload.city)) {
            params.city_codes = payload.city;
          }
          // 商圈
          if (is.not.empty(payload.districtsArray) && is.existy(payload.districtsArray)) {
            params.biz_district_ids = payload.districtsArray;
          }
          break;
        default:
          break;
      }
      // 平台
      if (is.not.empty(payload.platform) && is.existy(payload.platform)) {
        params.platform_code = payload.platform;
      }
      // 终端
      if (is.not.empty(payload.terminal) && is.existy(payload.terminal)) {
        params.app_code = payload.terminal;
      }
      // 通讯录信息
      if (is.not.empty(payload.addressBook) && is.existy(payload.addressBook)) {
        params.address_book_show = payload.addressBook;
      }
      // 审核状态
      if (is.not.empty(payload.isNeedAudit) && is.existy(payload.isNeedAudit)) {
        params.qrcode_apply_check = payload.isNeedAudit;
      }
      // 个户身份状态
      if (is.not.empty(payload.isTeam) && is.existy(payload.isTeam)) {
        params.individual_register_required = payload.isTeam;
      }
       // 工作档案状态
      if (is.not.empty(payload.isShowInfor) && is.existy(payload.isShowInfor)) {
        params.individual_show_in_work_profile = payload.isShowInfor;
      }
      // 工作台信息
      if (is.not.empty(payload.workBench) && is.existy(payload.workBench)) {
        params.workbench_label = payload.workBench;
      }
      // 个体工商户注册
      if (is.not.empty(payload.serviceProviders) && is.existy(payload.serviceProviders)) {
        params.individual_source = payload.serviceProviders;
      }
        // 获类型
      if (is.not.empty(payload.type) && is.existy(payload.type)) {
        params.type = payload.type;
      }
      const result = yield call(fetchWhiteListCreate, params);
      if (result.ok) {
        message.success('新增成功！');
      }
      if (result.zh_message) {
        message.error(result.zh_message);
      }
    },

     /**
     * 编辑白名单
     * @param {string} addressBook 通讯录
     * @param {boolean} isNeedAudit 是否是管理审核
     * @param {boolean} isTeam 是否加入团
     * @param {boolean} isShowInfor 是否是各户信息
     * @param {array}  chat  发起聊天
     * @param {array} workBench 工作台信息
     *
     */
    * updateWhiteList({ payload = {} }, { call }) {
      // 请求参数
      const params = {};
      // id
      if (is.not.empty(payload.params.id) && is.existy(payload.params.id)) {
        params.id = payload.params.id;
      }
      // 通讯录信息
      if (is.not.empty(payload.params.addressBook) && is.existy(payload.params.addressBook)) {
        params.address_book_show = payload.params.addressBook;
      }
      // 审核状态
      if (is.not.empty(payload.params.isNeedAudit) && is.existy(payload.params.isNeedAudit)) {
        params.qrcode_apply_check = payload.params.isNeedAudit;
      }
      // 个户身份状态
      if (is.not.empty(payload.params.isTeam) && is.existy(payload.params.isTeam)) {
        params.individual_register_required = payload.params.isTeam;
      }
      // 工作档案状态
      if (is.not.empty(payload.params.isShowInfor) && is.existy(payload.params.isShowInfor)) {
        params.individual_show_in_work_profile = payload.params.isShowInfor;
      }
      // 工作台信息
      if (is.not.empty(payload.params.workBench) && is.existy(payload.params.workBench)) {
        params.workbench_label = payload.params.workBench;
      }
      // 个体工商户注册
      if (is.not.empty(payload.params.serviceProviders) && is.existy(payload.params.serviceProviders)) {
        params.individual_source = payload.params.serviceProviders;
      }
      const result = yield call(updateWhiteList, params);
      if (result.ok) {
        message.success('编辑成功！');
      }
      if (result.zh_message) {
        message.error(result.zh_message);
      }
    },
  },
  /**
   * @namespace enterprise/whiteList/reducers
   */
  reducers: {
    /**
     * 获取白名单数据
     * @returns {object} 更新 boduRegisterData
     * @memberof module:model/whiteList/type~whiteList/type/reducers
     */
    reduceWhiteListList(state, action) {
      const whiteListData = action.payload;
      return { ...state, whiteListData };
    },
    /**
     * 白名单详情页
     */
    reduceWhiteListDetail(state, action) {
      const detailData = action.payload;
      return { ...state, detailData };
    },
  },
};
