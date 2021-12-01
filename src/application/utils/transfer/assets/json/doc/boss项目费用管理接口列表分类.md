boss项目费用管理接口列表分类

**费用管理 / 科目设置 - Expense/Subject**

科目设置详情 - oa_catalog/find_list
一级科目列表 - oa_catalog/find_name
新增科目（暂时隐藏） - oa_catalog/
编辑（暂时隐藏）， 启用，停用科目 - oa_catalog/update

**费用管理 / 审批流设置 - Expense/Examine**

审批流新增 - oa_examineflow/find_account
审批流新增 , 确定 oa_examineflow/
审批流编辑 - oa_examineflow/get_detail
审批流禁用，启用，删除  - oa_examineflow/update

**费用管理 / 费用分组设置 - Expense/Type**

新增类型 - oa_costclass/
费用分组编辑 - oa_costclass/get_detail 
费用分组详情 - oa_costclass/find_list
费用分组停用，启用，删除 - oa_costclass/update

**费用管理 / 记录明细  - Expense/Manage/Records**

记录明细详情 - oa_examine/examine_detail
批量续租 - oa_apply_order/create_batch_relet
续租/断租/续签/退租 - oa_apply_order/change_house_status


**费用管理 / 付款审批  - Expense/Manage/ExamineOrder**

付款审批详情 - oa_examine/examine_list
费用分组名称 - oa_costclass/find_name
审批流，审批流程 - oa_examineflow/find_list
新建费用申请 oa_examine/examine_process
删除付款审批 - oa_examine/delete
费用申请审批单创建详情 - oa_examine/find_examine_order_detail
费用申请审批单，提交 - oa_examine/examine_submit
新建费用申请汇总 - oa_apply_order/create_house_num
新建费用申请汇总，提交 - oa_apply_order/create_apply_order
费用申请编辑，详情 - oa_apply_order/find_apply_order
流水单数据 - oa_apply_order/find_list
审核记录 - oa_examine/examine_process
标记付款 - oa_examine/edit_by_cashier
付款审批，费用申请审批单创建详情 ，同意，驳回 - oa_examine/examine