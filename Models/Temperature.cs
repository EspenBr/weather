
using System;
using System.ComponentModel.DataAnnotations;

namespace weather.Models
{
    public class TemperatureModel
    {

        public TemperatureModel(decimal temp)
        {
            this.Temp = temp;
        }
        private TemperatureModel()
        {

        }
        [Key]
        public Guid Id { get; private set; } = Guid.NewGuid();
        public decimal Temp { get; private set; } = 0;
        public DateTime Date { get; set; } = DateTime.Now;

    }
}