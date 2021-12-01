/**
 * Form.List封装
 */
import React from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';

// 删除对象对应的key
const omit = (keys, obj) => {
  const res = { ...obj };
  keys.forEach(key => delete res[key]);
  return res;
};

const CoreFormList = (props) => {
  // 默认传递所有上级传入的参数
  const omitedProps = omit(['children'], { ...props });
  return (
    <Form.List {...omitedProps}>
      {props.children}
    </Form.List>
  );
};

CoreFormList.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  name: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.string, PropTypes.number),
  ]),
  children: PropTypes.func,
};

export default CoreFormList;
