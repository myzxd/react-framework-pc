/**
 *  CODE - 审批流
 * @module model/code/flow
 */
import {
  message,
} from 'antd';
import {
  getFlowList,
  getFlowSelectList,
  getFlowDetail,
  createFlowNode,
  updateFlowNode,
  deleteFlowNode,
  getSubjectList,
  getFlowNodeList,
  setFlowState,
  createFlow,
  updateFlow,
  getFlowCodeList,
  getFlowTeamList,
  getFlowPreview,
  getCodePaymentRule,
  onUpdatePaymentRule,
  getApplicantNodeCc,
  setCodeNodeCC,
} from '../../services/code/flow';
import {
  CodeFlowType,
  AffairsFlowNodeRelation,
  CodeFlowNodeOrganizationApproveType,
  CodeFlowState,
} from '../../application/define';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'codeFlow',

  /**
   * 状态树
   */
  state: {
    flowList: {}, // 审批流列表
    flowDetail: {}, // 审批流详情
    subjectList: {}, // 科目列表
    flowNodeList: {}, // 审批流节点列表
    flowCodeList: [], // 审批流适用code
    flowTeamList: [], // 审批流适用team
    flowPreviewList: [], // 审批流预览信息
    codePaymentRule: {}, // 付款规则
    applicantNodeCcInfo: {}, // 单个节点抄送数据
  },

  /**
   * @namespace code/flow/effects
   */
  effects: {
    /**
     * 审批流list
     * @memberof module:model/code/flow~code/flow/effects
     */
    *getFlowList({ payload }, { call, put }) {
      const { page = 1, limit = 30, name, type, state } = payload;
      const params = {
        _meta: { page, limit },
        state: [
          CodeFlowState.draft,
          CodeFlowState.normal,
          CodeFlowState.deactivate,
        ],
      };

      // 成本中心
      type && (params.cost_center_type = Number(type));
      // 状态
      state && !Array.isArray(state) && (params.state = [Number(state)]);
      state && Array.isArray(state) && (params.state = state);
      // 审批流name
      name && (params.name = name);

      const res = yield call(getFlowList, params);

      if (res && res.data) {
        yield put({ type: 'reduceFlowList', payload: res });
      }
    },

    /**
     * 重置审批流list
     */
    *resetFlowList({ payload }, { put }) {
      yield put({ type: 'reduceFlowList', payload: {} });
    },

    /**
     * 审批流Select下拉list
     * @memberof module:model/code/flow~code/flow/effects
     */
    *getFlowSelectList({ payload }, { call, put }) {
      const { page = 1, limit = 9999, type } = payload;
      const params = {
        _meta: { page, limit },
        state: [
          CodeFlowState.draft,
          CodeFlowState.normal,
          CodeFlowState.deactivate,
        ],
      };

      // 成本中心
      type && (params.cost_center_type = Number(type));

      const res = yield call(getFlowSelectList, params);

      if (res && res.data) {
        yield put({ type: 'reduceFlowSelectList', payload: res });
      }
    },

    /**
     * 重置审批流Select下拉list
     */
    *resetFlowSelectList({ payload }, { put }) {
      yield put({ type: 'reduceFlowSelectList', payload: {} });
    },

    /**
     * 审批流detail
     * @memberof module:model/code/flow~code/flow/effects
     */
    *getFlowDetail({ payload }, { call, put }) {
      const { id } = payload;
      if (!id) return message.error('缺少审批流id');
      const params = { _id: id };

      const res = yield call(getFlowDetail, params);
      if (res.zh_message) {
        // loading
        if (payload.onLoading) {
          payload.onLoading();
        }
      }

      if (res && res._id) {
        yield put({ type: 'reduceFlowDetail', payload: res });
        // loading
        if (payload.onLoading) {
          payload.onLoading();
        }
      }
    },

    /**
     * 重置审批流list
     */
    *resetFlowDetail({ payload }, { put }) {
      yield put({ type: 'reduceFlowDetail', payload: {} });
    },

    /**
     * 删除/启用/停用审批流
     */
    *setFlowState({ payload }, { call }) {
      const { flowId, state } = payload;
      if (!flowId) return message.error('缺少审批流id');

      const params = { _id: flowId, state };
      const res = yield call(setFlowState, params);

      return res;
    },

    /**
     * 审批流node list
     * @memberof module:model/code/flow~code/flow/effects
     */
    *getFlowNodeList({ payload }, { call, put }) {
      const { flowId } = payload;
      if (!flowId) return message.error('缺少审批流id');
      const params = {
        _meta: { page: 1, limit: 9999 },
        flow_id: flowId,
      };

      const res = yield call(getFlowNodeList, params);

      if (res && res.data) {
        yield put({ type: 'reduceFlowNodeList', payload: res });
      }
    },

    /**
     * 重置审批流list
     */
    *resetFlowNodeList({ payload }, { put }) {
      yield put({ type: 'reduceFlowNodeList', payload: {} });
    },

    /**
     * 新建/编辑审批流节点
     */
    *updateFlowNode({ payload }, { call }) {
      const {
        flowId, // 审批流id
        nodeId, // 节点id
        name, // 审批流name
        approveMode, // 审批规则
        isPaymentNode, // 标记付款
        isInspectBillNode, // 标记验票
        isCanUpdateMoney, // 是否可金额调控
        costUpdateRule, // 金额调控规则
        isSkip, // 是否条件跳过
        nodeApproveType, // 节点审批人设置
        approveDepartmentId, // 部门id
        approveDepartmentAccountType, // 部门审批人类型
        approveJobId, // 岗位id
        moneyPrefix, // 金额条件前置
        money, // 金额条件金额
        subjectPrefix, // 科目条件前置
        subject = [], // 科目条件科目
      } = payload;

      const params = {};

      // 新建节点需要传审批流id
      !nodeId && flowId && (params.flow_id = flowId);

      // 节点id
      nodeId && (params._id = nodeId);
      // 节点name
      name && (params.name = payload.name);
      // 审批规则
      approveMode && (params.approve_mode = Number(approveMode));
      // 调控
      isCanUpdateMoney !== undefined && (params.allow_update_money = isCanUpdateMoney);
      // 调控金额
      costUpdateRule && (params.cost_update_rule = Number(costUpdateRule));
      // 标记付款
      isPaymentNode !== undefined && (params.is_payment_node = isPaymentNode);
      // 标记验票
      isInspectBillNode !== undefined && (params.is_inspect_bill_node = isInspectBillNode);
      // 是否条件跳过
      isSkip !== undefined && (params.is_skip = isSkip);
      // 节点审批人设置（关系）
      nodeApproveType && (params.node_approve_type = nodeApproveType);
      // 部门id
      approveDepartmentId && (params.approve_department_id = approveDepartmentId);
      // 部门审批人类型
      approveDepartmentAccountType && (params.approve_department_account_type = approveDepartmentAccountType);
      // 岗位id
      approveJobId && (params.approve_department_job_id = approveJobId);

      // 审批流节点组织组织架构审批方式
      // 汇报关系 - 直接领导人
      if (nodeApproveType === AffairsFlowNodeRelation.report) {
        params.approve_department_account_type = CodeFlowNodeOrganizationApproveType.directLeader;
      }

      // 协作关系 - 指定岗位
      // if (nodeApproveType === AffairsFlowNodeRelation.coopera) {
        // params.organization_approve_type = CodeFlowNodeOrganizationApproveType.specialPost;
      // }

      if (isSkip) {
        params.skip_condition = [];
        // 金额条件
        moneyPrefix && money && (
          params.skip_condition[params.skip_condition.length] = {
            field: 'total_money',
            opt: moneyPrefix,
            num: money * 100,
          }
        );

        // 科目条件
        subjectPrefix && subject && (
          params.skip_condition[params.skip_condition.length] = {
            field: 'subject',
            opt: subjectPrefix,
            num: subject.reduce((ac, cr) => {
              const sData = cr.split('=');
              return [
                ...ac,
                { _id: sData[0], ac_code: sData[1] },
              ];
            }, []),
          }
        );
      }

      const res = payload.nodeId ?
        yield call(updateFlowNode, params)
        : yield call(createFlowNode, params);

      return res;
    },

    /**
     * 删除审批流节点
     */
    *deleteFlowNode({ payload }, { call }) {
      const { nodeId } = payload;
      // if (!flowId) return message.error('缺少审批流id');
      if (!nodeId) return message.error('缺少节点id');
      const params = {
        // _id: flowId,
        _id: nodeId,
      };

      const res = yield call(deleteFlowNode, params);
      return res;
    },

    /**
     * 科目list
     * @memberof module:model/code/flow~code/flow/effects
     */
    *getSubjectList({ payload }, { call, put }) {
      const { type } = payload;
      const params = {};

      // 适用类型
      type && (params.cost_center_type = Number(type));

      const res = yield call(getSubjectList, params);

      if (res && res.data) {
        yield put({ type: 'reduceSubjectList', payload: res });
      }
    },

    /**
     * 重置科目list
     */
    *resetSubjectList({ payload }, { put }) {
      yield put({ type: 'reduceSubjectList', payload: {} });
    },

    /**
     * 新增审批流
     */
    *createFlow({ payload }, { call }) {
      const params = {
        name: payload.name, // 名称
        biz_type: CodeFlowType.payment, // 审批流类型
      };

      const res = yield call(createFlow, params);
      return res;
    },

    /**
     * 编辑审批流
     */
    *updateFlow({ payload }, { call }) {
      const {
        flowId, // 审批流id
        name,
        type, // 适用成本中心场景
        code, // 适用code
        team, // 适用team
        applicationRule, // 合并审批
        highestPost, // 最高审批规则
        note, // 描述
        originCodeList,
        originTeamList,
      } = payload;

      if (!flowId) return message.error('缺少审批流id');

      const params = {
        _id: flowId,
        name,
        cost_center_types: type,
        code_list: [],
        team_list: [],
        application_rule: applicationRule,
      };

      // code
      if (Array.isArray(code) && code.length > 0) {
        // 全部
        if (code.includes({ _id: '*', name: '全部' })) {
          params.code_list = [{ _id: '*', name: '全部' }];
        } else {
          const codeList = code.map((i) => {
            const cData = i.split('=');
            // 父节点
            if (cData[0] === cData[1]) {
              return originCodeList[cData[0]].map((c) => {
                return { _id: c._id, name: c.name };
              });
            }
            return {
              _id: cData[0],
              name: cData[1],
            };
          });

          // 扁平数组
          params.code_list = [].concat(...codeList);
        }
      }

      // team
      if (Array.isArray(team) && team.length > 0) {
        // 全部
        if (team.includes({ _id: '*', name: '全部' })) {
          params.team_list = [{ _id: '*', name: '全部' }];
        } else {
          const teamList = team.map((i) => {
            const tData = i.split('=');
            // 父节点
            if (tData[0] === tData[1]) {
              return originTeamList[tData[0]].map((t) => {
                return { _id: t._id, name: t.name };
              });
            }
            return {
              _id: tData[0],
              name: tData[1],
            };
          });

          // 扁平数组
          params.team_list = [].concat(...teamList);
        }
      }


      // 最高岗位
      if (highestPost && Object.keys(highestPost).length > 0) {
        params.final_type = highestPost.type || null;
         // 标签
        params.final_approval_job_tags = highestPost.tags || [];
        // 岗位
        params.final_approval_job_ids = highestPost.post || [];
      }


      params.note = note || '';
      const res = yield call(updateFlow, params);
      return res;
    },

    /**
     * 获取审批流适用code list
     */
    *getFlowCodeList({ payload }, { call, put }) {
      const res = yield call(getFlowCodeList, {});

      if (res.zh_message) {
        // loading
        if (payload.onLoading) {
          payload.onLoading();
        }
      }
      if (res && res.data) {
        yield put({ type: 'reduceFlowCodeList', payload: res });
        // 成功回调
        if (payload.onLoading) {
          payload.onLoading();
        }
      }
    },

    /**
     * 重置审批流适用code list
     */
    *resetFlowCodeList({ payload }, { put }) {
      yield put({ type: 'reduceFlowCodeList', payload: {} });
    },

    /**
     * 获取审批流适用team list
     */
    *getFlowTeamList({ payload }, { call, put }) {
      const res = yield call(getFlowTeamList, {});

      if (res.zh_message) {
        // loading
        if (payload.onLoading) {
          payload.onLoading();
        }
      }
      if (res && res.data) {
        yield put({ type: 'reduceFlowTeamList', payload: res });
        // 成功回调
        if (payload.onLoading) {
          payload.onLoading();
        }
      }
    },

    /**
     * 重置审批流适用team list
     */
    *resetFlowTeamList({ payload }, { put }) {
      yield put({ type: 'reduceFlowTeamList', payload: {} });
    },

    /**
     * 获取审批流预览数据
     */
    *getFlowPreview({ payload }, { call, put }) {
      const params = { order_id: payload.orderId };
      const res = yield call(getFlowPreview, params);

      if (res) {
        yield put({ type: 'reduceFlowPreview', payload: res });
      }
    },

    /**
     * 重置审批流适用team list
     */
    *resetFlowPreview({ payload }, { put }) {
      yield put({ type: 'reduceFlowPreview', payload: {} });
    },

    /**
     * 获取付款规则
     */
    *getCodePaymentRule({ payload }, { call, put }) {
      const res = yield call(getCodePaymentRule, {});

      if (res) {
        yield put({ type: 'reduceCodePaymentRule', payload: res });
      }
    },

    /**
     * 重置付款规则
     */
    *resetCodePaymentRule({ payload }, { put }) {
      yield put({ type: 'reduceCodePaymentRule', payload });
    },

    /**
     * 编辑付款规则
     */
    *onUpdatePaymentRule({ payload }, { call }) {
      const {
        isAdjustment, // 是否允许调整
        adjustWay, // 调整规则
      } = payload;

      const params = {
        allow_update_money: isAdjustment,
        cost_update_rule: adjustWay,
      };

      const res = yield call(onUpdatePaymentRule, params);
      return res;
    },

    /**
     * 费用审批流申请节点设置抄送
     */
    *setCodeNodeCC({ payload }, { call }) {
      const {
        flowId,
        nodeId,
        fixedDep, // 固定抄送 - 部门/岗位
        flexibleDep, // 灵活抄送 - 部门/岗位
        fixedUser, // 固定抄送 - 成员
        flexibleUser, // 灵活抄送 - 成员
      } = payload;
      // 审批流id
      if (!flowId) return message.error('审批流id不能为空，无法添加审批流节点');
      const params = {
        flow_id: flowId,
        // flexible_cc_account: [],
        // flexible_cc_department_job_relation_ids: [],
        // flexible_cc_departments: [],
        // fixed_cc_account: [],
        // fixed_cc_department_job_relation_ids: [],
        // fixed_cc_departments: [],
      };

      // 节点id
      nodeId && (params.flow_node_id = nodeId);
      // 灵活抄送 - 成员
      Array.isArray(flexibleUser) && flexibleUser.length > 0 && (
        params.flexible_account_ids = flexibleUser
      );

      // 灵活抄送 - 部门/岗位
      if (Array.isArray(flexibleDep) && flexibleDep.length > 0) {
        // 部门与岗位关联id
        params.flexible_department_job_ids = flexibleDep.filter(i => i.jobId).map(i => i._id);
        // 部门id
        params.flexible_department_ids = flexibleDep.filter(i => !i.jobId).map(i => i._id);
      }

      // 固定抄送 - 成员
      Array.isArray(fixedUser) && fixedUser.length > 0
        && (params.fixed_account_ids = fixedUser);

      // 固定抄送 - 部门/岗位
      if (Array.isArray(fixedDep) && fixedDep.length > 0) {
         // 部门与岗位关联id
        params.fixed_department_job_ids = fixedDep.filter(i => i.jobId).map(i => i._id);
        // 部门id
        params.fixed_department_ids = fixedDep.filter(i => !i.jobId).map(i => i._id);
      }

      const res = yield call(setCodeNodeCC, params);
      if (res && res._id) {
        return res;
      }
      return undefined;
    },

    /**
     * 获取单个节点抄送数据
     */
    *getApplicantNodeCc({ payload }, { call, put }) {
      const {
        flowId, // 审批流id
        nodeId, // 节点id
      } = payload;

      const params = {
        flow_id: flowId,
      };

      nodeId && (params.flow_node_id = nodeId);

      const res = yield call(getApplicantNodeCc, params);
      if (res && res._id) {
        yield put({ type: 'reduceApplicantNodeCc', payload: res });
      }
    },
  },

  /**
   * @namespace code/flow/reducers
   */
  reducers: {
    /**
     * 更新审批流list
     * @returns {object} 更新 flowList
     * @memberof module:model/code/flow~code/flow/reducers
     */
    reduceFlowList(state, action) {
      let flowList = {};
      if (action.payload) {
        flowList = action.payload;
      }
      return { ...state, flowList };
    },

    /**
     * 更新审批流Select下拉list
     * @returns {object} 更新 flowList
     * @memberof module:model/code/flow~code/flow/reducers
     */
    reduceFlowSelectList(state, action) {
      let flowSelectList = {};
      if (action.payload) {
        flowSelectList = action.payload;
      }
      return { ...state, flowSelectList };
    },

    /**
     * 更新审批流detail
     * @returns {object} 更新 flowDetail
     * @memberof module:model/code/flow~code/flow/reducers
     */
    reduceFlowDetail(state, action) {
      let flowDetail = {};
      if (action.payload) {
        flowDetail = action.payload;
      }
      return { ...state, flowDetail };
    },

    /**
     * 更新审批流node list
     * @returns {object} 更新 flowNodeList
     * @memberof module:model/code/flow~code/flow/reducers
     */
    reduceFlowNodeList(state, action) {
      let flowNodeList = {};
      if (action.payload) {
        flowNodeList = action.payload;
      }
      return { ...state, flowNodeList };
    },

    /**
     * 更新科目list
     * @returns {object} 更新 subjectList
     * @memberof module:model/code/flow~code/flow/reducers
     */
    reduceSubjectList(state, action) {
      let subjectList = {};
      if (action.payload) {
        subjectList = action.payload;
      }
      return { ...state, subjectList };
    },

    /**
     * 更新审批流适用code list
     * @returns {object} 更新 flowCodeList
     * @memberof module:model/code/flow~code/flow/reducers
     */
    reduceFlowCodeList(state, action) {
      let flowCodeList = [];
      let originCodeList = {};
      if (action.payload) {
        const { data = {} } = action.payload;
        originCodeList = data;
        flowCodeList = Object.keys(data).map((code) => {
          return {
            _id: code,
            name: code,
            children: data[code],
          };
        });
      }

      return { ...state, flowCodeList, originCodeList };
    },

    /**
     * 更新审批流适用team list
     * @returns {object} 更新 flowTeamList
     * @memberof module:model/code/flow~code/flow/reducers
     */
    reduceFlowTeamList(state, action) {
      let flowTeamList = [];
      let originTeamList = {};
      if (action.payload) {
        const { data = {} } = action.payload;
        originTeamList = data;
        flowTeamList = Object.keys(data).map((team) => {
          return {
            _id: team,
            name: team,
            children: data[team],
          };
        });
      }

      return { ...state, flowTeamList, originTeamList };
    },

    /**
     * 更新审批流预览信息
     */
    reduceFlowPreview(state, action) {
      let flowPreviewList = [];
      if (action.payload) {
        flowPreviewList = action.payload;
      }
      return { ...state, flowPreviewList };
    },

    /**
     * 更新付款规则
     */
    reduceCodePaymentRule(state, action) {
      let codePaymentRule = {};
      if (action.payload) {
        codePaymentRule = action.payload;
      }
      return { ...state, codePaymentRule };
    },
    /**
     * 更新单个节点节点抄送数据
     */
    reduceApplicantNodeCc(state, action) {
      let applicantNodeCcInfo = {};
      if (action.payload) {
        applicantNodeCcInfo = action.payload;
      }
      return { ...state, applicantNodeCcInfo };
    },
  },
};
