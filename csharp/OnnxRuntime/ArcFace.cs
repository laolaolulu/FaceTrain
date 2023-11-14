using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FaceTrain.OnnxRuntime
{
    public class ArcFace
    {
        readonly InferenceSession net;
        readonly int[] dimensions;
        readonly string input_name;
        readonly float mean = 127.5f, stddev = 127.5f;
        public ArcFace(byte[] model)
        {
            net = new InferenceSession(model);
            input_name = net.InputNames[0];
            dimensions = net.InputMetadata[input_name].Dimensions;
        }

        public void Run(byte[] img)
        {
            using Image<Rgb24> image = Image.Load<Rgb24>(img);
            image.Mutate(x =>
            {
                x.Resize(dimensions[2], dimensions[3]);
            });
            dimensions[0] = 1;
            DenseTensor<float> processedImage = new(dimensions);
            image.ProcessPixelRows(accessor =>
            {
                for (int y = 0; y < accessor.Height; y++)
                {
                    Span<Rgb24> pixelSpan = accessor.GetRowSpan(y);
                    for (int x = 0; x < accessor.Width; x++)
                    {
                        processedImage[0, 0, y, x] = (pixelSpan[x].R - mean) / stddev;
                        processedImage[0, 1, y, x] = (pixelSpan[x].G - mean) / stddev;
                        processedImage[0, 2, y, x] = (pixelSpan[x].B - mean) / stddev;
                    }
                }
            });
            //stopwatch.Stop();
            //Debug.WriteLine("pretreatment:" + stopwatch.Elapsed.TotalMilliseconds);

            using var inputOrtValue = OrtValue.CreateTensorValueFromMemory(OrtMemoryInfo.DefaultInstance,
                                        processedImage.Buffer, new long[] { 1, dimensions[1], dimensions[2], dimensions[3] });

            var inputs = new Dictionary<string, OrtValue>
                {
                    { input_name, inputOrtValue }
                };

            //执行推理
            using var results = net.Run(new RunOptions(), inputs, net.OutputNames);

            var tensor = results[0].GetTensorDataAsSpan<float>();
            float[] embedding = new float[tensor.Length];

            double l2 = 0;
            for (int i = 0; i < tensor.Length; i++)
            {
                embedding[i] = tensor[i];
                l2 = l2 + Math.Pow(tensor[i], 2);
            }
            l2 = Math.Sqrt(l2);

            for (int i = 0; i < embedding.Length; i++)
                embedding[i] = embedding[i] / (float)l2;
        }
    }
}
