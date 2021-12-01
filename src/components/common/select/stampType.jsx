/**
 * 盖章类型
 */
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import '@ant-design/compatible/assets/index.css';
import { omit } from '../../../application/utils';

const { Option } = Select;

function StampType(props) {
  const { dispatch } = props;
  // 盖章类型枚举值信息
  const [stampTypeInfo, setStampTypeInfo] = useState({});

  // 获取盖章类型枚举
  useEffect(() => {
    (async () => {
      const res = await dispatch({
        type: 'applicationCommon/getEnumeratedType',
        payload: {},
      });
      if (res && res.pact_apply_types) {
        setStampTypeInfo(res.pact_apply_types);
      }
    })();
  }, []);

   // option
  const options = Object.keys(stampTypeInfo).map((item) => {
    return <Option value={`${item}`} key={item}>{stampTypeInfo[item]}</Option>;
  });

  // 详情展示
  if (props.isDetail) {
    return (
      <div>
        {
          props.showValue.map(item => stampTypeInfo[item]).join(',')
        }
      </div>
    );
  // 创建、编辑
  } else {
    return (
      <Select
        showSearch
        {...omit(['dispatch', 'isDetail', 'showValue'], props)}
      >
        {options}
      </Select>
    );
  }
}

StampType.propTypes = {
  isDetail: PropTypes.bool, // 是否为详情展示
  showValue: PropTypes.array, // 详情展示枚举
};
StampType.defaultProps = {
  isDetail: false,
  showValue: [],
};
export default connect()(StampType);

