using FaceTrain.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OpenCvSharp;
using OpenCvSharp.Face;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Xml.Linq;

namespace FaceTrain.Controllers
{
    /// <summary>
    /// 用户信息
    /// </summary>
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext ctx;
        /// <summary>
        /// 
        /// </summary>
        /// <param name="_ctx"></param>
        public UserController(AppDbContext _ctx)
        {
            ctx = _ctx;
        }

        /// <summary>
        /// 获取用户数据
        /// </summary>
        /// <param name="current"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpGet]
        public ApiRes<ResPage<UserInfo>> Get(int current = 1, int pageSize = 20)
        {
            var users = ctx.UserInfos;
            int total = users.Count();
            var data = users.Skip((current - 1) * pageSize).Take(pageSize);
            foreach (var item in data)
            {
                item.Faces = Directory.Exists(string.Format("wwwroot/Faces/{0}", item.ID)) ?
                   Directory.GetFiles(string.Format("wwwroot/Faces/{0}/", item.ID))
                   .Select(s => Request.Scheme + "://" + Request.Host.Value + s.TrimStart("wwwroot".ToArray())) : null;
            }
            return ApiTool.ResPage(data, total);
        }

        /// <summary>
        /// 添加用户
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        [HttpPost]
        public ApiRes<int> Add([FromForm, Required] UserInfo user)
        {
            ctx.UserInfos.Add(user);
            return ApiTool.Save(ctx.SaveChanges(), user.ID);
        }
        /// <summary>
        /// 修改用户
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        [HttpPut]
        public ApiRes Put([FromForm, Required] UserInfo user)
        {
            ctx.Entry(user).State = EntityState.Modified;
            return ApiTool.Save(ctx.SaveChanges());
        }
        /// <summary>
        /// 删除用户
        /// </summary>
        /// <param name="ID">用户ID</param>
        /// <returns></returns>
        [HttpDelete]
        public ApiRes Del([Required] int ID)
        {
            var userInfo =  ctx.UserInfos.Find(ID);
            if (userInfo == null)
            {
                return ApiTool.Failure();
            }

            ctx.UserInfos.Remove(userInfo);
            var res= ctx.SaveChanges();

            //判断如果有人脸照片也一并删除
            var imgurl = string.Format("wwwroot/Faces/{0}", ID);
            if (Directory.Exists(imgurl))
            {
                Directory.Delete(imgurl, true);
            }
            return ApiTool.Save(res);
        }
        /// <summary>
        /// 添加用户人脸
        /// </summary>
        /// <param name="ID">用户id</param>
        /// <param name="image">人脸</param>
        /// <param name="isface">是否为人脸区域图片</param>
        /// <returns></returns>
        [HttpPost]
        public ApiRes<int> AddImg([Required] int ID, [Required] IFormFile[] image, bool? isface = true)
        {         
            if (ctx.UserInfos.Any(e => e.ID == ID))
            {
                var imgurl = string.Format("wwwroot/Faces/{0}", ID);
                if (!Directory.Exists(imgurl))
                {
                    Directory.CreateDirectory(imgurl);
                }
                var dtstr = DateTime.Now.ToString("yyyyMMddHHmmssfff");
                int count = 0;
                for (int i = 0; i < image.Length; i++)
                {
                    var path = string.Format("{0}-{1}.{2}", dtstr, i, image[i].ContentType.Substring(6));
                    using var facemat = Mat.FromStream(image[i].OpenReadStream(), ImreadModes.Color);
                    if (isface == false)
                    {
                        var faces = Tool.Classifier.DetectMultiScale(facemat);
                        for (int Index = 0; Index < faces.Length; Index++)
                        {
                            using Mat face = facemat[faces[Index]];
                            Cv2.ImWrite(string.Format("{0}/{1}_{2}", imgurl, Index, path), face);
                            count++;
                        }

                    }
                    else
                    {
                        Cv2.ImWrite(string.Format("{0}/{1}", imgurl, path), facemat);
                        count++;
                    }
                }
                return ApiTool.Success(count);
            }
            else
            {
                return ApiTool.Failure<int>();
            }
        }




      
    }



}
