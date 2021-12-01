/**
 * 费用单收款信息 - 收款账户组件
 */
import is from 'is_js';
import React, { useState, useEffect, useRef } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';

const Option = Select.Option;

function CollectionCardNum(props) {
  const { dispatch, collectionCardNum = {}, namespace, isUpdateRule,
    card_name: cardName,
    bank_details: bankDetails,
    placeholder,
    disabled,
    value = undefined,
    onChange,
    update,
  } = props;
  const defaultFlag = useRef(false);
  const [cardNumData, onChangeCardNumData] = useState([]);
  const onSucessCallback = () => {
    defaultFlag.current = false;
  };
  useEffect(() => {
    // / 外部审批单不调接口
    if (isUpdateRule !== true &&
      (is.existy(cardName) && is.not.empty(cardName)) &&
      (is.existy(bankDetails) && is.not.empty(bankDetails))) {
      dispatch({
        type: 'expenseCostOrder/fetchCollectionCardNum',
        payload: {
          card_name: cardName, // 收款人
          bank_details: bankDetails, // 开户支行
          namespace, // 命名空间
          onSucessCallback,   // 成功回调
        },
      });
    }
    return () => {
      dispatch({
        type: 'expenseCostOrder/reduceCollectionCardNum',
        payload: {
          namespace, // 命名空间
          result: {},
        },
      });
    };
  }, [dispatch, isUpdateRule, namespace, cardName, bankDetails]);

  useEffect(() => {
    const dataScoure = collectionCardNum[namespace] || [];
    onChangeCardNumData(dataScoure);
    if (is.not.existy(dataScoure) || is.empty(dataScoure)) {
      defaultFlag.current = false;
    }
    if (update !== true && defaultFlag.current === false &&
      is.existy(dataScoure) && is.not.empty(dataScoure) && onChange) {
      onChange(dataScoure[0]);
      defaultFlag.current = true;
    }
  }, [collectionCardNum, namespace, onChange, update]);

  // 收款账户onSearch
  const onSearchCardNum = (val) => {
    // 过滤空格
    const filterVal = val.replace(/\s+/g, '');
    const reg = /^([0-9]{1,99})$/;
    const dataScoure = collectionCardNum[namespace] || [];
    if (!dataScoure.includes(filterVal) && filterVal && reg.test(filterVal)) {
      onChangeCardNumData([...dataScoure, filterVal]);
    }
  };

  // 改变收款人
  const onChangeCardNum = (e) => {
    if (onChange) {
      onChange(e);
    }
  };
  return (
    <Select
      value={value}
      showSearch
      placeholder={placeholder}
      onSearch={onSearchCardNum}
      onChange={onChangeCardNum}
      style={{ width: '100%' }}
      disabled={disabled}
    >
      {
        cardNumData.map((num, nameKey) => {
          return <Option key={nameKey} value={num}>{num}</Option>;
        })
      }
    </Select>
  );
}

function mapStateToProps({ expenseCostOrder: { collectionCardNum } }) {
  return { collectionCardNum };
}

export default connect(mapStateToProps)(CollectionCardNum);
