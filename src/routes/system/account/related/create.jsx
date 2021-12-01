/**
 * 关联账号，新建弹窗
 */
 import _ from 'lodash';
 import React, { useState } from 'react';
 import PropTypes from 'prop-types';
 import { connect } from 'dva';
 import '@ant-design/compatible/assets/index.css';
 import { Select, Modal, Form } from 'antd';
 import { CoreForm } from '../../../../components/core';

 const { Option } = Select;

 const Create = (props = {}) => {
   const {
     visible, // 控制模态框
     allAccounts, // 所有账号
     onSubmit,
     onHideModal, // 关闭弹窗的回调函数
   } = props;
   // 表单
   const [form] = Form.useForm();
   // 可用账号
   const [options, setOptions] = useState([]);

   // 提交
   const onClickSubmit = async () => {
     const formValues = await form.validateFields();
     onSubmit(formValues.addPhone);
   };

   // 取消
   const onCancel = () => {
     // 清空表单数据
     onHideModal('add');
     form.resetFields();
   };

   // 前端本地搜索
   const onSearch = (e) => {
     // 最新检索结果
     const optionsTemp = allAccounts.filter(item => item.phone === e);
     // 合并所有检索结果
     const optionsList = options.concat(optionsTemp);
     // 去重
     const data = _.uniqWith(optionsList, _.isEqual);
     setOptions(data);
   };

   // 渲染模态框
   const renderModalComponent = () => {
     const Layout = { labelCol: { span: 6 }, wrapperCol: { span: 10 } };

     const formItems = [
       <Form.Item
         label="关联账号"
         name="addPhone"
         rules={[{ required: true, message: '请输入关联账号' }]}
         {...Layout}
       >
         <Select
           style={{ width: '100%' }}
           placeholder="请输入关联账号"
           allowClear
           showSearch
           optionFilterProp="children"
           filterOption={false}
           mode="multiple"
           showArrow
           onSearch={onSearch}
         >
           {
             // 显示搜索结果账号
             options.map((item, index) => {
               // 显示搜索结果账号
               return <Option value={item.id} key={index}>{item.phone}({item.name})</Option>;
             })
           }
         </Select>
       </Form.Item>,
     ];

     return (
       <Modal title={'添加关联账号'} visible={visible} onOk={onClickSubmit} onCancel={onCancel}>
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

 Create.propTypes = {
   visible: PropTypes.bool, // 控制模态框
   allAccounts: PropTypes.any, // 所有账号
   onSubmit: PropTypes.func, // 提交信息
   onHideModal: PropTypes.func, // 关闭弹窗的回调函数
 };

 Create.defaultProps = {
   visible: false,
   allAccounts: [],
   onSubmit: () => { },
   onHideModal: () => { }, // 关闭弹窗的回调函数
 };

 function mapStateToProps({ system: { allAccounts } }) {
   return { allAccounts };
 }
 export default connect(mapStateToProps)(Create);

