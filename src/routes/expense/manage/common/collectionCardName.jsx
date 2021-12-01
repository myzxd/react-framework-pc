/**
 * 费用单收款信息 - 收款人组件
 */
import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';

const Option = Select.Option;

function CollectionCardName(props) {
  const { dispatch, collectionCardName = {}, namespace, isUpdateRule,
    placeholder,
    disabled,
    value = undefined,
  } = props;
  const [cardNameData, onChangeCardNameData] = useState([]);

  useEffect(() => {
    // 外部审批单不调接口
    if (isUpdateRule !== true) {
      dispatch({
        type: 'expenseCostOrder/fetchCollectionCardName',
        payload: {
          namespace, // 命名空间
        },
      });
    }
    return () => {
      dispatch({
        type: 'expenseCostOrder/reduceCollectionCardName',
        payload: {
          namespace, // 命名空间
          result: {},
        },
      });
    };
  }, [dispatch, isUpdateRule, namespace]);

  useEffect(() => {
    const dataScoure = collectionCardName[namespace] || [];
    onChangeCardNameData(dataScoure);
  }, [collectionCardName, namespace]);
  // 收款账户onSearch
  const onSearchCardName = (val) => {
    // 过滤空格
    const filterVal = val.replace(/\s+/g, '');
    const dataScoure = collectionCardName[namespace] || [];
    if (!dataScoure.includes(filterVal) && filterVal) {
      onChangeCardNameData([...dataScoure, filterVal]);
    }
  };

  // 改变收款人
  const onChangeCardName = (e) => {
    if (props.onChange) {
      props.onChange(e);
    }
  };
  return (
    <Select
      value={value}
      showSearch
      placeholder={placeholder}
      onSearch={onSearchCardName}
      onChange={onChangeCardName}
      style={{ width: '100%' }}
      disabled={disabled}
    >
      {
      cardNameData.map((num, nameKey) => {
        return <Option key={nameKey} value={num}>{num}</Option>;
      })
    }
    </Select>
  );
}

function mapStateToProps({ expenseCostOrder: { collectionCardName } }) {
  return { collectionCardName };
}

export default connect(mapStateToProps)(CollectionCardName);
