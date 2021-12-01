/**
 * 系统设置管理
 *
 * @module model/system/manage
 */
import is from 'is_js';
import moment from 'moment';
import { message } from 'antd';

import {
  fetchCompanies,
  createCompany,
  updateCompany,
  fetchContractDetail,
  fetchContractConfigurationList,
  contractUpdateCreate,
  disableCompany,
  deleteContractConfiguration,
  getFeedBackList,
  setDealFeedBack,
  updateApproal,
  fetchApproal,
  fetchPreviewContract,
} from '../../services/common';
import { RequestMeta } from '../../application/object';
import { ThirdCompanyState, AllowElectionSign, ContractAttributionType } from '../../application/define';
import Modules from '../../application/define/modules';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'systemManage',

  /**
   * 状态树
   * @prop {array} companies 第三方公司
   */
  state: {
    companies: [],            // 第三方公司
    contractDetail: {},       // 合同归属详情
    configurationData: {},        // 合同配置列表
    approalInfo: [],           // 审批配置信息
    feedBackList: {}, // 意见反馈列表
    previewContract: {}, // 劳动者甲方- 预览合同
  },

  /**
   * @namespace system/manage/effects
   */
  effects: {
    /**
     *  更新审批配置
     * @param {object}
     */
    *updateApproal({ payload = {} }, { call }) {
      const params = {};

      // 新增子部门是否需要审批
      if (is.existy(payload.addSubDepartment) && is.not.empty(payload.addSubDepartment)) {
        params.add_sub_department = payload.addSubDepartment;
      }
      // 调整上级部门是否需要审批
      if (is.existy(payload.adjustDepartment) && is.not.empty(payload.adjustDepartment)) {
        params.adjust_department = payload.adjustDepartment;
      }
      // 添加部门下岗位是否需要审批
      if (is.existy(payload.addJob) && is.not.empty(payload.addJob)) {
        params.add_job = payload.addJob;
      }
      // 裁撤部门是否需要审批
      if (is.existy(payload.cutDepartment) && is.not.empty(payload.cutDepartment)) {
        params.cut_department = payload.cutDepartment;
      }
      // 增编是否需要审批
      if (is.existy(payload.addAuthorizedStrength) && is.not.empty(payload.addAuthorizedStrength)) {
        params.add_authorized_strength = payload.addAuthorizedStrength;
      }
      // 减编是否需要审批
      if (is.existy(payload.reduceAuthorizedStrength) && is.not.empty(payload.reduceAuthorizedStrength)) {
        params.reduce_authorized_strength = payload.reduceAuthorizedStrength;
      }


      const result = yield call(updateApproal, params);
      if (result.zh_message) {
        return message.error(result.zh_message);
      }
      if (is.existy(result) && is.not.empty(result)) {
        message.success('设置成功');
      }
    },
    /**
     * 获取审批配置信息
     * @param {array} configType 请求审批配置信息的 默认参数[20]
     */
    *fetchApproal({ payload = {} }, { call, put }) {
      // 请求审批配置信息 默认需要传
      const configTypeDefault = 20;

      const params = {
        config_type_list: [configTypeDefault],
      };
      const result = yield call(fetchApproal, params);
      if (result.zh_message) {
        return message.error(result.zh_message);
      }
      if (is.existy(result)) {
        yield put({ type: 'reduceApproalInfo', payload: result });
      }
    },
    /**
     * 劳动者甲方- 预览合同
     */
    *fetchPreviewContract({ payload = {} }, { call, put }) {
      const params = {
        _id: payload.id,
      };
      const result = yield call(fetchPreviewContract, params);
      if (result.zh_message) {
        payload.onLoading && payload.onLoading();
        return message.error(`请求错误：${result.zh_message}`);
      }
      if (is.existy(result)) {
        payload.onLoading && payload.onLoading();
        yield put({ type: 'reducePreviewContract', payload: result });
        return;
      }
      payload.onLoading && payload.onLoading();
    },

    /**
     * 第三方公司
     * @param {number} page 页码
     * @param {number} limit 每页条数
     * @param {array} suppliers 供应商
     * @param {number} state 状态
     * @param {string} name 公司名称
     * @param {string} companyId 公司id
     * @memberof module:model/system/manage~system/manage/effects
     */
    *fetchCompanies({ payload = {} }, { call, put }) {
      const params = {
        permission_id: Modules.ModuleAccount.id,
        _meta: RequestMeta.mapper(payload.meta),
      };
      // 状态
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = Number(payload.state);
      }
      // 类型
      params.type = payload.type ? Number(payload.type) : ContractAttributionType.laborder;
      // 公司名称
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }
      // 公司id
      if (is.existy(payload.companyId) && is.not.empty(payload.companyId)) {
        params._id = payload.companyId;
      }
      // 获取所属场景
      if (is.existy(payload.industry) && is.not.empty(payload.industry)) {
        params.industry_code = Number(payload.industry);
      }
      // 获取供应商
      if (is.existy(payload.suppliers) && is.not.empty(payload.suppliers)) {
        params.supplier_id = payload.suppliers;
      }
      // 获取城市
      if (is.existy(payload.cities) && is.not.empty(payload.cities)) {
        params.city_codes = payload.cities;
      }


      // 请求服务器
      const result = yield call(fetchCompanies, params);
      // 判断数据是否为空
      if (is.existy(result.data)) {
        yield put({ type: 'reduceCompanies', payload: result });
        // 成功的回调
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback();
        }
      }
    },

    /**
     * 重置第三方公司
     */
    *resetCompanies({ payload = {} }, { put }) {
      yield put({ type: 'reduceCompanies', payload: {} });
    },

    /**
     * 合同归属详情
     * @param {string} id 合同id
     * @memberof module:model/system/manage~system/manage/effects
     */
    *fetchContractDetail({ payload = {} }, { call, put }) {
      const params = {
      };
      // 公司id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }

      // 请求服务器
      const result = yield call(fetchContractDetail, params);
      // 判断数据是否为空
      if (is.existy(result)) {
        yield put({ type: 'reduceContractDetail', payload: result });
      }
    },

    /**
     * 合同归属配置列表
     * @param {string} id 合同id
     * @param {number} page 页码
     * @param {number} limit 每页条数
     * @memberof module:model/system/manage~system/manage/effects
     */
    *fetchContractConfigurationList({ payload = {} }, { call, put }) {
      const params = {
        _meta: RequestMeta.mapper({ page: payload.page || 1, limit: payload.limit || 30 }),
      };
      // 获取平台
      if (is.existy(payload.id) || is.not.empty(payload.id)) {
        params.third_part_id = payload.id;
      }

      // 请求服务器
      const result = yield call(fetchContractConfigurationList, params);
      // 判断数据是否为空
      if (is.existy(result)) {
        yield put({ type: 'reduceConfigurationList', payload: result });
      }
    },

    /**
     * 删除合同归属配置
     * @param {string} id 合同id
     * @memberof module:model/system/manage~system/manage/effects
     */
    *deleteContractConfiguration({ payload = {} }, { call }) {
      const params = {};
      // _id
      if (is.existy(payload.id) || is.not.empty(payload.id)) {
        params._id = payload.id;
      }

      // 请求服务器
      const result = yield call(deleteContractConfiguration, params);
      // 判断数据是否为空
      if (result.ok) {
        message.success('删除成功！');
        payload.onSuccessCallback();
      }
    },

    /**
     * 创建第三方公司（默认新创建的都是启用状态）
     * @param {string} name 公司名称
     * @param {string} supplier 供应商
     * @param {function} onSuccessCallback 成功回调
     * @memberof module:model/system/manage~system/manage/effects
     */
    *createCompany({ payload = {} }, { call }) {
      // 名称
      if (is.not.existy(payload.name) || is.empty(payload.name)) {
        return message.error('操作失败，名称不能为空');
      }

      // 是否允许电子签约
      if (is.not.existy(payload.allowElectionSign) || is.empty(payload.allowElectionSign)) {
        return message.error('操作失败，电子签约未选择');
      }

      // if (is.not.existy(payload.platforms) || is.empty(payload.platforms)) {
      // return message.error('操作失败，所属平台未选择');
      // }

      // if (is.not.existy(payload.supplier) || is.empty(payload.supplier)) {
      // return message.error('操作失败，所属供应商未选择');
      // }

      const allowElectionSign = AllowElectionSign.yes === Number(payload.allowElectionSign);
      const params = {
        name: payload.name,                 // 公司名称
        is_electronic_sign: allowElectionSign, // 电子签约
        // platform_codes: payload.platforms,          // 平台
        // supplier_ids: payload.supplier,            // 供应商
      };

      if (allowElectionSign) {
        // 法人
        if (is.not.existy(payload.legalPerson) || is.empty(payload.legalPerson)) {
          return message.error('操作失败，法人未填写');
        } else {
          params.legal_person = payload.legalPerson;
        }

        // 统一社会信用代码
        if (is.not.existy(payload.creditNo) || is.empty(payload.creditNo)) {
          return message.error('操作失败，统一社会信用代码未填写');
        } else {
          params.credit_no = payload.creditNo;
        }

        // 地址
        if (is.not.existy(payload.address) || is.empty(payload.address)) {
          return message.error('操作失败，地址未填写');
        } else {
          params.address = payload.address;
        }

        // 电话
        if (is.not.existy(payload.phone) || is.empty(payload.phone)) {
          return message.error('操作失败，电话未填写');
        } else {
          params.phone = payload.phone;
        }

        // 状态
        if (is.not.existy(payload.state) || is.empty(payload.state)) {
          return message.error('操作失败，状态未选择');
        } else {
          params.state = payload.state;
        }
      } else {
        // 法人
        if (is.existy(payload.legalPerson) && is.not.empty(payload.legalPerson)) {
          params.legal_person = payload.legalPerson;
        }

        // 统一社会信用代码
        if (is.existy(payload.creditNo) && is.not.empty(payload.creditNo)) {
          params.credit_no = payload.creditNo;
        }

        // 地址
        if (is.existy(payload.address) && is.not.empty(payload.address)) {
          params.address = payload.address;
        }

        // 电话
        if (is.existy(payload.phone) && is.not.empty(payload.phone)) {
          params.phone = payload.phone;
        }

        // 状态
        if (is.existy(payload.state) && is.not.empty(payload.state)) {
          params.state = payload.state;
        }
      }

      // 类型
      if (is.existy(payload.type) && is.not.empty(payload.type)) {
        params.type = Number(payload.type);
      }

      // 请求服务器
      const result = yield call(createCompany, params);

      // 判断数据是否为空
      if (is.existy(result.ok)) {
        message.success('创建成功');

        // 成功的回调函数
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
      } else if (result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },

    /**
     * 更新第三方公司
     * @param {string} industry 所属场景
     * @param {string'} suppliers 供应商
     * @param {array} cities 城市
     * @param {function} onSuccessCallback 成功回调
     * @memberof module:model/system/manage~system/manage/effects
     */
    *updateCompany({ payload = {} }, { call }) {
      const params = {};
      // 获取平台
      if (is.existy(payload.id) || is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      // 获取所属场景
      if (is.existy(payload.industry) || is.not.empty(payload.industry)) {
        params.industry_code = Number(payload.industry);
      }
      // 获取供应商
      if (is.existy(payload.suppliers) || is.not.empty(payload.suppliers)) {
        params.supplier_id = payload.suppliers;
      }
      // 获取城市
      if (is.existy(payload.cities) || is.not.empty(payload.cities)) {
        params.city_codes = payload.cities;
      }
      // 合同模版
      if (is.existy(payload.template) || is.not.empty(payload.template)) {
        params.template_id = payload.template;
      }

      // 请求服务器
      const result = yield call(updateCompany, params);

      // 判断数据是否为空
      if (!is.existy(result.ok)) {
        if (result.zh_message) {
          message.error(result.zh_message);
        }
        return;
      }
      message.success('更新成功');
      // 成功的回调函数
      if (payload.onSuccessCallback) {
        payload.onSuccessCallback(result);
      }
    },

    /**
     * 合同归属编辑中的新建
     * @param {string} industry 所属场景
     * @param {string'} suppliers 供应商
     * @param {array} cities 城市
     * @param {function} onSuccessCallback 成功回调
     * @memberof module:model/system/manage~system/manage/effects
     */
    *contractUpdateCreate({ payload = {} }, { call }) {
      const params = {};
      // 获取平台
      if (is.existy(payload.id) || is.not.empty(payload.id)) {
        params.third_part_id = payload.id;
      }
      // 获取所属场景
      if (is.existy(payload.industry) || is.not.empty(payload.industry)) {
        params.industry_code = Number(payload.industry);
      }
      // 获取供应商
      if (is.existy(payload.suppliers) || is.not.empty(payload.suppliers)) {
        params.supplier_id = payload.suppliers;
      }
      // 获取城市
      if (is.existy(payload.cities) || is.not.empty(payload.cities)) {
        params.city_codes = payload.cities;
      }
      // 合同模版
      if (is.existy(payload.template) || is.not.empty(payload.template)) {
        params.template_id = payload.template;
      }
      // 请求服务器
      const result = yield call(contractUpdateCreate, params);
      // 判断数据是否为空
      if (!is.existy(result.ok)) {
        if (result.zh_message) {
          message.error(result.zh_message);
        }
        return;
      }
      message.success('新建成功');
      // 成功的回调函数
      if (payload.onSuccessCallback) {
        payload.onSuccessCallback(result);
      }
    },

    /**
     * 禁用第三方公司
     * @param {string} recordId 数据id
     * @param {function} onSuccessCallback 成功回调
     * @memberof module:model/system/manage~system/manage/effects
     */
    *disableCompany({ payload = {} }, { call }) {
      const params = {
        third_part_id: payload.recordId,
        state: ThirdCompanyState.off,
        onSuccessCallback: payload.onSuccessCallback,
        type: payload.type,
      };
      // 请求服务器
      const result = yield call(disableCompany, params);

      // 判断数据是否为空
      if (!is.existy(result.ok) && result.zh_message) {
        return message.error(result.zh_message);
      }
      if (result.ok) {
        message.success('更新成功');
        // 成功的回调函数
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
      }
    },

    /**
     * 启用第三方公司
     * @param {string} recordId 数据id
     * @param {function} onSuccessCallback 成功回调
     * @memberof module:model/system/manage~system/manage/effects
     */
    *enableCompany({ payload = {} }, { call }) {
      const params = {
        third_part_id: payload.recordId,
        state: ThirdCompanyState.on,
        onSuccessCallback: payload.onSuccessCallback,
        type: payload.type,
      };
      // 请求服务器
      const result = yield call(disableCompany, params);

      // 判断数据是否为空
      if (!is.existy(result.ok) && result.zh_message) {
        return message.error(result.zh_message);
      }
      if (result.ok) {
        message.success('更新成功');
      // 成功的回调函数
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
      }
    },

    /**
     * 获取意见反馈列表
     */
    *getFeedBackList({ payload = {} }, { call, put }) {
      const {
        setLoading,
      } = payload;
      const params = {
        _meta: {
          page: payload.page || 1,
          limit: payload.limit || 30,
        },
      };

      const res = yield call(getFeedBackList, params);
      setLoading && setLoading();

      if (res && res.data) {
        yield put({ type: 'reduceFeedBackList', payload: res });
      }
    },

    /**
     * 重置意见反馈列表
     */
    *resetFeedBackList({ payload = {} }, { put }) {
      yield put({ type: 'reduceFeedBackList', payload: {} });
    },

    /**
     * 处理意见
     */
    *setDealFeedBack({ payload = {} }, { call }) {
      const {
        feedBackId, // 意见反馈id
        handleAt, // 处理时间
        handleNote, // 处理意见
      } = payload;
      const params = {};
      // 处理时间
      handleAt && (params.handle_at = moment(handleAt).format('YYYY-MM-DD HH:mm:00'));
      // 意见反馈id
      feedBackId && (params._id = feedBackId);
      handleNote && (params.handle_note = handleNote);

      payload.note && (params.note = payload.note);

      const res = yield call(setDealFeedBack, params);
      return res;
    },
  },

  /**
   * @namespace system/manage/reducers
   */
  reducers: {
    /**
     * @returns {object} 获取审批配置信息
     */
    reduceApproalInfo(state, action) {
      return { ...state, approalInfo: action.payload };
    },
    /**
     * @returns {object} 劳动者甲方- 预览合同
     */
    reducePreviewContract(state, action) {
      return { ...state, previewContract: action.payload };
    },
    /**
     * 第三方公司
     * @return {object} 更新 companies
     * @memberof module:model/system/manage~system/manage/reducers
     */
    reduceCompanies(state, action) {
      return { ...state, companies: action.payload };
    },
    /**
     * 合同归属详情
     * @return {object} 更新 contractDetail
     * @memberof module:model/system/manage~system/manage/reducers
     */
    reduceContractDetail(state, action) {
      return { ...state, contractDetail: action.payload };
    },
    /**
     * 合同归属配置列表
     * @return {object} 更新 configurationData
     * @memberof module:model/system/manage~system/manage/reducers
     */
    reduceConfigurationList(state, action) {
      return { ...state, configurationData: action.payload };
    },

    /**
     * 重置意见反馈列表
     */
    reduceFeedBackList(state, action) {
      let feedBackList = {};
      if (action.payload && action.payload.data) {
        feedBackList = action.payload;
      }
      return { ...state, feedBackList };
    },
  },
};
