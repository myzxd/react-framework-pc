/**
 * 私教团队管理 - 业主团队管理 - 资产关系 组件
 */
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Table, Button, Modal, Select, Tooltip, Radio, Alert } from 'antd';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import Operate from '../../../../../application/define/operate';
import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import { TeameEffectiveDateType } from '../../../../../application/define';
import { authorize } from '../../../../../application';
import Modules from '../../../../../application/define/modules';

import ChangeCoachModal from './changeCoachModal';          // 变更私教管理弹窗

const canOperateTeamTeacherManageOwnerCreate = Operate.canOperateTeamTeacherManageOwnerCreate();        // 关联业主权限
const canOperateTeamTeacherManageOwnerChange = Operate.canOperateTeamTeacherManageOwnerChange();        // 变更业主权限
const canOperateTeamTeacherManageOwnerStop = Operate.canOperateTeamTeacherManageOwnerStop();        // 终止业主权限
const { Option } = Select;
const date = new Date(); // 获取当前时间
const year = date.getFullYear(); // 得到年份
const month = date.getMonth();// 得到月份
const time = new Date(year, month + 1, 1);


class Relationship extends Component {
  static propTypes = {
    coachRelationshipList: PropTypes.object, // 资产关系列表数据
  }

  static defaultProps = {
    coachRelationshipList: {},
  }

  static getDerivedStateFromProps(props, state) {
    if (props.ownerList.length !== state.ownerArray.length) {
      return {
        ownerArray: props.ownerList,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false,    //  是否显示关联业主或者变更业主弹窗
      isCreateModal: true,    // 默认的弹窗类型是新增关联业主弹窗
      isShowTerminationModal: false, // 是否显示终止显示弹窗
      displayChangeModal: false,            // 显示变更私教管理弹窗
      ownerArray: [],          // 搜索业主名称得到的业主信息数组
      ownerDetail: {},         // 被操作的业主信息
      ownerData: {},         // 变更的业主
      effectDate: Number(moment(time).format('YYYYMMDD')), // 生效日期
    };
    this.private = {
      // 搜索的参数
      searchParams: {
        meta: { page: 1, limit: 30 },
      },
      // 防抖
      flag: true,
    };
  }

  // 获取资产隶属关系列表
  componentDidMount() {
    const { id } = this.props;
    const params = { id };
    this.props.dispatch({ type: 'modelCoachDepartment/fetchCoachRelationshipList', payload: params });
  }

  // 修改分页
  onChangePage = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.meta.page = page;
    searchParams.meta.limit = limit;
    this.onSearch();
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.meta.page = page;
    searchParams.meta.limit = limit;
    this.onSearch();
  }

  // 搜索
  onSearch = (params = {}) => {
    // 保存搜索的参数
    const { searchParams } = this.private;
    const { id } = this.props;
    this.private.searchParams = {
      ...searchParams,
      ...params,
      id,
    };
    this.props.dispatch({
      type: 'modelCoachDepartment/fetchCoachRelationshipList',
      payload: this.private.searchParams,
    });
  }

