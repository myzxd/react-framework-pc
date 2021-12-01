/**
 * 人员合同相关model
 * @module model/employee/contract
 */
/* eslint no-underscore-dangle: ["error", { "allow": ["_meta", "_id"] }]*/
import is from 'is_js';
import { message } from 'antd';

import {
  fetchEmployeeContractData, // 获取人员合同列表
  fetchEmployeeContractDetail, // 获取人员合同详情
} from '../../services/employee';

export default {

  /**
   * 命名空间
   * @default
   */
  namespace: 'employeeContract',

  /**
   * 状态树
   * @prop {object} employeeContractData 人员合同列表信息
   * @prop {object} employeeContractDetail 人员合同详情信息
   */
  state: {
    employeeContractData: {},           // 人员列表信息
    employeeContractDetail: {},         // 人员详情信息
  },

  /**
   * @namespace employee/contract/effects
   */
  effects: {
    /**
     * 获取人员合同列表
     * @param {array} platforms 平台
     * @param {array} suppliers 供应商
     * @param {array} cities 城市
     * @param {array} districts 商圈
     * @param {array} contracts 合同归属
     * @param {string} name 姓名
     * @param {string} phone 手机号
     * @param {string} platformId 第三方平台个户ID
     * @param {number} page 页码
     * @param {number} limit 每页数量
     * @memberof module:model/employee/contract~employee/contract/effects
     */
    *fetchEmployeeContractData({ payload }, { call, put }) {
      const {
        platforms, // 平台
        suppliers, // 供应商
        cities, // 城市
        districts, // 商圈
        contracts, // 联系人
        name, // 姓名
        phone, // 手机号
        platformId, // 平台ID
        page, // 页码
        limit, // 每页条数
      } = payload;
      const params = {
        _meta: {
          page: 1, // 第一页
          limit: 30, // 每页30条
        },
      };

      // 平台
      if (is.not.empty(platforms)) {
        if (is.array(platforms)) {
          params.platforms = platforms;
        } else if (is.string(platforms)) {
          params.platforms = [platforms];
        }
      }

      // 供应商
      if (is.not.empty(suppliers)) {
        if (is.array(suppliers)) {
          params.suppliers = suppliers;
        } else if (is.string(suppliers)) {
          params.suppliers = [suppliers];
        }
      }

      // 城市
      if (is.not.empty(cities)) {
        if (is.array(cities)) {
          params.cities = cities;
        } else if (is.string(cities)) {
          params.cities = [cities];
        }
      }

      // 商圈
      if (is.not.empty(districts)) {
        if (is.array(districts)) {
          params.districts = districts;
        } else if (is.string(districts)) {
          params.districts = [districts];
        }
      }

      // 联系人
      if (is.not.empty(contracts)) {
        if (is.array(contracts)) {
          params.contracts = contracts;
        } else if (is.string(contracts)) {
          params.contracts = [contracts];
        }
      }

      // 姓名
      if (is.not.empty(name) && is.string(name)) {
        params.name = name;
      }

      // 手机号
      if (is.not.empty(phone) && is.string(phone)) {
        params.phone = phone;
      }

      // 平台ID
      if (is.not.empty(platformId) && is.string(platformId)) {
        params.platformId = platformId;
      }

      // 页码
      if (is.existy(page) && is.number(page)) {
        params._meta.page = page;
      }

      // 每页条数
      if (is.existy(limit) && is.number(limit)) {
        params._meta.limit = limit;
      }

      // 请求接口
      const result = yield call(fetchEmployeeContractData, params);

      // 判断数据是否为空
      if (is.not.existy(result) || is.empty(result)) {
        return message('获取人员合同列表失败');
      }

      yield put({
        type: 'reduceEmployeeContractData',
        payload: result,
      });
    },
    /**
     * 获取人员合同列表
     * @param {string} id 合同ID
     * @memberof module:model/employee/contract~employee/contract/effects
     */
    *fetchEmployeeContractDetail({ payload }, { call, put }) {
      // 合同id
      const { id } = payload;
      const params = {};

      // 合同id
      if (is.not.empty(id) && is.string(id)) {
        params.id = id;
      } else {
        return message.error('合同ID错误');
      }

      // 请求接口
      const result = yield call(fetchEmployeeContractDetail, params);

      // 判断数据是否为空
      if (is.existy(result) && is.not.empty(result)) {
        yield put({
          type: 'reduceEmployeeContractDetail',
          payload: result,
        });
      }
    },
  },

  /**
   * @namespace employee/contract/reducers
   */
  reducers: {

    /**
     * 人员合同列表
     * @returns {object} 更新 employeeContractData
     * @memberof module:model/employee/contract~employee/contract/reducers
     */
    reduceEmployeeContractData(state, action) {
      // 更新数据
      return { ...state, employeeContractData: action.payload };
    },

    /**
     * 人员合同详情
     * @returns {object} 更新 employeeContractDetail
     * @memberof module:model/employee/contract~employee/contract/reducers
     */
    reduceEmployeeContractDetail(state, action) {
      // 更新数据
      return { ...state, employeeContractDetail: action.payload };
    },
  },
};
