/**
 *  CODE - 事项配置
 * @module model/code/matter
 */
import _ from 'lodash';
import is from 'is_js';
import {
  message,
} from 'antd';
import {
  CodeCostCenterType,
} from '../../application/define';
import {
  getMatterTree,
  getMatterDetail,
  updateMatter,
  createMatterLink,
  updateMatterLink,
  deleteMatterLink,
  getTeamList,
  getMatterLinkList,
  getMatterLinkDetail,
  markCollectLink,
  getCollectLinkList,
  checkSubmit,
} from '../../services/code/matter';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'codeMatter',

  /**
   * 状态树
   */
  state: {
    matterTree: [], // 事项树
    matterDetail: {}, // 事项详情
    teamList: {}, // team
    matterLinkList: {}, // 事项链接列表
    matterLinkDetail: {}, // 事项链接详情
    linkIconList: {}, // 事项联机icon列表
  },

  /**
   * @namespace code/matter/effects
   */
  effects: {
    /**
     * 事项tree
     * @memberof module:model/code/matter~code/matter/effects
     */
    *getMatterTree({ payload }, { call, put }) {
      const { type = CodeCostCenterType.code } = payload;
      const params = {
        scene_type: Number(type), // 类型
      };

      const res = yield call(getMatterTree, params);

      if (res) {
        yield put({ type: 'reduceMatterTree', payload: res });
      }
    },

    /**
     * 重置事项树
     */
    *resetMatterTree({ payload }, { put }) {
      yield put({ type: 'reduceMatterTree', payload: {} });
    },

    /**
     * 事项详情
     * @memberof module:model/code/matter~code/matter/effects
     */
    *getMatterDetail({ payload }, { call, put }) {
      // 事项id
      const { matterId } = payload;
      if (!matterId) return message.error('缺少事项id');
      const params = { _id: matterId };

      const res = yield call(getMatterDetail, params);

      if (res && res._id) {
        yield put({ type: 'reduceMatterDetail', payload: res });
      }
    },

    /**
     * 重置事项详情
     */
    *resetMatterDetail({ payload }, { put }) {
      yield put({ type: 'reduceMatterDetail', payload: {} });
    },

    /**
     * 编辑事项
     */
    *updateMatter({ payload }, { call }) {
      const { matterId, name } = payload;
      if (!matterId) return message.error('缺少事项id');
      const params = { _id: matterId };
      // 名称
      name && (params.name = name);
      // 说明
      if (payload.note) {
        params.note = payload.note;
      } else {
        params.note = '';
      }

      const res = yield call(updateMatter, params);
      return res;
    },

    /**
     * 新增事项link
     */
    *createMatterLink({ payload }, { call }) {
      const {
        matterId,
        title,
        note,
        icon,
        flowId,
        subject,
        team,
        isAll,
        depAndPostVals,
        code,
      } = payload;
      if (!matterId) return message.error('缺少事项id');
      const params = {
        scene_id: matterId, // 事项id
        name: title, // 链接标题
        flow_id: flowId, // 链接审批流
        icon, // icon
        note, // 说明
      };
      // 科目
      subject && (params.allow_accouting_ids = subject);
      // team
      team && (params.allow_team_ids = team);
      // code
      code && (params.allow_code_ids = code);
      // 是否特定范围提报
      isAll !== undefined && (params.is_all = isAll);

      // 处理部门与岗位
      if (Array.isArray(depAndPostVals) && depAndPostVals.length > 0) {
        // 部门
        const depList = depAndPostVals.filter(d => d.jobId === undefined).map(i => i.value);
        // 岗位
        const postList = depAndPostVals.filter(d => d.jobId !== undefined).map(i => i.value);
        params.allow_department_ids = isAll === false ? _.uniqWith(depList, _.isEqual) : [];
        params.allow_department_job_ids = isAll === false ? _.uniqWith(postList, _.isEqual) : [];
      }

      const res = yield call(createMatterLink, params);
      return res;
    },

    /**
     * 编辑事项link
     */
    *updateMatterLink({ payload }, { call }) {
      const {
        linkId,
        title,
        note,
        icon,
        flowId,
        subject,
        team,
        depAndPostVals,
        code,
        isAll,
        dep,
      } = payload;
      if (!linkId) return message.error('缺少链接id');
      const params = { _id: linkId };
      title && (params.name = title); // 链接标题
      note && (params.note = note); // 说明
      icon && (params.icon = icon); // icon
      flowId && (params.flow_id = flowId); // 链接审批流
      subject && (params.allow_accouting_ids = subject); // 科目
      team && (params.allow_team_ids = team); // team
      code && (params.allow_code_ids = code); // code
      isAll !== undefined && (params.is_all = isAll); // 是否特定范围提报

      // 处理部门与岗位
      if (Array.isArray(depAndPostVals) && depAndPostVals.length > 0) {
        // 部门
        const depList = depAndPostVals.filter(d => d.jobId === undefined).map(i => i.value);
        // 岗位
        const postList = depAndPostVals.filter(d => d.jobId !== undefined).map(i => i.value);

        const dealDep = depList.filter(d => dep.includes(d));
        const dealPost = postList.filter(d => dep.includes(d));
        params.allow_department_ids = _.uniqWith(dealDep, _.isEqual);
        params.allow_department_job_ids = _.uniqWith(dealPost, _.isEqual);
      }

      const res = yield call(updateMatterLink, params);
      return res;
    },

    /**
     * 删除事项link
     */
    *deleteMatterLink({ payload }, { call }) {
      const { id } = payload;
      if (!id) return message.error('缺少链接id');
      const params = { _id: id };

      const res = yield call(deleteMatterLink, params);
      return res;
    },

    /**
     * team list
     * @memberof module:model/code/flow~code/flow/effects
     */
    *getTeamList({ payload }, { call, put }) {
      const { flowId, subject, tabKey } = payload;
      const params = {
        cost_center_type: Number(tabKey),
      };

      // 审批流id
      flowId && (params.flow_id = flowId);

      // 科目ids
      subject && !(subject.length === 1 && subject.includes('*')) && (params.account_ids = subject);

      const res = yield call(getTeamList, params);

      if (res) {
        yield put({ type: 'reduceTeamList', payload: res });
      }
    },

    /**
     * 重置team list
     */
    *resetTeamList({ payload }, { put }) {
      yield put({ type: 'reduceTeamList', payload: {} });
    },

    /**
     * 事项链接列表find
     * @memberof module:model/code/flow~code/flow/effects
     */
    *getMatterLinkList({ payload }, { call, put }) {
      const { matterId } = payload;
      if (!matterId) return message.error('缺少事项id');
      const params = {
        _meta: { page: 1, limit: 9999 },
        scene_id: matterId,
      };

      const res = yield call(getMatterLinkList, params);

      if (res && res.data) {
        yield put({ type: 'reduceMatterLinkList', payload: res });
      }
    },

    /**
     * 重置team list
     */
    *resetMatterLinkList({ payload }, { put }) {
      yield put({ type: 'reduceMatterLinkList', payload: {} });
    },

    /**
     * 事项链接详情
     * @memberof module:model/code/matter~code/matter/effects
     */
    *getMatterLinkDetail({ payload }, { call, put }) {
      // 链接id
      const { linkId } = payload;
      if (!linkId) return message.error('缺少事项id');
      const params = { _id: linkId };

      const res = yield call(getMatterLinkDetail, params);

      if (res && res._id) {
        yield put({ type: 'reduceMatterLinkDetail', payload: res });
      }
    },

    /**
     * 重置事项详情
     */
    *resetMatterLinkDetail({ payload }, { put }) {
      yield put({ type: 'reduceMatterLinkDetail', payload: {} });
    },

    /**
     * 收藏/取消收藏链接
     */
    *markCollectLink({ payload }, { call }) {
      const params = {
        link_id: payload.linkId,
        state: payload.state,
      };
      const res = yield call(markCollectLink, params);
      return res;
    },

    /**
     * 获取收藏链接list
     */
    *getCollectLinkList({ payload }, { call, put }) {
      const { setLoading } = payload;
      const res = yield call(getCollectLinkList, {});
      setLoading && setLoading(false);
      if (res) {
        yield put({ type: 'reduceCollectLinkList', payload: res });
      }
    },

    /**
     * 重置收藏链接list
     */
    *resetCollectLinkList({ payload }, { put }) {
      yield put({ type: 'reduceCollectLinkList', payload: {} });
    },

    /**
     * code首页提报校验
     */
    *checkSubmit({ payload }, { call }) {
      const params = {
        link_id: payload.linkId,
      };

      const res = yield call(checkSubmit, params);

      return res;
    },
  },

  /**
   * @namespace code/matter/reducers
   */
  reducers: {
    /**
     * 事项tree
     * @returns {object} 更新 matterTree
     * @memberof module:model/code/matter~code/matter/reducers
     */
    reduceMatterTree(state, action) {
      let matterTree = {};
      if (action.payload) {
        matterTree = action.payload;
      }
      return { ...state, matterTree };
    },

    /**
     * 事项详情
     * @returns {object} 更新 matterDetail
     * @memberof module:model/code/matter~code/matter/reducers
     */
    reduceMatterDetail(state, action) {
      let matterDetail = {};
      if (action.payload) {
        matterDetail = action.payload;
      }
      return { ...state, matterDetail };
    },

    /**
     * 更新team list
     * @returns {object} 更新 teamList
     * @memberof module:model/code/flow~code/flow/reducers
     */
    reduceTeamList(state, action) {
      let teamList = {};
      if (action.payload) {
        teamList = action.payload;
      }
      return { ...state, teamList };
    },

    /**
     * 更新事项链接列表
     * @returns {object} 更新 matterLinkList
     * @memberof module:model/code/flow~code/flow/reducers
     */
    reduceMatterLinkList(state, action) {
      let matterLinkList = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        matterLinkList = action.payload;
      }
      return { ...state, matterLinkList };
    },

    /**
     * 更新事项链接详情
     * @returns {object} 更新 matterLinkDetail
     * @memberof module:model/code/flow~code/flow/reducers
     */
    reduceMatterLinkDetail(state, action) {
      let matterLinkDetail = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        matterLinkDetail = action.payload;
      }
      return { ...state, matterLinkDetail };
    },

    /**
     * 更新收藏链接list
     * @returns {object} 更新 collectLinkList
     * @memberof module:model/code/flow~code/flow/reducers
     */
    reduceCollectLinkList(state, action) {
      let collectLinkList = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        collectLinkList = action.payload;
      }
      return { ...state, collectLinkList };
    },
  },
};
