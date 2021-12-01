/**
 * 人员管理列表，搜索功能
 */
import is from 'is_js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Select, Input, Button, Popconfirm, DatePicker } from 'antd';

import { DeprecatedCoreSearch } from '../../../../components/core';
import {
  CommonSelectCompanies,
  CommonTreeSelectDepartments,
  CommonSelectStaffs,
} from '../../../../components/common';
import {
  SignContractType,
  ContractState,
  AccountApplyWay,
  StaffSate,
  ThirdCompanyType,
  OrganizationStaffsState,
} from '../../../../application/define';
import { system } from '../../../../application';
import Operate from '../../../../application/define/operate';
import ComponentTeam from './components/codeTeam';
import ComponentTeamType from './components/codeTeamType';

const codeFlag = system.isShowCode(); // 判断是否是code

const { Option } = Select;
const { RangePicker } = DatePicker;

class StaffSearch extends Component {

  static propTypes = {
    onSearch: PropTypes.func, // 搜索回调
  }

  static defaultProps = {
    onSearch: () => {},       // 搜索回调
  }

  constructor(props) {
    super(props);
    this.state = {
      form: undefined,                   // 搜索的form
      search: {
        name: '',                        // 姓名
        phone: '',                       // 手机号
        identityCardId: '',              // 身份证号
        state: '',                       // 签约状态
        signType: '',                    // 签约类型
        recruitmentChannelId: '',        // 推荐渠道
        applicationCompanyName: '',      // 公司名称
        contractFirstPartyInfo: '',      // 合同甲方
        contractState: '',               // 合同状态
        department: '',                  // 部门
        post: '',                        // 岗位
        bossMemberId: '',                // boss人员id
      },
      // 搜索的扩展数据
      searchExtensions: {
        suppliers: [], // 供应商
        platforms: [], // 平台
      },
      isRecommendCompanyDisabled: true, // 是否禁用推荐公司表单
      currentDepartment: '',  // 部门
    };
  }

  // 搜索的扩展数据
  onChangeSearchExtensions = (values) => {
    const { suppliers, platforms } = values;
    this.setState((prevState) => {
      return {
        ...prevState,
        searchExtensions: {
          suppliers, // 供应商
          platforms, // 平台
        },
      };
    });

    this.onResetContractFirstPartyInfo();
  }

  // 更改推荐渠道监听
  onChangeRecommendType = (e) => {
    // 当推荐渠道为公司推荐时启用推荐公司表单
    if (`${e}` === `${AccountApplyWay.company}`) {
      this.setState((prevState) => {
        return {
          ...prevState,
          isRecommendCompanyDisabled: false,
        };
      });
      return;
    }
    this.state.form.setFields({ applicationCompanyName: '' });
    this.setState((prevState) => {
      return {
        ...prevState,
        isRecommendCompanyDisabled: true,
      };
    });
  }

  // 签约类型改变时
  onChangeSignType = () => {
    this.onResetContractFirstPartyInfo();
  }

  // 部门onChange
  onChangeDepartment = (currentDepartment) => {
    this.setState({
      currentDepartment,
    });
    this.state.form.setFields({ post: '' });
  }

  // 部门搜索模糊搜索
  onTreeSelectorFilter = (inputValue, nodeValue) => {
    // inputValue去掉收尾空格不为空 && nodeValue 存在  &&  nodeValue的props 存在  &&  nodeValue.props.title包含inputValue
    return (!!(inputValue.trim()
      && nodeValue
      && nodeValue.props
      && nodeValue.props.title.trim().indexOf(inputValue.trim()) !== -1));
  }

  // 重置
  onReset = () => {
    const { onSearch } = this.props;

    const params = {
      name: '',                        // 姓名
      phone: '',                       // 手机号
      identityCardId: '',              // 身份证号
      state: '',                       // 签约状态
      signType: '',                    // 签约类型
      recruitmentChannelId: '',        // 推荐渠道
      applicationCompanyName: '',      // 公司名称
      contractFirstPartyInfo: '',      // 合同甲方
      contractState: '',               // 合同状态
      department: '',                  // 部门
      post: '',                        // 岗位
      boardDate: null,                 // 入职日期
      bossMemberId: '',                // boss人员id
      codeTeamType: undefined,          // team类型
      codeTeam: undefined,              // team信息
      windControl: undefined, // 风控检测状态
    };

    this.setState({
      search: params,
      currentDepartment: undefined,     // 部门id
    });

    // 重置搜索
    if (onSearch) {
      onSearch(params);
    }
  }

  // 重置合同甲方
  onResetContractFirstPartyInfo = () => {
    this.state.form.setFields({ contractFirstPartyInfo: '' });
  }

  // 搜索
  onSearch = (values) => {
    const { onSearch } = this.props;
    const params = this.validSearchParams(values);
    // 每次点击查询,重置页码为1
    params.page = 1;
    params.limit = 30;

    if (onSearch) {
      onSearch(params);
    }
  }

  // 创建下载任务
  onCreateExportTask = () => {
    this.state.form.validateFields((err, values) => {
      const params = this.validSearchParams(values);
      this.props.dispatch({ type: 'employeeManage/exportEmployees', payload: params });
    });
  }

