/**
 * 控件，界面
 */
import { Table } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { CorePreview } from '../../../../../components/core';
import styles from './style.less';

class DemoCoreparams extends Component {
  static propTypes = {
    item: PropTypes.object,
  }
  static defaultProps = {
    item: {},
  }

  renderDesc = (desc = '') => {
    return (
      <div>
        <p className={styles['app-comp-admin-api-document-desc-section']}>
          {desc}
        </p>
        <p className={styles['app-comp-admin-api-document-desc-section-btm']} />
      </div>
    );
  }

  renderParams = (params = []) => {
    const columns = [
      {
        title: '字段名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '字段类型',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '字段注释',
        dataIndex: 'note',
        key: 'note',
      },
      {
        title: '是否必填',
        dataIndex: 'required',
        key: 'required',
        render: (text) => {
          return text ? <span className={styles['app-comp-admin-api-document-table-required']}>是</span> : '否';
        },
      },
      {
        title: '枚举值',
        dataIndex: 'enum_values',
        key: 'enum_values',
      },
    ];

    return <Table rowKey={(record, index) => { return index; }} pagination={false} columns={columns} dataSource={params} bordered />;
  }

  // 渲染内容
  render = () => {
    const { item } = this.props;
    const { name, desc, path, params, result, example = {} } = item;

    if (Object.keys(item).length === 0) {
      return <div />;
    }

    return (
      <div>
        {/* 接口文档 */}
        <div className={styles['app-comp-admin-api-document-wrap']}>
          {/* 标题描述 */}
          <p className={styles['app-comp-admin-api-document-title']}>
            {name} - {desc}
          </p>

          {/* 接口地址 */}
          <p className={styles['app-comp-admin-api-document-api-url']}>
            接口地址：
          </p>
          <p className={styles['app-comp-admin-api-document-api-url-value']}>
            {path}
          </p>

          {/* 请求参数 */}
          <p className={styles['app-comp-admin-api-document-request-params']}>
            请求参数：
          </p>
          {this.renderParams(params)}

          {/* 返回结果结构 */}
          <p className={styles['app-comp-admin-api-document-response-shape']}>
            返回结果：
          </p>
          <CorePreview>{JSON.stringify(result, null, '\t')}</CorePreview>
        </div>

        {/* 测试用例 */}
        <div className={styles['app-comp-admin-api-document-test-wrap']}>
          {/* 标题描述 */}
          <p className={styles['app-comp-admin-api-document-test-title']}>
            测试用例
          </p>

          <p className={styles['app-comp-admin-api-document-test-params']}>
            参数：
          </p>
          <CorePreview>{example.params ? JSON.stringify(example.params, null, '\t') : ''}</CorePreview>

          <p className={styles['app-comp-admin-api-document-test-return']}>
            返回：
          </p>
          <CorePreview>{example.result ? JSON.stringify(example.result, null, '\t') : ''}</CorePreview>
        </div>
      </div>
    );
  }
}
export default DemoCoreparams;
