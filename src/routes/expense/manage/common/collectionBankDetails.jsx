/**
 * 费用单收款信息 - 开户行组件
 */
import is from 'is_js';
import React, { useEffect, useState, useRef } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';

const Option = Select.Option;
function CollectionBankDetails(props) {
  const { dispatch, collectionBankDetails = {}, namespace, isUpdateRule, card_name: cardName,
    placeholder,
    disabled,
    value = undefined,
    onChange,
    update,
  } = props;
  const defaultFlag = useRef(false);
  const [bankNameData, onChangebankNameData] = useState([]);
  const onSucessCallback = () => {
    defaultFlag.current = false;
  };
  useEffect(() => {
    // 外部审批单不调接口
    if (isUpdateRule !== true &&
      (is.existy(cardName) && is.not.empty(cardName))) {
      dispatch({
        type: 'expenseCostOrder/reduceCollectionBankDetails',
        payload: {
          namespace, // 命名空间
          result: {},
        },
      });
      dispatch({
        type: 'expenseCostOrder/fetchCollectionBankDetails',
        payload: {
          card_name: cardName, // 收款人
          namespace, // 命名空间
          onSucessCallback,
        },
      });
    }


    return () => {
      dispatch({
        type: 'expenseCostOrder/reduceCollectionBankDetails',
        payload: {
          namespace, // 命名空间
          result: {},
        },
      });
      defaultFlag.current = false;
    };
  }, [dispatch, isUpdateRule, namespace, cardName]);

  useEffect(() => {
    const dataScoure = collectionBankDetails[namespace] || [];
    onChangebankNameData(dataScoure);
    if (is.not.existy(dataScoure) || is.empty(dataScoure)) {
      defaultFlag.current = false;
    }
    if (update !== true && defaultFlag.current === false &&
      is.existy(dataScoure) && is.not.empty(dataScoure) && onChange) {
      onChange(dataScoure[0]);
      defaultFlag.current = true;
    }
  }, [collectionBankDetails, namespace, onChange, update]);

    // 收款账户onSearch
  const onSearchBankName = (val) => {
    // 过滤空格
    const filterVal = val.replace(/\s+/g, '');
    const dataScoure = collectionBankDetails[namespace] || [];
    if (!dataScoure.includes(filterVal) && filterVal) {
      onChangebankNameData([...dataScoure, filterVal]);
    }
  };

    // 改变收款人
  const onChangeBankName = (e) => {
    if (onChange) {
      onChange(e);
    }
  };
  return (
    <Select
      value={value}
      showSearch
      placeholder={placeholder}
      onSearch={onSearchBankName}
      onChange={onChangeBankName}
      style={{ width: '100%' }}
      disabled={disabled}
    >
      {
        bankNameData.map((num, nameKey) => {
          return <Option key={nameKey} value={num}>{num}</Option>;
        })
      }
    </Select>
  );
}

function mapStateToProps({ expenseCostOrder: { collectionBankDetails } }) {
  return { collectionBankDetails };
}

export default connect(mapStateToProps)(CollectionBankDetails);
