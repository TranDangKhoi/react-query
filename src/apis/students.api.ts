import { StudentsType, StudentType } from "types/students.type";
import http from "utils/http";

export const getStudents = (page: number | string, limit: number | string) =>
  http.get<StudentsType>("/students", {
    params: {
      _page: page,
      _limit: limit,
    },
  });

export const getStudentById = (studentId: number | string) => http.get<StudentType>(`/students/${studentId}`);

export const addStudent = (body: Omit<StudentType, "id">) => http.post<StudentsType>("/students", body);

export const updateStudentById = (studentId: number | string, body: StudentType) =>
  http.put<StudentType>(`/students/${studentId}`, body);

export const deleteStudentById = (studentId: number | string) => http.delete<{}>(`/students/${studentId}`);
