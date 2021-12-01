/**
 * 组织架构 - 部门管理 - 岗位编制详情 - 数据权限信息组件
 */
import { connect } from 'dva';
import React from 'react';
import PropTypes from 'prop-types';
import { Empty, Tag, message } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import SetBusiness from './modal/setBusiness';
import Operate from '../../../../../application/define/operate';
import { utils } from '../../../../../application';
import style from './index.less';

const OperateType = {
  create: 10,
  update: 20,
};

class Business extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: false, // 设置数据权限信息弹窗visible
      operateType: 10, // 操作类型
    };
  }

  componentDidMount() {
    // 岗位id、部门id
    const { dispatch, staffId, id: departmentId } = this.props;
    dispatch({ type: 'organizationBusiness/getBusiness', payload: { departmentId } });
    dispatch({ type: 'organizationBusiness/getStaffBusiness', payload: { staffId } });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    // dispatch({ type: 'organizationBusiness/resetBusiness', payload: {} });
    dispatch({ type: 'organizationBusiness/resetStaffBusiness', payload: {} });
  }

  // 隐藏弹窗
  onCancel = () => {
    this.setState({ visible: false });
  }

  onSuccessCallback = () => {
    const { dispatch, staffId } = this.props;
    dispatch({ type: 'organizationBusiness/getStaffBusiness', payload: { staffId } });
    this.onCancel();
  }

  onFailureCallback = (res) => {
    res.zh_message && message.error(res.zh_message);
    this.onCancel();
  }

  // 有数据
  renderContent = () => {
    const titleExt = Operate.canOperateOrganizationManageDataPermissionUpdate() ?
      <a onClick={() => this.setState({ visible: true, operateType: OperateType.update })}>编辑</a>
      : null;

    return (
      <CoreContent title="数据权限信息" titleExt={titleExt}>
        {this.renderSystemAttributes()}
      </CoreContent>
    );
  }

  // 无数据
  renderEmpty = () => {
    const titleExt = Operate.canOperateOrganizationManageDataPermissionCreate() ?
      <a onClick={() => this.setState({ visible: true, operateType: OperateType.create })}>岗位数据权限设置</a>
      : null;
    return (
      <CoreContent title="数据权限信息" titleExt={titleExt}>
        <Empty />
      </CoreContent>
    );
  }

  // 弹窗
  renderModal = () => {
    const { visible, operateType } = this.state;
    if (!visible) return;
    // 岗位下数据权限信息、部门下数据权限信息
    const { staffBusinessTag, businessTag, staffId, dispatch } = this.props;
    return (
      <SetBusiness
        staffId={staffId}
        visible={visible}
        operateType={operateType}
        dispatch={dispatch}
        staffBusinessTag={staffBusinessTag}
        businessTag={businessTag}
        onCancel={this.onCancel}
        onSuccessCallback={this.onSuccessCallback}
        onFailureCallback={this.onFailureCallback}
      />
    );
  }

  // 系统属性
  renderSystemAttributes = () => {
    // 岗位下数据权限信息
    const { staffBusinessTag = {} } = this.props;
    const bizDataBusinessInfo = staffBusinessTag.biz_data_business_info || {};
    const {
      platform_list: platform = [],
      supplier_list: suppler = [],
      city_list: city = [],
    } = bizDataBusinessInfo;

    // platform
    const platformForm = (
      <div>
        {
          platform.map((item, key) => {
            const name = Object.values(item)[0];
            return <Tag key={key} style={{ margin: '4px', background: '#F5F5F5' }}>{name}</Tag>;
          })
        }
      </div>
    );

    // suppler
    const supplerForm = (
      <div>
        {
          suppler.map((item, key) => {
            const name = Object.values(item)[0];
            // 平台name
            const platformName = utils.dotOptimal(item, 'platform_info.platform_name', undefined);
            return <Tag key={key} style={{ margin: '4px', background: '#F5F5F5' }}>{platformName ? `${name}（${platformName}）` : name}</Tag>;
          })
        }
      </div>
    );

    // city
    const cityForm = (
      <div>
        {
          city.map((item, key) => {
            const name = Object.values(item)[0];
            return <Tag key={key} style={{ margin: '4px', background: '#F5F5F5' }}>{name}</Tag>;
          })
        }
      </div>
    );
    const formItems = [
      {
        label: '平台',
        form: platformForm,
      },
      {
        label: '供应商',
        form: supplerForm || '--',
      },
      {
        label: '城市',
        form: cityForm,
      },
    ];

    const layout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 22,
      },
    };

    return (
      <div className={style['app-organization-post-business']}>
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </div>
    );
  }

  render() {
    const { staffBusinessTag = {} } = this.props;
    const bizDataBusinessInfo = staffBusinessTag.biz_data_business_info || {};
    return (
      <div>
        {
          Object.keys(bizDataBusinessInfo).length > 0
          ? this.renderContent()
          : this.renderEmpty()
        }
        {this.renderModal()}
      </div>
    );
  }
}

Business.propTypes = {
  id: PropTypes.string, // 当前岗位所说部门id
  staffId: PropTypes.string, // 岗位id
  staffBusinessTag: PropTypes.object,
  businessTag: PropTypes.object,
};

Business.defaultProps = {
  id: '',
  staffId: '',
  staffBusinessTag: {},
  businessTag: {},
};

function mapStateToProps({
  organizationBusiness: {
    businessTag, // 部门下数据权限信息
    staffBusinessTag, // 岗位下数据权限信息
  },
}) {
  return { businessTag, staffBusinessTag };
}

export default connect(mapStateToProps)(Business);
