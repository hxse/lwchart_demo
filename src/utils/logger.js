import log from "loglevel";

/**
 * 设置全局默认日志级别。
 * 日志级别从低到高依次为：trace, debug, info, warn, error, silent。
 * 在开发环境中，通常设置为 'info' 或 'debug' 以获取更多信息。
 * 在生产环境中，建议设置为 'warn' 或 'error' 以减少日志输出量。
 */
log.setLevel("info");

/**
 * 创建并获取一个具有指定名称的 `loglevel` 日志记录器实例。
 * 通过为不同模块或文件分配独立的日志记录器，可以实现更精细的日志控制和管理，
 * 例如独立设置日志级别或进行过滤，从而提高日志的可读性和调试效率。
 *
 * @param {string} name - 日志记录器（logger）的唯一名称，通常对应模块或文件名。
 * @returns {import("loglevel").Logger} - 配置好的 `loglevel` 日志记录器实例。
 */
export function getLogger(name) {
  const logger = log.getLogger(name);
  // 可以在此处为特定的 logger 实例设置不同的日志级别，例如：
  // logger.setLevel('debug');
  return logger;
}

/**
 * 导出各个模块的 `loglevel` 日志记录器实例，便于在对应文件中直接导入和使用。
 * 每个 logger 实例都继承了全局日志级别，但也可以独立配置。
 */
export const lwchartLogger = getLogger("lwchart");
export const chartLogger = getLogger("chart");
export const useLightweightChartLogger = getLogger("useLightweightChart");
export const chartUtilsLogger = getLogger("chartUtils");
export const commonUtilsLogger = getLogger("commonUtils");
export const gridUtilsLogger = getLogger("gridUtils");
export const nodeUtilsLogger = getLogger("nodeUtils");
export const pathLogger = getLogger("path");
export const appLogger = getLogger("App");
export const recursiveGridLogger = getLogger("RecursiveGrid");
