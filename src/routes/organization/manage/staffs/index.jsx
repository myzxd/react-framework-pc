/**
 * 组织架构 - 部门管理 - 岗位编制Tab
 */
import React from 'react';
import PropTypes from 'prop-types';

import Empty from '../empty';
import List from './list';
import Detail from './detail';

// 页面类型
const PageType = {
  list: 'list',
  detail: 'detail',
};

class Staffs extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { activeKey, departmentId } = prevState;
    const { activeKey: nextActiveKey, departmentId: nextDepartmentId } = nextProps;
    // tab更新时，重置为列表页
    if (activeKey !== nextActiveKey) {
      return { pageType: PageType.list };
    }

    // 所选部门更新时，重置为列表页
    if (departmentId !== nextDepartmentId) {
      return { pageType: PageType.list, departmentId: nextDepartmentId };
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      pageType: PageType.list, // 页面类型
      staffId: '', // 部门下岗位id
      activeKey: props.activeKey, // tab activeKey
      departmentId: props.departmentId, // 部门id
    };
  }

  // 更改页面类型
  onChangePageType = (type, staffId) => {
    this.setState({ pageType: type, staffId });
  }

  render() {
    const { pageType, staffId } = this.state;
    const { departmentId, onChangeCheckResult } = this.props;
    // 无数据
    if (!departmentId || departmentId === 'undefined') {
      return <Empty />;
    }

    // 列表
    if (pageType === PageType.list) {
      return (
        <List
          onChangePageType={this.onChangePageType}
          departmentId={departmentId}
          onChangeCheckResult={onChangeCheckResult}
        />
      );
    }

    // 详情
    if (pageType === PageType.detail) return <Detail id={departmentId} staffId={staffId} />;
  }
}

Staffs.propTypes = {
  departmentId: PropTypes.string,
  activeKey: PropTypes.string,
  onChangeCheckResult: PropTypes.func, // 更改部门操作校验结果Modal visible、获取部门操作提交事件、获取部门操作校验提示信息
};

Staffs.defaultProps = {
  departmentId: '',
  activeKey: '1',
  onChangeCheckResult: () => {},
};

export default Staffs;
