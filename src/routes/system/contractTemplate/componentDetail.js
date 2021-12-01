/**
 * 组件详情
*/
import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';

import { CoreContent } from '../../../components/core';

function ComponentDetail(props) {
  const { dispatch, componentDetails } = props;
  useEffect(() => {
    dispatch({
      type: 'systemContractTemplate/fetchComponentDetais',
      payload: {} });
    return () => {
      dispatch({ type: 'systemContractTemplate/reduceComponentDetails', payload: {} });
    };
  }, [dispatch]);
  return (
    <React.Fragment>
      <CoreContent>
        <p>易云章后台模版第三方自定义id对应BOSS字段取值如下，签约区第三方自定义id与签署位置名称需要保持一致（third_part_sign为甲方签约区自定义组件id、staff_sign1为乙方签约区自定义组件id）：</p>
        <p style={{ color: 'red' }}>注：模版中多个签约区的三方ID不能重复</p>
        {
          Array.isArray(componentDetails) && componentDetails.map((item, i) => {
            return <p key={i}>{item}</p>;
          })
      }
      </CoreContent>
      <div style={{ marginTop: 10, textAlign: 'center' }}>
        <Button
          onClick={() => { window.location.href = '/#/System/ContractTemplate'; }}
        >返回</Button>
      </div>
    </React.Fragment>
  );
}

function mapStateToProps({ systemContractTemplate: { componentDetails } }) {
  return { componentDetails };
}

export default connect(mapStateToProps)(ComponentDetail);
