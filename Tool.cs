using OpenCvSharp;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FaceTrain
{
    public class Tool
    {
        /// <summary>
        /// 人脸检测级联分类器
        /// </summary>
        public static CascadeClassifier Classifier = new ("wwwroot/Haar/haarcascade_frontalface_alt2.xml");
    }

   
    /// <summary>
    /// 
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class ResPage<T>
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="list"></param>
        /// <param name="total"></param>
        public ResPage(IEnumerable<T> list, int total)
        {
            List = list;
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
        public IEnumerable<T> List { get; set; }
    }
}
