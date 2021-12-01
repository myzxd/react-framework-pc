/**
 * 私教资产隶属管理 - 私教团队管理 - 业主团队管理
 */
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Tooltip } from 'antd';

import { OrganizationTeamType } from '../../../../application/define';
import { CoreContent, DeprecatedCoreForm } from '../../../../components/core';

import Relationship from './components/relationship';
import ChangeList from './components/changeList';

class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // 子组件变更记录搜索的参数
      page: 1,
      limit: 30,
    };
  }

  componentDidMount() {
    const { id } = this.props.location.query;
    this.props.dispatch({
      type: 'modelCoachDepartment/fetchCoachDepartmentDetail',
      payload: { id },
    });
    // 请求部门业务信息
    this.props.dispatch({ type: 'organizationBusiness/getBusiness', payload: { departmentId: id } });
  }


  // 修改分页
  onChangePage = (page, limit) => {
    this.setState(() => {
      return {
        page,
        limit,
      };
    }, () => {
      this.onSearch();
    });
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    this.setState(() => {
      return {
        page,
        limit,
      };
    }, () => {
      this.onSearch();
    });
  }
  // 搜索
  onSearch = (flag) => {
    const { id } = this.props.location.query;
    const { page, limit } = this.state;
    // 如果来自于业主管理组件的请求，则重置page有limit
    if (flag) {
      return this.setState(() => {
        return {
          page: 1,
          limit: 30,
        };
      }, () => {
        const searchParams = {
          id,
          meta: {
            page: 1,
            limit: 30,
          },
        };
        this.props.dispatch({
          type: 'modelCoachDepartment/fetchChangeLog',
          payload: searchParams,
        });
      });
    }
    // 变更记录列表的请求
    const searchParams = {
      id,
      meta: {
        page,
        limit,
      },
    };
    this.props.dispatch({
      type: 'modelCoachDepartment/fetchChangeLog',
      payload: searchParams,
    });
  }

  // 渲染业务信息
  renderBusiness = () => {
    const { businessTag = {} } = this.props;
    const {
      platform_names: platformNames = [],     // 平台
      supplier_names: supplierNames = [],         // 供应商
      city_names: cityNames = [],             // 城市
      team_attrs: teamAttrs = [],             // 团队
      custom_attrs: customAttrs = [],         // 自定义
    } = businessTag;
    // 团队属性需要枚举转化
    let teamAttrsMap = [];
    if (teamAttrs.length > 0) {
      teamAttrsMap = teamAttrs.map(item => OrganizationTeamType.description(item));
    }
    const str = [].concat(platformNames, supplierNames, cityNames, teamAttrsMap, customAttrs).toString();
    if (str.length === 0) {
      return '--';
    }
    if (str.length <= 15) {
      return str;
    }
    return (<Tooltip placement="rightBottom" title={str}>
      {`${str.slice(0, 15)}...`}
    </Tooltip>);
  }

  // 基础信息
  renderInfo = () => {
    const { coachDepartmentDetail } = this.props;
    const formItems = [
      {
        label: '私教部门ID',
        form: dot.get(coachDepartmentDetail, '_id', '--'),
      },
      {
        label: '私教部门名称',
        form: dot.get(coachDepartmentDetail, 'name', '--'),
      },
      {
        label: '部门负责人',
        form: dot.get(coachDepartmentDetail, 'administrator_info.name', '--'),
      },
      {
        label: '创建时间',
        form: coachDepartmentDetail.created_at ? moment(coachDepartmentDetail.created_at).format('YYYY年MM月DD日') : '--',
      },
      {
        label: '业务信息',
        form: this.renderBusiness(),
      },
    ];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <CoreContent title={'私教部门信息'}>
        <DeprecatedCoreForm items={formItems} cols={4} layout={layout} />
      </CoreContent>
    );
  }

  render() {
    const { id } = this.props.location.query;
    const { onChangePage, onShowSizeChange, onSearch } = this;
    const { page, limit } = this.state;
    const props = {
      onChangePage,
      onShowSizeChange,
      page,
      limit,
      id,
      onSearch,
    };
    return (
      <div>
        {/* 私教部门信息 */}
        {this.renderInfo()}

        {/* 资产隶属关系列表 */}
        <Relationship
          id={id}
          onGetChangeList={onSearch}
        />

        {/* 变更记录 */}
        <ChangeList {...props} />

      </div>
    );
  }
}

const mapStateToProps = ({ modelCoachDepartment: { coachDepartmentDetail }, organizationBusiness: { businessTag } }) => {
  return { coachDepartmentDetail, businessTag };
};

export default connect(mapStateToProps)(Index);
