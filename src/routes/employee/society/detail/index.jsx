/**
 * 人员管理 - 社保配置管理 - 新增与编辑
 */
import React, { useEffect } from 'react';
import { connect } from 'dva';

import { Form, Button } from 'antd';


import { CoreContent, CoreForm } from '../../../../components/core';


import SocietyCard from '../components/societyCard.jsx';        // 社保方案卡片

import Style from '../style.less';                            // 样式

const { Item } = Form;
const SocietyDetail = ({ societyPlanDetail = {}, dispatch, location, history }) => {
  // 请求参数
  useEffect(() => {
    dispatch({
      type: 'society/fetchSocietyPlanDetail',
      payload: { id: location.query.id },
    });
    // 销毁时清空列表数据
    return () => dispatch({
      type: 'society/reduceSocietyPlanDetail',
      payload: {},
    });
  }, [dispatch, location]);
  // 返回
  const onGoBack = () => { history.go(-1); };
  // 设置方案基本信息
  const renderBaseInfo = () => {
    const itemsCity = [
      <Item
        label="城市"
      >
        {societyPlanDetail.splicing_name || '--'}
      </Item>,
    ];
    const items = [
      <Item
        label="参保方案名称"
      >
        {societyPlanDetail.name || '--'}
      </Item>,
    ];
    return (<CoreContent title="方案基本信息">
      <CoreForm items={items} cols={3} />
      <CoreForm items={itemsCity} cols={3} />
    </CoreContent>);
  };
  // 社保方案配置
  const renderSocietyPlan = () => {
    return (<CoreContent title="参保方案配置">
      <SocietyCard Item={Item} isDetail />
    </CoreContent>);
  };
  // 渲染底部方案
  const renderButton = () => {
    return (<div className={Style['app-comp-employee-society-form-button-wrap']}>
      <Button type="primary" onClick={onGoBack}>返&emsp;回</Button>
    </div>);
  };

  return (
    <div>
      <Form
        labelAlign="right"
        labelCol={{ span: 8, offset: 2 }}
      >
        {/* 设置方案基本信息 */}
        {renderBaseInfo()}
        {/* 社保方案配置 */}
        {renderSocietyPlan()}
        {/* 底部按钮 */}
        {renderButton()}
      </Form>
    </div>
  );
};

const mapStateToProps = ({ society: { societyPlanDetail } }) => ({ societyPlanDetail });

export default connect(mapStateToProps)(SocietyDetail);
