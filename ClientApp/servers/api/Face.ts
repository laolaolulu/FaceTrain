// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 上传模型 POST /api/Face/AddModel */
export async function postFaceAddModel(body: {}, file?: File, options?: { [key: string]: any }) {
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

  return request<any>('/api/Face/AddModel', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 删除用户脸图片 DELETE /api/Face/Del */
export async function deleteFaceDel(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteFaceDelParams,
  body: {
    facesName?: string[];
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

  return request<number>('/api/Face/Del', {
    method: 'DELETE',
    params: {
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 删除模型 DELETE /api/Face/DelModel */
export async function deleteFaceDelModel(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteFaceDelModelParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/Face/DelModel', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取模型列表 GET /api/Face/GetModel */
export async function getFaceGetModel(options?: { [key: string]: any }) {
  return request<string[]>('/api/Face/GetModel', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 人脸识别 PUT /api/Face/Predict */
export async function putFacePredict(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putFacePredictParams,
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

  return request<API.PredictRes[]>('/api/Face/Predict', {
    method: 'PUT',
    params: {
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 人脸模型训练 PUT /api/Face/Train */
export async function putFaceTrain(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putFaceTrainParams,
  body: {
    label?: string[];
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

  return request<any>('/api/Face/Train', {
    method: 'PUT',
    params: {
      // type has a default value: LBPH
      type: 'LBPH',
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}
