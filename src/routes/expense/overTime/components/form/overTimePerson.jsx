/**
 * 加班人信息编辑组件
 */

import React from 'react';
import PropTypes from 'prop-types';
import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import CascadeCommonSelector from '../../../components/cascadCommonSelector';
import { authorize } from '../../../../../application';

class OverTimePerson extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired, // 上层表单
    detail: PropTypes.object, // 加班单详情
  }

  static defaultProps = {
    detail: {},
  }

  render() {
    // 加班单详情
    const { detail } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      actual_apply_name: actualApplyName = undefined, // 实际加班人name
      platform_code: platform = undefined, // 项目
      city_code: city = undefined, // 城市
      city_spelling: citySpell = undefined, // 城市spell
      biz_district_id: district = undefined, // 团队
    } = detail;

    const formItems = [{
      label: '实际加班人',
      form: getFieldDecorator('actualOverTimePerson', {
        initialValue: actualApplyName || authorize.account.name,
      })(<span>{actualApplyName || authorize.account.name}</span>),
    }];
    return (
      <CoreContent title="加班人信息">
        <DeprecatedCoreForm items={formItems} cols={3} />
        <CascadeCommonSelector
          form={this.props.form}
          platform={platform}
          city={city}
          citySpell={citySpell}
          district={district}
        />
      </CoreContent>
    );
  }

}

export default OverTimePerson;
