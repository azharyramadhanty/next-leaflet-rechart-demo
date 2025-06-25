import SidebarKpi from "@/components/SidebarKpi";
import dynamic from "next/dynamic";
import OverviewCard from "@/components/OverviewCard";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { vesselService } from "@/hooks/vessels/vesselService";
import { useVessel } from "@/hooks/vessels/useVessel";
import { useEffect } from "react";
import { useTitle } from "@/context/TitleContext";

const MapMain = dynamic(() => import("@/components/MainMap"), { ssr: false })


const Home = () => {
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle("Smart Bunker");
  }, []);
  return (
    <>
      <div className="flex p-2">
        <main className="flex flex-wrap">
          {/* Sidebar Info */}
          <div className="w-1/4 pt-2 pb-0">
            <SidebarKpi />
          </div>
          {/* Maps  */}
          <div className="pt-2 pb-0 pl-2">
            <div className="flex">
              <MapMain />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// export async function getStaticProps() {
//   const queryClient = new QueryClient();

//   await queryClient.prefetchQuery({
//     queryKey: ['fetchAllVessels'],
//     queryFn: () => vesselService.fetchAll(),
//   })

//   return {
//     props: {
//       dehydrateState: dehydrate(queryClient),
//     },
//   }
// }

export default Home;