/**
 * 核心组件，搜索
 */
import _ from 'lodash';
import is from 'is_js';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Row, Col, Button } from 'antd';
import { DeprecatedCoreForm } from './index';
import styles from './style/index.less';

const DeprecatedCoreSearch = (props = {}) => {
  const {
    items,                         // 详细item
    isShowOneRow, // 是否将数据展示为一行
    isHideReset,    // 是否隐藏重置按钮
    operations,          // 扩展操作按钮
    onReset,            // 重置的回调
    onSearch,         // 搜索的回调
    onHookForm,   // 绑定form控件
    onToggle,         // 展开回调
    form,
  } = props;
  // 是否展开搜索条件
  const [expand, setExpand] = useState(false);

  // 设置是否展开搜条件默认值
  useEffect(() => {
    setExpand(props.expand);
  }, [props.expand]);

  // 返回初始化的form对象
  useEffect(() => {
    if (onHookForm && is.existy(form) && is.not.empty(form)) {
      onHookForm(form);
    }
  }, []);

  // 搜索
  const onClickSearch = (e) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        if (onSearch) {
          onSearch(values);
        }
      }
    });
  };

  // 重置表单
  const onClickReset = () => {
    form.resetFields();

    if (onReset) {
      onReset(form.getFieldsValue());
    }
  };

  // 展开，收起
  const onClickToggle = () => {
    setExpand(!expand);
    if (onToggle) {
      onToggle(!expand);
    }
  };

  // 渲染表单
  const renderFormItems = () => {
    const isRenderMultiOperations = items.length >= 3;

    // 默认分3列展示条件
    const cols = 3;
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    // 默认不展开的情况下，显示的项目不超过6条
    let formItems = _.cloneDeep(items);
    if (items.length > 6 && expand !== true) {
      formItems = formItems.slice(0, 6);
    }

    // 遍历数据，处理元素
    formItems.map((item) => {
      const result = item;

      // 判断检索的元素中是否有回调函数，回调函数填充form数据
      if (is.function(item.form)) {
        result.form = item.form(form);
      }

      return result;
    });

    // 判断，如果不渲染多行搜索条件，则展示为一行
    if (isRenderMultiOperations === false) {
      formItems.push({
        offset: (2 - items.length) * (24 / cols),
        layout: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
        form: (
          <div className={styles['app-comp-core-right']}>
            <Button type="primary" htmlType="submit">查询</Button>
            {
              // 判断是否隐藏重置按钮，默认不隐藏
              isHideReset ? '' :
              <Button onClick={onClickReset} className={styles['app-comp-core-search-margin']} >重置</Button>
            }
            {/* 是否显示其他操作 */}
            {operations || ''}
          </div>
        ),
      });
    }

    const params = {
      cols,
      items: formItems,
      layout,
    };
    return (
      <DeprecatedCoreForm {...params} />
    );
  };

  const renderOperations = () => {
    const isRenderMultiOperations = items.length >= 3;
    // 如果检索条件小于等于3条，操作按钮直接渲染到表单中
    if (isRenderMultiOperations === false) {
      return <div />;
    }

    // 显示的项目超过6条, 则显示更多选项按钮
    let isShowOptions = false;
    if (items.length > 6) {
      isShowOptions = true;
    }

    // 更多选项
    const moreOptions = (
      <a className={styles['app-comp-core-search-more']} onClick={onClickToggle}>
        {expand ? <span>更少选项<UpOutlined /></span> : <span>更多选项<DownOutlined /></span>}
      </a>
    );

    return (
      <div className={styles['app-comp-core-footer']}>
        <Row type="flex" justify="space-around" align="middle">
          <Col span={24} className={styles['app-comp-core-right']}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button onClick={onClickReset} className={styles['app-comp-core-search-reset']}>重置</Button>
            <div className={`${styles['app-comp-core-right']} ${styles['app-comp-core-search-float']}`}>
              {operations}
              {isShowOptions ? moreOptions : ''}
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  // 渲染一行表单
  const renderOneRowFormItems = () => {
    // 默认分3列展示条件
    const cols = items.length + 1;
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    // 默认不展开的情况下，显示的项目不超过6条
    const formItems = _.cloneDeep(items);

    // 遍历数据，处理元素
    formItems.map((item) => {
      const result = item;

      // 判断检索的元素中是否有回调函数，回调函数填充form数据
      if (is.function(item.form)) {
        result.form = item.form(form);
      }

      return result;
    });

    // 添加操作
    formItems.push({
      span: 4,
      layout: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
      form: (
        <div className={styles['app-comp-core-right']}>
          <Button type="primary" htmlType="submit">查询</Button>
          {
            // 判断是否隐藏重置按钮，默认不隐藏
            isHideReset ? '' :
            <Button onClick={onClickReset} className={styles['app-comp-core-search-reset-not-hide']}>重置</Button>
          }
          {/* 是否显示其他操作 */}
          {operations || ''}
        </div>
      ),
    });

    const params = {
      cols,
      items: formItems,
      layout,
    };
    return (
      <DeprecatedCoreForm {...params} />
    );
  };

  const renderFormContent = () => {
    // 判断是否只渲染一行的搜索
    if (isShowOneRow) {
      return (
        <Form className="ant-advanced-search-form app-comp-core-content-search" onSubmit={onClickSearch}>
          {/* 渲染表单内容 */}
          {renderOneRowFormItems()}
        </Form>
      );
    }

    // 渲染多行的搜索
    return (
      <Form className="ant-advanced-search-form app-comp-core-content-search" onSubmit={onClickSearch}>
        {/* 渲染表单内容 */}
        {renderFormItems()}

        {/* 渲染操作按钮 */}
        {renderOperations()}
      </Form>
    );
  };

  return renderFormContent();
};

DeprecatedCoreSearch.propTypes = {
  items: PropTypes.array,                         // 详细item
  isShowOneRow: PropTypes.bool, // 是否将数据展示为一行
  isHideReset: PropTypes.bool,    // 是否隐藏重置按钮
  operations: PropTypes.node,          // 扩展操作按钮
  expand: PropTypes.bool,     // 是否展开搜索条件
  onReset: PropTypes.func,            // 重置的回调
  onSearch: PropTypes.func,         // 搜索的回调
  onHookForm: PropTypes.func,   // 绑定form控件
  onToggle: PropTypes.func,         // 展开回调
};

DeprecatedCoreSearch.defaultProps = {
  items: [],                         // 详细item
  isShowOneRow: false, // 是否将数据展示为一行
  isHideReset: false,    // 是否隐藏重置按钮
  operations: null,          // 扩展操作按钮
  expand: false,     // 是否展开搜索条件
  onReset: () => { },         // 重置的回调
  onSearch: () => { },        // 搜索的回调
  onHookForm: () => { },      // 绑定form控件
  onToggle: () => { },  // 展开回调
};

export default (Form.create()(DeprecatedCoreSearch));
