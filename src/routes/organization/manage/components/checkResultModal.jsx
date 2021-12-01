/**
 * 部门操作校验结果Modal
 */
import React, { useState } from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';

import { omit } from '../../../../application/utils';

import styles from './index.less';

const voidFunc = () => {};
CheckResultModal.propTypes = {
  onChangeCheckResult: PropTypes.func, // 更改visible
  onSubmitDepartment: PropTypes.func, // 部门操作提交事件
  checkMessage: PropTypes.array, // 部门操作校验提示信息
  messageTitle: PropTypes.string, // 部门操作校验提示信息标题
};
CheckResultModal.defaultProps = {
  onChangeCheckResult: voidFunc,
  onSubmitDepartment: voidFunc,
  checkMessage: [],
  messageTitle: '',
};

function CheckResultModal(props) {
  const {
    onChangeCheckResult,
    onSubmitDepartment,
    checkMessage,
    messageTitle,
  } = props;
  // 继续提交按钮loading
  const [isLoading, setIsLoading] = useState(false);

  // 过滤props
  const omitedProps = omit([
    'dispatch',
    'onChangeCheckResult',
    'onSubmitDepartment',
    'checkMessage',
    'messageTitle',
  ], props);

  // 继续提交
  const onOk = async () => {
    setIsLoading(true);
    // 部门操作提交事件
    const flag = await onSubmitDepartment();
    setIsLoading(false);
    // 请求成功
    if (flag) {
      onChangeCheckResult(false);
    }
  };

  return (
    <Modal
      zIndex={1009}
      title="确认提交"
      onOk={onOk}
      okText="继续提交"
      confirmLoading={isLoading}
      onCancel={() => { onChangeCheckResult(false); }}
      {...omitedProps}
    >
      <h4 className={styles['CheckResultModal-messageTitle']}>{messageTitle}</h4>
      {
        checkMessage.map((message) => {
          return (
            <p
              dangerouslySetInnerHTML={{ __html: `${message.replace(/\n/g, '<br/>')}` }} // <br/>换行
              className={styles['CheckResultModal-message']}
            />
          );
        })
      }
    </Modal>
  );
}

export default CheckResultModal;
