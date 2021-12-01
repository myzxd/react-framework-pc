/**
 * 全局路由的订阅
 *
 * @module model/application/subscription
 */

import queryString from 'query-string';
import { authorize } from '../../application';
import { AccountState, DutyState, SupplierState } from '../../application/define';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'applicationSubscription',

  /**
   * 状态树
   */
  state: {},
  /**
   * @namespace application/subscription/subscriptions
   */
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(async (location) => {
        const { pathname } = location;

        // 如果账号处于未登录，不进行处理
        if (authorize.isLogin() === false) {
          return;
        }

        // 判断是否刷新token, 切换账户页面不进行操作
        if (authorize.isRefreshAuth() === true && pathname !== '/authorize/auth') {
          // 刷新账户信息和授权信息
          dispatch({ type: 'authorizeManage/refreashAuthorize' });
        }

        // 服务费规则 || 服务费规则（废弃）
        if (pathname === '/Finance/Rules' || pathname === '/Finance/Rules/Generator' || pathname === '/Finance/Rules/History') {
          // 获取在职状态的数据
          dispatch({ type: 'financeConfigTags/fetchKnightTags', payload: {} });
        }

        // 人员管理，查看人员
        if (pathname === '/Employee/Manage') {
          // 获取在职状态的数据
          // dispatch({ type: 'employeeManage/fetchEmployees', payload: { state: [SigningState.normal] } });
        }
        if (pathname === '/Employee/Create') {
          dispatch({ type: 'employeeManage/reduceEmployeeDetail', payload: {} });
        }
        // 人员管理，详情页面 || 人员管理，编辑页面
        if (pathname === '/Employee/Detail' || pathname === '/Employee/Update') {
          let employeeId;
          let fileType;
          if (location.query) {
            employeeId = location.query.id;
            fileType = location.query.fileType;
          } else if (location.search) {
            employeeId = queryString.parse(location.search).id;
            fileType = queryString.parse(location.search).fileType;
          }
          // 获取人员详情数据
          dispatch({ type: 'employeeManage/fetchEmployeeDetail', payload: { employeeId, fileType } });
        }
        // 人员管理，离职审批
        if (pathname === '/Employee/Resign/Verify') {
          // 获取离职待审批状态的数据
          dispatch({ type: 'employeeManage/fetchEmployees', payload: { state: DutyState.onResignToApprove, type: 'resign' } });
        }
        // 获取运力工号列表
        if (pathname === '/Employee/Transport') {
          // 获取运力工号列表
          dispatch({ type: 'employeeTransport/fetchTransportData' });
        }
        // 获取运力工号详情
        if (pathname === '/Employee/Transport/Detail' || pathname === '/Employee/Transport/Update') {
          // 获取运力工号列表
          dispatch({ type: 'employeeTransport/fetchTransportRecords', payload: { recordId: location.query.id } });
        }

        // 费用分组列表
        if (pathname === '/Expense/Type') {
          dispatch({ type: 'expenseType/fetchExpenseType' });
        }
        // 编辑费用分组
        if (pathname === '/Expense/Type/Update') {
          dispatch({ type: 'expenseType/fetchExpenseTypeDetail', payload: { id: location.query.id } });
        }

        // 系统管理，用户管理
        if (pathname === '/System/Account/Manage') {
          // 获取启用状态的数据
          dispatch({ type: 'accountManage/fetchAccounts', payload: { state: AccountState.on } });
        }
        // 供应商详情页面
        if (pathname === '/System/Supplier/Detail' || pathname === '/System/Supplier/Update') {
          dispatch({ type: 'supplierManage/fetchSupplierDetail', payload: { supplierId: location.query.id } });
        }
        // 合同归属管理
        // if (pathname === '/System/Manage/Company') {
          // 获取第三方公司列表
          // dispatch({ type: 'systemManage/fetchCompanies', payload: { state: ThirdCompanyState.on } });
        // }
        // 供应商管理
        if (pathname === '/System/Supplier/Manage') {
          // 获取供应商列表
          dispatch({ type: 'supplierManage/fetchSuppliers', payload: { state: SupplierState.enable } });
        }
      });
    },
  },
};
