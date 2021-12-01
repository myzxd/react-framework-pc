/**
 * 中介费表单的模版
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, InputNumber } from 'antd';

import { CoreContent, DeprecatedCoreForm, CoreFinder } from '../../../../../components/core';
import CoreUpload from '../../../components/uploadAmazon';
import { Unit, ExpenseCostCenterType } from '../../../../../application/define';
import { CommonSelectSuppliers } from '../../../../../components/common';

import CommonExpense from '../../common/costExpense';  // 成本中心，成本归属
import Collection from '../../common/collection';
import Belong from '../../common/costBelong'; // 成本归属
import style from './style.css';

const { CoreFinderList } = CoreFinder;

const { TextArea } = Input;

class Index extends Component {
  static propTypes = {
    title: PropTypes.string,
    agentDetail: PropTypes.object,
    formKey: PropTypes.string,
    onHookForm: PropTypes.func,
    platformParam: PropTypes.string,
  }

  static defaultProps = {
    title: '',
    agentDetail: {},
    formKey: '',
    onHookForm: () => {},
    platformParam: '',
  }

  static getDerivedStateFromProps(prevProps, oriState) {
    const { agentDetail: prevData = {} } = prevProps;
    const { agentDetail = undefined } = oriState;
    if (agentDetail === undefined && Object.keys(prevData).length > 0) {
      const { attachments = [], attachmentPrivateUrls = [] } = prevData;
      return { agentDetail: prevData, fileList: attachments, fileUrlList: attachmentPrivateUrls };
    }
    return null;
  }

  constructor() {
    super();

    this.state = {
      agentDetail: undefined,
      fileList: [], // 文件列表
      fileUrlList: [], // 附件下载地址列表
      apportionData: {}, // 分摊中平台、供应商数据
      currentInvoiceFlag: true, // 是否用接口返回数据中的发票抬头

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

  // 支付信息
  renderPaymentInfo = () => {
    const { form = {}, agentDetail = {} } = this.props;
    const label = {
      cardNameLabel: '中介费收款人',
    };

    const placeholder = {
      cardNamePlace: '请填写中介费收款人',
    };
    return (
      <Collection
        totalMoney={form.getFieldValue('money')}
        form={form}
        isRender
        label={label}
        placeholder={placeholder}
        detail={agentDetail}
      />
    );
  }

   // 创建编辑渲染预览组件
  renderCorePreview=(value) => {
    if (Array.isArray(value) && dot.get(value, '0')) {
      const data = value.map((item) => {
        return { key: item };
      });

      return <CoreFinderList data={data} enableDownload={false} enableRemove onRemove={this.onDeleteFile} />;
    }

    return <React.Fragment />;
  }

  // 中介费信息
  renderAgencyInfo = () => {
    const { agentDetail = {}, form = {}, platformParam } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const {
      fileList = [],
      apportionData = {},
      currentInvoiceFlag,
      teamTypeList = [], // 团队列表
      costAttribution, // 成本归属（中台映射）
    } = this.state;

    // 成本中心
    const selectedCostCenterType = dot.get(agentDetail, 'costAccountingInfo.costCenterType', undefined);

    if (Object.keys(agentDetail).length === 0) return null;

    // 注册隐藏的表单
    getFieldDecorator('recordId', { initialValue: dot.get(agentDetail, 'id') })(<Input hidden />);
    // getFieldDecorator('money', { initialValue: Unit.exchangePriceToYuan(dot.get(agentDetail, 'totalMoney', 0)) })(<Input hidden />);
    getFieldDecorator('fileList', { initialValue: fileList })(<Input hidden />);

    // 房屋信息
    const { bizExtraHouseContractInfo = {} } = agentDetail;
    // 历史房屋合同信息
    const { fromContractId = undefined } = bizExtraHouseContractInfo;

    const formItems = [
      {
        label: '中介费金额',
        form: getFieldDecorator('money', { initialValue: Unit.exchangePriceToYuan(dot.get(agentDetail, 'totalMoney', 0)) })(
          <InputNumber
            formatter={value => `${value}元`}
            disabled
            parser={value => value.replace('元', '')}
          />,
          ),
      },
    ];
    // 科目
    const formItemsSub = [
      {
        label: '科目',
        form: `${dot.get(agentDetail, 'costAccountingInfo.name', '--')}(${dot.get(agentDetail, 'costAccountingCode', '--')})`,
      },
      {
        label: '成本归属',
        form: getFieldDecorator('costAttribution', {
        })(
          <Belong
            form={form}
            subjectCode={dot.get(agentDetail, 'costAccountingCode', undefined)}
            platform={dot.get(agentDetail, 'platformCodes.0', undefined)}
            onChangeCostAttribution={this.onChangeCostAttribution}
            namespace={'agency'}
          />,
        ),
      },
    ];
    // 发票抬头
    const formItemsInvoice = [
      {
        label: '发票抬头',
        form: getFieldDecorator('invoiceTitle', { initialValue: currentInvoiceFlag ? dot.get(agentDetail, 'invoiceTitle', '') : dot.get(apportionData, 'vendorName', '') })(
          <CommonSelectSuppliers
            platforms={dot.get(apportionData, 'platform', dot.get(agentDetail, 'platformCodes.0', ''))}
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
        form: getFieldDecorator('note', { initialValue: fromContractId ? '续签中介费' : dot.get(agentDetail, 'note', '') })(
          <TextArea rows={2} />,
          ),
      }, {
        label: '上传附件',
        form: (
          <div>
            <CoreUpload domain="cost" namespace={this.private.namespace} onSuccess={this.onUploadSuccess} onFailure={this.onUploadFailure} />
            {this.renderCorePreview(fileList)}
          </div>
        ),
      },
    ];

    // 如果costAllocationList为[]
    let costItems = dot.get(agentDetail, 'costAllocationList', [{}]);
    if (costItems.length === 0) {
      costItems = [{}];
    }
    // 成本中心
    const expense = {
      costCenter: costAttribution,                        // 成本中心归属类型
      costBelong: dot.get(agentDetail, 'allocationMode', undefined),  // 成本归属分摊模式
      // 子项目
      costItems: costItems.map((item) => {
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

    const agencyTotalMoney = getFieldValue('money');
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    return (
      <CoreContent title="中介费信息" className={style['app-comp-expense-manage-template-agency-info']}>

        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />

        {/* 科目 */}
        <DeprecatedCoreForm items={formItemsSub} cols={3} layout={layout} />

        {/* 成本分摊 */}
        {
          agencyTotalMoney !== 0 ? getFieldDecorator('expense', { initialValue: expense })(
            <CommonExpense
              costAccountingId={dot.get(agentDetail, 'costAccountingInfo.id', undefined)}
              form={form}
              selectedCostCenterType={selectedCostCenterType}
              unique={'agency'}
              costAttribution={costAttribution}
              teamTypeList={teamTypeList}
              platform={platformParam}
              getPlatFormVendor={this.getPlatFormVendor}
            />,
          ) : ''
        }

        {/* 发票抬头 */}
        {
          agencyTotalMoney !== 0 ? <DeprecatedCoreForm items={formItemsInvoice} cols={1} layout={{ labelCol: { span: 3 }, wrapperCol: { span: 5 } }} /> : ''
        }

        {/* 备注 */}
        <DeprecatedCoreForm items={formItemsUp} cols={1} layout={{ labelCol: { span: 3 }, wrapperCol: { span: 21 } }} />

        {/* 支付信息 */}
        {this.renderPaymentInfo()}
      </CoreContent>
    );
  }

  // 渲染隐藏表单
  renderHiddenForm = () => {
    const { agentDetail = {}, form = {} } = this.props;
    const selectedCostCenterType = dot.get(agentDetail, 'costAccountingInfo.costCenterType', undefined);

    const formItems = [
      {
        label: '',
        form: form.getFieldDecorator('subject', { initialValue: dot.get(agentDetail, 'costAccountingInfo.id', undefined) })(<Input hidden />),
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
    const { title, agentDetail = {} } = this.props;
    if (Object.keys(agentDetail).length <= 0) return <div />;

    return (
      <Form layout="horizontal" >
        <CoreContent title={title}>
          {/* 中介费信息 */}
          {this.renderAgencyInfo()}
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
