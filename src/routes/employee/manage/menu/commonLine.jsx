/*
 * 查看人员渲染公共部分
 **/
import dot from 'dot-prop';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Table, Modal, DatePicker, Button, Alert } from 'antd';
import React, { Component } from 'react';

import { CoreContent, DeprecatedCoreForm } from '../../../../components/core';
import EmployeesSelect from './components/employeesSelect';
import {
  StaffSate,
  SigningState,
  SignContractType,
} from '../../../../application/define';
import Operate from '../../../../application/define/operate';
import ChangeTeam from './components/changeTeam';
import styles from './style.css';

const canOperateEmployeeSearchUpdateButton = Operate.canOperateEmployeeSearchUpdateButton();
const canOperateEmployeeResignVerifyForceButton = Operate.canOperateEmployeeResignVerifyForceButton();
const canOperateEmployeeResignButton = Operate.canOperateEmployeeResignButton();

class CommonLine extends Component {
  static propTypes = {
    employees: PropTypes.object,        // 人员列表数据
  }
  static defaultProps = {
    employees: {},
  }
  constructor(props) {
    super(props);
    this.state = {
      visible: false,  // 离职Model框显示状态
      selectedRowKeys: [], // table selectedRowKeys
    };
    this.private = {
      staffId: '',  // 离职操作保存的人员id
      dispatch: props.dispatch,
      staffName: '',  //  离职人员姓名
      searchParams: {
        // state: [SigningState.normal],    // 签约状态
        fileType: props.fileType,
      },   // 搜索的参数
    };
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    this.setState({ selectedRowKeys: [] });
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.setState({ selectedRowKeys: [] });
    this.onSearch(searchParams);
  }

  // 修改分页
  onChangePage = (page, limit) => {
    this.setState({ selectedRowKeys: [] });
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.setState({ selectedRowKeys: [] });
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
    this.setState({ selectedRowKeys: [] });
    // 调用搜索
    this.private.dispatch({ type: 'employeeManage/fetchEmployees', payload: this.private.searchParams });
  }

  // 人员办理离职
  onResign = (values) => {
    this.props.dispatch({ type: 'employeeManage/employeeOperateDeparture', payload: { ...values, onSuccessCallback: this.onSuccessCallback } });
  }

  // 获取人员列表回调
  onSuccessCallback = () => {
    this.setState({
      ...this.state,
      visible: false,
    });
    this.props.form.resetFields();
    this.props.dispatch({ type: 'employeeManage/fetchEmployees', payload: this.private.searchParams });
  }

  // 变更team成功
  onSuccessChangeTeam = () => {
    this.setState({ selectedRowKeys: [] });
    this.onSearch({});
  }

  // 显示离职操作Model
  showResignModel = (staffId, entryDate, name) => {
    this.private.staffId = staffId;
    this.private.staffName = name;
    this.setState({
      ...this.state,
      visible: true,
      entryDate,
    });
  }

