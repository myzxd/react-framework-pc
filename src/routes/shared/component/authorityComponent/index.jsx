/**
 * 共享登记 - 权限
 */
import React from 'react';
import dot from 'dot-prop';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import { CoreForm } from '../../../../components/core';
import { SharedAuthorityState } from '../../../../application/define';
import Authority from './component';

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

const AuthorityComponent = ({ detail }) => {
  // lookAccountInfo详情
  const lookAccountInfo = {
    state: dot.get(detail, 'look_acl', SharedAuthorityState.section), // 共享登记 - 权限状态
    accountInfo: dot.get(detail, 'look_account_info_list', []).map(item => ({ id: item._id, name: item.name })), // 可见成员信息
    departmentInfo: dot.get(detail, 'look_department_info_list', []).map(item => ({ id: item._id, name: item.name })), // 可见成员部门信息
  };
  const renderFormItem = () => {
    const formItem = [
      {
        item: [
          <Form.Item
            {...layout}
            name="lookAccountInfo"
            label="可见成员"
            rules={[{ required: true, message: '请选择' }]}
          >
            <Authority authorityDetail={lookAccountInfo} />
          </Form.Item>,
        ],
      },
    ];
    return formItem.map((cur, idx) => {
      return (
        <CoreForm key={idx} items={cur.item} cols={cur.col || 2} />
      );
    });
  };

  return (
    <React.Fragment>
      {renderFormItem()}
    </React.Fragment>
  );
};

AuthorityComponent.propTypes = {
  detail: PropTypes.object,    // 页面详情数据
};
AuthorityComponent.defaultProps = {
  detail: {},
};

export default AuthorityComponent;
