using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using weather.Models;

namespace weather.Controllers
{
    [Route("api/Weather")]
    public class WeatherController : Controller
    {
        public IConfiguration Configuration { get; }

        [HttpGet]
        [EnableCors("MyPolicy")]
        public WeatherModel GetLast()
        {
            WeatherModel _item = new WeatherModel();

            MySqlConnection _conn = new MySqlConnection("Data Source=localhost;database=Weather;User=root;Password=Leveller73;SslMode=None");
            MySqlCommand _com = new MySqlCommand("SELECT datetime ,average_windspeed,wind_direction,temperature,barometer,daily_rainfall,monthly_rainfall,max_daily_temperature,min_daily_temperature,yearly_rainfall,datetime FROM weather.weather order by datetime desc LIMIT 1;", _conn);

            _conn.Open();
            MySqlDataReader _reader = _com.ExecuteReader();
            _reader.Read();

            _item.date = System.DateTime.ParseExact(_reader.GetString(0), "yyyyMMddHHmmss", System.Globalization.CultureInfo.CurrentCulture);
            _item.curr_wind_speed = _reader.GetFloat(1);
            _item.curr_wind_dir = _reader.GetInt16(2);
            _item.curr_temp = _reader.GetFloat(3);
            _item.barometer = _reader.GetFloat(4);
            _item.rain_day = _reader.GetFloat(5);
            _item.rain_month = _reader.GetFloat(6);
            _item.max_temp_day = _reader.GetFloat(7);
            _item.min_temp_day = _reader.GetFloat(8);
            _item.rain_year = _reader.GetFloat(9);
            _item.datetime = _reader.GetString(10);
            _item.rain_bar_top_value = (int)(Math.Ceiling(_item.rain_day / 10.0d) * 10);
            _item.rain_bar_mid_value = _item.rain_bar_top_value / 2;
            _item.rain_bar_day_value = _reader.GetFloat(5) * (400 / _item.rain_bar_top_value);
            if (_item.curr_temp < 0)
            {
                _item.temp_bg_color = "rgb(" + (255 - (8.5d * _item.curr_temp)).ToString() + ", " + (255 - (8.5d * _item.curr_temp)).ToString() + ", 226)";
            }
            else
            {
                _item.temp_bg_color = "rgb(226," + (255 - (8.5d * _item.curr_temp)).ToString() + ", " + (255 - (8.5d * _item.curr_temp)).ToString() + ")";
            }
            //_item.temp_bg_color = "#df3341";

            _reader.Close();

            _com.CommandText = "select w.daily_rainfall from weather w where w.date = curdate() and extract(hour from w.time)  = (extract(hour from sysdate())-1)  limit 1 ";
            _reader = _com.ExecuteReader();
            DataTable dtRain = new DataTable();
            dtRain.Load(_reader);
            _item.rain_last_hour = _item.rain_day - float.Parse(dtRain.Rows[0][0].ToString());
            _item.rain_last_hour = (float)Math.Round((double)_item.rain_last_hour, 1);
            _conn.Close();
            return _item;
        }
        [HttpGet("{datetime}")]
        [EnableCors("MyPolicy")]
        public TemperatureHistory GetTemp(string datetime)
        {
            TemperatureHistory tempHistory = new TemperatureHistory();
            //string _temp = "";
            float temp_diff = 0;
            float deg_factor = 0;
            string history = "M ";
            float previous = 0;

            MySqlConnection conn = new MySqlConnection("Data Source=localhost;database=Weather;User=root;Password=Leveller73;SslMode=None");
            MySqlCommand com = new MySqlCommand($"SELECT time FROM weather.weather where datetime like '{datetime}%' order by datetime desc LIMIT 1;", conn);

            conn.Open();
            //MySqlDataReader _reader = _com.ExecuteReader();

            com.CommandText = "select max(temperature),min(temperature) from  weather.weather w where datetime > date_format(date_sub(sysdate(), interval 1 day),'%Y%m%d%H%i%s') order by datetime ";
            MySqlDataReader reader = com.ExecuteReader();
            reader.Read();
            tempHistory.max = reader.GetFloat(0);
            tempHistory.min = reader.GetFloat(1);
            reader.Close();

            //Lag streker for max og min
            //finn forholdstall for tegning av kurve
            tempHistory.diff = tempHistory.max - tempHistory.min;
            temp_diff = tempHistory.max - tempHistory.min;
            deg_factor = 400 / temp_diff;
            tempHistory.zero_point = tempHistory.max - (tempHistory.diff / 2);
            tempHistory.zero_point = (float)Math.Round(tempHistory.zero_point, 1);
            //Finn historiske verdier
            //Parallel.For(0, 49, i =>

            com.CommandText = "select date,time,round(avg(temperature),1) as temperature from weather GROUP BY UNIX_TIMESTAMP(datetime) DIV 1800 order by datetime desc limit 50";
            reader = com.ExecuteReader();
            string strTest = "";
            int i = 0;
            while (reader.Read()) //(int i = 0; i < 50; i++)
            {

                /*
                com.CommandText = $"SELECT temperature FROM weather.weather where datetime like date_format(date_sub(sysdate(), interval {i * 30} MINUTE),'%Y%m%d%H%i%') order by datetime desc LIMIT 1 ";
                                _reader.Read();
                if (reader.Read())
                {
                    previous = reader.GetFloat(0);
                    */
                history += (522 - (10 * i)).ToString() + " " + (Math.Round(470 - ((reader.GetFloat(2) - tempHistory.min) * deg_factor), 0)).ToString() + " L ";
                strTest += reader.GetFloat(2).ToString() + " - ";
                i++;
                /*
            }
            else
            {
            history += (30 + (10 * i)).ToString() + " " + (Math.Round(270 - ((tempHistory.zero_point - previous) * deg_factor), 0)).ToString() + " L ";
            }
            reader.Close();
                */
            }
            //);

            history = history.Substring(0, history.Length - 2);

            conn.Close();
            tempHistory.temperature = history;

            return tempHistory;// _history;
        }
    }
}