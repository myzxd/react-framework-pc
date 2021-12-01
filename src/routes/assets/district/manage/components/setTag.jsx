/**
 * 资产管理 - 商圈管理 - 设置标签弹窗
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Empty, Tag } from 'antd';

const CheckableTag = Tag.CheckableTag;

// 操作类型
const OperateType = {
  singleSet: 10, // 单条
  multipleSet: 20, // 多条
  delete: -100, // 移除
};

class Index extends React.Component {
  static getDerivedStateFromProps(props, state) {
    const { districtTags = {}, data = [] } = props;
    const { organTags = [] } = state;
    const tags = dot.get(districtTags, 'data', []);
    if (organTags.length !== tags.length) {
      return {
        organTags: tags,
        selectedTags: data,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const tags = dot.get(props, 'districtTags.data', []);
    this.state = {
      organTags: tags,
      selectedTags: props.data || [],
    };
    this.private = {
      isSubmit: true, // 防止多次提交
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'districtTag/getDistrictTags', payload: { limit: 9999, page: 1 } });
  }

  // tag check
  onChange = (tag, checked) => {
    const { selectedTags } = this.state;
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
    this.setState({ selectedTags: nextSelectedTags });
  }

  // 提交
  onSubmit = () => {
    const {
      dispatch,
      onSuccessCallback, // 操作成功回调
      onFailureCallback, // 操作失败回调
      operateType, // 操作类型
      districtId, // 单个商圈设置标签商圈id
      districtIds, // 批量设置标签商圈id
    } = this.props;
    // checked tag
    const { selectedTags } = this.state;

    const params = {
      districtId,
      districtIds,
      tags: selectedTags,
      onSuccessCallback,
      onFailureCallback,
    };

    if (this.private.isSubmit) {
      // 单条
      operateType === OperateType.singleSet && dispatch({ type: 'districtTag/setDistrictTags', payload: params });
      // 批量设置
      operateType === OperateType.multipleSet && dispatch({ type: 'districtTag/batchSetDistrictTags', payload: params });
      // 批量移除
      operateType === OperateType.delete && dispatch({ type: 'districtTag/batchDeleteDistrictTags', payload: params });
    }
    this.private.isSubmit = false;
  }

  // 隐藏
  onCancel = () => {
    const { onCancel } = this.props;
    onCancel && onCancel();
  }

  // checked tag
  renderCheckedTag = (tag) => {
    // 选中的tags
    const { selectedTags = [] } = this.state;

    return (
      <CheckableTag
        key={tag._id}
        value={tag._id}
        checked={selectedTags.indexOf(tag._id) > -1}
        onChange={checked => this.onChange(tag._id, checked)}
        style={selectedTags.indexOf(tag._id) > -1 ? { marginBottom: '10px' } : { border: '1px solid #d9d9d9', backgroundColor: '#fafafa', marginBottom: '20px' }}
      >
        {tag.name}
      </CheckableTag>
    );
  }

  // 无数据
  renderEmpty = () => {
    return <Empty />;
  }

  // 所有tag
  renderTags = () => {
    // 标签列表
    const { districtTags = {} } = this.props;
    const { data = [] } = districtTags;

    return (
      <div>
        {
          data.map((item) => {
            return this.renderCheckedTag(item);
          })
        }
      </div>
    );
  }

  // 弹簧
  renderMadal = () => {
    // 部门下业务信息
    const { visible, districtTags = {} } = this.props;
    const { data = [] } = districtTags;

    // 是否显示
    const isShow = data.length > 0;

    // 是否可操作
    const isOperate = isShow;

    return (
      <Modal
        title="设置标签"
        visible={visible}
        onOk={this.onSubmit}
        onCancel={this.onCancel}
        okText="确认"
        cancelText="取消"
        okButtonProps={{ disabled: !isOperate }}
        width={700}
      >
        {isShow ? this.renderTags() : this.renderEmpty()}
      </Modal>
    );
  }

  render() {
    return this.renderMadal();
  }
}

Index.propTypes = {
  visible: PropTypes.bool,
  dispatch: PropTypes.func,
  operateType: PropTypes.number,
  onCancel: PropTypes.func,
  onSuccessCallback: PropTypes.func,
  onFailureCallback: PropTypes.func,
  districtTags: PropTypes.object,
  data: PropTypes.array,
  districtId: PropTypes.string,
  districtIds: PropTypes.array,
};

Index.defaultProps = {
  visible: false, // modal visible
  dispatch: () => {},
  onCancel: () => {}, // 隐藏弹窗
  operateType: OperateType.singleSet, // 操作类型
  onSuccessCallback: () => {},
  onFailureCallback: () => {},
  districtTags: {},
  data: [], // 选中的tags
  districtId: '', // 商圈id
  districtIds: [], // 批量商圈id
};

function mapStateToProps({
  districtTag: {
    districtTags, // 标签列表
  },
}) {
  return { districtTags };
}

export default connect(mapStateToProps)(Index);

