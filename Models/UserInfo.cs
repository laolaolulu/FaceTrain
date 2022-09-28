using System.ComponentModel.DataAnnotations;

namespace FaceTrain.Models
{
    public class UserInfo
    {
        [Key]
        public string ID { get; set; }
        public string? UserName { get; set; }
    }
}
