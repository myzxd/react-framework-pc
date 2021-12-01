/**
 * oa - 人事类
 *
 * @module model/oa/humanResource
 */
/* eslint no-underscore-dangle: ["error", { "allow": ["_meta", "_id"] }]*/
import is from 'is_js';
import moment from 'moment';
import { message } from 'antd';
import {
  createHandoverOrder, // 创建工作交接申请
  updateHandoverOrder, // 编辑工作交接申请
  fetchHandoverOrderDetail, // 获取工作交接申请详情
  createResignOrder, // 创建离职申请
  updateResignOrder, // 编辑离职申请
  fetchResignOrderDetail, // 获取离职申请详情
  createHumanResourceTransferOrder, // 创建人事调动申请
  updateHumanResourceTransferOrder, // 编辑人事调动申请
  fetchHumanResourceTransferOrderDetail, // 获取认识调动申请详情
  createRenewOrder, // 创建合同续签申请
  updateRenewOrder, // 编辑合同续签申请
  fetchRenewOrderDetail, // 获取合同续签申请详情
  getOrderList,
  createRecruitment,
  updateRecruitment,
  getRecruitmentDetail,
  createAuthorizedStrength,
  updateAuthorizedStrength,
  getAuthorizedStrengthDetail,
  createEmploy,
  updateEmploy,
  getEmployDetail,
  createOfficial,
  updateOfficial,
  getOfficialDetail,
  updateInduction,
  createInduction,
  fetchInductionDetail,
  getRelatedJobHandoverOrder,
  fetchApproval,
} from '../../services/oa/humanResource';
import { OAPayloadMapper } from './helper';
import { PagesHelper } from '../../routes/oa/document/define';
import { ApprovalDefaultParams } from '../../application/define';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'humanResource',

  /**
   * 状态树
   */
  state: {
    // 交接单详情数据
    jobHandoverDetail: {},
    // 离职申请单详情数据
    resignDetail: {},
    // 人员调动申请单详情数据
    positionTransferDetail: {},
    // 合同续签申请单
    renewDetail: {},
    // 事务性单据列表
    orderList: {},
    // 招聘申请单详情数据
    recruitmentDetail: {},
    // 增编申请单详情数据
    authorizedStrengthDetail: {},
    // 录用申请单详情数据
    employDetail: {},
    // 转正申请单详情数据
    officialDetail: {},
    // 入职申请单详情数据
    inductionDetail: {},
    // 关联审批单信息
    relatedJobHandoverOrderInfo: {},
  },

  /**
   * @namespace oa/humanResource/effects
   */
  effects: {
    /**
     * 获取合同续签申请单详情
     */
    *fetchRenewOrderDetail({ payload = {} }, { call, put }) {
      const { id, isPluginOrder, oaDetail } = payload;
      // 是否是外部插件审批单
      if (isPluginOrder) {
        yield put({
          type: 'reduceRenewDetail',
          payload: oaDetail,
        });
        return true;
      }
      const params = {};
      // 合同续签申请id
      if (is.not.existy(id) || is.empty(id)) {
        message.error('合同续签申请单ID不能为空');
        return false;
      }
      params._id = id;

      // 请求接口
      const res = yield call(fetchRenewOrderDetail, params);

      // 判断数据是否为空
      if (res && res._id) {
        yield put({
          type: 'reduceRenewDetail',
          payload: res,
        });
        return true;
      }
      return false;
    },
    /**
     * 创建合同续签申请单
     */
    *createRenewOrder({ payload = {} }, { call }) {
      // 事务性费用单基础数据转换
      const params = OAPayloadMapper(payload);
      if (!params) {
        payload.onErrorCallback && (payload.onErrorCallback());
        return false;
      }
      const {
        renewName, // 续签人员
        newContractCycle, // 新的合同周期
        newPartA, // 新的合同甲方
        note, // 备注
        assets, // 附件
        departmentId, // 部门
        postId, // 岗位
        entryDate, // 入职日期
        signedDate, // 合同生效日期
        expiredDate, // 合同到期日期
        contractBelongId, // 合同归属
      } = payload;

      // 续签人员
      if (is.not.existy(renewName) || is.empty(renewName)) {
        message.error('续签人员不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }

      // 加一天之后的时间
      const addDay = Number(moment(expiredDate, 'YYYYMMDD').add(1, 'days').format('YYYYMMDD'));
      if (is.existy(expiredDate) && is.number(expiredDate)) {
        // 新合生效日期
        params.new_contract_signed_date = addDay;
        // 新合同结束日期
        params.new_contract_end_date = Number(moment(addDay, 'YYYYMMDD')
        .add(newContractCycle, 'y').subtract(1, 'days').format('YYYYMMDD'));
      }

      params.order_account_id = renewName; // 续签人员
      params.department_id = departmentId; // 部门
      params.job_id = postId; // 岗位
      params.entry_date = entryDate; // 入职日期
      params.contract_signed_date = signedDate; // 合同生效日期
      params.contract_end_date = expiredDate; // 合同到期时间
      params.contract_belong_id = contractBelongId; // 合同归属

      // 实际申请人部门
      departmentId && (params.actual_department_id = departmentId);
      // 实际申请人岗位
      postId && (params.actual_job_id = postId);

      // 新合同期限
      if (is.not.existy(newContractCycle) || is.empty(newContractCycle)) {
        message.error('新合同期限不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params.new_sign_cycle = newContractCycle;

      // 新的合同甲方
      if (is.not.existy(newPartA) || is.empty(newPartA)) {
        message.error('新合同甲方不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params.new_contract_belong_id = newPartA;

      // 备注
      if (is.existy(note) && is.not.empty(note)) {
        params.note = note;
      }

      // 附件
      if (Array.isArray(assets) && assets.length > 0) {
        params.asset_keys = assets.map(({ key }) => key);
      }

      // 请求接口
      const res = yield call(createRenewOrder, params);

      // 判断是否创建成功
      if (res && res._id) {
        message.success('保存成功');
        if (payload.onCreateSuccess) {
          payload.onCreateSuccess(res.oa_application_order_id);
        }
        return res;
      }
      payload.onErrorCallback && payload.onErrorCallback();
      return false;
    },
    /**
     * 编辑合同续签申请单
     */
    *updateRenewOrder({ payload = {} }, { call }) {
      const params = {};
      const {
        id, // 合同续签申请id
        newContractCycle, // 新合同周期
        newPartA, // 新合同甲方
        note, // 备注
        assets, // 附件
        expiredDate, // 到期时间
      } = payload;

      // 合同续签申请id
      if (is.not.existy(id) || is.empty(id)) {
        message.error('合同续签申请单ID不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params._id = id;

      // 新的合同周期
      if (is.not.existy(newContractCycle) || is.empty(newContractCycle)) {
        message.error('新合同期限不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params.new_sign_cycle = newContractCycle;
      if (is.existy(expiredDate) && is.not.empty(expiredDate) && is.number(expiredDate)) {
        // 加一天之后的时间
        const addDay = Number(moment(expiredDate, 'YYYYMMDD').add(1, 'days').format('YYYYMMDD'));
         // 新的合同结束日期
        params.new_contract_end_date = Number(moment(addDay, 'YYYYMMDD')
      .add(newContractCycle, 'y').subtract(1, 'days').format('YYYYMMDD'));
      }

      // 新的合同甲方
      if (is.not.existy(newPartA) || is.empty(newPartA)) {
        message.error('新合同甲方不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params.new_contract_belong_id = newPartA;

      // 备注
      params.note = note || '';

      // 附件
      if (Array.isArray(assets) && assets.length > 0) {
        params.asset_keys = assets.map(({ key }) => key);
      } else {
        // 如果没有附件 就传空数组
        params.asset_keys = [];
      }

      // 请求接口
      const res = yield call(updateRenewOrder, params);
      // 判断是否创建成功
      if (res && res._id) {
        message.success('编辑成功');
        if (payload.onCreateSuccess) {
          payload.onCreateSuccess(res.oa_application_order_id);
        }
        return res;
      }
      payload.onErrorCallback && payload.onErrorCallback();
      return false;
    },
    /**
     * 获取人事调动申请单详情
     */
    *fetchHumanResourceTransferOrderDetail({ payload = {} }, { call, put }) {
      const { id, isPluginOrder, oaDetail } = payload;
      // 是否是外部插件审批单
      if (isPluginOrder) {
        yield put({
          type: 'reducePositionTransferDetail',
          payload: oaDetail,
        });
        return true;
      }
      const params = {};
      // 人事调动申请id
      if (is.not.existy(id) || is.empty(id)) {
        message.error('人事调动申请单ID不能为空');
        return false;
      }
      params._id = id;

      // 请求接口
      const res = yield call(fetchHumanResourceTransferOrderDetail, params);

      // 判断数据是否为空
      if (res && res._id) {
        yield put({
          type: 'reducePositionTransferDetail',
          payload: res,
        });
        return true;
      }
      return false;
    },
    /**
     * 创建人事调动申请单
     */
    *createHumanResourceTransferOrder({ payload = {} }, { call }) {
      // 事务性费用单基础数据转换
      const params = OAPayloadMapper(payload);
      if (!params) {
        payload.onErrorCallback && (payload.onErrorCallback());
        return false;
      }
      const {
        transferName, // 调动人员
        positionTransferType, // 调动类型
        effectiveTime, // 调动生效时间
        department, // 调动后部门
        post, // 调动后岗位
        reason, // 调动原因
        assets, // 附件
        departmentId, // 调动前部门
        postId, // 调动前岗位
      } = payload;

      if (is.not.existy(transferName) || is.empty(transferName)) {
        message.error('调动人员不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params.order_account_id = transferName; // 调动人员
      params.department_id = departmentId; // 调动前部门
      params.job_id = postId; // 调动前岗位

      // 调动类型
      if (is.not.existy(positionTransferType) || is.empty(positionTransferType)) {
        message.error('调动类型不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params.human_resource_type = positionTransferType;

      // 调动生效时间
      if (is.not.existy(effectiveTime) || is.empty(effectiveTime)) {
        message.error('调动生效时间不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params.effect_date = effectiveTime.format('YYYYMMDD');

      // 调动后部门
      if (is.not.existy(department) || is.empty(department)) {
        message.error('调动后部门不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params.transfer_department_id = department;

      // 调动后岗位
      if (is.not.existy(post) || is.empty(post)) {
        message.error('调动后岗位不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params.transfer_job_id = post;

      // 调动原因
      if (is.not.existy(reason) || is.empty(reason)) {
        message.error('调动原因说明不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params.note = reason;

      // 附件
      if (Array.isArray(assets) && assets.length > 0) {
        params.asset_keys = assets.map(({ key }) => key);
      }

      departmentId && (params.actual_department_id = departmentId);
      postId && (params.actual_job_id = postId);

      const res = yield call(createHumanResourceTransferOrder, params);
      if (res && res._id) {
        message.success('保存成功');
        if (payload.onCreateSuccess) {
          payload.onCreateSuccess(res.oa_application_order_id);
        }
        return res;
      }
      payload.onErrorCallback && payload.onErrorCallback();
      return false;
    },
    /**
     * 更新人事调动申请单
     */
    *updateHumanResourceTransferOrder({ payload = {} }, { call }) {
      const params = {};
      const {
        id, // 人事调动申请id
        positionTransferType,  // 调动类型
        effectiveTime, // 调动生效时间
        post, // 调动后岗位
        reason, // 调动原因
        assets, // 附件
      } = payload;

      // 人事调动申请id
      if (is.not.existy(id) || is.empty(id)) {
        message.error('人事调动申请单ID不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params._id = id;

      // 调动类型
      if (is.not.existy(positionTransferType) || is.empty(positionTransferType)) {
        message.error('调动类型不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params.human_resource_type = positionTransferType;

      // 调动生效时间
      if (is.not.existy(effectiveTime) || is.empty(effectiveTime)) {
        message.error('调动生效时间不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params.effect_date = Number(effectiveTime.format('YYYYMMDD'));

      // 调动后岗位
      if (is.not.existy(post) || is.empty(post)) {
        message.error('调动后岗位不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params.transfer_job_id = post;

      // 调动原因
      if (is.not.existy(reason) || is.empty(reason)) {
        message.error('调动原因说明不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params.note = reason;

      // 附件
      if (Array.isArray(assets) && assets.length > 0) {
        params.asset_keys = assets.map(({ key }) => key);
      } else {
        // 如果附件不传 默认传空数组
        params.asset_keys = [];
      }

      // 请求接口
      const res = yield call(updateHumanResourceTransferOrder, params);
      // 判断是否编辑成功
      if (res && res._id) {
        message.success('编辑成功');
        if (payload.onCreateSuccess) {
          payload.onCreateSuccess(res.oa_application_order_id);
        }
        return res;
      }
      payload.onErrorCallback && payload.onErrorCallback();
      return false;
    },
    /**
     * 获取离职申请单详情数据
     */
    *fetchResignOrderDetail({ payload = {} }, { call, put }) {
      const { id, isPluginOrder, oaDetail } = payload;
      // 是否是外部插件审批单
      if (isPluginOrder) {
        yield put({
          type: 'reduceResignDetail',
          payload: oaDetail,
        });
        return true;
      }
      const params = {};
      // 离职申请id
      if (is.not.existy(id) || is.empty(id)) {
        message.error('离职申请单ID不能为空');
        return false;
      }
      params._id = id;

      // 请求接口
      const res = yield call(fetchResignOrderDetail, params);

      // 判断数据是否为空
      if (res && res._id) {
        yield put({
          type: 'reduceResignDetail',
          payload: res,
        });
        return true;
      }
      return false;
    },
    /**
     * 创建离职申请单
     */
    *createResignOrder({ payload = {} }, { call }) {
      // 事务性费用单基础数据转换
      const params = OAPayloadMapper(payload);
      if (!params) {
        payload.onErrorCallback && (payload.onErrorCallback());
        return false;
      }
      const {
        actualResignName, // 离职人员
        applyResignDate, // 申请离职日期
        resignReason, // 离职原因
        // relatedJobHandoverOrder, // 关联工作交接申请
        resignCause, // 离职事由
        files, // 附件
        departmentId, // 部门
        postId, // 岗位
      } = payload;

      // 离职人员
      if (is.not.existy(actualResignName) || is.empty(actualResignName)) {
        message.error('实际离职人员不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params.order_account_id = actualResignName; // 离职人员
      params.department_id = departmentId; // 部门id
      params.job_id = postId; // 岗位id

      // 申请离职日期
      if (is.not.existy(applyResignDate) || is.empty(applyResignDate)) {
        message.error('申请离职日期不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params.apply_departure_date = applyResignDate.format('YYYYMMDD');

      // 离职原因
      if (is.not.existy(resignReason) || is.empty(resignReason)) {
        message.error('离职原因不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params.departure_type = resignReason;

      // 离职事由
      if (is.not.existy(resignCause) || is.empty(resignCause)) {
        message.error('离职事由不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params.note = resignCause;

      // 关联工作交接申请
      // if (is.existy(relatedJobHandoverOrder) && is.not.empty(relatedJobHandoverOrder)) {
      //   params.handover_order_id = relatedJobHandoverOrder;
      // }

      // 附件
      if (Array.isArray(files) && files.length > 0) {
        params.asset_keys = files.map(({ key }) => key);
      }

      departmentId && (params.actual_department_id = departmentId);
      postId && (params.actual_job_id = postId);

      // 请求接口
      const res = yield call(createResignOrder, params);
      // 判断是否创建成功
      if (res && res._id) {
        message.success('保存成功');
        if (payload.onCreateSuccess) {
          payload.onCreateSuccess(res.oa_application_order_id);
        }
        return res;
      }
      payload.onErrorCallback && payload.onErrorCallback();
      return false;
    },
    /**
     * 更新离职申请单
     */
    *updateResignOrder({ payload = {} }, { call }) {
      const params = {};
      const {
        id, // 离职申请id
        applyResignDate, // 申请离职日期
        resignReason, // 离职原因
        // relatedJobHandoverOrder, // 关联工作交接申请
        resignCause, // 离职事由
        files, // 附件
      } = payload;

      // 离职申请id
      if (is.not.existy(id) || is.empty(id)) {
        message.error('离职申请单ID不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params._id = id;

      // 申请离职日期
      if (is.not.existy(applyResignDate) || is.empty(applyResignDate)) {
        message.error('申请离职日期不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params.apply_departure_date = Number(applyResignDate.format('YYYYMMDD'));

      // 离职原因
      if (is.not.existy(resignReason) || is.empty(resignReason)) {
        message.error('离职原因不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params.departure_type = resignReason;

      // 离职事由
      if (is.not.existy(resignCause) || is.empty(resignCause)) {
        message.error('离职事由不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params.note = resignCause;

      // 关联工作交接申请
      // if (is.existy(relatedJobHandoverOrder) && is.not.empty(relatedJobHandoverOrder)) {
      //   params.handover_order_id = relatedJobHandoverOrder;
      // }

      // 附件
      if (Array.isArray(files) && files.length > 0) {
        params.asset_keys = files.map(({ key }) => key);
      } else {
        // 如果附件不存在 默认传空数组
        params.asset_keys = [];
      }

      // 请求接口
      const res = yield call(updateResignOrder, params);
      // 判断是否编辑成功
      if (res && res._id) {
        message.success('编辑成功');
        if (payload.onCreateSuccess) {
          payload.onCreateSuccess(res.oa_application_order_id);
        }
        return res;
      }
      payload.onErrorCallback && payload.onErrorCallback();
      return false;
    },
    /**
     * 获取工作交接单详情
     */
    *fetchHandoverOrderDetail({ payload = {} }, { call, put }) {
      const { id, isPluginOrder, oaDetail } = payload;
      // 是否是外部插件审批单
      if (isPluginOrder) {
        yield put({
          type: 'reduceJobHandoverDetail',
          payload: oaDetail,
        });
        return true;
      }
      const params = {};
      // 工作交接id
      if (is.not.existy(id) || is.empty(id)) {
        message.error('工作交接单ID不能为空');
        return false;
      }
      params._id = id;

      // 请求接口
      const res = yield call(fetchHandoverOrderDetail, params);

      // 判断数据是否为空
      if (res && res._id) {
        yield put({
          type: 'reduceJobHandoverDetail',
          payload: res,
        });
        return true;
      }
      return false;
    },
    /**
     * 创建工作交接单
     */
    *createHandoverOrder({ payload = {} }, { call }) {
      // 事务性费用单基础数据转换
      const params = OAPayloadMapper(payload);
      if (!params) {
        payload.onErrorCallback && (payload.onErrorCallback());
        return false;
      }
      const {
        actualHandoverEmployeeId, // 工作交接人
        jobRecipient, // 工作接收人
        jobHandoverSuperviser, // 监交人
        jobHandoverType, // 工作交接类型
        relatedJobHandoverOrder, // 关联审批单
        resignDate, // 离职日期
        resignJobHandoverOrder, // 附件
        entryDate, // 入职日期
        departmentId, // 部门
        postId, // 岗位
      } = payload;

      // 工作交接人
      if (is.not.existy(actualHandoverEmployeeId) || is.empty(actualHandoverEmployeeId)) {
        message.error('实际交接人不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params.order_account_id = actualHandoverEmployeeId; // 工作交接人
      params.department_id = departmentId; // 部门
      params.entry_date = entryDate; // 入职日期
      params.job_id = postId; // 岗位
      params.handover_type = Number(jobHandoverType);

      departmentId && (params.actual_department_id = departmentId);
      postId && (params.actual_job_id = postId);

      // 工作接收人
      if (is.not.existy(jobRecipient) || is.empty(jobRecipient)) {
        message.error('工作接收人不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params.receivers = Array.isArray(jobRecipient) ? jobRecipient : [jobRecipient];

      // 附件
      if (!Array.isArray(resignJobHandoverOrder) || resignJobHandoverOrder.length === 0) {
        message.error('附件不能为空');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      params.asset_keys = resignJobHandoverOrder.map(item => item.key);

      // 监交人
      if (is.existy(jobHandoverSuperviser) && is.not.empty(jobHandoverSuperviser)) {
        params.supervisor = jobHandoverSuperviser;
      }
      // 关联审批单
      if (is.existy(relatedJobHandoverOrder) && is.not.empty(relatedJobHandoverOrder)) {
        params.relation_application_order_id = relatedJobHandoverOrder;
      }
      // 离职日期
      if (is.existy(resignDate) && is.not.empty(resignDate)) {
        params.departure_date = Number(moment(resignDate).format('YYYYMMDD'));
      }

      // 请求接口
      const res = yield call(createHandoverOrder, params);
      // 判断是否创建成功
      if (res && res._id) {
        message.success('保存成功');
        if (payload.onCreateSuccess) {
          payload.onCreateSuccess(res.oa_application_order_id);
        }
        return res;
      }
      payload.onErrorCallback && payload.onErrorCallback();
      return false;
    },

    /**
     * 获取24类事务性单列表
     */
    *getOrderList({ payload = {} }, { call, put }) {
      const { type = undefined, id = undefined } = payload;
      if (!id) return message.error('缺少审批单id');
      if (!type) return message.error('缺少审批单类型');

      const url = PagesHelper.apiByKey(type);
      if (!url) {
        return;
      }

      const params = { oa_application_order_id: id, url };

      const res = yield call(getOrderList, params);
      if (res && res.data) {
        yield put({ type: 'reduceOrderList', payload: res });
      }
    },

    /**
     * 编辑工作交接单
     */
    *updateHandoverOrder({ payload = {} }, { call }) {
      const params = {};
      const {
        id, // 工作交接申请id
        jobRecipient, // 工作接收人
        jobHandoverSuperviser, // 监交人
        jobHandoverType, // 工作交接类型
        relatedJobHandoverOrder, // 关联审批单
        resignDate, // 离职日期
        resignJobHandoverOrder, // 附件
      } = payload;

      // 工作交接申请id
      if (is.not.existy(id) || is.empty(id)) {
        message.error('工作交接单ID不能为空');
        return false;
      }
      params._id = id;
      params.handover_type = Number(jobHandoverType);

      // 工作接收人
      if (is.not.existy(jobRecipient) || is.empty(jobRecipient)) {
        message.error('工作接收人不能为空');
        return false;
      }
      params.receivers = Array.isArray(jobRecipient) ? jobRecipient : [jobRecipient];

      // 附件
      if (!Array.isArray(resignJobHandoverOrder) || resignJobHandoverOrder.length === 0) {
        message.error('附件不能为空');
        return false;
      }
      params.asset_keys = resignJobHandoverOrder.map(item => item.key);

      // 监交人
      params.supervisor = jobHandoverSuperviser ? jobHandoverSuperviser : '';
      // 关联审批单
      if (is.existy(relatedJobHandoverOrder) && is.not.empty(relatedJobHandoverOrder)) {
        params.relation_application_order_id = relatedJobHandoverOrder;
      }
      // 离职日期
      if (is.existy(resignDate) && is.not.empty(resignDate)) {
        params.departure_date = Number(moment(resignDate).format('YYYYMMDD'));
      }

      // 请求接口
      const res = yield call(updateHandoverOrder, params);
      // 判断是否编辑成功
      if (res && res._id) {
        message.success('编辑成功');
        if (payload.onCreateSuccess) {
          payload.onCreateSuccess(res.oa_application_order_id);
        }

        return res;
      }
      return false;
    },

    /**
     * 创建招聘申请单
     */
    *createRecruitment({ payload = {} }, { call }) {
      let params = OAPayloadMapper(payload);
      if (!params) {
        payload.onFinish && (payload.onFinish());
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      const {
        department,                // 招聘部门id
        podepartmentJobRelationId, // 招聘岗位id
        // level,                     // 职级
        superior,                  // 汇报上级
        address,                   // 工作地点
        needNum,                   // 需求人数
        date,                      // 到职日期
        sex,                       // 性别
        age,                       // 年龄
        foreignLanguage,           // 外语
        education,                 // 学历
        responsibilities,          // 岗位职责
        demand,                    // 任职要求
        other,                     // 其他要求
        uploadFiled,               // 上传附件
        major,                     // 专业
        workingYears,              // 工作年限
        organizationCount,          // 编制数
        organizationNum,            // 占编数
      } = payload;

      // 请求参数
      params = {
        ...params,
        department_id: department,
        job_id: podepartmentJobRelationId,
        report_job_id: superior,
        demand_num: needNum,
        entry_date: Number(moment(date).format('YYYYMMDD')),
        gender_id: sex,
        age,
        education,
        position_statement: responsibilities,
        qualification: demand,
        other_requirement: other,
      };

      if (is.existy(address)) {
        params.work_address = address;
      }
      if (is.existy(foreignLanguage)) {
        params.foreign_language = foreignLanguage;
      }
      if (is.existy(uploadFiled) || is.not.empty(uploadFiled)) {
        params.asset_keys = Array.isArray(uploadFiled) ? uploadFiled.map(item => item.key) : [];
      }
      if (is.existy(major) && is.not.empty(major)) {
        params.professional = major;
      }
      if (is.existy(workingYears) && is.not.empty(workingYears)) {
        params.work_years = workingYears;
      }
      if (is.existy(organizationCount) && is.not.empty(organizationCount)) {
        params.organization_count = organizationCount;
      }
      if (is.existy(organizationNum) && is.not.empty(organizationNum)) {
        params.organization_num = organizationNum;
      }

      department && (params.actual_department_id = department);
      podepartmentJobRelationId && (params.actual_job_id = podepartmentJobRelationId);

      const res = yield call(createRecruitment, params);

      if (res && res._id) {
        message.success('保存成功');
        if (payload.onCreateSuccess) {
          payload.onCreateSuccess(res.oa_application_order_id);
        }
        return res;
      }
      // 失败回调
      payload.onErrorCallback && payload.onErrorCallback();
      return false;
    },

    /**
     * 编辑招聘申请单
     */
    *updateRecruitment({ payload = {} }, { call }) {
      const {
        id,                        // 招聘申请单id
        // department,                // 招聘部门
        podepartmentJobRelationId, // 招聘岗位
        superior,                  // 汇报上级
        address,                   // 工作地点
        needNum,                   // 需求人数
        date,                      // 到职日期
        sex,                       // 性别
        age,                       // 年龄
        foreignLanguage,           // 外语
        education,                 // 学历
        responsibilities,          // 岗位职责
        demand,                    // 任职要求
        other,                     // 其他要求
        uploadFiled,               // 上传附件
        major,                     // 专业
        workingYears,              // 工作年限
        organizationCount,          // 编制数
        organizationNum,            // 占编数
      } = payload;

      if (is.not.existy(id) || is.empty(id)) {
        message.error('招聘申请单id不存在');
        // 失败回调
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }

      // 请求参数
      const params = {
        _id: id,
        // department_id: department,
        job_id: podepartmentJobRelationId,
        report_job_id: superior,
        demand_num: needNum,
        entry_date: Number(moment(date).format('YYYYMMDD')),
        gender_id: sex,
        age,
        education,
        position_statement: responsibilities,
        qualification: demand,
        other_requirement: other,
      };

      // 工作地点 不填默认传空值
      params.work_address = address ? address : '';
      // 外语 不填默认传空值
      params.foreign_language = foreignLanguage ? foreignLanguage : '';
      // 专业 不填默认传空值
      params.professional = major ? major : '';
      // 工作年限 不填默认传空值
      params.work_years = workingYears ? workingYears : '';

      params.asset_keys = Array.isArray(uploadFiled) ? uploadFiled.map(item => item.key) : [];


      if (is.existy(organizationCount) && is.not.empty(organizationCount)) {
        params.organization_count = organizationCount;
      }
      if (is.existy(organizationNum) && is.not.empty(organizationNum)) {
        params.organization_num = organizationNum;
      }

      const res = yield call(updateRecruitment, params);

      if (res && res._id) {
        message.success('编辑成功');
        if (payload.onCreateSuccess) {
          payload.onCreateSuccess(res.oa_application_order_id);
        }
        return res;
      }
      // 失败回调
      payload.onErrorCallback && payload.onErrorCallback();
      return false;
    },

    /**
     * 获取招聘申请单详情
     */
    *getRecruitmentDetail({ payload = {} }, { call, put }) {
      const {
        id,                        // 招聘申请单id
        isPluginOrder,
        oaDetail,
      } = payload;
      if (isPluginOrder) {
        yield put({
          type: 'reduceRecruitmentDetail',
          payload: oaDetail,
        });
        return oaDetail;
      }

      if (is.not.existy(id) || is.empty(id)) {
        message.error('招聘申请单id不存在');
        return false;
      }

      // 请求参数
      const params = {
        _id: id,
      };

      const res = yield call(getRecruitmentDetail, params);

      if (res && res._id) {
        yield put({
          type: 'reduceRecruitmentDetail',
          payload: res,
        });
        return res;
      }
      return false;
    },

    /**
     * 关联审批接口
     */
    *fetchApproval({ payload = {} }, { call }) {
      const params = {};
      // 审批单id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params.order_id = payload.id;
      }
      // 关联审批单ids
      if (is.existy(payload.ids) && is.not.empty(payload.ids)) {
        params.relation_application_order_ids = payload.ids;
      }
      // 新增
      if (is.existy(payload.type) && is.not.empty(payload.type) && payload.type === ApprovalDefaultParams.add) {
        params.add_or_delete = ApprovalDefaultParams.add;
      }
      // 删除
      if (is.existy(payload.type) && is.not.empty(payload.type) && payload.type === ApprovalDefaultParams.delete) {
        params.add_or_delete = ApprovalDefaultParams.delete;
      }

      const result = yield call(fetchApproval, params);
      // 后端返回的错误消息 是一个数组列表 遍历渲染错误
      if (result && result.error_msg && is.array(result.error_msg)) {
        result.error_msg.map((item) => {
          message.error(`${item.error_relation_application_order_id},${item.error_relation_application_order_msg}`);
          payload.onErrorCallback && payload.onErrorCallback();
        });
      // 如果关联成功以后 返回_id 判断是否要请求提交
      } else if (result && result._id && payload.onApprovalIsSuccess) {
        payload.onApprovalIsSuccess(result._id);
      }
    },

    /**
     * 创建增编申请单
     */
    *createAuthorizedStrength({ payload = {} }, { call }) {
      let params = OAPayloadMapper(payload);
      if (!params) {
        payload.onFinish && (payload.onFinish());
        return false;
      }
      const {
        department,                // 招聘部门
        podepartmentJobRelationId, // 招聘岗位
        organizationNum,           // 部门编制数
        organizationCount,         // 部门占编数
        address,                   // 工作地点
        number,                    // 人数
        endDate,                   // 期望到职日期
        note,                      // 增编原因
        uploadFiled,               // 上传附件
      } = payload;

      // 请求参数
      params = {
        ...params,
        department_id: department,
        job_id: podepartmentJobRelationId,
        organization_num: organizationNum,
        organization_count: organizationCount,
        people_num: number,
        expect_entry_date: Number(moment(endDate).format('YYYYMMDD')),
        note,
      };

      if (is.existy(address)) {
        params.work_address = address;
      }
      if (is.existy(uploadFiled) || is.not.empty(uploadFiled)) {
        params.asset_keys = Array.isArray(uploadFiled) ? uploadFiled.map(item => item.key) : [];
      }

      department && (params.actual_department_id = department);
      podepartmentJobRelationId && (params.actual_job_id = podepartmentJobRelationId);

      const res = yield call(createAuthorizedStrength, params);
      if (res && res._id) {
        message.success('保存成功');
        if (payload.onCreateSuccess) {
          payload.onCreateSuccess(res.oa_application_order_id);
        }
        return res;
      }
      // 失败回调
      payload.onErrorCallback && payload.onErrorCallback();
      return false;
    },

    /**
     * 编辑增编申请单
     */
    *updateAuthorizedStrength({ payload = {} }, { call }) {
      const {
        id,                        // 增编申请单id
        // department,                // 招聘部门
        podepartmentJobRelationId, // 招聘岗位
        organizationNum,           // 部门编制数
        organizationCount,         // 部门占编数
        address,                   // 工作地点
        number,                    // 人数
        endDate,                   // 期望到职日期
        note,                      // 增编原因
        uploadFiled,               // 上传附件
      } = payload;

      // 请求参数
      const params = {
        _id: id,
        // department_id: department,
        job_id: podepartmentJobRelationId,
        people_num: number,
        expect_entry_date: Number(moment(endDate).format('YYYYMMDD')),
        note,
      };

      if (organizationNum) {
        params.organization_num = organizationNum;
      }
      if (organizationCount) {
        params.organization_count = organizationCount;
      }
      // 工作地址
      params.work_address = address ? address : '';

      params.asset_keys = Array.isArray(uploadFiled) ? uploadFiled.map(item => item.key) : [];
      const res = yield call(updateAuthorizedStrength, params);

      if (res && res._id) {
        message.success('编辑成功');
        if (payload.onCreateSuccess) {
          payload.onCreateSuccess(res.oa_application_order_id);
        }
        return res;
      }
      // 失败回调
      payload.onErrorCallback && payload.onErrorCallback();
      return false;
    },

    /**
     * 获取增编申请单详情
     */
    *getAuthorizedStrengthDetail({ payload = {} }, { call, put }) {
      const {
        id,                        // 增编申请单id
        isPluginOrder,              // 是否是外部审批单
        oaDetail,                   // 外部审批单详情
      } = payload;

      if (isPluginOrder) {
        yield put({
          type: 'reduceAuthorizedStrengthDetail',
          payload: oaDetail,
        });
        return oaDetail;
      }

      if (is.not.existy(id) || is.empty(id)) {
        message.error('增编申请单id不存在');
        return false;
      }

      // 请求参数
      const params = {
        _id: id,
      };

      const res = yield call(getAuthorizedStrengthDetail, params);

      if (res && res._id) {
        yield put({
          type: 'reduceAuthorizedStrengthDetail',
          payload: res,
        });
        return res;
      }
      return false;
    },

    /**
     * 创建录用申请单
     */
    *createEmploy({ payload = {} }, { call }) {
      let params = OAPayloadMapper(payload);
      if (!params) {
        payload.onFinish && (payload.onFinish());
        // 失败回调
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      const {
        name,                      // 入职者姓名
        department,                // 招聘部门
        podepartmentJobRelationId, // 招聘岗位
        boss,                      // 直接上级
        subordinate,               // 管理下属
        date,                      // 入职日期
        trialDate,                 // 试用期
        employType,                // 聘用方式
        graduationTime,            // 毕业时间
        uploadFiled,               // 上传附件
      } = payload;

      // 请求参数
      params = {
        ...params,
        name,
        department_id: department,
        job_id: podepartmentJobRelationId,
        directly_job_id: boss,
        entry_date: Number(moment(date).format('YYYYMMDD')),
        probation_period: trialDate,
        entry_source: employType,
      };
      if (is.existy(subordinate)) {
        params.manage_subordinate = subordinate;
      }
      if (is.existy(graduationTime)) {
        params.expect_graduate_date = Number(moment(graduationTime).format('YYYYMMDD'));
      }
      if (is.existy(uploadFiled)) {
        params.asset_keys = Array.isArray(uploadFiled) ? uploadFiled.map(item => item.key) : [];
      }

      department && (params.actual_department_id = department);
      podepartmentJobRelationId && (params.actual_job_id = podepartmentJobRelationId);

      const res = yield call(createEmploy, params);

      if (res && res._id) {
        message.success('保存成功');
        if (payload.onCreateSuccess) {
          payload.onCreateSuccess(res.oa_application_order_id);
        }
        return res;
      }
      // 失败回调
      payload.onErrorCallback && payload.onErrorCallback();
      return false;
    },

    /**
     * 编辑录用申请单
     */
    *updateEmploy({ payload = {} }, { call }) {
      const {
        id,                        // 费用申请单id
        name,                      // 入职者姓名
        // department,                // 招聘部门
        podepartmentJobRelationId, // 招聘岗位
        boss,                      // 直接上级
        subordinate,               // 管理下属
        date,                      // 入职日期
        trialDate,                 // 试用期
        employType,                // 聘用方式
        graduationTime,            // 毕业时间
        uploadFiled,               // 上传附件
      } = payload;

      // 请求参数
      const params = {
        _id: id,
        name,
        // department_id: department,
        job_id: podepartmentJobRelationId,
        directly_job_id: boss,
        entry_date: Number(moment(date).format('YYYYMMDD')),
        probation_period: trialDate,
        entry_source: employType,
      };

      if (is.existy(subordinate)) {
        params.manage_subordinate = subordinate;
      }
      if (is.existy(graduationTime)) {
        params.expect_graduate_date = Number(moment(graduationTime).format('YYYYMMDD'));
      }
      params.asset_keys = Array.isArray(uploadFiled) ? uploadFiled.map(item => item.key) : [];

      const res = yield call(updateEmploy, params);

      if (res && res._id) {
        message.success('编辑成功');
        if (payload.onCreateSuccess) {
          payload.onCreateSuccess(res.oa_application_order_id);
        }
        return res;
      }
      // 失败回调
      payload.onErrorCallback && payload.onErrorCallback();
      return false;
    },

    /**
     * 获取录用申请单详情
     */
    *getEmployDetail({ payload = {} }, { call, put }) {
      const {
        id,                        // 录用申请单id
        isPluginOrder,
        oaDetail,
      } = payload;

      if (isPluginOrder) {
        yield put({
          type: 'reduceEmployDetail',
          payload: oaDetail,
        });
        return oaDetail;
      }
      if (is.not.existy(id) || is.empty(id)) {
        message.error('录用申请单id不存在');
        return false;
      }

      // 请求参数
      const params = {
        _id: id,
      };

      const res = yield call(getEmployDetail, params);

      if (res && res._id) {
        yield put({
          type: 'reduceEmployDetail',
          payload: res,
        });
        return res;
      }
      return false;
    },

    /**
     * 创建转正申请单
     */
    *createOfficial({ payload = {} }, { call }) {
      let params = OAPayloadMapper(payload);
      if (!params) {
        payload.onFinish && (payload.onFinish());
        return false;
      }
      const {
        officialName,              // 转正申请人ID(员工档案ID)
        department,                // 招聘部门
        podepartmentJobRelationId, // 招聘岗位
        startDate,                 // 入职日期
        officialDate,              // 申请转正日期
        work,                      // 试用期主要工作内容
        achievement,               // 试用期主要工作成绩
        fault,                     // 试用期存在的问题
        opinion,                   // 改进设想
        uploadFiled,               // 上传附件
      } = payload;

      // 请求参数
      params = {
        ...params,
        order_account_id: officialName,
        department_id: department,
        job_id: podepartmentJobRelationId,
        entry_date: Number(moment(`${startDate}`).format('YYYYMMDD')),
        apply_regular_date: Number(moment(officialDate).format('YYYYMMDD')),
      };

      if (is.existy(work)) {
        params.probation_work_content = work;
      }
      if (is.existy(achievement)) {
        params.probation_work_grade = achievement;
      }
      if (is.existy(fault)) {
        params.probation_work_problem = fault;
      }
      if (is.existy(opinion)) {
        params.improve_vision = opinion;
      }
      if (is.existy(uploadFiled) || is.not.empty(uploadFiled)) {
        params.asset_keys = Array.isArray(uploadFiled) ? uploadFiled.map(item => item.key) : [];
      }

      department && (params.actual_department_id = department);
      podepartmentJobRelationId && (params.actual_job_id = podepartmentJobRelationId);

      const res = yield call(createOfficial, params);

      if (res && res._id) {
        message.success('保存成功');
        if (payload.onCreateSuccess) {
          payload.onCreateSuccess(res.oa_application_order_id);
        }
        return res;
      }
      // 失败回调
      payload.onErrorCallback && payload.onErrorCallback();
      return false;
    },

    /**
     * 编辑转正申请单
     */
    *updateOfficial({ payload = {} }, { call }) {
      const {
        id,                        // 转正申请单id
        officialDate,              // 申请转正日期
        work,                      // 试用期主要工作内容
        achievement,               // 试用期主要工作成绩
        fault,                     // 试用期存在的问题
        opinion,                   // 改进设想
        uploadFiled,               // 上传附件
      } = payload;

      // 请求参数
      const params = {
        _id: id,
        apply_regular_date: Number(moment(officialDate).format('YYYYMMDD')),
      };

      params.probation_work_content = work || '';
      params.probation_work_grade = achievement || '';
      params.probation_work_problem = fault || '';
      params.improve_vision = opinion || '';

      params.asset_keys = Array.isArray(uploadFiled) ? uploadFiled.map(item => item.key) : [];

      const res = yield call(updateOfficial, params);

      if (res && res._id) {
        message.success('编辑成功');
        if (payload.onCreateSuccess) {
          payload.onCreateSuccess(res.oa_application_order_id);
        }
        return res;
      }
      // 失败回调
      payload.onErrorCallback && payload.onErrorCallback();
      return false;
    },

    /**
     * 获取转正申请单详情
     */
    *getOfficialDetail({ payload = {} }, { call, put }) {
      const {
        id,                        // 转正申请单id
        isPluginOrder,              // 是否是外部审批单
        oaDetail,                   // 外部审批单详情
      } = payload;

      if (isPluginOrder) {
        yield put({
          type: 'reduceOfficialDetail',
          payload: oaDetail,
        });
        return oaDetail;
      }

      if (is.not.existy(id) || is.empty(id)) {
        message.error('转正申请单id不存在');
        return false;
      }

      // 请求参数
      const params = {
        _id: id,
      };

      const res = yield call(getOfficialDetail, params);

      if (res && res._id) {
        yield put({
          type: 'reduceOfficialDetail',
          payload: res,
        });
        return res;
      }
      return false;
    },

    /**
     * 编辑入职申请
     */
    *updateInduction({ payload = {} }, { call }) {
      console.log('yes---');
      // 创建时配置审批流参数
      const mapper = !payload.flag ? OAPayloadMapper(payload) : {};
      if (mapper === false && !payload.flag) {
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      // 请求参数
      const params = {
        ...mapper,
      };
      // 编辑id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      // 姓名
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }
      // 性别
      if (is.existy(payload.gender) && is.not.empty(payload.gender)) {
        params.gender = Number(payload.gender);
      }
      // 入职方式
      if (is.existy(payload.applyType) && is.not.empty(payload.applyType)) {
        params.apply_type = Number(payload.applyType);
      }
      // 其他方式
      if (is.existy(payload.otherType) && is.not.empty(payload.otherType)) {
        params.other_type = payload.otherType;
      }
      // 入职部门
      if (is.existy(payload.departmentId) && is.not.empty(payload.departmentId)) {
        params.employment_apply_department_id = payload.departmentId;
        !payload.flag && (params.actual_department_id = payload.departmentId);
      }
      // 入职岗位
      if (is.existy(payload.postId) && is.not.empty(payload.postId)) {
        params.employment_apply_job_id = payload.postId;
        !payload.flag && (params.actual_job_id = payload.postId);
      }
      // 备注
      params.note = payload.note || '';
      // 附件
      params.asset_keys = Array.isArray(payload.fileList) ? payload.fileList.map(item => item.key) : [];
      const res = payload.flag ? yield call(updateInduction, params) : yield call(createInduction, params);

      if (res && res.zh_message) {
        message.error(res.zh_message);
        // 失败的回调
        if (payload.onErrorCallback) {
          payload.onErrorCallback();
        }
      }
      if (res && res._id) {
        if (payload.isNoMessage !== false) {
          message.success('保存成功');
        }
        // 成功的回调
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(res);
        }
      }
    },
    /**
     * 获取入职申请详情信息
     */
    *fetchInductionDetail({ payload = {} }, { call, put }) {
      const { isPluginOrder, oaDetail } = payload;
      // 判断是否是兴达插件
      if (isPluginOrder) {
        yield put({ type: 'reduceInductionDetail', payload: oaDetail });
        return;
      }
      // 请求参数
      const params = {};
      // id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      const result = yield call(fetchInductionDetail, params);
      if (result.zh_message) {
        message.error(result.zh_message);
        return;
      }
      if (result) {
        yield put({ type: 'reduceInductionDetail', payload: result });
      }
    },
    /**
    * 获取关联审批单
    */
    *getRelatedJobHandoverOrder({ payload = {} }, { call, put }) {
      const {
        handoverType, // 工作交接类型
        orderAccountId, // 实际交接人账号id
      } = payload;
      if (!handoverType) {
        return message.error('工作交接类型不存在');
      }
      if (!orderAccountId) {
        return message.error('实际交接人账号id不存在');
      }
      // 请求参数
      const params = {
        order_account_id: orderAccountId, // 实际交接人账号id
        handover_type: handoverType, // 工作交接类型
      };
      const result = yield call(getRelatedJobHandoverOrder, params);
      if (result) {
        yield put({ type: 'reduceRelatedJobHandoverOrder', payload: result });
      }
    },
  },

  /**
   * @namespace oa/humanResource/reducers
   */
  reducers: {
    /**
     * 获取合同续签申请单
     */
    reduceRenewDetail(state, action) {
      return { ...state, renewDetail: action.payload };
    },
    /**
     * 获取人员调动申请单
     */
    reducePositionTransferDetail(state, action) {
      return { ...state, positionTransferDetail: action.payload };
    },
    /**
     * 获取离职申请单
     */
    reduceResignDetail(state, action) {
      return { ...state, resignDetail: action.payload };
    },
    /**
     * 获取交接单详情
     */
    reduceJobHandoverDetail(state, action) {
      return { ...state, jobHandoverDetail: action.payload };
    },

    /**
     * 获取审批单列表
     */
    reduceOrderList(state, action) {
      let orderList = {};
      if (action.payload) {
        orderList = action.payload;
      }
      return { ...state, orderList };
    },

    /**
     * 获取招聘申请单详情
     */
    reduceRecruitmentDetail(state, action) {
      return { ...state, recruitmentDetail: action.payload };
    },
    /**
     * 获取增编申请单详情
     */
    reduceAuthorizedStrengthDetail(state, action) {
      return { ...state, authorizedStrengthDetail: action.payload };
    },
    /**
     * 获取录用申请单详情
     */
    reduceEmployDetail(state, action) {
      return { ...state, employDetail: action.payload };
    },
    /**
     * 获取转正申请单详情
     */
    reduceOfficialDetail(state, action) {
      return { ...state, officialDetail: action.payload };
    },
    // 获取入职申请详情信息
    reduceInductionDetail(state, action) {
      return { ...state, inductionDetail: action.payload };
    },
    // 获取关联审批单
    reduceRelatedJobHandoverOrder(state, action) {
      return { ...state, relatedJobHandoverOrderInfo: action.payload };
    },
  },
};
