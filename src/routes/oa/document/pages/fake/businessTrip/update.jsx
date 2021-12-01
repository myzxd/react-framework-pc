/**
 * 事务审批 - 假勤管理 - 出差申请 - 编辑
 */
import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import React, { useEffect } from 'react';
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
import { utils } from '../../../../../../application';
import {
  ExpenseBusinessTripType,
  ExpenseBusinessTripWay,
} from '../../../../../../application/define';
import {
  PageFormButtons,
  ComponentRenderFlowNames,
} from '../../../components/index';
import ExamineFlow from '../../../components/form/flow';
import TravelStandard from './travelStandard';

import { regionalList } from './regionalList';
import style from './style.less';

const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
const formOLayout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

const BusinessTripUpdate = ({
  dispatch,
  query,
  businessTripDetail, // 出差单详情
  businessTripDays, // 出差天数
  examineFlowInfo = [],
}) => {
  const [form] = Form.useForm();
  const { id } = query;

  useEffect(() => {
    id && dispatch({
      type: 'fake/getBusinssTripDetail',
      payload: { id },
    });

    return () => dispatch({
      type: 'fake/resetBusinssTripDetail',
    });
  }, [id, dispatch]);

  // 编辑时给表单初始值
  useEffect(() => {
    if (is.existy(businessTripDetail) && is.not.empty(businessTripDetail)) {
      const {
        expect_start_at: expectStartAt,
        expect_done_at: expectDoneAt,
      } = businessTripDetail;

      form.setFieldsValue({
        // 联系电话
        phone: dot.get(businessTripDetail, 'apply_user_phone'),
        // 通行人员
        peer: dot.get(businessTripDetail, 'together_user_names', []),
        // 出差类别
        businessTripType: dot.get(businessTripDetail, 'biz_type'),
        // 出差方式
        businessTripWay: dot.get(businessTripDetail, 'transport_kind'),
        departure: {
          city: dot.get(businessTripDetail, 'departure.city'),
        },
        destinations: {
          city: dot.get(businessTripDetail, 'destination_list.0.city'),
        },
        businessTripTime: [
          moment(expectStartAt),
          moment(expectDoneAt),
        ],
        // reason: dot.get(businessTripDetail, 'note'),
        arrangement: dot.get(businessTripDetail, 'working_plan'),
        themeTag: dot.get(businessTripDetail, 'theme_label_list'),
      });

      // 获取出差天数
      getBusinssTripDays({
        expectStartAt: moment(expectStartAt).format('YYYY-MM-DD HH:00:00'),
        expectDoneAt: moment(expectDoneAt).format('YYYY-MM-DD HH:00:00'),
      });
    }
  }, [businessTripDetail, form]);

  // 获取出差天数
  const getBusinssTripDays = (date) => {
    dispatch({
      type: 'fake/getBusinssTripDays',
      payload: { ...date },
    });
  };

  // 保存
  const onUpdate = async ({ onDoneHook, onLockHook, onUnlockHook }) => {
    const formValues = await form.validateFields();

    onLockHook && onLockHook();

    const res = await dispatch({
      type: 'fake/onSaveBusinessTrip',
      payload: {
        ...formValues,
        flowId: query.flow_id,
        id, // 出差单id
        themeTag: utils.dotOptimal(businessTripDetail, 'oa_application_order_info.theme_label_list', []), // 主题标签
        onErrorCallback: onUnlockHook,
      },
    });

    if (res && res._id) {
      onDoneHook && onDoneHook();
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

  // 出差时间onChange
  const onChangeBusinessTripTime = (val) => {
    getBusinssTripDays({
      expectStartAt: moment(val[0]).format('YYYY-MM-DD HH:mm:ss'),
      expectDoneAt: moment(val[1]).format('YYYY-MM-DD HH:mm:ss'),
    });
  };

  // 渲染 流程名称
  const renderFlowNames = () => {
    return <ComponentRenderFlowNames examineFlowInfo={examineFlowInfo} />;
  };

  // 审批流预览
  const renderApprove = () => {
    return (
      <CoreContent title="审批信息" titleExt={renderFlowNames()}>
        <ExamineFlow
          isDetail
          departmentId={dot.get(businessTripDetail, 'department_id')}
          accountId={dot.get(businessTripDetail, 'order_account_info._id')}
          specialAccountId={dot.get(businessTripDetail, 'creator_info._id')}
          flowId={query.flow_id}
        />
      </CoreContent>
    );
  };

  // 出差人信息
  const renderPersonInfo = () => {
    const formItems = [
      <Form.Item label="实际出差人" {...formLayout}>
        {dot.get(businessTripDetail, 'order_account_info.name', '--')}
      </Form.Item>,
      <Form.Item label="部门" {...formLayout}>
        {dot.get(businessTripDetail, 'department_info.name', '--')}
      </Form.Item>,
      <Form.Item label="岗位" {...formLayout}>
        {dot.get(businessTripDetail, 'job_info.name', '--')}
      </Form.Item>,
      <Form.Item label="职级" {...formLayout}>
        {dot.get(businessTripDetail, 'work_level', '--')}
      </Form.Item>,
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
          allowClear
          showSearch
          optionFilterProp="children"
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
        rules={[
          { required: true },
        ]}
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

    return (
      <CoreContent
        title="出差信息"
        className="affairs-flow-basic"
      >
        <Form form={form}>
          <CoreForm items={formItems} cols={1} />
        </Form>
      </CoreContent>
    );
  };

  return (
    <div>
      {/* 审批流预览 */}
      {renderApprove()}
      {/* 出差人信息 */}
      {renderPersonInfo()}
      {/* 出差信息 */}
      {renderBusinessInfo()}

      {/* 渲染表单按钮 */}
      <PageFormButtons
        query={query}
        showUpdate
        onUpdate={onUpdate}
      />
    </div>
  );
};

const mapStateToProps = ({
  fake: {
    businessTripDetail,
    businessTripDays,
  },
  oaCommon: { examineFlowInfo },
}) => ({
  businessTripDetail, // 出差单详情
  businessTripDays, // 出差天数
  examineFlowInfo,
});

export default connect(mapStateToProps)(BusinessTripUpdate);
