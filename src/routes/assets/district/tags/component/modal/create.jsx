/**
 * 资产管理 - 商圈管理 - 商圈标签管理 = 新增&编辑标签弹窗
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Input, message } from 'antd';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { DeprecatedCoreForm } from '../../../../../../components/core';

// 弹窗操作类型
const OperateType = {
  create: 'create',
  update: 'update',
};

class Create extends React.Component {
  constructor() {
    super();
    this.private = {
      isSubmit: true, // 防止多次提交
    };
  }

  // 提交
  onSubmit = () => {
    const { form, type, dispatch, data = {} } = this.props;
    form.validateFields((err, val) => {
      if (err) return;

      const { _id: id = undefined } = data;

      const params = {
        id,
        ...val,
        onSuccessCallback: this.onSuccessCallback,
        onFailureCallback: this.onFailureCallback,
      };

      if (this.private.isSubmit) {
        // 新建
        type === OperateType.create && dispatch({ type: 'districtTag/createTag', payload: params });
        // 编辑
        type === OperateType.update && dispatch({ type: 'districtTag/updateTag', payload: params });
      }
      this.private.isSubmit = false;
    });
  }

  // 隐藏
  onCancel = () => {
    const { onCancel } = this.props;
    onCancel && onCancel();
  }

  // 成功回调
  onSuccessCallback = () => {
    const { onSearch } = this.props;
    message.success('操作成功');
    this.onCancel();
    onSearch && onSearch();
  }

  // 失败回调
  onFailureCallback = (res) => {
    res & message.error(res.zh_message);
    this.onCancel();
  }

  renderForm = () => {
    const { form, data } = this.props;

    const { getFieldDecorator } = form;

    const { name } = data;

    const formItems = [
      {
        label: '标签名称',
        form: getFieldDecorator('name',
          {
            rules: [
              { required: true, message: '请输入标签名称' },
              { min: 2, message: '标签名称为2-32个字符' },
              { max: 32, message: '标签名称为2-32个字符' },
              { pattern: /^\S+$/, message: '标签名称不能包含空格' },
            ],
            initialValue: name },
        )(
          <Input placeholder="请输入标签名称" />,
        ),
      },
    ];

    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

    return (
      <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
    );
  }

  renderMadal = () => {
    const { visible, type } = this.props;

    const title = type === OperateType.update ? '编辑标签' : '添加标签';

    return (
      <Modal
        title={title}
        visible={visible}
        onOk={this.onSubmit}
        onCancel={this.onCancel}
        okText="确认"
        cancelText="取消"
      >
        {this.renderForm()}
      </Modal>
    );
  }

  render() {
    return this.renderMadal();
  }
}

Create.propTypes = {
  visible: PropTypes.bool,
  form: PropTypes.object,
  type: PropTypes.string,
  dispatch: PropTypes.func,
  onCancel: PropTypes.func,
  data: PropTypes.object,
  onSearch: PropTypes.func,
};

Create.defaultProps = {
  visible: false,
  form: {},
  type: OperateType.create,
  dispatch: () => {},
  onCancel: () => {},
  data: {}, // 标签详情
  onSearch: () => {},
};

export default Form.create()(Create);

