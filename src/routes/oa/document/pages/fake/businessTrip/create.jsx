/**
 * 事务审批 - 假勤管理 - 出差申请 - 创建
 */
import is from 'is_js';
import _ from 'lodash';
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  Row,
  Col,
  DatePicker,
} from 'antd';

import {
  CoreForm,
  CoreContent,
} from '../../../../../../components/core';
import {
  CommonSelectDepartmentEmployees,
} from '../../../../../../components/common';
import {
  ExpenseBusinessTripType,
  ExpenseBusinessTripWay,
  ApprovalDefaultParams,
} from '../../../../../../application/define';
import {
  PageFormButtons,
  ComponentRelatedApproval,
  ComponentRenderFlowNames,
} from '../../../components/index';
import ExamineFlow from '../../../components/form/flow';
import DepartmentFlow from '../../../components/form/departmentFlow';
import PostFlow from '../../../components/form/postFlow';
import TravelStandard from './travelStandard';

import { showPlainText } from '../../../../../../application/utils';
import { authorize, utils } from '../../../../../../application';
import { regionalList } from './regionalList';
import { PagesHelper } from '../../../define';

import style from './style.less';

const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const formOLayout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

const BusinessTrip = ({
  dispatch,
  query,
  employeeDetail = {}, // 人员详情
  businessTripDays = {}, // 出差天数
  accountDep,
  newOaExamineList,
  examineFlowInfo = [],   // 审批流列表
}) => {
  const [form] = Form.useForm();
  const { id: ownerId, staffProfileId } = authorize.account;
  const {
    department_id: departmentId,
    department_name: departmentName,
    post_id: postId,
    post_name: postName,
    rank_name: rankName,
    is_self: isSelfStr,
  } = query;

  let isSelf = false; // 是否是本人提报
  if (isSelfStr === 'true') {
    isSelf = true;
  }

  // 审批单id
  const [orderId, setOrderId] = useState(undefined);

  // 审批流id
  const [flowVal, setFlowId] = useState(query.flow_id);

  // 事务性单据id
  const [transacId, setTransacId] = useState(undefined);
  // 部门表单id
  const [departmentFlowId, setDepartmentFlowId] = useState(departmentId);
  // 岗位表单id
  const [rank, setRank] = useState(rankName);
  // 实际申请人id
  const initActualId = isSelf ? ownerId : undefined;
  const [actualId, setActualId] = useState(initActualId);
  // 查询搜索后要关联的审批单id
  const [parentIds, setParentIds] = useState([]);
  // tagvalue
  const [themeTag, setThemeTag] = useState(undefined);
  useEffect(() => {
    if (isSelf) {
      dispatch({
        type: 'oaCommon/fetchEmployeeDetail',
        payload: { id: staffProfileId },
      });

      dispatch({
        type: 'oaCommon/getEmployeeDepAndPostInfo',
        payload: { accountId: staffProfileId },
      });

      return () => dispatch({
        type: 'oaCommon/resetEmployeeDetail',
      });
    }
  }, [staffProfileId, isSelf]);

  useEffect(() => {
    if (isSelf && is.existy(employeeDetail) && is.not.empty(employeeDetail)
          && is.existy(accountDep) && is.not.empty(accountDep)
          && is.existy(newOaExamineList) && is.not.empty(newOaExamineList)) {
          // 当前人的主部门id
      const majorDepartmentId = dot.get(employeeDetail, 'major_department_info._id', undefined);
          // 主岗
      const majorJobRank = dot.get(employeeDetail, 'major_job_info.rank', undefined);
      const examineList = dot.get(newOaExamineList, 'data', []);
          // 过滤包含主部门的审批流
      const filterMajorDepartmentList = examineList.filter((item = {}) => {
        const arr = [...dot.get(item, 'applyDepartmentIds', []), ...dot.get(item, 'applyDepartmentSubIds', [])];
        const applyRanks = dot.get(item, 'applyRanks', []);
            // 判断部门集合是否包含主部门并且岗位集合为全部
        if (arr.includes(majorDepartmentId) && applyRanks[0] === 'all') {
          return true;
        }
            // 判断部门集合是否包含主部门并且岗位集合包含主岗
        return arr.includes(majorDepartmentId) && applyRanks.includes(majorJobRank);
      });
          // 判断主部门和主岗的审批流是否有数据
      if (is.existy(filterMajorDepartmentList) && is.not.empty(filterMajorDepartmentList)) {
        setDepartmentFlowId(majorDepartmentId);
        setRank(majorJobRank);
        form.setFieldsValue({
          departmentId: majorDepartmentId,
          postId: dot.get(employeeDetail, 'major_job_info._id', undefined),
        });
        return;
      }

          // 获取副部门数据，过滤主部门
      const deputyDepartmentList = dot.get(accountDep, 'postList', []).filter(item => dot.get(item, 'department_info._id', undefined) !== majorDepartmentId);
          // 副部门id集合
      const deputyDepartmentIds = deputyDepartmentList.map(item => dot.get(item, 'department_info._id', undefined));
      const examineItem = PagesHelper.pageCommonTerminateForEach(examineList, deputyDepartmentList, deputyDepartmentIds);
      if (is.existy(examineItem) && is.not.empty(examineItem)) {
        setDepartmentFlowId(examineItem.departmentId);
        setRank(examineItem.rank);
        form.setFieldsValue({
          departmentId: examineItem.departmentId,
          postId: examineItem.jobId,
        });
      }
    }
  }, [employeeDetail, isSelf, accountDep, newOaExamineList]);

  useEffect(() => {
    if (isSelf) {
      form.setFieldsValue({
        phone: dot.get(employeeDetail, 'phone', undefined),
      });
    }
  }, [form, isSelf, employeeDetail]);

  // 员工详情
  let employeeInfo = {};
  // 如果是自己提报，从请求的员工详情取数据
  if (isSelf) {
    employeeInfo = {
      name: dot.get(employeeDetail, 'name'), // 姓名
      departmentId: dot.get(employeeDetail, 'major_department_info._id'), // 部门ID
      departmentName: dot.get(employeeDetail, 'major_department_info.name'), // 部门名称
      postId: dot.get(employeeDetail, 'major_job_info._id'), // 岗位ID
      postName: showPlainText(employeeDetail, 'major_job_info.name'), // 岗位名称
      rankName: showPlainText(employeeDetail, 'major_job_info.rank'), // 职级
    };
  } else {
    // 如果是代提报，从改变提报人的信息中取数据
    employeeInfo = {
      departmentId, // 部门ID
      departmentName: departmentName || '--', // 部门名称
      postId, // 岗位ID
      postName: postName || '--', // 岗位名称
      rankName: rankName || '--', // 职级
    };
  }

  // 提交
  const onSubmit = async (callbackObj = {}) => {
    const {
      onLockHook,
      onUnlockHook,
      onDoneHook,
    } = callbackObj;

    const formValues = await form.validateFields();

    // 开启按钮加载中状态
    onLockHook && onLockHook();

    // 新建或编辑出差单
    await dispatch({
      type: 'fake/onSaveBusinessTrip',
      payload: {
        ...formValues,
        themeTag,      // 主题标签内容
        id: transacId, // 出差单id
        flowId: flowVal, // 审批流id
        departmentId: isSelf ? formValues.departmentId : departmentId,
        postId: isSelf ? formValues.postId : postId,
        businessTraveler: isSelf ? ownerId : formValues.businessTraveler, // 实际出差人
        onErrorCallback: onUnlockHook,
        onCreateSuccess: (id) => {
          const params = {
            _id: id,
            values: formValues,
            oId: id,
            onDoneHook,
            onErrorCallback: onUnlockHook,
          };
          onCreateSuccess(params);
        },
      },
    });
  };

   // 审批单关联成功
  const onApprovalIsSuccess = (values, oId, onDoneHook, onErrorCallback) => {
    // 如果第二个参数不存在 就是保存操作 直接返回 否则是创建
    if (is.not.existy(values)) return;
    dispatch({ type: 'oaCommon/submitOrder',
      payload: {
        ...values,
        id: oId,
        // 判断是否是创建，创建提示提示语
        isOa: orderId ? false : true,
        onSuccessCallback: onDoneHook,
        onErrorCallback,
      } });
  };

  // 创建成功后调用关联审批单接口
  const onCreateSuccess = ({ _id, values, oId, onDoneHook, onErrorCallback }) => {
    // 如果没有点击关联审批或者是编辑页面 不请求 关联接口
    if (is.empty(parentIds)) {
      // 如果values存在 那就是直接提交并且没有填写关联的审批id 我们就直接创建 不需要走关联审批单接口
      if (values) {
        onApprovalIsSuccess(values, oId, onDoneHook, onErrorCallback);
      }
      return;
    }
    // 关联审批接口
    dispatch({ type: 'humanResource/fetchApproval',
      payload: {
        id: _id,
        ids: parentIds,        // 查询搜索后要关联的审批单id
        type: ApprovalDefaultParams.add, // 增加
        onApprovalIsSuccess: () => onApprovalIsSuccess(values, oId, onDoneHook, onErrorCallback),
        onErrorCallback,
      } });
  };


  // 提交
  const onSave = async (callbackObj) => {
    const {
      onSaveHook,
      onUnsaveHook,
    } = callbackObj;

    const formValues = await form.validateFields();

    // 开启按钮加载中状态
    onSaveHook && onSaveHook();

    // 新建或编辑出差单
    const res = await dispatch({
      type: 'fake/onSaveBusinessTrip',
      payload: {
        ...formValues,
        themeTag,      // 主题标签内容
        id: transacId, // 出差单id
        flowId: flowVal, // 审批流id
        departmentId: isSelf ? formValues.departmentId : departmentId,
        postId: isSelf ? formValues.postId : postId,
        businessTraveler: isSelf ? ownerId : formValues.businessTraveler, // 实际出差人
        onErrorCallback: onUnsaveHook,
        onCreateSuccess: (id) => {
          onCreateSuccess({
            _id: id,
            onErrorCallback: onUnsaveHook,
          });
        },
      },
    });

    // 出差单保存成功
    if (res && res._id) {
      res._id && (setTransacId(res._id));
      res.oa_application_order_id && (setOrderId(res.oa_application_order_id));
      onUnsaveHook();
    }
  };

  // 修改同行人员
  const onChangePeerTags = (newValue) => {
    const noSpaceValue = newValue;
    const newLength = noSpaceValue.length;
    const peerLength = form.getFieldValue('peer');
    // 当新增标签时去除新增标签的空格
    if (newLength > peerLength) {
      const tmp = noSpaceValue[newLength - 1].replace(/\s+/g, '');
      if (tmp === '') return;
      noSpaceValue[newLength - 1] = tmp;
    }
    form.setFieldsValue({ peer: noSpaceValue });
  };

  // departmentId onChange
  const setJobForm = () => {
    setRank(undefined);
    form.setFieldsValue({ postId: undefined });
  };

  // 出差时间onChange
  const onChangeBusinessTripTime = (val) => {
    dispatch({
      type: 'fake/getBusinssTripDays',
      payload: {
        expectStartAt: moment(val[0]).format('YYYY-MM-DD HH:00:00'),
        expectDoneAt: moment(val[1]).format('YYYY-MM-DD HH:00:00'),
      },
    });
  };

  // 实际出差人
  const onChangeDepartmentEmployees = (val, options = {}) => {
    form.setFieldsValue({
      phone: dot.get(options, 'payload.phone', undefined),
    });
    setActualId(val);
  };

  // 渲染 流程名称
  const renderFlowNames = () => {
    return <ComponentRenderFlowNames examineFlowInfo={examineFlowInfo} />;
  };

  // 审批流预览
  const renderApprove = () => {
    return (
      <CoreContent title="流程预览" titleExt={renderFlowNames()}>
        <ExamineFlow
          isSelf={isSelf}
          departmentId={departmentFlowId}
          accountId={actualId}
          pageType={601}
          setFlowId={setFlowId}
          specialAccountId={actualId}
          rank={rank}
        />
      </CoreContent>
    );
  };

  // 出差人信息
  const renderPersonInfo = () => {
    const examineList = dot.get(newOaExamineList, 'data', []);
    // 审批流部门id集合
    const filterDepartmentIds = examineList.map((item = {}) => {
      return [...dot.get(item, 'applyDepartmentIds', []), ...dot.get(item, 'applyDepartmentSubIds', [])];
    });
    // 将多维数组转为一维数组
    const departmentIds = _.flattenDeep(filterDepartmentIds);
    const employeeFormItem = isSelf ? [
      <Form.Item label="实际出差人" {...formLayout}>
        {employeeInfo.name}
      </Form.Item>,
      <Form.Item label="部门" name="departmentId" {...formLayout}>
        <DepartmentFlow
          examineFlowDepartmentIds={departmentIds}
          setJobForm={setJobForm}
          setDepartmentId={setDepartmentFlowId}
          disabled={Boolean(orderId)}
        />
      </Form.Item>,
      <Form.Item
        label="岗位"
        name="postId"
        {...formLayout}
        rules={[
          { required: true, message: '请选择岗位' },
        ]}
      >
        <PostFlow
          departmentId={departmentFlowId}
          setRank={setRank}
          disabled={Boolean(orderId)}
        />
      </Form.Item>,
      <Form.Item label="职级" {...formLayout}>
        {rank}
      </Form.Item>,
    ] : [
      <Form.Item
        label="实际出差人"
        name="businessTraveler"
        rules={[{ required: true, message: '请选择实际出差人' }]}
        {...formLayout}
      >
        <CommonSelectDepartmentEmployees
          departmentId={departmentId}
          postId={postId}
          isCurrentDepartment
          onChange={onChangeDepartmentEmployees}
          placeholder="请选择实际出差人"
          disabled={Boolean(orderId)}
        />
      </Form.Item>,
      <Form.Item label="部门" {...formLayout}>
        {employeeInfo.departmentName}
      </Form.Item>,
      <Form.Item label="岗位" {...formLayout}>
        {employeeInfo.postName}
      </Form.Item>,
      <Form.Item label="职级" {...formLayout}>
        {employeeInfo.rankName}
      </Form.Item>,
    ];

    const formItems = [
      ...employeeFormItem,
      <Form.Item
        label="联系方式"
        name="phone"
        {...formLayout}
      >
        <Input placeholder="请填写联系方式" />
      </Form.Item>,
      <Form.Item
        label="同行人员"
        name="peer"
        {...formLayout}
      >
        <Select
          placeholder="请填写同行人员"
          mode="tags"
          notFoundContent=""
          onChange={onChangePeerTags}
          tokenSeparators={[',', '，']}
        />
      </Form.Item>,
      {
        span: 12,
        key: 'title',
        render: (
          <Form.Item
            label=""
            style={{ marginLeft: 20 }}
          >
            提示：添写完同行人员后，该同行人员将不能进行此次出差申请的重复提报
          </Form.Item>
        ),

      },
    ];

    return (
      <CoreContent
        title="出差人信息"
        className="affairs-flow-basic"
      >
        <Form form={form}>
          <CoreForm items={formItems} cols={4} />
        </Form>
      </CoreContent>
    );
  };

  // 出差信息
  const renderBusinessInfo = () => {
    const formItems = [
      <Form.Item
        label="出差类别"
        name="businessTripType"
        rules={[
          { required: true, message: '请选择出差类别' },
        ]}
        {...formOLayout}
      >
        <Radio.Group>
          <Radio
            value={ExpenseBusinessTripType.oneWay}
          >单程</Radio>
          <Radio
            value={ExpenseBusinessTripType.roundTrip}
          >往返</Radio>
        </Radio.Group>
      </Form.Item>,
      <Form.Item
        label="出差方式"
        name="businessTripWay"
        rules={[
          { required: true, message: '请选择出差方式' },
        ]}
        {...formOLayout}
      >
        <Checkbox.Group style={{ width: '100%' }}>
          <Row>
            <Col span={4}>
              <Checkbox
                value={ExpenseBusinessTripWay.highSpeedRailMotorCarTwo}
              >
                {ExpenseBusinessTripWay.description(ExpenseBusinessTripWay.highSpeedRailMotorCarTwo)}
              </Checkbox>
            </Col>
            <Col span={4}>
              <Checkbox
                value={ExpenseBusinessTripWay.planeTwo}
              >
                {ExpenseBusinessTripWay.description(ExpenseBusinessTripWay.planeTwo)}
              </Checkbox>
            </Col>
          </Row>
          <Row>
            <Col span={4}>
              <Checkbox
                value={ExpenseBusinessTripWay.softSleeper}
              >
                {ExpenseBusinessTripWay.description(ExpenseBusinessTripWay.softSleeper)}
              </Checkbox>
            </Col>
            <Col span={4}>
              <Checkbox
                value={ExpenseBusinessTripWay.passengerCar}
              >
                {ExpenseBusinessTripWay.description(ExpenseBusinessTripWay.passengerCar)}
              </Checkbox>
            </Col>
            <Col span={4}>
              <Checkbox
                value={ExpenseBusinessTripWay.drive}
              >
                {ExpenseBusinessTripWay.description(ExpenseBusinessTripWay.drive)}
              </Checkbox>
            </Col>
            <Col span={4}>
              <Checkbox
                value={ExpenseBusinessTripWay.highSpeedRailMotorCarOne}
              >
                {ExpenseBusinessTripWay.description(ExpenseBusinessTripWay.highSpeedRailMotorCarOne)}
              </Checkbox>
            </Col>
            <Col span={4}>
              <Checkbox
                value={ExpenseBusinessTripWay.planeOne}
              >
                {ExpenseBusinessTripWay.description(ExpenseBusinessTripWay.planeOne)}
              </Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
      </Form.Item>,
      <Form.Item
        name={['departure', 'city']}
        label="出发地"
        rules={[
          { required: true, message: '请选择出发地' },
        ]}
        {...formOLayout}
      >
        <Select
          style={{ width: '20%' }}
          allowClear
          showSearch
          optionFilterProp="children"
          placeholder="请选择出发地"
        >
          {
            regionalList.map((c) => {
              return utils.dotOptimal(c, 'children', []).map((item) => {
                return <Option key={item.code} value={String(item.code)}>{item.value}</Option>;
              });
            })
          }
        </Select>
      </Form.Item>,
      <Form.Item
        name={['destinations', 'city']}
        label="目的地"
        rules={[
          { required: true, message: '请选择目的地' },
        ]}
        {...formOLayout}
      >
        <Select
          style={{ width: '20%' }}
          placeholder="请选择目的地"
          showSearch
          optionFilterProp="children"
          allowClear
        >
          {
            regionalList.map((c) => {
              return utils.dotOptimal(c, 'children', []).map((item) => {
                return <Option key={item.code} value={String(item.code)}>{item.value}</Option>;
              });
            })
          }
        </Select>
      </Form.Item>,
      <Form.Item
        label={
          <span className={style['code-travel-form-required']}>
            预计出差时间
          </span>
        }
        {...formOLayout}
      >
        <Form.Item
          name="businessTripTime"
          rules={[
            { required: true, message: '请选择预计出差时间' },
          ]}
          noStyle
        >
          <RangePicker
            showTime={{ format: 'HH:00' }}
            format="YYYY-MM-DD HH:00"
            onChange={onChangeBusinessTripTime}
          />
        </Form.Item>
        <span
          style={{ marginLeft: 100 }}
        >出差天数：{businessTripDays.travel_days || '--'}</span>
      </Form.Item>,
      <Form.Item
        label="原由及工作安排说明"
        name="arrangement"
        {...formOLayout}
      >
        <TextArea
          autoSize={{ minRows: 4 }}
          style={{ width: '50%' }}
          placeholder="请填写工作安排"
        />
      </Form.Item>,
      <Form.Item
        label="出差标准明细"
        {...formOLayout}
      >
        <TravelStandard />
      </Form.Item>,
    ];

    const initialValues = {
      businessTripType: ExpenseBusinessTripType.roundTrip, // 出差类别
      businessTripWay: [ExpenseBusinessTripWay.highSpeedRailMotorCarTwo], // 出差方式
    };

    return (
      <CoreContent
        title="出差信息"
        className="affairs-flow-basic"
      >
        <Form form={form} initialValues={initialValues}>
          <CoreForm items={formItems} cols={1} />
        </Form>
      </CoreContent>
    );
  };

  return (
    <div>
      {/* 审批流预览 */}
      {renderApprove()}
      {/* 渲染关联审批组件 */}
      {
        // 如果是创建页面显示 关联审批和主题标签
        // 如果是编辑页面    不显示关联审批和主题标签 *编辑的时候 关联审批和主题标签在外层编辑
        <ComponentRelatedApproval setThemeTag={setThemeTag} setParentIds={setParentIds} />
         }
      {/* 出差人信息 */}
      {renderPersonInfo()}
      {/* 出差信息 */}
      {renderBusinessInfo()}

      {/* 渲染表单按钮 */}
      <PageFormButtons
        query={query}
        onSubmit={onSubmit}
        onSave={onSave}
      />
    </div>
  );
};
const mapStateToProps = ({
  oaCommon: { employeeDetail, accountDep, examineFlowInfo },
  fake: { businessTripDays },
  expenseExamineFlow: { newOaExamineList },
}) => ({
  employeeDetail,   // 员工详情
  businessTripDays, // 出差天数
  accountDep,
  newOaExamineList,
  examineFlowInfo,  // 审批流列表
});

export default connect(mapStateToProps)(BusinessTrip);
