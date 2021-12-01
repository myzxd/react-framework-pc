/**
 * 组织架构 - 部门管理 - 新建/编辑岗位弹窗
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button } from 'antd';
import Drawer from 'antd/lib/drawer';

import { DeprecatedCoreForm } from '../../../../../../components/core';
import StaffName from '../staffName';

const TextArea = Input.TextArea;
// 弹窗类型
const Type = {
  create: 'create',
  update: 'update',
};

class Index extends React.Component {
  // 定义岗位职级字段
  static getDerivedStateFromProps(props, state) {
    const { detail: prevDetail = {} } = props;
    const { detail = {} } = state;
    if (Object.keys(detail).length === 0 && Object.keys(prevDetail).length !== 0) {
      // 岗位职级
      const { job_info: { rank = undefined } = {} } = prevDetail;
      return { rank, detail: prevDetail };
    }
    return null;
  }

  constructor() {
    super();
    this.state = {
      rank: undefined,
      detail: {},
    };
    this.private = {
      isSubmit: true, // 防止多次提交
    };
  }

  // 提交
  onSubmit = () => {
    const { type, form, dispatch, detail, departmentDetail, onSuccessCallback, onFailureCallback } = this.props;

    const {
      _id: id = undefined,
    } = detail; // 岗位id
    const { _id: departmentId } = departmentDetail; // 部门id
    form.validateFields((err, val) => {
      if (err) return;
      const params = {
        ...val,
        departmentId,
        onSuccessCallback,
        onFailureCallback,
      };

      type === Type.update && (params.jobId = id);
      type === Type.create && (params.jobId = val.jobId);

      if (this.private.isSubmit) {
        // 编辑
        type === Type.update && dispatch({ type: 'organizationStaffs/updateDepartmentStaff', payload: params });
        // 新建
        type === Type.create && dispatch({ type: 'organizationStaffs/createDepartmentStaff', payload: params });
      }
      this.private.isSubmit = false;
    });
  }

  // 自定义校验
  onVerify = (rule, value, callback) => {
    // 岗位详情
    const { detail } = this.props;
    // 岗位下在编人数
    const { organization_num: organizationNum = undefined } = detail;
    if (!value && value !== 0) {
      callback('请输入岗位编制数量');
      return;
    }
    // 字母、数字、下划线
    const reg = /^\+?[0-9][0-9]*$/;
    if (!reg.test(value)) {
      callback('请输入正整数');
      return;
    }
    if (organizationNum && Number(value) < Number(organizationNum)) {
      callback('岗位编制数需大于当前该岗位在编人数');
      return;
    }
    callback();
  }


  // 隐藏
  onCancel = () => {
    const { onCancel } = this.props;
    onCancel && onCancel();
  }

  // 修改岗位名称
  onChange = (val, options) => {
    // 岗位职级
    const { rank = undefined } = options;
    const { form } = this.props;
    const { setFieldsValue } = form;
    setFieldsValue({ jobId: val });

    // 更新对应岗位的职级信息
    this.setState({ rank });
  }

  renderForm = () => {
    const { rank = undefined } = this.state;
    const { form, departmentDetail = {}, detail, type } = this.props;
    const {
      name = undefined, // 部门名称
    } = departmentDetail;

    const {
      job_info: {
        _id: jobId = undefined, // 岗位id
      } = {}, // 岗位信息
      description = undefined, // 岗位描述
      organization_count: organizationCount = undefined, // 岗位编制数
    } = detail;

    const disabled = type === Type.update;

    const { getFieldDecorator } = form;
    const formItems = [
      {
        label: '岗位名称',
        form: getFieldDecorator('jobId',
          {
            rules: [
              { required: true, message: '请选择岗位名称' },
            ],
            initialValue: jobId,
          },
        )(
          <StaffName disabled={disabled} onChange={this.onChange} />,
        ),
      },
      {
        label: '所属部门',
        form: name || '--',
      },
      {
        label: '岗位职级',
        form: rank || '--',
      },
      {
        label: '岗位编制数',
        form: getFieldDecorator('organizationCount',
          {
            rules: [
              { required: true, validator: this.onVerify },
            ],
            initialValue: organizationCount,
            validateTrigger: this.onSubmit,
          },
        )(
          <Input placeholder="请输入岗位编制数量" />,
        ),
      },
      {
        label: '岗位描述',
        form: getFieldDecorator('description',
          { initialValue: description },
        )(
          <TextArea rows={6} placeholder="请输入岗位描述" />,
        ),
      },
    ];

    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

    return (
      <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
    );
  }

  renderMadal=() => {
    const { visible, title } = this.props;
    return (
      <Drawer
        title={title}
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
            <Button onClick={this.onSubmit} type="primary">
            确定
          </Button>
          </div>
      )}
      >
        {this.renderForm()}
      </Drawer>
    );
  }

  // renderMadal = () => {
  //   const { visible, title } = this.props;

  //   return (
  //     <Modal
  //       title={title}
  //       visible={visible}
  //       onOk={this.onSubmit}
  //       onCancel={this.onCancel}
  //       okText="保存"
  //       cancelText="取消"
  //     >
  //       {this.renderForm()}
  //     </Modal>
  //   );
  // }

  render() {
    return this.renderMadal();
  }
}

Index.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string,
  visible: PropTypes.bool,
  form: PropTypes.object,
  dispatch: PropTypes.func,
  onCancel: PropTypes.func,
  detail: PropTypes.object,
  onSuccessCallback: PropTypes.func,
  onFailureCallback: PropTypes.func,
  departmentDetail: PropTypes.object,
};

Index.defaultProps = {
  detail: {}, // 岗位详情
  type: Type.update, // 提交类型
  title: undefined, // modal title
  visible: false, // modal visible
  form: {},
  dispatch: () => {},
  onCancel: () => {}, // 隐藏弹窗
  departmentId: '', // 部门id
  onSuccessCallback: () => {},
  onFailureCallback: () => {},
  departmentDetail: {}, // 部门详情
};

export default Form.create()(Index);

