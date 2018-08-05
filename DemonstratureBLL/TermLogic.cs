using AutoMapper;
using DemonstratureBLL.Mappings;
using DemonstratureCM.BM;
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
        private TermRepo _termRepo;
        private GroupRepo _groupRepo;
        private UserRepo _userRepo;
        private static readonly log4net.ILog _logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public TermLogic()
        {
            AutoMapperConfiguration.RegisterMappings();
            _mapper = AutoMapperConfiguration.Instance;
            _termRepo = new TermRepo();
            _groupRepo = new GroupRepo();
            _userRepo = new UserRepo();
        }

        public TermDto CreateTerm(TermDto t)
        {
            try
            {
                if (!string.IsNullOrEmpty(t.TermDate))
                {
                    TermT t2 = new TermT();
                    t2 = _mapper.Map<TermT>(t);
                    t2 = _termRepo.CreateTerm(t2);
                    t = _mapper.Map<TermDto>(t2);
                    return t;
                }
                else
                {
                    return null;
                }

            }
            catch
            {
                return null;
            }
        }

        public bool CreateTerms(TermDto t)
        {
            try
            {
                List<GroupDto> existingGroups = _mapper.Map<List<GroupDto>>(_groupRepo.GetGroupsByCourseId(t.CourseId));
                List<TermDto> termsToCreate = new List<TermDto>();
                List<TermDto> termsToAdd = new List<TermDto>();
                List<TermDto> existingTerms = GetTerms(CreateDateFromString(t.TermDate), t.CourseId);
                if (existingGroups != null)
                {
                    foreach (var g in existingGroups)
                    {
                        TermDto newTerm = new TermDto
                        {
                            CourseId = t.CourseId,
                            GroupId = g.Id,
                            UserId = t.UserId,
                            TermDate = t.TermDate
                        };
                        termsToCreate.Add(newTerm);
                    }
                    foreach (var t2 in termsToCreate)
                    {
                        TermDto termToNotAdd = existingTerms.Where(
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

        public object CreateOrUpdateTerms(TermDto t)
        {
            if (t.Id == 0)
            {
                return CreateTerms(t);
            }
            else
            {
                return UpdateTerms(t);
            }
        }

        public object CreateOrUpdateTerm(TermDto t)
        {
            if (t.Id == 0)
            {
                if (t.GroupId == -1)
                {
                    return CreateTerms(t);
                }
                else
                {
                    return CreateTerm(t);
                }
            }
            else
            {
                if (t.GroupId == -1)
                {
                    return UpdateTerms(t);
                }
                else
                {
                    return UpdateTerm(t);
                }
            }
        }

        public bool DeleteTerm(int termId)
        {
            return _termRepo.DeleteTerm(termId);
        }

        public bool DeleteTerms(TermDto t)
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

        public bool UpdateTerm(TermDto t)
        {
            try
            {
                if (!string.IsNullOrEmpty(t.TermDate))
                {
                    var t2 = _mapper.Map<TermT>(t);
                    return _termRepo.UpdateTerm(t2);
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

        public bool UpdateTerms(TermDto t)
        {
            try
            {
                var terms = GetTerms(CreateDateFromString(t.TermDate), t.CourseId);
                if (t.IsCourseTerm)
                {
                    foreach (var t2 in terms)
                    {
                        t2.TermDate = t.TermDate;
                        DeleteTerm(t2.Id);
                    }
                    t.Id = 0;
                    return CreateTerms(t);
                }
                else
                {
                    foreach (var t2 in terms)
                    {
                        t2.TermDate = t.TermDate;
                        var result = UpdateTerm(t2);
                        if (!result) return result;
                    }
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        public TermDto GetTerm(int termId)
        {
            try
            {
                var t = _termRepo.GetTerm(termId);
                var t2 = _mapper.Map<TermDto>(t);
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

        public TermPackageDto GetTerms(int courseId, int moveOnX, int moveOnY, int userId)
        {
            List<TermDto> terms = new List<TermDto>();
            List<GroupDto> groups = new List<GroupDto>();
            List<string> dates = new List<string>();
            TermPackageDto termPackage = new TermPackageDto();
            int numGroup = 0;
            int numDate = 0;
            string termWithDate = "";


            termPackage.row0 = new List<TermDto>();
            termPackage.row1 = new List<TermDto>();
            termPackage.row2 = new List<TermDto>();
            termPackage.row3 = new List<TermDto>();

            // get all the groups
            try
            {
                groups = _mapper.Map<List<GroupDto>>(_groupRepo.GetGroupsByCourseId(courseId));
                numGroup = groups.Count();
            }
            catch (Exception e)
            {
                _logger.Info(e);
                return null;
            }

            // get all the terms
            try
            {
                terms = _mapper.Map<List<TermDto>>(_termRepo.GetTerms(courseId));
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
                if (numGroup <= GlobalAppSettings.NumCol)
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
                    if (moveOnX > (numGroup - GlobalAppSettings.NumCol))
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
                    else if (moveOnX == (numGroup - GlobalAppSettings.NumCol))
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
                if (numDate <= GlobalAppSettings.NumRow)
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
                    if (moveOnY > (numDate - GlobalAppSettings.NumRow))
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
                    else if (moveOnY == (numDate - GlobalAppSettings.NumRow))
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
                    termPackage.row0 = CalculateTermRow(termPackage.row0, userId);
                    termPackage.row0 = CropTermRow(termPackage.row0, groups.Count(), moveOnX);
                }
                catch (Exception e)
                {
                    _logger.Info(e);
                    termPackage.row0Dt = GlobalAppSettings.NoDateString;
                    termPackage.row0 = MakeBlankTerms();
                }


                try
                {
                    termWithDate = termPackage.row1.Where(t => t.TermDate != null).FirstOrDefault().TermDate;
                    termPackage.row1Dt = termWithDate;
                    termPackage.row1 = FixTermRow(termPackage.row1, groups);
                    termPackage.row1 = CalculateTermRow(termPackage.row1, userId);
                    termPackage.row1 = CropTermRow(termPackage.row1, groups.Count(), moveOnX);
                }
                catch (Exception e)
                {
                    _logger.Info(e);
                    termPackage.row1Dt = GlobalAppSettings.NoDateString;
                    termPackage.row1 = MakeBlankTerms();
                }

                try
                {
                    termWithDate = termPackage.row2.Where(t => t.TermDate != null).FirstOrDefault().TermDate;
                    termPackage.row2Dt = termWithDate;
                    termPackage.row2 = FixTermRow(termPackage.row2, groups);
                    termPackage.row2 = CalculateTermRow(termPackage.row2, userId);
                    termPackage.row2 = CropTermRow(termPackage.row2, groups.Count(), moveOnX);
                }
                catch (Exception e)
                {
                    _logger.Info(e);
                    termPackage.row2Dt = GlobalAppSettings.NoDateString;
                    termPackage.row2 = MakeBlankTerms();
                }

                try
                {
                    termWithDate = termPackage.row3.Where(t => t.TermDate != null).FirstOrDefault().TermDate;
                    termPackage.row3Dt = termWithDate;
                    termPackage.row3 = FixTermRow(termPackage.row3, groups);
                    termPackage.row3 = CalculateTermRow(termPackage.row3, userId);
                    termPackage.row3 = CropTermRow(termPackage.row3, groups.Count(), moveOnX);
                }
                catch (Exception e)
                {
                    _logger.Info(e);
                    termPackage.row3Dt = GlobalAppSettings.NoDateString;
                    termPackage.row3 = MakeBlankTerms();
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
        public List<TermDto> FixTermRow(List<TermDto> terms, List<GroupDto> groups)
        {
            List<TermDto> newTerms = new List<TermDto>();
            foreach (var g in groups)
            {
                var term = terms.Where(t => t.GroupId == g.Id).FirstOrDefault();
                if (term != null)
                {
                    newTerms.Add(term);
                }
                else
                {
                    var t = new TermDto
                    {
                        Id = -1
                    };
                    newTerms.Add(t);
                }
            }
            return newTerms;
        }

        /// <summary>
        /// Determines cellstate, takebuttonstate and skipbuttonstate
        /// </summary>
        public List<TermDto> CalculateTermRow(List<TermDto> terms, int userId)
        {
            try
            {
                foreach (TermDto t in terms)
                {
                    CalculateCellState(t, userId);
                }
                return terms;
            }

            catch (Exception e)
            {
                _logger.Info(e);
                return terms;
            }
        }

        public void CalculateCellState(TermDto t, int userId)
        {
            DateTime today = DateTime.Now.Date;
            //DateTime today = new DateTime(2017, 9, 24);
            var termDate = CreateDateFromString(t.TermDate);

            // it's a fake term.
            if (t.Id == -1)
            {
                ApplyCellState(t, 0);
            }
            // it's a real term
            else
            {
                // it's a real term
                // is admin user
                var user = _userRepo.GetUser(userId);
                if (user.Role == GlobalAppSettings.RoleAdministrator)
                {
                    ApplyCellState(t, 4);
                }
                // it's a real term
                // isn't admin user
                else
                {
                    // it's a real term
                    // isn't admin user
                    // it's non existent term.
                    if (termDate < today)
                    {
                        ApplyCellState(t, 0);
                    }
                    // it's a real term
                    // isn't admin user
                    // it's an existing term
                    else
                    {
                        // it's a real term
                        // isn't admin user
                        // it's an existing term
                        // it belongs to user.
                        if (t.UserId == userId)
                        {
                            ApplyCellState(t, 3);
                        }
                        // it's a real term
                        // isn't admin user
                        // it's an existing term
                        // it doesn't belong to user
                        else
                        {
                            // it's a real term
                            // isn't admin user
                            // it's an existing term
                            // it doesn't belong to user
                            // it does belong to users group
                            if (t.Group.OwnerId == userId)
                            {
                                // it's a real term
                                // isn't admin user
                                // it's an existing term
                                // it doesn't belong to user
                                // it does belong to users group
                                // it's empty.
                                if (t.UserId == 0)
                                {
                                    ApplyCellState(t, 2);
                                }
                                // it's a real term
                                // isn't admin user
                                // it's an existing term
                                // it doesn't belong to user
                                // it does belong to users group
                                // it's not empty
                                else
                                {
                                    // it's a real term
                                    // isn't admin user
                                    // it's an existing term
                                    // it doesn't belong to user
                                    // it does belong to users group
                                    // it's not empty
                                    // it's not past deadline yet.

                                    //if (!IsPastDeadLine(termDate, today))
                                    //{
                                    //    ApplyCellState(t, 0);
                                    //}

                                    // it's a real term
                                    // isn't admin user
                                    // it's an existing term
                                    // it doesn't belong to user
                                    // it does belong to users group
                                    // it's not empty
                                    // it's past deadline.
                                    //else
                                    //{
                                    ApplyCellState(t, 0);
                                    //}
                                }
                            }
                            // it's a real term
                            // isn't admin user
                            // it's a relevant term
                            // it doesn't belong to user
                            // it doesn't belong to users group
                            else
                            {
                                // it's a real term
                                // isn't admin user
                                // it's an existing term
                                // it doesn't belong to user
                                // it doesn't belong to users group
                                // it's empty.
                                if (t.UserId == 0)
                                {
                                    // it's a real term
                                    // isn't admin user
                                    // it's an existing term
                                    // it doesn't belong to user
                                    // it doesn't belong to users group
                                    // it's empty
                                    // it's not past deadline yet.
                                    if (!IsPastDeadLine(termDate, today))
                                    {
                                        // it's a real term
                                        // isn't admin user
                                        // it's an existing term
                                        // it doesn't belong to user
                                        // it doesn't belong to users group
                                        // it's empty
                                        // it's not past deadline yet
                                        // it's suggested to user
                                        if (t.SuggestedUserId == userId)
                                        {
                                            ApplyCellState(t, 2);
                                        }
                                        // it's a real term
                                        // isn't admin user
                                        // it's an existing term
                                        // it doesn't belong to user
                                        // it doesn't belong to users group
                                        // it's empty
                                        // it's not past deadline yet
                                        // it's suggested to user
                                        else
                                        {
                                            ApplyCellState(t, 0);
                                        }
                                    }
                                    // it's a real term
                                    // isn't admin user
                                    // it's an existing term
                                    // it doesn't belong to user
                                    // it doesn't belong to users group
                                    // it's empty
                                    // it's past deadline.
                                    else
                                    {
                                        ApplyCellState(t, 1);
                                    }
                                }
                                // it's a real term
                                // isn't admin user
                                // it's an existing term
                                // it doesn't belong to user
                                // it doesn't belong to users group
                                // it's not empty
                                else
                                {
                                    ApplyCellState(t, 0);
                                }
                            }
                        }
                    }
                }
            }
        }

        /// <summary>
        /// fix term package rows so that it shows only 5 groups
        /// </summary>
        public List<TermDto> CropTermRow(List<TermDto> terms, int groupCount, int moveX)
        {
            List<TermDto> newTerms = new List<TermDto>();
            int x = 0;
            foreach (var term in terms)
            {
                if (moveX != x)
                {
                    x++;
                    continue;
                }
                if (newTerms.Count() >= GlobalAppSettings.NumCol)
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

        /// <summary>
        /// Create list of blank terms for case when there isnt enough terms in DB
        /// </summary>
        public List<TermDto> MakeBlankTerms()
        {
            List<TermDto> terms = new List<TermDto>();
            for (int i = 0; i < GlobalAppSettings.NumCol; i++)
            {
                var term = new TermDto
                {
                    CourseId = 0,
                    GroupId = 0,
                    TermDate = GlobalAppSettings.NoDateString,
                    UserId = 0
                };
                terms.Add(term);
            }
            return terms;
        }

        public List<TermDto> GetTerms(DateTime d, int courseId)
        {
            try
            {
                var termsInDb = _termRepo.GetTerms(d, courseId);
                var terms = _mapper.Map<List<TermDto>>(termsInDb);
                return terms;
            }
            catch
            {
                return null;
            }
        }

        public List<TermDto> GetTermsByCourseId(int courseId)
        {
            try
            {
                var terms = _termRepo.GetTermsByCourseId(courseId);
                //svi termini za pojedini kolegij
                var termsForCourse = _mapper.Map<List<TermDto>>(terms);
                var termsWhichAreMatch = new List<TermDto>();
                var termsHelper = new List<TermDto>();
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
                    termsHelper = new List<TermDto>();
                }

                foreach (var term in termsForCourse)
                {
                    if (termsWhichAreMatch.Contains(term))
                    {
                        term.IsCourseTerm = true;
                    }
                }
                //termsForCourse = termsWhichAreMatch.OrderBy(t => t.TermDate).ToList();

                return termsForCourse.OrderBy(t => t.TermDate).ToList();
            }
            catch
            {
                return null;
            }
        }

        public List<TermDto> GetTermsByGroupId(int groupId)
        {
            try
            {


                var group = _groupRepo.GetGroup(groupId);
                var termsByCourseId = GetTermsByCourseId(group.CourseId);
                var termsByGroupId = termsByCourseId.Where(t => t.GroupId == groupId).ToList();
                return termsByGroupId;
            }
            catch
            {
                return null;
            }
        }

        public DateTime CreateDateFromString(string date)
        {
            DateTime dateToReturn;

            try
            {
                var date2 = DateTime.Parse(date);
                dateToReturn = new DateTime(date2.Year, date2.Month, date2.Day);

            }
            catch (Exception e)
            {
                _logger.Info(e);
                dateToReturn = new DateTime(1, 1, 1);
            }
            return dateToReturn;
        }

        /// <summary>
        /// is it last GlobalAppSettings.DayForDeadline before deadline
        /// </summary>
        public bool IsPastDeadLine(DateTime termDate, DateTime today)
        {
            DateTime StartOfWeek = termDate.AddDays(-(int)termDate.DayOfWeek);
            DateTime deadLine = StartOfWeek.AddDays(-1 * (7 - GlobalAppSettings.DayForDeadline));
            if (today > deadLine)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public void ApplyCellState(TermDto t, int cellState)
        {
            t.CellState = cellState;
            switch (cellState)
            {
                case 0:
                    t.ButtonSkipState = false;
                    t.ButtonTakeState = false;
                    t.DemoPickerState = false;
                    break;
                case 1:
                    t.ButtonSkipState = false;
                    t.ButtonTakeState = true;
                    t.DemoPickerState = false;
                    break;
                case 2:
                    t.ButtonSkipState = false;
                    t.ButtonTakeState = true;
                    t.DemoPickerState = true;
                    break;
                case 3:
                    t.ButtonSkipState = true;
                    t.ButtonTakeState = false;
                    t.DemoPickerState = false;
                    break;
                case 4:
                    t.ButtonSkipState = false;
                    t.ButtonTakeState = false;
                    t.DemoPickerState = true;
                    break;
                default:
                    t.ButtonTakeState = false;
                    t.ButtonSkipState = false;
                    t.DemoPickerState = false;
                    break;
            }
        }

        public bool ReserveTerm(int termId, int userId, int suggestedUserId)
        {
            try
            {
                DateTime today = DateTime.Now.Date;
                TermDto term = GetTerm(termId);
                GroupDto group = _mapper.Map<GroupDto>(_groupRepo.GetGroup(term.GroupId));
                UserT user = _userRepo.GetUser(userId);
                if (suggestedUserId == -1)
                {
                    return false;
                }
                if (user.Role == GlobalAppSettings.RoleAdministrator)
                {
                    term.UserId = suggestedUserId;
                }
                else
                {
                    // term is available
                    if (term.UserId == 0)
                    {
                        // user is making a reservation for himself
                        if (suggestedUserId == 0)
                        {
                            // it's term from users group
                            if (group.OwnerId == userId)
                            {
                                term.UserId = userId;
                            }
                            else
                            {
                                // it's reserved for this user
                                if (term.SuggestedUserId == userId)
                                {
                                    term.UserId = userId;
                                }
                                // it's past deadline
                                if (IsPastDeadLine(CreateDateFromString(term.TermDate), today))
                                {
                                    term.UserId = userId;
                                }
                            }
                        }
                        // user is giving his term to someone else
                        else
                        {
                            // term must be available or belong to the user
                            if (term.UserId == 0 || term.UserId == userId)
                            {
                                term.UserId = 0;
                                term.SuggestedUserId = suggestedUserId;
                            }
                            else
                            {
                                // return wrong request;
                                return false;
                            }
                        }
                    }
                }
                TermT termDb = _mapper.Map<TermT>(term);
                if (_termRepo.UpdateTerm(termDb))
                {
                    return true;
                }
                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public bool FreeTerm(int termId, int userId)
        {
            try
            {
                TermDto term = GetTerm(termId);
                MyUserDto user = _mapper.Map<MyUserDto>(_userRepo.GetUser(userId));
                if (term.UserId == user.Id || user.Role == GlobalAppSettings.RoleAdministrator)
                {
                    term.UserId = 0;
                }
                else
                {
                    // invalid request - unathorized
                    return false;
                }
                TermT termDb = _mapper.Map<TermT>(term);
                if (_termRepo.UpdateTerm(termDb))
                {
                    return true;
                }
                return false;

            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
