using FaceTrain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FaceTrain.Controllers
{
    /// <summary>
    /// 人脸检测
    /// </summary>
    [Route("api/[controller]")]
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
        public object Get(int page = 1, int pageSize = 20)
        {
            using var ctx = new AppDbContext();
            var users = ctx.UserInfos;
            int total = users.Count();
            var list = users.Skip((page - 1) * pageSize).Take(pageSize).ToArray();
            return new { success = true, data = new { list, total } };
        }

        [HttpPost]
        public object Post([FromQuery] UserInfo user)
        {
            using var ctx = new AppDbContext();
            if (ctx.UserInfos.Find(user.ID) == null)
            {
                ctx.UserInfos.Add(user);
                ctx.SaveChanges();
                return new { success = true };
            }
            else
            {
                return new { success = false, msg = "用户ID重复" };
            }
        }
    }
}
