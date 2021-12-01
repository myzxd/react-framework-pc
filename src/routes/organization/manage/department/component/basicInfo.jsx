/**
 * 组织架构 - 部门管理 - 部门Tab - 基本信息组件
 */
import { connect } from 'dva';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { message, Form } from 'antd';

import { dotOptimal } from '../../../../../application/utils';
import {
  OrganizationDepartmentChangeState,
  OrganizationDepartmentChangeType,
  OrganizationDepartmentState,
  OrganizationSourceType,
} from '../../../../../application/define';
import { CoreContent, CoreForm } from '../../../../../components/core';

import Update from './modal/departmentUpdate'; // 编辑部门弹窗
import Principal from './modal/principal'; // 设置负责人弹窗
import ErrorModal from './modal/updateDepError.jsx'; // 编辑部门后提示探查滚
import UpperDepartmentUpdate from './drawer/upperDepartmentUpdate'; // 调整上级部门Drawer
import Operate from '../../../../../application/define/operate';

import style from './index.less';

class Basic extends React.Component {
  constructor() {
    super();
    this.state = {
      updateVisible: false, // 编辑部门弹窗visible
      principalVisible: false, // 设置负责人visible
      errPromptVisible: false, // 编辑部门错误提示visible
      upperDepartmentVisible: false, // 调整上级部门visible
      upperDepartmentFlowId: '', // 调整上级部门操作需要的审批流id
    };
  }

  componentDidMount() {
    this.getDepartmentDetail();
  }

