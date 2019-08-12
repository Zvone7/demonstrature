using AutoMapper;
using DemonstratureCM.DTO;
using DemonstratureDB;
using DemonstratureDB.Data;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DemonstratureBLL
{
    public class GroupLogic
    {
        private readonly IMapper _mapper;
        private readonly GroupRepo _groupRepo;
        private readonly log4net.ILog _logger;
        public GroupLogic(IMapper mapper, GroupRepo groupRepo, log4net.ILog logger)
        {
            _mapper = mapper;
            _groupRepo = groupRepo;
            _logger = logger;
        }

        private GroupDto CreateGroup(GroupDto g)
        {
            try
            {
                var g2 = _mapper.Map<GroupT>(g);
                if (g2.OwnerId == 0) { g2.OwnerId = null; }
                g2 = _groupRepo.CreateGroup(g2);
                g = _mapper.Map<GroupDto>(g2);
                return g;
            }
            catch (Exception e)
            {
                _logger.Error($"Error creating group.", e);
                return null;
            }
        }

        public bool DeleteGroup(int groupId)
        {
            try
            {
                return _groupRepo.DeleteGroup(groupId);
            }
            catch (Exception e)
            {
                _logger.Error($"Error deleting group id {groupId}", e);
                return false;
            }
        }

        private GroupDto UpdateGroup(GroupDto g)
        {
            try
            {
                var g2 = _mapper.Map<GroupT>(g);
                if (g2.OwnerId == 0) { g2.OwnerId = null; }
                var groupIndb = _groupRepo.UpdateGroup(g2);
                return _mapper.Map<GroupDto>(groupIndb);
            }
            catch (Exception e)
            {
                _logger.Error($"Error updating group id {g.Id}", e);
                return null;
            }
        }

        public GroupDto CreateOrUpdateGroup(GroupDto group)
        {
            if (group.Id == 0)
            {
                return CreateGroup(group);
            }
            else
            {
                return UpdateGroup(group);
            }
        }

        public GroupDto GetGroup(int Id)
        {
            try
            {
                var g = _groupRepo.GetGroup(Id);
                var g2 = _mapper.Map<GroupDto>(g);
                return g2;
            }
            catch
            {
                return null;
            }
        }
        public List<GroupDto> GetGroupsByCourseId(int courseId)
        {
            var groups = new List<GroupDto>();
            try
            {
                var groupsFromDb = _groupRepo.GetGroupsByCourseId(courseId);
                groups = _mapper.Map<List<GroupDto>>(groupsFromDb).OrderBy(g => g.Name).ToList();
                return groups;
            }
            catch (Exception e)
            {
                _logger.Error($"Error getting groups by course id {courseId}", e);
                return groups;
            }
        }
    }
}
