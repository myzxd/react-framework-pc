/**
 * 租金表单的模版 & 该文件暂未使用
 */
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import CoreUpload from '../../../components/upload';
import { Unit, ExpenseCostCenterType } from '../../../../../application/define';

import CommonExpense from '../../common/expense';  // 成本中心，成本归属
import Collection from '../../common/collection';
import style from './style.css';

const { TextArea } = Input;

class Index extends Component {
  static propTypes = {
    title: PropTypes.string,
    formKey: PropTypes.string,
    onHookForm: PropTypes.func,
  }

  static defaultProps = {
    title: '',
    formKey: '',
    onHookForm: () => {},
  }

  constructor(props) {
    super(props);

    this.state = {
      fileList: [],                   // 文件列表
    };
    // 上传文件的随机key
    this.private = {
      namespace: `namespace${Math.floor(Math.random() * 100000)}`,
    };
  }

  componentDidMount() {
    const { formKey, onHookForm, form } = this.props;

    // 返回初始化的form对象
    if (onHookForm) {
      onHookForm(form, formKey);
    }
  }

  // 上传文件成功回调
  onUploadSuccess = (e) => {
    const list = this.state.fileList;
    list.push(e);
    this.setState({
      fileList: list,
    });
    this.props.form.setFieldsValue({ fileList: list });
  }

  // 删除文件
  onDeleteFile = (index) => {
    const list = this.state.fileList;
    list.splice(index, 1);
    this.setState({
      fileList: list,
    });
    this.props.form.setFieldsValue({ fileList: list });
  }

  // 改变科目回调
  onChangeSubject = (value) => {
    // 设置当前选择的科目id值
    this.setState({
      subjectOne: value.subjectOne || undefined,
    });
  }

  // 支付信息
  renderPaymentInfo = () => {
    const { form = {} } = this.props;
    const label = {
      cardNameLabel: '房租收款人',
    };
    const placeholder = {
      cardNamePlace: '请填写房租收款人',
    };
    return <Collection form={form} label={label} placeholder={placeholder} />;
  }

  // 租金信息
  renderRentInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const selectedCostCenterType = ExpenseCostCenterType.district;   // 成本中心默认商圈
    const formItems = [
      {
        label: '月租金',
        form: `${Unit.exchangePriceToYuan(1000)}元`,
      },
      {
        label: '租金时间段',
        form: '10000元',
      },
      {
        label: '合计金额',
        form: '10000元',
      },
    ];
    // 科目
    const formItemsSub = [
      {
        label: '科目',
        form: '房屋租金（10201）',
      },
    ];
    // 备注、上传
    const formItemsUp = [
      {
        label: '备注',
        form: getFieldDecorator('note')(
          <TextArea rows={2} />,
          ),
      }, {
        label: '上传附件',
        form: (
          <div>
            <CoreUpload namespace={this.private.namespace} isVerifyFileType onSuccess={this.onUploadSuccess} onFailure={this.onUploadFailure} />
            {
            this.state.fileList.map((item, index) => {
              return (
                <p key={index}>{item}<span onClick={() => { this.onDeleteFile(index); }} className={style['app-comp-expense-manage-template-create-rent-upload']}>删除</span></p>
              );
            })
          }
          </div>
        ),
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    return (
      <CoreContent title="租金信息" className={style['app-comp-expense-manage-template-create-rent']}>

        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />

        {/* 科目 */}
        <DeprecatedCoreForm items={formItemsSub} cols={3} layout={layout} />

        {/* 成本分摊 */}
        {
          getFieldDecorator('expense', { initialValue: {} })(
            <CommonExpense form={this.props.form} selectedCostCenterType={selectedCostCenterType} />,
          )
        }

        {/* 备注、上传 */}
        <DeprecatedCoreForm items={formItemsUp} cols={1} layout={{ labelCol: { span: 3 }, wrapperCol: { span: 21 } }} />

        {/* 支付信息 */}
        {this.renderPaymentInfo({ type: 'rent' })}
      </CoreContent>
    );
  }

  // 渲染隐藏表单
  renderHiddenForm = () => {
    const { fileList } = this.state;
    const { form } = this.props;

    const formItems = [
      {
        label: '',
        form: form.getFieldDecorator('fileList', { initialValue: fileList })(<Input hidden />),
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
        className={style['app-comp-expense-manage-template-create-rent-hide']}
        items={formItems}
        cols={1}
        layout={layout}
      />
    );
  }

  render = () => {
    const { title } = this.props;
    return (
      <Form layout="horizontal" >
        <CoreContent title={title}>
          {/* 租金信息 */}
          {this.renderRentInfo()}
        </CoreContent>
      </Form>
    );
  }
}

function mapStateToProps({ approval }) {
  return { approval };
}
export default connect(mapStateToProps)(Form.create()(Index));
