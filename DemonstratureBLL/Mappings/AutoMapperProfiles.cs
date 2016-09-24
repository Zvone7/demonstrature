using AutoMapper;
using DemonstratureCM.DTO;
using DemonstratureDB.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



namespace DemonstratureBLL.Mappings
{
    public class AutoMapperProfiles : Profile
    {
        [Obsolete]
        protected override void Configure()
        {
            //CreateMap<Weeks, WeekDTO>();
            CreateMap<UserT, MyUserDTO>().ReverseMap();
        }
    }
}