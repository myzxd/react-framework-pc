/**
 * 组织架构 - 部门管理 - 部门Tab - 部门成员组件
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Table, Popconfirm, Tooltip } from 'antd';
// import aoaoBossTools from '../../../../../utils/util';
import { CoreContent } from '../../../../../components/core';
import Operate from '../../../../../application/define/operate';

import style from './index.less';

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
    this.getDepartmentMember(this.private.searchParams);
    this.getDepartment();
  }

  componentDidUpdate(prevProps) {
    const prevId = dot.get(prevProps, 'departmentId', undefined); // 旧部门id
    const nextId = dot.get(this.props, 'departmentId', undefined); // 新部门id
    if (prevId !== nextId) {
      this.getDepartmentMember(this.private.searchParams);
    }
  }


  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'department/resetDepartmentMember', payload: {} });
  }

  onChangePage = (page, limit) => {
    this.getDepartmentMember({ page, limit });
  }

  // 新增成员
  onCreateMember = () => {
    const { departmentId, departmentName } = this.props;
    // 使用aoaoBossTools.popUpCompatible打开的页面无法跳转回当前页面（window.document.createElement无法记录跳转页面的父页面），并且Employee/Update内无弹窗，所以替换成window.open
    window.open(`/#/Employee/Create?fileType=staff&departmentId=${departmentId}&departmentName=${departmentName}`);
    // aoaoBossTools.popUpCompatible(`/#/Employee/Create?fileType=staff&departmentId=${departmentId}&departmentName=${departmentName}`);
  }

  // 编辑成员
  onUpdateMember = (text) => {
    const { departmentId, departmentName } = this.props;
    // 使用aoaoBossTools.popUpCompatible打开的页面无法跳转回当前页面（window.document.createElement无法记录跳转页面的父页面），并且Employee/Update内无弹窗，所以替换成window.open
    window.open(`/#/Employee/Update?id=${text}&fileType=staff&departmentId=${departmentId}&departmentName=${departmentName}`);
    // aoaoBossTools.popUpCompatible(`/#/Employee/Update?id=${text}&fileType=staff&departmentId=${departmentId}&departmentName=${departmentName}`);
  }

  // 导出,创建下载任务
  onCreateExportTask = () => {
    const { dispatch, departmentId } = this.props;

    // 当前部门及其所有子部门id
    const childIds = this.getChildDepartment();
    // 子部门ids
    const payload = { id: [...childIds] };
    departmentId && dispatch({ type: 'department/exportMember', payload });
  }

  // 获取部门下成员
  getDepartmentMember = (params) => {
    const { dispatch, departmentId = undefined } = this.props;
    departmentId && dispatch({ type: 'department/getDepartmentMember', payload: { id: departmentId, ...params } });
  }

  // 获取部门tree
  getDepartment = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'department/getDepartmentTree', payload: {} });
  }

  // 获取所有子部门
  getChildDepartment = () => {
    const { departmentId, departmentTree } = this.props;

    // return的部门id
    let childIds = [departmentId];
    // 找到当前部门
    const getChildId = (id) => {
      // 过滤出节点pid（父节点id）为当前部门id（过滤出子部门）
      const filterNode = departmentTree.filter(i => i.pid === id);

      // 无子部门时return
      if (filterNode.length < 1) return;

      // 获取id
      const filterIds = filterNode.map(n => n._id);

      // 更新
      childIds = [...childIds, ...filterIds];

      // 递归
      filterIds.forEach(i => getChildId(i));
    };
    getChildId(departmentId);
    return childIds;
  }


  // 渲染岗位name
  renderStaffName = (text, record) => {
    const { departmentId } = this.props;
    // 兼职部门和岗位的映射信息列表
    const { pluralism_department_job_relation_list: pluralism } = record;

    // 数据不存在
    if (!text || !pluralism) return '--';
    let staff = [];

    // 主岗信息
    const { department_id: lordDepartmentId = undefined, job_info: lordJobInfo = {} } = text;
    // 主岗name
    const { name: lordJobInfoName = undefined } = lordJobInfo;

    if (departmentId === lordDepartmentId && lordJobInfoName) {
      staff[staff.length] = lordJobInfoName;
    }

    // 兼职部门和岗位的映射信息列表
    const { pluralism_department_job_relation_list: viceDepartmentList = [] } = record;
    // 过滤对应当前部门的副岗list
    const filterJob = viceDepartmentList.filter(job => job.department_id === departmentId);
    // map岗位名称
    const mapJob = filterJob.map((job) => {
      if (Object.keys(job).length > 0 && Object.keys(job.job_info).length > 0 && job.job_info.name) {
        return job.job_info.name;
      }
    });

    // TODO： @王晋 注释
    staff = staff.concat(mapJob);
    if (staff.length > 3) {
      return (
        <Tooltip title={staff.map(item => item).join(' 、 ')}>
          <div className={style['app-organization-member-table-break-line']}>
            {dot.get(text, '0')}、{dot.get(text, '1')}、{dot.get(text, '2')}...
          </div>
        </Tooltip>
      );
    }

    // TODO： @王晋 注释
    if (staff.length > 0 && staff.length <= 3) {
      return (
        <div className={style['app-organization-member-table-break-line']}>
          {staff.map(item => item).join('、')}
        </div>
      );
    }

    return '--';
  }

  // 渲染基本信息
  renderContent = () => {
    const { departmentMember = {}, departmentId } = this.props;
    const {
      data: dataSource = [],
      _meta: meta = {},
    } = departmentMember;

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
        title: '部门名称',
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
        dataIndex: 'department_job_relation_info',
        key: 'department_job_relation_info',
        render: (text, record) => {
          return this.renderStaffName(text, record);
        },
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
      {
        title: '操作',
        dataIndex: '_id',
        key: 'operate',
        render: (text) => {
          const operate = [];
          // 编辑操作
          if (Operate.canOperateOrganizationManageDepartmentEmployeeUpdate()) {
            operate.push(
              <a
                onClick={() => this.onUpdateMember(text)}
                className={style['app-organization-department-basic-operate']}
              >
                编辑
              </a>,
            );
          }
          // 查看操作
          if (Operate.canOperateOrganizationManageDepartmentEmployeeDetail()) {
            operate.push(
              <a
                href={`/#/Employee/Detail?id=${text}&fileType=staff`}
                target="_blank"
                rel="noopener noreferrer"
                className={style['app-organization-department-basic-operate']}
              >
                查看
            </a>,
            );
          }
          return (
            <div>
              {operate.length === 0 ? '--' : operate}
            </div>
          );
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

    const titleExt = (
      <div>
        {
          Operate.canOperateOrganizationManageDepartmentEmployeeExport() ?
            (
              <Popconfirm title="创建下载任务？" onConfirm={this.onCreateExportTask} okText="确认" cancelText="取消">
                <Button>批量导出</Button>
              </Popconfirm>
            ) : null
        }
        {
          Operate.canOperateOrganizationManageDepartmentEmployeeCreate() ?
            (
              <Button
                type="primary"
                onClick={this.onCreateMember}
                className={style['app-organization-department-basic-operate']}
              >添加成员</Button>

            ) : null
        }
      </div>
    );


    return (
      <CoreContent title="部门成员" titleExt={titleExt}>
        <Table
          rowKey={(rec, key) => rec.id || key}
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          // scroll={{ y: '400px' }}
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
  department: {
    departmentMember, // 部门详情
    departmentTree, // 部门树数据
  },
}) {
  return { departmentMember, departmentTree };
}

Member.propTypes = {
  departmentMember: PropTypes.object, // 部门详情
  departmentId: PropTypes.string,     // 部门id
  departmentName: PropTypes.string,   // 部门名称
  departmentTree: PropTypes.array,    // 部门树数据
};

Member.defaultProps = {
  departmentMember: {},
  departmentId: '',
  departmentName: '',
  departmentTree: {},
};

export default connect(mapStateToProps)(Member);