  // 归属team类型
  onChangeCodeTeamType = (form) => {
    // 清空team类型
    form.setFieldsValue({ codeTeam: undefined });
  }


  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 校验搜索参数
  validSearchParams = (values) => {
    const {
      name,                         // 姓名
      phone,                        // 手机号
      identityCardId,               // 身份证号
      state,                        // 签约状态
      signType,                     // 签约类型
      contractFirstPartyInfo,       // 合同甲方
      contractState,                // 合同状态
      department,                  // 部门
      post,                        // 岗位
      suppliers,
      platforms,
      cities,
      districts,
      applicationChannelId,     // 应聘途径
      applicationCompanyName,   //  公司名称
      boardDate,                // 入职日期
      bossMemberId,                // boss人员id
    } = values;

    const params = values;


    // 姓名
    if (is.existy(name)) {
      params.name = name;
    }
    // 手机号
    if (is.existy(phone)) {
      params.phone = phone;
    }
    // 身份证号
    if (is.existy(identityCardId)) {
      params.identityCardId = identityCardId;
    }
    // 签约状态
    if (is.existy(state) && is.not.empty(state)) {
      params.state = state;
    }
    // 签约类型
    if (is.existy(signType)) {
      params.signType = signType;
    }
    // 合同甲方
    if (is.existy(contractFirstPartyInfo)) {
      params.contractFirstPartyInfo = contractFirstPartyInfo;
    }
    // 合同状态
    if (is.existy(contractState) && is.not.empty(contractState)) {
      params.contractState = contractState;
    }
    // 部门
    if (is.existy(department) && is.not.empty(department)) {
      params.department = department;
    }
    // 岗位
    if (is.existy(post) && is.not.empty(post)) {
      params.post = post;
    }
    // 使用级联查询搜索组建后，默认的返回（suppliers, platforms, cities, districts）查询参数
    if (is.existy(suppliers)) {
      params.suppliers = suppliers;
    }
    if (is.existy(platforms)) {
      params.platforms = platforms;
    }
    if (is.existy(cities)) {
      params.cities = cities;
    }
    if (is.existy(districts)) {
      params.districts = districts;
    }
    // 应聘途径
    if (is.existy(applicationChannelId)) {
      params.applicationChannelId = applicationChannelId;
    }
    //  公司名称
    if (is.existy(applicationCompanyName)) {
      params.applicationCompanyName = applicationCompanyName;
    }
    // 入职日期
    if (is.existy(boardDate)) {
      params.boardDate = boardDate;
    }
    // boss人员id
    if (is.existy(bossMemberId)) {
      params.bossMemberId = bossMemberId;
    }
    // 添加请求时人员类型
    params.fileType = 'staff';

    return Object.assign({}, params);
  }

