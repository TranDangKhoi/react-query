export type StudentType = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  country: string;
  avatar: string;
  btc_addres: string;
};

export type StudentsType = Pick<StudentType, "id" | "email" | "avatar" | "last_name">[];
