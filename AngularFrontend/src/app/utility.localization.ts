//获取组类
export function get_filed_category_name(field_id: number): string {
  if (field_id <= 4) {
    return "官方发布区";
  } else if (field_id <= 12) {
    return "玩家讨论区";
  } else {
    return "论坛事务专区";
  }
}

//获取组名
export function get_use_group_name(group_index: number): string {
  if (group_index == 0) {
    return "新人";
  } else if (group_index == 10) {
    return "管理员";
  } else if (group_index >= 10) {
    return "腐竹";
  } else {
    return "未知";
  }
}

// 默认签名
export const DEFAULT_SIGNATURE = "这个人还没有任何签名";
