/**
 * 添加岗位弹窗
 */
import { connect } from 'dva';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, Transfer } from 'antd';
import PropTypes from 'prop-types';
import { DeprecatedCoreForm } from '../../../../../components/core';
import { ExpenseExaminePostType } from '../../../../../application/define';

import style from './style.css';

class AddPost extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    allAccount: PropTypes.object.isRequired,
    postDate: PropTypes.object,
    isCreate: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    visible: false,
    form: {},
    dispatch: () => {},
    allAccount: {},
    postDate: {},
    isCreate: true,
  }

  constructor() {
    super();
    this.state = {};
  }

  componentDidMount = () => {
    const { postDate, form } = this.props;
    const { setFieldsValue } = form;

    // 编辑时的成员数据
    const { account_ids: accountIds } = postDate;

    // 编辑时，初始化设置默认值
    setFieldsValue({ member: accountIds });
    // 获取数据
    this.props.dispatch({ type: 'applicationCommon/fetchAllAccountName' });
  }

  // 按用户穿梭框改变值
  onChangeMembers = (values) => {
    this.setState({
      accountIds: values,
    });
  }

  // 穿梭框确认
  onOkModal = () => {
    // 判断新建 || 编辑
    const { isCreate, postDate } = this.props;
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const { _id: id, state } = postDate;

      const params = {
        ...values,
        id,
        onSuccessCallback: this.onAddSuccessCallback,  // 成功的回调函数
      };

      // 新建
      if (isCreate) {
        this.props.dispatch({ type: 'expenseExamineFlow/createPost', payload: params });
      } else if (state === ExpenseExaminePostType.draft) {
        // 草稿状态编辑
        this.props.dispatch({ type: 'expenseExamineFlow/updatePost', payload: params });
      } else if (state === ExpenseExaminePostType.normal) {
        // 正常状态编辑
        this.props.dispatch({ type: 'expenseExamineFlow/managementPost', payload: params });
      }
      this.props.onCancel();  // 穿梭框取消
    });
  }

  // 穿梭框取消
  onCancelModal = () => {
    const { resetFields } = this.props.form;
    // 隐藏弹窗，重置表单
    resetFields();
    this.props.onCancel();
  }

  onAddSuccessCallback = () => {
    this.props.dispatch({
      type: 'expenseExamineFlow/fetchExaminePost',
      payload: { meta: { page: 1, limit: 30 } },
    });
  }

  // 渲染tab标签
  renderTransfer = () => {
    const { getFieldDecorator, getFieldsValue } = this.props.form;

    // 编辑的岗位数据
    const { postDate } = this.props;

    const {
      post_name: name = undefined, // 岗位名称
      state, // 岗位状态
    } = postDate;

    const isDisable = state === ExpenseExaminePostType.normal;

    // 系统人员数据
    const { nameTree: dataSource = [] } = this.props.allAccount;

    // 岗位名称
    const postName = [
      {
        label: '',
        form: getFieldDecorator('name', {
          rules: [
            {
              required: true,
              max: 64,
              message: '岗位名称不能为空且不能超过64字符',
            },
          ],
          initialValue: name })(
            <Input placeholder="请输入岗位名称" disabled={isDisable} />,
        ),
      },
    ];

    // 岗位成员所选值
    const value = getFieldsValue(['member']).member;

    // 岗位成员
    const postMembers = [
      {
        label: '',
        form: getFieldDecorator('member')(
          <Transfer
            dataSource={dataSource}
            showSearch
            rowKey={record => record.key}
            targetKeys={value}
            render={item => item.title}
            className={style['app-comp-expense-post-members']}
            listStyle={{
              height: 400,
            }}
            titles={['全选／合计', '全选／合计']}
          />,
        ),
      },
    ];

    const layout = { labelCol: { span: 0 }, wrapperCol: { span: 24 } };

    return (
      <Modal
        title="添加岗位"
        visible={this.props.visible}
        onOk={this.onOkModal}
        onCancel={this.onCancelModal}
      >
        <h4 className={style['app-comp-expense-post-jobs-name']}><span className={style['app-comp-expense-required']} />岗位名称</h4>

        <DeprecatedCoreForm items={postName} cols={1} layout={layout} />

        <h4 className={style['app-comp-expense-post-jobs-members']}>岗位成员</h4>

        <DeprecatedCoreForm items={postMembers} cols={1} layout={layout} />
      </Modal>
    );
  }

  render =() => {
    return this.renderTransfer();
  }
}

function mapStateToProps({ applicationCommon: { allAccount } }) {
  return { allAccount };
}

const AddPostComponent = Form.create()(AddPost);

export default connect(mapStateToProps)(AddPostComponent);
