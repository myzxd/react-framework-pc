/**
 * 最高岗位表单
 */
import React, { useState } from 'react';
import { Select } from 'antd';

import {
  AffairsFlowHighestPostType,
} from '../../../../../application/define';

import PostTags from '../../../../expense/examineFlow/component/affairs/postTags';
import AllPost from '../../../../expense/examineFlow/component/affairs/allPost';
import style from '../style.less';

const { Option } = Select;

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

  // 审批人标签onChange
  const onChangeType = (val) => {
    setRadio(val);
    triggerChange({ type: val, tags: [], post: [] });
  };


  // onChange
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
    <div
      className={style['code-flow-basic-form-hightest']}
    >
      <Select
        allowClear
        showSearch
        value={value.type}
        onChange={onChangeType}
        placeholder="请选择"
        style={{ width: '28%', height: '100%' }}
      >
        <Option
          value={AffairsFlowHighestPostType.tag}
        >
          {AffairsFlowHighestPostType.description(AffairsFlowHighestPostType.tag)}
        </Option>
        <Option
          value={AffairsFlowHighestPostType.post}
        >
          {AffairsFlowHighestPostType.description(AffairsFlowHighestPostType.post)}
        </Option>
      </Select>
      {renderSelect()}
    </div>
  );
};

export default HighestPost;
