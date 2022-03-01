/* eslint-disable */
import dva from 'dva';
import ReactDOM from 'react-dom';
import React from 'react';
import createLoading from 'dva-loading';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import { History } from './application/utils/history';
import application from './application';
// import './index.html';
import './index.css';

import router from './router'
// import core from './models/application/core'
// import common from './models/application/common'
// import subscription from './models/application/subscription'
// import files from './models/application/files'
import setting from './models/application/setting'
import adminManage from './models/admin/manage'
// import accountManage from './models/account/manage'
// import employeeManage from './models/employee/manage'
// import transport from './models/employee/transport'
// import contract from './models/employee/contract'
// import fileChange from './models/employee/fileChange'
// import turnover from './models/employee/turnover'
// import statisticsData from './models/employee/statisticsData'
// import society from './models/employee/society'
// import supplierManage from './models/supplier/manage'
// import city from './models/system/city'
// import systemManage from './models/system/manage'
// import recommendedcompany from './models/system/recommendedcompany'

// import districtManage from './models/assets/district/manage'
// import tag from './models/assets/district/tag'
// import manager from './models/team/manager'
// import coachDepartment from './models/team/coachDepartment'
// import operations from './models/team/operations'
// import ownerBusiness from './models/team/ownerBusiness'
// import teacher from './models/team/teacher'
// import account from './models/team/account'
// import message from './models/team/message'
// import nothingOwner from './models/team/nothingOwner'
// import authorize from './models/authorize'
// import system from './models/system'
// import download from './models/system/download'
// import merchants from './models/system/merchants'
// import upload from './models/upload'
// import operationManage from './models/operationManage'
// import set from './models/supply/set'
// import procurement from './models/supply/procurement'
// import distribution from './models/supply/distribution'
// import details from './models/supply/details'
// import deductions from './models/supply/deductions'
// import deductSummarize from './models/supply/deductSummarize'
// import travelApplication from './models/expense/travelApplication'
// import subject from './models/expense/subject'
// import type from './models/expense/type'
// import examineFlow from './models/expense/examineFlow'
// import examineOrder from './models/expense/examineOrder'
// import costOrder from './models/expense/costOrder'
// import houseContract from './models/expense/houseContract'
// import approval from './models/expense/approval'
// import borrowingRepayment from './models/expense/borrowingRepayment'
// import budget from './models/expense/budget'
// import statistics from './models/expense/statistics'
// import takeLeave from './models/expense/takeLeave'
// import overTime from './models/expense/overTime'
// import ticket from './models/expense/ticket'
// import relationExamineFlow from './models/expense/relationExamineFlow'
// import tags from './models/finance/config/tags'
// import configIndex from './models/finance/config/index'
// import generator from './models/finance/generator'
// import plan from './models/finance/plan'
// import financeManage from './models/finance/summary/manage'
// import task from './models/finance/task'
// import print from './models/print'
// import whiteList from './models/whiteList/whiteList'
// import payment from './models/enterprise/payment'
// import permissions from './models/announcement/permissions'
// import organizationStaffs from './models/organization/staffs'
// import department from './models/organization/manage/department'
// import manageStaffs from './models/organization/manage/staffs'
// import manageBusiness from './models/organization/manage/business'
// import operationLog from './models/organization/operationLog'
// import humanResource from './models/oa/humanResource'
// import administration from './models/oa/administration'
// import oaBusiness from './models/oa/business'
// import attendance from './models/oa/attendance'
// import oaCommon from './models/oa/common'
// import other from './models/oa/other'
// import fake from './models/oa/fake'
// import sharedContract from './models/shared/contract'
// import company from './models/shared/company'
// import bankAccount from './models/shared/bankAccount'
// import seal from './models/shared/seal'
// import license from './models/shared/license'
// import wallet from './models/wallet'
// import flow from './models/code/flow'
// import matter from './models/code/matter'
// import document from './models/code/document'
// import order from './models/code/order'
// import codeCommon from './models/code/common'
// import record from './models/code/record'
// import amortization from './models/amortization'
// import contractTemplate from './models/system/contractTemplate'
// import wps from './models/wps'

moment.locale('zh-cn');

// 初始化应用
// window.application = application;

// 1. Initialize
const app = dva({
    history: new History(),
    ...createLoading(),
    onError(error) {
        // eslint-disable-next-line no-console
        console.error('app onError', error);
    },
});

// 2. Plugins
app.use(createLoading({
    effects: true,
}));

// 3. Model
// app.model(core);
// app.model(common);
// app.model(subscription);
// app.model(files);
app.model(setting);
app.model(adminManage);
// app.model(accountManage);
// app.model(employeeManage);
// app.model(transport);
// app.model(contract);
// app.model(fileChange);
// app.model(turnover);
// app.model(statisticsData);
// app.model(society);
// app.model(supplierManage);
// app.model(city);
// app.model(systemManage);
// app.model(recommendedcompany);
// app.model(contractTemplate);

// 资产管理
// app.model(districtManage);
// app.model(tag);
// app.model(manager);
// app.model(coachDepartment);
// app.model(operations);
// app.model(ownerBusiness);
// app.model(teacher);
// app.model(account);
// app.model(message);
// app.model(nothingOwner);
// app.model(authorize);
// app.model(system);
// app.model(download);
// app.model(merchants);
// app.model(upload);
// app.model(operationManage);
// app.model(set);
// app.model(procurement);
// app.model(distribution);
// app.model(details);
// app.model(deductions);
// app.model(deductSummarize);
// app.model(travelApplication);
// app.model(subject);
// app.model(type);
// app.model(examineFlow);
// app.model(examineOrder);
// app.model(costOrder);
// app.model(houseContract);
// app.model(approval);
// app.model(borrowingRepayment);
// app.model(budget);
// app.model(statistics);
// app.model(takeLeave);
// app.model(overTime);
// app.model(ticket);
// app.model(relationExamineFlow);
// app.model(tags);
// app.model(configIndex);
// app.model(generator);
// app.model(plan);
// app.model(financeManage);
// app.model(task);
// app.model(print);
// app.model(whiteList);
// app.model(payment);
// app.model(permissions);
// app.model(organizationStaffs);
// app.model(department);
// app.model(manageStaffs);
// app.model(manageBusiness);
// app.model(operationLog);
// app.model(humanResource);
// app.model(administration);
// app.model(oaBusiness);
// app.model(attendance);
// app.model(oaCommon);
// app.model(other);
// app.model(fake);
// app.model(sharedContract);
// app.model(company);
// app.model(bankAccount);
// app.model(seal);
// app.model(license);
// app.model(wallet);
// app.model(flow);
// app.model(matter);
// app.model(document);
// app.model(order);
// app.model(codeCommon);
// app.model(record);
// app.model(amortization);
// app.model(wps);


// 4. Router
app.router(router);

// 5. Start
const App = app.start();

// 6. render
ReactDOM.render(<ConfigProvider locale={zhCN} >
    < App />
</ConfigProvider>,
    window.document.getElementById('root'),
);