using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemonstratureBLL.Mappings
{
    public class AutoMapperConfiguration
    {
        private static IMapper instance;
        public static IMapper Instance { get { return instance; } }

        public static void RegisterMappings()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new AutoMapperProfiles());
            });

            instance = config.CreateMapper();

        }
    }
}
