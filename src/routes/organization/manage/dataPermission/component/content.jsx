/**
 * 组织架构 - 部门管理 - 数据权限范围Tab - content组件
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Tag, Collapse } from 'antd';

import { CoreContent } from '../../../../../components/core';
import { utils } from '../../../../../application';
import Operate from '../../../../../application/define/operate';
import style from '../index.less';


const { Panel } = Collapse;

// 页面类型
const PageType = {
  detail: 10,
  update: 20,
};

// 操作类型
const OperateType = {
  create: 10,
  update: 20,
};

class Content extends React.Component {
  // update
  onUpdate = () => {
    const { onChangeType } = this.props;
    onChangeType && onChangeType(PageType.update, OperateType.update);
  }

  // 系统属性
  renderSystemAttributes = () => {
    const { data = {} } = this.props;

    const {
      platform_list: platform = [],
      suppliers_with_platform: suppler = [],
      city_list: city = [],
      industry_list: industryList = [],
    } = data;

    // platform
    const platformForm = (
      <div>
        {
          platform.map((item, key) => {
            const name = Object.values(item)[0];
            return <Tag key={key} style={{ margin: '4px', background: '#F5F5F5' }}>{name}</Tag>;
          })
        }
      </div>
    );

    // suppler
    const supplerForm = (
      <div>
        {
          suppler.map((item, key) => {
            const name = Object.values(item)[0];
            // 平台name
            const platformName = utils.dotOptimal(item, 'platform_info.platform_name', undefined);
            return <Tag key={key} style={{ margin: '4px', background: '#F5F5F5' }}>{platformName ? `${name}（${platformName}）` : name}</Tag>;
          })
        }
      </div>
    );

    // city
    const cityForm = (
      <div>
        {
          city.map((item, key) => {
            const name = Object.values(item)[0];
            return <Tag key={key} style={{ margin: '4px', background: '#F5F5F5' }}>{name}</Tag>;
          })
        }
      </div>
    );

    // scense
    const scenseForm = (
      <div>
        {
          industryList.map((item, key) => {
            const name = Object.values(item)[0];
            return <Tag key={key} style={{ margin: '4px', background: '#F5F5F5' }}>{name}</Tag>;
          })
        }
      </div>
    );

    return (
      <Collapse bordered={false} expandIconPosition="right" className={style['app-organization-busines-tag']} activeKey={['1', '2', '3', '4']}>
        <Panel key="4" header="场景" className={style['site-collapse-custom-panel']} showArrow={false}>
          {scenseForm}
        </Panel>
        <Panel key="1" header="平台" className={style['site-collapse-custom-panel']} showArrow={false}>
          {platformForm}
        </Panel>
        <Panel key="2" header="供应商" className={style['site-collapse-custom-panel']} showArrow={false}>
          {supplerForm}
        </Panel>
        <Panel key="3" header="城市" className={style['site-collapse-custom-panel']} showArrow={false}>
          {cityForm}
        </Panel>
      </Collapse>
    );
  }

  // content
  renderContent = () => {
    const titleExt = Operate.canOperateOrganizationManageDataPermissionUpdate() ?
      (<a type="primary" onClick={this.onUpdate}>编辑</a>)
      : null;

    return (
      <CoreContent title="数据权限范围" titleExt={titleExt}>
        {this.renderSystemAttributes()}
      </CoreContent>
    );
  }

  render() {
    return this.renderContent();
  }
}

Content.propTypes = {
  data: PropTypes.object,
  onChangeType: PropTypes.func,
};
Content.defaultProps = {
  data: {},
  onChangeType: () => {},
};

export default Content;
