/**
 * 发起审批 - 事务申请 - 弹框
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import { Modal, Form, Switch, Select, message } from 'antd';
import { utils, authorize } from '../../../../../application';

import ContractTypeComponent from '../contractTypeComponent';
import ContractChildTypeComponent from '../contractChildTypeComponent';

import aoaoBossTools from '../../../../../utils/util';
import {
  AdministrationLicense,
  OABorrowingType,
  OALeaveDayType,
  OaApplicationFlowTemplateState,
  ExpenseCostOrderBizType,
} from '../../../../../application/define';
import { PagesHelper, PagesRouteTypes } from '../../define';
import {
  CommonTreeSelectDepartments,
  CommonSelectStaffs,
  CommonSelectScene,
  CommonStampType,
 } from '../../../../../components/common';
import { CoreForm } from '../../../../../components/core';

export const PageFlowItems = {
  itemSubmitSelf: 1,          // 是否自己提交
  itemDepartment: 2,          // 部门
  itemPost: 3,                // 岗位
  itemContractBorrowType: 4,  // 合同借阅类型
  itemLeaveDayType: 5,        // 时长类型
  itemLicense: 6,             // 证照
  itemSealType: 7,            // 用章类型
  itemStampType: 8,            // 盖章类型
};

const { Option } = Select;

// 审批类型枚举
const enumers = {
  recruitment: 101,      // 部门招聘申请
  jobHandover: 107,      // 工作交接
  employ: 108,           // 录用申请
  entry: 109,            // 入职申请
  renew: 104,            // 劳动合同续签申请
  positionTransfer: 105, // 人事调动申请
  resign: 106,           // 离职申请
  reward: 308,           // 奖罚申请
  travel: 601,           // 出差申请
};
function PageFlowCreateModal(props) {
  const [form] = Form.useForm();
  // 自己提交单据为true，代提为false
  const [isSelf, setIsSelf] = useState(PagesHelper.flowIsSelfSubmitByKey(props.type));
  // 部门id
  const [departmentId, setDepartmentId] = useState();
  const [visible, setVisible] = useState(false);
  // 部门信息 暂时隐藏 @冯俏
  // const [departmentInfo, setDepartmentInfo] = useState({});
  // 部门名称
  const [departmentName, setDepartmentName] = useState();
  // 岗位id
  const [postId, setPostId] = useState();
  // 岗位名称
  const [postName, setPostName] = useState();
  // 职级名称
  const [rankName, setRankName] = useState();
  const [loading, setLoading] = useState(false);

  const accountId = authorize.account.id;
  const { dispatch, isShowCode } = props;
  // 主要岗位
  const majorJobInfo = dot.get(props, 'accountDetail.employee_info.major_job_info', {});
  // 主要部门
  const majorDepartmentInfo = dot.get(props, 'accountDetail.employee_info.major_department_info', {});
  // 是否展示合同类型
  const [contractTypeState, setContractTypeState] = useState(false);
  // 设置选中的合同类型
  const [contractTypeValueState, setContractTypeValueState] = useState(undefined);
 // 合同子类型是否有数据
  const [contractCihldIsData, setContractChildIsData] = useState(true);

  // 是否是部门招聘或者工作交接
  const isShowPostRank = dot.get(props, 'type') === enumers.recruitment || dot.get(props, 'type') === enumers.jobHandover;

  // 是否单独显示职级
  const isShowRank = dot.get(props, 'type') === enumers.employ ||
                     dot.get(props, 'type') === enumers.entry ||
                     dot.get(props, 'type') === enumers.renew ||
                     dot.get(props, 'type') === enumers.positionTransfer ||
                     dot.get(props, 'type') === enumers.resign ||
                     dot.get(props, 'type') === enumers.reward ||
                     dot.get(props, 'type') === enumers.travel;

  useEffect(() => {
    setVisible(props.visible);
  }, [props.visible]);

  useEffect(() => {
    if (props.visible) {
      dispatch({
        type: 'accountManage/fetchAccountsDetails',
        payload: { id: accountId },
      });
      return;
    }
    // 判断是否是code审批管理
    if (isShowCode !== true) {
      dispatch({
        type: 'accountManage/resetAccountsDetails',
      });
    }
    return () => {
      dispatch({
        type: 'accountManage/resetAccountsDetails',
      });
    };
  }, [dispatch, accountId, props.visible, isShowCode]);

  // 配置部门
  const onChangeDepartment = (value, title) => {
    setDepartmentId(value);
    setDepartmentName(title[0]);
    // setDepartmentInfo(info);
    // 清空岗位表单
    form.setFieldsValue({ postId: undefined });
    setPostId(undefined);
    setPostName(undefined);
    setRankName(undefined);
  };

  // 配置岗位
  const onChangePost = (value, jobInfo) => {
    // select 与接口返回内容格式不一致
    if (dot.has(jobInfo, '_id')) {
      setPostId(dot.get(jobInfo, '_id'));
      setPostName(dot.get(jobInfo, 'name'));
      setRankName(dot.get(jobInfo, 'rank'));
      return;
    }
    setPostId(dot.get(jobInfo, 'props.item._id'));
    setPostName(dot.get(jobInfo, 'props.item.name'));
    setRankName(dot.get(jobInfo, 'props.item.rank'));
  };

  // 取消弹窗回调
  const onCancel = () => {
    setVisible(false);
    if (props.onCancel) {
      props.onCancel();
    }
    setLoading(false);
    // 重置表单数据
    setDepartmentId(undefined);
    // setDepartmentInfo({});
    setDepartmentName(undefined);
    setPostId(undefined);
    setPostName(undefined);
    setRankName(undefined);
    form.resetFields();
    setContractTypeValueState(null);
    setContractTypeState(false);
  };

  // 跳转到对应业务的页面
  // flow_id   审批流id
  // is_self   true自己提交/false待提交
  // department_id   部门id
  // department_name 部门名称
  // post_id   岗位id
  // post_name 岗位名称
  // rank_name 职级
  // contract_borrow_type    借阅类型 (财商-合同借阅申请)
  // seal_borrow_type        借阅类型（行政-证照借用申请）
  // leave_day_type          请假时长
  const onRedirect = (flowId, values) => {
    if (is.not.existy(flowId)) {
      setLoading(false);
      message.error('提示：没有适用审批流，请联系流程管理员');
      return;
    }
    const params = {
      is_self: isSelf,
    };
    // 特殊审批类型（页面不包含部门和岗位）
    const keys = [408];
    // 判断是否是本人提报
    if (isSelf !== true || keys.includes(dot.get(props, 'type'))) {
      params.flow_id = flowId;
    }

    // 部门
    if (dot.has(values, 'departmentId')) {
      params.department_id = departmentId;
      params.department_name = departmentName;
    }

    // 岗位&职级
    if (dot.has(values, 'postId')) {
      params.post_id = postId;
      params.post_name = postName;
      params.rank_name = rankName;
    }

    // 借阅类型 (财商-合同借阅申请)
    if (dot.has(values, 'contractBorrowType')) {
      params.contract_borrow_type = values.contractBorrowType;
    }

    // 借阅类型（行政-证照借用申请）
    if (dot.has(values, 'sealBorrowType')) {
      params.seal_borrow_type = values.sealBorrowType;
    }

    // 请假时长
    if (dot.has(values, 'leaveDayType')) {
      params.leave_day_type = values.leaveDayType;
    }

    // 印章类型
    if (dot.has(values, 'sealType')) {
      params.seal_type = values.sealType;
    }
    // 盖章类型
    if (dot.has(values, 'stampType')) {
      params.stampType = values.stampType;
    }
    // 合同类型
    if (dot.has(values, 'pact_apply_types')) {
      params.contractType = values.pact_apply_types;
    }
    // 合同子类型
    if (dot.has(values, 'pact_sub_types')) {
      params.contractChildType = values.pact_sub_types;
    }
    // 判断是否是code审批
    if (isShowCode) {
      params.isShowCode = isShowCode;
    }

    // 表单创建地址
    const url = PagesHelper.routeByKey(props.type, PagesRouteTypes.create);
    // 判断，如果地址为空，则不显示模块
    if (is.empty(url)) {
      return message.error('未配置类型模版，无法进行创建');
    }

    const esc = encodeURIComponent;
    const query = Object.keys(params).map(k => `${esc(k)}=${esc(params[k])}`).join('&');

    onCancel();

    setTimeout(() => {
      aoaoBossTools.popUpCompatible(url, query);
    }, 100);
  };

  // 会审类型
  const onChangeStampType = (val) => {
    // 清空合同类型的值
    form.setFieldsValue({ pact_apply_types: undefined });
    setContractTypeValueState(null);
    // 如果包含 先盖章(170)｜后盖章(180) 就展示
    if (val === '170' || val === '180') {
      setContractTypeState(true);
      return val;
    }
    // 隐藏合同类型组件
    setContractTypeState(false);
    return val;
  };

   // 获取合同类型的值
  const onChangeContractTypeValue = (val) => {
    form.setFieldsValue({ contractChildType: undefined, pact_sub_types: undefined });
    setContractTypeValueState(val);
    return val;
  };

  // 提交数据
  const onSubmit = (values) => {
    // const {
    //   organization_count: organizationCount,
    //   organization_num: organizationNum,
    // } = departmentInfo;
    // 部门招聘的情况下判断 101 == 部门招聘
    // 在岗人 >= 占编数不让创建
    // 暂时隐藏 @冯俏
    // if (dot.get(props, 'type') === 101 &&
    //   is.existy(departmentInfo) && is.not.empty(departmentInfo) &&
    //   organizationCount >= organizationNum) {
    //   return message.error('此部门下没有空编岗位，无法创建申请');
    // }
    setLoading(true);
    const payload = {
      pact_apply_types: values.pact_apply_types,
      pact_sub_types: values.pact_sub_types,
      state: OaApplicationFlowTemplateState.normal,   // 审批流状态，正常
      bizType: ExpenseCostOrderBizType.transactional, // 审批流类型，事务
      departmentId,     // 部门id
      rankName,         // 职级
      pageType: dot.get(props, 'type'),   // 审批单类型
      leaveDayType: values.leaveDayType,  // 请假时长
      borrowType: values.sealBorrowType, // 证照借用
      contractBorrowType: values.contractBorrowType, // 借阅类型
      sealType: values.sealType,
      stampType: values.stampType, // 盖章类型
      isNewInterface: false, // 是否旧接口
      onFailureCallback: () => {
        setLoading(false);
        message.error('提示：没有适用审批流，请联系流程管理员');
      },
      onSuccessCallback: result => onRedirect(dot.get(result, 'data.0._id'), values),
    };
    // 类型是 部门招聘或者工作交接 新审批流接口参数
    const newPayload = {
      applyJobId: postId,                 // 岗位id
      departmentId,                       // 部门id
      pageType: dot.get(props, 'type'),   // 审批单类型
      onNewFailureCallback: () => {
        setLoading(false);
        message.error('提示：没有适用审批流，请联系流程管理员');
      },
      onSuccessCallback: result => onRedirect(dot.get(result, 'flow_template_records.0._id'), values),
    };
    if (isShowPostRank || dot.get(props, 'type') === 408) {
      // 如果是部门招聘|工作交接|资金调拨 我们调用新的审批流列表接口
      props.dispatch({ type: 'expenseExamineFlow/fetchExamineFlowsApplyFind', payload: newPayload });
    } else {
      // 默认调用 原审批流接口
      props.dispatch({ type: 'expenseExamineFlow/fetchExamineFlows', payload });
    }
  };

  // 渲染具体的表单组件
  const renderFormItem = (item, key) => {
    // 部门
    if (item === PageFlowItems.itemDepartment) {
      return (
        <React.Fragment key={key}>
          <Form.Item
            name="departmentId"
            label="部门"
            rules={[{ required: true, message: '请选择部门' }]}
          >
            <CommonTreeSelectDepartments
              namespace={'oa-modal-department'}
              isAuthorized
              isDefaultValue
              majorDepartmentInfo={majorDepartmentInfo}
            // 判断是否是部门招聘 101 == 部门招聘
              isInfo={dot.get(props, 'type') === 101}
              onChange={onChangeDepartment}
              treeNodeFilterProp="title"
            />
          </Form.Item>
          {
            // 判断是否是 部门招聘||工作交接 显示岗位和职级
            isShowPostRank ?
              <React.Fragment>
                <Form.Item name="postId" label="岗位" rules={[{ required: true, message: '请选择岗位' }]}>
                  <CommonSelectStaffs
                    namespace={`oa-modal-post-${key}`}
                    departmentId={departmentId}
                    onChange={onChangePost}
                    majorJobInfo={majorJobInfo}
                    showSearch
                    isDefaultValue
                    optionFilterProp="children"
                  />
                </Form.Item>
                <Form.Item label="职级" key={key}>
                  {rankName || '--'}
                </Form.Item>
              </React.Fragment>
            :
            null
          }
        </React.Fragment>
      );
    }

    // 岗位
    if (item === PageFlowItems.itemPost) {
      return (
        <React.Fragment key={key}>
          <Form.Item name="postId" label="岗位" rules={[{ required: true, message: '请选择岗位' }]}>
            <CommonSelectStaffs
              namespace={`oa-modal-post-${key}`}
              departmentId={departmentId}
              onChange={onChangePost}
              majorJobInfo={majorJobInfo}
              showSearch
              isDefaultValue
              optionFilterProp="children"
            />
          </Form.Item>
          {
          // 除工作交接和部门招聘外 是否显示 职级
          isShowRank ?
            <Form.Item label="职级" >
              {rankName || '--'}
            </Form.Item>
        : null
        }
        </React.Fragment>
      );
    }


    // 合同借阅类型
    if (item === PageFlowItems.itemContractBorrowType) {
      return (
        <Form.Item name="contractBorrowType" label="类型" key={key} rules={[{ required: true, message: '请选择类型' }]}>
          <Select placeholder="请选择类型">
            <Option value={OABorrowingType.original}>{OABorrowingType.description(OABorrowingType.original)}</Option>
            <Option value={OABorrowingType.copy}>{OABorrowingType.description(OABorrowingType.copy)}</Option>
            <Option value={OABorrowingType.scanning}>{OABorrowingType.description(OABorrowingType.scanning)}</Option>
            <Option value={OABorrowingType.other}>{OABorrowingType.description(OABorrowingType.other)}</Option>
          </Select>
        </Form.Item>
      );
    }

    // 时长类型
    if (item === PageFlowItems.itemLeaveDayType) {
      return (
        <Form.Item name="leaveDayType" label="时长" key={key} rules={[{ required: true, message: '请选择时长' }]}>
          <Select placeholder="请选择时长">
            <Option value={OALeaveDayType.levelA}>{OALeaveDayType.description(OALeaveDayType.levelA)}</Option>
            <Option value={OALeaveDayType.levelB}>{OALeaveDayType.description(OALeaveDayType.levelB)}</Option>
            <Option value={OALeaveDayType.levelC}>{OALeaveDayType.description(OALeaveDayType.levelC)}</Option>
          </Select>
        </Form.Item>
      );
    }

      // 证照
    if (item === PageFlowItems.itemLicense) {
      return (
        <Form.Item
          name="sealBorrowType"
          label="类型"
          rules={[{ required: true, message: '请选择类型' }]}
          key={key}
        >
          <Select placeholder="请选择" showSearch optionFilterProp="children">
            {utils.transOptions(AdministrationLicense, Option)}
          </Select>
        </Form.Item>
      );
    }

    // 印章类型
    if (item === PageFlowItems.itemSealType) {
      return (
        <Form.Item
          name="sealType"
          label="印章类型"
          rules={[{ required: true, message: '请选择印章类型' }]}
          key={key}
        >
          <CommonSelectScene enumeratedType="sealType" />
        </Form.Item>
      );
    }

    // 盖章类型
    if (item === PageFlowItems.itemStampType) {
      return (
        <Form.Item
          name="stampType"
          label="类型"
          rules={[{ required: true, message: '请选择' }]}
          key={key}
          getValueFromEvent={onChangeStampType}
        >
          <CommonStampType
            placeholder="请选择"
          />
        </Form.Item>
      );
    }
  };

  // 渲染切换选项
  const renderSwitchItem = () => {
    // 判断是否隐藏swich切换
    const isHideSwitchByKey = PagesHelper.flowIsHideSwitchByKey(props.type);
    if (isHideSwitchByKey === false) {
      return (
        <Form.Item label="本人提报" name="isSelf">
          <Switch
            checked={isSelf ? true : false} onChange={() => {
              setIsSelf(!isSelf);
              // 重置表单
              form.resetFields();
              setDepartmentId(undefined);
              // setDepartmentInfo({});
              setDepartmentName(undefined);
              setPostId(undefined);
              setPostName(undefined);
              setRankName(undefined);
            }}
          />
        </Form.Item>
      );
    }

    // 默认其余情况不显示
    return '';
  };

  // 渲染表单项目
  const renderFormItems = () => {
    // 渲染的表单项目，默认为空
    let items = [];
    // 判断是否是自己提交单据
    if (isSelf === true) {
      // 如果是自己提报，则渲染自己提报的表单
      items = PagesHelper.flowSelfByKey(props.type);
    } else {
      // 渲染代提报的表单
      items = PagesHelper.flowSubstituteByKey(props.type);
    }
    // 遍历渲染
    return items.map((item, index) => {
      return renderFormItem(item, `item-${index}`);
    });
  };
  // 渲染合同表单item
  const renderContractFormItem = () => {
    // 只有先盖章 或者 后盖章 才显示
    const formItems = [];
    if (contractTypeState) {
      formItems.splice(0, 0, (<Form.Item
        name="pact_apply_types"
        label="合同类型"
        rules={[
      { required: true, message: '请选择' },
        ]}
        getValueFromEvent={onChangeContractTypeValue}
      >
        <ContractTypeComponent />
      </Form.Item>));
    }

    // 如果合同类型有选中的值就展示
    if (is.existy(contractTypeValueState)) {
      formItems.splice(1, 0, (<Form.Item
        name="pact_sub_types"
        label="合同子类型"
        rules={contractCihldIsData ? [
        { required: true, message: '请选择' },
        ] : [{}]}
      >
        <ContractChildTypeComponent set_contract_child={setContractChildIsData} contractTypeValueState={contractTypeValueState} />
      </Form.Item>));
    }

    return (
      <CoreForm items={formItems} cols={1} />
    );
  };

  // 渲染表单
  const render = () => {
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
    // 表单信息
    return (
      <Modal
        title="新建申请"
        visible={visible}
        onOk={() => { form.submit(); }}
        onCancel={onCancel}
        confirmLoading={loading}
        okText="下一步"
        cancelText="取消"
      >

        <Form form={form} onFinish={onSubmit} initialValues={{ type: dot.get(props, 'params.type') }} {...layout}>
          <Form.Item label="审批类型" >
            {PagesHelper.titleByKey(dot.get(props, 'type'))}
          </Form.Item>

          {/* 渲染提报的切换选项 */}
          {renderSwitchItem()}

          {/* 渲染表单参数 */}
          {renderFormItems()}
          {/* 渲染合同类型表单 */}
          {renderContractFormItem()}
        </Form>
      </Modal>
    );
  };
  return render();
}

PageFlowCreateModal.PageFlowItems = PageFlowItems;

const mapStateToProps = ({ accountManage: { accountDetail } }) => ({ accountDetail });
export default connect(mapStateToProps)(PageFlowCreateModal);
