/**
 * Clubs API
 */

import apiClient from './client';
import {
  ClubListItem,
  ClubDetails,
  CreateClubDto,
  UpdateClubDto,
  ClubFilters,
  Pagination,
  PaginatedResponse,
  MemberWithStudent,
  MembershipDto,
  UpdateMembershipStatusDto,
} from '@/types/api.types';

export const clubsApi = {
  /**
   * Get all clubs with filters and pagination
   */
  getClubs: async (
    filters?: ClubFilters,
    pagination?: Pagination
  ): Promise<PaginatedResponse<ClubListItem>> => {
    const params = new URLSearchParams();
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());

    const queryString = params.toString();
    return apiClient.get(`/clubs${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get club by ID
   */
  getClub: async (id: string): Promise<ClubDetails> => {
    return apiClient.get(`/clubs/${id}`);
  },

  /**
   * Create a new club
   */
  createClub: async (data: CreateClubDto): Promise<ClubDetails> => {
    return apiClient.post('/clubs', data);
  },

  /**
   * Update a club
   */
  updateClub: async (id: string, data: UpdateClubDto): Promise<ClubDetails> => {
    return apiClient.patch(`/clubs/${id}`, data);
  },

  /**
   * Delete a club
   */
  deleteClub: async (id: string): Promise<void> => {
    return apiClient.delete(`/clubs/${id}`);
  },

  /**
   * Get club members
   */
  getMembers: async (
    clubId: string,
    status?: 'pending' | 'active' | 'rejected'
  ): Promise<MemberWithStudent[]> => {
    const params = status ? `?status=${status}` : '';
    const response = await apiClient.get<{ members: MemberWithStudent[] }>(
      `/clubs/${clubId}/members${params}`
    );
    return response.members;
  },

  /**
   * Join a club
   */
  joinClub: async (clubId: string): Promise<MembershipDto> => {
    return apiClient.post(`/clubs/${clubId}/members`);
  },

  /**
   * Update membership status
   */
  updateMemberStatus: async (
    clubId: string,
    studentId: string,
    data: UpdateMembershipStatusDto
  ): Promise<MembershipDto> => {
    return apiClient.patch(`/clubs/${clubId}/members/${studentId}`, data);
  },

  /**
   * Leave a club
   */
  leaveClub: async (clubId: string, studentId: string): Promise<void> => {
    return apiClient.delete(`/clubs/${clubId}/members/${studentId}`);
  },
};
