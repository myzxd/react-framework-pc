/**
 * 审批流设置，房屋审批流配置页面，科目设置组件 Expense/ExamineFlow/Config
 */
import React, { Component } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';

import { DeprecatedCoreForm, CoreContent } from '../../../../../../components/core';
import { ExpenseCostCenterType } from '../../../../../../application/define';

const { Option } = Select;

class ConfigSubject extends Component {

  static propTypes = {
    accountings: PropTypes.object, // 科目设置
    subjectsData: PropTypes.array, // 科目列表
  }

  static defaultProps = {
    accountings: {},               // 科目设置
    subjectsData: [],              // 科目列表
  }

  // 改变供应商科目
  onChangeSupper = (e, element, type) => {
    this.props.onChangeSupper(e, element, type);
  }

  // 改变平台科目
  onChangePlatform = (e, element, type) => {
    this.props.onChangePlatform(e, element, type);
  }

  // 改变城市科目
  onChangeCity = (e, element, type) => {
    this.props.onChangeCity(e, element, type);
  }

  // 改变商圈科目
  onChangeBizDistrict = (e, element, type) => {
    this.props.onChangeBizDistrict(e, element, type);
  }

  // 渲染科目设置
  renderContent = (element, index) => {
    const { accountings, subjectsData } = this.props;
    let name = '';
    // 押金科目设置
    if (element === 'pledge_accounting_id') {
      name = '押金科目设置';
    }
    // 中介费科目设置
    if (element === 'agent_accounting_id') {
      name = '中介费科目设置';
    }
    // 房租科目设置
    if (element === 'rent_accounting_id') {
      name = '房租科目设置';
    }

    // 押金损失科目设置
    if (element === 'lost_accounting_id') {
      name = '押金损失科目设置';
    }
    // 商圈科目列表
    const subjectBizDistrict = subjectsData.filter((item) => {
      return item.costCenterType === ExpenseCostCenterType.district; // 根据成本中心，渲染对应的科目列表
    });
    // 城市科目列表
    const subjectCity = subjectsData.filter((item) => {
      return item.costCenterType === ExpenseCostCenterType.city; // 根据成本中心，渲染对应的科目列表
    });
    // 供应商科目列表
    const subjectSupper = subjectsData.filter((item) => {
      return item.costCenterType === ExpenseCostCenterType.headquarter; // 根据成本中心，渲染对应的科目列表
    });
    // 平台科目列表
    const subjectPlatform = subjectsData.filter((item) => {
      return item.costCenterType === ExpenseCostCenterType.project;     // 根据成本中心，渲染对应的科目列表
    });
    const formItems = [
      {
        label: '平台成本科目',
        layout: { labelCol: { span: 5 }, wrapperCol: { span: 19 } },
        form: <Select
          placeholder="请选择"
          showSearch
          allowClear
          style={{ width: '100%' }}
          optionFilterProp="children"
          value={accountings[element][ExpenseCostCenterType.project] || undefined}
          onChange={arg => this.onChangePlatform(arg, element, ExpenseCostCenterType.project)}
        >
          {
            subjectPlatform.map((item) => {
              return <Option key={item.id} value={item.id} >{`${item.name}(${item.accountingCode})`}</Option>;
            })
          }
        </Select>,
      },
      {
        label: '供应商成本科目',
        layout: { labelCol: { span: 5 }, wrapperCol: { span: 19 } },
        form: <Select
          placeholder="请选择"
          showSearch
          style={{ width: '100%' }}
          allowClear
          optionFilterProp="children"
          value={accountings[element][ExpenseCostCenterType.headquarter] || undefined}
          onChange={arg => this.onChangeSupper(arg, element, ExpenseCostCenterType.headquarter)}
        >
          {
            subjectSupper.map((item) => {
              return <Option key={item.id} value={item.id} >{`${item.name}(${item.accountingCode})`}</Option>;
            })
          }
        </Select>,
      },
      {
        label: '城市成本科目',
        layout: { labelCol: { span: 5 }, wrapperCol: { span: 19 } },
        form: <Select
          placeholder="请选择"
          showSearch
          allowClear
          style={{ width: '100%' }}
          optionFilterProp="children"
          value={accountings[element][ExpenseCostCenterType.city] || undefined}
          onChange={arg => this.onChangeCity(arg, element, ExpenseCostCenterType.city)}
        >
          {
            subjectCity.map((item) => {
              return <Option key={item.id} value={item.id} >{`${item.name}(${item.accountingCode})`}</Option>;
            })
        }
        </Select>,
      },
      {
        label: '商圈成本科目',
        layout: { labelCol: { span: 5 }, wrapperCol: { span: 19 } },
        form: <Select
          placeholder="请选择"
          style={{ width: '100%' }}
          showSearch
          allowClear
          optionFilterProp="children"
          value={accountings[element][ExpenseCostCenterType.district] || undefined}
          onChange={arg => this.onChangeBizDistrict(arg, element, ExpenseCostCenterType.district)}
        >
          {
            subjectBizDistrict.map((item) => {
              return <Option key={item.id} value={item.id} >{`${item.name}(${item.accountingCode})`}</Option>;
            })
        }
        </Select>,
      },
    ];
    return (
      <CoreContent title={name} key={index}>
        <DeprecatedCoreForm items={formItems} cols={2} />
      </CoreContent>
    );
  }

  render = () => {
    const { accountings } = this.props;
    const accountingsKeys = Object.keys(accountings); // 获取科目key值
    return (
      <div style={{ marginTop: 20 }}>
        {accountingsKeys.map((item, index) => {
          // 渲染科目设置
          return this.renderContent(item, index);
        })}
      </div>
    );
  };
}

export default ConfigSubject;
