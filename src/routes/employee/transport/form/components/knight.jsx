/**
 * 工号管理，骑士信息
 * 未使用
 */
import is from 'is_js';
import dot from 'dot-prop';
import React from 'react';
import { connect } from 'dva';
import { Button, message, Row, Col } from 'antd';
import { CoreSelect } from '../../../../../components/core';

const Option = CoreSelect.Option;

class ComponentSelectKnight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: props.disabled ? props.disabled : false,  // 是否禁用
      phone: props.phone ? props.phone : '',              // 手机号
      dataSource: dot.get(props, 'employeeTransport.transportKnights.result', []), // 骑士信息
      onChange: props.onChange ? props.onChange : undefined,  // 回调事件
    };
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps = (nextProps) => {
    this.setState({
      disabled: nextProps.disabled ? nextProps.disabled : false,            // 是否禁用
      phone: nextProps.phone ? nextProps.phone : '',                        // 手机号
      dataSource: dot.get(nextProps, 'employeeTransport.transportKnights.result', []),   // 骑士信息
      onChange: nextProps.onChange ? nextProps.onChange : undefined,  // 回调事件
    });
  }

  componentWillUnmount = () => {
    // 重置数据
    this.props.dispatch({ type: 'employeeTransport/resetTransportKnights' });
  }

  // 获取人员信息
  onFetchData = () => {
    const { phone } = this.state;
    if (is.not.empty(phone)) {
      this.props.dispatch({ type: 'employeeTransport/fetchTransportKnights', payload: { phone } });
    } else {
      message.warning('请填写手机号');
    }
  }

  // 更新人员信息
  onChange = (value, option) => {
    const { dataSource, onChange } = this.state;
    const knight = {};
    // 筛选出选中的数据
    dataSource.forEach((data) => {
      if (data.knight_id === value) {
        knight.id = data.knight_id;
        knight.name = data.name;
        knight.transportType = data.transport_type;
      }
    });

    if (onChange) {
      onChange(value, option, knight);
    }
  }

  render() {
    const { dataSource, disabled } = this.state;
    // 选项
    const options = dataSource.map((data) => {
      return <Option key={data.knight_id} value={`${data.knight_id}`} >{data.name}</Option>;
    });

    // 默认传递所有上级传入的参数
    const props = { ...this.props };
    // 回调函数
    props.onChange = this.onChange;

    return (
      <Row>
        <Col sm={18}><CoreSelect {...props} >{options}</CoreSelect></Col>
        <Col sm={1} />
        <Col sm={4}><Button type="primary" onClick={this.onFetchData} disabled={disabled}>查询</Button></Col>
      </Row>
    );
  }
}

function mapStateToProps({ employeeTransport }) {
  return { employeeTransport };
}

export default connect(mapStateToProps)(ComponentSelectKnight);
