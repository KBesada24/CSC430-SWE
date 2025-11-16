import { InviteRepository } from '@/lib/repositories/invite.repository';
import { ClubRepository } from '@/lib/repositories/club.repository';
import { generateInviteToken } from '@/lib/utils/inviteToken';
import { NotFoundError } from '@/lib/utils/error-handler';

export interface InviteDetails {
  inviteUrl: string;
  token: string;
}

export class InviteService {
  private inviteRepository: InviteRepository;
  private clubRepository: ClubRepository;

  constructor() {
    this.inviteRepository = new InviteRepository();
    this.clubRepository = new ClubRepository();
  }

  /**
   * Get or create invite token for a club
   */
  async getOrCreateInvite(clubId: string): Promise<InviteDetails> {
    // Verify club exists
    const club = await this.clubRepository.findById(clubId);
    if (!club) {
      throw new NotFoundError('Club');
    }

    // Check if invite token already exists
    let invite = await this.inviteRepository.findByClubId(clubId);

    // Create new token if none exists
    if (!invite) {
      const token = generateInviteToken();
      invite = await this.inviteRepository.create({
        club_id: clubId,
        token,
      });
    }

    // Build invite URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const inviteUrl = `${baseUrl}/invites/${invite.token}`;

    return {
      inviteUrl,
      token: invite.token,
    };
  }

  /**
   * Get club ID from invite token
   */
  async getClubIdFromToken(token: string): Promise<string | null> {
    const invite = await this.inviteRepository.findByToken(token);
    return invite ? invite.club_id : null;
  }
}
