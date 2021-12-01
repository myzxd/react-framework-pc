/**
 * 平台，供应商，城市，商圈，分摊金额 & 科目三级联动选择 & 成本中心数据显示
 */
import dot from 'dot-prop';
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, InputNumber, Tooltip, message, Select } from 'antd';

import { DeprecatedCoreForm } from '../../../../components/core';
import {
  CommonSelectSuppliers,
  CommonSelectPlatforms,
  CommonSelectCities,
  CommonSelectDistricts,
  CommonSelectTeamId,
} from '../../../../components/common';
import { Unit, ExpenseCostCenterType, ExpenseTeamType, ExpenseCostOrderBelong, DistrictState } from '../../../../application/define';
import styles from './styles.less';
import moneyIconLight from '../../static/money_light.svg';
import moneyIconGrey from '../../static/money_grey.svg';

import DepartmentJobs from './departmentJobs';
import SelectStaff from './selectStaff';

const { Option } = Select;

// 显示的项目
const CommonItemsType = {
  platformDisable: 'platformDisable',    // 只读模式下的平台
  platform: 'platform',   // 平台
  vendor: 'vendor',       // 供应商
  city: 'city',           // 城市
  district: 'district',   // 商圈
  costCount: 'costCount', // 分单金额
  operatCreate: 'operatCreate', // 添加操作按钮
  operatDelete: 'operatDelete', // 删除操作按钮
};

class CommonItems extends React.Component {
  static propTypes = {
    index: PropTypes.number,
    config: PropTypes.array,
    value: PropTypes.object,
    costCenter: PropTypes.number,
    isUpdateRule: PropTypes.bool,
    isShow: PropTypes.bool,
    costAccountingId: PropTypes.string,
    isEdit: PropTypes.bool,
    unique: PropTypes.string,
    onChange: PropTypes.func,
    onCreate: PropTypes.func,
    onDelete: PropTypes.func,
    isNegative: PropTypes.bool,
    costAttribution: PropTypes.number,
  }

  constructor(props) {
    super(props);
    this.state = {
      teamId: undefined,
    };
  }

  componentDidMount = () => {
    const { isPluginOrder } = this.props;
    // 外部审批单不调金额接口
    if (isPluginOrder !== true) {
      this.fetchCostOrderAmountSummay();
    }
  }

  onChange = (val) => {
    const { index, onChange, isPluginOrder } = this.props;
    onChange && onChange(val, index);
    // 返回的数据，校验配置，是否需要返回字段
    this.setState({ value: val }, () => {
      // 外部审批单不调金额接口
      if (isPluginOrder !== true) {
        this.fetchCostOrderAmountSummay();
      }
    });
  }

  // 创建操作的回调
  onCreate = () => {
    const { onCreate, index } = this.props;
    onCreate && onCreate(index);
  }

  // 删除操作的回调
  onDelete = () => {
    const { onDelete, index } = this.props;
    onDelete && onDelete(index);
  }

  // 平台
  onChangePlatform = (e, options) => {
    const {
      location,
      platform = '',
      costAttribution,
    } = this.props;

    // 处理特殊字符，使用decodeURIComponent解码
    const platformParam = decodeURIComponent(dot.get(location, 'query.platformParam', '')) || decodeURIComponent(platform);

    // 平台存在值的时候在判断
    if (platformParam !== e && e) {
      message.error('选中的平台与审批流范围内平台不一致，请重新选择平台');
    }
    const value = {
      platform: e,
      platformName: dot.get(options, 'props.children', undefined),
    };

    // 如果是个人，需要重置个人选项
    if (costAttribution === ExpenseCostCenterType.person) {
      this.props.dispatch({ type: 'expenseExamineOrder/resetStaffMember' });
    }
    const values = this.getOnChangeValue(value);
    this.onChange(values);
  }

