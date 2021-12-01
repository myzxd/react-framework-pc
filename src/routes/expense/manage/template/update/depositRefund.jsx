/**
 * 退回押金信息表单的模版
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import CoreUpload from '../../../components/uploadAmazon';
import { Unit, ExpenseCostCenterType } from '../../../../../application/define';
import { CommonSelectSuppliers } from '../../../../../components/common';

import CommonExpense from '../../common/costExpense';  // 成本中心，成本归属
import Belong from '../../common/costBelong'; // 成本归属
import style from './style.css';

const { TextArea } = Input;

class Index extends Component {
  static propTypes = {
    title: PropTypes.string,
    pledgeDetail: PropTypes.object,
    formKey: PropTypes.string,
    onHookForm: PropTypes.func,
    platformParam: PropTypes.string,
    isNegative: PropTypes.bool,
  }

  static defaultProps = {
    title: '',
    pledgeDetail: {},
    formKey: '',
    onHookForm: () => {},
    platformParam: '',
    isNegative: false,
  }

  static getDerivedStateFromProps(prevProps, oriState) {
    const { pledgeDetail: prevData = {} } = prevProps;
    const { pledgeDetail = undefined } = oriState;
    if (pledgeDetail === undefined && Object.keys(prevData).length > 0) {
      const { attachments = [], attachmentPrivateUrls = [] } = prevData;
      return { pledgeDetail: prevData, fileList: attachments, fileUrlList: attachmentPrivateUrls };
    }
    return null;
  }

  constructor() {
    super();

    this.state = {
      pledgeDetail: undefined,
      fileList: [],                      // 文件列表
      fileUrlList: [],                   // 附件下载地址列表
      apportionData: {},
      currentInvoiceFlag: true,

      costAttribution: undefined, // 成本归属（中台映射）
      teamTypeList: [], // 团队列表
    };
    // 上传文件的随机key
    this.private = {
      namespace: `namespace${Math.floor(Math.random() * 100000)}`,
    };
  }

  componentDidMount() {
    const { formKey, onHookForm, form = {} } = this.props;

    // 返回初始化的form对象
    if (onHookForm) {
      onHookForm(form, formKey);
    }
  }

  // 修改成本归属
  onChangeCostAttribution = (val) => {
    const {
      cost_center_type: costCenterType = undefined,
      team_type_list: teamTypeList = [],
    } = val;

    this.setState({
      costAttribution: costCenterType,
      teamTypeList,
    });

    this.props.form.setFieldsValue({ costCenterType });
  }

  // 上传文件成功回调
  onUploadSuccess = (e) => {
    const list = this.state.fileList;
    this.setState({
      fileList: [...list, e],
    });
    this.props.form.setFieldsValue({ fileList: [...list, e] });
  }

  // 删除文件
  onDeleteFile = (index) => {
    const { fileList = [], fileUrlList = [] } = this.state;
    fileList.splice(index, 1);
    fileUrlList.splice(index, 1);
    this.setState({
      fileList,
      fileUrlList,
    });
    this.props.form.setFieldsValue({ fileList });
  }

  // 获取成本分摊中的平台、供应商
  getPlatFormVendor = (apportionData) => {
    this.setState({
      apportionData,
      currentInvoiceFlag: false,
    }, () => {
      this.props.form.resetFields('invoiceTitle');
    });
  }

  // 押金损失信息
  renderBreakInfo = () => {
    const { pledgeDetail = {}, form = {}, platformParam, isNegative } = this.props;

    if (Object.keys(pledgeDetail).length === 0) return null;

    const { getFieldDecorator } = form;

    const {
      fileList = [],
      fileUrlList = [],
      apportionData = {},
      currentInvoiceFlag,
      teamTypeList = [], // 团队列表
      costAttribution, // 成本归属（中台映射）
    } = this.state;

    // 成本中心
    const selectedCostCenterType = dot.get(pledgeDetail, 'costAccountingInfo.costCenterType', undefined);

    // 注册隐藏的表单
    getFieldDecorator('recordId', { initialValue: dot.get(pledgeDetail, 'id') })(<Input hidden />);
    getFieldDecorator('money', { initialValue: Unit.exchangePriceToYuan(dot.get(pledgeDetail, 'totalMoney', 0)) })(<Input hidden />);
    getFieldDecorator('fileList', { initialValue: fileList })(<Input hidden />);
    const formItems = [
      {
        label: '退回押金',
        form: getFieldDecorator('money', { initialValue: Unit.exchangePriceToYuan(dot.get(pledgeDetail, 'totalMoney', 0)) })(
          <Input disabled addonAfter="元" />,
        ),
      },
    ];
    // 科目
    const formItemsSub = [
      {
        label: '科目',
        form: `${dot.get(pledgeDetail, 'costAccountingInfo.name', '--')}(${dot.get(pledgeDetail, 'costAccountingCode', '--')})`,
      },
      {
        label: '成本归属',
        form: getFieldDecorator('costAttribution', {
        })(
          <Belong
            form={form}
            subjectCode={dot.get(pledgeDetail, 'costAccountingCode', undefined)}
            platform={dot.get(pledgeDetail, 'platformCodes.0', undefined)}
            onChangeCostAttribution={this.onChangeCostAttribution}
            namespace={'depositRefund'}
          />,
        ),
      },

    ];
    // 发票抬头
    const formItemsInvoice = [
      {
        label: '发票抬头',
        form: getFieldDecorator('invoiceTitle', { initialValue: currentInvoiceFlag ? dot.get(pledgeDetail, 'invoiceTitle', '') : dot.get(apportionData, 'vendorName', '') })(
          <CommonSelectSuppliers
            platforms={dot.get(apportionData, 'platform', dot.get(pledgeDetail, 'platformCodes.0', ''))}
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择供应商"
            isSubmitNameAsValue
          />,
        ),
      },
    ];
    // 备注
    const formItemsUp = [
      {
        label: '备注',
        form: getFieldDecorator('note', { initialValue: dot.get(pledgeDetail, 'note', '') })(
          <TextArea rows={2} />,
          ),
      }, {
        label: '上传附件',
        form: (
          <div>
            <CoreUpload domain="cost" namespace={this.private.namespace} onSuccess={this.onUploadSuccess} onFailure={this.onUploadFailure} />
            {
              fileList.map((item, index) => {
                return (
                  <p key={index}>
                    {/* 判断，如果是刚上传的，则不能下载，因为没有对应的url */}
                    {
                      fileUrlList[index] ?
                        <a
                          className={style['app-comp-expense-manage-template-deposit-refund-upload']}
                          rel="noopener noreferrer"
                          target="_blank"
                          key={index}
                          href={fileUrlList[index]}
                        >
                          {item}
                        </a> :
                        <span>{item}</span>
                    }
                    <span
                      onClick={() => { this.onDeleteFile(index); }}
                      className={style['app-comp-expense-manage-template-deposit-refund-detele']}
                    >
                      删除
                    </span>
                  </p>
                );
              })
          }
          </div>
        ),
      },
    ];
    // 成本中心
    const expense = {
      costCenter: costAttribution,                        // 成本中心归属类型
      costBelong: dot.get(pledgeDetail, 'allocationMode', undefined),  // 成本归属分摊模式
      // 子项目
      costItems: dot.get(pledgeDetail, 'costAllocationList', []).map((item) => {
        let costCount;
        if (item.money) {
          costCount = Unit.exchangePriceToYuan(item.money);
        }
        const costAllocation = {};
        // 平台
        if (item.platformCode) {
          costAllocation.platform = item.platformCode;
          costAllocation.platformName = item.platformName;
        }
        // 供应商
        if (item.supplierId) {
          costAllocation.vendor = item.supplierId;
          costAllocation.vendorName = item.supplierName;
        }
        // 城市
        if (item.cityCode) {
          costAllocation.city = item.cityCode;
          costAllocation.cityName = `${item.cityName}_${item.platformName}`;
          costAllocation.citySpelling = item.citySpelling;
        }
        // 商圈
        if (item.bizDistrictId) {
          costAllocation.district = item.bizDistrictId;
          costAllocation.districtName = item.bizDistrictName;
        }

        if (item.teamId || costAttribution === ExpenseCostCenterType.team) {
          costAllocation.teamId = item.teamId;
          costAllocation.teamType = item.teamType;
          costAllocation.teamName = item.teamName;
          costAllocation.teamIdCode = item.teamIdCode;
        }

        if ((item.staffInfo && Object.keys(item.staffInfo).length > 0) || costAttribution === ExpenseCostCenterType.person) {
          const {
            identity_card_id: staffId,
            name: staffName,
          } = item.staffInfo;
          costAllocation.staffId = staffId;
          costAllocation.staffName = `${staffName}(${staffId})`;
        }
        // 自定义分配金额
        if (costCount) {
          costAllocation.costCount = costCount;
        }
        return costAllocation;
      }),
    };
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    return (
      <CoreContent title="退回押金信息" className={style['app-comp-expense-manage-template-deposit-refund-info']}>

        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />

        {/* 科目 */}
        <DeprecatedCoreForm items={formItemsSub} cols={3} layout={layout} />

        {/* 成本分摊 */}
        {
          getFieldDecorator('expense', { initialValue: expense })(
            <CommonExpense
              isNegative={isNegative}
              costAccountingId={dot.get(pledgeDetail, 'costAccountingInfo.id', undefined)}
              form={form}
              selectedCostCenterType={selectedCostCenterType}
              unique={'depositRefund'}
              costAttribution={costAttribution}
              teamTypeList={teamTypeList}
              platform={platformParam}
              getPlatFormVendor={this.getPlatFormVendor}
            />,
          )
        }

        {/* 发票抬头 */}
        {
          <DeprecatedCoreForm items={formItemsInvoice} cols={1} layout={{ labelCol: { span: 3 }, wrapperCol: { span: 5 } }} />
        }

        {/* 备注、上传 */}
        <DeprecatedCoreForm items={formItemsUp} cols={1} layout={{ labelCol: { span: 3 }, wrapperCol: { span: 21 } }} />

      </CoreContent>
    );
  }

  // 渲染隐藏表单
  renderHiddenForm = () => {
    const { pledgeDetail = {}, form = {} } = this.props;
    // 成本中心
    const selectedCostCenterType = dot.get(pledgeDetail, 'costAccountingInfo.costCenterType', undefined);

    const formItems = [
      {
        label: '',
        form: form.getFieldDecorator('subject', { initialValue: dot.get(pledgeDetail, 'costAccountingInfo.id', undefined) })(<Input hidden />),
      },
      {
        label: '',
        form: form.getFieldDecorator('costCenterType', { initialValue: selectedCostCenterType })(<Input hidden />),
      },

    ];
    const layout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 22,
      },
    };
    return (
      <DeprecatedCoreForm
        className={style['app-comp-expense-manage-house-create-refund-hide']}
        items={formItems}
        cols={1}
        layout={layout}
      />
    );
  }

  render = () => {
    const { title, pledgeDetail = {} } = this.props;
    if (Object.keys(pledgeDetail).length <= 0) return <div />;

    return (
      <Form layout="horizontal" >
        <CoreContent title={title}>
          {/* 退回押金信息 */}
          {this.renderBreakInfo()}

          {/* 隐藏表单 */}
          {this.renderHiddenForm()}
        </CoreContent>
      </Form>
    );
  }
}

function mapStateToProps({ approval }) {
  return { approval };
}
export default connect(mapStateToProps)(Form.create()(Index));
