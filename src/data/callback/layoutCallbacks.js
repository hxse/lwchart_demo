import { findNodeById } from "../../utils/nodeUtils";
import { getLogger } from "../../utils/logger";

const layoutCallbacksLogger = getLogger("layoutCallbacks");

/**
 * 根据点击的子节点 ID 路径更新父节点的布局（gridTemplateRows）。
 * 如果找到有效的父容器节点, 则在 "70% 30%" 和 "30% 70%" 之间切换其 gridTemplateRows 属性。
 *
 * @param {Object} dataContainer - 包含数据树的容器对象。
 * @param {Array<number>} clickedItemIdArray - 被点击子节点的 ID 路径数组。
 */
export function updateParentLayout(dataContainer, clickedItemIdArray) {
  const data = dataContainer[dataContainer.name];
  layoutCallbacksLogger.info(`updateParentLayout 被调用, 点击的 ID: ${clickedItemIdArray.join(",")}`);

  // 获取父节点的 ID 路径
  const _idArray = clickedItemIdArray.slice(0, clickedItemIdArray.length - 1);
  _idArray[1] = 1;
  // 查找父节点
  const node = findNodeById(data, _idArray);

  // 检查节点是否存在、是否有子节点且包含 gridTemplateRows 属性
  if (node && node.children && "gridTemplateRows" in node) {
    layoutCallbacksLogger.debug(`找到父节点, ID: ${_idArray.join("-")}`);
    // 切换 gridTemplateRows 属性
    if (node.gridTemplateRows === "70% 30%") {
      node.gridTemplateRows = "30% 70%";
    } else {
      node.gridTemplateRows = "70% 30%";
    }
    layoutCallbacksLogger.info(`父节点 ${_idArray.join("-")} 的新 gridTemplateRows: ${node.gridTemplateRows}`);
  } else {
    layoutCallbacksLogger.warn(`未找到父节点, 或它不是一个有效的容器, ID: ${_idArray.join("-")}`);
  }
}

/**
 * 根据点击的节点 ID 路径更新数据容器的名称。
 * 如果找到有效的节点, 则在 "data" 和 "data2" 之间切换 dataContainer.name 属性。
 *
 * @param {Object} dataContainer - 包含数据树的容器对象。
 * @param {Array<number>} clickedItemIdArray - 被点击节点的 ID 路径数组。
 */
export function updateParentLayout2(dataContainer, clickedItemIdArray) {
  const data = dataContainer[dataContainer.name];
  layoutCallbacksLogger.info(`updateParentLayout2 被调用, 点击的 ID: ${clickedItemIdArray.join(",")}`);

  // 查找被点击的节点
  const node = findNodeById(data, clickedItemIdArray);

  // 检查节点是否存在
  if (node) {
    layoutCallbacksLogger.debug(`找到节点, ID: ${clickedItemIdArray.join("-")}`);
    // 切换 dataContainer.name
    if (dataContainer.name === "data2") {
      dataContainer.name = "data";
      layoutCallbacksLogger.info(`数据容器名称已切换为: ${dataContainer.name}`);
    } else {
      dataContainer.name = "data2";
      layoutCallbacksLogger.info(`数据容器名称已切换为: ${dataContainer.name}`);
    }
  } else {
    layoutCallbacksLogger.warn(`未找到节点, 或它不是一个有效的容器, ID: ${clickedItemIdArray.join("-")}`);
  }
}
