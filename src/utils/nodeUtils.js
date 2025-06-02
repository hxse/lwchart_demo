import { nodeUtilsLogger } from "./logger"; // 引入 logger

/**
 * 比较两个数组是否相等。
 *
 * @param {Array<any>} arr1 - 第一个数组。
 * @param {Array<any>} arr2 - 第二个数组。
 * @returns {boolean} - 如果两个数组的长度和所有元素都相等, 则返回 true, 否则返回 false。
 */
export function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    nodeUtilsLogger.debug(`数组不相等: 长度不同。arr1.length: ${arr1.length}, arr2.length: ${arr2.length}`);
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      nodeUtilsLogger.debug(`数组不相等: 元素在索引 ${i} 处不同。arr1[${i}]: ${arr1[i]}, arr2[${i}]: ${arr2[i]}`);
      return false;
    }
  }
  nodeUtilsLogger.debug(`数组相等。`);
  return true;
}

/**
 * 使用深度优先搜索在树结构中查找具有特定 ID 路径的节点。
 *
 * @param {Object} root - 树的根节点。
 * @param {Array<number>} targetIdArray - 目标节点的 ID 路径（索引数组）。
 * @returns {Object|null} - 找到的节点对象, 如果未找到则返回 null。
 */
export function findNode(root, targetIdArray) {
  function search(current, currentIdArray) {
    nodeUtilsLogger.debug(`DFS 搜索: 当前节点 ID: ${currentIdArray.join("-")}, 目标 ID: ${targetIdArray.join("-")}`);
    if (arraysAreEqual(currentIdArray, targetIdArray)) {
      nodeUtilsLogger.info(`DFS 搜索: 找到目标节点, ID: ${currentIdArray.join("-")}`);
      return current;
    }
    if (current.children) {
      for (let i = 0; i < current.children.length; i++) {
        const child = current.children[i];
        const found = search(child, [...currentIdArray, i]);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  nodeUtilsLogger.info(`开始深度优先搜索查找节点, 目标 ID: ${targetIdArray.join("-")}`);
  return search(root, root.id);
}

/**
 * 基于 ID 路径直接访问树结构中的节点。
 *
 * @param {Object} root - 树的根节点。
 * @param {Array<number>} targetIdArray - 目标节点的 ID 路径（索引数组）。
 * @returns {Object|null} - 找到的节点对象, 如果路径中的任何一步无效则返回 null。
 */
export function findNodeById(root, targetIdArray) {
  nodeUtilsLogger.debug(`开始通过 ID 路径查找节点, 目标 ID: ${targetIdArray.join("-")}`);
  let currentNode = root;
  // 从路径的第二个元素开始遍历, 因为第一个元素通常是根节点自身的ID
  for (const index of targetIdArray.slice(1)) {
    if (currentNode && currentNode.children && currentNode.children.length > index && currentNode.children[index]) {
      currentNode = currentNode.children[index];
      nodeUtilsLogger.debug(`通过 ID 路径前进: 当前节点 ID: ${currentNode.id.join("-")}, 下一个索引: ${index}`);
    } else {
      // 如果路径中的任何一步无效（节点不存在、无子节点或索引越界）, 则返回 null
      nodeUtilsLogger.warn(`路径中的节点无效或索引越界。当前节点:`, currentNode, `索引:`, index);
      return null;
    }
  }
  return currentNode;
}

/**
 * 向图表数组中添加新图表或更新现有图表。
 * 如果存在相同 ID 的图表, 则更新其属性；否则, 添加新图表。
 *
 * @param {Array<Object>} chartArray - 存储图表对象的数组。
 * @param {Object} obj - 要添加或更新的图表对象, 必须包含 `id` 属性。
 */
export function addOrUpdateChart(chartArray, obj) {
  const existingIndex = chartArray.findIndex((item) => arraysAreEqual(item.id, obj.id));

  if (existingIndex !== -1) {
    // 如果找到重复的 id, 则更新已有的对象
    chartArray[existingIndex] = { ...chartArray[existingIndex], ...obj };
    nodeUtilsLogger.info(`图表 ID ${obj.id.join("-")} 已更新。`);
  } else {
    // 如果没有找到重复的 id, 则直接 push 新的对象
    chartArray.push(obj);
    nodeUtilsLogger.info(`图表 ID ${obj.id.join("-")} 已添加。`);
  }
}
