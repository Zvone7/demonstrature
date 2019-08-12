﻿using AutoMapper;
using DemonstratureCM.DTO;
using DemonstratureDB;
using DemonstratureDB.Data;
using System.Collections.Generic;
using System.Linq;

namespace DemonstratureBLL
{
    public class GroupLogic
    {
        private readonly IMapper _mapper;
        private readonly GroupRepo _groupRepo;
        public GroupLogic(IMapper mapper, GroupRepo groupRepo)
        {
            _mapper = mapper;
            _groupRepo = groupRepo;
        }

        public GroupDto CreateGroup(GroupDto g)
        {
            try
            {
                var g2 = _mapper.Map<GroupT>(g);
                if (g2.OwnerId == 0) { g2.OwnerId = null; }
                g2 = _groupRepo.CreateGroup(g2);
                g = _mapper.Map<GroupDto>(g2);
                return g;
            }
            catch
            {
                return null;
            }
        }

        public bool DeleteGroup(int groupId)
        {
            return _groupRepo.DeleteGroup(groupId);
        }

        public GroupDto UpdateGroup(GroupDto g)
        {
            try
            {
                var g2 = _mapper.Map<GroupT>(g);
                if (g2.OwnerId == 0) { g2.OwnerId = null; }
                var groupIndb = _groupRepo.UpdateGroup(g2);
                return _mapper.Map<GroupDto>(groupIndb);
            }
            catch
            {
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
            try
            {
                var groups = _groupRepo.GetGroupsByCourseId(courseId);
                var groups2 = _mapper.Map<List<GroupDto>>(groups);
                groups2 = groups2.OrderBy(g => g.Name).ToList();
                return groups2;
            }
            catch
            {
                return null;
            }
        }
    }
}
