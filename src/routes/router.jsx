import { createBrowserRouter, redirect } from "react-router-dom";

import { AdminLayout } from "../layout/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import AddAcademic from "../pages/Academic/AddAcademic";
import AllAcademics from "../pages/Academic/AllAcademics";

import AddAward from "../pages/Award/AddAward";
import AllAwards from "../pages/Award/AllAwards";

import AddProjectSupervision from "../ProjectSupervision/AddProjectSupervision";
import AllProjectSupervision from "../ProjectSupervision/AllProjectSupervision";

import AddCourses from "../pages/Courses/AddCourses";
import AllCourses from "../pages/Courses/AllCourses";

import AddExperience from "../pages/Experience/AddExperience";
import AllExperiences from "../pages/Experience/AllExperiences";

// 📌 Workshop Components Import
import AddWorkshops from "../pages/Workshops/AddWorkshops";
import AllWorkshops from "../pages/Workshops/AllWorkshops";

import AddGallery from "../pages/Gallery/AddGallery";
import AllGallery from "../pages/Gallery/AllGallery";

import AddReferees from "../pages/Referees/AddReferees";
import AllReferees from "../pages/Referees/AllReferees";

import AddResearch from "../pages/Research/AddResearch";
import AllResearch from "../pages/Research/AllResearch";

import AddTools from "../pages/Tools/AddTools";
import AllTools from "../pages/Tools/AllTools";

import Users from "../pages/Users/Users";

export const router = createBrowserRouter([
  // Public routes
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            loader: () => redirect("/admin/all-users"),
          },

          {
            path: "academic/add",
            element: <AddAcademic />,
          },
          {
            path: "academic/all",
            element: <AllAcademics />,
          },

          {
            path: "award/add",
            element: <AddAward />,
          },
          {
            path: "award/all",
            element: <AllAwards />,
          },

          {
            path: "project-supervision/add",
            element: <AddProjectSupervision />,
          },
          {
            path: "project-supervision/all",
            element: <AllProjectSupervision />,
          },

          {
            path: "courses/add",
            element: <AddCourses />,
          },
          {
            path: "courses/all",
            element: <AllCourses />,
          },

          {
            path: "experience/add",
            element: <AddExperience />,
          },
          {
            path: "experience/all",
            element: <AllExperiences />,
          },

          // 📌 Workshops Routes (Gallery-এর ঠিক আগে)
          {
            path: "workshops/add",
            element: <AddWorkshops />,
          },
          {
            path: "workshops/all",
            element: <AllWorkshops />,
          },

          {
            path: "gallery/add",
            element: <AddGallery />,
          },
          {
            path: "gallery/all",
            element: <AllGallery />,
          },

          {
            path: "referees/add",
            element: <AddReferees />,
          },
          {
            path: "referees/all",
            element: <AllReferees />,
          },

          {
            path: "research/add",
            element: <AddResearch />,
          },
          {
            path: "research/all",
            element: <AllResearch />,
          },

          {
            path: "tools/add",
            element: <AddTools />,
          },
          {
            path: "tools/all",
            element: <AllTools />,
          },

          {
            path: "/admin/all-users",
            element: <Users />,
          },
        ],
      },
    ],
  },
]);