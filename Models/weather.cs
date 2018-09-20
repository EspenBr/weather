namespace weather.Models
{
    public class WeatherItem
    {
        //Temperatures
        public float curr_temp { get; set; }
        public float max_temp_day { get; set; }
        public float min_temp_day { get; set; }
        public float curr_wind_speed { get; set; }
        public int curr_wind_dir { get; set; }
        public System.DateTime date { get; set; }
        public float barometer { get; set; }
        public float rain_day { get; set; }
        public float rain_month { get; set; }
        public float rain_year { get; set; }
        public string datetime { get; set; }
        public float rain_bar_day_value { get; set; }
        public float rain_bar_top_value { get; set; }
        public float rain_bar_mid_value { get; set; }

    }
}