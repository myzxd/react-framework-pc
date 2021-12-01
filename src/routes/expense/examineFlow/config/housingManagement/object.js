/**
 * 审批流设置的配置文件
 */

import { authorize } from '../../../../../application';

const platforms = authorize.platform();

const getPlatformsConfig = (obj) => {
  platforms.forEach((val) => {
    // eslint-disable-next-line no-param-reassign
    obj[val.id] = {
      accountings: {
        pledge_accounting_id: {
          5: '',
          4: '',
          3: '',
          2: '',
        },
        agent_accounting_id: {
          5: '',
          4: '',
          3: '',
          2: '',
        },
        rent_accounting_id: {
          5: '',
          4: '',
          3: '',
          2: '',
        },
        lost_accounting_id: {
          5: '',
          4: '',
          3: '',
          2: '',
        },
      },
      init: {
        flow_id: '',
        cost_group_id: '',
      },
      period: {
        flow_id: '',
        cost_group_id: '',
      },
      break: {
        flow_id: '',
        cost_group_id: '',
      },
    };
  });
  return obj;
};
export const config = getPlatformsConfig({});
