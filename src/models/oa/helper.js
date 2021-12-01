/**
 * oa modal 层工具类
 */
import is from 'is_js';
import dot from 'dot-prop';
import { message } from 'antd';

// payload参数映射处理（事务性单据提交不需要抄送信息）
function OAPayloadMapper(payload) {
  const mapper = {};

  // 审批流id为必填参数
  if (is.not.existy(payload.flowId) || is.empty(payload.flowId)) {
    message.error('提示：没有适用审批流，请联系集团人力资源部');
    // 失败回调
    payload.onErrorCallback && payload.onErrorCallback();
    return false;
  }

  // 抄送信息 - 岗位
  // const copyGivedepartments = dot.get(payload, 'copyGive.departmentNames', []);
  // 抄送信息 - 用户
  // const copyGiveusers = dot.get(payload, 'copyGive.userNames', []);

  // 抄送信息 - 用户
  // if (is.existy(copyGiveusers) && is.not.empty(copyGiveusers)) {
    // mapper.cc_account_ids = copyGiveusers.map(v => v._id);
  // }
  // 抄送信息 - 岗位
  // if (is.existy(copyGivedepartments) && is.not.empty(copyGivedepartments)) {
    // mapper.cc_department_ids = copyGivedepartments.map(v => v._id);
  // }
  // 主题标签
  if (is.existy(payload.themeTag) && is.not.empty(payload.themeTag)) {
    mapper.theme_label_list = payload.themeTag;
  }
  // 审批流id
  mapper.oa_flow_id = payload.flowId;

  return mapper;
}

// 事务性审批单提交 payload mapper
function OAOrderdMapper(payload) {
  const mapper = {};

  // 抄送信息 - 岗位
  const copyGivedepartments = dot.get(payload, 'copyGive.departmentNames', []);
  // 抄送信息 - 用户
  const copyGiveusers = dot.get(payload, 'copyGive.userNames', []);

  // 抄送信息 - 用户
  if (is.existy(copyGiveusers) && is.not.empty(copyGiveusers)) {
    mapper.cc_account_ids = copyGiveusers.map(v => v._id);
  }
  // 抄送信息 - 岗位
  if (is.existy(copyGivedepartments) && is.not.empty(copyGivedepartments)) {
    mapper.cc_department_ids = copyGivedepartments.map(v => v._id);
  }
  // 主题标签
  if (is.existy(payload.themeTag) && is.not.empty(payload.themeTag)) {
    mapper.theme_label_list = payload.themeTag;
  }
  return mapper;
}

export {
  OAPayloadMapper,
  OAOrderdMapper,
};
