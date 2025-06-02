import { findNodeById } from "../../utils/nodeUtils";
import { handleData, handleLastData } from "../handleData.svelte";
import { getLogger } from "../../utils/logger";

const dataCallbacksLogger = getLogger("dataCallbacks");

/**
 * 设置指定节点的数据布局。
 * 如果节点是 'lwchart' 类型且系列显示, 则通过 `handleData` 获取新数据并更新节点数据。
 *
 * @param {Object} dataContainer - 包含数据树的容器对象。
 * @param {Array<number>} clickedItemIdArray - 被点击节点的 ID 路径数组。
 * @param {string} [paramName="ohlc"] - 要设置数据的系列名称。
 */
export function setDataLayout(dataContainer, clickedItemIdArray, paramName = "ohlc") {
  const data = dataContainer[dataContainer.name];
  dataCallbacksLogger.debug(`setDataLayout 被调用, 点击的 ID: ${clickedItemIdArray.join(",")}, 系列: ${paramName}`);

  // 查找目标节点
  const node = findNodeById(data, clickedItemIdArray);

  // 检查节点是否存在且为 'lwchart' 类型
  if (node && node.content === "lwchart") {
    dataCallbacksLogger.debug(`找到节点, ID: ${clickedItemIdArray.join("-")}, 内容: ${node.content}`);
    // 如果系列不显示, 则不进行数据设置
    if (!node.params.series[paramName].display) {
      dataCallbacksLogger.info(`系列 ${paramName} 不显示, 跳过 setDataLayout。`);
      return;
    }
    // 获取新数据
    const newData = handleData(paramName, node);
    if (!newData) {
      dataCallbacksLogger.warn(`handleData 未返回新数据, 跳过 setDataLayout。`);
      return;
    }
    // 更新节点数据
    node.params.series[paramName].data = newData;
    dataCallbacksLogger.info(`setDataLayout 替换布局数据, 系列: ${paramName}, 数据量: ${newData.length}`);
  } else {
    dataCallbacksLogger.warn(`未找到节点, 或它不是一个有效的 'lwchart' 容器, ID: ${clickedItemIdArray.join("-")}`);
  }
}

/**
 * 更新指定节点的最后一个数据点。
 * 如果节点是 'lwchart' 类型且系列显示, 则通过 `handleLastData` 获取最新数据并更新节点数据。
 *
 * @param {Object} dataContainer - 包含数据树的容器对象。
 * @param {Array<number>} clickedItemIdArray - 被点击节点的 ID 路径数组。
 * @param {string} [paramName="ohlc"] - 要更新数据的系列名称。
 */
export function updateDataLayout(dataContainer, clickedItemIdArray, paramName = "ohlc") {
  const data = dataContainer[dataContainer.name];
  dataCallbacksLogger.debug(`updateDataLayout 被调用, 点击的 ID: ${clickedItemIdArray.join(",")}, 系列: ${paramName}`);

  // 查找目标节点
  const node = findNodeById(data, clickedItemIdArray);

  // 检查节点是否存在且为 'lwchart' 类型
  if (node && node.content === "lwchart") {
    dataCallbacksLogger.debug(`找到节点, ID: ${clickedItemIdArray.join("-")}, 内容: ${node.content}`);
    // 如果系列不显示, 则不进行数据更新
    if (!node.params.series[paramName].display) {
      dataCallbacksLogger.info(`系列 ${paramName} 不显示, 跳过 updateDataLayout。`);
      return;
    }
    // 获取最新数据
    const newData = handleLastData(paramName, node);
    if (!newData) {
      dataCallbacksLogger.warn(`handleLastData 未返回新数据, 跳过 updateDataLayout。`);
      return;
    }
    // 更新节点数据
    node.params.series[paramName].data = newData;
    dataCallbacksLogger.info(
      `updateDataLayout 更新数据, 系列: ${paramName}, 最新数据点:`,
      newData[newData.length - 1],
      `数据量: ${newData.length}`
    );
  } else {
    dataCallbacksLogger.warn(`未找到节点, 或它不是一个有效的 'lwchart' 容器, ID: ${clickedItemIdArray.join("-")}`);
  }
}

/**
 * 切换指定节点系列数据的显示状态 (display)。
 * 如果节点是 'lwchart' 类型, 则切换其 `params.series[paramName].display` 属性。
 *
 * @param {Object} dataContainer - 包含数据树的容器对象。
 * @param {Array<number>} clickedItemIdArray - 被点击节点的 ID 路径数组。
 * @param {string} [paramName="ohlc"] - 要改变显示状态的系列名称。
 */
