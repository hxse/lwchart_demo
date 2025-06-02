import { commonUtilsLogger } from "./logger"; // 引入 logger

/**
 * 节流函数：限制函数在一定时间内只能执行一次。
 *
 * @param {Function} func - 要节流的函数。
 * @param {number} delay - 延迟时间（毫秒）。
 * @returns {Function} - 节流后的函数。
 */
export function throttle(func, delay) {
  let timeoutId;
  let lastArgs;
  let lastThis;
  let lastCallTime = 0;

  return function (...args) {
    const now = Date.now();
    const remaining = delay - (now - lastCallTime);

    lastArgs = args;
    lastThis = this;

    if (remaining <= 0 || remaining > delay) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCallTime = now;
      func.apply(this, args);
      commonUtilsLogger.debug(`函数 ${func.name || "匿名函数"} 立即执行。`);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now();
        timeoutId = null;
        func.apply(lastThis, lastArgs);
        lastArgs = lastThis = null;
        commonUtilsLogger.debug(`函数 ${func.name || "匿名函数"} 延迟执行。`);
      }, remaining);
    }
  };
}

/**
 * 深度克隆一个对象，处理基本类型、函数、数组、对象和循环引用。
 *
 * @param {any} obj - 要克隆的对象。
 * @param {WeakMap} [visited=new WeakMap()] - 用于处理循环引用的 WeakMap。
 * @returns {any} - 克隆后的新对象。
 */
export function deepClone(obj, visited = new WeakMap()) {
  // 处理基本类型和 null
  if (obj === null || typeof obj !== "object") {
    commonUtilsLogger.debug(`深度克隆: 返回基本类型或 null。`);
    return obj;
  }

  // 处理函数
  if (typeof obj === "function") {
    commonUtilsLogger.debug(`深度克隆: 返回函数。`);
    return obj;
  }

  // 处理循环引用
  if (visited.has(obj)) {
    commonUtilsLogger.debug(`深度克隆: 检测到循环引用，返回已访问对象。`);
    return visited.get(obj);
  }

  // 处理数组
  if (Array.isArray(obj)) {
    commonUtilsLogger.debug(`深度克隆: 克隆数组。`);
    const newArray = [];
    visited.set(obj, newArray);
    obj.forEach((item, index) => {
      newArray[index] = deepClone(item, visited);
    });
    return newArray;
  }

  // 处理对象
  commonUtilsLogger.debug(`深度克隆: 克隆对象。`);
  const newObj = Object.create(Object.getPrototypeOf(obj));
  visited.set(obj, newObj);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key] = deepClone(obj[key], visited);
    }
  }
  return newObj;
}

/**
 * 移除字符串末尾指定的后缀。
 *
 * @param {string} origin - 原始字符串。
 * @param {string} suffix - 要移除的后缀。
 * @returns {string} - 移除后缀后的字符串。
 */
export function removeEndSuffix(origin, suffix) {
  commonUtilsLogger.debug(`移除后缀: 原始字符串 "${origin}", 后缀 "${suffix}"`);
  if (origin.endsWith(suffix)) {
    const result = origin.slice(0, -suffix.length);
    commonUtilsLogger.debug(`移除后缀: 结果 "${result}"`);
    return result;
  }
  commonUtilsLogger.debug(`移除后缀: 未找到后缀，返回原始字符串 "${origin}"`);
  return origin;
}
