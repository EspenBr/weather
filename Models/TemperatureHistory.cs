namespace weather.Models
{
    public class TemperatureHistory
    {
        public string temperature { get; set; }
        public float max { get; set; }
        public float min { get; set; }
        public float zero_point { get; set; }
        public float diff { get; set; }
    }
}