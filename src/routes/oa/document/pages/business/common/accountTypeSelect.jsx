/**
 * 账户类型下拉
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import '@ant-design/compatible/assets/index.css';
import PropTypes from 'prop-types';
import { Select } from 'antd';

const { Option } = Select;

function AccountTypeSelect(props) {
  const { companyId, accountSelectInfo, dispatch } = props;
  useEffect(() => {
    if (companyId) {
      dispatch({
        type: 'business/fetchBusinessAccountSelect',
        payload: { id: companyId },
      });
    }
    return () => {
      dispatch({ type: 'business/resetBusinessAccountSelect' });
    };
  }, [dispatch, companyId]);
  // 获取公司数据
  const options = dot.get(accountSelectInfo, 'data', []).map((account) => {
    return <Option value={account._id} key={account._id}>{account.bank_card}</Option>;
  });
  return (
    <Select showSearch {...props}>
      {options}
    </Select>
  );
}

function mapStateToProps({ business: { accountSelectInfo } }) {
  return { accountSelectInfo };
}
AccountTypeSelect.propTypes = {
  accountSelectInfo: PropTypes.object, // 账户数据
};
AccountTypeSelect.defaultProps = {
  accountSelectInfo: {},
};
export default connect(mapStateToProps)(AccountTypeSelect);
