/**
 * 费用分组设置
 * @module model/expense/type
 **/
/* eslint no-underscore-dangle: ["error", { "allow": ["_meta"] }]*/
import is from 'is_js';
import { message } from 'antd';

import { fetchExpenseType, updateExpenseType, createExpenseType, deleteExpenseType, fetchExpenseTypeDetail, updateExpenseTypeByEnable } from '../../services/expense';

import { RequestMeta, ResponseMeta, CostGroupDetail } from '../../application/object/';
import { ExpenseCostGroupState } from '../../application/define';


export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'expenseType',
  /**
   * 状态树
   * @prop {object} expenseTypeList    获取费用分组列表
   * @prop {object} expenseTypeDetail  费用分组详情
   */
  state: {
    // 费用分组列表
    expenseTypeList: {},
    // 费用分组详情
    expenseTypeDetail: {},
  },
  /**
   * @namespace expense/type/effects
   */
  effects: {
    /**
     * 获取费用分组列表
     * @param {number}  state 状态
     * @param {number}  page 页数
     * @param {number}   limit 条数
     * @memberof module:model/expense/type~expense/type/effects
     */
    * fetchExpenseType({ payload = {} }, { call, put }) {
      // 请求列表的meta信息
      const params = {
        _meta: RequestMeta.mapper(payload),
      };
      // 条数限制
      if (is.existy(payload.limit) && is.not.empty(payload.limit)) {
        params._meta.limit = payload.limit;
      }
      // 分页
      if (is.existy(payload.page) && is.not.empty(payload.page)) {
        params._meta.page = payload.page;
      }
      // 状态
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = [Number(payload.state)];
      } else {
        // 默认不展示删除的
        params.state = [
          ExpenseCostGroupState.enable,
          ExpenseCostGroupState.disabled,
          ExpenseCostGroupState.edit,
        ];
      }
      // 费用分组
      if (is.existy(payload.costGroup) && is.not.empty(payload.costGroup)) {
        params.name = payload.costGroup;
      }
      // 科目
      if (is.existy(payload.subjects) && is.not.empty(payload.subjects)) {
        params.accounting_ids = payload.subjects;
      }
      // 适用场景
      if (is.existy(payload.scense) && is.not.empty(payload.scense)) {
        params.industry_codes = [payload.scense];
      }
      const result = yield call(fetchExpenseType, params);
      if (result === undefined) {
        return;
      }
      yield put({ type: 'reduceExpenseType', payload: result });
    },

     /**
     * 新建费用分组
     * @param {string}  name 名称
     * @param {array}  accountingIds 科目列表
     * @param {array}  supplierIds   供应商id
     * @param {string} note  备注
     * @param {function} onSuccessCallback  成功回调
     * @param {function} onFailureCallback  失败回调
     * @memberof module:model/expense/type~expense/type/effects
     */
    * createExpenseType({ payload }, { call }) {
      if (is.empty(payload.name) || is.not.existy(payload.name)) {
        return message.error('费用分组名称不能为空');
      }
      if (is.empty(payload.accountingIds) || is.not.existy(payload.accountingIds)) {
        return message.error('科目列表不能为空');
      }
      const params = {
        record: {},
      };
      // 名称
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.record.name = payload.name;
      }
      // 科目列表
      if (is.existy(payload.accountingIds) && is.not.empty(payload.accountingIds)) {
        params.record.accounting_ids = payload.accountingIds;
      }
      // 供应商ID列表
      if (is.existy(payload.supplierIds) && is.not.empty(payload.supplierIds)) {
        params.record.supplier_ids = payload.supplierIds;
      }
      // 备注
      if (is.existy(payload.note) && is.not.empty(payload.note)) {
        params.record.note = payload.note;
      }

      // 适用场景
      payload.scense && (params.record.industry_codes = [Number(payload.scense)]);

      // 适用场景
      payload.scense && (params.record.scense = payload.scense);

      const result = yield call(createExpenseType, params);

      if (result && !result.message) {
        payload.onSuccessCallback && payload.onSuccessCallback(result);
      }
    },

    /**
     * 编辑费用分组
     * @param {string}  name 名称
     * @param {array}  accountingIds 科目列表
     * @param {array}  supplierIds   供应商id
     * @param {string} note  备注
     * @param {function} onSuccessCallback  成功回调
     * @param {function} onFailureCallback  失败回调
     * @memberof module:model/expense/type~expense/type/effects
     */
    * updateExpenseType({ payload }, { call }) {
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('费用分组id为空, 不能操作数据');
      }
      const params = {
        id: payload.id,
        record: {},
      };
      // 费用分组名称
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.record.name = payload.name;
      }
      // 科目列表
      if (is.existy(payload.accountingIds) && is.not.empty(payload.accountingIds)) {
        params.record.accounting_ids = payload.accountingIds;
      }
      // 供应商列表
      if (is.existy(payload.supplierIds) && is.not.empty(payload.supplierIds)) {
        params.record.supplier_ids = payload.supplierIds;
      }
      // 备注
      if (is.existy(payload.note) && is.not.empty(payload.note)) {
        params.record.note = payload.note;
      } else {
        params.record.note = '';
      }

      // 适用场景
      payload.scense && (params.record.industry_codes = [Number(payload.scense)]);

      const result = yield call(updateExpenseType, params);

      if (result && result.ok) {
        payload.onSuccessCallback && payload.onSuccessCallback(result);
      }
    },

     /**
     * 更新费用分组的状态
     * @param {string}  id 审批流模版id
     * @param {boolean}   flag 启用|停用
     * @param {function} onSuccessCallback  成功回调
     * @param {function} onFailureCallback  失败回调
     * @memberof module:model/expense/type~expense/type/effects
     */
    * updateExpenseTypeByEnable({ payload }, { put }) {
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('费用分组id为空, 不能操作数据');
      }
      if (is.empty(payload.flag) || is.not.existy(payload.flag)) {
        return message.error('费用分组flag为空, 不能操作数据');
      }
      const params = {
        id: payload.id, // 审批流模版id
        flag: payload.flag, // true: 启用 false: 停用
      };
      // 业务请求
      const request = {
        params, // 接口参数
        service: updateExpenseTypeByEnable,  // 接口
        onVerifyCallback: result => is.existy(result) && is.truthy(result.ok),
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

     /**
     *  删除费用分组
     * @param {string}  id 审批流模版id
     * @param {function} onSuccessCallback  成功回调
     * @param {function} onFailureCallback  失败回调
     * @memberof module:model/expense/type~expense/type/effects
     */
    * deleteExpenseType({ payload }, { put }) {
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('费用分组id为空, 不能操作数据');
      }
      const params = {
        id: payload.id, // 费用分组id
      };
      // 业务请求
      const request = {
        params, // 接口参数
        service: deleteExpenseType,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 获取费用分组详情
     * @param {string}  id 审批流模版id
     * @param {function} onSuccessCallback  成功回调
     * @param {function} onFailureCallback  失败回调
     * @memberof module:model/expense/type~expense/type/effects
     */
    * fetchExpenseTypeDetail({ payload = {} }, { call, put }) {
      // 费用分组id
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('费用分组id为空, 无法获取详情数据');
      }
      const params = {
        id: payload.id, // 费用分组id
      };
      const result = yield call(fetchExpenseTypeDetail, params);
      if (is.existy(result) && is.not.empty(result)) {
        yield put({ type: 'reduceExpenseTypeDetail', payload: result });
      } else {
        message.error('无法获取费用分组信息');
      }
    },
  },
  /**
   * @namespace expense/type/reducers
   */
  reducers: {
     /**
     * 获取费用分组列表
     * @returns {object} 更新 expenseTypeList
     * @memberof module:model/expense/type~expense/type/reducers
     */
    reduceExpenseType(state, action) {
      const expenseTypeList = {
        meta: ResponseMeta.mapper(action.payload._meta),
        data: CostGroupDetail.mapperEach(action.payload.data, CostGroupDetail),
      };
      return { ...state, expenseTypeList };
    },

     /**
     * 获取费用分组详情
     * @returns {object} 更新 expenseTypeDetail
     * @memberof module:model/expense/type~expense/type/reducers
     */
    reduceExpenseTypeDetail(state, action) {
      let expenseTypeDetail = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        expenseTypeDetail = CostGroupDetail.mapper(action.payload, CostGroupDetail);
      }
      return { ...state, expenseTypeDetail };
    },
  },
};
