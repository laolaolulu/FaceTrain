using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FaceTrain.Helper
{
    public class Core
    {
        public static List<FaceBox> NMSBoxes(List<FaceBox> boxes, float overlapThreshold)
        {
            // 根据置信度对边界框进行排序（降序）
            boxes.Sort((box1, box2) => box2.Score.CompareTo(box1.Score));
            List<FaceBox> selectedBoxes = new();
            while (boxes.Count > 0)
            {
                FaceBox currentBox = boxes[0];
                selectedBoxes.Add(currentBox);
                boxes.RemoveAt(0);
                float areaCurrent = (currentBox.Right - currentBox.Left) * (currentBox.Bottom - currentBox.Top);
                for (int i = 0; i < boxes.Count; i++)
                {
                    FaceBox candidateBox = boxes[i];

                    float x1 = Math.Max(currentBox.Left, candidateBox.Left);
                    float y1 = Math.Max(currentBox.Top, candidateBox.Top);
                    float x2 = Math.Min(currentBox.Right, candidateBox.Right);
                    float y2 = Math.Min(currentBox.Bottom, candidateBox.Bottom);

                    float intersectionArea = Math.Max(0, x2 - x1) * Math.Max(0, y2 - y1);

                    float IoU = intersectionArea / (areaCurrent + (candidateBox.Right - candidateBox.Left) * (candidateBox.Bottom - candidateBox.Top) - intersectionArea);
                    if (IoU > overlapThreshold)
                    {
                        boxes.RemoveAt(i);
                        i--;
                    }
                }
            }
            return selectedBoxes;
        }

    }
    public class FaceBox
    {
        public FaceBox(float score, float boxLeft, float boxTop, float boxRight, float boxBottom, List<Pointf>? landmark = null)
        {
            Score = score;
            Left = boxLeft;
            Right = boxRight;
            Bottom = boxBottom;
            Top = boxTop;
            Landmark = landmark;
        }
        public float Score { get; set; }
        public float Left { get; set; }
        public float Right { get; set; }
        public float Bottom { get; set; }
        public float Top { get; set; }
        public List<Pointf>? Landmark { get; set; }
    }

    public class Pointf
    {
        public Pointf(float x, float y)
        {
            X = x;
            Y = y;
        }
        public float X { get; set; }
        public float Y { get; set; }
    }
}
