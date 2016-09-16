using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DemonstratureCM.DTO;

namespace DemonstratureBLL
{
    public class CourseLogic
    {
        public CourseDTO GetAllCourses()
        {
            CourseDTO course = new CourseDTO();
            course.Asistant = "Asistant Name";
            course.Leader = "Leader Name";
            course.Study = "Računarstvo";
            course.TermT = new UserLogic().GetAllTerms();
            return course;
        }
    }
}
