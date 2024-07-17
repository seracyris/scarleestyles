import Dashboard from './Tabs/Dashboard';
import Statistics from './Tabs/Statistics';
import Users from './Tabs/Users';
import Inventory from './Tabs/Inventory';
import Orders from './Tabs/Orders';
import Billings from './Tabs/Billings';
import Settings from './Tabs/Settings';
import Help from './Tabs/Help';
import React from 'react';

const componentMap = {
    Dashboard: Dashboard,
    Statistics: Statistics,
    Users: Users,
    Inventory: Inventory,
    Orders: Orders,
    Billings: Billings,
    Settings: Settings,
    Help: Help
};

const PageLayout = (props) => {
    const { page } = props;
    const Component = componentMap[page];
    if (!Component) {
        return <div className='w-screen h-screen bg-white flex justify-center items-center text-center font-bold text-3xl'>Error</div>;
    }
    return <Component />;
};

export default PageLayout;
