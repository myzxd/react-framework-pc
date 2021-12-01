/**
 * 组织架构 - 部门管理 - 业务信息Tab
 */
import dot from 'dot-prop';
import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Button, Empty } from 'antd';

import { CoreContent } from '../../../../components/core';
import Content from './component/content';
import Update from './component/update';
import EmptyData from '../empty';

import Operate from '../../../../application/define/operate';
import style from './index.less';
// 页面类型
const PageType = {
  detail: 10,
  update: 20,
};

// 操作类型
const OperateType = {
  create: 10,
  update: 20,
};

class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      pageType: 10, // 页面类型
      operateType: 10, // 操作类型
    };
  }

  componentDidMount() {
    this.getBusinessTag();
  }

  componentDidUpdate(prevProps) {
    const prevId = dot.get(prevProps, 'departmentId', undefined); // 旧部门id
    const nextId = dot.get(this.props, 'departmentId', undefined); // 新部门id
    const prevActiveKey = dot.get(prevProps, 'activeKey', undefined);
    const nextActiveKey = dot.get(this.props, 'activeKey', undefined);
    if (prevId !== nextId || prevActiveKey !== nextActiveKey) {
      this.getBusinessTag();
    }
  }


  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'organizationBusiness/resetBusiness', payload: {} });
  }

  // page onChange
  onChangeType = (val, operate) => {
    this.setState({ pageType: val, operateType: operate });
  }

  // 获取部门下业务信息
  getBusinessTag = () => {
    const { dispatch, departmentId } = this.props;
    dispatch({ type: 'organizationBusiness/getBusiness', payload: { departmentId } });
    this.setState({
      pageType: 10, // 页面类型
      operateType: 10, // 操作类型
    });
  }

  // 有数据
  renderContent = () => {
    const { businessTag = {}, activeKey } = this.props;
    return <Content data={businessTag} activeKey={activeKey} onChangeType={this.onChangeType} />;
  }

  // 无数据
  renderEmpty = () => {
    return (
      <CoreContent title="业务信息列表">
        <div className={style['app-organization-busines-create-operate']}>
          {
            Operate.canOperateOrganizationManageAttributesCreate() ?
              (
                <Button
                  type="primary"
                  onClick={() => this.onChangeType(PageType.update, OperateType.create)}
                >新增业务信息</Button>
              )
            : <Empty />
          }
        </div>
      </CoreContent>
    );
  }

  // detail
  renderDetail = () => {
    const { businessTag } = this.props;

    // 判断业务信息标签是否为空, 为空则不显示内容
    if (Object.keys(businessTag).length <= 0) {
      return this.renderEmpty();
    }

    // 渲染内容
    return this.renderContent();
  }

  // update
  renderUpdate = () => {
    const { businessTag, dispatch, departmentId } = this.props;
    const { operateType } = this.state;
    return (
      <Update
        data={businessTag}
        dispatch={dispatch}
        operateType={operateType}
        departmentId={departmentId}
        onChangeType={() => this.onChangeType(PageType.detail)}
        getBusinessTag={this.getBusinessTag}
      />
    );
  }

  render() {
    const { pageType } = this.state;
    const { departmentId } = this.props;
    // 判断是否有部门id
    if (!departmentId || departmentId === 'undefined') {
      return <EmptyData />;
    }

    // 详情页面
    if (pageType === PageType.detail) {
      return this.renderDetail();
    }

    // 编辑页面
    if (pageType === PageType.update) {
      return this.renderUpdate();
    }

    return <EmptyData />;
  }
}

Index.propTypes = {
  businessTag: PropTypes.object,
  dispatch: PropTypes.func,
  departmentId: PropTypes.string,
};

Index.defaultProps = {
  businessTag: {},
  dispatch: () => {},
  departmentId: '',
};

function mapStateToProps({
  organizationBusiness: {
    businessTag, // 部门下业务标签
  },
}) {
  return { businessTag };
}

export default connect(mapStateToProps)(Index);
