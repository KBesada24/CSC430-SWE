import { StudentRepository } from '@/lib/repositories/student.repository';
import { hashPassword, comparePassword } from '@/lib/utils/password';
import { generateToken, verifyToken, JwtPayload } from '@/lib/utils/jwt';
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from '@/lib/utils/error-handler';

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  student: {
    student_id: string;
    email: string;
    first_name: string;
    last_name: string;
    created_at: string | null;
    role: 'student' | 'club_admin' | 'university_admin';
  };
}

export interface StudentResponse {
  student_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'club_admin' | 'university_admin';
  created_at: string | null;
}

export class AuthService {
  private studentRepository: StudentRepository;

  constructor() {
    this.studentRepository = new StudentRepository();
  }

  /**
   * Registers a new student with hashed password
   */
  async register(data: RegisterDto): Promise<StudentResponse> {
    // Check if email already exists
    const existingStudent = await this.studentRepository.findByEmail(data.email);
    if (existingStudent) {
      throw new ConflictError('Email already registered');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create student
    const student = await this.studentRepository.create({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password_hash: hashedPassword,
    });

    // Return student without password
    return {
      student_id: student.student_id,
      email: student.email,
      first_name: student.first_name,
      last_name: student.last_name,
      role: student.role as 'student' | 'club_admin' | 'university_admin',
      created_at: student.created_at,
    };
  }

  /**
   * Authenticates a student and generates JWT token
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    // Find student by email
    const student = await this.studentRepository.findByEmail(email);
    if (!student) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, student.password_hash);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
      studentId: student.student_id,
      email: student.email,
      role: student.role as 'student' | 'club_admin' | 'university_admin',
    });

    // Return token and student data
    return {
      token,
      student: {
        student_id: student.student_id,
        email: student.email,
        first_name: student.first_name,
        last_name: student.last_name,
        role: student.role as 'student' | 'club_admin' | 'university_admin',
        created_at: student.created_at,
      },
    };
  }

  /**
   * Invalidates the current session (logout)
   * Note: With JWT, we can't truly invalidate tokens server-side without a blacklist
   * This method is a placeholder for future implementation with token blacklist
   */
  async logout(token: string): Promise<void> {
    // Verify token is valid before "logging out"
    verifyToken(token);
    
    // In a production system, you would:
    // 1. Add token to a blacklist/revocation list
    // 2. Store in Redis with expiration matching token expiry
    // For now, this is a no-op as client will discard the token
  }

  /**
   * Verifies JWT token and returns decoded payload
   */
  async verifyTokenAndGetStudent(token: string): Promise<StudentResponse> {
    // Verify and decode token
    const payload: JwtPayload = verifyToken(token);

    // Fetch student to ensure they still exist
    const student = await this.studentRepository.findById(payload.studentId);
    if (!student) {
      throw new NotFoundError('Student');
    }

    // Return student without password
    return {
      student_id: student.student_id,
      email: student.email,
      first_name: student.first_name,
      last_name: student.last_name,
      role: student.role as 'student' | 'club_admin' | 'university_admin',
      created_at: student.created_at,
    };
  }
}
