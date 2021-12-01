/**
 * 记账月份
 */
import { connect } from 'dva';
import React, { useEffect } from 'react';
import {
  Select,
} from 'antd';

const { Option } = Select;

const BookMonth = ({
  value,
  onChange,
  dispatch,
  bookMonthList = [],
  orderId, // 审批单id
}) => {
  useEffect(() => {
    orderId && dispatch({
      type: 'codeOrder/getBookMonthList',
      payload: { orderId },
    });

    return () => {
      dispatch({
        type: 'codeOrder/resetBookMonthList',
        payload: {},
      });
    };
  }, [dispatch, orderId]);

  // 审批单详情记账月份，未在记账月份接口数据中，则重置记账月份为0（付款月份）
  useEffect(() => {
    if (
      Array.isArray(bookMonthList)
      && bookMonthList.length > 0
      && !bookMonthList.find(b => b.value === value)
      && value
    ) {
      onChange && onChange(0);
    }
  }, [bookMonthList, value, onChange]);

  if (BookMonth.length < 1) return <Select />;

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder="请选择"
    >
      {
        bookMonthList.map((b, key) => {
          return <Option value={b.value} key={key}>{b.label}</Option>;
        })
      }
    </Select>
  );
};

const mapStateToProps = ({
  codeOrder: { bookMonthList },
}) => {
  return { bookMonthList };
};

export default connect(mapStateToProps)(BookMonth);
