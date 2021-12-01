/**
 * 组织架构 - 部门管理 - 岗位编制 - 增编/减编（button）
 */
import { connect } from 'dva';
import React, { useState } from 'react';
import {
  Button,
  message,
  Tooltip,
} from 'antd';
import {
  OrganizationDepartmentChangeType,
} from '../../../../../../application/define';

import { utils } from '../../../../../../application';
import Establishment from '../drawer/establishment';

const EstablishmentBtn = ({
  dispatch,
  departmentDetail = {}, // 部门详情
  postList = [], // 当前部门下岗位列表
  organizationSubType, // 组织架构操作类型
  title,
  isUpdate, // 是否为编辑
  updateInitValue = {}, // 编辑时，默认岗位数据
  breakDepartmentList, // 刷新列表
}) => {
  // button loading
  const [isLoading, setIsLoading] = useState(false);
  // drawer visible
  const [visible, setVisible] = useState(false);
  // 审批流id
  const [flowId, setFlowId] = useState(undefined);
  // 是否走审批流程
  const [isApprove, setIsApprove] = useState(false);

  const {
    _id: departmentId, // 部门id
    // name: departmentName, // 部门名称
  } = departmentDetail;

  // 隐藏抽屉
  const onClose = () => {
    // 重置审批流id
    setFlowId(undefined);
    // 重置是否走审批状态
    setIsApprove(false);
    // 隐藏
    setVisible(false);
  };

  // 编辑
  const onUpdatePostCount = () => {
    // 设置审批流
    setFlowId(utils.dotOptimal(updateInitValue, 'oa_application_flow_id', undefined));
    // 编辑默认走审批
    setIsApprove(true);
    // 显示弹窗
    setVisible(true);
  };

  // 增编/减编
  const onSetPostCount = async () => {
    // 设置button loading为加载中
    await setIsLoading(true);

    // 组织架构操作配置
    const configRes = await dispatch({
      type: 'department/getOrganizationConfig',
      payload: {},
    });

    // 接口失败处理
    if (configRes && configRes.zh_message) {
      // 取消button loading加载状态
      setIsLoading(false);
      message.error(configRes.zh_message);
      return;
    }

    // 接口成功处理
    if (configRes && Array.isArray(configRes)) {
      // 是否走审批流程
      let curIsApprove = false;
      // 操作是否走审批（接口配置）
      let opConfig = false;
      // 增编
      organizationSubType === OrganizationDepartmentChangeType.add && (opConfig = utils.dotOptimal(configRes, '0.config_info.add_authorized_strength'));
      // 减编
      organizationSubType === OrganizationDepartmentChangeType.remove && (opConfig = utils.dotOptimal(configRes, '0.config_info.reduce_authorized_strength'));

      // 组织架构配置有数据 || 配置类型为20(组织架构) || 增编类型配置为true
      if (configRes.length > 0
        && configRes.find(c => c.config_type === 20)
        && opConfig
      ) {
        curIsApprove = true;
      }

      // 设置是否走审批流程状态
      await setIsApprove(curIsApprove);

      // 不走审批流程
      if (!curIsApprove) {
        // 取消button loading加载状态
        setIsLoading(false);
        setVisible(true);
      }

      // 走审批流程
      if (curIsApprove) {
        // 获取审批流列表
        const flowRes = await dispatch({
          type: 'department/getOrganizationFlowList',
          payload: {
            departmentId, // 部门id
            organizationSubType, // 部门/编制子类型（增编）
          },
        });

        // 接口失败处理
        if (flowRes && flowRes.zh_message) {
          // 取消button loading加载状态
          setIsLoading(false);
          message.error(flowRes.zh_message);
          return;
        }

        // 接口成功处理
        if (flowRes && Array.isArray(flowRes.data)) {
          // 审批流id
          const curFlowId = utils.dotOptimal(flowRes, 'data.0.flow_template_records.0._id', undefined);

          // 不存在审批流
          if (!curFlowId) {
            setIsLoading(false);
            message.error('提示：无适用审批流，请联系流程管理员');
          } else {
            // 设置审批流id
            await setFlowId(curFlowId);
            // 设置button loading状态
            setIsLoading(false);
            // 显示抽屉
            setVisible(true);
          }
        }
      }
    }
  };

  // 渲染抽屉
  const renderDrawer = () => {
    if (!visible) return;
    // 满员岗位列表（在编人数与岗位编制数相同）
    const fullData = postList.filter(p => utils.dotOptimal(p, 'organization_count', 0) === utils.dotOptimal(p, 'organization_num', 0));
    // 当前部门下，编制人数与占编人数相同的岗位
    // 新建增编
    const countPostList = (!isUpdate && organizationSubType === OrganizationDepartmentChangeType.add) ? (fullData.length > 0 ? fullData : postList) : [];

    // props
    const props = {
      dispatch,
      visible,
      flowId,
      isApprove,
      departmentDetail,
      countPostList,
      organizationSubType,
      isUpdate,
      updateInitValue,
      onClose,
      breakDepartmentList,
    };

    return (
      <Establishment {...props} />
    );
  };

  // 编辑操作
  const renderUpdateBtn = () => {
    return (
      <a
        onClick={onUpdatePostCount}
        style={{ margin: 10 }}
      >编辑</a>
    );
  };

  // 新建操作
  const renderCreateBtn = () => {
    if (title === '增编') {
      return (
        <Tooltip title="「正常」分类下未找到对应的岗位，请先点击「添加岗位」按钮去添加岗位">
          <Button
            type="primary"
            loading={isLoading}
            onClick={onSetPostCount}
            style={{ marginLeft: 10 }}
          >{title}</Button>
        </Tooltip>
      );
    }

    return (
      <Button
        type="primary"
        loading={isLoading}
        onClick={onSetPostCount}
        style={{ marginLeft: 10 }}
      >{title}</Button>
    );
  };

  return (
    <React.Fragment>
      {
        isUpdate ? renderUpdateBtn() : renderCreateBtn()
      }
      {/* 抽屉 */}
      {renderDrawer()}
    </React.Fragment>
  );
};

const mapStateToProps = ({
  department: { departmentOrderList },
}) => ({ departmentOrderList });

export default connect(mapStateToProps)(EstablishmentBtn);
