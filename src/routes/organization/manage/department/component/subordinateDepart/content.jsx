/* eslint-disable no-confusing-arrow */
/**
 * 组织架构 - 部门管理 - 部门Tab - 下级部门组件 - table
 */
import React, { useState } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Table, Popconfirm, message } from 'antd';

import Update from '../modal/departmentUpdate';
import {
  OrganizationDepartmentChangeType,
  OrganizationSourceType,
  ExpenseExamineOrderProcessState,
  OrganizationDepartmentChangeState,
} from '../../../../../../application/define';
import { dotOptimal } from '../../../../../../application/utils';
import Operate from '../../../../../../application/define/operate';

import style from '../index.less';

// 弹窗类型
const Type = {
  create: 'create',
  update: 'update',
};

const voidFunc = () => { };
Content.propTypes = {
  tabKey: PropTypes.string, // tab key（antd Tabs组件的key）
  tableLoading: PropTypes.bool, // table loading
  childDepartmentData: PropTypes.object, // 子部门列表需要展示的信息
  onSelectDepartment: PropTypes.func, // 选择部门
  onShowSizeChange: PropTypes.func,     // table展示每页数据数事件回调
  onChangePage: PropTypes.func,         // table分页事件回调
  breakDepartmentList: PropTypes.func, // 刷新列表
  setCurrentDepartmentDetail: PropTypes.func, // 获取列表当前操作部门detail
  onChangeUpperDepartmentVisable: PropTypes.func, // 更改调整上级部门Drawer visable
  onChangeAddSubVisible: PropTypes.func, // 更改新增子部门Drawer visable
  onChangeRevokeDepartmentVisable: PropTypes.func, // 更改裁撤部门Drawer visable
  setIsUpperDepartmentUpdate: PropTypes.func, // 是否是走审批编辑操作(调整上级部门)
  setIsAddSubUpdate: PropTypes.func, // 是否是走审批编辑操作(新增子部门)
  setIsRevokeDepartmentUpdate: PropTypes.func, // 是否是走审批编辑操作(裁撤部门)
  onChangeCheckResult: PropTypes.func, // 更改部门操作校验结果Modal visible、获取部门操作提交事件、获取部门操作校验提示信息
  setRevokeDepartmentFlowId: PropTypes.func, // 更改裁撤部门操作需要的审批流id
  setUpperDepartmentFlowId: PropTypes.func, // 更改调整上级部门操作需要的审批流id
  breakDepartmentAllList: PropTypes.func, // 刷新tab下所有列表数据
  isUpperDepartmentApprove: PropTypes.bool, // 调整上级部门操作是否走审批
  isRevokeDepartmentApprove: PropTypes.bool, // 裁撤部门操作是否走审批
};

Content.defaultProps = {
  childDepartmentData: {},
  onSelectDepartment: voidFunc,
  onShowSizeChange: voidFunc,
  onChangePage: voidFunc,
  breakDepartmentList: voidFunc,
  setCurrentDepartmentDetail: voidFunc,
  onChangeUpperDepartmentVisable: voidFunc,
  onChangeAddSubVisible: voidFunc,
  onChangeRevokeDepartmentVisable: voidFunc,
  setIsUpperDepartmentUpdate: voidFunc,
  setIsAddSubUpdate: voidFunc,
  setIsRevokeDepartmentUpdate: voidFunc,
  onChangeCheckResult: voidFunc,
  setRevokeDepartmentFlowId: voidFunc,
  setUpperDepartmentFlowId: voidFunc,
  breakDepartmentAllList: voidFunc,
  isUpperDepartmentApprove: false,
  isRevokeDepartmentApprove: false,
};

