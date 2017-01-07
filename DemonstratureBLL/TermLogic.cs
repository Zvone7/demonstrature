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
            TermT t2 = new TermT();
            t2 = _mapper.Map<TermT>(t);
            t2 = _termRepo.CreateTerm(t2);
            t = _mapper.Map<TermDTO>(t2);
            return t;
        }

        public bool CreateTerms(TermDTO t)
        {
            List<GroupDTO> existingGroups = _mapper.Map<List<GroupDTO>>(_groupRepo.GetGroupsByCourseId(t.CourseId));
            List<TermDTO> termsToCreate = new List<TermDTO>();
            List<TermDTO> termsToAdd = new List<TermDTO>();
            List<TermDTO> existingTerms = GetTerms(t.TermDate, t.CourseId);
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

        public bool DeleteTerm(int termId)
        {
            return _termRepo.DeleteTerm(termId);
        }
        
        public bool DeleteTerms(TermDTO t)
        {
            var terms = GetTerms(t.TermDate, t.CourseId);
            foreach(var t2 in terms)
            {
                var result = DeleteTerm(t2.Id);
                if (!result) return result;
            }
            return true;
        }

        public bool UpdateTerm(TermDTO t)
        {
            var t2 = _mapper.Map<TermT>(t);
            return _termRepo.UpdateTerm(t2);
        }
        
        public bool UpdateTerms(TermDTO t)
        {
            var terms = GetTerms(t.TermDate, t.CourseId);
            foreach (var t2 in terms)
            {
                t2.TermDate = t.TermDate;
                var result = UpdateTerm(t2);
                if (!result) return result;
            }
            return true;
        }

        public TermDTO GetTerm(int termId)
        {
            var t = _termRepo.GetTerm(termId);
            var t2 = _mapper.Map<TermDTO>(t);
            return t2;
        }

        public List<TermDTO> GetTerms(DateTime d, int courseId)
        {
            var termsInDb = _termRepo.GetTerms(d, courseId);
            var terms = _mapper.Map<List<TermDTO>>(termsInDb);
            return terms;
        }

        public List<TermDTO> GetTermsByCourseId(int courseId)
        {
            var terms = _termRepo.GetTermsByCourseId(courseId);
            //svi termini za pojedini kolegij
            var termsForCourse = _mapper.Map<List<TermDTO>>(terms);
            var termsWhichAreMatch = new List<TermDTO>();
            var termsHelper = new List<TermDTO>();
            var groupIds = _groupRepo.GetGroupsByCourseId(courseId).Select(g=>g.Id).ToList();
            //ID-evi svih grupa za pojedini kolegij
            var groupsCount = _groupRepo.GetGroupsByCourseId(courseId).ToList().Count;
            //koliko grupa ima u svakom kolegiju
            var dates = termsForCourse.Select(t => t.TermDate).Distinct();

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
        
        public List<TermDTO> GetTermsByGroupId(int groupId)
        {
            var terms = _termRepo.GetTermsByGroupId(groupId);
            var terms2 = _mapper.Map<List<TermDTO>>(terms);
            terms2 = terms2.OrderBy(t => t.TermDate).ToList();
            return terms2;
        }
    }
}
