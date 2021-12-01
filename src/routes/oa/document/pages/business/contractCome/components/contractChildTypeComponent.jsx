/**
 * 合同子类型 下拉组件
*/
import React from 'react';
import { Select } from 'antd';
import is from 'is_js';
import PropTypes from 'prop-types';

import { omit } from '../../../../../../../application/utils';
import { OAContractStampType } from '../../../../../../../application/define';

const Option = Select.Option;
/**
 * 适用于合同会审创建及编辑页
 */
function ContractChildTypeComponent(props) {
  const { pactSubTypes, stampType, contractType, mode, contractTypeData, contractChildType, contractTypeValueState } = props;
  // 合同类型及合同子类型级联表
  const data = (contractTypeData || {}).pact_types_has_sub_types || {};
  let myStampType = stampType;
  let subType = {};
  // 第一次进来 如果有合同类型及子类型并且设置选中的合同类型为空 默认回显
  if (contractType && contractChildType && is.empty(contractTypeValueState)) {
    subType = (data[contractType] || {}).sub_types || {};
  } else {
    // 如果合同类型改变 拿合同类型的key值 请求对应的子类型数据
    subType = (data[contractTypeValueState] || {}).sub_types || {};
  }

  if (is.existy(myStampType) && is.number(myStampType)) {
    myStampType += '';
  }

  const filterSubType = [];
  if (myStampType !== `${OAContractStampType.unNeed}` && is.not.empty(pactSubTypes)) {
    Object.keys(subType).map((key) => {
      // eslint-disable-next-line use-isnan
      if (Number(key) !== NaN) {
        const item = Number(key);
        if (pactSubTypes.includes(item)) {
          filterSubType.push({ key, name: subType[key] });
        }
      }
    });
  }

  const componentProps = {
    allowClear: true,
    showSearch: true,
    placeholder: '请选择',
    optionFilterProp: 'children',
    mode,
    ...omit(['dispatch', 'contractTypeData', 'value'], props),
  };

  if (props.value && is.not.empty(subType) && myStampType === `${OAContractStampType.unNeed}`) {
    componentProps.value = `${props.value}`;
  }
  if (props.value && is.not.empty(filterSubType) && myStampType !== `${OAContractStampType.unNeed}`) {
    componentProps.value = `${props.value}`;
  }


  const renderChildNoSeal = () => {
    return Object.keys(subType).map((item) => {
      return <Option value={item} key={item}>{subType[item]}</Option>;
    });
  };
  const renderChildSeal = () => {
    return filterSubType.map((item) => {
      return <Option value={item.key} key={item.key}>{item.name}</Option>;
    });
  };

  return (
    <Select {...componentProps}>
      {
        myStampType === `${OAContractStampType.unNeed}` ? renderChildNoSeal() : renderChildSeal()
      }

    </Select>
  );
}
ContractChildTypeComponent.propTypes = {
  contractTypeData: PropTypes.object, // 合同类型及合同子类型级联列表
  contractType: PropTypes.string, // 地址栏带过来的合同类型key值
  contractChildType: PropTypes.string, // 地址栏带过来的合同子类型key值
  contractTypeValueState: PropTypes.string, // 选中的合同类型key值
  stampType: PropTypes.string, // 盖章类型：【170】先章 【180】后章 【190】无需盖章
  pactSubTypes: PropTypes.array, // 审批流中的 合同子类型

};

ContractChildTypeComponent.defaultProps = {
  contractTypeData: {},
  contractType: '',
  contractChildType: '',
  contractTypeValueState: '',
  stampType: '',
  pactSubTypes: [],
};
export default ContractChildTypeComponent;
