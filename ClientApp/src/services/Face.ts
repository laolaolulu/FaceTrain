// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 人脸模型训练 POST /api/Face/Train */
export async function postFaceTrain(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postFaceTrainParams,
  body: string[],
  options?: { [key: string]: any },
) {
  return request<API.FormatRes>('/api/Face/Train', {
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

/** 获取模型列表以及用户数量 GET /api/Face/Get */
export async function getFaceGet(options?: { [key: string]: any }) {
  return request<API.FormatRes>('/api/Face/Get', {
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
        typeof item === 'object' && !(item instanceof File)
          ? JSON.stringify(item)
          : item,
      );
    }
  });

  return request<API.FormatRes>('/api/Face/Predict', {
    method: 'POST',
    params: {
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}
