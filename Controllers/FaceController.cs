using FaceTrain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpenCvSharp;
using OpenCvSharp.Face;

namespace FaceTrain.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FaceController : ControllerBase
    {
        [HttpPost]
        public object Tran([FromQuery] UserInfo user)
        {
            using (var parameter = new FacemarkLBF.Params())
            {

                var recognizer = LBPHFaceRecognizer.Create();
                recognizer.Save("");
               // recognizer.Train();
            }
            return null;
        }
    }
}
