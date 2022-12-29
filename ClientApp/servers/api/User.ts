// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 添加用户 POST /api/User/Add */
export async function postUserAdd(body: API.UserInfo, options?: { [key: string]: any }) {
  return request<API.Res>('/api/User/Add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 添加用户人脸 POST /api/User/AddImg */
export async function postUserAddImg(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postUserAddImgParams,
  body: {},
  image?: File[],
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  if (image) {
    image.forEach((f) => formData.append('image', f || ''));
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

  return request<API.Res>('/api/User/AddImg', {
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
  return request<API.Res>('/api/User/Delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 删除用户脸图片 DELETE /api/User/DelFace */
export async function deleteUserDelFace(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserDelFaceParams,
  body: string[],
  options?: { [key: string]: any },
) {
  return request<API.Res>('/api/User/DelFace', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取用户数据 GET /api/User/Get */
export async function getUserGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserGetParams,
  options?: { [key: string]: any },
) {
  return request<API.UserInfoIEnumerableInt32ValueTupleRes>('/api/User/Get', {
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
export async function putUserPut(body: API.UserInfo, options?: { [key: string]: any }) {
  return request<API.Res>('/api/User/Put', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
