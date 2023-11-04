using FaceTrain.Helper;
using OpenCvSharp;
using OpenCvSharp.Dnn;
using System.Diagnostics;

namespace FaceTrain.Opencv
{
    public class SCRFD : ISCRFD
    {
        readonly Net net;
        readonly int inputWidth, inputHeight,  num_anchors = 1;
        readonly bool use_kps = false;
        readonly int[] feat_stride_fpn = { 8, 16, 32 };
        readonly IEnumerable<string> outBlobNames;
        readonly Dictionary<int, List<Pointf>> centerPoints = new();

        public SCRFD(byte[] model, int _inputWidth = 640, int _inputHeight = 640)
        {
            inputWidth = _inputWidth;
            inputHeight = _inputHeight;
            net = CvDnn.ReadNetFromOnnx(model)!;
            outBlobNames = net.GetUnconnectedOutLayersNames()!;
            switch (outBlobNames.Count())
            {
                case 6:
                    num_anchors = 2;
                    break;
                case 9:
                    num_anchors = 2;
                    use_kps = true;
                    break;
                case 10:
                    feat_stride_fpn = new int[] { 8, 16, 32, 64, 128 };
                    num_anchors = 1;
                    break;
                case 15:
                    feat_stride_fpn = new int[] { 8, 16, 32, 64, 128 };
                    num_anchors = 1;
                    use_kps = true;
                    break;
            }

            foreach (var stride in feat_stride_fpn)
            {
                int num_grid_w = inputWidth / stride;
                int num_grid_h = inputHeight / stride;
                var points = new List<Pointf>();
                for (int y = 0; y < num_grid_h; ++y)
                {
                    for (int x = 0; x < num_grid_w; ++x)
                    {
                        for (int k = 0; k < num_anchors; ++k)
                        {
                            points.Add(new Pointf(x, y));
                        }
                    }
                }
                centerPoints.Add(stride, points);
            }
        }

        public List<FaceBox> Detection(byte[] img, float threshold = 0.5f)
        {
            using Mat image = Cv2.ImDecode(img, ImreadModes.Color);
            //缩放图片
            var resizeRes = Resize(image);
            using var mat = resizeRes.mat;
            //预处理图片
            using var blob = CvDnn.BlobFromImage(mat, 1 / 128.0, new Size(inputWidth, inputHeight), new Scalar(127.5, 127.5, 127.5), true, false);
           var ses= blob.AsSpan<float>();
            //将图片输入到网络中
            net.SetInput(blob);
            //创建返回集合对象
            var outputBlobs = outBlobNames.Select(s => new Mat()).ToArray();
            Stopwatch stopwatch = new();
            stopwatch.Start();
            //推理
            net.Forward(outputBlobs, outBlobNames);
            stopwatch.Stop();
            Debug.WriteLine("time:" + stopwatch.Elapsed.TotalSeconds.ToString("0.00"));
            var res = new List<FaceBox>();
            for (int idx = 0; idx < feat_stride_fpn.Length; idx++)
            {
                int stride = feat_stride_fpn[idx];
                var bbox_preds = outputBlobs[idx + feat_stride_fpn.Length];
                Mat? kps_preds = null;
                if (use_kps)
                {
                    kps_preds = outputBlobs[idx + feat_stride_fpn.Length * 2];
                }
              //  var faces = new List<FaceBox>();
                for (int i = 0; i < outputBlobs[idx].Size(1); i++)
                {
                    var score = outputBlobs[idx].At<float>(0, i, 0);
                    if (score >= threshold)
                    {
                        float l = bbox_preds.At<float>(0, i, 0); // left
                        float t = bbox_preds.At<float>(0, i, 1); // top
                        float r = bbox_preds.At<float>(0, i, 2); // right
                        float b = bbox_preds.At<float>(0, i, 3); // bottom
                        var point = centerPoints[stride][i];
                        float x1 = ((point.X - l) * stride - resizeRes.dw) / resizeRes.ratio;
                        float y1 = ((point.Y - t) * stride - resizeRes.dh) / resizeRes.ratio;
                        float x2 = ((point.X + r) * stride - resizeRes.dw) / resizeRes.ratio;
                        float y2 = ((point.Y + b) * stride - resizeRes.dh) / resizeRes.ratio;

                        // landmarks
                        List<Pointf>? points = null;
                        if (kps_preds != null)
                        {
                            points = new List<Pointf>();
                            for (int j = 0; j < 10; j += 2)
                            {
                                float kps_l = kps_preds.At<float>(0, i, j);
                                float kps_t = kps_preds.At<float>(0, i, j + 1);
                                float kps_x = ((point.X + kps_l) * stride - resizeRes.dw) / resizeRes.ratio;
                                float kps_y = ((point.Y + kps_t) * stride - resizeRes.dh) / resizeRes.ratio;
                                points.Add(new Pointf(Math.Min(Math.Max(0, kps_x), image.Width - 1), Math.Min(Math.Max(0, kps_y), image.Height - 1)));
                            }
                        }
                        res.Add(new FaceBox(score, Math.Max(0, x1), Math.Max(0, y1), Math.Min(image.Width - 1, x2), Math.Min(image.Height - 1, y2), points));
                    }
                }
            }
            CvDnn.NMSBoxes(res.Select(s => Rect2d.FromLTRB(s.Left, s.Top, s.Right, s.Bottom)), res.Select(s => s.Score), threshold, 0.4f, out int[] indices);
           
            return res.Where((w,index)=> indices.Contains(index)).ToList();
        }

        /// <summary>
        /// 将图片等比例缩放到指定大小
        /// </summary>
        /// <param name="img"></param>
        /// <returns></returns>
        (Mat mat, float ratio, int dw, int dh) Resize(Mat img)
        {
            float w_r = inputWidth / (float)img.Cols, h_r = inputHeight / (float)img.Rows;
            float ratio = (w_r < h_r) ? w_r : h_r;

            int new_unpad_w = (int)(img.Cols * ratio), new_unpad_h = (int)(img.Rows * ratio);

            int dw = (inputWidth - new_unpad_w) / 2, dh = (inputHeight - new_unpad_h) / 2;

            var mat = new Mat(inputHeight, inputWidth, MatType.CV_8UC3, new Scalar(0, 0, 0));
            img.Resize(new Size(new_unpad_w, new_unpad_h))
                .CopyTo(mat[new Rect(dw, dh, new_unpad_w, new_unpad_h)]);
            return (mat, ratio, dw, dh);
        }


        public void Dispose() => net.Dispose();
    }


}