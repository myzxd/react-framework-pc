/**
 * 组织架构 - 部门管理 = 部门管理(Tab)
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import { dotOptimal } from '../../../../application/utils';

import Basic from './component/basicInfo';
import Subordinate from './component/subordinateDepart/index';
import Member from './component/member';
import Empty from '../empty';

class Index extends React.Component {

  constructor() {
    super();
    this.state = {
      isUpperDepartmentApprove: false, // 调整上级部门操作是否走审批
      isAddSubDepartmentApprove: false, // 添加子部门操作是否走审批
      isRevokeDepartmentApprove: false, // 裁撤部门操作是否走审批
    };
  }

  componentDidMount() {
    // 获取组织架构操作配置
    this.getOrganizationConfig();
  }

  componentDidUpdate(prevProps) {
    const prevId = dotOptimal(prevProps, 'departmentId', undefined); // 旧部门id
    const nextId = dotOptimal(this.props, 'departmentId', undefined); // 新部门id
    if (prevId !== nextId) {
      // 获取组织架构操作配置
      this.getOrganizationConfig();
    }
  }

  // 获取组织架构操作配置
  getOrganizationConfig = async () => {
    const { dispatch } = this.props;
    const res = await dispatch({ type: 'department/getOrganizationConfig', payload: {} });
    if (res) {
      this.setState({
        isUpperDepartmentApprove: dotOptimal(res, '0.config_info.adjust_department', false),
        isAddSubDepartmentApprove: dotOptimal(res, '0.config_info.add_sub_department', false),
        isRevokeDepartmentApprove: dotOptimal(res, '0.config_info.cut_department', false),
      });
    }
  }

  render() {
    const {
      isUpperDepartmentApprove,
      isAddSubDepartmentApprove,
      isRevokeDepartmentApprove,
    } = this.state;
    const {
      departmentId,
      departmentName,
      onSelectDepartment,
      onChangeCheckResult,
    } = this.props;
    // 部门id不存在，渲染Empty
    if (!departmentId || departmentId === 'undefined') return <Empty />;
    return (
      <div>
        <Basic
          departmentId={departmentId}
          onChangeCheckResult={onChangeCheckResult}
          onSelectDepartment={onSelectDepartment}
          isUpperDepartmentApprove={isUpperDepartmentApprove}
        />
        <Subordinate
          departmentId={departmentId}
          onSelectDepartment={onSelectDepartment}
          onChangeCheckResult={onChangeCheckResult}
          isUpperDepartmentApprove={isUpperDepartmentApprove}
          isAddSubDepartmentApprove={isAddSubDepartmentApprove}
          isRevokeDepartmentApprove={isRevokeDepartmentApprove}
        />
        <Member
          departmentId={departmentId}
          departmentName={departmentName}
        />
      </div>
    );
  }
}

Index.propTypes = {
  departmentId: PropTypes.string,       // 部门id
  departmentName: PropTypes.string,     // 部门名称
  onSelectDepartment: PropTypes.func,   // 选择部门，设置选中的部门
  onChangeCheckResult: PropTypes.func,  // 更改部门操作校验结果Modal visible、获取部门操作提交事件、获取部门操作校验提示信息
};

Index.defaultProps = {
  departmentId: '',
  departmentName: '',
  onSelectDepartment: () => {},
  onChangeCheckResult: () => {},
};

export default connect()(Index);
