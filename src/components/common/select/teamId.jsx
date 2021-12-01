/**
 * 公用组件，团队ID
 */
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'dva';
import { message } from 'antd';

import { CoreSelect } from '../../core';
import { omit } from '../../../application/utils';

const Option = CoreSelect.Option;

const CommonSelectTeam = (props = {}) => {
  const {
    supplier,
    namespace,
    teamType,
    teamList,
    fetchDataSource,                                         // 获取城市数据
    resetDataSource,
    vendor = undefined,
    city = undefined,
    district = undefined,
    platform = undefined,
  } = props;

  //  请求接口
  useEffect(() => {
    const params = {
      supplier,
      namespace,
      platform,
      vendor,
      city,
      district,
      limit: 9999,
    };
    fetchDataSource(params);
    return resetDataSource({});
  }, [platform, vendor, city, district, supplier, namespace, teamType, fetchDataSource, resetDataSource]);

  const { data = [] } = teamList[namespace] || {};
  // 默认信息是完整的
  let isCompleteData = true;

  let options = data.map((item) => {
    // 如果人员信息缺少staff_info，信息即为不全
    if (item && !item.owner_info.staff_info) {
      isCompleteData = false;
      return isCompleteData;
    }

    return (
      <Option
        value={item.owner_info._id}
        key={item._id}
        teamname={item.owner_info.staff_info.name}
        teamidcode={item.owner_info.staff_info.identity_card_id}
        staffId={item.owner_info.staff_id}
      >
        {`${item.owner_info.staff_info.name} - ${item.owner_id}`}
      </Option>
    );
  });
  if (!isCompleteData) {
    message.error('所选范围内的人员存在信息不全的情况，请重新选择范围', 5);
    options = [];
  }
  // 默认传递所有上级传入的参数
  const params = { ...props };
  // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'teamList',
    'supplier',
    'namespace',
    'teamType',
  ], params);
  return (
    <CoreSelect {...omitedProps} >
      {options}
    </CoreSelect>
  );
};

CommonSelectTeam.propTypes = {
  supplier: PropTypes.string,
  namespace: PropTypes.string,
  teamType: PropTypes.number,
  teamList: PropTypes.object,
  fetchDataSource: PropTypes.func,                                         // 获取数据
  resetDataSource: PropTypes.func,
};

CommonSelectTeam.defaultProps = {
  supplier: undefined,
  namespace: 'default',
  teamList: {},
  onChange: () => { },
  fetchDataSource: () => { },                                         // 获取数据
  resetDataSource: () => { },                                         // 重置数据
};

// 引用数据
const mapStateToProps = ({ applicationCommon: { teamList } }) => ({ teamList });

const mapDispatchToProps = dispatch => (
  {
    // 获取列表
    fetchDataSource: (params) => { dispatch({ type: 'applicationCommon/fetchTeam', payload: params }); },
    // 重置列表
    resetDataSource: (params) => { dispatch({ type: 'applicationCommon/resetTeam', payload: params }); },
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CommonSelectTeam);
