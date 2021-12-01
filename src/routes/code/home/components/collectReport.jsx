/**
 * code/team - 首页 - 收藏的提报
 */
/* eslint-disable import/no-dynamic-require */
import moment from 'moment';
import dot from 'dot-prop';
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Button,
  // Popover,
  message,
  // Tooltip,
  Modal,
} from 'antd';
import {
  // DeleteOutlined,
  RightOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import {
  CodeMatterLinkCollectState,
  CodeSubmitType,
} from '../../../../application/define';
import { authorize } from '../../../../application';

import LinkComponent from './link';
import ReportModal from '../../components/reportModal';

import style from '../style.less';

const { confirm } = Modal;

const CollectReport = ({
  accountDetail, // 账户信息
  collectLinkList = {}, // 收藏的链接列表
  dispatch,
  setLoading,
  loading,
}) => {
  // 当前账号下草稿状态审批单id
  const [draftOrderId, setDraftOrderId] = useState(undefined);
  // 当前操作的link链接
  const [curLinkId, setCurLinkId] = useState(undefined);
  // visible
  const [visible, setVisible] = useState(undefined);

  useEffect(() => {
    dispatch({
      type: 'codeMatter/getCollectLinkList',
      payload: { setLoading },
    });

    return () => {
      dispatch({
        type: 'codeMatter/resetCollectLinkList',
        payload: {},
      });
    };
  }, [dispatch]);

  if (loading) return <div />;

  const {
    code_link_list: codeLinkList = [], // code链接list
    team_link_list: teamLinkList = [], // team链接list
  } = collectLinkList;

  // 错误提示
  const onErrorPrompt = (res) => {
    confirm({
      title: `${res.zh_message}`,
      maskClosable: true,
      icon: <QuestionCircleOutlined />,
      onOk: () => onCancelCollectLink(res._id),
    });
  };

  // 取消收藏
  const onCancelCollectLink = async (linkId) => {
    const res = await dispatch({
      type: 'codeMatter/markCollectLink',
      payload: {
        state: CodeMatterLinkCollectState.cancel,
        linkId,
      },
    });

    // 更新收藏链接数据
    if (res && res._id) {
      message.success('取消收藏成功');
      dispatch({
        type: 'codeMatter/getCollectLinkList',
        payload: {},
      });
    } else {
      res.zh_message && message.error(res.zh_message);
    }
  };

  // 提报校验
  const onCheckSubmit = async (linkId) => {
    const res = await dispatch({
      type: 'codeMatter/checkSubmit',
      payload: { linkId },
    });

    if (res && res.ok) {
      onSubmitBuriedPoint(linkId);
      getDraftOrder(linkId);
    } else {
      res.zh_message && onErrorPrompt({ ...res, _id: linkId });
    }
  };

  // 提报链接埋点
  const onSubmitBuriedPoint = (linkId) => {
    dispatch({
      type: 'codeOrder/onSubmitBuriedPoint',
      payload: { linkId, action: 10 },
    });
  };

  // 创建审批单页面
  const goUpdatePage = (orderId) => {
    window.location.href = `/#/Code/PayOrder/Update?orderId=${orderId}`;
  };

  // 是否显示弹窗
  const isShowPrompt = () => {
    const {
      value,
      date,
      employee_id: employeeId,
    } = authorize.prompt;
    const {
      id, // 账号id
    } = authorize.account;
    // 没有提示缓存
    if (!authorize.prompt || (!value && !date && !employeeId)) return true;

    // 不同账号的缓存
    if (id !== employeeId) return true;

    if (value === 1 && moment(new Date()).diff(moment(date), 'days') >= 1) {
      return true;
    }
    if (value === 2 && moment(new Date()).diff(moment(date), 'days') >= 7) {
      return true;
    }

    return false;
  };

  // 获取当前账户草稿状态的审批单
  const getDraftOrder = async (linkId) => {
    setCurLinkId(linkId);
    // 获取接口
    const res = await dispatch({
      type: 'codeOrder/getDraftOrder',
      payload: { linkId },
    });

    // 存在草稿状态审批单，并存在保存费用单操作
    // 提报弹窗
    if (res.id && res.message) {
      if (isShowPrompt()) {
        setDraftOrderId(res.id);
        setVisible(true);
      } else {
        goUpdatePage(res.id);
      }
      // 存在草稿状态审批单，但没有任何操作
      // 编辑页
    } else if (res.id && !res.message) {
      goUpdatePage(res.id);
      // 接口成功，并且没有草稿状态审批单
      // 新建页面
    } else if (!res.zh_message) {
      onCreateOrder(linkId);
    } else {
      res.zh_message && message.error(res.zh_message);
    }
  };

  // 新建审批单
  const onCreateOrder = (linkId) => {
    const departmentId = dot.get(accountDetail, 'employee_info.major_department_info._id');
    const departmentJobId = dot.get(accountDetail, 'employee_info.department_job_relation_info._id');

    // 缺少岗位/部门id
    if (!departmentJobId || !departmentId) {
      return message.error('缺少部门/部门岗位关系id');
    }

    dispatch({
      type: 'codeOrder/createOrder',
      payload: {
        sceneLinkId: linkId,
        departmentId,
        departmentJobId,
        onSucessCallback: res => (window.location.href = `/#/Code/PayOrder/Create?orderId=${res._id}`),
      },
    });
  };

  // code link
  const renderCodeLink = () => {
    // 无数据
    if (!codeLinkList || codeLinkList.length < 1) return '';

    const linkData = codeLinkList.slice(0, 12);

    return (
      <div>
        <div className={style['code-home-collect-link-code-wrap']}>
          <div
            className={style['code-home-collect-link-code-title-wrap']}
          >
            <span className={style['code-home-collect-link-code-rectangle']} />
            <span>CODE相关</span>
          </div>
          <span
            onClick={() => (window.location.href = `/#/Code/Document?jumpKey=${CodeSubmitType.code}`)}
            className={style['code-home-collect-link-show-all-btn']}
          >
            更多提报
            <RightOutlined />
          </span>
        </div>
        <Row>
          {renderLink(linkData)}
        </Row>
      </div>
    );
  };

  // code link
  const renderTeamLink = () => {
    // 无数据
    if (!teamLinkList || teamLinkList.length < 1) return '';

    const linkData = teamLinkList.slice(0, 12);

    return (
      <div>
        <div className={style['code-home-collect-link-code-wrap']}>
          <div
            className={style['code-home-collect-link-code-title-wrap']}
          >
            <span className={style['code-home-collect-link-team-rectangle']} />
            <span>TEAM相关</span>
          </div>
          <span
            onClick={() => (window.location.href = `/#/Code/Document?jumpKey=${CodeSubmitType.team}`)}
            className={style['code-home-collect-link-show-all-btn']}
          >
            更多提报
            <RightOutlined />
          </span>
        </div>
        <Row>
          {renderLink(linkData)}
        </Row>
      </div>
    );
  };

  // 链接
  const renderLink = (linkData) => {
    return (
      <React.Fragment>
        {
          linkData.map((i) => {
            return (
              <LinkComponent
                key={i._id}
                detail={i}
                onCancelCollectLink={onCancelCollectLink}
                onCheckSubmit={onCheckSubmit}
              />
            );
          })
        }
      </React.Fragment>
    );
  };

  // 无收藏
  const renderEmpty = () => {
    if ((codeLinkList && codeLinkList.length > 0) || (teamLinkList && teamLinkList.length > 0)) return '';
    return (
      <React.Fragment>
        <div
          className={style['code-home-collect-empty-title']}
        >TEAM/CODE提报收藏步骤</div>
        <Row style={{ marginTop: 10 }}>
          <Col
            span={12}
          >
            <Row>
              <Col
                span={10}
                className={style['code-home-collect-empty-step-one-wrap']}
              >
                <div className={style['code-home-collect-empty-step-one']}>
                  1
                </div>
              </Col>
              <Col span={14}>
                <div
                  className={style['code-home-collect-empty-step-title']}
                >点击去添加</div>
                <div
                  className={style['code-home-collect-empty-step-content']}
                >点击去添加，跳转code/team审批管理- <br />
                    审批中心-发起审批页面</div>
                <div
                  className={style['code-home-collect-empty-path-icon-wrap']}
                >
                  <img
                    role="presentation"
                    className={style['code-home-collect-empty-path-icon']}
                    src={require('../../static/path@2x.png')}
                  />
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={12} style={{ display: 'flex' }}>
            <div className={style['code-home-collect-empty-step-two']}>
              2
            </div>
            <div>
              <div
                className={style['code-home-collect-empty-step-title']}
              >设为收藏</div>
              <div
                className={style['code-home-collect-empty-step-content']}
              >鼠标经过审批链接，点击五角星即可收藏。</div>
              <img
                role="presentation"
                className={style['code-home-collect-empty-example-icon']}
                src={require('../../static/example@2x.png')}
              />
            </div>
          </Col>
        </Row>
        <div
          className={style['code-home-collect-empty-create-wrap']}
        >
          <Button
            className={style['code-home-collect-empty-create-btn']}
            onClick={() => (window.location.href = '/#/Code/Document')}
          >点击添加</Button>
        </div>
      </React.Fragment>
    );
  };

  // content
  const renderContent = () => {
    if ((!codeLinkList || codeLinkList.length < 1) && (!teamLinkList || teamLinkList.length < 1)) return '';
    return (
      <React.Fragment>
        {/* CODE */}
        {renderCodeLink()}
        {/* TEAM */}
        {renderTeamLink()}
      </React.Fragment>
    );
  };

  // 提报弹窗
  const renderReportModal = () => {
    return (
      <ReportModal
        visible={visible}
        setVisble={setVisible}
        onCreateOrder={() => onCreateOrder(curLinkId)}
        onUpdateOrder={() => goUpdatePage(draftOrderId)}
      />
    );
  };

  return (
    <div className={style['code-home-collect-empty-wrap']}>
      <div
        className={style['code-home-order-title']}
      >
        我的收藏
        <span className={style['code-home-order-prompt']}>(仅支持主岗身份收藏的链接进行提报！)</span>
      </div>
      {renderEmpty()}
      {renderContent()}
      {renderReportModal()}
    </div>
  );
};

const mapStateToProps = ({
  accountManage: { accountDetail },
  codeMatter: { collectLinkList },
}) => {
  return { accountDetail, collectLinkList };
};

export default connect(mapStateToProps)(CollectReport);
