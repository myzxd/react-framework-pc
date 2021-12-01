/**
 *  新增明细 -- 组件
 */
import is from 'is_js';
// 为了操作数组/对象/函数时不改变原对象，引入这个库
import update from 'immutability-helper';
import { connect } from 'dva';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '@ant-design/compatible/assets/index.css';
import { Input, InputNumber, Button, Row, Col, Tooltip, Empty } from 'antd';
import { CoreUploadAmazon } from '../../../components/core';

import ComponentEmployeeList from './employeeList';
import { Unit } from '../../../application/define';
import styles from './style.less';

const PaymentMember = (props = {}) => {
  const {
    value,
    onChange,
    dispatch,
    changeShow,
    } = props;

  //  每一行的初始id
  const [namespace, setNamespace] = useState(0);

  // 上传成功回调
  const onSuccess = (key) => {
    if (changeShow) {
      changeShow(true);
    }
    dispatch({
      type: 'enterprisePayment/fetchEmployeListUpload',
      payload: {
        fileKey: key,
        onSuccessCallBack,
        onErrorCallBack,
      },
    });
  };

  // 上传失败回调
  const onErrorCallBack = () => {
    if (changeShow) {
      changeShow(false);
    }
  };

  // 导入成功回调
  const onSuccessCallBack = (result = []) => {
    const memberArray = value;
    changeShow(false);
    const data = result.map((v) => {
      return {
        ...v,
        disabled: true,
        owner_id: v.staff_id,
        money: Unit.exchangePriceToYuan(v.money),
      };
    });
    onChange([...memberArray, ...data]);
  };

  // 下载模版
  const onClickDownload = () => {
    dispatch({ type: 'enterprisePayment/fetchPaymentDownloadTemplate', payload: {} });
  };

  // 改变人员
  const onChangeSelect = (e, index) => {
    const memberArray = value;
    let money = memberArray[index].money;
    if (is.not.existy(memberArray[index].money) || is.empty(memberArray[index].money)) {
      money = undefined;
    }
    onChange(update(memberArray, {
      [index]: {
        owner_id: { $set: e.value },
        identity_card_id: { $set: e.identityCardId },
        name: { $set: e.name },
        money: { $set: money },
      },
    }));
  };

  // 改变金额
  const onChangeMoney = (e, index) => {
    const memberArray = value;
    let name = memberArray[index].name;
    let identityCardId = memberArray[index].identity_card_id;
    let ownerId = memberArray[index].owner_id;
    memberArray[index].money = e;
    // 姓名
    if (is.not.existy(memberArray[index].name) || is.empty(memberArray[index].name)) {
      name = undefined;
    }
    // 身份证号
    if (is.not.existy(memberArray[index].identity_card_id) || is.empty(memberArray[index].identity_card_id)) {
      identityCardId = undefined;
    }
    // 人员id
    if (is.not.existy(memberArray[index].owner_id) || is.empty(memberArray[index].owner_id)) {
      ownerId = undefined;
    }
    onChange(update(memberArray, {
      [index]: {
        money: { $set: e },
        name: { $set: name },
        identity_card_id: { $set: identityCardId },
        owner_id: { $set: ownerId },
      },
    }));
  };

  // 删除
  const onRemoveRow = (index) => {
    const memberArray = value;
    onChange(update(memberArray, {
      $splice: [[index, 1]],
    }));
  };

  // 添加
  const onAddDetail = () => {
    const memberArray = value;
    const rowObj = { namespace, temp_id: null };
    const namespaces = namespace + 1;
    setNamespace(namespaces);
    onChange(update(memberArray, { $push: [rowObj] }));
  };

  // 下载模板、新增明细与导入Excel
  const renderExcel = () => {
    const customContent = (
      <Tooltip title="建议上传不超过300条记录的Excel文件">
        <Button>导入Excel</Button>
      </Tooltip>
    );
    return (
      <Row >
        <Col span={12} offset={6} className={styles.bossAddExcelWrap}>
          <Button className={styles.bossAddExcelDownload} onClick={onClickDownload}>下载模板</Button>
          <CoreUploadAmazon domain="payment" customContent={customContent} onSuccess={onSuccess} />
          <Button className={styles.bossAddExcelDetal} onClick={onAddDetail}>新增明细</Button>
        </Col>
      </Row>
    );
  };

  const renderMember = () => {
    const stateArray = value;
    return stateArray.map((item, index) => {
      const disabled = !!item.disabled;
      return (
        <Row className={styles.bossAddMemberItem} key={index}>
          <Col span={12} offset={6}>
            <div className={styles.bossAddMemberForm}>
              <ComponentEmployeeList
                disabled={disabled}
                namespace={`${item.namespace}`}
                name={item.name}
                value={item.owner_id}
                onChange={e => onChangeSelect(e, index)}
              />
              <Input className={styles.bossAddMemberCardId} disabled value={item.identity_card_id} />
              <InputNumber
                className={styles.bossAddMemberExpense}
                disabled={disabled}
                value={item.money}
                placeholder="请输入费用"
                step={0.01}
                min={0}
                formatter={Unit.limitDecimals}
                parser={Unit.limitDecimals}
                onChange={e => onChangeMoney(e, index)}
              />
              <Button onClick={() => { onRemoveRow(index); }}>移除</Button>
            </div>
          </Col>
        </Row>
      );
    });
  };

  const detailHeight = `${window.innerHeight - 434}px`;
  return (
    <div>
      {/* 新增明细与导入Excel */}
      <div className={styles.bossAddMemberRenderExcel}>
        {renderExcel()}
      </div>
      {
          value.length > 0 ? (
            <div style={{ height: detailHeight, overflowY: 'scroll' }}>
              <div>
                {renderMember()}
              </div>
            </div>
          ) : (
            <div style={{ height: detailHeight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
            )
        }
    </div>
  );
};

// 变量&函数声明
PaymentMember.propTypes = {
  value: PropTypes.array, // 付款单明细
  onChange: PropTypes.func, // 表单值改变回调
  changeShow: PropTypes.func,
};

// 默认值
PaymentMember.defaultProps = {
  value: [],
  onChange: () => { }, // 表单值改变回调
  changeShow: () => { },
};

export default connect()(PaymentMember);
