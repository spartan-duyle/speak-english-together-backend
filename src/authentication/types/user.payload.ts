export type UserPayload = {
  id: number;
  full_name: string;
  avatar_url: string;
  level: string;
  email: string;
  nationality: string;
  birthday?: Date;
  native_language?: string;
  interests?: string[];
  learning_goals?: string[];
  occupation?: string;
};
