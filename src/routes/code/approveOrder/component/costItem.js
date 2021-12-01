/**
 * code - 付款审批 - 通用模版
 */
import is from 'is_js';
import dot from 'dot-prop';
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Form, InputNumber, Popconfirm, Input, Card, Button, message, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
} from '@ant-design/icons';

import { CoreContent, CoreForm } from '../../../../components/core';
import {
  Unit,
  ExpenseCollectionType, // 支付明细收款方式枚举
  CodeSubmitType,
  CodeApproveOrderPayState, // code审批单付款状态
  CodeTicketState, // code审批单验票状态
} from '../../../../application/define';
import ComponentSubject from '../../components/subject'; // 科目
import ComponentCodeBusinessAccounting from '../../components/codeBusinessAccounting'; // code核算中心
import ComponentTeamBusinessAccounting from '../../components/teamBusinessAccounting'; // team核算中心
import PageUpload from '../../components/upload'; // 附件
import CollectionItem from '../../components/collection/collectionItem'; // 支付明细
import ComponentCostItemDetail from './costItemDetail'; // 详情
import ComponentTeamInvoiceTitles from '../../components/teamInvoiceTitles'; // team发票抬头
import styles from './style.less';

const { TextArea } = Input;
const reg = new RegExp('^[1][3,4,5,6,7,8,9][0-9]{9}$');
function ComponentCostItem(props) {
  const { formKey, index, orderId, item, dispatch, orderCostItem, costCenterType } = props;
  // 命名空间（拷贝的费用单与原来的费用单区分）
  const namespace = `${item._id}-${formKey}`;
  let isSubmit = false;
  const detail = orderCostItem[namespace] || {};
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 判断是否有值
    if (item._id && orderId) {
      const payload = {
        id: item._id,
        orderId,
        namespace,
      };
      dispatch({ type: 'codeOrder/fetchOrderCostItem', payload });
    }
    return () => {
      // 清除数据
      dispatch({ type: 'codeOrder/reduceOrderCostItem', payload: { namespace, result: {} } });
    };
  }, [dispatch, item, orderId, namespace]);

  useEffect(() => {
    // 判断是否有数据
    if (item._id && is.existy(detail) && is.not.empty(detail)) {
      const payeeList = dot.get(detail, 'payee_list', []); // 支付明细
      form.setFieldsValue({
        subjectId: dot.get(detail, 'cost_accounting_id', undefined), // 科目
        codeBusinessAccount: dot.get(detail, 'cost_target_id', undefined), // 核算中心
        invoiceTitle: dot.get(detail, 'invoice_title', undefined),
        money: dot.get(detail, 'total_money') ? Unit.exchangePriceToYuan(dot.get(detail, 'total_money')) : undefined, // 金额,
        note: dot.get(detail, 'note', undefined), // 说明,
        assets: PageUpload.getInitialValue(detail, 'attachment_private_urls'), // 附件
        bankList: payeeList.map((v, i) => { // 支付明细
          const j = { ...v, flag: true };
          // 判断金额类型
          if (typeof v.money === 'number') {
            j.money = Unit.exchangePriceToYuan(v.money);
          }
          j.num = i + 1; // 唯一key
          return j;
        }),
      });
    }
  }, [form, item._id, detail]);

  // 删除
  const onClickRemove = () => {
    dispatch({
      type: 'codeOrder/removeOrderCostItem',
      payload: {
        id: item._id,
        onSucessCallback: props.onInterfaceDetail,
      },
    });
  };

  // 移除费用单
  const onClickRemoveCost = () => {
    // 不为拷贝的费用单
    if (item._id && item.isShowCopy !== true) {
      onClickRemove();
      return;
    }
    // 移除费用单
    if (props.onClickRemoveCost) {
      props.onClickRemoveCost(formKey);
    }
  };

  // 取消
  const onClickReset = () => {
    // 重置成接口数据
    // 判断是否有数据并且不是复制的数据
    if (item.isShowCopy !== true && is.existy(detail) && is.not.empty(detail)) {
      const payeeList = dot.get(detail, 'payee_list', []); // 支付明细
      form.setFieldsValue({
        subjectId: dot.get(detail, 'cost_accounting_id', undefined), // 科目
        codeBusinessAccount: dot.get(detail, 'cost_target_id', undefined), // 核算中心
        invoiceTitle: dot.get(detail, 'invoice_title', undefined),
        money: dot.get(detail, 'total_money') ? Unit.exchangePriceToYuan(dot.get(detail, 'total_money')) : undefined, // 金额,
        note: dot.get(detail, 'note', undefined), // 说明,
        assets: PageUpload.getInitialValue(detail, 'attachment_private_urls'), // 附件
        bankList: payeeList.map((v, i) => { // 支付明细
          const j = { ...v, flag: true };
          // 判断金额类型
          if (typeof v.money === 'number') {
            j.money = Unit.exchangePriceToYuan(v.money);
          }
          j.num = i + 1; // 唯一key
          return j;
        }),
      });
      return;
    }
    form.resetFields();
    form.setFieldsValue({
      bankList: [{ payee_type: ExpenseCollectionType.onlineBanking, num: 1, flag: true }],
    });
  };

  // 科目改变
  const onChangeSubject = () => {
    // 核算中心清空
    form.setFieldsValue({
      codeBusinessAccount: undefined,
      invoiceTitle: undefined,
    });
  };

  // 支付明细
  const onChangePayeeInfo = (value = []) => {
    // 判断是否为数组
    if (Array.isArray(value)) {
      // 判断，支付类型是否为钱包时并且没有档案id
      const flag = value.some(v => v.loading === true);
      setLoading(flag);
    }
  };

  // 成功回调
  const onSucessCallback = () => {
    setLoading(false);
    isSubmit = false;
    // 调用审批单详情接口
    if (props.onInterfaceDetail) {
      props.onInterfaceDetail();
    }
  };

  // 保存
  const onSave = () => {
    // setTimeout(() => {
    form.validateFields().then((values) => {
      setLoading(true);
      // 判断是否是编辑, 判断不是复制的情况 防止重复点击
      if (item.isShowCopy !== true && item._id && isSubmit === false) {
        isSubmit = true;
        // 编辑
        dispatch({
          type: 'codeOrder/updateOrderCostItem',
          payload: {
            ...values,
            id: item._id,
            namespace,
            assets: values.assets || [],
            onSucessCallback,
            onErrorCallback: () => {
              setLoading(false);
              isSubmit = false;
            },
          },
        });
        return;
      }

      // 防止重复点击
      if (isSubmit === false) {
        isSubmit = true;
        // 创建
        dispatch({
          type: 'codeOrder/createOrderCostItem',
          payload: {
            ...values,
            orderId,
            onSucessCallback,
            onErrorCallback: () => {
              setLoading(false);
              isSubmit = false;
            },
          },
        });
      }
    }).catch((errorInfo) => {
      // 滚动报错第一个字段
      form.scrollToField(errorInfo.errorFields[0].name, {
        behavior: actions =>
          actions.forEach(({ el, top }) => {
            // eslint-disable-next-line no-param-reassign
            el.scrollTop = top - 5;
          }),
      });
    });
    // });
  };

  // 复制
  const onCopy = () => {
    if (props.onCopy) {
      props.onCopy(item._id);
    }
  };

  // 编辑
  const onEdit = () => {
    if (props.onIsShowEdit) {
      props.onIsShowEdit(index);
    }
  };

  // 核算中心
  const onChangeCodeBusinessAccount = (e, optionItem) => {
    const { supplier_name: supplierName } = optionItem;
    form.setFieldsValue({ invoiceTitle: supplierName });
  };

  const getValueFromEventMoney = (e) => {
    // 判断是否大于最大金额
    if (e > Unit.maxMoney) {
      return Unit.maxMoney;
    }
    return e;
  };

  // 改变金额校验支付明细
  // const onChangeMoney = () => {
  // form.validateFields(['bankList']);
  // };

  // 校验金额集合
  const onValidatorBankListMoney = (rule, value, callback) => {
    const totalMoney = Number(form.getFieldValue('money') || 0).toFixed(2);
    if (value) {
      for (const v of value) {
        if (!v.card_name || !v.bank_details || !v.card_num || typeof v.money !== 'number') {
          message.error('请将收款人，开户支行，收款账户，金额请填写完整');
          // callback('请将收款人，开户支行，收款账户，金额请填写完整');
          return;
        }
        // 判断收款方式为钱包时手机号必填
        if (Number(v.payee_type) === ExpenseCollectionType.wallet) {
          if (!v.card_phone) {
            message.error('请将手机号请填写完整');
            // callback('请将手机号请填写完整');
            return;
          }
        }
        if (v.card_phone) {
          if (!reg.test(v.card_phone)) {
            message.error('请将手机号请填写完整');
            // callback('手机号格式错误');
            return;
          }
        }
      }
    }

    // 金额汇总
    const bankMoneys = value.map(v => Number(v.money || 0));
    // 金额之和
    const moneys = bankMoneys.reduce((a, b) => a + b).toFixed(2);
    // 差额
    const calculationMoney = Number(totalMoney - moneys).toFixed(2);
    if (Number(calculationMoney) !== 0) {
      message.error('收款信息金额与费用总金额不一致');
      // callback('收款信息金额与费用总金额不一致');
      return;
    }
    callback();
  };

  // 预览支持格式内容
  const text = (<div>
    <span>目前支持的上传格式：- office文件(doc/docx/ppt/pptx/xls/xlsx)</span>
    <span>- Rtf文档/- pdf文件/ - 图片文件(jpg/jpeg/png/gif/bmp/tiff/webp)</span>
    <span>- txt文件/- csv文件/-eml格式 /- zip格式/- rar格式(不能上传有密码的此类文件)</span>
  </div>);
  // 渲染表单
  const renderForm = () => {
    const formItems = [
      <Form.Item
        name="subjectId"
        label="科目"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        rules={[{ required: true, message: '请选择科目' }]}
      >
        <ComponentSubject
          showSearch
          optionFilterProp="children"
          placeholder="请选择科目"
          orderId={orderId}
          onChange={onChangeSubject}
        />
      </Form.Item>,
      <Form.Item
        name="invoiceTitle"
        label="发票抬头"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        rules={[{ required: true, message: '请选择发票抬头' }]}
      >
        <ComponentTeamInvoiceTitles
          allowClear
          showSearch
          optionFilterProp="children"
          placeholder="请选择发票抬头"
          costCenterType={costCenterType}
        />
      </Form.Item>,
      <Form.Item
        name="money"
        label="金额"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 10 }}
        rules={[{ required: true, message: '请填写金额' }]}
        getValueFromEvent={getValueFromEventMoney}
      >
        <InputNumber
          precision={2}
          min={0.01}
          max={Unit.maxMoney}
          style={{ width: '100%' }}
          placeholder="请填写金额"
          formatter={Unit.maxMoneyLimitDecimalsFormatter}
          parser={Unit.limitDecimalsParser}
        // onChange={onChangeMoney}
        />
      </Form.Item>,
      {
        span: 24,
        render: (
          <Form.Item
            name="note"
            label="事由说明"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 18 }}
          >
            <TextArea
              placeholder="请填写"
              rows={4}
            />
          </Form.Item>
        ),
      },
      {
        span: 24,
        render: (
          <Form.Item
            label={<div><Tooltip placement="top" title={text}>
              <span className={styles['code-order-cost-tooltip-title']}>!</span>
            </Tooltip><span>上传附件</span></div>}
            name="assets"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
          >
            <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
          </Form.Item>
        ),
      },
    ];
    // 判断是否是code
    if (costCenterType === CodeSubmitType.code) {
      formItems.splice(1, 0,
        <Form.Item
          key="codeBusinessAccount"
          noStyle
          shouldUpdate={
            (prevValues, curValues) => (
              prevValues.subjectId !== curValues.subjectId
            )
          }
        >
          {({ getFieldValue }) => {
            return (
              <Form.Item
                name="codeBusinessAccount"
                label="核算中心"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                rules={[{ required: true, message: '请选择核算中心' }]}
              >
                <ComponentCodeBusinessAccounting
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择核算中心"
                  orderId={orderId}
                  subjectId={getFieldValue('subjectId')}
                  onChange={onChangeCodeBusinessAccount}
                />
              </Form.Item>
            );
          }}
        </Form.Item>,
      );
    }
    // 判断是否是team
    if (costCenterType === CodeSubmitType.team) {
      formItems.splice(1, 0,
        <Form.Item
          noStyle
          key="codeBusinessAccount"
          shouldUpdate={
            (prevValues, curValues) => (
              prevValues.subjectId !== curValues.subjectId
            )
          }
        >
          {({ getFieldValue }) => {
            return (
              <Form.Item
                name="codeBusinessAccount"
                label="核算中心"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                rules={[{ required: true, message: '请选择核算中心' }]}
              >
                <ComponentTeamBusinessAccounting
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择核算中心"
                  subjectId={getFieldValue('subjectId')}
                  orderId={orderId}
                />
              </Form.Item>
            );
          }}
        </Form.Item>,
      );
    }
    return (
      <CoreForm items={formItems} cols={2} />
    );
  };

  // 计算金额
  const renderCalculationMoney = () => {
    const totalMoney = Number(form.getFieldValue('money') || 0).toFixed(2);
    const bankList = form.getFieldValue('bankList') || [];
    // 金额汇总
    const bankMoneys = bankList.map(v => Number(v.money || 0));
    // 金额之和
    let moneys = '0.00';
    if (bankMoneys.length > 0) {
      moneys = bankMoneys.reduce((a, b) => a + b).toFixed(2);
    }
    // 差额
    const calculationMoney = Number(totalMoney - moneys).toFixed(2);
    return (
      <div style={{ textAlign: 'right' }}>
        <span>费用总金额：<span style={{ fontWeight: 'bold' }}>{Unit.exchangePriceToMathFormat(totalMoney)} 元</span></span>
        <span style={{ marginLeft: 20 }}>当前合计金额：<span style={{ fontWeight: 'bold' }}>{Unit.exchangePriceToMathFormat(moneys)}元</span></span>
        {
          Number(calculationMoney) === 0 ? (
            <CheckCircleOutlined
              style={{ marginLeft: 20, color: '#52c41a' }}
            />) : (
              <span style={{ marginLeft: 20 }}>差额：<span style={{ fontWeight: 'bold' }}>
                <span
                  style={{ color: 'red' }}
                >{Unit.exchangePriceToMathFormat(calculationMoney)}</span> 元</span></span>
            )
        }
      </div>
    );
  };

  // 支付明细
  const renderPayeeInfo = () => {
    const formItems = [
      <Form.Item
        name="bankList"
        labelCol={{ span: 0 }}
        wrapperCol={{ span: 24 }}
        rules={[{ validator: onValidatorBankListMoney }]}
        validateTrigger="onSave"
        initialValue={[{ payee_type: ExpenseCollectionType.onlineBanking, num: 1 }]}
      >
        <CollectionItem formKey={formKey} onChange={onChangePayeeInfo} />
      </Form.Item>,
    ];
    return (
      <CoreContent
        title="支付明细"
        color="rgba(255, 119, 0, 0.5)"
        style={{
          backgroundColor: 'rgba(255, 226, 200, 0.15)',
        }}
      >
        <CoreForm items={formItems} cols={1} />
        <Form.Item
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
          shouldUpdate={
            (prevValues, curValues) => (
              prevValues.money !== curValues.money ||
              prevValues.bankList !== curValues.bankList
            )
          }
        >
          {() => renderCalculationMoney()}
        </Form.Item>
      </CoreContent>
    );
  };

  // 底部
  const renderFooter = () => {
    // 付款状态已付款或无需打款情况下不可以进行操作
    if (props.paidState === CodeApproveOrderPayState.done ||
      props.paidState === CodeApproveOrderPayState.noNeed) {
      return null;
    }
    // 验票状态已验票不可以进行操作
    if (props.inspectBillState === CodeTicketState.already) {
      return null;
    }

    return (
      <div style={{ textAlign: 'right', borderTop: '1px solid #ccc', paddingTop: 10 }}>
        {/* isShowEdit判断是否时编辑，isShowCopy判断是否时复制 */}
        {item.isShowEdit && item.isShowCopy !== true ?
          (
            <React.Fragment>
              <Popconfirm
                title="您是否确定移除当前费用单"
                onConfirm={onClickRemove}
                okText="确定"
                cancelText="取消"
              >
                <a style={{ color: 'red' }}>移除费用单</a>
              </Popconfirm>
              <Button onClick={onCopy} style={{ marginLeft: 15 }}>复制</Button>
              <Button onClick={onEdit} style={{ marginLeft: 15 }}>编辑</Button>
            </React.Fragment>
          ) :
          (
            <React.Fragment>
              <Popconfirm
                title="您是否确定移除当前费用单"
                onConfirm={onClickRemoveCost}
                okText="确定"
                cancelText="取消"
              >
                <a style={{ color: 'red' }}>移除费用单</a>
              </Popconfirm>
              <a style={{ marginLeft: 15 }} onClick={onClickReset}>重置</a>
              <Button loading={loading} onClick={onSave} style={{ marginLeft: 15 }}>保存</Button>
            </React.Fragment>
          )
        }
      </div>
    );
  };

  // 编辑
  const renderUpdateContent = () => {
    return (
      <React.Fragment>
        {/* 渲染表单 */}
        {renderForm()}
        {/* 支付明细 */}
        {renderPayeeInfo()}
        {/* 底部 */}
        {renderFooter()}
      </React.Fragment>
    );
  };

  // 详情
  const renderUpdateDetail = () => {
    return (
      <React.Fragment>
        <ComponentCostItemDetail detail={detail} costCenterType={costCenterType} />
        {/* 底部 */}
        {renderFooter()}
      </React.Fragment>
    );
  };

  // 渲染内容
  const renderContent = () => {
    if (item.isShowEdit) {
      // 详情
      return renderUpdateDetail();
    }
    // 创建&编辑
    return renderUpdateContent();
  };
  const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
  return (
    <Card
      key={formKey}
      className={styles['card-box']}
    >
      {
        costCenterType === CodeSubmitType.code ? (
          <span className={styles['card-box-code']}>{CodeSubmitType.description(costCenterType)}</span>
        ) : (
          <span className={styles['card-box-team']}>{CodeSubmitType.description(costCenterType)}</span>
          )
      }
      <div className={styles['card-title']}>
        费用单申请</div>
      <Form form={form} {...layout}>
        {/* 渲染内容 */}
        {renderContent()}
      </Form>
    </Card>
  );
}
const mapStateToProps = ({
  codeOrder: { orderCostItem },
}) => {
  return { orderCostItem };
};
export default connect(mapStateToProps)(ComponentCostItem);
