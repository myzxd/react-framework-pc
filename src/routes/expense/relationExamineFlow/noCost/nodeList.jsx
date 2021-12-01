/*
* 关联审批流 - 节点预览
*/
import is from 'is_js';
import dot from 'dot-prop';
import React from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import {
  ArrowRightOutlined,
} from '@ant-design/icons';

import {
  ExpenseExaminePostType,
} from '../../../../application/define';

function NodeList(props) {
  const nodelist = dot.get(props, 'nodelist', []);
  // 节点每项
  const renderNodeItem = (node, i, isShowIcon = true) => {
    const accountList = dot.get(node, 'account_list', []);
    const postList = dot.get(node, 'post_list', []);
    let textColor = false;
    // 判断岗位是否都为禁用或者下面没有人
    const postFlag = Array.isArray(postList) && postList.every((item) => {
      // 岗位下的用户
      const postAccountList = dot.get(item, 'account_list', []);
             // 判断是否是禁用
      return item.post_state === ExpenseExaminePostType.disable
        // 判断岗位下用户是否有数据
        || (is.not.existy(postAccountList) || is.empty(postAccountList));
    });
    // 判断当前节点没有审批人
    if ((is.not.existy(accountList) || is.empty(accountList)) && postFlag === true) {
      textColor = true;
    }
    return (
      <Col key={i} style={{ marginLeft: 5 }}>
        <span style={{ color: textColor ? 'red' : '' }}>
          {node.node_name}
          （
            {accountList.join('、')}
          { accountList.length === 0 && postList.length === 0 ? '无' : null}
          { accountList.length > 0 && postList.length > 0 ? '；' : null}
          {
              postList.map((item) => {
                const postAccountList = dot.get(item, 'account_list', []);
                // 判断是否是禁用
                if (item.post_state === ExpenseExaminePostType.disable) {
                  return `${item.post_name}（禁用）`;
                }
                return `${item.post_name}（${Array.isArray(postAccountList)
                  && postAccountList.length > 0 ? postAccountList.join('、') : '无'}）`;
              }).join('、')
            }
          ）
        </span>
        {/* 最后一个节点不显示icon */}
        {isShowIcon ? null : (<ArrowRightOutlined />)}
      </Col>
    );
  };


  // 节点预览
  const renderNodeList = (data = []) => {
    // 判断是否为空
    if (is.not.existy(data) || is.empty(data)) {
      return '--';
    }
    return (
      <Row>
        <Col><span>申请人</span> <ArrowRightOutlined /></Col>
        {
          data.map((item, i) => {
            return renderNodeItem(item, i, i === data.length - 1);
          })
        }
      </Row>
    );
  };

  return (
    <React.Fragment>
      {renderNodeList(nodelist)}
    </React.Fragment>
  );
}

const mapStateToProps = ({ relationExamineFlow: { examineFlowInfo },
  business: { contractTypeData },
}) => {
  return { examineFlowInfo, contractTypeData };
};

export default connect(mapStateToProps)(NodeList);
