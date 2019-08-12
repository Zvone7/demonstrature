using AutoMapper;
using DemonstratureCM.BM;
using DemonstratureCM.DTO;
using DemonstratureDB;
using DemonstratureDB.Data;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DemonstratureBLL
{
    public class CourseLogic
    {
        private readonly IMapper _mapper;
        private readonly CourseRepo _courseRepo = new CourseRepo();
        private readonly CourseUserRepo _courseUserRepo = new CourseUserRepo();
        private readonly log4net.ILog _logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public CourseLogic(IMapper mapper, CourseRepo courseRepo, CourseUserRepo courseUserRepo, log4net.ILog logger)
        {
            _mapper = mapper;
            _courseRepo = courseRepo;
            _courseUserRepo = courseUserRepo;
            _logger = logger;

        }
        public List<CourseDto> GetCourses()
        {
            try
            {
                var result = _courseRepo.GetCourses();
                var listOfcoursesMapped = _mapper.Map<List<CourseDto>>(result);
                listOfcoursesMapped = listOfcoursesMapped.OrderBy(c => c.Name).ToList();
                return listOfcoursesMapped;
            }
            catch (Exception e)
            {
                _logger.Info(e);
                return null;
            }
        }

        public List<CourseDto> GetCourses(string study)
        {
            try
            {
                var result = _courseRepo.GetCourses(study);
                var listOfcoursesMapped = _mapper.Map<List<CourseDto>>(result);
                listOfcoursesMapped = listOfcoursesMapped.OrderBy(c => c.Name).ToList();
                return listOfcoursesMapped;
            }
            catch (Exception e)
            {
                _logger.Info(e);
                return null;
            }
        }

        public CourseDto CreateOrUpdateCourse(CourseBm c)
        {
            if (c.Id == 0)
            {
                return CreateCourse(c);
            }
            else
            {
                return UpdateCourse(c);
            }
        }

        public CourseDto CreateCourse(CourseBm courseNew)
        {
            try
            {
                courseNew.IsActive = true;
                CourseT courseMapped = _mapper.Map<CourseT>(courseNew);
                var allCourses = _courseRepo.GetCourses();
                foreach (CourseT cx in allCourses)
                {
                    if (courseMapped.Name == cx.Name && courseMapped.Study == cx.Study)
                    {
                        // unique Course.Name/Study pair
                        return null;
                    }
                }
                var courseInDb = _courseRepo.CreateCourse(courseMapped);
                return _mapper.Map<CourseDto>(courseInDb);
            }
            catch (Exception e)
            {
                return null;
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

        public CourseDto UpdateCourse(CourseBm c)
        {
            try
            {
                CourseRepo courseRepo = new CourseRepo();
                CourseDto c2 = new CourseDto
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
                var allCourses = courseRepo.GetCourses();
                foreach (CourseT cx in allCourses)
                {
                    if (c3.Name == cx.Name && c3.Study == cx.Study && c3.Id != cx.Id)
                    {
                        return null;
                    }
                }
                var courseInDb = courseRepo.UpdateCourse(c3);
                return _mapper.Map<CourseDto>(courseInDb);
            }
            catch
            {
                return null;
            }
        }

        public List<string> GetAllStudies()
        {
            try
            {
                var studies = _courseRepo.GetAllStudies();
                return studies;
            }
            catch (Exception e)
            {

                throw;
            }
        }
    }
}
