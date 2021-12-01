/**
 * 组织架构 - 部门管理 - 编辑部门弹窗
 */
import dot from 'dot-prop';
import React from 'react';
import PropTypes from 'prop-types';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Alert, Form } from 'antd';
import Drawer from 'antd/lib/drawer';

import Pid from '../pid';
import { CoreForm } from '../../../../../../components/core';
import { dotOptimal } from '../../../../../../application/utils';

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
// 弹窗类型
const Type = {
  create: 'create', // 创建
  update: 'update', // 编辑
};

class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      isShowNamePrompt: false, // 是否显示修改部门名称的提示
      isShowPidPrompt: false, // 是否显示修改上级部门的提示
      curPid: undefined, // 当前切换的上级部门
    };
    this.private = {
      isSubmit: true, // 防止多次提交
    };
    this.formRef = React.createRef();
  }

  // 上级部门onChange
  onChangePid = (val, option) => {
    const { detail } = this.props;
    const curPid = dot.get(option, 'children', undefined);

    // 上级部门
    const { pid = undefined } = detail;
    const { setFieldsValue } = this.formRef.current;
    setFieldsValue({ superior: val });

    // 修改上级部门
    if (pid && pid !== val) {
      this.setState({ isShowPidPrompt: true, curPid });
    } else {
      this.setState({ isShowPidPrompt: false });
    }
  }

  // 提交
  onSubmit = async () => {
    const { type, dispatch, detail, onSuccessCallback, onFailureCallback } = this.props;
    // 原有上级部门
    const originalPidName = dot.get(detail, 'parent_info.name', undefined);
    const { _id: id = undefined } = detail; // 部门id
    const formVal = await this.formRef.current.validateFields();
    const params = {
      id,
      ...formVal,
      onSuccessCallback: res => onSuccessCallback({ ...res, originalPidName, curPidName: this.state.curPid }),
      onFailureCallback,
      onChangeIsSubmit: () => { this.private.isSubmit = true; },    // 修改按钮状态
    };
    // 防止多次提交
    if (this.private.isSubmit) {
      // 编辑
      type === Type.update && dispatch({ type: 'department/updateDepartment', payload: params });
      // 新建
      type === Type.create && dispatch({ type: 'department/createDepartment', payload: params });
    }
    this.private.isSubmit = false;
  }

  // 自定义校验
  onVerify = (rule, value, callback) => {
    if (!value) {
      callback('请输入部门编号');
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

  // 隐藏
  onCancel = () => {
    const { onCancel } = this.props;
    onCancel && onCancel();
  }

  // 岗位名称onChange
  onChangeName = (e) => {
    // 部门详情
    const { detail = {} } = this.props;
    // 部门名称
    const { name = undefined } = detail;
    // 修改部门名称
    if (name && name !== e.target.value) {
      // 显示修改部门名称的提示
      this.setState({ isShowNamePrompt: true });
    } else {
      // 隐藏修改部门名称的提示
      this.setState({ isShowNamePrompt: false });
    }
  }

  renderForm = () => {
    const { detail = {}, isUpperDepartmentApprove } = this.props;

    const {
      name = undefined, // 部门名称
      code = undefined, // 部门编号
      pid: superior = '0', // 上级部门（0代表没有上级部门）
    } = detail;

    const formItems = [
      <Form.Item
        label="部门名称"
        name="name"
        initialValue={name}
        rules={[
          { required: true, message: '请输入部门名称' },
          { min: 2, message: '部门名称必须超过2个字' },
          { max: 32, message: '部门名称必须小于32个字' },
          { pattern: /^\S+$/, message: '部门名称不能包含空格' },
        ]}
      >
        <Input placeholder="请输入部门名称" onChange={this.onChangeName} />
      </Form.Item>,
      <Form.Item
        label="上级部门"
        name="superior"
        initialValue={superior || '0'}
        rules={[{ required: true, message: '请选择上级部门' }]}
      >
        <Pid
          onChangePid={this.onChangePid}
          disabled={!superior || superior === '0' || isUpperDepartmentApprove}
          curDepId={dot.get(detail, '_id', undefined)}
          otherChild={dotOptimal(detail, 'parent_info', {})}
        />
      </Form.Item>,
      <Form.Item
        label="部门编号"
        name="code"
        initialValue={code}
        rules={[
          { required: true, message: '请输入部门编号' },
          () => ({
            validator(rule, val) {
              const reg = /^[0-9a-zA-Z-]{1,}$/;
              if (!val || reg.test(val)) return Promise.resolve();
              return Promise.reject('请输入数字、字母或中横线');
            },
          }),
        ]}
      >
        <Input placeholder="请输入部门编号" />
      </Form.Item>,
    ];

    return (
      <Form
        ref={this.formRef}
        {...formLayout}
      >
        <CoreForm className="affairs-flow-basic" items={formItems} cols={1} />
      </Form>
    );
  }

  renderMadal = () => {
    const { visible, title, type } = this.props;
    const { isShowNamePrompt, isShowPidPrompt } = this.state;

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
              提交
            </Button>
          </div>
        )}
      >
        {
          isShowNamePrompt && type === Type.update ?
            <Alert message="部门名称已经修改，请及时修改部门编号" type="info" showIcon banner style={{ marginBottom: 10 }} />
            : null
        }
        {
          isShowPidPrompt && type === Type.update ?
            <Alert message="上级部门已经修改，请及时修改部门编号" type="info" showIcon banner style={{ marginBottom: 10 }} />
            : null
        }
        {this.renderForm()}
      </Drawer>
    );
  }

  // renderMadal = () => {
  //   const { visible, title, type } = this.props;
  //   const { isShowNamePrompt, isShowPidPrompt } = this.state;

  //   // 修改部门名称的提示
  //   const namePrompt = '部门名称已经修改，请及时修改部门编号';

  //   // 修改上级部门的提示
  //   const pidPrompt = '上级部门已经修改，请及时修改部门编号';

  //   return (
  //     <Modal
  //       title={title}
  //       visible={visible}
  //       onOk={this.onSubmit}
  //       onCancel={this.onCancel}
  //       okText="保存"
  //       cancelText="取消"
  //     >
  //       {
  //         isShowNamePrompt && type === Type.update ?
  //           <div className={style['organization-department-update-title']}>{namePrompt}</div>
  //           : null
  //       }
  //       {
  //         isShowPidPrompt && type === Type.update ?
  //           <div className={style['organization-department-update-title']}>{pidPrompt}</div>
  //           : null
  //       }
  //       {this.renderForm()}
  //     </Modal>
  //   );
  // }

  render() {
    return this.renderMadal();
  }
}

Index.propTypes = {
  type: PropTypes.string, // 提交类型
  title: PropTypes.string, // modal title
  visible: PropTypes.bool, // modal visible
  dispatch: PropTypes.func, // redux dispatch
  onCancel: PropTypes.func, // 隐藏弹窗
  detail: PropTypes.object, // 部门详情
  onSuccessCallback: PropTypes.func, // 请求成功回调
  onFailureCallback: PropTypes.func, // 请求失败回调
  isUpperDepartmentApprove: PropTypes.bool, // 调整上级部门是否需要审批
};

Index.defaultProps = {
  type: Type.update, // 提交类型
  title: undefined, // modal title
  visible: false, // modal visible
  dispatch: () => { },
  onCancel: () => { }, // 隐藏弹窗
  detail: {}, // 部门详情
  onSuccessCallback: () => { },
  onFailureCallback: () => { },
  isUpperDepartmentApprove: false,
};

export default Index;
