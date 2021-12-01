/**
 * 组织架构 - 内容区
 */
import PropTypes from 'prop-types';
import React from 'react';
import { Tabs } from 'antd';

import Empty from './empty';
import Department from './department/index';  // 部门信息
import Staffs from './staffs/index';          // 岗位编制
import Attributes from './attributes/index';  // 业务信息
import DataPermission from './dataPermission/index';  // 数据权限范围
import CheckResultModal from './components/checkResultModal'; // 部门操作校验结果Modal
import { OrganizationBizLabelType } from '../../../application/define';
import Operate from '../../../application/define/operate';


const TabPane = Tabs.TabPane;

// tab选项标签
const TabItems = {
  department: `${OrganizationBizLabelType.one}`,
  staffs: `${OrganizationBizLabelType.two}`,
  attributes: `${OrganizationBizLabelType.three}`, // 业务信息
  dataPermission: `${OrganizationBizLabelType.four}`, // 数据权限范围
};

class Content extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { departmentId } = prevState;
    const { departmentId: nextDepartmentId } = nextProps;
    // 所选部门更新时，重置tab
    if (departmentId !== nextDepartmentId) {
      return { activeKey: TabItems.department, departmentId: nextDepartmentId };
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: TabItems.department,
      departmentId: props.departmentId,
      isCheckResultVisible: false, // 是否显示部门操作校验结果Modal
      checkMessage: [], // 部门操作校验提示信息
      messageTitle: '', // 部门操作校验提示信息标题
    };
    this.onSubmitDepartment = undefined; // 部门操作提交事件
  }

  // 选择部门
  onSelectDepartment = (id, name, isJump) => {
    const { onSelectDepartment } = this.props;
    onSelectDepartment && onSelectDepartment(id, name, isJump);
  }

  // 选中tab页面
  onChange = (activeKey) => {
    this.setState({ activeKey });
  }

  // 更改isCheckResultVisible、获取部门操作提交事件、获取部门操作校验提示信息
  onChangeCheckResult = (flag, onSubmitDepartment, checkMessage = [], messageTitle) => {
    this.setState({
      isCheckResultVisible: flag || false,
      checkMessage,
      messageTitle,
    });
    this.onSubmitDepartment = onSubmitDepartment;
  }

  render() {
    const {
      activeKey,
      isCheckResultVisible,
      checkMessage,
      messageTitle,
    } = this.state;
    const { departmentName, departmentId } = this.props;
    return (
      <div>
        {(departmentName && departmentName !== 'undefined') ? <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{departmentName}</div> : null}
        {
          (departmentId && departmentId !== 'undefined') ?
            (
              <Tabs activeKey={activeKey} onChange={this.onChange}>
                <TabPane tab="部门信息" key={TabItems.department}>
                  <Department
                    departmentId={departmentId}
                    departmentName={departmentName}
                    onSelectDepartment={this.onSelectDepartment}
                    onChangeCheckResult={this.onChangeCheckResult}
                  />
                </TabPane>
                <TabPane tab="岗位编制" key={TabItems.staffs}>
                  <Staffs
                    departmentId={departmentId}
                    activeKey={activeKey}
                    onChangeCheckResult={this.onChangeCheckResult}
                  />
                </TabPane>
                {
                  Operate.canOperateOrganizationManageDepartmentBusiness() &&
                    (
                      <TabPane tab="业务信息" key={TabItems.attributes}>
                        <Attributes departmentId={departmentId} activeKey={activeKey} />
                      </TabPane>
                    )
                }
                {
                  Operate.canOperateOrganizationManageDepartmentBusiness() &&
                    (
                      <TabPane tab="数据权限范围" key={TabItems.dataPermission}>
                        <DataPermission departmentId={departmentId} activeKey={activeKey} />
                      </TabPane>
                    )
                }
              </Tabs>
            )
            : <Empty />
        }
        {/* 部门操作校验结果Modal */}
        <CheckResultModal
          visible={isCheckResultVisible}
          onChangeCheckResult={this.onChangeCheckResult}
          onSubmitDepartment={async () => await this.onSubmitDepartment()}
          checkMessage={checkMessage}
          messageTitle={messageTitle}
        />
      </div>
    );
  }
}

Content.protoTypes = {
  departmentId: PropTypes.string,
  departmentName: PropTypes.string,
};

Content.defaultProps = {
  departmentId: '',
  departmentName: '',
};

export default Content;
