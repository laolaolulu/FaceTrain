﻿using FaceTrain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using OpenCvSharp;
using OpenCvSharp.Face;
using System;
using System.Buffers.Text;
using System.Reflection.Emit;
using System.Text;
using System.Web.Helpers;
using System.Xml.Linq;
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
        public Res<(IEnumerable<string> list, int total)> Get()
        {
            using var ctx = new AppDbContext();
            int total = ctx.UserInfos.Count();
            var models =
                  Directory.GetFiles("wwwroot/Model/").Select(s => Request.Scheme + "://" + Request.Host.Value + s.TrimStart("wwwroot".ToArray()));

            return new Res().Page(models, total);
        }
        /// <summary>
        /// 上传模型
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        [HttpPost]
        public Res Add(IFormFile file)
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
            return new Res();
        }
        /// <summary>
        /// 删除模型
        /// </summary>
        /// <param name="fileName"></param>
        /// <returns></returns>
        [HttpDelete]
        public Res Delete(string fileName)
        {
            var imgurl = "wwwroot/Model/";
            if (System.IO.File.Exists(imgurl + fileName))
            {
                GC.Collect();
                GC.WaitForPendingFinalizers();
                System.IO.File.Delete(imgurl + fileName);
            }

            return new Res();
        }

        /// <summary>
        /// 人脸模型训练
        /// </summary>
        /// <param name="label"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        [HttpPost]
        public Res Train(string[]? label = null, string? type = "LBPH")
        {
            try
            {
                if (label == null)
                {
                    label = Array.Empty<string>();
                }
                var ctx = new AppDbContext();
                var labels = ctx.UserInfos.Select(s => new { s.ID, labelinfo = string.Format("{0}-{1}", label.Contains("Name") ? s.UserName : "", label.Contains("Phone") ? s.Phone : "").Trim('-') }).ToArray();



                FaceRecognizer recognizer;
                if (type == "Eigen")
                {
                    recognizer = EigenFaceRecognizer.Create();
                }
                else if (type == "Fisher")
                {
                    recognizer = FisherFaceRecognizer.Create();
                }
                else
                {
                    recognizer = LBPHFaceRecognizer.Create();
                }

                List<Mat> imgs = new();
                List<int> labs = new();
                foreach (var item in labels)
                {
                    var imgurl = string.Format("wwwroot/Faces/{0}/", item.ID);
                    if (Directory.Exists(imgurl))
                    {
                        recognizer.SetLabelInfo(item.ID, Convert.ToBase64String(Encoding.Default.GetBytes(item.labelinfo)));
                        foreach (var name in Directory.GetFiles(imgurl))
                        {
                            var mat = new Mat(name, ImreadModes.Grayscale);
                            if (type == "Eigen" || type == "Fisher")
                            {
                                mat = mat.Resize(new Size(200, 200));
                            }
                            imgs.Add(mat);
                            labs.Add(item.ID);
                        }
                    }
                }
                recognizer.Train(imgs, labs);
                var modelname = string.Format("{0}_{1}_{2}.xml", type, labels.Length, DateTime.Now.ToString("yyyyMMddHHmmss"));
                recognizer.Save("wwwroot/Model/" + modelname);
                recognizer.Dispose();
                return new Res();
                //  return new FormatRes("成功生成识别模型：" + modelname, true);
            }
            catch (Exception e)
            {
                return new Res(false, "模型生成失败：" + e.Message);
            }

        }
        /// <summary>
        /// 人脸识别
        /// </summary>
        /// <param name="image"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [ProducesResponseType(typeof(ResponseT<(int id, string name)>), 400)]
        public JsonResult Predict(IFormFile[] image, string? model = null)
        {
            
               // Res<IEnumerable<(string name, int label, double confidence, string msg)>?>
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
                if (model.StartsWith("Eigen_"))
                {
                    recognizer = EigenFaceRecognizer.Create();
                }
                else if (model.StartsWith("Fisher_"))
                {
                    recognizer = FisherFaceRecognizer.Create();
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
                          var facemat = Mat.FromStream(item.OpenReadStream(), ImreadModes.Grayscale);
                          if (model.StartsWith("Eigen_") || model.StartsWith("Fisher_"))
                          {
                              facemat = facemat.Resize(new Size(200, 200));
                          }
                          recognizer.Predict(facemat, out int label, out double confidence);
                          facemat.Dispose();
                          string msg = Encoding.Default.GetString(Convert.FromBase64String(recognizer.GetLabelInfo(label)));

                          return (item.FileName, label, confidence, msg);
                      });
                    ts.Add(t);
                }
                Task.WaitAll(ts.ToArray());
                recognizer.Dispose();
                return Ok( new Res().Data(ts.Select(s => (name: s.Result.Item1, label: s.Result.Item2, confidence: s.Result.Item3, msg: s.Result.Item4))));
            }
            else
            {
              
                return Json ( new Res(false, "模型（" + model + "）不存在"));
            }
        }
    }
}