  // 服务商
  onChangeVendor = (e, options) => {
    const { value: defaultValue = {}, costAttribution } = this.props;

    const {
      platform,
      platformName,
    } = defaultValue;

    const value = {
      platform,
      platformName,
      vendor: e,
      vendorName: dot.get(options, 'props.children', undefined),
    };

    // 如果是个人，需要重置个人选项
    if (costAttribution === ExpenseCostCenterType.person) {
      this.props.dispatch({ type: 'expenseExamineOrder/resetStaffMember' });
    }
    const values = this.getOnChangeValue(value);

    this.onChange(values);
  }

  // 城市
  onChangeCity = (e, options) => {
    const { value: defaultValue = {}, costAttribution } = this.props;

    const {
      platform,
      platformName,
      vendor,
      vendorName,
    } = defaultValue;

    const value = {
      platform,
      platformName,
      vendor,
      vendorName,
      city: e,
      cityName: dot.get(options, 'props.children', undefined),
      citySpelling: dot.get(options, 'props.spell', undefined),
    };

    // 如果是个人，需要重置个人选项
    if (costAttribution === ExpenseCostCenterType.person) {
      this.props.dispatch({ type: 'expenseExamineOrder/resetStaffMember' });
    }
    const values = this.getOnChangeValue(value);

    this.onChange(values);
  }

  // 商圈
  onChangeDistrict = (e, options) => {
    const { value: defaultValue = {}, costAttribution } = this.props;
    const {
      platform,
      platformName,
      vendor,
      vendorName,
      city,
      cityName,
      citySpelling,
    } = defaultValue;

    const value = {
      platform,
      platformName,
      vendor,
      vendorName,
      city,
      cityName,
      citySpelling,
      district: e,
      districtName: dot.get(options, 'props.children', undefined),
    };

    // 如果是个人，需要重置个人选项
    if (costAttribution === ExpenseCostCenterType.person) {
      this.props.dispatch({ type: 'expenseExamineOrder/resetStaffMember' });
    }
    const values = this.getOnChangeValue(value);

    this.onChange(values);
  }

  // 分摊金额
  onChangeCostCount = (e) => {
    const { value: defaultValue = {} } = this.props;

    const value = {
      ...defaultValue,
      costCount: e,
    };

    const values = this.getOnChangeValue(value, false);

    this.onChange(values);
  }

  // 修改人员
  onChangeAccount = (val, options) => {
    const { value: defaultValue = {} } = this.props;
    const { profileId, staffName } = options;

    const value = {
      ...defaultValue,
      // staffId: val,
      // staffName,
      // teamStaffId: profileId,
    };
    if (val) {
      value.staffId = val;
    }
    if (staffName) {
      value.staffName = staffName;
    }
    if (profileId) {
      value.teamStaffId = profileId;
    }

    const values = this.getOnChangeValue(value);

    this.onChange(values);
  }

  // 变更团队信息
  onChangeJobs = (val, options) => {
    const { value: defaultValue = {} } = this.props;

    const departmentName = dot.get(options, 'name', undefined);

    const value = {
      ...defaultValue,
      teamName: departmentName,
    };
    if (val) {
      value.teamId = val;
      value.staffId = undefined;
      value.staffName = undefined;
    }
    this.setState({
      teamId: val,
    });
    const values = this.getOnChangeValue(value);

    this.onChange(values);
  }
  // 变更团队信息
  onChangeTeamJob = (val, options) => {
    const { value: defaultValue = {} } = this.props;
    const value = {
      ...defaultValue,
    };
    if (val) {
      value.teamId = val;
    }

    const departmentName = dot.get(options, 'name', undefined);
    const departmentCode = dot.get(options, 'code', undefined);

    if (departmentName) {
      value.departmentTeamName = departmentName;
      value.teamName = departmentName;
    }
    if (departmentCode) {
      value.departmentCode = departmentCode;
      value.teamIdCode = departmentCode;
    }

    const values = this.getOnChangeValue(value);

    this.onChange(values);
  }

  // 团队类型
  onChangeTeamType = (e) => {
    const { value: defaultValue = {} } = this.props;

    const value = {
      ...defaultValue,
      teamType: e,
      teamId: undefined,
      teamName: undefined,
      teamIdCode: undefined,
    };

    const values = this.getOnChangeValue(value);

    this.onChange(values);
  }