  // 搜索功能
  render = () => {
    // 导出EXCEL(超级管理员)
    let operations = '';
    if (Operate.canOperateEmployeeSearchExportExcel()) {
      operations = (
        <Popconfirm title="创建下载任务？" onConfirm={this.onCreateExportTask} okText="确认" cancelText="取消">
          <Button type="primary">导出EXCEL</Button>
        </Popconfirm>
      );
    }
    const { isRecommendCompanyDisabled, currentDepartment } = this.state;
    // const { suppliers } = this.state.searchExtensions;
    // const { platforms } = this.state.searchExtensions;
    // const isElectronicSign = SignContractType.electronic === this.state.search.contractType;
    const items = [
      {
        label: '姓名',
        form: form => (form.getFieldDecorator('name')(
          <Input placeholder="请输入姓名" />,
        )),
      },
      {
        label: '手机号',
        form: form => (form.getFieldDecorator('phone')(
          <Input placeholder="请输入手机号" />,
        )),
      },
      {
        label: '身份证号',
        form: form => (form.getFieldDecorator('identityCardId')(
          <Input placeholder="请输入身份证号" />,
        )),
      },
      {
        label: '员工状态',
        form: form => (form.getFieldDecorator('state')(
          <Select allowClear showArrow mode="multiple" placeholder="请选择员工状态" onChange={this.onChangeVerifyState}>
            <Option value={`${StaffSate.inService}`}>{StaffSate.description(StaffSate.inService)}</Option>
            <Option value={`${StaffSate.departure}`}>{StaffSate.description(StaffSate.departure)}</Option>
            <Option value={`${StaffSate.willResign}`}>{StaffSate.description(StaffSate.willResign)}</Option>
          </Select>,
        )),
      },
      {
        label: '签约类型', // 新增
        form: form => (form.getFieldDecorator('signType')(
          <Select allowClear showArrow mode="multiple" placeholder="请选择签约类型" onChange={this.onChangeSignType}>
            <Option value={`${SignContractType.electronic}`}>{SignContractType.description(SignContractType.electronic)}</Option>
            <Option value={`${SignContractType.paper}`}>{SignContractType.description(SignContractType.paper)}</Option>
          </Select>,
        )),
      },
      {
        label: '应聘途径',
        form: form => (form.getFieldDecorator('applicationChannelId')(
          <Select style={{ width: '100%' }} allowClear placeholder="请选择应聘途径" onChange={this.onChangeRecommendType}>
            <Option value={`${AccountApplyWay.company}`}>{AccountApplyWay.description(AccountApplyWay.company)}</Option>
            <Option value={`${AccountApplyWay.recommend}`}>{AccountApplyWay.description(AccountApplyWay.recommend)}</Option>
            <Option value={`${AccountApplyWay.apply}`}>{AccountApplyWay.description(AccountApplyWay.apply)}</Option>
            <Option value={`${AccountApplyWay.transfer}`}>{AccountApplyWay.description(AccountApplyWay.transfer)}</Option>
            <Option value={`${AccountApplyWay.hr}`}>{AccountApplyWay.description(AccountApplyWay.hr)}</Option>
            <Option value={`${AccountApplyWay.other}`}>{AccountApplyWay.description(AccountApplyWay.other)}</Option>
          </Select>,
        )),
      },
      {
        label: '公司名称',
        form: form => (form.getFieldDecorator('applicationCompanyName')(
          <Input
            disabled={isRecommendCompanyDisabled}
            allowClear
            placeholder="请输入公司名称"
          />,
        )),
      },
      {
        label: '合同甲方', // 合同归属
        form: form => (form.getFieldDecorator('contractFirstPartyInfo')(
          <CommonSelectCompanies
            allowClear
            optionFilterProp="children"
            mode="multiple"
            showArrow
            placeholder="请选择合同归属"
            type={ThirdCompanyType.staffProfile}
            // suppliers={suppliers}
            // platforms={platforms}
            // isElectronicSign={isElectronicSign}
          />,
        )),
      },
      {
        label: '合同状态',
        form: form => (form.getFieldDecorator('contractState')(
          <Select allowClear placeholder="请选择合同状态" onChange={this.onChangeContractState}>
            <Option value={`${ContractState.uploaded}`}>{ContractState.description(ContractState.uploaded)}</Option>
            <Option value={`${ContractState.notUpload}`}>{ContractState.description(ContractState.notUpload)}</Option>
          </Select>,
        )),
      },
      {
        label: '部门',
        form: form => (form.getFieldDecorator('department')(
          <CommonTreeSelectDepartments
            allowClear
            isAuthorized
            placeholder="请选择部门"
            onChange={this.onChangeDepartment}
            namespace="staffSearch"
            filterTreeNode={this.onTreeSelectorFilter}
            isAuth={Operate.canOperateEmployeeAbolishDepartment()}
          />,
        )),
      },
      {
        label: '岗位',
        form: form => (form.getFieldDecorator('post')(
          <CommonSelectStaffs
            allowClear
            placeholder="请选择岗位"
            departmentId={currentDepartment}
            namespace="staffSearch"
            state={OrganizationStaffsState.enable}
          />,
        )),
      },
      {
        label: '入职日期',
        form: form => (form.getFieldDecorator('boardDate', { initialValue: null })(
          <RangePicker format={'YYYY-MM-DD'} />,
        )),
      },
      {
        label: 'BOSS人员ID',
        form: form => (form.getFieldDecorator('bossMemberId')(
          <Input placeholder="请输入BOSS人员ID" />,
        )),
      },
      {
        label: '风控检测状态',
        form: form => (form.getFieldDecorator('windControl')(
          <Select
            placeholder="请选择"
            allowClear
          >
            <Option
              value={false}
              style={{ color: 'green' }}
            >通过</Option>
            <Option
              value
              style={{ color: 'red' }}
            >
              未通过
            </Option>
          </Select>,
        )),
      },
    ];
    // 判断是否是code系统
    if (codeFlag) {
      items.push(
        {
          label: 'TEAM类型',
          form: form => (form.getFieldDecorator('codeTeamType')(
            <ComponentTeamType
              placeholder="请选择归属team类型"
              isShowEmpty
              showArrow
              mode="multiple"
              allowClear
              showSearch
              optionFilterProp="children"
              onChange={() => this.onChangeCodeTeamType(form)}
            />,
            )),
        },
        {
          label: 'TEAM信息',
          form: form => (form.getFieldDecorator('codeTeam')(
            <ComponentTeam
              placeholder="请选择TEAM信息"
              codeTeamType={form.getFieldValue('codeTeamType')}
              isShowEmpty
              showSearch
              allowClear
              showArrow
              mode="multiple"
              namespace="staffSearch"
              optionFilterProp="children"
            />,
            )),
        },
          );
    }

    const props = {
      namespace: 'search',
      items,
      operations,
      onReset: this.onReset,
      onSearch: this.onSearch,
      onChange: this.onChangeSearchExtensions,
      onHookForm: this.onHookForm,
    };

    return (
      <div style={{ padding: '16px', margin: '10px 0 16px', backgroundColor: '#FAFAFA' }}>
        <DeprecatedCoreSearch {...props} />
      </div>
    );
  };
}
function mapStateToProps({ employeeManage }) {
  return { employeeManage };
}

export default connect(mapStateToProps)(StaffSearch);

