/**
 * 卡片组件 - 标题组件
 * 未使用
 */
import is from 'is_js';
import moment from 'moment';
import React, { Component } from 'react';
import { Row, Col, Checkbox } from 'antd';
import styles from './style/index.less';

class CommonCardHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: props.tag ? props.tag : '',                    // 标示
      type: props.type ? props.type : '',                 // 类型
      title: props.title ? props.title : '',              // 标题
      subtitle: props.subtitle ? props.subtitle : '',     // 副标题
      date: props.date ? props.date : [],                 // 日期
      isChecked: props.isChecked !== undefined ? props.isChecked : false, // 是否选中checkbox
      enableCheckbox: props.enableCheckbox !== undefined ? props.enableCheckbox : false,  // 是否显示checkbox
      onChange: props.onChange ? props.onChange : undefined,  // checkbox 回调函数
    };
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      tag: nextProps.tag ? nextProps.tag : '',                    // 标示
      type: nextProps.type ? nextProps.type : '',                 // 类型
      title: nextProps.title ? nextProps.title : '',              // 标题
      subtitle: nextProps.subtitle ? nextProps.subtitle : '',     // 副标题
      date: nextProps.date ? nextProps.date : [],                 // 日期
      isChecked: nextProps.isChecked !== undefined ? nextProps.isChecked : false, // 是否选中checkbox
      enableCheckbox: nextProps.enableCheckbox !== undefined ? nextProps.enableCheckbox : false,  // 是否显示checkbox
      onChange: nextProps.onChange ? nextProps.onChange : undefined,  // checkbox 回调函数
    });
  }

  // 点击checkbox的回调事件
  onChange = ({ target }) => {
    const { tag, onChange } = this.state;
    if (onChange) {
      onChange(tag, target.checked);
    }
    // 更新状态
    this.setState({ isChecked: target.checked });
  }

  // 渲染类型
  renderType = () => {
    const { type } = this.state;
    return (
      <Row>
        <Col span={24} className={styles['app-comp-common-card-header-type']}>{type}</Col>
      </Row>
    );
  }

  // 渲染标题
  renderTitle = () => {
    const { title, subtitle, isChecked, enableCheckbox } = this.state;
    return (
      <Col span={16} className={styles['app-comp-common-card-header-title-container']}>
        {/* 判断checkbox是否显示 */}
        {
          enableCheckbox ? <span className={styles['app-comp-common-card-header-check-box']}><Checkbox checked={isChecked} onChange={this.onChange} /></span> : ''
        }
        <span className={styles['app-comp-common-card-header-title']}>{title}</span>

        {/* 判断副标题是否显示 */}
        {
          subtitle !== '' ? <span className={styles['app-comp-common-card-header-subtitle']}>{`(${subtitle})`}</span> : ''
        }
      </Col>
    );
  }

  // 渲染日期
  renderDate = () => {
    const { date } = this.state;
    if (is.empty(date)) {
      return <Col span={8} />;
    }
    // 判断，如果是数组数据，但是数据不完整，则不显示数据
    if (is.array(date) && date.length === 2 && (is.not.existy(date[0]) || is.not.existy(date[1]))) {
      return <Col span={8} />;
    }

    // 显示一个时间
    if (is.string(date) || (is.array(date) && date.length === 1)) {
      const dateObject = is.string(date) ? moment(date, 'YYYY-MM-DD') : moment(date[0], 'YYYY-MM-DD');
      return (
        <Col span={8}>
          <Row>
            <Col span={10} offset={14} className={styles['app-comp-common-card-header-date']}>
              <Row style={{ marginBottom: '4px' }}><Col className={styles['app-comp-common-card-header-date-day']}>{dateObject.format('DD')}</Col></Row>
              <Row><Col className={styles['app-comp-common-card-header-date-year']}>{dateObject.format('YYYY/MM')}</Col></Row>
            </Col>
          </Row>
        </Col>
      );
    }

    // 显示时间范围
    const firstDateObject = moment(date[0], 'YYYY-MM-DD');
    const lastDateObject = moment(date[1], 'YYYY-MM-DD');
    return (
      <Col span={8}>
        <Row>
          <Col span={10} className={styles['app-comp-common-card-header-date']}>
            <Row style={{ marginBottom: '4px' }}><Col className={styles['app-comp-common-card-header-date-day']}>{firstDateObject.format('DD')}</Col></Row>
            <Row><Col className={styles['app-comp-common-card-header-date-year']}>{firstDateObject.format('YYYY/MM')}</Col></Row>
          </Col>
          <Col span={4} className={styles['app-comp-common-card-header-date']}>
            <Row><Col className={styles['app-comp-common-card-header-date-day']}>~</Col></Row>
          </Col>
          <Col span={10} className={styles['app-comp-common-card-header-date']}>
            <Row style={{ marginBottom: '4px' }}><Col className={styles['app-comp-common-card-header-date-day']}>{lastDateObject.format('DD')}</Col></Row>
            <Row><Col className={styles['app-comp-common-card-header-date-year']}>{lastDateObject.format('YYYY/MM')}</Col></Row>
          </Col>
        </Row>
      </Col>
    );
  }

  render = () => {
    return (
      <div className={styles['app-comp-common-card-header-container']}>
        {/* 渲染类型 */}
        {this.renderType()}
        <Row type="flex" justify="space-around" align="middle" style={{ height: '42px', padding: '0px 14px 0px 16px' }}>
          {/* 渲染标题 */}
          {this.renderTitle()}

          {/* 渲染日期 */}
          {this.renderDate()}
        </Row>
      </div>
    );
  }
}


export default CommonCardHeader;
