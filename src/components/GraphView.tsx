import type React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import type { GraphNode, GraphEdge, NodeType } from '../types/forensic';

interface GraphViewProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onSelectEntityDna?: (suspectName: string) => void;
}

// Predefined relative positions for known mock nodes to create a clean, non-colliding layout
const PREDEFINED_POSITIONS: Record<string, { xRatio: number; yRatio: number }> = {
  'N-SUS1': { xRatio: 0.22, yRatio: 0.18 }, // Vikram "Shadow" Sharma (Top Left)
  'N-SUS2': { xRatio: 0.54, yRatio: 0.18 }, // Rajesh Verma (Top Center)
  'N-SUS3': { xRatio: 0.84, yRatio: 0.18 }, // Ananya Gupta (Top Right)
  'N-TEL1': { xRatio: 0.32, yRatio: 0.46 }, // Target A Phone (Mid-Left)
  'N-TEL2': { xRatio: 0.54, yRatio: 0.46 }, // Jio Burner SIM (Mid-Center)
  'N-BNK1': { xRatio: 0.84, yRatio: 0.46 }, // HDFC Bank (Mid-Right)
  'N-UPI2': { xRatio: 0.12, yRatio: 0.74 }, // Personal Paytm VPA (Bottom Left)
  'N-TOW1': { xRatio: 0.38, yRatio: 0.78 }, // Cell Tower ISBT (Bottom Mid-Left)
  'N-IP1':  { xRatio: 0.64, yRatio: 0.78 }, // ProtonVPN IP (Bottom Mid-Right)
  'N-UPI1': { xRatio: 0.84, yRatio: 0.74 }  // Collection VPA (Bottom Right)
};

