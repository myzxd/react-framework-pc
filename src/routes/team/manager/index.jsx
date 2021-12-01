/**
 * 业主管理
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Table, Modal } from 'antd';
import React, { Component } from 'react';

import Search from './search';

import ContainerTop from '../components/containerTop';
import OwnerModal from './components/ownerModal';
import ComponentUpdateOwnerModal from './components/updateOwnerModal';
import { CoreContent, DeprecatedCoreForm } from '../../../components/core';
import { CommonSelectPlatforms, CommonSelectSuppliers, CommonSelectCities, CommonSelectDistricts } from '../../../components/common';
import { Gender, TeamTeacherState, TeamOwnerManagerState } from '../../../application/define';
import { authorize } from '../../../application';


import Operate from '../../../application/define/operate';
import styles from './style/index.less';

class Index extends Component {
  static propTypes = {
    teamManagers: PropTypes.object,  // 业主列表数据
    // accountDetail: PropTypes.object, // 账户详情数据
  };

  static defaultProps = {
    teamManagers: {},
    accountDetail: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isShowCreateModal: false,       // 是否显示新增业主弹窗
      updateOwnerModal: {},     // 变更业主相关的信息
      visible: false,     // 变更业主相关的信息
      isOwnerModal: false, // 是否开启业主弹窗
      districts: undefined, // 获取商圈的值
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
    this.props.dispatch({ type: 'teamManager/fetchTeamManagers', payload: searchParams });
    this.props.dispatch({ type: 'accountManage/fetchAccountsDetails', payload: { id: authorize.account.id } });
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
      type: 'teamManager/fetchTeamManagers',
      payload: this.private.searchParams,
    });
  }

  // 请求列表的回调
  onReqList = () => {
    const { searchParams } = this.private;
    this.props.dispatch({
      type: 'teamManager/fetchTeamManagers',
      payload: searchParams,
    });
  }

  // 导出
  onExportBiz = () => {
    const { searchParams } = this.private;
    this.props.dispatch({
      type: 'teamManager/exportOwnerBiz',
      payload: searchParams,
    });
  }
  // 导出无业主商圈
  onExportNotOwnerBiz = () => {
    this.props.dispatch({
      type: 'teamManager/exportNotOwnerBiz',
    });
  }

  // 关闭业主弹窗
  onOwnerHandleCancel = () => {
    // 关闭弹窗
    this.setState({
      isOwnerModal: false,
    });
  }

  // 新增业主弹窗点击确定回调
  onCreateModalHandleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          ...values,
          onSuccessCallback: () => {
            this.setState({
              districts: values.district,
            });

            // 重置表单
            this.props.form.resetFields();
            // 关闭弹窗
            this.setState({
              isShowCreateModal: false,
              isOwnerModal: true,
            });
          },
        };
        this.props.dispatch({
          type: 'teamManager/createOwnerTeamScope',
          payload: params,
        });

        //  重置员工信息
        this.props.dispatch({
          type: 'employeeManage/resetEmployees',
          payload: { fileType: 'second' },
        });
      }
    });
  }

  // 新增业主弹窗点击取消回调
  onCreateModalHandleCancel = () => {
    this.setState({
      isShowCreateModal: false,
    });
    this.props.form.resetFields();
    //  重置员工信息
    this.props.dispatch({
      type: 'employeeManage/resetEmployees',
      payload: { fileType: 'second' },
    });
  }

  // 新增业主回调
  onCreateOwner = () => {
    this.setState({ isShowCreateModal: true });
  }

  // 变更业主
  onClickUpdateOwner = (record) => {
    this.setState({
      updateOwnerModal: {
        ...record,
      },
      visible: true,
    });
  }

  // 关闭变更业主的弹框
  onCancelUpdateOwner = () => {
    this.setState({
      updateOwnerModal: {},
      visible: false,
    });
  }

  onChangePlatformId = () => {
    // 清空选项
    this.props.form.setFieldsValue({ supplierId: undefined, cities: undefined, district: undefined });
  }

  // 更换供应商
  onChangeSuppliers = () => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ cities: undefined, district: undefined });
  }

  // 更换城市
  onChangeCity = (e, options) => {
    const { setFieldsValue } = this.props.form;
    const citySpelling = dot.get(options, 'props.spell', undefined);
    this.setState({
      cities: citySpelling,
    });
    setFieldsValue({ district: undefined });
  }


  deleteSuccessCallback = () => {
    this.props.dispatch({ type: 'teamManager/fetchTeamManagers', payload: this.private.searchParams });
  }

  // 渲染搜索条件
  renderSearch = () => {
    return (
      <Search
        onSearch={this.onSearch}
      />
    );
  }

  // 渲染业主弹窗
  renderOwnerModal = () => {
    const { isOwnerModal, districts } = this.state;
    return <OwnerModal isOwnerModal={isOwnerModal} onOwnerHandleCancel={this.onOwnerHandleCancel} district={districts} />;
  }


  // 渲染table列表
  renderContent = () => {
    const { page, limit } = this.private.searchParams.meta;
    const { teamManagers } = this.props;

    const columns = [
      {
        title: '团队ID',
        dataIndex: '_id',
        key: '_id',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text) => {
          return text ? TeamOwnerManagerState.description(text) : '--';
        },
      },
      {
        title: '业主姓名',
        dataIndex: ['staff_info', 'name'],
        key: 'staff_info.name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '性别',
        dataIndex: ['staff_info', 'gender_id'],
        key: 'staff_info.gender_id',
        render: (text) => {
          return text ? Gender.description(text) : '--';
        },
      },
      {
        title: '手机号',
        dataIndex: ['staff_info', 'phone'],
        key: 'staff_info.phone',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '身份证号',
        dataIndex: ['staff_info', 'identity_card_id'],
        key: 'staff_info.identity_card_id',
        render: (text, record) => {
          if (record.state === TeamOwnerManagerState.notEffect) {
            return record.identity_card_id ? record.identity_card_id : '--';
          }
          return text || '--';
        },
      },
      {
        title: '平台',
        dataIndex: 'platform_names',
        key: 'platform_names',
        render: text => (text && text.length > 0 ? text.toString() : '--'),
      },
      {
        title: '供应商',
        dataIndex: 'supplier_names',
        key: 'supplier_names',
        render: text => (text && text.length > 0 ? text.toString() : '--'),
      },
      {
        title: '承揽范围数量',
        dataIndex: 'biz_district_amount',
        key: 'biz_district_amount',
        render: (text) => {
          return text || `${text}` === '0' ? text : '--';
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
              {
                Operate.canOperateTeamManagerDetail()
                  ?
                    <a
                      href={`#/Team/Manager/Detail?id=${record._id}`} target="_blank" rel="noopener noreferrer"
                      className={styles['app-comp-team-manager-margin']}
                    >查看</a>
                  :
                  ''
              }
              {
                (record.state === TeamTeacherState.true || record.state === TeamOwnerManagerState.notEffect) && Operate.canOperateTeamManagerUpdate()
                  ?
                    <a
                      href={`#/Team/Manager/Update?id=${record._id}`} target="_blank" rel="noopener noreferrer"
                      className={styles['app-comp-team-manager-margin']}
                    >编辑</a>
                  :
                  ''
              }
              {
                Operate.canOperateTeamManagerUpdateOwner()
                  ?
                    <a
                      className={styles['app-comp-team-manager-margin']}
                      onClick={() => this.onClickUpdateOwner(record)}
                    >变更业主</a>
                  :
                  ''
              }
            </React.Fragment>
          );
        },
      },
    ];

    // 分页
    const pagination = {
      current: page,
      pageSize: limit || 30,                      // 默认数据条数
      onChange: this.onChangePage,              // 切换分页
      showQuickJumper: true,                    // 显示快速跳转
      showSizeChanger: true,                    // 显示分页
      onShowSizeChange: this.onShowSizeChange,  // 展示每页数据数
      showTotal: total => `总共${total}条`,      // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(teamManagers, '_meta.result_count', 0), // 数据总条数
    };
    const buttonList = [];

    // 表格头部需要渲染的按钮列表
    if (Operate.canOperateTeamManagerCreate()) {
      buttonList.push(
        { name: '新增业主团队', onCallback: this.onCreateOwner, type: 'primary' },
      );
    }
    if (Operate.canOperateTeamManagerExport()) {
      buttonList.push(
        { name: '导出', onCallback: this.onExportBiz, type: 'primary' },
      );
    }
    if (Operate.canOperateTeamManagerExportNotOwner()) {
      buttonList.push(
        { name: '导出无业主的商圈', onCallback: this.onExportNotOwnerBiz, type: 'primary' },
      );
    }
    return (
      <CoreContent>
        {/* 渲染操作按钮 */}
        <ContainerTop buttonList={buttonList} />
        {/* 数据 */}
        <Table
          rowKey={(record) => {
            return record._id;
          }}
          pagination={pagination}
          dataSource={dot.get(teamManagers, 'data', [])}
          columns={columns}
          bordered
        />
      </CoreContent>
    );
  }


  // 新增业主modal
  renderCreateModal = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { isShowCreateModal, cities } = this.state;
    const formItems = [
      {
        label: '平台',
        form: getFieldDecorator('platformId', {
          rules: [{ required: true, message: '请选择平台' }],
        })(
          <CommonSelectPlatforms
            allowClear
            style={{ width: '80%' }}
            placeholder="请选择平台"
            onChange={this.onChangePlatformId}
          />,
        ),
        span: 24,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 16 } },
      },
      {
        label: '供应商',
        form: getFieldDecorator('supplierId', {
          rules: [{ required: true, message: '请选择供应商' }],
        })(
          <CommonSelectSuppliers
            allowClear
            platforms={getFieldValue('platformId')}
            style={{ width: '80%' }}
            placeholder="请选择供应商"
            onChange={this.onChangeSuppliers}
          />,
        ),
        span: 24,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 16 } },
      },
      {
        label: '城市',
        form: getFieldDecorator('cities', {
          rules: [{ required: true, message: '请选择城市' }],
        })(
          <CommonSelectCities
            allowClear
            suppliers={getFieldValue('supplierId')}
            platforms={getFieldValue('platformId')}
            optionFilterProp="children"
            onChange={this.onChangeCity}
            style={{ width: '80%' }}
            isExpenseModel
            placeholder="请选择城市"
          />,
        ),
        span: 24,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 16 } },
      },
      {
        label: '商圈',
        form: getFieldDecorator('district', {
          rules: [{ required: true, message: '请选择商圈' }],
        })(
          <CommonSelectDistricts
            allowClear
            suppliers={getFieldValue('supplierId')}
            platforms={getFieldValue('platformId')}
            cities={cities}
            style={{ width: '80%' }}
            placeholder="请选择商圈"
          />,
        ),
        span: 24,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 16 } },
      },
    ];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <Modal
        title="选择团队"
        visible={isShowCreateModal}
        onOk={this.onCreateModalHandleOk}
        onCancel={this.onCreateModalHandleCancel}
      >
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </Modal>
    );
  }

  render = () => {
    const { renderSearch, renderContent, renderCreateModal, renderOwnerModal } = this;
    return (
      <div>
        {/* 渲染搜索 */}
        {renderSearch()}

        {/* 渲染内容 */}
        {renderContent()}

        {/* 新增业主modal */}
        {renderCreateModal()}

        {/* 渲染业主弹窗 */}
        {renderOwnerModal()}

        <ComponentUpdateOwnerModal
          detail={this.state.updateOwnerModal}
          visible={this.state.visible}
          onCancel={this.onCancelUpdateOwner}
          dispatch={this.props.dispatch}
          onSuccessCallBack={this.onReqList}
          onClickUpdateOwner={this.onClickUpdateOwner}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ teamManager: { teamManagers }, accountManage: { accountDetail } }) => {
  return { teamManagers, accountDetail };
};

export default connect(mapStateToProps)(Form.create()(Index));