  // 团队ID
  onChangeTeamId = (e, options) => {
    const { value: defaultValue = {} } = this.props;
    const name = dot.get(options, 'props.teamname', undefined);
    const teamIdCode = dot.get(options, 'props.teamidcode', undefined);
    const value = {
      ...defaultValue,
      teamId: e,
      teamName: name,
      teamIdCode,
    };

    const values = this.getOnChangeValue(value);

    this.onChange(values);
  }

  // 获取更新的参数
  getOnChangeValue = (value, isCostCountFlag = true) => {
    const checkPlatform = ['elem', 'meituan', 'relian', 'zongbu', 'chengtu', 'haluo', 'mobike', 'chengjing', 'lailai'];

    const { costBelong, costCenter, costAttribution, platform: flowPlatForm } = this.props;
    const isPlatform = checkPlatform.findIndex(item => item === flowPlatForm) > -1;
    const {
      platform = undefined,
      platformName = undefined,
      vendor = undefined,
      vendorName = undefined,
      city = undefined,
      cityName = undefined,
      citySpelling = undefined,
      costCount = undefined,
      district = undefined,
      districtName = undefined,
      teamType = undefined,
      teamId = undefined,
      teamName = undefined,
      teamIdCode = undefined,
      teamStaffId = undefined,
      staffName = undefined,
      staffId = undefined,
      departmentName = undefined,    // 团队名称
      // teamId = undefined,        // 团队类型为部门时部门id
      departmentTeamName = undefined,   // 团队类型为部门时部门名称
      departmentCode = undefined,       // 团队类型为部门时，部门code
    } = value;

    let values = {
      platform,
      isCostCountFlag,
    };

    // 平台, 车辆直接成本，车辆间接成本 @李彩燕
    if (costCenter === ExpenseCostCenterType.project ||
      costCenter === ExpenseCostCenterType.vehicleDirectly ||
      costCenter === ExpenseCostCenterType.vehicleIndirect) {
      values = {
        platform,
        platformName,
        isCostCountFlag,
      };
    }

    // 供应商
    if (costCenter === ExpenseCostCenterType.headquarter) {
      values = {
        platform,
        platformName,
        vendor,
        vendorName,
        isCostCountFlag,
      };
    }

    // 城市
    if (costCenter === ExpenseCostCenterType.city) {
      values = {
        platform,
        platformName,
        vendor,
        vendorName,
        city,
        cityName,
        citySpelling,
        isCostCountFlag,
      };
    }

    // 商圈
    if (costCenter === ExpenseCostCenterType.district
      || costCenter === ExpenseCostCenterType.knight
      || costAttribution === ExpenseCostCenterType.asset
    ) {
      values = {
        platform,
        platformName,
        vendor,
        vendorName,
        city,
        cityName,
        citySpelling,
        district,
        districtName,
        isCostCountFlag,
      };
    }

    // 总部
    if (costCenter === ExpenseCostCenterType.headquarters) {
      values = {};
    }

    // 个人
    if (costAttribution === ExpenseCostCenterType.person && isPlatform) {
      values = {
        ...values,
        teamId,
        staffId,
        staffName,
        teamStaffId,
        teamName,
        departmentName,
      };
    }

    // 团队
    if (costAttribution === ExpenseCostCenterType.team && isPlatform) {
      values = {
        ...values,
        teamType,
        teamId,
        teamName,
        teamIdCode,
        teamStaffId,
        departmentTeamName,
        departmentCode,
      };
    }

    if (Number(costBelong) === ExpenseCostOrderBelong.custom) {
      values = {
        ...values,
        costCount,
        isCostCountFlag,
      };
    }

    return values;
  }

