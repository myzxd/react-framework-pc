/**
 * oa - 行政类
 *
 * @module model/oa/administration
 */
/* eslint no-underscore-dangle: ["error", { "allow": ["_meta", "_id"] }]*/
import is from 'is_js';
import { message } from 'antd';
import moment from 'moment';
import { Unit } from '../../application/define';
import {
  createUseSeal,
  updateUseSeal,
  fetchUseSealDetail,
  fetchSealList,
  createCarveSeal,
  fetchKeepingList,
  updateCarveSeal,
  fetchCarveSealDetail,
  createBusinessCard,
  updateBusinessCard,
  fetchBusinessCardDetail,
  fetchLicenseList,
  createBorrowLicense,
  updateBorrowLicense,
  fetchBorrowLicenseDetail,
  createInvalidSeal,
  updateInvalidSeal,
  fetchInvalidSealDetail,
  createReward,
  updateReward,
  fetchRewardDetail,
} from '../../services/oa/administration';
import { OAPayloadMapper } from './helper';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'administration',

  /**
   * 状态树
   */
  state: {
    useSealDetail: {},       // 用章申请详情
    sealList: {},           // 印章库列表
    keepingList: [],             // 印章保管人列表
    carveSealDetail: {},      // 刻章申请详情
    businessCardDetail: {},      // 名片申请详情
    licenseList: [],          // 证照库
    borrowLicenseDetail: {}, // 证照借用申请详情
    invalidSealDetail: {},      // 废章申请详情
    rewardDetail: {},         // 奖惩详情
  },

  /**
   * @namespace oa/administration/effects
   */
  effects: {
    /**
     * 创建用章申请
     * @param {string} company 公司id
     * @param {string} sealName 印章id
     * @param {string} keepAccountId 印章保管人
     * @param {number} sealType 印章类型
     * @param {string} sealFile 用章文件名称
     * @param {number} fileNum 用章份数
     * @param {number} useTime 用印时间
     * @param {number} startTime 预计借章时间
     * @param {number} endTime 预计归还时间
     * @param {string} reason 申请事由
     * @memberof module:model/oa/administration~oa/administration/effects
     */
    * createUseSeal({ payload = {} }, { call }) {
      const params = OAPayloadMapper(payload);
      if (!params) {
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }

      // 公司id
      if (is.not.empty(payload.company) && is.existy(payload.company)) {
        params.firm_id = payload.company;
      }
      // 印章id
      if (is.not.empty(payload.sealName) && is.existy(payload.sealName)) {
        params.seal_id = payload.sealName;
      }
      // 印章保管人
      if (is.not.empty(payload.keepAccountId) && is.existy(payload.keepAccountId)) {
        params.keep_account_id = payload.keepAccountId;
      }
      // 用章类型
      if (is.not.empty(payload.sealType) && is.existy(payload.sealType)) {
        params.use_type = payload.sealType;
      }
      // 用章文件名称
      if (is.not.empty(payload.sealFile) && is.existy(payload.sealFile)) {
        params.file_name = payload.sealFile;
      }
      // 用章式数
      if (is.not.empty(payload.formNum) && is.existy(payload.formNum)) {
        params.form_num = payload.formNum;
      }
      // 用章份数
      if (is.not.empty(payload.fileNum) && is.existy(payload.fileNum)) {
        params.use_num = payload.fileNum;
      }
      // 用印时间
      if (is.not.empty(payload.useTime) && is.existy(payload.useTime)) {
        params.apply_date = Number(payload.useTime.format('YYYYMMDD'));
      }
      // 预计借章时间
      if (is.not.empty(payload.startTime) && is.existy(payload.startTime)) {
        params.expect_from_date = Number(payload.startTime.format('YYYYMMDD'));
      }
      // 预计归还时间
      if (is.not.empty(payload.endTime) && is.existy(payload.endTime)) {
        params.expect_end_date = Number(payload.endTime.format('YYYYMMDD'));
      }
      // 申请事由
      if (is.not.empty(payload.reason) && is.existy(payload.reason)) {
        params.note = payload.reason;
      }
      // 附件列表
      if (is.not.empty(payload.assets) && is.existy(payload.assets)) {
        params.asset_keys = payload.assets.map(item => item.key);
      }

      payload.departmentId && (params.actual_department_id = payload.departmentId);
      payload.postId && (params.actual_job_id = payload.postId);

      // 用印分数 式
      payload.formula && (params.formula = payload.formula);
      // 用印分数 份
      payload.share && (params.share = payload.share);

      const result = yield call(createUseSeal, params);
      if (result && result.zh_message) {
        message.error(result.zh_message);
        payload.onErrorCallback && payload.onErrorCallback();
        return;
      }
      if (result._id) {
        message.success('保存成功');
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
        return true;
      }
      payload.onErrorCallback && payload.onErrorCallback();
    },
    /**
     * 编辑用章申请
     * @param {string} id 数据id
     * @param {string} company 公司id
     * @param {string} sealName 印章id
     * @param {string} keepAccountId 印章保管人
     * @param {number} sealType 印章类型
     * @param {string} sealFile 用章文件名称
     * @param {number} fileNum 用章份数
     * @param {number} useTime 用印时间
     * @param {number} startTime 预计借章时间
     * @param {number} endTime 预计归还时间
     * @param {string} reason 申请事由
     * @memberof module:model/oa/administration~oa/administration/effects
     */
    * updateUseSeal({ payload = {} }, { call }) {
      const params = {};
      // 数据id
      if (is.not.empty(payload.id) && is.existy(payload.id)) {
        params._id = payload.id;
      }
      // 公司id
      if (is.not.empty(payload.company) && is.existy(payload.company)) {
        params.firm_id = payload.company;
      }
      // 印章id
      if (is.not.empty(payload.sealName) && is.existy(payload.sealName)) {
        params.seal_id = payload.sealName;
      }
      // 印章保管人
      if (is.not.empty(payload.keepAccountId) && is.existy(payload.keepAccountId)) {
        params.keep_account_id = payload.keepAccountId;
      }
      // 用章类型
      if (is.not.empty(payload.sealType) && is.existy(payload.sealType)) {
        params.use_type = payload.sealType;
      }
      // 用章文件名称
      if (is.not.empty(payload.sealFile) && is.existy(payload.sealFile)) {
        params.file_name = payload.sealFile;
      }
      // 用章式数
      if (is.not.empty(payload.formNum) && is.existy(payload.formNum)) {
        params.form_num = payload.formNum;
      }
      // 用章份数
      if (is.not.empty(payload.fileNum) && is.existy(payload.fileNum)) {
        params.use_num = payload.fileNum;
      }
      // 用印时间
      if (is.not.empty(payload.useTime) && is.existy(payload.useTime)) {
        params.apply_date = Number(payload.useTime.format('YYYYMMDD'));
      }
      // 预计借章时间
      if (is.not.empty(payload.startTime) && is.existy(payload.startTime)) {
        params.expect_from_date = Number(payload.startTime.format('YYYYMMDD'));
      }
      // 预计归还时间
      if (is.not.empty(payload.endTime) && is.existy(payload.endTime)) {
        params.expect_end_date = Number(payload.endTime.format('YYYYMMDD'));
      }
      // 申请事由
      if (is.not.empty(payload.reason) && is.existy(payload.reason)) {
        params.note = payload.reason;
      } else {
        params.note = '';
      }
      // 附件列表
      if (is.not.empty(payload.assets) && is.existy(payload.assets)) {
        params.asset_keys = payload.assets.map(item => item.key);
      } else {
        params.asset_keys = [];
      }

      // 用印分数 式
      payload.formula && (params.formula = payload.formula);
      // 用印分数 份
      payload.share && (params.share = payload.share);

      const result = yield call(updateUseSeal, params);
      if (result && result.zh_message) {
        message.error(result.zh_message);
        payload.onErrorCallback && payload.onErrorCallback();
        return;
      }
      if (result._id) {
        message.success('编辑成功');
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
        return;
      }
      payload.onErrorCallback && payload.onErrorCallback();
    },
    /**
     * 获取用章申请详情
     */
    * fetchUseSealDetail({ payload = {} }, { call, put }) {
      const { isPluginOrder, oaDetail } = payload;
      if (isPluginOrder) {
        yield put({ type: 'reduceUseSealDetail', payload: oaDetail });
        return;
      }
      const params = {
        _id: payload.id,
      };
      const result = yield call(fetchUseSealDetail, params);
      if (result) {
        yield put({ type: 'reduceUseSealDetail', payload: result });
      }
    },
    /**
     * 清空用章申请详情
     */
    *resetUseSealDetail({ payload = {} }, { put }) {
      yield put({ type: 'reduceUseSealDetail', payload });
    },
    /**
     * 获取印章库里的信息
     */
    * fetchSealList({ payload = {} }, { call, put }) {
      const params = {};
      // 公司id
      if (is.not.empty(payload.companyId) && is.existy(payload.companyId)) {
        params.firm_id = payload.companyId;
      }

      // 印章类型
      payload.sealType && (params.seal_type = payload.sealType);

      // 印章保管人
      payload.keepAccountId && (params.keep_account_id = payload.keepAccountId);

      const result = yield call(fetchSealList, params);
      // 请求完成的回调
      if (payload.onSuccessCallback) {
        payload.onSuccessCallback();
      }
      if (result) {
        yield put({ type: 'reduceSealList', payload: result });
      }
    },
    /**
     * 清空印章库里的信息
     */
    *resetSealList({ payload = [] }, { put }) {
      yield put({ type: 'reduceSealList', payload });
    },
    /**
     * 印章保管人下拉列表
     */
    *fetchKeepingList({ payload = {} }, { call, put }) {
      const params = {
        is_current_department: payload.is_current_department ? payload.is_current_department : false,
      };
      // 部门id
      if (is.not.empty(payload.departmentId) && is.existy(payload.departmentId)) {
        params.department_id = payload.departmentId;
      }
      // 岗位id
      if (is.not.empty(payload.postId) && is.existy(payload.postId)) {
        params.job_id = payload.postId;
      }

      const rs = yield call(fetchKeepingList, params);
      yield put({ type: 'reduceKeepingList', payload: rs });
      // 请求完成的回调
      if (payload.onSuccessCallback) {
        payload.onSuccessCallback();
      }
    },
    /**
     * 清空印章保管人下拉列表
     */
    *resetKeepingList({ payload = [] }, { put }) {
      yield put({ type: 'reduceKeepingList', payload });
    },
    /**
     * 创建刻章申请
     * @param {string} sealType 印章类型
     * @param {string} company 公司id
     * @param {string} sealName 印章名称
     * @param {string} sealFont 印章字体
     * @param {string} sealKeeping 印章保管人
     * @param {string} reason 申请事由
     * @memberof module:model/oa/administration~oa/administration/effects
     */
    * createCarveSeal({ payload = {} }, { call }) {
      const params = OAPayloadMapper(payload);
      if (!params) {
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }

      // 公司id
      if (is.not.empty(payload.company) && is.existy(payload.company)) {
        params.firm_id = payload.company;
      }

      // 印章类型
      if (is.not.empty(payload.sealType) && is.existy(payload.sealType)) {
        params.seal_type = payload.sealType;
      }
      // 印章名称
      if (is.not.empty(payload.sealName) && is.existy(payload.sealName)) {
        params.name = payload.sealName;
      }
      // 印章字体
      if (is.not.empty(payload.sealFont) && is.existy(payload.sealFont)) {
        params.typeface = payload.sealFont;
      }
      // 印章保管人
      if (is.not.empty(payload.sealKeeping) && is.existy(payload.sealKeeping)) {
        params.keep_account_id = payload.sealKeeping;
      }
      // 申请事由
      if (is.not.empty(payload.reason) && is.existy(payload.reason)) {
        params.note = payload.reason;
      }
      // 附件列表
      if (is.not.empty(payload.assets) && is.existy(payload.assets)) {
        params.asset_keys = payload.assets.map(item => item.key);
      } else {
        params.asset_keys = [];
      }

      payload.departmentId && (params.actual_department_id = payload.departmentId);
      payload.postId && (params.actual_job_id = payload.postId);

      const result = yield call(createCarveSeal, params);
      if (result && result.zh_message) {
        message.error(result.zh_message);
        payload.onErrorCallback && payload.onErrorCallback();
      }
      if (result._id) {
        message.success('保存成功');
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
      }
      payload.onErrorCallback && payload.onErrorCallback();
    },
    /**
     * 编辑刻章申请
     * @param {string} sealType 印章类型
     * @param {string} company 公司id
     * @param {string} sealName 印章名称
     * @param {string} sealFont 印章字体
     * @param {string} sealKeeping 印章保管人
     * @param {string} reason 申请事由
     * @memberof module:model/oa/administration~oa/administration/effects
     */
    * updateCarveSeal({ payload = {} }, { call }) {
      const params = {
      };
      // 数据id
      if (is.not.empty(payload.id) && is.existy(payload.id)) {
        params._id = payload.id;
      }
      // 公司id
      if (is.not.empty(payload.company) && is.existy(payload.company)) {
        params.firm_id = payload.company;
      }
      // 印章类型
      if (is.not.empty(payload.sealType) && is.existy(payload.sealType)) {
        params.seal_type = payload.sealType;
      }
      // 印章名称
      if (is.not.empty(payload.sealName) && is.existy(payload.sealName)) {
        params.name = payload.sealName;
      }
      // 印章字体
      if (is.not.empty(payload.sealFont) && is.existy(payload.sealFont)) {
        params.typeface = payload.sealFont;
      } else {
        params.typeface = '';
      }
      // 印章保管人
      if (is.not.empty(payload.sealKeeping) && is.existy(payload.sealKeeping)) {
        params.keep_account_id = payload.sealKeeping;
      }
      // 申请事由
      if (is.not.empty(payload.reason) && is.existy(payload.reason)) {
        params.note = payload.reason;
      }
      // 附件列表
      if (is.not.empty(payload.assets) && is.existy(payload.assets)) {
        params.asset_keys = payload.assets.map(item => item.key);
      } else {
        params.asset_keys = [];
      }

      const result = yield call(updateCarveSeal, params);

      if (result && result.zh_message) {
        message.error(result.zh_message);
        payload.onErrorCallback && payload.onErrorCallback();
      }
      if (result._id) {
        message.success('编辑成功');
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
      }
      payload.onErrorCallback && payload.onErrorCallback();
    },
    /**
     * 获取刻章申请详情
     */
    * fetchCarveSealDetail({ payload = {} }, { call, put }) {
      const { isPluginOrder, oaDetail } = payload;
      if (isPluginOrder) {
        yield put({ type: 'reduceCarveSealDetail', payload: oaDetail });
        return;
      }
      const params = {
        _id: payload.id,
      };
      const result = yield call(fetchCarveSealDetail, params);
      if (result) {
        yield put({ type: 'reduceCarveSealDetail', payload: result });
      }
    },
    /**
    * 清空用章申请详情
    */
    *resetCarveSealDetail({ payload = {} }, { put }) {
      yield put({ type: 'reduceCarveSealDetail', payload });
    },
    /**
     * 创建名片申请
     * @param {string} applyMan 实际申请人
     * @param {string} department 部门
     * @param {string} job 岗位
     * @param {string} jobTitle 职务名称
     * @param {string} cardName 名片姓名
     * @param {string} nameEn 英文姓名
     * @param {string} phone 手机号
     * @param {string} qq qq
     * @param {string} email 邮箱
     * @param {string} website 公司网址
     * @param {string} address 办公地址
     * @param {string} num 申请盒数
     * @param {string} time 需求时间
     * @memberof module:model/oa/administration~oa/administration/effects
     */
    * createBusinessCard({ payload = {} }, { call }) {
      const params = OAPayloadMapper(payload);
      if (!params) {
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }

      // 实际申请人
      if (is.not.empty(payload.applyMan) && is.existy(payload.applyMan)) {
        params.order_account_id = payload.applyMan;
      }
      // 部门id
      if (is.not.empty(payload.department) && is.existy(payload.department)) {
        params.department_id = payload.department;
        params.actual_department_id = payload.department;
      }
      // 岗位id
      if (is.not.empty(payload.job) && is.existy(payload.job)) {
        params.job_id = payload.job;
        params.actual_job_id = payload.job;
      }
      // 职务名称
      if (is.not.empty(payload.jobTitle) && is.existy(payload.jobTitle)) {
        params.official = payload.jobTitle;
      }
      // 名片姓名
      if (is.not.empty(payload.cardName) && is.existy(payload.cardName)) {
        params.name = payload.cardName;
      }
      // 英文姓名
      if (is.not.empty(payload.nameEn) && is.existy(payload.nameEn)) {
        params.en_name = payload.nameEn;
      }
      // 手机号
      if (is.not.empty(payload.phone) && is.existy(payload.phone)) {
        params.phone = payload.phone;
      }
      // qq
      if (is.not.empty(payload.qq) && is.existy(payload.qq)) {
        params.qq = payload.qq;
      }
      // email
      if (is.not.empty(payload.email) && is.existy(payload.email)) {
        params.email = payload.email;
      }
      // 公司网址
      if (is.not.empty(payload.website) && is.existy(payload.website)) {
        params.company_url = payload.website;
      }
      // 办公地址
      if (is.not.empty(payload.address) && is.existy(payload.address)) {
        params.address = payload.address;
      }
      // 申请盒数
      if (is.not.empty(payload.num) && is.existy(payload.num)) {
        params.apply_num = payload.num;
      }
      // 需求时间
      if (is.not.empty(payload.time) && is.existy(payload.time)) {
        params.demand_date = Number(moment(payload.time).format('YYYYMMDD'));
      }
      // 附件
      if (is.not.empty(payload.fileList) && is.existy(payload.fileList)) {
        params.asset_keys = payload.fileList.map(v => Object.values(v)[0]);
      }
      const result = yield call(createBusinessCard, params);
      if (result && result.zh_message) {
        message.error(result.zh_message);
        payload.onErrorCallback && payload.onErrorCallback();
        return;
      }
      if (result._id) {
        message.success('保存成功');
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
        return;
      }
      payload.onErrorCallback && payload.onErrorCallback();
    },
    /**
     * 编辑名片申请
     * @param {string} applyMan 实际申请人
     * @param {string} department 部门
     * @param {string} job 岗位
     * @param {string} jobTitle 职务名称
     * @param {string} cardName 名片姓名
     * @param {string} nameEn 英文姓名
     * @param {string} phone 手机号
     * @param {string} qq qq
     * @param {string} email 邮箱
     * @param {string} website 公司网址
     * @param {string} address 办公地址
     * @param {string} num 申请盒数
     * @param {string} time 需求时间
     * @memberof module:model/oa/administration~oa/administration/effects
     */
    * updateBusinessCard({ payload = {} }, { call }) {
      const params = {};

      // update暂不需要部门id和岗位id
      // 部门id
      // if (is.not.empty(payload.department) && is.existy(payload.department)) {
        // params.department_id = payload.department;
      // }
      // 岗位id
      // if (is.not.empty(payload.job) && is.existy(payload.job)) {
        // params.job_id = payload.job;
      // }
      // 职务名称
      if (is.not.empty(payload.jobTitle) && is.existy(payload.jobTitle)) {
        params.official = payload.jobTitle;
      }
      // 名片姓名
      if (is.not.empty(payload.cardName) && is.existy(payload.cardName)) {
        params.name = payload.cardName;
      }
      // 英文姓名
      if (is.not.empty(payload.nameEn) && is.existy(payload.nameEn)) {
        params.en_name = payload.nameEn;
      } else {
        params.en_name = '';
      }
      // 手机号
      if (is.not.empty(payload.phone) && is.existy(payload.phone)) {
        params.phone = payload.phone;
      }
      // qq
      if (is.not.empty(payload.qq) && is.existy(payload.qq)) {
        params.qq = payload.qq;
      } else {
        params.qq = '';
      }
      // email
      if (is.not.empty(payload.email) && is.existy(payload.email)) {
        params.email = payload.email;
      }
      // 公司网址
      if (is.not.empty(payload.website) && is.existy(payload.website)) {
        params.company_url = payload.website;
      } else {
        params.company_url = '';
      }
      // 办公地址
      if (is.not.empty(payload.address) && is.existy(payload.address)) {
        params.address = payload.address;
      } else {
        params.address = '';
      }
      // 申请盒数
      if (is.not.empty(payload.num) && is.existy(payload.num)) {
        params.apply_num = payload.num;
      }
      // 需求时间
      if (is.not.empty(payload.time) && is.existy(payload.time)) {
        params.demand_date = Number(moment(payload.time).format('YYYYMMDD'));
      }
      // 附件
      if (is.not.empty(payload.fileList) && is.existy(payload.fileList)) {
        params.asset_keys = payload.fileList.map(v => Object.values(v)[0]);
      } else {
        params.asset_keys = [];
      }
      // 编辑id
      if (is.not.empty(payload.id) && is.existy(payload.id)) {
        params._id = payload.id;
      }

      const result = yield call(updateBusinessCard, params);
      if (result && result.zh_message) {
        payload.onErrorCallback && payload.onErrorCallback();
        return message.error(result.zh_message);
      }
      if (result._id) {
        message.success('编辑成功');
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
        return;
      }
      payload.onErrorCallback && payload.onErrorCallback();
    },
    /*
    * 证照库
    */
    *fetchLicenseList({ payload = {} }, { call, put }) {
      const params = {};
      // 公司
      if (is.not.empty(payload.companyId) && is.existy(payload.companyId)) {
        params.firm_id = payload.companyId;
      }
      // 证照类型
      if (is.not.empty(payload.license) && is.existy(payload.license)) {
        params.display = payload.license;
      }
      const result = yield call(fetchLicenseList, params);
      // 请求完成的回调
      if (payload.onSuccessCallback) {
        payload.onSuccessCallback();
      }
      if (result) {
        yield put({ type: 'reduceLicenseList', payload: result });
      }
    },

    /**
    * 清空证照库
    */
    *resetLicenseList({ payload }, { put }) {
      yield put({ type: 'reduceLicenseList', payload: {} });
    },
    /**
    * 创建证照借用申请
    */
    *createBorrowLicense({ payload = {} }, { call }) {
      const params = OAPayloadMapper(payload);
      if (!params) {
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }

      // 公司id
      if (is.existy(payload.companyName) && is.not.empty(payload.companyName)) {
        params.firm_id = payload.companyName;
      }
      // 证照id
      if (is.existy(payload.licenseName) && is.not.empty(payload.licenseName)) {
        params.cert_id = payload.licenseName;
      }
      // 原件/复印件
      if (is.existy(payload.license) && is.not.empty(payload.license)) {
        params.cert_nature = payload.license;
      }
      // 证照类型
      if (is.existy(payload.licenseType) && is.not.empty(payload.licenseType)) {
        params.cert_type = payload.licenseType;
      }
      // 预计借用时间
      if (is.existy(payload.startTime) && is.not.empty(payload.startTime)) {
        params.expect_from_date = Number(moment(payload.startTime).format('YYYYMMDD'));
      }
      // 预计归还时间
      if (is.existy(payload.endTime) && is.not.empty(payload.endTime)) {
        params.expect_end_date = Number(moment(payload.endTime).format('YYYYMMDD'));
      }
      // 事由说明
      if (is.existy(payload.note) && is.not.empty(payload.note)) {
        params.note = payload.note;
      }
      // 编辑id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      // 附件列表
      if (is.existy(payload.fileList) && is.not.empty(payload.fileList)) {
        params.asset_keys = payload.fileList.map(v => Object.values(v)[0]);
      }

      payload.departmentId && (params.actual_department_id = payload.departmentId);
      payload.postId && (params.actual_job_id = payload.postId);

      let result = {};
      result = yield call(createBorrowLicense, params);
      if (result && result.zh_message) {
        payload.onErrorCallback && payload.onErrorCallback();
        return message.error(result.zh_message);
      }
      if (result._id) {
        message.success('保存成功');
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
        return;
      }
      payload.onErrorCallback && payload.onErrorCallback();
    },
    /**
    * 创建证照借用申请
    */
    *updateBorrowLicense({ payload = {} }, { call }) {
      const params = {};

      // 公司id
      // if (is.existy(payload.companyName) && is.not.empty(payload.companyName)) {
        // params.firm_id = payload.companyName;
      // }
      // 证照id
      // if (is.existy(payload.licenseName) && is.not.empty(payload.licenseName)) {
        // params.cert_id = payload.licenseName;
      // }
      // 原件/复印件
      // if (is.existy(payload.license) && is.not.empty(payload.license)) {
        // params.cert_nature = payload.license;
      // }
      // 证照类型
      // if (is.existy(payload.licenseType) && is.not.empty(payload.licenseType)) {
        // params.cert_type = payload.licenseType;
      // }
      // 预计借用时间
      if (is.existy(payload.startTime) && is.not.empty(payload.startTime)) {
        params.expect_from_date = Number(moment(payload.startTime).format('YYYYMMDD'));
      }
      // 预计归还时间
      if (is.existy(payload.endTime) && is.not.empty(payload.endTime)) {
        params.expect_end_date = Number(moment(payload.endTime).format('YYYYMMDD'));
      }
      // 事由说明
      if (is.existy(payload.note) && is.not.empty(payload.note)) {
        params.note = payload.note;
      }
      // 编辑id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      // 附件列表
      if (is.existy(payload.fileList) && is.not.empty(payload.fileList)) {
        params.asset_keys = payload.fileList.map(v => Object.values(v)[0]);
      } else {
        params.asset_keys = [];
      }
      let result = {};
      result = yield call(updateBorrowLicense, params);
      if (result && result.zh_message) {
        payload.onErrorCallback && payload.onErrorCallback();
        return message.error(result.zh_message);
      }
      if (result._id) {
        message.success('编辑成功');
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
        return;
      }
      payload.onErrorCallback && payload.onErrorCallback();
    },
    /**
     * 获取名片申请详情
     */
    * fetchBusinessCardDetail({ payload = {} }, { call, put }) {
      const { isPluginOrder, oaDetail } = payload;
      if (isPluginOrder) {
        yield put({ type: 'reduceBusinessCardDetail', payload: oaDetail });
        return;
      }
      const params = {
        _id: payload.id,
      };
      const result = yield call(fetchBusinessCardDetail, params);
      if (result) {
        yield put({ type: 'reduceBusinessCardDetail', payload: result });
      }
    },
    /**
     * 重置名片申请详情
     */
    * resetBusinessCardDetail({ payload = {} }, { put }) {
      yield put({ type: 'reduceBusinessCardDetail', payload });
    },
    /**
    * 证照借用申请详情
    */
    *fetchBorrowLicenseDetail({ payload = {} }, { call, put }) {
      const { isPluginOrder, oaDetail } = payload;
      if (isPluginOrder) {
        yield put({ type: 'reduceBorrowLicenseDetail', payload: oaDetail });
        return;
      }
      const params = {
      };
      // id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      const result = yield call(fetchBorrowLicenseDetail, params);
      if (result) {
        yield put({ type: 'reduceBorrowLicenseDetail', payload: result });
      }
    },
    /**
    * 证照借用申请详情
    */
    *resetBorrowLicenseDetail({ payload = {} }, { put }) {
      yield put({ type: 'reduceBorrowLicenseDetail', payload: {} });
    },

    /**
     * 创建废章申请
     * @param {string} company 公司名称id
     * @param {string} sealName 印章名称id
     * @param {string} reason 理由
     * @memberof module:model/oa/administration~oa/administration/effects
     */
    * createInvalidSeal({ payload = {} }, { call }) {
      const params = OAPayloadMapper(payload);
      if (!params) {
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }

      // 公司名称
      if (is.not.empty(payload.company) && is.existy(payload.company)) {
        params.firm_id = payload.company;
      }
      // 印章名称id
      if (is.not.empty(payload.sealName) && is.existy(payload.sealName)) {
        params.seal_id = payload.sealName;
      }
      // 理由
      if (is.not.empty(payload.reason) && is.existy(payload.reason)) {
        params.note = payload.reason;
      }
      // 附件
      if (is.not.empty(payload.fileList) && is.existy(payload.fileList)) {
        params.asset_keys = payload.fileList.map(v => Object.values(v)[0]);
      }

      payload.departmentId && (params.actual_department_id = payload.departmentId);
      payload.postId && (params.actual_job_id = payload.postId);

      const result = yield call(createInvalidSeal, params);
      if (result && result.zh_message) {
        message.error(result.zh_message);
        payload.onErrorCallback && payload.onErrorCallback();
        return;
      }
      if (result._id) {
        message.success('保存成功');
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
        return;
      }
      payload.onErrorCallback && payload.onErrorCallback();
    },

    /**
     * 编辑废章申请
     * @param {string} company 公司名称id
     * @param {string} sealName 印章名称id
     * @param {string} reason 理由
     * @memberof module:model/oa/administration~oa/administration/effects
     */
    * updateInvalidSeal({ payload = {} }, { call }) {
      const params = {};
      // 编辑id
      if (is.not.empty(payload.id) && is.existy(payload.id)) {
        params._id = payload.id;
      }
      // 公司名称
      if (is.not.empty(payload.company) && is.existy(payload.company)) {
        params.firm_id = payload.company;
      }
      // 印章名称id
      if (is.not.empty(payload.sealName) && is.existy(payload.sealName)) {
        params.seal_id = payload.sealName;
      }
      // 理由
      if (is.not.empty(payload.reason) && is.existy(payload.reason)) {
        params.note = payload.reason;
      }
      // 附件
      if (is.not.empty(payload.fileList) && is.existy(payload.fileList)) {
        params.asset_keys = payload.fileList.map(v => Object.values(v)[0]);
      } else {
        params.asset_keys = [];
      }

      const result = yield call(updateInvalidSeal, params);
      if (result && result.zh_message) {
        message.error(result.zh_message);
        payload.onErrorCallback && payload.onErrorCallback();
        return;
      }
      if (result._id) {
        message.success('编辑成功');
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
        return;
      }
      payload.onErrorCallback && payload.onErrorCallback();
    },
    /**
     * 获取废章申请详情
     */
    * fetchInvalidSealDetail({ payload = {} }, { call, put }) {
      const { isPluginOrder, oaDetail } = payload;
      if (isPluginOrder) {
        yield put({ type: 'reduceInvalidSealDetail', payload: oaDetail });
        return;
      }
      const params = {
        _id: payload.id,
      };
      const result = yield call(fetchInvalidSealDetail, params);
      if (result) {
        yield put({ type: 'reduceInvalidSealDetail', payload: result });
      }
    },
    /**
     * 重置废章申请详情
     */
    * resetInvalidSealDetail({ payload = {} }, { put }) {
      yield put({ type: 'reduceInvalidSealDetail', payload });
    },


    /**
     * 创建奖惩申请
     * @memberof module:model/oa/administration~oa/administration/effects
     */
    * createReward({ payload = {} }, { call }) {
      const params = OAPayloadMapper(payload);
      if (!params) {
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }

      // 员工id
      if (is.not.empty(payload.applyMan) && is.existy(payload.applyMan)) {
        params.order_account_id = payload.applyMan;
      }
      // 员工部门
      if (is.not.empty(payload.departmentId) && is.existy(payload.departmentId)) {
        params.department_id = payload.departmentId;
        params.actual_department_id = payload.departmentId;
      }
      // 员工岗位
      if (is.not.empty(payload.jobId) && is.existy(payload.jobId)) {
        params.job_id = payload.jobId;
        params.actual_job_id = payload.jobId;
      }
      // 奖惩原因
      if (is.not.empty(payload.reason) && is.existy(payload.reason)) {
        params.note = payload.reason;
      }
      // 奖惩措施
      if (is.not.empty(payload.rewardWay) && is.existy(payload.rewardWay)) {
        params.prize_opt = payload.rewardWay;
      }
      // 奖惩金额
      if (is.not.empty(payload.money) && is.existy(payload.money)) {
        params.money = Unit.exchangePriceToCent(payload.money);
      }
      // 奖惩积分
      if (is.not.empty(payload.score) && is.existy(payload.score)) {
        params.integral = payload.score;
      }
      // 附件
      if (is.not.empty(payload.fileList) && is.existy(payload.fileList)) {
        params.asset_keys = payload.fileList.map(v => Object.values(v)[0]);
      }

      const result = yield call(createReward, params);
      if (result && result.zh_message) {
        message.error(result.zh_message);
        payload.onErrorCallback && payload.onErrorCallback();
        return;
      }
      if (result._id) {
        message.success('保存成功');
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
        return;
      }
      payload.onErrorCallback && payload.onErrorCallback();
    },

    /**
     * 编辑奖惩
     * @memberof module:model/oa/administration~oa/administration/effects
     */
    * updateReward({ payload = {} }, { call }) {
      const params = {};
      // 编辑id
      if (is.not.empty(payload.id) && is.existy(payload.id)) {
        params._id = payload.id;
      }
      // 奖惩原因
      if (is.not.empty(payload.reason) && is.existy(payload.reason)) {
        params.note = payload.reason;
      }
      // 奖惩措施
      if (is.not.empty(payload.rewardWay) && is.existy(payload.rewardWay)) {
        params.prize_opt = payload.rewardWay;
      }
      // 奖惩金额
      if (is.not.empty(payload.money) && is.existy(payload.money)) {
        params.money = Unit.exchangePriceToCent(payload.money);
      } else {
        params.money = '';
      }
      // 奖惩积分
      if (is.not.empty(payload.score) && is.existy(payload.score)) {
        params.integral = payload.score;
      } else {
        params.integral = '';
      }
      // 附件
      if (is.not.empty(payload.fileList) && is.existy(payload.fileList)) {
        params.asset_keys = payload.fileList.map(v => Object.values(v)[0]);
      } else {
        params.asset_keys = [];
      }

      const result = yield call(updateReward, params);
      if (result && result.zh_message) {
        message.error(result.zh_message);
        payload.onErrorCallback && payload.onErrorCallback();
        return;
      }
      if (result._id) {
        message.success('编辑成功');
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
        return;
      }
      payload.onErrorCallback && payload.onErrorCallback();
    },
    /**
     * 奖惩详情
     */
    * fetchRewardDetail({ payload = {} }, { call, put }) {
      const { isPluginOrder, oaDetail } = payload;
      if (isPluginOrder) {
        yield put({ type: 'reduceRewardDetail', payload: oaDetail });
        return;
      }
      const params = {
      };
      // id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      const result = yield call(fetchRewardDetail, params);
      if (result) {
        yield put({ type: 'reduceRewardDetail', payload: result });
      }
    },
    /**
     * 重置奖惩详情
     */
    * resetRewardDetail({ payload = {} }, { put }) {
      yield put({ type: 'reduceRewardDetail', payload });
    },

  },

  /**
   * @namespace oa/administration/reducers
   */
  reducers: {
    /**
     * 更新印章保管人信息
     */
    reduceKeepingList(state, action) {
      return {
        ...state,
        keepingList: action.payload.data || [],
      };
    },
    /**
     * 更新用章详情信息
     */
    reduceUseSealDetail(state, action) {
      return {
        ...state,
        useSealDetail: action.payload,
      };
    },
    /**
     * 更新印章库信息
     */
    reduceSealList(state, action) {
      return {
        ...state,
        sealList: action.payload,
      };
    },
    /**
     * 更新刻章信息
     */
    reduceCarveSealDetail(state, action) {
      return {
        ...state,
        carveSealDetail: action.payload,
      };
    },
    /**
     * 更新名片申请信息
     */
    reduceBusinessCardDetail(state, action) {
      return {
        ...state,
        businessCardDetail: action.payload,
      };
    },
    /**
     * 证照借用申请详情
     */
    reduceBorrowLicenseDetail(state, action) {
      return {
        ...state,
        borrowLicenseDetail: action.payload,
      };
    },
    /**
     * 证照库
     */
    reduceLicenseList(state, action) {
      return {
        ...state,
        licenseList: action.payload,
      };
    },
    /**
     * 证照库
     */
    reduceInvalidSealDetail(state, action) {
      return {
        ...state,
        invalidSealDetail: action.payload,
      };
    },
    /**
     * 证照库
     */
    reduceRewardDetail(state, action) {
      return {
        ...state,
        rewardDetail: action.payload,
      };
    },
  },
};
