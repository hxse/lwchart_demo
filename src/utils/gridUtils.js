import { gridUtilsLogger } from "./logger"; // 引入 logger

/**
 * 递归处理节点，为网格布局添加或更新 ID 和 gridArea 属性。
 *
 * @param {Object} node - 当前要处理的节点对象。
 * @param {Array<number>} [path=[]] - 当前节点在树结构中的路径（索引数组）。
 * @param {string} [prefix=""] - gridArea 的前缀。
 * @returns {Object} - 处理后的新节点对象，包含 id 和 gridArea 属性。
 */
export function processNodesForGrid(node, path = [], prefix = "") {
  const newNode = { ...node, id: [...path] }; // 复制节点并添加/更新 id

  const pathStr = path.join("_");
  newNode.gridArea = `${prefix}_${pathStr}`;
  gridUtilsLogger.debug(`处理节点: ID: ${newNode.id.join("-")}, gridArea: ${newNode.gridArea}`);

  if (node.children) {
    newNode.children = [];
    for (const [index, child] of node.children.entries()) {
      newNode.children.push(processNodesForGrid(child, [...path, index], prefix));
    }

    newNode.test = newNode.children.map((i) => i.gridArea);
    newNode.originGridTemplateAreas = newNode.gridTemplateAreas;
    const { replacedTemplate, uniqueAreasLength } = replaceGridAreas(newNode.gridTemplateAreas, newNode.test);
    newNode.gridTemplateAreas = replacedTemplate;
    newNode.children = newNode.children.slice(0, uniqueAreasLength);
    gridUtilsLogger.debug(`节点 ${newNode.id.join("-")} 包含子节点，已处理其 gridTemplateAreas。`);
  }

  return newNode;
}

/**
 * 替换 CSS grid-template-areas 字符串中的区域名称为提供的 ID。
 * 如果提供的 ID 数量少于唯一的区域名称数量，多余的区域将替换为 '.'。
 *
 * @param {string} gridTemplateAreas - 原始的 CSS grid-template-areas 字符串。
 * @param {Array<string>} ids - 用于替换区域名称的 ID 数组。
 * @returns {{ replacedTemplate: string, uniqueAreasLength: number }} - 包含替换后的模板字符串和唯一区域名称的数量。
 */
export function replaceGridAreas(gridTemplateAreas, ids) {
  // 提取所有由空格分隔的区域名称
  const areas = gridTemplateAreas.match(/[\w-]+/g) || [];
  gridUtilsLogger.debug(`原始 gridTemplateAreas: "${gridTemplateAreas}", 提取区域: ${areas.join(", ")}`);

  // 获取唯一的区域名称并记录首次出现的顺序
  const uniqueAreas = [];
  const seen = new Set();
  areas.forEach((area) => {
    if (!seen.has(area)) {
      uniqueAreas.push(area);
      seen.add(area);
    }
  });
  gridUtilsLogger.debug(`唯一区域名称: ${uniqueAreas.join(", ")}`);

  // 如果提供的 ID 数量少于唯一区域的数量，发出警告
  if (ids.length < uniqueAreas.length) {
    gridUtilsLogger.warn(
      `gridTemplateAreas "${gridTemplateAreas}" 中有 ${uniqueAreas.length} 个唯一的区域名称 (${uniqueAreas.join(
        ", "
      )}), 但只提供了 ${ids.length} 个 ID。部分区域将被替换为 '.'。`
    );
  }

  // 创建一个映射，将唯一的区域名称映射到对应的 ID
  const areaToId = {};
  uniqueAreas.forEach((area, index) => {
    if (index < ids.length) {
      areaToId[area] = ids[index];
    } else {
      areaToId[area] = "."; // ID 不足时映射到 "."
    }
  });
  gridUtilsLogger.debug(`区域到 ID 的映射:`, areaToId);

  // 替换模板中的区域名称
  const replacedTemplate = gridTemplateAreas.replace(/[\w-]+/g, (match) => {
    return areaToId[match] !== undefined ? areaToId[match] : "."; // 如果没有对应的 ID，也替换为 "."
  });
  gridUtilsLogger.debug(`替换后的 gridTemplateAreas: "${replacedTemplate}"`);

  const uniqueAreasLength = uniqueAreas.length;
  return { replacedTemplate, uniqueAreasLength };
}
