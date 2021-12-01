/**
 * 内容组件 - 内容展开收起组件
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Row, Col, Popconfirm } from 'antd';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { SalaryCollapseType } from '../../../../../application/define';
import Operate from '../../../../../application/define/operate';

import styles from './style/index.less';

const voidFunc = () => {};

class CommonCollapseComponent extends Component {
  static propTypes = {
    index: PropTypes.number,       // 数据索引
    data: PropTypes.object,        // 用于渲染的数据
    dataSource: PropTypes.array,  // 排序数据(TODO:实现方式待确定，有可能直接调用后台接口)
    type: PropTypes.number,        // 模板tab标识
    forceValidate: PropTypes.bool, // 表单校验是否validateTrigger 再次被触发时是否再次校验
    onRenderTitle: PropTypes.func, // 渲染标题
    onRenderContent: PropTypes.func, // 渲染内容
    onClickDelete: PropTypes.func,   // 删除回调
    onClickMoveUp: PropTypes.func,   // 上移回调
    onClickMoveDown: PropTypes.func, // 下移回调
    onSubmit: PropTypes.func,        // 提交回调
  }
  static defaultProps = {
    data: {},
    dataSource: [],
    forceValidate: false,
    onRenderTitle: voidFunc,
    onRenderContent: voidFunc,
    onClickDelete: voidFunc,
    onClickMoveUp: voidFunc,
    onClickMoveDown: voidFunc,
    onSubmit: voidFunc,
  }

  constructor(props) {
    super(props);
    this.state = {
      expand: true,      // 是否展开内容
      isDisabled: true,  // 表单是否可编辑
    };
  }

  // 点击操作的回调
  onChangeEdit = () => {
    const isDisabled = !this.state.isDisabled;
    this.setState({
      ...this.state,
      isDisabled,
    });
  }

  // 删除回调
  onClickDelete = () => {
    const { onClickDelete, index, data, dataSource } = this.props;
    if (onClickDelete) {
      onClickDelete(data, index, dataSource);
    }
  }

  // 向上移动回调
  onClickMoveUp = () => {
    const { onClickMoveUp, index, data, dataSource } = this.props;
    if (onClickMoveUp) {
      onClickMoveUp(data, index, dataSource);
    }
  }

  // 向下移动回调
  onClickMoveDown = () => {
    const { onClickMoveDown, index, data, dataSource } = this.props;
    if (onClickMoveDown) {
      onClickMoveDown(data, index, dataSource);
    }
  }

  // 提交回调
  onSubmit = () => {
    const { onSubmit, index, data, dataSource, forceValidate } = this.props;
    this.props.form.validateFields({ force: forceValidate }, (err, values) => {
      // 如果没有错误，并且有回调参数，则进行回调
      if (!err) {
        // 调用服务器
        if (onSubmit) {
          onSubmit(data, index, dataSource, values, this.onChangeEdit.bind(this));
        }
      }
    });
    // 保存变编辑
    // this.onChangeEdit();
  }

  // 点击展开操作的回调
  onChangeExpand = () => {
    const { expand } = this.state;
    // 设置展开变折叠，折叠变展开
    this.setState({ expand: !expand });
  }

  // 渲染数据
  renderBaseContent = () => {
    const { onRenderTitle, index, data, dataSource } = this.props;

    // 渲染标题
    let title = '';
    if (onRenderTitle) {
      title = onRenderTitle(data, index, dataSource);
    }

    return (
      <Row className={styles['app-comp-finance-content']} type="flex" justify="end" align="middle">
        <Col span={1} className={styles['app-comp-finance-component-tc']}>{index + 1}</Col>
        <Col span={19} className="app-global-mgt10">{title}</Col>
        <Col span={4}>
          <Row type="flex" justify="start" align="middle">
            <Col offset={17}><span className={styles['app-comp-finance-component-color-cursor1']} onClick={this.onChangeExpand}>展开</span></Col>
          </Row>
        </Col>
      </Row>
    );
  }

  renderExpandContent = () => {
    const { isDisabled } = this.state;
    const { onRenderTitle, onRenderContent, data, index, dataSource, type } = this.props;
    data.form = this.props.form;
    data.isDisabled = isDisabled;
    // 渲染标题
    let title = '';
    if (onRenderTitle) {
      title = onRenderTitle(data, index, dataSource);
    }

    // 渲染内容
    let content = '';
    if (onRenderContent) {
      content = onRenderContent(data, index, dataSource);
    }

    return (
      <Row className={!isDisabled ? styles['app-comp-finance-collapse-container'] : styles['app-comp-finance-collapse-container-normal']}>
        <Col span={24}>
          <Row gutter={0} className={styles['app-comp-finance-collapse-title']} type="flex" justify="center" align="middle">
            <Col span={1} className={styles['app-comp-finance-component-tc']}>{index + 1}</Col>
            <Col span={19} className="app-global-mgt10">{title}</Col>
            <Col span={4}>
              {
                type === SalaryCollapseType.generator || type === SalaryCollapseType.draft
                  ?
                  type === SalaryCollapseType.draft
                    ?
                      <Row type="flex" justify="start" align="middle">
                        {isDisabled
                          ? (
                            !Operate.canOperateFinancePlanRuleUpdate()
                            || <Col offset={11} span={6}><span className={styles['app-comp-finance-component-color-cursor1']} onClick={this.onChangeEdit}>编辑</span></Col>
                            )
                          : ''
                        }
                        {!isDisabled ? <Col offset={11} span={6}><span className={styles['app-comp-finance-component-color-cursor1']} onClick={this.onSubmit}>保存</span></Col> : ''}
                        <Col span={4}><span className={styles['app-comp-finance-component-color-cursor1']} onClick={this.onChangeExpand} >收起</span></Col>
                      </Row>
                    :
                      <Row type="flex" justify="end" align="middle">
                        {isDisabled
                          ? (
                            !Operate.canOperateFinancePlanRuleUpdate()
                            || <Col span={5}><span className={styles['app-comp-finance-component-color-cursor1']} onClick={this.onChangeEdit}>编辑</span></Col>
                            )
                          : ''
                        }
                        {!isDisabled ? <Col span={5}><span className={styles['app-comp-finance-component-color-cursor1']} onClick={this.onSubmit}>保存</span></Col> : ''}
                        {!Operate.canOperateFinancePlanRuleUpdate()
                          || <Col span={5}>
                            {isDisabled ? (
                              <Popconfirm placement="topRight" title="您确定删除该服务费卡片规则？" onConfirm={this.onClickDelete} okText="确定" cancelText="取消">
                                <span className={styles['app-comp-finance-component-color-cursor1']}>删除</span>
                              </Popconfirm>
                            ) : (
                              <span className={styles['app-comp-finance-component-color-cursor2']}>删除</span>
                        )}
                            </Col>
                        }
                        {!Operate.canOperateFinancePlanRuleMove()
                          || <Col span={5} style={{ display: index === 0 ? 'none' : 'block' }}><span className={styles['app-comp-finance-component-color-cursor1']} onClick={this.onClickMoveUp} >上移</span></Col>
                        }
                        {!Operate.canOperateFinancePlanRuleMove()
                          || <Col span={5} style={{ display: index === dataSource.length - 1 ? 'none' : 'block' }}><span className={styles['app-comp-finance-component-color-cursor1']} onClick={this.onClickMoveDown}>下移</span></Col>
                        }
                        <Col span={4}><span className={styles['app-comp-finance-component-color-cursor1']} onClick={this.onChangeExpand} >收起</span></Col>
                      </Row>
                  :
                      <Row type="flex" justify="start" align="middle">
                        <Col offset={17}><span className={styles['app-comp-finance-component-color-cursor1']} onClick={this.onChangeExpand} >收起</span></Col>
                      </Row>
              }
            </Col>
          </Row>
          <Row>
            <Col span={24} className={styles['app-comp-finance-collapse-content']}>
              {content}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

  render = () => {
    const { expand } = this.state;
    if (expand !== true) {
      return this.renderBaseContent();
    }
    return this.renderExpandContent();
  }
}

export default Form.create()(CommonCollapseComponent);
