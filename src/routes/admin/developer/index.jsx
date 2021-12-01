/**
 * 职位 对照显示模块
 */
import is from 'is_js';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Table } from 'antd';
// import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

import { CoreContent } from '../../../components/core';
import BreadCrumb from '../../layout/breadcrumb';
import Router from '../../../application/service/router';
import Modules from '../../../application/define/modules';
import Navigation from '../../../application/define/navigation';
import { AuthTree, AuthNodes } from '../../../application/define/auth';
import styles from './style.less';

class System extends Component {

  abandonIds = () => {
    return ['1-1', '1-0', '1-3', '1-2', '1-5', '1-4', '1-7', '1-6', '3-24', '3-20', '3-22', '3-23', '3-5', '3-7', '3-6', '3-8', '3-13', '3-12', '3-10', '3-15', '3-14', '3-17', '3-16', '3-19', '3-18', '4-0', '5-0', '6-20', '6-21', '6-22', '6-1', '6-0', '6-3', '6-2', '6-5', '6-4', '6-7', '6-6', '6-9', '6-8', '6-11', '6-10', '6-13', '6-12', '6-15', '6-14', '6-17', '6-16', '6-19', '6-18', '7-2', '8-17', '8-18', '8-2', '9-34', '9-23', '9-24', '9-26', '9-20', '9-21', '9-3', '9-2', '9-4', '9-9', '9-12', '9-11', '9-15', '9-16', '9-19', '9-31', '9-36', '9-18', '10-27', '10-2', '10-8', '10-13', '10-11', '10-22', '12-1', '12-0', '12-3', '12-2', '13-11', '13-10', '13-13', '13-12', '13-14', '13-1', '13-0', '13-3', '13-2', '13-5', '13-4', '13-7', '13-6', '13-9', '13-8', '15-11', '15-10', '15-13', '15-12', '15-14', '15-1', '15-0', '15-3', '15-2', '15-5', '15-4', '15-7', '15-6', '15-9', '15-8', '16-11', '16-12', '16-8', '17-0', '19-42', '19-12', '19-11', '19-10', '20-1', '20-0', '20-3', '20-2', '20-5', '20-4', '20-7', '20-6', '22-1', '22-3', '22-2', '22-5', '22-4', '22-7', '22-6', '22-9', '22-8', '22-10', '22-12', '23-11', '23-2', '23-8', '25-19'];
  }

  module = (id) => {
    let module = {
      id,
    };
    Object.values(Modules).forEach((item) => {
      if (item.id === id) {
        module = item;
      }
    });
    return module;
  }

  isAbandon = (id) => {
    return this.abandonIds().indexOf(id) > -1 ? true : false;
  }
  // 生成角色与权限相关的表格columns数据(角色是否开启相应权限)x轴为权限
  createColumns = () => {
    // 获取所有模块的key
    const modulesKey = Object.keys(Modules);
    // 获取module组装后的column
    const mapColumn = modulesKey.map((key) => {
      const item = Modules[key];
      return {
        title: `${item.title}(${item.id})`,
        dataIndex: item.id,
        key: item.id,
        width: 170,
        render: text => (text
          // ? <CheckCircleTwoTone twoToneColor="#52c41a" className={styles['app-comp-admin-developer-icon-size']} />
          // : <CloseCircleTwoTone twoToneColor="#f5222d" className={styles['app-comp-admin-developer-icon-size']} />
          ? '√'
          : ''
        ),
      };
    });
    // 生成首列column
    const firstColumn = [{
      title: '角色',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 100,
      fixed: 'left',
      render: text => (text ? text : '--'),
    }];
    // 组装并返回数据
    return [...firstColumn, ...mapColumn];
  }
  // 生成角色与权限相关表格数据(角色是否开启相应权限)x轴为权限
  createTableData = () => {
    const { permissions } = this.props;
    const tableData = permissions.map((key) => {
      const item = {
        roleName: key.name,
      };

      if (key.permission_class && key.permission_class.length > 0) {
        key.permission_class.map((j) => {
          item[j.id] = true;
        });
      }
      return item;
    });
    return tableData;
  }

