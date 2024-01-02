

using FaceTrain.Helper;
using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;
using SixLabors.ImageSharp.Formats;
using System.Collections;
using System.Diagnostics;

namespace FaceTrain.OnnxRuntime
{
    public class SCRFD : ISCRFD
    {
        readonly InferenceSession net;
        //  readonly int inputWidth, inputHeight;
        readonly string input_name;
        readonly int[] dimensions;
        readonly float mean = 127.5f, stddev = 128;
        readonly int[] feat_stride_fpn = { 8, 16, 32 };
        readonly bool use_kps = false;
        readonly Dictionary<int, List<Pointf>> centerPoints = new();

        public SCRFD(byte[] model)
        {
            net = new InferenceSession(model);
            input_name = net.InputNames[0];
            dimensions = net.InputMetadata[input_name].Dimensions;
            var num_anchors = 1;
            switch (net.OutputNames.Count)
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
                int num_grid_w = dimensions[2] / stride;
                int num_grid_h = dimensions[3] / stride;
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
#if DEBUG
            Stopwatch stopwatch = new();
            stopwatch.Start();
#endif

            using Image<Rgb24> image = Image.Load<Rgb24>(img);
#if DEBUG
            stopwatch.Stop();
            Debug.WriteLine("imgLoad:" + stopwatch.Elapsed.TotalMilliseconds);
            stopwatch.Restart();
#endif

            int width = image.Width, height = image.Height;
            float w_r = dimensions[2] / (float)width, h_r = dimensions[3] / (float)height;
            float ratio = (w_r < h_r) ? w_r : h_r;
            int new_unpad_w = (int)(width * ratio), new_unpad_h = (int)(height * ratio);
            int dw = (dimensions[2] - new_unpad_w) / 2, dh = (dimensions[3] - new_unpad_h) / 2;

            //输入图片缩放
            image.Mutate(x =>
            {
                x.Resize(new ResizeOptions
                {
                    Size = new Size(dimensions[2], dimensions[3]),
                    Mode = ResizeMode.Pad,
                });
            });
#if DEBUG
            stopwatch.Stop();
            Debug.WriteLine("imgResize:" + stopwatch.Elapsed.TotalMilliseconds);
            stopwatch.Restart();
#endif

            //将图片预处理网络输入结构
            var size = dimensions[2] * dimensions[3];
            var value = new float[3 * size];
            int baseIndex, index;

            image.ProcessPixelRows(accessor =>
            {
                for (int y = 0; y < accessor.Height; y++)
                {
                    Span<Rgb24> pixelSpan = accessor.GetRowSpan(y);
                    baseIndex = y * accessor.Width;
                    for (int x = 0; x < accessor.Width; x++)
                    {
                        index = baseIndex + x;
                        value[index] = (pixelSpan[x].B - mean) / stddev;
                        value[index + size] = (pixelSpan[x].G - mean) / stddev;
                        value[index + size * 2] = (pixelSpan[x].R - mean) / stddev;
                    };

                }
            });

#if DEBUG
            stopwatch.Stop();
            Debug.WriteLine("imgBolb:" + stopwatch.Elapsed.TotalMilliseconds);
            stopwatch.Restart();
#endif

            using var inputOrtValue = OrtValue.CreateTensorValueFromMemory(value, new long[] { dimensions[0], dimensions[1], dimensions[2], dimensions[3] });
            var inputs = new Dictionary<string, OrtValue>
                {
                    { input_name, inputOrtValue }
                };

            //执行推理
            using var results = net.Run(new RunOptions(), inputs, net.OutputNames);
#if DEBUG
            stopwatch.Stop();
            Debug.WriteLine("run:" + stopwatch.Elapsed.TotalMilliseconds);
            stopwatch.Restart();
#endif
            var res = new List<FaceBox>();
            for (int idx = 0; idx < feat_stride_fpn.Length; idx++)
            {
                int stride = feat_stride_fpn[idx];
                var scores = results[idx].GetTensorDataAsSpan<float>();
                var bbox_preds = results[idx + feat_stride_fpn.Length].GetTensorDataAsSpan<float>();
                ReadOnlySpan<float> kps_preds = null;
                if (use_kps)
                {
                    kps_preds = results[idx + feat_stride_fpn.Length * 2].GetTensorDataAsSpan<float>();
                }

                for (int i = 0; i < scores.Length; i++)
                {
                    if (scores[i] >= threshold)
                    {
                        float l = bbox_preds[i * 4]; // left
                        float t = bbox_preds[i * 4 + 1]; // top
                        float r = bbox_preds[i * 4 + 2]; // right
                        float b = bbox_preds[i * 4 + 3]; // bottom
                        var point = centerPoints[stride][i];
                        float x1 = ((point.X - l) * stride - dw) / ratio;
                        float y1 = ((point.Y - t) * stride - dh) / ratio;
                        float x2 = ((point.X + r) * stride - dw) / ratio;
                        float y2 = ((point.Y + b) * stride - dh) / ratio;

                        // landmarks
                        List<Pointf>? points = null;
                        if (kps_preds != null)
                        {
                            points = new List<Pointf>();
                            for (int j = 0; j < 10; j += 2)
                            {
                                float kps_l = kps_preds[i * 10 + j];
                                float kps_t = kps_preds[i * 10 + j + 1];
                                float kps_x = ((point.X + kps_l) * stride - dw) / ratio;
                                float kps_y = ((point.Y + kps_t) * stride - dh) / ratio;
                                points.Add(new Pointf(Math.Min(Math.Max(0, kps_x), width - 1), Math.Min(Math.Max(0, kps_y), height - 1)));
                            }
                        }
                        res.Add(new FaceBox(scores[i], Math.Max(0, x1), Math.Max(0, y1), Math.Min(width - 1, x2), Math.Min(height - 1, y2), points));
                    }
                }
            }
            res = Core.NMSBoxes(res, 0.4f);
#if DEBUG
            stopwatch.Stop();
            Debug.WriteLine("res:" + stopwatch.Elapsed.TotalMilliseconds);
#endif
            return res;
        }


        public void Dispose() => net.Dispose();

    }


}