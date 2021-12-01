/**
 * 新增页应用范围组件 WhiteList/Create
 */
import { connect } from 'dva';
import React, { useState } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Col, Row, message } from 'antd';
import ApplyRange from './components/range';
import ChooseApp from './components/chooseApp';
import KnightCreate from './components/knightCreate';
import BossCreate from './components/bossCreate';
import styles from './style/index.less';

import { WhiteListTerminalType, WhiteListAddressBookState } from '../../application/define';

const CreateWhiteList = (props = {}) => {
  const {
    dispatch,
    form = {},
    history = {},
  } = props;
  // 通讯录默认参数
  const [addressBook, setAddressBook] = useState(WhiteListAddressBookState.show);
  // 终端默认值
  const [terminal, setTerminal] = useState(WhiteListTerminalType.knight);
  //  全部选择的级别 ： 4为 都没有选择全部， 1为供应商是全部，2为城市全部，3为商圈全部
  const [allSelectorLevel, setAllSelectorLevel] = useState(WhiteListTerminalType.knight);

  // 更改全部选择回调
  const onChangeSelectAll = (num) => {
    setAllSelectorLevel(num);
  };

  // 提交
  const onSubmit = () => {
    form.validateFields((errs, values) => {
      if (!values.platform) {
        message.error('平台不能为空');
        return;
      }

      if (!values.supplier) {
        message.error('供应商不能为空');
        return;
      }

      // 城市不为空（默认是空字符串）  || 城市数组长度不为0
      if (!values.city || values.city.length === 0) {
        message.error('城市不能为空');
        return;
      }

      // 商圈不为空（默认是空字符串）  || 商圈数组长度不为0
      if (!values.districtsArray || values.districtsArray.length === 0) {
        message.error('商圈不能为空');
        return;
      }
      if (errs) {
        return;
      }
      const { platform, supplier, city, districtsArray, isTeam, isNeedAudit, isShowInfor, workBench } = values;
      const params = { platform, supplier, city, districtsArray, isTeam, isNeedAudit, isShowInfor, workBench, addressBook, terminal, allSelectorLevel };
      dispatch({ type: 'whiteList/fetchWhiteListCreate', payload: params });
      window.location.href = '/#/WhiteList';
    });
  };

  // 获取默认参数回调函数  TODO:@@
  const onDefaultParams = (params) => {
    if (params.addressBook !== undefined) {
      setAddressBook(params.addressBook);
    }
    if (params.terminal) {
      setTerminal(params.terminal);
    }
  };

  // 重置数据返回首页
  const onReset = () => {
    // 重置表单
    form.resetFields();
    // 返回首页
    history.push('/WhiteList');
  };

  // 渲染操作按钮
  const renderOperationButton = () => {
    return (
      <Row>
        <Col span={8} offset={8} className={styles['app-comp-white-list-create-operate-wrap']}>
          <Button type="default" onClick={onReset}>
            取消
          </Button>
          <Button type="primary" htmlType="submit" onClick={onSubmit}>
            新增
          </Button>
        </Col>
      </Row>
    );
  };

  const renderWhiteListComponent = () => {
    const { getFieldValue } = form;
    if (!getFieldValue('terminal') || getFieldValue('terminal') === WhiteListTerminalType.knight) {
      return <KnightCreate form={form} onDefaultParams={onDefaultParams} />;
    }
    return <BossCreate form={form} onDefaultParams={onDefaultParams} />;
  };

  return (
    <Form layout="horizontal">
      {/* 渲染白名单范围 */}
      <ApplyRange onChangeSelectAll={onChangeSelectAll} form={form} />

      {/* 渲染白名单终端 */}
      <ChooseApp form={form} onDefaultParams={onDefaultParams} />

      {/* 渲染白名单功能信息 */}
      {renderWhiteListComponent()}

      {/* 渲染操作按钮 */}
      {renderOperationButton()}
    </Form>
  );
};

export default connect()(Form.create()(CreateWhiteList));
