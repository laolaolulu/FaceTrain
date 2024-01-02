using FaceTrain.Helper;
using OpenCvSharp;
using OpenCvSharp.Dnn;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace FaceTrain.OpenCV
{
    public class ArcFace
    {
        readonly Net net;
        public ArcFace(byte[] model)
        {
            net = CvDnn.ReadNetFromOnnx(model)!;
        }

        public Mat Run(Mat image, List<Pointf> landmarks, int width, int height)
        {
            return Align(image, landmarks, width, height);
            Cv2.ImShow("对其前", image);
            Cv2.ImShow("对其后",Align(image, landmarks, width, height));
            Cv2.WaitKey(0);
        }


        static public Mat Align(Mat image, List<Pointf> landmarks, int width, int height)
        {
            //标准脸的关键点
            float[,] std = { { 38.2946f, 51.6963f }, { 73.5318f, 51.5014f }, { 56.0252f, 71.7366f }, { 41.5493f, 92.3655f }, { 70.7299f, 92.2041f } };
            Mat S = new Mat(5, 2, MatType.CV_32FC1, std);

            Mat Q = Mat.Zeros(10, 4, MatType.CV_32FC1);
            Mat S1 = S.Reshape(0, 10);

            for (int i = 0; i < 5; i++)
            {
                Q.At<float>(i * 2 + 0, 0) = landmarks[i].X;
                Q.At<float>(i * 2 + 0, 1) = landmarks[i].Y;
                Q.At<float>(i * 2 + 0, 2) = 1;
                Q.At<float>(i * 2 + 0, 3) = 0;

                Q.At<float>(i * 2 + 1, 0) = landmarks[i].Y;
                Q.At<float>(i * 2 + 1, 1) = -landmarks[i].X;
                Q.At<float>(i * 2 + 1, 2) = 0;
                Q.At<float>(i * 2 + 1, 3) = 1;
            }

            Mat MM = (Q.T() * Q).Inv() * Q.T() * S1;

            Mat M = new Mat(2, 3, MatType.CV_32FC1, new float[,] { { MM.At<float>(0, 0), MM.At<float>(1, 0), MM.At<float>(2, 0) }, { -MM.At<float>(1, 0), MM.At<float>(0, 0), MM.At<float>(3, 0) } });

            OpenCvSharp.Mat dst = new Mat();
            Cv2.WarpAffine(image, dst, M, new OpenCvSharp.Size(width, height));

            return dst;
        }
    }


}
