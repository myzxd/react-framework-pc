/*
 *  劳动者档案
 **/
import is from 'is_js';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Tooltip } from 'antd';
import CommonLine from './commonLine';
import SecondSearch from './secondSearch';
import {
  SigningState,
  SignContractType,
  HouseholdType,
} from '../../../../application/define';
import { system } from '../../../../application';

const codeFlag = system.isShowCode(); // 判断是否是code

class SecondLine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      totalX: 2140, // columns的总宽度
      formTitle: { // 表格标题信息
        title: '劳动者档案列表',
        // linkUrl: '/#/Employee/Create?fileType=second', // 暂时隐藏
        // btnName: '新增劳动者档案',
      },
    };
  }

  // 清除劳动者数据可能给其他模块带来的影响
  componentWillUnmount() {
    this.props.dispatch({ type: 'employeeManage/resetEmployees', payload: { fileType: 'second' } });
  }

  // 渲染人员状态
  renderState = (state) => {
    if (state === SigningState.pending) {
      return '待合作';
    } else if (state === SigningState.normal || state === SigningState.replace || state === SigningState.pendingReview || state === SigningState.repair) {
      return '合作中';
    } else if (state === SigningState.release) {
      return '已解除';
    } else {
      return '--';
    }
  }

  render() {
    const { totalX, formTitle } = this.state;
    const columns = [ // 渲染表格中对应的数据
      {
        width: 100,
        title: '人员状态',
        dataIndex: 'state',
        key: 'state',
        render: this.renderState,
      },
      {
        width: 100,
        title: '个户类型',
        dataIndex: 'individual_type',
        key: 'individual_type',
        render: (text) => {
          return text ? HouseholdType.description(text) : '--';
        },
      },
      {
        width: 240,
        title: '第三方平台账户ID',
        dataIndex: 'custom_id_list',
        key: 'custom_id_list',
        render: (text) => {
          if (is.empty(text) || is.not.existy(text)) {
            return '--';
          }
          const len = text.length;
          return (
            <Tooltip
              placement="top"
              title={text && text.toString()}
            >{text[0]}{len > 1 ? `等共${text.length}条` : ''}</Tooltip>
          );
        },
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
        title: '供应商',
        width: 200,
        dataIndex: 'working_supplier_names',
        key: 'working_supplier_names',
        render: (text) => {
          if (is.empty(text) || is.not.existy(text)) {
            return '--';
          }
          const len = text.length;
          return (
            <Tooltip
              placement="top"
              title={text && text.toString()}
            >{text[0]}{len > 1 ? `等共${text.length}条` : ''}</Tooltip>
          );
        },
      },
      {
        title: '平台',
        width: 100,
        dataIndex: 'working_platform_names',
        key: 'working_platform_names',
        render: (text) => {
          if (is.empty(text) || is.not.existy(text)) {
            return '--';
          }
          const len = text.length;
          return (
            <Tooltip
              placement="top"
              title={text && text.toString()}
            >{text[0]}{len > 1 ? `等共${text.length}条` : ''}</Tooltip>
          );
        },
      },
      {
        title: '城市',
        width: 150,
        dataIndex: 'working_city_names',
        key: 'working_city_names',
        render: (text) => {
          if (is.empty(text) || is.not.existy(text)) {
            return '--';
          }
          const len = text.length;
          return (
            <Tooltip
              placement="top"
              title={text && text.toString()}
            >{text[0]}{len > 1 ? `等共${text.length}条` : ''}</Tooltip>
          );
        },
      },
      {
        title: '商圈',
        width: 150,
        dataIndex: 'working_biz_district_names',
        key: 'working_biz_district_names',
        render: (text) => {
          if (is.empty(text) || is.not.existy(text)) {
            return '--';
          }
          const len = text.length;
          return (
            <Tooltip
              placement="top"
              title={text && text.toString()}
            >{text[0]}{len > 1 ? `等共${text.length}条` : ''}</Tooltip>
          );
        },
      },
      {
        title: '签约类型',
        width: 150,
        dataIndex: 'sign_type',
        key: 'sign_type',
        render: (text) => {
          return text ? SignContractType.description(text) : '--';
        },
      },
      {
        title: '合同甲方',
        width: 200,
        dataIndex: 'contract_belong_info',
        key: 'contract_belong_info',
        render: (text) => {
          return text && text.name ? text.name : '--';
        },
      },
    ];
    // 需要判断是否是code系统
    if (codeFlag) {
      columns.splice(4, 0,
        {
          width: 100,
          title: 'team类型',
          dataIndex: 'cost_team_type',
          key: 'cost_team_type',
          render: text => text || '--',
        },
        {
          width: 100,
          title: 'team信息',
          dataIndex: ['cost_team_info', 'name'],
          key: 'cost_team_info.name',
          render: text => text || '--',
        });
    }
    const { employeesSecond, dispatch } = this.props;
    return (
      <CommonLine
        Search={SecondSearch}
        fileType="second"
        employees={employeesSecond}
        dispatch={dispatch}
        propsColumns={columns}
        propsTotalX={totalX}
        formTitle={formTitle}
      />
    );
  }
}

function mapStateToProps({ employeeManage: { employeesSecond } }) {
  return { employeesSecond };
}
export default connect(mapStateToProps)(SecondLine);
