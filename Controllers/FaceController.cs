using FaceTrain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using OpenCvSharp;
using OpenCvSharp.Face;
using System.Reflection.Emit;
using static System.Net.Mime.MediaTypeNames;

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
        /// 上传模型
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        [HttpPost]
        public FormatRes Add(IFormFile file)
        {
            var imgurl = "wwwroot/Model/";
            if (System.IO.File.Exists(imgurl + file.FileName))
            {
                imgurl += "0" + file.FileName;
            }
            else
            {
                imgurl += file.FileName;
            }
            System.IO.File.Create(imgurl);
            return new FormatRes(true);
        }
        /// <summary>
        /// 删除模型
        /// </summary>
        /// <param name="fileName"></param>
        /// <returns></returns>
        [HttpDelete]
        public FormatRes Delete(string fileName)
        {
            var imgurl = "wwwroot/Model/";
            if (System.IO.File.Exists(imgurl + fileName))
            {
                GC.Collect();
                GC.WaitForPendingFinalizers();
                System.IO.File.Delete(imgurl + fileName);
            }

            return new FormatRes(true);
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
        /// <summary>
        /// 人脸识别
        /// </summary>
        /// <param name="image"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public FormatRes Predict(IFormFile[] image, string? model = null)
        {
            var imgurl = "wwwroot/Model/";
            if (model == null)
            {
                var namemodels =
                  Directory.GetFiles(imgurl).LastOrDefault();
                model = namemodels.Split("/").LastOrDefault();
            }
            if (System.IO.File.Exists(imgurl + model))
            {
                FaceRecognizer recognizer;
                if (model.StartsWith("LBPH_"))
                {
                    recognizer = LBPHFaceRecognizer.Create();
                }
                else
                {
                    recognizer = LBPHFaceRecognizer.Create();
                }
                recognizer.Read(imgurl + model);
                List<Task<(string, int, double, string)>> ts = new();
                foreach (var item in image)
                {
                    var t = Task.Run<(string, int, double, string)>(() =>
                      {
                          using var facemat = Mat.FromStream(item.OpenReadStream(), ImreadModes.Grayscale);
                          recognizer.Predict(facemat, out int label, out double confidence);
                          string msg = recognizer.GetLabelInfo(label);
                          return (item.FileName, label, confidence, msg);
                      });
                    ts.Add(t);
                }
                Task.WaitAll(ts.ToArray());
                return new FormatRes(ts.Select(s => new { name = s.Result.Item1, label = s.Result.Item2, confidence = s.Result.Item3, msg = s.Result.Item4 }));
            }
            else
            {
                return new FormatRes("模型（" + model + "）不存在");
            }




        }
    }
}
