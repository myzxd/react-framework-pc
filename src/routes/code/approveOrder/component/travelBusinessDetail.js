/**
 * code - 差旅报销 - 详情
*/
import dot from 'dot-prop';
import React from 'react';
import moment from 'moment';
import { Form, Row, Col } from 'antd';
import {
  CheckCircleOutlined,
} from '@ant-design/icons';

import {
  Unit,
  ExpenseCollectionType,
  CodeSubmitType,
  CodeTravelState,
} from '../../../../application/define';
import { CoreForm, CoreContent } from '../../../../components/core';
import PageUpload from '../../components/upload';


function TravelBusinessDetail(props) {
  const { detail, costCenterType } = props;
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


  // 出差信息
  const renderTravelInfo = () => {
    const bizExtraTravelApplyOrderInfo = dot.get(detail, 'travel_order_info', {});
    const departure = bizExtraTravelApplyOrderInfo.departure || {}; // 出发地
    const destination = bizExtraTravelApplyOrderInfo.destination || {}; // 目的地
    const formItems = [
      <Form.Item
        label="出差申请单号"
      >
        <div>
          {
            bizExtraTravelApplyOrderInfo._id ?
              (
                <a href={`/#/Expense/TravelApplication/Detail?id=${bizExtraTravelApplyOrderInfo._id}`} target="_blank" rel="noopener noreferrer" >{dot.get(bizExtraTravelApplyOrderInfo, '_id', '--')}</a>
            ) : '--'
          }
        </div>
      </Form.Item>,
      <Form.Item
        label="实际出差人"
      >
        <div>
          {dot.get(bizExtraTravelApplyOrderInfo, 'apply_user_name', '--')}
        </div>
      </Form.Item>,
      <Form.Item
        label="预计出差时间"
      >
        <div>
          {bizExtraTravelApplyOrderInfo.expect_start_at ? moment(bizExtraTravelApplyOrderInfo.expect_start_at).format('YYYY-MM-DD HH:00') : ''}--
          {bizExtraTravelApplyOrderInfo.expect_done_at ? moment(bizExtraTravelApplyOrderInfo.expect_done_at).format('YYYY-MM-DD HH:00') : ''}
        </div>
      </Form.Item>,
      <Form.Item label="出发地">
        {
          Object.values(getDeparture(departure)).join('-')
        }
      </Form.Item>,
      <Form.Item label="目的地">
        {
          getDestination([destination]).map(i => Object.values(i).join('-')).join(' 、')
        }
      </Form.Item>,
      {
        span: 12,
        render: (
          <Form.Item
            label="实际出差时间"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            {bizExtraTravelApplyOrderInfo.actual_start_at ? moment(bizExtraTravelApplyOrderInfo.actual_start_at).format('YYYY-MM-DD HH:00') : ''}--
          {bizExtraTravelApplyOrderInfo.actual_done_at ? moment(bizExtraTravelApplyOrderInfo.actual_done_at).format('YYYY-MM-DD HH:00') : ''}
          </Form.Item>
        ),
      },
      <Form.Item
        label="出差天数"
      >
        <div>
          {
            bizExtraTravelApplyOrderInfo.actual_apply_days || '--'
          }
          天
          {
            // 实际出差天数大于预计出差天数
            bizExtraTravelApplyOrderInfo.actual_apply_days > bizExtraTravelApplyOrderInfo.expect_apply_days ?
              (<span>（<span style={{ color: 'red' }}>申请出差天数：{bizExtraTravelApplyOrderInfo.expect_apply_days}天</span>）</span>)
              : ''
        }
        </div>
      </Form.Item>,
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 10 } };
    return (
      <CoreForm items={formItems} cols={4} layout={layout} />
    );
  };
  // 事务出差信息
  const renderOaTravelInfo = () => {
    const travelApplyOrderInfo = dot.get(detail, 'travel_order_info', {});
    const items = travelApplyOrderInfo;
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
            label="实际出差时间"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            {items.actual_start_at ? moment(items.actual_start_at).format('YYYY-MM-DD HH:00') : ''}--
              {items.actual_done_at ? moment(items.actual_done_at).format('YYYY-MM-DD HH:00') : ''}
          </Form.Item>
              ),
      },
      <Form.Item
        label="出差天数"
      >
        <div>
          {
            items.actual_apply_days || '--'
          }
          天
          {
            // 实际出差天数大于预计出差天数
            items.actual_apply_days > items.expect_apply_days ?
              (<span>（<span style={{ color: 'red' }}>申请出差天数：{items.expect_apply_days}天</span>）</span>)
              : ''
        }
        </div>
      </Form.Item>,
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 10 } };
    return (
      <CoreForm items={formItems} cols={4} layout={layout} />
    );
  };
  // 渲染表单
  const renderContent = () => {
    const formItems = [
      <Form.Item
        label="出差单号"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 10 }}
      >
        {dot.get(detail, 'travel_order_info', {})._id}
      </Form.Item>,
    ];
    return (
      <CoreForm items={formItems} cols={1} />
    );
  };

  // 计算金额
  const renderCalculationMoney = () => {
    const totalMoney = Unit.exchangePriceToYuan(dot.get(detail, 'total_money', 0)).toFixed(2);
    const bankList = dot.get(detail, 'payee_list', []);
    // 金额汇总
    const bankMoneys = bankList.map(v => Unit.exchangePriceToYuan(v.money));
    // 金额之和
    let moneys = 0;
    if (bankMoneys.length > 0) {
      moneys = bankMoneys.reduce((a, b) => a + b).toFixed(2);
    }
    // 差额
    const calculationMoney = Number(totalMoney - moneys).toFixed(2);
    return (
      <div style={{ textAlign: 'right' }}>
        <span>费用总金额：{Unit.exchangePriceToMathFormat(totalMoney)}元</span>
        <span style={{ marginLeft: 20 }}>当前合计金额：{Unit.exchangePriceToMathFormat(moneys)}元</span>
        {
          Number(calculationMoney) === 0 ? (
            <CheckCircleOutlined
              style={{ marginLeft: 20, color: '#52c41a' }}
            />) : (
              <span style={{ marginLeft: 20 }}>差额：<span
                style={{ color: 'red' }}
              >{Unit.exchangePriceToMathFormat(calculationMoney)}</span> 元</span>
          )
        }
      </div>
    );
  };

  // 渲染表单
  const renderContentForm = () => {
    const highSpeedTrainFee = dot.get(detail, 'travel_fee_extra_data.high_speed_train_fee', 0);
    const aircraftFee = dot.get(detail, 'travel_fee_extra_data.aircraft_fee', 0);
    const trainOrdinarySoftSleeperFee = dot.get(detail, 'travel_fee_extra_data.train_ordinary_soft_sleeper_fee', 0);
    const busFee = dot.get(detail, 'travel_fee_extra_data.bus_fee', 0);
    const selfDrivingFee = dot.get(detail, 'travel_fee_extra_data.self_driving_fee', 0);
    const formItems = [
      <Form.Item
        label="科目"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 10 }}
      >
        {dot.get(detail, 'biz_account_info.name', '--')}
        {dot.get(detail, 'biz_account_info.ac_code', undefined) ?
          `(${dot.get(detail, 'biz_account_info.ac_code', undefined)})` : null}
      </Form.Item>,
      <Form.Item
        label="核算中心"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 10 }}
      >
        {
          costCenterType === CodeSubmitType.code ?
          dot.get(detail, 'biz_code_info.name', '--') :
          dot.get(detail, 'biz_team_info.name', '--')
        }
      </Form.Item>,
      <Col push={1}>
        <span style={{ fontWeight: 500 }}>差旅费用明细</span>
        <span style={{ marginLeft: 10 }}>明细超标将会用红色字体显示</span>
      </Col>,
      <Form.Item
        label=""
        wrapperCol={{ span: 22, push: 1 }}
      >
        <Row style={{ marginLeft: 10 }}>
          <Col style={{ marginTop: 10 }} span={6}>
            <span>补助(元): </span>
            <span
              style={{
                flex: 1,
                wordBreak: 'break-word',
                color: dot.get(detail, 'travel_fee_extra_data.is_out_subsidy_fee', false) ? 'red' : '',
              }}
            >{Unit.exchangePriceCentToMathFormat(dot.get(detail, 'travel_fee_extra_data.subsidy_fee', 0))}</span></Col>
          <Col style={{ marginTop: 10 }} span={6}>
            <span>住宿(元): </span>
            <span
              style={{
                flex: 1,
                wordBreak: 'break-word',
                color: dot.get(detail, 'travel_fee_extra_data.is_out_stay_fee', false) ? 'red' : '',
              }}
            >{Unit.exchangePriceCentToMathFormat(dot.get(detail, 'travel_fee_extra_data.stay_fee', 0))}</span> </Col>
          <Col style={{ marginTop: 10 }} span={6}>
            <span>市内交通费(元): </span>
            <span
              style={{
                flex: 1,
                wordBreak: 'break-word' }}
            >{Unit.exchangePriceCentToMathFormat(dot.get(detail, 'travel_fee_extra_data.urban_transport_fee', 0))}</span> </Col>
          {
            highSpeedTrainFee ? (
              <Col style={{ marginTop: 10 }} span={6}>
                <span>动车/高铁交通费(元): </span>
                <span
                  style={{
                    flex: 1,
                    wordBreak: 'break-word' }}
                >{Unit.exchangePriceCentToMathFormat(highSpeedTrainFee)}</span> </Col>
            ) : null
          }
          {
            aircraftFee ? (
              <Col style={{ marginTop: 10 }} span={6}>
                <span>飞机交通费(元): </span>
                <span
                  style={{
                    flex: 1,
                    wordBreak: 'break-word' }}
                >{Unit.exchangePriceCentToMathFormat(aircraftFee)}</span> </Col>
            ) : null
          }
          {
            trainOrdinarySoftSleeperFee ? (
              <Col style={{ marginTop: 10 }} span={6}>
                <span>普通软卧交通费(元): </span>
                <span
                  style={{
                    flex: 1,
                    wordBreak: 'break-word' }}
                >{Unit.exchangePriceCentToMathFormat(trainOrdinarySoftSleeperFee)}</span> </Col>
            ) : null
          }
          {
            busFee ? (
              <Col style={{ marginTop: 10 }} span={6}>
                <span>客车交通费(元): </span>
                <span
                  style={{
                    flex: 1,
                    wordBreak: 'break-word' }}
                >{Unit.exchangePriceCentToMathFormat(busFee)}</span> </Col>
            ) : null
          }
          {
            selfDrivingFee ? (
              <Col style={{ marginTop: 10 }} span={6}>
                <span>自驾交通费(元): </span>
                <span
                  style={{
                    flex: 1,
                    wordBreak: 'break-word',
                  }}
                > {Unit.exchangePriceCentToMathFormat(selfDrivingFee)}</span></Col>
            ) : null
          }
          {/* 判断历史数据是否有金额，有显示，没有不显示 */}
          {dot.get(detail, 'travel_fee_extra_data.transport_fee', 0) ? (
            <Col style={{ marginTop: 10 }} span={6}>
              <span>往返交通费(元): </span>
              <span
                style={{
                  flex: 1,
                  wordBreak: 'break-word' }}
              >
                {Unit.exchangePriceCentToMathFormat(dot.get(detail, 'travel_fee_extra_data.transport_fee', 0))}
              </span>
            </Col>
        ) : null}
          {/* 判断历史数据是否有金额，有显示，没有不显示 */}
          {
          dot.get(detail, 'travel_fee_extra_data.other_fee', 0) ? (
            <Col style={{ marginTop: 10 }} span={6}>
              <span>其他(元): </span>
              <span
                style={{
                  flex: 1,
                  wordBreak: 'break-word' }}
              >
                {Unit.exchangePriceCentToMathFormat(dot.get(detail, 'travel_fee_extra_data.other_fee', 0))}
              </span>
            </Col>
          ) : null
        }
        </Row>
      </Form.Item>,
      <Form.Item
        label="报销金额"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 10 }}
      >
        {Unit.exchangePriceCentToMathFormat(dot.get(detail, 'total_money', 0))}
      </Form.Item>,
      <Form.Item
        label="发票抬头"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
      >
        {dot.get(detail, 'invoice_title', '--')}
      </Form.Item>,
      <Form.Item
        label="事由说明"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
      >
        <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{dot.get(detail, 'note', '--')}</div>
      </Form.Item>,
      <Form.Item
        label="上传附件"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
      >
        <PageUpload
          displayMode
          value={PageUpload.getInitialValue(detail, 'attachment_private_urls')}
        />
      </Form.Item>,
    ];

    return (
      <React.Fragment>
        <CoreForm items={formItems} cols={1} />
      </React.Fragment>
    );
  };
  // 支付明细
  const renderPayeeInfo = () => {
    const payeeList = dot.get(detail, 'payee_list', []); // 支付明细
    return (
      <CoreContent
        title="支付明细"
        color="rgba(255, 119, 0, 0.5)"
        style={{
          backgroundColor: 'rgba(255, 226, 200, 0.15)',
        }}
      >
        {
          payeeList.map((v, i) => {
            return (
              <Row key={i}>
                <Col span={6}>
                  <Form.Item
                    label="收款人"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    {dot.get(v, 'card_name', '--')}
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="开户支行"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    {dot.get(v, 'bank_details', '--')}
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="收款账户"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                      {dot.get(v, 'card_num', '--')}</div>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="报销金额"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    {dot.get(v, 'money') >= 0 ? Unit.exchangePriceCentToMathFormat(dot.get(v, 'money')) : '--'}
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="收款方式"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    {ExpenseCollectionType.description(dot.get(v, 'payee_type', '--'))}
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="手机号"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    {dot.get(v, 'card_phone', '--')}
                  </Form.Item>
                </Col>
              </Row>
            );
          })
        }
        <Form.Item
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
        >
          {renderCalculationMoney()}
        </Form.Item>
      </CoreContent>
    );
  };

  return (
    <React.Fragment>
      {/* 渲染表单 */}
      {renderContent()}
      {/* 出差信息 */}
      {CodeTravelState.oa === detail.travel_order_type ? renderOaTravelInfo() : renderTravelInfo()}
      {/* 渲染表单 */}
      {renderContentForm()}
      {/* 支付信息 */}
      {renderPayeeInfo()}
    </React.Fragment>
  );
}

export default TravelBusinessDetail;
