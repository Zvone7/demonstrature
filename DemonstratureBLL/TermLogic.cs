using AutoMapper;
using DemonstratureBLL.Mappings;
using DemonstratureCM.DTO;
using DemonstratureCM.Settings;
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
        private static readonly log4net.ILog _logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

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

        public int GetNumberOfTermDates(int courseId)
        {
            return GetTermsByCourseId(courseId)
                .GroupBy(t => t.TermDate)
                .Select(t => t.FirstOrDefault())
                .Select(t => t.TermDate)
                .Count();
        }

        public TermPackageDTO GetTerms(int courseId, int moveOnX, int moveOnY)
        {
            List<TermDTO> terms = new List<TermDTO>();
            List<GroupDTO> groups = new List<GroupDTO>();
            List<string> dates = new List<string>();
            TermPackageDTO termPackage = new TermPackageDTO();
            int numGroup = 0;
            int numDate = 0;
            string termWithDate = "";


            termPackage.row0 = new List<TermDTO>();
            termPackage.row1 = new List<TermDTO>();
            termPackage.row2 = new List<TermDTO>();
            termPackage.row3 = new List<TermDTO>();

            //get all the groups
            try
            {
                groups = _mapper.Map<List<GroupDTO>>(_groupRepo.GetGroupsByCourseId(courseId));
                numGroup = groups.Count();
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

                dates = terms.GroupBy(t => t.TermDate).Select(t => t.FirstOrDefault()).Select(t => t.TermDate).ToList();
                //get how many dates are there
                //get them in a special object with 4 arrays
                numDate = dates.Count();
                int y = 0;


                // movement check
                // check if there is enough groups for table
                if (numGroup <= Gas.numCol)
                {
                    termPackage.disableLeft = true;
                    termPackage.disableRight = true;
                }
                //if there is, check 'where' the user is on X coordinate
                else
                {
                    // user SHOULDN'T be here
                    // user is TOO MUCH right
                    // exit immediately - out of table borders
                    if (moveOnX > (numGroup - Gas.numCol))
                    {
                        termPackage.disableRight = true;
                        termPackage.disableLeft = false;
                        return null;
                    }
                    // user SHOULDN'T be here
                    // user is TOO MUCH left
                    // exit immediately - out of table borders
                    else if (moveOnX < 0)
                    {
                        termPackage.disableLeft = true;
                        termPackage.disableRight = false;
                        return null;
                    }
                    // user COULD be here
                    // user is on right edge
                    else if (moveOnX == (numGroup - Gas.numCol))
                    {
                        termPackage.disableRight = true;
                        termPackage.disableLeft = false;
                    }
                    // user COULD be here
                    // user is on left edge
                    else if (moveOnX == 0)
                    {
                        termPackage.disableRight = false;
                        termPackage.disableLeft = true;

                    }
                    // user COULD be here
                    // user is between edges
                    else
                    {
                        termPackage.disableLeft = false;
                        termPackage.disableRight = false;

                    }

                }

                // movement check
                // check if there is enough dates for table
                if (numDate <= Gas.numRow)
                {
                    termPackage.disableUp = true;
                    termPackage.disableDown = true;
                }
                //if there is, check 'where' the user is on Y coordinate
                else
                {
                    // user SHOULDN'T be here
                    // user is TOO MUCH down
                    // exit immediately - out of table borders
                    if (moveOnY > (numDate - Gas.numRow))
                    {
                        termPackage.disableDown = true;
                        termPackage.disableUp = false;
                        return null;
                    }
                    // user SHOULDN'T be here
                    // user is TOO MUCH up
                    // exit immediately - out of table borders
                    else if (moveOnY < 0)
                    {
                        termPackage.disableUp = true;
                        termPackage.disableDown = false;
                        return null;
                    }
                    // user COULD be here
                    // user is on down edge
                    else if (moveOnY == (numDate - Gas.numRow))
                    {
                        termPackage.disableDown = true;
                        termPackage.disableUp = false;
                    }
                    // user COULD be here
                    // user is on up edge
                    else if (moveOnY == 0)
                    {
                        termPackage.disableDown = false;
                        termPackage.disableUp = true;

                    }
                    // user COULD be here
                    // user is between edges
                    else
                    {
                        termPackage.disableUp = false;
                        termPackage.disableDown = false;
                    }

                }


                foreach (var date in dates)
                {
                    //move down!
                    if (y != moveOnY)
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
                    break;
                }

                //fix term package rows in case there isn't a term for a specific group on a specific date

                try
                {
                    termWithDate = termPackage.row0.Where(t => t.TermDate != null).FirstOrDefault().TermDate;
                    termPackage.row0Dt = termWithDate;
                    termPackage.row0 = FixTermRow(termPackage.row0, groups);
                    termPackage.row0 = CropTermRow(termPackage.row0, groups.Count(), moveOnX);
                }
                catch (Exception e)
                {
                    termPackage.row0Dt = Gas.noDateString;
                    termPackage.row0 = new List<TermDTO>();
                }


                try
                {
                    termWithDate = termPackage.row1.Where(t => t.TermDate != null).FirstOrDefault().TermDate;
                    termPackage.row1Dt = termWithDate;
                    termPackage.row1 = FixTermRow(termPackage.row1, groups);
                    termPackage.row1 = CropTermRow(termPackage.row1, groups.Count(), moveOnX);
                }
                catch (Exception e)
                {
                    termPackage.row1Dt = Gas.noDateString;
                    termPackage.row1 = new List<TermDTO>();
                }

                try
                {
                    termWithDate = termPackage.row2.Where(t => t.TermDate != null).FirstOrDefault().TermDate;
                    termPackage.row2Dt = termWithDate;
                    termPackage.row2 = FixTermRow(termPackage.row2, groups);
                    termPackage.row2 = CropTermRow(termPackage.row2, groups.Count(), moveOnX);
                }
                catch (Exception e)
                {
                    termPackage.row2Dt = Gas.noDateString;
                    termPackage.row2 = new List<TermDTO>();
                }

                try
                {
                    termWithDate = termPackage.row3.Where(t => t.TermDate != null).FirstOrDefault().TermDate;
                    termPackage.row3Dt = termWithDate;
                    termPackage.row3 = FixTermRow(termPackage.row3, groups);
                    termPackage.row3 = CropTermRow(termPackage.row3, groups.Count(), moveOnX);
                }
                catch (Exception e)
                {
                    termPackage.row3Dt = Gas.noDateString;
                    termPackage.row3 = new List<TermDTO>();
                }
            }
            catch (Exception e)
            {
                _logger.Info(e);
                return null;
            }
            return termPackage;
        }

        /// <summary>
        /// Expand every row so that it has blank terms for number of groups
        /// </summary>
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
        /// <summary>
        /// fix term package rows so that it shows only 5 groups
        /// </summary>
        public List<TermDTO> CropTermRow(List<TermDTO> terms, int groupCount, int moveX)
        {
            List<TermDTO> newTerms = new List<TermDTO>();
            int x = 0;
            foreach (var term in terms)
            {
                if (moveX != x)
                {
                    x++;
                    continue;
                }
                if (newTerms.Count() >= Gas.numCol)
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
