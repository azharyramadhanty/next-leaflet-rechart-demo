import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Sidebar: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    
  });

  return (
    <nav className="flex flex-col w-[81px] bg-#fff text-#000 p-4 items-center border-r-[1px] border-[#E6E6E6] overflow-y-hidden">
      <h1 className="text-xl font-bold mb-5">
        <img src="/assets/pertamina-logo.svg" alt="Logo Icon" className="w-auto" />
      </h1>
      <ul className="flex flex-col">
        <li>
          <a 
          className="block items-center p-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          href="/" 
          >
            {
              router.pathname === "/" ?
                (<img src="/assets/menu-1-active.svg" alt="Menu 1 Icon" className="w-auto" />)
                :
                (<img src="/assets/menu-1.svg" alt="Menu 1 Icon" className="w-auto" />)
            }
          </a>
        </li>
        <li>
          <a 
          className="block items-center p-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          href="/dashboard" 
          >
            {
              router.pathname === "/dashboard" ?
                (<img src="/assets/menu-2-active.svg" alt="Menu 2 Icon" className="w-auto" />)
                :
                (<img src="/assets/menu-2.svg" alt="Menu 2 Icon" className="w-auto" />)
            }
          </a>
        </li>
      </ul>
      {/* <div className="absolute bottom-0 left-0 items-center"> */}
      <ul className="flex flex-col space-y-4 items-center fixed bottom-6">
        <li>
          <a href="#" className="block items-center pt-6 text-gray-900 dark:text-white group border-t-2 border-t-indigo-200">
            <img src="/assets/avatar.png" alt="Avatar Icon" className="w-10 h-10" />
          </a>
        </li>
      </ul>
      {/* </div> */}
    </nav>
  );
};

export default Sidebar;
