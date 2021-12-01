/**
 * code - 差旅报销
*/
import is from 'is_js';
import dot from 'dot-prop';
import _ from 'lodash';
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Form,
  InputNumber,
  Button,
  Input,
  DatePicker,
  Card,
  message,
  Popconfirm,
  Col,
  Tooltip,
} from 'antd';
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

import {
  Unit,
  CodeSubmitType,
  ExpenseCollectionType, // 支付明细收款方式枚举
  CodeApproveOrderPayState, // code审批单付款状态
  CodeTicketState, // code审批单验票状态
  CodeTravelState,
  ExpenseBusinessTripWay,
} from '../../../../application/define';
import { CoreForm, CoreContent } from '../../../../components/core';
import ComponentSubject from '../../components/subject'; // 科目
import ComponentTravelApplicationForm from '../../components/travelApplicationForm'; // 出差单号
import ComponentCodeBusinessAccounting from '../../components/codeBusinessAccounting'; // code核算中心
import ComponentTeamBusinessAccounting from '../../components/teamBusinessAccounting'; // team核算中心
import Detaileditems from './item'; // 差旅明细
import PageUpload from '../../components/upload'; // 附件
import CollectionItem from '../../components/collection/collectionItem'; // 支付明细
import TravelBusinessDetail from './travelBusinessDetail'; // 详情
import ComponentTeamInvoiceTitles from '../../components/teamInvoiceTitles'; // team发票抬头
import styles from './style.less';

const reg = new RegExp('^[1][3,4,5,6,7,8,9][0-9]{9}$');

const { RangePicker } = DatePicker;
const { TextArea } = Input;

