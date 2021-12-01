// 合同子类型 下拉组件
import React, { useEffect, useState } from 'react';
import is from 'is_js';
import { Select } from 'antd';
import { connect } from 'dva';
import { omit } from '../../../../application/utils';

const Option = Select.Option;

function ContractChildTypeComponent(props) {
  const { mode, contractTypeData, contractTypeValueState, set_contract_child } = props;
  const [subType, setSubType] = useState({});
  useEffect(() => {
    const data = (contractTypeData || {}).pact_types_has_sub_types || {};
    setSubType(data[contractTypeValueState].sub_types);
    if (is.empty(subType)) {
      set_contract_child(false);
    } else {
      set_contract_child(true);
    }
  }, [contractTypeValueState, subType]);


  if (is.empty(subType)) return <Select disabled><Option /></Select>;

  return (
    <Select
      showSearch
      optionFilterProp="children"
      placeholder="请选择"
      mode={mode}
      {...omit(['dispatch', 'contractTypeData', 'contractTypeValueState'], props)}
    >

      {


        Object.keys(subType).map((item) => {
          return <Option value={item} key={item}>{subType[item] || ''}</Option>;
        })
      }
    </Select>
  );
}

const mapStateToProps = ({ expenseExamineFlow: { contractTypeData } }) => {
  return { contractTypeData };
};
export default connect(mapStateToProps)(ContractChildTypeComponent);
