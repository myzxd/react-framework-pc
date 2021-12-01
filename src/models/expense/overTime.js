/**
 *  加班申请 models/expense/overTime
 */

import is from 'is_js';
import moment from 'moment';
import {
  message,
} from 'antd';

import {
  getOverTimeList,
  getOverTimeDetail,
  createOverTime,
  updateOverTime,
  exportOverTime,
} from '../../services/expense/overTime';
import { RequestMeta } from '../../application/object';
import { ExpenseOverTimeTabType } from '../../application/define';

// 处理数据
const mapperOverTimeOrder = (payloads) => {
  // 将原数据深拷贝一份，避免提交的时候要修改数据，会影响到原始数据（如：分摊金额 * 100）
  const payload = JSON.parse(JSON.stringify(payloads));
  const {
    orderId, // 审批单id
    actualOverTimePerson, // 实际加班人
    platform, // 香蜜
    city, // 城市
    district, // 退队
    themeTag, // 主题标签
    standardWorkHours, // 标准工时
    dataUrl, // 资料地址
    note, // 加班事由及成果
    fileList, // 附件
    startTime, // 开始时间
    endTime, // 结束时间
  } = payload;
  // 处理时间
  const startTimeDate = moment(startTime).format('YYYY-MM-DD HH:mm:ss');
  const endTimeDate = moment(endTime).format('YYYY-MM-DD HH:mm:ss');

  const params = {
    apply_application_order_id: orderId,
    actual_apply_name: actualOverTimePerson,
    platform_code: platform,
    city_code: city,
    biz_district_id: district,
    start_at: startTimeDate,
    end_at: endTimeDate,
  };

  // 主题标签
  if (is.existy(themeTag) && is.not.empty(themeTag)) {
    params.tags = Array.isArray(themeTag) ? themeTag : [themeTag];
  }

  // 标准工时
  if (is.existy(standardWorkHours) && is.not.empty(standardWorkHours)) {
    params.working_hours = `${standardWorkHours}`;
  }

  // 资料地址
  if (is.existy(dataUrl) && is.not.empty(dataUrl)) {
    params.info_address = dataUrl;
  }

  // 时长
  if (is.existy(startTime) && is.existy(endTime)) {
    const time = moment(endTime).diff(moment(startTime), 'minutes') / 60;
    params.duration = time % 1 === 0 ? time : time.toFixed(1);
  }

  // 加班事由
  if (is.existy(note) && is.not.empty(note)) {
    params.reason = note;
  }

  // 附件
  if (is.existy(fileList) && is.not.empty(fileList)) {
    params.asset_ids = fileList;
  }

  return params;
};