  // 添加关联业主或者变更业主(弹窗)确定
  onClickModalOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const effectDate = values.changeDate === TeameEffectiveDateType.immediately
                        ? Number(moment(date).format('YYYYMMDD'))
                        : Number(moment(time).format('YYYYMMDD'));
        const { isCreateModal, ownerData } = this.state;
        const { onSuccessCallback } = this;
        const { id } = this.props;
        // this.setState({
        //   effectDate: Number(moment(time).format('YYYYMMDD')), // 生效日期
        // });
        const params = {
          ...values,
          effectDate,
          ownerId: values.name,
          departmentId: id,
          formerOwnerId: ownerData.owner_info ? ownerData.owner_info._id : undefined,
          onSuccessCallback,
          effectTime: Number(moment(date).format('YYYYMMDD')),
        };
        if (isCreateModal) {
          this.props.dispatch({
            type: 'modelCoachDepartment/relationOwner',
            payload: params,
          });
        } else {
          this.props.dispatch({
            type: 'modelCoachDepartment/changeOwner',
            payload: {
              relationLogId: ownerData._id ? ownerData._id : undefined,
              ...params,
            },
          });
        }
      }
    });
  }

  // 添加关联业主或者变更业主(弹窗)取消
  onClickModalCancel = () => {
    // 关闭弹窗 && 清空业主相关信息
    this.setState({
      isShowModal: false,
      ownerArray: [],
      ownerDetail: {},
      ownerData: {},
    });

    // 重置ownerList
    this.props.dispatch(
      {
        type: 'modelCoachDepartment/resetOwnerList',
      },
    );
  }

  // 操作成功以后的回调
  onSuccessCallback = () => {
    // 关闭弹窗 && 清空业主相关信息
    this.setState({
      isShowModal: false,
      ownerDetail: {},
      ownerData: {},
    });
    // 重置ownerList
    this.props.dispatch(
      {
        type: 'modelCoachDepartment/resetOwnerList',
      },
    );
    // 重置表单name
    this.props.form.setFieldsValue({
      name: undefined,
    });
    // 刷新资产隶属列表
    this.onSearch();
    // 刷新变更记录列表
    this.props.onGetChangeList(true);
  }

  // 添加或变更业主弹窗按钮
  onChangeOwner = (data) => {
    // data有值就是变更业主  否则就是新增弹窗
    if (data) {
      this.setState(
        {
          isShowModal: true,
          isCreateModal: false,
          ownerData: data,
        },
      );
    } else {
      this.setState(
        {
          isShowModal: true,
          isCreateModal: true,
          ownerData: {},
        },
      );
    }
  }

  // 更改生效日期
  onEffectDate = (value) => {
    if (value.target.value === TeameEffectiveDateType.immediately) {
      this.setState({
        effectDate: Number(moment(date).format('YYYYMMDD')), // 生效日期
      });
    } else {
      this.setState({
        effectDate: Number(moment(time).format('YYYYMMDD')), // 生效日期
      });
    }
  }

  // 搜索业主名字
  onHandleSearch = (value) => {
    // 如果搜索值是空，就不能搜索
    if (!value.trim()) {
      return;
    }
    const { flag } = this.private;
    // 储存最后一次搜索的值
    this.lastValue = value;
    if (flag) {
      setTimeout(() => {
        this.props.dispatch(
          {
            type: 'modelCoachDepartment/fetchOwnerList',
            payload: {
              name: this.lastValue,
            },
          },
        );
        this.private.flag = true;
        this.lastValue = undefined;
      }, 200);
      this.private.flag = false;
    }
  }

  // 选择业主名字
  onHandleChange = (value) => {
    if (!value) {
      this.props.form.setFieldsValue({
        name: undefined,
      });
      return this.setState({
        ownerDetail: {},
      });
    }
    const { ownerArray } = this.state;
    const result = ownerArray.find(item => item._id === value);
    this.props.form.setFieldsValue({
      name: value,
    });
    this.setState({
      ownerDetail: result,
    });
  }

  // 终止
  onStopManage = (data) => {
    this.setState({
      isShowTerminationModal: true,
      ownerDetail: data,
    });
  }
  // 点击变更操作按钮
  onChangeModalOpen = (data) => {
    this.setState({
      ownerData: data,
      displayChangeModal: true,
    });
  }

  // 提交终止的数据
  onSubmitTermination = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const effectDate = values.terminationDate === TeameEffectiveDateType.immediately
                        ? Number(moment(date).format('YYYYMMDD'))
                        : Number(moment(time).format('YYYYMMDD'));
      this.setState({
        isShowTerminationModal: false,
      });
      const { onSuccessCallback } = this;
      const { id } = this.props;
      const { ownerDetail } = this.state;
      const params = {
        ...values,
        effectDate, // 生效时间
        formerOwnerId: ownerDetail.owner_info ? ownerDetail.owner_info._id : undefined,        // 目标id
        relationLogId: ownerDetail._id ? ownerDetail._id : undefined,              // _id
        departmentId: id,                        // 部门id
        onSuccessCallback,                      // 成功的回调
      };
      // this.setState({
      //   effectDate: Number(moment(time).format('YYYYMMDD')), // 生效日期
      // });
      this.props.dispatch(
        {
          type: 'modelCoachDepartment/stopManage',
          payload: params,
        },
      );
      this.props.form.resetFields();
    });
  }

  // 弹窗隐藏
  onTerminationCancel = () => {
    this.setState({
      isShowTerminationModal: false,
    });
  }
  // 变更弹窗成功的回调
  onOkCallback = () => {
    // 关闭弹窗
    this.onCancelCallback();
    // 刷新资产隶属列表
    this.onSearch();
    // 刷新变更记录列表
    this.props.onGetChangeList(true);
  }
  // 变更弹窗取消的回调
  onCancelCallback = () => {
    this.setState({
      displayChangeModal: false,
      ownerData: {},
    });
  }
  // 判断是否有业主管理编辑页面跳转的权限
  checkAuthor = () => {
    return authorize.modules().some(item => item.id === Modules.ModuleTeamManagerUpdate.id);
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

  // 渲染终止的form表单
  renderTerminationForm = () => {
    const { getFieldDecorator } = this.props.form;
    const { isShowTerminationModal } = this.state;
    if (!isShowTerminationModal) return null;
    const formItem = [
      {
        label: '生效日期',
        form: getFieldDecorator('terminationDate', {
          initialValue: TeameEffectiveDateType.immediately,
          rules: [{ required: true, message: '请选择生效日期' }],
        })(
          <Radio.Group onChange={this.onEffectDate}>
            {/* <Radio value={TeameEffectiveDateType.second}>{TeameEffectiveDateType.description(TeameEffectiveDateType.second)}</Radio> */}
            <Radio value={TeameEffectiveDateType.immediately}>{TeameEffectiveDateType.description(TeameEffectiveDateType.immediately)}</Radio>
          </Radio.Group>,
        ),
      },
    ];
    const layout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };
    return (
      <Modal
        title={<Alert message="是否确认终止？" type="warning" showIcon style={{ background: '#fff', border: 'none' }} />}
        width="800px"
        visible={isShowTerminationModal}
        onOk={this.onSubmitTermination}
        onCancel={this.onTerminationCancel}
        okText="确定"
      >
        <DeprecatedCoreForm items={formItem} cols={1} layout={layout} />
      </Modal>
    );
  }

  // 渲染资产隶属关系列表
  renderRelationshipList = () => {
    const { showMoreStr } = this;
    const { coachRelationshipList: relationShipData } = this.props;
    const data = relationShipData.data || [];
    const total = relationShipData._meta ? relationShipData._meta.result_count : 0;
    const { meta } = this.private.searchParams;
    const authorFlag = this.checkAuthor();

    const columns = [
      {
        title: '业主姓名',
        dataIndex: 'owner_info',
        key: 'owner_info.staff_info.name',
        width: 100,
        fixed: 'left',
        render: (text, rowData) => {
          if (authorFlag && rowData.owner_id) {
            return (<a
              href={`/#/Team/Manager/Update?id=${rowData.owner_id}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {dot.get(text, 'staff_info.name', '--')}
            </a>);
          }
          return text && text.staff_info ? text.staff_info.name : '--';
        },
      },
      {
        title: '业主团队ID',
        dataIndex: 'owner_id',
        key: 'owner_id',
        width: 180,
        fixed: 'left',
        render: text => text || '--',
      },
      {
        title: '平台',
        dataIndex: 'owner_info',
        key: 'owner_info.platform_names',
        render: (text) => {
          // platform_names不能为空数组
          const result = (text && text.platform_names && text.platform_names.length > 0
            ? text.platform_names.toString()
            : '--');
          return showMoreStr(result, 10);
        },
      },
      {
        title: '供应商',
        dataIndex: 'owner_info',
        key: 'owner_info.supplier_names',
        render: (text) => {
          // supplier_names不能为空数组
          const result = (text && text.supplier_names && text.supplier_names.length > 0
            ? text.supplier_names.toString()
            : '--');
          return showMoreStr(result, 10);
        },
      },
      {
        title: '城市',
        dataIndex: 'owner_info',
        key: 'owner_info.city_names',
        render: (text) => {
          // city_names不能为空数组
          const result = (text && text.city_names && text.city_names.length > 0
            ? text.city_names.toString()
            : '--');
          return showMoreStr(result, 10);
        },
      },
      {
        title: '商圈',
        dataIndex: 'owner_info',
        key: 'owner_info.biz_district_names',
        render: (text) => {
          // biz_district_names不能为空数组
          const result = (text && text.biz_district_names && text.biz_district_names.length > 0
            ? text.biz_district_names.toString()
            : '--');
          return showMoreStr(result, 10);
        },
      },
      {
        title: '操作人',
        dataIndex: 'operator_info',
        key: 'operator_info.name',
        width: 100,
        render: text => (text && text.name ? text.name : '--'),
      },
      {
        title: '归属月份',
        dataIndex: 'month',
        key: 'month',
        width: 150,
        render: text => (text ? moment(`${text}01`).format('YYYY年MM月') : '--'),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 100,
        fixed: 'right',
        render: (text, rowData) => {
          return (
            <React.Fragment>
              {
                canOperateTeamTeacherManageOwnerChange
                  ?
                  (<span
                    className="app-global-compoments-cursor"
                    onClick={() => this.onChangeModalOpen(rowData)}
                  >变更</span>)
                  :
                  null
              }
              {
                canOperateTeamTeacherManageOwnerStop
                  ?
                  (
                    <span
                      onClick={() => this.onStopManage(rowData)}
                      className="app-global-compoments-cursor"
                    >终止</span>
                  )
                  :
                  null
              }
            </React.Fragment>
          );
        },
      },
    ];

    // 分页
    const pagination = {
      current: meta.page,
      defaultPageSize: 30,                      // 默认数据条数
      pageSize: meta.limit,             // 每页展示条数
      onChange: this.onChangePage,              // 切换分页
      showQuickJumper: true,                    // 显示快速跳转
      showSizeChanger: true,                    // 显示分页
      onShowSizeChange: this.onShowSizeChange,  // 展示每页数据数
      showTotal: Total => `总共${Total}条`,      // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total,                                    // 数据总条数
    };
    const titleExt = (<Button type="primary" onClick={this.onChangeOwner.bind(null, false)}>添加资产管理</Button>);
    return (
      <CoreContent
        title="资产隶属关系列表"
        titleExt={canOperateTeamTeacherManageOwnerCreate ? titleExt : null}
      >
        <Table
          rowKey={(record, index) => {
            return index;
          }}
          pagination={pagination}
          dataSource={data}
          columns={columns}
          bordered
          scroll={{ x: 1380 }}
        />
      </CoreContent>
    );
  }

  // 渲染添加或变更资产弹窗
  renderAssetsManageModal = () => {
    const { getFieldDecorator } = this.props.form;
    const { isShowModal, isCreateModal, ownerArray, ownerDetail } = this.state;
    if (!isShowModal) {
      return null;
    }
    const formItems = [
      {
        label: '姓名',
        form: getFieldDecorator('name', {
          rules: [{ required: true, message: '业主姓名不能为空！' }],
        })(
          <Select
            showSearch
            placeholder="请输入业主姓名"
            showArrow={false}
            onChange={this.onHandleChange}
            onSearch={this.onHandleSearch}
            style={{ width: 240 }}
            filterOption={false}
            allowClear
          >
            {
              ownerArray.map((item) => {
                // 有业主信息才显示
                if (item.staff_info) {
                  return <Option key={item._id} value={item._id}>{`${item.staff_info.name}(${item._id})`}</Option>;
                }
              })
            }
          </Select>,
        ),
      },
      {
        label: '平台',
        form: ownerDetail.platform_names && ownerDetail.platform_names.length > 0 ? ownerDetail.platform_names.toString() : '--',
      },
      {
        label: '供应商',
        form: ownerDetail.supplier_names && ownerDetail.supplier_names.length > 0 ? ownerDetail.supplier_names.toString() : '--',
      },
      {
        label: '城市',
        form: ownerDetail.city_names && ownerDetail.city_names.length > 0 ? ownerDetail.city_names.toString() : '--',
      },
      {
        label: '商圈',
        form: ownerDetail.biz_district_names && ownerDetail.biz_district_names.length > 0 ? ownerDetail.biz_district_names.toString() : '--',
      },
    ];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    // 弹窗的确认按钮文案
    let okText;
    // 弹窗标题文案
    let title;
    // 如果是关联业主弹窗(新增)
    if (isCreateModal) {
      formItems.push({
        label: '生效日期',
        form: '立即生效',
      });
      okText = '确定';
      title = '关联业主选择';
    } else {
      okText = '确定变更';
      title = '变更业主';
      formItems.push({
        label: '生效日期',
        form: getFieldDecorator('changeDate', {
          initialValue: TeameEffectiveDateType.immediately,
          rules: [{ required: true, message: '请选择生效日期' }],
        })(
          <Radio.Group onChange={this.onEffectDate}>
            {/* <Radio value={TeameEffectiveDateType.second}>{TeameEffectiveDateType.description(TeameEffectiveDateType.second)}</Radio> */}
            <Radio value={TeameEffectiveDateType.immediately}>{TeameEffectiveDateType.description(TeameEffectiveDateType.immediately)}</Radio>
          </Radio.Group>,
        ),
      });
    }
    return (
      <Modal
        title={title}
        visible={isShowModal}
        onOk={this.onClickModalOk}
        onCancel={this.onClickModalCancel}
        okText={okText}
      >
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </Modal>
    );
  }


  render() {
    const { displayChangeModal,
      ownerData: {
        department_id: departmentId,
        owner_id: ownerId,
        _id: relationLogId,
      } } = this.state;
    const { onOkCallback, onCancelCallback } = this;
    const params = {
      departmentId,
      ownerId,
      relationLogId,
      onOkCallback,
      onCancelCallback,
    };
    return (
      <div>

        {/* 资产隶属关系列表 */}
        {this.renderRelationshipList()}

        {/* 弹窗*/}
        {this.renderAssetsManageModal()}

        {/* 终止弹窗 */}
        {this.renderTerminationForm()}

        {/* 渲染变更私教管理弹窗 */}
        { displayChangeModal && <ChangeCoachModal {...params} />}
      </div>
    );
  }
}

const mapStateToProps = ({ modelCoachDepartment: { coachRelationshipList, ownerList } }) => {
  return { coachRelationshipList, ownerList };
};

export default connect(mapStateToProps)(Form.create()(Relationship));
