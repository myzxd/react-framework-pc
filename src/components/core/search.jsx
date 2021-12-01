/**
 * 核心组件，搜索
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Form, Row, Col, Button } from 'antd';
import { CoreForm } from './index';
import { system } from '../../application';
import styles from './style/index.less';

const CollapseRows = 2;  // 收起的时候展示两行
const RenderOneRowLimit = 3; // 少于3个item展示一行

const CoreSearch = ({
  onHookForm, onSearch, onReset, expand, onToggle, items,
  operations, isHideReset, cols, isShowOneRow, layout, expandItems,
  isSetStorageSearchValue = false, SearchStorageKey, ...restProps
}) => {
  const [form] = Form.useForm();
  const [isExpand, setIsExpand] = useState(expand);

  // 返回初始化的form对象
  useEffect(() => {
    onHookForm(form);
  }, [onHookForm, form]);

  useEffect(() => {
    if (isSetStorageSearchValue && SearchStorageKey) {
      const values = system.searchParams(SearchStorageKey);
      form && form.setFieldsValue({ ...values });
    }
  }, [isSetStorageSearchValue, SearchStorageKey]);

  // 重置表单
  const onClickReset = () => {
    form.resetFields();
    onReset(form.getFieldsValue());
  };

  // 展开，收起
  const onClickToggle = () => {
    setIsExpand((prevExpand) => {
      onToggle(!prevExpand);
      return !prevExpand;
    });
  };

  // 渲染表单
  const renderFormItems = () => {
    // 判断是否需要收起项目
    let formItems = [...items];
    if (items.length > CollapseRows * cols && !isExpand) {
      formItems = formItems.slice(0, 6);
    }

    // 判断，如果不渲染多行搜索条件，则展示为一行
    if (items.length < RenderOneRowLimit) {
      formItems.push({
        offset: (2 - items.length) * (24 / cols),
        layout: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
        render: (
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

    return (
      <React.Fragment>
        <CoreForm cols={cols} items={formItems} />
        {
          Array.isArray(expandItems) && expandItems.length > 0 && formItems.length === items.length
            ? <CoreForm cols={2} items={expandItems} />
            : null
        }
      </React.Fragment>
    );
  };

  const renderOperations = () => {
    if (items.length < RenderOneRowLimit) {
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
        {isExpand ? <span>更少选项<UpOutlined /></span> : <span>更多选项<DownOutlined /></span>}
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
    const formItems = [...items];

    // 添加操作
    formItems.push({
      span: 4,
      layout: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
      render: (
        <div className={styles['app-comp-core-right']}>
          <Button type="primary" htmlType="submit">查询</Button>
          {
            // 判断是否隐藏重置按钮，默认不隐藏
            isHideReset ? '' :
            <Button onClick={onClickReset} className={styles['app-comp-core-search-reset-not-hide']}>重置</Button>
          }
          {operations}
        </div>
      ),
    });

    return (
      <CoreForm cols={items.length + 1} items={formItems} />
    );
  };

  const renderFormContent = () => {
    // 判断是否只渲染一行的搜索;
    if (isShowOneRow) {
      return renderOneRowFormItems();
    }
    return (<React.Fragment>
      {/* 渲染表单内容 */}
      { renderFormItems() }

      {/* 渲染操作按钮 */}
      {renderOperations()}
    </React.Fragment>);
  };


  // 渲染多行的搜索
  return (
    <Form
      {...layout}
      {...restProps}
      form={form}
      className="ant-advanced-search-form app-comp-core-content-search"
      onFinish={onSearch}
    >
      {renderFormContent()}
    </Form>
  );
};

CoreSearch.propTypes = {
  layout: PropTypes.object, // 表单布局
  cols: PropTypes.number, // 展示布局列数
  items: PropTypes.array.isRequired,                         // 详细item
  onReset: PropTypes.func,            // 重置的回调
  onSearch: PropTypes.func,         // 搜索的回调
  onHookForm: PropTypes.func,   // 绑定form控件
  operations: PropTypes.node,  // 扩展操作按钮
  onToggle: PropTypes.func,         // 展开回调
  expand: PropTypes.bool,     // 是否展开搜索条件
  isShowOneRow: PropTypes.bool, // 是否将数据展示为一行
  isHideReset: PropTypes.bool,    // 是否隐藏重置按钮
};

CoreSearch.defaultProps = {
  layout: { labelCol: { span: 8 }, wrapperCol: { span: 16 } }, // 默认布局
  cols: 3, // 默认展示3列布局
  onReset: () => {},            // 重置的回调
  onSearch: () => {},         // 搜索的回调
  onHookForm: () => {},   // 绑定form控件
  operations: null,          // 扩展操作按钮
  onToggle: () => {},         // 展开回调
  expand: false,     // 是否展开搜索条件
  isShowOneRow: false, // 是否将数据展示为一行
  isHideReset: false,    // 是否隐藏重置按钮
};

export default CoreSearch;
