/**
 * 组织架构 - 部门管理 - 业务信息Tab - content组件
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Tag, Collapse } from 'antd';

import { CoreContent } from '../../../../../components/core';
import { OrganizationTeamType, ExpenseCostCenterType } from '../../../../../application/define';
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
      platform_names: platform = [],
      supplier_list: suppler = [],
      city_names: city = [],
      cost_center_type: costCenter = undefined,
    } = data;

    // platform
    const platformForm = (
      <div>
        {
          platform.map((item, key) => {
            return <Tag key={key} style={{ margin: '4px', background: '#F5F5F5' }}>{item}</Tag>;
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
            return <Tag key={key} style={{ margin: '4px', background: '#F5F5F5' }}>{item}</Tag>;
          })
        }
      </div>
    );

    return (
      <CoreContent title={'部门成本中心'} style={{ backgroundColor: 'white' }}>
        <Collapse bordered={false} expandIconPosition="right" className={style['app-organization-busines-tag']} activeKey={['1', '2', '3', '4']}>
          <Panel key="4" header="成本类型" className={style['site-collapse-custom-panel']} showArrow={false}>
            <div>
              {
                costCenter ?
                  <Tag style={{ margin: '4px', background: '#F5F5F5' }}>{ExpenseCostCenterType.description(costCenter)}</Tag> :
                  null
              }
            </div>

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
      </CoreContent>
    );
  }

  // 团队属性
  renderTeamAttributes = () => {
    const { data = {} } = this.props;

    const { team_attrs: team = [] } = data;
    return (
      <CoreContent title={'团队类型属性'} style={{ backgroundColor: 'white' }}>
        {
          team.map((item, key) => {
            return <Tag key={key} style={{ margin: '4px', background: '#F5F5F5' }}>{OrganizationTeamType.description(item)}</Tag>;
          })
        }
      </CoreContent>
    );
  }

  // 自定义属性
  renderCustomizeAttributes = () => {
    const { data = {} } = this.props;

    const { custom_attrs: customize = [] } = data;
    return (
      <CoreContent title={'自定义属性标签'} style={{ backgroundColor: 'white' }}>
        {
          customize && customize.length > 0
            ?
            customize.map((item, key) => {
              return (
                <Tag key={key} style={{ margin: '4px', background: '#F5F5F5' }}>{item}</Tag>
              );
            })
            : null
        }
      </CoreContent>
    );
  }

  // content
  renderContent = () => {
    const titleExt = Operate.canOperateOrganizationManageAttributesUpdate() ?
      (<a type="primary" onClick={this.onUpdate}>编辑</a>)
      : null;

    return (
      <CoreContent title="业务信息列表" titleExt={titleExt}>
        {this.renderSystemAttributes()}
        {this.renderTeamAttributes()}
        {this.renderCustomizeAttributes()}
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
  onChangeType: () => { },
};

export default Content;
