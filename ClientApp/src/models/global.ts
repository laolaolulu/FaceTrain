// 全局共享数据示例
import { useEffect, useState } from 'react';
import { createFileFromUrl } from '@/utils/opencv';
import { faceWorker } from '@/constants';

export default () => {
  useEffect(() => {
    faceWorker.postMessage({ action: 'init' });
  }, []);

  return {};
};
