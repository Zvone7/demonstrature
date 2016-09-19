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
        public List<CourseDTO> GetAllCourses()
        {
            var termL = new TermLogic();
            var listOfCourses = new List<CourseDTO>();
            CourseDTO course = new CourseDTO();
            course.Study = "Računarstvo";
            course.Name = "Programiranje 2";
            course.Leader = "Leader Name";
            course.Asistant = "Asistant Name";
            course.TermT = termL.GetAllTerms();
            listOfCourses.Add(course);
            CourseDTO course2 = new CourseDTO();
            course2.Study = "Elektrotehnika";
            course2.Name = "Programiranje 2";
            course2.Leader = "Leader Name";
            course2.Asistant = "Asistant Name";
            course2.TermT = termL.GetAllTerms();
            listOfCourses.Add(course2);
            CourseDTO course3 = new CourseDTO();
            course3.Study = "Elektrotehnika";
            course3.Name = "Fizika";
            course3.Leader = "Leader Name";
            course3.Asistant = "Asistant Name";
            course3.TermT = termL.GetAllTerms();
            listOfCourses.Add(course3);
            CourseDTO course4 = new CourseDTO();
            course4.Study = "Računarstvo";
            course4.Name = "Fizika 2";
            course4.Leader = "Leader Name";
            course4.Asistant = "Asistant Name";
            course4.TermT = termL.GetAllTerms();
            listOfCourses.Add(course4);

            listOfCourses.OrderBy(c=>c.Study);

            return listOfCourses;
        }
    }
}
