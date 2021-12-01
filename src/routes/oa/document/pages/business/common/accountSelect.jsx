/**
 * 账户下拉
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Select, Form } from 'antd';
import { omit } from '../../../../../../application/utils';
import { useNamespace } from '../../../../../../application/utils/hooks';
import { BusinesBankAccountType } from '../../../../../../application/define';

const { Option } = Select;

function AccountSelect(props) {
  const namespace = useNamespace();
  const { showAccountInfo, dispatch, firmAccountSelectInfo, firmId, value, disabledList } = props;
  const dataSource = dot.get(firmAccountSelectInfo, `${namespace}.data`, []);
  useEffect(() => {
    if (firmId) {
      dispatch({
        type: 'business/fetchFirmAccountSelect',
        payload: { firmId, namespace },
      });
    }
    return () => {
      dispatch({
        type: 'business/resetFirmAccountSelect',
        payload: { namespace },
      });
    };
  }, [dispatch, firmId, namespace]);

  // 获取公司数据
  const options = dataSource.filter(({ bank_card: bankCard }) => bankCard !== null && bankCard !== undefined).map(({ _id: id, bank_card: bankCard }) => {
    return (
      <Option
        value={id}
        key={id}
        disabled={disabledList.includes(id) && value !== id}
      >
        {bankCard ? bankCard.replace(/^(.{3})(.*)(.{3})$/g, (match, p1, p2, p3) => `${p1}${new Array(p2.length).fill('*').join('')}${p3}`) : null}
      </Option>
    );
  });

  let currentOption = {};
  if (showAccountInfo && value) {
    currentOption = dataSource.filter(({ _id: id }) => id === value)[0] || {};
  }

  return (<React.Fragment>
    <Select showSearch {...omit(['firmAccountSelectInfo', 'dispatch', 'firmId', 'showAccountInfo', 'disabledList'], props)}>
      {options}
    </Select>
    {
      showAccountInfo ?
        <React.Fragment>
          <Form.Item style={{ marginTop: 12 }} label="开户行">{currentOption.bank_and_branch || '--'}</Form.Item>
          <Form.Item style={{ marginBottom: 0 }} label="账户类型">{currentOption.bank_card_type ? BusinesBankAccountType.description(currentOption.bank_card_type) : '--'}</Form.Item>
        </React.Fragment> :
        null
    }
  </React.Fragment>);
}

function mapStateToProps({ business: { firmAccountSelectInfo } }) {
  return { firmAccountSelectInfo };
}

AccountSelect.propTypes = {
  firmAccountSelectInfo: PropTypes.object, // 账户数据
  firmId: PropTypes.string, // 公司id
  showAccountInfo: PropTypes.bool, // 是否显示账户信息
  disabledList: PropTypes.array, // 不可选的选项
};
AccountSelect.defaultProps = {
  firmAccountSelectInfo: {},
  showAccountInfo: false,
  disabledList: [],
};

export default connect(mapStateToProps)(AccountSelect);
