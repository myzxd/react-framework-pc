/**
 * 组织架构 - 部门管理 - 岗位编制详情 - 成员组件
 */
import { connect } from 'dva';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Table } from 'antd';

import { CoreContent } from '../../../../../components/core';

class Member extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.private = {
      searchParams: {
        limit: 30,
        page: 1,
      },
    };
  }

  componentDidMount() {
    this.getStaffMember(this.private.searchParams);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'organizationStaffs/resetStaffMember', payload: {} });
  }

  onChangePage = (page, limit) => {
    this.getStaffMember({ page, limit });
  }

  // 获取岗位下成员
  getStaffMember = (params) => {
    const { dispatch, staffId = '' } = this.props;
    staffId && dispatch({ type: 'organizationStaffs/getStaffMember', payload: { staffId, ...params } });
  }

  // 列表
  renderContent = () => {
    const { staffMember = {}, departmentId } = this.props;
    const {
      data: dataSource = [],
      _meta: meta = {},
    } = staffMember;

    const {
      result_count: dataCount = 0,
    } = meta;

    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
        render: text => text || '--',
      },
      {
        title: '部门',
        dataIndex: 'department_info_list',
        key: 'department_info_list',
        render: (text) => {
          if (Array.isArray(text) && text.length > 0) {
            const department = text.find(depart => depart._id === departmentId);
            return (department ? department.name : '--');
          }
          return '--';
        },

      },
      {
        title: '岗位',
        dataIndex: ['major_job_info', 'name'],
        key: 'major_job_info',
        render: text => text || '--',
      },
      {
        title: '更新时间',
        dataIndex: 'updated_at',
        key: 'updated_at',
        width: 100,
        render: (text) => {
          if (text) {
            return moment(String(text)).format('YYYY-MM-DD HH:mm:ss');
          }
          return '--';
        },
      },
    ];

    // 分页
    const pagination = {
      defaultPageSize: 30, // 默认数据条数
      onChange: this.onChangePage, // 切换分页
      total: dataCount, // 数据总条数
      showTotal: total => `总共${total}条`, // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      showQuickJumper: true, // 显示快速跳转
      showSizeChanger: true, // 显示分页
      onShowSizeChange: this.onChangePage, // 展示每页数据数
    };

    return (
      <CoreContent title="岗位成员">
        <Table
          rowKey={(rec, key) => rec._id || key}
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
        />
      </CoreContent>
    );
  }

  render() {
    return (
      <div>
        {/* 列表 */}
        {this.renderContent()}
      </div>
    );
  }
}

function mapStateToProps({
  organizationStaffs: {
    staffMember, // 部门详情
  },
}) {
  return { staffMember };
}

Member.propTypes = {
  staffMember: PropTypes.object,
  staffId: PropTypes.string,
  departmentId: PropTypes.string,
};

Member.defaultProps = {
  staffMember: {},
  staffId: '',
  departmentId: '',
};

export default connect(mapStateToProps)(Member);
