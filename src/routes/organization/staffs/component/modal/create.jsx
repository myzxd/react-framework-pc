/**
 * 组织架构 - 岗位管理 = 列表组件 - 创建岗位弹窗
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, message, Select } from 'antd';

import { DeprecatedCoreForm } from '../../../../../components/core';

class Create extends React.Component {
  constructor() {
    super();
    this.private = {
      isSubmit: true, // 防止多次提交
    };
  }

  // 自定义校验
  onVerify = (rule, value, callback) => {
    if (!value) {
      callback('请输入岗位编号');
      return;
    }
    // 字母、数字、下划线
    const reg = /^[0-9a-zA-Z-]{1,}$/;
    if (!reg.test(value)) {
      callback('请输入数字、字母和中横线');
      return;
    }
    callback();
  }

  // 标签校验规则
  onTagVerify = (rule, value = [], callback) => {
    const reg = /^\S+$/;
    const isSpace = value.find(i => !reg.test(i));
    // value.find(i => !/[;|；]/g.test(i))
    if (value.some(i => /[;|；]/g.test(i))) {
      return callback('标签名称不能包含分号');
    }
    if (value.length > 0 && isSpace) {
      callback('标签名称不能包含空格');
      return;
    }
    callback();
  }

  // 岗位职级的自定义校验
  onVerifyRank = (rule, value, callback) => {
    if (!value) {
      callback('请输入岗位职级');
      return;
    }

    // 空格
    const regSpace = /^\S+$/;
    if (!regSpace.test(value)) {
      callback('岗位职级不能包含空格');
      return;
    }

    // 汉字
    const regCn = /[\u4e00-\u9fa5]/;
    if (regCn.test(value)) {
      callback('岗位职级不能包含汉字');
      return;
    }

    callback();
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
        onSuccessCallback: () => {
          // 更新查询条件岗位列表数据
          dispatch({ type: 'organizationStaff/getAllStaffList', payload: {} });
          this.onSuccessCallback();
        },
        onFailureCallback: this.onFailureCallback,
      };

      if (this.private.isSubmit) {
        // 新建
        type === 'create' && dispatch({ type: 'organizationStaff/createStaff', payload: params });
        // 编辑
        type === 'update' && dispatch({ type: 'organizationStaff/updateStaff', payload: params });
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
    const { onSearch, type } = this.props;
    message.success('操作成功');
    this.onCancel();
    onSearch && onSearch({},
      type === 'update' ? true : false, // 编辑为true，清空查询条件和列表请求参数
    );
  }

  // 失败回调
  onFailureCallback = () => {
    this.onCancel();
  }

  renderForm = () => {
    const { form, type, data } = this.props;

    const { getFieldDecorator } = form;

    const { name, code, rank, apply_tags: tags = [] } = data;

    const formItems = [
      {
        label: '岗位名称',
        form: getFieldDecorator('staffName',
          {
            rules: [
              { required: true, message: '请输入岗位名称' },
              { min: 2, message: '岗位名称必须超过2个字' },
              { max: 32, message: '岗位名称必须小于32个字' },
            ],
            initialValue: name },
        )(
          <Input placeholder="请输入岗位名称" />,
        ),
      },
      {
        label: '岗位编号',
        form: getFieldDecorator('staffNum',
          { rules: [{ required: true, validator: this.onVerify }],
            initialValue: code,
          },
        )(
          <Input disabled={type === 'update' ? true : false} placeholder="请输入岗位编号" />,
        ),
      },
      {
        label: '岗位职级',
        form: getFieldDecorator('staffRank',
          { rules: [{ required: true, validator: this.onVerifyRank }],
            initialValue: rank,
          },
        )(
          <Input placeholder="请输入岗位职级" />,
        ),
      },
      {
        label: '审批岗标签',
        form: getFieldDecorator('tags',
          {
            rules: [
              { validator: this.onTagVerify },
            ],
            initialValue: tags,
          },
        )(
          <Select
            mode="tags"
            placeholder="请输入审批岗位标签"
            style={{ width: '100%' }}
          />,
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

    const title = type === 'update' ? '编辑岗位' : '创建岗位';

    return (
      <Modal
        title={title}
        visible={visible}
        onOk={this.onSubmit}
        onCancel={this.onCancel}
        okText="保存"
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
};

Create.defaultProps = {
  visible: false,
  form: {},
  type: 'create',
  dispatch: () => {},
  onCancel: () => {},
  data: {}, // 岗位详情
};

export default Form.create()(Create);

