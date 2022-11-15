using FaceTrain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpenCvSharp;
using System.Collections.Generic;

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
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpGet]
        public FormatRes Get(int page = 1, int pageSize = 20)
        {
            using var ctx = new AppDbContext();
            var users = ctx.UserInfos;
            int total = users.Count();
            var list = users.Skip((page - 1) * pageSize).Take(pageSize).ToArray();
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
        /// 添加用户人脸
        /// </summary>
        /// <param name="ID">用户id</param>
        /// <param name="image">人脸</param>
        /// <returns></returns>
        [HttpPost]
        public FormatRes AddImg(string ID, IFormFile image, bool update = false)
        {
            using var ctx = new AppDbContext();
            if (ctx.UserInfos.Any(a => a.ID == ID))
            {
                using var facemat = Mat.FromStream(image.OpenReadStream(), ImreadModes.Color);
                var imgurl = string.Format("wwwroot/Faces/{0}", ID);
                if (!Directory.Exists(imgurl))
                {
                    Directory.CreateDirectory(imgurl);
                }
                imgurl += string.Format("/{0}.jpg", DateTime.Now.ToString("yyyyMMddHHmmssfff"));
                Cv2.ImWrite(imgurl, facemat);
                return new FormatRes(true);
            }
            else
            {
                return new FormatRes(false, "未找到此用户:" + ID);
            }
        }


    }
}
