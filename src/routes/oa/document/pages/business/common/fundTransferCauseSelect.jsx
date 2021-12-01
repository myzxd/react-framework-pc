/**
 * 资金调拨事由下拉
 */
import { connect } from 'dva';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { omit } from '../../../../../../application/utils';
import { ExpenseCostOrderBizType } from '../../../../../../application/define';

const { Option } = Select;

function FundTransferCauseSelect(props) {
  const { dispatch, enumeratedValue = {} } = props;
  useEffect(() => {
    dispatch({
      type: 'applicationCommon/getEnumeratedValue',
      payload: {
        enumeratedType: 'fundTransferCause',
        examineFlowBiz: ExpenseCostOrderBizType.transactional,
      },
    });
  }, [dispatch]);
  const { fundTransferCause: fundTransferCauseEn = [] } = enumeratedValue;
  const options = fundTransferCauseEn.map(({ value, name }) => {
    return <Option value={value} key={value}>{name}</Option>;
  });

  return (
    <Select showSearch {...omit(['enumeratedValue', 'dispatch'], props)}>
      {options}
    </Select>
  );
}

function mapStateToProps({ applicationCommon: { enumeratedValue } }) {
  return { enumeratedValue };
}

FundTransferCauseSelect.propTypes = {
  enumeratedValue: PropTypes.object,
};
FundTransferCauseSelect.defaultProps = {
  enumeratedValue: {},
};

export default connect(mapStateToProps)(FundTransferCauseSelect);