function TravelBusiness(props) {
  const {
    travelOrder,
    formKey,
    item,
    index,
    dispatch,
    orderId,
    costCenterType,
    businessTripDays,
  } = props;
  const namespace = item._id;
  // 防重
  let isSubmit = false;
  // 详情
  const detail = travelOrder[namespace] || {};
  // 出差天数
  const travelDays = (businessTripDays[formKey] || {}).travel_days;
  const [form] = Form.useForm();
  const [travelItem, onChangeTravelItem] = useState({});
  const [travelState, onChangeTravelState] = useState();
  const [oaTravelItem, onChangeOaTravelItem] = useState({});
  const [loading, setLoading] = useState(false);
  // 出差单的天数
  const [estimateTravelDays, setEstimateTravelDays] = useState();
  // 补助金额是否超标
  const [subsidyFeeVisible, setSubsidyFeeVisible] = useState();
  // 住宿金额是否超标
  const [stayFeeVisible, setStayFeeVisible] = useState();
  // 出差方式
  const travelList = [
    ExpenseBusinessTripWay.highSpeedRailMotorCarOne, // 动车/高铁-一等座
    ExpenseBusinessTripWay.highSpeedRailMotorCarTwo, // 动车/高铁-二等座
    ExpenseBusinessTripWay.planeOne, // 飞机 - 头等舱
    ExpenseBusinessTripWay.planeTwo, // 飞机 - 经济舱
    ExpenseBusinessTripWay.softSleeper, // 普快软卧
    ExpenseBusinessTripWay.passengerCar, // 客车
    ExpenseBusinessTripWay.drive, // 自驾
  ];

  useEffect(() => {
    fetchTravelOrder();
    return () => {
      // 清除数据
      dispatch({ type: 'codeOrder/reduceTravelOrder', payload: { namespace: item._id, result: {} } });
    };
  }, [dispatch, item, orderId, namespace]);

  // 获取出差天数&出差类型
  useEffect(() => {
    // 判断是否有数据
    if (is.existy(detail) && is.not.empty(detail)) {
      const travelApplyOrderInfo = dot.get(detail, 'travel_order_info', {});
      // 预计出差天数
      setEstimateTravelDays(travelApplyOrderInfo.expect_apply_days);
      // 调用出差天数接口
      travelApplyOrderInfo.actual_start_at && travelApplyOrderInfo.actual_done_at && dispatch({
        type: 'fake/getBusinssTripDays',
        payload: {
          expectStartAt: moment(`${travelApplyOrderInfo.actual_start_at}`).format('YYYY-MM-DD HH:mm:ss'),
          expectDoneAt: moment(`${travelApplyOrderInfo.actual_done_at}`).format('YYYY-MM-DD HH:mm:ss'),
          namespace: formKey,
        },
      });
    }
  }, [dispatch, detail, formKey]);

  useEffect(() => {
    // 判断是否有数据
    if (is.existy(detail) && is.not.empty(detail)) {
      const travelApplyOrderInfo = dot.get(detail, 'travel_order_info', {});
      const payeeList = dot.get(detail, 'payee_list', []); // 支付明细
      let dateTiem = [];
      // 判断实际出差时间是否存在
      if (is.existy(travelApplyOrderInfo.actual_start_at) && is.not.empty(travelApplyOrderInfo.actual_start_at) &&
      is.existy(travelApplyOrderInfo.actual_done_at) && is.not.empty(travelApplyOrderInfo.actual_done_at)) {
        dateTiem = [moment(travelApplyOrderInfo.actual_start_at), moment(travelApplyOrderInfo.actual_done_at)];
      }

      const bizExtraData = { // 差旅明细
        // 补助(元)
        subsidy_fee: dot.get(detail, 'travel_fee_extra_data.subsidy_fee') ? Unit.exchangePriceToYuan(dot.get(detail, 'travel_fee_extra_data.subsidy_fee')) : 0,
        // 住宿(元)
        stay_fee: dot.get(detail, 'travel_fee_extra_data.stay_fee') ? Unit.exchangePriceToYuan(dot.get(detail, 'travel_fee_extra_data.stay_fee')) : 0,
        // 市内交通费(元)
        urban_transport_fee: dot.get(detail, 'travel_fee_extra_data.urban_transport_fee') ? Unit.exchangePriceToYuan(dot.get(detail, 'travel_fee_extra_data.urban_transport_fee')) : 0,
      };
      setSubsidyFeeVisible(dot.get(detail, 'travel_fee_extra_data.is_out_subsidy_fee'));
      setStayFeeVisible(dot.get(detail, 'travel_fee_extra_data.is_out_stay_fee'));
      // 往返交通费(元)
      if (dot.get(detail, 'travel_fee_extra_data.transport_fee')) {
        bizExtraData.transport_fee = Unit.exchangePriceToYuan(dot.get(detail, 'travel_fee_extra_data.transport_fee'));
      }
      // 其他(元)
      if (dot.get(detail, 'travel_fee_extra_data.other_fee')) {
        bizExtraData.other_fee = Unit.exchangePriceToYuan(dot.get(detail, 'travel_fee_extra_data.other_fee'));
      }

      // 出差方式
      const transportKind = dot.get(detail, 'travel_order_info.transport_kind', []);
      // 动车/高铁交通费(元)
      if (transportKind.includes(ExpenseBusinessTripWay.highSpeedRailMotorCarOne) ||
      transportKind.includes(ExpenseBusinessTripWay.highSpeedRailMotorCarTwo)) {
        bizExtraData.high_speed_train_fee = Unit.exchangePriceToYuan(dot.get(detail, 'travel_fee_extra_data.high_speed_train_fee', 0));
      }
      // 飞机交通费(元)
      if (transportKind.includes(ExpenseBusinessTripWay.planeOne) ||
      transportKind.includes(ExpenseBusinessTripWay.planeTwo)) {
        bizExtraData.aircraft_fee = Unit.exchangePriceToYuan(dot.get(detail, 'travel_fee_extra_data.aircraft_fee', 0));
      }
      // 普通软卧交通费(元)
      if (transportKind.includes(ExpenseBusinessTripWay.softSleeper)) {
        bizExtraData.train_ordinary_soft_sleeper_fee = Unit.exchangePriceToYuan(dot.get(detail, 'travel_fee_extra_data.train_ordinary_soft_sleeper_fee', 0));
      }
      // 客车交通费(元)
      if (transportKind.includes(ExpenseBusinessTripWay.passengerCar)) {
        bizExtraData.bus_fee = Unit.exchangePriceToYuan(dot.get(detail, 'travel_fee_extra_data.bus_fee', 0));
      }
      // 自驾交通费(元)
      if (transportKind.includes(ExpenseBusinessTripWay.drive)) {
        bizExtraData.self_driving_fee = Unit.exchangePriceToYuan(dot.get(detail, 'travel_fee_extra_data.self_driving_fee', 0));
      }

      form.setFieldsValue({
        subjectId: dot.get(detail, 'cost_accounting_id', undefined), // 科目
        businessTravelId: dot.get(detail, 'travel_order_info._id', undefined), // 出差单号
        date: dateTiem, // 实际出差时间
        codeBusinessAccount: dot.get(detail, 'cost_target_id', undefined), // 核算中心
        money: dot.get(detail, 'total_money') ? Unit.exchangePriceToYuan(dot.get(detail, 'total_money')) : undefined, // 金额
        bizExtraData, // 差旅明细
        invoiceTitle: dot.get(detail, 'invoice_title', undefined), // 发票抬头
        note: dot.get(detail, 'note', undefined), // 备注
        assets: PageUpload.getInitialValue(detail, 'attachment_private_urls'), // 附件
        bankList: payeeList.map((v, i) => { // 支付明细
          const j = { ...v, flag: true };
          // 判断金额类型
          if (typeof v.money === 'number') {
            j.money = Unit.exchangePriceToYuan(v.money);
          }
          j.num = i + 1; // 唯一key
          return j;
        }),
      });
    }
  }, [form, detail]);

  const fetchTravelOrder = () => {
    // 判断是否有值
    if (item._id && orderId) {
      const payload = {
        id: item._id,
        orderId,
        namespace,
      };
      dispatch({ type: 'codeOrder/fetchTravelOrder', payload });
    }
  };

  // 获取出发地
  const getDeparture = (departure) => {
    const res = {
      province: departure.province_name,
      city: departure.city_name,
      area: departure.area_name,
    };

    departure.detailed_address && (res.detailed_address = departure.detailed_address);

    return res;
  };

  // 获取出发地
  const getDestination = (description) => {
    const res = description.map((i) => {
      const departure = {
        province: i.province_name,
        city: i.city_name,
        area: i.area_name,
      };

      i.detailed_address && (departure.detailed_address = i.detailed_address);
      return departure;
    });

    return res;
  };

  // 删除
  const onClickRemove = () => {
    dispatch({
      type: 'codeOrder/removeOrderCostItem',
      payload: {
        id: item._id,
        onSucessCallback: () => {
          // 移除费用单
          onClickRemoveCost();
          props.onInterfaceDetail();
        },
      },
    });
  };

  // 移除费用单
  const onClickRemoveCost = () => {
    // 移除费用单
    if (props.onClickRemoveCost) {
      props.onClickRemoveCost(formKey);
    }
  };

  // 成功回调
  const onSucessCallback = () => {
    setLoading(false);
    isSubmit = false;
    // 审批单详情接口进行调用
    if (props.onInterfaceDetail) {
      props.onInterfaceDetail();
    }
  };

  // 保存
  const onSave = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      // 判断是否是编辑 & 防止重复点击
      if (item._id && isSubmit === false) {
        isSubmit = true;
        // 编辑
        dispatch({
          type: 'codeOrder/updateOrderCostcostTravelOrder',
          payload: {
            ...values,
            id: item._id,
            travelState: travelState || detail.travel_order_type,
            dateDay: travelDays,
            onSucessCallback,
            onErrorCallback: () => {
              setLoading(false);
              isSubmit = false;
            },
          },
        });
        return;
      }
      // 防止重复点击
      if (isSubmit === false) {
        // 创建
        dispatch({
          type: 'codeOrder/createOrderCostcostTravelOrder',
          payload: {
            ...values,
            dateDay: travelDays,
            orderId,
            travelState: travelState || detail.travel_order_type,
            onSucessCallback,
            onErrorCallback: () => {
              setLoading(false);
              isSubmit = false;
            },
          },
        });
      }
    }).catch((errorInfo) => {
      // 滚动报错第一个字段
      form.scrollToField(errorInfo.errorFields[0].name, { behavior: actions =>
        actions.forEach(({ el, top }) => {
          // eslint-disable-next-line no-param-reassign
          el.scrollTop = top - 5;
        }) });
    });
  };

   // 编辑
  const onEdit = () => {
    if (props.onIsShowEdit) {
      props.onIsShowEdit(index);
    }
  };

  // 更改时间, 如果结尾时间大于当前时间就用当前时间
  const onGetValueFromEvent = (value) => {
    // 判断不是数组时清空数据
    if (!Array.isArray(value)) {
      return undefined;
    }
    const params = [...value];
    const endDate = moment(value[1]).valueOf();
    const date = moment().valueOf();
    // 判断结尾时间是否大于当前时间
    if (endDate > date) {
      params[1] = moment();
    }

    // 获取出差天数
    dispatch({
      type: 'fake/getBusinssTripDays',
      payload: {
        expectStartAt: moment(params[0]).format('YYYY-MM-DD HH:mm:ss'),
        expectDoneAt: moment(params[1]).format('YYYY-MM-DD HH:mm:ss'),
        namespace: formKey,
      },
    });
    return params;
  };

  // 限制选择的日期
  const disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i += 1) {
      result.push(i);
    }
    return result;
  };
  // 限制选择的时间
  const disabledRangeTime = (e, type) => {
    // 当前小时
    const nowHours = new Date().getHours();

    // 今天的日期
    const today = moment(new Date()).format('YYYYHHDD');

    // 选择的结束时间
    let endTime;
    // 获取选择的date
    if (_ && _.length === 2) {
      endTime = moment(_[1]).format('YYYYHHDD');

      // 如果结束日期为今天，则限制选择的到小时
      if (Number(endTime) === Number(today) && type === 'end') {
        return {
          disabledHours: () => range(nowHours + 1, 24),
        };
      }
      // 其他不限制
      return {
        disabledHours: () => [],
      };
    }
  };
  // 设置form
  const setFormItemValue = () => {
    // 判断数据是否存在
    if (is.existy(detail) && is.not.empty(detail)) {
      const travelApplyOrderInfo = dot.get(detail, 'travel_order_info', {});
      const payeeList = dot.get(detail, 'payee_list', []); // 支付明细
      let dateTiem = [];
      // 判断实际出差时间是否存在
      if (is.existy(travelApplyOrderInfo.actual_start_at) && is.not.empty(travelApplyOrderInfo.actual_start_at) &&
      is.existy(travelApplyOrderInfo.actual_done_at) && is.not.empty(travelApplyOrderInfo.actual_done_at)) {
        dateTiem = [moment(travelApplyOrderInfo.actual_start_at), moment(travelApplyOrderInfo.actual_done_at)];
      }
      // 预计出差天数
      setEstimateTravelDays(travelApplyOrderInfo.expect_apply_days);
      const bizExtraData = { // 差旅明细
        // 补助(元)
        subsidy_fee: dot.get(detail, 'travel_fee_extra_data.subsidy_fee') ? Unit.exchangePriceToYuan(dot.get(detail, 'travel_fee_extra_data.subsidy_fee')) : 0,
        // 住宿(元)
        stay_fee: dot.get(detail, 'travel_fee_extra_data.stay_fee') ? Unit.exchangePriceToYuan(dot.get(detail, 'travel_fee_extra_data.stay_fee')) : 0,
        // 市内交通费(元)
        urban_transport_fee: dot.get(detail, 'travel_fee_extra_data.urban_transport_fee') ? Unit.exchangePriceToYuan(dot.get(detail, 'travel_fee_extra_data.urban_transport_fee')) : 0,
      };

      // 校验金额是否超标
      onChangeBizExtraMoneyExceedingStandard(dot.get(detail, 'travel_order_info._id', undefined), detail.travel_order_type, bizExtraData);
      // 出差方式
      const transportKind = dot.get(travelApplyOrderInfo, 'transport_kind', []);
      // 动车/高铁交通费(元)
      if (transportKind.includes(ExpenseBusinessTripWay.highSpeedRailMotorCarOne) ||
      transportKind.includes(ExpenseBusinessTripWay.highSpeedRailMotorCarTwo)) {
        bizExtraData.high_speed_train_fee = Unit.exchangePriceToYuan(dot.get(detail, 'travel_fee_extra_data.high_speed_train_fee', 0));
      }
      // 飞机交通费(元)
      if (transportKind.includes(ExpenseBusinessTripWay.planeOne) ||
      transportKind.includes(ExpenseBusinessTripWay.planeTwo)) {
        bizExtraData.aircraft_fee = Unit.exchangePriceToYuan(dot.get(detail, 'travel_fee_extra_data.aircraft_fee', 0));
      }
      // 普通软卧交通费(元)
      if (transportKind.includes(ExpenseBusinessTripWay.softSleeper)) {
        bizExtraData.train_ordinary_soft_sleeper_fee = Unit.exchangePriceToYuan(dot.get(detail, 'travel_fee_extra_data.train_ordinary_soft_sleeper_fee', 0));
      }
      // 客车交通费(元)
      if (transportKind.includes(ExpenseBusinessTripWay.passengerCar)) {
        bizExtraData.bus_fee = Unit.exchangePriceToYuan(dot.get(detail, 'travel_fee_extra_data.bus_fee', 0));
      }
      // 自驾交通费(元)
      if (transportKind.includes(ExpenseBusinessTripWay.drive)) {
        bizExtraData.self_driving_fee = Unit.exchangePriceToYuan(dot.get(detail, 'travel_fee_extra_data.self_driving_fee'));
      }
      // 往返交通费(元)
      if (dot.get(detail, 'travel_fee_extra_data.transport_fee')) {
        bizExtraData.transport_fee = Unit.exchangePriceToYuan(dot.get(detail, 'travel_fee_extra_data.transport_fee', 0));
      }
      // 其他(元)
      if (dot.get(detail, 'travel_fee_extra_data.other_fee')) {
        bizExtraData.other_fee = Unit.exchangePriceToYuan(dot.get(detail, 'travel_fee_extra_data.other_fee'));
      }

      form.setFieldsValue({
        subjectId: dot.get(detail, 'cost_accounting_id', undefined), // 科目
        businessTravelId: dot.get(detail, 'travel_order_info._id', undefined), // 出差单号
        date: dateTiem, // 实际出差时间
        codeBusinessAccount: dot.get(detail, 'cost_target_id', undefined), // 核算中心
        money: dot.get(detail, 'total_money') ? Unit.exchangePriceToYuan(dot.get(detail, 'total_money')) : undefined, // 金额
        bizExtraData, // 差旅明细
        invoiceTitle: dot.get(detail, 'invoice_title', undefined), // 发票抬头
        note: dot.get(detail, 'note', undefined), // 备注
        assets: PageUpload.getInitialValue(detail, 'attachment_private_urls'), // 附件
        bankList: payeeList.map((v, i) => { // 支付明细
          const j = { ...v, flag: true };
          // 判断金额类型
          if (typeof v.money === 'number') {
            j.money = Unit.exchangePriceToYuan(v.money);
          }
          j.num = i + 1; // 唯一key
          return j;
        }),
      });
    }
  };

  // 科目改变
  const onChangeSubject = () => {
    // 核算中心清空
    form.setFieldsValue({ codeBusinessAccount: undefined });
  };


  // 判断差旅金额是否超标
  const onChangeBizExtraMoneyExceedingStandard = (travelOrderId, define, bizExtraData = {}) => {
    // 不满足条件不调接口
    if (!(is.existy(travelOrderId) && is.not.empty(travelOrderId)
      && is.existy(define) && is.not.empty(define)
      && is.existy(bizExtraData) && is.not.empty(bizExtraData))) {
      return;
    }
    dispatch({
      type: 'codeOrder/fetchTravelMoneyExceedingStandard',
      payload: {
        bizExtraData, // 差旅明细
        travelState: define, // 出差类型
        travelOrderId, // 出差单id
        onSucessCallback: (res = {}) => {
          setSubsidyFeeVisible(res.is_out_subsidy_fee);
          setStayFeeVisible(res.is_out_stay_fee);
        },
      } });
  };

  // 出差单号
  const onChangeTravelOrder = (e, define, info = {}) => {
    // 枚举
    onChangeTravelState(define);
    const bizExtraData = form.getFieldValue('bizExtraData');
    // 校验金额是否超标
    onChangeBizExtraMoneyExceedingStandard(e, define, bizExtraData);
    // 判断是否有出差方式
    if (is.existy(info.transport_kind) && is.not.empty(info.transport_kind)) {
      // 获取交集
      const intersection = _.intersection(info.transport_kind, travelList);
      // 判断是否有交集
      // 有交集代表有出差方式，删除往返交通费
      if (is.existy(intersection) && is.not.empty(intersection)) {
        delete bizExtraData.transport_fee;
      } else {
        // 没有赋值
        bizExtraData.transport_fee = 0;
      }
      const transportKind = dot.get(info, 'transport_kind', []);
    // 动车/高铁交通费
      if (transportKind.includes(ExpenseBusinessTripWay.highSpeedRailMotorCarOne) ||
    transportKind.includes(ExpenseBusinessTripWay.highSpeedRailMotorCarTwo)) {
        bizExtraData.high_speed_train_fee = 0;
      } else {
        delete bizExtraData.high_speed_train_fee;
      }
      // 飞机交通费
      if (transportKind.includes(ExpenseBusinessTripWay.planeOne) ||
    transportKind.includes(ExpenseBusinessTripWay.planeTwo)) {
        bizExtraData.aircraft_fee = 0;
      } else {
        delete bizExtraData.aircraft_fee;
      }
      // 普通软卧交通费
      if (transportKind.includes(ExpenseBusinessTripWay.softSleeper)) {
        bizExtraData.train_ordinary_soft_sleeper_fee = 0;
      } else {
        delete bizExtraData.train_ordinary_soft_sleeper_fee;
      }
      // 客车交通费
      if (transportKind.includes(ExpenseBusinessTripWay.passengerCar)) {
        bizExtraData.bus_fee = 0;
      } else {
        delete bizExtraData.bus_fee;
      }
      // 自驾交通费
      if (transportKind.includes(ExpenseBusinessTripWay.drive)) {
        bizExtraData.self_driving_fee = 0;
      } else {
        delete bizExtraData.self_driving_fee;
      }
      const moneys = Object.values(bizExtraData);
      const totalMoney = moneys.reduce((a, b) => a + b).toFixed(2);
      form.setFieldsValue({
        bizExtraData,
        money: totalMoney,
      });
    }
    // 获取出差天数
    dispatch({
      type: 'fake/getBusinssTripDays',
      payload: {
        expectStartAt: moment(info.expect_start_at).format('YYYY-MM-DD HH:mm:ss'),
        expectDoneAt: moment(info.expect_done_at).format('YYYY-MM-DD HH:mm:ss'),
        namespace: formKey,
        isEstimateDay: true, // 预计天数
        onEstimateSuccessCallback: (day) => {
          setEstimateTravelDays(day);
        },
      },
    });
    // 实际出差时间
    form.setFieldsValue({ date: [moment(info.expect_start_at), moment(info.expect_done_at)] });
    // 费用出差
    if (define === CodeTravelState.expense) {
      return onChangeTravelItem(info);
    }
    // 事务出差
    if (define === CodeTravelState.oa) {
      return onChangeOaTravelItem(info);
    }
  };

  // 校验差旅费用明细
  const checkDetaileditems = (rule, value, callback) => {
    //  判断是否为空
    const flag = Object.values(value).some(v => v > 0);
    // 判断数据是否存在
    if (is.existy(value) && is.not.empty(value) && flag === true) {
      callback();
      return;
    }
    callback('请填写差旅费用明细');
  };

  // 校验差旅明细金额是否超标
  const onChangeBizExtraDataIsOutMoney = (e = {}) => {
    const travelOrderId = form.getFieldValue('businessTravelId');
    const define = travelState || detail.travel_order_type;
    // 校验金额是否超标
    onChangeBizExtraMoneyExceedingStandard(travelOrderId, define, e);
  };

  // 差旅明细
  const onChangeBizExtraData = (e = {}) => {
    const moneys = Object.values(e);
    const totalMoney = moneys.reduce((a, b) => Number(a) + Number(b)).toFixed(2);
    form.setFieldsValue({ money: totalMoney });
  };

  // 改变金额校验支付明细&差旅明细
  const onChangeMoney = () => {
    form.validateFields(['bizExtraData']);
  };

  // 取消
  const onClickReset = () => {
    if (item._id) {
      setFormItemValue();
      return;
    }
    // 预计出差天数
    setEstimateTravelDays(undefined);
    // 重置
    form.resetFields();
    setSubsidyFeeVisible(false);
    setStayFeeVisible(false);
    onChangeTravelItem({});
    onChangeOaTravelItem({});
    form.setFieldsValue({
      bankList: [{ payee_type: ExpenseCollectionType.onlineBanking, num: 1, flag: true }],
    });
  };


  // 支付明细
  const onChangePayeeInfo = (value = []) => {
    // 判断是否为数组
    if (Array.isArray(value)) {
      // 判断，支付类型是否为钱包时并且没有档案id
      const flag = value.some(v => v.loading === true);
      setLoading(flag);
    }
  };

  // 校验金额集合
  const onValidatorBankListMoney = (rule, value, callback) => {
    const totalMoney = Number(form.getFieldValue('money') || 0).toFixed(2);
    if (value) {
      for (const v of value) {
        if (!v.card_name || !v.bank_details || !v.card_num || typeof v.money !== 'number') {
          message.error('请将收款人，开户支行，收款账户，金额请填写完整');
          // callback('请将收款人，开户支行，收款账户，金额请填写完整');
          return;
        }
        // 判断收款方式为钱包时手机号必填
        if (Number(v.payee_type) === ExpenseCollectionType.wallet) {
          if (!v.card_phone) {
            message.error('请将手机号请填写完整');
            // callback('请将手机号请填写完整');
            return;
          }
        }
        if (v.card_phone) {
          if (!reg.test(v.card_phone)) {
            message.error('请将手机号请填写完整');
            // callback('手机号格式错误');
            return;
          }
        }
      }
    }

    // 金额汇总
    const bankMoneys = value.map(v => Number(v.money || 0));
    // 金额之和
    const moneys = bankMoneys.reduce((a, b) => a + b).toFixed(2);
    // 差额
    const calculationMoney = Number(totalMoney - moneys).toFixed(2);
    if (Number(calculationMoney) !== 0) {
      // callback('收款信息金额与费用总金额不一致');
      message.error('收款信息金额与费用总金额不一致');
      return;
    }
    callback();
  };

  // 出差信息
  const renderTravelInfo = () => {
    const travelApplyOrderInfo = dot.get(detail, 'travel_order_info', {});
    const items = is.existy(travelItem) && is.not.empty(travelItem) ? travelItem : travelApplyOrderInfo;
    const departure = items.departure || {}; // 出发地
    const destination = items.destination || {}; // 目的地
    const formItems = [
      <Form.Item
        label="出差申请单号"
      >
        <div>
          {
            items._id ?
              (
                <a href={`/#/Expense/TravelApplication/Detail?id=${items._id}`} target="_blank" rel="noopener noreferrer" >{dot.get(items, '_id', '--')}</a>
            ) : '--'
          }
        </div>
      </Form.Item>,
      <Form.Item
        label="实际出差人"
      >
        <div>
          {dot.get(items, 'apply_user_name', '--')}
        </div>
      </Form.Item>,
      <Form.Item
        label="预计出差时间"
      >
        <div>
          {items.expect_start_at ? moment(items.expect_start_at).format('YYYY-MM-DD HH:00') : ''}--
          {items.expect_done_at ? moment(items.expect_done_at).format('YYYY-MM-DD HH:00') : ''}
        </div>
      </Form.Item>,
      <Form.Item
        label="出发地"
      >
        {
          Object.values(getDeparture(departure)).join('-')
        }
      </Form.Item>,
      <Form.Item
        label="目的地"
      >
        {
          getDestination([destination]).map(i => Object.values(i).join('-')).join(' 、')
        }
      </Form.Item>,
      {
        span: 12,
        render: (
          <Form.Item
            name="date"
            label="实际出差时间"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            getValueFromEvent={onGetValueFromEvent}
            rules={[{ required: true, message: '请选择' }]}
          >
            <RangePicker
              showTime={{ format: 'HH:00' }}
              format="YYYY-MM-DD HH:00"
              disabledDate={disabledDate}
              disabledTime={disabledRangeTime}
            />
          </Form.Item>
        ),
      },
      <Form.Item
        label="出差天数"
        shouldUpdate={
          (prevValues, curValues) => (
            prevValues.date !== curValues.date
          )
        }
      >
        {travelDays || '--'}天
        {
          travelDays > estimateTravelDays ?
            (<span>（<span style={{ color: 'red' }}>申请出差天数：{estimateTravelDays}天</span>）</span>)
            : ''
        }
      </Form.Item>,
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 10 } };
    return (
      <CoreForm items={formItems} cols={4} layout={layout} />
    );
  };
    // 出差信息
  const renderOaTravelInfo = () => {
    const travelApplyOrderInfo = dot.get(detail, 'travel_order_info', {});
    const items = is.existy(oaTravelItem) && is.not.empty(oaTravelItem) ? oaTravelItem : travelApplyOrderInfo;
    const departure = items.departure || {}; // 出发地
    // 目的地
    const destinationList = dot.get(items, 'destination_list', []);
    const formItems = [
      {
        span: 6,
        render: (
          <Form.Item
            label="出差申请单号"
          >
            <div>
              {
                items._id ?
                  (
                    <a href={`/#/Expense/Manage/ExamineOrder/Detail?orderId=${items.oa_application_order_id}`} target="_blank" rel="noopener noreferrer" >{dot.get(items, '_id', '--')}</a>
                ) : '--'
              }
            </div>
          </Form.Item>
        ),
      },
      {
        span: 4,
        render: (
          <Form.Item
            label="实际出差人"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
          >
            <div>
              {dot.get(items, 'apply_user_name', '--')}
            </div>
          </Form.Item>
        ),
      },
      {
        span: 4,
        render: (
          <Form.Item
            label="部门"
          >
            <div>
              {/* 部门 */}
              {dot.get(items, 'department_info.name', '--')}
            </div>
          </Form.Item>
        ),
      },
      {
        span: 4,
        render: (
          <Form.Item
            label="岗位"
          >
            <div>
              {/* 岗位 */}
              {dot.get(items, 'job_info.name', '--')}
            </div>
          </Form.Item>
        ),
      },
      {
        span: 4,
        render: (
          <Form.Item
            label="职级"
          >
            <div>
              {/* 职级 */}
              {dot.get(items, 'work_level', '--')}
            </div>
          </Form.Item>
        ),
      },
      {
        span: 24,
        render: (
          <Form.Item
            label="预计出差时间"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
          >
            <div>
              {items.expect_start_at ? moment(items.expect_start_at).format('YYYY-MM-DD HH:00') : ''}--
            {items.expect_done_at ? moment(items.expect_done_at).format('YYYY-MM-DD HH:00') : ''}
            </div>
          </Form.Item>
        ),
      },
      {
        span: 24,
        render: (
          <Form.Item
            label="出发地"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
          >
            {
              Object.values(getDeparture(departure)).join('-')
            }
          </Form.Item>
        ),
      },
      {
        span: 24,
        render: (
          <Form.Item
            label="目的地"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
          >
            {
              getDestination(destinationList).map(i => Object.values(i).join('-')).join(' 、')
            }
          </Form.Item>
        ),
      },
      {
        span: 12,
        render: (
          <Form.Item
            name="date"
            label="实际出差时间"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            getValueFromEvent={onGetValueFromEvent}
            rules={[{ required: true, message: '请选择' }]}
          >
            <RangePicker
              showTime={{ format: 'HH:00' }}
              format="YYYY-MM-DD HH:00"
              disabledDate={disabledDate}
              disabledTime={disabledRangeTime}
            />
          </Form.Item>
          ),
      },
      <Form.Item
        label="出差天数"
        shouldUpdate={
            (prevValues, curValues) => (
              prevValues.date !== curValues.date
            )
          }
      >
        {travelDays || '--'}天
        {
          travelDays > estimateTravelDays ?
            (<span>（<span style={{ color: 'red' }}>申请出差天数：{estimateTravelDays}天</span>）</span>)
            : ''
        }
      </Form.Item>,
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 10 } };
    return (
      <CoreForm items={formItems} cols={4} layout={layout} />
    );
  };
  // 渲染表单
  const renderForm = () => {
    const formItems = [
      <Form.Item
        name="businessTravelId"
        label={(
          <div>
            <span style={{ marginRight: 5 }}>出差单号</span>
            <Tooltip
              title={(
                <React.Fragment>
                  <div>进行中、待提报的出差单已经发起过报销申请，不能重复发起！</div>
                  <div>请在原单据进行操作！</div>
                </React.Fragment>
            )}
            >
              <InfoCircleOutlined />
            </Tooltip>
          </div>
        )}
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 14 }}
        rules={[{ required: true, message: '请选择出差单号' }]}
      >
        <ComponentTravelApplicationForm
          placeholder="请选择出差单号"
          enableSelectAll
          showSearch
          optionFilterProp="children"
          onChange={onChangeTravelOrder}
        />
      </Form.Item>,
    ];
    return (
      <CoreForm items={formItems} cols={1} />
    );
  };
  // 预览支持格式内容
  const text = (<div>
    <span>目前支持的上传格式：- office文件(doc/docx/ppt/pptx/xls/xlsx)</span>
    <span>- Rtf文档/- pdf文件/ - 图片文件(jpg/jpeg/png/gif/bmp/tiff/webp)</span>
    <span>- txt文件/- csv文件/-eml格式 /- zip格式/- rar格式(不能上传有密码的此类文件)</span>
  </div>);

  // 渲染表单
  const renderContentForm = () => {
    const travelApplyOrderInfo = dot.get(detail, 'travel_order_info', {});
    let travelDetail = {};
    let transportItem = {};
    if ((travelState || detail.travel_order_type) === CodeTravelState.oa) {
      const items = is.existy(oaTravelItem) && is.not.empty(oaTravelItem) ? oaTravelItem : travelApplyOrderInfo;
      travelDetail = items;
      transportItem = oaTravelItem;
    } else {
      const items = is.existy(travelItem) && is.not.empty(travelItem) ? travelItem : travelApplyOrderInfo;
      travelDetail = items;
      transportItem = travelItem;
    }
    // 出差方式
    const transportKind = dot.get(travelDetail, 'transport_kind', []);
    let isHighSpeedRailMotorCarFee = false;
    let isplaneFee = false;
    let issoftSleeperFee = false;
    let ispassengerCarFee = false;
    let isdriveFee = false;
    // 获取交集
    const intersection = _.intersection(transportKind, travelList);
    // 是否显示往返交通费
    let isTransportFee = (is.existy(transportItem) && is.not.empty(transportItem)) &&
      (is.not.existy(intersection) || is.empty(intersection));
    // 差旅费用明细默认值
    const defaultValue = {
      subsidy_fee: 0, // 补助(元)
      stay_fee: 0, // 住宿(元)
      urban_transport_fee: 0, // 市内交通费(元)
    };
    // 动车/高铁交通费
    if (transportKind.includes(ExpenseBusinessTripWay.highSpeedRailMotorCarOne) ||
      transportKind.includes(ExpenseBusinessTripWay.highSpeedRailMotorCarTwo)
    || dot.get(detail, 'travel_fee_extra_data.high_speed_train_fee')) {
      defaultValue.high_speed_train_fee = 0;
      isHighSpeedRailMotorCarFee = true;
    }
    // 飞机交通费
    if (transportKind.includes(ExpenseBusinessTripWay.planeOne) ||
      transportKind.includes(ExpenseBusinessTripWay.planeTwo)
    || dot.get(detail, 'travel_fee_extra_data.aircraft_fee')) {
      defaultValue.aircraft_fee = 0;
      isplaneFee = true;
    }
    // 普通软卧交通费
    if (transportKind.includes(ExpenseBusinessTripWay.softSleeper)
      || dot.get(detail, 'travel_fee_extra_data.train_ordinary_soft_sleeper_fee')) {
      defaultValue.train_ordinary_soft_sleeper_fee = 0;
      issoftSleeperFee = true;
    }
    // 客车交通费
    if (transportKind.includes(ExpenseBusinessTripWay.passengerCar)
    || dot.get(detail, 'travel_fee_extra_data.bus_fee')) {
      defaultValue.bus_fee = 0;
      ispassengerCarFee = true;
    }
    // 自驾交通费
    if (transportKind.includes(ExpenseBusinessTripWay.drive)
    || dot.get(detail, 'travel_fee_extra_data.self_driving_fee')) {
      defaultValue.self_driving_fee = 0;
      isdriveFee = true;
    }
    // 判断是否显示往返交通费，历史有数据显示
    if (isTransportFee || dot.get(detail, 'travel_fee_extra_data.transport_fee')) {
      isTransportFee = true;
      defaultValue.transport_fee = 0; // 往返交通费(元)
    }
    const formItems = [
      <Form.Item
        name="subjectId"
        label="科目"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 10 }}
        rules={[{ required: true, message: '请选择科目' }]}
      >
        <ComponentSubject
          showSearch
          optionFilterProp="children"
          placeholder="请选择科目"
          orderId={orderId}
          onChange={onChangeSubject}
        />
      </Form.Item>,
      <Col
        push={1}
        style={{
          marginBottom: 10, display: 'flex',
        }}
        className="boss-form-item-required"
      >
        <span style={{ fontWeight: 500 }}>差旅费用明细</span>
        <span style={{ marginLeft: 10 }}>明细超标将会用红色字体显示</span>
      </Col>,
      <Form.Item
        name="bizExtraData"
        label=""
        wrapperCol={{ span: 22, push: 1 }}
        initialValue={defaultValue}
        rules={[
        { required: true, message: '请选择差旅费用明细' },
        { validator: checkDetaileditems }]}
      >
        <Detaileditems
          isHighSpeedRailMotorCarFee={isHighSpeedRailMotorCarFee}
          isplaneFee={isplaneFee}
          issoftSleeperFee={issoftSleeperFee}
          ispassengerCarFee={ispassengerCarFee}
          isdriveFee={isdriveFee}
          isTransportFee={isTransportFee}
          transportKind={transportKind}
          onChange={onChangeBizExtraData}
          onChangeBizExtraDataIsOutMoney={onChangeBizExtraDataIsOutMoney}
          subsidyFeeVisible={subsidyFeeVisible}
          stayFeeVisible={stayFeeVisible}
        />
      </Form.Item>,
      <Form.Item
        name="money"
        label="报销金额"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 10 }}
        rules={[{ required: true, message: '请填写报销金额' }]}
      >
        <InputNumber
          disabled
          precision={2}
          min={0}
          style={{ width: '100%' }}
          placeholder="请填写报销金额"
          formatter={Unit.limitDecimalsFormatter}
          parser={Unit.limitDecimalsParser}
          onChange={onChangeMoney}
        />
      </Form.Item>,
      <Form.Item
        name="invoiceTitle"
        label="发票抬头"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
        rules={[
        { required: true, message: '请选择发票抬头' }]}
      >
        <ComponentTeamInvoiceTitles
          allowClear
          showSearch
          optionFilterProp="children"
          placeholder="请选择发票抬头"
          costCenterType={costCenterType}
        />
      </Form.Item>,
      <Form.Item
        name="note"
        label="事由说明"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
        rules={[
        { required: true, message: '请填写事由说明' }]}
      >
        <TextArea
          placeholder="请填写"
        />
      </Form.Item>,
      <Form.Item
        label={<div><Tooltip placement="top" title={text}>
          <span className={styles['code-order-cost-tooltip-title']}>!</span>
        </Tooltip><span>上传附件</span></div>}
        name="assets"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
      >
        <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
      </Form.Item>,
    ];

    // 判断是否是code
    if (costCenterType === CodeSubmitType.code) {
      formItems.splice(1, 0,
        <Form.Item
          noStyle
          key="codeBusinessAccount"
          shouldUpdate={
          (prevValues, curValues) => (
            prevValues.subjectId !== curValues.subjectId
          )
        }
        >
          {({ getFieldValue }) => {
            return (
              <Form.Item
                name="codeBusinessAccount"
                label="核算中心"
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 10 }}
                rules={[{ required: true, message: '请选择核算中心' }]}
              >
                <ComponentCodeBusinessAccounting
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择核算中心"
                  subjectId={getFieldValue('subjectId')}
                  orderId={orderId}
                />
              </Form.Item>
            );
          }}
        </Form.Item>,
      );
    }
    // 判断是否是team
    if (costCenterType === CodeSubmitType.team) {
      formItems.splice(1, 0,
        <Form.Item
          noStyle
          key="codeBusinessAccount"
          shouldUpdate={
          (prevValues, curValues) => (
            prevValues.subjectId !== curValues.subjectId
          )
        }
        >
          {({ getFieldValue }) => {
            return (
              <Form.Item
                name="codeBusinessAccount"
                label="核算中心"
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 10 }}
                rules={[{ required: true, message: '请选择核算中心' }]}
              >
                <ComponentTeamBusinessAccounting
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择核算中心"
                  subjectId={getFieldValue('subjectId')}
                  orderId={orderId}
                />
              </Form.Item>
            );
          }}
        </Form.Item>,
      );
    }
    return (
      <React.Fragment>
        <CoreForm items={formItems} cols={1} />
      </React.Fragment>
    );
  };

  // 计算金额
  const renderCalculationMoney = () => {
    const totalMoney = Number(form.getFieldValue('money') || 0).toFixed(2);
    const bankList = form.getFieldValue('bankList') || [];
    // 金额汇总
    const bankMoneys = bankList.map(v => Number(v.money || 0));
    // 金额之和
    let moneys = '0.00';
    if (bankMoneys.length > 0) {
      moneys = bankMoneys.reduce((a, b) => a + b).toFixed(2);
    }
    // 差额
    const calculationMoney = Number(totalMoney - moneys).toFixed(2);
    return (
      <div style={{ textAlign: 'right' }}>
        <span>费用总金额：<span style={{ fontWeight: 'bold' }}>{Unit.exchangePriceToMathFormat(totalMoney)} 元</span></span>
        <span style={{ marginLeft: 20 }}>当前合计金额：<span style={{ fontWeight: 'bold' }}>{Unit.exchangePriceToMathFormat(moneys)}元</span></span>
        {
          Number(calculationMoney) === 0 ? (
            <CheckCircleOutlined
              style={{ marginLeft: 20, color: '#52c41a' }}
            />) : (
              <span style={{ marginLeft: 20 }}>差额：<span style={{ fontWeight: 'bold' }}>
                <span
                  style={{ color: 'red' }}
                >{Unit.exchangePriceToMathFormat(calculationMoney)}</span> 元</span></span>
          )
        }
      </div>
    );
  };
    // 支付明细
  const renderPayeeInfo = () => {
    const formItems = [
      <Form.Item
        name="bankList"
        labelCol={{ span: 0 }}
        wrapperCol={{ span: 24 }}
        validateTrigger="onSave"
        rules={[{ validator: onValidatorBankListMoney }]}
        initialValue={[{ payee_type: ExpenseCollectionType.onlineBanking, num: 1 }]}
      >
        <CollectionItem formKey={formKey} onChange={onChangePayeeInfo} />
      </Form.Item>,
    ];
    return (
      <CoreContent
        title="支付明细"
        color="rgba(255, 119, 0, 0.5)"
        style={{
          backgroundColor: 'rgba(255, 226, 200, 0.15)',
        }}
      >
        <CoreForm items={formItems} cols={1} />
        <Form.Item
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
          shouldUpdate={
            (prevValues, curValues) => (
              prevValues.money !== curValues.money ||
              prevValues.bankList !== curValues.bankList
            )
        }
        >
          {() => renderCalculationMoney()}
        </Form.Item>
      </CoreContent>
    );
  };
    // 底部
  const renderFooter = () => {
    // 付款状态已付款或无需打款情况下不可以进行操作
    if (props.paidState === CodeApproveOrderPayState.done ||
      props.paidState === CodeApproveOrderPayState.noNeed) {
      return null;
    }
    // 验票状态已验票不可以进行操作
    if (props.inspectBillState === CodeTicketState.already) {
      return null;
    }

    const removeOperat = (
      <Popconfirm
        title="您是否确定移除当前费用单"
        onConfirm={item.isShowEdit ? onClickRemove : onClickRemoveCost}
        okText="确定"
        cancelText="取消"
      >
        <a style={{ color: 'red', marginRight: 15 }}>移除费用单</a>
      </Popconfirm>
    );

    return (
      <div style={{ textAlign: 'right', borderTop: '1px solid #ccc', paddingTop: 10 }}>
        {item.isShowEdit ?
            (
              <React.Fragment>
                {removeOperat}
                <Button onClick={onEdit}>编辑</Button>
              </React.Fragment>
            ) :
          (
            <React.Fragment>
              {removeOperat}
              <a onClick={onClickReset}>重置</a>
              <Button loading={loading} onClick={onSave} style={{ marginLeft: 15 }}>保存</Button>
            </React.Fragment>
            )
          }
      </div>
    );
  };
  // 编辑
  const renderUpadteContent = () => {
    return (
      <React.Fragment>
        {/* 渲染表单 */}
        {renderForm()}

        {/* 出差信息 */}
        {(travelState || detail.travel_order_type) === CodeTravelState.oa ?
          renderOaTravelInfo() : renderTravelInfo()}

        {/* 渲染表单 */}
        {renderContentForm()}

        {/* 支付信息 */}
        {renderPayeeInfo()}

        {/* 底部 */}
        {renderFooter()}
      </React.Fragment>
    );
  };

  // 详情
  const rednerUpdateDetail = () => {
    return (
      <React.Fragment>
        {/* 详情 */}
        <TravelBusinessDetail detail={detail} costCenterType={costCenterType} />

        {/* 底部 */}
        {renderFooter()}
      </React.Fragment>
    );
  };

  // 渲染内容
  const renderContent = () => {
    if (!item.isShowEdit) {
      // 创建&编辑
      return renderUpadteContent();
    }
    // 详情
    return rednerUpdateDetail();
  };
  const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
  return (
    <Card
      key={formKey}
      className={styles['card-box']}
    >
      {
        costCenterType === CodeSubmitType.code ? (
          <span className={styles['card-box-code']}>{CodeSubmitType.description(costCenterType)}</span>
        ) : (
          <span className={styles['card-box-team']}>{CodeSubmitType.description(costCenterType)}</span>
        )
      }
      <div className={styles['card-title']}>
        差旅报销申请</div>
      <Form form={form} {...layout}>
        {renderContent()}
      </Form>
    </Card>
  );
}

const mapStateToProps = ({
  codeOrder: { travelOrder },
  fake: { businessTripDays },
}) => {
  return { travelOrder, businessTripDays };
};
export default connect(mapStateToProps)(TravelBusiness);
