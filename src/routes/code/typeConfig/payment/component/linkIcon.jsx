/**
 * Code/Team审批管理 - 付款类型配置管理 - icon Select
 */
import React from 'react';
import {
  Select,
} from 'antd';

const { Option } = Select;

const LinkIcon = ({
  value,
  onChange,
}) => {
  const data = [
    {
      _id: '001',
      icon: <img src={require('../../../static/001@1x.png')} role="presentation" />,
    },
    {
      _id: '002',
      icon: <img src={require('../../../static/002@1x.png')} role="presentation" />,
    },
    {
      _id: '003',
      icon: <img src={require('../../../static/003@1x.png')} role="presentation" />,
    },
    {
      _id: '004',
      icon: <img src={require('../../../static/004@1x.png')} role="presentation" />,
    },
    {
      _id: '005',
      icon: <img src={require('../../../static/005@1x.png')} role="presentation" />,
    },
  ];

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder="请选择"
      allowClear
      showSearch
      optionFilterProp="children"
    >
      {
        data.map((i) => {
          return (
            <Option value={i._id} key={i._id}>
              {i.icon}
            </Option>
          );
        })
      }
    </Select>
  );
};

export default LinkIcon;
