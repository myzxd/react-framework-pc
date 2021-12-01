/**
 * 默认环境配置文件
 */

const config = {
  AccessKey: '',
  SecretKey: '',
  ApiV1: '',
  ApiV2: '',
  // 是否是线上模式。默认为true
  isRelease: true,
  // 是否允许调试模式，默认为false
  EnableDebugMode: false,
  // 系统标示符号
  SystemIdentifier: '',
  // 是否是路演模式，默认为false
  isRoadshowMode: false,
  // 是否显示趣活logo，默认false
  isShowQuhuoLogo: false,
  // 是否显示兴达log，默认false
  isShowXingDaLogo: false,
  // 是否显示汇流log，默认false
  isShowHuiLiuLogo: false,
  // 判断是否显示成员信息监控按钮, 默认false（该功能只给boss老板使用）
  isMonitorshowMode: false,
  // 是否展示导航栏菜单项目，默认false（该功能只给趣活使用）
  isShowNavigationMenu: false,
  // 是否展示客服聊天窗口
  isShowClientService: false,
  // 聊天服务配置参数
  ClientServiceChatId: false,
  // 聊天服务配置域名
  ClientServiceDomainId: false,
  // 帮助中心文档地址
  ClientServiceHelpCenter: false,
  // 隐藏超管模块的账号
  // 数据格式：[{ role: '角色名称', name: '姓名', phone: 手机号 }]
  hide_administrators_module_account: [],
  // 导航栏的数据格式，默认host+path，如果有url，则直接使用url作为链接
  navigationMenuData: [],
};

export default window.application && window.application.config !== undefined ? window.application.config : config;
