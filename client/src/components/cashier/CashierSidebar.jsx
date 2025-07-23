import React from 'react';
import { assets } from '../../assets/assets';
import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const CashierSidebar = () => {
  const user = {
    firstName: 'Cashier',
    lastName: 'User',
    imageUrl: assets.profile,
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/cashier' },
    { label: 'Bookings', icon: ClipboardList, path: '/cashier/bookings' },
    { label: 'Filter by Date', icon: CalendarDays, path: '/cashier/filter' },
  ];

  return (
    <div className='h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm'>
      <img
        className='h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto'
        src={user.imageUrl}
        alt='sidebar'
      />
      <p className='mt-2 text-base max-md:hidden'>
        {user.firstName} {user.lastName}
      </p>

      <div className='w-full'>
        {navItems.map((link, index) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={index}
              to={link.path}
              end
              className={({ isActive }) =>
                `relative flex items-center max-md:justify-center gap-2 w-full
                py-2.5 md:px-10 first:mt-6 text-gray-400 ${
                  isActive ? 'bg-[#2978B5]/15 text-[#2978B5] group' : ''
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className='w-5 h-5' />
                  <p className='max-md:hidden'>{link.label}</p>
                  {isActive && (
                    <span className='w-1.5 h-10 rounded-l right-0 absolute bg-[#2978B5]'></span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default CashierSidebar;
