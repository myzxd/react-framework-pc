/**
 * 岗位库下拉列表
 */
import React, { useEffect } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import { omit } from '../../../../application/utils';

const { Option } = Select;

const OrganizationJobSelect = (props) => {
  useEffect(() => {
    props.dispatch({ type: 'oaCommon/fetchOrganizationJob' });
  }, []);

  return (
    <Select
      {
        ...omit([
          'dispatch',
          'children',
          'organizationJobInfo',
        ], props)
      }
    >
      {
        dot.get(props.organizationJobInfo, 'data', []).map((item) => {
          return (
            <Option key={item._id} value={item._id}>{item.name}</Option>
          );
        })
      }
    </Select>
  );
};

function mapStateToProps({ oaCommon: { organizationJobInfo } }) {
  return { organizationJobInfo };
}

OrganizationJobSelect.propTypes = {
  organizationJobInfo: PropTypes.object, // 岗位库列表信息
};
OrganizationJobSelect.defaultProps = {
  organizationJobInfo: {},
};

export default connect(mapStateToProps)(OrganizationJobSelect);
