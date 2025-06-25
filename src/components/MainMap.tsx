import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-rotatedmarker";
import { MapContainer, Marker, Popup, TileLayer, Polyline, useMapEvents, Circle, ZoomControl } from "react-leaflet";
import { Icon, LatLng } from "leaflet";
import { useVessel } from "@/hooks/vessels/useVessel";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import OverviewCard from "./OverviewCard";
import { usePort } from "@/hooks/port/usePort";
import { getCookie, getOS } from "@/utils/Utils";
import DropdownSelect, { SelectOptionsType } from "./DropdownSelect";
import { SelectType } from "@/utils/enums/SelectEnum";
import { PortBoundaryType, PortDetailPerformanceType, PortIncomingVesselsType, VesselDetailPerformanceType, VesselsBoundaryType } from "@/utils/Types";
import { OverviewType } from "@/utils/enums/CardEnum";

const MainMap = () => {
    const currentTab = Number(sessionStorage.getItem('currentTab'));
    // Api stuff
    const { usePortBoundaryQuery, usePortDetailPerformanceQuery, usePortIncomingVessels } = usePort();
    const { useVesselBoundaryQuery, useVesselDetailPerformanceQuery } = useVessel();
    const [vesselCode, setVesselCode] = useState("");
    const [portId, setPortId] = useState("");
    const fetchVesselBoundary = useVesselBoundaryQuery();
    const fetchPortBoundary = usePortBoundaryQuery();
    const fetchPortIncomingVessels = usePortIncomingVessels(portId);
    const fetchVesselDetailPerformance = useVesselDetailPerformanceQuery(vesselCode);
    const fetchPortDetailPerformance = usePortDetailPerformanceQuery(portId);
    const [vessels, setVessel] = useState<VesselsBoundaryType>();
    const [ports, setPort] = useState<PortBoundaryType>();
    const [portIncomingVessels, setIncomingVessels] = useState<PortIncomingVesselsType>(null);
    const [vesselDetailPerformance, setVesselDetailPerformance] = useState<VesselDetailPerformanceType>(null);
    const [portDetailPerformance, setPortDetailPerformance] = useState<PortDetailPerformanceType>(null);
    const [vesselOptions, setVesselOptions] = useState<SelectOptionsType[]>([]);
    const [portOptions, setPortOptions] = useState<SelectOptionsType[]>([]);

    // Map stuff
    const [map, setMap] = useState(null);
    const [isOverviewCardVisible, setIsOverviewCardVisible] = useState(false);
    const [isOverviewCardMounted, setIsOverviewCardMounted] = useState(false);
    const [vesselClickedIdx, setVesselClickedIdx] = useState(-1);
    const [vesselHoveredIdx, setVesselHoveredIdx] = useState(-1);
    const [portClickedIdx, setPortClickedIdx] = useState(-1);
    const [vesselSourcePort, setVesselSourcePort] = useState<LatLng>(null);
    const [vesselDestPort, setVesselDestPort] = useState<LatLng>(null);
    const [isPortView, setPortView] = useState(false);
    const [iconPortWidth, setIconPortWidth] = useState(8);
    const [iconPortHeight, setIconPortHeight] = useState(8);
    const [iconVesselWidth, setIconVesselWidth] = useState(12);
    const [iconVesselHeight, setIconVesselHeight] = useState(12);
    const [iconVesselPortWidth, setIconVesselPortWidth] = useState(25);
    const [iconVesselPortHeight, setIconVesselPortHeight] = useState(25);
    const [iconShadow, setIconShadow] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const refMainEffect = useRef(false);

    const PortIcon: Icon = new Icon({
        iconUrl: "/assets/port-icon.svg",
        iconSize: [iconPortWidth, iconPortHeight],
        // iconAnchor: [5, 15],
        // popupAnchor: [-160, 5],
    });
    const PortIconOngoing: Icon = new Icon({
        iconUrl: "/assets/port-icon.svg",
        iconSize: [20, 25],
        // iconAnchor: [5, 15],
        // popupAnchor: [-160, 5],
    });
    const PortIconClicked: Icon = new Icon({
        iconUrl: "/assets/port-icon-clicked.svg",
        iconSize: [iconPortWidth * 5, iconPortHeight * 5],
        // iconAnchor: [50, 50],
    });
    const VesselIcon: Icon = new Icon({
        iconUrl: "/assets/vessel-icon.svg",
        iconSize: [iconVesselPortWidth, iconVesselPortHeight],
        // iconAnchor: [-10, 4],
    });
    const VesselIncomingIcon: Icon = new Icon({
        iconUrl: "/assets/vessel-incoming.svg",
        iconSize: [20, 20],
        // iconAnchor: [-10, 4],
    });
    const VesselIconToPort: Icon = new Icon({
        iconUrl: "/assets/vessel-marker.svg",
        iconSize: [10, 18],
        // iconAnchor: [-10, 4],
    });
    const VesselIconGreen: Icon = new Icon({
        iconUrl: "/assets/vessel-green.svg",
        iconSize: [iconVesselWidth, iconVesselHeight],
        // iconAnchor: [-10, 4],
    });
    const VesselIconRed: Icon = new Icon({
        iconUrl: "/assets/vessel-red.svg",
        iconSize: [iconVesselWidth, iconVesselHeight],
        // iconAnchor: [-10, 4],
    });
    const VesselIconOrange: Icon = new Icon({
        iconUrl: "/assets/vessel-orange.svg",
        iconSize: [iconVesselWidth, iconVesselHeight],
        // iconAnchor: [-10, 4],
    });
    const VesselIconRedClicked: Icon = new Icon({
        iconUrl: "/assets/vessel-red-clicked.svg",
        iconSize: [iconVesselWidth * 3, iconVesselHeight * 3],
    });
    const VesselIconGreenClicked: Icon = new Icon({
        iconUrl: "/assets/vessel-green-clicked.svg",
        iconSize: [iconVesselWidth * 3, iconVesselHeight * 3],
    });
    const VesselIconOrangeClicked: Icon = new Icon({
        iconUrl: "/assets/vessel-orange-clicked.svg",
        iconSize: [iconVesselWidth * 3, iconVesselHeight * 3],
    });
    const VesselIconRedHovered: Icon = new Icon({
        iconUrl: "/assets/vessel-red-hovered.svg",
        iconSize: [iconVesselWidth, iconVesselHeight],
    });
    const VesselIconGreenHovered: Icon = new Icon({
        iconUrl: "/assets/vessel-green-hovered.svg",
        iconSize: [iconVesselWidth, iconVesselHeight],
    });
    const VesselIconOrangeHovered: Icon = new Icon({
        iconUrl: "/assets/vessel-orange-hovered.svg",
        iconSize: [iconVesselWidth, iconVesselHeight],
    });
    const rotationList = [0, 180, 45, 90, 100, 200];

    //Dropdown stuff
    const [portChoosen, setPortChoosen] = useState<SelectOptionsType | null>(null);
    const [vesselChoosen, setVesselChoosen] = useState<SelectOptionsType | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // const lineJktBdg: any = [
    //     [-6.1919, 106.897],
    //     [-6.9082, 107.6461],
    // ]

    // Functions area
    const MapComponent = () => {
        const map = useMapEvents({
            zoomend: () => {
                switch (map.getZoom()) {
                    case 3:
                        setIconPortWidth(0);
                        setIconPortHeight(0);
                        // setIconVesselWidth(6);
                        // setIconVesselHeight(6);
                        setIconVesselPortWidth(10);
                        setIconVesselPortHeight(10);
                        break;
                    case 4:
                        setIconPortWidth(3);
                        setIconPortHeight(3);
                        // setIconVesselWidth(6);
                        // setIconVesselHeight(6);
                        setIconVesselPortWidth(15);
                        setIconVesselPortHeight(15);
                        break;
                    case 5:
                        setIconPortWidth(8);
                        setIconPortHeight(8);
                        setIconVesselWidth(12);
                        setIconVesselHeight(12);
                        setIconVesselPortWidth(25);
                        setIconVesselPortHeight(25);
                        break;
                    case 6:
                        setIconPortWidth(13);
                        setIconPortHeight(13);
                        setIconVesselWidth(20);
                        setIconVesselHeight(20);
                        setIconVesselPortWidth(32);
                        setIconVesselPortHeight(32);
                        break;
                    case 7:
                        setIconPortWidth(17);
                        setIconPortHeight(17);
                        setIconVesselWidth(28);
                        setIconVesselHeight(28);
                        break;
                    case 8:
                        setIconVesselWidth(32);
                        setIconVesselHeight(32);
                        setIconPortWidth(20);
                        setIconPortHeight(20);
                        break;
                    default:
                        break;
                }
                if (vesselChoosen) {
                    const choosen = vessels.data.find(it => it.vessel_name.includes(vesselChoosen.value.toString()));
                    const choosenIdx = vessels.data.findIndex(it => it.vessel_name.includes(vesselChoosen.value.toString()));
                    setVesselClickedIdx(choosenIdx);
                    setVesselCode(choosen.vessel_code);
                    setIsOverviewCardMounted(true);
                    setTimeout(() => setIsOverviewCardVisible(true), 100);
                    setVesselSourcePort(new LatLng(
                        choosen.source_location && choosen.source_location.coordinates[1],
                        choosen.source_location && choosen.source_location.coordinates[0])
                    );
                    setVesselDestPort(new LatLng(
                        choosen.destination && choosen.destination.coordinates[1],
                        choosen.destination && choosen.destination.coordinates[0])
                    );
                }
                if (portChoosen) {
                    const choosen = ports.data.find(it => it.port_name.includes(portChoosen.value.toString()));
                    const choosenIdx = ports.data.findIndex(it => it.port_name.includes(portChoosen.value.toString()));
                    setPortClickedIdx(choosenIdx);
                    setPortId(choosen.port_id);
                    setIsOverviewCardMounted(true);
                    setTimeout(() => setIsOverviewCardVisible(true), 100);
                }
            },
            mouseup: () => {
                if (!isDragging) {
                    if (isOverviewCardVisible) {
                        setIsOverviewCardVisible(false);
                        if (isPortView) {
                            setPortClickedIdx(-1);
                            setPortId("");
                            setIncomingVessels(null);
                            setPortChoosen(null);
                        } else {
                            setVesselClickedIdx(-1);
                            setVesselCode("");
                            setVesselSourcePort(null);
                            setVesselDestPort(null);
                            setVesselChoosen(null);
                        }
                    }
                } else {
                    setIsDragging(false);
                }
            },
            dragstart: () => { setIsDragging(true) },
            dragend: () => {
                // console.log(`bounds: ${map.getBounds().toBBoxString()}`)
                // console.log("bounds center: ", map.getBounds().getCenter())
                // console.log("bounds north: ", map.getBounds().getNorth())
                // console.log("bounds east: ", map.getBounds().getEast())
                // console.log("bounds west: ", map.getBounds().getWest())
                // console.log("bounds south: ", map.getBounds().getSouth())
            },
        });
        return null;
    }

    const handleHideOverviewCard = useCallback(() => {
        if (!isOverviewCardVisible) {
            setIsOverviewCardMounted(false);
        }
    }, [isOverviewCardVisible])

    const fetchPort = useCallback(() => {
        fetchPortBoundary.mutateAsync().then(it => {
            setPort(it);
            setPortOptions(it.data.map(each => ({
                key: `${each.port_id},${each.location.coordinates[1]},${each.location.coordinates[0]}`,
                value: each.port_name
            })))
        }).catch(error => {/* console.log("Error Retrieve Port Search Boundary API", error) */});
    }, [ports]);

    const fetchVessel = useCallback(() => {
        fetchVesselBoundary.mutateAsync().then(it => {
            setVessel(it);
            setVesselOptions(it.data.map(each => ({
                key: `${each.vessel_code},${each.location.coordinates[1]},${each.location.coordinates[0]}`,
                value: each.vessel_name
            })))
        }).catch(error => { /* console.log("Error Retrieve Vessel Search Boundary API", error) */});
    }, [vessels]);

    const fetchVesselDetailPerform = useCallback(() => {
        fetchVesselDetailPerformance
            .mutateAsync()
            .then(setVesselDetailPerformance)
            .catch(error => {
                // console.log("Error Retrieve Vessel Detail Performance API: ", error);
                setVesselDetailPerformance(null);
            });
    }, [vesselDetailPerformance]);

    const fetchPortDetailPerform = useCallback(() => {
        fetchPortDetailPerformance
            .mutateAsync()
            .then(setPortDetailPerformance)
            .catch(error => {
                // console.log("Error Retrieve Port Detail Performance API: ", error);
                setPortDetailPerformance(null);
            });
    }, [portDetailPerformance]);

    const fetchIncomingVessels = useCallback(() => {
        fetchPortIncomingVessels
            .mutateAsync()
            .then(setIncomingVessels)
            .catch(error => {
                // console.log("Error Retrieve Port Incoming Vessel API: ", error);
                setIncomingVessels(null);
            });
    }, [portIncomingVessels]);

    useEffect(() => {
        if (refMainEffect.current) return;
        if (currentTab === 0) {
            if (!vessels || vessels.data.length === 0) fetchVessel();
        } else {
            if (!ports || ports.data.length === 0) fetchPort();
            setPortView(true);
        }

        refMainEffect.current = true;
    }, [isPortView])

    useEffect(() => {
        if (vesselCode.length > 0) {
            fetchVesselDetailPerform();
        }
    }, [vesselCode]);

    useEffect(() => {
        if (portId.length > 0) {
            fetchPortDetailPerform();
            fetchIncomingVessels();
        }
    }, [portId]);

    // }, [data]);

    return (
        <>
            <MapContainer
                center={[-2.10600, 115.460]}
                zoom={5}
                scrollWheelZoom={true}
                ref={setMap}
                zoomControl={false}
                style={{
                    height: getOS().toLowerCase().startsWith("mac") ? (
                        window.devicePixelRatio >= 2.5 ? '76vh' : (window.devicePixelRatio > 2 ? '80vh' : (window.devicePixelRatio === 2 ? '81vh' : '100vh'))
                    ) : (
                        window.devicePixelRatio >= 1.5 ? '76vh' : (window.devicePixelRatio > 1 ? '80vh' : (window.devicePixelRatio === 1 ? '84vh' : '100vh'))
                    )
                }}
            >
                <TileLayer
                    attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                    url="https://api.maptiler.com/maps/dataviz/{z}/{x}/{y}.png?key=3ZLjthhymTeDF0bxkANb"
                />
                <MapComponent />
                <ZoomControl position="bottomright" zoomInText="+" zoomOutText="-" />
                {/* Vessel Area */}
                {vessels && vesselClickedIdx === -1 && vessels.data.map((it, index) => (
                    <Marker
                        key={it.vessel_code}
                        position={new LatLng(it.location.coordinates[1], it.location.coordinates[0])}
                        icon={vesselHoveredIdx === index ? (it.avg_performance.score > 85 && VesselIconGreenHovered || (it.avg_performance.score > 74 && it.avg_performance.score <= 85) && VesselIconOrangeHovered || VesselIconRedHovered)
                            : (it.avg_performance.score > 85 ? VesselIconGreen
                                : (it.avg_performance.score > 74 && it.avg_performance.score <= 85 ? VesselIconOrange : VesselIconRed))
                        }
                        riseOnHover={true}
                        eventHandlers={{
                            click: () => {
                                if (!isPortView) {
                                    if (isOverviewCardMounted && isOverviewCardVisible) {
                                        // setIsOverviewCardVisible(false);
                                    } else {
                                        setIsOverviewCardMounted(true);
                                        setTimeout(() => setIsOverviewCardVisible(true), 0);
                                    }
                                    if (map.getZoom() === 5) map.flyTo(new LatLng(it.location.coordinates[1], it.location.coordinates[0]), 6, { animate: true });
                                    setVesselHoveredIdx(-1);
                                    setVesselClickedIdx(index);
                                    setVesselChoosen(null);
                                    setVesselCode(it.vessel_code);
                                    if (it.source_location) setVesselSourcePort(new LatLng(it.source_location.coordinates[1], it.source_location.coordinates[0]));
                                    if (it.destination) setVesselDestPort(new LatLng(it.destination.coordinates[1], it.destination.coordinates[0]));
                                }
                            },
                            mouseover: () => { vesselClickedIdx === -1 && !vesselChoosen && setVesselHoveredIdx(index) },
                            mouseout: () => setVesselHoveredIdx(-1),
                        }}
                        // @ts-expect-error this because we use external class on leaflet-rotatedmarker that doesn't listed here in react-leaflet Marker class itself
                        rotationAngle={it.course}>
                    </Marker>
                ))}
                {vessels && vesselClickedIdx > -1 && vessels.data.map((it, index) => (
                    index === vesselClickedIdx &&
                    <Marker
                        key={it.vessel_code}
                        position={new LatLng(it.location.coordinates[1], it.location.coordinates[0])}
                        icon={(it.avg_performance.score > 85 ? VesselIconGreenClicked : (it.avg_performance.score > 74 && it.avg_performance.score <= 85 ? VesselIconOrangeClicked : VesselIconRedClicked))}
                        riseOnHover={true}
                        // @ts-expect-error this because we use external class on leaflet-rotatedmarker that doesn't listed here in react-leaflet Marker class itself
                        rotationAngle={it.course}>
                    </Marker>
                ))}
                {vesselSourcePort && (
                    <Marker
                        position={vesselSourcePort}
                        icon={PortIconOngoing}
                    />
                )}
                {vesselDestPort && (
                    <Marker
                        position={vesselDestPort}
                        icon={PortIconOngoing}
                    />
                )}
                {portIncomingVessels && portIncomingVessels.data && portIncomingVessels.data.map(it =>
                    it.location && (
                        <Marker
                            key={it.vessel_code}
                            position={new LatLng(it.location.coordinates[1], it.location.coordinates[0])}
                            icon={VesselIncomingIcon}
                            // @ts-expect-error this because we use external class on leaflet-rotatedmarker that doesn't listed here in react-leaflet Marker class itself
                            rotationAngle={it.course}
                        />
                    )
                )}
                {/* End Vessel Area */}

                {/* Port Area */}
                {ports && portClickedIdx === -1 && ports.data.map((it, index) => (
                    <Marker
                        key={it.port_id}
                        position={new LatLng(it.location.coordinates[1], it.location.coordinates[0])}
                        icon={PortIcon}
                        riseOnHover={true}
                        eventHandlers={{
                            click: () => {
                                if (isPortView) {
                                    if (isOverviewCardMounted && isOverviewCardVisible) {
                                        // setIsOverviewCardVisible(false);
                                    } else {
                                        setIsOverviewCardMounted(true);
                                        setTimeout(() => setIsOverviewCardVisible(true), 0);
                                    }
                                    if (map.getZoom() === 5) map.flyTo(new LatLng(it.location.coordinates[1], it.location.coordinates[0]), 7, { animate: true });
                                    setPortClickedIdx(index);
                                    setPortChoosen(null);
                                    setPortId(it.port_id);
                                }
                            },
                        }}
                    />
                ))}
                {ports && portClickedIdx > -1 && ports.data.map((it, index) => (
                    index === portClickedIdx &&
                    <Marker
                        key={it.port_id}
                        position={new LatLng(it.location.coordinates[1], it.location.coordinates[0])}
                        icon={PortIconClicked}
                        riseOnHover={true}
                    />
                ))}
                {/* End Bunker Area */}
                {/* <Polyline pathOptions={{ color: 'red' }} positions={lineJktBdg} /> */}
            </MapContainer>
            <div className="absolute right-12 mt-5 z-50">
                <DropdownSelect
                    name={isPortView ? "search-port" : "search-vessel"}
                    type={SelectType.SINGLE}
                    placeholder={isPortView ? 'Search Port' : 'Search Vessel'}
                    isClearable={false}
                    value={isPortView ? portChoosen : vesselChoosen}
                    options={isPortView ? portOptions : vesselOptions}
                    onChange={(value) => {
                        if (isPortView) {
                            setPortChoosen(value);
                        } else {
                            setVesselChoosen(value);
                        }
                        if (value) map.flyTo(new LatLng(Number(value.key.toString().split(',')[1]), Number(value.key.toString().split(',')[2])), 6, { animate: true });
                    }}
                    onFocus={() => {
                        if (isOverviewCardVisible) setIsOverviewCardVisible(false);
                        if (isPortView) {
                            setPortClickedIdx(-1);
                            setPortChoosen(null);
                        } else {
                            setVesselClickedIdx(-1);
                            setVesselChoosen(null);
                            setVesselSourcePort(null);
                            setVesselDestPort(null);
                        }
                    }}
                />
            </div>
            <div className="absolute">
                {isOverviewCardMounted && (
                    <OverviewCard
                        isVisible={isOverviewCardVisible}
                        afterTransition={handleHideOverviewCard}
                        source={isPortView ? portDetailPerformance : vesselDetailPerformance}
                        type={isPortView ? OverviewType.PORT_OVERVIEW : OverviewType.VESSEL_OVERVIEW}
                        onClose={() => {
                            setIsOverviewCardVisible(false);
                            if (isPortView) {
                                setPortClickedIdx(-1);
                                setPortId("");
                                setIncomingVessels(null);
                                setPortChoosen(null);
                            } else {
                                setVesselCode("");
                                setVesselClickedIdx(-1);
                                setVesselSourcePort(null);
                                setVesselDestPort(null);
                                setVesselChoosen(null);
                            }
                            // if (map) map.zoomOut(2, { animate: true });
                        }}
                    />
                )}
            </div>
        </>
    );
}

export default MainMap;