  // get costTargetId by cost center
  getCostTargetId = () => {
    const {
      costCenter,
      value,
      costAttribution,
    } = this.props;

    const {
      platform,
      vendor,
      city,
      district,
      staffId,
      teamId,
    } = value;

    if (costAttribution === ExpenseCostCenterType.person) return staffId;
    if (costAttribution === ExpenseCostCenterType.team) return teamId;
    if (costAttribution === ExpenseCostCenterType.asset) return district;
    if (costCenter === ExpenseCostCenterType.project) return platform;
    if (costCenter === ExpenseCostCenterType.headquarter) return vendor;
    if (costCenter === ExpenseCostCenterType.city) return city;
    if (costCenter === ExpenseCostCenterType.district) return district;
    if (costCenter === ExpenseCostCenterType.knight) return district;
  }

  // get cost order amount summary
  fetchCostOrderAmountSummay = () => {
    const {
      costAccountingId,
      costCenter,
      costAttribution,
      value,
    } = this.props;

    // 科目成本中心为总部，不调用接口
    if (costCenter === ExpenseCostCenterType.headquarters) return;

    const {
      platform,
      vendor,
      city,
      district,
      teamId,
      staffId,
      teamIdCode,
    } = value;

    const costTargetId = this.getCostTargetId();
    const applicationOrderId = dot.get(this.props, 'location.query.orderId', undefined);
    const payload = {
      costTargetId,
      costCenter: costAttribution || costCenter,
      applicationOrderId,
      subjectId: costAccountingId,
    };

    // 定义提报金额参数
    const params = {
      costCenter: costAttribution || costCenter,
      applicationOrderId,
      accountingId: costAccountingId,   // 科目
      costTargetId,                     // 成本归属id
      platformCode: platform || this.props.platform, // 平台
      supplierId: vendor,               // 供应商
      cityCode: city,                   // 城市
      bizDistrictId: district,          // 商圈
      teamId,
      staffId,
      teamIdCode,
    };
    this.props.dispatch({ type: 'expenseCostOrder/fetchAmountSummary', payload });
    // 获取提报金额
    this.props.dispatch({ type: 'expenseCostOrder/fetchSubmitSummary', payload: params });
  }

  // 渲染金额
  renderMoney = (costOrderAmountSummary, costOrderSubmitMoney, tooltipText) => {
    const { costAttribution } = this.props;

    // 是否为资产
    const isAsset = costAttribution === ExpenseCostCenterType.asset;

    // 定义月汇总单付款总金额
    const totalMoney = costOrderAmountSummary && costOrderAmountSummary > 0 ? costOrderAmountSummary : 0;
    // 定义月汇总单付款总金额
    const submitMoney = costOrderSubmitMoney && costOrderSubmitMoney > 0 ? costOrderSubmitMoney : 0;
    // 定义金额图标显示
    const src = totalMoney !== 0 || submitMoney !== 0 ? moneyIconLight : moneyIconGrey;
    // 定义金额图标样式
    const className = totalMoney !== 0 || submitMoney !== 0 ? styles['app-comp-expense-manage-common-moneyiconlight'] : styles['app-comp-expense-manage-common-moneyicongrey'];
    return ({
      layout: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
      offset: 1,
      span: isAsset ? 2 : 1,
      label: '',
      form: (
        <Tooltip title={tooltipText}>
          <div className={styles['app-comp-expense-manage-common-moneywrap']}>
            <img src={src} alt="" className={className} />
            <span className={submitMoney !== 0 ? styles['app-comp-expense-manage-common-moneytextlight'] : null}>¥{Unit.exchangePriceCentToMathFormat(submitMoney)}</span>
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            <span className={totalMoney !== 0 ? styles['app-comp-expense-manage-common-moneytextlight'] : null}>¥{Unit.exchangePriceCentToMathFormat(totalMoney)}</span>
          </div>
        </Tooltip>
      ) }
    );
  }

