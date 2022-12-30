using FaceTrain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OpenCvSharp;
using OpenCvSharp.Face;
using System.Collections.Generic;
using System.IO;
using System.Text;

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
        public ResPage<UserInfo> Get(int current = 1, int pageSize = 20)
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
            return new ResPage<UserInfo>(data, total);
        }

        /// <summary>
        /// 添加用户
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<UserInfo>> Add(UserInfo user)
        {
            ctx.UserInfos.Add(user);
            try
            {
                await ctx.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserInfoExists(user.ID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUserInfoxx", new { id = user.ID }, user);
        }
        /// <summary>
        /// 修改用户
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        [HttpPut]
        public async Task<IActionResult> Put(UserInfo user)
        {
            ctx.Entry(user).State = EntityState.Modified;

            try
            {
                await ctx.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserInfoExists(user.ID))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();

        }
        /// <summary>
        /// 删除用户
        /// </summary>
        /// <param name="ID">用户ID</param>
        /// <returns></returns>
        [HttpDelete]
        public async Task<IActionResult> Del(int ID)
        {
            var userInfo = await ctx.UserInfos.FindAsync(ID);
            if (userInfo == null)
            {
                return NotFound();
            }

            ctx.UserInfos.Remove(userInfo);
            await ctx.SaveChangesAsync();

            return NoContent();
        }
        /// <summary>
        /// 添加用户人脸
        /// </summary>
        /// <param name="ID">用户id</param>
        /// <param name="image">人脸</param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult AddImg(int ID, IFormFile[] image, bool update = false)
        {
            if (UserInfoExists(ID))
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
                return Ok(image.Length);
            }
            else
            {
                return NotFound();
            }
        }

     


        private bool UserInfoExists(int id)
        {
            return ctx.UserInfos.Any(e => e.ID == id);
        }
    }



}
