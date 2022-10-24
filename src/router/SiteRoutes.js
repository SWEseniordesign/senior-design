import { Home } from '../pages/Home/Home';
import { Login } from '../pages/Login/Login';

const SiteRoutes = [
    {
        path: '/',
        component: <Home/>
    },
    {
        path: '/login',
        component: <Login/>
    },
    {
        path: '/sign-up',
        // component: SignUp
    },
    {
        path: '/create-till',
        // component: CreateTill
    },
    {
        path: '/view-till',
        // component: ViewTill
    }
]

export default SiteRoutes;