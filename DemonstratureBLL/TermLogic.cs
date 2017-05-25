using AutoMapper;
using DemonstratureBLL.Mappings;
using DemonstratureCM.DTO;
using DemonstratureDB;
using DemonstratureDB.Data;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DemonstratureBLL
{
    public class TermLogic
    {
        private IMapper _mapper;
        private TermRepo _termRepo = new TermRepo();
        private GroupRepo _groupRepo = new GroupRepo();
        public TermLogic()
        {
            AutoMapperConfiguration.RegisterMappings();
            _mapper = AutoMapperConfiguration.Instance;
        }

        public TermDTO CreateTerm(TermDTO t)
        {
            try
            {
                TermT t2 = new TermT();
                t2 = _mapper.Map<TermT>(t);
                t2 = _termRepo.CreateTerm(t2);
                t = _mapper.Map<TermDTO>(t2);
                return t;
            }
            catch
            {
                return null;
            }
        }

        public bool CreateTerms(TermDTO t)
        {
            try
            {
                List<GroupDTO> existingGroups = _mapper.Map<List<GroupDTO>>(_groupRepo.GetGroupsByCourseId(t.CourseId));
                List<TermDTO> termsToCreate = new List<TermDTO>();
                List<TermDTO> termsToAdd = new List<TermDTO>();
                List<TermDTO> existingTerms = GetTerms(CreateDateFromString(t.TermDate), t.CourseId);
                if (existingGroups != null)
                {
                    foreach (var g in existingGroups)
                    {
                        var newTerm = new TermDTO();
                        newTerm.CourseId = t.CourseId;
                        newTerm.GroupId = g.Id;
                        newTerm.UserId = t.UserId;
                        newTerm.TermDate = t.TermDate;
                        termsToCreate.Add(newTerm);
                    }
                    foreach (var t2 in termsToCreate)
                    {
                        TermDTO termToNotAdd = existingTerms.Where(
                                                term => term.CourseId == t2.CourseId &&
                                                term.GroupId == t2.GroupId &&
                                                term.TermDate == t2.TermDate).FirstOrDefault();
                        if (termToNotAdd == null)
                        {
                            termsToAdd.Add(t2);
                            continue;
                        }
                        else
                        {
                            continue;
                        }
                    }
                    foreach (var t2 in termsToAdd)
                    {
                        CreateTerm(t2);
                    }
                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }

        public bool DeleteTerm(int termId)
        {
            return _termRepo.DeleteTerm(termId);
        }

        public bool DeleteTerms(TermDTO t)
        {
            try
            {
                var terms = GetTerms(CreateDateFromString(t.TermDate), t.CourseId);
                foreach (var t2 in terms)
                {
                    var result = DeleteTerm(t2.Id);
                    if (!result) return result;
                }
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool UpdateTerm(TermDTO t)
        {
            try
            {
                var t2 = _mapper.Map<TermT>(t);
                return _termRepo.UpdateTerm(t2);
            }
            catch
            {
                return false;
            }
        }

        public bool UpdateTerms(TermDTO t)
        {
            try
            {
                var terms = GetTerms(CreateDateFromString(t.TermDate), t.CourseId);
                foreach (var t2 in terms)
                {
                    t2.TermDate = t.TermDate;
                    var result = UpdateTerm(t2);
                    if (!result) return result;
                }
                return true;
            }
            catch
            {
                return false;
            }
        }

        public TermDTO GetTerm(int termId)
        {
            try
            {
                var t = _termRepo.GetTerm(termId);
                var t2 = _mapper.Map<TermDTO>(t);
                return t2;
            }
            catch
            {
                return null;
            }
        }

        public TermPackageDTO GetTerms(int courseId, int movedRight, int movedDown)
        {
            List<TermDTO> terms = new List<TermDTO>();
            TermPackageDTO termPackage = new TermPackageDTO();
            List<GroupDTO> groups = new List<GroupDTO>();

            //get all the groups
            try
            {
                groups = _mapper.Map<List<GroupDTO>>(_groupRepo.GetGroupsByCourseId(courseId));
            }
            catch (Exception e)
            {
                return null;
            }

            //gets all the terms
            try
            {
                terms = _mapper.Map<List<TermDTO>>(_termRepo.GetTerms(courseId));
                if (terms == null)
                {
                    return null;
                }
                foreach (var term in terms)
                {
                    term.Group = groups.Where(g => g.Id == term.GroupId).FirstOrDefault();
                }
                
                //get how many dates are there
                var dates = terms.GroupBy(t => t.TermDate).Select(t => t.FirstOrDefault()).Select(t => t.TermDate).ToList();

                int x = 0;
                //get them in a special object with 4 arrays
                int y = 0;
                foreach (var date in dates)
                {
                    //check if it's illegal move down
                    if (movedDown == dates.Count() - 4)
                    {
                        // TODO return somthing else to know to gray the arrow
                        return null;
                    }
                    if (movedRight == groups.Count() - 5)
                    {
                        // TODO return somthing else to know to gray the arrow
                        return null;
                    }
                    //move down to wanted date
                    if (movedDown != y)
                    {
                        y++;
                        continue;
                    }
                    if (termPackage.row0.Count == 0)
                    {
                        termPackage.row0 = terms.Where(t => t.TermDate == date)
                            .OrderBy(t => t.Group.Name)
                            .ToList();
                        continue;
                    }
                    if (termPackage.row1.Count == 0)
                    {
                        termPackage.row1 = terms.Where(t => t.TermDate == date)
                            .OrderBy(t => t.Group.Name)
                            .ToList();
                        continue;
                    }
                    if (termPackage.row2.Count == 0)
                    {
                        termPackage.row2 = terms.Where(t => t.TermDate == date)
                            .OrderBy(t => t.Group.Name)
                            .ToList();
                        continue;
                    }
                    if (termPackage.row3.Count == 0)
                    {
                        termPackage.row3 = terms.Where(t => t.TermDate == date)
                            .OrderBy(t => t.Group.Name)
                            .ToList();
                        continue;
                    }
                }
                //fix term package rows in case there isn't a term for a specific group on a specific date
                termPackage.row0 = FixTermRow(termPackage.row0, groups);
                termPackage.row1 = FixTermRow(termPackage.row1, groups);
                termPackage.row2 = FixTermRow(termPackage.row2, groups);
                termPackage.row3 = FixTermRow(termPackage.row3, groups);

                // TODO - fixed ?
                //fix term package rows so that it shows only 5 groups
                termPackage.row0 = CropTermRow(termPackage.row0, groups.Count(), movedRight);
                termPackage.row1 = CropTermRow(termPackage.row1, groups.Count(), movedRight);
                termPackage.row2 = CropTermRow(termPackage.row2, groups.Count(), movedRight);
                termPackage.row3 = CropTermRow(termPackage.row3, groups.Count(), movedRight);
            }
            catch (Exception e)
            {
                return null;
            }
            return termPackage;
        }

        public List<TermDTO> FixTermRow(List<TermDTO> terms, List<GroupDTO> groups)
        {
            List<TermDTO> newTerms = new List<TermDTO>();
            foreach (var g in groups)
            {
                var term = terms.Where(t => t.GroupId == g.Id).FirstOrDefault();
                if (term != null)
                {
                    newTerms.Add(term);
                }
                else
                {
                    newTerms.Add(new TermDTO());
                }
            }
            return newTerms;
        }

        public List<TermDTO> CropTermRow(List<TermDTO> terms, int groupCount, int moveX)
        {
            List<TermDTO> newTerms = new List<TermDTO>();
            int x = 0;
            foreach(var term in terms)
            {
                if (moveX != x)
                {
                    x++;
                    continue;
                }
                if (newTerms.Count() > 5)
                {
                    break;
                }
                else
                {
                    newTerms.Add(term);
                }
            }
            return newTerms;
        }


        public List<TermDTO> GetTerms(DateTime d, int courseId)
        {
            try
            {
                var termsInDb = _termRepo.GetTerms(d, courseId);
                var terms = _mapper.Map<List<TermDTO>>(termsInDb);
                return terms;
            }
            catch
            {
                return null;
            }
        }

        public List<TermDTO> GetTermsByCourseId(int courseId)
        {
            try
            {
                var terms = _termRepo.GetTermsByCourseId(courseId);
                //svi termini za pojedini kolegij
                var termsForCourse = _mapper.Map<List<TermDTO>>(terms);
                var termsWhichAreMatch = new List<TermDTO>();
                var termsHelper = new List<TermDTO>();
                var groupIds = _groupRepo.GetGroupsByCourseId(courseId).Select(g => g.Id).ToList();
                //ID-evi svih grupa za pojedini kolegij
                var groupsCount = _groupRepo.GetGroupsByCourseId(courseId).ToList().Count;
                //koliko grupa ima u svakom kolegiju
                var ddates = termsForCourse.Select(t => t.TermDate).ToList();
                var dates = new List<string>();
                foreach (var d in ddates)
                {
                    var d2 = d.ToString();
                    if (dates.Contains(d2))
                    {
                        continue;
                    }
                    else
                    {
                        dates.Add(d2);
                    }
                }
                var dates1 = termsForCourse.Select(t => t.TermDate).Distinct();

                //svi termini gdje je datum jedan od distinct datuma i gdje ih ima ukupno kao grupa

                //petlja ide kroz svaku grupu
                //petlja ide kroz svaki datum
                //ako ima za svaku grupu datum
                //onda ima termin za svaku grupu
                var groupCounter = 0;
                foreach (var d in dates)
                {
                    groupCounter = 0;
                    foreach (var g in groupIds)
                    {
                        var termMatch = termsForCourse.Where(t => t.TermDate == d && t.GroupId == g).FirstOrDefault();
                        if (termMatch != null)
                        {
                            termsHelper.Add(termMatch);
                            groupCounter++;
                        }
                    }
                    if (groupCounter == groupsCount)
                    {
                        termsWhichAreMatch.AddRange(termsHelper);
                    }
                    termsHelper = new List<TermDTO>();
                }

                termsForCourse = termsWhichAreMatch.OrderBy(t => t.TermDate).ToList();
                return termsForCourse;
            }
            catch
            {
                return null;
            }
        }

        public List<TermDTO> GetTermsByGroupId(int groupId)
        {
            try
            {
                var terms = _termRepo.GetTermsByGroupId(groupId);
                var terms2 = _mapper.Map<List<TermDTO>>(terms);
                terms2 = terms2.OrderBy(t => t.TermDate).ToList();
                return terms2;
            }
            catch
            {
                return null;
            }
        }

        public DateTime CreateDateFromString(string date)
        {
            if (date == null)
            {
                return new DateTime(1, 1, 1);
            }
            var day = Int32.Parse(date.Split('.')[0]);
            var month = Int32.Parse(date.Split('.')[1]);
            var year = Int32.Parse(date.Split('.')[2]);
            var dateToReturn = new DateTime(year, month, day);
            return dateToReturn;
        }
    }
}
