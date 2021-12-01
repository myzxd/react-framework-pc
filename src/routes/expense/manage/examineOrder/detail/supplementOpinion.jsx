/**
 * 付款审批 - 补充意见操作
 */
import is from 'is_js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Modal, Button, message } from 'antd';
import dot from 'dot-prop';
import { DeprecatedCoreForm, CoreFinder } from '../../../../../components/core';
import { Alternatives } from '../../../../../application/define';
import CoreUpload from '../../../components/uploadAmazon';
import AlternativedTextBox from '../../../components/alternativedTextBox';
import CommonTab from './commonTab';

const { CoreFinderList } = CoreFinder;


class SupplementOpinion extends Component {

  static propTypes = {
    orderId: PropTypes.string,  // 审批单id
    recordId: PropTypes.string, // 审批单流转记录id
  }

  constructor(props) {
    super();
    this.state = {
      visible: false, // 是否显示弹窗
      fileList: [],   // 上传文件列表
    };
    this.private = {
      namespace: `namespace${Math.floor(Math.random() * 100000)}`,      // 命名空间
      dispatch: props.dispatch,
    };
  }

  componentDidMount() {
    const { formKey, onHookForm } = this.state;
    const { form } = this.props;

    // 返回初始化的form对象
    if (onHookForm) {
      onHookForm(form, formKey);
    }
  }

  // 显示弹窗
  onShowModal = () => {
    this.setState({ visible: true });
  }

  // 隐藏弹窗
  onHideModal = () => {
    this.setState({ visible: false, detail: {}, fileList: [], onSuccessCallback: undefined });
    this.props.form.resetFields();
  }

  // tab状态
  onChangeTab = (v) => {
    this.setState({ activeKey: v });
    this.props.form.setFieldsValue({ note: '' });
  }

  // 添加项目
  onSubmit = () => {
    const { orderId, recordId } = this.props;
    const { fileList } = this.state;
    this.props.form.validateFields((err, values) => {
      // 错误判断
      if (err) {
        return;
      }
      if (values.note === undefined && is.empty(fileList)) {
        return message.error('请填写意见或上传文件');
      }

      // 定义需要提交的参数
      const params = {
        id: orderId,        // 审批单id
        recordId,      // 审批单流转记录id
        onSuccessCallback: this.onSuccessCallback,  // 成功的回调函数
        onFailureCallback: this.onSuccessCallback,  // 失败的回调函数，重新刷新数据
      };

      // 判断补充意见是否存在
      if (is.existy(values.note) && is.not.empty(values.note)) {
        params.note = values.note;
      }

      // 判断上传文件是否存在
      if (is.existy(fileList) && is.not.empty(fileList)) {
        params.fileList = fileList;
      }

      this.props.dispatch({ type: 'expenseExamineOrder/updataSupplementOpinion', payload: params });
    });
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


  // 删除成功后后重新刷新数据
  onSuccessCallback = () => {
    const { orderId } = this.props;
    // 如果审批单id不为空，则获取审批单详情数据
    if (orderId !== undefined) {
      this.props.dispatch({ type: 'expenseExamineOrder/fetchExamineOrderDetail', payload: { id: orderId } });
      this.props.dispatch({ type: 'expenseCostOrder/fetchCostOrders', payload: { examineOrderId: orderId } });
    }
    this.onHideModal();
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

  // 渲染弹窗内容
  renderModal = () => {
    const { getFieldDecorator } = this.props.form;
    const { visible, fileList = [], activeKey } = this.state;
    const defaultActiveKey = this.props.isPaymentNode ? Alternatives.finance : Alternatives.often;  // tab状态
    const alternativeKey = activeKey || defaultActiveKey;
    // 注册隐藏的表单
    getFieldDecorator('fileList', { initialValue: fileList })(<Input hidden />);

    const formItems = [
      {
        label: '意见',
        form: getFieldDecorator('note', { rules: [{ max: 1000, message: '意见不能超过1000' }] })(
          <AlternativedTextBox
            alternatives={Alternatives.conversionData(alternativeKey)}
            placeholder="请输入意见"
            rows={4}
          />,
        ),
      }, {
        label: '附件上传',
        form: (
          <div>
            {
              <CoreUpload domain="cost" namespace={this.private.namespace} onSuccess={this.onUploadSuccess} onFailure={this.onUploadFailure} />
            }
            {this.renderCorePreview(fileList)}
          </div>
        ),
      },
    ];
    const layout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };
    return (
      <Modal width={650} visible={visible} onOk={this.onSubmit} onCancel={this.onHideModal} >
        <CommonTab title="补充意见" activeKey={alternativeKey} onChange={this.onChangeTab} />
        <Form layout="horizontal">
          <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
        </Form>
      </Modal>
    );
  }

  render = () => {
    return (
      <div>
        {/* 渲染操作弹窗 */}
        {this.renderModal()}

        {/* 渲染文案 */}
        <Button onClick={this.onShowModal}>补充意见</Button>

      </div>
    );
  }
}

export default Form.create()(SupplementOpinion);
