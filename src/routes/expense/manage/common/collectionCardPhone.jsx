/**
 * 费用单收款信息 - 收款账户组件
 */
import is from 'is_js';
import React, { useState, useEffect, useRef } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';

const Option = Select.Option;

function CollectionCardPhone(props) {
  const { dispatch, collectionCardPhone = {}, namespace, isUpdateRule,
    card_name: cardName,
    placeholder,
    disabled,
    value = undefined,
    onChange,
    update,
  } = props;
  const defaultFlag = useRef(false);
  const onSucessCallback = () => {
    defaultFlag.current = false;
  };
  const [cardPhoneData, onChangeCardPhoneData] = useState([]);
  useEffect(() => {
    // / 外部审批单不调接口
    if (isUpdateRule !== true &&
      is.existy(cardName) && is.not.empty(cardName)) {
      dispatch({
        type: 'expenseCostOrder/fetchCollectionCardPhone',
        payload: {
          card_name: cardName, // 收款人
          namespace, // 命名空间
          onSucessCallback, // 成功回调
        },
      });
    }
    return () => {
      dispatch({
        type: 'expenseCostOrder/reduceCollectionCardPhone',
        payload: {
          namespace, // 命名空间
          result: {},
        },
      });
    };
  }, [dispatch, isUpdateRule, namespace, cardName]);

  useEffect(() => {
    const dataScoure = collectionCardPhone[namespace] || [];
    onChangeCardPhoneData(dataScoure);
    if (is.not.existy(dataScoure) || is.empty(dataScoure)) {
      defaultFlag.current = false;
    }
    // 不是编辑的情况，并且当前没选中，并且有数据的情况下，添加默认值
    if (update !== true && defaultFlag.current === false && value === undefined &&
      is.existy(dataScoure) && is.not.empty(dataScoure) && onChange) {
      onChange(dataScoure[0]);
      defaultFlag.current = true;
    }
  }, [collectionCardPhone, onChange, namespace, value, update]);

    // 收款账户onSearch
  const onSearchCardPhone = (val) => {
    // 过滤空格
    const filterVal = val.replace(/\s+/g, '');
    const reg = /^([0-9]{1,11})$/;
    const dataScoure = collectionCardPhone[namespace] || [];
    if (!dataScoure.includes(filterVal) && filterVal && reg.test(filterVal)) {
      onChangeCardPhoneData([...dataScoure, filterVal]);
    }
  };

    // 改变收款人
  const onChangeCardPhone = (e) => {
    if (onChange) {
      onChange(e);
    }
  };
  return (
    <Select
      value={value}
      showSearch
      placeholder={placeholder}
      onSearch={onSearchCardPhone}
      onChange={onChangeCardPhone}
      style={{ width: '100%' }}
      disabled={disabled}
    >
      {
      cardPhoneData.map((num, nameKey) => {
        return <Option key={nameKey} value={num}>{num}</Option>;
      })
    }
    </Select>
  );
}

function mapStateToProps({ expenseCostOrder: { collectionCardPhone } }) {
  return { collectionCardPhone };
}

export default connect(mapStateToProps)(CollectionCardPhone);
