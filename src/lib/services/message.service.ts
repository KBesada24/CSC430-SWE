
import { MessageRepository } from '../repositories/message.repository';
import { StudentRepository } from '../repositories/student.repository';
import { NotFoundError, AuthenticationError as UnauthorizedError } from '@/lib/utils/error-handler';

export class MessageService {
  private messageRepository: MessageRepository;
  private studentRepository: StudentRepository;

  constructor() {
    this.messageRepository = new MessageRepository();
    this.studentRepository = new StudentRepository();
  }

  async getClubMessages(clubId: string, limit?: number) {
    const messages = await this.messageRepository.findByClubId(clubId, limit);
    
    // Map to camelCase for frontend
    return messages.map(msg => ({
      messageId: msg.message_id,
      content: msg.content,
      clubId: msg.club_id,
      studentId: msg.student_id,
      createdAt: msg.created_at,
      student: (msg as any).student ? { // Type assertion as joins aren't perfectly typed in Supabase generic
        studentId: (msg as any).student.student_id,
        firstName: (msg as any).student.first_name,
        lastName: (msg as any).student.last_name,
        email: (msg as any).student.email,
        avatarUrl: null
      } : null
    }));
  }

  async sendMessage(clubId: string, studentId: string, content: string) {
    if (!content.trim()) {
      throw new Error('Message content cannot be empty');
    }

    const message = await this.messageRepository.create({
      club_id: clubId,
      student_id: studentId,
      content: content,
    });

    return {
      messageId: message.message_id,
      content: message.content,
      clubId: message.club_id,
      studentId: message.student_id,
      createdAt: message.created_at,
    };
  }
}
