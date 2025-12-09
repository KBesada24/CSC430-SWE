import { NotificationRepository } from '../repositories/notification.repository';
import { MembershipRepository } from '../repositories/membership.repository';

export class NotificationService {
  private notificationRepository: NotificationRepository;
  private membershipRepository: MembershipRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
    this.membershipRepository = new MembershipRepository();
  }

  async getUserNotifications(studentId: string) {
    const notifications = await this.notificationRepository.findByStudentId(studentId);
    
    // Convert to strict camelCase
    return notifications.map(n => ({
      notificationId: n.notification_id,
      studentId: n.student_id,
      title: n.title,
      message: n.message,
      type: n.type,
      isRead: n.read,
      metadata: n.metadata,
      createdAt: n.created_at
    }));
  }

  async getUnreadCount(studentId: string) {
    return this.notificationRepository.countUnread(studentId);
  }

  async markAsRead(notificationId: string) {
    await this.notificationRepository.markAsRead(notificationId);
  }

  async notifyClubMembers(clubId: string, title: string, message: string, type: string = 'system', metadata?: any) {
    // Get all active members
    const members = await this.membershipRepository.findByClub(clubId);
    const activeMembers = members.filter((m: any) => m.status === 'active');

    if (activeMembers.length === 0) return;

    // Create notifications for all
    const notifications = activeMembers.map((member: any) => ({
      student_id: member.student_id,
      title,
      message,
      type,
      metadata: metadata || {},
    }));

    await this.notificationRepository.createMany(notifications);
  }
}
