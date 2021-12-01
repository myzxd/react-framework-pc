/**
 * 共享登记 - 合同管理 models/shared/contract
 */
import { message } from 'antd';
import moment from 'moment';
import is from 'is_js';
import {
  getSharedContractList,
  getSharedContractDetail,
  updateSharedContract,
  getSharedContractCustodian,
  exportSharedContract,
  getSharedSignUnit,
  sharedContractSign,
  updateVoidContract,
  updateToMail,
  updateFiles,
  updateContractFiles,
  sharedContractDeliver,
  fetchContractType,
} from '../../services/shared/contract';
import { SharedAuthorityState } from '../../application/define';

const objType = '[object Object]';
const arrType = '[object Array]';
const getObjType = obj => Object.prototype.toString.call(obj);

const dealParameter = (data = {}, type) => {
  const val = {};
  const objKeys = Object.keys(data);
  Object.values(data).map((i, index) => {
    // 转交状态
    if (objKeys[index] === 'is_deliver' && typeof i === 'boolean') {
      val.is_deliver = i;
    }
    // 盖章状态
    if (objKeys[index] === 'owner_is_signed' && typeof i === 'boolean') {
      val.owner_is_signed = i;
    }
    // 归档状态
    if (objKeys[index] === 'is_filed' && typeof i === 'boolean') {
      val.is_filed = i;
    }
    if (objKeys[index] !== 'submit_date' &&
      objKeys[index] !== 'contract_at_date' &&
      objKeys[index] !== 'contract_end_date' &&
      objKeys[index] !== 'invalid_date') {
      i && (val[objKeys[index]] = i);
    }
    // 判断是否为空
    if (type === 'update' && (is.not.existy(i) || is.empty(i))
      && objKeys[index] !== 'relation_application_order_ids') {
      val[objKeys[index]] = '';
    }
    // 判断关联审批单是否为空
    if (type === 'update' && (is.not.existy(i) || is.empty(i))
      && objKeys[index] === 'relation_application_order_ids') {
      val[objKeys[index]] = [];
    }
    // 提报日期
    if (objKeys[index] === 'submit_date' && i) {
      val.submit_start_at = Number(moment(i[0]).format('YYYYMMDD'));
      val.submit_end_at = Number(moment(i[1]).format('YYYYMMDD'));
    }
    // 合同起始日期
    if (objKeys[index] === 'contract_at_date' && i) {
      val.from_start_at = Number(moment(i[0]).format('YYYYMMDD'));
      val.from_end_at = Number(moment(i[1]).format('YYYYMMDD'));
    }
    // 合同终止日期
    if (objKeys[index] === 'contract_end_date' && i) {
      val.end_start_at = Number(moment(i[0]).format('YYYYMMDD'));
      val.end_end_at = Number(moment(i[1]).format('YYYYMMDD'));
    }
    // 合同作废日期
    if (objKeys[index] === 'invalid_date' && i) {
      val.cancel_start_at = Number(moment(i[0]).format('YYYYMMDD'));
      val.cancel_end_at = Number(moment(i[1]).format('YYYYMMDD'));
    }

    // 处理时间
    if (getObjType(i) === objType && i._isAMomentObject &&
      objKeys[index] !== 'submit_date' && objKeys[index] !== 'contract_at_date' && objKeys[index] !== 'contract_end_date') {
      val[objKeys[index]] = Number(moment(i).format('YYYYMMDD'));
    }

    // 处理附件
    if (getObjType(i) === arrType && objKeys[index] === 'asset_keys') {
      val[objKeys[index]] = i.map(v => Object.values(v)[0]);
    }

    // 处理金额
    if (objKeys[index] === 'unit_price') {
      val[objKeys[index]] = Number(i) * 100;
    }
  });
  return val;
};

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'sharedContract',

  /**
   * 状态树
   * @prop {object}
   */
  state: {
    contractList: {}, // 合同列表
    contractDetail: {}, // 合同详情
    custodian: {}, // 合同保管人
    signUnitList: {}, // 签订单位
    contractTypeData: {}, // 合同类型数据
  },

  /**
   * @namespace shared/contract/effects
   */
  effects: {
    /**
     *
     * @param {合同类型}
     * @returns
     */
    *fetchContractType({ payload }, { call, put }) {
      const res = yield call(fetchContractType, payload);
      if (is.existy(res) && is.not.empty(res)) {
        yield put({ type: 'reduceContractTypeSuccess', payload: { contractTypeData: res } });
      }
    },
    /**
     *
     * @param {存档操作}
     */
    *updateFiles({ payload = {} }, { call }) {
      const params = {};
      // 合同id
      if (is.not.empty(payload._id) && is.existy(payload._id)) {
        params._id = payload._id;
      }
      // 存档地
      if (is.not.empty(payload.filed_address) && is.existy(payload.filed_address)) {
        params.filed_address = payload.filed_address;
      }
      // 存档档案盒
      if (is.not.empty(payload.filed_box) && is.existy(payload.filed_box)) {
        params.filed_box = payload.filed_box;
      }
      // 盖章合同附件列表
      if (is.not.empty(payload.file_keys) && is.existy(payload.file_keys) && is.array(payload.file_keys)) {
        const fileKeys = [];
        payload.file_keys.map((item) => {
          fileKeys.push(item.key);
        });
        params.file_keys = fileKeys;
      }
      // 存档备注
      if (is.not.empty(payload.filed_note) && is.existy(payload.filed_note)) {
        params.filed_note = payload.filed_note;
      }
      // 合同序号
      if (is.not.empty(payload.pact_num) && is.existy(payload.pact_num)) {
        params.pact_num = payload.pact_num;
      }

      const res = payload.isUpdateContract ?
        yield call(updateContractFiles, params)
        : yield call(updateFiles, params);
      if (res && res._id && payload.onCallBack) {
        payload.onCallBack();
      }
    },
    /**
     *
     * @param {作废操作}
     */
    *updateVoidContract({ payload = {} }, { call }) {
      const params = {};
      if (is.not.empty(payload._id) && is.existy(payload._id)) {
        params._id = payload._id;
      }
      if (is.not.empty(payload.cancel_note) && is.existy(payload.cancel_note)) {
        params.cancel_note = payload.cancel_note;
      }
      const res = yield call(updateVoidContract, params);
      if (res._id && payload.onCallBack) {
        payload.onCallBack();
        return;
      }
      payload.onErrorCallBack && payload.onErrorCallBack();
    },
    /**
     *
     * @param {邮寄操作}
     */
    *updateToMail({ payload = {} }, { call }) {
      const params = {};
      // 合同id
      if (is.not.empty(payload._id) && is.existy(payload._id)) {
        params._id = payload._id;
      }
      // 是否需要邮寄
      if (is.not.empty(payload.is_need_mail) && is.existy(payload.is_need_mail)) {
        params.is_need_mail = payload.is_need_mail;
      }
      // 快递公司
      if (is.not.empty(payload.mail_company) && is.existy(payload.mail_company)) {
        params.mail_company = payload.mail_company;
      }
      // 快递单号
      if (is.not.empty(payload.mail_no) && is.existy(payload.mail_no)) {
        params.mail_no = payload.mail_no;
      }
      // 快递备注
      if (is.not.empty(payload.mail_note) && is.existy(payload.mail_note)) {
        params.mail_note = payload.mail_note;
      }
      const res = yield call(updateToMail, params);
      if (res._id && payload.onCallBack) {
        payload.onCallBack();
      }
    },
    /**
     * 合同列表
     * @param {number} type 合同类型
     * @param {number} type 合同性质
     * @param {string} number 合同编号
     * @param {string} name 合同名称
     * @param {string} state 合同状态
     * @param {string} signatory 签订人
     * @param {string} custodian 合同保管人
     * @param {string} company 签订单位
     * @memberof module:model/shared/contract/effects
     */
    *getSharedContractList({ payload = {} }, { call, put }) {
      const { contractNameSpace, ...otherParams } = payload;
      const params = {
        ...dealParameter(otherParams),
      };

      const result = yield call(getSharedContractList, params);

      // 判断数据是否为空
      if (result && result.data) {
        yield put({
          type: 'reduceSharedContractList',
          payload: { result, contractNameSpace },
        });
      }
    },

    /**
     * 合同详情
     * @param {string} id
     * @memberof module:model/shared/contract/effects
     */
    *getSharedContractDetail({ payload = {} }, { call, put }) {
      const {
        id,
      } = payload;
      if (!id) return message.error('缺少合同id');
      const params = { _id: id };

      const result = yield call(getSharedContractDetail, params);

      // 判断数据是否为空
      if (result && result._id) {
        yield put({ type: 'reduceSharedContractDetail', payload: result });
      }
    },

    /**
     * 重置合同详情
     * @memberof module:model/shared/contract/effects
     */
    *resetSharedContractDetail({ payload = {} }, { put }) {
      yield put({ type: 'reduceSharedContractDetail', payload: {} });
    },

    /**
     * 合同编辑
     * @memberof module:model/shared/contract/effects
     */
    *updateSharedContract({ payload = {} }, { call }) {
      const {
        is_backed: isBacked,
        lookAccountInfo,
        pact_part_a,
        pact_part_b,
        pact_part_c,
        pact_part_d,
        ...other
      } = payload;
      const params = {
        ...dealParameter(other, 'update'),
        is_backed: isBacked === '1',
        borrow_acl: SharedAuthorityState.all,
        look_acl: lookAccountInfo.state,
        look_account_ids: lookAccountInfo.accountInfo.map(item => item.id),
        look_department_ids: lookAccountInfo.departmentInfo.map(item => item.id),
        pact_part_a: pact_part_a.join('、'),
        pact_part_b: pact_part_b.join('、'),
        pact_part_c: pact_part_c.join('、'),
        pact_part_d: pact_part_d.join('、'),
      };
      const result = yield call(updateSharedContract, params);

      return result;
    },
    /**
     *
     * @param {详情 编辑}}
     */
    *updateSharedContractDetail({ payload = {} }, { call }) {
      const params = {
        borrow_acl: SharedAuthorityState.all,
      };
      // 合同id
      if (is.not.empty(payload._id) && is.existy(payload._id)) {
        params._id = payload._id;
      }
      // 查看状态(10:完全公开,20:指定范围)
      if (is.not.empty(payload.lookAccountInfo.state) && is.existy(payload.lookAccountInfo.state)) {
        params.look_acl = payload.lookAccountInfo.state;
      }
      // 可查看成员ids
      if (is.existy(payload.lookAccountInfo.accountInfo)) {
        params.look_account_ids = payload.lookAccountInfo.accountInfo.map(item => item.id);
      }
      // 可查看部门ids
      if (is.existy(payload.lookAccountInfo.departmentInfo)) {
        params.look_department_ids = payload.lookAccountInfo.departmentInfo.map(item => item.id);
      }
      // 关联审批单
      if (is.not.empty(payload.relationApplicationOrderList) && is.existy(payload.relationApplicationOrderList)) {
        params.relation_application_order_ids = payload.relationApplicationOrderList;
      }

      const result = yield call(updateSharedContract, params);
      return result;
    },
    /**
     * 合同保管人
     * @memberof module:model/shared/contract/effects
     */
    *getSharedContractCustodian({ payload = {} }, { call, put }) {
      const result = yield call(getSharedContractCustodian, { ...dealParameter(payload) });

      // 判断数据是否为空
      if (result && result.data) {
        yield put({ type: 'reduceSharedContractCustodian', payload: result });
      }
    },

    /**
     * 签订单位
     * @memberof module:model/shared/contract/effects
     */
    *getSharedSignUnit({ payload = {} }, { call, put }) {
      const result = yield call(getSharedSignUnit, { ...dealParameter(payload) });

      // 判断数据是否为空
      if (result && result.data) {
        yield put({ type: 'reduceSharedSignUnit', payload: result });
      }
    },


    /**
     * 导出合同
     * @memberof module:model/shared/contract/effects
     */
    *exportSharedContract({ payload = {} }, { call }) {
      const { onSuccessCallback, onFailureCallback } = payload;
      const params = {
        ...dealParameter(payload.params),
      };
      const result = yield call(exportSharedContract, params);

      // 判断数据是否为空
      if (result && result._id && onSuccessCallback) {
        onSuccessCallback();
      } else {
        onFailureCallback && onFailureCallback();
      }
    },

    /**
     * 合同盖章
     * @param {array} contractIds
     * @param {string} note
     * @memberof module:model/shared/contract/effects
     */
    *sharedContractSign({ payload = {} }, { call }) {
      const {
        contractIds, // 合同ids
        note, // 备注
        assetKeys, // 附件
      } = payload;
      const params = {
        _ids: contractIds,
      };
      note && (params.sign_note = note);
      // 附件
      Array.isArray(assetKeys) && assetKeys.length > 0 && (params.sign_operation_asset_keys = assetKeys.map(a => a.key));

      const result = yield call(sharedContractSign, params);

      if (result && result.records) {
        return result.records;
      }
      return false;
    },

    /**
     * 合同转递
     * @param {array} contractId
     * @memberof module:model/shared/contract/effects
     */
    *sharedContractDeliver({ payload = {} }, { call }) {
      const {
        contractId, // 合同id
      } = payload;
      const params = {
        _id: contractId,
      };

      const result = yield call(sharedContractDeliver, params);

      if (result && result._id) {
        return result;
      }
      return false;
    },
  },

  /**
   * @namespace shared/contract/reducers
   */
  reducers: {
   /**
     *
     * @param {合同类型数据}
     * @param {*} 获取合同类型数据
     */
    reduceContractTypeSuccess(state, action) {
      const { contractTypeData } = action.payload;
      return {
        ...state,
        contractTypeData,
      };
    },
    /**
     * 更新合同列表
     * @returns {object} 更新 contractList
     * @memberof module:model/shared/contract/reducers
     */
    reduceSharedContractList(state, action) {
      const { contractList } = state;
      if (action && action.payload && action.payload.contractNameSpace) {
        contractList[action.payload.contractNameSpace] = action.payload.result;
      }
      return { ...state, contractList };
    },

    /**
     * 更新合同详情
     * @returns {object} 更新 contractDetail
     * @memberof module:model/shared/contract/reducers
     */
    reduceSharedContractDetail(state, action) {
      let contractDetail = {};
      if (action && action.payload) {
        contractDetail = action.payload;
      }
      return { ...state, contractDetail };
    },

    /**
     * 更新合同保管人
     * @returns {object} 更新 custodian
     * @memberof module:model/shared/contract/reducers
     */
    reduceSharedContractCustodian(state, action) {
      let custodian = {};
      if (action && action.payload) {
        custodian = action.payload;
      }
      return { ...state, custodian };
    },

    /**
     * 签订单位
     * @returns {object} 更新 custodian
     * @memberof module:model/shared/contract/reducers
     */
    reduceSharedSignUnit(state, action) {
      let signUnitList = {};
      if (action && action.payload) {
        signUnitList = action.payload;
      }
      return { ...state, signUnitList };
    },
  },
};
