/**
 * 审批流设置，房屋审批流配置页面，审批流，费用分组设置组件 Expense/ExamineFlow/Config
 */
import is from 'is_js';
import dot from 'dot-prop';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

import { DeprecatedCoreForm, CoreContent } from '../../../../../../components/core';

const { Option } = Select;

class ConfigexamleFlow extends Component {

  static propTypes = {
    examineConfig: PropTypes.object, // 审批流，科目设置
    examineFlows: PropTypes.array,   // 审批流列表
  }

  static defaultProps = {
    examineConfig: {},               // 审批流，科目设置
    examineFlows: [],                // 审批流列表
  }

  // 从配置文件中，获取已选的所有科目
  getAccountingsByConfig = () => {
    const { examineConfig } = this.props;
    // 当前已选的所有科目id
    const examineAccountingIds = [];
    Object.keys(examineConfig.accountings).forEach((accounting) => {
      Object.keys(examineConfig.accountings[accounting]).forEach((int) => {
        examineAccountingIds.push(examineConfig.accountings[accounting][int]);
      });
    });
    // console.log('Debug: 已选的所有科目', examineAccountingIds);
    return examineAccountingIds;
  }

  // 从配置文件中，获取已选的所有审批流
  getFlowsByConfig = (excludeKey = '') => {
    const { examineConfig } = this.props;
    // 当前已经选择的审批流：分组数据
    const selectedFlowsData = {};
    Object.keys(examineConfig).forEach((element) => {
      // 不进行数据分组，excludeKey
      if (element === 'accountings' || element === excludeKey) {
        return;
      }

      // 审批流id
      const flowId = examineConfig[element].flow_id;
      // 分组id
      const groupId = examineConfig[element].cost_group_id;

      // 判断审批流和费用分组不等于空
      if (selectedFlowsData[flowId] !== undefined) {
        selectedFlowsData[flowId].push(groupId);
      } else {
        selectedFlowsData[flowId] = [groupId];
      }
    });
    // console.log('Debug: 已经选择的审批流', selectedFlowsData);
    return selectedFlowsData;
  }

  // 从配置文件中，获取已选的所有费用分组
  getCostCatalogByConfig = (flowId, key) => {
    // 获取已经选中的审批流数据
    const selectedFlowsData = this.getFlowsByConfig(key);

    // 获取已选择的审批流下的费用分组
    if (selectedFlowsData[flowId] !== undefined) {
      return selectedFlowsData[flowId].filter(item => item !== '');
    }

    // 没有选中的费用分组
    return [];
  }

  // 获取审批流详情
  getFlowDetailById = (flowId) => {
    const { examineFlows } = this.props;
    // 根据配置文件，获取审批流中的费用分组数据
    let detail;
    examineFlows.forEach((data) => {
      if (data.id === flowId) {
        detail = data;
      }
    });
    return detail;
  }

  // 获取过滤后的费用分组
  getFilteredCostCatalog = (flowId, key) => {
    if (is.empty(flowId)) {
      return [];
    }

    // 当前审批流详情
    const flowDetail = this.getFlowDetailById(flowId);
    if (is.not.existy(flowDetail) || is.empty(flowDetail)) {
      // console.log('Debug: 审批流详情为空，无法获取选择项目');
      return [];
    }

    // 过滤后的费用分组数据
    const filteredCostCatalog = [];
    // 从配置文件中，获取已选的所有科目
    const examineAccountingIds = this.getAccountingsByConfig();
    // 从配置文件中，获取已选的所有审批流
    const examineFlowsData = this.getFlowsByConfig(key);

    // 遍历当前审批流详情中的费用分组
    dot.get(flowDetail, 'costCatalogScopeList', []).forEach((costCatalog) => {
      // 当前费用分组下的科目id
      const { accountingIds } = costCatalog;
      // 判断当前分组包含的科目id和当前已选的所有科目id是否是包含关系
      const accountingFlag = examineAccountingIds.every((accountItem) => {
        return accountingIds.includes(accountItem); // 包含返回true 否则返回false
      });
      // console.log('Debug: 已选的所有科目id', examineAccountingIds);
      // console.log('Debug: 当前分组包含的科目id', accountingIds);
      // console.log('Debug: 包含返回true 否则返回false', accountingFlag);
      // 判断是否时包含关系
      if (accountingFlag === false) {
        // console.log('Debug: 已选的所有科目id 和 当前分组包含的科目id', examineAccountingIds, accountingIds);
        return;
      }

      // 当前费用分组，被选择过
      if (examineFlowsData[flowDetail.id] !== undefined && examineFlowsData[flowDetail.id].indexOf(costCatalog.id) !== -1) {
        // console.log('Debug: 当前费用分组，被选择过的', examineFlowsData[flowDetail.id]);
        return;
      }

      filteredCostCatalog.push(costCatalog);
    });
    return filteredCostCatalog;
  }

  // 渲染审批流后和费用分组
  renderContent = (item, index) => {
    const { examineConfig, examineFlows } = this.props;

    // 名字
    let name = '';
    if (item === 'init') {
      name = '新租／续签';
    }
    if (item === 'period') {
      name = '续租';
    }
    if (item === 'break') {
      name = '断租／退租';
    }

    // 当前项目，选择的的审批流id
    const flowId = examineConfig[item].flow_id;
    // 如果 当前初始的审批流id在审批流列表不存在 就设置 isShowFlowValue = false；
    let isShowFlowValue = false;
    examineFlows.find((i) => {
      if (flowId && i.id === flowId) {
        isShowFlowValue = true;
      }
    });

    // 如果 isShowFlowValue = false 审批流初始值在审批流列表不存在就不显示初始值
    let flowValue = examineConfig[item].flow_id || undefined;
    if (!isShowFlowValue) {
      flowValue = undefined;
    }

    // 根据审批流id，获取过滤后的费用分组数据
    const costCatalogData = this.getFilteredCostCatalog(flowId, item);
    const formItems = [
      {
        label: '审批流名称',
        form: (
          <Select
            placeholder="请选择"
            value={flowValue}
            showSearch
            allowClear
            style={{ width: '100%' }}
            optionFilterProp="children"
            onChange={(arg) => { this.props.onChangeExamine(arg, item); }}
          >
            {
                examineFlows.map((data) => {
                  return <Option key={data.id} value={`${data.id}`} >{data.name}</Option>;
                })
            }
          </Select>
        ),
      },
      {
        label: '费用分组',
        form: (
          <Select
            placeholder="请选择"
            value={examineConfig[item].cost_group_id || undefined}
            showSearch
            allowClear
            style={{ width: '100%' }}
            optionFilterProp="children"
            onChange={arg => this.props.onChangeExpenseType(arg, item, index)}
          >
            {costCatalogData.map((val, key) => {
              return (
                <Option value={val.id} key={key}>
                  {val.name}
                </Option>
              );
            })}
          </Select>
        ),
      },
    ];

    const layout = { labelCol: { span: 5 }, wrapperCol: { span: 19 } };
    return (
      <CoreContent title={name} key={index}>
        <DeprecatedCoreForm items={formItems} cols={2} layout={layout} />
      </CoreContent>
    );
  };

  render = () => {
    const { examineConfig } = this.props;
    const keys = Object.keys(examineConfig).slice(1);
    return (
      <div>
        {
            keys.map((item, index) => {
              // 渲染审批流后和费用分组
              return this.renderContent(item, index);
            })
        }
      </div>
    );
  };
}

export default ConfigexamleFlow;
