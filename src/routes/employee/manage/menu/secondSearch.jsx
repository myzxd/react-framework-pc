/**
 * 劳动者档案人员管理列表，搜索功能
 */
import is from 'is_js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Select, Input, Button } from 'antd';

import { CoreContent } from '../../../../components/core';
import {
  DeprecatedCommonSearchExtension,
  CommonSelectCompanies,
  CommonSelectRecommendCompany,
} from '../../../../components/common';
import {
  SigningState,
  SignContractType,
  AccountRecruitmentChannel,
} from '../../../../application/define';
import Operate from '../../../../application/define/operate';
import { system } from '../../../../application';

import DownloadModal from './modal/download.jsx';
import ComponentTeam from './components/codeTeam';
import ComponentTeamType from './components/codeTeamType';

const { Option } = Select;
const codeFlag = system.isShowCode(); // 判断是否是code

class SecondSearch extends Component {

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
        state: '',    // 人员状态
        signType: '',                    // 签约类型
        recruitmentChannelId: '',        // 推荐渠道
        referrerCompanyId: '',           // 推荐公司
        contractFirstPartyInfo: '',      // 合同甲方
        companyNo: '',                   // 个独编号
        personalCompanyNo: '',           // 个户编号
        office: '',                      // 职能
        name: '',                        // 姓名
        phone: '',                       // 手机号
        identityCardId: '',              // 身份证号
      },
      // 搜索的扩展数据
      searchExtensions: {
        suppliers: [], // 供应商
        platforms: [], // 平台
      },
      isRecommendCompanyDisabled: true, // 是否禁用推荐公司表单
      isShowModal: false,               // 显示弹窗
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
    if (`${e}` === `${AccountRecruitmentChannel.third}`) {
      this.setState((prevState) => {
        return {
          ...prevState,
          isRecommendCompanyDisabled: false,
        };
      });
      return;
    }
    this.state.form.setFields({ referrerCompanyId: '' });
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

  // 重置
  onReset = () => {
    const { onSearch } = this.props;

    const params = {
      suppliers: [],  // 供应商
      platforms: [],  // 平台
      cities: [],     // 城市
      districts: [],  // 商圈
      state: '',    // 人员状态
      signType: '',                    // 签约类型
      recruitmentChannelId: '',        // 推荐渠道
      referrerCompanyId: '',           // 推荐公司
      contractFirstPartyInfo: '',      // 合同甲方
      companyNo: '',                   // 个独编号
      personalCompanyNo: '',           // 个户编号
      office: '',                      // 职能
      name: '',                        // 姓名
      phone: '',                       // 手机号
      identityCardId: '',              // 身份证号
      bossMemberId: '',                // boss人员id
      customId: undefined,              // 三方id
      codeTeamType: undefined,          // team类型
      codeTeam: undefined,              // team信息
      windControl: undefined, // 风控检测状态
    };

    this.setState({
      search: params,
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
    // this.state.form.validateFields((err, values) => {
    //   const params = this.validSearchParams(values);
    //   this.props.dispatch({ type: 'employeeManage/exportEmployees', payload: params });
    // });
    this.setState({
      isShowModal: true,
    });
  }


  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 关闭选择类型弹窗的回调
  onHideModal = () => {
    this.setState({
      isShowModal: false,
    });
  }

  // 归属team类型
  onChangeCodeTeamType = (form) => {
    // 清空team类型
    form.setFieldsValue({ codeTeam: undefined });
  }

  // 校验搜索参数
  validSearchParams = (values) => {
    const {
      state,                        // 人员状态
      signType,                     // 签约类型
      recruitmentChannelId,         // 推荐渠道
      referrerCompanyId,            // 推荐公司
      contractFirstPartyInfo,       // 合同甲方
      companyNo,                    // 个独编号
      personalCompanyNo,            // 个户编号
      office,                       // 职能
      name,                         // 姓名
      phone,                        // 手机号
      identityCardId,               // 身份证号
      bossMemberId,                 // boss人员id
      suppliers,
      platforms,
      cities,
      districts,
      customId,                     // 第三方平台账户ID
    } = values;

    const params = values;

    // 签约状态
    if (is.existy(state) && is.not.empty(state)) {
      params.state = state.split('&');
    }
    // 签约类型
    if (is.existy(signType)) {
      params.signType = signType;
    }
    // 第三方平台账户ID
    if (is.existy(customId)) {
      params.customId = customId;
    }
    // 推荐渠道
    if (is.existy(recruitmentChannelId)) {
      params.recruitmentChannelId = recruitmentChannelId;
    }
    // 推荐公司
    if (is.existy(referrerCompanyId) && is.not.empty(referrerCompanyId)) {
      params.referrerCompanyId = referrerCompanyId;
    }
    // 合同甲方
    if (is.existy(contractFirstPartyInfo)) {
      params.contractFirstPartyInfo = contractFirstPartyInfo;
    }
    // 个独编号
    if (is.existy(companyNo)) {
      params.companyNo = companyNo;
    }
    // 个户编号
    if (is.existy(personalCompanyNo)) {
      params.personalCompanyNo = personalCompanyNo;
    }
    // 职能
    if (is.existy(office)) {
      params.office = office;
    }
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
    // boss人员id
    if (is.existy(bossMemberId)) {
      params.bossMemberId = bossMemberId;
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

    params.fileType = 'second';

    return Object.assign({}, params);
  }

  // 渲染导出弹窗
  renderDownloadModal = () => {
    const { onHideModal } = this; // 关闭弹窗回调
    const { employeeManage } = this.props;
    const { isShowModal } = this.state;
    // 添加请求时人员类型
    const fileType = employeeManage.fileType;
    return (
      <DownloadModal onHideModal={onHideModal} isShowModal={isShowModal} fileType={fileType} />
    );
  }

  // 搜索功能
  renderSecondSearch = () => {
    // 导出EXCEL(超级管理员)
    let operations = '';
    if (Operate.canOperateEmployeeSearchExportExcel()) {
      operations = (
        <Button type="primary" onClick={this.onCreateExportTask}>导出EXCEL</Button>
      );
    }
    const { isRecommendCompanyDisabled } = this.state;
    const { suppliers } = this.state.searchExtensions;
    const { platforms } = this.state.searchExtensions;
    const isElectronicSign = SignContractType.electronic === this.state.search.contractType;

    const items = [
      {
        label: '人员状态',
        form: form => (form.getFieldDecorator('state')(
          <Select placeholder="请选择人员状态">
            <Option value={`${SigningState.pending}`}>{'待合作'}</Option>
            <Option value={`${SigningState.normal}&${SigningState.replace}&${SigningState.pendingReview}&${SigningState.repair}`}>{'合作中'}</Option>
            <Option value={`${SigningState.release}`}>{'已解除'}</Option>
          </Select>,
        )),
      },
      // {
      //   label: '签约状态',
      //   form: form => (form.getFieldDecorator('state')(
      //     <Select allowClear mode="multiple" placeholder="请选择签约状态" onChange={this.onChangeVerifyState}>
      //       <Option value={`${SigningState.pending}`}>{SigningState.description(SigningState.pending)}</Option>
      //       <Option value={`${SigningState.normal}`}>{SigningState.description(SigningState.normal)}</Option>
      //       <Option value={`${SigningState.replace}`}>{SigningState.description(SigningState.replace)}</Option>
      //       <Option value={`${SigningState.pendingReview}`}>{SigningState.description(SigningState.pendingReview)}</Option>
      //       <Option value={`${SigningState.repair}`}>{SigningState.description(SigningState.repair)}</Option>
      //       <Option value={`${SigningState.release}`}>{SigningState.description(SigningState.release)}</Option>
      //     </Select>,
      //   )),
      // },
      {
        label: '签约类型', // 新增
        form: form => (form.getFieldDecorator('signType')(
          <Select allowClear mode="multiple" showArrow placeholder="请选择签约类型" onChange={this.onChangeSignType}>
            <Option value={`${SignContractType.electronic}`}>{SignContractType.description(SignContractType.electronic)}</Option>
            <Option value={`${SignContractType.paper}`}>{SignContractType.description(SignContractType.paper)}</Option>
          </Select>,
        )),
      },
      {
        label: '第三方平台账户ID',
        form: form => (form.getFieldDecorator('customId')(
          <Input placeholder="请输入第三方平台账户ID" />,
        )),
      },
      {
        label: '推荐渠道',
        form: form => (form.getFieldDecorator('recruitmentChannelId')(
          <Select allowClear placeholder="请选择推荐渠道" onChange={this.onChangeRecommendType}>
            <Option value={`${AccountRecruitmentChannel.third}`}>{AccountRecruitmentChannel.description(AccountRecruitmentChannel.third)}</Option>
            <Option value={`${AccountRecruitmentChannel.personal}`}>{AccountRecruitmentChannel.description(AccountRecruitmentChannel.personal)}</Option>
            <Option value={`${AccountRecruitmentChannel.other}`}>{AccountRecruitmentChannel.description(AccountRecruitmentChannel.other)}</Option>
            <Option value={`${AccountRecruitmentChannel.transfer}`}>{AccountRecruitmentChannel.description(AccountRecruitmentChannel.transfer)}</Option>
            <Option value={`${AccountRecruitmentChannel.recommend}`}>{AccountRecruitmentChannel.description(AccountRecruitmentChannel.recommend)}</Option>
            <Option value={`${AccountRecruitmentChannel.thirdPlatform}`}>{AccountRecruitmentChannel.description(AccountRecruitmentChannel.thirdPlatform)}</Option>
          </Select>,
        )),
      },
      {
        label: '推荐公司',
        form: form => (form.getFieldDecorator('referrerCompanyId')(
          <CommonSelectRecommendCompany
            disabled={isRecommendCompanyDisabled}
            allowClear
            optionFilterProp="children"
            mode="multiple"
            showArrow
            placeholder="请选择推荐公司"
            suppliers={suppliers}
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
            suppliers={suppliers}
            platforms={platforms}
            isElectronicSign={isElectronicSign}
          />,
        )),
      },
      {
        label: '个独编号',
        form: form => (form.getFieldDecorator('companyNo')(
          <Input placeholder="请输入个独编号" />,
        )),
      },
      {
        label: '个户编号',
        form: form => (form.getFieldDecorator('personalCompanyNo')(
          <Input placeholder="请输入个户编号" />,
        )),
      },
      {
        label: '职能',
        form: form => (form.getFieldDecorator('office')(
          <Input placeholder="请输入职能" />,
        )),
      },
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
              showSearch
              mode="multiple"
              showArrow
              allowClear
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
              namespace="secondSearch"
              codeTeamType={form.getFieldValue('codeTeamType')}
              allowClear
              showSearch
              mode="multiple"
              showArrow
              optionFilterProp="children"
            />,
        )),
        },
      );
    }

    const props = {
      items,
      operations,
      onReset: this.onReset,
      onSearch: this.onSearch,
      onChange: this.onChangeSearchExtensions,
      onHookForm: this.onHookForm,
      isExpenseModel: true,
    };

    return (
      <CoreContent className="affairs-flow-form">
        <DeprecatedCommonSearchExtension {...props} />
      </CoreContent>
    );
  };

  render = () => {
    return (
      <div>
        {/* 渲染搜索信息 */}
        {this.renderSecondSearch()}

        {/* 渲染弹窗 */}
        {this.renderDownloadModal()}
      </div>
    );
  };
}

function mapStateToProps({ employeeManage }) {
  return { employeeManage };
}

export default connect(mapStateToProps)(SecondSearch);
