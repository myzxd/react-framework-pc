/**
 * 自定义表单加减组件项
 */
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, DatePicker } from 'antd';

import { FileType } from '../../../../../../../application/define';
import { DeprecatedCoreForm } from '../../../../../../../components/core';
import { CommonSelectEducations } from '../../../../../../../components/common';

import style from './style.css';

const { RangePicker } = DatePicker;

// 子项目配置项
const itemsConfig = {
  openCreate: 'openCreate',
  openDelete: 'openDelete',
};

class DynamicItems extends Component {
  static propTypes = {
    isModel: PropTypes.string,  // 模板类型（学历信息、工作经历下显示不同的字段）
    value: PropTypes.object,    // 表单内容
    fileType: PropTypes.string,           // 档案类型
    config: PropTypes.array,    // 加减按钮配置项
    onCreate: PropTypes.func,   // 创建一条
    onDelete: PropTypes.func,   // 删除当前条
    onChange: PropTypes.func,   // 更改项
  }

  static defaultProps = {
    isModel: '',
    value: {},
    fileType: '',
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 创建项
  onCreate = () => {
    const { value, onCreate } = this.props;
    if (onCreate) {
      onCreate(value.key);
    }
  }

  // 删除项
  onDelete = () => {
    const { value, onDelete } = this.props;
    if (onDelete) {
      onDelete(value.key);
    }
  }

  // 修改表单
  onChange = (e) => {
    const { value, onChange } = this.props; // 回调事件, 数据变化
    if (onChange) {
      onChange(value.key, e);
    }
  }

  // 改变院校名称
  onChangeInstitution = (e) => {
    const institutionName = e.target.value;
    this.onChange({ institutionName });
  }

  // 改变学历
  onChangeEducation = (dynamicEducation) => {
    this.onChange({ dynamicEducation });
  }

  // 改变专业
  onChangeProfession = (e) => {
    const profession = e.target.value;
    this.onChange({ profession });
  }

  // 改变时间
  onChangePeriod = (period) => {
    this.onChange({ period });
  }

  // 改变工作单位
  onChangeEmployer = (e) => {
    const employer = e.target.value;
    this.onChange({ employer });
  }

  // 改变职位
  onChangePosition = (e) => {
    const workPosition = e.target.value;
    this.onChange({ workPosition });
  }

  // 改变证明人姓名
  onChangeWitness = (e) => {
    const witness = e.target.value;
    this.onChange({ witness });
  }

  // 改变证明人电话
  onChangeWitnessPhone = (e) => {
    const witnessPhone = e.target.value;
    this.onChange({ witnessPhone });
  }

  // 改变工作时间
  onChangeWorkPeriod = (workPeriod) => {
    this.onChange({ workPeriod });
  }

  // 日期选择范围限制
  rangePickerDisabledDate = (current) => {
    return current && current > moment().endOf('day');
  }

  // 渲染表单项
  renderDeprecatedCoreForm = () => {
    const { config, isModel, fileType } = this.props;
    const {
      institutionName,
      dynamicEducation,
      profession,
      period = null,
      employer,
      workPosition,
      witness,
      witnessPhone,
      workPeriod = null,
    } = this.props.value;
    let dynamicItems;
    if (isModel === 'education') {
      dynamicItems = [
        {
          label: '院校名称',
          offset: 2,
          key: 'institutionName',
          form: <Input
            value={institutionName}
            onChange={this.onChangeInstitution}
            placeholder="请输入院校名称"
          />,
        },
        {
          label: '学历',
          key: 'dynamicEducation',
          form: <CommonSelectEducations
            value={dynamicEducation}
            onChange={this.onChangeEducation}
            allowClear
            className={style['app-comp-employee-manage-form-create-schooling']}
          />,
        },
        {
          label: '专业',
          key: 'profession',
          form: <Input
            value={profession}
            onChange={this.onChangeProfession}
            placeholder="请输入专业"
          />,
        },
        {
          label: '时间',
          span: 6,
          layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
          key: 'period',
          form: <RangePicker
            value={period}
            disabledDate={this.rangePickerDisabledDate}
            onChange={this.onChangePeriod}
          />,
        },
      ];
    } else {
      dynamicItems = [
        {
          label: '工作单位',
          key: 'employer',
          form: <Input
            value={employer}
            onChange={this.onChangeEmployer}
            placeholder="请输入工作单位"
          />,
        },
        {
          label: `${fileType}` === `${FileType.staff}` ? '曾任职岗位' : '职位',
          key: 'workPosition',
          form: <Input
            value={workPosition}
            onChange={this.onChangePosition}
            placeholder="请输入职位"
          />,
        },
        {
          label: '证明人姓名',
          key: 'witness',
          form: <Input
            value={witness}
            onChange={this.onChangeWitness}
            placeholder="请输入证明人姓名"
          />,
        },
        {
          label: '证明人电话',
          key: 'witnessPhone',
          form: <Input
            value={witnessPhone}
            onChange={this.onChangeWitnessPhone}
            placeholder="请输入证明人电话"
          />,
        },
        {
          label: '工作时间',
          key: 'workPeriod',
          form: <RangePicker
            value={workPeriod}
            disabledDate={this.rangePickerDisabledDate}
            onChange={this.onChangeWorkPeriod}
          />,
        },
      ];
    }
    if (config.includes(itemsConfig.openCreate) && config.includes(itemsConfig.openDelete)) {
      dynamicItems.push({
        form: (
          <div>
            <Button className={style['app-comp-employee-manage-form-create-comp-button']} onClick={this.onDelete} shape="circle" icon={<MinusOutlined />} />
            <Button onClick={this.onCreate} shape="circle" icon={<PlusOutlined />} />
          </div>
        ),
      });
    } else if (config.includes(itemsConfig.openCreate)) {
      dynamicItems.push({
        form: (
          <div>
            <Button onClick={this.onCreate} shape="circle" icon={<PlusOutlined />} />
          </div>
        ),
      });
    } else if (config.includes(itemsConfig.openDelete)) {
      dynamicItems.push({
        form: (
          <div>
            <Button onClick={this.onDelete} shape="circle" icon={<MinusOutlined />} />
          </div>
        ),
      });
    }
    return (
      <DeprecatedCoreForm items={dynamicItems} cols={isModel === 'education' ? 6 : 3} />
    );
  }

  render() {
    return (
      <div>
        {/* 渲染表单项 */}
        {this.renderDeprecatedCoreForm()}
      </div>
    );
  }
}

DynamicItems.itemsConfig = itemsConfig;
export default DynamicItems;
