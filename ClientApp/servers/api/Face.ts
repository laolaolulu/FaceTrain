// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 上传模型 POST /api/Face/Add */
export async function postFaceAdd(body: {}, file?: File, options?: { [key: string]: any }) {
  const formData = new FormData();

  if (file) {
    formData.append('file', file);
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

  return request<API.Res>('/api/Face/Add', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 删除模型 DELETE /api/Face/Delete */
export async function deleteFaceDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteFaceDeleteParams,
  options?: { [key: string]: any },
) {
  return request<API.Res>('/api/Face/Delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取模型列表以及用户数量 GET /api/Face/Get */
export async function getFaceGet(options?: { [key: string]: any }) {
  return request<API.StringIEnumerableInt32ValueTupleRes>('/api/Face/Get', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 人脸识别 POST /api/Face/Predict */
export async function postFacePredict(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postFacePredictParams,
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

  return request<any>('/api/Face/Predict', {
    method: 'POST',
    params: {
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 人脸模型训练 POST /api/Face/Train */
export async function postFaceTrain(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postFaceTrainParams,
  body: string[],
  options?: { [key: string]: any },
) {
  return request<API.Res>('/api/Face/Train', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      // type has a default value: LBPH
      type: 'LBPH',
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}
