/**
 * 付款审批 - 补充意见文本显示组件
 */
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import React, { useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { authorize } from '../../../../../application';
import PageUpload from '../../../components/upload';
import styles from '../style.less';

const SupplementOpinionText = ({
  orderId, // 审批单id
  dataSource = [], // 补充意见
  dispatch,
}) => {
  // 是否显示全部意见
  const [isShowAllOp, setIsShowAllOp] = useState(false);

  // 删除补充意见
  const onDeleteFile = async (opinionId) => {
    const res = await dispatch({
      type: 'codeOrder/deleteApproveOrderExtra',
      payload: { extraId: opinionId },
    });

    // 操作成功，重新获取详情
    if (res && res._id) {
      dispatch({
        type: 'codeOrder/getOrderFlowRecordList',
        payload: { orderId },
      });
    }
  };

  // 默认显示全部数据,数据倒序显示，最新的在上面
  let data = dataSource;

  // 判断不显示全部时，只显示3条补充意见
  if (isShowAllOp === false) {
    data = dataSource.slice(0, 3);
  }

  // 查看更多操作
  const renderOperateBtn = () => {
    if (dataSource.length > 3) {
      return (
        <span
          onClick={() => setIsShowAllOp(!isShowAllOp)}
          className={styles['code-circulation-supplement-show-more-btn']}
        >
          {isShowAllOp ? '收起 <<' : '查看更多 >>'}
        </span>
      );
    }
    return '';
  };

  // 补充意见细项
  const renderOpinionItem = (opinion, opinionIndex) => {
    // 判断是否显示删除按钮
    let isDelete = false;

    // 判断账户id是否为该条补充意见的创建人
    if (opinion.creator_id === authorize.account.id) {
      isDelete = true;
    }

    // 定义创建人name
    const creatorName = dot.get(opinion, 'creator_info.name');

    return (
      <div
        key={opinionIndex}
        className={styles['code-circulation-supplement-item']}
      >
        <div>
          <div>
            <span
              className={styles['code-circulation-supplement-creator-name']}
            >{creatorName}</span>

            {/* 判断：补充意见的创建人是否存在，存在才能渲染显示 */}
            {
              opinion.created_at ?
                <span
                  className={styles['code-circulation-supplement-create-at']}
                >{moment(opinion.created_at).format('YYYY-MM-DD HH:mm:ss')}</span>
              : ''
            }
          </div>

          {/* 渲染补充意见内容 */}
          <div className={styles['code-circulation-supplement-text-wrap']}>
            <p
              className={styles['code-circulation-supplement-text']}
            >{opinion.content}</p>
          </div>

          {/* 判断是否存在附件 */}
          {
            opinion.asset_list && opinion.asset_list.length > 0 ?
              <div
                className={styles['code-circulation-supplement-files']}
              >附件：
              <PageUpload
                displayMode
                value={PageUpload.getInitialValue(opinion, 'asset_list')}
              />
              </div> : ''
          }
          {/* 判断是否存在删除按钮，审批人只能够删除自己的补充意见 */}
          {
            isDelete === true ?
              <Popconfirm
                title="您是否确定删除该条补充意见"
                onConfirm={() => onDeleteFile(opinion._id)}
                okText="确定"
                cancelText="取消"
              >
                <DeleteOutlined
                  className={styles['code-circulation-supplement-del-icon']}
                />
              </Popconfirm> : ''
          }
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className={styles['code-circulation-supplement-title']}>补充意见</div>
      <div className={styles['code-circulation-supplement-content']}>
        {
          data.map((opinion, opinionIndex) => renderOpinionItem(opinion, opinionIndex))
        }
        {
          /* 判断是否显示更多补充意见 */
        }
        {renderOperateBtn()}
      </div>
    </div>
  );
};

export default connect()(SupplementOpinionText);
