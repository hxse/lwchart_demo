import { pathLogger } from "./logger"; // 引入 logger

export const patchSubscriptions = (triggerMethodRef, isInitialized, enablePatch) => ({
  patchRangeChange: (originalCallback) => (range) => {
    if (!enablePatch) {
      originalCallback(range);
      return;
    }

    const method = triggerMethodRef.current;
    const source = method || !isInitialized.current ? "Programmatic" : "User";
    const trigger = method || "User Interaction";

    if (method === "clearCrosshairPosition") {
      pathLogger.info(`忽略来自 clearCrosshairPosition 的意外范围变化:`, range);
      return;
    }

    pathLogger.info(`已打补丁的范围变化触发:`, range, `Source: ${source}`, `Triggered by: ${trigger}`);

    // 仅在 User 触发时调用原始回调
    if (source === "User") {
      originalCallback({ range, source, trigger });
    }

    // 重置 triggerMethodRef
    if (method && triggerMethodRef.current === method) {
      pathLogger.info(`重置 triggerMethodRef 从:`, method, "回调后。");
      triggerMethodRef.current = null;
    }
  },
  patchCrosshairMove: (originalCallback) => (param) => {
    if (!enablePatch) {
      originalCallback(param);
      return;
    }

    const method = triggerMethodRef.current;
    const source = method || !isInitialized.current ? "Programmatic" : "User";
    const trigger = method || "User Interaction";

    if (method === "clearCrosshairPosition" && param.time) {
      pathLogger.info(`忽略来自 clearCrosshairPosition 的意外十字光标移动，时间:`, param.time);
      return;
    }

    pathLogger.info(`已打补丁的十字光标移动触发:`, param.time || null, `Source: ${source}`, `Triggered by: ${trigger}`);

    if (source === "User") {
      originalCallback({ param, source, trigger });
    }

    if (method && triggerMethodRef.current === method) {
      pathLogger.info(`重置 triggerMethodRef 从:`, method, "回调后。");
      triggerMethodRef.current = null;
    }
  },
});
