/**
 * 城市管理 - 阶梯组件
 */
import is from 'is_js';
import React, { useEffect, useState } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Input, Row, Col, Button, Form, message, Popconfirm } from 'antd';

import ComponentSelectCities from './cities';
import styles from './style/index.less';

const ComponentCityItems = (props) => {
  const {
    dispatch,
    details = {},
    onChange = () => {},
    value,
  } = props;

  // 所属场景信息
  const [data, setData] = useState([{}]);

  // 设置所属场景信息
  useEffect(() => {
    if (value) {
      setData(value);
    }
  }, [value]);


  // 成功回调
  const onSuccessCallback = (result, index) => {
    const cityCodes = result.data[0];
    data[index].city_code = cityCodes.city_code;
    data[index].city_custom_name = cityCodes.city_custom_name;
    data[index].city_spelling = cityCodes.city_spelling;
    // const { setFieldsValue } = props.form;
    setData(data);
    if (onChange) {
      onChange(data);
    }
    // 设置校验的值
    // setFieldsValue({ platform: data[index].city_custom_name, cityList: data });
  };

  // 行政城市名称
  const onChangeCityName = (e, index) => {
    // const { setFieldsValue } = props.form;
    // setFieldsValue({ city: e._id });
    data[index]._id = e._id;
    data[index].city_code = undefined;
    data[index].city_custom_name = undefined;
    data[index].city_spelling = undefined;
    setData(data);

    if (onChange) {
      onChange(data);
    }
    const payload = {
      platformCode: details.platform_code, // 平台
      cityCode: e._id, // 城市code
      index, // 下标
      onSuccessCallback, // 成功回调
    };
    dispatch({ type: 'systemCity/fetchCityGetBasicInfo', payload });
  };

  // 平台城市名称
  const onChangeCityCustomName = (e, index) => {
    data[index].city_custom_name = e.target.value;
    // 判断城市名称是否为空
    if (is.not.existy(data[index]._id) || is.empty(data[index]._id)) {
      data[index]._id = undefined;
    }
    // 判断城市code是否为空
    if (is.not.existy(data[index].city_code) || is.empty(data[index].city_code)) {
      data[index].city_code = undefined;
    }
    // 判断平台城市代码是否为空
    if (is.not.existy(data[index].city_spelling) || is.empty(data[index].city_spelling)) {
      data[index].city_spelling = undefined;
    }
    if (props.onChange) {
      props.onChange(data);
    }
    setData(data);
  };

  // 增加
  const onPlusItem = (index) => {
    if (is.not.existy(data[index]) || is.empty(data[index])) {
      return message.error('当前数据，请填写完整再添加');
    }
    let flag = true;
    Object.keys(data[index]).forEach((v) => {
      if (is.not.existy(data[index][v]) || is.empty(data[index][v])) {
        flag = false;
      }
    });
    if (flag === false) {
      return message.error('当前数据，请填写完整再添加');
    }
    data.push({});
    setData(data);
    if (onChange) {
      onChange(data);
    }
  };

   // 删除
  const onDeleteItem = (i) => {
    data.splice(i, 1);
    if (onChange) {
      onChange([...data]);
    }
  };

  // 渲染
  const renderItem = (v, index, config) => {
    // const { getFieldDecorator } = props;
    return (
      <Row key={index}>
        <Col span={5}>
          <Form.Item
            label={<span style={{ width: 100 }} className="boss-form-item-required">行政城市名称</span>}
          >
            <ComponentSelectCities
              showSearch
              optionFilterProp="children"
              value={v._id}
              onCityChange={(e) => {
                return onChangeCityName(e, index);
              }}
              placeholder="行政城市名称"
              className={styles['app-comp-system-city-item-city-selector']}
            />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item label={<span style={{ width: 100 }}>行政城市code</span>}>
            <Input
              placeholder="行政城市code"
              disabled
              value={v.city_code}
            />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item
            label={<span style={{ width: 100 }} className="boss-form-item-required">平台城市名称</span>}
          >
            <Input
              placeholder="平台城市名称"
              value={v.city_custom_name}
              onChange={e => onChangeCityCustomName(e, index)}
            />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item label={<span style={{ width: 100 }}>平台城市代码</span>}>
            <Input
              disabled
              placeholder="平台城市代码"
              value={v.city_spelling}
            />
          </Form.Item>
        </Col>
        <Col span={2} style={{ marginLeft: 10 }}>
          <Form.Item>
            {
            config.operatDelete ? <Popconfirm
              title="是否要删除当前数据"
              onConfirm={() => onDeleteItem(index)}
            >
              <Button
                key="minus"
                shape="circle"
                icon={<MinusOutlined />}
                className={styles['app-comp-system-city-del-btn']}
              />
            </Popconfirm> : ''
          }
            {
            config.operatCreate ? <Button
              key="plus"
              shape="circle"
              icon={<PlusOutlined />}
              onClick={() => onPlusItem(index)}
            /> : ''
          }
          </Form.Item>
        </Col>
      </Row>
    );
  };

  const renderData = () => {
    return (
      <div>
        {
          data.map((v, index, arr) => {
            const len = arr.length;
            const config = {};

            // 所有条目都添加删除按钮
            config.operatDelete = true;
              // 若是最后一行数据,则添加创建按钮
            if (index === len - 1) {
              config.operatCreate = true;
                // 若只有一行数据,去掉删除按钮
              if (index === 0) {
                config.operatDelete = false;
              }
            }
            return renderItem(v, index, config);
          })
        }
      </div>
    );
  };

  return (
    <div>
      {renderData()}
    </div>
  );
};

export default ComponentCityItems;
