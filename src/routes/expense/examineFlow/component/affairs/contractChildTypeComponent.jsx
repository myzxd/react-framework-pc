// 合同子类型 下拉组件
import React from 'react';
import { Select } from 'antd';
import { connect } from 'dva';
import is from 'is_js';
import { omit } from '../../../../../application/utils';

const Option = Select.Option;

function ContractChildTypeComponent(props) {
  const { mode, contractTypeData, contractTypeValueState, setContractChildIsData } = props;

  const data = (contractTypeData || {}).pact_types_has_sub_types || {};
  const subType = [];
  contractTypeValueState.map((key) => {
    const childObj = (data[key] || {}).sub_types || {};
    if (is.empty(childObj)) return;
    Object.keys(childObj).map((cK) => {
      subType.push({ key: cK, name: childObj[cK] });
    });
  });

  if (is.empty(subType)) {
    setContractChildIsData(false);
  } else {
    setContractChildIsData(true);
  }

  return (
    <Select
      allowClear
      showSearch
      optionFilterProp="children"
      mode={mode}
      disabled={is.empty(subType) ? true : false}
      {...omit(['dispatch', 'contractTypeData', 'contractTypeValueState'], props)}
    >
      {
        subType.map((item) => {
          return <Option value={item.key} key={item.key}>{item.name}</Option>;
        })
      }
    </Select>
  );
}

const mapStateToProps = ({ expenseExamineFlow: { contractTypeData } }) => {
  return { contractTypeData };
};
export default connect(mapStateToProps)(ContractChildTypeComponent);
