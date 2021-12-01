/**
 * 组织架构 - 导航
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Input, message, Button } from 'antd';

import { CoreContent } from '../../../components/core';
// import { CommonTreeDepartments } from '../../../components/common';
import CommonTreeDepartments from './department';

import Operate from '../../../application/define/operate';
import Create from './department/component/modal/departmentUpdate';
import style from './styles.css';

const { Search } = Input;
// 弹窗类型
const Type = {
  create: 'create',
  update: 'update',
};

class Silder extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { selectedIds } = prevState;
    const { selectedIds: nextSelectedIds } = nextProps;
    // 更新selectedIds（目前默认单选，判断数组第一项）
    if (dot.get(selectedIds, '0', undefined) !== dot.get(nextSelectedIds, '0', undefined)) {
      return { selectedIds: nextSelectedIds };
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      searchValue: [],  // 搜索的数据标题
      selectedIds: [],     // 选中的节点数据
      visible: false,
    };
  }

  onSelect = (selectedIds, selectName) => {
    // 获取选择的id
    const id = dot.get(selectedIds, '0');

    // 回调函数
    if (this.props.onSelectOrganization) {
      this.props.onSelectOrganization(id, selectName);
    }
  };

  onSearch = (e) => {
    const { value } = e.target;
    this.setState({
      searchValue: value,
    });
  }

  // 取消弹窗
  onCancel = () => {
    this.setState({ visible: false });
  }

  // 失败回调
  onCreateFailureCallback = (rec) => {
    // this.onCancel();
    rec.zh_message && message.error(rec.zh_message);
  }

  // 成功
  onCreateSuccessCallback = () => {
    const payload = {
      isAuthorized: true,
    };
    this.props.dispatch({ type: 'applicationCommon/fetchDepartments', payload });
    this.onCancel();
  }

  // 弹窗
  renderModal = () => {
    // 编辑部门弹窗visible
    const { visible } = this.state;
    if (!visible) return;
    const { dispatch } = this.props;

    return (
      <Create
        type={Type.create}
        title="新建部门"
        visible={visible}
        dispatch={dispatch}
        onCancel={this.onCancel}
        onSuccessCallback={this.onCreateSuccessCallback}
        onFailureCallback={this.onCreateFailureCallback}
      />
    );
  }


  render() {
    const { searchValue, selectedIds } = this.state;
    const { isJump } = this.props;
    return (
      <CoreContent title="组织结构" style={{ height: '86vh' }}>
        {/* 搜索框 */}
        <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onSearch} />
        {
          Operate.canOperateOrganizationManageDepartmentCreate() ?
            <div className={style['app-comp-organization-silder-create-wrap']}>
              <Button
                onClick={() => this.setState({ visible: true })}
                icon={<PlusOutlined />}
                className={style['app-comp-organization-silder-create-button']}
                type="primary"
              >新建部门</Button>
            </div>
          : null
        }
        {this.renderModal()}
        {/* 组织结构树 */}
        <div style={{ height: '68vh', overflowY: 'scroll' }}>
          <CommonTreeDepartments selectedIds={selectedIds} searchValue={searchValue} onSelect={this.onSelect} isJump={isJump} />
          <div style={{ textAlign: 'center', color: 'bisque', marginTop: '10px' }}>-- END --</div>
        </div>
      </CoreContent>
    );
  }
}


export default connect()(Silder);
