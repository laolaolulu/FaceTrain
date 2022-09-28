declare namespace API {
  type getApiUserParams = {
    page?: number;
    pageSize?: number;
  };

  type postApiUserParams = {
    ID?: string;
    UserName?: string;
  };

  type WeatherForecast = {
    date?: string;
    temperatureC?: number;
    temperatureF?: number;
    summary?: string;
  };
}
