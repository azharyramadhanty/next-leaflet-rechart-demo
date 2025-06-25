import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GoSidebarExpand, GoSidebarCollapse } from "react-icons/go";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const menuItems = router.pathname === '/document-upload' ? [
    { icon: router.pathname === '/document-upload' ? <img src="/assets/schedule-realization-active-icon.svg" alt="document upload icon" className="w-8" /> : <img src="/assets/schedule-realization-icon.svg" alt="Home Icon" className="w-8" />, label: 'Document Upload', route: '/document-upload' },
  ] : [
    { icon: router.pathname === '/' ? <img src="/assets/home-active-icon.svg" alt="Home Icon" className="w-8" /> : <img src="/assets/home-icon.svg" alt="Home Icon" className="w-8" />, label: 'Overview', route: '/' },
    { icon: router.pathname === '/vessel-performance' ? <img src="/assets/vessel-performance-active-icon.svg" alt="Vessel Performance Icon" className="w-8" /> : <img src="/assets/vessel-performance-icon.svg" alt="Vessel Performance Icon" className="w-8" />, label: 'Vessel Performance', route: '/vessel-performance' },
    { icon: router.pathname === '/vessel-comparison' ? <img src="/assets/vessel-comparison-active-icon.svg" alt="Vessel Comparison Icon" className="w-8" /> : <img src="/assets/vessel-comparison-icon.svg" alt="Vessel Comparison Icon" className="w-8" />, label: 'Vessel Comparison', route: '/vessel-comparison' },
    { icon: router.pathname === '/bunker-performance' ? <img src="/assets/bunker-supply-performance-active-icon.svg" alt="Bunker Supply Performance Icon" className="w-8" /> : <img src="/assets/bunker-supply-performance-icon.svg" alt="Bunker Supply Performance Icon" className="w-8" />, label: 'Bunker Supply Performance', route: '/bunker-performance' },
    { icon: router.pathname === '/planning-simulation' ? <img src="/assets/planning-simulation-active-icon.svg" alt="Plan & Simulate Icon" className="w-8" /> : <img src="/assets/planning-simulation-icon.svg" alt="Plan & Simulate Icon" className="w-8" />, label: 'Planning & Simulation', route: '/planning-simulation' },
    { icon: router.pathname === '/schedule-realization' ? <img src="/assets/schedule-realization-active-icon.svg" alt="Schedule & Realization Icon" className="w-8" /> : <img src="/assets/schedule-realization-icon.svg" alt="Schedule & Realization Icon" className="w-8" />, label: 'Schedule & Realization', route: '/schedule-realization' }
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* <div className={`fixed left-0 top-0 h-screen border-r transition-all duration-500 ease-in-out 
        ${isCollapsed ? 'w-[81px]' : 'w-[260px]'}`}> */}
      <div className={`relative left-0 top-0 z-9999 flex h-[cal(100vh)] flex-col overflow-y-hidden duration-1000 border-r transition-all ease-in-out ${isCollapsed ? 'w-[76px]' : 'w-[215px]'}`}>
        <div className="flex items-center justify-start p-4">
          {isCollapsed ?
            (<img src="/assets/pertamina-logo.svg" alt="Logo Icon" className="w-auto" />)
            : (<img src="/assets/pertamina-logo-full.svg" alt="Logo Icon" className="w-auto" />)
          }
        </div>
        <nav className="pt-2">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className="mb-0">
                <Link href={item.route} className={`flex items-center p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200 ${isCollapsed ? 'justify-center' : 'px-4'}`}>
                  <span>{item.icon}</span>
                  {!isCollapsed && (
                    <span className="ml-4 text-[11px] font-normal">{item.label}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 left-0 p-5 hidden bg-white lg:flex" sidebar-bottom-menu="">
          <button onClick={toggleSidebar}
            className="inline-flex justify-center rounded cursor-pointer text-md font-medium text-center duration-200" aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {isCollapsed ? <GoSidebarCollapse /> : <GoSidebarExpand />}
            {!isCollapsed && (<span className="ml-4 text-[11px]">Collapse sidebar</span>)}
          </button>
        </div>
      </div>
    </>
  );

};

export default Sidebar;
