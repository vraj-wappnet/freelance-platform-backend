export type UserRole = 'client' | 'freelancer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  skills?: string[];
  createdAt: Date;
}

export type ContractStage = 'proposal' | 'approval' | 'payment' | 'review' | 'completed';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'approved';
  paymentStatus: 'unpaid' | 'requested' | 'paid';
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  clientId: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  budget: {
    min: number;
    max: number;
  };
  duration: string;
  status: 'open' | 'assigned' | 'in-progress' | 'completed' | 'canceled';
  createdAt: Date;
  updatedAt: Date;
}

export interface Bid {
  id: string;
  projectId: string;
  freelancerId: string;
  amount: number;
  coverLetter: string;
  deliveryTime: string;
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface Contract {
  id: string;
  projectId: string;
  clientId: string;
  freelancerId: string;
  amount: number;
  stage: ContractStage;
  milestones: Milestone[];
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'bid' | 'contract' | 'milestone' | 'payment';
  title: string;
  description: string;
  read: boolean;
  link: string;
  createdAt: Date;
}