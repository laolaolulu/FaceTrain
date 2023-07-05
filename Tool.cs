using OpenCvSharp;
using System.ComponentModel.DataAnnotations;

namespace FaceTrain
{
    /// <summary>
    /// 
    /// </summary>
    public class Tool
    {
        /// <summary>
        /// 人脸检测级联分类器
        /// </summary>
        public static CascadeClassifier Classifier = new("wwwroot/Haar/haarcascade_frontalface_alt2.xml");
    }


    /// <summary>
    /// 返回值工具类
    /// </summary>
    public class ApiTool
    {
        /// <summary>
        /// 返回成功
        /// </summary>
        /// <param name="msg"></param>
        /// <returns></returns>
        public static ApiRes Success(string? msg = null) => new() { Success = true, Msg = msg };

        /// <summary>
        /// 返回成功没有data,调用必须传递T值;
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="msg">成功信息</param>
        /// <returns></returns>
        public static ApiRes<T> Success<T>(string? msg = null) => new() { Success = true, Msg = msg };

        /// <summary>
        /// 返回成功有data;调用示例: ApiRes.Success(1, "成功");
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data">数据</param>
        /// <param name="msg">成功信息</param>
        /// <returns></returns>
        public static ApiRes<T> Success<T>(T data, string? msg = null) => new() { Success = true, Data = data, Msg = msg };


        /// <summary>
        /// 返回失败
        /// </summary>
        /// <param name="msg"></param>
        /// <returns></returns>
        public static ApiRes Failure(string? msg = null) => new() { Success = false, Msg = msg };


        /// <summary>
        /// 返回失败没有data,调用必须传递T值;
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="msg">失败信息</param>
        /// <returns></returns>
        public static ApiRes<T> Failure<T>(string? msg = null) => new() { Success = false, Msg = msg };

        /// <summary>
        /// 返回失败有data;调用示例: ApiRes.Failure(1, "失败");
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data"></param>
        /// <param name="msg"></param>
        /// <returns></returns>
        public static ApiRes<T> Failure<T>(T data, string? msg = null) => new() { Success = false, Data = data, Msg = msg };

        /// <summary>
        /// 返回成功,分页数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="list">数据集合</param>
        /// <param name="total">总数据行数</param>
        /// <param name="msg">返回信息</param>
        /// <returns></returns>
        public static ApiRes<ResPage<T>> ResPage<T>(IEnumerable<T> list, int total, string? msg = null) => Success(new ResPage<T>(list, total), msg);

        /// <summary>
        /// 判断数据库变更信息是否大于0返回成功，否则返回失败
        /// </summary>
        /// <param name="number">SaveChanges执行结果的受影响的行数</param>
        /// <returns></returns>
        public static ApiRes Save(int number)
        {
            if (number > 0)
            {
                return Success();
            }
            else
            {
                return Failure();
            }
        }

        /// <summary>
        /// 判断数据库变更信息是否大于0返回成功，否则返回失败
        /// </summary>
        /// <param name="number">SaveChanges执行结果的受影响的行数</param>
        /// <returns></returns>
        public static ApiRes<T> Save<T>(int number, T data)
        {
            if (number > 0)
            {
                return Success(data);
            }
            else
            {
                return Failure(data);
            }
        }

    }

    /// <summary>
    /// API通用返回值类型
    /// </summary>
    public class ApiRes
    {
        /// <summary>
        /// 是否成功
        /// </summary>
        [Required]
        public bool Success { get; set; }
        /// <summary>
        /// 返回信息
        /// </summary>
        public string? Msg { get; set; }
    }

    /// <summary>
    /// API通用返回值类型
    /// </summary>
    /// <typeparam name="T">数据类型</typeparam>
    public class ApiRes<T> : ApiRes
    {

        /// <summary>
        /// 返回数据
        /// </summary>
        /// <value>The value.</value>
        public T? Data { get; set; }
    }

    /// <summary>
    /// 分页数据
    /// </summary>
    /// <typeparam name="T">数据类型</typeparam>
    public class ResPage<T>
    {
        /// <summary>
        /// 构造器
        /// </summary>
        /// <param name="list"></param>
        /// <param name="total"></param>
        public ResPage(IEnumerable<T> list, int total)
        {
            Data = list;
            Total = total;
        }
        /// <summary>
        /// 分页总行数
        /// </summary>
        [Required]
        public int Total { get; set; }

        /// <summary>
        /// 分页数据集合
        /// </summary>
        [Required]
        public IEnumerable<T> Data { get; set; }

    }

}
