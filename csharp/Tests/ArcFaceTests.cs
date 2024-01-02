using Microsoft.VisualStudio.TestTools.UnitTesting;
using FaceTrain.OnnxRuntime;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenCvSharp.Dnn;
using OpenCvSharp;
using System.Diagnostics;

namespace FaceTrain.OnnxRuntime.Tests
{
    [TestClass()]
    public class ArcFaceTests
    {
        [TestMethod()]
        public void RunTest()
        {
            byte[] modelBytes = File.ReadAllBytes("Resource\\Model\\ArcFace\\cisia_r50_pfc-2021年8月5日.onnx");
            var net = new OnnxRuntime.ArcFace(modelBytes);
            var imgsName = Directory.GetFiles("Resource\\Img");
            var imgs = imgsName.Select(s => (name: s, img: File.ReadAllBytes(s)));
            // var img = File.ReadAllBytes("Resource\\Img\\test.png");
            foreach (var item in imgs)
            {
                using var image = Cv2.ImDecode(item.img, ImreadModes.Color);
                //   stopwatch.Restart();
                //  net.Run(item.img);
                
            //    stopwatch.Stop();
           //     DrawTextWithBackground(image, "time:" + stopwatch.Elapsed.TotalSeconds.ToString("0.00"), new Point(30, 50));
                //foreach (var face in faces)
                //{
                //    image.Rectangle(Rect.FromLTRB((int)face.Left, (int)face.Top, (int)face.Right, (int)face.Bottom), new Scalar(255));
                ////    DrawTextWithBackground(image, "score:" + face.Score.ToString("0.00"), new Point(face.Left + 10, face.Top + 30));
                //    if (face.Landmark != null)
                //    {
                //        foreach (var point in face.Landmark)
                //        {
                //            image.Circle((int)point.X, (int)point.Y, 2, Scalar.Red, -1);
                //        }
                //    }
                //}
                //Cv2.ImShow(DateTime.Now.Ticks.ToString(), image);
            }
            Cv2.WaitKey(0);
        }
    }
}