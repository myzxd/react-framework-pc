// 合同类型 下拉组件
import React, { useEffect } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';
import { omit } from '../../../../../application/utils';

const Option = Select.Option;

function ContractTypeComponent(props) {
  const { dispatch, mode, contractTypeData, onChange } = props;

  // 请求合同类型枚举列表接口
  useEffect(() => {
    dispatch({ type: 'expenseExamineFlow/fetchContractType', payload: {} });
  }, []);

  // 合同类型级联列表
  const data = (contractTypeData || {}).pact_types_has_sub_types || {};

  return (
    <Select
      allowClear
      showSearch
      placeholder="请选择"
      optionFilterProp="children"
      mode={mode}
      {...omit(['dispatch', 'contractTypeData'], props)}
      onChange={(val, op) => onChange(val, op, data)}
    >
      {
        Object.keys(data).map((item) => {
          return <Option value={item} key={item}>{data[item].name}</Option>;
        })
      }

    </Select>
  );
}

const mapStateToProps = ({ expenseExamineFlow: { contractTypeData } }) => {
  return { contractTypeData };
};
export default connect(mapStateToProps)(ContractTypeComponent);
