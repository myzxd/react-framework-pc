/**
 * oa - 假勤管理
 *
 * @module model/oa/fake
 */
import is from 'is_js';
import moment from 'moment';
import { message } from 'antd';
import {
  createBusinessTrip,
  updateBusinessTrip,
  getBusinssTripDetail,
  getBusinssTripDays,
  getBusinssTripList,
  getTravelStandardDetails,
} from '../../services/oa/fake';

const dealBusinessTripData = (payload) => {
  const {
    id, // 出差单id
    flowId, // 审批流id
    businessTraveler, // 实际出差人
    departmentId, // 部门
    postId, // 岗位
    rank, // 职级
    phone, // 联系方式
    peer, // 通行人员
    businessTripType, // 出差类别
    businessTripWay, // 出差方式
    departure, // 出发地
    destinations, // 目的地
    businessTripTime, // 预计出差时间
    // reason, // 原有及说明
    arrangement, // 工作安排
    themeTag, // 主题标签
  } = payload;

  const params = {
    oa_flow_id: flowId,
    order_account_id: businessTraveler,
    biz_type: businessTripType,
    transport_kind: businessTripWay,
    department_id: departmentId,
    job_id: postId,
    rank,
    departure,
    destination_list: Array.isArray(destinations) ? destinations : [destinations],
    expect_start_at: moment(businessTripTime[0]).format('YYYY-MM-DD HH:00:00'),
    expect_done_at: moment(businessTripTime[1]).format('YYYY-MM-DD HH:00:00'),
  };
  id && (params.transaction_travel_order_id = id);
  // 联系方式  不存在默认传空字符串
  params.apply_user_phone = phone ? phone : '';
  // 同行人员
  params.together_user_names = peer ? peer : '';
  // reason && (params.note = reason);
  // 原由及工作安排说明
  params.working_plan = arrangement ? arrangement : '';
  Array.isArray(themeTag) && (params.theme_label_list = themeTag);

  return params;
};

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'fake',

  /**
   * 状态树
   */
  state: {
    businessTripDetail: {}, // 差旅报销详情
    businessTripDays: {}, // 出差单出差时间
    businessTripList: {}, // 事务出差单列表
  },

  /**
   * @namespace oa/fake/effects
   */
  effects: {
    /**
     * 提交出差申请单据
     */
    *onSaveBusinessTrip({ payload = {} }, { call }) {
      // 事务性费用单基础数据转换
      const {
        flowId,
        id, // 事务性单据id
      } = payload;
      // 审批流id不存在
      if (!flowId) {
        message.error('缺少审批流id');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }


      const params = dealBusinessTripData(payload);
      const res = id ?
        yield call(updateBusinessTrip, params)
        : yield call(createBusinessTrip, params);

      // 判断是否创建成功
      if (res && res._id) {
        // 编辑
        if (id) {
          message.success('请求成功');
        }
        if (payload.onCreateSuccess) {
          payload.onCreateSuccess(res.oa_application_order_id);
        }
        return res;
      }

      if (res && res.zh_message) {
        message.error(res.zh_message);
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      payload.onErrorCallback && payload.onErrorCallback();
      return false;
    },

    /**
     * 获取出差申请单详情
     */
    *getBusinssTripDetail({ payload = {} }, { call, put }) {
      const { id } = payload;
      const res = yield call(getBusinssTripDetail, { transaction_travel_order_id: id });

      if (res && res._id) {
        yield put({ type: 'reduceBusinessTrip', payload: res });
      } else {
        res.zh_ && message.error(res.zh_message);
      }
    },

    /**
     * 获取出差申请单列表
     */
    *getBusinssTripList({ payload = {} }, { call, put }) {
      const params = {
        _meta: { page: 1, limit: 999 },
      };

      // 状态
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = payload.state;
      }
      // 报销状态
      if (is.existy(payload.bizState) && is.not.empty(payload.bizState)) {
        params.biz_state = payload.bizState;
      }
      // 当前账号id
      if (is.existy(payload.applyAccountId) && is.not.empty(payload.applyAccountId)) {
        params.creator_id = payload.applyAccountId;
      }
      const res = yield call(getBusinssTripList, params);

      if (res) {
        yield put({ type: 'reduceBusinssTripList', payload: res });
      } else {
        res.zh_ && message.error(res.zh_message);
      }
    },

    /**
     * 重置出差申请单详情
     */
    *resetBusinssTripDetail({ payload = {} }, { put }) {
      yield put({ type: 'reduceBusinessTrip', payload: {} });
    },

    /**
     * 获取出差申请单出差天数
     */
    *getBusinssTripDays({ payload = {} }, { call, put }) {
      const {
        expectStartAt,
        expectDoneAt,
        isEstimateDay,
        onEstimateSuccessCallback,
      } = payload;
      const params = {
        travel_start_at: expectStartAt,
        travel_done_at: expectDoneAt,
      };
      const res = yield call(getBusinssTripDays, params);
      if (isEstimateDay && res && res.travel_days) {
        // 获取预计天数
        if (onEstimateSuccessCallback) {
          onEstimateSuccessCallback(res.travel_days);
        }
      }
      if (res && res.travel_days) {
        yield put({ type: 'reduceBusinessTripDays', payload: { res, namespace: payload.namespace } });
      } else {
        res.zh_message && message.error(res.zh_message);
      }
    },

    /**
     * 获取出差标准明细
     */
    *getTravelStandardDetails({ payload = {} }, { call, put }) {
      const params = {};

      const res = yield call(getTravelStandardDetails, params);

      if (res && res.detail_list) {
        yield put({ type: 'reduceTravelStandardDetails', payload: res });
      } else {
        res.zh_ && message.error(res.zh_message);
      }
    },

    /**
     * 重置出差标准明细
     */
    *resetTravelStandardDetails({ payload = {} }, { put }) {
      yield put({ type: 'reduceTravelStandardDetails', payload: {} });
    },


  },

  /**
   * @namespace oa/fake/reducers
   */
  reducers: {
    /**
     * 更新事务出差单详情
     */
    reduceBusinessTrip(state, action) {
      let businessTripDetail = {};
      if (action.payload) {
        businessTripDetail = action.payload;
      }
      return { ...state, businessTripDetail };
    },
    /**
     * 事务出差单列表
     */
    reduceBusinssTripList(state, action) {
      let businessTripList = {};
      if (action.payload) {
        businessTripList = action.payload;
      }
      return { ...state, businessTripList };
    },

    /**
     * 更新事务出差单出差时间
     */
    reduceBusinessTripDays(state, action) {
      const { res, namespace } = action.payload;
      let businessTripDays = {};
      if (action.payload) {
        if (namespace) {
          businessTripDays = {
            ...state.businessTripDays,
            [namespace]: res,
          };
        } else {
          businessTripDays = res;
        }
      }
      return { ...state, businessTripDays };
    },

    /**
     * 更新出差标准明细
     */
    reduceTravelStandardDetails(state, action) {
      let travelStandardDetails = {};
      if (action.payload) {
        travelStandardDetails = action.payload;
      }
      return { ...state, travelStandardDetails };
    },
  },
};
