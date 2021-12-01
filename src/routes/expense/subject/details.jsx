/**
 * 科目设置 - 科目详情
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import {
  Row,
  Col,
  Button,
  Popover,
} from 'antd';

import { CoreContent } from '../../../components/core';
import { CommonSelectScene } from '../../../components/common';
import { OaCostAccountingLevel, ExpenseCostCenterType, OaApplicationFlowRegulation } from '../../../application/define';
import style from './style.css';

class Details extends Component {
  static propTypes = {
    subjectsDetail: PropTypes.object, // 科目详情
  };

  static defaultProps = {
    subjectsDetail: {},
  };

  componentDidMount() {
    const { subjiectId } = this.props.location.query;
    const params = {
      id: subjiectId, // 科目id
    };
    this.props.dispatch({ type: 'expenseSubject/fetchSubjectsDetail', payload: params });
  }

  // 数据重置
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'expenseSubject/resetSubjectsDetail' });
  }

  // 返回首页
  onRturn = () => {
    this.props.history.push('/Expense/Subject');
  }

  // 渲染归属信息
  renderAttributionInfo = () => {
    const { subjectsDetail = {} } = this.props;
    const { level, parentInfo: { name: parentName = '' } = {}, costFlag, costCenterType } = subjectsDetail;

    const costFlags = costFlag ? OaApplicationFlowRegulation.description(costFlag) : '否';
    // 上级科目，长度判断，超过30位截取，补全...
    let parentInfoDisplay = parentName;
    if (parentName && parentName.length > 30) {
      parentInfoDisplay = `${parentName.slice(0, 30)}...`;
    }
    return (
      <div>
        <Row>
          <Col span={9}>
            <Row>
              <Col span={6} className={style['app-comp-expense-subject-detail-common-title']}>级别:</Col>
              <Col span={14} className={style['app-comp-expense-subject-detail-common-content']} offset={1} >{`${OaCostAccountingLevel.description(Number(level))}` || `${'--'}`}</Col>
            </Row>
          </Col>
          <Col span={9}>
            <Row>
              <Col span={6} className={style['app-comp-expense-subject-detail-common-title']}>上级科目:</Col>
              <Col span={14} className={style['app-comp-expense-subject-detail-common-content']} offset={1}>
                {
                  parentInfoDisplay ? (<Popover content={<p className={style['app-comp-expense-subject-detail-common-text']}>{parentName}</p>} trigger="hover">
                    <div>{parentInfoDisplay}</div>
                  </Popover>) : '--'
                }
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={style['app-comp-expense-subject-detail-common-distance']}>
          <Col span={9}>
            <Row>
              <Col span={6} className={style['app-comp-expense-subject-detail-common-title']}>是否是成本类:</Col>
              <Col span={14} offset={1} className={style['app-comp-expense-subject-detail-common-content']} >{costFlags} </Col>
            </Row>
          </Col>
          <Col span={9}>
            <Row>
              <Col span={6} className={style['app-comp-expense-subject-detail-common-title']}>成本归属:</Col>
              <Col span={14} className={style['app-comp-expense-subject-detail-common-content']} offset={1}>{`${costCenterType}` ? `${ExpenseCostCenterType.description(Number(costCenterType))}` : `${'--'}`}</Col>
            </Row>
          </Col>
        </Row>
        <Row className={style['app-comp-expense-subject-detail-common-distance']}>
          <Col span={9}>
            <Row>
              <Col span={6} className={style['app-comp-expense-subject-detail-common-title']}>适用场景:</Col>
              <Col
                span={14}
                className={style['app-comp-expense-subject-detail-common-content']}
                offset={1}
              >
                <CommonSelectScene enumeratedType="subjectScense" isDetail value={dot.get(subjectsDetail, 'industryCodes.0', undefined)} />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }

  // 渲染基本信息
  renderBasicInfo = () => {
    const { subjectsDetail = {} } = this.props;
    const { name, accountingCode, description } = subjectsDetail;

    // 科目描述，长度判断，超过30位截取，补全...
    let displayDescription = description;
    if (description && description.length > 30) {
      displayDescription = `${description.slice(0, 30)}...`;
    }
    // 科目名称，长度判断，超过30位截取，补全...
    let displayName = name;
    if (name && name.length > 30) {
      displayName = `${name.slice(0, 30)}...`;
    }

    return (
      <div>
        <Row>
          <Col span={9}>
            <Row>
              <Col span={6} className={style['app-comp-expense-subject-detail-common-title']}>科目名称:</Col>
              <Col span={14} className={style['app-comp-expense-subject-detail-common-content']} offset={1} >
                <Popover content={<p className={style['app-comp-expense-subject-detail-common-text']}>{name}</p>} trigger="hover">
                  <div>{displayName}</div>
                </Popover>
              </Col>
            </Row>
          </Col>
          <Col span={9}>
            <Row>
              <Col span={6} className={style['app-comp-expense-subject-detail-common-title']}>科目编码:</Col>
              <Col span={14} className={style['app-comp-expense-subject-detail-common-content']} offset={1}>{`${accountingCode}` || `${'--'}`}</Col>
            </Row>
          </Col>
        </Row>
        <Row className={style['app-comp-expense-subject-detail-common-distance']}>
          <Col span={9}>
            <Row>
              <Col span={6} className={style['app-comp-expense-subject-detail-common-title']}>科目描述:</Col>
              <Col span={14} className={style['app-comp-expense-subject-detail-common-content']} offset={1} >
                <Popover
                  content={<p className={style['app-comp-expense-subject-detail-common-text']}>
                    <span className="noteWrap">
                      {displayDescription}
                    </span>

                  </p>} trigger="hover"
                >
                  <div className="noteWrap">
                    {displayDescription}
                  </div>
                </Popover>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }

  // 渲染基本信息
  renderOperationInfo = () => {
    const { subjectsDetail = {} } = this.props;
    const { creatorInfo: { name: creatorName = '' } = {}, createdAt, updatedAt } = subjectsDetail;

    return (
      <div>
        <Row>
          <Col span={9}>
            <Row>
              <Col span={6} className={style['app-comp-expense-subject-detail-common-title']}>创建人:</Col>
              <Col span={14} className={style['app-comp-expense-subject-detail-common-content']} offset={1} >{`${creatorName}` || `${'--'}`}</Col>
            </Row>
          </Col>
          <Col span={9}>
            <Row>
              <Col span={6} className={style['app-comp-expense-subject-detail-common-title']}>创建时间:</Col>
              <Col span={14} className={style['app-comp-expense-subject-detail-common-content']} offset={1}>{`${moment(createdAt).format('YYYY-MM-DD HH:mm')}` || `${'--'}`}</Col>
            </Row>
          </Col>
        </Row>
        <Row className={style['app-comp-expense-subject-detail-common-distance']}>
          <Col span={9}>
            <Row>
              <Col span={6} className={style['app-comp-expense-subject-detail-common-title']}>最新编辑时间:</Col>
              <Col span={14} className={style['app-comp-expense-subject-detail-common-content']} offset={1} >{`${moment(updatedAt).format('YYYY-MM-DD HH:mm')}` || `${'--'}`}</Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }

  render = () => {
    return (
      <div>
        <CoreContent title="归属信息" >
          {this.renderAttributionInfo()}
        </CoreContent>
        <CoreContent title="基本信息" >
          {this.renderBasicInfo()}
        </CoreContent>
        <CoreContent title="操作信息" >
          {this.renderOperationInfo()}
        </CoreContent>
        <Button className={style['app-comp-expense-subject-detail-common-button']} type="primary" onClick={() => { this.onRturn(); }}>返回</Button>
      </div>

    );
  }
}
function mapStateToProps({ expenseSubject: { subjectsDetail } }) {
  return { subjectsDetail };
}
export default connect(mapStateToProps)(Details);
