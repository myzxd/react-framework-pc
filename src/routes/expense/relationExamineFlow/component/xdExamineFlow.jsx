/**
 * 审批流组件
 */
import is from 'is_js';
import dot from 'dot-prop';
import React, { useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';
import _ from 'lodash';

import {
  RelationExamineFlowTabType,
  CodeFlowState,
  OaApplicationFlowTemplateState,
} from '../../../../application/define';
import { omit } from '../../../../application/utils';

const { Option } = Select;

function XDExamineFlow(props) {
  const { dispatch, name,
    state,
    xdExamineFlowList = {}, initItem = {},
    applyApplicationType, bizType, merchant } = props;
  const data = dot.get(xdExamineFlowList, 'datas', []);
  const interfaceRef = useRef(true);
  useEffect(() => {
    // 防止重复调用接口
    if (name && interfaceRef.current === true) {
      dispatch({
        type: 'relationExamineFlow/fetchXDExamineFlow',
        payload: {
          flowNameKey: name,
          bizType,
          merchant,
          applyApplicationType,
        },
      });
    }
  }, [dispatch, name, bizType, merchant, interfaceRef, applyApplicationType]);
  useEffect(() => {
    // 改变适用类型，清空数据
    if (applyApplicationType) {
      dispatch({
        type: 'relationExamineFlow/reduceXDExamineFlow',
        payload: {} });
    }
    return () => {
      dispatch({
        type: 'relationExamineFlow/reduceXDExamineFlow',
        payload: {} });
    };
  }, [dispatch, applyApplicationType]);

  // 查询
  const onSearch = _.debounce((e) => {
    interfaceRef.current = false;
    if (e) {
      dispatch({
        type: 'relationExamineFlow/fetchXDExamineFlow',
        payload: {
          flowNameKey: e,
          bizType,
          merchant,
          applyApplicationType,
          onReset: () => {
            // 查不到数据清空value值
            props.onChange && props.onChange();
          },
        },
      });
    }
  }, 800);

    // 回调函数
  const onChange = (e) => {
    interfaceRef.current = false;
    if (e) {
      if (props.onChange) {
        props.onChange(e);
      }
      return;
    }
      // 清空数据
    if (e === undefined) {
      dispatch({
        type: 'relationExamineFlow/reduceXDExamineFlow',
        payload: {} });
      if (props.onChange) {
        props.onChange();
      }
    }
  };

  // 去除Antd Select不需要的props
  const omitProps = omit([
    'dispatch',
    'xdExamineFlowList',
    'bizType',
    'merchant',
    'applyApplicationType',
    'initItem',
    'state',
  ], props);

  // 默认传递所有上级传入的参数
  const selectProps = {
    ...omitProps,
    placeholder: '请输入',
    showSearch: true,
    defaultActiveFirstOption: false,
    allowClear: true,
    filterOption: false,
    onChange,
    onSearch,
    notFoundContent: null,
  };
  // 判断是否是code/team
  const examineFlowState = bizType === RelationExamineFlowTabType.codeTeam ? CodeFlowState : OaApplicationFlowTemplateState;
  // 判断是否是初始，并且数据存在
  if (interfaceRef.current && is.existy(initItem) && is.not.empty(initItem) && initItem._id) {
    const ids = data.map(v => v._id);
    // 判断数据是否包含当前数据
    if (ids.includes(initItem._id) === false) {
      data.push({ ...initItem, disabled: true });
    }
  }
  return (
    <Select {...selectProps}>
      {
        data.map((item) => {
          return (<Option
            key={item._id}
            value={item._id}
            disabled={item.disabled}
          >{item.name}{item.disabled && state !== examineFlowState.normal ? `（${examineFlowState.description(state)}）` : null}</Option>);
        })
      }
    </Select>
  );
}

const mapStateToProps = ({ relationExamineFlow: { xdExamineFlowList } }) => {
  return { xdExamineFlowList };
};

export default connect(mapStateToProps)(XDExamineFlow);
