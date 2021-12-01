/**
 *  请假管理  models/expense/expenseTakeLeave
 */
import moment from 'moment';
import is from 'is_js';
import { message } from 'antd';

import { fetchExpenseTakeLeaveList, fetchExpenseTakeLeaveDetail, createExpenseTakeLeave, updateExpenseTakeLeave, exportTakeLeave } from '../../services/expense/takeLeave';
import { RequestMeta } from '../../application/object';

const mapperData = (val = {}, isExport = false) => {
  const {
    page,
    limit,
    platforms,     // 项目
    cities,        // 城市
    districts,     // 商圈
    takeLeaveType, // 请假类型
    takeLeaveId,   // 请假id
    state,         // 流程状态
    startMinDate,     // 开始最小时间
    startMaxDate,     // 开始最大时间
    endMinDate,       // 结束最小时间
    endMaxDate,       // 结束最大时间
    applyAccountId, // 用户id
  } = val;

  const params = {
    // 状态
    state: [1, 10, 100, -100],
  };

  if (isExport === false) {
    params._meta = RequestMeta.mapper({ page: page || 1, limit: limit || 30 });
  }

  // 平台
  if (is.existy(platforms) && is.not.empty(platforms)) {
    params.platform_code = platforms;
  }

  // 城市
  if (is.existy(cities) && is.not.empty(cities)) {
    params.city_code = cities;
  }

  // 商圈
  if (is.existy(districts) && is.not.empty(districts)) {
    params.biz_district_id = districts;
  }

  // 请假类型
  if (is.existy(takeLeaveType) && is.not.empty(takeLeaveType)) {
    params.leave_type = takeLeaveType;
  }

   // 请假单号
  if (is.existy(takeLeaveId) && is.not.empty(takeLeaveId)) {
    params.apply_order_id = takeLeaveId;
  }

  // 流程状态
  if (is.existy(state) && is.not.empty(state)) {
    params.state = [state];
  }

  // 开始最小时间
  if (is.existy(startMinDate) && is.not.empty(startMinDate)) {
    params.start_min_at = startMinDate;
  }

  // 开始最大时间
  if (is.existy(startMaxDate) && is.not.empty(startMaxDate)) {
    params.start_max_at = startMaxDate;
  }

  // 结束最小时间
  if (is.existy(endMinDate) && is.not.empty(endMinDate)) {
    params.end_min_at = endMinDate;
  }

  // 结束最大时间
  if (is.existy(endMaxDate) && is.not.empty(endMaxDate)) {
    params.end_max_at = endMaxDate;
  }

  // 我的
  if (is.existy(applyAccountId) && is.not.empty(applyAccountId)) {
    params.apply_account_id = applyAccountId;
  }

  return params;
};

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'expenseTakeLeave',
  /**
   * 状态树
   * @prop {object}
   */
  state: {
    expenseTakeLeaveMineList: {
      data: [],
      _meta: {},
    }, // 请假管理列表
    expenseTakeLeaveDetail: {},   // 请假管理单详情
  },
  /**
   * @namespace expense/subject/effects
   */
  effects: {
    /**
     * 获取请假管理列表
     * @param {string} platforms 项目
     * @param {string} cities    城市
     * @param {string} districts 商圈
     * @param {string} takeLeaveType 请假类型
     * @param {string} takeLeaveId  请假id
     * @param {string} state     流程状态
     * @param {string} startMinDate 开始最小时间
     * @param {string} startMaxDate 开始最大时间
     * @param {string} endMinDate   结束最小时间
     * @param {string} endMaxDate   结束最大时间
     * @param {string} applyAccountId 用户id
     * @memberof module:model/expense/expenseTakeLeave/effects
     */
    * fetchExpenseTakeLeaveList({ payload = {} }, { call, put }) {
      const params = mapperData(payload);
      // 请求服务器
      const result = yield call(fetchExpenseTakeLeaveList, params);

      // 判断数据是否为空
      if (is.existy(result)) {
        yield put({ type: 'reduceExpenseTakeLeaveList', payload: result });
      }
    },
    /**
     * 创建请假
     *  @param {array} platforms      项目
     *  @param {array} cities         城市
     *  @param {array} districts      团队
     *  @param {string} leaveType      请假类型
     *  @param {string} phone          联系方式
     *  @param {array} date           请假时间
     *  @param {string} duration       时长
     *  @param {string} note           请假事由
     *  @param {string} work           工作安排
     *  @param {array} fileList       上传附件
     *  @param {string} applicationOrderId       审批单id
     * @memberof module:model/expense/borrowingRepayment~expense/borrowingRepayment/effects
     */
    *createExpenseTakeLeave({ payload = {} }, { call }) {
      const {
        platforms,     // 项目
        cities,        // 城市
        districts,     // 团队
        leaveType,     // 请假类型
        leavePeople,   // 请假人
        phone,         // 联系方式
        duration,      // 时长
        note,          // 请假事由
        work,          // 工作安排
        fileList,      // 上传附件
        applicationOrderId, // 审批单id
      } = payload;
      // 传递的参数
      const params = {
        storage_type: 3, // 上传文件的类型
      };
      // 请假人
      if (is.existy(leavePeople) && is.not.empty(leavePeople)) {
        params.actual_apply_name = leavePeople;
      }
      // 审批单id
      if (is.existy(applicationOrderId) && is.not.empty(applicationOrderId)) {
        params.application_order_id = applicationOrderId;
      }
      // 平台
      if (is.existy(platforms) && is.not.empty(platforms)) {
        params.platform_code = platforms;
      }

      // 城市
      if (is.existy(cities) && is.not.empty(cities)) {
        params.city_code = cities;
      }

      // 团队
      if (is.existy(districts) && is.not.empty(districts)) {
        params.biz_district_id = districts;
      }

      // 请假类型
      if (is.existy(leaveType) && is.not.empty(leaveType)) {
        params.leave_type = Number(leaveType);
      }

      // 联系方式
      if (is.existy(phone) && is.not.empty(phone)) {
        params.phone = phone;
      }

      // 开始时间
      if (is.existy(payload.startTime) && is.not.empty(payload.startTime)) {
        params.start_at = moment(payload.startTime).format('YYYY-MM-DD HH:mm:00'); // 开始时间
      }
      // 结束时间
      if (is.existy(payload.endTime) && is.not.empty(payload.endTime)) {
        params.end_at = moment(payload.endTime).format('YYYY-MM-DD HH:mm:00'); // 结束时间
      }

      // 时长
      if (is.existy(duration) && is.not.empty(duration)) {
        params.duration = duration;
      }
      // 请假事由
      if (is.existy(note) && is.not.empty(note)) {
        params.reason = note;
      }
      // 工作安排
      if (is.existy(work) && is.not.empty(work)) {
        params.work_placement = work;
      }
      // 上传附件
      if (is.existy(fileList) && is.not.empty(fileList)) {
        params.asset_ids = fileList;
      }
      // 判断开始时间与结束时间是否相等
      if (params.start_at === params.end_at) {
        return message.error('结束时间不能等于开始时间');
      }
      // 判断请假时长是否为0
      if (params.duration === 0) {
        return message.error('请假时长不能为0');
      }
      const result = yield call(createExpenseTakeLeave, params);
      if (result.zh_message) {
        message.error(result.zh_message);
      }
      if (result && result.ok) {
        message.success('请求成功');
        payload.onSuccessCallback && payload.onSuccessCallback(result);
      } else {
        payload.onFailureCallback && payload.onFailureCallback(result);
      }
    },

     /**
     * 编辑请假申请
     * @param {array} platforms      项目
     * @param {array} cities         城市
     * @param {array} districts      团队
     * @param {string} leaveType      请假类型
     * @param {string} phone          联系方式
     * @param {array}  date           请假时间
     * @param {string} duration       时长
     * @param {string} note           请假事由
     * @param {string} work           工作安排
     * @param {array} fileList       上传附件
     * @param {string} takeLeaveId   请假申请id
     * @param {string} applicationOrderId, // 审批单id
     * @memberof module:model/expense/borrowingRepayment~expense/borrowingRepayment/effects
     */
    *updateExpenseTakeLeave({ payload = {} }, { call }) {
      const {
        platforms,     // 项目
        cities,        // 城市
        districts,     // 团队
        leaveType,     // 请假类型
        leavePeople,   // 请假人
        phone,         // 联系方式
        startTime,     // 请假时间
        endTime,       // 结束时间
        duration,      // 时长
        note,          // 请假事由
        work,          // 工作安排
        fileList,      // 上传附件
        takeLeaveId,  // 请假申请id
        applicationOrderId, // 审批单id
      } = payload;
      // 处理时间
      const startDate = moment(startTime).format('YYYY-MM-DD HH:mm:00'); // 开始时间
      const endDate = moment(endTime).format('YYYY-MM-DD HH:mm:00');  // 结束时间

      // 传递的参数
      const params = {
        storage_type: 3, // 上传文件的类型
      };
      // 请假人
      if (is.existy(leavePeople) && is.not.empty(leavePeople)) {
        params.actual_apply_name = leavePeople;
      }
      // 平台
      if (is.existy(platforms) && is.not.empty(platforms)) {
        params.platform_code = platforms;
      }

      // 城市
      if (is.existy(cities) && is.not.empty(cities)) {
        params.city_code = cities;
      }

      // 团队
      if (is.existy(districts) && is.not.empty(districts)) {
        params.biz_district_id = districts;
      }

      // 请假类型
      if (is.existy(leaveType) && is.not.empty(leaveType)) {
        params.leave_type = Number(leaveType);
      }

      // 联系方式
      if (is.existy(phone) && is.not.empty(phone)) {
        params.phone = phone;
      } else {
        params.phone = '';
      }

     // 开始时间
      if (is.existy(startDate) && is.not.empty(startDate)) {
        params.start_at = startDate;
      }

     // 结束时间
      if (is.existy(endDate) && is.not.empty(endDate)) {
        params.end_at = endDate;
      }

      // 时长
      if (is.existy(duration) && is.not.empty(duration)) {
        params.duration = duration;
      }
      // 请假事由
      if (is.existy(note) && is.not.empty(note)) {
        params.reason = note;
      }
      // 工作安排
      if (is.existy(work) && is.not.empty(work)) {
        params.work_placement = work;
      } else {
        params.work_placement = '';
      }
      // 上传附件
      if (is.existy(fileList) && is.not.empty(fileList)) {
        params.asset_ids = fileList;
      } else {
        params.asset_ids = [];
      }
      // 请假申请id
      if (is.existy(takeLeaveId) && is.not.empty(takeLeaveId)) {
        params.apply_order_id = takeLeaveId;
      }

      // 审批单id
      if (is.existy(applicationOrderId) && is.not.empty(applicationOrderId)) {
        params.application_order_id = applicationOrderId;
      }
      const result = yield call(updateExpenseTakeLeave, params);
      if (result && result.ok) {
        message.success('请求成功');
        payload.onSuccessCallback && payload.onSuccessCallback(result);
      } else {
        payload.onFailureCallback && payload.onFailureCallback(result);
      }
    },
    /**
     * 导出请假管理列表
     * @param {string} platforms 项目
     * @param {string} cities    城市
     * @param {string} districts 商圈
     * @param {string} takeLeaveType 请假类型
     * @param {string} takeLeaveId  请假id
     * @param {string} state     流程状态
     * @param {string} startDate 开始时间
     * @param {string} endDate   结束时间
     * @param {string} applyAccountId 用户id
     * @memberof module:model/expense/expenseTakeLeave/effects
     */
    * exportExpenseTakeLeave({ payload }) {
      const {
        page,
        limit,
        platforms,     // 项目
        cities,        // 城市
        districts,     // 商圈
        takeLeaveType, // 请假类型
        takeLeaveId,   // 请假id
        state,         // 流程状态
        startDate,     // 开始时间
        endDate,       // 结束时间
        applyAccountId, // 用户id
      } = payload;

      const params = {
        // 状态
        state: [10, 100, -100],
        _meta: RequestMeta.mapper({ page: page || 1, limit: limit || 30 }),
      };

      // 平台
      if (is.existy(platforms) && is.not.empty(platforms)) {
        params.platform_code = platforms;
      }

      // 城市
      if (is.existy(cities) && is.not.empty(cities)) {
        params.city_code = cities;
      }

      // 商圈
      if (is.existy(districts) && is.not.empty(districts)) {
        params.biz_district_id = districts;
      }

      // 请假类型
      if (is.existy(takeLeaveType) && is.not.empty(takeLeaveType)) {
        params.leave_type = takeLeaveType;
      }

       // 请假单号
      if (is.existy(takeLeaveId) && is.not.empty(takeLeaveId)) {
        params.leave_apply_order_id = takeLeaveId;
      }

      // 流程状态
      if (is.existy(state) && is.not.empty(state)) {
        params.state = [state];
      }

      // 开始时间
      if (is.existy(startDate) && is.not.empty(startDate)) {
        params.leave_start_at = startDate;
      }

      // 结束时间
      if (is.existy(endDate) && is.not.empty(endDate)) {
        params.leave_done_at = endDate;
      }

      // 我的
      if (is.existy(applyAccountId) && is.not.empty(applyAccountId)) {
        params.apply_account_id = applyAccountId;
      }

      // 请求服务器
      // const result = yield call(exportExpenseTakeLeave, params);
      // if (result && is.existy(result.record._id)) {
      //   message.success(`创建下载任务成功，任务id：${result.record._id}`);
      // } else {
      //   message.error(result.message);
      // }
    },
    /**
     * 重置出差管理数据
     * @todo 接口需升级优化
     * @memberof module:model/expense/expenseTakeLeave/effects
     */
    * resetExpenseTakeLeave({ payload }, { put }) {
      yield put({ type: 'reduceResetExpenseTakeLeave', payload: {} });
    },
    /**
     * 获取请假管理id详情
     * @todo fetchExpenseTakeLeaveDetail
     * @memberof module:model/expense/expenseTakeLeave/effects
     */
    * fetchExpenseTakeLeaveDetail({ payload }, { call, put }) {
      const { id } = payload; // 请假id
      // 参数
      const params = {};
       // 请假id
      if (is.existy(id) && is.not.empty(id)) {
        params.apply_order_id = id;
      }
      // 请求服务器
      const result = yield call(fetchExpenseTakeLeaveDetail, params);

      yield put({ type: 'reduceExpenseTakeLeaveDetail', payload: result });
    },

    /**
     * 导出EXCEL
     */
    * exportTakeLeave({ payload }, { call }) {
      const {
        onSuccessCallback,
        onFailureCallback,
      } = payload;

      const params = mapperData(payload, true);

      const result = yield call(exportTakeLeave, params);

      if (result && result.ok) {
        onSuccessCallback && onSuccessCallback();
      } else {
        onFailureCallback && onFailureCallback();
      }
    },
  },
  /**
   * @namespace expense/subject/reducers
   */
  reducers: {
    /**
     * 获取请假管理列表--我的
     * @returns {object} 更新 reduceExpenseTakeLeaveList
     * @memberof module:model/expense/expenseTakeLeave/reducers
     */
    reduceExpenseTakeLeaveList(state, action) {
      const expenseTakeLeaveMineList = action.payload;

      return { ...state, expenseTakeLeaveMineList };
    },
    /**
     * 重置数据
     * @returns {object}
     * @memberof module:model/expense/expenseTakeLeave/reducers
     */
    reduceResetExpenseTakeLeave(state) {
      return {
        ...state,
        expenseTakeLeaveMineList: {},
      };
    },
    /**
     * 获取出差单id详情
     * @returns {object}
     * @memberof module:model/expense/expenseTakeLeave/reducers
     */
    reduceExpenseTakeLeaveDetail(state, action) {
      return {
        ...state,
        expenseTakeLeaveDetail: action.payload,
      };
    },
  },
};