function Content({
  dispatch,
  tabKey,
  tableLoading,
  childDepartmentData,
  onSelectDepartment,
  onShowSizeChange,
  onChangePage,
  breakDepartmentList,
  getDepartmentTree,
  setCurrentDepartmentDetail,
  onChangeUpperDepartmentVisable,
  onChangeAddSubVisible,
  onChangeRevokeDepartmentVisable,
  setIsUpperDepartmentUpdate,
  setIsAddSubUpdate,
  setIsRevokeDepartmentUpdate,
  closeOaOrganizationOrder,
  checkDepartmentUpdate,
  deleteDepartment,
  onChangeCheckResult,
  getOrganizationFlowList,
  setRevokeDepartmentFlowId,
  setUpperDepartmentFlowId,
  breakDepartmentAllList,
  isUpperDepartmentApprove,
  isRevokeDepartmentApprove,
}) {
  // 下级部门弹窗visable
  const [visible, setVisible] = useState(false);
  // 弹窗类型
  const [type, setType] = useState(undefined);
  // 子部门详情
  const [childDepartmentDetail, setChildDepartmentDetaile] = useState({});

  // 显示弹窗
  const onShow = (modalType, detail, e) => {
    // 阻止冒泡
    e && e.stopPropagation();
    setType(modalType);
    setVisible(true);
    setChildDepartmentDetaile(detail);
  };

  // 裁撤部门
  const onDelete = async (val) => {
    // 撤销部门
    const res = await deleteDepartment({
      id: val,
    });
    // 请求成功
    if (res) {
      message.success('请求成功');
      // 刷新列表
      breakDepartmentList();
      // 获取部门树
      getDepartmentTree({ isAuthorized: true, namespace: 'organization' });
      return true;
    }
    return false;
  };

  // 裁撤部门校验
  const checkRevokeDepartment = async (record) => {
    const payload = {
      organizationSubType: OrganizationDepartmentChangeType.revoke, // 组织架构-部门/编制调整 子类型
      departmentId: record._id, // 部门id
    };
    // 部门操作前校验
    const res = await checkDepartmentUpdate(payload);

    // 请求成功
    if (res) {
      // 校验通过
      if (res.ok) {
        await onDelete(record._id);
      // 校验未通过，展示提示信息
      } else {
        onChangeCheckResult(true, async () => { await onDelete(record._id); }, res.hint_list, '调整类型：组织架构-裁撤部门');
      }
    }
  };

  // 跳转到部门地址页面
  const onClickDepartment = (rec) => {
    onSelectDepartment && onSelectDepartment(rec._id, rec.name, true);
  };

  // 列表行事件
  const onClickRow = (rec) => {
    onSelectDepartment && onSelectDepartment(rec._id, rec.name, true);
  };

  // 成功回调
  const onSuccessCallback = () => {
    message.success('操作成功');
    // 刷新tab下所有列表数据
    breakDepartmentAllList();
    // 获取部门树
    getDepartmentTree({ isAuthorized: true, namespace: 'organization' });
    setVisible(false);
  };

  // 失败回调
  const onFailureCallback = (rec = {}) => {
    rec.zh_message && message.error(rec.zh_message);
  };

  // 渲染基本信息
  const renderContent = () => {
    const {
      data: dataSource = [],
      _meta: meta = {},
    } = childDepartmentData;
    const {
      result_count: dataCount = 0,
    } = meta;

    let columns;
    // tab（正常）
    if (tabKey === 'tab1') {
      columns = [
        {
          title: '部门名称',
          dataIndex: 'name',
          key: 'name',
          width: 100,
          fixed: 'left',
          render: (text, record) => {
            if (!text) return '--';
            return (
              <a
                href="#!"
                className={style['app-organization-department-child-hight']}
                onClick={(e) => {
                  e.preventDefault();
                  onClickRow(record);
                }}
              >{text}</a>
            );
          },
        },
        {
          title: '上级部门',
          dataIndex: ['parent_info', 'name'],
          key: 'parent_info.name',
          render: text => text || '--',
        },
        {
          title: '部门编号',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '是否审批',
          dataIndex: 'source',
          key: 'source',
          render: (text) => {
            if (!text) return '--';
            return text === OrganizationSourceType.approval ? '是' : '否';
          },
        },
        {
          title: '创建者',
          dataIndex: ['creator_info', 'name'],
          key: 'creator_info',
          render: text => text || '--',
        },
        {
          title: '生效日期',
          dataIndex: 'take_effect_date',
          key: 'take_effect_date',
          render: text => text ? moment(`${text}`).format('YYYY-MM-DD') : '--',
        },
        {
          title: '最新操作人',
          dataIndex: ['operator_info', 'name'],
          key: 'operator_info_name',
          render: text => text || '--',
        },
        {
          title: '更新时间',
          dataIndex: 'updated_at',
          key: 'updated_at',
          render: text => text ? moment(`${text}`).format('YYYY-MM-DD') : '--',
        },
      ];
    }

    // tab（待生效）
    if (tabKey === 'tab2') {
      columns = [
        {
          title: '部门名称',
          dataIndex: ['department_info', 'name'],
          key: 'department_info_name',
          width: 100,
          fixed: 'left',
          render: text => text || '--',
        },
        {
          title: '上级部门',
          dataIndex: ['target_parent_department_info', 'name'],
          key: 'target_parent_department_info_name',
          render: (_, record) => {
            // 判断调整类型是否是调整上级部门类型
            if (dotOptimal(record, 'organization_sub_type', undefined) === OrganizationDepartmentChangeType.change) {
              return dotOptimal(record, 'update_parent_department_info.name', '--');
            }
            return dotOptimal(record, 'target_parent_department_info.name', '--');
          },
        },
        {
          title: '部门编号',
          dataIndex: ['department_info', 'code'],
          key: 'department_info_code',
          render: text => text ? text : '--',
        },
        {
          title: '是否审批',
          dataIndex: 'source',
          key: 'source',
          render: () => '是',
        },
        {
          title: '调整类型',
          dataIndex: 'organization_sub_type',
          key: 'organization_sub_type',
          render: text => text ? OrganizationDepartmentChangeType.description(text) : '--',
        },
        {
          title: '审批单状态',
          dataIndex: ['oa_application_order_info', 'state'],
          key: 'oa_application_order_info_state',
          render: text => text ? ExpenseExamineOrderProcessState.description(text) : '--',
        },
        {
          title: '部门调整状态',
          dataIndex: 'take_effect_state',
          key: 'take_effect_state',
          render: text => text ? OrganizationDepartmentChangeState.description(text) : '--',
        },
        {
          title: '创建者',
          dataIndex: ['creator_info', 'name'],
          key: 'creator_info',
          render: text => text || '--',
        },
        {
          title: '生效日期',
          dataIndex: 'take_effect_date',
          key: 'take_effect_date',
          render: text => text ? moment(`${text}`).format('YYYY-MM-DD') : '--',
        },
        {
          title: 'BOSS单号',
          dataIndex: ['oa_application_order_info', '_id'],
          key: 'oa_application_order_info_id',
          render: (text, record) => {
            if (text) {
              if (record.can_view) {
                return (
                  <a
                    rel="noopener noreferrer"
                    href={`javascript:void(window.open('/#/Expense/Manage/ExamineOrder/Detail?orderId=${text}'))`}
                    className={style['app-organization-department-child-hight']}
                  >{text}</a>
                );
              }
              return text;
            }
            return '--';
          },
        },
      ];
    }

    // tab（已关闭）
    if (tabKey === 'tab3') {
      columns = [
        {
          title: '部门名称',
          dataIndex: ['department_info', 'name'],
          key: 'department_info_name',
          width: 100,
          fixed: 'left',
          render: text => text || '--',
        },
        {
          title: '上级部门',
          dataIndex: ['target_parent_department_info', 'name'],
          key: 'target_parent_department_info_name',
          render: (_, record) => {
            // 判断调整类型是否是调整上级部门类型
            if (dotOptimal(record, 'organization_sub_type', undefined) === OrganizationDepartmentChangeType.change) {
              return dotOptimal(record, 'update_parent_department_info.name', '--');
            }
            return dotOptimal(record, 'target_parent_department_info.name', '--');
          },
        },
        {
          title: '部门编号',
          dataIndex: ['department_info', 'code'],
          key: 'department_info_code',
          render: text => text ? text : '--',
        },
        {
          title: '调整类型',
          dataIndex: 'organization_sub_type',
          key: 'organization_sub_type',
          render: text => text ? OrganizationDepartmentChangeType.description(text) : '--',
        },
        {
          title: '审批单状态',
          dataIndex: ['oa_application_order_info', 'state'],
          key: 'oa_application_order_info_state',
          render: text => text ? ExpenseExamineOrderProcessState.description(text) : '--',
        },
        {
          title: '部门调整状态',
          dataIndex: 'take_effect_state',
          key: 'take_effect_state',
          render: text => text ? OrganizationDepartmentChangeState.description(text) : '--',
        },
        {
          title: '创建者',
          dataIndex: ['creator_info', 'name'],
          key: 'creator_info',
          render: text => text || '--',
        },
        {
          title: '生效日期',
          dataIndex: 'take_effect_date',
          key: 'take_effect_date',
          render: text => text ? moment(`${text}`).format('YYYY-MM-DD') : '--',
        },
        {
          title: 'BOSS单号',
          dataIndex: ['oa_application_order_info', '_id'],
          key: 'oa_application_order_info_id',
          render: (text, record) => {
            if (text) {
              if (record.can_view) {
                return (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`#/Expense/Manage/ExamineOrder/Detail?orderId=${text}`}
                    className={style['app-organization-department-child-hight']}
                  >{text}</a>
                );
              }
              return text;
            }
            return '--';
          },
        },
      ];
    }

    if (tabKey !== 'tab3') {
      columns.push(
        {
          title: '操作',
          dataIndex: '_id',
          key: 'operate',
          width: 200,
          fixed: 'right',
          render: (text, record) => {
            // 显示调整上级部门操作
            const showUpper = tabKey === 'tab1' && isUpperDepartmentApprove && Operate.canOperateOrganizationManageDepartmentCreate()
                              ? (<a
                                href="#!"
                                style={{ marginRight: 10, whiteSpace: 'nowrap' }}
                                onClick={async (e) => {
                                  e.preventDefault();
                                  // 获取组织架构审批流list
                                  const res = await getOrganizationFlowList({
                                    departmentId: record._id,
                                    organizationSubType: OrganizationDepartmentChangeType.change,
                                  });
                                  // 接口请求成功 200
                                  if (res && res.data) {
                                    // 有适用的审批流
                                    if (dotOptimal(res, 'data.0.flow_template_records.0._id', '')) {
                                      setUpperDepartmentFlowId(dotOptimal(res, 'data.0.flow_template_records.0._id'));
                                      setCurrentDepartmentDetail(record);
                                      onChangeUpperDepartmentVisable(true);
                                    } else {
                                      return message.error('提示：无适用审批流，请联系流程管理员');
                                    }
                                  }
                                  // 接口请求失败 400
                                  if (res && res.zh_message) {
                                    return message.error(res.zh_message);
                                  }
                                }}
                              >调整上级部门</a>)
                              : null;
            // 显示裁撤部门操作
            const showApprove = tabKey === 'tab1' && Operate.canOperateOrganizationManageDepartmentDelete()
                                ? isRevokeDepartmentApprove
                                  ? <a
                                    href="#!"
                                    style={{ marginRight: 10, whiteSpace: 'nowrap' }}
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      // 获取组织架构审批流list
                                      const res = await getOrganizationFlowList({
                                        departmentId: record._id,
                                        organizationSubType: OrganizationDepartmentChangeType.revoke,
                                      });
                                      // 接口请求成功 200
                                      if (res && res.data) {
                                        // 有适用的审批流
                                        if (dotOptimal(res, 'data.0.flow_template_records.0._id', '')) {
                                          setRevokeDepartmentFlowId(dotOptimal(res, 'data.0.flow_template_records.0._id'));
                                          setCurrentDepartmentDetail(record);
                                          onChangeRevokeDepartmentVisable(true);
                                        } else {
                                          return message.error('提示：无适用审批流，请联系流程管理员');
                                        }
                                      }
                                      // 接口请求失败 400
                                      if (res && res.zh_message) {
                                        return message.error(res.zh_message);
                                      }
                                    }}
                                  >裁撤部门</a>
                                  : <Popconfirm
                                    title="部门裁撤之后，将不能对该部门进行任何操作，请确认是否继续裁撤"
                                    onConfirm={() => { checkRevokeDepartment(record); }}
                                    okText="确认"
                                    cancelText="再想想"
                                  >
                                    <a href="#!" style={{ marginRight: 10, whiteSpace: 'nowrap' }} onClick={(e) => { e.preventDefault(); }}>裁撤部门</a>
                                  </Popconfirm>
                                : null;
            // 显示部门编辑操作
            const showDepartmentUpdate = tabKey === 'tab1' && Operate.canOperateOrganizationManageDepartmentUpdate()
                                          ? (<a
                                            href="#!"
                                            style={{ marginRight: 10, whiteSpace: 'nowrap' }}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              onShow(Type.update, record, e);
                                            }}
                                          >编辑</a>)
                                          : null;
            // 显示审批编辑操作
            const showFlowOrderUpdate = dotOptimal(record, 'can_edit', false) && tabKey !== 'tab1'
                                        ? (<a
                                          href="#!"
                                          style={{ marginRight: 10, whiteSpace: 'nowrap' }}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setCurrentDepartmentDetail(record);
                                            // 调整类型为新增子部门
                                            if (dotOptimal(record, 'organization_sub_type', undefined) === OrganizationDepartmentChangeType.create) {
                                              setIsAddSubUpdate(true);
                                              onChangeAddSubVisible(true);
                                            }
                                            // 调整类型为调整部门
                                            if (dotOptimal(record, 'organization_sub_type', undefined) === OrganizationDepartmentChangeType.change) {
                                              setIsUpperDepartmentUpdate(true);
                                              onChangeUpperDepartmentVisable(true);
                                            }
                                            // 调整类型为裁撤部门
                                            if (dotOptimal(record, 'organization_sub_type', undefined) === OrganizationDepartmentChangeType.revoke) {
                                              setIsRevokeDepartmentUpdate(true);
                                              onChangeRevokeDepartmentVisable(true);
                                            }
                                          }}
                                        >编辑</a>)
                                        : null;
            // 显示查看详情操作
            const showDetail = tabKey === 'tab1'
                                ? (<a
                                  href="#!"
                                  style={{ whiteSpace: 'nowrap' }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    onClickDepartment(record);
                                  }}
                                >查看详情</a>)
                                : null;
            // 显示关闭操作
            const showClose = dotOptimal(record, 'can_close', false)
                              ? (<Popconfirm
                                title="系统将会对该条审批单进行关闭处理，新增的申请将会被终止，请确定是否要继续"
                                onConfirm={async () => {
                                  const res = await closeOaOrganizationOrder({ oaOrganizationOrderId: dotOptimal(record, '_id', undefined) });
                                  if (res) {
                                    message.success('请求成功');
                                    // 刷新tab下所有列表数据
                                    breakDepartmentAllList();
                                  }
                                }}
                                okText="确认"
                                cancelText="再想想"
                              >
                                <a href="#!" style={{ whiteSpace: 'nowrap' }} onClick={(e) => { e.preventDefault(); }}>关闭</a>
                              </Popconfirm>)
                              : null;
            return (
              <div>
                {/* 显示调整上级部门操作 */}
                {showUpper}
                {/* 显示裁撤部门操作 */}
                {showApprove}
                {/* 显示部门编辑操作 */}
                {showDepartmentUpdate}
                {/* 显示审批编辑操作 */}
                {showFlowOrderUpdate}
                {/* 显示查看详情操作 */}
                {showDetail}
                {/* 显示关闭操作 */}
                {showClose}
                {/* 无操作显示-- */}
                {(!showUpper && !showApprove && !showDepartmentUpdate && !showFlowOrderUpdate && !showDetail && !showClose) && '--'}
              </div>
            );
          },
        },
      );
    }

    // 分页
    const pagination = {
      defaultPageSize: 30, // 默认数据条数
      onChange: onChangePage, // 切换分页
      total: dataCount, // 数据总条数
      showTotal: total => `总共${total}条`, // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      showQuickJumper: true, // 显示快速跳转
      showSizeChanger: true, // 显示分页
      onShowSizeChange, // 展示每页数据数
    };

    return (
      <Table
        rowKey={(rec, key) => rec.id || key}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        loading={tableLoading}
        scroll={{ x: 1300 }}
      />
    );
  };

  // 弹窗
  const renderModal = () => {
    // 编辑部门弹窗visible、部门详情
    if (!visible) return;
    // modal title
    const title = type === Type.create ? '添加子部门' : '编辑部门';

    return (
      <Update
        type={type}
        title={title}
        visible={visible}
        dispatch={dispatch}
        codeDisabled={type === Type.update}
        detail={childDepartmentDetail}
        onCancel={() => { setVisible(false); }}
        onSuccessCallback={onSuccessCallback}
        onFailureCallback={onFailureCallback}
        isUpperDepartmentApprove={isUpperDepartmentApprove}
      />
    );
  };

  return (
    <div>
      {/* 渲染基本信息 */}
      {renderContent()}
      {/* 渲染弹窗 */}
      {renderModal()}
    </div>
  );
}

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => ({
  // 获取部门树
  getDepartmentTree: payload => dispatch({
    type: 'applicationCommon/fetchDepartments',
    payload,
  }),
  // 部门/编制申请单关闭
  closeOaOrganizationOrder: payload => dispatch({
    type: 'department/closeOaOrganizationOrder',
    payload,
  }),
  // 部门操作前校验
  checkDepartmentUpdate: payload => dispatch({
    type: 'department/checkDepartmentUpdate',
    payload,
  }),
  // 撤销部门
  deleteDepartment: payload => dispatch({
    type: 'department/deleteDepartment',
    payload,
  }),
  // 获取组织架构审批流list
  getOrganizationFlowList: payload => dispatch({
    type: 'department/getOrganizationFlowList',
    payload,
  }),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Content);