  handleOk = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const { staffName } = this.private;
      const values = {
        ...fieldsValue,
        staffName,
        departureDate: fieldsValue.departureDate.format('YYYYMMDD'),
      };
      this.onResign({ ...values, staffId: this.private.staffId });
    });
  }

  handleCancel = () => {
    this.setState({
      ...this.state,
      visible: false,
    });
    this.private.staffName = '';
    this.props.form.resetFields();
  }

  // 限制解约日期选择范围
  disabledDate = (current) => {
    const { entryDate } = this.state;
    return current < moment(entryDate, 'YYYYMMDD') || current > moment();
  }

  // 渲染离职Model
  renderResignModel = () => {
    const { getFieldDecorator } = this.props.form;
    const { staffName } = this.private;
    const { fileType } = this.props;
    let labelInfo = '解约日期';
    let messageInfo = '请选择解约日期';
    let titleInfo = '解约';
    if (fileType === 'staff') {
      labelInfo = '离职日期';
      messageInfo = '请选择离职日期';
      titleInfo = <span><span className={styles['app-comp-employee-manage-menu-common-line-operation-termination']}>办理离职</span><span>员工姓名：{staffName}</span></span>;
    }
    const formItems = [
      {
        label: labelInfo,
        key: 'departureDate',
        form: getFieldDecorator('departureDate',
          {
            initialValue: moment(),
            rules: [{ required: true, message: messageInfo }],
          })(
            <DatePicker disabledDate={this.disabledDate} />,
          ),
      },
    ];
    if (fileType === 'staff') {
      formItems.push(
        {
          label: '工作接收人',
          key: 'jobRecipient',
          form: getFieldDecorator('jobRecipient',
            {
              rules: [{ required: true, message: '请选择工作接收人' }],
            })(
              <EmployeesSelect
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="请选择工作接收人"
              />,
          ),
        },
      );
    }

    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 11 } };
    return (
      <Modal
        title={titleInfo}
        visible={this.state.visible}
        destroyOnClose
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Alert className={styles['alert-info']} message="可选择员工办理离职，办理离职后所选员工将进入待离职状态" type="info" showIcon closable />
        <Form layout="horizontal">
          <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
        </Form>
      </Modal>
    );
  }

  // 渲染搜索
  renderSearch = () => {
    const { onSearch } = this;
    const { Search } = this.props;

    return (
      <Search onSearch={onSearch} />
    );
  }

  // 渲染内容列表
  renderContent = () => {
    const {
      fileType,
      employees,
      propsColumns,
      propsTotalX,
      formTitle,
    } = this.props;
    // 人员列表数据
    const dataSource = employees;
    const { page = 1 } = this.private.searchParams;
    // columns总宽度
    const totalX = 370 + propsTotalX;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        width: 100,
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
        fixed: 'left',
        width: 120,
      },
      ...propsColumns,
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        width: 120,
        render: (text, record) => {
          // 是否有权限操作
          // if (record.state === SigningState.release) {
          //   return (
          //     <div>
          //       <a href="_blank" rel="noopener noreferrer" >查看详情</a >
          //     </div>
          //   );
          // }
          return (
            <div>
              <a href={`/#/Employee/Detail?id=${record._id}&fileType=${fileType}`} className={styles['app-comp-employee-manage-menu-common-line-operation-detail']} target="_blank" rel="noopener noreferrer">查看详情</a >
              {canOperateEmployeeSearchUpdateButton && (!(record.state === SigningState.release)) ?
                <Link
                  to={{
                    pathname: '/Employee/Update',
                    query: { id: record._id, fileType },
                  }}
                  className={styles['app-comp-employee-manage_menu-common-line-operation-update']}
                >编辑</Link>
                : ''}
              {
                canOperateEmployeeResignVerifyForceButton && fileType === 'staff' && record.state !== SigningState.release && record.state !== StaffSate.willResign
                  ? <a className={styles['app-comp-employee-manage-menu-common-line-operation-termination-text']} onClick={this.showResignModel.bind(this, record._id, record.entry_date, record.name)}>办理离职</a>
                  : ''
              }
              {
                canOperateEmployeeResignButton && fileType === 'staff' && record.state === StaffSate.willResign
                ? <a href={`/#/Employee/Resign?id=${record._id}&fileType=${fileType}`} className={styles['app-comp-employee-manage-menu-common-line-operation-detail']} target="_blank" rel="noopener noreferrer">确认离职</a >
                : null
              }
              {
                (record && record.sign_type === SignContractType.electronic && record.state === SigningState.normal && record.contract_asset_url) ?
                  <a href={record.contract_asset_url} download>下载合同</a >
                  : null
              }
            </div>
          );
        },
      }];

    // 分页
    const pagination = {
      // 每次点击查询, 重置页码为1
      current: page,
      defaultPageSize: 30,          // 默认数据条数
      onChange: this.onChangePage,  // 切换分页
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,        // 显示分页
      onShowSizeChange: this.onShowSizeChange,              // 展示每页数据数
      showTotal: total => `总共${total}条`,                  // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(dataSource, 'meta.count', 0),  // 数据总条数
    };

    // 扩展标题
    let titleExt;
    // 批量操作员工team变更
    const staffChangeTeam = Operate.canOperateEmployeeChangeStaffTeam()
      ? (
        <ChangeTeam
          selectedRowKeys={this.state.selectedRowKeys}
          disabled={this.state.selectedRowKeys.length < 1}
          fileType={this.props.fileType}
          onSuccessCallback={this.onSuccessChangeTeam}
        />
      ) : '';
    // 批量操作二线team变更
    const scendChangeTeam = Operate.canOperateEmployeeChangeScendTeam()
      ? (
        <ChangeTeam
          selectedRowKeys={this.state.selectedRowKeys}
          disabled={this.state.selectedRowKeys.length < 1}
          fileType={this.props.fileType}
          onSuccessCallback={this.onSuccessChangeTeam}
        />
      ) : '';

    // 根据url地址判断
    if (formTitle.linkUrl !== undefined && formTitle.btnName !== undefined) {
      titleExt = (
        <div>
          {staffChangeTeam}
          <a href={formTitle.linkUrl}>
            <Button type="primary">{formTitle.btnName}</Button>
          </a>
        </div>
      );
    } else {
      titleExt = scendChangeTeam;
    }

    // rowSelection
    const renderRowSelection = () => {
      const rowSelection = {
        selectedRowKeys: this.state.selectedRowKeys,
        onChange: id => this.setState({ selectedRowKeys: id }),
        columnWidth: 60,
        getCheckboxProps: rec => ({ disabled: rec.state !== StaffSate.inService }),
      };
      return rowSelection;
    };

    return (
      <CoreContent title={formTitle.title} titleExt={titleExt}>
        <Table
          rowKey={({ _id: id }) => id}
          pagination={pagination}
          columns={columns}
          dataSource={dataSource.data}
          bordered
          rowSelection={renderRowSelection()}
          scroll={{ x: totalX, y: 500 }}
        />
      </CoreContent>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染搜索 */}
        {this.renderSearch()}

        {/* 渲染内容列表 */}
        {this.renderContent()}

        {/* 渲染解约Model */}
        {this.renderResignModel()}
      </div>
    );
  }
}

export default Form.create()(CommonLine);
