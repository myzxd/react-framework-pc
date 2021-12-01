/**
 * 角色，职位，权限 对照显示模块
 */
import { Button } from 'antd';
import React, { Component } from 'react';
import { CoreContent, DeprecatedCoreForm } from '../../components/core';
import Package from '../../../package.json';
import { TransferLoaderForSalary, TransferLoaderForExpense, TransferLoaderForSalaryRelate } from '../../application/utils/transfer/index';

class System extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datamap: '',
    };
  }

  processSalary = () => {
    const datamap = TransferLoaderForSalary.transfer();
    this.setState({
      datamap,
    });
  }

  processOA = () => {
    const datamap = TransferLoaderForExpense.transfer();
    this.setState({
      datamap,
    });
  }

  processSalaryRelate = () => {
    const datamap = TransferLoaderForSalaryRelate.transfer();
    this.setState({
      datamap,
    });
  }

  // 渲染数据映射对象
  renderDataMapObject = () => {
    const { datamap } = this.state;
    if (datamap.length < 0) {
      return <div />;
    }
    return (
      <CoreContent title="数据映射" style={{ backgroundColor: '#FAFAFA' }} >
        <pre>
          {datamap}
        </pre>
      </CoreContent>
    );
  }

  // 渲染系统信息
  renderPackage = () => {
    const formItems = [
      {
        label: '系统当前版本',
        form: Package.version,
      }, {
        label: 'oa相关对象转换',
        form: <Button type="primary" onClick={this.processOA}>转换</Button>,
      }, {
        label: '相关对象转换',
        form: <Button type="primary" onClick={this.processSalary}>转换</Button>,
      }, {
        label: '对象+关系转换',
        form: <Button type="primary" onClick={this.processSalaryRelate}>转换</Button>,
      },
    ];
    const layout = { labelCol: { span: 12 }, wrapperCol: { span: 12 } };
    return (
      <CoreContent title="系统信息" style={{ backgroundColor: '#FAFAFA' }} >
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染系统信息 */}
        {this.renderPackage()}

        {/* 渲染数据映射对象 */}
        {this.renderDataMapObject()}
      </div>
    );
  }
}
export default System;
