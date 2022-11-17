using FaceTrain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpenCvSharp;
using System.Collections.Generic;
using System.IO;

namespace FaceTrain.Controllers
{
    /// <summary>
    /// 人脸检测
    /// </summary>
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        /// <summary>
        /// 获取用户数据
        /// </summary>
        /// <param name="current"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpGet]
        public FormatRes Get(int current = 1, int pageSize = 20)
        {
            using var ctx = new AppDbContext();
            var users = ctx.UserInfos;
            int total = users.Count();
            var data = users.Skip((current - 1) * pageSize).Take(pageSize).ToArray();

            var list = data.Select(s => new
            {
                s.ID,
                s.Phone,
                s.UserName,
                Faces = Directory.Exists(string.Format("wwwroot/Faces/{0}", s.ID)) ?
                Directory.GetFiles(string.Format("wwwroot/Faces/{0}/", s.ID)).Select(s => Request.Scheme + "://" + Request.Host.Value + s.TrimStart("wwwroot".ToArray())) : null
            });
            return new FormatRes(new { list, total });
        }

        /// <summary>
        /// 添加用户
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        [HttpPost]
        public FormatRes Add([FromQuery] UserInfo user)
        {
            using var ctx = new AppDbContext();
            if (ctx.UserInfos.Any(a => a.ID == user.ID))
            {
                return new FormatRes(false, "用户ID重复");
            }
            else
            {
                ctx.UserInfos.Add(user);
                ctx.SaveChanges();
                return new FormatRes(true);
            }
        }
        /// <summary>
        /// 修改用户
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        [HttpPut]
        public FormatRes Put([FromQuery] UserInfo user)
        {
            using var ctx = new AppDbContext();
            var m = ctx.UserInfos.Find(user.ID);
            if (m == null)
            {
                return new FormatRes(false, "用户不存在");
            }
            else
            {
                m.Phone = user.Phone;
                m.UserName = user.UserName;
                ctx.SaveChanges();
                return new FormatRes(true, "修改成功！");
            }
        }
        /// <summary>
        /// 删除用户
        /// </summary>
        /// <param name="ID">用户ID</param>
        /// <returns></returns>
        [HttpDelete]
        public FormatRes Delete(string ID)
        {
            using var ctx = new AppDbContext();
            var m = ctx.UserInfos.Find(ID);
            if (m == null)
            {
                return new FormatRes(false, "用户不存在");
            }
            else
            {
                ctx.UserInfos.Remove(m);
                ctx.SaveChanges();

                //清除用户照片目录
                var src = string.Format("wwwroot/Faces/{0}/", ID);
                if (Directory.Exists(src))
                {
                    Directory.Delete(src, true);
                }

                return new FormatRes(true, "修改成功！");
            }
        }
        /// <summary>
        /// 添加用户人脸
        /// </summary>
        /// <param name="ID">用户id</param>
        /// <param name="image">人脸</param>
        /// <returns></returns>
        [HttpPost]
        public FormatRes AddImg(string ID, IFormFile[] image, bool update = false)
        {
            using var ctx = new AppDbContext();
            if (ctx.UserInfos.Any(a => a.ID == ID))
            {
                var imgurl = string.Format("wwwroot/Faces/{0}", ID);
                if (!Directory.Exists(imgurl))
                {
                    Directory.CreateDirectory(imgurl);
                }
                foreach (var img in image)
                {

                    using var facemat = Mat.FromStream(img.OpenReadStream(), ImreadModes.Color);
                    Cv2.ImWrite(imgurl + string.Format("/{0}", img.FileName), facemat);
                }

                return new FormatRes(true, "新增了(" + image.Length + ")张人脸照片");
            }
            else
            {
                return new FormatRes(false, "未找到此用户:" + ID);
            }
        }

        /// <summary>
        /// 删除用户脸图片
        /// </summary>
        /// <param name="ID"></param>
        /// <param name="facesName"></param>
        /// <returns></returns>
        [HttpDelete]
        public FormatRes DelFace(string ID, string[] facesName)
        {
            foreach (var name in facesName)
            {
                var imgurl = string.Format("wwwroot/Faces/{0}/{1}", ID, name);
                if (System.IO.File.Exists(imgurl))
                {
                    System.IO.File.Delete(imgurl);
                }
            }
            return new FormatRes(true, "删除了(" + facesName.Length + ")张人脸照片");
        }
    }
}
