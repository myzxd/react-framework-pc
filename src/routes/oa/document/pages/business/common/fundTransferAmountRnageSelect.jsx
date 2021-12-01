/**
 * 资金调拨金额范围下拉
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { omit } from '../../../../../../application/utils';
import { useNamespace } from '../../../../../../application/utils/hooks';

const { Option } = Select;

function FundTransferAmountRangeSelect(props) {
  const namespace = useNamespace();
  const { dispatch, fundTransferAmountRangeInfo } = props;
  const dataSource = dot.get(fundTransferAmountRangeInfo, `${namespace}.data`, []);
  useEffect(() => {
    dispatch({
      type: 'business/fetchFundTransferAmountRangeSelect',
      payload: { namespace },
    });
    return () => {
      dispatch({
        type: 'business/resetFundTransferAmountRangeSelect',
        payload: { namespace },
      });
    };
  }, [dispatch, namespace]);

  const options = dataSource.map(({ _id: id, bank_card: bankCard }) => {
    return <Option value={id} key={id}>{bankCard}</Option>;
  });

  return (
    <Select showSearch {...omit(['fundTransferCauseInfo', 'dispatch'], props)}>
      {options}
    </Select>
  );
}

function mapStateToProps({ business: { fundTransferAmountRangeInfo } }) {
  return { fundTransferAmountRangeInfo };
}

FundTransferAmountRangeSelect.propTypes = {
  fundTransferAmountRangeInfo: PropTypes.object,
};
FundTransferAmountRangeSelect.defaultProps = {
  fundTransferAmountRangeInfo: {},
};

export default connect(mapStateToProps)(FundTransferAmountRangeSelect);