export function changeDataLayout(dataContainer, clickedItemIdArray, paramName = "ohlc") {
  const data = dataContainer[dataContainer.name];
  dataCallbacksLogger.debug(`changeDataLayout 被调用, 点击的 ID: ${clickedItemIdArray.join(",")}, 系列: ${paramName}`);

  // 查找目标节点 (这里硬编码了 ID [0, 1, 0], 请根据实际需求调整)
  const node = findNodeById(data, [0, 1, 0]);
  // const node = findNodeById(data, clickedItemIdArray); // 如果需要使用传入的 clickedItemIdArray

  // 检查节点是否存在且为 'lwchart' 类型
  if (node && node.content === "lwchart") {
    dataCallbacksLogger.debug(`找到节点, ID: ${node.id.join("-")}, 内容: ${node.content}`);
    // 切换 display 属性
    if (!node.params.series[paramName].display) {
      node.params.series[paramName].display = true;
    } else {
      node.params.series[paramName].display = false;
    }
    dataCallbacksLogger.info(
      `changeDataLayout 改变数据属性 display, 系列: ${paramName}, 新状态: ${node.params.series[paramName].display}`
    );
  } else {
    dataCallbacksLogger.warn(`未找到节点, 或它不是一个有效的 'lwchart' 容器, ID: ${clickedItemIdArray.join("-")}`);
  }
}

/**
 * 改变指定节点系列数据的时间周期 (period)。
 * 如果节点是 'lwchart' 类型, 则切换其 `params.series[paramName].period` 属性, 并重新设置数据布局。
 *
 * @param {Object} dataContainer - 包含数据树的容器对象。
 * @param {Array<number>} clickedItemIdArray - 被点击节点的 ID 路径数组。
 * @param {string} [paramName="ohlc"] - 要改变时间周期的系列名称。
 */
export function changeDataPeriod(dataContainer, clickedItemIdArray, paramName = "ohlc") {
  const data = dataContainer[dataContainer.name];
  dataCallbacksLogger.debug(`changeDataPeriod 被调用, 点击的 ID: ${clickedItemIdArray.join(",")}, 系列: ${paramName}`);

  // 查找目标节点 (这里硬编码了 ID [0, 1, 0], 请根据实际需求调整)
  const _id = [0, 1, 0];
  const node = findNodeById(data, _id);
  // const node = findNodeById(data, clickedItemIdArray); // 如果需要使用传入的 clickedItemIdArray

  // 检查节点是否存在且为 'lwchart' 类型
  if (node && node.content === "lwchart") {
    dataCallbacksLogger.debug(`找到节点, ID: ${node.id.join("-")}, 内容: ${node.content}`);
    // 切换 period 属性并重新设置数据
    if (node.params.series[paramName].period % 2 === 0) {
      node.params.series[paramName].period = node.params.series[paramName].period - 5;
      setDataLayout(dataContainer, _id, paramName);
    } else {
      node.params.series[paramName].period = node.params.series[paramName].period + 5;
      setDataLayout(dataContainer, _id, paramName);
    }
    dataCallbacksLogger.info(
      `changeDataPeriod 改变数据属性 period, 系列: ${paramName}, 新周期: ${node.params.series[paramName].period}`
    );
  } else {
    dataCallbacksLogger.warn(`未找到节点, 或它不是一个有效的 'lwchart' 容器, ID: ${clickedItemIdArray.join("-")}`);
  }
}

/**
 * 切换指定节点的数据刷新键 (refreshKey)。
 * 如果节点是 'lwchart' 类型, 则切换其 `refreshKey` 属性, 这通常用于触发 Svelte 的响应式更新。
 *
 * @param {Object} dataContainer - 包含数据树的容器对象。
 * @param {Array<number>} clickedItemIdArray - 被点击节点的 ID 路径数组。
 */
export function changeDataRefresh(dataContainer, clickedItemIdArray) {
  const data = dataContainer[dataContainer.name];
  dataCallbacksLogger.debug(`changeDataRefresh 被调用, 点击的 ID: ${clickedItemIdArray.join(",")}`);

  // 查找目标节点 (这里硬编码了 ID [0, 1, 0], 请根据实际需求调整)
  const _id = [0, 1, 0];
  const node = findNodeById(data, _id);
  // const node = findNodeById(data, clickedItemIdArray); // 如果需要使用传入的 clickedItemIdArray

  // 检查节点是否存在且为 'lwchart' 类型
  if (node && node.content === "lwchart") {
    dataCallbacksLogger.debug(`找到节点, ID: ${node.id.join("-")}, 内容: ${node.content}`);
    // 切换 refreshKey 属性
    node.refreshKey = !node.refreshKey;
    dataCallbacksLogger.info(`changeDataRefresh 改变数据属性 refreshKey, 新状态: ${node.refreshKey}`);
  } else {
    dataCallbacksLogger.warn(`未找到节点, 或它不是一个有效的 'lwchart' 容器, ID: ${clickedItemIdArray.join("-")}`);
  }
}
