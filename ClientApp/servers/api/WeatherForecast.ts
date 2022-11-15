// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 此处后端没有提供注释 GET /WeatherForecast */
export async function GetWeatherForecast(options?: { [key: string]: any }) {
  return request<API.WeatherForecast[]>('/WeatherForecast', {
    method: 'GET',
    ...(options || {}),
  });
}
