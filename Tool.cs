using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FaceTrain
{
    public class Tool
    {
    }

    ///// <summary>
    ///// 响应数据格式
    ///// </summary>
    //public class FormatRes
    //{

    //    /// <summary>
    //    /// 
    //    /// </summary>
    //    public FormatRes()
    //    {
    //    }
    //    /// <summary>
    //    /// 返回成功或者失败信息
    //    /// </summary>
    //    /// <param name="msg">信息</param>
    //    /// <param name="success">成功或失败 默认false</param>
    //    public FormatRes(string msg, bool success = false)
    //    {
    //        Msg = msg;
    //        Success = success;
    //    }

    //    /// <summary>
    //    /// 返回含数据
    //    /// </summary>
    //    /// <param name="data">泛型数据</param>
    //    /// <param name="msg">返回信息 可为空</param>
    //    /// <param name="success">是否成功 默认true</param>
    //    public FormatRes(dynamic data, string msg = null, bool success = true) : this(msg, success)
    //    {
    //        Data = data;
    //    }

    //    /// <summary>
    //    /// 是否返回成功
    //    /// </summary>
    //    public bool Success { get; set; }

    //    /// <summary>
    //    /// 返回信息
    //    /// </summary>
    //    public string Msg { get; set; }

    //    /// <summary>
    //    /// 返回数据
    //    /// </summary>
    //    public dynamic Data { get; set; }
    //}

    /// <summary>
    /// 响应数据格式
    /// </summary>
    public class Res
    {
        /// <summary>
        /// 构造器
        /// </summary>
        /// <param name="success"></param>
        /// <param name="msg"></param>
        public Res(bool success = true, string? msg = null)
        {
            Success = success;
            Msg = msg;
        }
        /// <summary>
        /// 分页数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="list"></param>
        /// <param name="total"></param>
        /// <returns></returns>
        public Res<(IEnumerable<T> list, int total)> Page<T>(IEnumerable<T> list, int total)
        {
            return new Res<(IEnumerable<T> list, int total)>((list, total));
        }
        /// <summary>
        /// 返回数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="data"></param>
        /// <returns></returns>
        public Res<T?> Data<T>(T? data)
        {
            return new Res<T?>(data);
        }

        /// <summary>
        /// 是否返回成功
        /// </summary>
        [Required]
        public bool Success { get; set; }
        /// <summary>
        /// 返回信息
        /// </summary>
        public string? Msg { get; set; }
    }
    /// <summary>
    /// 响应数据格式
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class Res<T> : Res
    {
        //public Res()
        //{
        //}
        /// <summary>
        /// 构造器
        /// </summary>
        /// <param name="data"></param>
        public Res(T data)
        {
            Data = data;
        }
        /// <summary>
        /// 返回数据
        /// </summary>
        public T Data { get; set; }
    }
}