  // 生成角色与权限相关的表格columns数据(角色是否开启相应权限)x轴为角色
  createColumnsRevert = () => {
    const { roles = [] } = this.props;
    const columnsData = [];
    roles.map((k) => {
      // 可用状态
      if (k.available === 1) {
        columnsData.push({
          title: k.name,
          dataIndex: `${k.gid}`,
          key: `${k.gid}`,
          width: 120,
          render: text => (text ? '√' : ''),
        });
      }
    });
    const headerColumn = {
      title: '权限名称',
      dataIndex: 'authorName',
      key: 'authorName',
      fixed: 'left',
      width: 170,
    };
    return [headerColumn, ...columnsData];
  }
  // 生成角色与权限相关表格数据(角色是否开启相应权限)x轴为角色
  createTableDataRevert = () => {
    const { permissions = [] } = this.props;
    // 获取所有模块的key
    const modulesKey = Object.keys(Modules);
    // 获取module组装后的column
    const mapColumn = modulesKey.map((key) => {
      const item = Modules[key];
      const obj = {
        authorName: `${item.title}(${item.id})`,
      };
      permissions.map((j) => {
        if (j.permission_class && j.permission_class.length > 0) {
          j.permission_class.map((k) => {
            if (item.id === k.id) {
              obj[`${j.gid}`] = true;
            }
          });
        }
      });
      return obj;
    });
    return mapColumn;
  }

  // 遍历节点数据，生成antd table可以识别的子父级关系
  iteration = (data) => {
    return data.map((item) => {
      const module = item.module;
      const routes = item.routes;

      // 子权限
      let children = [];
      if (routes) {
        children = this.iteration(routes);
      }

      // 判断节点数据是否为空
      if (is.not.empty(children)) {
        module.children = children;
        return module;
      }

      return module;
    });
  }

  // 遍历节点数据，生成antd table可以识别的子父级关系
  iterationAuth = (data, level = 1) => {
    return data.map((item) => {
      const routes = item.leaf; // 子节点
      const module = item.node; // 当前节点
      module.level = level;     // 节点级别

      // 子权限
      let children = [];
      if (routes) {
        children = this.iterationAuth(routes, level + 1);
      }

      // 判断节点数据是否为空
      if (is.not.empty(children)) {
        module.children = children;
        return module;
      }

      return module;
    });
  }

  // 渲染权限模块检查
  renderAuthCheck = () => {
    const data = this.abandonIds().map(id => this.module(id));

    const columns = [{
      title: '权限名称',
      dataIndex: 'title',
      key: 'title',
    }, {
      title: '权限id',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '权限key',
      dataIndex: 'key',
      key: 'key',
    }];

    return (
      <CoreContent title="废弃模块" style={{ backgroundColor: '#FAFAFA' }}>
        <Table columns={columns} dataSource={data} pagination={false} defaultExpandAllRows size="small" bordered className={styles['app-comp-admin-developer-table']} />
      </CoreContent>
    );
  }

  // 渲染权限
  renderAuthTree = () => {
    const columns = [{
      title: '权限名称',
      dataIndex: 'title',
      key: 'title',
    }, {
      title: '权限级别',
      dataIndex: 'level',
      key: 'level',
    }, {
      title: '权限定义',
      dataIndex: 'description',
      key: 'description',
    }, {
      title: '权限key',
      dataIndex: 'key',
      key: 'key',
    }, {
      title: '包含模块',
      dataIndex: 'modules',
      key: 'modules',
      render: (modules = []) => {
        if (is.empty(modules)) {
          return <span className={styles['app-comp-admin-developer-no-auth']}>未添加模块权限</span>;
        }

        return modules.map((module, index) => {
          const type = (record) => {
            if (this.isAbandon(record.id)) {
              return <span style={{ color: 'red' }}>废弃</span>;
            }
            if (record.isPage) {
              return '页面';
            }
            if (record.isMenu) {
              return '菜单';
            }
            if (record.isOperate) {
              return '操作';
            }
          };

          // 判断id是否是xxx
          let id = module.id;
          if (module.id === 'xxx') {
            id = <span className={styles['app-comp-admin-developer-no-auth']}>{module.id}</span>;
          }
          return (
            <div key={index}>
              <span>{module.title}({type(module)}) / {id} / {module.key} </span>
            </div>
          );
        });
      },
    }];
    const data = this.iterationAuth(AuthTree, 1);

    return (
      <CoreContent title="权限树" style={{ backgroundColor: '#FAFAFA' }}>
        <Table columns={columns} dataSource={data} pagination={false} defaultExpandAllRows size="small" bordered className={styles['app-comp-admin-developer-table']} />
      </CoreContent>
    );
  }

  // 导航栏菜单
  renderNavigation = () => {
    const columns = [{
      title: '模块名称',
      dataIndex: 'title',
      key: 'title',
      // TODO: 根据角色判断权限是否能够访问
      // render: (text, module) => {
      //   let title = text;
      //   if (authorize.canAccess(module.path) !== true) {
      //     title = <span style={{ color: '#CCCCCC' }}>{title}</span>;
      //   } else {
      //     title = <span style={{ color: '#14D6A6' }}>{title}</span>;
      //   }
      //   return title;
      // },
    }, {
      title: '权限id',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '访问路径',
      dataIndex: 'path',
      key: 'path',
    }, {
      title: '模块key',
      dataIndex: 'key',
      key: 'key',
    }];
    const data = this.iteration(Navigation);

    return (
      <CoreContent title="菜单树" style={{ backgroundColor: '#FAFAFA' }}>
        <Table columns={columns} dataSource={data} pagination={false} defaultExpandAllRows size="small" bordered className={styles['app-comp-admin-developer-table']} />
      </CoreContent>
    );
  }

