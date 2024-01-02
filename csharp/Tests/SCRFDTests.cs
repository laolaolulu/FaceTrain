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
                DrawTextWithBackground(frame, "time:" + stopwatch.Elapsed.TotalSeconds.ToString("0.00"), new Point(30, 50), Scalar.Blue);

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
            byte[] modelBytes = File.ReadAllBytes("Resource\\Model\\SCRFD\\scrfd_500m_kps.onnx");
            using var net = new FaceTrain.Opencv.SCRFD(modelBytes);
            var imgsName = Directory.GetFiles("Resource\\Img");
            var imgs = imgsName.Select(s => (name: s, img: File.ReadAllBytes(s)));
            // var img = File.ReadAllBytes("Resource\\Img\\test.png");
            foreach (var item in imgs)
            {
                using var image = Cv2.ImDecode(item.img, ImreadModes.Color);
                stopwatch.Restart();
                Debug.WriteLine(item.name);
                var faces = net.Detection(item.img);
                stopwatch.Stop();
                DrawTextWithBackground(image, "time:" + stopwatch.Elapsed.TotalSeconds.ToString("0.00"), new Point(30, 50), Scalar.Blue);
                foreach (var face in faces)
                {
                    var rect = Rect.FromLTRB((int)face.Left, (int)face.Top, (int)face.Right, (int)face.Bottom);
                    image.Rectangle(rect, new Scalar(255));
                    DrawTextWithBackground(image, "score:" + face.Score.ToString("0.00"), new Point(face.Left + 10, face.Top + 30));
                    if (face.Landmark != null)
                    {
                        foreach (var point in face.Landmark)
                        {
                            image.Circle((int)point.X, (int)point.Y, 2, Scalar.Red, -1);
                        }
                        var faceres = new Mat(image, rect);
                        Cv2.ImShow("对其前"+DateTime.Now.Ticks.ToString(), faceres);
                      
                        foreach (var item1 in face.Landmark)
                        {
                            item1.X = item1.X - face.Left;
                            item1.Y = item1.Y - face.Top;
                        }
                        var acignres= OpenCV.ArcFace.Align(faceres, face.Landmark,112,112);
                        Cv2.ImShow("对其后"+DateTime.Now.Ticks.ToString(), acignres);
                     
                    }
                }
                Cv2.ImShow(DateTime.Now.Ticks.ToString(), image);
            }
            Cv2.WaitKey(0);
        }
        public static void DrawTextWithBackground(Mat image, string text, Point position)
        { DrawTextWithBackground(image, text, position, Scalar.Red); }
        public static void DrawTextWithBackground(Mat image, string text, Point position, Scalar bgColor)
        {
            var fontFace = HersheyFonts.HersheySimplex;
            double fontScale = 0.8;
            int fontThickness = 2;
            Scalar se = Scalar.Red;
            Size textSize = Cv2.GetTextSize(text, fontFace, fontScale, fontThickness, out _);

            // Calculate the background rectangle coordinates
            Point rectTopLeft = new(position.X - 10, position.Y - (textSize.Height + 10));
            Point rectBottomRight = new(position.X + textSize.Width + 10, position.Y + 5);

            // Draw the background rectangle
            Cv2.Rectangle(image, rectTopLeft, rectBottomRight, bgColor, -1); // -1 fills the rectangle

            // Draw the text on top of the background
            Cv2.PutText(image, text, position, fontFace, fontScale, Scalar.White, fontThickness);
        }

    }
}