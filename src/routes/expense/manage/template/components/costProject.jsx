/**
 * 费用表单
 */
import React from 'react';
import PropTypes from 'prop-types';

import {
  Input,
} from 'antd';
import { Unit, ExpenseCostCenterType, ExpenseCostOrderBelong } from '../../../../../application/define';

import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import { CommonSelectSuppliers } from '../../../../../components/common';
import CoreUpload from '../../../components/uploadAmazon';
import CommonSubject from '../../common/costSubject';  // 科目设置
import CommonExpense from '../../common/costExpense';  // 成本分摊
import InvoiceHeader from './invoiceHeader';

import style from './style.css';

const { TextArea } = Input;

class Project extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    expenseTypeId: PropTypes.string, // 费用分组id
    detail: PropTypes.object, // 物资单信息
  }

  static defaultProps = {
    expenseTypeId: '',
    detail: {},
  }

  constructor(props) {
    super(props);
    const {
      detail,
    } = props;

    const {
      costAccountingInfo = {}, // 科目信息
    } = detail;

    this.state = {
      fileList: detail.attachments || [],
      fileUrlList: detail.attachmentPrivateUrls || [],
      apportionData: {},
      selectedSubjectId: costAccountingInfo.id || undefined,
      selectedCostCenterType: costAccountingInfo.costCenterType || undefined,
      costAttribution: detail.costCenterType || undefined,
      teamTypeList: [],
    };
    // 上传文件的随机key
    this.private = {
      namespace: `namespace${Math.floor(Math.random() * 100000)}`,
    };
  }

  // 改变科目回调
  onChangeSubject = (selectedSubjectId, selectedCostCenterType) => {
    const { costAttribution } = this.state;
    // 设置当前选择的科目id值
    this.setState({
      ...this.state,
      selectedSubjectId,
      selectedCostCenterType,
      costAttribution: selectedSubjectId ? costAttribution : undefined,
    });
    const { form } = this.props;
    form.setFieldsValue({ costCenterType: selectedCostCenterType });
  }

  // 成本归属
  onChangeCostAttribution = (val, isInit) => {
    const { form } = this.props;

    const {
      cost_center_type: costCenterType = undefined, // 成本归属
      team_type_list: teamTypeList = [], // 团队类型列表
    } = val;

    this.setState({
      costAttribution: costCenterType, // 成本归属
      teamTypeList,
    });

    const expense = form.getFieldsValue(['expense']).expense || {};
    let { costBelong = undefined } = expense;
    const { costItems = [] } = expense;

    if (costBelong === undefined && val !== ExpenseCostCenterType.person) {
      costBelong = ExpenseCostOrderBelong.average;
    }

    form.setFieldsValue({ expense: { costBelong, costItems: isInit ? costItems : [{}] } });
  }

  // 上传文件成功回调
  onUploadSuccess = (e) => {
    const list = this.state.fileList;
    list.push(e);
    this.setState({
      ...this.state,
      fileList: list,
    });
    this.props.form.setFieldsValue({ fileList: list });
  }

  // 删除文件
  onDeleteFile = (index) => {
    const list = this.state.fileList;
    list.splice(index, 1);
    this.setState({
      ...this.state,
      fileList: list,
    });
    this.props.form.setFieldsValue({ fileList: list });
  }

  // 获取成本分摊中的平台、供应商
  getPlatFormVendor = (apportionData) => {
    this.setState({
      apportionData,
    }, () => {
      this.props.form.resetFields('invoiceTitle');
    });
  }

  // 分摊默认值
  getInitValueExpense = () => {
    const {
      detail = {},
    } = this.props;

    const {
      allocationMode = undefined,
      costAllocationList = [],
    } = detail;

    if (Object.keys(detail).length === 0 ||
      !allocationMode ||
      costAllocationList.length === 0
    ) return undefined;

    // 成本中心
    const expense = {
      costBelong: allocationMode,  // 成本归属分摊模式
      // 子项目
      costItems: costAllocationList.map((item) => {
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
          costAllocation.cityName = item.cityName;
          costAllocation.citySpelling = item.citySpelling;
        }
        // 商圈
        if (item.bizDistrictId) {
          costAllocation.district = item.bizDistrictId;
          costAllocation.districtName = item.bizDistrictName;
        }

        if (item.teamId) {
          costAllocation.teamId = item.teamId;
          costAllocation.teamType = item.teamType;
          costAllocation.teamName = item.teamName;
          costAllocation.teamIdCode = item.teamIdCode;
          costAllocation.teamStaffId = item.profileId;
        }

        if (Object.keys(item.staffInfo).length > 0) {
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

    return expense;
  }

  renderUpload = () => {
    const {
      fileList,
      fileUrlList,
    } = this.state;

    const {
      isUpdateRule,
    } = this.props;

    return (
      <div>
        {/* 判断，如果是只读模式，则不显示文件上传组件 */}
        {
          isUpdateRule !== true ?
            <CoreUpload domain="cost" namespace={this.private.namespace} onSuccess={this.onUploadSuccess} onFailure={this.onUploadFailure} /> : ''
        }

        {
          fileList.map((item, index) => {
            if (isUpdateRule !== true) {
              return (
                <p key={index}>
                  {/* 判断，如果是刚上传的，则不能下载，因为没有对应的url */}
                  {
                    fileUrlList[index] ?
                      <a
                        className={style['app-comp-expense-manage-template-refund-upload']}
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
                    className={style['app-comp-expense-manage-template-refund-detele']}
                  >
                    删除
                  </span>
                </p>
              );
            } else {
              return (
                <a
                  className={style['app-comp-expense-manage-template-refund-upload']}
                  rel="noopener noreferrer"
                  target="_blank"
                  key={index}
                  href={fileUrlList[index]}
                >
                  {item}
                </a>
              );
            }
          })
        }
      </div>
    );
  }

  // 内容
  renderContent = () => {
    const {
      form,
      expenseTypeId, // 费用分组id
      detail,
      isUpdateRule,
      platform,
      isPluginOrder,
    } = this.props;

    const {
      selectedSubjectId, // 科目id
      selectedCostCenterType, // 成本中心
      costAttribution, //  成本归属
      teamTypeList,
    } = this.state;
    const { costAccountingInfo } = detail;

    const { getFieldDecorator } = form;

    const {
      apportionData = {},
    } = this.state;

    const {
      invoiceTitle = undefined, // 发票抬头
      note = undefined, // 备注
      costAccountingCode, // 科目编码
    } = detail;


    // 如果费用分组id为空，则return null
    if (!expenseTypeId) {
      return null;
    }
     // 发票表单（科目成本归属为总部时，使用一套发票表单）或是外部审批单时
    const invoice = !isPluginOrder === 'true' || selectedCostCenterType === ExpenseCostCenterType.headquarters ?
      ({
        label: '发票抬头',
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 9 } },
        form: getFieldDecorator('invoiceTitle', {
          initialValue: invoiceTitle,
          rules: [{ required: true, message: '请选择发票抬头' }],
        })(
          <InvoiceHeader disabled={isUpdateRule} platform="zongbu" />,
        ),
      })
      : ({
        label: '发票抬头',
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 9 } },
        form: getFieldDecorator('invoiceTitle', {
          initialValue: apportionData.vendorName || invoiceTitle,
          rules: [{ required: true, message: '请选择发票抬头' }],
        })(
          <CommonSelectSuppliers
            platforms={apportionData.platform}
            isNoSuppliers={isPluginOrder === 'true'}
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择"
            isSubmitNameAsValue
            disabled={isUpdateRule}
          />,
        ),
      });

    const formItems = [
      invoice,
      {
        label: '备注',
        form: getFieldDecorator('note', { initialValue: note })(
          <TextArea
            rows={2}
            disabled={isUpdateRule}
          />,
          ),
      }, {
        label: '上传附件',
        form: this.renderUpload(),
      },
    ];

    return (
      <CoreContent title="项目信息" className={style['app-comp-expense-manage-template-create-refund-project']}>
        {/* 科目设置 */}
        {
          getFieldDecorator('subject', { initialValue: { subjectId: selectedSubjectId, costAttribution } })(
            <CommonSubject
              isPluginOrder={isPluginOrder === 'true'}
              costAccountingInfo={costAccountingInfo}
              showDisabledSubject
              selectedSubjectId={selectedSubjectId}
              disabled={isUpdateRule}
              expenseTypeId={expenseTypeId}
              subjectCode={costAccountingCode}
              form={this.props.form}
              platform={platform}
              costAttribution={costAttribution}
              onChangeSubject={this.onChangeSubject}
              onChangeCostAttribution={this.onChangeCostAttribution}
            />,
          )
        }

        {/* 成本分摊 */}
        {
          getFieldDecorator('expense', { initialValue: this.getInitValueExpense() })(
            <CommonExpense
              costAccountingId={selectedSubjectId}
              isPluginOrder={isPluginOrder === 'true'}
              form={this.props.form}
              isUpdateRule={isUpdateRule}
              selectedCostCenterType={selectedCostCenterType}
              getPlatFormVendor={this.getPlatFormVendor}
              costAttribution={costAttribution}
              teamTypeList={teamTypeList}
              platform={platform}
              isCost
            />,
          )
        }

        {/* 备注，上传 */}
        <DeprecatedCoreForm items={formItems} cols={1} layout={{ labelCol: { span: 3 }, wrapperCol: { span: 21 } }} />

        {/* 隐藏表单 */}
        {this.renderHiddenForm()}
      </CoreContent>
    );
  }

  // 渲染隐藏表单
  renderHiddenForm = () => {
    const { fileList, selectedCostCenterType } = this.state;
    const { form } = this.props;

    const formItems = [
      {
        label: '',
        form: form.getFieldDecorator('fileList', { initialValue: fileList })(<Input hidden />),
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
        className={style['app-comp-expense-manage-template-create-refund-hide']}
        items={formItems}
        cols={1}
        layout={layout}
      />
    );
  }

  render() {
    return this.renderContent();
  }
}

export default Project;
