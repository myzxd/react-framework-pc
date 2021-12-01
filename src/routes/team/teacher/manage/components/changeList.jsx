/**
 * 私教团队管理 - 编辑页 - 变更记录 组件
 */
import moment from 'moment';
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Table, Popconfirm, Modal, message, Tooltip } from 'antd';
import React, { Component } from 'react';

import Operate from '../../../../../application/define/operate';
import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import { ChangeAction, CoachEffectState } from '../../../../../application/define';

// import Style from './style.less';

const canOperateTeamTeacherManageChangeCancel = Operate.canOperateTeamTeacherManageChangeCancel();    // 取消权限

class ChangeList extends Component {
  static propTypes = {
    teamChangeList: PropTypes.object, // 人员详情
  }
  static defaultProps = {
    teamChangeList: {},
  }
  constructor(props) {
    super(props);
    this.state = {
      logData: {},     // 变更记录列表
      showDetailModal: false,      // 默认不显示详情弹窗
      detailData: {},              // 变更详情的数据
    };
  }

  // 获取详情数据
  componentDidMount() {
    const { id } = this.props;
    const params = { id };
    this.props.dispatch({ type: 'modelCoachDepartment/fetchChangeLog', payload: params });
  }

  // 成功回调
  onSuccessCallBack = () => {
    message.success('取消成功');
    this.props.onSearch();
  }

  // 变更详情
  onDetail = (rowData) => {
    this.setState({
      detailData: rowData,
      showDetailModal: true,
    });
  }

  // 详情弹窗确定或取消
  onClickModal = () => {
    this.setState({
      detailData: {},
      showDetailModal: false,
    });
  }

  //  取消操作
  onChangeCancel = (rowData) => {
    const payload = {
      id: rowData._id,
      onSuccessCallBack: this.onSuccessCallBack,
    };
    this.props.dispatch({ type: 'modelCoachDepartment/fetchChangeCancel', payload });
  }

  // 字符串超出num个字符，就省略显示，鼠标移上去显示全部
  showMoreStr = (text, num) => {
    if (text.length <= num) {
      return text;
    } else {
      return (<Tooltip placement="right" title={text}>
        {`${text.slice(0, num)}...`}
      </Tooltip>);
    }
  }

  //  生效状态判定
  displayState = (text) => {
    let dom = '';
    switch (text) {
      case CoachEffectState.effected:
        dom = <span className="app-global-compoments-color1">{CoachEffectState.description(text)}</span>;
        break;
      case CoachEffectState.effectBefore:
        dom = <span className="app-global-compoments-color2">{CoachEffectState.description(text)}</span>;
        break;
      case CoachEffectState.lose:
        dom = <span className="app-global-compoments-color3">{CoachEffectState.description(text)}</span>;
        break;
      default:
        dom = '--';
        break;
    }
    return dom;
  }

