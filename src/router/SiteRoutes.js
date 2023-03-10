import { Home } from '../pages/Home/Home';
import { Login } from '../pages/Login/Login';
import { AccessTill } from '../pages/AccessTill/AccessTill';
import { CreateBusiness } from '../pages/CreateBusiness/CreateBusiness';
import { AccessBusiness } from '../pages/AccessBusiness/AccessBusiness';
import { CreateAccount } from '../pages/CreateAccount/CreateAccount';
import Dashboard from '../pages/Dashboard/Dashboard';
import { ViewEditTill } from '../pages/ViewEditTill/ViewEditTill';

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
        path: '/create-account',
        component: <CreateAccount/>
    },
    {
        path: '/create-business',
        component: <CreateBusiness/>
    },
    {
        path: '/access-business',
        component: <AccessBusiness/>
    },
    {
        path: '/edit-till/:id',
        component: <ViewEditTill/>
    },
    {
        path: '/view-till/:id',
        component: <ViewEditTill/>
    },
    {
        path: '/access-till',
        component: <AccessTill/>
    },
    {
        path: '/dashboard',
        component: <Dashboard/>
    },
]

export default SiteRoutes;