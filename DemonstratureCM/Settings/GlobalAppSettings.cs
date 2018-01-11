using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemonstratureCM.Settings
{
    /// <summary>
    /// Global Application Settings
    /// </summary>
    public static class GlobalAppSettings
    {
        public const int NumCol = 5;
        public const int NumRow = 4;
        public const int DayForDeadline = 6; // 0 -> 6 | sunday -> saturday
        public const string NoDateString = "Nema podataka0:00:00";
        public const string RoleAdministrator = "A";
        public const string RoleDemonstrator = "A";
    }
}