  // 渲染子项目信息（表单）
  renderForm = (tooltipText, totalMoney, submitMoney) => {
    const {
      config,
      index,
      isNegative,
      isShow,
      unique,
      value,
      costAttribution,
      isUpdateRule,
      teamTypeList,
      costCenter,
    } = this.props;
    // 是否为资产
    const isAsset = costAttribution === ExpenseCostCenterType.asset;

    const isExpenseModel = true;
    const city = value.city;

    // 平台
    const platformForm = {
      label: '平台',
      span: isAsset ? 4 : 3,
      layout: { labelCol: { span: 4, offset: 6 }, wrapperCol: { span: 16 } },
      form: (
        <CommonSelectPlatforms
          style={{ width: '100%' }}
          namespace={`platform-${index}-${unique}`}
          value={value.platform}
          allowClear
          showSearch
          optionFilterProp="children"
          placeholder="请选择平台"
          onChange={this.onChangePlatform}
          disabled={isShow}
        />
      ),
    };

    // 禁用平台
    const platformFormDisabled = {
      label: '平台',
      span: isAsset ? 4 : 3,
      form: (
        <CommonSelectPlatforms
          style={{ width: '100%' }}
          namespace={`platform-${index}-${unique}`}
          value={value.platform}
          allowClear
          showSearch
          optionFilterProp="children"
          placeholder="请选择平台"
          onChange={this.onChangePlatform}
          disabled
        />
      ),
    };

    // 供应商
    const supplierForm = {
      label: '供应商',
      span: isAsset ? 4 : 3,
      layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
      form: (
        <CommonSelectSuppliers
          style={{ width: '100%' }}
          namespace={`supplier-${index}-${unique}`}
          value={value.vendor}
          platforms={value.platform}
          allowClear
          showSearch
          optionFilterProp="children"
          placeholder="请选择供应商"
          onChange={this.onChangeVendor}
          disabled={isShow}
        />
      ),
    };

    // 城市
    const cityForm = {
      label: '城市',
      span: isAsset ? 4 : 3,
      form: (
        <CommonSelectCities
          style={{ width: '100%' }}
          namespace={`city-${index}-${unique}`}
          value={city ? `${city}` : undefined}
          allowClear
          showSearch
          isExpenseModel={isExpenseModel}
          optionFilterProp="children"
          placeholder="请选择城市"
          platforms={value.platform}
          suppliers={value.vendor}
          onChange={this.onChangeCity}
          disabled={isUpdateRule}
        />
      ),
    };

    // 商圈
    const districtForm = {
      label: '商圈',
      layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
      span: isAsset ? 4 : 3,
      form: (
        <CommonSelectDistricts
          className={styles['app-comp-expense-manage-common-district']}
          namespace={`district-${index}-${unique}`}
          value={value.district}
          state={[DistrictState.enable, DistrictState.preparation, DistrictState.waitClose]}
          allowClear
          showSearch
          optionFilterProp="children"
          placeholder="请选择商圈"
          platforms={value.platform}
          suppliers={value.vendor}
          cities={value.citySpelling} // fix city_code,传入商圈接口为原来的city_spell
          onChange={this.onChangeDistrict}
          disabled={isUpdateRule}
        />
      ),
    };

    // 渲染汇总金额
    const summaryMonryForm = this.renderMoney(totalMoney, submitMoney, tooltipText);

    // 科目成本归属为总部时，不显示汇总金额
    const formItems = costCenter === ExpenseCostCenterType.headquarters ? [] : [summaryMonryForm];

    const apportionMoneyForm = {
      label: '分摊金额(元)',
      span: isAsset ? 3 : 2,
      layout: { labelCol: { span: 12 }, wrapperCol: { span: 12 } },
      form: <InputNumber
        min={isNegative ? null : 0}
        value={value.costCount || 0}
        step={0.01}
        formatter={Unit.limitDecimals}
        parser={Unit.limitDecimals}
        onChange={this.onChangeCostCount}
      />,
    };

    // 团队类型
    const teamTypeForm = {
      label: '团队类型',
      span: 3,
      form: (
        <Select
          value={value.teamType}
          placeholder="请选择团队类型"
          onChange={this.onChangeTeamType}
        >
          {
            teamTypeList.map((item) => {
              return (
                <Option key={`${item}`} value={item}>{ExpenseTeamType.description(item)}</Option>
              );
            })
          }
        </Select>
      ),
    };
    // 团队id
    const teamIdForm = {
      label: '团队',
      span: 5,
      form: (
        <CommonSelectTeamId
          namespace={`teamId-${index}-${unique}`}
          value={value.teamId}
          onChange={this.onChangeTeamId}
          allowClear
          showSearch
          optionFilterProp="children"
          placeholder="请选择团队"
          teamType={value.teamType}
          platform={value.platform}
          vendor={value.vendor}
          city={value.city}
          district={value.district}
        />
      ),
    };

    // 人员信息
    const membersForm = {
      label: '人员信息',
      span: 4,
      form: (
        <SelectStaff
          value={value.staffId}
          id={value.teamId}
          onChange={this.onChangeAccount}
          disabled={isUpdateRule}
        />
      ),
    };
    // 团队信息
    const departmentJobs = {
      label: '团队信息',
      span: 4,
      form: (
        <DepartmentJobs
          namespace={`team-${index}-${unique}`}
          value={value.teamId}
          onChange={this.onChangeJobs}
          isAuthorized
          disabled={isUpdateRule}
        />
      ),
    };
    // 团队（团队类型为部门情况下）
    const departmentTeam = {
      label: '团队',
      span: 4,
      form: (
        <DepartmentJobs
          namespace={`team-${index}-${unique}`}
          value={value.teamId}
          onChange={this.onChangeTeamJob}
          disabled={isUpdateRule}
          isAuthorized
          type={value.teamType}
        />
      ),
    };


    // 判断设置选项，显示参数
    if (config.indexOf(CommonItemsType.platform) !== -1) {
      formItems.push(platformForm);
    }

    // 只读模式的平台
    if (config.indexOf(CommonItemsType.platformDisable) !== -1) {
      formItems.push(platformFormDisabled);
    }

    // 判断设置选项，显示参数
    if (config.indexOf(CommonItemsType.vendor) !== -1) {
      formItems.push(supplierForm);
    }

    // 判断设置选项，显示参数
    if (config.indexOf(CommonItemsType.city) !== -1) {
      formItems.push(cityForm);
    }

    // 判断设置选项，显示参数
    if (config.indexOf(CommonItemsType.district) !== -1) {
      formItems.push(districtForm);
    }

    // 团队
    if (Number(costAttribution) === ExpenseCostCenterType.team) {
      // 科目成本归属为总部时，不选择团队类型
      costCenter !== ExpenseCostCenterType.headquarters && (formItems.push(teamTypeForm));
      if (
        value.teamType === ExpenseTeamType.departmentOwner
      ) {
        formItems.push(teamIdForm);
      } else {
        formItems.push(departmentTeam);
      }
    }

    // 个人
    if (Number(costAttribution) === ExpenseCostCenterType.person) {
      formItems.push(departmentJobs);
      formItems.push(membersForm);
    }

    // 判断设置选项，显示参数
    if (config.indexOf(CommonItemsType.costCount) !== -1) {
      formItems.push(apportionMoneyForm);
    }

    return formItems;
  }

