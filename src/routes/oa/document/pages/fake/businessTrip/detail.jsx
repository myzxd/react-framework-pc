/**
 * 事务审批 - 假勤管理 - 出差申请 - 详情
 */
import moment from 'moment';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import {
  Form,
} from 'antd';
import {
  CoreForm,
  CoreContent,
} from '../../../../../../components/core';
import {
  ExpenseBusinessTripType,
  ExpenseBusinessTripWay,
} from '../../../../../../application/define';

const BusinessTripDetail = ({
  businessTripDetail = {}, // 出差单详情
  dispatch,
  query,
  businessTripDays, // 出差天数
}) => {
  // 出差单id
  const { id } = query;
  useEffect(() => {
    id && dispatch({
      type: 'fake/getBusinssTripDetail',
      payload: { id },
    });

    return () => {
      dispatch({ type: 'fake/resetBusinssTripDetail' });
    };
  }, [dispatch, id]);

  useEffect(() => {
    const {
      expect_start_at: expectStartAt,
      expect_done_at: expectDoneAt,
    } = businessTripDetail;

    expectStartAt && expectDoneAt && dispatch({
      type: 'fake/getBusinssTripDays',
      payload: {
        expectStartAt: moment(expectStartAt).format('YYYY-MM-DD HH:mm:ss'),
        expectDoneAt: moment(expectDoneAt).format('YYYY-MM-DD HH:mm:ss'),
      },
    });
  }, [dispatch, businessTripDetail]);

  // 出差人信息
  const renderPersonInfo = () => {
    const {
      together_user_names: togetherUserNames, // 同行人员
    } = businessTripDetail;
    const formItems = [
      <Form.Item label="实际出差人">
        {dot.get(businessTripDetail, 'order_account_info.name', '--')}
      </Form.Item>,
      <Form.Item label="部门">
        {dot.get(businessTripDetail, 'department_info.name', '--')}
      </Form.Item>,
      <Form.Item label="岗位">
        {dot.get(businessTripDetail, 'job_info.name', '--')}
      </Form.Item>,
      <Form.Item label="职级">
        {dot.get(businessTripDetail, 'work_level', '--')}
      </Form.Item>,
      <Form.Item label="联系方式">
        {dot.get(businessTripDetail, 'apply_user_phone', '--')}
      </Form.Item>,
      <Form.Item label="同行人员">
        {
          Array.isArray(togetherUserNames) && togetherUserNames.length > 0 ?
            togetherUserNames.join(' 、')
            : '--'
        }
      </Form.Item>,
    ];

    return (
      <CoreContent
        title="出差人信息"
        className="affairs-flow-basic"
      >
        <Form labelAlign="left">
          <CoreForm items={formItems} cols={4} />
        </Form>
      </CoreContent>
    );
  };

  // 出差信息
  const renderBusinessInfo = () => {
    const {
      biz_type: bizType, // 出差类别
      transport_kind: transportKind, // 出差方式
      expect_start_at: expectStartAt, // 预计出差开始时间
      expect_done_at: expectDoneAt, // 预计出差结束时间
      working_plan: workingPlan, // 工作安排
    } = businessTripDetail;

    const formItems = [
      <Form.Item label="出差类别">
        {
          bizType ?
            ExpenseBusinessTripType.description(bizType)
            : '--'
        }
      </Form.Item>,
      {
        span: 20,
        render: (
          <Form.Item label="出差方式">
            {
              Array.isArray(transportKind) ?
                transportKind.map(i => ExpenseBusinessTripWay.description(i)).join(' 、')
                : '--'
            }
          </Form.Item>
        ),
      },
      <Form.Item label="出发地">
        {
          dot.get(businessTripDetail, 'departure.city_name')
        }
      </Form.Item>,
      <Form.Item label="目的地">
        {
          dot.get(businessTripDetail, 'destination_list.0.city_name')
        }
      </Form.Item>,
      {
        span: 12,
        render: (
          <Form.Item label="预计出差时间">
            {
              expectStartAt && expectDoneAt ?
                `${moment(expectStartAt).format('YYYY.MM.DD HH:mm')} - ${moment(expectDoneAt).format('YYYY.MM.DD HH:mm')}`
                  : '--'
            }
            <span
              style={{ marginLeft: 100 }}
            >出差天数：{businessTripDays.travel_days || '--'}</span>
          </Form.Item>
        ),
      },
      {
        span: 24,
        render: (
          <Form.Item label="原由及工作安排说明">
            <div
              style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            >{workingPlan || '--'}</div>
          </Form.Item>
        ),
      },
    ];

    return (
      <CoreContent
        title="出差信息"
        className="affairs-flow-basic"
      >
        <Form labelAlign="left">
          <CoreForm items={formItems} cols={6} />
        </Form>
      </CoreContent>
    );
  };

  return (
    <React.Fragment>
      {renderPersonInfo()}
      {renderBusinessInfo()}
    </React.Fragment>
  );
};

const mapStateToProps = ({
  fake: {
    businessTripDetail,
    businessTripDays,
  },
}) => {
  return {
    businessTripDetail,
    businessTripDays,
  };
};

export default connect(mapStateToProps)(BusinessTripDetail);
