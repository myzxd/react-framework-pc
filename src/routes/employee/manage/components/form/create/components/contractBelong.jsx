import _ from 'lodash';
import dot from 'dot-prop';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { CoreSelect } from '../../../../../../../components/core';

const Option = CoreSelect.Option;

class CommonSelectCompanies extends React.Component {

  static propTypes = {
    industryCode: PropTypes.string, // 所属场景
    supplierId: PropTypes.array, // 供应商
    cityCode: PropTypes.string, // 城市
    dataSource: PropTypes.object,    // 公司数据
  }

  static defaultProps = {
    supplierId: [],
    dataSource: {},
  }

  componentDidMount = () => {
    // 获取数据
    const { industryCode, supplierId, cityCode } = this.props;
    // 获取数据
    this.props.dispatch({
      type: 'applicationCommon/fetchContractBelong',
      payload: {
        industryCode,
        supplierId,
        cityCode,
      },
    });
  }

  componentDidUpdate = (prevProps) => {
    const { supplierId, industryCode, cityCode, dataSource } = this.props;
    // 判断参数是否变化，如果参数变化，则重新获取数据
    if (_.isEqual(industryCode, prevProps.industryCode) === false
      || _.isEqual(supplierId, prevProps.supplierId) === false
      || _.isEqual(cityCode, prevProps.cityCode) === false
    ) {
      this.props.dispatch({
        type: 'applicationCommon/fetchContractBelong',
        payload: {
          industryCode,
          supplierId,
          cityCode,
        },
      });
    }
    if (dataSource !== prevProps.dataSource
      && prevProps.industryCode
      && prevProps.cityCode
      && prevProps.supplierId
      && prevProps.supplierId.length > 0
    ) {
      // 合同甲方
      const thirdPartInfo = dot.get(dataSource, 'third_part_info', {});
      // 默认值，不可选
      const value = dot.get(thirdPartInfo, '_id', undefined);
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    }
  }

  componentWillUnmount = () => {
    // 重置数据
    this.props.dispatch({ type: 'applicationCommon/resetContractBelong' });
  }

  render() {
    const { dataSource } = this.props;

    // 合同甲方
    const thirdPartInfo = dot.get(dataSource, 'third_part_info', {});

    // 处理后的数据
    const partData = Object.keys(thirdPartInfo).length === 0 ? [] : [thirdPartInfo];

    // 选项
    const options = partData.map((data) => {
      return <Option key={data._id} value={`${data._id}`} >{data.name}</Option>;
    }).filter(item => item !== '');

    // 默认传递所有上级传入的参数
    const props = { ...this.props };
    return (
      <CoreSelect {...props} >
        {options}
      </CoreSelect>
    );
  }
}

function mapStateToProps({ applicationCommon: { contractBelong } }) {
  return { dataSource: contractBelong };
}

export default connect(mapStateToProps)(CommonSelectCompanies);