  // 渲染模块定义
  renderModules = () => {
    // 获取权限设置中的模块
    let modules = [];
    Object.values(AuthNodes).forEach((item) => {
      modules = modules.concat(item.modules);
    });
    const moduleIds = modules.map(module => module.id);

    // 获取模块列表中的模块
    const dataSource = Object.keys(Modules).map((key) => {
      return Modules[key];
    });

    // 获取授权id重复的模块
    const keys = [];
    const repeat = [];
    Object.values(Modules).forEach((module) => {
      if (!keys[module.id]) {
        keys[module.id] = 1;
      } else {
        // 重复数据
        repeat.push(module.id);
      }
    });

    const columns = [{
      title: '模块名称',
      dataIndex: 'title',
      key: 'title',
      render: (title, module) => {
        // 判断未添加到权限中的模块，显示为红色
        if (moduleIds.indexOf(module.id) === -1) {
          return (
            <span className={styles.bossDeveloperNoAuth}>
              {title} <span style={{ color: 'red' }}>(未添加到权限)</span>
            </span>
          );
        }
        // 判断授权id重复或错误的模块，显示为黄色
        if (repeat.indexOf(module.id) !== -1) {
          return <span className={styles['app-comp-admin-developer-id-fault']}>{title} (授权id重复或错误)</span>;
        }
        return <span>{title}</span>;
      },
    }, {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type, record) => {
        if (this.isAbandon(record.id)) {
          return <span style={{ color: 'red' }}>废弃</span>;
        }
        if (record.isPage) {
          return '页面';
        }
        if (record.isMenu) {
          return '菜单';
        }
        if (record.isOperate) {
          return '操作';
        }
      },
    }, {
      title: '权限id',
      dataIndex: 'id',
      key: 'id',
      render: (text) => {
        // 判断未添加权限id的模块，显示为
        if (text === 'xxx') {
          return <span className={styles['app-comp-admin-developer-not-add-auth']}>{text}</span>;
        }
        return <span>{text}</span>;
      },
    }, {
      title: '访问路径',
      dataIndex: 'path',
      key: 'path',
      render: (path, record) => {
        const breadcrumb = Router.breadcrumbByPath(`${path}`);

        // 判断未添加路径归属的模块，显示为
        if (record.isPage && is.empty(breadcrumb)) {
          return <span className={styles['app-comp-admin-developer-not-add-auth']}>导航未配置归属（无面包屑）</span>;
        }

        return <BreadCrumb breadcrumb={breadcrumb} />;
      },
    }, {
      title: '模块key',
      dataIndex: 'key',
      key: 'key',
    }];

    return (
      <CoreContent title="模块定义" style={{ backgroundColor: '#FAFAFA' }} >
        <Table dataSource={dataSource} columns={columns} pagination={false} defaultExpandAllRows size="small" bordered className={styles['app-comp-admin-developer-table']} />
      </CoreContent>
    );
  }

  // 渲染角色与权限的关系表格
  renderMapRoleToAuthor = () => {
    const columns = this.createColumns();
    const data = this.createTableData();
    return (<Table
      columns={columns}
      dataSource={data}
      scroll={{ x: 20000, y: 1500 }}
      bordered
      // pagination={false}
    />);
  }
  // 渲染权限与角色的管理表格
  renderMapAuthorToRole = () => {
    const columns = this.createColumnsRevert();
    const data = this.createTableDataRevert();
    return (<Table
      columns={columns}
      dataSource={data}
      bordered
      scroll={{ x: 12000 }}
      // pagination={false}
    />);
  }


  render() {
    return (
      <div>
        {/* 渲染权限检查 */}
        {this.renderAuthCheck()}

        {/* 渲染权限树 */}
        {this.renderAuthTree()}

        {/* 渲染菜单树 */}
        {this.renderNavigation()}

        {/* 渲染模块信息 */}
        {this.renderModules()}

        {/* 渲染角色已开启权限的信息x轴为权限 */}
        {/* { this.renderMapRoleToAuthor() } */}

        {/* 渲染角色已开启权限的信息x轴为角色 */}
        {/* { this.renderMapAuthorToRole() } */}
      </div>
    );
  }
}
function mapStateToProps({ adminManage: { permissions, roles } }) {
  return { permissions, roles };
}

export default connect(mapStateToProps)(System);
