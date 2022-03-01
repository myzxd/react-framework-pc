/**
 * 操作模块的权限判断
 */
import { authorize } from '../index';
import Modules from './modules';

class Operate {

    // 判断数据是否在数组中
    static inArray = (item = '', array = []) => {
        // 检测数据是否在数组中
        if (array.indexOf(item) !== -1) {
            return true;
        }

        // 不存在则直接返回
        return false;
    }

    // 角色管理 - CODE业务策略
    static canOperateAdminManagementCodeRoles = () => {
        return authorize.canOperate(Modules.OperateAdminManagementCodeRoles);
    }
}
export default Operate;

export const {
    canOperateAdminManagementCodeRoles,
} = Operate;