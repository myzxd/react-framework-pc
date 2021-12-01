export const borrowingDetail = {
  _id: 'sadfasddsffasf',
  loan_type: 1,
  platform_code: 'elem',
  supplier_id: '5a62f3dfce6d2a295a472022',
  city_code: 'baotou_elem',
  biz_district_id: '5ad95e8bce6d2a4b7b4418e0',
  actual_loanr_info: {
    name: '刀锋意志',
    identity: '178890899087297846',
    phone: '18288989898',
  },
  payee_account_info: {
    card_num: '1111111111111111111111',
    bank_details: 1,
  },
  loan_money: 200000,
  loan_note: '泡妞',
  asset_ids: ['asdasfsda.doc',
  'asdasdwewrtv.xlsx',
  'tuwertgwerg.xls',],
  repayment_method: 1,
  repayment_cycle: 1,
  expected_repayment_time: 20190909,
}

export const repayInfo = {
  _id: 'sadfasddsffasf',
  loan_order_id: 'xxxxxxxxxxxxx',
  repayment_money: 99900,
  repayment_note: "还款备注+1",
  asset_ids: [
    'asdasfsda.doc',
    'asdasdwewrtv.xlsx',
    'tuwertgwerg.xls',
  ],
}

const borrowOrderData = [];
for (let i = 0; i < 30; i++) {
  borrowOrderData.push({
    _id: `${i}123456789`,
    platform_name: '美团',
    supplier_name: '上海易即达网络科技有限公司',
    city_name: '南京市_美团',
    biz_district_name: '上海易即达【南京】创业河站',
    actual_loan_info: {
      name: `王晋${i}`,
    },
    loan_type: 1,
    loan_note: `出差${i}次`,
    application_order_info: {
      flow_info: {
        name: `12${i}审批`,
      },
      current_flow_node_info: {
        name: `第${i}节点`
      },
    },
    state: 10,
    paid_state: -100,
    loan_money: Number(`${i}0000`),
    repayment_money: Number(`${i}000`),
    non_repayment_money: Number(`${i}000`),
    repayment_state: 50,
    applyAccountInfo: '王晋',
    created_at: 20190101,
    expected_repayment_time: 20190707,
  });
}
export const borrowOrderList = {
  data: borrowOrderData,
  dataCount: borrowOrderData.length,
}

const repaymentOrderData = [];
for (let i = 0; i < 30; i++) {
  repaymentOrderData.push({
    _id: `${i}123456789`,
    loan_order_id: `${i}0987654321`,
    apply_account_info: {
      name: `王晋${i}`,
    },
    repayment_money: Number(`1000${i}`),
    application_order_info: {
      flow_info: {
        name:`12${i}审批`,
      },
      current_flow_node_info: {
        name: `第${i}节点`,
      },
      platform_names: '美团',
      supplier_names: '上海易即达网络科技有限公司',
      city_names: '南京市_美团',
      biz_district_names: '上海易即达【南京】创业河站',
    },
    state: 10,
    done_at: 20190707,
  });
}
export const repaymentOrderList = {
  data: repaymentOrderData,
  dataCount: repaymentOrderData.length,
}
