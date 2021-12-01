/*
 *  人员
 **/
import React, { Component } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import CommonLine from './commonLine';
import StaffSearch from './staffSearch';
import {
  SignContractType,
  ContractState,
  StaffSate,
  AccountApplyWay,
  StaffTag,
  OrganizationDepartmentState,
} from '../../../../application/define';
import { system } from '../../../../application';
import Operate from '../../../../application/define/operate';

const codeFlag = system.isShowCode(); // 判断是否是code

class StaffLine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      totalX: 1670, // columns的总宽度
      formTitle: { // 表格标题信息
        title: '员工档案列表',
        linkUrl: '/#/Employee/Create?fileType=staff',
        btnName: '新增员工档案',
      },
    };
  }

  render() {
    const { totalX, formTitle } = this.state;
    const columns = [ // 渲染表格中对应的数据
      {
        width: 150,
        title: '部门',
        dataIndex: 'department_info_list',
        key: 'department',
        render: (text) => {
          return text.reduce((cur, item, idx) => {
            // 已裁撤状态
            const state = Operate.canOperateEmployeeAbolishDepartment() && item.state === OrganizationDepartmentState.disable
              ? OrganizationDepartmentState.description(item.state) : '';
            if (idx === 0) {
              return state ? `${item.name}(${state})` : `${item.name}`;
            }
            return state ? `${cur}，${item.name}(${state})` : `${cur}，${item.name}`;
          }, '');
        },
      },
      {
        width: 150,
        title: '岗位',
        dataIndex: 'major_job_info',
        key: 'major_job',
        render: (text) => {
          return dot.get(text, 'name', '--');
        },
      },
      {
        width: 100,
        title: '部门编号',
        dataIndex: 'major_department_info',
        render: text => dot.get(text, 'code', '--'),
      },
      {
        width: 160,
        title: '风控检测状态',
        dataIndex: 'within_blacklist',
        key: 'within_blacklist',
        render: (text) => {
          // 未通过
          if (text === true) {
            return (
              <span
                style={{ color: 'red' }}
              >未通过</span>
            );
          }
          // 通过
          if (text === false) {
            return (
              <span
                style={{ color: 'green' }}
              >通过</span>
            );
          }

          return '--';
        },
      },
      {
        width: 150,
        title: '员工标签',
        dataIndex: 'work_label',
        render: (text = []) => {
          if (!text || !Array.isArray(text) || text.length <= 0) return '--';
          return text.map(i => StaffTag.description(i)).join('、');
        },
      },
      {
        width: 150,
        title: '签约类型',
        dataIndex: 'sign_type',
        key: 'sign_type',
        render: (text) => {
          return text ? SignContractType.description(text) : '--';
        },
      },
      {
        width: 150,
        title: '员工状态',
        dataIndex: 'state',
        key: 'state',
        render: (text) => {
          return text ? StaffSate.description(text) : '--';
        },
      },
      {
        width: 150,
        title: '合同状态',
        dataIndex: 'contract_state',
        key: 'contract_state',
        render: (text) => {
          return text ? ContractState.description(text) : '--';
        },
      },
      {
        title: '合同甲方',
        dataIndex: 'contract_belong_info',
        key: 'contract_belong_info',
        render: (text) => {
          return text && text.name ? text.name : '--';
        },
      },
      {
        width: 200,
        title: '应聘途径',
        dataIndex: 'application_channel_id',
        key: 'application_channel_id',
        render: (text) => {
          return text ? AccountApplyWay.description(text) : '--';
        },
      },
      // {
      //   width: 300,
      //   title: '推荐公司',
      //   dataIndex: 'referrer_company_info',
      //   key: 'referrer_company_info',
      //   render: (text) => {
      //     return text && text.name ? text.name : '--';
      //   },
      // },
    ];
    // 需要判断是否是code系统
    if (codeFlag) {
      columns.splice(4, 0,
        {
          width: 100,
          title: 'team类型',
          dataIndex: 'cost_team_type',
          key: 'cost_team_type',
          render: (text) => {
            if (text && text !== 'None') return text;
            return '--';
          },
        },
        {
          width: 100,
          title: 'team信息',
          dataIndex: ['cost_team_info', 'name'],
          key: 'cost_team_info.name',
          render: (text) => {
            if (text && text !== 'None') return text;
            return '--';
          },
        });
    }
    const { employees, dispatch } = this.props;
    return (
      <CommonLine
        Search={StaffSearch}
        fileType="staff"
        employees={employees}
        dispatch={dispatch}
        propsColumns={columns}
        propsTotalX={totalX}
        formTitle={formTitle}
      />
    );
  }
}

function mapStateToProps({ employeeManage: { employees } }) {
  return { employees };
}
export default connect(mapStateToProps)(StaffLine);
