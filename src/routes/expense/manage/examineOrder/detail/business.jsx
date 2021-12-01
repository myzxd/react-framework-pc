/**
 * 费用管理 - 付款审批 - 出差详情
 */
import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import { Collapse } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { DeprecatedCoreForm, CoreContent } from '../../../../../components/core';
import { ExpenseBusinessTripWay, ExpenseBusinessTripType } from '../../../../../application/define';
import styles from './style.less';

const Panel = Collapse.Panel;

class BusinessInfo extends Component {
  static propTypes = {
    businessDetail: PropTypes.array, // 还款单详情
  }
  static defaultProps = {
    businessDetail: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: [],       // 展开的面板key
    };
  }

  // 展开/收起全部
  onChangeCollapse = () => {
    const { businessDetail } = this.props;
    const { activeKey } = this.state;
    // 定义需要更新的折叠面板key
    const key = [];
    // 判断，如果当前折叠面板没有全部打开，那么更新key为全部值(此时，按钮显示为 全部打开)
    if (activeKey.length !== businessDetail.length) {
      businessDetail.forEach((item, index) => {
        key.push(`${index}`);
      });
    }
    // 否则，折叠面板key数组置为空(此时，按钮显示为 全部收起)
    this.setState({ activeKey: key });
  }

  // 折叠面板的onChange
  onChangePanel = (key) => {
    this.setState({ activeKey: key });
  }

  // 出差同行人姓名
  renderTogetherNames = (record) => {
    const name = dot.get(record, 'together_user_names', []);
    const names = name.join('、');
    if (is.not.empty(name)) {
      return (<span className={styles['app-comp-expense-business-info-together-name']}>{names}</span>);
    } else {
      return '--';
    }
  }

  // 出差人信息
  renderBusinessPeopleInfo = (record) => {
    const formItems = [
      {
        label: '实际出差人',
        span: 8,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'apply_user_name', undefined) || '--',
      },
      {
        label: '联系方式',
        span: 8,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'apply_user_phone', undefined) || '--',
      },
      {
        label: '同行人员',
        span: 8,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: this.renderTogetherNames(record),
      },
    ];
    return (
      <CoreContent title="出差人信息">
        <DeprecatedCoreForm items={formItems} />
      </CoreContent>
    );
  }

  // 出差方式
  renderTransportKind = (record) => {
    const transportKind = dot.get(record, 'transport_kind', []);
    let transport = '';
    if (is.not.empty(transportKind)) {
      transportKind.forEach((item) => {
        transport += `${ExpenseBusinessTripWay.description(item)} 、`;
      });
      transport = transport.substring(0, transport.length - 1);
    } else {
      transport = '--';
    }
    return (<span className={styles['app-comp-expense-business-info-transport-kind']}>{transport}</span>);
  }

  // 出差目的地
  renderDestination = (record) => {
    const departure = dot.get(record, 'departure', {});
    let address;
    if (dot.get(record, 'departure.province_name', undefined) !== undefined) {
      address = `${dot.get(record, 'departure.province_name', undefined)}`;
    }
    if (dot.get(record, 'departure.city_name', undefined) !== undefined) {
      address = `${dot.get(record, 'departure.province_name', undefined)}${dot.get(record, 'departure.city_name', undefined) || ''}`;
    }
    if (dot.get(record, 'departure.area_name', undefined) !== undefined) {
      address = `${dot.get(record, 'departure.province_name', undefined)}${dot.get(record, 'departure.city_name', undefined) || ''}${dot.get(record, 'departure.area_name', undefined) || ''}`;
    }
    if (dot.get(record, 'departure.detailed_address', undefined) !== undefined) {
      address = `${dot.get(record, 'departure.province_name', undefined)}${dot.get(record, 'departure.city_name', undefined) || ''}${dot.get(record, 'departure.area_name', undefined) || ''}${dot.get(record, 'departure.detailed_address', undefined)}`;
    }
    if (is.not.empty(departure)) {
      return (<span>{address}</span>);
    } else {
      return '--';
    }
  }

  // 出发地
  renderDeparture = (record) => {
    const destination = dot.get(record, 'destination', {});
    let address;
    if (dot.get(record, 'destination.province_name', undefined) !== undefined) {
      address = `${dot.get(record, 'destination.province_name', undefined)}`;
    }
    if (dot.get(record, 'destination.city_name', undefined) !== undefined) {
      address = `${dot.get(record, 'destination.province_name', undefined)}${dot.get(record, 'destination.city_name', undefined) || ''}`;
    }
    if (dot.get(record, 'destination.area_name', undefined) !== undefined) {
      address = `${dot.get(record, 'destination.province_name', undefined)}${dot.get(record, 'destination.city_name', undefined) || ''}${dot.get(record, 'destination.area_name', undefined) || ''}`;
    }
    if (dot.get(record, 'destination.detailed_address', undefined) !== undefined) {
      address = `${dot.get(record, 'destination.province_name', undefined)}${dot.get(record, 'destination.city_name', undefined) || ''}${dot.get(record, 'destination.area_name', undefined) || ''}${dot.get(record, 'destination.detailed_address', undefined)}`;
    }
    if (is.not.empty(destination)) {
      return (<span>{address}</span>);
    } else {
      return '--';
    }
  }

  // 出差时间
  renderDate = (record) => {
    const doneDate = moment(dot.get(record, 'expect_done_at', undefined)).format('YYYY.MM.DD HH:00');
    const startDate = moment(dot.get(record, 'expect_start_at', undefined)).format('YYYY.MM.DD HH:00');
    const date = dot.get(record, 'expect_done_at', undefined) && dot.get(record, 'expect_start_at', undefined) ? `${startDate} - ${doneDate}` : '--';
    return (<span>{date}</span>);
  }

  // 出差信息
  renderBusinessInfo = (record) => {
    const formItems = [
      {
        label: '出差类别',
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'biz_type', 0) ? ExpenseBusinessTripType.description(dot.get(record, 'biz_type', 0)) : '--',
      },
      {
        label: '出差方式',
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 20 } },
        form: this.renderTransportKind(record),
      },
      {
        label: '出发地',
        span: 11,
        layout: { labelCol: { span: 4 }, wrapperCol: { span: 18 } },
        form: this.renderDestination(record),
      }, {
        label: '目的地',
        span: 11,
        layout: { labelCol: { span: 4 }, wrapperCol: { span: 18 } },
        form: this.renderDeparture(record),
      }, {
        label: '预计出差时间',
        span: 11,
        layout: { labelCol: { span: 5 }, wrapperCol: { span: 18 } },
        form: this.renderDate(record),
      },
      {
        label: '出差天数',
        span: 11,
        layout: { labelCol: { span: 4 }, wrapperCol: { span: 18 } },
        form: `${dot.get(record, 'expect_apply_days', 0)} ${'天'}`,
      },
      {
        label: '原由及说明',
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 20 } },
        form: <span className="noteWrap">{dot.get(record, 'note', '--') || '--'}</span>,
      },
      {
        label: '工作安排',
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 20 } },
        form: dot.get(record, 'working_plan', '--') || '--',
      },
    ];
    return (
      <CoreContent title="出差信息">
        <DeprecatedCoreForm items={formItems} />
      </CoreContent>
    );
  }

  render = () => {
    const { businessDetail } = this.props;
    const { activeKey } = this.state;

    // 数据为空，返回null
    if (Object.keys(businessDetail).length === 0) return <div />;

    const ext = (
      <span
        onClick={this.onChangeCollapse}
        className={styles['app-comp-expense-business-info-ext']}
      >
        {/* 判断显示文本，如果折叠面板全部展开，则显示 全部收起，否则显示 全部展开 */}
        {activeKey.length !== businessDetail.length ? '全部展开' : '全部收起'}
      </span>);
    return (
      <CoreContent title="出差单" titleExt={ext}>
        <Collapse bordered={false} activeKey={activeKey} onChange={this.onChangePanel}>
          {
            businessDetail.map((item, index) => {
              const header = `${'出差申请单号:'} ${item._id}`;
              return (
                <Panel header={header} key={index}>
                  {/* 渲染出差人信息 */}
                  {this.renderBusinessPeopleInfo(item)}

                  {/* 渲染出差信息 */}
                  {this.renderBusinessInfo(item)}
                </Panel>
              );
            })
          }
        </Collapse>
      </CoreContent>
    );
  }
}

export default BusinessInfo;
