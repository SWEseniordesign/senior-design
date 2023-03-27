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
        component: <Home/>,
        simplifiedHeader: false
    },
    {
        path: '/login',
        component: <Login/>,
        simplifiedHeader: false
    },
    {
        path: '/create-account',
        component: <CreateAccount/>,
        simplifiedHeader: false
    },
    {
        path: '/create-business',
        component: <CreateBusiness/>,
        simplifiedHeader: false
    },
    {
        path: '/access-business',
        component: <AccessBusiness/>,
        simplifiedHeader: false
    },
    {
        path: '/edit-till/:id',
        component: <ViewEditTill/>,
        simplifiedHeader: true
    },
    {
        path: '/view-till/:id',
        component: <ViewEditTill/>,
        simplifiedHeader: true
    },
    {
        path: '/access-till',
        component: <AccessTill/>,
        simplifiedHeader: false
    },
    {
        path: '/dashboard',
        component: <Dashboard/>,
        simplifiedHeader: false
    },
]

export default SiteRoutes;