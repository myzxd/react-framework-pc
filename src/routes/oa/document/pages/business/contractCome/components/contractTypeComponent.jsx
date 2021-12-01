/**
 * 合同类型 下拉组件
*/
import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import is from 'is_js';

import { omit } from '../../../../../../../application/utils';
import { OAContractStampType } from '../../../../../../../application/define';

const Option = Select.Option;

/**
 * 适用于合同会审创建及编辑页
 */
function ContractTypeComponent(props) {
  const { mode, contractTypeData, contractTypeDatas, stampType } = props;

  // 合同类型及合同子类型级联对象
  const data = (contractTypeData || {}).pact_types_has_sub_types || {};
  // 合同类型 # 只展示审批流里有的合同类型
  const filterData = [];
  if (is.array(contractTypeDatas) && is.existy(contractTypeDatas) && is.not.empty(data)) {
    contractTypeDatas.forEach((key) => {
      filterData.push({ key: `${key}`, name: data[key].name });
    });
  }

  const componentProps = {
    showSearch: true,
    placeholder: '请选择',
    optionFilterProp: 'children',
    mode,
    ...omit(['dispatch', 'contractTypeData', 'value'], props),
  };
  if (props.value && is.not.empty(filterData)) {
    componentProps.value = `${props.value}`;
  }
  if (props.value && stampType === `${OAContractStampType.unNeed}`) {
    componentProps.value = `${props.value}`;
  }

  // 如果盖章类型是无需盖章
  const renderNoSeal = () => {
    return Object.keys(data).map((item) => {
      return <Option value={item} key={item}>{data[item].name}</Option>;
    });
  };

  // 如果是 我方先章或者后章
  const renderSeal = () => {
    return filterData.map((item) => {
      return <Option value={item.key} key={item.key}>{item.name}</Option>;
    });
  };

  return (
    <Select {...componentProps} >
      {
        stampType === `${OAContractStampType.unNeed}` ? renderNoSeal() : renderSeal()
      }
    </Select>
  );
}
ContractTypeComponent.propTypes = {
  contractTypeDatas: PropTypes.array, // 审批流配置的合同类型[int]
  contractTypeData: PropTypes.object, // 合同类型及合同子类型级联列表
  stampType: PropTypes.string, // 盖章类型：【170】先章 【180】后章 【190】无需盖章
};

ContractTypeComponent.defaultProps = {
  contractTypeDatas: [],
  contractTypeData: {},
  stampType: '',
};

export default ContractTypeComponent;
