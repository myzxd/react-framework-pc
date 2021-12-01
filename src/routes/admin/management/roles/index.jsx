/**
 * 角色，职位，权限 对照显示模块
 */
 import React, { useState } from 'react';
 import is from 'is_js';
 import dot from 'dot-prop';
 import { connect } from 'dva';
 import { Form } from '@ant-design/compatible';
 import '@ant-design/compatible/assets/index.css';
 import { Table, Modal, Empty, Popconfirm, Popover, message, Button, Input, Select } from 'antd';

 import { CoreContent, DeprecatedCoreForm, CoreTabs } from '../../../../components/core';
 import { system } from '../../../../application';
 import { RoleState } from '../../../../application/define';
 import { canOperateAdminManagementCodeRoles } from '../../../../application/define/operate';
 import CodeModal from './../../../../components/common/modal/codeModal';
 import styles from './style.less';

 const { Option } = Select;
 const codeFlag = system.isShowCode(); // 判断是否是code

 const rolesTabs = {
   one: '角色管理',
   two: 'CODE业务策略',
 };

 function ManagementRoles(props) {
   const [updateRecord, setUpdateRecord] = useState({});                 // 需要更新的数据，默认为空数据
   const [roleInfo, setRoleInfo] = useState({});                         // 每行数据
   const [isShowUpsertModal, setIsShowUpsertModal] = useState(false);    // 是否显示操作弹窗
   const [isShowCodeModal, setIsShowCodeModal] = useState(false);        // 是否显示code操作弹框
   const [targetKeys, setTargetKeys] = useState([]);                     // 穿梭框值
   const [codeLoading, setCodeLoading] = useState(false);                // code业务信息table loading

   const { dispatch } = props;

  // 显示创建,更新弹窗，如果有要编辑的数据，则设置编辑数据。
   const onShowUpsertModal = (record = {}) => {
     setUpdateRecord(record);
     setIsShowUpsertModal(true);
   };

  // 更新状态
   const onUpdateState = (role, state) => {
     const payload = {
       gid: role.gid,
       name: role.name,
       pid: role.pid,
       state,
     };
     dispatch({ type: 'adminManage/updateSystemRole', payload });
   };

  // 根据父级id获取子集数据
   const getRolesByPid = (roles, pid) => {
    // 获取子类别数据
     const result = [];
     roles.forEach((item) => {
      // 如果是被删除的数据则不显示
       if (item.available === RoleState.deleted) {
         return;
       }

      // 匹配获取的分类数据
       if (`${item.current_pid}` === `${pid}`) {
         const role = item;
         role.key = `${item.gid}-${item.current_pid}`;
         role.children = getRolesByPid(roles, item.gid);
         result.push(role);
       }
     });
     if (is.empty(result)) {
       return;
     }
     return result;
   };

  // 显示code弹框
   const onClickCodeMcal = (record = {}) => {
     const ids = record.code_biz_group_ids || [];
     setIsShowCodeModal(true);
     setTargetKeys(ids);
     setRoleInfo(record);
   };


  // 渲染角色管理列表
   const renderManagementRoles = () => {
     const { roles } = props;

    // 获取角色树
     const dataSource = getRolesByPid(roles, 0);
     const columns = [{
       title: '角色名称',
       dataIndex: 'name',
       key: 'name',
     }, {
       title: '状态',
       dataIndex: 'available',
       key: 'available',
       render: text => (
         <span>{RoleState.description(text)}</span>
      ),
     }, {
       title: '角色id',
       dataIndex: 'gid',
       key: 'id',
     }, {
       title: '操作',
       dataIndex: 'gid',
       key: 'gid',
       render: (gid, role) => {
        // 系统创建的数据，不可以进行操作
         if (role.pid === 0) {
           return '';
         }

        // 渲染的内容
         const content = [];
        // 判断是否启用
         if (role.available === RoleState.available) {
           content.push(
             <span key={`off-${gid}`} className={styles.bossRoleEnableDisableWrap}>
               <Popconfirm title="确定执行此操作?" onConfirm={() => { onUpdateState(role, RoleState.disable); }} okText="确定" cancelText="取消">
                 <a>禁用</a>
               </Popconfirm>
             </span>,
          );
         }

        // 判断是否停用
         if (role.available === RoleState.disable) {
           content.push(
             <span key={`on-${gid}`} className={styles.bossRoleEnableDisableWrap}>
               <Popconfirm title="确定执行此操作?" onConfirm={() => { onUpdateState(role, RoleState.available); }} okText="确定" cancelText="取消">
                 <a>启用</a>
               </Popconfirm>
             </span>,
          );
         }

        // 判断是否有子级数据，如果有，不能停用
         if (is.empty(role.children) || is.not.existy(role.children)) {
           content.push(
             <span key={`delete-${gid}`} className={styles.bossRoleEnableDisableWrap}>
               <Popconfirm title="确定执行此操作?" onConfirm={() => { onUpdateState(role, RoleState.deleted); }} okText="确定" cancelText="取消">
                 <a>停用</a>
               </Popconfirm>
             </span>,
          );
         }

         return (
           <span>
             <a onClick={() => { onShowUpsertModal(role); }}>编辑</a>
             {content}
           </span>
         );
       },
     }];

     const ext = (
       <div>
         <Button type="primary" className={styles.bossRoleAdd} onClick={() => { onShowUpsertModal(); }}>添加角色</Button>
       </div>
    );
    // 判断没数据的情况
     if (!dataSource) {
       return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
     }
     return (
       <CoreContent title={'角色管理'} titleExt={ext}>
         <Table
           dataSource={dataSource}
           columns={columns}
           bordered
           pagination={false}
           defaultExpandAllRows
         />
       </CoreContent>
     );
   };

  // 渲染CODE业务策略列表
   const renderCodeManagementRoles = () => {
     const { roles = [] } = props;

    // 获取角色树
     const dataSource = getRolesByPid(roles, 0);
    // 获取角色树
     const columns = [
       {
         title: '角色名称',
         dataIndex: 'name',
         key: 'name',
       },
       {
         title: '业务策略',
         dataIndex: 'code_biz_group_infos',
         key: 'code_biz_group_infos',
         render: (text) => {
          // 判断是否为空
           if (is.not.existy(text) || is.empty(text)) {
             return '--';
           }
          // 判断长度
           if (text.length <= 5) {
             return (
               <span>
                 {text.map((v = {}) => {
                   return v.name;
                 }).join(', ')}
               </span>
             );
           }
           return (
             <Popover
               overlayStyle={{ zIndex: 9999 }}
               content={
                 <span>
                   {text.map((v = {}) => {
                     return v.name;
                   }).join(', ')}
                 </span>
            } trigger="hover"
             >
               <div>{text.slice(0, 5).map((v = {}) => {
                 return v.name;
               }).join(', ')}...</div>
             </Popover>
           );
         },
       },
       {
         title: '操作',
         dataIndex: '操作',
         key: '操作',
         render: (text, record) => {
           return (
             <a
               onClick={() => { onClickCodeMcal(record); }}
             >编辑</a>
           );
         },
       }];

    // 判断没数据的情况
     if (!dataSource) {
       return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
     }

     return (
       <CoreContent title="CODE业务策略">
         <Table
           dataSource={dataSource}
           columns={columns}
           bordered
           pagination={false}
           loading={codeLoading}
           defaultExpandAllRows
         />
       </CoreContent>
     );
   };

  // 渲染tab
   const renderTabs = () => {
     const items = [
       {
         title: '角色管理',
         content: renderManagementRoles(),
         key: rolesTabs.one,
       },
     ];
    // 判断是否有code插件&判断是否有code权限
     if (codeFlag === true && canOperateAdminManagementCodeRoles()) {
       items.push(
         {
           title: 'CODE业务策略',
           content: renderCodeManagementRoles(),
           key: rolesTabs.two,
         },
      );
     }
     return (
       <CoreTabs
         items={items}
       />
     );
   };

   // 隐藏创建,更新弹窗，同时重置数据
   const onHideUpsertModal = () => {
     setUpdateRecord({});
     setIsShowUpsertModal(false);
     props.form.resetFields();
   };

   // 创建,更新操作
   const onSubmitUpsert = () => {
     props.form.validateFields((err, values) => {
      // 错误判断
       if (err) {
         return;
       }
       const { isUpdate, gid, name, pid, state } = values;

       if (name === '') {
         message.error('角色名称不能为空');
         return;
       }

       if (pid === '') {
         message.error('所属上级不能为空');
         return;
       }

      // 判断是否是更新操作，更新数据
       if (isUpdate) {
         const payload = {
           gid,
           name,
           pid,
           state,
         };
         dispatch({ type: 'adminManage/updateSystemRole', payload });
       } else {
        // 添加新数据
         const payload = {
           name,
           pid,
         };
         dispatch({ type: 'adminManage/createSystemRole', payload });
       }
      // 隐藏弹窗
       onHideUpsertModal();
     });
   };


  // 渲染更新数据弹窗
   const renderUpsertModal = () => {
     const { roles } = props;
     const { getFieldDecorator } = props.form;

    // 是否是更新数据
     const isUpdate = !!(is.existy(updateRecord) && is.not.empty(updateRecord));
     const title = isUpdate ? '更新数据' : '添加数据';

    // 获取表单的初始化数据，如果数据不存在，则显示默认的数据
     const initialValue = {
       name: dot.get(updateRecord, 'name', ''),
       pid: dot.get(updateRecord, 'current_pid', ''),
     };

     const formItems = [
       {
         label: '角色名称',
         form: getFieldDecorator('name', {
           rules: [{
             required: true,
             message: '请填写角色名称',
           }],
           initialValue: initialValue.name,
         })(<Input />),
       }, {
         label: '所属上级',
         form: (
          getFieldDecorator('pid', {
            rules: [{
              required: true,
              message: '请选择所属上级',
            }],
            initialValue: `${initialValue.pid}`,
          })(
            <Select placeholder="请选择所属上级">
              {roles.filter(item => item.gid !== updateRecord.gid).map((role) => {
                return <Option key={`role-select-${role.gid}`} value={`${role.gid}`}>{role.name}</Option>;
              })}
            </Select>,
          )
        ),
       },
     ];

    // 隐藏的表单数据
     getFieldDecorator('isUpdate', { initialValue: isUpdate })(<Input />);
     getFieldDecorator('gid', { initialValue: dot.get(updateRecord, 'gid', '') })(<Input />);
     getFieldDecorator('state', { initialValue: dot.get(updateRecord, 'state', '') })(<Input />);

     const layout = { labelCol: { span: 6 }, wrapperCol: { span: 9 } };
     return (
       <Modal title={title} visible={isShowUpsertModal} onOk={onSubmitUpsert} onCancel={onHideUpsertModal} okText="提交" cancelText="取消">
         <Form layout="horizontal">
           <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
         </Form>
       </Modal>
     );
   };

  // code弹框取消
   const onCancelCodeModal = () => {
     setIsShowCodeModal(false);
     setRoleInfo({});
   };

  // code成功回调
   const onCodeSucessCallback = () => {
    // 关闭弹框
     onCancelCodeModal();
   };

  // code弹框确定
   const onOkCodeModal = (keys) => {
    // 设置table loading
     setCodeLoading(true);
     const { gid, name, pid } = roleInfo;
     const payload = {
       gid,
       name,
       pid,
       codeBizGroupIds: keys,
       isCode: true,
       onSucessCallback: onCodeSucessCallback,
       callBack: () => setCodeLoading(false),
       onFailureCallback: () => setCodeLoading(false),
     };
     props.dispatch({ type: 'adminManage/updateSystemRole', payload });
   };


  // code弹框
   const renderCodeModal = () => {
     if (isShowCodeModal !== true) {
       return null;
     }
     return (
       <CodeModal
         visible={isShowCodeModal}
         values={targetKeys}
         onOk={onOkCodeModal}
         onCancel={onCancelCodeModal}
       />);
   };

   return (
     <div>
       {/* 渲染tab */}
       {renderTabs()}

       {/* 渲染创建,更新弹窗 */}
       {renderUpsertModal()}

       {/* code弹框 */}
       {renderCodeModal()}
     </div>
   );
 }


 ManagementRoles.defaultProps = {
   roles: [],
 };

 function mapStateToProps({ adminManage: { roles } }) {
   return { roles };
 }

 export default connect(mapStateToProps)(Form.create()(ManagementRoles));
