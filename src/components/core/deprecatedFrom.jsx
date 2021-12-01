/**
 * 核心组件，表单
 */
import React from 'react';
import PropTypes from 'prop-types';
import '@ant-design/compatible/assets/index.css';
import { Form } from '@ant-design/compatible';
import { Row, Col } from 'antd';
import styles from './style/index.less';

// 默认的布局
const defaultLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

const DeprecatedCoreForm = (props = {}) => {
  const renderForms = (forms, layout, label, style, colon) => {
    const children = [];
    if (Array.isArray(forms) && forms.length > 0) {
      forms.forEach((item, index) => {
        const labelContent = (index === 0) ? label : '';
        children.push(
          <Form.Item {...layout} colon={colon} label={labelContent} className={styles['app-comp-core-form-margin-bottom']}>
            {item}
          </Form.Item>,
        );
      });
      return children;
    }

    return (
      <Form.Item {...layout} colon={colon} label={label} className={styles['app-comp-core-form-margin-bottom']} style={{ ...style }}>
        {forms}
      </Form.Item>
    );
  };

  // 渲染表单
  const renderFormItems = (items, cols, renderLayout) => {
    // 判断，如果表单项目为空，则直接返回
    if (!Array.isArray(items) || items.length <= 0) {
      return (<Row gutter={16}><Col span={24} /></Row>);
    }

    // 表单项目
    const children = [];
    items.forEach((item, index) => {
      // label名称, 位置偏移
      const { label, hide, key, style, colon } = item;

      // 具体表单内容, 表单布局, 栅格左侧的间隔格数
      let { form, layout, span, offset } = item;

      let itemKey;
      if (key) {
        itemKey = key;
      } else {
        // key值(如果label为空的时候，取随机值渲染)
        itemKey = (label !== undefined) ? index + label : index + Math.random();
      }

      // 判断form表单数据
      if (typeof form === 'string' || typeof form === 'number') {
        form = <div>{form}</div>;
      } else if (typeof form !== 'object') {
        form = <div />;
      }

      // 判断表单布局信息
      if (!layout) {
        layout = renderLayout;
      }
      // 当前列布局
      if (!span) {
        span = 24 / cols;
      }

      // 栅格左侧的间隔格数
      if (!offset) {
        offset = 0;
      }

      // 隐藏某项检索条件是否需要隐藏
      if (!hide) {
        children.push(
          <Col span={span} offset={offset} key={itemKey}>
            {renderForms(form, layout, label, style, colon)}
          </Col>,
        );
      }
    });
    return (
      <Row gutter={16} style={props.style} className={props.className}>
        {children}
      </Row>
    );
  };
  // 渲染的表单内容
  return renderFormItems(props.items, props.cols, props.layout);
};

DeprecatedCoreForm.propTypes = {
  cols: PropTypes.number,      // 列数
  layout: PropTypes.object,    // 布局
  items: PropTypes.array,      // 详细item
  style: PropTypes.object,     // 额外样式
  className: PropTypes.string, // 类名
};

DeprecatedCoreForm.defaultProps = {
  cols: 1,                     // 列数
  layout: defaultLayout,       // 布局
  items: [],                   // 详细item
  style: {},
};

// 上一版 module.exports = CoreForm;
export default DeprecatedCoreForm;
