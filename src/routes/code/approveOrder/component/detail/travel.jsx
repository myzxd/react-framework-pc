/**
 * code - 审批单详情 - 差旅报销单单据组件
 */
import { connect } from 'dva';
import dot from 'dot-prop';
import React, { useEffect } from 'react';
import moment from 'moment';
import {
  Form,
} from 'antd';
import {
  CoreForm,
  CoreFinder,
} from '../../../../../components/core';
import {
  Unit,
  CodeCostCenterType,
  InvoiceAjustAction,
  CodeTravelState,
} from '../../../../../application/define';
import PaymentDetail from './paymentDetail';
import Invoice from './invoice';
import CostItem from './costItem';

const { CoreFinderList } = CoreFinder;

// form layout
const formLayoutF = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
const formLayoutO = { labelCol: { span: 2 }, wrapperCol: { span: 22 } };
const formLayoutD = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
const formLayoutT = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };

function Travel(props) {
  const {
    cost = {},
    orderId, // 审批单id
    approveOrderDetail = {}, // 审批单详情
    dispatch,
    travelOrder,
  } = props;
  const namespace = cost._id;
  const detail = travelOrder[namespace] || {}; // 差旅单详情

  useEffect(() => {
    // 判断是否有值，红冲费用单不调差旅接口
    if (cost._id && orderId && cost.type !== InvoiceAjustAction.invoiceAdjust) {
      const payload = {
        id: cost._id,
        orderId,
        namespace,
      };
      dispatch({ type: 'codeOrder/fetchTravelOrder', payload });
    }
    return () => {
      // 清除数据
      dispatch({ type: 'codeOrder/reduceTravelOrder', payload: { namespace, result: {} } });
    };
  }, [dispatch, cost, orderId, namespace]);

  const {
    plugin_extra_meta: pluginExtraMeta = {}, // 外部审批单标识
  } = approveOrderDetail;
  // 红冲费用单，渲染通用模板
  if (cost.type === InvoiceAjustAction.invoiceAdjust) {
    const itemProps = {
      cost,
      orderId,
      approveOrderDetail,
    };
    return <CostItem {...itemProps} />;
  }

  // 无数据
  if (Object.keys(detail).length < 1) return <div />;

  // 获取出发地
  const getDeparture = (departure = {}) => {
    if (!departure) return {};
    const res = {
      province: departure.province_name,
      city: departure.city_name,
      area: departure.area_name,
    };

    departure.detailed_address && (res.detailed_address = departure.detailed_address);

    return res;
  };

  // 获取出发地
  const getDestination = (data = []) => {
    if (!data
      || !Array.isArray(data)
    ) return [];

    const res = data.map((i) => {
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

  // 预览组件
  const renderCorePreview = (value) => {
    if (Array.isArray(value) && dot.get(value, '0.file_url')) {
      const data = value.map((item) => {
        return { key: item.file_name, url: item.file_url };
      });
      return (
        <CoreFinderList data={data} />
      );
    }
    return '--';
  };

  // 差率报销明细
  const renderTravelCostDetail = () => {
    // 明细
    const { travel_fee_extra_data: feeData = {} } = detail;
    const {
      subsidy_fee: subsidyFee, // 补助
      stay_fee: stayFee, // 住宿
      transport_fee: transportFee, // 往返交通费
      urban_transport_fee: urbanTransportFee, // 市内交通费
      other_fee: otherFee, // 其他
    } = feeData;

    const formItems = [
      <Form.Item
        label="补助"
        {...formLayoutD}
      >
        <span
          style={{
            color: dot.get(feeData, 'is_out_subsidy_fee', false) ? 'red' : '',
          }}
        >
          {Unit.exchangePriceCentToMathFormat(subsidyFee)}
        </span>
        元
      </Form.Item>,
      <Form.Item
        label="住宿"
        {...formLayoutD}
      >
        <span
          style={{
            color: dot.get(feeData, 'is_out_stay_fee', false) ? 'red' : '',
          }}
        >
          {Unit.exchangePriceCentToMathFormat(stayFee)}
        </span>
        元
      </Form.Item>,
      <Form.Item
        label="市内交通费"
        {...formLayoutD}
      >
        {Unit.exchangePriceCentToMathFormat(urbanTransportFee)}元
      </Form.Item>,
    ];

    // 判断是否有金额
    if (dot.get(feeData, 'high_speed_train_fee')) {
      formItems.push(
        <Form.Item
          label="动车/高铁交通费"
          {...formLayoutD}
        >
          {Unit.exchangePriceCentToMathFormat(dot.get(feeData, 'high_speed_train_fee'))}元
      </Form.Item>);
    }
    // 判断是否有金额
    if (dot.get(feeData, 'aircraft_fee')) {
      formItems.push(
        <Form.Item
          label="飞机交通费"
          {...formLayoutD}
        >
          {Unit.exchangePriceCentToMathFormat(dot.get(feeData, 'aircraft_fee'))}元
      </Form.Item>);
    }
    // 判断是否有金额
    if (dot.get(feeData, 'train_ordinary_soft_sleeper_fee')) {
      formItems.push(
        <Form.Item
          label="普通软卧交通费"
          {...formLayoutD}
        >
          {Unit.exchangePriceCentToMathFormat(dot.get(feeData, 'train_ordinary_soft_sleeper_fee'))}元
      </Form.Item>);
    }
    // 判断是否有金额
    if (dot.get(feeData, 'bus_fee')) {
      formItems.push(
        <Form.Item
          label="客车交通费"
          {...formLayoutD}
        >
          {Unit.exchangePriceCentToMathFormat(dot.get(feeData, 'bus_fee'))}元
      </Form.Item>);
    }
    // 判断是否有金额
    if (dot.get(feeData, 'self_driving_fee')) {
      formItems.push(
        <Form.Item
          label="自驾交通费"
          {...formLayoutD}
        >
          {Unit.exchangePriceCentToMathFormat(dot.get(feeData, 'self_driving_fee'))}元
      </Form.Item>);
    }
    // 判断是否有金额
    if (transportFee) {
      formItems.push(
        <Form.Item
          label="往返交通费"
          {...formLayoutD}
        >
          {Unit.exchangePriceCentToMathFormat(transportFee)}元
      </Form.Item>);
    }
    if (otherFee) {
      formItems.push(
        <Form.Item
          label="其他"
          {...formLayoutD}
        >
          {Unit.exchangePriceCentToMathFormat(otherFee)}元
      </Form.Item>);
    }
    return (
      <div
        style={{ backgroundColor: '#F6F6F6', borderRadius: '2px' }}
      >
        <div
          style={{ color: '#282D36', height: 32, lineHeight: '32px', fontWeight: 500 }}
        >差旅费用明细
             <span style={{ fontWeight: 400, marginLeft: 10 }}>明细超标将会用红色字体显示</span>
        </div>
        <Form
          className="affairs-flow-detail-basic"
        >
          <CoreForm items={formItems} cols={4} />
        </Form>
      </div>
    );
  };

  // 基本信息
  const renderBasic = () => {
    // 核算中心
    let costCenterType = '--';
    // code
    if (dot.get(detail, 'cost_center_type') === CodeCostCenterType.code) {
      costCenterType = dot.get(detail, 'biz_code_info.name', '--');
    }

    // team
    if (dot.get(detail, 'cost_center_type') === CodeCostCenterType.team) {
      costCenterType = dot.get(detail, 'biz_team_info.name', '--');
    }

    // formItems
    const formItems = [
      <Form.Item
        label="科目"
        {...formLayoutF}
      >
        {dot.get(detail, 'biz_account_info.name', '--')}
        {
          dot.get(detail, 'biz_account_info.ac_code')
            ? `(${dot.get(detail, 'biz_account_info.ac_code')})`
            : ''
        }
      </Form.Item>,
      <Form.Item
        label="核算中心"
        {...formLayoutF}
      >
        {costCenterType}
      </Form.Item>,
    ];

    // 一行参数
    const formItemOne = [
      <Form.Item
        label=""
        wrapperCol={{ span: 22, push: 1 }}
      >
        {renderTravelCostDetail()}
      </Form.Item>,
      <Form.Item
        label="提报金额"
        {...formLayoutO}
      >
        <div style={{ height: 32, lineHeight: '32px' }}>
          {Unit.exchangePriceCentToMathFormat(dot.get(detail, 'total_money', 0))}元
        </div>
      </Form.Item>,
      <Form.Item
        label="发票抬头"
        {...formLayoutO}
      >
        {dot.get(detail, 'invoice_title', '--')}
      </Form.Item>,
      <Form.Item
        label="事项说明"
        {...formLayoutO}
      >
        <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {dot.get(detail, 'note', '--')}
        </div>
      </Form.Item>,
      <Form.Item
        label="附件"
        {...formLayoutO}
      >
        {renderCorePreview(dot.get(detail, 'attachment_private_urls', []))}
      </Form.Item>,
    ];

    return (
      <Form className="affairs-flow-detail-basic">
        <CoreForm items={formItems} cols={4} />
        <CoreForm items={formItemOne} cols={1} />
      </Form>
    );
  };

  // 出差单信息
  const renderBusiness = () => {
    const {
      travel_order_info: businessData = {}, // 出差信息
   } = detail;

    const {
      expect_start_at: expectStartAt, // 预计出差开始时间,
      expect_done_at: expectDoneAt, // 预计出差结束时间
      actual_start_at: actualStartAt, // 实际出差开始时间
      actual_done_at: actualDoneAt, // 实际出差结束时间
      departure = {}, // 出发地
      destination = {}, // 目的地
    } = businessData;
    // 预计出差时间
    const expectAt = (expectStartAt && expectDoneAt) ?
      `${moment(expectStartAt).format('YYYY.MM.DD HH:00')} - ${moment(expectDoneAt).format('YYYY.MM.DD HH:00')}`
      : '--';

    // 实际出差时间
    const actualAt = (actualStartAt && actualDoneAt) ?
      `${moment(actualStartAt).format('YYYY.MM.DD HH:00')} - ${moment(actualDoneAt).format('YYYY.MM.DD HH:00')}`
      : '--';

    // 出差单号（外部不能跳转）
    const businessId = dot.get(pluginExtraMeta, 'is_plugin_order', false) ?
      dot.get(businessData, '_id', '--')
      : (
        <a
          href={`/#/Expense/TravelApplication/Detail?id=${businessData._id}`}
          target="_blank"
          rel="noopener noreferrer"
        >{dot.get(businessData, '_id', '--')}</a>
      );

    const formItems = [
      <Form.Item
        label="出差单号"
        {...formLayoutF}
      >
        {businessId}
      </Form.Item>,
      <Form.Item
        label="实际出差人"
        {...formLayoutF}
      >
        {dot.get(businessData, 'apply_user_name', '--')}
      </Form.Item>,
      <Form.Item
        label="预计出差时间"
        {...formLayoutF}
      >
        {expectAt}
      </Form.Item>,
      <Form.Item
        label="实际出差时间"
        {...formLayoutF}
      >
        {actualAt}
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
      <Form.Item
        label="出差天数"
        {...formLayoutF}
      >
        {dot.get(businessData, 'actual_apply_days', '--')}天
        {
          // 实际出差天数大于预计出差天数
          dot.get(businessData, 'actual_apply_days') > dot.get(businessData, 'expect_apply_days') ?
            (<span>（<span style={{ color: 'red' }}>申请出差天数：{dot.get(businessData, 'expect_apply_days')}天</span>）</span>) : ''
      }
      </Form.Item>,
    ];

    return (
      <Form
        className="affairs-flow-detail-basic"
        style={{ backgroundColor: '#F6F6F6', borderRadius: '2px' }}
      >
        <CoreForm items={formItems} cols={4} />
      </Form>
    );
  };
  // 出差单信息
  const renderOaBusiness = () => {
    const {
      travel_order_info: businessData = {}, // 出差信息
   } = detail;

    const {
      expect_start_at: expectStartAt, // 预计出差开始时间,
      expect_done_at: expectDoneAt, // 预计出差结束时间
      actual_start_at: actualStartAt, // 实际出差开始时间
      actual_done_at: actualDoneAt, // 实际出差结束时间
      destination_list: destinationList = [], // 目的地
      departure = {}, // 出发地
    } = businessData;
    // 预计出差时间
    const expectAt = (expectStartAt && expectDoneAt) ?
      `${moment(expectStartAt).format('YYYY.MM.DD HH:00')} - ${moment(expectDoneAt).format('YYYY.MM.DD HH:00')}`
      : '--';

    // 实际出差时间
    const actualAt = (actualStartAt && actualDoneAt) ?
      `${moment(actualStartAt).format('YYYY.MM.DD HH:00')} - ${moment(actualDoneAt).format('YYYY.MM.DD HH:00')}`
      : '--';

    // 出差单号（外部不能跳转）
    const businessId = dot.get(pluginExtraMeta, 'is_plugin_order', false) ?
      dot.get(businessData, '_id', '--')
      : (
        <a
          href={`/#/Expense/Manage/ExamineOrder/Detail?orderId=${businessData.oa_application_order_id}`}
          target="_blank"
          rel="noopener noreferrer"
        >{dot.get(businessData, '_id', '--')}</a>
      );

    const formItems = [
      <Form.Item
        label="出差单号"
        {...formLayoutF}
      >
        {businessId}
      </Form.Item>,
      <Form.Item
        label="实际出差人"
        {...formLayoutF}
      >
        {dot.get(businessData, 'apply_user_name', '--')}
      </Form.Item>,
      <Form.Item
        label="部门"
        {...formLayoutF}
      >
        <div>
          {/* 部门 */}
          {dot.get(businessData, 'department_info.name', '--')}
        </div>
      </Form.Item>,
      <Form.Item
        label="岗位"
        {...formLayoutF}
      >
        <div>
          {/* 岗位 */}
          {dot.get(businessData, 'job_info.name', '--')}
        </div>
      </Form.Item>,

      <Form.Item
        label="职级"
        {...formLayoutF}
      >
        <div>
          {/* 职级 */}
          {dot.get(businessData, 'work_level', '--')}
        </div>
      </Form.Item>,
      {
        span: 24,
        render: (
          <Form.Item
            label="预计出差时间"
            {...formLayoutO}
          >
            {expectAt}
          </Form.Item>
        ),
      },
      {
        span: 24,
        render: (
          <Form.Item
            label="出发地"
            {...formLayoutO}
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
            {...formLayoutO}
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
            label="实际出差时间"
            {...formLayoutT}
          >
            {actualAt}
          </Form.Item>
        ),
      },
      {
        span: 12,
        render: (
          <Form.Item
            label="出差天数"
            {...formLayoutT}
          >
            {dot.get(businessData, 'actual_apply_days', '--')}天
            {
              // 实际出差天数大于预计出差天数
              dot.get(businessData, 'actual_apply_days') > dot.get(businessData, 'expect_apply_days') ?
                (<span>（<span style={{ color: 'red' }}>申请出差天数：{dot.get(businessData, 'expect_apply_days')}天</span>）</span>) : ''
          }
          </Form.Item>
        ),
      },
    ];

    return (
      <Form
        className="affairs-flow-detail-basic"
        style={{ backgroundColor: '#F6F6F6', borderRadius: '2px' }}
      >
        <CoreForm items={formItems} cols={4} />
      </Form>
    );
  };

  // 发票
  const renderInvoice = () => {
    if (Object.keys(detail).length <= 0) return;

    return (
      <Invoice
        detail={detail}
        cost={cost}
        examineOrderDetail={approveOrderDetail}
      />
    );
  };

  return (
    <React.Fragment>
      {/* 出差信息 */}
      {detail.travel_order_type === CodeTravelState.oa ? renderOaBusiness() : renderBusiness()}

      {/* 基本信息 */}
      {renderBasic()}

      {/* 支付信息 */}
      <PaymentDetail
        detail={detail}
        isShowMoney={false}
        isShowTitle
      />

      {/* 发票信息 */}
      {renderInvoice()}
    </React.Fragment>
  );
}

const mapStateToProps = ({
  codeOrder: { travelOrder },
}) => {
  return { travelOrder };
};
export default connect(mapStateToProps)(Travel);
