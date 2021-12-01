/**
 * 付款审批 - 补充意见文本显示组件
 */
import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { authorize } from '../../../../../application';
import styles from './style.less';

import { CoreFinder } from '../../../../../components/core';

const { CoreFinderList } = CoreFinder;

class SupplementOpinionText extends Component {

  static propTypes = {
    orderId: PropTypes.string,    // 当前审批单Id
    dataSource: PropTypes.array,  // 补充意见数据
    fileUrlList: PropTypes.array, // 附件下载地址列表
  }
  static defaultProps = {
    dataSource: [],
    fileUrlList: [],
  }

  constructor() {
    super();
    this.state = {
      isShowAllOpinion: false,          // 是否显示全部意见
    };
  }


  // 删除补充意见
  onDeleteFile = (opinionId) => {
    // 传入参数,补充意见id
    const params = {
      id: opinionId,
      onSuccessCallback: this.onSuccessCallback,  // 成功的回调函数
      onFailureCallback: this.onSuccessCallback,  // 失败的回调函数，重新刷新数据
    };
    // 提交数据
    this.props.dispatch({ type: 'expenseExamineOrder/deleteSupplementOpinion', payload: params });
  }

  // 删除成功后后重新刷新数据
  onSuccessCallback = () => {
    const { orderId } = this.props;
    // 如果审批单id不为空，则获取审批单详情数据
    if (orderId !== undefined) {
      this.props.dispatch({ type: 'expenseExamineOrder/fetchExamineOrderDetail', payload: { id: orderId } });
      this.props.dispatch({ type: 'expenseCostOrder/fetchCostOrders', payload: { examineOrderId: orderId } });
    }
  }


  // 判断是否显示全部数据,更新状态
  isShowAllOpinion = () => {
    const { isShowAllOpinion } = this.state;
    this.setState({
      isShowAllOpinion: !isShowAllOpinion,
    });
  }

  // 预览组件
  renderCorePreview = (value) => {
    const { fileUrlList } = this.props;
    if (Array.isArray(value) && dot.get(value, '0')) {
      const data = value.map((filename) => {
        // 获取对应文件名的下载url
        let url;
        const urlData = fileUrlList.filter(fileUrl => fileUrl.fileName === filename);


        // 判断当前数据是否存在
        if (is.existy(urlData[0]) && is.not.empty(urlData[0])) {
          url = urlData[0].fileUrl;
        }
        return { key: filename, url };
      });

      return (
        <CoreFinderList data={data} enableTakeLatest={false} />
      );
    }
    return '--';
  };

  render() {
    const { dataSource } = this.props;
    const { isShowAllOpinion } = this.state;

    // 默认显示全部数据,数据倒序显示，最新的在上面
    let data = dataSource;

    // 判断不显示全部时，只显示3条补充意见
    if (isShowAllOpinion === false) {
      data = dataSource.slice(0, 3);
    }

    // 判断是否存在 显示更多 按钮(数组长度是否大于3)
    const isShowMoreButton = dataSource.length > 3;
    return (
      <div>
        <div className={styles['app-comp-expense-supplement-title']}>补充意见</div>
        <div className={styles['app-comp-expense-supplement-content']}>
          {
            data.map((opinion, opinionIndex) => {
              // 判断是否显示删除按钮
              let isDelete = false;

              // 判断账户id是否为该条补充意见的创建人
              if (opinion.creatorId === authorize.account.id) {
                isDelete = true;
              }

              // 定义创建人name
              const creatorName = dot.get(opinion, 'creatorInfo.name');

              return (
                <div key={opinionIndex} className={styles['app-comp-expense-supplement-item']}>
                  <div>
                    <div>
                      <span className={styles['app-comp-expense-supplement-creator-name']}>{creatorName}</span>

                      {/* 判断：补充意见的创建人是否存在，存在才能渲染显示 */}
                      {
                        opinion.createdAt ?
                          <span className={styles['app-comp-expense-supplement-create-at']}>{moment(opinion.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                        : ''
                      }
                    </div>

                    {/* 渲染补充意见内容 */}
                    <div className={styles['app-comp-expense-supplement-text-wrap']}>
                      <p className={styles['app-comp-expense-supplement-text']}>{opinion.content}</p>
                    </div>

                    {/* 判断是否存在附件 */}
                    {
                      opinion.fileList && opinion.fileList.length > 0 ?
                        <div className={styles['app-comp-expense-supplement-files']}>附件：
                          {this.renderCorePreview(opinion.fileList)}
                        </div> : ''
                    }
                    {/* 判断是否存在删除按钮，审批人只能够删除自己的补充意见 */}
                    {
                      isDelete === true ?
                        <Popconfirm title="您是否确定删除该条补充意见" onConfirm={() => { this.onDeleteFile(opinion.id); }} okText="确定" cancelText="取消">
                          <DeleteOutlined className={styles['app-comp-expense-supplement-del-icon']} />
                        </Popconfirm> : ''
                    }
                  </div>
                </div>
              );
            })
          }
          {
            /* 判断是否显示更多补充意见 */
          }
          {
            isShowMoreButton === true ?
              <span onClick={() => this.isShowAllOpinion()} className={styles['app-comp-expense-supplement-show-more-btn']}>{isShowAllOpinion ? '收起 <<' : '查看更多 >>'}</span>
            : ''
          }

        </div>
      </div>
    );
  }
}

function mapStateToProps({ expenseExamineOrder: { examineOrderDetail }, expenseCostOrder: { costOrdersData } }) {
  return { examineOrderDetail, costOrdersData };
}

export default connect(mapStateToProps)(SupplementOpinionText);
