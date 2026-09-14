import { createBrowserRouter } from "react-router";
import { AdminLayout } from "../layout/AdminLayout";
import AddAcademic from "../pages/Academic/AddAcademic";
import AllAcademics from "../pages/Academic/AllAcademics";
import AddAward from "../pages/Award/AddAward";
import AllAwards from "../pages/Award/AllAwards";
import AddCourses from "../pages/Courses/AddCourses";
import AllCourses from "../pages/Courses/AllCourses";
import AddExperience from "../pages/Experience/AddExperience";
import AllExperiences from "../pages/Experience/AllExperiences";
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
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { path: "admin/all-users", element: <Users></Users> },
      { path: "award", element: <AddAward /> },
      { path: "admin/all-awards", element: <AllAwards /> },
      { path: "experience", element: <AddExperience /> },
      { path: "admin/all-experiences", element: <AllExperiences /> },
      { path: "tools", element: <AddTools /> },
      { path: "admin/all-tools", element: <AllTools /> },
      { path: "research", element: <AddResearch /> },
      { path: "admin/all-research", element: <AllResearch /> },
      { path: "courses", element: <AddCourses /> },
      { path: "admin/all-courses", element: <AllCourses /> },
      { path: "academic", element: <AddAcademic /> },
      { path: "admin/all-academics", element: <AllAcademics /> },
      { path: "gallery", element: <AddGallery /> },
      { path: "admin/all-gallery", element: <AllGallery /> },
      { path: "referees", element: <AddReferees /> },
      { path: "admin/all-referees", element: <AllReferees /> },
    ],
  },
]);