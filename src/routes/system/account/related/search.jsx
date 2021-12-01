/**
 * 关联账号，搜索功能
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Select, Form } from 'antd';
import { CoreSearch, CoreContent } from '../../../../components/core/index';

const [Option] = [Select.Option];

const Search = (props) => {
  const {
    operations,
    allAccounts,  // 所有有效账号
    onSearch = () => { },
  } = props;
  // 账号id
  const [id, setId] = useState('');

  // 重置
  const onReset = () => {
    setId('');
    onSearch({ account_id: undefined });
  };

  // select
  const onChangePhone = (e) => {
    setId(e);
  };

  // 收集查询条件 查询数据
  const onClickSearch = () => {
    onSearch({ account_id: id });
  };

  // 所有已选择账号
  const allSelect = [];
  allAccounts.forEach((item, index) => {
    const key = item.id + index;
    allSelect.push(<Option value={item.id} key={key}>{item.phone}({item.name})</Option>);
  });

  const formItems = [
    <Form.Item label="手机号" name="account_id">
      <Select
        allowClear
        showSearch
        optionFilterProp="children"
        placeholder="请输入手机号"
        onChange={onChangePhone}
      >
        {allSelect}
      </Select>
    </Form.Item>,
  ];

  const params = {
    items: formItems,
    operations,
    onReset,
    onSearch: onClickSearch,
  };

  return (
    <CoreContent>
      <CoreSearch {...params} />
    </CoreContent>
  );
};

Search.propTypes = {
  allAccounts: PropTypes.array,   // 所有有效账号
  operations: PropTypes.any,
};

Search.defaultProps = {
  allAccounts: [],   // 所有有效账号
  operations: undefined,
};

function mapStateToProps({ system: { allAccounts } }) {
  return { allAccounts };
}
export default connect(mapStateToProps)(Search);