  componentDidUpdate(prevProps) {
    const prevId = dotOptimal(prevProps, 'departmentId', undefined); // 旧部门id
    const nextId = dotOptimal(this.props, 'departmentId', undefined); // 新部门id
    if (prevId !== nextId) {
      this.getDepartmentDetail();
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'department/resetDepartmentDetail', payload: {} });
  }

  // 隐藏编辑部门弹窗
  onCancelUpdate = () => {
    this.setState({ updateVisible: false });
  }

  // 隐藏设置负责人弹窗
  onCancelPrincipal = () => {
    this.setState({ principalVisible: false });
  }

  // 隐藏编辑部门后提示弹窗
  onCancelErrorModal = () => {
    this.setState({
      errPromptVisible: false,
    });
  }

  // 更改调整上级部门Drawer visable
  onChangeUpperDepartmentVisable = (flag) => {
    this.setState({
      upperDepartmentVisible: flag || false,
    });
  }

  // 编辑部门回调
  onUpdateDepCallBack = (res = {}) => {
    const { departmentDetail = {}, onSelectDepartment } = this.props;
    // 上级部门id
    const originalPid = dotOptimal(departmentDetail, 'parent_info._id', undefined);

    this.setState({
      updateVisible: false, // 编辑部门弹窗visible
      principalVisible: false, // 设置负责人弹窗visible
    });
    // 成功
    if (res && res.ok) {
      // 选择部门，设置选中的部门
      onSelectDepartment(dotOptimal(res, 'record._id'), dotOptimal(res, 'record.name'));
      // 获取部门树
      this.getDepartmentTree();
      // 获取部门详情
      this.getDepartmentDetail();

      // 当前选中的上级部门id
      const curPid = dotOptimal(res, 'record.pid', undefined);

      // 修改了上级部门
      if (originalPid !== curPid && curPid && originalPid) {
        this.setState({ errPromptVisible: true, errorMessage: res });
      } else {
        message.success('请求成功');
      }
      // 失败
    } else {
      this.setState({ errPromptVisible: true, errorMessage: res });
    }
  };

  // 成功回调
  onSuccessCallback = () => {
    message.success('操作成功');
    // 获取部门详情
    this.getDepartmentDetail();
    // 获取部门树
    this.getDepartmentTree();
    this.setState({
      updateVisible: false, // 编辑部门弹窗visible
      principalVisible: false, // 设置负责人弹窗visible
    });
  }

  // 失败回调
  onFailureCallback = (res = {}) => {
    res.zh_message && message.error(res.zh_message);
    this.setState({
      updateVisible: false, // 编辑部门弹窗visible
      principalVisible: false, // 设置负责人弹窗visible
    });
  }

  // 获取部门详情
  getDepartmentDetail = () => {
    const { dispatch, departmentId } = this.props;
    departmentId && dispatch({ type: 'department/getDepartmentDetail', payload: { id: departmentId } });
  }

  // 获取部门树
  getDepartmentTree = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'applicationCommon/fetchDepartments', payload: { isAuthorized: true, namespace: 'organization' } });
  }

  // 渲染基本信息
  renderBasic = () => {
    // 部门详情
    const { departmentDetail = {}, departmentId, isUpperDepartmentApprove } = this.props;

    const {
      name = undefined, // 部门名称
      code = undefined, // 部门编号
      // real_number: realNum = undefined, // 实有人数 @彭悦 隐藏字段
      // creator_info: {
      // name: creator = undefined,
      // } = {}, // 部门负责人
      created_at: createAt = undefined, // 创建时间
      // administrator_info: {
      // name: principal = undefined,
      // } = {}, // 部门负责人
    } = departmentDetail;
    // 部门负责人姓名
    const principal = dotOptimal(departmentDetail, 'administrator_info.name', undefined);

    // 设置负责人操作文案
    const operateTitle = principal ? '修改' : '设置';
    // 设置部门负责人
    const principalForm = (
      <div>
        {principal || '--'}
        {
          Operate.canOperateOrganizationManageDepartmentManager() ?
            <a
              onClick={() => this.setState({ principalVisible: true })}
              className={style['app-organization-department-basic-operate']}
            >{operateTitle}</a>
            : null
        }
      </div>
    );

    const formItems = [
      <Form.Item
        label="部门名称"
      >
        {name || '--'}
      </Form.Item>,
      <Form.Item
        label="上级部门"
      >
        {dotOptimal(departmentDetail, 'parent_info.name', '无')}
      </Form.Item>,
      <Form.Item
        label="部门编号"
      >
        {code || '--'}
      </Form.Item>,
      <Form.Item
        label="编制数"
      >
        {dotOptimal(departmentDetail, 'organization_num', '--')}
      </Form.Item>,
      <Form.Item
        label="占编人数"
      >
        {dotOptimal(departmentDetail, 'organization_count', '--')}
      </Form.Item>,
      <Form.Item
        label="创建者"
      >
        {dotOptimal(departmentDetail, 'creator_info.name', '--')}
      </Form.Item>,
      <Form.Item
        label="创建时间"
      >
        {createAt ? moment(String(createAt)).format('YYYY-MM-DD') : '--'}
      </Form.Item>,
      <Form.Item
        label="部门负责人"
      >
        {principalForm}
      </Form.Item>,
      <Form.Item
        label="状态"
      >
        {
          dotOptimal(departmentDetail, 'state', undefined)
            ? departmentDetail.state === OrganizationDepartmentState.enable
              ? '正常'
              : OrganizationDepartmentState.description(departmentDetail.state)
            : '--'
        }
      </Form.Item>,
      <Form.Item
        label="生效日期"
      >
        {
          dotOptimal(departmentDetail, 'take_effect_date', undefined)
            ? moment(String(departmentDetail.take_effect_date)).format('YYYY-MM-DD')
            : '--'
        }
      </Form.Item>,
      <Form.Item
        label="来源"
      >
        {
          dotOptimal(departmentDetail, 'source', undefined)
            ? OrganizationSourceType.description(departmentDetail.source)
            : '--'
        }
      </Form.Item>,
    ];

    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const titleExt = (
      <div>
        {
          // 当前部门存在上级部门 && 部门调整需要走审批 && 按钮权限
          (dotOptimal(departmentDetail, 'pid', undefined) && isUpperDepartmentApprove && Operate.canOperateOrganizationManageDepartmentCreate())
            ? <a
              href="#!"
              style={{ marginRight: 10 }}
              onClick={async (e) => {
                e.preventDefault();
                // 获取组织架构审批流list
                const res = await this.props.dispatch({
                  type: 'department/getOrganizationFlowList',
                  payload: { departmentId, organizationSubType: OrganizationDepartmentChangeType.change },
                });
                // 接口请求成功 200
                if (res && res.data) {
                  // 有适用的审批流
                  if (dotOptimal(res, 'data.0.flow_template_records.0._id', '')) {
                    this.setState({
                      upperDepartmentFlowId: dotOptimal(res, 'data.0.flow_template_records.0._id'),
                      upperDepartmentVisible: true,
                    });
                  } else {
                    return message.error('提示：无适用审批流，请联系流程管理员');
                  }
                }
                // 接口请求失败 400
                if (res && res.zh_message) {
                  return message.error(res.zh_message);
                }
              }}
            >调整上级部门</a>
            : null
        }
        {
          Operate.canOperateOrganizationManageDepartmentUpdate()
            ? <a href="#!" onClick={(e) => { e.preventDefault(); this.setState({ updateVisible: true }); }}>编辑</a>
            : null
        }
      </div>
    );

    return (
      <CoreContent title="基本信息" titleExt={titleExt}>
        <Form>
          <CoreForm
            className="affairs-flow-basic"
            items={formItems}
            cols={3}
            layout={layout}
          />
        </Form>
      </CoreContent>
    );
  }

  // 编辑部门弹窗
  renderUpdateModal = () => {
    // 编辑部门弹窗visible
    const { updateVisible } = this.state;
    const { isUpperDepartmentApprove } = this.props;
    // 部门详情
    // const { departmentDetail = {}, dispatch, childDepartmentList = {}, departmentMember = {} } = this.props;
    const { departmentDetail = {}, dispatch } = this.props;
    if (!updateVisible) return;

    return (
      <Update
        title="编辑部门"
        visible={updateVisible}
        detail={departmentDetail}
        dispatch={dispatch}
        onCancel={this.onCancelUpdate}
        onSuccessCallback={this.onUpdateDepCallBack}
        onFailureCallback={this.onUpdateDepCallBack}
        isUpperDepartmentApprove={isUpperDepartmentApprove}
      />
    );
  }

  // 设置负责人弹窗
  renderPrincipalModal = () => {
    // 设置负责人弹窗visible、部门详情
    const { principalVisible } = this.state;

    if (!principalVisible) return;

    // 部门详情
    const { departmentDetail = {} } = this.props;
    // 部门id
    const { _id: departmentId = undefined } = departmentDetail;
    // 负责人
    const principal = dotOptimal(departmentDetail, 'administrator_info._id', undefined);

    return (
      <Principal
        visible={principalVisible}
        departmentId={departmentId}
        principal={principal}
        onCancel={this.onCancelPrincipal}
        onSuccessCallback={this.onSuccessCallback}
        onFailureCallback={this.onFailureCallback}
      />
    );
  }

  // 编辑部门后提示弹窗
  renderErrorModal = () => {
    const { departmentDetail = {} } = this.props;
    return (
      <ErrorModal
        visible={this.state.errPromptVisible}
        message={this.state.errorMessage}
        departmentDetail={departmentDetail}
        onCancelErrorModal={this.onCancelErrorModal}
      />
    );
  }

  render() {
    const { upperDepartmentVisible, upperDepartmentFlowId } = this.state;
    const { departmentDetail, onChangeCheckResult, departmentId } = this.props;
    return (
      <div>
        {/* 基本信息*/}
        {this.renderBasic()}
        {/* 编辑部门弹窗 */}
        {this.renderUpdateModal()}
        {/* 设置负责人弹窗 */}
        {this.renderPrincipalModal()}
        {/* 编辑部门后提示弹窗 */}
        {this.renderErrorModal()}
        {/* 调整上级部门Drawer */}
        <UpperDepartmentUpdate
          departmentDetail={departmentDetail}
          onChangeUpperDepartmentVisable={(flag) => { this.onChangeUpperDepartmentVisable(flag); }}
          visible={upperDepartmentVisible}
          onChangeCheckResult={onChangeCheckResult}
          upperDepartmentFlowId={upperDepartmentFlowId}
          onSuccess={() => {
            this.getDepartmentTree();
            this.getDepartmentDetail();
            // 获取当前部门下的子部门列表
            this.props.dispatch({
              type: 'department/getChildDepartmentList',
              payload: { id: departmentId },
            });
            // 部门/编制申请单列表（待生效）
            this.props.dispatch({
              type: 'department/findDepartmentOrderList',
              payload: {
                targetParentDepartmentId: departmentId,
                orderNameSpace: 'department-tab2',
                state: OrganizationDepartmentChangeState.effectBefore,
                organizationSubTypes: [
                  OrganizationDepartmentChangeType.create,
                  OrganizationDepartmentChangeType.change,
                  OrganizationDepartmentChangeType.revoke,
                ],
              },
            });
            // 部门/编制申请单列表（已关闭）
            this.props.dispatch({
              type: 'department/findDepartmentOrderList',
              payload: {
                targetParentDepartmentId: departmentId,
                orderNameSpace: 'department-tab2',
                state: OrganizationDepartmentChangeState.close,
                organizationSubTypes: [
                  OrganizationDepartmentChangeType.create,
                  OrganizationDepartmentChangeType.change,
                  OrganizationDepartmentChangeType.revoke,
                ],
              },
            });
          }}
        />
      </div>
    );
  }
}

function mapStateToProps({
  department: {
    departmentDetail, // 部门详情
    childDepartmentList, // 当前部门的下级部门
    departmentMember, // 当前部门下成员
  },
}) {
  return { departmentDetail, childDepartmentList, departmentMember };
}

Basic.propTypes = {
  departmentId: PropTypes.string,           // 部门id
  dispatch: PropTypes.func,                 // redux dispatch
  onSelectDepartment: PropTypes.func,       // 选择部门，设置选中的部门
  departmentDetail: PropTypes.object,       // 部门详情
  onChangeCheckResult: PropTypes.func,      // 更改部门操作校验结果Modal visible、获取部门操作提交事件、获取部门操作校验提示信息
  isUpperDepartmentApprove: PropTypes.bool, // 调整上级部门操作是否走审批
};

Basic.defaultProps = {
  departmentId: '',
  dispatch: () => { },
  departmentDetail: {},
  childDepartmentList: {},          // 当前部门的下级部门
  departmentMember: {},             // 当前部门下成员
  onChangeCheckResult: () => { },
  onSelectDepartment: () => { },
  isUpperDepartmentApprove: false,
};

export default connect(mapStateToProps)(Basic);
