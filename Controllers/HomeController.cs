using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using weather.Models;

namespace weather.Controllers
{
    public class HomeController : Controller
    {
        private static readonly IList<TemperatureModel> _temps;

        static HomeController()
        {
            _temps = new List<TemperatureModel>
            {
                new TemperatureModel(12.2m){Date = new System.DateTime(2018,9,11)},
                new TemperatureModel(13.1m){Date = new System.DateTime(2018,9,10)},
                new TemperatureModel(11.4m){Date = new System.DateTime(2018,9,9)},
            };
        }

        public ActionResult Index()
        {
            return View();
        }

        [Route("api/temps")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult Temperature()
        {
            return Json(_temps);
        }
    }
}