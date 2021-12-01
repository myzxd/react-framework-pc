/**
 * 权限管理模块
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'antd';

import ModuleTree from './moduleTree';
import { CoreContent } from '../../../../components/core';
import { RoleState } from '../../../../application/define';

import Modules from '../../../../application/define/modules';

function System(props) {
  // 面板点击的索引id
  const [activePanel, setActivePanel] = useState([]);

  // 初始化state
  const initStateWithPermission = (permissionsValue = []) => {
    // 展开显示的面板
    const activePanelState = [];
    // 遍历当前数据
    permissionsValue.forEach((item) => {
      // 只有启用状态下的数据才能显示
      if (item.available === RoleState.available) {
        activePanelState[item.gid] = false;
      }
    });
    setActivePanel(activePanelState); // 默认展开的panel
  };

  useEffect(() => {
    // 初始化state
    initStateWithPermission(dot.get(props, 'permissions', []));
  }, []);


   // 获取权限与角色对照的表格文件
  const onDownloadExcel = () => {
    const { permissions = [] } = props;
    // 装权限id的容器
    const authorId = ['占位'];
    // 生成首行
    const firstLine = ['角色'];
    const modulesKey = Object.keys(Modules);
    modulesKey.map((key) => {
      // m 为每一个Module的元素
      const m = Modules[key];
      const rStr = `${m.title}(${m.id})`;
      firstLine.push(rStr.replace(/,/g, '/'));
      authorId.push(m.id);
    });
    // 生成各种行
    // 除了首行的所有行的数据
    const allRoles = [];
    permissions.map((permissionItem) => {
      // 有效的角色
      if (permissionItem.available === 1) {
        const rowItem = [permissionItem.name.replace(/,/g, '/')];
        authorId.map((authorCol, index) => {
          // 避开首列
          if (index !== 0) {
            const permissionClass = permissionItem.permission_class;
            if (permissionClass && permissionClass.length > 0) {
              // 标识是否没有找到id权限
              let flag = true;
              permissionClass.map((s) => {
                if (s.id === authorCol) {
                  rowItem.push('√');
                  flag = false;
                }
              });
              if (flag) {
                return rowItem.push(undefined);
              }
              // 终止
              return false;
            }
            // 没有就扔undefined进去
            rowItem.push(undefined);
          }
        });
        allRoles.push(rowItem);
      }
    });
    // 生成字符串
    let str = '';
    firstLine.map((firstStr, firstIndex) => {
      if (!firstStr) {
        // eslint-disable-next-line no-return-assign
        return str += ',';
      }
      if (firstIndex !== firstLine.length - 1) {
        str += `${firstStr},`;
      } else {
        str += firstStr;
      }
    });
    // 首行完了加一个换行符
    str += '\n';
    // 继续渲染第二行以后的行数据
    allRoles.map((allRowItem, allRowItemIndex) => {
      allRowItem.map((rowItem, rowItemIndex) => {
        if (!rowItem) {
          // eslint-disable-next-line no-return-assign
          return str += ',';
        }
        if (rowItemIndex !== allRowItem.length - 1) {
          str += `${rowItem},`;
        } else {
          str += rowItem;
        }
      });
      if (allRowItemIndex !== allRoles.length - 1) {
        str += '\n';
      }
    });
    const uri = `data:text/csv;charset=utf-8,${encodeURIComponent(str)}`;
    const downloadLink = window.document.createElement('a');
    downloadLink.href = uri;
    downloadLink.download = '角色与权限对照表.csv';
    window.document.body.appendChild(downloadLink);
    downloadLink.click();
    window.document.body.removeChild(downloadLink);
  };

  // 设置内容框的展开状态
  const onChangePannelActive = (id, isActive) => {
    if (is.not.existy(activePanel[id])) {
      return;
    }
    activePanel[id] = isActive;
    setActivePanel(activePanel);
  };

  // 渲染授权模块信息
  const renderAuthorizeModules = () => {
    const permissions = dot.get(props, 'permissions', []).filter(item => item.available === RoleState.available);
    const { dispatch } = props;
    return (
      <CoreContent title="模块权限信息" style={{ background: '#ECECEC', padding: '30px' }}>
        <Row gutter={8}>
          {/* 遍历角色的权限信息 */}
          {permissions.map((item) => {
            const name = item.name;
            const id = item.gid;
            const permission = item.permission_class;
            const isActive = is.truthy(activePanel[id]);
            return <Col span={8} key={id}><ModuleTree id={id} name={name} permission={permission} dispatch={dispatch} isActive={isActive} onChangePannelActive={onChangePannelActive} /></Col>;
          })}
        </Row>
      </CoreContent>
    );
  };

  return (
    <div>
      {/* 渲染下载角色与权限对照表 */}
      {
        <CoreContent title="功能区" style={{ background: '#ECECEC', padding: '30px' }}>
          <Button
            type="primary"
            disabled={props.permissions.length === 0}
            onClick={onDownloadExcel}
          >下载角色与权限对照表</Button>
        </CoreContent>
      }
      {/* 渲染授权模块信息 */}
      {renderAuthorizeModules()}
    </div>
  );
}

function mapStateToProps({ adminManage: { permissions } }) {
  return { permissions };
}
export default connect(mapStateToProps)(System);
