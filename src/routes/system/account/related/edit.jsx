/**
 * 关联账号，编辑弹窗
 */
import _ from 'lodash';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import dot from 'dot-prop';
import '@ant-design/compatible/assets/index.css';
import { Select, Modal, Form } from 'antd';
import { CoreForm } from '../../../../components/core';

const { Option } = Select;

const Edit = (props = {}) => {
  const {
    visible, // 控制模态框
    allAccounts, // 所有账号
    onSubmit,
    onHideModal, // 关闭弹窗的回调函数
    optionIds,            // 当前编辑数据
  } = props;

  // 表单
  const [form] = Form.useForm();
  // 可用账号
  const [options, setOptions] = useState([]);

  const onSearch = (e) => {
    // 最新检索结果
    const optionsTemp = allAccounts.filter(item => item.phone === e);
    // 合并所有检索结果
    const optionsList = options.concat(optionsTemp);
    setOptions(optionsList);
  };

  // 提交
  const onClickSubmit = async () => {
    const formValues = await form.validateFields();
    onSubmit(formValues.addPhone);
  };

  // 取消
  const onCancel = () => {
    onHideModal('edit');
    // 清空表单数据
    form.resetFields();
  };

  // 渲染模态框
  const renderModalComponent = () => {
    // 编辑时显示已关联账号
    const showAccounts = [];
    // 初始化账号id
    const initialAccoutsIs = [];
    allAccounts.forEach((item) => {
      // 展示已关联账号
      const accountIds = dot.get(optionIds, 'account_ids', []);
      // 寻找已关联账号
      for (let i = 0; i < accountIds.length; i += 1) {
        // 如果id一样则加入已关联账号列表
        if (accountIds[i] === item.id) {
          initialAccoutsIs.push(item.id);
          showAccounts.push(item);
        }
      }
    });

    // 合并初始化数据和检索结果
    const list = _.uniqWith(showAccounts.concat(options), _.isEqual);
    const Layout = { labelCol: { span: 6 }, wrapperCol: { span: 10 } };

    const formItems = [
      <Form.Item
        label="关联账号"
        name="addPhone"
        rules={[{ required: true, message: '请输入关联账号' }]}
        initialValue={initialAccoutsIs}
        {...Layout}
      >
        <Select
          placeholder="请输入关联账号"
          allowClear
          showSearch
          optionFilterProp="children"
          mode="multiple"
          showArrow
          onSearch={onSearch}
        >
          {
            // 是否根据手机号检索
            (options.length > 0 ? list : showAccounts).map((item, index) => {
              const key = item.id + index;
              // 显示搜索结果账号
              return <Option value={item.id} key={key}>{item.phone}({item.name})</Option>;
            })
          }
        </Select>
      </Form.Item>,
    ];

    return (
      <Modal
        title={'编辑关联账号'}
        visible={visible}
        onOk={onClickSubmit}
        onCancel={onCancel}
      >
        <Form layout="horizontal" form={form}>
          <CoreForm items={formItems} cols={1} />
        </Form>
      </Modal>
    );
  };

  return (
    <div>
      {/* 渲染添加关联账号 */}
      {renderModalComponent()}
    </div>
  );
};

Edit.propTypes = {
  allAccounts: PropTypes.any,        // 列表数据
  visible: PropTypes.bool,                // 模态框
  optionIds: PropTypes.any,            // 当前编辑数据
};

Edit.defaultProps = {
  visible: false,
  allAccounts: [],        // 列表数据
  optionIds: undefined,            // 当前编辑数据
};

function mapStateToProps({ system: { allAccounts } }) {
  return { allAccounts };
}
export default connect(mapStateToProps)((Edit));