// 查询参数
const mapperOverTimeFind = (val = {}, isExport = false) => {
  const {
    page,
    limit,
    orderId, // 加班单号
    applyOverTimePerson, // 实际加班人
    themeTag, // 主题标签
    state, // 流程状态
    startTime, // 加班时间
    endTime, // 结束时间
    applyAccountId, // 账户id
  } = val;

  const params = {
    // 状态
    state: [1, 10, 100, -100],
  };

  if (isExport === false) {
    params._meta = RequestMeta.mapper({ page: page || 1, limit: limit || 30 });
  }

  // 加班单号
  if (is.existy(orderId) && is.not.empty(orderId)) {
    params.apply_order_id = orderId;
  }

  // 实际加班人
  if (is.existy(applyOverTimePerson) && is.not.empty(applyOverTimePerson)) {
    params.actual_apply_name = applyOverTimePerson;
  }

  // 主题标签
  if (is.existy(themeTag) && is.not.empty(themeTag)) {
    params.tags = themeTag;
  }

  // 流程状态
  if (is.existy(state) && is.not.empty(state)) {
    params.state = Array.isArray(state) ? state : [state];
  }

  // 加班时间 - 开始
  if (is.existy(startTime) && is.not.empty(startTime)) {
    params.start_min_at = moment(startTime[0]).format('YYYY-MM-DD HH:mm:ss');
    params.start_max_at = moment(startTime[1]).format('YYYY-MM-DD HH:mm:ss');
  }

  // 加班时间 - 结束
  if (is.existy(endTime) && is.not.empty(endTime)) {
    params.end_min_at = moment(endTime[0]).format('YYYY-MM-DD HH:mm:ss');
    params.end_max_at = moment(endTime[1]).format('YYYY-MM-DD HH:mm:ss');
  }

  // 申请人id
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
  namespace: 'expenseOverTime',
  /**
   * 状态树
   * @prop {object}
   */
  state: {
    overTimeMineList: {
      data: [],
      _meta: {},
    }, // 加班申请列表-我的
    overTimeAllList: {
      data: [],
      _meta: {},
    }, // 加班申请列表-全部
    overTimeDetail: {},   // 加班申请单详情
  },

  /**
   * @namespace expense/subject/effects
   */
  effects: {
    /**
     * 获取加班申请列表
     * @param {string} applyUserName 实际加班人
     * @memberof module:model/expense/overTime/effects
     */
    * fetchOverTimeList({ payload = {} }, { call, put }) {
      const {
        selectKey, // 加班tab key
      } = payload;

      const params = mapperOverTimeFind(payload);

      // 请求服务器
      const result = yield call(getOverTimeList, params);

      // 判断数据是否为空
      if (is.existy(result)) {
        if (selectKey === `${ExpenseOverTimeTabType.mine}`) {
          yield put({ type: 'reduceOverTimeMine', payload: result });
        } else {
          yield put({ type: 'reduceOverTimeAll', payload: result });
        }
      }
    },

    /**
     * 重置加班管理数据
     * @todo 接口需升级优化
     * @memberof module:model/expense/overTime/effects
     */
    * resetOverTimeList({ payload }, { put }) {
      yield put({ type: 'reduceOverTimeList', payload: {} });
    },

    /**
     * 获取加班单详情
     * @todo getoverTimeDetail
     * @memberof module:model/expense/overTime/effects
     */
    * fetchOverTimeDetail({ payload }, { call, put }) {
      const {
        overTimeId, // 加班单id
      } = payload;

      if (is.empty(overTimeId) || is.not.existy(overTimeId)) {
        return message.error('获取加班单详情错误，请填写加班单id');
      }

      const params = {
        apply_order_id: overTimeId,
      };

      // 请求服务器
      const result = yield call(getOverTimeDetail, params);

      yield put({ type: 'reduceOverTimeDetail', payload: result });
    },

    /**
     * 加班单新建
     * @memberof module:model/expense/overTime/effects
     */
    * createOverTime({ payload = {} }, { call }) {
      const {
        orderId, // 审批单id
        onSuccessCallback, // 成功回调
        onFailureCallback, // 失败回调
      } = payload;

      if (is.empty(orderId) || is.not.existy(orderId)) {
        return message.error('创建加班单错误，请填写审批单id');
      }

      const params = {
        ...mapperOverTimeOrder(payload),
        orderId,
        storage_type: 3, // 上传文件的类型
      };
      // 判断开始时间与结束时间是否相等
      if (params.start_at === params.end_at) {
        return message.error('结束时间不能等于开始时间');
      }
      // 判断加班时长是否为0
      if (params.duration === 0) {
        return message.error('加班时长不能为0');
      }

      const result = yield call(createOverTime, params);

      if (result && result.ok) {
        onSuccessCallback && onSuccessCallback(result);
      } else {
        onFailureCallback && onFailureCallback(result);
      }
    },

    /**
     * 加班单编辑
     * @memberof module:model/expense/overTime/effects
     */
    * updateOverTime({ payload = {} }, { call }) {
      const {
        orderId, // 审批单id
        overTimeId, // 加班单id
        onSuccessCallback, // 成功回调
        onFailureCallback, // 失败回调
      } = payload;

      // 审批单id
      if (is.empty(orderId) || is.not.existy(orderId)) {
        return message.error('编辑加班单错误，请填写审批单id');
      }

      // 加班单id
      if (is.empty(overTimeId) || is.not.existy(overTimeId)) {
        return message.error('编辑加班单错误，请填写加班单id');
      }

      const params = {
        ...mapperOverTimeOrder(payload),
        orderId,
        apply_order_id: overTimeId,
        storage_type: 3, // 上传文件的类型
      };
      // 判断加班时长是否为0
      if (params.duration === 0) {
        return message.error('加班时长不能为0');
      }

      const result = yield call(updateOverTime, params);

      if (result && result.ok) {
        onSuccessCallback && onSuccessCallback(result);
      } else {
        onFailureCallback && onFailureCallback(result);
      }
    },

    /**
     * 导出加班EXCEL
     */
    * exportOverTime({ payload = {} }, { call }) {
      const {
        onSuccessCallback,
        onFailureCallback,
      } = payload;

      // 参数
      const params = mapperOverTimeFind(payload, true);

      const result = yield call(exportOverTime, params);

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
     * 加班管理列表--我的
     * @returns {object} 更新 reduceOverTimeMine
     * @memberof module:model/expense/overTime/reducers
     */
    reduceOverTimeMine(state, action) {
      let overTimeMineList = {};

      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        overTimeMineList = action.payload;
      }

      return { ...state, overTimeMineList };
    },

    /**
     * 加班管理列表--全部
     * @returns {object} 更新 reduceExpenseOverTimeAll
     * @memberof module:model/expense/overTime/reducers
     */
    reduceOverTimeAll(state, action) {
      let overTimeAllList = {};

      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        overTimeAllList = action.payload;
      }

      return { ...state, overTimeAllList };
    },

    /**
     * 重置数据
     * @returns {object}
     * @memberof module:model/expense/overTime/reducers
     */
    reduceOverTimeList(state) {
      const overTimeMineList = {}; // 我的
      const overTimeAllList = {}; // 全部

      return {
        ...state,
        overTimeMineList,
        overTimeAllList,
      };
    },

    /**
     * 获取加班单详情
     * @returns {object}
     * @memberof module:model/expense/overTime/reducers
     */
    reduceOverTimeDetail(state, action) {
      let overTimeDetail = {};

      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        overTimeDetail = action.payload;
      }

      return {
        ...state,
        overTimeDetail,
      };
    },
  },
};
