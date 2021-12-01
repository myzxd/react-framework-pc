/**
 * 抄送人弹框
 */
import dot from 'dot-prop';
import is from 'is_js';
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Button, Modal, Tag } from 'antd';

import { CoreTabs } from '../../../core';
import ComponentDepartment from './components/department';
import ComponentUser from './components/user';
import styles from './style.less';

function CommonModalCopyGive(props) {
  const { value, dispatch, flowId, orderId, isProcess } = props;
  const [visible, setVisible] = useState(false);
  const [departmentNames, setDepartmentNames] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [modeParams, setModeParams] = useState({});

  useEffect(() => {
    flowId && dispatch({
      type: 'applicationCommon/fetchCopyGiveInfo',
      payload: {
        flowId,
        orderId,
      },
    });
    return () => {
      dispatch({
        type: 'applicationCommon/reduceCopyGiveInfo',
        payload: {} });
    };
  }, [dispatch, flowId, orderId]);
  useEffect(() => {
    // 赋值
    const propUserNames = dot.get(value, 'userNames', []);
    const propDepartmentNames = dot.get(value, 'departmentNames', []);
    setModeParams({
      departmentNames: propDepartmentNames,
      userNames: propUserNames,
    });
    setDepartmentNames(propDepartmentNames);
    setUserNames(propUserNames);
  }, [value]);

  // 修改value值
  const onChangeValue = (params) => {
    if (props.onChange) {
      props.onChange({ ...value, ...params });
    }
  };

  // 添加抄送
  const onClickAdd = () => {
    setVisible(true);
  };

  // 取消
  const onModalCancel = () => {
    setVisible(false);
    setModeParams({ ...modeParams });
    onChangeValue({ ...modeParams });
    setDepartmentNames([...dot.get(modeParams, 'departmentNames', [])]);
    setUserNames([...dot.get(modeParams, 'userNames', [])]);
    setModeParams({ ...modeParams });
  };

  // 确定
  const onModalOk = () => {
    modeParams.departmentNames = departmentNames;
    modeParams.userNames = userNames;
    setModeParams({ ...modeParams });
    onChangeValue({ ...modeParams });
    onModalCancel();
  };


  // 改变部门key
  const onChangeDepartmentNames = (keys) => {
    setDepartmentNames(keys);
  };

  // 改变用户key
  const onChangeuserNames = (keys) => {
    setUserNames(keys);
  };

  // 单个部门tag关闭
  const onDepartmentTagClose = (_id) => {
    const arr = dot.get(modeParams, 'departmentNames', []).filter(v => v._id !== _id);
    setModeParams({ ...modeParams, departmentNames: arr });
    setDepartmentNames([...arr]);
    onChangeValue({ departmentNames: arr });
  };

    // 单个用户tag关闭
  const onUserTagClose = (_id) => {
    const arr = dot.get(modeParams, 'userNames', []).filter(v => v._id !== _id);
    setModeParams({ ...modeParams, userNames: arr });
    setUserNames([...arr]);
    onChangeValue({ userNames: arr });
  };

  // 全部删除
  const onTagAllClose = () => {
    setModeParams({ departmentNames: [], userNames: [] });
    setDepartmentNames([]);
    setUserNames([]);
    if (props.onChange) {
      props.onChange({});
    }
  };

  // 渲染tab
  const renderModalTab = () => {
    const items = [
      {
        title: '按用户',
        content: (<ComponentUser
          targetKeys={userNames.map(v => v._id)}
          onChange={onChangeuserNames}
          dataSource={dot.get(props, 'copyGiveInfo.flexible_cc_account_info_list', [])}
        />),
        key: '按用户',
      },
      {
        title: '按部门',
        content: (
          <ComponentDepartment
            targetKeys={departmentNames.map(v => v._id)}
            onChange={onChangeDepartmentNames}
            dataSource={dot.get(props, 'copyGiveInfo.flexible_cc_department_info_list', [])}
          />),
        key: '按部门',
      },
    ];
    return (
      <CoreTabs items={items} />
    );
  };

  // 渲染部门信息
  const renderDepartmentNames = () => {
    const arr = dot.get(modeParams, 'departmentNames', []);
    if (is.empty(arr) || is.not.existy(arr)) {
      return null;
    }
    return arr.map((item) => {
      return (<Tag
        key={item._id}
        closable
        onClose={() => onDepartmentTagClose(item._id)}
        style={{ margin: '5px' }}
      >{item.name}</Tag>);
    });
  };

  // 渲染用户信息
  const renderUserNames = () => {
    const arr = dot.get(modeParams, 'userNames', []);
    if (is.empty(arr) || is.not.existy(arr)) {
      return null;
    }
    return arr.map((item) => {
      return (<Tag
        key={item._id}
        closable
        onClose={() => onUserTagClose(item._id)}
        style={{ margin: '5px' }}
      >{item.name}</Tag>);
    });
  };
  const flexibleDepartmentList = dot.get(props, 'copyGiveInfo.flexible_cc_department_info_list', []);
  const flexibleAccountList = dot.get(props, 'copyGiveInfo.flexible_cc_account_info_list', []);
  // 判断是否有无数据
  if ((is.not.existy(flexibleDepartmentList) || is.empty(flexibleDepartmentList)) &&
    (is.not.existy(flexibleAccountList) || is.empty(flexibleAccountList))) {
    // 判断是否时流转记录
    if (isProcess) return null;
    return '无';
  }

  return (
    <React.Fragment>
      <div className={styles.ModalCopyGiveBox}>
        <div>
          <Button onClick={onClickAdd}>添加抄送</Button>
        </div>
        <div className={styles.ModalCopyGiveText}>
          {/* 渲染部门信息 */}
          {renderDepartmentNames()}

          {/* 渲染用户信息 */}
          {renderUserNames()}
        </div>
        <div
          className={styles.ModalCopyGiveTextAllClose}
        >
          {dot.get(modeParams, 'departmentNames', []).length > 0 ||
            dot.get(modeParams, 'userNames', []).length > 0 ? (<span
              onClick={onTagAllClose}
            >X</span>) : null}
        </div>
      </div>
      <Modal
        title="选择抄送人"
        visible={visible}
        onOk={onModalOk}
        onCancel={onModalCancel}
      >
        {/* 渲染tab */}
        {renderModalTab()}
      </Modal>

    </React.Fragment>
  );
}

const mapStateToProps = ({ applicationCommon: { copyGiveInfo } }) => {
  return { copyGiveInfo };
};

export default connect(mapStateToProps)(CommonModalCopyGive);
