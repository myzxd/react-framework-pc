/**
 * code - 审批单详情 - 流转记录 - 审批流timeLine
 * @TODO 组件不可用，未完成
 */
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import {
  Popover,
  Timeline,
} from 'antd';
import {
 ExpenseExamineOrderProcessState,
} from '../../../../../application/define';

const FlowTimeLine = ({
  dispatch,
  flowProcessList = {}, // 审批流流程数据
  approveOrderDetail = {}, // 审批单详情
}) => {
  // 审批单id
  const {
    _id: orderId,
  } = approveOrderDetail;
  // 是否显示全部
  const [isShowMore, setIsShowMore] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'codeFlow/getFlowProcessList',
      payload: { orderId },
    });

    return () => {
      dispatch({
        type: 'codeFlow/resetFlowProcessList',
      });
    };
  }, [dispatch, orderId]);

  const {
    name, // 审批流名称
    nodeTimeLineList = [],

  } = flowProcessList;

  // 节点操作人
  const renderAccountNmae = (node) => {
    const { accoutList = [] } = node;
    if (Array.isArray(accoutList) || accoutList.length < 1) {
      return '';
    }

    return (
      <span>
        (
          {
            accoutList.reduce((acc, cur, idx) => {
              if (idx === 0) return cur.name;
              return `${acc}, ${cur.name}`;
            }, '')
          }
        )
      </span>
    );
  };

  // @TODO 未完善
  // color & style
  const renderProps = (node) => {
    const {
      state,
    } = node;

    if (state === ExpenseExamineOrderProcessState.processing
      || state === ExpenseExamineOrderProcessState.pendding) {
      return {
        style: { color: '#FF7700' },
        color: '#FF7700',
      };
    }

    if (state === ExpenseExamineOrderProcessState.finish
      || state === ExpenseExamineOrderProcessState.finish
      || state === ExpenseExamineOrderProcessState.close
      || state === ExpenseExamineOrderProcessState.deleted) {
      return {
        style: { color: '#ccc' },
        color: '#ccc',
      };
    }
  };

  // 渲染时间轴
  const renderTimeLine = () => {
    return (
      <Timeline>
        {
          nodeTimeLineList.map((n, key) => {
            const { nodeName } = n;
            return (
              <Timeline.Item
                key={n._id || key}
                {...renderProps(n)}
              >
                {nodeName}
                {renderAccountNmae(n)}
              </Timeline.Item>
            );
          })
        }
        {
          <Timeline.Item key="operate" color="#ccc">
            <span
              onClick={() => setIsShowMore(!isShowMore)}
            >
              {isShowMore === true ? '收起 <<' : '显示更多 >>'}
            </span>
          </Timeline.Item>
        }
      </Timeline>
    );
  };

  return (
    <div>
      <span>{name}</span>
      <Popover content={renderTimeLine()}>
        <InfoCircleOutlined />
      </Popover>
    </div>
  );
};

const mapStateToProps = ({
  codeOrder: { flowProcessList },
}) => {
  return { flowProcessList };
};

export default connect(mapStateToProps)(FlowTimeLine);
