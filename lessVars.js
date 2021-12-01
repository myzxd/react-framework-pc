/**
 * 自定义主题文件
 */

const colors = {
  orange: '#FF7700',
  navOrange: 'rgba(255, 119, 0, 0.5)',
};

// eslint-disable-next-line import/no-commonjs
module.exports = {
  '@primary-color': colors.orange,
  // Switch
  '@switch-color': colors.orange,
  // Tab
  '@tabs-card-active-color': colors.orange,
  '@tabs-ink-bar-color': colors.orange,
  '@tabs-highlight-color': colors.orange,
  '@tabs-hover-color': colors.orange,
  '@tabs-active-color': colors.orange,
  // Menu
  '@menu-dark-item-active-bg': colors.navOrange,
  // Table
  '@table-padding-horizontal': '8px',
  // font
  '@font-size-base': '12px',
  '@font-family': '"PingFang SC", "Helvetica Neue For Number", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"',
};
