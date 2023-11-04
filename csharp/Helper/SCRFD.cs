namespace FaceTrain.Helper
{
    public interface ISCRFD : IDisposable
    {
        public List<FaceBox> Detection(byte[] img, float threshold = 0.5f);
    }



}