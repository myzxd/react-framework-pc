/**
* 组织架构 - 部门管理 - 数据权限范围Tab - 编辑业务信息 - 平台select
*/
import _ from 'lodash';
import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Select } from 'antd';

import { omit } from '../../../../application/utils';
import style from './index.less';

const Option = Select.Option;

class Platform extends React.Component {
  componentDidMount() {
    const { dispatch, scense = [] } = this.props;
    dispatch({ type: 'organizationBusiness/getPlatformList', payload: { scense } });
  }

  componentDidUpdate(prevProps) {
    const { scense, dispatch } = this.props;
    !_.isEqual(scense, prevProps.scense) &&
      (dispatch({ type: 'organizationBusiness/getPlatformList', payload: { scense } }));
  }

  onChange = (val) => {
    const { onChange } = this.props;
    onChange && onChange(val);
  }

  render() {
    const { platformList = {}, value, initValues = [] } = this.props;
    const { data = [] } = platformList;

    // 去重
    const dataSource = _.uniqWith([...data, ...initValues], (a, b) => a.platform_code === b.platform_code);

    // platform_code list
    const platformCodeData = data.map(d => d.platform_code);

   // 去除Antd Select不需要的props
    const omitedProps = omit([
      'dispatch',
      'value',
      'platformList',
    ], this.props);
    return (
      <Select
        placeholder="请选择平台"
        onChange={this.onChange}
        value={value}
        {...omitedProps}
        className={style['app-organization-update-select']}
      >
        {
          dataSource.map((platform) => {
            return (
              <Option
                key={platform.platform_code}
                disabled={!platformCodeData.includes(platform.platform_code)}
              >{platform.name}</Option>
            );
          })
        }
      </Select>
    );
  }
}

Platform.propTypes = {
  platformList: PropTypes.object,
  dispatch: PropTypes.func,
  onChange: PropTypes.func,
};

Platform.defaultProps = {
  platformList: {},
  dispatch: () => {},
  onChange: () => {},
};

function mapStateToProps({
  organizationBusiness: {
    platformList, // 门下岗位编制列表
  },
}) {
  return { platformList };
}

export default connect(mapStateToProps)(Platform);
