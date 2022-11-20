using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FaceTrain.Models
{
    /// <summary>
    /// 用户信息
    /// </summary>
    public class UserInfo
    {
        /// <summary>
        /// 用户ID
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ID { get; set; }
        /// <summary>
        /// 用户名字
        /// </summary>
        public string? UserName { get; set; }
        /// <summary>
        /// 用户手机号
        /// </summary>
        public string? Phone { get; set; }
    }
}
