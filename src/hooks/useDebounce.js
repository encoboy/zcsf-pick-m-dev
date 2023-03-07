/* eslint-disable prefer-spread */
import { useCallback } from 'react';

/**
 * 防抖hook
 * @param func 需要执行的函数
 * @param wait 延迟时间
 */
export function useDebounce(
  func,
  wait,
) {
  let timeOut= null;
  let args;
  function debounce(...args) {
    if (timeOut) {
      clearTimeout(timeOut);
      timeOut = null;
    }
    return new Promise((resolve, reject) => {
      timeOut = setTimeout(async () => {
        try {
          // eslint-disable-next-line prefer-spread
          const result = await func.apply(null, args);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      }, wait);
    });
  }
  // 取消
  function cancel() {
    if (!timeOut) return;
    clearTimeout(timeOut);
    timeOut = null;
  }
  // 立即执行
  function flush() {
    cancel();
    return func.apply(null, args);
  }
  debounce.flush = flush;
  debounce.cancel = flush;
  return useCallback(debounce, []);
}
