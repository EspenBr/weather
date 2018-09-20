using System.Collections.Generic;
using System.Linq;
using weather.Models;

namespace weather.Interfaces
{
    #region snippet1
    public interface ITemperatureRepository
    {
        IEnumerable<TemperatureModel> ListAll();
        void Add(TemperatureModel temp);
    }
    #endregion
}