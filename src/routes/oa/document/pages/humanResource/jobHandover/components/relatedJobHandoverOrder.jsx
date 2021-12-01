/**
 * 关联审批单组件
*/
import React, { useEffect } from 'react';
import dot from 'dot-prop';
import is from 'is_js';

import { Select } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { omit } from '../../../../../../../application/utils';

const { Option } = Select;

RelatedJobHandoverOrder.propTypes = {
  handoverType: PropTypes.number, // 工作交接类型
  orderAccountId: PropTypes.string, // 实际申请人id
  relatedJobHandoverOrderInfo: PropTypes.object, // 关联审批单信息
};
RelatedJobHandoverOrder.defaultProps = {
  handoverType: undefined,
  orderAccountId: undefined,
  relatedJobHandoverOrderInfo: {},
};

function RelatedJobHandoverOrder(props) {
  const { dispatch, handoverType, onChange, value, orderAccountId, relatedJobHandoverOrderInfo } = props;
  const dataScoure = dot.get(relatedJobHandoverOrderInfo, 'data', []);
  const item = dataScoure[0] || {};
  useEffect(() => {
    if (!orderAccountId || !handoverType) return;
    dispatch({
      type: 'humanResource/getRelatedJobHandoverOrder',
      payload: {
        handoverType,
        orderAccountId,
      },
    });
    return () => {
      dispatch({ type: 'humanResource/reduceRelatedJobHandoverOrder', payload: {} });
    };
  }, [dispatch, handoverType, orderAccountId]);

  // 添加默认值
  useEffect(() => {
     // 判断value是否有值
    if (!value) {
      if (onChange) {
        onChange(item._id);
      }
    }
    // 切换实际交接人的时候 如果返回的数据是空 我们清除一下默认值
    if (is.empty(dataScoure)) {
      onChange(undefined);
    }
  }, [item, onChange, value]);

  const renderOption = () => {
    if (orderAccountId && handoverType) {
      return dataScoure.map((v) => {
        return (
          <Option key={v._id} value={v._id}>{v._id}</Option>
        );
      });
    }
    return null;
  };

  return (
    <Select
      {
        ...omit([
          'dispatch',
          'children',
          'handoverType',
          'orderAccountId',
          'relatedJobHandoverOrderInfo',
        ], props)
      }
    >
      {renderOption()}
    </Select>
  );
}

function mapStateToProps({ humanResource: { relatedJobHandoverOrderInfo } }) {
  return { relatedJobHandoverOrderInfo };
}

export default connect(mapStateToProps)(RelatedJobHandoverOrder);
