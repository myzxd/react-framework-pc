/**
 * 私教管理 - 私教账户
 */
import moment from 'moment';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Table, Popconfirm, Input, Modal } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../../components/core';
import Search from './search';
import ContainerTop from '../../components/containerTop';

import Operate from '../../../../application/define/operate';
import { CommonSelectExamineAccount } from '../../../../components/common';
import SelectTeachTeam from './components/selectTeachTeam';
import styles from './style/index.less';

class Index extends Component {
  static propTypes = {
    teamAccounts: PropTypes.object, // 私教账户列表
  }

  static defaultProps = {
    teamAccounts: {
      data: [],
      _meta: {},
    },
  }

  constructor(props) {
    super(props);
    this.state = {
      isShowCreateCoachModal: false,   // 是否显示新增私教弹窗
    };
    this.private = {
      // 搜索的参数
      searchParams: {
        meta: { page: 1, limit: 30 },
      },
    };
  }

  componentDidMount() {
    const { searchParams } = this.private;
    this.props.dispatch({
      type: 'teamAccount/fetchTeamAccounts',
      payload: searchParams,
    });
  }

  // 修改分页
  onChangePage = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.meta.page = page;
    searchParams.meta.limit = limit;
    this.onSearch(searchParams);
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.meta.page = page;
    searchParams.meta.limit = limit;
    this.onSearch(searchParams);
  }

  // 搜索
  onSearch = (params) => {
    // 保存搜索的参数
    const { searchParams } = this.private;
    this.private.searchParams = {
      ...searchParams,
      ...params,
    };
    this.props.dispatch({
      type: 'teamAccount/fetchTeamAccounts',
      payload: this.private.searchParams,
    });
  }

  // 删除私教账户
  onDelete = (id, count) => {
    if (count > 0) {
      return Modal.error({
        content: '无法删除！该私教下当月有业务范围',
      });
    }
    const payload = {
      id,
      onSuccessCallback: this.deleteSuccessCallback,
    };
    this.props.dispatch({
      type: 'teamAccount/deleteTeamAccount',
      payload,
    });
  }
  onCreateCoach = () => {
    this.setState({
      isShowCreateCoachModal: true,
    });
  }

  // 导出
  onExportBiz = () => {
    const { searchParams } = this.private;
    this.props.dispatch({
      type: 'teamAccount/exportCoachBiz',
      payload: searchParams,
    });
  }
  // 导出无私教商圈
  onExportNotCoachBiz = () => {
    this.props.dispatch({
      type: 'teamAccount/exportNotCoachBiz',
    });
  }

  // 新增私教确定
  onClickCreateOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.setState({
        isShowCreateCoachModal: false,
      });
      const payload = {
        accountName: values.accountName,
        members: values.members,
        accountTeam: values.accountTeam,
        onSuccessCallback: this.onSearch,
      };
      this.props.dispatch({ type: 'teamAccount/createTeamAccount', payload });
    });
  }

  // 新增私教取消
  onClickCreateCancel = () => {
    this.props.form.resetFields();
    this.setState({
      isShowCreateCoachModal: false,
    });
  }

  // 删除私教账户成功回调
  deleteSuccessCallback = () => {
    this.onSearch({});
  }

  // 渲染所属私教团队
  renderCoachTeamInfo = (info) => {
    if (!info || !Array.isArray(info)) return '--';
    return info.reduce((acc, cur, idx) => {
      if (idx === 0) {
        return cur.name;
      }
      return `${acc}, ${cur.name}`;
    }, '');
  }

  // 渲染搜索条件
  renderSearch = () => {
    const { onSearch } = this;
    return (
      <Search
        onSearch={onSearch}
      />
    );
  }

  // 渲染内容列表
  renderContent = () => {
    const { page } = this.private.searchParams.meta;
    const { data, _meta } = this.props.teamAccounts;

    const columns = [
      {
        title: '私教姓名',
        dataIndex: 'name',
        key: 'name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '系统用户',
        dataIndex: 'coach_account_info',
        key: 'coach_account_info_phone',
        render: (text) => {
          return text && text.phone ? text.phone : '--';
        },
      },
      {
        title: '所属私教团队',
        dataIndex: 'coach_team_info',
        key: 'coach_team_info',
        render: this.renderCoachTeamInfo,
      },
      {
        title: '业务范围数量',
        dataIndex: 'biz_district_count',
        key: 'biz_district_count',
        render: (text) => {
          return text || `${text}` === '0' ? text : '--';
        },
      },
      {
        title: '创建人',
        dataIndex: 'creator_info',
        key: 'creator_info_name',
        render: (text) => {
          return text && text.name ? text.name : '--';
        },
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
        },
      },
      {
        title: '修改人',
        dataIndex: 'operator_info',
        key: 'operator_name',
        render: (text) => {
          return text && text.name ? text.name : '--';
        },
      },
      {
        title: '修改时间',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 150,
        render: (text, record) => {
          return (
            <React.Fragment>
              <a
                href={`#/Team/Teacher/Account/Detail?id=${record._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles['app-comp-team-teacher-margin-right']}
              >
                查看
              </a>
              <a
                href={`#/Team/Teacher/Account/Update?id=${record._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles['app-comp-team-teacher-margin-right']}
              >
                编辑
              </a>
              <Popconfirm
                title="确定删除?"
                onConfirm={this.onDelete.bind(this, record._id, record.biz_district_count)}
                okText="是"
                cancelText="否"
              >
                <a>删除</a>
              </Popconfirm>
            </React.Fragment>
          );
        },
      },
    ];

    // 分页
    const pagination = {
      current: page,
      defaultPageSize: 30,                       // 默认数据条数
      onChange: this.onChangePage,               // 切换分页
      showQuickJumper: true,                     // 显示快速跳转
      showSizeChanger: true,                     // 显示分页
      onShowSizeChange: this.onShowSizeChange,   // 展示每页数据数
      showTotal: total => `总共${total}条`,       // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: _meta.result_count || 0,            // 数据总条数
    };

    // 表格头部需要渲染的按钮列表
    const buttonList = [];
    if (Operate.canOperateTeamTeacherAccountCreate()) {
      buttonList.push(
        { name: '新增私教', onCallback: this.onCreateCoach, type: 'primary' },
      );
    }
    if (Operate.canOperateTeamTeacherExport()) {
      buttonList.push(
        { name: '导出', onCallback: this.onExportBiz, type: 'primary' },
      );
    }
    if (Operate.canOperateTeamTeacherExportNotCoach()) {
      buttonList.push(
        { name: '导出无私教的商圈', onCallback: this.onExportNotCoachBiz, type: 'primary' },
      );
    }
    return (
      <CoreContent>
        {/* 渲染操作按钮 */}
        <ContainerTop buttonList={buttonList} />
        {/* 数据 */}
        <Table
          rowKey={(record, index) => { return index; }}
          dataSource={data}
          columns={columns}
          pagination={pagination}
          bordered
        />
      </CoreContent>
    );
  }


  // 渲染私教弹窗
  renderCoachModal = () => {
    const { getFieldDecorator } = this.props.form;
    const { isShowCreateCoachModal } = this.state;
    const formItems = [
      {
        label: '私教姓名',
        form: getFieldDecorator('accountName', {
          rules: [{ required: true, message: '请输入私教姓名' }],
        })(
          <Input placeholder="请填写私教姓名" className={styles['app-comp-team-teacher-width-260']} />,
        ),
      },
      {
        label: '系统用户',
        form: getFieldDecorator('members', {
          rules: [{ required: true, message: '请选择系统用户' }],
        })(
          <CommonSelectExamineAccount
            isSpecial
            showSearch
            optionFilterProp="phone"
            placeholder="请输入用户手机号"
            style={{ width: 260 }}
          />,
        ),
      },
      {
        label: '私教团队',
        form: getFieldDecorator('accountTeam', {
          rules: [{ required: true, message: '请选择私教团队' }],
        })(
          <SelectTeachTeam
            allowClear
            showSearch
            mode="multiple"
            showArrow
            placeholder="请选择私教团队"
            optionFilterProp="children"
            style={{ width: 260 }}
          />,
        ),
      },
    ];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (

      <Modal
        title="新增私教"
        visible={isShowCreateCoachModal}
        onOk={this.onClickCreateOk}
        onCancel={this.onClickCreateCancel}
        okText="保存"
      >
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </Modal>
    );
  }


  render = () => {
    const { renderSearch, renderContent, renderCoachModal } = this;
    return (
      <div>
        {/* 渲染搜索 */}
        {renderSearch()}

        {/* 渲染内容 */}
        {renderContent()}

        {/* 新增私教弹窗 */}
        { renderCoachModal() }
      </div>
    );
  }
}

const mapStateToProps = ({ teamAccount: { teamAccounts } }) => {
  return { teamAccounts };
};

export default connect(mapStateToProps)(Form.create()(Index));