export const GraphView: React.FC<GraphViewProps> = ({ nodes, edges, onSelectEntityDna }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('N-SUS1');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [minRisk, setMinRisk] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Filter nodes
  const filteredNodes = nodes.filter(n => {
    if (filterType !== 'ALL' && n.type !== filterType) return false;
    if (n.riskScore < minRisk) return false;
    if (searchQuery && !n.label.toLowerCase().includes(searchQuery.toLowerCase()) && !n.subtext?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  // Calculate connected edges and nodes for selected entity
  const selectedEdges = edges.filter(e => e.source === selectedNodeId || e.target === selectedNodeId);

  // Canvas Node layout positions (Structured Tier / Preset Ratios)
  const getNodePos = useCallback((node: GraphNode, index: number, total: number, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;

    if (PREDEFINED_POSITIONS[node.id]) {
      const preset = PREDEFINED_POSITIONS[node.id];
      // Apply zoom centering
      const px = width * preset.xRatio;
      const py = height * preset.yRatio;
      return {
        x: centerX + (px - centerX) * zoomLevel,
        y: centerY + (py - centerY) * zoomLevel
      };
    }

    // Dynamic Ring Fallback for new unmapped nodes
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const radiusX = Math.min(width, height) * 0.36 * zoomLevel;
    const radiusY = Math.min(width, height) * 0.32 * zoomLevel;
    return {
      x: centerX + radiusX * Math.cos(angle),
      y: centerY + radiusY * Math.sin(angle)
    };
  }, [zoomLevel]);

  // Render network graph on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high DPI canvas resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;

    // Clear background
    ctx.fillStyle = '#090c15';
    ctx.fillRect(0, 0, width, height);

    // Draw background grid dots
    ctx.fillStyle = '#1e2436';
    for (let x = 20; x < width; x += 30) {
      for (let y = 20; y < height; y += 30) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Build position map for nodes
    const posMap: Record<string, { x: number; y: number }> = {};
    filteredNodes.forEach((node, idx) => {
      posMap[node.id] = getNodePos(node, idx, filteredNodes.length, width, height);
    });

    // 1. Draw Edges
    edges.forEach((edge) => {
      const p1 = posMap[edge.source];
      const p2 = posMap[edge.target];
      if (!p1 || !p2) return;

      const isConnectedToSelected = selectedNodeId && (edge.source === selectedNodeId || edge.target === selectedNodeId);
      const isDimmed = selectedNodeId && !isConnectedToSelected;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineWidth = isConnectedToSelected ? 2.5 : 1.2;
      
      if (isConnectedToSelected) {
        ctx.strokeStyle = '#6dedff';
        ctx.shadowColor = 'rgba(109, 237, 255, 0.4)';
        ctx.shadowBlur = 8;
      } else if (isDimmed) {
        ctx.strokeStyle = 'rgba(60, 73, 75, 0.15)';
      } else {
        ctx.strokeStyle = 'rgba(133, 147, 150, 0.3)';
      }

      if (edge.type === 'transfer') {
        ctx.setLineDash([6, 4]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.restore();

      // Draw Edge Label Pill Badge
      if (isConnectedToSelected || (!selectedNodeId && edges.length < 15)) {
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        ctx.font = '10px "JetBrains Mono", monospace';
        const labelText = edge.label;
        const textMetrics = ctx.measureText(labelText);
        const paddingX = 8;
        const badgeWidth = textMetrics.width + paddingX * 2;
        const badgeHeight = 18;
        const rx = midX - badgeWidth / 2;
        const ry = midY - badgeHeight / 2;

        // Badge Background Pill
        ctx.fillStyle = '#0e1220';
        ctx.strokeStyle = isConnectedToSelected ? 'rgba(109, 237, 255, 0.6)' : 'rgba(60, 73, 75, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(rx, ry, badgeWidth, badgeHeight, 9);
        ctx.fill();
        ctx.stroke();

        // Badge Text
        ctx.fillStyle = isConnectedToSelected ? '#6dedff' : '#a0acb0';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labelText, midX, midY + 0.5);
      }
    });

    // 2. Draw Nodes
    filteredNodes.forEach((node) => {
      const pos = posMap[node.id];
      if (!pos) return;

      const isSelected = node.id === selectedNodeId;
      const isConnected = selectedNodeId && edges.some(e => 
        (e.source === selectedNodeId && e.target === node.id) || 
        (e.target === selectedNodeId && e.source === node.id)
      );

      const colorMap: Record<NodeType, string> = {
        suspect: '#ffb4ab',
        phone: '#6dedff',
        bank_account: '#e7d3ff',
        upi: '#b4c5ff',
        tower: '#36d9ed',
        ip_address: '#f59e0b'
      };
      const nodeColor = colorMap[node.type] || '#859396';

      // Node Outer Glow
      if (isSelected || node.riskScore > 85) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 24, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? 'rgba(109, 237, 255, 0.25)' : 'rgba(255, 180, 171, 0.15)';
        ctx.fill();
      }

      // Node Circle Body
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 18, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? '#28d2e6' : isConnected ? '#181d2f' : '#111523';
      ctx.fill();
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
      ctx.strokeStyle = isSelected ? '#6dedff' : nodeColor;
      ctx.stroke();

      // Node Icon Symbol Inside Circle
      const iconSymbolMap: Record<NodeType, string> = {
        suspect: '👤',
        phone: '📱',
        bank_account: '🏦',
        upi: '💳',
        tower: '📡',
        ip_address: '🌐'
      };
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(iconSymbolMap[node.type] || '•', pos.x, pos.y);

      // Node Label Card Backdrop (Prevents line/text overlap)
      ctx.font = isSelected ? 'bold 11px Inter, sans-serif' : '11px Inter, sans-serif';
      const labelWidth = ctx.measureText(node.label).width;
      ctx.font = '9px "JetBrains Mono", monospace';
      const subtextWidth = node.subtext ? ctx.measureText(node.subtext).width : 0;
      const cardWidth = Math.max(labelWidth, subtextWidth) + 14;
      const cardHeight = node.subtext ? 30 : 18;
      const cardX = pos.x - cardWidth / 2;
      const cardY = pos.y + 24;

      // Card Background
      ctx.fillStyle = isSelected ? 'rgba(24, 29, 47, 0.95)' : 'rgba(15, 19, 34, 0.9)';
      ctx.strokeStyle = isSelected ? 'rgba(109, 237, 255, 0.6)' : isConnected ? 'rgba(109, 237, 255, 0.3)' : 'rgba(60, 73, 75, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 6);
      ctx.fill();
      ctx.stroke();

      // Main Label Text
      ctx.font = isSelected ? 'bold 11px Inter, sans-serif' : '11px Inter, sans-serif';
      ctx.fillStyle = isSelected ? '#6dedff' : isConnected ? '#dfe2f4' : '#c3cbce';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(node.label, pos.x, cardY + 3);

      // Subtext Inside Card
      if (node.subtext) {
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = isSelected ? '#95f1ff' : '#859396';
        ctx.fillText(node.subtext, pos.x, cardY + 16);
      }
    });
  }, [filteredNodes, edges, selectedNodeId, zoomLevel, getNodePos]);

  // Canvas Click Handler
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;

    // Check hit test (both circle and label card area)
    for (let idx = 0; idx < filteredNodes.length; idx++) {
      const node = filteredNodes[idx];
      const pos = getNodePos(node, idx, filteredNodes.length, width, height);
      const dist = Math.hypot(x - pos.x, y - pos.y);
      if (dist <= 24 || (Math.abs(x - pos.x) <= 60 && y >= pos.y + 20 && y <= pos.y + 60)) {
        setSelectedNodeId(node.id);
        return;
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden space-y-3">
      {/* Top Toolbar */}
      <div className="glass-panel p-3 rounded-lg flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Node Type Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="font-label-caps text-label-caps text-[#859396] mr-1">Filter:</span>
          {[
            { id: 'ALL', label: 'All Entities' },
            { id: 'suspect', label: 'Suspects' },
            { id: 'phone', label: 'Phone Numbers' },
            { id: 'bank_account', label: 'Bank Accounts' },
            { id: 'upi', label: 'UPI VPAs' },
            { id: 'tower', label: 'Cell Towers' },
            { id: 'ip_address', label: 'IP Nodes' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-2.5 py-1 rounded font-label-caps text-[10px] transition-colors cursor-pointer whitespace-nowrap ${
                filterType === f.id
                  ? 'bg-[#6dedff] text-[#00363d] font-bold'
                  : 'bg-[#303442] text-[#859396] hover:text-[#dfe2f4]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Risk Filter */}
          <div className="flex items-center gap-2">
            <span className="font-label-caps text-[10px] text-[#859396]">Min Risk: {minRisk}</span>
            <input 
              type="range" 
              min="0" 
              max="90" 
              value={minRisk} 
              onChange={(e) => setMinRisk(Number(e.target.value))}
              className="w-20 accent-[#6dedff] cursor-pointer"
            />
          </div>

          {/* Search */}
          <input 
            type="text" 
            placeholder="Search node..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#1b1f2c] border border-[#3c494b]/40 text-[#dfe2f4] text-[12px] px-2.5 py-1 rounded w-32 focus:outline-none focus:border-[#6dedff]"
          />

          {/* Zoom Buttons */}
          <div className="flex items-center border border-[#3c494b]/40 rounded bg-[#1b1f2c] overflow-hidden">
            <button 
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.6))}
              className="p-1 text-[#859396] hover:text-[#6dedff] hover:bg-[#303442]"
              title="Zoom In"
            >
              <span className="material-symbols-outlined text-[16px]">zoom_in</span>
            </button>
            <button 
              onClick={() => setZoomLevel(1)}
              className="px-2 font-code-sm text-[11px] text-[#859396] hover:text-[#dfe2f4]"
              title="Reset Zoom"
            >
              100%
            </button>
            <button 
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.6))}
              className="p-1 text-[#859396] hover:text-[#6dedff] hover:bg-[#303442]"
              title="Zoom Out"
            >
              <span className="material-symbols-outlined text-[16px]">zoom_out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas & Details Drawer Split View */}
      <div className="flex-1 flex gap-3 overflow-hidden min-h-[450px]">
        {/* Network Canvas */}
        <div className="flex-1 bg-[#0f131f] border border-[#3c494b]/20 rounded-lg relative overflow-hidden flex">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full h-full cursor-pointer"
          />

          {/* Graph Legend Overlay (Top Left Horizontal Bar) */}
          <div className="absolute top-3 left-3 bg-[#0e1220]/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-[#3c494b]/40 flex items-center gap-3 text-[10px] font-label-caps shadow-md z-10">
            <span className="text-[#859396] font-bold tracking-wider">NODE LEGEND:</span>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ffb4ab]"></span> Suspect</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#6dedff]"></span> Phone Number</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#e7d3ff]"></span> Bank Account</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#b4c5ff]"></span> UPI VPA</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#36d9ed]"></span> Cell Tower</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span> IP Node</div>
          </div>
        </div>

        {/* Selected Entity Side Details Panel */}
        <div className="w-80 bg-[#1b1f2c] border border-[#3c494b]/30 rounded-lg flex flex-col overflow-hidden shrink-0">
          {selectedNode ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Header */}
              <div className="flex items-start gap-3 pb-3 border-b border-[#3c494b]/30">
                {selectedNode.details?.avatar ? (
                  <img src={selectedNode.details.avatar} alt="Node" className="w-12 h-12 rounded object-cover border border-[#6dedff]/40 shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded bg-[#28d2e6]/20 border border-[#28d2e6]/40 flex items-center justify-center text-[#6dedff] shrink-0">
                    <span className="material-symbols-outlined text-[24px]">hub</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className="px-2 py-0.5 rounded bg-[#93000a]/20 text-[#ffb4ab] font-code-sm text-[10px] font-bold border border-[#93000a]/40">
                    RISK SCORE: {selectedNode.riskScore}/100
                  </span>
                  <h4 className="font-headline-sm text-headline-sm text-[#dfe2f4] truncate mt-1">{selectedNode.label}</h4>
                  <p className="font-code-sm text-[11px] text-[#859396]">{selectedNode.subtext}</p>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-2 text-body-sm font-body-sm">
                {selectedNode.details?.owner && (
                  <div className="flex justify-between border-b border-[#3c494b]/20 pb-1.5">
                    <span className="text-[#859396]">Registered Owner:</span>
                    <span className="text-[#dfe2f4] font-medium">{selectedNode.details.owner}</span>
                  </div>
                )}
                {selectedNode.details?.alias && (
                  <div className="flex justify-between border-b border-[#3c494b]/20 pb-1.5">
                    <span className="text-[#859396]">Known Aliases:</span>
                    <span className="text-[#6dedff] font-medium">{selectedNode.details.alias}</span>
                  </div>
                )}
                {selectedNode.details?.locationName && (
                  <div className="flex justify-between border-b border-[#3c494b]/20 pb-1.5">
                    <span className="text-[#859396]">Last Location:</span>
                    <span className="text-[#dfe2f4] font-medium">{selectedNode.details.locationName}</span>
                  </div>
                )}
                {selectedNode.details?.totalAmount && (
                  <div className="flex justify-between border-b border-[#3c494b]/20 pb-1.5">
                    <span className="text-[#859396]">Transaction Vol:</span>
                    <span className="text-[#6dedff] font-bold">Rs. {selectedNode.details.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {selectedNode.details?.flaggedReason && (
                  <div className="pt-2">
                    <span className="font-label-caps text-[10px] text-[#ffb4ab]">Flagged Reason:</span>
                    <p className="p-2 rounded bg-[#0f131f] border border-[#93000a]/30 font-body-sm text-[12px] text-[#bbc9cc] mt-1">
                      {selectedNode.details.flaggedReason}
                    </p>
                  </div>
                )}
              </div>

              {/* Direct Edges List */}
              <div>
                <h5 className="font-label-caps text-label-caps text-[#859396] mb-2">Linked Connections ({selectedEdges.length})</h5>
                <div className="space-y-1.5">
                  {selectedEdges.map((e) => {
                    const targetId = e.source === selectedNodeId ? e.target : e.source;
                    const targetNode = nodes.find(n => n.id === targetId);
                    return (
                      <div 
                        key={e.id}
                        onClick={() => setSelectedNodeId(targetId)}
                        className="p-2 rounded bg-[#171b28] hover:bg-[#303442]/60 border border-[#3c494b]/20 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="material-symbols-outlined text-[16px] text-[#6dedff]">arrow_forward</span>
                          <span className="font-body-sm text-[12px] text-[#dfe2f4] truncate">{targetNode?.label || targetId}</span>
                        </div>
                        <span className="font-code-sm text-[10px] text-[#859396] shrink-0 ml-1">{e.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA Action */}
              <div className="pt-2">
                <button
                  onClick={() => onSelectEntityDna && onSelectEntityDna(selectedNode.details?.owner || selectedNode.label)}
                  className="w-full py-2 rounded bg-[#28d2e6]/20 border border-[#28d2e6]/40 text-[#6dedff] hover:bg-[#28d2e6]/30 font-label-caps text-label-caps transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">fingerprint</span>
                  View Entity DNA 360
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-[#859396]">
              <span className="material-symbols-outlined text-[36px] mb-2">touch_app</span>
              <p className="font-body-sm">Click any node on the canvas to inspect entity connections & forensic metadata.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
