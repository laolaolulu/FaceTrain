// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 添加用户 POST /api/User/Add */
export async function postUserAdd(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postUserAddParams,
  options?: { [key: string]: any },
) {
  return request<API.FormatRes>('/api/User/Add', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 添加用户人脸 POST /api/User/AddImg */
export async function postUserAddImg(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postUserAddImgParams,
  body: {},
  image?: File,
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  if (image) {
    formData.append('image', image);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      formData.append(
        ele,
        typeof item === 'object' && !(item instanceof File) ? JSON.stringify(item) : item,
      );
    }
  });

  return request<API.FormatRes>('/api/User/AddImg', {
    method: 'POST',
    params: {
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 删除用户 DELETE /api/User/Delete */
export async function deleteUserDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserDeleteParams,
  options?: { [key: string]: any },
) {
  return request<API.FormatRes>('/api/User/Delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取用户数据 GET /api/User/Get */
export async function getUserGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserGetParams,
  options?: { [key: string]: any },
) {
  return request<API.FormatRes>('/api/User/Get', {
    method: 'GET',
    params: {
      // current has a default value: 1
      current: '1',
      // pageSize has a default value: 20
      pageSize: '20',
      ...params,
    },
    ...(options || {}),
  });
}

/** 修改用户 PUT /api/User/Put */
export async function putUserPut(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putUserPutParams,
  options?: { [key: string]: any },
) {
  return request<API.FormatRes>('/api/User/Put', {
    method: 'PUT',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
