/**
 * 合同管理-详情
 */

import React, { Component } from 'react';
import is from 'is_js';
import { connect } from 'dva';

import { CoreContent, DeprecatedCoreForm } from '../../../components/core';
import {
  Gender,
  SignContractType,
  SignContractCycle,
  SigningState,
  HouseholdType,
} from '../../../application/define';

class Detail extends Component {

  componentDidMount() {
    const { dispatch, location: { query: { id } } } = this.props;
    dispatch({
      type: 'employeeContract/fetchEmployeeContractDetail',
      payload: { id: `${id}` },
    });
  }

  // 校验数据是否显示'--'
  validateData = (data) => {
    if (is.existy(data) && is.not.empty(data)) {
      return data;
    }
    return '--';
  }

  // 渲染个人信息
  renderPersonInfo = () => {
    const { employeeContractDetail: {
      employeeId,
      name,
      phone,
      genderId,
      supplier,
      platform,
      city,
      district,
      householdType,
      address,
    } } = this.props;
    const formItems = [
      {
        label: '人员ID',
        form: this.validateData(employeeId),
      },
      {
        label: '姓名',
        form: this.validateData(name),
      },
      {
        label: '手机号',
        form: this.validateData(phone),
      },
      {
        label: '性别',
        form: Gender.description(genderId),
      },
      {
        label: '个户类型',
        form: HouseholdType.description(householdType),
      },
      {
        label: '常居地',
        form: this.validateData(address),
      },
      {
        label: '负责平台',
        form: this.validateData(platform),
      },
      {
        label: '负责供应商',
        form: this.validateData(supplier),
      },
      {
        label: '负责城市',
        form: this.validateData(city),
      },
      {
        label: '负责商圈',
        form: this.validateData(district),
      },
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    return (
      <CoreContent
        title="个人信息"
      >
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 渲染合同信息
  renderContractInfo = () => {
    const { employeeContractDetail: {
      contract,
      signContractType,
      state,
      signContractDate,
      signContractCycle,
      releaseDate,
      contractUrl,
    } } = this.props;
    const formItems = [
      {
        label: '合同归属',
        form: this.validateData(contract),
      },
      {
        label: '签约类型',
        form: SignContractType.description(signContractType),
      },
      {
        label: '签约状态',
        form: SigningState.description(state),
      },
      {
        label: '签约日期',
        form: this.validateData(signContractDate),
      },
      {
        label: '签约周期',
        form: SignContractCycle.description(signContractCycle),
      },
      {
        label: '解约日期',
        form: this.validateData(releaseDate),
      },
      {
        label: '合同内容',
        form: is.existy(contractUrl) && is.not.empty(contractUrl) ?
        (<a href={contractUrl} target="_blank" rel="noopener noreferrer">查看合同</a>) :
          '--',
      },
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    return (
      <CoreContent title="合同信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  render() {
    return (
      <div>
        { this.renderPersonInfo() }
        { this.renderContractInfo() }
      </div>
    );
  }
}

function mapStateToProps({ employeeContract: { employeeContractDetail } }) {
  return { employeeContractDetail };
}

export default connect(mapStateToProps)(Detail);
