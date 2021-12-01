/**
 * 我的账户模块 我的账户
 * */
import dot from 'dot-prop';
import is from 'is_js';
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Form, Table } from 'antd';

import { CoreContent, CoreForm } from '../../components/core';
import StrategyGroupPreview from './components/strategyGroupPreview';
import { authorize, utils } from '../../application';

function Account(props) {
  const accountId = authorize.account.id;
  const { dispatch, accountDetail } = props;

  // 预览弹窗visible
  const [visible, setVisible] = useState(false);
  // 当前操作的策略组id
  const [strategyGroupId, setStrategyGroupId] = useState(undefined);

  useEffect(() => {
    dispatch({
      type: 'accountManage/fetchAccountsDetails',
      payload: { id: accountId },
    });
    return () => {
      dispatch({
        type: 'accountManage/resetAccountsDetails',
      });
    };
  }, [dispatch, accountId]);

  // 策略组预览
  const onPreview = (id) => {
    setStrategyGroupId(id);
    setVisible(true);
  };

  // 隐藏弹窗
  const onCancel = () => {
    setStrategyGroupId(undefined);
    setVisible(false);
  };

  // 个人信息
  const renderPersonalInformation = () => {
    const formItems = [
      <Form.Item label="姓名">
        {accountDetail.name || '--'}
      </Form.Item>,
      <Form.Item label="手机号">
        {accountDetail.phone || '--'}
      </Form.Item>,
    ];
    return (
      <CoreContent title="个人信息">
        <CoreForm items={formItems} cols={2} />
      </CoreContent>
    );
  };

  // 账号角色信息
  const renderAccountRoleInformation = () => {
    const roleNames = accountDetail.role_names || [];
    const formItems = [
      <Form.Item label="角色">
        {roleNames.join('/ ') || '--'}
      </Form.Item>,
    ];
    return (
      <CoreContent title="账号角色信息">
        <CoreForm items={formItems} cols={1} />
      </CoreContent>
    );
  };

  // 业务权限信息
  const renderBusinessAuthorityInformation = () => {
    const employeeInfo = accountDetail.employee_info || {};
    const bizDataBusinessInfo = employeeInfo.biz_data_business_info || {};
    const {
      platform_list: platformList = [],
      suppliers_with_platform: supplierList = [],
      city_list: cityList = [],
    } = bizDataBusinessInfo;
    const {
      is_admin: isAdmin,
    } = accountDetail;
    let platformNames = '--';
    let supplierNames = '--';
    let cityNames = '--';
    // 判断是否是超管
    if (isAdmin === true) {
      platformNames = '全量数据';
      supplierNames = '全量数据';
      cityNames = '全量数据';
    }
    if (isAdmin === false && is.existy(platformList) && is.not.empty(platformList)) {
      platformNames = platformList.map(item => Object.values(item)[0]).join(', ');
    }
    if (isAdmin === false && is.existy(supplierList) && is.not.empty(supplierList)) {
      supplierNames = supplierList.map((item) => {
        const name = Object.values(item)[0];
        // 平台name
        const platformName = utils.dotOptimal(item, 'platform_info.platform_name', undefined);
        return platformName ? `${name}（${platformName}）` : name;
      }).join(', ');
    }
    if (isAdmin === false && is.existy(cityList) && is.not.empty(cityList)) {
      cityNames = cityList.map(item => Object.values(item)[0]).join(', ');
    }
    const layout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 20,
      },
    };
    const formItems = [
      <Form.Item label="平台" {...layout}>
        {platformNames || '--'}
      </Form.Item>,
      <Form.Item label="供应商" {...layout}>
        {supplierNames || '--'}
      </Form.Item>,
      <Form.Item label="城市" {...layout}>
        {cityNames || '--'}
      </Form.Item>,
    ];
    return (
      <CoreContent title="业务权限信息">
        <CoreForm items={formItems} cols={1} />
      </CoreContent>
    );
  };
  // 角色数据授权
  const renderRoleList = () => {
    const dataSource = dot.get(props.accountDetail, 'code_biz_group_infos', []);
    const columns = [
      {
        title: '数据策略组',
        dataIndex: 'name',
        key: 'name',
        width: 200,
        render: text => text || '--',
      },
      {
        title: 'code信息',
        dataIndex: 'code_names',
        key: 'code_names',
        render: (text) => {
          if (is.not.existy(text) || is.empty(text)) {
            return '--';
          }
          return text.join(', ');
        },
      },
      {
        title: 'team信息',
        dataIndex: 'team_names',
        key: 'team_names',
        render: (text) => {
          if (is.not.existy(text) || is.empty(text)) {
            return '--';
          }
          return text.join(', ');
        },
      },
      {
        title: '科目',
        dataIndex: 'ac_names',
        key: 'ac_names',
        render: () => {
          return '全部';
        },
      },
      {
        title: '操作',
        key: 'operate',
        render: (_, rec) => {
          return <a onClick={() => onPreview(rec._id)}>预览</a>;
        },
      },
    ];

    return (
      <CoreContent title="角色数据授权">
        <Table
          rowKey={(rec, key) => rec._id || key}
          dataSource={dataSource}
          columns={columns}
          bordered
          pagination={false}
          scroll={{ y: 400 }}
        />
      </CoreContent>
    );
  };

  // 外部数据策略信息
  const renderExternaRoleList = () => {
    const dataSource = dot.get(props.accountDetail, 'allow_biz_group_infos', []);
    const columns = [
      {
        title: '数据策略组',
        dataIndex: 'name',
        key: 'name',
        width: 200,
        render: text => text || '--',
      },
      {
        title: 'code信息',
        dataIndex: 'code_names',
        key: 'code_names',
        render: (text) => {
          if (is.not.existy(text) || is.empty(text)) {
            return '--';
          }
          return text.join(', ');
        },
      },
      {
        title: 'team信息',
        dataIndex: 'team_names',
        key: 'team_names',
        render: (text) => {
          if (is.not.existy(text) || is.empty(text)) {
            return '--';
          }
          return text.join(', ');
        },
      },
      {
        title: '科目',
        dataIndex: 'ac_names',
        key: 'ac_names',
        render: () => {
          return '全部';
        },
      },
      {
        title: '操作',
        key: 'operate',
        render: (_, rec) => {
          return <a onClick={() => onPreview(rec._id)}>预览</a>;
        },
      },
    ];

    return (
      <CoreContent title="特殊数据授权">
        <Table
          dataSource={dataSource}
          columns={columns}
          bordered
          scroll={{ y: 400 }}
          pagination={false}
        />
      </CoreContent>
    );
  };

  // 策略组预览
  const renderStrategyGroup = () => {
    if (!visible) return;
    return (
      <StrategyGroupPreview
        strategyGroupId={strategyGroupId}
        visible={visible}
        onCancel={onCancel}
      />
    );
  };

  return (
    <Form>
      {/* 个人信息 */}
      {renderPersonalInformation()}
      {/* 账号角色信息 */}
      {renderAccountRoleInformation()}
      {/* 业务权限信息 */}
      {renderBusinessAuthorityInformation()}

      {/* 角色数据授权 */}
      {renderRoleList()}

      {/* 外部数据策略信息 */}
      {renderExternaRoleList()}

      {/* 策略组预览 */}
      {renderStrategyGroup()}
    </Form>
  );
}

const mapStateToProps = ({ accountManage: { accountDetail } }) => ({ accountDetail });

export default connect(mapStateToProps)(Account);
