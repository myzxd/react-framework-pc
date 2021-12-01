/**
 * code - 审批单编辑页
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useState, useRef, useEffect } from 'react';
import { Button, message, Alert, Spin } from 'antd';
import {
  PlusOutlined,
} from '@ant-design/icons';

import {
  Unit,
  CodeApproveOrderType,
  CodeApproveOrderPayState, // code审批单付款状态
  CodeTicketState, // code审批单验票状态
  ExpenseExamineOrderProcessState,
} from '../../../application/define';
import { CoreTabs } from '../../../components/core';
import BasicInfo from './component/detail/basicInfo'; // 基本信息
import TravelBusiness from './component/travelBusiness'; // 差旅
import Associated from '../components/associated'; // 关联信息
import ThemeTags from './component/operation/themeTags'; // 主题标签
import ComponentCostItem from './component/costItem'; // 通用模版
import Circulation from './component/detail/circulation'; // 流转记录
import styles from './style.less';

const ApproveCreate = (props) => {
  const scrollBox = useRef();
  const [isAdd, setIsAdd] = useState(false); // 通用模版form
  const [costFormItem, setcostFormItem] = useState([]); // 通用模版form
  // const [costFormItem, settravelFormItem] = useState([{ formKey: 1 }]); // 差旅
  const [loading, setLoading] = useState(false); // 页面loading
  const { location = {}, dispatch, approveOrderDetail } = props;
  const {
    cost_center_type: costCenterType,
    template_type: templateType,
    inspect_bill_state: inspectBillState, // 验票状态
    paid_state: paidState, // 付款状态
  } = approveOrderDetail; // 类型
  const { query = {} } = location; // url参数

  // 审批流id
  const { orderId } = query;

  useEffect(() => {
    orderId && dispatch({
      type: 'codeOrder/getApproveOrderDetail',
      payload: { orderId },
    });

    return () => {
      dispatch({ type: 'codeOrder/resetApproveOrderDetail' });
    };
  }, [dispatch, orderId]);


  useEffect(() => {
    // 判断是否是点击添加
    if (isAdd === true) {
      const { scrollHeight } = scrollBox.current;
      // 通用模版
      if (templateType === CodeApproveOrderType.universal) {
        scrollBox.current.scrollTop = scrollHeight - 600;
      }
      // 差旅
      if (templateType === CodeApproveOrderType.travel) {
        scrollBox.current.scrollTop = scrollHeight - 900;
      }
      setIsAdd(false);
    }
  }, [costFormItem, isAdd, templateType]);

  // 调用详情接口
  const onInterfaceDetail = () => {
    orderId && dispatch({
      type: 'codeOrder/getApproveOrderDetail',
      payload: { orderId },
    });
  };

  useEffect(() => {
    // 判断通用模版所有数据是否保存完成
    if (templateType === CodeApproveOrderType.universal) {
      const costOrderIds = dot.get(approveOrderDetail, 'biz_order_ids', []);
      // 通用模版（费用申请）
      const costOrderItem = costOrderIds.map((v, i) => {
        // isShowEdit 是否显示编辑
        return { _id: v, isShowEdit: true, formKey: i + 1 };
      });
      // 通用模版（费用申请）
      setcostFormItem(costOrderItem);
    }
    // 判断差旅数据是否保存完成
    if (templateType === CodeApproveOrderType.travel) {
      const costOrderIds = dot.get(approveOrderDetail, 'biz_order_ids', []);
      // 通用模版（费用申请）
      const costOrderItem = costOrderIds.map((v, i) => {
        // isShowEdit 是否显示编辑
        return { _id: v, isShowEdit: true, formKey: i + 1 };
      });
      // 判断是否有数据
      if (is.existy(costOrderIds) && is.not.empty(costOrderIds)) {
      // 差旅
        setcostFormItem(costOrderItem);
      }
    }
  }, [approveOrderDetail, templateType]);

  // 提交成功回调
  const onSubmitSucessCallback = () => {
    setLoading(false);
    message.success('创建成功');
    window.location.href = '/#/Code/PayOrder';
  };

  // 判断数据是否保存
  const getIsShowSave = () => {
    let flag;
    // 判断通用模版所有数据是否保存完成
    if (templateType === CodeApproveOrderType.universal) {
      flag = costFormItem.some(v => v.isShowEdit !== true);
    }
    // 判断差旅数据是否保存完成
    if (templateType === CodeApproveOrderType.travel) {
      flag = costFormItem.some(v => v.isShowEdit !== true);
    }
    return flag;
  };

  // 提交
  const onSubmit = async () => {
    const flag = getIsShowSave();
    let isShowadd; // 判断是否添加数据
    // 判断通用模版所有数据是否保存完成
    if (templateType === CodeApproveOrderType.universal) {
      isShowadd = costFormItem.length === 0;
    }
    // 判断差旅数据是否保存完成
    if (templateType === CodeApproveOrderType.travel) {
      isShowadd = costFormItem.length === 0;
    }
    // 判断数据是否添加了
    if (isShowadd === true) {
      return message.error('请添加数据');
    }
    if (flag === true) {
      return message.error('请将当前数据保存完成后再提交');
    }
    setLoading(true);
    dispatch({
      type: 'codeOrder/createSubmitOrder',
      payload: {
        orderId,
        onErrorCallback: () => {
          setLoading(false);
        },
        onSuccessCallback: onSubmitSucessCallback,
      },
    });
  };

  // 添加
  const onClickAdd = () => {
    const len = costFormItem.length;
    const formKey = len - 1 < 0 ? 0 : costFormItem[len - 1].formKey;
    const formitem = costFormItem[len - 1] || {}; // 当前项
    // 判断当前费用单是否保存成功
    if (formKey !== 0 && !formitem.isShowEdit) {
      return message.error('请将所有数据操作成功后，再进行添加');
    }
    setIsAdd(true);
    setcostFormItem([...costFormItem, { formKey: formKey + 1 }]);
  };

  // 复制费用单
  const onCostItemCopy = (id) => {
    const len = costFormItem.length;
    const formKey = len - 1 < 0 ? 0 : costFormItem[len - 1].formKey;
    const formitem = costFormItem[len - 1] || {}; // 当前项
    // 判断当前费用单是否保存成功
    if (formKey !== 0 && !formitem.isShowEdit) {
      return message.error('当前存在编辑状态下的费用单，请操作完成后在进行复制');
    }
    setIsAdd(true);
    setcostFormItem([...costFormItem, {
      formKey: formKey + 1,
      isShowCopy: true,
      _id: id,
    }]);
  };

  // 编辑
  const onIsShowEdit = (index) => {
    const flag = costFormItem.some(v => v.isShowEdit !== true);
    if (flag) {
      return message.error('当前存在正在编辑的费用单，请操作完成后再进行编辑');
    }
    costFormItem[index].isShowEdit = !costFormItem[index].isShowEdit;
    setcostFormItem([...costFormItem]);
  };

  // 移除费用单
  const onClickRemoveCost = (formKey) => {
    const costItems = costFormItem.filter(v => v.formKey !== formKey);
    setcostFormItem([...costItems]);
  };

  // 渲染关联信息
  const renderAssociatedInfo = () => {
    // 关联id
    return (
      <Associated
        key="1"
        orderId={orderId}
        onInterfaceDetail={onInterfaceDetail}
      />
    );
  };

  // 添加费用单操作按钮
  const renderAddCostBtn = () => {
    // 付款状态已付款或无需打款情况下不可以进行操作
    if (paidState === CodeApproveOrderPayState.done ||
      paidState === CodeApproveOrderPayState.noNeed) {
      return null;
    }

    // 验票状态已验票不可以进行操作
    if (inspectBillState === CodeTicketState.already) {
      return null;
    }

    // 判断是否是通用模版
    if (templateType === CodeApproveOrderType.universal
      || templateType === CodeApproveOrderType.travel
    ) {
      return (
        <div>
          <Button
            className={styles['code-approveOder-btn']}
            onClick={onClickAdd}
          >
            <PlusOutlined />添加下一个费用单</Button>
        </div>
      );
    }
    return null;
  };

  // 渲染关联信息和主题标签
  const renderTab = () => {
    // 主题标签
    const themeTagProps = {
      orderId,
      isUpdate: true,
    };
    const tabItems = [
      // 关联审批
      {
        title: '关联审批',
        content: renderAssociatedInfo(),
        key: 'relateOrder',
      },
      // 主题标签
      {
        title: '主题标签',
        content: <ThemeTags
          {...themeTagProps}
        />,
        key: 'themeLabel',
      },
    ];

    return (
      <CoreTabs items={tabItems} />
    );
  };

    // 渲染对应模版
  const renderStencil = () => {
      // 差旅报销
    if (templateType === CodeApproveOrderType.travel) {
      return (
        <React.Fragment>
          {
            costFormItem.map((v, i) => {
              return (
                <TravelBusiness
                  key={v.formKey}
                  formKey={v.formKey}
                  index={i}
                  item={v}
                  orderId={orderId}
                  paidState={paidState}
                  costCenterType={costCenterType}
                  inspectBillState={inspectBillState}
                  detail={approveOrderDetail}
                  onIsShowEdit={onIsShowEdit}
                  onInterfaceDetail={onInterfaceDetail}
                  onClickRemoveCost={onClickRemoveCost}
                />
              );
            })
          }
        </React.Fragment>
      );
    }
    // 通用模版
    if (templateType === CodeApproveOrderType.universal) {
    // 通用模版
      return (
        <React.Fragment>
          <div style={{ margin: '5px 0' }}>
            <Alert type="warning" showIcon message="多个费用单时请保持【发票抬头】一致，否则无法提交" />
          </div>

          {
          costFormItem.map((v, i) => {
            return (
              <ComponentCostItem
                key={v.formKey}
                formKey={v.formKey}
                index={i}
                item={v}
                orderId={orderId}
                paidState={paidState}
                costCenterType={costCenterType}
                inspectBillState={inspectBillState}
                onCopy={onCostItemCopy}
                onIsShowEdit={onIsShowEdit}
                onClickRemoveCost={onClickRemoveCost}
                onInterfaceDetail={onInterfaceDetail}
              />
            );
          })
          }
        </React.Fragment>
      );
    }
    return null;
  };
    // basicInfo prop
  const basicProps = {
    approveOrderDetail,
    dispatch,
  };

  // circulation props
  const circulationProps = {
    approveOrderDetail,
    dispatch,
  };
  const costOrderIds = dot.get(approveOrderDetail, 'biz_order_ids', []);
  const flag = getIsShowSave();
  let isShowadd; // 判断是否添加数据
  // 判断通用模版所有数据是否保存完成
  if (templateType === CodeApproveOrderType.universal) {
    isShowadd = costFormItem.length === 0;
  }
  // 判断差旅数据是否保存完成
  if (templateType === CodeApproveOrderType.travel) {
    isShowadd = costFormItem.length === 0;
  }

  return (
    <React.Fragment>
      {
        loading
        ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999,
              position: 'absolute',
              top: 0,
              left: 0,
              background: 'rgba(0, 0, 0, .1)',
            }}
          >
            <Spin tip="Loading..." />
          </div>
        ) : null
      }

      {/* 标题 */}
      <div className={styles['code-approveOder-title']}>
        {approveOrderDetail.name}
      </div>
      <div ref={scrollBox} style={{ overflowY: 'scroll', maxHeight: 570 }}>
        {/* 基本信息 */}
        <BasicInfo {...basicProps} />

        {/* 渲染关联信息和主题标签 */}
        {renderTab()}

        {/* 渲染对应模版 */}
        {renderStencil()}
      </div>
      {/* 添加费用单操作按钮 */}
      {renderAddCostBtn()}
      <div style={{ textAlign: 'right' }}>
        <span style={{ marginRight: 30 }}>
        共 {costOrderIds.length} 张单据  金额合计 <a>{Unit.exchangePriceCentToMathFormat(dot.get(approveOrderDetail, 'total_money', 0))}元</a>
        </span>
        <Button
          onClick={() => {
            window.location.href = '/#/Code/PayOrder';
          }} style={{ marginRight: 10 }}
        >返回</Button>
        <Button disabled={isShowadd || flag} type="primary" onClick={onSubmit}>提交</Button>
      </div>
      {
          // 草稿状态不显示流转记录
          dot.get(approveOrderDetail, 'state', undefined) !== ExpenseExamineOrderProcessState.pendding ? (
            // 流转记录
            <Circulation {...circulationProps} />
        ) : null
      }

    </React.Fragment>);
};

const mapStateToProps = ({
  codeOrder: { approveOrderDetail },
}) => {
  return { approveOrderDetail };
};

export default connect(mapStateToProps)(ApproveCreate);

