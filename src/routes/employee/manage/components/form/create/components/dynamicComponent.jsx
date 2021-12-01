/**
 * 自定义表单加减组件
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import DynamicItems from './dynamicItems';

const { itemsConfig } = DynamicItems;

class DynamicComponent extends Component {
  static propTypes = {
    isModel: PropTypes.string,  // 子项使用的模板类型（学历信息、工作经历下显示不同的字段）
    onChange: PropTypes.func,   // 自定义表单onChange事件
    value: PropTypes.array,     // 自定义表单默认值
    fileType: PropTypes.string,           // 档案类型
  }

  static defaultProps = {
    isModel: '',
    fileType: '',
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 创建项
  onCreateItem = () => {
    let { value } = this.props;
    const { onChange } = this.props;
    value = [
      ...value,
      {},
    ];
    if (onChange) {
      onChange(value);
    }
  }

  // 删除项
  onDeleteItem = (key) => {
    const { value, onChange } = this.props;
    value.splice(key, 1);
    if (onChange) {
      onChange(value);
    }
  }

  // 改变项
  onChangeItem = (key, e) => {
    const { value, onChange } = this.props;
    const items = value.map((item, index) => {
      if (index === key) {
        return {
          ...item,
          ...e,
        };
      }
      return item;
    });
    if (onChange) {
      onChange(items);
    }
  }

  render() {
    const { value, isModel, fileType } = this.props;
    return (
      <div>
        {
          value.map((item, index, records) => {
            const length = records.length;
            // 显示项目的配置项
            const config = [];
            // 只有一行数据的情况下，只显示创建按钮
            if (length === 1) {
              config.push(itemsConfig.openCreate);
            // 多行数据的情况下，倒数第一条条显示创建按钮
            } else if (index === length - 1) {
              config.push(itemsConfig.openCreate, itemsConfig.openDelete);
            // 多行数据的情况下，除了最后一条显示创建按钮，其余都显示删除按钮
            } else {
              config.push(itemsConfig.openDelete);
            }
            // 合并表单数据，传递给下一级组件
            const values = Object.assign({ key: index }, item, {});
            return (
              <DynamicItems
                key={index}
                isModel={isModel}
                value={values}
                fileType={fileType}
                config={config}
                onCreate={this.onCreateItem}
                onDelete={this.onDeleteItem}
                onChange={this.onChangeItem}
              />
            );
          })
        }
      </div>
    );
  }
}

export default DynamicComponent;
