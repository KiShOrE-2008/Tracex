import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { TowerPing } from '../types/forensic';

interface MapViewProps {
  pings: TowerPing[];
}

export const MapView: React.FC<MapViewProps> = ({ pings }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedPingId, setSelectedPingId] = useState<string>('TP-1');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double init

    const map = L.map(mapContainerRef.current, {
      center: [30.7230, 76.7580],
      zoom: 12,
      zoomControl: false
    });

    // Dark Tile Layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers & Paths
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // Draw suspect movement polyline
    const pathCoords = pings.map(p => [p.lat, p.lng] as [number, number]);
    if (pathCoords.length > 1) {
      L.polyline(pathCoords, {
        color: '#6dedff',
        weight: 3,
        dashArray: '6, 8',
        opacity: 0.7
      }).addTo(map);
    }

    // Add Markers
    pings.forEach((ping, idx) => {
      const isSelected = ping.id === selectedPingId;
      const isCoLocation = ping.cellId.includes('4301');

      // Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `
          <div style="
            background: ${isSelected ? '#28d2e6' : isCoLocation ? '#ffb4ab' : '#1b1f2c'};
            border: 2px solid ${isCoLocation ? '#ffb4ab' : '#6dedff'};
            width: ${isSelected ? '32px' : '26px'};
            height: ${isSelected ? '32px' : '26px'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 12px ${isCoLocation ? 'rgba(255,180,171,0.6)' : 'rgba(40,210,230,0.4)'};
            color: ${isSelected ? '#00363d' : '#dfe2f4'};
            font-size: 14px;
            font-weight: bold;
          ">
            ${idx + 1}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([ping.lat, ping.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="background: #1b1f2c; color: #dfe2f4; padding: 8px; font-family: Inter; border-radius: 4px;">
          <strong style="color: #6dedff;">${ping.towerName}</strong><br/>
          <span style="font-size: 11px; color: #859396;">${ping.suspectName}</span><br/>
          <span style="font-size: 11px;">Time: ${ping.timestamp}</span>
        </div>
      `);

      marker.on('click', () => {
        setSelectedPingId(ping.id);
      });

      // Add Range Circle for Co-location
      if (isCoLocation) {
        L.circle([ping.lat, ping.lng], {
          radius: 350,
          color: '#ffb4ab',
          fillColor: '#93000a',
          fillOpacity: 0.15,
          weight: 1.5
        }).addTo(map);
      }
    });

    // Fly map to active selected ping
    const activePing = pings.find(p => p.id === selectedPingId);
    if (activePing) {
      map.flyTo([activePing.lat, activePing.lng], 13, { duration: 1 });
    }
  }, [pings, selectedPingId]);

  // Timeline Playback Animation Loop
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setSelectedPingId((currentId) => {
          const currentIdx = pings.findIndex(p => p.id === currentId);
          const nextIdx = (currentIdx + 1) % pings.length;
          return pings[nextIdx].id;
        });
      }, 2200);
    }
    return () => clearInterval(timer);
  }, [isPlaying, pings]);

  const selectedPing = pings.find(p => p.id === selectedPingId);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden space-y-3">
      {/* Top Header Bar */}
      <div className="glass-panel p-3 rounded-lg flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-[#28d2e6]/20 text-[#6dedff]">
            <span className="material-symbols-outlined text-[20px]">location_on</span>
          </div>
          <div>
            <h3 className="font-title-lg text-title-lg text-[#dfe2f4]">Cell Tower Geo-Resolution & Co-Location</h3>
            <p className="font-code-sm text-[11px] text-[#859396]">Tracking sector azimuth coverage across Chandigarh, Mohali, Panchkula</p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-3 bg-[#1b1f2c] px-3 py-1.5 rounded border border-[#3c494b]/40">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1 rounded bg-[#6dedff] text-[#00363d] font-label-caps text-[11px] font-bold flex items-center gap-1 hover:brightness-110 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
            {isPlaying ? 'Pause Track' : 'Play Timeline'}
          </button>
          <span className="font-code-sm text-[11px] text-[#859396]">
            Ping {pings.findIndex(p => p.id === selectedPingId) + 1} / {pings.length}
          </span>
        </div>
      </div>

      {/* Map + Detail Panel Layout */}
      <div className="flex-1 flex gap-3 overflow-hidden min-h-[450px]">
        {/* Leaflet Container */}
        <div className="flex-1 bg-[#0f131f] border border-[#3c494b]/20 rounded-lg overflow-hidden relative">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>

        {/* Selected Ping Info Panel */}
        <div className="w-80 bg-[#1b1f2c] border border-[#3c494b]/30 rounded-lg flex flex-col overflow-hidden shrink-0 p-4 space-y-4">
          <h4 className="font-label-caps text-label-caps text-[#859396] border-b border-[#3c494b]/30 pb-2">
            CELL SITE PING DETAILS
          </h4>

          {selectedPing ? (
            <div className="space-y-3 font-body-sm">
              <div className="p-3 rounded bg-[#171b28] border border-[#6dedff]/30">
                <span className="font-label-caps text-[10px] text-[#6dedff]">TOWER LOCATION</span>
                <h4 className="font-headline-sm text-[16px] text-[#dfe2f4] mt-0.5">{selectedPing.towerName}</h4>
                <span className="font-code-sm text-[11px] text-[#859396]">{selectedPing.cellId}</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between border-b border-[#3c494b]/20 pb-1">
                  <span className="text-[#859396]">Target Suspect:</span>
                  <span className="text-[#dfe2f4] font-medium truncate max-w-[150px]">{selectedPing.suspectName}</span>
                </div>
                <div className="flex justify-between border-b border-[#3c494b]/20 pb-1">
                  <span className="text-[#859396]">Timestamp:</span>
                  <span className="text-[#6dedff] font-code-sm text-[11px]">{selectedPing.timestamp}</span>
                </div>
                <div className="flex justify-between border-b border-[#3c494b]/20 pb-1">
                  <span className="text-[#859396]">Call Duration:</span>
                  <span className="text-[#dfe2f4]">{selectedPing.durationSec} seconds</span>
                </div>
                <div className="flex justify-between border-b border-[#3c494b]/20 pb-1">
                  <span className="text-[#859396]">Coordinates:</span>
                  <span className="text-[#dfe2f4] font-code-sm text-[11px]">{selectedPing.lat.toFixed(4)}, {selectedPing.lng.toFixed(4)}</span>
                </div>
                {selectedPing.signalStrength && (
                  <div className="flex justify-between border-b border-[#3c494b]/20 pb-1">
                    <span className="text-[#859396]">Signal Strength:</span>
                    <span className="text-[#e7d3ff]">{selectedPing.signalStrength}</span>
                  </div>
                )}
              </div>

              {/* Co-location Highlight Card */}
              {selectedPing.cellId.includes('4301') && (
                <div className="p-3 rounded bg-[#93000a]/20 border border-[#93000a]/50 text-[#ffb4ab] space-y-1">
                  <div className="flex items-center gap-1.5 font-label-caps text-[10px] font-bold">
                    <span className="material-symbols-outlined text-[16px]">warning</span>
                    CO-LOCATION LOCK DETECTED
                  </div>
                  <p className="font-body-sm text-[11px] text-[#bbc9cc]">
                    Vikram Sharma & Rajesh Verma hit adjacent cell sectors (CHD-4301-A & B) simultaneously at 02:14 AM.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-[#859396] font-body-sm py-8">
              Select a marker on the map to inspect cell site forensic data.
            </div>
          )}

          {/* List of pings */}
          <div className="mt-auto">
            <h5 className="font-label-caps text-[10px] text-[#859396] mb-2">Chronological Pings List</h5>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              {pings.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPingId(p.id)}
                  className={`w-full p-2 rounded text-left font-code-sm text-[11px] flex justify-between transition-colors ${
                    p.id === selectedPingId ? 'bg-[#6dedff]/10 text-[#6dedff] border border-[#6dedff]/30' : 'bg-[#171b28] text-[#859396] hover:bg-[#303442]'
                  }`}
                >
                  <span className="truncate max-w-[160px]">{p.towerName}</span>
                  <span>{p.timestamp.split(' ')[1]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
