// resizeObserverAction.js
export function useResizeObserver(node, callback) {
  const observer = new ResizeObserver((entries) => {
    callback(entries);
  });

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    },
  };
}
