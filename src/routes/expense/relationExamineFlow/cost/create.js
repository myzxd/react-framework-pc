/*
* 关联审批流 - 成本类审批流创建
*/
import dot from 'dot-prop';
import React, { useState, useEffect } from 'react';
import { Form, Button, message, Alert } from 'antd';
import { connect } from 'dva';

import { CoreContent, CoreForm } from '../../../../components/core';
import {
  RelationExamineFlowMerchantType,
  RelationExamineFlowTabType,
  OaApplicationOrderType,
} from '../../../../application/define';
import ExamineFlow from '../component/examineFlow';
import XDExamineFlow from '../component/xdExamineFlow';
import NodeList from './nodeList.jsx';

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 17 } };
const bizType = RelationExamineFlowTabType.cost;
const bu3Merchant = RelationExamineFlowMerchantType.bu3;
const merchant = RelationExamineFlowMerchantType.quhuo;
const bu3Namespace = `${bizType}${RelationExamineFlowMerchantType.bu3}`;
const namespace = `${bizType}${RelationExamineFlowMerchantType.quhuo}`;
const enumeratedType = 'industry';

function Create(props) {
  const { dispatch, examineFlowInfo, enumeratedValue } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState();
  const { [enumeratedType]: industryCodes } = enumeratedValue;
  useEffect(() => {
    return () => {
      dispatch({
        type: 'relationExamineFlow/reduceExamineFlowinfo',
        payload: {},
      });
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: 'applicationCommon/getEnumeratedValue',
      payload: { enumeratedType },
    });
    return () => dispatch({ type: 'applicationCommon/resetEnumeratedValue', payload: {} });
  }, [dispatch]);

  // bu3审批流
  const onChangeBu3ExamineFlow = (e) => {
    if (e) {
      dispatch({
        type: 'relationExamineFlow/fetchExamineFlowXDInfo',
        payload: {
          bizType,
          namespace: bu3Namespace,
          merchant: bu3Merchant,
          flowId: e,
        },
      });
    } else {
      dispatch({
        type: 'relationExamineFlow/reduceExamineFlowinfo',
        payload: {
          result: {},
          namespace: bu3Namespace,
        },
      });
    }
  };

  // 趣活
  const onChangeExamineFlow = (e) => {
    if (e) {
      dispatch({
        type: 'relationExamineFlow/fetchExamineFlowinfo',
        payload: {
          bizType,
          namespace,
          merchant,
          flowId: e,
        },
      });
    } else {
      dispatch({
        type: 'relationExamineFlow/reduceExamineFlowinfo',
        payload: {
          result: {},
          namespace,
        },
      });
    }
  };

  // 成功回调
  const onSuccessCallback = () => {
    message.success('请求成功');
    window.location.href = `/#/Expense/RelationExamineFlow?activeKey=${bizType}`;
  };

  // 启用
  const onSubmit = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      const { bu3ExamineFlow, examineFlow } = values;
      const params = {
        xdFlowId: bu3ExamineFlow,
        qhFlowId: examineFlow,
        bizType,
        onLoading: () => {
          setLoading(false);
        },
        onSuccessCallback,
      };
      dispatch({ type: 'relationExamineFlow/createRelationExamineFlow', payload: params });
    });
  };

  const renderHeader = () => {
    const formItems = [
      {
        span: 24,
        render: (
          <Form.Item
            labelCol={{ span: 3 }}
            colon={false}
            style={{ marginBottom: 0 }}
            label={(<h3>成本类审批流关联</h3>)}
          />
        ),
      },
      <Form.Item
        label={(<span className="boss-form-item-wrap-required">适用类型</span>)}
        {...layout}
      >
        {OaApplicationOrderType.description(OaApplicationOrderType.housing)}
      </Form.Item>,
    ];
    return (
      <React.Fragment>
        <CoreForm items={formItems} cols={3} />
      </React.Fragment>
    );
  };

  // BU3-成本类审批流
  const renderBu3 = () => {
    const detail = dot.get(examineFlowInfo, bu3Namespace, {});
    const nodeList = dot.get(detail, 'node_list', []);
    const platformNames = dot.get(detail, 'platform_names', []);
    const code = dot.get(detail, 'industry_codes.0', undefined);
    const costNames = dot.get(detail, 'cost_catalog_scope_names', []);
    // 适用场景
    let scense = '--';
    if (code && industryCodes && industryCodes.length > 0) {
      const currentScense = industryCodes.find(en => en.value === code) || {};
      scense = currentScense.name || '--';
    }
    const formItems = [
      {
        span: 24,
        key: 'BU3-成本类审批流：',
        render: (
          <Form.Item
            labelCol={{ span: 3 }}
            colon={false}
            style={{ marginBottom: 0 }}
            label={(<h3>BU3-成本类审批流：</h3>)}
          />
        ),
      },
      {
        span: 24,
        render: (
          <Form.Item
            label="审批流名称"
            name="bu3ExamineFlow"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 12 }}
            rules={[
            { required: true, message: '请输入审批流名称' },
            ]}
          >
            <XDExamineFlow
              onChange={onChangeBu3ExamineFlow}
              bizType={bizType}
              merchant={RelationExamineFlowMerchantType.bu3}
            />
          </Form.Item>
        ),
      },
      {
        span: 4,
        render: (
          <Form.Item
            label="适用场景"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 10 }}
          >
            {scense || '--'}
          </Form.Item>
        ),
      },
      {
        span: 6,
        render: (
          <Form.Item
            label="适用范围"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <span className="noteWrap">
              {Array.isArray(platformNames) && platformNames.length > 0 ? platformNames.join('、') : '--'}
            </span>
          </Form.Item>
        ),
      },
      {
        span: 10,
        render: (
          <Form.Item
            label="费用分组"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 18 }}
          >
            <span className="noteWrap">
              {Array.isArray(costNames) && costNames.length > 0 ? costNames.join('、') : '--'}
            </span>
          </Form.Item>
        ),
      },
      {
        span: 4,
        render: (
          <Form.Item
            label="是否有RS节点"
            labelCol={{ span: 14 }}
            wrapperCol={{ span: 8 }}
          >
            {dot.get(detail, 'is_rs') ? '是' : '否'}
          </Form.Item>
        ),
      },
      {
        span: 24,
        render: (
          <Form.Item
            label="审批流预览"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
          >
            {/* 节点预览 */}
            <NodeList nodelist={nodeList} />
          </Form.Item>
        ),
      },
    ];
    return (
      <CoreContent>
        <CoreForm items={formItems} cols={3} />
      </CoreContent>
    );
  };

  // 趣活-成本类审批流
  const renderQuhuo = () => {
    const detail = dot.get(examineFlowInfo, namespace, {});
    const nodeList = dot.get(detail, 'node_list', []);
    const platformNames = dot.get(detail, 'platform_names', []);
    const code = dot.get(detail, 'industry_codes.0', undefined);
    const costNames = dot.get(detail, 'cost_catalog_scope_names', []);
    // 适用场景
    let scense = '--';
    if (code && industryCodes && industryCodes.length > 0) {
      const currentScense = industryCodes.find(en => en.value === code) || {};
      scense = currentScense.name || '--';
    }
    const formItems = [
      {
        span: 24,
        key: '趣活-成本类审批流：',
        render: (
          <Form.Item
            labelCol={{ span: 3 }}
            colon={false}
            style={{ marginBottom: 0 }}
            label={(<h3>趣活-成本类审批流：</h3>)}
          />
        ),
      },
      {
        span: 24,
        render: (
          <Form.Item
            label="审批流名称"
            name="examineFlow"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 12 }}
            rules={[
              { required: true, message: '请输入审批流名称' },
            ]}
          >
            <ExamineFlow
              onChange={onChangeExamineFlow}
              bizType={bizType}
              merchant={RelationExamineFlowMerchantType.quhuo}
            />
          </Form.Item>
        ),
      },
      {
        span: 4,
        render: (
          <Form.Item
            label="适用场景"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 10 }}
          >
            {scense || '--'}
          </Form.Item>
        ),
      },
      {
        span: 6,
        render: (
          <Form.Item
            label="适用范围"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <span className="noteWrap">
              {Array.isArray(platformNames) && platformNames.length > 0 ? platformNames.join('、') : '--'}
            </span>
          </Form.Item>
        ),
      },
      {
        span: 14,
        render: (
          <Form.Item
            label="费用分组"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <span className="noteWrap">
              {Array.isArray(costNames) && costNames.length > 0 ? costNames.join('、') : '--'}
            </span>
          </Form.Item>
        ),
      },
      {
        span: 24,
        render: (
          <Form.Item
            label="审批流预览"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
          >
            {/* 节点预览 */}
            <NodeList nodelist={nodeList} />
          </Form.Item>
        ),
      },
    ];
    return (
      <CoreContent>
        <CoreForm items={formItems} cols={3} />
      </CoreContent>
    );
  };

  return (
    <Form layout="horizontal" form={form} onFinish={() => { }}>
      <Alert
        showIcon
        message="提示：节点颜色显示红色为节点无审批人，关联关系不能创建成功！"
        type="error"
        style={{ margin: '10px 0' }}
      />
      {renderHeader()}
      {/* BU3-成本类审批流 */}
      {renderBu3()}
      {/* 趣活-成本类审批流 */}
      {renderQuhuo()}
      <div style={{ textAlign: 'center' }}>
        <Button
          style={{ marginRight: 15 }}
          onClick={() => {
            window.location.href = `/#/Expense/RelationExamineFlow?activeKey=${bizType}`;
          }}
        >返回</Button>
        <Button type="primary" loading={loading} onClick={onSubmit}>启用</Button>
      </div>
    </Form>
  );
}

const mapStateToProps = ({ relationExamineFlow: { examineFlowInfo },
  applicationCommon: { enumeratedValue } }) => {
  return { examineFlowInfo, enumeratedValue };
};

export default connect(mapStateToProps)(Create);
