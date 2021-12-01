/**
 * 组织架构 - 部门管理 = 设置负责人弹窗
 */
import { connect } from 'dva';
import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, Button } from 'antd';
import Drawer from 'antd/lib/drawer';

import { DeprecatedCoreForm } from '../../../../../../components/core';


const Option = Select.Option;

class Principal extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.private = {
      isSubmit: true, // 防止多次提交
    };
  }

  componentDidMount() {
    const { dispatch, departmentId = undefined } = this.props;
    // departmentId存在时，请求数据
    departmentId && dispatch({ type: 'department/getDepartmentMember', payload: { id: departmentId, limit: 9999, page: 1 } });
  }

  // 提交
  onSubmit = () => {
    const { form, dispatch, departmentId, onSuccessCallback, onFailureCallback } = this.props;
    form.validateFields((err, val) => {
      if (err) return;
      const { administratorId } = val;
      // 请求参数
      const params = {
        id: departmentId,
        administratorId: administratorId || 'remove', // 负责人id（参数存在时，请求参数为'remove'）
        onSuccessCallback,
        onFailureCallback,
      };

      if (this.private.isSubmit && departmentId) {
        // 编辑
        dispatch({ type: 'department/updateDepartment', payload: params });
      }
      this.private.isSubmit = false;
    });
  }

  // 隐藏
  onCancel = () => {
    const { onCancel } = this.props;
    onCancel && onCancel();
  }

  // 表单
  renderForm = () => {
    const {
      form,
      principal,
      departmentMember = {}, // 部门下成员列表
    } = this.props;

    const {
      data = [],
    } = departmentMember;

    const { getFieldDecorator } = form;
    const formItems = [
      {
        label: '负责人',
        form: getFieldDecorator('administratorId',
          {
            // rules: [
            //   { required: true, message: '请选择负责人' },
            // ],
            initialValue: principal,
          },
        )(
          <Select allowClear style={{ width: '100%' }} placeholder="请选择负责人" showSearch optionFilterProp="children">
            {
              data.map((item) => {
                return <Option key={item._id} value={item._id}>{item.name}</Option>;
              })
            }
          </Select>,
        ),

      },
    ];

    const layout = { labelCol: { span: 5 }, wrapperCol: { span: 16 } };

    return (
      <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
    );
  }

  renderMadal=() => {
    const { visible, departmentMember = {} } = this.props;
    const { data = [] } = departmentMember;

    // 是否禁用
    const disabled = data.length === 0;
    return (
      <Drawer
        title="设置部门负责人"
        width={400}
        onClose={this.onCancel}
        visible={visible}

        bodyStyle={{ paddingBottom: 80 }}
        footer={(
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={this.onCancel} style={{ marginRight: 8 }}>
            取消
          </Button>
            <Button disabled={disabled} onClick={this.onSubmit} type="primary">
            提交
          </Button>
          </div>
      )}
      >
        {this.renderForm()}
      </Drawer>
    );
  }

  // renderMadal = () => {
  //   const { visible, departmentMember = {} } = this.props;
  //   const { data = [] } = departmentMember;

  //   // 是否禁用
  //   const disabled = data.length === 0;

  //   return (
  //     <Modal
  //       title="设置部门负责人"
  //       visible={visible}
  //       onOk={this.onSubmit}
  //       onCancel={this.onCancel}
  //       okText="保存"
  //       cancelText="取消"
  //       okButtonProps={{ disabled }}
  //     >
  //       {this.renderForm()}
  //     </Modal>
  //   );
  // }

  render() {
    return this.renderMadal();
  }
}

function mapStateToProps({
  department: {
    departmentMember, // 部门下成员信息
  },
}) {
  return { departmentMember };
}

Principal.propTypes = {
  departmentId: PropTypes.string, // 部门id
  principal: PropTypes.string, // 负责人
  visible: PropTypes.bool, // 设置部门负责人drawer visible
  form: PropTypes.object, // form表单
  dispatch: PropTypes.func, // redux dispatch
  onCancel: PropTypes.func, // 隐藏部门负责人drawer
  onSuccessCallback: PropTypes.func, // 请求成功回调
  onFailureCallback: PropTypes.func, // 请求失败回调
  departmentMember: PropTypes.object, // 部门下成员信息
};

Principal.defaultProps = {
  departmentId: undefined,
  principal: undefined,
  visible: false,
  form: {},
  dispatch: () => {},
  onCancel: () => {},
  onSuccessCallback: () => {},
  onFailureCallback: () => {},
  departmentMember: {},
};

export default Form.create()(connect(mapStateToProps)(Principal));
