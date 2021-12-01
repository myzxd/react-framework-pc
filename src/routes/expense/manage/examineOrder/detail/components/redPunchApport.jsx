/**
 * 红冲分摊弹窗
 **/
import React, { useState } from 'react';
import { connect } from 'dva';

import {
  Modal,
  Button,
  Form,
  Alert,
  Popconfirm,
  message,
  Row,
  Col,
} from 'antd';
import {
  ExclamationCircleOutlined,
  PlusSquareOutlined,
  MinusSquareOutlined,
} from '@ant-design/icons';
import { ExpenseCostCenterType } from '../../../../../../application/define';

import RedPunchApportItem from './approtItem';

// 显示的项目
const CommonItemsType = {
  platform: 'platform',   // 平台
  supplier: 'supplier',       // 供应商
  city: 'city',           // 城市
  district: 'district',   // 商圈
};

const RedPunchApport = (props) => {
  const {
    orderDetail = {},
    dispatch,
    examineId,
  } = props;
  const {
    id: orderId = undefined,
    costCenterType,
    platformCodes = [],
    costAccountingInfo: {
      costCenterType: costAccontCenter,
    } = {},
    costAccountingId,
    costAllocationList = [],
  } = orderDetail;
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  // 红冲
  const onClickPunch = async () => {
    const res = await dispatch({ type: 'ticketTag/setBillRedPunch', payload: { id: orderId, examineId } });
    if (res && res.ok) {
      return message.success('红冲成功');
    } else if (res && res.zh_message) {
      message.error(res.zh_message);
      if (
        res.zh_message === '红冲分摊的对象全部被停用/不存在，请重新选择！'
        || res.zh_message === '归属团队的分摊明细, 缺少团队数据'
        || res.zh_message === '归属业主团队的分摊明细，缺少业主数据'
        || res.zh_message === '归属业主团队的分摊明细，缺少业主档案'
        || res.zh_message === '归属组织架构的分摊明细，部门不存在'
        || res.zh_message === '归属人员的分摊明细, 缺少人员数据'
        || res.zh_message === '归属人员的分摊明细，部门不存在'
        || res.zh_message === '归属人员的分摊明细，档案不存在'
        || res.zh_message === '归属资产的分摊明细, 缺少资产数据'
      ) {
        setVisible(true);
      }
    }
  };

  // 红冲
  const onSubmit = async () => {
    const formRes = await form.validateFields();
    const { approt = {} } = formRes;
    const res = await dispatch(
      {
        type: 'ticketTag/setBillRedPunch',
        payload: { id: orderId, records: [...approt], costAccountingId },
      });
    if (res && res.ok) {
      setVisible(false);
    } else if (res && res.zh_message) {
      message.error(res.zh_message);
    }
  };

  const renderModal = () => {
    const alert = orderId ? `费用单${orderId}红冲分摊的对象全部被停用/不存在，请重新选择` : '';

    // item config
    const config = getConfig();
    // 滚动条宽度
    const scrollWidth = config.length * 150;

    return (
      <Modal
        title="选择红冲分摊对象"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => onSubmit()}
      >
        <Alert
          type="error"
          closable
          message={alert}
          showIcon
        />
        <Form initialValues={{ approt: [{}] }} layout="inline" form={form}>
          <Form.List name="approt">
            {(fields, { add, remove }) => {
              return (
                <div style={{ overflow: 'scroll' }}>
                  {fields.map((field, key) => (
                    <Row style={{ margin: '8px 0', width: scrollWidth }}>
                      <Col span={20}>
                        <RedPunchApportItem form={form} field={field} config={config} costCenterType={costCenterType} />
                      </Col>
                      <Col span={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {
                          fields.length === 1
                            ? null
                          : (<Form.Item style={{ display: 'inline-block' }}>
                            <MinusSquareOutlined style={{ fontSize: '16px' }} onClick={() => remove()} />
                          </Form.Item>)
                        }
                        {
                          key === fields.length - 1 && key < costAllocationList.length - 1
                            ? (<Form.Item style={{ display: 'inline-block' }}>
                              <PlusSquareOutlined style={{ fontSize: '16px' }} onClick={() => add()} />
                            </Form.Item>)
                            : null
                        }
                      </Col>
                    </Row>
                  ))}
                </div>
              );
            }}
          </Form.List>
        </Form>
      </Modal>
    );
  };

  // get config
  const getConfig = () => {
    const checkPlatform = ['elem', 'meituan', 'relian', 'zongbu', 'chengtu', 'haluo', 'mobike', 'chengjing', 'lailai'];
    let config = [];
    switch (Number(costAccontCenter)) {
      // 项目
      case ExpenseCostCenterType.project:
        config = [
          CommonItemsType.platform,
        ];
        break;
      // 项目主体总部
      case ExpenseCostCenterType.headquarter:
        config = [
          CommonItemsType.platform,
          CommonItemsType.supplier,
        ];
        break;
      // 城市
      case ExpenseCostCenterType.city:
        config = [
          CommonItemsType.platform,
          CommonItemsType.supplier,
          CommonItemsType.city,
        ];
        break;
      // 城市 或 商圈
      case ExpenseCostCenterType.district:
      case ExpenseCostCenterType.knight:
        config = [
          CommonItemsType.platform,
          CommonItemsType.supplier,
          CommonItemsType.city,
          CommonItemsType.district,
        ];
        break;
      default: config = [CommonItemsType.platform];
    }

    const isPlatform = checkPlatform.findIndex(item => item === platformCodes[0]) > -1;

    // 资产
    if (costCenterType === ExpenseCostCenterType.asset && isPlatform) {
      config = [
        CommonItemsType.platform,
        CommonItemsType.supplier,
        CommonItemsType.city,
        CommonItemsType.district,
      ];
    }

    // 团队
    if (costCenterType === ExpenseCostCenterType.team && isPlatform) {
      config = [
        ...config,
        'teamType',
        'teamId',
      ];
    }

    // 个人
    if (costCenterType === ExpenseCostCenterType.person && isPlatform) {
      config = [
        ...config,
        'teamId',
        'staffId',
      ];
    }

    return config;
  };

  return (
    <div style={{ display: 'inline-block' }}>
      <Popconfirm
        title="红冲后该条费用单将计入成本，还要继续操作吗？"
        okText="继续"
        icon={<ExclamationCircleOutlined />}
        onConfirm={() => onClickPunch()}
      >
        <Button type="primary">红冲</Button>
      </Popconfirm>
      {renderModal()}
    </div>
  );
};

export default connect()(RedPunchApport);
