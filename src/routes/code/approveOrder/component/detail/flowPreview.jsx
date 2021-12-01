/**
 * code - 审批单详情 - 流转记录 - 审批流节点预览
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import {
  Popover,
  Timeline,
} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const FlowPreview = ({
  dispatch,
  flowPreviewList = [], // 审批流预览数据
  approveOrderDetail, // 审批单详情
}) => {
  const {
    _id: orderId, // 审批单id
  } = approveOrderDetail;
  useEffect(() => {
    orderId && dispatch({
      type: 'codeFlow/getFlowPreview',
      payload: { orderId },
    });

    return () => dispatch({
      type: 'codeFlow/resetFlowPreview',
    });
  }, [dispatch, orderId]);

  if (!flowPreviewList || !Array.isArray(flowPreviewList) || flowPreviewList.length < 1) return <div />;

  // 审批流节点信息
  const getFlowNodeInfo = () => {
    return (
      <Timeline>
        {
          flowPreviewList.map((i, key) => {
            return (
              <Timeline.Item key={key}>
                {i.node_name}
                ({i.approve_name ? i.approve_name : '无'})
              </Timeline.Item>
            );
          })
        }
      </Timeline>
    );
  };

  return (
    <React.Fragment>
      <span>{dot.get(approveOrderDetail, 'flow_info.name')}</span>
      <Popover content={getFlowNodeInfo()}>
        <InfoCircleOutlined
          style={{ marginLeft: 5 }}
        />
      </Popover>
    </React.Fragment>
  );
};

const mapStateToProps = ({
  codeFlow: { flowPreviewList },
}) => {
  return { flowPreviewList };
};

export default connect(mapStateToProps)(FlowPreview);
