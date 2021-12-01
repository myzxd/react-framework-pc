/**
 * 关联账号，列表页
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dot from 'dot-prop';
import { connect } from 'dva';
import '@ant-design/compatible/assets/index.css';
import { Table, Popconfirm, Button, message, Tooltip, Form } from 'antd';
import moment from 'moment';

import { CoreContent } from '../../../../components/core';
import { AccountState } from '../../../../application/define';
import Operate from '../../../../application/define/operate';
import Search from './search';
import Create from './create';
import Edit from './edit';
import styles from './style/index.less';

const Index = (props = {}) => {
  const {
    allAccounts,        // 所有有效账号
    accountsList,
    dispatch,
  } = props;
  // 表单
  const [form] = Form.useForm();

  // 区分add or edit or 删除
  const [type, setType] = useState('');
  // 当前记录操作记录
  const [optionIds, setOptionIds] = useState({});
  // 当前页
  const [visible, setVisible] = useState(false);
  // 分页
  const [searchParams, setSearchParams] = useState({ page: 1, limit: 10 });

  // 获取关联账号列表
  useEffect(() => {
    // 获取关联账号列表
    dispatch({ type: 'system/getAccountsListE', payload: { ...searchParams } });
  }, [searchParams]);

  // 获取有效的账号
  useEffect(() => {
    // 获取有效的账号
    dispatch({ type: 'system/getAllAccountsE', payload: { state: AccountState.on } });
  }, []);

  // 分页函数
  const onChangePage = (page, limit) => {
    setSearchParams({ ...searchParams, page, limit });
  };

  // 支持修改pageSize
  const onChangeLimit = (page, limit) => {
    setSearchParams({ ...searchParams, page, limit });
  };

  const onSearch = (params) => {
    setSearchParams({ ...params, page: 1, limit: 10 });
  };

  // 显示弹窗
  const onShowModal = (types, record = []) => {
    // 判断是编辑还是新建的模态框类型
    setType(types);
    setVisible(true);
    // 当前操作账号记录
    setOptionIds(record);
  };

  // 隐藏弹窗
  const onHideModal = (types, record = []) => {
    // 判断是编辑还是新建的模态框类型
    setType(types);
    setVisible(false);
    // 当前操作账号记录
    setOptionIds(record);
  };

  // 添加 or 编辑 or 解除关联账号 dispatch
  const onSubmit = async (phoneList) => {
    // 添加时禁止为空
    if (type === 'add' && phoneList.length <= 0) {
      return message.info('请选择关联手机号', 3);
    }
    // 点击添加
    if (type === 'add') {
      if (await dispatch({
        type: 'system/addRelatedAccountsE',
        payload: {
          account_ids: phoneList,
          errCallBack,
        },
      })) {
        form.setFieldsValue({ addPhone: [] });
        setVisible(false);
      }
    }

    // 编辑
    if (type === 'edit') {
      if (await dispatch({
        type: 'system/editRelatedAccountsE',
        payload: {
          id: optionIds._id,
          account_ids: phoneList,
          onFailureCallBack,
        },
      })) {
        form.setFieldsValue({ editPhone: [] });
        setVisible(false);
      }
    }
  };

  // 解除关联账号
  const onRemoveRelated = (id) => {
    dispatch({
      type: 'system/editRelatedAccountsE',
      payload: {
        id,
        account_ids: [],
        state: AccountState.off,
        onFailureCallBack,
      },
    });
  };

  // 请求失败回调
  const onFailureCallBack = (err) => {
    return message.error(err);
  };

  // 请求失败回调
  const errCallBack = (zhMessage) => {
    return message.error(zhMessage);
  };

  const renderSearch = () => {
    // 判断是否有操作数据的权限
    let operations = '';
    if (Operate.canOperateSystemAccountReleatedUpdate() === true) {
      operations = <Button onClick={() => { onShowModal('add', true); }}>添加账号关联</Button>;
    }

    const searchProps = {
      operations,
      allAccounts,
      onSearch,
    };
    return (
      <Search {...searchProps} />
    );
  };

  // 渲染模态框
  const renderModalComponent = () => {
    if (type === 'add') {
      const addProps = {
        visible,
        allAccounts,
        onHideModal,
        onSubmit,
      };
      return <Create {...addProps} />;
    } else {
      const editProps = {
        visible,
        allAccounts,
        optionIds,
        onHideModal,
        onSubmit,
      };
      return <Edit {...editProps} />;
    }
  };

  // 渲染表格
  const renderTableCompoment = () => {
    const { page, limit } = searchParams;

    const columns = [
      {
        title: 'ID',
        dataIndex: '_id',
        key: '_id',
      }, {
        title: '关联账号',
        dataIndex: 'phones',
        key: 'phones',
        render: (text) => {
          if (text.length > 0) {
            const phoneNumberArr = text.map((item) => {
              return item.phone;
            });
            if (text.length > 3) {
              return (
                <Tooltip title={phoneNumberArr.join(',')}>
                  {phoneNumberArr.slice(0, 3).join(',')}
                </Tooltip>
              );
            }
            return phoneNumberArr.join(',');
          } else {
            return '--';
          }
        },
      }, {
        title: '最新修改时间',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: text => moment(text).format('YYYY-MM-DD HH:mm'),
      }, {
        title: '最新操作人',
        dataIndex: 'operator_info',
        key: 'operator_info',
        render: (text) => {
          return text ? text.name : '--';
        },
      }, {
        title: '操作',
        dataIndex: '_id',
        key: 'option',
        render: (text, record) => {
          // 判断是否有操作数据的权限
          if (Operate.canOperateSystemAccountReleatedUpdate() === false) {
            return '';
          }

          return (
            <span>
              <a onClick={() => { onShowModal('edit', record); }} className={styles['app-comp-system-table-operate-btn']}>编辑</a>
              <Popconfirm title={'你确定要将该账号关联全部解除？'} onConfirm={() => onRemoveRelated(text)} okText="确认" cancelText="取消">
                <a onClick={() => { onHideModal('cancel', record); }} className={styles['app-comp-system-table-operate-btn']}>全部解除关联</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    const dataSource = dot.get(accountsList, 'data');

    // 分页
    const pagination = {
      current: page,
      pageSize: limit || 30,
      onShowSizeChange: onChangeLimit,
      onChange: onChangePage,          // 切换分页
      total: dot.get(accountsList, '_meta.result_count', 0), // 数据总条数
      showQuickJumper: true,                // 显示快速跳转
      showSizeChanger: true,
      showTotal: total => `共 ${total} 条`,
      pageSizeOptions: ['10', '20', '30', '40'],
    };

    return (
      <CoreContent>
        <Table
          // scroll={{ x: 2000 }}
          rowKey={(record, index) => { return ((index * 10) + 1); }}
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
        />
      </CoreContent>
    );
  };

  return (
    <div>
      {/* 渲染搜索组件 */}
      {renderSearch()}

      {/* 渲染表格组件 */}
      {renderTableCompoment()}

      {/* 渲染模态框组件 */}
      {visible && renderModalComponent()}
    </div>
  );
};

Index.propTypes = {
  accountsList: PropTypes.object,   // 列表数据
  allAccounts: PropTypes.array,  // 所有有效账号
};

Index.defaultProps = {
  allAccounts: [],        // 所有有效账号
  accountsList: {},
};

function mapStateToProps({ system: { accountsList, allAccounts } }) {
  return { accountsList, allAccounts };
}
export default connect(mapStateToProps)(Index);
