/**
 * 工号管理相关model
 * @module model/employee/transport
 **/
import is from 'is_js';
import moment from 'moment';
import { message } from 'antd';

import { fetchTransportData, updateTransportKnight, fetchTransportRecords, createTransportRecord, updateTransportRecord, fetchTransportKnights } from '../../services/employee';

import { authorize } from '../../application';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'employeeTransport',
  /**
   * 状态树
   * @prop {object} transportData     运力工号数据列表
   * @prop {boolean} transportRecords 运力工号详情记录
   * @prop {boolean} transportKnights 运力工号骑士
   */
  state: {
    transportData: {},      // 运力工号数据列表
    transportRecords: {},   // 运力工号详情记录
    transportKnights: {},   // 运力工号骑士
  },
 /**
   * @namespace employee/transport/effects
   */
  effects: {
    /**
     * 获取运力工号
     * @param {number}  limit 总条数
     * @param {number}  page  页数
     * @param {array}   suppliers  供应商
     * @param {array}   platforms  平台
     * @param {array}   city    城市
     * @param {array}   districts  商圈
     * @param {number}  state 状态
     * @param {string}  name  姓名
     * @param {string}  phone  手机号
     * @param {string}  positions  职位
     * @param {number} type 工号种类
     * @memberof module:model/employee/transport~employee/transport/effects
     */
    *fetchTransportData({ payload = {} }, { call, put }) {
      // 默认参数
      const params = {
        account_id: authorize.account.id,
        limit: 30,
        page: 1,
      };
      // 供应商
      if (is.existy(payload.suppliers) && is.not.empty(payload.suppliers)) {
        params.supplier_list = payload.suppliers;
      }
      // 条数限制
      if (is.existy(payload.limit) && is.not.empty(payload.limit)) {
        params.limit = payload.limit;
      }
      // 分页
      if (is.existy(payload.page) && is.not.empty(payload.page)) {
        params.page = payload.page;
      }
      // 姓名
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }
      // 手机号
      if (is.existy(payload.phone) && is.not.empty(payload.phone)) {
        params.phone = payload.phone;
      }
      // 职位
      if (is.existy(payload.positions) && is.not.empty(payload.positions) && is.array(payload.positions)) {
        const positions = payload.positions.map(item => Number(item));
        params.position_id_list = positions;
      }
      // 平台
      if (is.existy(payload.platforms) && is.not.empty(payload.platforms) && is.array(payload.platforms)) {
        params.platform_code_list = payload.platforms;
      }
      // 城市
      if (is.existy(payload.cities) && is.not.empty(payload.cities) && is.array(payload.cities)) {
        params.city_spelling_list = payload.cities;
      }
      // 商圈
      if (is.existy(payload.districts) && is.not.empty(payload.districts) && is.array(payload.districts)) {
        params.biz_district_id_list = payload.districts;
      }
      // 运力状态
      if (is.existy(payload.state) && is.not.empty(payload.state) && is.array(payload.state)) {
        const state = payload.state.map(item => Number(item));
        params.transport_state_list = state;
      }
      // 工号种类
      if (is.existy(payload.type) && is.not.empty(payload.type) && is.array(payload.type)) {
        const type = payload.type.map(item => Number(item));
        params.transport_type_list = type;
      }

      // 请求服务器
      const result = yield call(fetchTransportData, params);

      // 判断数据是否为空
      if (is.existy(result)) {
        yield put({ type: 'reducetransportData', payload: result });
      }
    },
    /**
     * 获取运力工号详情
     * @param {number}  limit 总条数
     * @param {number}  page  页数
     * @param {array}   suppliers  供应商
     * @param {array}   platforms  平台
     * @param {array}   cities    城市
     * @param {array}   districts  商圈
     * @param {string}  name   姓名
     * @param {string}  phone  手机号
     * @param {string}  date  所属日期
     * @memberof module:model/employee/transport~employee/transport/effects
     */
    // TODO: @韩健 后缀命名有问题
    *fetchTransportRecords({ payload = {} }, { call, put }) {
      if (is.not.existy(payload.recordId) || is.empty(payload.recordId)) {
        return message.error('查询的数据id不能为空');
      }
      // 默认参数
      const params = {
        account_id: authorize.account.id,
        transport_staff_id: payload.recordId,
        limit: 30,
        page: 1,
      };
      // 条数限制
      if (is.existy(payload.limit) && is.not.empty(payload.limit)) {
        params.limit = payload.limit;
      }
      // 分页
      if (is.existy(payload.page) && is.not.empty(payload.page)) {
        params.page = payload.page;
      }
      // 姓名
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }
      // 手机号
      if (is.existy(payload.phone) && is.not.empty(payload.phone)) {
        params.phone = payload.phone;
      }
      // 平台
      if (is.existy(payload.platforms) && is.not.empty(payload.platforms) && is.array(payload.platforms)) {
        params.platform_code_list = payload.platforms;
      }
      // 城市
      if (is.existy(payload.cities) && is.not.empty(payload.cities) && is.array(payload.cities)) {
        params.city_spelling_list = payload.cities;
      }
      // 商圈
      if (is.existy(payload.districts) && is.not.empty(payload.districts) && is.array(payload.districts)) {
        params.biz_district_list = payload.districts;
      }
      // 所属日期
      if (is.existy(payload.date) && is.not.empty(payload.date) && is.array(payload.date)) {
        const startDate = payload.date[0] ? moment(payload.date[0]).format('YYYY-MM-DD') : '';
        const endDate = payload.date[1] ? moment(payload.date[1]).format('YYYY-MM-DD') : '';
        params.ascription_date = `${startDate}~${endDate}`;
      }

      // 请求服务器
      const result = yield call(fetchTransportRecords, params);

      // 判断数据是否为空
      if (is.existy(result)) {
        yield put({ type: 'reduceTransportDetail', payload: result });
      }
    },

    /**
     * 创建运力工号数据
     * @param {array}   supplier  供应商
     * @param {array}   platform  平台
     * @param {array}   city     城市
     * @param {array}   district  商圈
     * @param {string}  name   姓名
     * @param {string}  phone  手机号
     * @param {string}  date   日期
     * @param {string}  recordId  运力工号人员id
     * @param {string}  transportId  替跑工号人员id
     * @param {string}  transportType 运力类型
     * @memberof module:model/employee/transport~employee/transport/effects
     */
    // TODO: @韩健 后缀命名有问题
    *createTransportRecord({ payload = {} }, { call }) {
      if (is.not.existy(payload.recordId) || is.empty(payload.recordId)) {
        return message.error('运力工号人员id不能为空');
      }
      if (is.not.existy(payload.transportId) || is.empty(payload.transportId)) {
        return message.error('替跑工号人员id不能为空');
      }
      if (is.not.existy(payload.name) || is.empty(payload.name)) {
        return message.error('姓名不能为空');
      }
      if (is.not.existy(payload.phone) || is.empty(payload.phone)) {
        return message.error('手机号不能为空');
      }
      if (is.not.existy(payload.platform) || is.empty(payload.platform)) {
        return message.error('平台不能为空');
      }
      if (is.not.existy(payload.supplier) || is.empty(payload.supplier)) {
        return message.error('供应商不能为空');
      }
      if (is.not.existy(payload.city) || is.empty(payload.city)) {
        return message.error('城市不能为空');
      }
      if (is.not.existy(payload.district) || is.empty(payload.district)) {
        return message.error('区域不能为空');
      }
      if (is.not.existy(payload.date) || is.empty(payload.date)) {
        return message.error('日期不能为空');
      }
      if (is.not.existy(payload.transportType) || is.empty(payload.transportType)) {
        return message.error('运力类型不能为空');
      }

      const params = {
        account_id: authorize.account.id,
        transport_staff_id: payload.recordId,
        actual_transport_staff_id: payload.transportId,
        name: payload.name,
        phone: payload.phone,
        platform_code: payload.platform,
        city_spelling: payload.city,
        biz_district_id: payload.district,
        transport_type: payload.transportType,  // 运力类型
      };

      // 日期
      const startDate = payload.date[0] ? moment(payload.date[0]).format('YYYY-MM-DD') : '';
      const endDate = payload.date[1] ? moment(payload.date[1]).format('YYYY-MM-DD') : '';
      params.ascription_date = `${startDate}~${endDate}`;

      // 请求服务器
      const result = yield call(createTransportRecord, params);
      if (result.ok) {
        message.success('操作成功');
        // 回调函数
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
      }
    },

    /**
     * 更新运力工号数据
     * @param {string}  recordId  运力工号人员id
     * @param {string}  transportId  替跑工号人员id
     * @param {boolean} isDelete     是否删除
     * @param {string}  date         日期
     * @memberof module:model/employee/transport~employee/transport/effects
     */
    // TODO: @韩健 后缀命名有问题
    *updateTransportRecord({ payload = {} }, { call }) {
      if (is.not.existy(payload.recordId) || is.empty(payload.recordId)) {
        return message.error('记录id不能为空');
      }
      if (is.not.existy(payload.transportId) || is.empty(payload.transportId)) {
        return message.error('替跑工号人员id不能为空');
      }
      const params = {
        account_id: authorize.account.id,
        transport_staff_id: payload.transportId,
        _id: payload.recordId,
      };

      // 日期
      if (is.existy(payload.date) && is.not.empty(payload.date)) {
        const startDate = payload.date[0] ? moment(payload.date[0]).format('YYYY-MM-DD') : '';
        const endDate = payload.date[1] ? moment(payload.date[1]).format('YYYY-MM-DD') : '';
        params.ascription_date = `${startDate}~${endDate}`;
      }

      // 是否删除
      if (is.existy(payload.isDelete) && is.not.empty(payload.isDelete) && is.truthy(payload.isDelete)) {
        params.is_delete = true;
      }

      // 请求服务器
      const result = yield call(updateTransportRecord, params);
      if (result.ok) {
        message.success('操作成功');
        // 回调函数
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
      } else {
        message.error('操作失败');
      }
    },
    /**
     * 删除运力工号数据
     * @param {string}  recordId  运力工号人员id
     * @param {string}  transportId  替跑工号人员id
     * @param {boolean} isDelete     判断详情
     * @param {function} onSuccessCallback     成功回调
     * @memberof module:model/employee/transport~employee/transport/effects
     */
    // TODO: @韩健 后缀命名有问题
    *deleteTransportRecord({ payload = {} }, { put }) {
      const params = {
        recordId: payload.recordId,
        transportId: payload.transportId,
        isDelete: true,
        onSuccessCallback: payload.onSuccessCallback,
      };
      yield put({ type: 'updateTransportRecord', payload: params });
    },
    /**
     * 获取运力工号相关的骑士数据
     * @param {number}  authorize.account.id  账户id
     * @param {array}   platform  平台
     * @param {array}   city     城市
     * @param {string}  name   姓名
     * @param {string}  phone  手机号
     * @param {string}  date   所属日期
     * @memberof module:model/employee/transport~employee/transport/effects
     */
    *fetchTransportKnights({ payload = {} }, { call, put }) {
      // 默认参数
      const params = {
        account_id: authorize.account.id,
      };
      // 姓名
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }
      // 手机号
      if (is.existy(payload.phone) && is.not.empty(payload.phone)) {
        params.phone = payload.phone;
      }
      // 平台
      if (is.existy(payload.platform) && is.not.empty(payload.platform)) {
        params.platform_code = payload.platform;
      }
      // 城市
      if (is.existy(payload.city) && is.not.empty(payload.city)) {
        params.city_spelling = payload.city;
      }
      // 所属日期
      if (is.existy(payload.date) && is.not.empty(payload.date) && is.array(payload.date)) {
        const startDate = payload.date[0] ? moment(payload.date[0]).format('YYYY-MM-DD') : '';
        const endDate = payload.date[1] ? moment(payload.date[1]).format('YYYY-MM-DD') : '';
        params.ascription_date = `${startDate}~${endDate}`;
      }

      // 请求服务器
      const result = yield call(fetchTransportKnights, params);

      // 判断数据是否为空
      if (is.existy(result)) {
        yield put({ type: 'reducetransportKnights', payload: result });
      }
    },
    /**
     * 重置数据
     * @todo 接口需升级优化
     * @memberof module:model/employee/transport~employee/transport/effects
     */
    *resetTransportKnights({ payload = {} }, { put }) {
      yield put({ type: 'reducetransportKnights', payload: {} });
    },

    /**
     * 停用或启用，运力工号
     * @param {number}  authorize.account.id  账户id
     * @param {string}  id    运力id
     * @memberof module:model/employee/transport~employee/transport/effects
     */
    *updateTransportKnight({ payload = {} }, { call }) {
      if (is.not.existy(payload.id) || is.empty(payload.id)) {
        return message.error('操作的数据id不能为空');
      }
      // 默认参数
      const params = {
        account_id: authorize.account.id,
        staff_id: payload.id,
      };

      // 请求服务器
      const result = yield call(updateTransportKnight, params);
      if (result.ok) {
        message.success('操作成功');
        // 回调函数
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
      }
    },
  },
 /**
   * @namespace employee/transport/reducers
   */
  reducers: {
    /**
     * 运力工号数据列表
     * @returns {object} 更新 transportData
     * @memberof module:model/employee/transport~employee/transport/reducers
     */
    reducetransportData(state, action) {
      return { ...state, transportData: action.payload };
    },
    /**
     * 运力工号详情记录
     * @returns {object} 更新 transportRecords
     * @memberof module:model/employee/transport~employee/transport/reducers
     */
    reduceTransportDetail(state, action) {
      return { ...state, transportRecords: action.payload };
    },
    /**
     * 运力工号骑士
     * @returns {object} 更新 transportKnights
     * @memberof module:model/employee/transport~employee/transport/reducers
     */
    reducetransportKnights(state, action) {
      return { ...state, transportKnights: action.payload };
    },
  },
};
