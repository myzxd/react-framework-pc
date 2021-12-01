/**
 * 组织架构 - 部门管理 - 岗位编制 - 设置岗位数据权限范围设置弹框
 */
import is from 'is_js';
import dot from 'dot-prop';
import React from 'react';
import PropTypes from 'prop-types';
import { Empty, Tag, Button } from 'antd';
import Drawer from 'antd/lib/drawer';

import { DeprecatedCoreForm } from '../../../../../../components/core';
import { OrganizationBizLabelType } from '../../../../../../application/define';
import { utils } from '../../../../../../application';

import style from '../index.less';

const CheckableTag = Tag.CheckableTag;
// 全选
const enableSelectAll = { 全选: '全选' };

const OperateType = {
  create: 10,
  update: 20,
};

class Index extends React.Component {
  static getDerivedStateFromProps(props, state) {
    const { staffBusinessTag = {} } = props;
    const { organStaffTag } = state;
    const { businessTag = {} } = props;
    const bizDataBusiness = staffBusinessTag.biz_data_business || {};
    const bizDataBusinessInfo = businessTag.biz_data_business_info || {};
    const {
      platform_codes: platform = [],
      supplier_ids: supplier = [],
      city_codes: city = [],
    } = bizDataBusiness;
    const {
      city_list: cityList = [],
    } = bizDataBusinessInfo;
    const cityCodes = cityList.map(v => Object.keys(v)[0]);
    if (Object.keys(organStaffTag).length !== Object.keys(bizDataBusiness).length) {
      let cityCodeList = city;
        // 判断是否相等,相等添加全选
      if (city.length === cityCodes.length) {
        cityCodeList = [Object.keys(enableSelectAll)[0], ...city];
      }
      return {
        selectPlatformTags: platform,
        selectSupplierTags: supplier,
        selectCityTags: cityCodeList,
        organStaffTag: bizDataBusiness,
      };
    }

    return null;
  }

  constructor(props) {
    super(props);
    const staffBusinessTag = dot.get(props, 'staffBusinessTag', {});
    const { businessTag = {} } = props;
    const bizDataBusiness = staffBusinessTag.biz_data_business || {};
    const bizDataBusinessInfo = businessTag.biz_data_business_info || {};
    const city = bizDataBusiness.city_codes || [];
    let selectCityTags = city;
    const {
      city_list: cityList = [],
    } = bizDataBusinessInfo;
    const cityCodes = cityList.map(v => Object.keys(v)[0]).filter(v => v !== Object.keys(enableSelectAll)[0]);
        // 判断是否相等,相等添加全选
    if (city.length === cityCodes.length) {
      selectCityTags = [Object.keys(enableSelectAll)[0], ...city];
    }
    this.state = {
      selectPlatformTags: bizDataBusiness.platform_codes || [], // 选中的平台Tag
      selectSupplierTags: bizDataBusiness.supplier_ids || [], // 选中的供应商Tag
      selectCityTags, // 选中的城市Tag
      organStaffTag: bizDataBusiness || {},
    };
    this.private = {
      isSubmit: true, // 防止多次提交
      isInitial: true, // 判断是否是初始渲染
    };
  }

  // platform tag check
  onChange = (tag, checked, type) => {
    const { selectPlatformTags, selectSupplierTags, selectCityTags } = this.state;
    const { businessTag = {} } = this.props;
    const bizDataBusinessInfo = businessTag.biz_data_business_info || {};
    const {
      city_list: cityList = [],
    } = bizDataBusinessInfo;
    const cityCodes = cityList.map(item => Object.keys(item)[0]);
    let nextSelectedTags = [];
    // 平台
    type === 'platform' && (nextSelectedTags = checked ? [...selectPlatformTags, tag] : selectPlatformTags.filter(t => t !== tag)) && (this.setState({ selectPlatformTags: nextSelectedTags }));
    // 供应商
    type === 'supplier' && (nextSelectedTags = checked ? [...selectSupplierTags, tag] : selectSupplierTags.filter(t => t !== tag)) && (this.setState({ selectSupplierTags: nextSelectedTags }));
    // 城市
    if (type === 'city' && tag === Object.keys(enableSelectAll)[0]) {
      // 判断是否选中的状态
      if (checked) {
        this.setState({
          selectCityTags: [...cityCodes],
        });
      } else {
        this.setState({ selectCityTags: [] });
      }
    } else if (type === 'city' && tag !== Object.keys(enableSelectAll)[0]) {
      // 判断是否选中的状态
      if (checked) {
        const tags = [...selectCityTags, tag];
        // 数值相等，添加全选
        if (tags.length === cityCodes.length - 1) {
          tags.push(Object.keys(enableSelectAll)[0]);
        }
        this.setState({ selectCityTags: tags });
      } else {
        // 过滤
        const filterTags = selectCityTags.filter(t => t !== tag && t !== Object.keys(enableSelectAll)[0]);
        this.setState({ selectCityTags: filterTags });
      }
    }
  }

  // 提交
  onSubmit = () => {
    const { dispatch, staffId, onSuccessCallback, onFailureCallback, operateType } = this.props;
    // checked tag
    const { selectPlatformTags, selectSupplierTags, selectCityTags } = this.state;
    // 岗位id

    const params = {
      staffId,
      type: OrganizationBizLabelType.four,
      platformCodes: selectPlatformTags,
      supplierIds: selectSupplierTags,
      cityCodes: selectCityTags.filter(v => v !== Object.keys(enableSelectAll)[0]),
      onSuccessCallback,
      onFailureCallback,
    };
    if (this.private.isSubmit) {
      // 新建
      operateType === OperateType.create && dispatch({ type: 'organizationBusiness/createBusinessTag', payload: params });
      // 编辑
      operateType === OperateType.update && dispatch({ type: 'organizationBusiness/updateBusinessTag', payload: params });
    }
    this.private.isSubmit = false;
  }

