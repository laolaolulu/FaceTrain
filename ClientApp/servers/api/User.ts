// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取用户数据 GET /api/User */
export async function getApiUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getApiUserParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/User', {
    method: 'GET',
    params: {
      // page has a default value: 1
      page: '1',
      // pageSize has a default value: 20
      pageSize: '20',
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/User */
export async function postApiUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postApiUserParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/User', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
