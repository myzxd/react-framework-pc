/**
 * 白名单编辑页
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Button, Col, Radio, Row, Form } from 'antd';

import { CoreContent, CoreForm } from '../../components/core';
import BossUpdate from './components/bossUpdate';
import KnightUpdate from './components/knightUpdate';
import { WhiteListTerminalType } from '../../application/define';
import styles from './style/index.less';


const UpdateWhiteList = (props = {}) => {
  const {
    dispatch,
    location,
    history,
    detailData,
  } = props;
  const { id } = location.query;
  // 表单
  const [form] = Form.useForm();
  // const [addressBook, setAddressBook] = useState(undefined);
  // const [terminal, setTerminal] = useState(undefined);
  // 获取详情数据
  useEffect(() => {
    dispatch({ type: 'whiteList/fetchWhiteListDetail', payload: { id } });
  }, [id]);

  // 设置表单默认值
  useEffect(() => {
    form.setFieldsValue({ terminal: dot.get(detailData, 'app_code', undefined) });
  }, [detailData]);

  // 重置数据返回首页
  const onReset = () => {
    // 返回首页
    history.push('/WhiteList');
    // 重置表单
    form.resetFields();
  };

  // 提交
  const onSubmit = async () => {
    const formValues = await form.validateFields();
    const { isTeam, isNeedAudit, isShowInfor, workBench, addressBook } = formValues;
    const params = { isTeam, isNeedAudit, isShowInfor, workBench, addressBook, id };
    dispatch({ type: 'whiteList/updateWhiteList', payload: { params } });
    // 返回首页
    history.push('/WhiteList');
  };

  // 获取默认参数回调函数
  // const onDefaultParamsCallback = (params) => {
  //   if (params.addressBook !== undefined) {
  //     setAddressBook(params.addressBook);
  //   }
  //   if (params.terminal) {
  //     setTerminal(params.terminal);
  //   }
  // };

  // 渲染商圈
  const renderDistrict = (data) => {
    const district = dot.get(data, 'biz_district_list', []);
    if (is.not.existy(district) || is.empty(district) || is.not.array(district)) {
      return '全部';
    }
    return district.map(item => item.name).join(' , ');
  };

  // 渲染城市
  const renderCity = (data) => {
    const city = dot.get(data, 'city_list', []);
    if (is.not.existy(city) || is.empty(city) || is.not.array(city)) {
      return '全部';
    }
    return city.map(item => item.city_name).join(' , ');
  };

  // 白名单应用范围
  const renderRange = () => {
    const data = detailData;
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
    const fromitems = [
      <Form.Item
        label="平台"
        {...layout}
      >
        <span>{dot.get(data, 'platform_name', '--')}</span>
      </Form.Item>,
      <Form.Item
        label="供应商"
        {...layout}
      >
        <span>{dot.get(data, 'supplier_name') || '全部'}</span>
      </Form.Item>,
      <Form.Item
        label="城市"
        {...layout}
      >
        <span>{renderCity(data)}</span>
      </Form.Item>,
      <Form.Item
        label="商圈"
        {...layout}
      >
        <span>{renderDistrict(data)}</span>
      </Form.Item>,
    ];
    return (
      <CoreContent title="白名单应用范围">
        <CoreForm items={fromitems} cols={4} />
      </CoreContent>
    );
  };

  // 应用终端
  const renderAPP = () => {
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 10 } };
    const formItems = [
      <Form.Item
        name="terminal"
        rules={[{ required: true, message: '请选择应用终端范围' }]}
        {...layout}
      >
        <Radio.Group disabled>
          <Radio value={WhiteListTerminalType.knight}>{WhiteListTerminalType.description(WhiteListTerminalType.knight)}</Radio>
          <Radio value={WhiteListTerminalType.boss}>{WhiteListTerminalType.description(WhiteListTerminalType.boss)}</Radio>
        </Radio.Group>
      </Form.Item>,
    ];
    return (
      <CoreContent title="应用终端" style={{ backgroundColor: '#FAFAFA' }}>
        <CoreForm items={formItems} cols={1} layout={layout} />
      </CoreContent>
    );
  };

  const renderOperationButton = () => {
    return (<Row>
      <Col span={8} offset={8} className={styles['app-comp-white-list-update-operate-wrap']}>
        <Button type="default" onClick={onReset}>
          取消
        </Button>
        <Button type="primary" htmlType="submit" onClick={onSubmit}>
          保存
        </Button>
      </Col>
    </Row>);
  };

  // 渲染boss编辑信息
  const renderBossUpdate = () => {
    return <BossUpdate form={form} data={detailData} />;
  };

  // 渲染骑士编辑信息
  const renderKnightUpdate = () => {
    return <KnightUpdate form={form} data={detailData} />;
  };

  if (dot.get(detailData, 'app_code') === WhiteListTerminalType.knight) {
    return (<Form layout="horizontal" form={form}>
      {/* 渲染范围内容 */}
      {renderRange()}

      {/* 渲染终端内容 */}
      {renderAPP()}

      {/* 渲染骑士功能模块 */}
      {renderKnightUpdate()}

      {/* 渲染操作按钮 */}
      {renderOperationButton()}
    </Form>);
  }
  return (
    <Form layout="horizontal" form={form}>
      {/* 渲染范围内容 */}
      {renderRange()}

      {/* 渲染终端内容 */}
      {renderAPP()}

      {/* 渲染老板功能模块 */}
      {renderBossUpdate()}

      {/* 渲染操作按钮 */}
      {renderOperationButton()}
    </Form>
  );
};

UpdateWhiteList.propTypes = {
  detailData: PropTypes.object,
};

UpdateWhiteList.defaultProps = {
  detailData: {},
};


function mapStateToProps({ whiteList: { detailData } }) {
  return { detailData };
}

export default connect(mapStateToProps)(UpdateWhiteList);
