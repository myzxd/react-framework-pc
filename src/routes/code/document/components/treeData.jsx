/**
 * Code/Team审批管理 - 发起审批 - 费控申请 - tree
 */
/* eslint-disable import/no-dynamic-require */

import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Spin, Empty, message } from 'antd';
import Masonry from 'react-responsive-masonry';

import {
  // CodeSubmitType,
  CodeMatterLinkCollectState,
} from '../../../../application/define';
import { authorize } from '../../../../application';
// import OldExpenseDocumentManageComponents from '../oldExpenseComponents';
import LinkComponent from './linkComponent';
import ReportModal from '../../components/reportModal';
import styles from './style.less';

function TreeData(props) {
  const { dispatch, isSelf, majorDepartmentId, relationInfoId, activeKey, departmentId, postId, treeData } = props;
  const [loading, setLoading] = useState(false);
  // 提报弹窗
  const [visible, setVisible] = useState(false);
  // 当前账号下草稿状态审批单id
  const [draftOrderId, setDraftOrderId] = useState(undefined);
  // 当前操作的link链接
  const [curLinkId, setCurLinkId] = useState(undefined);

  // 已收藏的链接id
  const [collectList, setCollectList] = useState([]);

  useEffect(() => {
    // 主岗请求接口
    if (isSelf === true && majorDepartmentId && relationInfoId) {
      setLoading(true);
      const payload = {
        isSelf,
        type: activeKey,
        departmentId: majorDepartmentId, // 主部门
        departmentJobId: relationInfoId, // 部门岗位关系id
        onSucessCallback: () => {
          setLoading(false);
        },
        onErrorCallback: () => {
          setLoading(false);
        },
      };
      dispatch({ type: 'codeDocument/fetchTreeData', payload });
      return () => dispatch({ type: 'codeDocument/resetTreeData' });
    }
    // 不是主岗时，部门岗位存在时请求接口
    if (isSelf !== true && (is.existy(departmentId) && is.not.empty(departmentId))
      && (is.existy(postId) && is.not.empty(postId))) {
      setLoading(true);
      const payload = {
        isSelf,
        type: activeKey,
        departmentId,
        departmentJobId: postId, // 部门岗位关系id
        onSucessCallback: () => {
          setLoading(false);
        },
        onErrorCallback: () => {
          setLoading(false);
        },
      };
      dispatch({ type: 'codeDocument/fetchTreeData', payload });
    }
    return () => {
      setLoading(false);
      // 清除数据
      dispatch({ type: 'codeDocument/reduceTreeData', payload: {} });
    };
  }, [dispatch, isSelf, majorDepartmentId, relationInfoId, activeKey, departmentId, postId]);

  // 创建审批单页面
  const goCreatePage = (orderId) => {
    window.location.href = `/#/Code/PayOrder/Create?orderId=${orderId}`;
  };

  // 创建审批单页面
  const goUpdatePage = (orderId) => {
    window.location.href = `/#/Code/PayOrder/Update?orderId=${orderId}`;
  };

  // 点击链接
  const onClickFow = (linkId) => {
    // 切换岗位后（副岗）
    // 调用提报链接埋点接口
    if (!isSelf) {
      dispatch({
        type: 'codeOrder/onSubmitBuriedPoint',
        payload: { linkId, action: 30 },
      });
    }
    getDraftOrder(linkId);
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
    if (!authorize.prompt
      || !value
      || !date
      || !employeeId
      || id !== employeeId
    ) return true;

    if (value === 1 && moment(new Date()).diff(moment(date), 'days') >= 1) {
      return true;
    }
    if (value === 2 && moment(new Date()).diff(moment(date), 'days') >= 7) {
      return true;
    }
    return false;
  };

  // 获取草稿状态的审批单
  const getDraftOrder = async (linkId) => {
    setCurLinkId(linkId);
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

  // 创建审批单
  const onCreateOrder = (linkId) => {
    dispatch({
      type: 'codeOrder/createOrder',
      payload: {
        sceneLinkId: linkId,
        departmentId: (departmentId || majorDepartmentId),
        departmentJobId: (postId || relationInfoId),
        onSucessCallback: res => goCreatePage(res._id),
      },
    });
  };

  // 收藏
  const onCollect = async (linkId) => {
    const res = await dispatch({
      type: 'codeMatter/markCollectLink',
      payload: { linkId, state: CodeMatterLinkCollectState.ok },
    });

    if (res && res._id) {
      message.success('收藏成功');
      !collectList.includes(res._id) && (setCollectList([...collectList, res._id]));
    }
  };

  // 节点下的审批流链接
  const renderNodeSceneLinkList = (item) => {
      // 判断审批流链接是否存在
    if (is.existy(item.scene_link_list) && is.not.empty(item.scene_link_list)) {
      return (<div className={styles['app-tree-node-flow-box']}>
        {item.scene_link_list.map((v) => {
          return (
            <LinkComponent
              key={v._id}
              detail={v}
              onClickFow={() => onClickFow(v._id)}
              onCollect={onCollect}
            />
          );
        },
          )}</div>);
    }
    return <div style={{ height: 20 }} />;
  };


  // 筛选下面审批流链接是否存在
  const getFilterFlowFlag = (data = []) => {
    // 没数据是，返回false
    if (is.not.existy(data) || is.empty(data)) {
      return false;
    }
    return data.some((v) => {
      if (is.existy(v.scene_link_list) && is.not.empty(v.scene_link_list)) {
        return true;
      }
      if (is.existy(v.child_scene_list) && is.not.empty(v.child_scene_list)) {
        return getFilterFlowFlag(v.child_scene_list);
      }
    });
  };

  // 二三级节点
  const renderItems = (node) => {
    // 判断是否有节点信息，有节点信息则渲染
    if (is.empty(node) || is.not.existy(node) || is.not.array(node)) {
      return undefined;
    }
    return node.map((item) => {
      // 节点下的审批流
      const flow = renderNodeSceneLinkList(item);
      // 判断下级是否有链接
      const flag = getFilterFlowFlag([item]);
      // 判断下级是否有链接
      if (flag === true) {
        return (
          <div
            className={styles['app-tree-treenode']}
            key={item._id}
            style={{ marginLeft: 20 }}
          >
            <div className={styles['app-tree-treenode-row']}>
              <div className={styles['app-tree-treenode-row-name']}>
                {item.name}
              </div>
            </div>
            {flow}
            {/* 渲染子节点信息 */}
            {renderItems(item.child_scene_list)}
          </div>
        );
      }
    });
  };

    // 渲染节点信息
  const renderNodes = (data) => {
      // 判断是否有节点信息，有节点信息则渲染
    if (is.empty(data) || is.not.existy(data) || is.not.array(data)) {
      return [];
    }
    const items = data.map((item) => {
      // 节点下的审批流
      const flow = renderNodeSceneLinkList(item);
    // 判断节点下是否有审批流链接，有展示数据，没有不展示数据
      if (getFilterFlowFlag([item])) {
        return (
          <React.Fragment key={item._id}>
            {

              <div span={12} key={item._id} className={styles['app-tree']}>
                <div
                  className={styles['app-tree-treenode']}
                  key={item._id}
                >
                  <div className={styles['app-tree-treenode-row']} style={{ marginTop: 10 }}>
                    <div className={styles['app-tree-treenode-row-icon']} />
                    <div className={styles['app-tree-treenode-row-name']}>
                      {item.name}
                    </div>
                  </div>
                  {flow}
                  {/* 渲染子节点信息 */}
                  {renderItems(item.child_scene_list)}
                </div>
              </div>
          }
          </React.Fragment>
        );
      }
    });
    // 过滤空数据
    return items.filter(v => v !== undefined);
  };

  // const renderExpense = () => {
    // return (
      // <React.Fragment>
        // {
        // Number(activeKey) === CodeSubmitType.team ? (
          // <OldExpenseDocumentManageComponents />
          // ) : null
      // }
      // </React.Fragment>
    // );
  // };
  // 数据
  const dataSoure = dot.get(treeData, 'data', []);
  // 判断是否有链接
  const flag = getFilterFlowFlag(dataSoure);
  // 判断没数据的情况
  if (is.not.existy(dataSoure) || is.empty(dataSoure) || flag !== true) {
    return (
      <div
        style={{
          background: '#fff',
          height: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center' }}
      >
        {
          loading ? <Spin /> : (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              {/* renderExpense() */}
            </div>
          )
        }

      </div>
    );
  }

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
    <div style={{ background: '#fff', marginTop: 10 }}>
      <Masonry columnsCount={2}>
        {renderNodes(dataSoure)}
      </Masonry>
      {/*
        loading === false && is.existy(dataSoure) && is.not.empty(dataSoure) ?
          renderExpense()
        : null
      */}
      {renderReportModal()}
    </div>
  );
}

const mapStateToProps = ({
  codeDocument: { treeData },
}) => {
  return { treeData };
};
export default connect(mapStateToProps)(TreeData);
