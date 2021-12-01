/*
* 关联审批流 - 非成本类审批流创建
*/
import dot from 'dot-prop';
import React, { useState, useEffect } from 'react';
import { Form, Button, message, Alert } from 'antd';
import { connect } from 'dva';

import { CoreContent, CoreForm } from '../../../../components/core';
import {
  RelationExamineFlowMerchantType,
  RelationExamineFlowTabType,
} from '../../../../application/define';
import ExamineFlow from '../component/examineFlow';
import XDExamineFlow from '../component/xdExamineFlow';
import NodeList from './nodeList.jsx';

const bizType = RelationExamineFlowTabType.noCost;
const bu3Merchant = RelationExamineFlowMerchantType.bu3;
const merchant = RelationExamineFlowMerchantType.quhuo;
const bu3Namespace = `${bizType}${RelationExamineFlowMerchantType.bu3}`;
const namespace = `${bizType}${RelationExamineFlowMerchantType.quhuo}`;
const enumeratedType = 'examineFlowApplyApplicationTypes';

function Update(props) {
  const { dispatch, examineFlowInfo, enumeratedValue = {}, location: { query = {} } } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState();
  const { [enumeratedType]: dataTypes = [] } = enumeratedValue;
  useEffect(() => {
    dispatch({
      type: 'applicationCommon/getEnumeratedValue',
      payload: { enumeratedType },
    });
    return () => dispatch({ type: 'applicationCommon/resetEnumeratedValue', payload: {} });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: 'relationExamineFlow/fetchExamineFlowXDInfo',
      payload: {
        bizType,
        merchant: bu3Merchant,
        namespace: bu3Namespace,
        flowId: query.xdFlowId,
      },
    });
    dispatch({
      type: 'relationExamineFlow/fetchExamineFlowinfo',
      payload: {
        bizType,
        merchant,
        namespace,
        flowId: query.qhFlowId,
      },
    });
    return () => {
      dispatch({
        type: 'relationExamineFlow/reduceExamineFlowinfo',
        payload: {},
      });
    };
  }, [dispatch, query]);

  useEffect(() => {
    form.setFieldsValue({
      bu3ExamineFlow: dot.get(examineFlowInfo, `${bu3Namespace}._id`, undefined),
      examineFlow: dot.get(examineFlowInfo, `${namespace}._id`, undefined),
    });
  }, [examineFlowInfo, form]);

  // bu3审批流
  const onChangeBu3ExamineFlow = (e) => {
    if (e) {
      dispatch({
        type: 'relationExamineFlow/fetchExamineFlowinfo',
        payload: {
          bizType,
          merchant: bu3Merchant,
          namespace: bu3Namespace,
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

  const onSuccessCallback = () => {
    message.success('请求成功');
    window.location.href = `/#/Expense/RelationExamineFlow?activeKey=${bizType}`;
  };

  const onSubmit = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      const { bu3ExamineFlow, examineFlow } = values;
      const params = {
        xdFlowId: bu3ExamineFlow,
        qhFlowId: examineFlow,
        appWatchFlowId: query.appWatchFlowId,
        pluginId: query.pluginId,
        bizType,
        onLoading: () => {
          setLoading(false);
        },
        onSuccessCallback,
      };
      dispatch({ type: 'relationExamineFlow/updateRelationExamineFlow', payload: params });
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
            label={(<h3>非成本类审批流关联</h3>)}
          />
        ),
      },
    ];
    return (
      <React.Fragment>
        <CoreForm items={formItems} cols={3} />
      </React.Fragment>
    );
  };

  // BU3-非成本类审批流
  const renderBu3 = () => {
    const detail = dot.get(examineFlowInfo, bu3Namespace, {});
    const nodeList = dot.get(detail, 'node_list', []);
    const platformNames = dot.get(detail, 'platform_names', []);
    const applyApplicationTypes = dot.get(detail, 'apply_application_types', []);
    const formItems = [
      {
        span: 24,
        render: (
          <Form.Item
            labelCol={{ span: 3 }}
            colon={false}
            style={{ marginBottom: 0 }}
            label={(<h3>BU3-非成本类审批流：</h3>)}
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
              name={detail.name}
              state={detail.state}
              initItem={{ _id: detail._id, name: detail.name }}
              bizType={bizType}
              merchant={bu3Merchant}
            />
          </Form.Item>
        ),
      },
      {
        span: 9,
        render: (
          <Form.Item
            label="适用类型"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            {Array.isArray(applyApplicationTypes) && applyApplicationTypes.length > 0 ? applyApplicationTypes.map((item) => {
              const type = dataTypes.find(v => v.value === item) || {};
              return type.name;
            }).join('、') : '--'}
          </Form.Item>
        ),
      },
      {
        span: 9,
        render: (
          <Form.Item
            label="适用范围"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <span className="noteWrap">
              {Array.isArray(platformNames) && platformNames.length > 0 ? platformNames.join('、') : '--'}
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

  // 趣活-非成本类审批流
  const renderQuhuo = () => {
    const detail = dot.get(examineFlowInfo, namespace, {});
    const nodeList = dot.get(detail, 'node_list', []);
    const platformNames = dot.get(detail, 'platform_names', []);
    const applyApplicationTypes = dot.get(detail, 'apply_application_types', []);
    const formItems = [
      {
        span: 24,
        render: (
          <Form.Item
            labelCol={{ span: 3 }}
            colon={false}
            style={{ marginBottom: 0 }}
            label={(<h3>趣活-非成本类审批流：</h3>)}
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
              name={detail.name}
              state={detail.state}
              initItem={{ _id: detail._id, name: detail.name }}
              bizType={bizType}
              merchant={merchant}
            />
          </Form.Item>
        ),
      },
      {
        span: 12,
        render: (
          <Form.Item
            label="适用类型"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {Array.isArray(applyApplicationTypes) && applyApplicationTypes.length > 0 ? applyApplicationTypes.map((item) => {
              const type = dataTypes.find(v => v.value === item) || {};
              return type.name;
            }).join('、') : '--'}
          </Form.Item>
        ),
      },
      {
        span: 12,
        render: (
          <Form.Item
            label="适用范围"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <span className="noteWrap">
              {Array.isArray(platformNames) && platformNames.length > 0 ? platformNames.join('、') : '--'}
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
      {/* BU3-非成本类审批流 */}
      {renderBu3()}
      {/* 趣活-非成本类审批流 */}
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

export default connect(mapStateToProps)(Update);
