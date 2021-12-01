/**
 * 付款审批 - 人员异动审批信息
 */
import is from 'is_js';
import moment from 'moment';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Collapse } from 'antd';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DeprecatedCoreForm, CoreContent } from '../../../../../components/core';
import { EmployeeTurnoverApplyState, Gender } from '../../../../../application/define';

import style from './style.less';

const Panel = Collapse.Panel;

class Turnover extends Component {

  static propTypes = {
    // eslint-disable-next-line
    examineOrderDetail: PropTypes.object,  // 请假id列表
  }

  static defaultProps = {
    examineOrderDetail: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: [], // 折叠面板key
    };
  }

  componentDidMount() {
    const extraStaffChangeId = dot.get(this.props, 'examineOrderDetail.extraStaffChangeId', undefined);
    if (is.not.existy(extraStaffChangeId) || is.empty(extraStaffChangeId)) {
      return;
    }
    // 获取请假单详情
    this.props.dispatch({
      type: 'employeeTurnover/fetchEmployeeTurnoverDetail',
      payload: {
        id: extraStaffChangeId,
      },
    });
  }

  // 获取审批信息
  onRequestOrderDetail = (key) => {
    this.setState({ activeKey: key });
  }

  // 展开/收起全部
  onChangeCollapse = () => {
    const extraStaffChangeId = dot.get(this.props, 'examineOrderDetail.extraStaffChangeId', undefined);
    const { activeKey } = this.state;

    // 定义需要更新的折叠面板key
    const key = [];
    // 判断，如果当前折叠面板没有全部打开，那么更新key为全部值(此时，按钮显示为 全部打开)
    if (activeKey.length !== [extraStaffChangeId].length) {
      [extraStaffChangeId].forEach((item, index) => {
        key.push(`${index}`);
      });
    }

    // 否则，折叠面板key数组置为空(此时，按钮显示为 全部收起)
    this.setState({ activeKey: key });
  }


  // 渲染附件文件
  renderFiles = (filesUrl) => {
    return (
      <div>
        {
          filesUrl.map((item, index) => {
            return (
              <p>
                <a className={style['app-comp-expense-borrowing-info-file']} rel="noopener noreferrer" target="_blank" key={index} href={item.file_url}>{item.file_name}</a>
              </p>
            );
          })
        }
      </div>
    );
  }

  // 渲染主题标签
  renderThemeTags = (data) => {
    // 判断详情是否有值
    if (is.existy(data) && is.not.empty(data)) {
      const themeTags = dot.get(data, 'theme_tags').join(','); // 主题标签转换
      return (
        <span>{themeTags}</span>
      );
    } else {
      return '--';
    }
  }

  // 渲染岗位信息
  renderApplicationInfo = () => {
    const { employeeTurnoverDetail } = this.props; // 详情数据
    const formItems = [
      {
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 19 } },
        label: '申请单状态',
        form: dot.get(employeeTurnoverDetail, 'state', undefined) ? EmployeeTurnoverApplyState.description(dot.get(employeeTurnoverDetail, 'state', undefined)) : '--',
      },
      {
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        label: '姓名',
        form: dot.get(employeeTurnoverDetail, 'changed_staff_info.name', '--'),
      },
      {
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        label: '身份证号码',
        form: dot.get(employeeTurnoverDetail, 'changed_staff_info.identity_card_id', '--'),
      },
      {
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        label: '性别',
        form: dot.get(employeeTurnoverDetail, 'changed_staff_info') ? Gender.description(dot.get(employeeTurnoverDetail, 'changed_staff_info.gender_id')) : '--',
      },
      {
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        label: '所属部门',
        form: dot.get(employeeTurnoverDetail, 'department', '--'),
      },
      {
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        label: '岗位名称',
        form: dot.get(employeeTurnoverDetail, 'station', '--'),
      },
      {
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 19 } },
        label: '调岗原因',
        form: dot.get(employeeTurnoverDetail, 'change_reason', '--'),
      },
      {
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        label: '调岗后部门',
        form: dot.get(employeeTurnoverDetail, 'adjusted_department', '--'),
      },
      {
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        label: '调岗后岗位',
        form: dot.get(employeeTurnoverDetail, 'adjusted_station', '--'),
      },
      {
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 19 } },
        label: '期望生效时间',
        form: dot.get(employeeTurnoverDetail, 'active_at', undefined) ? moment(dot.get(employeeTurnoverDetail, 'active_at')).format('YYYY.MM.DD') : '--',
      },
      {
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 19 } },
        label: '主题标签',
        form: this.renderThemeTags(employeeTurnoverDetail),
      },
      {
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 19 } },
        label: '备注',
        form: <span className="noteWrap">{dot.get(employeeTurnoverDetail, 'note', '--')}</span>,
      },
      {
        span: 24,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 19 } },
        label: '附件',
        form: this.renderFiles(dot.get(employeeTurnoverDetail, 'file_list', [])),
      },
    ];

    return (
      <CoreContent title="调岗申请单">
        <DeprecatedCoreForm items={formItems} cols={3} />
      </CoreContent>
    );
  }

  render = () => {
    const extraStaffChangeId = dot.get(this.props, 'examineOrderDetail.extraStaffChangeId', undefined);
    const { activeKey } = this.state;
    // 定义扩展操作
    const ext = (
      <span
        onClick={this.onChangeCollapse}
        className={style['app-comp-expense-detail-order-info-ext']}
      >
        {/* 判断显示文本，如果折叠面板全部展开，则显示 全部收起，否则显示 全部展开 */}
        {activeKey.length !== [extraStaffChangeId].length ? '全部展开' : '全部收起'}
      </span>);

    return (
      <CoreContent key="takeLeve" title="人员异动" titleExt={ext}>
        <Collapse bordered={false} activeKey={activeKey} onChange={this.onRequestOrderDetail}>
          {
            [extraStaffChangeId].map((id, index) => {
              const header = `${'人员异动申请单号:'} ${id}`;
              return (
                <Panel header={header} key={`${index}`}>
                  {/* 申请单信息 */}
                  {this.renderApplicationInfo()}
                </Panel>
              );
            })
          }
        </Collapse>
      </CoreContent>
    );
  }
}

function mapStateToProps({ employeeTurnover: { employeeTurnoverDetail } }) {
  return { employeeTurnoverDetail };
}

export default connect(mapStateToProps)(Turnover);

