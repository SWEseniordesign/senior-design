import { Home } from '../pages/Home/Home';
import { Login } from '../pages/Login/Login';

const SiteRoutes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/login',
        component: Login
    }
]

export default SiteRoutes;