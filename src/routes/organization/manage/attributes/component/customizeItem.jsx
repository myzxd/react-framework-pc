/**
 * 组织架构 - 部门管理 - 业务信息Tab - 自定义属性Itme
 */
import React from 'react';
import PropTypes from 'prop-types';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Input, Button } from 'antd';

import { DeprecatedCoreForm } from '../../../../../components/core';

class Item extends React.Component {
  onChange = () => {
    const { onChange } = this.props;
    onChange && onChange();
  }
  renderContent = () => {
    const { operateConfig = {}, onCreate, onDelete, markKey } = this.props;
    // 加号
    const addForm = {
      span: 2,
      form: (
        <Button
          onClick={() => onCreate()}
          shape="circle"
          icon={<PlusOutlined />}
        />
      ),
    };

    // 减号
    const lessForm = {
      span: 2,
      form: (
        <Button
          onClick={() => onDelete(markKey)}
          shape="circle"
          icon={<MinusOutlined />}
        />
      ),
    };

    const formItems = [
      {
        label: '标签名称',
        form: (
          <Input value="11" />
        ),
      },
      {
        label: '标签内容',
        form: (
          <Input value={22} />
        ),
      },
    ];

    operateConfig.delete && (formItems[formItems.length] = lessForm);
    operateConfig.create && (formItems[formItems.length] = addForm);

    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <DeprecatedCoreForm
        items={formItems}
        layout={layout}
        cols={4}
      />
    );
  }

  render() {
    return this.renderContent();
  }
}

Item.propTypes = {
  operateConfig: PropTypes.object,
  // value: PropTypes.object,
  markKey: PropTypes.number,
  onChange: PropTypes.func,
  onCreate: PropTypes.func,
  onDelete: PropTypes.func,
};
Item.defaultProps = {
  value: {},
  operateConfig: {},
  markKey: 0,
  onChange: () => {},
  onCreate: () => {},
  onDelete: () => {},
};

export default Item;
