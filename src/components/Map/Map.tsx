import { useRef, useState, useEffect } from 'react';
import { GeocodingControl } from "@maptiler/geocoding-control/react";
import maplibregl from 'maplibre-gl';
import { createMapLibreGlMapController } from "@maptiler/geocoding-control/maplibregl-controller";
import "@maptiler/geocoding-control/style.css";
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';
import * as turf from "@turf/turf";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from '../ui/button';
import { TransactionButton } from "thirdweb/react";
import { createThirdwebClient, getContract, prepareContractCall } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import MintLandABI from '@/utils/mintLand';


const MapComponent = () => {
    const [API_KEY] = useState('XhmiunjhJU7iuFvSBpDZ');
    const [mapController, setMapController] = useState<ReturnType<typeof createMapLibreGlMapController> | undefined>(undefined);
    const mapContainer = useRef(null);
    const india = { lng: 77.5946, lat: 12.9716 };
    const zoom = 5;
    maptilersdk.config.apiKey = 'XhmiunjhJU7iuFvSBpDZ';

    const [coordinates, setCoordinates] = useState<{ lng: number; lat: number }[]>([]);
    const [message, setMessage] = useState("");
    const [selectedArea, setSelectedArea] = useState<number>(0);
    const [midPoint, setMidPoint] = useState<{ lng: number; lat: number } | null>(
        null
    );
    const map = useRef<maplibregl.Map | null>(null);
    const [zoning, setZoning] = useState("Residential");
    const [valuation, setValuation] = useState(100000);
    const [additionalInfo, setAdditionalInfo] = useState("Buying this place for fun");
    const [isMinted,setIsMinted] = useState(false)

    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once

        if (mapContainer.current) {
            map.current = new maplibregl.Map({
                container: mapContainer.current,
                style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
                center: [india.lng, india.lat],
                zoom: zoom,
            });
        }

        map.current?.addControl(new maplibregl.NavigationControl(), 'top-right');

        if (map.current) {
            const controller = createMapLibreGlMapController(map.current, maplibregl);
            setMapController(controller);
        }

        map.current!.on("click", (event) => {
            setCoordinates((prevCoordinates) => {
                if (prevCoordinates.length <= 5) {
                    const { lng, lat } = event.lngLat;

                    // Add a marker
                    new maplibregl.Marker({ color: "#FF0000" })
                        .setLngLat([lng, lat])
                        .addTo(map.current!);

                    // Return the new state array with the added coordinate
                    console.log("Current Length:", prevCoordinates.length);  // Log the updated length
                    return [...prevCoordinates, { lng, lat }];
                } else {
                    return prevCoordinates;  // Return the same state without modification
                }
            });
        });

        // const markerManager = new MarkerLayout(map, {
        //     layers: ["Capital city labels", "City labels", "Place labels", "Town labels"],
        //     markerSize: [140, 80],
        //     markerAnchor: "top",
        //     offset: [0, -8], // so that the tip of the marker bottom pin lands on the city dot
        //     sortingProperty: "rank",

        //     filter: ((feature) => {
        //       return ["city", "village", "town"].includes(feature.properties.class)
        //     })
        //   });

        // new maptilersdk.Marker({color: "#FF0000"})
        // .setLngLat([139.7525,35.6846])
        // .addTo(map.current);

        // return () => map.current?.remove();

    }, [API_KEY, india.lng, india.lat, zoom]);

    //Handles the creation of polygon layers
    // useEffect(() => {
    //     if (isMinted && midPoint) {
    //         // Initialize the MapTiler map
    //         const map = new maplibregl.Map({
    //             container: 'map', // The ID of the container element
    //             style: `https://api.maptiler.com/maps/streets/style.json?key=${API_KEY}`,
    //             center: [midPoint.lng, midPoint.lat], // Coordinates for the center
    //             zoom: 10,
    //         });

    //         // Add a marker at the midpoint coordinates
    //         const marker = new maplibregl.Marker()
    //             .setLngLat([midPoint.lng, midPoint.lat])
    //             .setPopup(new maplibregl.Popup().setText('Transaction Location'))
    //             .addTo(map);

    //         // Optionally, you can customize the marker with your layout
    //         marker.getElement().style.width = '50px'; // Example: Adjust marker size
    //         marker.getElement().style.height = '50px';
    //     }
    // }, [isMinted, midPoint]);

    useEffect(() => {
        if (coordinates.length === 6) {
            // Ensure the polygon is closed by adding the first coordinate to the end
            const closedCoordinates = [...coordinates, coordinates[0]];
            console.log(closedCoordinates)

            // Create a polygon from the coordinates
            const polygon = turf.polygon([
                closedCoordinates.map((coord) => [coord.lng, coord.lat]),
            ]);

            const area = (turf.area(polygon));
            setSelectedArea(parseFloat(area.toFixed(3)));


            if (area > 20000) {
                setMessage("The selected area exceeds 2000 square meters. Please adjust your markers.");
                return;
            }

            const center = turf.center(polygon);
            const { geometry } = center;

            setMidPoint({
                lng: geometry.coordinates[0],
                lat: geometry.coordinates[1],
            });

            // Add a polygon layer to visualize the area
            if (map.current!.getSource("selected-area")) {
                (map.current!.getSource("selected-area") as maplibregl.GeoJSONSource).setData({
                    type: "FeatureCollection",
                    features: [polygon],
                });
            } else {
                map.current!.addSource("selected-area", {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: [polygon],
                    },
                });

                map.current!.addLayer({
                    id: "selected-area-layer",
                    type: "fill",
                    source: "selected-area",
                    paint: {
                        "fill-color": "#00FF00",
                        "fill-opacity": 0.5,
                    },
                });
            }

        }
    }, [coordinates]);

    const resetMarkers = () => {
        setCoordinates([]);
        setMessage("");
        setZoning("");
        setValuation(10000);
        setAdditionalInfo("Buying this place for fun")
        map.current?.remove();
        window.location.reload();
    };
    const client = createThirdwebClient({
        clientId: "cd71db82c3d6bdfb840ddb6fe7adf689",
    });

    const contract = getContract({
        client,
        chain: defineChain(84532),
        address: "0xb2a671c4FE3D9269C84644Eb789B63958f917EC3",
        abi: MintLandABI as any,
    });





    return (
        <div className="map-wrap">
            <div className="geocoding">
                <div>
                    <GeocodingControl apiKey={API_KEY} mapController={mapController} />
                </div>
                <div className="reset">
                    <Button variant="destructive" style={{ marginRight: "85px" }} onClick={resetMarkers}>
                        Reset Markers
                    </Button>
                </div>
            </div>
            {message && <div className="mb-3 rounded bg-red-50 border-s-4 border-red-500 p-2 dark:bg-red-800/30" role="alert" aria-labelledby="hs-bordered-red-style-label">
                <div className="flex items-center">
                    <div className="shrink-0">
                        <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-red-100 bg-red-200 text-red-800 dark:border-red-900 dark:bg-red-800 dark:text-red-400">
                            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6 6 18"></path>
                                <path d="m6 6 12 12"></path>
                            </svg>
                        </span>
                    </div>
                    <div className="ms-3">
                        <p className="text-sm text-gray-700 dark:text-neutral-400">
                            {message}
                        </p>
                    </div>
                </div>
            </div>}
            <div ref={mapContainer} className="map" />
            {selectedArea != 0 &&
                <div className='info_container'>
                    <div className="info">
                        <Alert>
                            <AlertTitle>Selected area (in square metres) : {selectedArea}</AlertTitle>
                            <AlertDescription>
                                Midpoint coordinates : {midPoint?.lat}, {midPoint?.lng}
                            </AlertDescription>
                        </Alert>
                    </div>
                    <div className="mint">
                        {!isMinted ? <TransactionButton
                            transaction={() => {
                                const tx = prepareContractCall({
                                    contract,
                                    method: "function mintLand(address to, string memory tokenURI, uint256 area, string memory coordinates, string memory zoning, uint256 valuation, string memory additionalInfo)",
                                    params: ["0x02005126FfcB4e008cf83B07609825F46e757789", "otkenuri",BigInt(Math.floor(selectedArea)),  midPoint ? midPoint.toString() : "", zoning, BigInt(valuation), additionalInfo],
                                });
                                return tx;
                            }}
                            onTransactionSent={(result) => {
                                console.log("Transaction submitted", result.transactionHash);
                            }}
                            onTransactionConfirmed={(receipt) => {
                                console.log("Transaction confirmed", receipt.transactionHash);
                                setIsMinted(true)
                            }}
                            onError={(error) => {
                                console.error("Transaction error", error);
                            }}
                        >
                            Mint Plot
                        </TransactionButton>: <Button className='bg-green-400'  variant="secondary">Minted!</Button>}
                    </div>
                </div>}

        </div>
    );
}

export default MapComponent;





