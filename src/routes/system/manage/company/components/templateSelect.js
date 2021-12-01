/**
 * 合同模版下拉框
*/
import React, { useEffect } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';

import { utils } from '../../../../../application';
import { ContractTemplateState } from '../../../../../application/define';
import { omit } from '../../../../../application/utils';

const { Option } = Select;

function TemplateSelect(props) {
  const { dispatch, contractTemplates } = props;
  const datascoure = utils.dotOptimal(contractTemplates, 'data', []); // 数据列表
  useEffect(() => {
    dispatch({
      type: 'systemContractTemplate/fetchContractTemplates',
      payload: {
        meta: { page: 1, limit: 0 },
        state: ContractTemplateState.on,
      },
    });
    return () => {
      dispatch({ type: 'systemContractTemplate/reduceContractTemplates', payload: {} });
    };
  }, [dispatch]);
  // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'contractTemplates',
  ], props);
  return (
    <Select {...omitedProps}>
      {
        datascoure.map((v) => {
          return <Option key={v._id} value={v._id}>{v.name}</Option>;
        })
      }
    </Select>
  );
}

function mapStateToProps({ systemContractTemplate: { contractTemplates } }) {
  return { contractTemplates };
}

export default connect(mapStateToProps)(TemplateSelect);
