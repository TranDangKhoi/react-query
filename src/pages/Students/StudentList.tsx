import { deleteStudentById, getStudents } from "apis/students.api";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryString } from "hooks/useQueryString";
import classNames from "classnames";
import { toast } from "react-toastify";

const LIMIT = 5;
export default function StudentList() {
  const queryString: { page?: string } = useQueryString();
  const page = Number(queryString.page) || 1;
  const fetchStudentsQuery = useQuery({
    queryKey: ["students", { page: page }],
    queryFn: () => getStudents(page, LIMIT),
    staleTime: 60 * 1000,
    // keepPreviousData: true,
  });
  const totalStudents = Number(fetchStudentsQuery.data?.headers["x-total-count"]) || 0;
  const totalPages = Math.ceil(totalStudents / LIMIT);

  const deleteStudentMutation = useMutation({
    mutationFn: (id: number | string) => deleteStudentById(id),
  });

  const handleDeleteStudentById = (id: number) => {
    deleteStudentMutation.mutate(id, {
      onSuccess: () => {
        toast.success(`Deleted student with id ${id}`);
        fetchStudentsQuery.refetch();
      },
    });
  };
  return (
    <div>
      <h1 className="text-lg">Students</h1>
      <div className="my-10 text-center ">
        <Link
          to={"/students/add"}
          className="rounded-full bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Add student
        </Link>
      </div>
      {fetchStudentsQuery.isLoading && (
        <div role="status" className="mt-6 animate-pulse">
          <div className="mb-4 h-4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-10 rounded bg-gray-200 dark:bg-gray-700" />
          <span className="sr-only">Loading...</span>
        </div>
      )}
      {!fetchStudentsQuery.isLoading && (
        <>
          <div className="relative mt-6 overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Avatar
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {fetchStudentsQuery.data?.data.map((student) => (
                  <tr
                    className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                    key={student.id}
                  >
                    <td className="px-6 py-4">{student.id}</td>
                    <td className="px-6 py-4">
                      <img src={student.avatar} alt="student" className="h-5 w-5" />
                    </td>
                    <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {student.last_name}
                    </th>
                    <td className="px-6 py-4">{student.email}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/students/${student.id}`}
                        className="mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500"
                      >
                        Edit
                      </Link>
                      <button
                        className="font-medium text-red-600 dark:text-red-500"
                        onClick={() => handleDeleteStudentById(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex justify-center">
            <nav aria-label="Page navigation example">
              <ul className="inline-flex -space-x-px">
                <li>
                  {page === 1 ? (
                    <span
                      className={classNames(
                        "cursor-not-allowed select-none rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500",
                        // Interactive
                        "hover:bg-gray-100 hover:text-gray-700",
                        // Dark mode
                        "dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white",
                      )}
                    >
                      Previous
                    </span>
                  ) : (
                    <Link
                      className="cursor-pointer rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      to={`/students?page=${page - 1}`}
                    >
                      Previous
                    </Link>
                  )}
                </li>
                {Array(totalPages)
                  .fill(0)
                  .map((_, index) => {
                    const pageNumber = index + 1;
                    const isActive = page === pageNumber;
                    return (
                      <li key={pageNumber}>
                        <Link
                          className={classNames(
                            `border border-gray-300 px-3 py-2 leading-tight`,
                            "hover:bg-gray-100 hover:text-gray-700",
                            { "bg-gray-100 text-gray-700": isActive },
                            { "bg-white text-gray-500": !isActive },
                          )}
                          to={`/students?page=${pageNumber}`}
                        >
                          {pageNumber}
                        </Link>
                      </li>
                    );
                  })}
                <li>
                  {page === totalPages ? (
                    <span
                      className={classNames(
                        "cursor-not-allowed select-none rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500",
                        "hover:bg-gray-100 hover:text-gray-700",
                        "dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white",
                      )}
                    >
                      Next
                    </span>
                  ) : (
                    <Link
                      className={classNames(
                        "cursor-pointer rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500",
                        "hover:bg-gray-100 hover:text-gray-700",
                        "dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white",
                      )}
                      to={`/students?page=${page + 1}`}
                    >
                      Next
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
