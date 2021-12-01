/**
 * 布局的header
 **/
import is from 'is_js';
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import React, { useState } from 'react';

import {
  CaretDownOutlined,
  CaretUpOutlined,
  CheckCircleOutlined,
  DownOutlined,
  LogoutOutlined,
  ScheduleOutlined,
  TeamOutlined,
  UserOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

import { Menu, Row, Col, Popover, message, Avatar, Dropdown, Button, Tooltip } from 'antd';

import styles from './header.css';
import user from './static/avatar.png';

import { authorize, system, config } from '../../application';

import TaskRecordsWidget from './widgets/task';
import QrCodePop from './widgets/qrcode';
import Logo from './logo';

// 获取菜单栏配置数据
const menuData = dot.get(config, 'navigationMenuData', []);
function Header(props) {
  const { androidAppInfo, bossAppInfo, bossHomeAppInfo } = props;
  // 是否展开菜单栏
  const [isExpandNavigationMenu, setIsExpandNavigationMenu] = useState(false);
  // 是否重置下载任务的页码为1
  const [resetDownloadPage, setResetDownloadPage] = useState(false);

  const privates = {
    triggerDebugModeCount: 0,  // 触发测试模式的开关计数
  };

  // 触发调试模式，显示所有功能
  const onOpenDebugMode = () => {
    // 取消冒泡
    window.event.stopPropagation();
    // 判断是否允许使用调试模式，如果不允许使用，则无法点击
    if (dot.get(config, 'EnableDebugMode') !== true) {
      return;
    }

    privates.triggerDebugModeCount += 1;
    if (privates.triggerDebugModeCount < 3) {
      return;
    }
    // 自动设置调试模式开关，开启调试模式
    system.debugToken = system.debugModeToken();
    message.success('开启调试模式，3秒后刷新页面', 3);
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  // 关闭调试模式
  const onCloseDebugMode = () => {
    // 取消冒泡
    window.event.stopPropagation();
    // 判断是否允许使用调试模式，如果不允许使用，则无法点击
    if (dot.get(config, 'EnableDebugMode') !== true) {
      return;
    }

    // 关闭调试模式
    if (system.isDebugMode() === true) {
      system.debugToken = '';
      message.success('关闭调试模式，3秒后刷新页面', 3);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  // 是否展示导航栏菜单
  const onChangeNavigationMenuExpand = () => {
    setIsExpandNavigationMenu(!isExpandNavigationMenu);
  };

  // 切换账号
  const onChangeAccount = (accountId) => {
    props.dispatch({ type: 'authorizeManage/exchangeAuthorize', payload: { accountId } });
  };

  // 注销用户
  const onClickLogout = () => {
    props.dispatch({ type: 'authorizeManage/loginClear', payload: '' });
  };

  // 跳转到数据中台
  const onRedirectToDatahub = (domain, route = '') => {
    props.dispatch({ type: 'authorizeManage/redirectToDatahub', payload: { domain, route } });
    onChangeNavigationMenuExpand();
  };

  // 展示boss骑士、boss当家、boss之家安卓客户端下载二维码
  const onShowAndroidAppQrCode = () => {
    props.dispatch({ type: 'applicationSetting/fetchAndroidAppInfo', payload: '' });   // 骑士
    props.dispatch({ type: 'applicationSetting/fetchBossAppInfo', payload: '' });      // 当家
    props.dispatch({ type: 'applicationSetting/fetchBossHomeAppInfo', payload: '' });  // 之家
  };

  // 下载框是否显示的属性变更回调
  const onVisibleChange = (e) => {
    // 如果显示弹窗，则获取下载数据
    if (e) {
      // 每次重新打开，取消页码重置
      setResetDownloadPage(false);
      props.dispatch({ type: 'SystemDownloadModal/fetchDownloadRecords' });
    } else {
      // 每次关闭，下载任务页码重置为1
      setResetDownloadPage(true);
    }
  };

  // 停止点击事件穿透
  const onStopClick = (e) => {
    e.stopPropagation();
  };

  // 渲染趣活logo或者嗷嗷BOSS logo
  const renderLogo = () => {
    if (window.application.config.isShowQuhuoLogo) {
      return (
        <div
          className={styles['app-header-title-quhuo']}
          onClick={() => (window.location.href = '/#/Code/Home')}
        >
          <span onClick={onOpenDebugMode}>B</span>OS<span onClick={onCloseDebugMode}>S</span>之家
        </div>
      );
    } else if (window.application.config.isShowHuiLiuLogo) {
      return (
        <React.Fragment />
      );
    } else {
      return (
        <div
          className={styles['app-header-title-aoao']}
          onClick={() => (window.location.href = '/#/Code/Home')}
        >
          嗷嗷B<span onClick={onOpenDebugMode}>O</span>S<span onClick={onCloseDebugMode}>S</span>系统
        </div>
      );
    }
  };

  // 渲染标题信息
  const renderHeaderModeInfo = () => {
    return (
      <div>

        {/* 渲染趣活logo或者嗷嗷BOSS logo*/}

        {renderLogo() }

        {/* 判断是否是开发测试环境 */}
        {
          (dot.get(config, 'EnableDebugMode') === true && config.isRelease === false) ? <div className={styles['app-header-title-beta']}>测试系统</div> : ''
        }
        {
          (dot.get(config, 'EnableDebugMode') === true && system.isDebugMode()) ? <div className={styles['app-header-title-beta']}>调试模式</div> : ''
        }
      </div>
    );
  };

  // 渲染导航栏菜单
  const renderNavigationMenu = () => {
    // 判断是否展示导航栏菜单项目，如果不允许使用，则不显示
    if (dot.get(config, 'isShowNavigationMenu') !== true || is.empty(menuData) || is.not.existy(config) || is.not.existy(menuData)) {
      return;
    }

    if (isExpandNavigationMenu) {
      return (
        <div className={styles['app-nav-menu-active']}>
          <span className={styles['app-nav-menu-button-active']} onClick={onChangeNavigationMenuExpand}>
              产品与服务&nbsp;<CaretUpOutlined style={{ color: 'rgba(253,120,0,0.6)' }} />
          </span>
        </div>
      );
    }

    return (
      <div className={styles['app-nav-menu']}>
        <span className={styles['app-nav-menu-button']} onClick={onChangeNavigationMenuExpand}>
            产品与服务&nbsp;<CaretDownOutlined style={{ color: 'rgba(255,255,255,0.6)' }} />
        </span>
      </div>
    );
  };

  // 渲染账号切换
  const renderAccountSelector = () => {
    const accounts = authorize.account.exchangeAccounts || [];

    // 判断团队数据
    if (is.empty(accounts) || is.not.existy(accounts)) {
      return (
        <Menu.Item disabled>
          <TeamOutlined /><span className={styles['app-header-account-selector-text']}>暂无可切换账号</span>
        </Menu.Item>
      );
    }

    const menus = [];

    accounts.forEach((account) => {
      const accountId = account.id;
      const accountName = `${account.name}`;

      const roleNames = account.roleNames || [];
      const TooltipTitle = roleNames.join(', ');

      // 账号信息
      if (authorize.account.id === accountId) {
        menus.push(
          <Menu.Item key={accountId} disabled className={styles['app-header-account-selector-info-text']}>
            <CheckCircleOutlined />
            <Tooltip title={TooltipTitle} placement="right" >
              {accountName}
            </Tooltip>
          </Menu.Item>,
        );
      } else {
        menus.push(
          <Menu.Item key={accountId} className={styles['app-header-account-selector-info-background']} onClick={() => { onChangeAccount(accountId); }}>
            <UserOutlined />
            <Tooltip title={TooltipTitle} placement="right" >
              {accountName}
            </Tooltip>
          </Menu.Item>,
        );
      }
    });

    return (
      <Menu.ItemGroup
        title={
          <div className={styles['app-header-account-selector-info']}>
            <TeamOutlined /><span>切换账号</span></div>}
      >
        {menus}
      </Menu.ItemGroup>
    );
  };

  // 渲染下拉菜单
  const renderDropDownMenu = () => {
    const menu = (
      <Menu>
        {/* 渲染账号切换 */}
        {renderAccountSelector()}

        <Menu.Divider />
        <Menu.Item>
          <a onClick={onClickLogout} className={styles['app-header-down-menu-click']}>
            <LogoutOutlined /><span className={styles['app-header-down-menu-exit']}>退出系统</span>
          </a>
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu} placement="bottomCenter">
        <a className="ant-dropdown-link" rel="noopener noreferrer">
          <Avatar size={32} src={user} />
          <span className={styles['app-header-down-menu-user-failure']}>
            {`${authorize.account.name}` || '用户名获取失败'}
          </span>
          <DownOutlined className={styles['app-header-down-menu-user-failure-icon']} />
        </a>
      </Dropdown>
    );
  };

  // 渲染系统切换
  const renderSystemSwitch = () => {
    // 判断是否允许使用调试模式，如果不允许使用，则无法点击
    if (dot.get(config, 'isRoadshowMode') === true) {
      return (
        <div style={{ float: 'right', marginRight: '40px' }}>
          <Button type="primary" className={styles['app-header-system-switch-button']}>之家</Button>
          <Button onClick={() => { onRedirectToDatahub('private-center'); }}>经营罗盘</Button>
        </div>
      );
    }
  };

  // 渲染二维码
  const renderQRCode = () => {
    const qrCodePopProps = {
      qrStr: androidAppInfo.apk_url || '',
      qcStr: bossAppInfo.apk_url || '',
      qlStr: bossHomeAppInfo.apk_url || '',
      onShow: onShowAndroidAppQrCode,
    };
    return (
      <div className={styles['app-header-qr-code']}>
        <QrCodePop {...qrCodePopProps} />
      </div>
    );
  };

  // 渲染任务列表
  const renderTaskList = () => {
    return (
      <div className={styles['app-header-task-list']}>
        <Popover title="任务列表" placement="bottomRight" trigger="click" onVisibleChange={onVisibleChange} content={<TaskRecordsWidget resetPage={resetDownloadPage} />}>
          <ScheduleOutlined />
        </Popover>
      </div>
    );
  };

  // 渲染帮助中心
  const renderHelpCenter = () => {
    // 获取配置好的帮助中心链接
    const url = dot.get(config, 'ClientServiceHelpCenter');
    if (is.not.existy(url) || is.empty(url)) {
      return '';
    }

    return (
      <div>
        <div className={styles['app-header-help-center']}>
          <a href={url} target="_blank" rel="noopener noreferrer"><QuestionCircleOutlined /></a>
        </div>
      </div>
    );
  };

  // 渲染菜单列表
  const renderMenuList = ({ title, host, links }) => {
    return (
      <div>
        <div className={styles['app-nav-menu-title']}>{title}</div>
        {
          links && links.map((link, index) => {
            // 标题
            const linkTitle = dot.get(link, 'title');

            // 如果设置了route，则直接使用route请求后跳转
            if (dot.has(link, 'route') && dot.has(link, 'domain')) {
              const route = dot.get(link, 'route');
              const domain = dot.get(link, 'domain');
              return <div className={styles['app-nav-menu-link']} key={`menu-link-${index}`}><a onClick={() => { onRedirectToDatahub(domain, route); }}>{linkTitle}</a></div>;
            }

            if (dot.has(link, 'path')) {
              // 默认拼装路径进行跳转
              const linkURL = `${host}${dot.get(link, 'path')}`;
              return <div className={styles['app-nav-menu-link']} key={`menu-link-${index}`}><a href={linkURL} onClick={onChangeNavigationMenuExpand} rel="noopener noreferrer">{linkTitle}</a></div>;
            }

            // 配置错误
            return '--';
          })
        }
      </div>
    );
  };

  // 渲染导航菜单内容
  const renderNavigationMenuContent = () => {
    // 判断是否展示导航栏菜单项目，如果不允许使用，则不显示
    if (dot.get(config, 'isShowNavigationMenu') !== true) {
      return;
    }

    // 判断，如果菜单栏数据为空，则不显示
    if (is.empty(menuData)) {
      return;
    }

    // 菜单组内容
    const menuContent = menuData.map(({ title, group = [] }) => {
      // 菜单内容
      const menuItems = group.map((menu, index) => {
        return <Col span={3} key={`menu-item-${index}`}>{renderMenuList(menu)}</Col>;
      });
      return (
        <div className={styles['app-nav-menu-group']} key={`menu-group-${title}`}>
          <div className={styles['app-nav-menu-group-title']}>{title}</div>
          <div className={styles['app-nav-menu-group-content']}>
            <Row gutter={[48, 16]}>
              {menuItems}
            </Row>
          </div>
        </div>
      );
    });

    return (
      <div className={styles['app-nav-menu-container']} onClick={onChangeNavigationMenuExpand}>
        <div className={styles['app-nav-menu-content-container']} onClick={onStopClick}>{menuContent}</div>
      </div>
    );
  };

  return (
    <header className={styles['app-header-box']}>
      <div style={{ width: '180px', float: 'left' }}><Logo /></div>

      {/* 渲染标题相关的系统信息 */}
      {renderHeaderModeInfo()}

      <Row type="flex" justify="end" align="middle">
        <Col span={24}>
          {/* 渲染导航菜单栏 */}
          {renderNavigationMenu()}

          {/* 操作菜单栏 */}
          <div className={styles['app-header-drop-down-menu']}>{renderDropDownMenu()}</div>

          {/* 渲染平台切换 */}
          {renderSystemSwitch()}

          {/* 渲染二维码 */}
          {renderQRCode()}

          {/* 渲染成员信息监控按钮 */}
          {renderTaskList()}

          {/* 渲染帮助中心 */}
          {renderHelpCenter()}
        </Col>
      </Row>

      { isExpandNavigationMenu !== true ? '' : renderNavigationMenuContent()}
    </header>
  );
}
Header.defaultProps = {
  androidAppInfo: {},
  bossAppInfo: {},
  bossHomeAppInfo: {},
};

Header.propTypes = {
  androidAppInfo: PropTypes.object,  // boss骑士安卓app信息
  bossAppInfo: PropTypes.object,     // boss当家安卓app信息
  bossHomeAppInfo: PropTypes.object, // boss之家安卓app信息
};


function mapStateToProps({ applicationSetting: { androidAppInfo, bossAppInfo, bossHomeAppInfo } }) {
  return { androidAppInfo, bossAppInfo, bossHomeAppInfo };
}

export default connect(mapStateToProps)(Header);
