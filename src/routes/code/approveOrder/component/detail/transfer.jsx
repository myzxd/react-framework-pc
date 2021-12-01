/**
 * code - 审批单详情 - 划账单单据组件
 */
import dot from 'dot-prop';
import React from 'react';
import {
  Form,
} from 'antd';
import {
  CoreForm,
} from '../../../../../components/core';
import {
  Unit,
} from '../../../../../application/define';

// form layout
const formLayout = { labelCol: { span: 3 }, wrapperCol: { span: 14 } };

const TransferItem = ({
  detail = {}, // 费用单详情
}) => {
  // 附件
  const renderFiles = (filesUrl = [], filesName = []) => {
    return (
      <div>
        {
          filesUrl.map((item, index) => {
            return (
              <p key={index}>
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  key={index}
                  href={item}
                >{filesName[index]}</a>
              </p>
            );
          })
        }
      </div>
    );
  };

  // 费用金额 = 付款金额 - 税金
  const costMoney = dot.get(detail, 'total_money', 0) - dot.get(detail, ' total_tax_amount_amount', 0);

  // formItems
  const formItems = [
    <Form.Item
      label="科目"
      {...formLayout}
    >
      {dot.get(detail, 'subject', '--')}
    </Form.Item>,
    <Form.Item
      label="转出方"
      {...formLayout}
    >
      {dot.get(detail, 'accountCenter', '--')}
    </Form.Item>,
    <Form.Item
      label="发票抬头"
      {...formLayout}
    >
      {dot.get(detail, 'invoice', '--')}
    </Form.Item>,
    <Form.Item
      label="付款金额"
      {...formLayout}
    >
      {Unit.exchangePriceCentToMathFormat(dot.get(detail, 'totalMoney', 0))}元
    </Form.Item>,
    <Form.Item
      label="费用金额"
      {...formLayout}
    >
      {Unit.exchangePriceCentToMathFormat(costMoney)}元
    </Form.Item>,
    <Form.Item
      label="事由说明"
      {...formLayout}
    >
      {dot.get(detail, 'note', '--')}
    </Form.Item>,
    <Form.Item
      label="附件"
      {...formLayout}
    >
      {renderFiles(dot.get(detail, 'attachmentPrivateUrls', []), dot.get(detail, 'attachments', []))}
    </Form.Item>,
  ];

  return (
    <React.Fragment>
      <Form className="affairs-flow-detail-basic">
        <CoreForm items={formItems} cols={1} />
      </Form>
    </React.Fragment>
  );
};

export default TransferItem;
