/**
 * 核心组件，下拉选择
 */
import is from 'is_js';
import dot from 'dot-prop';
import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import { omit } from '../../application/utils';

const Option = Select.Option;

// 全选选项
const CoreSelectAllOption = 'CoreSelectAllOption';

const CoreSelect = (props = {}) => {
  const {
    isGroup,   // 内容是否分组
    children, // 模块内容
    onChange,  // onChange回调函数
    enableSelectAll, // 如果是多选模式
    mode,
  } = props;
  const [value, setValue] = useState([]);

  useEffect(() => {
    setValue(props.value || props.defaultValue);
  }, [props.defaultValue, props.value]);

  const onChangeCallback = (val) => {
    // 如果是多选模式，并且开启了全选设置，则添加全选的选项
    const isEnableSelectAll = checkEnableSelectAll();
    // 默认的选中值
    let selected = val;
    // 默认的选中项
    let selectedOptions;
    if (is.array(val)) {
      // 多选模式
      selectedOptions = children.filter(item => val.indexOf(item.props.value) !== -1);
    } else {
      // 单选模式
      selectedOptions = children.filter(item => item.props.value === val).shift();
    }

    // 设置初始 是否全选为false
    let isSelectedAll = false;
    // 判断是否开启全选模式 && 选项中是是全选选项 && 选项内容不为空
    if (isEnableSelectAll && (val === CoreSelectAllOption || selected.filter(item => item === CoreSelectAllOption).length !== 0) && children.length !== 0) {
      // 选择全选选项后,则设置 是否全选为true
      isSelectedAll = true;

      if (isGroup === false) {
        // 如果选中项为全选，遍历所有选项，设置选中值
        selected = children.map(item => item.props.value);
        selectedOptions = children;
      } else {
        // 如果选中项为全选，遍历所有选项，设置选中值
        selected = [];
        selectedOptions = [];
        // 遍历组节点元素
        children.forEach((group) => {
          // 遍历项目元素
          dot.get(group, 'props.children', []).forEach((item) => {
            selected.push(item.props.value);
            selectedOptions.push(item);
          });
        });
      }
    }
    // 判断 如果没有选择全选项，手动选择全部
    if (val !== undefined && val.length === children.length) {
      isSelectedAll = true;
    }
    // 过滤空元素
    // selected = selected.filter(item => item !== undefined);

    // console.log('DEBUG: 全选选项', value, selected);
    setValue(selected);
    if (onChange) {
      onChange(selected, selectedOptions, isSelectedAll);
    }
  };

  // 校验是否是多选模式
  const checkEnableSelectAll = () => {
    return ['multiple', 'tags'].includes(mode) && enableSelectAll === true;
  };

  // 如果是多选模式，并且开启了全选设置，则添加全选的选项
  const isEnableSelectAll = checkEnableSelectAll();

  // console.log('DEBUG: CoreSelect render数据', children, value, enableSelectAll);

  const options = [].concat(children);
  // 如果是多选，并且选项不为空，就在第一位加上全选项
  if (isEnableSelectAll && children.length !== 0 && dot.get(children, '0.key') !== CoreSelectAllOption) {
    options.unshift(<Option value={CoreSelectAllOption} key={CoreSelectAllOption}>全选</Option>);
  }

  // 默认传递所有上级传入的参数
  const params = { ...props };
  params.onChange = onChangeCallback;   // 覆盖onChange事件
  params.value = value;              // 选中值

  // 去除Antd Select不需要的props
  const omitedProps = omit([
    'enableSelectAll',
    'isGroup',
  ], params);

  return (
    <Select {...omitedProps} >
      {options}
    </Select>
  );
};

CoreSelect.propTypes = {
  isGroup: PropTypes.bool,   // 内容是否分组
  children: PropTypes.array, // 模块内容
  onChange: PropTypes.func,  // onChange回调函数
  enableSelectAll: PropTypes.bool, // 如果是多选模式
};

CoreSelect.defaultProps = {
  isGroup: false,
  children: [],
  enableSelectAll: false,
};

CoreSelect.Option = Select.Option;
CoreSelect.OptGroup = Select.OptGroup;

export default CoreSelect;
