import {createBrowserRouter} from "react-router-dom";
import RequireAuth from "./components/requireAuth";
import Dashboard from "./pages/dashboard";
import Wrapper from "./components/wrapper";
import News from "./pages/news";
import AuthWrapper from "./components/authWrapper";
import Login from "./pages/login";
import NewsEdit from "./pages/newsEdit";
import NewsCreate from "./pages/newsCreate";
import Users from "./pages/users";
import UsersCreate from "./pages/usersCreate";

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
                        path: "users",
                        element: <Users/>
                    },
                    {
                        path: "clubs",
                        element: <News/>
                    },
                    {
                        path: "tournaments",
                        element: <News/>
                    },
                    {
                        path: "disciplines",
                        element: <News/>
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
                        path: "/users/create",
                        element: <UsersCreate/>
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
