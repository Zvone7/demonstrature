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
            CreateMap<UserT, MyUserDTO>().ReverseMap();
            CreateMap<MyUserWithPassDTO, UserT>();
            CreateMap<CourseT, CourseDTO>().ReverseMap();
            CreateMap<CourseUserT, CourseUserDTO>().ReverseMap();
            CreateMap<GroupT, GroupDTO>().ReverseMap();
            CreateMap<TermT, TermDTO>().ReverseMap();
        }
    }
}