/*
* 岗位|用户tab
*/
import React from 'react';

import { CoreTabs } from '../../../../components/core';
import UserTransfor from './userTransfor';
import PostTransfor from './postTransfor';

function ComponentPostUser(props) {
  const triggerChange = (changedValue) => {
    const { value } = props;
    props.onChange && props.onChange({
      ...value,
      ...changedValue,
    });
  };

  // 按用户穿梭框改变值
  const onChangeUsertargetKeys = (values) => {
    triggerChange({
      accountIds: values,
    });
  };

  // 按岗位穿梭框改变值
  const onChangePosttargetKeys = (values) => {
    triggerChange({
      postIds: values,
    });
  };

    // 渲染tab标签
  const renderCoreTabs = () => {
    const { value = {} } = props;
    const { accountIds, postIds } = value;
    const items = [
      {
        title: '按岗位',
        key: 'post',
        content: (
          <PostTransfor
            value={postIds}
            onChange={onChangePosttargetKeys}
          />
          ),
      },
      {
        title: '按用户',
        key: 'user',
        content: (
          <UserTransfor
            value={accountIds}
            onChange={onChangeUsertargetKeys}
          />
          ),
      },
    ];

    const tabProps = {
      items,
      defaultActiveKey: 'post',
    };
    return (
      <CoreTabs {...tabProps} />
    );
  };
  return (
    <React.Fragment>
      {/* 渲染tab标签 */}
      {renderCoreTabs()}
    </React.Fragment>
  );
}
export default ComponentPostUser;
