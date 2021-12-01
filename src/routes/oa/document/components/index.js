/**
 * 公共组件
 */
import PageCreateWapper from './wapper/create';
import PageUpdateWapper from './wapper/update';
import PageDetailWapper from './wapper/detail';
import PageSubmitButtons from './form/submit';
import PageUpdateButtons from './form/update';
import PageFormButtons from './form/buttons';
import PageFlowButton from './flow/button';
import PageExpenseButton from './expense/button';
import PageBaseInfo from './basisInfo.jsx';
import PageEmployeesSelect from './employeesSelect.jsx';
import PageComponentThemeTag from './themeTag.js';
import PageUpload from './upload/upload';
import OrganizationJobSelect from './organizationJobSelect';
import DepartmentDisplay from './departmentDisplay';
import FixedCopyGiveDisplay from './fixedCopyGiveDisplay';
import ComponentRelatedApproval from './relatedApproval';
import ComponentRenderFlowNames from './flowName.jsx';
import OADocumentDetail from './detail';

export {
  // 页面包装容器 - 创建（独立页面）
  PageCreateWapper,
  // 页面包装容器 - 更新（独立页面）
  PageUpdateWapper,
  // 页面包装容器 - 详情（嵌入模块）
  PageDetailWapper,
  // 页面表单按钮 - 创建按钮
  PageSubmitButtons,
  // 页面表单按钮 - 编辑按钮
  PageUpdateButtons,
  // 页面表单按钮 - 创建/编辑按钮
  PageFormButtons,
  // 页面 - 审批流创建按钮
  PageFlowButton,
  // 页面 - 费控 - 审批流创建按钮
  PageExpenseButton,
  // 基本信息展示
  PageBaseInfo,
  // 工作接收人
  PageEmployeesSelect,
  // 主题标签
  PageComponentThemeTag,
  // 岗位库下拉列表
  OrganizationJobSelect,
  // 根据部门id展示部门名称
  DepartmentDisplay,
  // 上传组件
  PageUpload,

  // OA公共组件，详情功能模块
  OADocumentDetail,

  // 展示固定抄送
  FixedCopyGiveDisplay,
  // 关联审批模块
  ComponentRelatedApproval,
  // 显示审批流名称组件
  ComponentRenderFlowNames,
};