  // 隐藏
  onCancel = () => {
    const { onCancel } = this.props;
    this.private = {
      isSubmit: true, // 防止多次提交
      isInitial: true, // 判断是否是初始渲染
    };
    onCancel && onCancel();
  }

  // system tag
  renderSystemTag = (tag, name, type) => {
    const { selectPlatformTags, selectCityTags, selectSupplierTags } = this.state;
    let selectedTags = [];
    // 平台
    type === 'platform' && (selectedTags = selectPlatformTags);
    // 供应商
    type === 'supplier' && (selectedTags = selectSupplierTags);
    // 城市 添加全选
    type === 'city' && (selectedTags = selectCityTags);
    return (
      <CheckableTag
        key={tag}
        value={tag}
        checked={selectedTags.indexOf(tag) > -1}
        onChange={checked => this.onChange(tag, checked, type)}
        style={selectedTags.indexOf(tag) > -1 ? null : { border: '1px solid #d9d9d9', backgroundColor: '#fafafa' }}
      >
        {name}
      </CheckableTag>
    );
  }

  // 无数据
  renderEmpty = () => {
    return <Empty />;
  }

  // 系统属性
  renderSystemAttributes = () => {
    const { businessTag = {} } = this.props;
    const bizDataBusinessInfo = businessTag.biz_data_business_info || {};
    const {
      platform_list: platformList = [],
      supplier_list: supplierList = [],
      city_list: cityList = [],
    } = bizDataBusinessInfo;
    // 判断是初始渲染时，城市不为空，添加全选
    if (this.private.isInitial && (is.existy(cityList) && is.not.empty(cityList))) {
      const cityCodes = cityList.map(v => Object.keys(v)[0]);
      if (cityCodes.includes(Object.keys(enableSelectAll)[0]) === false) {
        // 城市添加全选
        cityList.unshift(enableSelectAll);
      }
    }
    // platform
    const platformForm = (
      <div>
        {
          platformList.map((item) => {
            const name = Object.values(item)[0];
            const code = Object.keys(item)[0];
            return this.renderSystemTag(code, name, 'platform');
          })
        }
      </div>
    );

    // supplier
    const supplerForm = (
      <div>
        {
          supplierList.map((item) => {
            const name = Object.values(item)[0];
            const code = Object.keys(item)[0];
            // 平台name
            const platformName = utils.dotOptimal(item, 'platform_info.platform_name', undefined);

            const tagName = platformName ? `${name}（${platformName}）` : name;
            return this.renderSystemTag(code, tagName, 'supplier');
          })
        }
      </div>
    );

    // city
    const cityForm = (
      <div>
        {
          cityList.map((item) => {
            const name = Object.values(item)[0];
            const code = Object.keys(item)[0];
            return this.renderSystemTag(code, name, 'city');
          })
        }
      </div>
    );
    const formItems = [
      {
        label: '平台',
        form: platformForm,
      },
      {
        label: '供应商',
        form: supplerForm || '--',
      },
      {
        label: '城市',
        form: cityForm,
      },
    ];

    const layout = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 21,
      },
    };

    return (
      <div className={style['app-organization-business-modal']}>
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </div>
    );
  }

  renderMadal=() => {
   // 部门下业务信息
    const { visible, businessTag = {} } = this.props;
    const bizDataBusiness = businessTag.biz_data_business || {};

   // 是否显示
    const isShow = Object.keys(bizDataBusiness).length > 0;

   // 是否可操作
    const isOperate = isShow;
    return (
      <Drawer
        title="岗位数据权限范围信息"
        visible={visible}
        onClose={this.onCancel}
        width={700}
        footer={(
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={this.onCancel} style={{ marginRight: 8 }}>
            取消
          </Button>
            <Button disabled={!isOperate} onClick={this.onSubmit} type="primary">
            提交
          </Button>
          </div>
      )}
      >
        {isShow ? this.renderSystemAttributes() : this.renderEmpty()}
      </Drawer>
    );
  }
  // 弹簧
  // renderMadal = () => {
  //   // 部门下业务信息
  //   const { visible, businessTag = {} } = this.props;
  //   const bizDataBusiness = businessTag.biz_data_business || {};

  //   // 是否显示
  //   const isShow = Object.keys(bizDataBusiness).length > 0;

  //   // 是否可操作
  //   const isOperate = isShow;

  //   return (
  //     <Modal
  //       title="岗位数据权限范围信息"
  //       visible={visible}
  //       onOk={this.onSubmit}
  //       onCancel={this.onCancel}
  //       okText="保存"
  //       cancelText="取消"
  //       okButtonProps={{ disabled: !isOperate }}
  //       width={700}
  //     >
  //       {isShow ? this.renderSystemAttributes() : this.renderEmpty()}
  //     </Modal>
  //   );
  // }

  render() {
    return this.renderMadal();
  }
}

Index.propTypes = {
  staffId: PropTypes.string,
  visible: PropTypes.bool,
  dispatch: PropTypes.func,
  operateType: PropTypes.number,
  onCancel: PropTypes.func,
  businessTag: PropTypes.object,
  // staffBusinessTag: PropTypes.object,
  onSuccessCallback: PropTypes.func,
  onFailureCallback: PropTypes.func,
};

Index.defaultProps = {
  staffId: '', // 岗位id
  visible: false, // modal visible
  dispatch: () => {},
  onCancel: () => {}, // 隐藏弹窗
  businessTag: {},
  staffBusinessTag: {},
  operateType: 10, // 操作类型
  onSuccessCallback: () => {},
  onFailureCallback: () => {},
};

export default Index;

