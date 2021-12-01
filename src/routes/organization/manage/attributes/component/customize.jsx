/**
 * 组织架构 - 部门管理 - 业务信息Tab - 自定义属性form组件
 */
import React from 'react';
import PropTypes from 'prop-types';

import { CoreContent } from '../../../../../components/core';
import Item from './customizeItem';

class Cusitomize extends React.Component {
  constructor() {
    super();
    this.state = {
      cusitomize: [], // 自定义属性
    };
  }

  onCreate = () => {
    const { value, onChange } = this.props;
    const val = [...value, {}];
    onChange && onChange(val);
  }

  onDelete = (key) => {
    const { value, onChange } = this.props;
    const val = [...value];
    val.splice(key, 1);
    onChange && onChange(val);
  }

  render() {
    const { value = [{}] } = this.props;
    return (
      <CoreContent title="业务信息列表">
        {
          value.map((val, key, rec) => {
            // 操作配置项
            const operateConfig = {
              create: false,
              delete: true,
            };

            key === rec.length - 1 && (operateConfig.create = true);
            rec.length === 1 && (operateConfig.delete = false, operateConfig.create = true);

            return (
              <Item
                key={key}
                markKey={key}
                value={val}
                operateConfig={operateConfig}
                onChange={this.onChange}
                onCreate={this.onCreate}
                onDelete={this.onDelete}
              />
            );
          })
        }
      </CoreContent>
    );
  }
}

Cusitomize.propTypes = {
  value: PropTypes.array,
};
Cusitomize.defaultProps = {
  value: [{}],
};

export default Cusitomize;
