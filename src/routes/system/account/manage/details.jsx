/**
 * 系统管理 - 账号管理 - 用户详情
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Row, Col, Button, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { AccountState } from './../../../../application/define';

import { CoreContent, CoreTabs } from '../../../../components/core';
import { system, utils } from '../../../../application';
import StrategyGroupPreview from '../../../account/components/strategyGroupPreview';
import styles from './style/index.less';

const codeFlag = system.isShowCode(); // 判断是否是code

const Details = (props = {}) => {
  const {
    data = {},
    dispatch,
    location,
  } = props;
  // 用户ID
  const id = location.query.id;
  const [strategyGroupId, setStrategyGroupId] = useState(undefined);
  const [visible, setVisible] = useState(undefined);

  // 调用详情接口
  useEffect(() => {
    if (id) {
      dispatch({ type: 'accountManage/fetchAccountsDetails', payload: { id } });
    }
    return () => {
      dispatch({ type: 'accountManage/reduceAccountsDetails', payload: {} });
    };
  }, [id]);

  // 返回首页
  const onReturnHom = () => {
    window.location.href = '/#/System/Account/Manage';
  };

  // 策略组预览
  const onPreview = (val) => {
    setStrategyGroupId(val);
    setVisible(true);
  };

  // 隐藏弹窗
  const onCancel = () => {
    setStrategyGroupId(undefined);
    setVisible(false);
  };

  // 渲染基本信息
  const renderBasicInfo = () => {
    const employeeInfo = data.employee_info || {};
    return (
      <CoreContent title="基本信息">
        <Row>
          <Col span={8}>
            <Row>
              <Col span={6} className={styles['app-comp-system-detail-label']} ><h5>姓名 :</h5></Col>
              <Col span={17} className={styles['app-comp-system-detail-value']}>{dot.get(data, 'name', undefined) || '--'}</Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row>
              <Col span={6} className={styles['app-comp-system-detail-label']} ><h5>手机号 :</h5></Col>
              <Col span={17} className={styles['app-comp-system-detail-value']}>{dot.get(data, 'phone', undefined) || '--'}</Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row>
              <Col span={6} className={styles['app-comp-system-detail-label']} ><h5>员工档案 :</h5></Col>
              <Col span={17} className={styles['app-comp-system-detail-value']}>
                {dot.get(employeeInfo, 'name', undefined) && dot.get(employeeInfo, 'identity_card_id', undefined) ?
                  `${dot.get(employeeInfo, 'name')}(${dot.get(employeeInfo, 'identity_card_id')})` :
                  '--'}
              </Col>
            </Row>
          </Col>
        </Row>
      </CoreContent>
    );
  };

  // 渲染组织信息
  const renderOrganizationInfo = () => {
    const roleNames = dot.get(data, 'role_names', []);
    return (
      <CoreContent title="账号角色信息">
        <Row>
          <Col span={8}>
            <Row>
              <Col span={6} className={styles['app-comp-system-detail-label']}><h5>角色 :</h5></Col>
              <Col span={17} className={styles['app-comp-system-detail-value']}>{roleNames.join('/ ') || '--'}</Col>
            </Row>
          </Col>
        </Row>
      </CoreContent>
    );
  };

  // 渲染平台
  const renderPlatform = () => {
    const employeeInfo = data.employee_info || {};
    const bizDataBusinessInfo = employeeInfo.biz_data_business_info || {};
    const {
      platform_list: platformList = [],
    } = bizDataBusinessInfo;
    const isAdmin = dot.get(data, 'is_admin', false);
    if (isAdmin === true) {
      return '全量数据';
    }
    const platformName = platformList.map(v => Object.values(v)[0]);
    if (is.not.existy(platformName) || is.empty(platformName) || is.not.array(platformName)) {
      return '--';
    }
    return platformName.join(' , ');
  };

  // 渲染供应商
  const renderSupplier = () => {
    const employeeInfo = data.employee_info || {};
    const bizDataBusinessInfo = employeeInfo.biz_data_business_info || {};
    const {
      suppliers_with_platform: supplierList = [],
    } = bizDataBusinessInfo;
    const isAdmin = dot.get(data, 'is_admin', false);
    if (isAdmin === true) {
      return '全量数据';
    }
    const supplierName = supplierList.map((item) => {
      const name = Object.values(item)[0];
      // 平台name
      const platformName = utils.dotOptimal(item, 'platform_info.platform_name', undefined);
      return platformName ? `${name}（${platformName}）` : name;
    });
    if (is.not.existy(supplierName) || is.empty(supplierName) || is.not.array(supplierName)) {
      return '--';
    }
    return supplierName.join(' , ');
  };

  // 渲染城市
  const renderCity = () => {
    const employeeInfo = data.employee_info || {};
    const bizDataBusinessInfo = employeeInfo.biz_data_business_info || {};
    const {
      city_list: cityList = [],
    } = bizDataBusinessInfo;
    const isAdmin = dot.get(data, 'is_admin', false);
    if (isAdmin === true) {
      return '全量数据';
    }
    const cityName = cityList.map(v => Object.values(v)[0]);
    if (is.not.existy(cityName) || is.empty(cityName) || is.not.array(cityName)) {
      return '--';
    }
    return cityName.join(' , ');
  };

  // 渲染业务权限信息
  const renderBusinessScope = () => {
    return (
      <CoreContent title="业务权限信息">
        <Row>
          <Col span={24} className={styles['app-comp-system-detail-form-col']}>
            <Row>
              <Col span={2} className={styles['app-comp-system-detail-label']}><h5>平台 :</h5></Col>
              <Col span={20} className={styles['app-comp-system-detail-value']}>{renderPlatform()}</Col>
            </Row>
          </Col>
          <Col span={24} className={styles['app-comp-system-detail-form-col']}>
            <Row>
              <Col span={2} className={styles['app-comp-system-detail-label']}><h5>供应商 :</h5></Col>
              <Col span={20} className={styles['app-comp-system-detail-value']}>{renderSupplier()}</Col>
            </Row>
          </Col>
          <Col span={24} className={styles['app-comp-system-detail-form-col']}>
            <Row>
              <Col span={2} className={styles['app-comp-system-detail-label']}><h5>城市 :</h5></Col>
              <Col span={20} className={styles['app-comp-system-detail-value']}>{renderCity()}</Col>
            </Row>
          </Col>
        </Row>
      </CoreContent>
    );
  };

  // 渲染状态信息
  const renderStateInfo = () => {
    return (
      <CoreContent title="状态信息">
        <Row>
          <Col span={8}>
            <Row>
              <Col span={6} className={styles['app-comp-system-detail-label']}><h5>状态 :</h5></Col>
              <Col span={17} className={styles['app-comp-system-detail-value']}>{`${dot.get(data, 'state', 0)}` ? `${AccountState.description(dot.get(data, 'state'))}` : `${'--'}`}</Col>
            </Row>
          </Col>
        </Row>
      </CoreContent>
    );
  };

  // 渲染状态信息
  const renderReturnButton = () => {
    return (
      <CoreContent>
        <Row>
          <Col span={24} className={styles['app-comp-system-detail-operate-col']}>
            <Button onClick={onReturnHom}>返回</Button>
          </Col>
        </Row>
      </CoreContent>
    );
  };

  // 账户信息
  const renderAccountInfo = () => {
    return (
      <React.Fragment>
        {/* 渲染基本信息 */}
        {renderBasicInfo()}

        {/* 渲染组织信息 */}
        {renderOrganizationInfo()}

        {/* 渲染业务权限信息 */}
        {renderBusinessScope()}

        {/* 渲染状态信息 */}
        {renderStateInfo()}
      </React.Fragment>
    );
  };

  // 角色数据授权
  const renderRoleList = () => {
    const dataSource = dot.get(data, 'code_biz_group_infos', []);
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
    const dataSource = dot.get(data, 'allow_biz_group_infos', []);
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

  // 外部数据策略信息
  const renderExternalInfo = () => {
    return (
      <React.Fragment>
        {/* 渲染组织信息 */}
        {renderOrganizationInfo()}

        {/* 角色数据授权 */}
        {renderRoleList()}

        {/* 外部数据策略信息 */}
        {renderExternaRoleList()}

        {/* 策略组预览 */}
        {renderStrategyGroup()}
      </React.Fragment>
    );
  };

  // 渲染tab
  const renderTabs = () => {
    const items = [
      {
        title: '账户信息',
        content: renderAccountInfo(),
        key: '账户信息',
      },

    ];

    // 判断是否有code插件
    if (codeFlag === true) {
      items.push(
        {
          title: '外部数据策略信息',
          content: renderExternalInfo(),
          key: '外部数据策略信息',
        },
      );
    }
    return (
      <CoreTabs
        items={items}
      />
    );
  };

  return (
    <div>
      {/* 渲染tab */}
      {renderTabs()}

      {/* 渲染返回按钮 */}
      {renderReturnButton()}
    </div>
  );
};

function mapStateToProps({ accountManage: { accountDetail } }) {
  return { data: accountDetail };
}

export default connect(mapStateToProps)(Details);
