/**
 * 新增合同 - 员工编辑页 - 弹窗
 */
import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import PropTypes from 'prop-types';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { Modal, DatePicker, Select, Input, InputNumber, Message } from 'antd';

// import CorePhotos from '../../../components/corePhotos';
import { DeprecatedCoreForm } from '../../../../../../../../components/core';
import { CommonSelectCompanies } from '../../../../../../../../components/common';
import { SignContractType, ThirdCompanyState, ThirdCompanyType, ContractType } from '../../../../../../../../application/define/index';


const { Option } = Select;

class Index extends React.Component {

  static propTypes = {
    isShowModal: PropTypes.bool, // 弹窗显示
    onCloseModal: PropTypes.func,  // 关闭弹窗的回调函数
  }

  static defaultProps = {
    isShowModal: false,
    onCloseModal: undefined,
  }

  constructor() {
    super();
    this.state = {
    };
  }


  // 更改档案类型点击确定
  onModalClickOk = () => {
    const { onCloseModal, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let flag = false;             // 校验签约周期的标识
        switch (values.signCycleUnit) {
          case '10':
            if (values.signCycle < 1 || values.signCycle > 6) {
              Message.error('签约周期年数只能是1-6年');
              flag = true;
            }
            break;
          case '20':
            if (values.signCycle < 1 || values.signCycle > 12) {
              Message.error('签约周期月数只能是1-12月');
              flag = true;
            }
            break;
          case '30':
            if (values.signCycle < 1 || values.signCycle > 365) {
              Message.error('签约周期天数只能是1-365天');
              flag = true;
            }
            break;
          default:
            break;
        }
        if (flag) {
          return;
        }
        const params = {
          identityCardId: this.props.idCard,
          phone: this.props.phone,
          name: this.props.name,
          signingType: values.signingType,
          effectiveDate: moment(values.effectiveDate).format('YYYYMMDD'),
          contractBelong: values.contractBelong,
          contractType: values.contractType,
          signCycle: values.signCycle,
          signCycleUnit: values.signCycleUnit,
          contractNumber: values.contractNumber,
          contractPhoto: values.contractPhoto,
          onSuccessCallBack: this.onSuccessCallBack,
        };
        this.props.dispatch({ type: 'fileChange/createContract', payload: params });
        onCloseModal();
        form.resetFields();        // 重置表单数据
      }
    });
  }

  // 更改档案类型点击取消
  onModalClickCancel = () => {
    const { onCloseModal, form } = this.props;
    onCloseModal();
    form.resetFields();           // 重置表单数据
  }

  onSuccessCallBack = () => {
    const { idCard } = this.props;
    this.props.dispatch({ type: 'fileChange/fetchNewContractInfo', payload: { id: idCard } });
  }

  // 合同生效日期选择的回调
  onChangeEffectiveDate = () => {

  }

  // 合同生效日期限制
  disableEffectiveDate = (current) => {
    return current < moment().subtract(1, 'month') || current > moment().add(1, 'month');
  }

  // 渲染表单
  renderForm = () => {
    const { getFieldDecorator } = this.props.form;
    const formItems = [
      {
        label: '签约类型',
        form: getFieldDecorator('signingType', { rules: [{ required: true, message: '签约类型不能为空' }] })(
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder="签约类型"
            onChange={this.onChangeApplicationOrder}
          >
            <Option key={SignContractType.paper} value={SignContractType.paper}>{SignContractType.description(SignContractType.paper)}</Option>
          </Select>,
        ),
      },
      {
        label: '合同生效日期',
        key: 'effectiveDate',
        form: getFieldDecorator('effectiveDate', { initialValue: null, rules: [{ required: true, message: '合同生效日期不能为空' }] })(
          <DatePicker onChange={this.onChangeEffectiveDate} disabledDate={this.disableEffectiveDate} style={{ width: '100%' }} />,
        ),
      },
      {
        label: '合同甲方',
        key: 'contractBelong',
        form: getFieldDecorator('contractBelong', {
          rules: [{ required: true, message: '请选择内容' }],
        })(
          <CommonSelectCompanies
            style={{ width: '100%' }}
            placeholder="请选择合同归属"
            state={ThirdCompanyState.on}
            type={ThirdCompanyType.staffProfile}
          />,
        ),
      },
      {
        // 人员档案只有劳动合同
        label: '合同类型',
        key: 'contractType',
        form: getFieldDecorator('contractType', {
          rules: [{ required: true, message: '请选择内容' }],
        })(
          <Select placeholder="请选择合同类型">
            <Option value={ContractType.labor}>{ContractType.description(ContractType.labor)}</Option>
          </Select>,
        ),
      },
      {
        label: '签约周期',
        key: 'signCycle',
        form: <span>{getFieldDecorator('signCycle', { initialValue: 1, rules: [{ required: true, message: '签约周期不能为空' }] })(
          <InputNumber style={{ width: 200 }} max={365} min={1} precision={0} placeholder="请输入周期数" />,
        )}{getFieldDecorator('signCycleUnit', { initialValue: '10' })(
          <Select placeholder="请选择单位" style={{ width: '104px', marginLeft: '10px' }}>
            <Option value="10">年</Option>
            <Option value="20">月</Option>
            <Option value="30">日</Option>
          </Select>,
        )}</span>,
      },
      {
        label: '合同编号',
        key: 'contractNumber',
        form: getFieldDecorator('contractNumber')(
          <Input placeholder="请输入合同编号" />,
        ),
      },
      // {
      //   label: '合同照片',
      //   key: 'contractPhoto',
      //   form: getFieldDecorator('contractPhoto')(
      //     <CorePhotos multiple namespace="createContractPhoto" />,
      //   ),
      // },
    ];
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
    return (
      <Form layout="horizontal" >
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </Form>
    );
  }

  render() {
    const { isShowModal } = this.props;
    const okButtonProps = {
      style: {
        marginLeft: '40px',
      },
    };
    return (
      <Modal
        title="新增合同"
        visible={isShowModal}
        onOk={this.onModalClickOk}
        onCancel={this.onModalClickCancel}
        okButtonProps={okButtonProps}
      >
        {/* 渲染表单 */}
        {this.renderForm()}
      </Modal>
    );
  }
}

export default connect()(Form.create({ name: 'CreateContract' })(Index));
