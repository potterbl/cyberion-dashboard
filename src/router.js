import {createBrowserRouter} from "react-router-dom";
import RequireAuth from "./components/requireAuth";
import Dashboard from "./pages/dashboard";
import Wrapper from "./components/wrapper";
import News from "./pages/news";
import AuthWrapper from "./components/authWrapper";
import Login from "./pages/login";
import NewsEdit from "./pages/newsEdit";
import NewsCreate from "./pages/newsCreate";
import Blog from "./pages/blog";
import BlogEdit from "./pages/blogEdit";
import BlogCreate from "./pages/blogCreate";
import Users from "./pages/users";
import UsersCreate from "./pages/usersCreate";
import Seasons from "./pages/seasons";
import SeasonsCreate from "./pages/seasonsCreate";
import Tournaments from "./pages/tournaments";
import TournamentsCreate from "./pages/tournamentsCreate";
import SeparateTournaments from "./pages/separateTournaments";
import SeparateTournamentsCreate from "./pages/separateTournamentsCreate";
import Divisions from "./pages/divisions";
import DivisionCreate from "./pages/divisionCreate";
import SeasonsEdit from "./pages/seasonsEdit";
import TournamentsEdit from "./pages/tournamentsEdit";
import DivisionsEdit from "./pages/divisionEdit";
import Bans from "./pages/bans";
import BansCreate from "./pages/bansCreate";
import SeparateTournamentsEdit from "./pages/separateTournamentsEdit";

export const router = createBrowserRouter([
    {
        path: "/",
        children: [
            {
                element:
                    <RequireAuth>
                        <Wrapper/>
                    </RequireAuth>,
                children: [
                    {
                        path: "/",
                        element: <Dashboard/>
                    },
                    {
                        path: "news",
                        element: <News/>
                    },
                    {
                        path: "blog",
                        element: <Blog/>
                    },
                    {
                        path: "users",
                        element: <Users/>
                    },
                    {
                        path: "clubs",
                        element: <News/>
                    },
                    {
                        path: "seasons",
                        element: <Seasons/>
                    },
                    {
                        path: "tournaments",
                        element: <Tournaments/>
                    },
                    {
                        path: "separate-tournaments",
                        element: <SeparateTournaments/>
                    },
                    {
                        path: "divisions",
                        element: <Divisions/>
                    },
                    {
                        path: "/news/edit/:id",
                        element: <NewsEdit/>
                    },
                    {
                        path: "/news/create",
                        element: <NewsCreate/>
                    },
                    {
                        path: "/blog/edit/:id",
                        element: <BlogEdit/>
                    },
                    {
                        path: "/blog/create",
                        element: <BlogCreate/>
                    },
                    {
                        path: "/users/create",
                        element: <UsersCreate/>
                    },
                    {
                        path: "/seasons/create",
                        element: <SeasonsCreate/>
                    },
                    {
                        path: "/tournaments/create",
                        element: <TournamentsCreate/>
                    },
                    {
                        path: "/separate-tournaments/create",
                        element: <SeparateTournamentsCreate/>
                    },
                    {
                        path: "/divisions/create",
                        element: <DivisionCreate/>
                    },
                    {
                        path: "/seasons/edit/:id",
                        element: <SeasonsEdit/>
                    },
                    {
                        path: "/tournaments/edit/:id",
                        element: <TournamentsEdit/>
                    },
                    {
                        path: "/divisions/edit/:id",
                        element: <DivisionsEdit/>
                    },
                    {
                        path: "/bans",
                        element: <Bans/>
                    },
                    {
                        path: "/bans/create",
                        element: <BansCreate/>
                    },
                    {
                        path: "/separate-tournaments/edit/:id",
                        element: <SeparateTournamentsEdit/>
                    },
                ]
            },
            {
                path: "auth",
                element: <AuthWrapper/>,
                children: [
                    {
                        path: "login",
                        element: <Login/>,
                    }
                ]
            }
        ],
    }
]);