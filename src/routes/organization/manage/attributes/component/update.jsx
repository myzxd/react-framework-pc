/**
 * 组织架构 - 部门管理 - 业务信息Tab - update组件
 */
import dot from 'dot-prop';
import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Select, message } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import { OrganizationTeamType, OrganizationBizLabelType, ExpenseCostCenterType } from '../../../../../application/define';

import Platform from '../../components/platform';
import Supplier from '../../components/supplier';
import City from '../../components/city';

import style from '../index.less';

const Option = Select.Option;
// 页面类型
const PageType = {
  detail: 10,
  update: 20,
};

// 操作类型
const OperateType = {
  create: 10,
  update: 20,
};

class Update extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customTags: [],
      isEmpty: true,
      costCenterCheck: dot.get(this.props, 'data.cost_center_type') || undefined,
    };
  }

  // 保存
  onSubmit = () => {
    const { form, dispatch, departmentId, operateType } = this.props;
    form.validateFields((err, val) => {
      if (err) return;

      const params = {
        departmentId,
        type: OrganizationBizLabelType.three,
        ...val,
        onSuccessCallback: this.onSuccessCallback,
        onFailureCallback: this.onFailureCallback,
      };

      // 新建
      operateType === OperateType.create && (dispatch({ type: 'organizationBusiness/createBusinessTag', payload: params }));

      // 编辑
      operateType === OperateType.update && (dispatch({ type: 'organizationBusiness/updateBusinessTag', payload: params }));
    });
  }

  // 成功回调
  onSuccessCallback = () => {
    const { onChangeType, getBusinessTag } = this.props;
    onChangeType && onChangeType(PageType.detail);
    getBusinessTag && getBusinessTag();
  }

  // 失败回调
  onFailureCallback = (res) => {
    res.zh_message && message.error(res.zh_message);
    const { onChangeType } = this.props;
    onChangeType && onChangeType(PageType.detail);
  }

  // 成本中心
  onChangeCostCenter = (value) => {
    const { form, data = {} } = this.props;
    const {
      platform_codes: platforms = undefined,
      supplier_ids: suppplers = undefined,
      city_codes: citys = undefined,
    } = data;
    // 平台
    const platform = platforms ? platforms[0] : undefined;
    // 供应商
    const supppler = suppplers ? suppplers[0] : undefined;
    // 城市
    const city = citys ? citys[0] : undefined;

    // 根据选中的类型与默认的类型对比是否添加默认值
    if (value === dot.get(this.props, 'data.cost_center_type', undefined)) {
      this.setState({
        costCenterCheck: value,
        isEmpty: true,
      });

      // 设置值
      form.setFieldsValue({
        platformCodes: platform,
        supplierIds: supppler,
        cityCodes: city,
      });
    } else {
      this.setState({
        costCenterCheck: value,
        isEmpty: false,
      });
    }
  }

  // platform onChange
  onChangePlatfrom = (val) => {
    const { form } = this.props;
    const { setFieldsValue } = form;
    setFieldsValue({ platformCodes: val });
    // 清空选项
    form.setFieldsValue({
      supplierIds: undefined,
      cityCodes: undefined,
    });
  }

  // supplier onChange
  onChangeSupplier = (val) => {
    const { form } = this.props;
    const { setFieldsValue } = form;
    setFieldsValue({ supplierIds: val });
    // 清空选项
    form.setFieldsValue({
      cityCodes: undefined,
    });
  }

  // city onChange
  onChangeCity = (val) => {
    const { form } = this.props;
    const { setFieldsValue } = form;
    setFieldsValue({ cityCodes: val });
  }

  // 系统属性
  renderSystemForm = () => {
    const { data = {}, form } = this.props;
    const { getFieldDecorator } = form;
    const { costCenterCheck, isEmpty } = this.state;
    const {
      platform_codes: platforms = undefined,
      supplier_ids: suppplers = undefined,
      city_codes: citys = undefined,
    } = data;

    // 平台
    const platform = platforms ? platforms[0] : undefined;
    // 供应商
    const supppler = suppplers ? suppplers[0] : undefined;
    // 城市
    const city = citys ? citys[0] : undefined;

    const formItems = [
      {
        label: '成本类型',
        form: getFieldDecorator('costCenter', {
          initialValue: dot.get(this.props, 'data.cost_center_type') || undefined,
          rules: [{
            required: false,
            message: '请选择成本类型',
          }],
        })(
          <Select allowClear placeholder="请选择成本中心" style={{ width: '50%' }} onChange={this.onChangeCostCenter}>
            <Option key={ExpenseCostCenterType.group} value={ExpenseCostCenterType.group} >
              {ExpenseCostCenterType.description(ExpenseCostCenterType.group)}
            </Option>
            <Option key={ExpenseCostCenterType.project} value={ExpenseCostCenterType.project} >
              {ExpenseCostCenterType.description(ExpenseCostCenterType.project)}
            </Option>
            <Option key={ExpenseCostCenterType.headquarter} value={ExpenseCostCenterType.headquarter}>
              {ExpenseCostCenterType.description(ExpenseCostCenterType.headquarter)}
            </Option>
            <Option key={ExpenseCostCenterType.city} value={ExpenseCostCenterType.city}>
              {ExpenseCostCenterType.description(ExpenseCostCenterType.city)}
            </Option>
          </Select>,
        ),
      },
    ];

    if (costCenterCheck && costCenterCheck <= ExpenseCostCenterType.project) {
      formItems.push(
        {
          label: '平台',
          form: getFieldDecorator('platformCodes', {
            initialValue: isEmpty ? platform : undefined,
            rules: [{
              required: costCenterCheck && costCenterCheck <= ExpenseCostCenterType.project ? true : false,
              message: '请选择平台',
            }],
          })(
            <Platform
              showSearch
              allowClear
              optionFilterProp="children"
              onChange={this.onChangePlatfrom}
            />,
          ),
        },
      );
    }

    if (costCenterCheck && costCenterCheck <= ExpenseCostCenterType.headquarter) {
      formItems.push(
        {
          label: '供应商',
          form: getFieldDecorator('supplierIds', {
            initialValue: isEmpty ? supppler : undefined,
            rules: [{
              required: costCenterCheck && costCenterCheck <= ExpenseCostCenterType.headquarter ? true : false,
              message: '请选择供应商',
            }],
          })(
            <Supplier
              showSearch
              allowClear
              optionFilterProp="children"
              onChange={this.onChangeSupplier}
            />,
          ),
        },
      );
    }
    if (costCenterCheck && costCenterCheck <= ExpenseCostCenterType.city) {
      formItems.push(
        {
          label: '城市',
          form: getFieldDecorator('cityCodes', {
            initialValue: isEmpty ? city : undefined,
            rules: [{
              required: costCenterCheck && costCenterCheck <= ExpenseCostCenterType.city ? true : false,
              message: '请选择城市',
            }],
          })(
            <City
              showSearch
              enableSelectAll
              allowClear
              optionFilterProp="children"
              onChange={this.onChangeCity}
            />,
          ),
        },
      );
    }

    const layout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 16,
      },
    };

    return (
      <CoreContent title={'部门成本中心'} style={{ backgroundColor: 'white' }}>
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </CoreContent>
    );
  }

  // 团队属性
  renderTeamForm = () => {
    const { data = {}, form } = this.props;
    const { getFieldDecorator } = form;

    const { team_attrs: team = [] } = data;
    const initTeam = team.length > 0 ? team[0] : undefined;
    const formItems = [
      {
        label: '',
        form: getFieldDecorator('teamAttrs', { initialValue: initTeam })(
          <Select
            allowClear
            placeholder="请选择团队类型属性"
            className={style['app-organization-busines-update-select']}
          >
            <Option key={OrganizationTeamType.division} value={OrganizationTeamType.division}>{OrganizationTeamType.description(OrganizationTeamType.division)}</Option>
            <Option key={OrganizationTeamType.subDivision} value={OrganizationTeamType.subDivision}>{OrganizationTeamType.description(OrganizationTeamType.subDivision)}</Option>
            <Option key={OrganizationTeamType.region} value={OrganizationTeamType.region}>{OrganizationTeamType.description(OrganizationTeamType.region)}</Option>
            <Option key={OrganizationTeamType.personal} value={OrganizationTeamType.personal}>{OrganizationTeamType.description(OrganizationTeamType.personal)}</Option>
          </Select>,
        ),
      },
    ];
    const layout = {
      labelCol: {
        span: 0,
      },
      wrapperCol: {
        span: 6,
      },
    };
    return (
      <CoreContent title={'团队类型属性'} style={{ backgroundColor: 'white' }}>
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </CoreContent>
    );
  }

  // 自定义属性
  renderCustomizeForm = () => {
    const { data = {}, form } = this.props;
    const { getFieldDecorator } = form;

    let { custom_attrs: customize = [] } = data;
    // 后端无数据时会返回null
    customize = customize === null ? [] : customize;

    return (
      <CoreContent title={'自定义属性标签'} style={{ backgroundColor: 'white' }}>
        {
          getFieldDecorator('customAttrs', { initialValue: customize })(
            <Select
              mode="tags"
              placeholder="请输入自定义属性标签"
              style={{ width: '75%' }}
              tokenSeparators={[',', '，']}
            >
              {customize.map(item => <Option key={item}>{item}</Option>)}
            </Select>,
          )
        }
      </CoreContent>
    );
  }

  // 操作
  renderOperate = () => {
    return (
      <div className={style['app-organization-busines-update-operate']}>
        <Button type="primary" onClick={this.onSubmit}>提交</Button>
      </div>
    );
  }

  render() {
    return (
      <CoreContent title="业务信息列表">
        {/* 系统属性 */}
        {this.renderSystemForm()}
        {/* 团队属性 */}
        {this.renderTeamForm()}
        {/* 自定义属性 */}
        {this.renderCustomizeForm()}
        {/* 操作 */}
        {this.renderOperate()}
      </CoreContent>
    );
  }
}

Update.propTypes = {
  data: PropTypes.object,
  departmentId: PropTypes.string,
  onChangeType: PropTypes.func,
  dispatch: PropTypes.func,
  operateType: PropTypes.number,
  getBusinessTag: PropTypes.func,
};

Update.defaultProps = {
  data: {},
  departmentId: '',
  onChangeType: () => { },
  dispatch: () => { },
  operateType: 10,
  getBusinessTag: () => { },
};

export default Form.create()(Update);
