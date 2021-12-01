/**
 * 平台，供应商，城市，商圈，分摊金额 & 科目三级联动选择 & 成本中心数据显示
 */
import dot from 'dot-prop';
import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { withRouter } from 'dva/router';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, InputNumber, Tooltip, message } from 'antd';

import { DeprecatedCoreForm } from '../../../../components/core';
import { CommonSelectSuppliers, CommonSelectPlatforms, CommonSelectCities, CommonSelectDistricts } from '../../../../components/common';
import { Unit, ExpenseCostCenterType } from '../../../../application/define';
import styles from './styles.less';
import moneyIconLight from '../../static/money_light.svg';
import moneyIconGrey from '../../static/money_grey.svg';

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

const voidFunc = () => {};

class CommonItems extends React.Component {

  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,   // 回调事件, 数据变化
    onCreate: PropTypes.func,   // 回调事件, 创建按钮
    onDelete: PropTypes.func,   // 回调事件, 删除按钮
    isNegative: PropTypes.bool, // 分摊金额是否可以为负数
  }

  static defaultProps = {
    value: {},
    onChange: voidFunc,
    onCreate: voidFunc,
    onDelete: voidFunc,
    isNegative: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      costCountFlag: true, // 是否修改了分摊金额 - 取反
    };
  }

  componentDidMount = () => {
    this.fetchCostOrderAmountSummay();
  }

  componentDidUpdate(prevProps) {
    // 判断，如果配置文件变更，则数据重置
    if (dot.get(prevProps, 'value.config', []).length !== dot.get(this.props, 'value.config', []).length) {
      this.onChange(this.props.value);
    }
  }

  onChange = ({ platform, vendor, city, district, costCount, platformName, vendorName, cityName, districtName, citySpelling, costCountFlag }) => {
    const { value, onChange } = this.props;
    const config = dot.get(value, 'config', []);
    const state = {
      platform,
      vendor,
      city,
      district,
      costCount,
      platformName,
      vendorName,
      cityName,
      districtName,
      cities: citySpelling,
    };
    this.setState(state, () => {
      this.fetchCostOrderAmountSummay();
    });

    // 返回的数据，校验配置，是否需要返回字段
    const values = {};
    // 平台
    if (config.indexOf(CommonItemsType.platform) !== -1 || config.indexOf(CommonItemsType.platformDisable) !== -1) {
      values.platform = platform;
      values.platformName = platformName;
    }
    // 供应商
    if (config.indexOf(CommonItemsType.vendor) !== -1) {
      values.vendor = vendor;
      values.vendorName = vendorName;
    }
    // 城市
    if (config.indexOf(CommonItemsType.city) !== -1) {
      values.city = city;
      values.cityName = cityName;
      values.citySpelling = citySpelling;
    }
    // 商圈
    if (config.indexOf(CommonItemsType.district) !== -1) {
      values.district = district;
      values.districtName = districtName;
    }
    // 分单金额
    if (config.indexOf(CommonItemsType.costCount) !== -1) {
      values.costCount = costCount;
    }
    // 是否修改了分摊金额 - 取反
    values.costCountFlag = costCountFlag;
    if (onChange) {
      onChange(value.key, values);
    }
  }

  // 创建操作的回调
  onCreate = () => {
    const { onCreate, value } = this.props;
    if (onCreate) {
      onCreate(value.key);
    }
  }

  // 删除操作的回调
  onDelete = () => {
    const { onDelete, value } = this.props;
    if (onDelete) {
      onDelete(value.key);
    }
  }

  // 平台
  onChangePlatform = (e, options) => {
    const { value } = this.props;
    const platformName = options ? options.props ? options.props.children : undefined : undefined;
    const {
      location,
      platformParam: platform = [],
    } = this.props;

    // 路由参数 || props中获取
    const platformParam = location.query.platformParam || platform[0];

    // 平台存在值的时候在判断
    if (platformParam !== e && e) {
      message.error('选中的平台与审批流范围内平台不一致，请重新选择平台');
    }
    this.onChange({
      platform: e,
      vendor: undefined,
      city: undefined,
      district: undefined,
      costCount: value.costCount,
      platformName,
      vendorName: undefined,
      cityName: undefined,
      districtName: undefined,
      citySpelling: undefined,
      costCountFlag: true, // 是否修改了分摊金额 - 取反
    });
  }

  // 服务商
  onChangeVendor = (e, options) => {
    const { value } = this.props;
    const vendorName = options ? options.props ? options.props.children : undefined : undefined;

    this.onChange({
      platform: value.platform,
      vendor: e,
      city: undefined,
      district: undefined,
      costCount: value.costCount,
      vendorName,
      platformName: value.platformName,
      cityName: undefined,
      districtName: undefined,
      citySpelling: undefined,
      costCountFlag: true, // 是否修改了分摊金额 - 取反
    });
  }

  // 城市
  onChangeCity = (e, options) => {
    const { value } = this.props;
    const cityName = options ? options.props ? options.props.children : undefined : undefined;

    // 费用模块fix city_code，需要传入商圈接口为原来的city_spell
    const cities = dot.get(options, 'props.spell', '');

    this.onChange({
      platform: value.platform,
      vendor: value.vendor,
      city: e,
      district: undefined,
      costCount: value.costCount,
      platformName: value.platformName,
      vendorName: value.vendorName,
      cityName,
      districtName: undefined,
      citySpelling: cities,
      costCountFlag: true, // 是否修改了分摊金额 - 取反
    });
  }

  // 商圈
  onChangeDistrict = (e, options) => {
    const { value } = this.props;
    const districtName = options ? options.props ? options.props.children : undefined : undefined;
    this.onChange({
      platform: value.platform,
      vendor: value.vendor,
      city: value.city,
      district: e,
      costCount: value.costCount,
      platformName: value.platformName,
      vendorName: value.vendorName,
      cityName: value.cityName,
      districtName,
      citySpelling: value.citySpelling,
      costCountFlag: true, // 是否修改了分摊金额 - 取反
    });
  }

  // 分摊金额
  onChangeCostCount = (e) => {
    const { value } = this.props;
    this.onChange({
      platform: value.platform,
      vendor: value.vendor,
      city: value.city,
      district: value.district,
      costCount: e,
      platformName: value.platformName,
      vendorName: value.vendorName,
      cityName: value.cityName,
      districtName: value.districtName,
      citySpelling: value.citySpelling,
      costCountFlag: false, // 是否修改了分摊金额 - 取反
    });
  }

  // get costTargetId by cost center
  getCostTargetId = () => {
    const { value } = this.props;
    if (value.costCenter === ExpenseCostCenterType.project) return value.platform;
    if (value.costCenter === ExpenseCostCenterType.headquarter) return value.vendor;
    if (value.costCenter === ExpenseCostCenterType.city) return value.city;
    if (value.costCenter === ExpenseCostCenterType.district) return value.district;
    if (value.costCenter === ExpenseCostCenterType.knight) return value.district;
  }

  // get cost order amount summary
  fetchCostOrderAmountSummay = () => {
    const { value } = this.props;
    const costTargetId = this.getCostTargetId();
    const applicationOrderId = dot.get(this.props, 'location.query.orderId', undefined);
    const payload = { costTargetId, costCenter: value.costCenter, applicationOrderId, subjectId: value.CostAccountingId };

    // 定义提报金额参数
    const params = {
      costCenter: value.costCenter,
      applicationOrderId,
      accountingId: value.CostAccountingId,   // 科目
      costTargetId,                     // 成本归属id
      platformCode: value.platform,           // 平台
      supplierId: value.vendor,               // 供应商
      cityCode: value.city,                   // 城市
      bizDistrictId: value.district,          // 商圈
    };
    this.props.dispatch({ type: 'expenseCostOrder/fetchAmountSummary', payload });
    // 获取提报金额
    this.props.dispatch({ type: 'expenseCostOrder/fetchSubmitSummary', payload: params });
  }

  // 渲染金额
  renderMoney = (costOrderAmountSummary, constOrderSubmintMoney, tooltipText) => {
    // 定义月汇总单付款总金额
    const totalMoney = costOrderAmountSummary && costOrderAmountSummary > 0 ? costOrderAmountSummary : 0;
    // 定义月汇总单付款总金额
    const submitMoney = constOrderSubmintMoney && constOrderSubmintMoney > 0 ? constOrderSubmintMoney : 0;
    // 定义金额图标显示
    const src = totalMoney !== 0 || submitMoney !== 0 ? moneyIconLight : moneyIconGrey;
    // 定义金额图标样式
    const className = totalMoney !== 0 || submitMoney !== 0 ? styles['app-comp-expense-manage-common-moneyiconlight'] : styles['app-comp-expense-manage-common-moneyicongrey'];
    return ({
      layout: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
      offset: 1,
      span: 2,
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
  renderForm = (config, formItems, data, key, costOrderAmountSummary, tooltipText, constOrderSubmintMoney, isNegative) => {
    const { value: formValue } = this.props;
    const isExpenseModel = true;
    const city = data.city;
    // 渲染汇总金额
    formItems.push(this.renderMoney(costOrderAmountSummary, constOrderSubmintMoney, tooltipText));
    // 判断设置选项，显示参数
    if (config.indexOf(CommonItemsType.platform) !== -1) {
      const namespace = `platform-${key}-${formValue.unique}`;
      formItems.push({
        label: '平台',
        span: 4,
        form: (
          <CommonSelectPlatforms
            style={{ width: '100%' }}
            namespace={namespace}
            value={data.platform}
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择平台"
            onChange={this.onChangePlatform}
            disabled={formValue.isShow}
          />
        ),
      });
    }

    // 只读模式的平台
    if (config.indexOf(CommonItemsType.platformDisable) !== -1) {
      const namespace = `platform-${key}-${formValue.unique}`;
      formItems.push({
        label: '平台',
        span: 4,
        form: (
          <CommonSelectPlatforms
            style={{ width: '100%' }}
            namespace={namespace}
            value={data.platform}
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择平台"
            onChange={this.onChangePlatform}
            disabled
          />
        ),
      });
    }

    // 判断设置选项，显示参数
    if (config.indexOf(CommonItemsType.vendor) !== -1) {
      const namespace = `supplier-${key}-${formValue.unique}`;
      formItems.push({
        label: '供应商',
        span: 4,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
        form: (
          <CommonSelectSuppliers
            style={{ width: '100%' }}
            namespace={namespace}
            value={data.vendor}
            platforms={data.platform}
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择供应商"
            onChange={this.onChangeVendor}
            disabled={formValue.isShow}
          />
        ),
      });
    }

    // 判断设置选项，显示参数
    if (config.indexOf(CommonItemsType.city) !== -1) {
      const namespace = `city-${key}-${formValue.unique}`;
      formItems.push({
        label: '城市',
        span: 4,
        form: (
          <CommonSelectCities
            style={{ width: '100%' }}
            namespace={namespace}
            value={city ? `${city}` : undefined}
            allowClear
            showSearch
            isExpenseModel={isExpenseModel}
            optionFilterProp="children"
            placeholder="请选择城市"
            platforms={data.platform}
            suppliers={data.vendor}
            onChange={this.onChangeCity}
            disabled={data.isUpdateRule}
          />
        ),
      });
    }

    // 判断设置选项，显示参数
    if (config.indexOf(CommonItemsType.district) !== -1) {
      const namespace = `district-${key}-${formValue.unique}`;
      formItems.push({
        label: '商圈',
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
        span: 4,
        form: (
          <CommonSelectDistricts
            className={styles['app-comp-expense-manage-common-district']}
            namespace={namespace}
            value={data.district}
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择商圈"
            platforms={data.platform}
            suppliers={data.vendor}
            cities={formValue.citySpelling}                       // fix city_code,传入商圈接口为原来的city_spell
            onChange={this.onChangeDistrict}
            disabled={data.isUpdateRule}
          />
        ),
      });
    }

    // 判断设置选项，显示参数
    if (config.indexOf(CommonItemsType.costCount) !== -1) {
      let value = 0;
      if (data.costCount) {
        value = data.costCount;
      }
      if (isNegative) {
        formItems.push({
          label: '分摊金额(元)',
          span: 3,
          layout: { labelCol: { span: 12 }, wrapperCol: { span: 12 } },
          form: <InputNumber
            value={value}
            step={0.01}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
            onChange={this.onChangeCostCount}
          />,
        });
      } else {
        formItems.push({
          label: '分摊金额(元)',
          span: 3,
          layout: { labelCol: { span: 12 }, wrapperCol: { span: 12 } },
          form: <InputNumber
            min={0}
            value={value}
            step={0.01}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
            onChange={this.onChangeCostCount}
          />,
        });
      }
    }
  }

  // 渲染子项目信息
  renderDetail = (config, data, item, formItems, costOrderAmountSummary, tooltipText, constOrderSubmintMoney, isNegative) => {
    // 渲染汇总金额
    formItems.push(this.renderMoney(costOrderAmountSummary, constOrderSubmintMoney, tooltipText));
    if (config.indexOf(CommonItemsType.platform) !== -1) {
      formItems.push(
        {
          label: '平台',
          span: 4,
          form: (<span>{item.platformName}</span>),
        },
      );
    }
    if (config.indexOf(CommonItemsType.platformDisable) !== -1) {
      formItems.push(
        {
          label: '平台',
          span: 4,
          form: (<span>{item.platformName}</span>),
        },
      );
    }
    if (config.indexOf(CommonItemsType.vendor) !== -1) {
      formItems.push(
        {
          label: '供应商',
          span: 4,
          form: (<span>{item.vendorName}</span>),
        },
      );
    }
    if (config.indexOf(CommonItemsType.city) !== -1) {
      formItems.push(
        {
          label: '城市',
          span: 4,
          form: (<span>{item.cityName}</span>),
        },
      );
    }
    if (config.indexOf(CommonItemsType.district) !== -1) {
      formItems.push(
        {
          label: '商圈',
          span: 4,
          form: (<span>{item.districtName}</span>),
        },
      );
    }
    // 判断设置选项，显示参数
    if (config.indexOf(CommonItemsType.costCount) !== -1) {
      let value = 0;
      if (data.costCount) {
        value = data.costCount;
      }
      if (isNegative) {
        formItems.push({
          label: '分摊金额(元)',
          span: 3,
          layout: { labelCol: { span: 12 }, wrapperCol: { span: 12 } },
          form: <InputNumber
            value={value}
            step={0.01}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
            onChange={this.onChangeCostCount}
          />,
        });
      } else {
        formItems.push({
          label: '分摊金额(元)',
          span: 3,
          layout: { labelCol: { span: 12 }, wrapperCol: { span: 12 } },
          form: <InputNumber
            min={0}
            value={value}
            step={0.01}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
            onChange={this.onChangeCostCount}
          />,
        });
      }
    }
    return formItems;
  }

  render() {
    const { costOrderAmountSummary, costOrderSubmitSummary, examineOrderDetail, value, isNegative } = this.props;
    const config = dot.get(value, 'config', []);
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
    const namespace = `${value.CostAccountingId}-${costTargetId}-${bookMonth}`;
    // 月汇总已提报命名空间
    const submitnamespace = `${value.CostAccountingId}-${costTargetId}-${submitAt}`;
    const totalMoney = dot.get(costOrderAmountSummary, `${namespace}.money`, 0);
    // 定义提报金额
    const submitMoney = dot.get(costOrderSubmitSummary, `${submitnamespace}.amountMoney`, 0);
    const formItems = [];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    const item = {
      platformName: value.platformName,
      vendorName: value.vendorName,
      cityName: value.cityName,
      districtName: value.districtName,
      costCount: value.costCount,
    };
    const data = {
      platform: value.platform,
      vendor: value.vendor,
      city: value.city,
      district: value.district,
      costCount: value.costCount,
      isUpdateRule: value.isUpdateRule,
    };

    // 判断，如果可编辑，则表单显示
    if (value.isEdit) {
      this.renderForm(config, formItems, data, value.key, totalMoney, tooltipText, submitMoney, isNegative);
    }
    // 如果不可编辑，则文本显示
    if (!(value.isEdit)) {
      this.renderDetail(config, data, item, formItems, totalMoney, tooltipText, submitMoney, isNegative);
    }
    // 操作按钮
    if (config.indexOf(CommonItemsType.operatCreate) !== -1 && config.indexOf(CommonItemsType.operatDelete) !== -1 && value.isUpdateRule !== true) {
      formItems.push({
        span: 2,
        form: (
          <div>
            <Button onClick={this.onCreate} shape="circle" icon={<PlusOutlined />} />
            <Button className="app-global-mgl8" onClick={this.onDelete} shape="circle" icon={<MinusOutlined />} />
          </div>
        ),
      });
    } else if (config.indexOf(CommonItemsType.operatCreate) !== -1 && value.isUpdateRule !== true) {
      formItems.push({
        span: 2,
        form: (
          <div>
            <Button onClick={this.onCreate} shape="circle" icon={<PlusOutlined />} />
          </div>
        ),
      });
    } else if (config.indexOf(CommonItemsType.operatDelete) !== -1 && value.isUpdateRule !== true) {
      formItems.push({
        span: 2,
        form: (
          <div>
            <Button onClick={this.onDelete} shape="circle" icon={<MinusOutlined />} />
          </div>
        ),
      });
    }
    return (
      <div>
        <DeprecatedCoreForm items={formItems} layout={layout} className={styles['app-comp-expense-manage-common-item']} />
      </div>
    );
  }
}
CommonItems.CommonItemsType = CommonItemsType;
function mapStateToProps({ expenseCostOrder: { costOrderAmountSummary, costOrderSubmitSummary }, expenseExamineOrder: { examineOrderDetail } }) {
  return { costOrderAmountSummary, costOrderSubmitSummary, examineOrderDetail };
}
export default withRouter(connect(mapStateToProps)(CommonItems));
