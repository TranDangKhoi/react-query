import { StudentsType } from "types/students.type";
import http from "utils/http";

export const getStudents = (page: number | string, limit: number | string) =>
  http.get<StudentsType>("/students", {
    params: {
      _page: page,
      _limit: limit
    }
  });
