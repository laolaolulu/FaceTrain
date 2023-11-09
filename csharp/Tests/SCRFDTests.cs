using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenCvSharp;
using System.Diagnostics;
namespace FaceTrain.Tests
{
    [TestClass()]
    public class SCRFDTests
    {
        [TestMethod()]
        public void DetectionTestVideo()
        {
            Stopwatch stopwatch = new();
            using VideoCapture capture = new(0);
            byte[] modelBytes = File.ReadAllBytes("Resource\\Model\\SCRFD\\scrfd_500m_shape640x640.onnx");
            using var net = new OnnxRuntime.SCRFD(modelBytes);
            while (true)
            {
                using Mat frame = new();
                capture.Read(frame);
                var img = frame.ToBytes();
                stopwatch.Restart();
                var faces = net.Detection(img);
                stopwatch.Stop();
                DrawTextWithBackground(frame, "time:" + stopwatch.Elapsed.TotalSeconds.ToString("0.00"), new Point(30, 50));

                foreach (var face in faces)
                {
                    frame.Rectangle(Rect.FromLTRB((int)face.Left, (int)face.Top, (int)face.Right, (int)face.Bottom), new Scalar(255));
                    DrawTextWithBackground(frame, "score:" + face.Score.ToString("0.00"), new Point(face.Left + 10, face.Top + 30));
                    if (face.Landmark != null)
                    {
                        foreach (var point in face.Landmark)
                        {
                            frame.Circle((int)point.X, (int)point.Y, 1, Scalar.Red, -1);
                        }
                    }
                }
                Cv2.ImShow("video", frame);
                if (Cv2.WaitKey(30) >= 0)
                    break;
            }
        }
        [TestMethod()]
        public void DetectionTestImages()
        {
            Stopwatch stopwatch = new();
            byte[] modelBytes = File.ReadAllBytes("Resource\\Model\\SCRFD\\scrfd_1g_bnkps_shape640x640.onnx");
            using var net = new FaceTrain.OnnxRuntime.SCRFD(modelBytes);
            var imgsName = Directory.GetFiles("Resource\\Img");
            var imgs = imgsName.Select(s =>(name:s,img: File.ReadAllBytes(s)) );
          // var img = File.ReadAllBytes("Resource\\Img\\test.png");
            foreach (var item in imgs)
            {
                using var image = Cv2.ImDecode(item.img, ImreadModes.Color);
                stopwatch.Restart();
                var faces = net.Detection(item.img);
                stopwatch.Stop();
                DrawTextWithBackground(image, "time:" + stopwatch.Elapsed.TotalSeconds.ToString("0.00"), new Point(30, 50));
                foreach (var face in faces)
                {
                    image.Rectangle(Rect.FromLTRB((int)face.Left, (int)face.Top, (int)face.Right, (int)face.Bottom), new Scalar(255));
                    DrawTextWithBackground(image, "score:" + face.Score.ToString("0.00"), new Point(face.Left + 10, face.Top + 30));
                    if (face.Landmark != null)
                    {
                        foreach (var point in face.Landmark)
                        {
                            image.Circle((int)point.X, (int)point.Y, 2, Scalar.Red, -1);
                        }
                    }
                }
                Cv2.ImShow(DateTime.Now.Ticks.ToString(), image);
            }
            Cv2.WaitKey(0);
        }

        public static void DrawTextWithBackground(Mat image, string text, Point position)
        {
            var fontFace = HersheyFonts.HersheySimplex;
            double fontScale = 0.8;
            int fontThickness = 2;

            Size textSize = Cv2.GetTextSize(text, fontFace, fontScale, fontThickness, out _);

            // Calculate the background rectangle coordinates
            Point rectTopLeft = new(position.X - 10, position.Y - (textSize.Height + 10));
            Point rectBottomRight = new(position.X + textSize.Width + 10, position.Y + 5);

            // Draw the background rectangle
            Cv2.Rectangle(image, rectTopLeft, rectBottomRight, Scalar.Red, -1); // -1 fills the rectangle

            // Draw the text on top of the background
            Cv2.PutText(image, text, position, fontFace, fontScale, Scalar.White, fontThickness);
        }

    }
}