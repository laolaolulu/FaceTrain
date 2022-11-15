// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 此处后端没有提供注释 POST /api/Face/Tran */
export async function postFaceTran(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postFaceTranParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/Face/Tran', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
