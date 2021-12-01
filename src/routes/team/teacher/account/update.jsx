/**
 * 私教管理 - 私教账户 - 编辑私教账户
 */
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button } from 'antd';
import React, { Component } from 'react';

import { CoreContent, DeprecatedCoreForm } from '../../../../components/core';

import SelectTeachTeam from './components/selectTeachTeam';
import ScopeCard from './components/scopeCard';
import ChangeList from './components/changeList';
import styles from './style/index.less';

class Index extends Component {
  static propTypes = {
    teamAccountDetail: PropTypes.object, // 私教账户详情
  }

  static defaultProps = {
    teamAccountDetail: {},
  }

  // 当teamAccountDetail变化时，更新state
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.teamAccountDetail !== prevState.teamAccountDetail) {
      const {
        biz_district_list: bizDistrictList = [], // 商圈信息列表
      } = nextProps.teamAccountDetail;
      const platforms = [...new Set(bizDistrictList.map(item => item.platform_code))];
      const suppliers = [...new Set(bizDistrictList.map(item => item.supplier_id))];
      const cities = [...new Set(bizDistrictList.map(item => item.city_spelling))];
      return {
        platforms,
        suppliers,
        cities,
        teamAccountDetail: nextProps.teamAccountDetail,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      suppliers: [],  // 供应商
      platforms: [],  // 平台
      cities: [],     // 城市
    };
    this.private = {
      namespace: 'teamAccountUpdate',
    };
  }

  componentDidMount() {
    const { id } = this.props.location.query;
    this.props.dispatch({
      type: 'teamAccount/fetchTeamAccountDetail',
      payload: { id },
    });
  }

  // 更换供应商
  onChangeSuppliers = (e) => {
    const { setFieldsValue } = this.props.form;

    this.setState({
      suppliers: e,
      cities: [],
    });

    // 清空选项
    setFieldsValue({ cities: [], districts: [] });
  }

  // 更换平台
  onChangePlatforms = (e) => {
    const { setFieldsValue } = this.props.form;

    this.setState({
      platforms: e,
      suppliers: [],
      cities: [],
    });

    // 清空选项
    setFieldsValue({ suppliers: [], cities: [], districts: [] });
  }

  // 更换城市
  onChangeCity = (e) => {
    const { setFieldsValue } = this.props.form;

    this.setState({
      cities: e,
    });

    // 清空选项
    setFieldsValue({ districts: [] });
  }

  onGetChangeList = () => {
    const { id } = this.props.location.query;
    const params = { id };
    this.props.dispatch({ type: 'teamAccount/fetchCoachChangeLog', payload: params });
  }

  onSaveTeam = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const { id } = this.props.location.query;
      const { accountName, accountTeam } = values;
      const params = { accountName, accountTeam, id };
      this.props.dispatch({ type: 'teamAccount/fetchCoachSave', payload: params });
    });
  }

  // 成功回调，创建成功后，跳转到列表页
  onSuccessCallback = () => {
    window.location.href = '/#/Team/Teacher/Account';
  }

  // 基础信息
  renderInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const {
      name, // 私教姓名
      coach_account_info: { phone: coachAccountPhone = '' } = {}, // 系统用户
      coach_team_info: coachTeamInfo = [], // 私教团队
    } = this.props.teamAccountDetail;
    const formItems = [
      {
        label: '私教姓名',
        // form: <span>{name || '--'}</span>,
        form: getFieldDecorator('accountName', {
          rules: [{ required: true, message: '请输入私教姓名' }],
          initialValue: name || undefined,
        })(
          <Input
            allowClear
            className={styles['app-comp-team-teacher-width100']}
          />,
        ),
      },
      {
        label: '系统用户',
        form: <span>{coachAccountPhone || '--'}</span>,
      },
      {
        label: '私教团队',
        form: getFieldDecorator('accountTeam', {
          rules: [{ required: true, message: '请选择私教团队' }],
          initialValue: coachTeamInfo.map(item => item._id),
        })(
          <SelectTeachTeam
            allowClear
            showSearch
            mode="multiple"
            showArrow
            placeholder="请选择私教团队"
            optionFilterProp="children"
            className={styles['app-comp-team-teacher-width100']}
          />,
        ),
      },
      {
        form: <Button type="primary" onClick={this.onSaveTeam} className={styles['ap-comp-team-teacher-margin-left']}>保存</Button>,
      },
    ];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <CoreContent title={'私教信息'}>
        <DeprecatedCoreForm items={formItems} cols={4} layout={layout} />
      </CoreContent>
    );
  }

  render() {
    const { id } = this.props.location.query;
    const { form } = this.props;
    return (
      <div>
        {/* 基础信息 */}
        {this.renderInfo()}

        {/* 业务员范围 */}
        <ScopeCard id={id} form={form} onGetChangeList={this.onGetChangeList} />

        {/* 变更记录 */}
        <ChangeList id={id} />

      </div>
    );
  }
}

const mapStateToProps = ({ teamAccount: { teamAccountDetail } }) => {
  return { teamAccountDetail };
};

export default connect(mapStateToProps)((Form.create()(Index)));
