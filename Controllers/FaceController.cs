using FaceTrain.Models;
using Microsoft.AspNetCore.Mvc;
using OpenCvSharp;
using OpenCvSharp.Face;
using System;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.Json;

namespace FaceTrain.Controllers
{
    /// <summary>
    /// 人脸管理
    /// </summary>
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FaceController : ControllerBase
    {
        /// <summary>
        /// 获取模型列表
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IEnumerable<string> GetModel()
        {
            //  using var ctx = new AppDbContext();
            // int total = ctx.UserInfos.Count();
            var models =
                  Directory.GetFiles("wwwroot/Model/").Select(s => Request.Scheme + "://" + Request.Host.Value + s.TrimStart("wwwroot".ToArray()));

            return models;
        }

        /// <summary>
        /// 人脸模型训练
        /// </summary>
        /// <param name="label"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        [HttpPut]
        public IActionResult Train(string[] label, string? type = "LBPH")
        {
            using var ctx = new AppDbContext();
            var labels = ctx.UserInfos.Select(s => new
            {
                s.ID,
                labelinfo = string.Format("{0}-{1}", label.Contains("Name") ? s.UserName : "",
                label.Contains("Phone") ? s.Phone : "").Trim('-')
            }).ToArray();

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
            return NoContent();
        }



        /// <summary>
        /// 人脸识别
        /// </summary>
        /// <param name="image"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut]
        // [ProducesResponseType(typeof(IEnumerable<(string name, int label, double confidence, string msg)>), 200)]
        //  [ProducesResponseType(typeof(IEnumerable<A>), 200)]
        public ActionResult<IEnumerable<PredictRes>> Predict([Required] IFormFile[] image, string? model = null)
        {
            var imgurl = "wwwroot/Model/";
            if (model == null)
            {
                var namemodels = Directory.GetFiles(imgurl)
                    .Select(s => (time: System.IO.File.GetLastWriteTime(s), src: s))
                    .OrderByDescending(o => o.time).FirstOrDefault().src;

                if (namemodels == null)
                {
                    return NotFound();
                }
                else
                {
                    model = namemodels.Split("/").Last();
                }
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
                List<Task<PredictRes>> ts = new();
                foreach (var item in image)
                {
                    var t = Task.Run<PredictRes>(() =>
                      {
                          var facemat = Mat.FromStream(item.OpenReadStream(), ImreadModes.Grayscale);
                          if (model.StartsWith("Eigen_") || model.StartsWith("Fisher_"))
                          {
                              facemat = facemat.Resize(new Size(200, 200));
                          }
                          recognizer.Predict(facemat, out int label, out double confidence);
                          facemat.Dispose();
                          string msg = Encoding.Default.GetString(Convert.FromBase64String(recognizer.GetLabelInfo(label)));

                          return new PredictRes() { Name = item.FileName, Label = label, Confidence = confidence, Msg = msg };
                      });
                    ts.Add(t);
                }
                Task.WaitAll(ts.ToArray());
                recognizer.Dispose();
                return Ok(ts.Select(s => s.Result));
            }
            else
            {
                return NotFound();
            }
        }

        /// <summary>
        /// 上传模型
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult AddModel([Required] IFormFile file)
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
            return NoContent();
        }
        /// <summary>
        /// 删除模型
        /// </summary>
        /// <param name="fileName"></param>
        /// <returns></returns>
        [HttpDelete]
        public IActionResult DelModel([Required] string fileName)
        {
            var imgurl = "wwwroot/Model/";
            if (System.IO.File.Exists(imgurl + fileName))
            {
                GC.Collect();
                GC.WaitForPendingFinalizers();
                System.IO.File.Delete(imgurl + fileName);
            }
            return NoContent();
        }

        /// <summary>
        /// 删除用户脸图片
        /// </summary>
        /// <param name="ID"></param>
        /// <param name="facesName"></param>
        /// <returns></returns>
        [HttpDelete]
        public ActionResult<int> Del([Required] int ID, string[] facesName)
        {
            var res = 0;
            foreach (var name in facesName)
            {
                var imgurl = string.Format("wwwroot/Faces/{0}/{1}", ID, name);
                if (System.IO.File.Exists(imgurl))
                {
                    System.IO.File.Delete(imgurl);
                    res++;
                }
            }
            return Ok(res);
        }


    }


    public class PredictRes
    {
        [Required]
        public string Name { get; set; } = "";
        [Required]
        public int Label { get; set; }
        [Required]
        public double Confidence { get; set; }
        [Required]
        public string Msg { get; set; } = "";
    }
}
