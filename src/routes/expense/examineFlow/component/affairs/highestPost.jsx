/**
 * 最高岗位表单
 */
import React, { useState } from 'react';
import { Radio } from 'antd';

import {
  AffairsFlowHighestPostType,
} from '../../../../../application/define';

import PostTags from './postTags';
import AllPost from './allPost';

const HighestPost = ({
  value,
  onChange,
}) => {
  // 最高审批岗位类型radio value
  const [radioVal, setRadio] = useState(value.type);
  // 标签value
  const [tagsVal, setTagsVal] = useState([]);
  // 岗位value
  const [postVal, setPostVal] = useState([]);

  // triggerChange
  const triggerChange = (changedValue) => {
    if (onChange) {
      onChange({
        type: radioVal,
        tags: tagsVal,
        post: postVal,
        ...value,
        ...changedValue,
      });
    }
  };

  // 标签onChange
  const onChangeType = (e) => {
    const val = e.target.value;
    setRadio(val);
    triggerChange({ type: val, post: [], tags: [] });
  };


  // 标签onChange
  const onChangeTags = (val) => {
    if (!('tags' in value)) {
      setTagsVal(val);
    }
    triggerChange({ tags: val });
  };

  // 岗位onChange
  const onChangePost = (val) => {
    if (!('post' in value)) {
      setPostVal(val);
    }
    triggerChange({ post: val });
  };

  // 渲染select
  const renderSelect = () => {
    if (radioVal === AffairsFlowHighestPostType.tag) {
      return (
        <PostTags
          value={value.tags}
          onChange={onChangeTags}
        />
      );
    }

    if (radioVal === AffairsFlowHighestPostType.post) {
      return (
        <AllPost
          value={value.post}
          onChange={onChangePost}
        />
      );
    }
  };
  return (
    <React.Fragment>
      <Radio.Group
        value={value.type}
        onChange={onChangeType}
      >
        <Radio
          value={AffairsFlowHighestPostType.tag}
        >
          {AffairsFlowHighestPostType.description(AffairsFlowHighestPostType.tag)}
        </Radio>
        <Radio
          value={AffairsFlowHighestPostType.post}
        >
          {AffairsFlowHighestPostType.description(AffairsFlowHighestPostType.post)}
        </Radio>
      </Radio.Group>
      {renderSelect()}
    </React.Fragment>
  );
};

export default HighestPost;
