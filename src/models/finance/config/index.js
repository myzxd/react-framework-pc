/**
 * 服务费结算 - 基础设置 - 结算指标设置 model（废弃）
 *
 * @module model/materials
 */
/* eslint no-underscore-dangle: ["error", { "allow": ["_meta"] }]*/
import is from 'is_js';
import { message } from 'antd';
import { fetchSalarySpecifications } from '../../../services/finance';
import { ResponseMeta, RequestMeta } from '../../../application/object';
import { SalaryVar } from '../../../application/object/salary/test';
import { AccountState } from '../../../application/define';

export default {

  /**
   * 命名空间
   * @default
   */
  namespace: 'financeConfigIndex',

  /**
   * 状态树
   * @prop {object} salarySpecifications 骑士结算指标
   */
  state: {
    salarySpecifications: {}, // 骑士结算指标
  },

  /**
   * @namespace financeConfigIndex/effects
   */
  effects: {

    /**
     * 获取库存列表
     * @param {string} platform_code 平台
     * @param {number} state 状态
     * @param {object} _meta 分页格式
     * @memberof module:model/financeConfigIndex~financeConfigIndex/effects
     */
    *fetchSalarySpecifications({ payload = {} }, { call, put }) {
      // 默认传递参数
      const params = {
        state: AccountState.on,            // 状态100
        _meta: RequestMeta.mapper(payload),  // 分页格式
      };
      // 平台
      if (is.existy(payload.salarySelected) && is.not.empty(payload.salarySelected)) {
        params.platform_code = payload.salarySelected;
      }
      // 返回数据
      const result = yield call(fetchSalarySpecifications, params);
      // 错误提示信息
      if (result.zh_message) {
        return message.error(result.zh_message);
      }
      // 判断是否有数据
      if (is.existy(result)) {
        yield put({ type: 'reduceSalarySpecifications', payload: result });
      }
    },
  },

  /**
   * @namespace financeConfigIndex/reducers
   */
  reducers: {

    /**
     * 结算指标数据
     * @returns {object} 更新 salarySpecifications
     * @memberof module:model/financeConfigIndex~financeConfigIndex/reducers
     */
    reduceSalarySpecifications(state, action) {
      const salarySpecifications = {
        // eslint-disable-next-line no-underscore-dangle
        meta: ResponseMeta.mapper(action.payload._meta),
        data: SalaryVar.mapperEach(action.payload.data, SalaryVar),
      };
      return { ...state, salarySpecifications };
    },
  },
};
