/**
 * 续签表单模块
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import PropTypes from 'prop-types';
import '@ant-design/compatible/assets/index.css';
import { Select, Button, DatePicker, Input, message } from 'antd';
import React, { Component } from 'react';
import is from 'is_js';
import moment from 'moment';
import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import CoreUpload from '../../../../components/upload';
import { ExpenseHouseState } from '../../../../../../application/define';
import { authorize } from '../../../../../../application';

// 详情页面，加载历史记录使用
import DetailRent from '../../detail/rent';
import styles from '../../../common/styles.less';

// 成本中心，成本归属
import CommonExpense from '../../../common/expense';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

class Index extends Component {
  static getDerivedStateFromProps(prevProps, oriState) {
    const { fileList = undefined } = oriState;
    const { orderRecordDetails } = prevProps;
    const prevFile = this.onTransFileList(dot.get(orderRecordDetails, '0.files_address', []));
    if (fileList === undefined && prevFile.length > 0) {
      return { fileList: prevFile };
    }
    return null;
  }

  static propTypes = {
    orderRecordDetails: PropTypes.array,
    query: PropTypes.object,
  }

  static defaultProps = {
    orderRecordDetails: [],
    query: {},
  }

  constructor(props) {
    super(props);

    this.state = {
      fileList: undefined,           // 文件列表
    };
  }

  // 上传文件成功回调
  onUploadSuccess = (e) => {
    const list = this.state.fileList;
    list.push(e);
    this.setState({
      fileList: list,
    });
  }

  // 文件地址转换
  onTransFileList = (value) => {
    const fileList = [];
    value.forEach((item) => {
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          fileList.push(key);
        }
      }
    });
    return fileList;
  }

  // 删除文件
  onClickDelete = (index) => {
    const list = this.state.fileList;
    list.splice(index, 1);
    this.setState({
      fileList: list,
    });
  }

  // 提交模版
  onSubmitTemplate = (e) => {
    e.preventDefault();
    const { query = {} } = this.props;
    const { recordId } = query;

    this.props.form.validateFields((err, formValue) => {
      const validateValue = formValue;
      if (err) {
        message.error('错误', err);
      }
      validateValue.order_id = recordId;
      validateValue.files_address = this.state.fileList;
      const transKey = (value) => {
        if (value === 'platform') {
          return 'platform_code';
        }
        if (value === 'vendor') {
          return 'supplier_id';
        }
        if (value === 'city') {
          return 'city_spelling';
        }
        if (value === 'district') {
          return 'biz_id';
        }
        if (value === 'costCount') {
          return 'custom_money';
        }
      };
      const transPayload = (values) => {
        const data = {};
        function existy(value) {
          if (value == null || value === '') {
            return false;
          }
          return true;
        }
        if (existy(values.contractDateRanage) && !is.empty(values.contractDateRanage) && Array.isArray(values.contractDateRanage)) {
          data.contract_start_date = moment(values.contractDateRanage[0]).format('YYYY-MM-DD');
          data.contract_end_date = moment(values.contractDateRanage[1]).format('YYYY-MM-DD');
        }
        if (existy(values.monthRent) && !is.empty(values.monthRent)) {
          data.month_rent = values.monthRent;
        }
        if (existy(values.month) && !is.empty(values.month)) {
          data.pay_time = values.month;
        }
        if (existy(values.days) && !is.empty(values.days)) {
          data.payment_date = parseFloat(values.days);
        }
        if (is.existy(values.expense.costCenter) && !is.empty(values.expense.costCenter)) {
          data.cost_center = parseFloat(values.expense.costCenter);
        }
        if (is.existy(values.expense.costCenter) && !is.empty(values.expense.costCenter)) {
          data.cost_belong = parseFloat(values.expense.costBelong);
        }
        if (is.existy(values.expense.costItems) && !is.empty(values.expense.costItems)) {
          const items = values.expense.costItems;
          const cost = [];
          items.forEach((item) => {
            const per = {};
            for (const key in item) {
              if (Object.prototype.hasOwnProperty.call(item, key)) {
                if (item[key] !== undefined) {
                  per[transKey(key)] = item[key];
                }
              }
            }
            cost.push(per);
          });
          data.cost_belong_items = cost;
        }
        if (existy(values.note) && !is.empty(values.note)) {
          data.desc = values.note;
        }
        // 还没写完待添加
        if (existy(values.files_address) && !is.empty(values.files_address)) {
          data.files_address = values.files_address;
        }
        if (existy(values.bankName) && !is.empty(values.bankName)) {
          data.payee_info = {
            address: values.bankName,
            card_num: values.payeeAccount,
            name: values.payee,
          };
        }
        // 非表单获得项
        if (existy(values.order_id) && !is.empty(values.order_id)) {
          data.order_id = values.order_id;
        }
        return data;
      };
      this.props.dispatch({
        type: 'approval/typeApplyEditRentE',
        payload: transPayload(validateValue),
      });
    });
  }

  // 编辑科目一id初始化展示转换
  transSubjectEdit = (value) => {
    const { orderRecordDetails = [] } = this.props;
    const detail = dot.get(orderRecordDetails, '0', {});

    // 如果value是undefined证明是第一次进来还没有操作
    if (value === undefined) {
      // 获得科目数据数组
      const subjectList = dot.get(detail, 'catalog_id', []);
      let subjectOneId = '';  // 一级科目id
      // 得到一级科目的id
      subjectList.forEach((item) => {
        if (item.level === 1) {
          subjectOneId = item.catalog_id;
        }
      });
      return subjectOneId;  // 一级科目id
    } else {
      return value;
    }
  }
  // 基础信息
  renderBaseInfo = () => {
    const { orderRecordDetails = [] } = this.props;
    const detail = dot.get(orderRecordDetails, '0', {});

    const formItems = [
      {
        label: '房屋状态',
        form: ExpenseHouseState.description(ExpenseHouseState.sign),
      }, {
        label: '申请人',
        form: dot.get(detail, 'applyName', authorize.account.name),
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent title="基础信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 费用信息
  renderRentInfo = () => {
    const { orderRecordDetails = [], form = {} } = this.props;
    const detail = dot.get(orderRecordDetails, '0', {});

    const { getFieldDecorator } = form;
    // 合同日期范围
    let contractDateRanage = [];
    if (dot.has(detail, 'contract_start_date') && dot.has(detail, 'contract_end_date')) {
      contractDateRanage = [
        moment(dot.get(detail, 'contract_start_date'), 'YYYY-MM-DD'),
        moment(dot.get(detail, 'contract_end_date'), 'YYYY-MM-DD'),
      ];
    }
    const formItems = [
      {
        label: '月租金',
        form: getFieldDecorator('monthRent', {
          initialValue: dot.get(detail, 'month_rent', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="" addonAfter="元" />,
          ),
      }, {
        label: '付款月数（月／次）',
        form: getFieldDecorator('month', {
          initialValue: `${dot.get(detail, 'pay_time', 1)}`,
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Select placeholder="请选择付款月数">
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
            <Option value="5">5</Option>
            <Option value="6">6</Option>
            <Option value="7">7</Option>
            <Option value="8">8</Option>
            <Option value="9">9</Option>
            <Option value="10">10</Option>
            <Option value="11">11</Option>
            <Option value="12">12</Option>
          </Select>,
          ),
      }, {
        label: '提前付款天数',
        form: getFieldDecorator('days', {
          initialValue: dot.get(detail, 'payment_date', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="" addonAfter="天" />,
          ),
      }, {
        label: '续签时间段',
        form: getFieldDecorator('contractDateRanage', {
          initialValue: contractDateRanage,
          rules: [{ required: true, message: '请填写内容' }] })(
            <RangePicker />,
          ),
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    return (
      <CoreContent title="费用信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 项目信息
  renderExpenseInfo = () => {
    const { orderRecordDetails = [], form = {} } = this.props;
    const detail = dot.get(orderRecordDetails, '0', {});

    const { getFieldDecorator } = form;
    const formItems = [
      {
        label: '备注',
        form: getFieldDecorator('note', { initialValue: undefined })(
          <TextArea rows={2} />,
          ),
      }, {
        label: '上传附件',
        form: (
          <div>
            <CoreUpload isVerifyFileType onSuccess={this.onUploadSuccess} onFailure={this.onUploadFailure} />
            {
            this.state.fileList.map((item, index) => {
              return (
                <p key={index}>{item}<span onClick={() => { this.onClickDelete(index); }} className={styles['app-comp-expense-manage-template-records-form-sign-file']}>删除</span></p>
              );
            })
          }
          </div>
        ),
      },
    ];
    // 成本中心
    const expense = {
      costCenter: dot.get(detail, 'cost_center', undefined),  // 成本中心
      costBelong: dot.get(detail, 'cost_belong', undefined),  // 成本归属
      // 子项目
      costItems: dot.get(detail, 'cost_belong_items', []).map((item) => {
        return {
          platform: dot.get(item, 'platform_code', undefined),    // 平台
          vendor: dot.get(item, 'supplier_id', undefined),        // 供应商
          city: dot.get(item, 'city_spelling', undefined),        // 城市
          district: dot.get(item, 'biz_id', undefined),           // 商圈
          costCount: dot.get(item, 'custom_money', undefined),    // 自定义分配金额
        };
      }),
    };
    return (
      <CoreContent title="项目信息">
        {/* 成本中心，成本归属等等 */}
        {
          getFieldDecorator('expense', {
            initialValue: expense,
          })(
            <CommonExpense subjectOne={this.transSubjectEdit(undefined)} />,
          )
        }

        {/* 备注，上传 */}
        <DeprecatedCoreForm items={formItems} cols={1} layout={{ labelCol: { span: 3 }, wrapperCol: { span: 21 } }} />
      </CoreContent>
    );
  }

  // 支付信息
  renderPaymentInfo = () => {
    const { orderRecordDetails = [], form = {} } = this.props;
    const detail = dot.get(orderRecordDetails, '0', {});

    const { getFieldDecorator } = form;

    const formItems = [
      {
        label: '房租收款人',
        form: getFieldDecorator('payee', {
          initialValue: dot.get(detail, 'payee_info.name', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="请填写房租收款人" />,
          ),
      }, {
        label: '收款账号',
        form: getFieldDecorator('payeeAccount', {
          initialValue: dot.get(detail, 'payee_info.card_num', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="请填写收款账号" />,
          ),
      }, {
        label: '开户支行',
        form: getFieldDecorator('bankName', {
          initialValue: dot.get(detail, 'payee_info.address', undefined),
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="请填写开户支行" />,
          ),
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent title="支付信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 历史信息
  renderHistoryInfo = () => {
    const { orderRecordDetails = [] } = this.props;
    const detail = dot.get(orderRecordDetails, '0', {});

    const list = dot.get(detail, 'history_id_list', []);
    return (
      <CoreContent title="历史信息">
        {list.map((item, index) => {
          return <DetailRent key={index} detail={item} />;
        })}
      </CoreContent>
    );
  }

  render = () => {
    return (
      <Form layout="horizontal" onSubmit={this.onSubmitTemplate}>
        {/* 基础信息 */}
        {this.renderBaseInfo()}

        {/* 费用信息 */}
        {this.renderRentInfo()}

        {/* 项目信息 */}
        {this.renderExpenseInfo()}

        {/* 支付信息 */}
        {this.renderPaymentInfo()}

        {/* 历史信息 */}
        {this.renderHistoryInfo()}

        {/* 表单提交按钮 */}
        <CoreContent style={{ textAlign: 'center', backgroundColor: '#ffffff' }} >
          <Button type="primary" htmlType="submit">提交</Button>
        </CoreContent>
      </Form>
    );
  }
}

function mapStateToProps({ approval: { orderRecordDetails } }) {
  return { orderRecordDetails };
}
export default connect(mapStateToProps)(Form.create()(Index));
