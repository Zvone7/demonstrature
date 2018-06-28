using AutoMapper;
using DemonstratureCM.BM;
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
            CreateMap<UserT, MyUserDto>().ReverseMap();
			CreateMap<UserT, MyUserBm>().ReverseMap();
            CreateMap<CourseT, CourseDto>().ReverseMap();
            CreateMap<CourseT, CourseBm>().ReverseMap();
			CreateMap<GroupT, GroupDto>().ReverseMap();
            CreateMap<TermT, TermDto>().ReverseMap();
        }
    }
}