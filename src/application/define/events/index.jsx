/**
 * 全局定义的事件
 */
import { Event } from './define';

const page = {
  EventCodeOrderGroupAdd: new Event({ key: 'Code审批-审批单列表-加入分组' }).encode,
  EventCodeOrderGroupChange: new Event({ key: 'Code审批-审批单列表-切换分组' }).data,
  EventCodeOrderGroupSet: new Event({ key: 'Code审批-审批单列表-设置默认分组' }).data,
  EventCodeOrderGroupDelete: new Event({ key: 'Code审批-审批单列表-删除分组' }).data,
};
// 系统所有注册的模块
export default page;
