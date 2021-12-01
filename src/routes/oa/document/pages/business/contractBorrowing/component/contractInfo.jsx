/**
 * 添加多个借阅合同组件
 */
import React, { useEffect } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import ContractInfoItem from './contractInfoItem';
import style from './style.less';

ContractInfo.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.array,
};

function ContractInfo({
  onChange,
  value,
  resetBusinessPactContractSelect,
  setPreserverId,
  mState,
}) {
  useEffect(() => {
    return () => {
      // 清空合同下拉model数据
      resetBusinessPactContractSelect();
    };
  }, []);

  // 删除项
  const deleteItem = (idx) => {
    const currentValue = [...value];
    currentValue.splice(idx, 1);
    onChange(currentValue);
  };

  // 添加项
  const addItem = () => {
    onChange([...value, '']);
  };

  // 修改表单值
  const onChangeValue = (idx, val, preserverid) => {
    const currentValue = [...value];
    currentValue.splice(idx, 1, val);
    setPreserverId && setPreserverId(preserverid);
    onChange(currentValue);
  };

  // 渲染表单字段
  const renderFormItems = () => {
     // 渲染删除操作按钮
    const renderDeleteButton = (idx) => {
      if (Array.isArray(value) && value.length > 1) {
        return (
          <Button shape="circle" onClick={() => { deleteItem(idx); }}>
            <MinusOutlined />
          </Button>
        );
      }
      return null;
    };
    return Array.isArray(value) && value.map((item, idx) => {
      return (
        <ContractInfoItem
          key={idx}
          formValue={value}
          formItemValue={item}
          itemIdx={idx}
          deleteItem={deleteItem}
          onChangeValue={onChangeValue}
          renderDeleteButton={renderDeleteButton}
          mState={mState}
        />
      );
    });
  };

  return (
    <div>
      {/* 渲染表单字段 */}
      {renderFormItems()}
      <div className={style['contractInfo-button-warp']}>
        <Button type="dashed" block onClick={addItem}>
          <PlusOutlined />
          <span>添加借阅合同</span>
        </Button>
      </div>
    </div>
  );
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  // 清空合同下拉model数据
  resetBusinessPactContractSelect: payload => dispatch({
    type: 'business/resetBusinessPactContractSelect',
    payload,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ContractInfo);
