/**
 * 审批流模糊查询组件
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import { Select, Spin } from 'antd';

const { Option } = Select;

function DebounceSelect({
  debounceTimeout = 800,
  selectedTabKey, // tab类型
  dispatch,
  ...props }) {
  const [fetching, setFetching] = useState(false);
  const [dataSource, onChangeDataSource] = useState([]);
  const fetchRef = useRef(0);

  useEffect(() => {
    // 切换时清空数据
    onChangeDataSource([]);
  }, [selectedTabKey]);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (e) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      onChangeDataSource([]);
      setFetching(true);
      dispatch({
        type: 'applicationCommon/fetchSearchExamineFlows',
        payload: {
          name: e,
          onSuccessCallback: (result = []) => {
            if (fetchId !== fetchRef.current) {
              // for fetch callback order
              return;
            }
            onChangeDataSource(result);
            setFetching(false);
          },
        },
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [dispatch, debounceTimeout]);

  const onChange = (e) => {
    props.onChange && props.onChange(e);
  };
  return (
    <Select
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      onChange={onChange}
    >
      {
        dataSource.map((v) => {
          return (
            <Option value={v._id} key={v._id}>{v.name}</Option>
          );
        })
      }
    </Select>
  );
}

export default connect()(DebounceSelect);
