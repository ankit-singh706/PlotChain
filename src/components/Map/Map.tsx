import React, { useRef, useState, useEffect } from 'react';
import { MarkerLayout } from "@maptiler/marker-layout";
import { GeocodingControl } from "@maptiler/geocoding-control/react";
import maplibregl from 'maplibre-gl';
import { createMapLibreGlMapController } from "@maptiler/geocoding-control/maplibregl-controller";
import "@maptiler/geocoding-control/style.css";
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';
import * as turf from "@turf/turf";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from 'lucide-react';
import { Button } from '../ui/button';

const MapComponent = () => {
    const [API_KEY] = useState('XhmiunjhJU7iuFvSBpDZ');
    const [mapController, setMapController] = useState();
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

    const showAlert = () => {
        <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
                You can add components and dependencies to your app using the cli.
            </AlertDescription>
        </Alert>
    }


    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
            center: [india.lng, india.lat],
            zoom: zoom
        });

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
        setMapController(createMapLibreGlMapController(map.current, maplibregl));

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

    console.log(coordinates)

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
        map.current?.remove();
        window.location.reload();
    };


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
                    <Button>Mint Plot</Button>
                </div>
            </div>}

        </div>
    );
}

export default MapComponent;





