/**
 * 资产管理 - 商圈管理 - 查询 - 标签组件
 */
import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Select } from 'antd';

const Option = Select.Option;

// 组件类型
const ComponentType = {
  search: 10,
  create: 20,
};

class Tags extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'districtTag/getDistrictTags', payload: { limit: 9999, page: 1 } });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'districtTag/resetDistrictTags', payload: {} });
  }

  onChange = (val) => {
    const { onChange } = this.props;
    onChange && onChange(val);
  }

  render() {
    const { districtTags = {}, value = undefined, type } = this.props;
    const { data = [] } = districtTags;
    return (
      <Select
        allowClear
        showSearch
        mode={type === ComponentType.search ? null : 'multiple'}
        placeholder="请选择标签"
        onChange={this.onChange}
        value={value}
        optionFilterProp="children"
      >
        {
          data.map((tag) => {
            return <Option key={tag._id}>{tag.name}</Option>;
          })
        }
      </Select>
    );
  }
}

Tags.propTypes = {
  districtTags: PropTypes.object,
  dispatch: PropTypes.func,
  onChange: PropTypes.func,
  type: PropTypes.number,
};

Tags.defaultProps = {
  districtTags: {},
  dispatch: () => {},
  onChange: () => {},
  type: ComponentType.search,
};

function mapStateToProps({
  districtTag: {
    districtTags, // 标签列表
  },
}) {
  return { districtTags };
}

export default connect(mapStateToProps)(Tags);
