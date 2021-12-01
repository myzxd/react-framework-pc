/**
 * 商圈管理 - 平台
 */
import is from 'is_js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { connect } from 'dva';
import { omit } from '../../../../../application/utils';

const { Option } = Select;

class CommonSelectPlatforms extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    industryCodes: PropTypes.number,
    platformList: PropTypes.array,
  }

  static defaultProps = {
    dispatch: () => {},
    industryCodes: undefined,
    platformList: [],
  }

  componentDidMount = () => {
    const { industryCodes } = this.props;
    // 级联查询
    if (is.existy(industryCodes) && is.not.empty(industryCodes)) {
      this.props.dispatch({ type: 'districtManage/fetchPlatformList', payload: { industryCodes } });
    }
  }

  // eslint-disable-next-line
  componentDidUpdate = (prevProps) => {
    // 判断如果平台数据不一致，则请求服务器获取所属场景信息
    // 数字，值比较
    if (this.props.industryCodes !== prevProps.industryCodes) {
      this.props.dispatch({ type: 'districtManage/fetchPlatformList', payload: { industryCodes: this.props.industryCodes } });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'districtManage/resetPlatformList', payload: {} });
  }

  render() {
    const { platformList } = this.props;
    // 选项
    const options = platformList.map((v) => {
      return (<Option key={v._id} value={`${v.platform_code}`} >{v.name}</Option>);
    });

    // 默认传递所有上级传入的参数
    const omitedProps = omit(['industryCodes', 'platformList', 'dispatch'], this.props);

    return (
      <Select {...omitedProps} >
        {options}
      </Select>
    );
  }
}

function mapStateToProps({ districtManage: { platformList } }) {
  return { platformList };
}

export default connect(mapStateToProps)(CommonSelectPlatforms);
