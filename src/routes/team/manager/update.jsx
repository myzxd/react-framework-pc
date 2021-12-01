/**
 * 业主管理 - 业主编辑
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import React, { Component } from 'react';

import ScopeCard from './components/scopeCard';
import ChangeList from './components/changeList';
import ComponentUpdateOwnerList from './components/updateOwnerList';
import ComponentUpdateOwnerModal from './components/updateOwnerModal';
import Operate from '../../../application/define/operate';
import { CoreContent, DeprecatedCoreForm } from '../../../components/core';
import { TeamOwnerManagerState } from '../../../application/define';

class Index extends Component {
  static propTypes = {
    teamManagerDetail: PropTypes.object, // 业主详情
  };

  static defaultProps = {
    teamManagerDetail: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      suppliers: [],  // 供应商
      platforms: [],  // 平台
      cities: [],     // 城市
      updateOwnerModal: {}, // 变更业主信息
      visible: false,
      districts: [],  // 商圈

      // 子组件变更记录搜索的参数
      page: 1,
      limit: 30,
      tiemStamp: Date.parse(new Date()),
    };
  }

  // 获取详情数据
  componentDidMount() {
    // 调用接口
    this.onInterface();
  }

  // 接口
  onInterface = () => {
    const { id } = this.props.location.query;
    const params = { id };
    this.props.dispatch({ type: 'teamManager/fetchTeamManagerDetail', payload: params });
  }

  // 变更业主成功回调
  onSuccessCallBackUpdateOwnerModal = () => {
    // 调用详情接口
    this.onInterface();
    this.setState({
      tiemStamp: Date.parse(new Date()),
    });
  }

  // 修改分页
  onChangePage = (page, limit) => {
    this.setState(() => {
      return {
        page,
        limit,
      };
    }, () => {
      this.onSearch();
    });
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    this.setState(() => {
      return {
        page,
        limit,
      };
    }, () => {
      this.onSearch();
    });
  }

  onSearch = (flag) => {
    const { id } = this.props.location.query;
    const { page, limit } = this.state;
    // 如果来自于业主管理组件的请求，则重置page有limit
    if (flag) {
      return this.setState(() => {
        return {
          page: 1,
          limit: 30,
        };
      }, () => {
        const searchParams = {
          id,
          meta: {
            page: 1,
            limit: 30,
          },
        };
        this.props.dispatch({
          type: 'teamManager/fetchOwnerChangeLog',
          payload: searchParams,
        });
      });
    }
    // 变更记录列表的请求
    const searchParams = {
      id,
      meta: {
        page,
        limit,
      },
    };
    this.props.dispatch({
      type: 'teamManager/fetchOwnerChangeLog',
      payload: searchParams,
    });
  }

  // 更换供应商
  onChangeSuppliers = (e) => {
    const { suppliers } = this.state;
    const { setFieldsValue } = this.props.form;

    // 判断原选项是否改变, 如果没有被删除则返回true，如果被删除则返回false
    const isOrigin = suppliers.every(item => e.includes(item));
    // 如果原选项没有改变，则不重置下级菜单
    if (isOrigin) {
      return this.setState({ suppliers: e });
    }

    // 修改选项，同时重置下级菜单
    this.setState({
      suppliers: e,
      cities: [],
      districts: [],
    });

    // 清空选项
    setFieldsValue({ cities: [], districts: [] });
  }

  // 更换平台
  onChangePlatforms = (e) => {
    const { platforms } = this.state;
    const { setFieldsValue } = this.props.form;

    // 判断原选项是否改变, 如果没有被删除则返回true，如果被删除则返回false
    const isOrigin = platforms.every(item => e.includes(item));
    // 如果原选项没有改变，则不重置下级菜单
    if (isOrigin) {
      return this.setState({ platforms: e });
    }

    // 修改选项，同时重置下级菜单
    this.setState({
      platforms: e,
      suppliers: [],
      cities: [],
      districts: [],
    });

    // 清空选项
    setFieldsValue({ suppliers: [], cities: [], districts: [] });
  }

  // 更换城市
  onChangeCity = (e) => {
    const { cities } = this.state;
    const { setFieldsValue } = this.props.form;

    // 判断原选项是否改变, 如果没有被删除则返回true，如果被删除则返回false
    const isOrigin = cities.every(item => e.includes(item));
    // 如果原选项没有改变，则不重置下级菜单
    if (isOrigin) {
      return this.setState({ cities: e });
    }

    // 修改选项，同时重置下级菜单
    this.setState({
      cities: e,
      districts: [],
    });

    // 清空选项
    setFieldsValue({ districts: [] });
  }

  // 更换区域
  onChangeDistrict = (e) => {
    this.setState({
      districts: e,
    });
  }

  // 变更业主
  onClickUpdateOwner = () => {
    this.setState({
      updateOwnerModal: this.props.teamManagerDetail,
      visible: true,
    });
  }

  // 解散团队
  onClickDissolutionTeam = () => {
    const { id } = this.props.location.query;
    this.props.dispatch({ type: 'teamManager/updateDissolutionTeam', payload: { id } });
  }

  // 关闭变更业主的弹框
  onCancelUpdateOwner = () => {
    this.setState({
      updateOwnerModal: {},
      visible: false,
    });
  }

  // 渲染身份证号码
  renderIdentityCardId = () => {
    const { teamManagerDetail = {} } = this.props;
    if (teamManagerDetail.state === TeamOwnerManagerState.notEffect) {
      return teamManagerDetail.identity_card_id ? teamManagerDetail.identity_card_id : '--';
    }
    return dot.get(teamManagerDetail, 'staff_info.identity_card_id', '--');
  }

  // 基础信息
  renderInfo = () => {
    const { teamManagerDetail = {} } = this.props;
    const formItems = [
      {
        label: '业主团队ID',
        form: dot.get(teamManagerDetail, '_id', '--'),
      }, {
        label: '业主姓名',
        form: dot.get(teamManagerDetail, 'staff_info.name', '--'),
      }, {
        label: '手机号',
        form: dot.get(teamManagerDetail, 'staff_info.phone', '--'),
      }, {
        label: '身份证号',
        form: this.renderIdentityCardId(),
      }, {
        label: '业主ID',
        form: dot.get(teamManagerDetail, 'staff_id', '--'),
      },
    ];
    // 判断是否拥有变更业主或解散团队的权限
    if (Operate.canOperateTeamManagerUpdateOwner() ||
      Operate.canOperateTeamManagerDissolution()) {
      formItems.push({
        colon: false,
        form: (<div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {Operate.canOperateTeamManagerUpdateOwner() ?
          (<a
            className="app-global-compoments-cursor"
            onClick={this.onClickUpdateOwner}
          >变更业主</a>) : null}
          {Operate.canOperateTeamManagerDissolution() ?
          (<a
            className="app-global-compoments-cursor"
            onClick={this.onClickDissolutionTeam}
          >解散团队</a>) : null}
        </div>),
      });
    }

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <CoreContent title={'业主信息'}>
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  render() {
    const { id } = this.props.location.query;
    const { form, teamManagerDetail = {} } = this.props;
    const { page, limit } = this.state;
    const { onChangePage, onShowSizeChange, onSearch } = this;
    const props = {
      onChangePage,
      onShowSizeChange,
      page,
      limit,
      id,
      onSearch,
    };
    return (
      <div>
        {/* 基础信息 */}
        {this.renderInfo()}
        {/* 业主团队变更记录 */}
        <ComponentUpdateOwnerList
          tiemStamp={this.state.tiemStamp}
          ownerId={teamManagerDetail._id}
        />
        {/* 承揽范围 */}
        <ScopeCard id={id} form={form} teamManagerDetailData={teamManagerDetail} onGetChangeList={this.onSearch} />

        {/* 变更记录 */}
        <ChangeList {...props} />
        {/* 变更业主弹框 */}
        <ComponentUpdateOwnerModal
          detail={this.state.updateOwnerModal}
          visible={this.state.visible}
          onCancel={this.onCancelUpdateOwner}
          dispatch={this.props.dispatch}
          onSuccessCallBack={this.onSuccessCallBackUpdateOwnerModal}
          onClickUpdateOwner={this.onClickUpdateOwner}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ teamManager: { teamManagerDetail } }) => {
  return { teamManagerDetail };
};

export default connect(mapStateToProps)((Form.create()(Index)));
