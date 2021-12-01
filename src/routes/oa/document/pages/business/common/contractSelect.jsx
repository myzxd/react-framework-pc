/**
 * 合同下拉
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import '@ant-design/compatible/assets/index.css';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { omit } from '../../../../../../application/utils';

const { Option } = Select;

function ContractSelect(props) {
  const {
    dispatch,
    isFetchData,
    contractSelectInfo,
    isClearnModal,
    clearnOptionList,
  } = props;
  useEffect(() => {
    if (!isFetchData) return;
    dispatch({
      type: 'business/fetchBusinessPactContractSelect',
    });
    return () => {
      if (!isClearnModal) return;
      dispatch({ type: 'business/resetBusinessPactContractSelect' });
    };
  }, []);

  // 获取合同数据
  const options = dot.get(contractSelectInfo, 'data', []).filter((item) => {
    // 过滤clearnOptionList
    if (clearnOptionList.length <= 0 || clearnOptionList.every(itm => itm !== item._id)) {
      return item;
    }
  }).map((contract) => {
    return <Option value={contract._id} key={contract._id} preserverid={contract.preserver_id}>{contract.name}</Option>;
  });

  return (
    <Select
      showSearch
      optionFilterProp="children"
      {...omit(['contractSelectInfo', 'dispatch', 'isClearnModal', 'clearnOptionList'], props)}
    >
      {options}
    </Select>
  );
}

function mapStateToProps({ business: { contractSelectInfo } }) {
  return { contractSelectInfo };
}

ContractSelect.propTypes = {
  contractSelectInfo: PropTypes.object, // 合同数据
  isClearnModal: PropTypes.bool, // 是否需要清空合同下拉model信息
  isFetchData: PropTypes.bool, // 是否需要请求接口
  clearnOptionList: PropTypes.array, // 需要过滤的option
};
ContractSelect.defaultProps = {
  contractSelectInfo: {},
  isClearnModal: true,
  isFetchData: true,
  clearnOptionList: [],
};

export default connect(mapStateToProps)(ContractSelect);
