// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 添加用户 POST /api/User/Add */
export async function postUserAdd(
  body: {
    /** 用户ID */
    ID: number;
    /** 用户名字 */
    UserName?: string;
    /** 用户手机号 */
    Phone?: string;
    /** 人脸图片url */
    Faces?: string[];
  },
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      formData.append(
        ele,
        typeof item === 'object' && !(item instanceof File) ? JSON.stringify(item) : item,
      );
    }
  });

  return request<API.UserInfo>('/api/User/Add', {
    method: 'POST',
    data: formData,
    requestType: 'form',
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

  return request<any>('/api/User/AddImg', {
    method: 'POST',
    params: {
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 删除用户 DELETE /api/User/Del */
export async function deleteUserDel(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserDelParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/User/Del', {
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
  return request<API.UserInfoResPage>('/api/User/Get', {
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
  body: {
    /** 用户ID */
    ID: number;
    /** 用户名字 */
    UserName?: string;
    /** 用户手机号 */
    Phone?: string;
    /** 人脸图片url */
    Faces?: string[];
  },
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      formData.append(
        ele,
        typeof item === 'object' && !(item instanceof File) ? JSON.stringify(item) : item,
      );
    }
  });

  return request<any>('/api/User/Put', {
    method: 'PUT',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}