  // 渲染子项目信息
  renderDetail = (tooltipText, costOrderAmountSummary, costOrderSubmitMoney) => {
    const {
      config,
      costAttribution,
      value,
      isNegative,
      teamTypeList,
      index,
      unique,
      costCenter,
    } = this.props;

    const teamTypeForm = {
      label: '团队类型',
      span: 3,
      form: (
        <Select
          value={value.teamType}
          placeholder="请选择团队类型"
          onChange={this.onChangeTeamType}
        >
          {
            teamTypeList.map((item) => {
              return (
                <Option key={`${item}`} value={item}>{ExpenseTeamType.description(item)}</Option>
              );
            })
          }
        </Select>
      ),
    };

    // 团队  选部门
    const departmentTeam = {
      label: '团队',
      span: 4,
      form: (
        <DepartmentJobs
          value={value.teamId}
          onChange={this.onChangeTeamJob}
          // disabled={isUpdateRule}
          type={value.teamType}
        />
      ),
    };
    // 团队id
    const teamIdForm = {
      label: '团队',
      span: 4,
      form: (
        <CommonSelectTeamId
          namespace={`teamId-${index}-${unique}`}
          value={value.teamId}
          onChange={this.onChangeTeamId}
          allowClear
          showSearch
          optionFilterProp="children"
          placeholder="请选择团队"
          teamType={value.teamType}
          platform={value.platform}
          vendor={value.vendor}
          city={value.city}
          district={value.district}
        />
      ),
    };

    const isAsset = costAttribution === ExpenseCostCenterType.asset;

    const summaryMonryForm = this.renderMoney(costOrderAmountSummary, costOrderSubmitMoney, tooltipText);
    // 科目成本归属为总部时，不显示汇总金额
    const formItems = costCenter === ExpenseCostCenterType.headquarters ? [] : [summaryMonryForm];

    if (config.indexOf(CommonItemsType.platform) !== -1) {
      formItems.push(
        {
          label: '平台',
          span: isAsset ? 4 : 3,
          form: (<span>{value.platformName}</span>),
        },
      );
    }
    if (config.indexOf(CommonItemsType.platformDisable) !== -1) {
      formItems.push(
        {
          label: '平台',
          span: isAsset ? 4 : 3,
          form: (<span>{value.platformName}</span>),
        },
      );
    }
    if (config.indexOf(CommonItemsType.vendor) !== -1) {
      formItems.push(
        {
          label: '供应商',
          span: isAsset ? 4 : 3,
          layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
          form: (<span>{value.vendorName}</span>),
        },
      );
    }
    if (config.indexOf(CommonItemsType.city) !== -1) {
      formItems.push(
        {
          label: '城市',
          span: isAsset ? 4 : 3,
          form: (<span>{value.cityName}</span>),
        },
      );
    }
    if (config.indexOf(CommonItemsType.district) !== -1) {
      formItems.push(
        {
          label: '商圈',
          span: isAsset ? 4 : 3,
          layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
          form: (<span>{value.districtName}</span>),
        },
      );
    }
    // 团队
    if (Number(costAttribution) === ExpenseCostCenterType.team) {
      if (value.teamType && costCenter !== ExpenseCostCenterType.headquarters) {
        formItems.push(
          {
            label: '团队类型',
            span: 3,
            form: (<span>{ExpenseTeamType.description(Number(value.teamType))}</span>),
          },
        );
        if (value.teamId) {
          formItems.push(
            {
              label: '团队',
              span: 4,
              form: (<span>{value.teamName} - {value.teamId}</span>),
            },
          );
        } else {
          if (
            value.teamType === ExpenseTeamType.departmentCoach
            || value.teamType === ExpenseTeamType.departmentCoachTeam
            || value.teamType === ExpenseTeamType.departmentSub
            || value.teamType === ExpenseTeamType.departmentBusiness
          ) {
            formItems.push(departmentTeam);
          }
          if (
            value.teamType === ExpenseTeamType.departmentOwner
          ) {
            formItems.push(teamIdForm);
          }
        }
      } else if (costCenter !== ExpenseCostCenterType.headquarters) {
        formItems.push(teamTypeForm);
      }

      // 科目成本中心为总部
      if (costCenter === ExpenseCostCenterType.headquarters) {
        formItems[formItems.length] = {
          label: '团队',
          span: 4,
          form: (<span>{value.teamName} - {value.teamId}</span>),
        };
      }
    }

    // 个人
    if (Number(costAttribution) === ExpenseCostCenterType.person) {
      formItems.push(
        {
          label: '团队信息',
          span: 3,
          form: (<span>{`${value.teamName}`}</span>),
        },
      );
      formItems.push(
        {
          label: '人员信息',
          span: 3,
          form: (<span>{`${value.staffName}`}</span>),
        },
      );
    }
    // 判断设置选项，显示参数
    if (config.indexOf(CommonItemsType.costCount) !== -1) {
      let momey = 0;
      if (value.costCount) {
        momey = value.costCount;
      }
      formItems.push({
        label: '分摊金额(元)',
        span: isAsset ? 3 : 3,
        layout: { labelCol: { span: 12 }, wrapperCol: { span: 12 } },
        form: <InputNumber
          value={momey}
          step={0.01}
          min={isNegative ? null : 0}
          formatter={Unit.limitDecimals}
          parser={Unit.limitDecimals}
          onChange={this.onChangeCostCount}
        />,
      });
    }
    return formItems;
  }

