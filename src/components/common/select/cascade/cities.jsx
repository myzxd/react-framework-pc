/**
 * 公用组件，城市下拉选择(分组)
 */
import _ from 'lodash';
import is from 'is_js';
import dot from 'dot-prop';
import React from 'react';
import { connect } from 'dva';
import { CoreSelect } from '../../../core';

const Option = CoreSelect.Option;
const OptGroup = CoreSelect.OptGroup;

class CommonSelectCascadeCities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suppliers: props.suppliers ? props.suppliers : [],  // 供应商数据
      platforms: props.platforms ? props.platforms : [],  // 平台数据
      dataSource: dot.get(props, 'applicationCommon.cascade.cities', []), // 城市数据
      onChange: props.onChange ? props.onChange : undefined,  // 更新回调
    };
  }

  componentWillMount = () => {
    const { suppliers, platforms } = this.state;
    if (is.not.empty(suppliers) || is.not.empty(platforms)) {
      this.props.dispatch({ type: 'applicationCommon/fetchCascadeCities', payload: { suppliers, platforms } });
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { suppliers, platforms } = this.props;
    // 判断参数是否变化，如果参数变化，则重新获取数据
    if (!_.isEqual(suppliers, nextProps.suppliers) || !_.isEqual(platforms, nextProps.platforms)) {
      this.props.dispatch({ type: 'applicationCommon/fetchCascadeCities', payload: { suppliers: nextProps.suppliers, platforms: nextProps.platforms } });
    }

    this.setState({
      suppliers: nextProps.suppliers ? nextProps.suppliers : [],  // 供应商数据
      platforms: nextProps.platforms ? nextProps.platforms : [],  // 平台数据
      dataSource: dot.get(nextProps, 'applicationCommon.cascade.cities', []),     // 城市数据
      onChange: nextProps.onChange ? nextProps.onChange : undefined,  // 更新回调
    });
  }

  componentWillUnmount = () => {
    // 重置数据
    this.props.dispatch({ type: 'applicationCommon/resetCascadeCities' });
  }

  // 更新数据的回调
  onChangeCities = (values, option) => {
    const { onChange } = this.state;

    // console.log("DEBUG: 级联查询", values);

    // 提交到服务器的级联查询数据
    const cascade = [];
    // 判断城市数据是否存在
    if (is.existy(values) && is.not.empty(values)) {
      const arrayData = is.not.array(values) ? [values] : values;
      arrayData.forEach((item) => {
        // 处理特殊格式的id
        const data = item.split('-');
        // 供应商，城市
        const supplierId = data[0];
        const city = data[1];

        // 判断当前服务商数据是否存在
        if (is.not.existy(cascade[supplierId])) {
          cascade[supplierId] = [city];
        } else {
          cascade[supplierId].push(city);
        }
      });
    }

    if (onChange) {
      onChange(values, option, cascade);
    }
  }

  renderOptionsByGroup = (groupId, groupName, cities = []) => {
    return cities.map((city, index) => {
      // 城市数据为空的时候，配合过滤filter，过滤当条数据
      if (city.city_spelling === '') {
        // console.log('DEBUG: 城市选项为空，后端配置文件错误，过滤数据', city);
        return '';
      }
      const key = `Cascade-${groupId}-${city._id}-${city.city_spelling}-${index}`;
      return <Option key={key} value={`${groupId}-${city.city_spelling}`}>{city.city_name_joint}_{groupName}</Option>;
    }).filter(item => item !== '');
  }

  // 渲染分组
  renderGroups = () => {
    const { dataSource } = this.state;
    return dataSource.map((group, index) => {
      const key = `CascadeGroup-${group._id}-${index}`;
      return (
        <OptGroup label={group.name} key={key}>
          {/* 渲染分组的选项 */}
          {this.renderOptionsByGroup(group._id, group.name, group.children_list)}
        </OptGroup>
      );
    });
  }

  render() {
    // 默认传递所有上级传入的参数
    const props = { ...this.props };
    // 更新回调
    props.onChange = this.onChangeCities;
    // 分组的数据格式
    props.isGroup = true;
    return (
      <CoreSelect {...props} >
        {/* 渲染分组 */}
        {this.renderGroups()}
      </CoreSelect>
    );
  }
}

function mapStateToProps({ applicationCommon }) {
  return { applicationCommon };
}

export default connect(mapStateToProps)(CommonSelectCascadeCities);
