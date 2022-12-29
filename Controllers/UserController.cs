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
        public Res<(IEnumerable<UserInfo> list, int total)> Get(int current = 1, int pageSize = 20)
        {
            using var ctx = new AppDbContext();
            var users = ctx.UserInfos;
            int total = users.Count();
            var data = users.Skip((current - 1) * pageSize).Take(pageSize);

            foreach (var item in data)
            {
                item.Faces = Directory.Exists(string.Format("wwwroot/Faces/{0}", item.ID)) ?
                   Directory.GetFiles(string.Format("wwwroot/Faces/{0}/", item.ID))
                   .Select(s => Request.Scheme + "://" + Request.Host.Value + s.TrimStart("wwwroot".ToArray())) : null;
            }
            return new Res().Page(data, total);
        }

        /// <summary>
        /// 添加用户
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        [HttpPost]
        public Res Add(UserInfo user)
        {
            using var ctx = new AppDbContext();
            if (ctx.UserInfos.Any(a => a.ID == user.ID))
            {
                return new Res(false, "用户ID重复");
            }
            else
            {
                ctx.UserInfos.Add(user);
                ctx.SaveChanges();
                return new Res();
            }
        }
        /// <summary>
        /// 修改用户
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        [HttpPut]
        public Res Put(UserInfo user)
        {
            using var ctx = new AppDbContext();
            var m = ctx.UserInfos.Find(user.ID);
            if (m == null)
            {
                return new Res(false, "用户不存在");
            }
            else
            {
                m.Phone = user.Phone;
                m.UserName = user.UserName;
                ctx.SaveChanges();
                return new Res(true, "修改成功！");
            }
        }
        /// <summary>
        /// 删除用户
        /// </summary>
        /// <param name="ID">用户ID</param>
        /// <returns></returns>
        [HttpDelete]
        public Res Delete(int ID)
        {
            using var ctx = new AppDbContext();
            var m = ctx.UserInfos.Find(ID);
            if (m == null)
            {
                return new Res(false, "用户不存在");
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

                return new Res(true, "修改成功！");
            }
        }
        /// <summary>
        /// 添加用户人脸
        /// </summary>
        /// <param name="ID">用户id</param>
        /// <param name="image">人脸</param>
        /// <returns></returns>
        [HttpPost]
        public Res AddImg(int ID, IFormFile[] image, bool update = false)
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

                return new Res(true, "新增了(" + image.Length + ")张人脸照片");
            }
            else
            {
                return new Res(false, "未找到此用户:" + ID);
            }
        }

        /// <summary>
        /// 删除用户脸图片
        /// </summary>
        /// <param name="ID"></param>
        /// <param name="facesName"></param>
        /// <returns></returns>
        [HttpDelete]
        public Res DelFace(int ID, string[] facesName)
        {
            foreach (var name in facesName)
            {
                var imgurl = string.Format("wwwroot/Faces/{0}/{1}", ID, name);
                if (System.IO.File.Exists(imgurl))
                {
                    System.IO.File.Delete(imgurl);
                }
            }
            return new Res(true, "删除了(" + facesName.Length + ")张人脸照片");
        }
    }
}
