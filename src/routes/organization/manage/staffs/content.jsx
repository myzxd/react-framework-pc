/* eslint-disable no-confusing-arrow */
/**
 * 组织架构 - 岗位管理 - 列表组件
 */
import { connect } from 'dva';
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Table, message, Popconfirm } from 'antd';

import { CoreContent } from '../../../../components/core';
import {
  OrganizationDepartmentChangeType,
  OrganizationSourceType,
  ExpenseExamineOrderProcessState,
  OrganizationDepartmentChangeState,
} from '../../../../application/define';
import {
  utils,
} from '../../../../application';
import Operate from '../../../../application/define/operate';
import EstablishmentBtn from './component/button/establishmentBtn';
import CreatePostBtn from './component/button/createPostBtn';
import DeletePostBtn from './component/button/deleteBtn';

import style from './index.less';

// 页面类型
const PageType = {
  list: 'list',
  detail: 'detail',
};

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 关闭
  onClose = async (val) => {
    const { dispatch, breakDepartmentList } = this.props;
    const res = await dispatch({
      type: 'organizationStaffs/onCloseApproveOrder',
      payload: { oaOrganizationOrderId: val },
    });

    if (res && res.zh_message) message.error(res.zh_message);
    if (res && res._id) {
      message.success('请求成功');
      // 重新获取数据
      breakDepartmentList && breakDepartmentList(true, OrganizationDepartmentChangeState.close);
    }
  }

  // 详情
  onDetail = (text) => {
    const { onChangePageType } = this.props;
    onChangePageType && onChangePageType(PageType.detail, text);
  }

  // 操作
  renderOption = (text, rec = {}) => {
    const { tabKey, departmentDetail = {}, breakDepartmentList } = this.props;
    const {
      organization_sub_type: organizationSubType, // 组织架构操作子类型
      // oa_application_order_id: orderId, // 审批单id
    } = rec;

    // 删除操作
    const deleteOperate = Operate.canOperateOrganizationManageStaffsDelete() ?
      (
        <DeletePostBtn
          departmentDetail={departmentDetail}
          postInfo={rec}
          breakDepartmentList={breakDepartmentList}
        />
      ) : null;

    // 关闭（系统权限 & 接口参数）
    const closeOperate = Operate.canOperateOrganizationManageStaffsDelete() && rec.can_close ?
      (
        <Popconfirm
          title="系统将会对该条审批单进行关闭处理，新增的申请将会被终止，请确定是否要继续"
          okText="确认"
          cancelText="再想想"
          onConfirm={() => this.onClose(text)}
        >
          <a className={style['app-organization-post-list-operate']}>
            关闭
          </a>
        </Popconfirm>
      ) : null;

    // 编辑操作（增编/减编）（系统权限 & 接口参数）
    const updateCountOperate = (organizationSubType === OrganizationDepartmentChangeType.add
      || organizationSubType === OrganizationDepartmentChangeType.remove)
      && rec.can_edit ?
      (
        <EstablishmentBtn
          departmentDetail={departmentDetail}
          updateInitValue={rec}
          organizationSubType={utils.dotOptimal(rec, 'organization_sub_type', OrganizationDepartmentChangeType.add)}
          title="编辑"
          isUpdate
          breakDepartmentList={breakDepartmentList}
        />
      ) : null;

    // 编辑操作（编辑岗位）
    const updatePostOperate = organizationSubType === OrganizationDepartmentChangeType.addPost
      && rec.can_edit ? (
        <CreatePostBtn
          departmentDetail={departmentDetail}
          updateInitValue={rec}
          isUpdate
          title="编辑"
          breakDepartmentList={breakDepartmentList}
        />
    ) : null;

    // 正常
    if (tabKey === 'tab1') {
      return (
        <React.Fragment>
          {/* 详情 */}
          <a
            onClick={() => this.onDetail(text)}
            style={{ marginRight: 10 }}
          >查看详情</a>

          {/* 删除 */}
          {deleteOperate}
        </React.Fragment>
      );
    }

    // 待生效
    if (tabKey === 'tab2') {
      return (
        <React.Fragment>
          {
            (rec.can_edit || rec.can_close) ?
              (
                <React.Fragment>
                  {updatePostOperate}
                  {updateCountOperate}
                  {closeOperate}
                </React.Fragment>
              ) : '--'
          }
        </React.Fragment>
      );
    }
  }

  // 渲染列表
  renderContent = () => {
    const {
      tabKey,
      data = {},
      onChangePage,
      onShowSizeChange,
      tableLoading,
      departmentDetail = {},
      breakDepartmentList,
    } = this.props;
    const {
      data: dataSource = [],
      _meta: meta = {},
    } = data;

    const {
      result_count: dataCount = 0,
    } = meta;

    let columns;
    if (tabKey === 'tab1') {
      columns = [
        {
          title: '岗位名称',
          dataIndex: ['job_info', 'name'],
          key: 'job_info_name',
          render: text => text || '--',
        },
        {
          title: '职级',
          dataIndex: ['job_info', 'rank'],
          key: 'job_info_rank',
          render: text => text || '--',
        },
        {
          title: '岗位编制数',
          dataIndex: 'organization_count',
          key: 'organization_count',
          render: text => (text || text === 0 ? text : '--'),
        },
        {
          title: '占编人数',
          dataIndex: 'organization_num',
          key: 'organization_num',
          render: text => (text || text === 0 ? text : '--'),
        },
        {
          title: '是否审批',
          dataIndex: 'source',
          key: 'source',
          render: (text) => {
            if (!text) return '--';
            return text === OrganizationSourceType.approval ? '是' : '否';
          },
        },
        {
          title: '创建者',
          dataIndex: ['creator_info', 'name'],
          key: 'creator_info_name',
          render: text => text || '--',
        },
        {
          title: '生效日期',
          dataIndex: 'take_effect_date',
          key: 'take_effect_date',
          render: text => text ? moment(`${text}`).format('YYYY-MM-DD') : '--',
        },
        {
          title: '最新操作人',
          dataIndex: ['operator_info', 'name'],
          key: 'operator_info_name',
          render: text => text || '--',
        },
        {
          title: '更新时间',
          dataIndex: 'updated_at',
          key: 'updated_at',
          render: text => text ? moment(`${text}`).format('YYYY-MM-DD') : '--',
        },
      ];
    }

    if (tabKey === 'tab2') {
      columns = [
        {
          title: '岗位名称',
          dataIndex: 'job_info_name',
          key: 'job_info_name',
          width: 100,
          fixed: 'left',
          render: (_, record) => {
            return utils.dotOptimal(record, 'job_data_list.0.job_info.name', '--');
          },
        },
        {
          title: '编制人数',
          dataIndex: 'job_data_list_count',
          key: 'job_data_list_count',
          width: 100,
          fixed: 'left',
          render: (_, record) => {
            // 判断调整类型是否是添加部门下岗位
            if (utils.dotOptimal(record, 'organization_sub_type', undefined) === OrganizationDepartmentChangeType.addPost) {
              return utils.dotOptimal(record, 'job_data_list.0.organization_count', '--');
            }
            return utils.dotOptimal(record, 'job_data_list.0.people_num', '--');
          },
        },
        {
          title: '是否审批',
          dataIndex: 'source',
          key: 'source',
          render: () => '是',
        },
        {
          title: '调整类型',
          dataIndex: 'organization_sub_type',
          key: 'organization_sub_type',
          render: text => text ? OrganizationDepartmentChangeType.description(text) : '--',
        },
        {
          title: '审批单状态',
          dataIndex: ['oa_application_order_info', 'state'],
          key: 'oa_application_order_info_state',
          render: text => text ? ExpenseExamineOrderProcessState.description(text) : '--',
        },
        {
          title: '岗位调整状态',
          dataIndex: 'take_effect_state',
          key: 'take_effect_state',
          render: text => text ? OrganizationDepartmentChangeState.description(text) : '--',
        },
        {
          title: '创建者',
          dataIndex: ['creator_info', 'name'],
          key: 'creator_info',
          render: text => text || '--',
        },
        {
          title: '生效日期',
          dataIndex: 'take_effect_date',
          key: 'take_effect_date',
          render: text => text ? moment(`${text}`).format('YYYY-MM-DD') : '--',
        },
        {
          title: 'BOSS单号',
          dataIndex: ['oa_application_order_info', '_id'],
          key: 'oa_application_order_info_id',
          render: (text, record) => {
            if (text) {
              if (record.can_view) {
                return (
                  <a
                    rel="noopener noreferrer"
                    href={`javascript:void(window.open('/#/Expense/Manage/ExamineOrder/Detail?orderId=${text}'))`}
                    className={style['app-organization-department-child-hight']}
                  >{text}</a>
                );
              }
              return text;
            }
            return '--';
          },
        },
      ];
    }

    if (tabKey === 'tab3') {
      columns = [
        {
          title: '岗位名称',
          dataIndex: 'job_info_name',
          key: 'job_info_name',
          width: 100,
          fixed: 'left',
          render: (_, record) => {
            return utils.dotOptimal(record, 'job_data_list.0.job_info.name', '--');
          },
        },
        {
          title: '编制人数',
          dataIndex: 'job_data_list_count',
          key: 'job_data_list_count',
          width: 100,
          fixed: 'left',
          render: (_, record) => {
            // 判断调整类型是否是添加部门下岗位
            if (utils.dotOptimal(record, 'organization_sub_type', undefined) === OrganizationDepartmentChangeType.addPost) {
              return utils.dotOptimal(record, 'job_data_list.0.organization_count', '--');
            }
            return utils.dotOptimal(record, 'job_data_list.0.people_num', '--');
          },
        },
        {
          title: '调整类型',
          dataIndex: 'organization_sub_type',
          key: 'organization_sub_type',
          render: text => text ? OrganizationDepartmentChangeType.description(text) : '--',
        },
        {
          title: '审批单状态',
          dataIndex: ['oa_application_order_info', 'state'],
          key: 'oa_application_order_info_state',
          render: text => text ? ExpenseExamineOrderProcessState.description(text) : '--',
        },
        {
          title: '岗位调整状态',
          dataIndex: 'take_effect_state',
          key: 'take_effect_state',
          render: text => text ? OrganizationDepartmentChangeState.description(text) : '--',
        },
        {
          title: '创建者',
          dataIndex: ['creator_info', 'name'],
          key: 'creator_info',
          render: text => text || '--',
        },
        {
          title: '生效日期',
          dataIndex: 'take_effect_date',
          key: 'take_effect_date',
          render: text => text ? moment(`${text}`).format('YYYY-MM-DD') : '--',
        },
        {
          title: 'BOSS单号',
          dataIndex: ['oa_application_order_info', '_id'],
          key: 'oa_application_order_info_id',
          render: (text, record) => {
            if (text) {
              if (record.can_view) {
                return (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`#/Expense/Manage/ExamineOrder/Detail?orderId=${text}`}
                    className={style['app-organization-department-child-hight']}
                  >{text}</a>
                );
              }
              return text;
            }
            return '--';
          },
        },
      ];
    }

    if (tabKey !== 'tab3') {
      columns.push(
        {
          title: '操作',
          dataIndex: '_id',
          key: 'operate',
          width: 200,
          fixed: 'right',
          render: (text, rec) => this.renderOption(text, rec),
        },
      );
    }

    // 分页
    const pagination = {
      defaultPageSize: 30, // 默认数据条数
      onChange: onChangePage, // 切换分页
      total: dataCount, // 数据总条数
      showTotal: total => `总共${total}条`, // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      showQuickJumper: true, // 显示快速跳转
      showSizeChanger: true, // 显示分页
      onShowSizeChange, // 展示每页数据数
    };

    // 正常tab下，存在titleExt
    const titleExt = tabKey === 'tab1' ? (
      <React.Fragment>
        {
            Operate.canOperateOrganizationManageStaffsCreate() && (
            <CreatePostBtn
              tabKey={tabKey}
              departmentDetail={departmentDetail}
              title="添加岗位"
              breakDepartmentList={breakDepartmentList}
            />
          )
        }
        {
            Operate.canOperateOrganizationManageStaffsAddendum() && (
            <EstablishmentBtn
              departmentDetail={departmentDetail}
              postList={dataSource}
              organizationSubType={OrganizationDepartmentChangeType.add}
              title="增编"
              breakDepartmentList={breakDepartmentList}
            />
          )
        }
        {
          Operate.canOperateOrganizationManageStaffsReduction() && (
            <EstablishmentBtn
              departmentDetail={departmentDetail}
              postList={dataSource}
              organizationSubType={OrganizationDepartmentChangeType.remove}
              breakDepartmentList={breakDepartmentList}
              title="减编"
            />
          )
        }
      </React.Fragment>
    ) : null;

    return (
      <CoreContent title="岗位列表" titleExt={titleExt}>
        <Table
          rowKey={(rec, key) => rec.id || key}
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          loading={tableLoading}
          scroll={tabKey === 'tab2' ? { x: 1300 } : undefined}
        />
      </CoreContent>
    );
  }

  render() {
    return (
      <div>
        {/* 列表 */}
        {this.renderContent()}
      </div>
    );
  }
}

const voidFunc = () => { };
Content.propTypes = {
  tabKey: PropTypes.string, // tab key
  departmentDetail: PropTypes.object,
  data: PropTypes.object,
  onChangePage: PropTypes.func,
  dispatch: PropTypes.func,
  // onSearch: PropTypes.func,
  onChangePageType: PropTypes.func,
  onShowSizeChange: PropTypes.func,
  tableLoading: PropTypes.bool, // table loading
  breakDepartmentList: PropTypes.func, // 刷新列表
};

Content.defaultProps = {
  departmentDetail: {}, // 部门详情
  data: {},
  onChangePage: voidFunc,
  dispatch: voidFunc,
  // onSearch: voidFunc,
  onChangePageType: voidFunc,
  onShowSizeChange: voidFunc,
  tableLoading: PropTypes.bool, // table loading
  breakDepartmentList: voidFunc,
};

export default connect()(Content);