  // 渲染承揽范围
  renderScope = () => {
    const { showMoreStr } = this;
    const { teamChangeList: logData } = this.props;
    const data = logData.data || [];
    const total = logData._meta ? logData._meta.result_count : 0;
    const { page, limit, onChangePage, onShowSizeChange } = this.props;
    const columns = [
      {
        title: '业主姓名',
        dataIndex: 'owner_info',
        key: 'owner_info.staff_info.name',
        width: 100,
        fixed: 'left',
        render: text => (text && text.staff_info && text.staff_info.name ? text.staff_info.name : '--'),
      },
      {
        title: '业主团队ID',
        dataIndex: 'owner_info',
        key: 'owner_info._id',
        width: 180,
        fixed: 'left',
        render: text => (text && text._id ? text._id : '--'),
      },
      {
        title: '平台',
        dataIndex: 'owner_info',
        key: 'owner_info.platform_names',
        render: (text) => {
          // platform_names不能为空数组
          const result = (
            text && text.platform_names && text.platform_names.length > 0
              ? text.platform_names.toString()
              : '--'
          );
          return showMoreStr(result, 10);
        },
      },
      {
        title: '供应商',
        dataIndex: 'owner_info',
        key: 'owner_info.supplier_names',
        render: (text) => {
          // supplier_names不能为空数组
          const result = (
            text && text.supplier_names && text.supplier_names.length > 0
              ? text.supplier_names.toString()
              : '--'
          );
          return showMoreStr(result, 10);
        },
      },
      {
        title: '城市',
        dataIndex: 'owner_info',
        key: 'owner_info.city_names',
        render: (text) => {
          // city_names不能为空数组
          const result = (
            text && text.city_names && text.city_names.length > 0
              ? text.city_names.toString()
              : '--'
          );
          return showMoreStr(result, 10);
        },
      },
      {
        title: '商圈',
        dataIndex: 'owner_info',
        key: 'owner_info.biz_district_names',
        render: (text) => {
          // biz_district_names不能为空数组
          const result = (
            text && text.biz_district_names && text.biz_district_names.length > 0
              ? text.biz_district_names.toString()
              : '--'
          );
          return showMoreStr(result, 10);
        },
      },
      {
        title: '最新操作人',
        dataIndex: 'operator_info',
        key: 'operator_info.name',
        width: 100,
        render: text => (text && text.name ? text.name : '--'),
      },
      {
        title: '操作时间',
        dataIndex: 'updated_at',
        key: 'updated_at',
        width: 150,
        render: text => (moment(text).format('YYYY-MM-DD HH:mm:ss')),
      },
      {
        title: '动作',
        dataIndex: 'event',
        key: 'event',
        width: 80,
        render: (text) => {
          // 隐藏详情 pm@彭悦
          // if (text === ChangeAction.change) {
          //   return (<React.Fragment>
          //     <span className={Style['app-comp-team-teacher-mr']}>{ChangeAction.description(text)}</span>
          //     <a onClick={this.onDetail.bind(this, rowData)}>详情</a>
          //   </React.Fragment>);
          // }
          return ChangeAction.description(text);
        },
      },
      {
        title: '生效状态',
        dataIndex: 'state',
        key: 'state',
        width: 80,
        render: text => this.displayState(text),
      },
      {
        title: '生效日期',
        dataIndex: 'plan_done_date',
        key: 'plan_done_date',
        width: 150,
        render: text => (text ? moment(`${text}`).format('YYYY年MM月DD日') : '--'),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 80,
        fixed: 'right',
        render: (text, rowData) => {
          //  只有状态是待生效才能取消
          if (rowData.state && rowData.state === CoachEffectState.effectBefore
            && canOperateTeamTeacherManageChangeCancel) {
            return (
              <React.Fragment>
                <Popconfirm
                  title="是否确认取消本次变更记录?"
                  onConfirm={this.onChangeCancel.bind(this, rowData)}
                  okText="确定"
                  cancelText="取消"
                >
                  <span
                    className="app-global-compoments-cursor"
                  >取消</span>
                </Popconfirm>
              </React.Fragment>
            );
          }
          return '--';
        },
      },
    ];
    // 分页
    const pagination = {
      current: page,
      defaultPageSize: 30,                      // 默认数据条数
      pageSize: limit,                          // 每页展示条数
      onChange: onChangePage,                   // 切换分页
      showQuickJumper: true,                    // 显示快速跳转
      showSizeChanger: true,                    // 显示分页
      onShowSizeChange,                         // 展示每页数据数
      showTotal: Total => `总共${Total}条`,      // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total,                                   // 数据总条数
    };
    const title = <span>变更记录&emsp;&emsp;注：以下<span className="app-global-compoments-color4">待生效</span>的数据次月1号开始生效</span>;
    return (
      <CoreContent
        title={title}
      >
        <Table
          rowKey={(record, index) => {
            return index;
          }}
          pagination={pagination}
          dataSource={data}
          columns={columns}
          bordered
          scroll={{ x: 1520 }}
        />
      </CoreContent>
    );
  }

  // 渲染详情弹窗
  renderDetailModal = () => {
    const { showDetailModal, detailData } = this.state;
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    const formItems = [
      {
        label: '业主',
        form: dot.get(detailData, 'former_owner_info.staff_info.name', '--').toString(),
      },
      {
        label: '业主ID',
        form: dot.get(detailData, 'former_owner_info._id', '--'),
      },
      {
        label: '平台',
        form: dot.get(detailData, 'former_owner_info.platform_names', '--').toString(),
      },
      {
        label: '供应商',
        form: dot.get(detailData, 'former_owner_info.supplier_names', '--').toString(),
      },
      {
        label: '城市',
        form: dot.get(detailData, 'former_owner_info.city_names', '--').toString(),
      },
      {
        label: '商圈',
        form: dot.get(detailData, 'former_owner_info.biz_district_names', '--').toString(),
      },
    ];
    const formItemsChanged = [
      {
        label: '业主',
        form: dot.get(detailData, 'owner_info.staff_info.name', '--').toString(),
      },
      {
        label: '业主ID',
        form: dot.get(detailData, 'owner_info._id', '--'),
      },
      {
        label: '平台',
        form: dot.get(detailData, 'owner_info.platform_names', '--').toString(),
      },
      {
        label: '供应商',
        form: dot.get(detailData, 'owner_info.supplier_names', '--').toString(),
      },
      {
        label: '城市',
        form: dot.get(detailData, 'owner_info.city_names', '--').toString(),
      },
      {
        label: '商圈',
        form: dot.get(detailData, 'owner_info.biz_district_names', '--').toString(),
      },
    ];
    return (
      <Modal
        title="变更记录详情"
        width="800px"
        visible={showDetailModal}
        onOk={this.onClickModal}
        onCancel={this.onClickModal}
        okText="确定"
        cancelButtonProps={{
          style: { display: 'none' },
        }}
      >
        <p>变更前信息</p>
        <DeprecatedCoreForm items={formItems} cols={2} layout={layout} />
        <p>变更后信息</p>
        <DeprecatedCoreForm items={formItemsChanged} cols={2} layout={layout} />
      </Modal>
    );
  }
  render() {
    return (<div>
      {/* 渲染列表 */}
      {this.renderScope()}
      {/* 渲染详情弹窗 */}
      {this.renderDetailModal()}
    </div>);
  }
}

const mapStateToProps = ({ modelCoachDepartment: { teamChangeList } }) => {
  return { teamChangeList };
};

export default connect(mapStateToProps)(ChangeList);
