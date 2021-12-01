/**
 * 组织架构 - 部门管理 - 岗位编制Tab -  详情
 */
import React from 'react';
import PropTypes from 'prop-types';

import Basic from './component/basic';
import Business from './component/business';
import MemberContent from './component/memberContent';

class StaffDetail extends React.Component {
  render() {
    const { id: departmentId, staffId } = this.props;
    return (
      <div>
        <Basic staffId={staffId} />
        <Business staffId={staffId} id={departmentId} />
        <MemberContent staffId={staffId} departmentId={departmentId} />
      </div>
    );
  }
}

StaffDetail.propTypes = {
  staffId: PropTypes.string, // 岗位id
  id: PropTypes.string, // 部门id
};

StaffDetail.defaultProps = {
  staffId: '',
  id: '',
};

export default StaffDetail;
