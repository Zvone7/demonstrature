using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DemonstratureCM.DTO;
using AutoMapper;
using DemonstratureBLL.Mappings;
using DemonstratureCM.BM;
using DemonstratureDB.Data;
using DemonstratureDB;

namespace DemonstratureBLL
{
    public class CourseLogic
    {
        private IMapper _mapper;
        private CourseRepo _courseRepo = new CourseRepo();
        private CourseUserRepo _courseUserRepo = new CourseUserRepo();
        private static readonly log4net.ILog _logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public CourseLogic()
        {
            AutoMapperConfiguration.RegisterMappings();
            _mapper = AutoMapperConfiguration.Instance;
        }
        public List<CourseDTO> GetAllCourses()
        {
            try
            {
                CourseRepo courseRepo = new CourseRepo();
                var listOfCourses = courseRepo.GetCourse();
                var listOfCourses2 = new List<CourseDTO>();
                listOfCourses2 = _mapper.Map<List<CourseDTO>>(listOfCourses);
                listOfCourses2 = listOfCourses2.OrderBy(c => c.Name).ToList();
                return listOfCourses2;
            }
            catch(Exception e)
            {
                _logger.Info(e);
                return null;
            }
        }

        public bool CreateCourse(CourseBM c)
        {
            try
            {
                CourseRepo courseRepo = new CourseRepo();
                CourseDTO c2 = new CourseDTO
                {
                    Id = c.Id,
                    Asistant = c.Asistant,
                    Name = c.Name,
                    Professor = c.Professor,
                    Study = c.Study,
                    IsActive = true
                };
                CourseT c3 = _mapper.Map<CourseT>(c2);
                //check that under the same study
                //there isn't already a course with that name
                //can't have two courses with same names under same study
                var allCourses = courseRepo.GetCourse();
                foreach (CourseT cx in allCourses)
                {
                    if (c3.Name == cx.Name && c3.Study == cx.Study)
                    {
                        return false;
                    }
                }
                courseRepo.CreateCourse(c3);
                return false;
            }
            catch
            {
                return false;
            }
        }

        public bool DeleteCourse(int Id)
        {
            try
            {
                if (_courseUserRepo.RemoveRangeByCourseId(Id))
                {
                    return _courseRepo.DeleteCourse(Id);
                }
                else
                {
                    return false;
                }
            }
            catch
            {
                return false;
            }
        }

        public bool UpdateCourse(CourseBM c)
        {
            try
            {
                CourseRepo courseRepo = new CourseRepo();
                CourseDTO c2 = new CourseDTO
                {
                    Id = c.Id,
                    Asistant = c.Asistant,
                    Name = c.Name,
                    Professor = c.Professor,
                    Study = c.Study,
                    IsActive = true
                };
                CourseT c3 = _mapper.Map<CourseT>(c2);
                //check that under the same study
                //there isn't already a course with that name
                //can't have two courses with same names under same study
                var allCourses = courseRepo.GetCourse();
                foreach (CourseT cx in allCourses)
                {
                    if (c3.Name == cx.Name && c3.Study == cx.Study && c3.Id != cx.Id)
                    {
                        return false;
                    }
                }
                courseRepo.UpdateCourse(c3);
                return false;
            }
            catch
            {
                return false;
            }
        }
    }
}
