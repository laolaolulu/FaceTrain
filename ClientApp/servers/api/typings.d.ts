declare namespace API {
  type getApiUserParams = {
    page?: number;
    pageSize?: number;
  };

  type postApiUserParams = {
    /** 用户ID */
    ID?: string;
    /** 用户名字 */
    UserName?: string;
  };

  type WeatherForecast = {
    date?: string;
    temperatureC?: number;
    temperatureF?: number;
    summary?: string;
  };
}
