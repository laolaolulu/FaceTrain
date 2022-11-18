using FaceTrain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using OpenCvSharp;
using OpenCvSharp.Face;
using System.Reflection.Emit;

namespace FaceTrain.Controllers
{
    /// <summary>
    /// 人脸模型
    /// </summary>
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FaceController : ControllerBase
    {
        /// <summary>
        /// 获取模型列表以及用户数量
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public FormatRes Get()
        {
            using var ctx = new AppDbContext();
            int total = ctx.UserInfos.Count();
            var models =
                  Directory.GetFiles("wwwroot/Model/").Select(s => Request.Scheme + "://" + Request.Host.Value + s.TrimStart("wwwroot".ToArray()));

            return new FormatRes(new { list = models, total });
        }


        /// <summary>
        /// 人脸模型训练
        /// </summary>
        /// <param name="label"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        [HttpPost]
        public FormatRes Train(string[]? label = null, string? type = "LBPH")
        {
            try
            {
                if (label == null || label.Length == 0)
                {
                    label = new string[1] { "ID" };
                }
                var ctx = new AppDbContext();
                var labels = ctx.UserInfos.Select(s => new { ID = int.Parse(s.ID), labelinfo = string.Format("{0}-{1}-{2}", label.Contains("ID") ? s.ID : "", label.Contains("Name") ? s.UserName : "", label.Contains("Phone") ? s.Phone : "").Trim('-') }).ToArray();

                using var recognizer = LBPHFaceRecognizer.Create();
                List<Mat> imgs = new();
                List<int> labs = new();
                foreach (var item in labels)
                {
                    var imgurl = string.Format("wwwroot/Faces/{0}/", item.ID);
                    if (Directory.Exists(imgurl))
                    {
                        recognizer.SetLabelInfo(item.ID, item.labelinfo);
                        foreach (var name in Directory.GetFiles(imgurl))
                        {
                            imgs.Add(new Mat(name, ImreadModes.Grayscale));
                            labs.Add(item.ID);
                        }
                    }
                }
                recognizer.Train(imgs, labs);
                var modelname = string.Format("{0}_{1}_{2}.xml", type, labels.Length, DateTime.Now.ToString("yyyyMMddHHmmss"));
                recognizer.Save("wwwroot/Model/" + modelname);
                return new FormatRes(true);
                //  return new FormatRes("成功生成识别模型：" + modelname, true);
            }
            catch (Exception e)
            {
                return new FormatRes("模型生成失败：" + e.Message);
            }

        }


    }
}