  render() {
    const {
      costAccountingId,
      config,
      isUpdateRule,
      isEdit,
      costOrderAmountSummary,
      costOrderSubmitSummary,
      examineOrderDetail,
      costAttribution,
      value = {},
    } = this.props;
    const {
      vendor,
      city,
      district,
    } = value;

    const firstCreatedTime = dot.get(examineOrderDetail, 'submitAt', undefined);

    let bookMonth = '';
    let submitAt = '';

    // 判断提报时间是否有值
    if (firstCreatedTime) {
      bookMonth = moment(firstCreatedTime).format('YYYYMM');
      submitAt = moment(firstCreatedTime).format('YYYY-MM-DD');
    } else {
      bookMonth = moment().format('YYYYMM');
      submitAt = moment().format('YYYY-MM-DD');
    }

    // 定义文字提示内容
    const tooltipText = `${moment(bookMonth, 'YYYYMM').format('YYYY年MM月费用合计（元）: 已提报 | 已付款 ')}`;

    const costTargetId = this.getCostTargetId();

    // 月汇总已付款命名空间
    const namespace = `${costAccountingId}-${costTargetId}-${bookMonth}`;
    // 月汇总已提报命名空间
    const submitnamespace = `${costAccountingId}-${costTargetId}-${submitAt}-${district}-${city}-${vendor}`;
    const totalMoney = dot.get(costOrderAmountSummary, `${namespace}.money`, 0);
    // 定义提报金额
    const submitMoney = dot.get(costOrderSubmitSummary, `${submitnamespace}.amountMoney`, 0);

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    let formItems = [];

    // 判断，如果可编辑，则表单显示
    if (isEdit) {
      formItems = this.renderForm(tooltipText, totalMoney, submitMoney);
    }

    // 如果不可编辑，则文本显示
    if (!isEdit) {
      formItems = this.renderDetail(tooltipText, totalMoney, submitMoney);
    }
    // 操作按钮
    if (config.indexOf(CommonItemsType.operatCreate) !== -1 && config.indexOf(CommonItemsType.operatDelete) !== -1 && isUpdateRule !== true) {
      formItems.push({
        span: 2,
        form: (
          <div>
            <Button onClick={this.onCreate} shape="circle" icon={<PlusOutlined />} />
            <Button className="app-global-mgl8" onClick={this.onDelete} shape="circle" icon={<MinusOutlined />} />
          </div>
        ),
      });
    } else if (config.indexOf(CommonItemsType.operatCreate) !== -1 && isUpdateRule !== true) {
      formItems.push({
        span: 2,
        form: (
          <div>
            <Button onClick={this.onCreate} shape="circle" icon={<PlusOutlined />} />
          </div>
        ),
      });
    } else if (config.indexOf(CommonItemsType.operatDelete) !== -1 && isUpdateRule !== true) {
      formItems.push({
        span: 2,
        form: (
          <div>
            <Button onClick={this.onDelete} shape="circle" icon={<MinusOutlined />} />
          </div>
        ),
      });
    }

    if (formItems.length === 0) return null;

    const className = Number(costAttribution) === ExpenseCostCenterType.asset ? styles['app-comp-expense-manage-common-item'] : styles['app-comp-expense-manage-cost-item'];
    return (
      <div>
        <DeprecatedCoreForm items={formItems} layout={layout} className={className} />
      </div>
    );
  }
}
CommonItems.CommonItemsType = CommonItemsType;
function mapStateToProps({ expenseCostOrder: { costOrderAmountSummary, costOrderSubmitSummary }, expenseExamineOrder: { examineOrderDetail } }) {
  return { costOrderAmountSummary, costOrderSubmitSummary, examineOrderDetail };
}
export default withRouter(connect(mapStateToProps)(CommonItems));
