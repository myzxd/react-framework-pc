/**
 * 共享登记 - 权限 - 自定义表单
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Radio, Button } from 'antd';
import { SharedAuthorityState } from '../../../../../application/define';
import DepartmentModal from '../component/departmentModal';
import AccountModal from '../component/accountModal';
import style from './style.less';

const Authority = ({ value, onChange, authorityDetail }) => {
  // 添加成员Modal显示状态
  const [accountVisible, setAccountVisible] = useState(false);
  // 添加部门Modal显示状态
  const [departmentVisible, setDepartmentVisible] = useState(false);

  // 清空成员、部门自定义表单值
  const onChangeEmpty = () => {
    onChange({
      ...value,
      accountInfo: [],
      departmentInfo: [],
    });
  };

  // 更改自定义表单值
  const changeValue = (key, val) => {
    onChange({
      ...value,
      [key]: val,
    });
  };

  // 更改状态的事件监听
  const changeState = (event) => {
    // 共享登记 - 权限状态为完全公开
    if (event.target.value === SharedAuthorityState.all) {
      onChange({
        state: event.target.value,
        accountInfo: [],
        departmentInfo: [],
      });
      return;
    }
    onChange({
      state: event.target.value,
      accountInfo: authorityDetail.accountInfo,
      departmentInfo: authorityDetail.departmentInfo,
    });
  };

  // 渲染成员、部门名称展示
  const renderInfo = (accountInfo, departmentInfo) => {
    const infoArr = accountInfo.concat(departmentInfo);
    // 展示格式为，'a，b，c'
    return infoArr.reduce((acc, cur, idx) => {
      if (idx === 0) {
        return cur.name;
      }
      return `${acc}, ${cur.name}`;
    }, '');
  };
  useEffect(() => {
    const { state } = value;
    // 第一次进来 如果状态是完全公开 清空部门数据
    if (state === SharedAuthorityState.all) {
      onChangeEmpty();
    }
  }, []);
  const renderFormItem = () => {
    const { state, accountInfo, departmentInfo } = value;
    return (
      <div className={style['app-shared-authority-button-padding']}>
        <div>
          <Radio.Group defaultValue={state} onChange={changeState}>
            <Radio value={SharedAuthorityState.all}>
              {SharedAuthorityState.description(SharedAuthorityState.all)}
            </Radio>
            <Radio value={SharedAuthorityState.section}>
              {SharedAuthorityState.description(SharedAuthorityState.section)}
            </Radio>
          </Radio.Group>
        </div>
        <div>
          <Button
            className={style['app-shared-authority-button-margin']}
            type="primary"
            disabled={state === SharedAuthorityState.all}
            onClick={() => { setAccountVisible(true); }}
          >添加成员</Button>
          <Button
            className={style['app-shared-authority-button-margin']}
            type="primary"
            disabled={state === SharedAuthorityState.all}
            onClick={() => { setDepartmentVisible(true); }}
          >添加部门</Button>
          <Button
            type="primary"
            disabled={state === SharedAuthorityState.all}
            onClick={onChangeEmpty}
          >清空</Button>
        </div>
        <div className={style['app-shared-authority-button-minHeight']}>
          {/* 渲染部门数据 */}
          {renderInfo(accountInfo, departmentInfo)}
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      {renderFormItem()}
      <AccountModal
        accountInfo={value.accountInfo}
        changeValue={changeValue}
        visible={accountVisible}
        setAccountVisible={setAccountVisible}
      />
      <DepartmentModal
        departmentInfo={value.departmentInfo}
        changeValue={changeValue}
        visible={departmentVisible}
        setDepartmentVisible={setDepartmentVisible}
      />
    </React.Fragment>
  );
};

Authority.propTypes = {
  value: PropTypes.object, // 表单字段value
  onChange: PropTypes.func, // 表单字段onChange事件
  authorityDetail: PropTypes.object, // 页面详情数据中的权限相关详情数据
};
Authority.defaultProps = {
  value: {},
  onChange: () => {},
  authorityDetail: {},
};

export default Authority;
