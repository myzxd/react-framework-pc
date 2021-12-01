/**
 * 公用组件，部门信息
 */
import PropTypes from 'prop-types';
import is from 'is_js';
import dot from 'dot-prop';
import { TreeSelect } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';

import Operate from '../../../application/define/operate';
import {
  OrganizationDepartmentState,
} from '../../../application/define';

import { omit } from '../../../application/utils';

const CommonTreeSelectDepartments = (props = {}) => {
  const {
    namespace,
    departments,
    isAuthorized,
    value,
    defaultValue,
    onChange,
    fetchDataSource,                                         // 获取数据
    resetDataSource,                                         // 重置数据
    isOnlyShowCoach = false,
    isAuth,
    isDefaultValue = undefined,
    majorDepartmentInfo,
    isInfo = undefined,
    multiple = undefined,
  } = props;
  const dataSource = dot.get(departments, namespace, []);   // 部门树
  // 为优化审批流modals多次请求做的特殊处理
  const dataSources = dot.get(departments, 'oa-modal-department');
  // 默认值判断
  const [isSetDefaultValue, setIsSetDefaultValue] = useState(false);
  // 标识
  const [flag, setFlag] = useState(true);
  // 默认值
  const [values, setValues] = useState([]);
  // 默认值
  const [treeData, setTreeData] = useState([]);

  //  请求接口
  useEffect(() => {
    // 是审批命名空间 && 并且modal中已经有数据
    if (namespace === 'oa-modal-department' && (is.not.empty(dataSources) && is.existy(dataSources))) {
      return;
    }
    const payload = {
      namespace,
      isAuthorized,
      isAuth,
    };
    fetchDataSource(payload);
    return () => {
      resetDataSource({ namespace });
      setIsSetDefaultValue(false);
    };
  }, [namespace, isAuth, isAuthorized, fetchDataSource, resetDataSource, dataSources]);

  //  默认值
  useEffect(() => {
    if ((value || defaultValue)) {
      setValues(value || defaultValue);
    }
  }, [value, defaultValue, treeData]);

  // 处理数据
  useEffect(() => {
    if (dataSource.length > 0 && flag) {
      setFlag(false);
      // 此次是为了异步处理数据
      setTreeData(iterativeNodes(dataSource));
    }
  }, [dataSource]);

  //  表单b默认值
  useEffect(() => {
    // 默认值判断
    if (isDefaultValue && isSetDefaultValue !== true &&
      is.existy(majorDepartmentInfo) && is.not.empty(majorDepartmentInfo)
      && is.existy(dataSource) && is.not.empty(dataSource)) {
      const defaultValues = dot.get(majorDepartmentInfo, '_id', undefined);
      let info = iterativeOneNodes(dataSource, defaultValues);
      // 判断是否获取当前部门信息
      if (isInfo) {
        info = iterativeOneNodes(dataSource, defaultValues);
      }
      if (onChange) {
        setIsSetDefaultValue(true);
        onChange(defaultValues, [majorDepartmentInfo.name], {}, info);
      }
      setValues(defaultValues);
    }
  }, [isInfo, majorDepartmentInfo, namespace, isDefaultValue, dataSource, isSetDefaultValue, defaultValue]);


  // 选中的节点值
  const onChangeCallback = (val, label, extra) => {
    let info = {};
    // 判断是否获取当前部门信息
    if (isInfo) {
      info = iterativeOneNodes(dataSource, val);
    }
    // 获取id对应的每项
    if (onChange) {
      onChange(val, label, extra, info);
    }
    setValues(val);
  };

  // 获取id对应的每项
  const iterativeOneNodes = (nodes, id, list = []) => {
    // 判断是否有节点信息，有节点信息则渲染
    if (is.empty(nodes) || is.not.existy(nodes) || is.not.array(nodes)) {
      return {};
    }
    nodes.forEach((item) => {
      const { node, leaf = [] } = item;
      if (node._id === id) {
        list.push(node);
        // return;
      }
      iterativeOneNodes(leaf, id, list);
    });
    return list[0];
  };

  // 遍历获取，所有节点的keys
  const iterativeNodes = (nodes) => {
    // 判断是否有节点信息，有节点信息则渲染
    if (is.empty(nodes) || is.not.existy(nodes) || is.not.array(nodes)) {
      return [];
    }
    return nodes.map((item) => {
      const { node, leaf = [] } = item;

      // 是否显示部门状态（有“包含裁撤部门”系统权限 && 部门状态为已裁撤）
      const isShowState = Operate.canOperateEmployeeAbolishDepartment() && node.state === OrganizationDepartmentState.disable;
      // 已裁撤部门title
      const abolishTitle = `${node.name}（${OrganizationDepartmentState.description(node.state)}）`;

      // 默认的节点数据
      const dataItem = {
        title: isShowState ? abolishTitle : node.name,
        value: node._id,
        key: node._id,

        // 默认不禁用节点选择
        disabled: false,
      };

      // 如果只显示私教，则隐藏非私教选项
      if (isOnlyShowCoach) {
        dataItem.disabled = node.is_coach ? false : true;
      }

      // 如果有子节点数据
      if (is.not.empty(leaf) && is.array(leaf)) {
        dataItem.children = iterativeNodes(leaf);
      } else {
        dataItem.children = [];
      }

      return dataItem;
    }).filter((item) => {
      // 判断，如果子节点为空 && 并且当前节点不可选，则过滤（该过滤功能，主要为了展示私教节点使用）
      if (is.empty(item.children) && item.disabled === true) {
        return false;
      }

      // 不过滤节点，直接显示
      return true;
    });
  };

  let data = treeData.length > 0 ? values : undefined;
  // 单选模式下 value不能是一个空数组  单选多选兼容处理
  if (is.array(data) && data.length === 0 && !multiple) data = undefined;

  // 默认传递所有上级传入的参数
  const params = {
    ...props,
  };

  // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'applicationCommon',
    'isAuthorized',
    'isOnlyShowCoach',
    'value',
    'majorDepartmentInfo',
    'isDefaultValue',
    'isInfo',
    'isAuth',
  ], params);
  return (
    <TreeSelect
      {...omitedProps}
      showSearch
      filterTreeNode={(inputVal, node) => node.title.indexOf(inputVal) > -1}
      style={{ width: '100%' }}
      value={values}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeData={treeData}
      placeholder="请选择部门"
      treeDefaultExpandAll
      onChange={onChangeCallback}
    />
  );
};

CommonTreeSelectDepartments.propTypes = {
  namespace: PropTypes.string,
  departments: PropTypes.object,                                     // 用户数据
  isAuthorized: PropTypes.bool,
  value: PropTypes.array,
  defaultValue: PropTypes.array,
  onChange: PropTypes.func,
  fetchDataSource: PropTypes.func,                                         // 获取数据
  resetDataSource: PropTypes.func,                                         // 重置数据
};

CommonTreeSelectDepartments.defaultProps = {
  departments: {},
  isAuthorized: false,
  namespace: 'default',
  value: [],
  defaultValue: [],
  onChange: () => { },
  fetchDataSource: () => { },                                         // 获取数据
  resetDataSource: () => { },                                         // 重置数据
};


// 引用数据
const mapStateToProps = ({ applicationCommon: { departments } }) => ({ departments });

const mapDispatchToProps = dispatch => (
  {
    // 获取列表
    fetchDataSource: (params) => { dispatch({ type: 'applicationCommon/fetchDepartments', payload: params }); },
    // 重置列表
    resetDataSource: () => { dispatch({ type: 'applicationCommon/resetDepartments', payload: {} }); },
  }
);


export default connect(mapStateToProps, mapDispatchToProps)(CommonTreeSelectDepartments);
