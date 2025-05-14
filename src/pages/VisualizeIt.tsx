import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Camera, Upload, Check, Home, Paintbrush, Grid, Building2, Scan, Send, 
         Smartphone, ClipboardCheck, AlertCircle, Map, FileText, ArrowLeft, RotateCw, X, 
         ChevronDown, Monitor, Layers, Zap, Award, Info, ChevronRight, Download, 
         ChevronsRight, Lightbulb, Compass, Eye, ZoomIn, Box, Target, ArrowUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const VisualizeIt = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'visualizer' | 'scanner'>('visualizer');
  const [activeRoom, setActiveRoom] = useState('kitchen');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [projectType, setProjectType] = useState<'residential' | 'commercial'>('residential');
  const [scanStep, setScanStep] = useState<'intro' | 'instructions' | 'scanning' | 'preview' | 'complete'>('intro');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Add state for visualizer filters and quality
  const [activeMaterialFilter, setActiveMaterialFilter] = useState('All');
  const [visualizationQuality, setVisualizationQuality] = useState('HD');
  
  // Sample room images with higher quality - Added Basement
  const roomImages = {
    kitchen: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=90&w=2000',
    bathroom: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=90&w=2000',
    livingroom: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=90&w=2000',
    bedroom: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=90&w=2000',
    office: 'https://images.unsplash.com/photo-1564069114553-7215e1ff1890?auto=format&fit=crop&q=90&w=2000',
    basement: 'https://images.unsplash.com/photo-1599409579604-8f86a7f70d5b?auto=format&fit=crop&q=90&w=2000', // Added Basement
    exterior: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=90&w=2000'
  };

  // Sample materials by room type - expanded with more options and items
  const materials = {
    kitchen: [
      { id: 'quartz', name: 'Quartz Countertop', color: 'bg-gray-300', type: 'Countertops' },
      { id: 'granite', name: 'Granite Countertop', color: 'bg-gray-800', type: 'Countertops' },
      { id: 'marble', name: 'Marble Countertop', color: 'bg-gray-100', type: 'Countertops' },
      { id: 'oak', name: 'Oak Cabinets', color: 'bg-yellow-700', type: 'Cabinets' },
      { id: 'white', name: 'White Cabinets', color: 'bg-white border border-gray-200', type: 'Cabinets' },
      { id: 'navy', name: 'Navy Cabinets', color: 'bg-blue-900', type: 'Cabinets' },
      { id: 'subway-tile', name: 'Subway Tile Backsplash', color: 'bg-blue-50 border border-gray-200', type: 'Walls' },
      { id: 'hardwood-floor', name: 'Hardwood Flooring', color: 'bg-amber-700', type: 'Floors' },
      { id: 'tile-floor-kitchen', name: 'Tile Flooring', color: 'bg-stone-400', type: 'Floors' }, // Added
      { id: 'pendant-light', name: 'Pendant Lighting Style', color: 'bg-yellow-200', type: 'Lighting' }, // Added
      { id: 'kitchen-table', name: 'Kitchen Table Style', color: 'bg-orange-100', type: 'Furniture' }, // Added
    ],
    bathroom: [
      { id: 'ceramic', name: 'Ceramic Tile', color: 'bg-blue-100', type: 'Floors' }, // Assign type
      { id: 'porcelain', name: 'Porcelain Tile', color: 'bg-blue-200', type: 'Floors' }, // Assign type
      { id: 'marble-tile-wall', name: 'Marble Wall Tile', color: 'bg-gray-100', type: 'Walls' }, // Assign type
      { id: 'white-vanity', name: 'White Vanity', color: 'bg-white border border-gray-200', type: 'Cabinets' }, // Assign type
      { id: 'wood-vanity', name: 'Wood Vanity', color: 'bg-yellow-600', type: 'Cabinets' }, // Assign type
      { id: 'glass-shower', name: 'Glass Shower Door', color: 'bg-blue-50 border border-blue-100', type: 'Fixtures' }, // Added type
      { id: 'rainfall-shower', name: 'Rainfall Shower Head', color: 'bg-gray-400', type: 'Fixtures' }, // Added type
      { id: 'freestanding-tub', name: 'Freestanding Tub', color: 'bg-white border border-gray-300', type: 'Fixtures' }, // Added type
      { id: 'vanity-light', name: 'Vanity Lighting', color: 'bg-yellow-100', type: 'Lighting' }, // Added
      { id: 'bathroom-mirror', name: 'Mirror Style', color: 'bg-gray-200', type: 'Decor' }, // Added
    ],
    livingroom: [
      { id: 'hardwood', name: 'Hardwood Floor', color: 'bg-yellow-800', type: 'Floors' },
      { id: 'laminate', name: 'Laminate Floor', color: 'bg-yellow-600', type: 'Floors' },
      { id: 'carpet', name: 'Carpet', color: 'bg-gray-300', type: 'Floors' },
      { id: 'white-paint', name: 'White Wall Paint', color: 'bg-white border border-gray-200', type: 'Walls' },
      { id: 'blue-paint', name: 'Blue Wall Paint', color: 'bg-blue-200', type: 'Walls' },
      { id: 'wainscoting', name: 'Wainscoting', color: 'bg-gray-50 border border-gray-200', type: 'Walls' },
      { id: 'crown-molding', name: 'Crown Molding', color: 'bg-gray-100', type: 'Walls' },
      { id: 'recessed-lighting', name: 'Recessed Lighting', color: 'bg-yellow-100', type: 'Lighting' }, // Added type
      { id: 'entertainment-unit', name: 'Entertainment Unit Style', color: 'bg-stone-700', type: 'Furniture' }, // Added
      { id: 'bookshelf', name: 'Bookshelf Style', color: 'bg-stone-300', type: 'Furniture' }, // Added
      { id: 'area-rug', name: 'Area Rug Style', color: 'bg-red-200', type: 'Decor' }, // Added
      { id: 'floor-lamp', name: 'Floor Lamp Style', color: 'bg-gray-400', type: 'Lighting' }, // Added
    ],
    bedroom: [
      { id: 'carpet-beige', name: 'Beige Carpet', color: 'bg-amber-100', type: 'Floors' },
      { id: 'carpet-gray', name: 'Gray Carpet', color: 'bg-gray-300', type: 'Floors' },
      { id: 'hardwood-dark', name: 'Dark Hardwood Floor', color: 'bg-amber-900', type: 'Floors' },
      { id: 'hardwood-light', name: 'Light Hardwood Floor', color: 'bg-amber-200', type: 'Floors' },
      { id: 'accent-wall', name: 'Accent Wall Paint', color: 'bg-blue-300', type: 'Walls' },
      { id: 'ceiling-fan', name: 'Ceiling Fan', color: 'bg-gray-100 border border-gray-200', type: 'Fixtures' }, // Added type
      { id: 'built-in-wardrobe', name: 'Built-in Wardrobe', color: 'bg-yellow-50 border border-gray-200', type: 'Furniture' }, // Added type
      { id: 'wood-panels', name: 'Wood Wall Panels', color: 'bg-amber-700', type: 'Walls' },
      { id: 'bedside-lamp', name: 'Bedside Lamp Style', color: 'bg-purple-100', type: 'Lighting' }, // Added
      { id: 'wall-art-bedroom', name: 'Wall Art', color: 'bg-pink-100', type: 'Decor' }, // Added
      { id: 'dresser-style', name: 'Dresser Style', color: 'bg-stone-200', type: 'Furniture' }, // Added
    ],
    office: [
      { id: 'laminate-floor-office', name: 'Laminate Flooring', color: 'bg-yellow-700', type: 'Floors' },
      { id: 'carpet-commercial', name: 'Commercial Carpet Tile', color: 'bg-gray-400', type: 'Floors' },
      { id: 'acoustic-panels', name: 'Acoustic Wall Panels', color: 'bg-blue-100', type: 'Walls' },
      { id: 'glass-partition', name: 'Glass Partition Wall', color: 'bg-blue-50 border border-blue-100', type: 'Walls' },
      { id: 'suspended-ceiling', name: 'Suspended Ceiling Tile', color: 'bg-white border border-gray-200', type: 'Ceiling' }, // Added type
      { id: 'track-lighting', name: 'Track Lighting', color: 'bg-yellow-50', type: 'Lighting' }, // Added type
      { id: 'built-in-storage', name: 'Built-in Storage Cabinets', color: 'bg-gray-100', type: 'Cabinets' }, // Added type
      { id: 'accent-color-office', name: 'Accent Wall Color', color: 'bg-indigo-400', type: 'Walls' },
      { id: 'desk-style', name: 'Desk Style', color: 'bg-stone-800', type: 'Furniture' }, // Added
      { id: 'office-chair', name: 'Office Chair Style', color: 'bg-black', type: 'Furniture' }, // Added
    ],
    basement: [ // Added Basement Materials
      { id: 'concrete-floor', name: 'Polished Concrete Floor', color: 'bg-gray-500', type: 'Floors' },
      { id: 'epoxy-floor', name: 'Epoxy Floor Coating', color: 'bg-gray-300', type: 'Floors' },
      { id: 'vinyl-plank-basement', name: 'Luxury Vinyl Plank', color: 'bg-yellow-700', type: 'Floors' },
      { id: 'drywall-basement', name: 'Painted Drywall', color: 'bg-gray-100', type: 'Walls' },
      { id: 'exposed-brick-basement', name: 'Exposed Brick Wall', color: 'bg-red-700', type: 'Walls' },
      { id: 'exposed-ceiling', name: 'Exposed Ceiling (Painted)', color: 'bg-gray-800', type: 'Ceiling' },
      { id: 'recessed-lighting-basement', name: 'Recessed Lighting', color: 'bg-yellow-100', type: 'Lighting' },
      { id: 'bar-area', name: 'Basement Bar Setup', color: 'bg-stone-600', type: 'Furniture' },
      { id: 'pool-table', name: 'Pool Table Style', color: 'bg-green-700', type: 'Furniture' },
      { id: 'home-theater-seating', name: 'Home Theater Seating', color: 'bg-red-900', type: 'Furniture' },
    ],
    exterior: [
      { id: 'brick', name: 'Brick Facade', color: 'bg-red-500', type: 'Walls' },
      { id: 'vinyl-siding', name: 'Vinyl Siding', color: 'bg-blue-100', type: 'Walls' },
      { id: 'stucco', name: 'Stucco Finish', color: 'bg-amber-50', type: 'Walls' },
      { id: 'stone-veneer', name: 'Stone Veneer Accent', color: 'bg-gray-400', type: 'Walls' },
      { id: 'wood-siding', name: 'Wood Siding', color: 'bg-yellow-800', type: 'Walls' },
      { id: 'metal-roof', name: 'Metal Roof', color: 'bg-gray-700', type: 'Roofing' }, // Added type
      { id: 'asphalt-shingles', name: 'Asphalt Shingles', color: 'bg-gray-900', type: 'Roofing' }, // Added type
      { id: 'entry-door', name: 'Entry Door Style', color: 'bg-red-900', type: 'Doors' }, // Added type
      { id: 'garage-door', name: 'Garage Door Style', color: 'bg-white border border-gray-300', type: 'Doors' }, // Added
      { id: 'exterior-lighting', name: 'Exterior Lighting Fixtures', color: 'bg-yellow-300', type: 'Lighting' }, // Added
      { id: 'deck-material', name: 'Deck Material', color: 'bg-orange-300', type: 'Decking' }, // Added
    ]
  };

  // Pool of diverse images for simulation when a material is selected
  const simulationImagePool = [
    'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=1200', // Modern kitchen detail
    'https://images.unsplash.com/photo-1600607687939-ce8a67769e03?auto=format&fit=crop&q=80&w=1200', // Cozy living room
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1200', // Simple bathroom
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1200', // Bedroom detail
    'https://images.unsplash.com/photo-1517705008128-361805f6a6eb?auto=format&fit=crop&q=80&w=1200', // Office space
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200', // Interior with armchair
    'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=1200', // Minimalist interior
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1200', // Bedroom different angle
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200', // Living room couch detail
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200', // Modern white interior
    'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=1200', // Bathroom sink detail
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=1200', // Another bedroom style
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1200', // Kitchen island
    'https://images.unsplash.com/photo-1617104679214-43535945a365?auto=format&fit=crop&q=80&w=1200', // Bright living area
    'https://images.unsplash.com/photo-1600566753190-17f0e278a096?auto=format&fit=crop&q=80&w=1200'  // Exterior house detail
  ];

  // Define material filters array outside render function - Added new filters
  const materialFilters = ['All', 'Floors', 'Walls', 'Cabinets', 'Countertops', 'Furniture', 'Lighting', 'Fixtures', 'Decor', 'Doors', 'Roofing', 'Decking'];

  // Simulates video demo for interactive tutorial
  const playDemoVideo = () => {
    setShowDemo(true);
    
    // If we have a reference to the video element, play it
    if (videoRef.current) {
      setDemoPlaying(true);
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
        setDemoPlaying(false);
      });
    }
  };

  // Handle file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulate 3D scanning process
  useEffect(() => {
    if (scanStep === 'scanning') {
      const timer = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setScanComplete(true);
            setScanStep('preview');
            return 100;
          }
          return prev + 2;
        });
      }, 150);
      
      return () => clearInterval(timer);
    }
  }, [scanStep]);

  // Handle scan submission
  const handleSubmitScan = () => {
    // In a real app, you would upload the scan data to a server here
    // For now, we'll just navigate to the estimate form with projectType as a parameter
    navigate(`/free-estimate?projectType=${projectType}&hasScan=true`);
  };

  // Updated function to get a distinctly different image URL for visualization simulation
  const getVisualizedImageUrl = () => {
    if (uploadedImage) {
      return uploadedImage;
    }
    
    if (selectedMaterial) {
      // When a material is selected, pick a unique image from the pool
      // Combine room and material IDs to generate a deterministic index
      const combinedId = activeRoom + '-' + selectedMaterial;
      let hash = 0;
      for (let i = 0; i < combinedId.length; i++) {
        hash = (hash << 5) - hash + combinedId.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }
      const imageIndex = Math.abs(hash) % simulationImagePool.length;
      return simulationImagePool[imageIndex];
    } else {
      // If no material is selected, return the base image for the current room
      return roomImages[activeRoom as keyof typeof roomImages];
    }
  };

  const renderVisualizer = () => {
    // Filter materials based on the active filter
    const filteredMaterials = materials[activeRoom as keyof typeof materials].filter(material => {
      if (activeMaterialFilter === 'All') return true;
      // Use the assigned type for filtering
      return material.type === activeMaterialFilter;
    });
    
    // Moved materialFilters definition outside
    const qualityOptions = ['Standard', 'HD', 'Ultra HD'];
    
    return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Professional Room Visualizer</h2>
        <p className="text-gray-600 max-w-3xl mx-auto mt-3">
          Select a room type or upload your own photo to visualize different materials and styles for your renovation project
        </p>
      </div>

      {/* Room Type Selector - Enhanced UI */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
          <Home className="w-5 h-5 mr-2 text-blue-600" />
          Select Room Type
        </h3>
        
        {/* Adjusted grid to fit 7 items on medium screens and up */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 md:gap-4"> 
          {Object.keys(roomImages).map((room) => (
            <div
              key={room}
              onClick={() => {
                setActiveRoom(room);
                setSelectedMaterial('');
              }}
              className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group relative ${
                activeRoom === room 
                  ? 'ring-2 ring-blue-500 shadow-md' 
                  : 'hover:shadow-md'
              }`}
            >
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src={roomImages[room as keyof typeof roomImages]}
                  alt={room}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    activeRoom === room ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${
                  activeRoom === room 
                    ? 'from-blue-900/80 to-blue-700/40' 
                    : 'from-gray-900/70 to-gray-700/30 group-hover:from-blue-900/60 group-hover:to-blue-700/30'
                } transition-colors duration-300`}></div>
                
                {activeRoom === room && (
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                )}
                
                <div className="absolute bottom-0 inset-x-0 p-2 text-white text-center">
                  <span className="text-sm font-medium capitalize">{room}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Visualization Area */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Left Column - Materials and Upload */}
        <div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-3 px-4">
              <h3 className="text-white font-medium flex items-center">
                <Layers className="w-5 h-5 mr-2" />
                Materials & Finishes
              </h3>
            </div>
            
            <div className="p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {materialFilters.map(filter => (
                  <button 
                    key={filter}
                    onClick={() => setActiveMaterialFilter(filter)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${ 
                      activeMaterialFilter === filter 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {filteredMaterials.length > 0 ? (
                  filteredMaterials.map((material) => (
                    <div 
                      key={material.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center transform hover:scale-[1.02] ${ // Added hover effect
                        selectedMaterial === material.id 
                          ? 'bg-blue-50 border border-blue-300 shadow-sm ring-1 ring-blue-200' // Enhanced selected style
                          : 'hover:bg-gray-50 border border-transparent hover:border-gray-100' // Subtle hover border
                      }`}
                      onClick={() => setSelectedMaterial(material.id)}
                    >
                      <div className={`w-8 h-8 rounded-md mr-3 ${material.color} shadow-sm border border-gray-200`}></div>
                      <span className="flex-grow text-gray-700 text-sm">{material.name}</span>
                      {selectedMaterial === material.id && (
                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-6">
                    No materials found for "{activeMaterialFilter}".
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Upload section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 py-3 px-4">
              <h3 className="text-white font-medium flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Upload Your Room
              </h3>
            </div>
            
            <div className="p-4">
              <label className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <span className="text-gray-600 font-medium">Upload your photo</span>
                <p className="text-gray-500 text-sm mt-1">Drop your image here or click to browse</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              
              {uploadedImage && (
                <div className="mt-4 text-center">
                  {/* Display thumbnail preview */} 
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded preview" 
                    className="w-20 h-20 object-cover rounded-lg mx-auto mb-2 border border-gray-300 shadow-sm"
                  />
                  <span className="text-green-600 text-sm font-medium flex items-center justify-center">
                    <Check className="w-4 h-4 mr-1" /> Image uploaded
                  </span>
                </div>
              )}
              
              <div className="mt-4 text-xs text-gray-500">
                <p className="flex items-start mb-1">
                  <Info className="w-3 h-3 mr-1 flex-shrink-0 mt-0.5 text-blue-500" />
                  For best results, use well-lit photos with minimal clutter
                </p>
                <p className="flex items-start">
                  <Info className="w-3 h-3 mr-1 flex-shrink-0 mt-0.5 text-blue-500" />
                  Supports JPG, PNG (max 20MB)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Center and Right Column - Visualization with controls */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Visualization header with tools */}
            <div className="bg-gray-100 border-b border-gray-200 py-2 px-4 flex justify-between items-center">
              <div className="text-gray-700 font-medium capitalize flex items-center">
                {activeRoom === 'kitchen' && <Home className="w-4 h-4 mr-1" />}
                {activeRoom === 'bathroom' && <Paintbrush className="w-4 h-4 mr-1" />}
                {activeRoom === 'livingroom' && <Grid className="w-4 h-4 mr-1" />}
                {activeRoom} Visualization
              </div>
              
              <div className="flex space-x-2">
                {/* Added title attributes */}
                <button onClick={() => alert('Fullscreen mode triggered (Simulation)')} className="bg-white p-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors" title="Fullscreen">
                  <Monitor className="w-4 h-4" />
                </button>
                <button onClick={() => alert('Download 3D model (Simulation)')} className="bg-white p-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors" title="Download">
                  <Download className="w-4 h-4" />
                </button>
                <button onClick={() => alert('Undo action (Simulation)')} className="bg-white p-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors" title="Undo">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button onClick={() => alert('Redo action (Simulation)')} className="bg-white p-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors" title="Redo">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Main visualization area */}
            <div className="p-6">
              <div className="relative rounded-lg overflow-hidden aspect-video bg-gray-100 mb-4 group">
                <img 
                  // Use the new function to get the image URL
                  key={getVisualizedImageUrl()} // Add key to force re-render on URL change
                  src={getVisualizedImageUrl()} 
                  alt={`${activeRoom} visualization ${selectedMaterial ? 'with ' + selectedMaterial : ''}`} 
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                
                {selectedMaterial && (
                  <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-sm text-white rounded-lg px-4 py-2 flex items-center animate-fade-in-fast">
                    <div className={`w-4 h-4 rounded-full mr-2 ${materials[activeRoom as keyof typeof materials].find(m => m.id === selectedMaterial)?.color}`}></div>
                    {/* Find the full material name for display */}
                    <p>Visualizing: {materials[activeRoom as keyof typeof materials].find(m => m.id === selectedMaterial)?.name || selectedMaterial}</p>
                  </div>
                )}
                
                {/* Advanced controls overlay - Appear on hover */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* Added title attributes */}
                  <button onClick={() => alert('Adjust lighting (Simulation)')} className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-gray-700 shadow-sm hover:bg-white transition-colors" title="Lighting Options">
                    <Zap className="w-5 h-5" />
                  </button>
                  <button onClick={() => alert('Change view angle (Simulation)')} className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-gray-700 shadow-sm hover:bg-white transition-colors" title="View Angle">
                    <Compass className="w-5 h-5" />
                  </button>
                  <button onClick={() => alert('Toggle layers (Simulation)')} className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-gray-700 shadow-sm hover:bg-white transition-colors" title="Layers">
                    <Layers className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Quality selector */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
                <span className="text-gray-700 text-sm font-medium">Visualization Quality:</span>
                <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-full">
                  {qualityOptions.map(quality => (
                    <button 
                      key={quality}
                      onClick={() => setVisualizationQuality(quality)}
                      className={`px-4 py-1 rounded-full text-sm transition-all duration-200 ${ 
                        visualizationQuality === quality 
                          ? 'bg-white text-blue-600 shadow' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {quality}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start">
                <Lightbulb className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Design Tip</h4>
                  <p className="text-blue-700 text-sm">
                    {activeRoom === 'kitchen' && "Consider contrasting cabinet and countertop colors for a modern look. Light cabinets with dark countertops create elegant contrast."}
                    {activeRoom === 'bathroom' && "Lighter tiles can make small bathrooms feel more spacious. Consider large format tiles to minimize grout lines."}
                    {activeRoom === 'livingroom' && "Layer different lighting sources - overhead, task, and accent lighting to create a warm and inviting atmosphere."}
                    {activeRoom === 'bedroom' && "Soft, neutral wall colors promote relaxation. Add personality with accent pieces and textiles."}
                    {activeRoom === 'office' && "Ergonomics and functionality should drive your home office design. Ensure adequate lighting to reduce eye strain."}
                    {activeRoom === 'exterior' && "Consider your home's architectural style when selecting exterior materials. Aim for curb appeal with complementary colors."}
                  </p>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-wrap justify-between gap-4 mt-6">
                <button 
                  onClick={() => {setActiveTab('scanner'); setScanStep('intro');}}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-all flex items-center shadow-md"
                >
                  <Scan className="w-5 h-5 mr-2" />
                  Create 3D Scan
                </button>
                
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                    <Download className="w-5 h-5 mr-2" />
                    Save Image
                  </button>
                  
                  <Link 
                    to="/free-estimate" 
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center shadow-md"
                  >
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Get Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recently visualized materials - Made clickable */}
          <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gray-100 border-b border-gray-200 py-2 px-4">
              <h3 className="text-gray-700 font-medium">Recently Visualized</h3>
            </div>
            
            <div className="p-4 flex flex-wrap gap-3">
              {['quartz', 'wood-vanity', 'hardwood', 'white-paint'].map((matId) => {
                // Find the material in any room category
                let material;
                let foundInRoom = '';
                for (const roomKey in materials) {
                  const roomMaterials = materials[roomKey as keyof typeof materials];
                  const found = roomMaterials.find(m => m.id === matId);
                  if (found) {
                    material = found;
                    foundInRoom = roomKey; // Store which room it was found in
                    break;
                  }
                }
                
                if (!material) return null;
                
                return (
                  <button // Changed to button for clickability
                    key={matId}
                    onClick={() => {
                      setActiveRoom(foundInRoom); // Switch to the room where this material exists
                      setSelectedMaterial(matId); // Select the material
                    }}
                    className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                    title={`Visualize ${material.name}`}
                  >
                    <div className={`w-6 h-6 rounded-md mr-2 ${material.color}`}></div>
                    <span className="text-sm text-gray-600">{material.name}</span>
                  </button>
                );
              })}
              
              {/* Keep "View All" as non-functional placeholder for now */}
              <div className="flex items-center p-2 border border-transparent rounded-lg text-gray-500">
                <ChevronRight className="w-5 h-5" />
                <span className="text-sm ml-1">View All</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )};

  const renderScanIntro = () => (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 py-8 px-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold">Professional 3D Room Scanner</h2>
            <div className="flex items-center text-sm bg-white/20 px-3 py-1 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-1.5 animate-pulse"></div>
              Pro Scanner Activated
            </div>
          </div>
          <p className="text-blue-100 max-w-3xl text-lg">
            Capture accurate dimensions and create detailed 3D models of your space to get precise estimates for your renovation or construction project.
          </p>
        </div>
        
        {/* Project type selection */}
        <div className="p-8">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">1. Select Your Project Type</h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Residential Card */}
            <div className={`border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${ // Added hover effect
              projectType === 'residential' 
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 shadow-md' 
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
              }`}
              onClick={() => setProjectType('residential')}
            >
              <div className="aspect-[5/3] relative overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=90&w=1200"
                  alt="Residential Project" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <Home className="w-8 h-8 mb-1 opacity-80" />
                  <h4 className="text-xl font-bold">Residential</h4>
                </div>
                
                {projectType === 'residential' && (
                  <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md animate-fade-in-fast">
                    <Check className="w-5 h-5 text-blue-600" />
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h4 className="font-medium text-gray-800 mb-2">Home Renovation Projects</h4>
                <ul className="space-y-2 list-none text-sm text-gray-600">
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Kitchen & Bathroom Remodels</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Flooring & Painting Projects</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Room Additions & Basements</li>
                </ul>
              </div>
            </div>
            
            {/* Commercial Card */}
            <div className={`border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${ // Added hover effect
              projectType === 'commercial' 
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 shadow-md' 
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
              }`}
              onClick={() => setProjectType('commercial')}
            >
              <div className="aspect-[5/3] relative overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=90&w=1200"
                  alt="Commercial Project" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <Building2 className="w-8 h-8 mb-1 opacity-80" />
                  <h4 className="text-xl font-bold">Commercial</h4>
                </div>
                
                {projectType === 'commercial' && (
                  <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md animate-fade-in-fast">
                    <Check className="w-5 h-5 text-blue-600" />
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h4 className="font-medium text-gray-800 mb-2">Business Space Projects</h4>
                <ul className="space-y-2 list-none text-sm text-gray-600">
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Office & Retail Renovations</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Restaurant & Healthcare</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> Warehouse & Industrial</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <Award className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-gray-700">Utilizing Pro Scanner Technology - Up to 99.8% dimensional accuracy</span>
            </div>
            
            <button
              onClick={() => setScanStep('instructions')}
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-md transition-colors font-medium text-lg transform hover:scale-105"
            >
              Continue to Scanner Setup
              <ChevronsRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Testimonials - Refined styling */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        {[
          {
            quote: "The 3D scanner was incredibly easy to use and helped us get an accurate quote fast for our kitchen remodel. No surprises!",
            author: "Sarah Johnson",
            role: "Homeowner"
          },
          {
            quote: "This technology saved us hours of manual measurements for our office renovation. The floor plan output was perfect.",
            author: "Michael Chen",
            role: "Office Manager"
          },
          {
            quote: "As a designer, the detail in the scan is impressive. It really helps clients visualize the final space before committing.",
            author: "Emma Rodriguez",
            role: "Interior Designer"
          }
        ].map((testimonial, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col transition-all duration-700 hover:shadow-xl hover:border-blue-100 hover:bg-blue-50/30">
            <p className="text-gray-600 italic mb-4 flex-grow">"{testimonial.quote}"</p>
            <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold mr-3">
                {testimonial.author.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-gray-800">{testimonial.author}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderScanInstructions = () => (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 py-5 px-6 text-white flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center">
            <Scan className="w-6 h-6 mr-3" />
            3D Scanner Setup & Instructions
          </h2>
          <div className="flex items-center text-sm bg-white/20 px-3 py-1 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-400 mr-1.5"></div>
            Pro Scanner Active
          </div>
        </div>
        
        {/* Instructions */}
        <div className="p-8">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4 flex-shrink-0">1</div>
            <h3 className="text-xl font-semibold text-gray-800">Prepare Your Space for Optimal Scanning</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start hover:shadow-sm transition-shadow">
                <Smartphone className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Device Prep</h4>
                  <p className="text-sm text-gray-600">
                    Use a modern smartphone with a good camera. Ensure sufficient battery and storage. Clean the camera lens.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start hover:shadow-sm transition-shadow">
                <Map className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Environment Setup</h4>
                  <p className="text-sm text-gray-600">
                    Ensure good, even lighting. Remove small objects, clutter, and reflective items that might interfere.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start hover:shadow-sm transition-shadow">
                <RotateCw className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Movement Guide</h4>
                  <p className="text-sm text-gray-600">
                    Walk slowly and steadily around the room's perimeter. Keep the camera pointed towards the center, covering floor to ceiling.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative rounded-xl overflow-hidden bg-gray-100 shadow-inner group">
              <img 
                src="https://images.unsplash.com/photo-1600607688066-890987f19a81?auto=format&fit=crop&q=90&w=800" 
                alt="Room Scanning Example"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="font-medium text-lg">Example Scanning Path</div>
                <button className="text-sm text-blue-300 hover:text-blue-100 flex items-center mt-1 transition-colors">
                  <Eye className="w-4 h-4 mr-1" />
                  Watch tutorial video
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center mb-6 mt-10">
            <div className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4 flex-shrink-0">2</div>
            <h3 className="text-xl font-semibold text-gray-800">Configure Scanner Settings</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <h4 className="font-medium text-gray-800 mb-3">Scan Quality</h4>
              <div className="space-y-2">
                {['Standard', 'High Resolution', 'Ultra Detailed'].map(quality => (
                  <label key={quality} className="flex items-center cursor-pointer">
                    <input type="radio" name="scan-quality" className="mr-2 text-blue-600 focus:ring-blue-500" defaultChecked={quality === 'High Resolution'} />
                    <span className="text-sm text-gray-700">{quality}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <h4 className="font-medium text-gray-800 mb-3">Scan Type</h4>
              <div className="space-y-2">
                {['Room Size Only', 'Full Room Details', 'Complete 3D Model'].map(type => (
                  <label key={type} className="flex items-center cursor-pointer">
                    <input type="radio" name="scan-type" className="mr-2 text-blue-600 focus:ring-blue-500" defaultChecked={type === 'Full Room Details'} />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <h4 className="font-medium text-gray-800 mb-3">Output Options</h4>
              <div className="space-y-2">
                {['Basic Dimensions', '2D Floor Plan', 'Interactive 3D Model'].map(format => (
                  <label key={format} className="flex items-center cursor-pointer">
                    <input type="checkbox" className="mr-2 text-blue-600 rounded focus:ring-blue-500" defaultChecked />
                    <span className="text-sm text-gray-700">{format}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start mb-10">
            <AlertCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Privacy & Data Security</h4>
              <p className="text-sm text-blue-700">
                Your 3D scan data is encrypted and securely processed. It is used solely for generating your estimate and design preview, and is automatically deleted after 30 days. We adhere to strict privacy protocols.
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <button
              onClick={() => setScanStep('intro')}
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Project Type
            </button>
            
            <button
              onClick={() => setScanStep('scanning')}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors flex items-center font-semibold text-lg transform hover:scale-105"
            >
              Begin Scanning
              <Scan className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScanning = () => (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in">
      <div className="mb-10">
        <div className="relative inline-block mb-6">
          <div className="animate-pulse bg-blue-100 p-5 rounded-full">
            <Scan className="w-20 h-20 text-blue-600" />
          </div>
          {/* Pulsing rings */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping" style={{animationDuration: '3s'}}></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping opacity-50" style={{animationDuration: '3s', animationDelay: '0.5s'}}></div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-gray-800">3D Scanning in Progress</h1>
        <p className="text-gray-600 mb-2 text-lg">
          Capturing your {projectType === 'residential' ? 'home' : 'business'} space with Pro Scanner Technology
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Please move your device slowly and steadily around the room to capture all details. Avoid sudden movements.
        </p>
      </div>

      {/* Progress bar with animated patterns */}
      <div className="relative w-full h-5 bg-gray-200 rounded-full mb-6 overflow-hidden shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 flex items-center justify-center text-white text-xs font-medium"
          style={{ width: `${scanProgress}%` }}
        >
          {scanProgress}%
          {/* Animated stripes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.5) 10px, rgba(255,255,255,0.5) 20px)',
                backgroundSize: '200% 200%',
                animation: 'progress-animation 2s linear infinite',
              }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="text-left">
          <div className="text-sm text-gray-500">Current Status:</div>
          <div className="font-medium text-gray-800">
            {scanProgress < 30 ? 'Initializing 3D model...' :
             scanProgress < 60 ? 'Capturing room structure...' :
             scanProgress < 90 ? 'Mapping surfaces & details...' :
             'Finalizing 3D model...'}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Estimated Time:</div>
          <div className="text-lg font-bold text-blue-600">{Math.max(1, Math.round((100 - scanProgress) / 2 * 0.15))}s</div>
        </div>
      </div>
      
      {/* Feature detection indicators with icons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col items-center">
          <Layers className={`w-6 h-6 mb-1 ${scanProgress > 20 ? 'text-green-500' : 'text-gray-400'}`} />
          <div className="text-xs text-gray-500 mb-1">Walls</div>
          <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${scanProgress > 20 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {scanProgress > 20 ? 'Detected' : 'Pending'}
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col items-center">
          <Grid className={`w-6 h-6 mb-1 ${scanProgress > 40 ? 'text-green-500' : 'text-gray-400'}`} />
          <div className="text-xs text-gray-500 mb-1">Floor</div>
          <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${scanProgress > 40 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {scanProgress > 40 ? 'Detected' : 'Pending'}
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col items-center">
          <ArrowUp className={`w-6 h-6 mb-1 ${scanProgress > 60 ? 'text-green-500' : 'text-gray-400'}`} />
          <div className="text-xs text-gray-500 mb-1">Ceiling</div>
          <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${scanProgress > 60 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {scanProgress > 60 ? 'Detected' : 'Pending'}
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col items-center">
          <Box className={`w-6 h-6 mb-1 ${scanProgress > 80 ? 'text-green-500' : 'text-gray-400'}`} />
          <div className="text-xs text-gray-500 mb-1">Objects</div>
          <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${scanProgress > 80 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {scanProgress > 80 ? 'Detected' : 'Pending'}
          </div>
        </div>
      </div>

      {/* Tips carousel/display */}
      <div className="bg-blue-50 rounded-lg p-4 mb-10 text-left shadow-sm border border-blue-100">
        <div className="flex items-start">
          <Lightbulb className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">Scanning Best Practices</h4>
            <p className="text-sm text-blue-700">
              Maintain a consistent distance from walls (approx. 3-5 ft). Overlap scan paths slightly. Ensure the entire room, including corners, is captured.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setScanStep('intro')}
        className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg inline-flex items-center transition-colors font-medium"
        disabled={scanProgress > 0 && scanProgress < 100}
      >
        <X className="w-4 h-4 mr-2" />
        Cancel Scan
      </button>
    </div>
  );

  const renderScanPreview = () => (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 py-5 px-6 text-white flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center">
            <Check className="w-6 h-6 mr-3" />
            3D Scan Completed Successfully
          </h2>
          <div className="bg-white/20 text-white text-sm px-3 py-1 rounded-full font-medium">
            High Quality Scan Results
          </div>
        </div>
        
        {/* Results area */}
        <div className="p-8">
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column: 3D Preview & Floor Plan */} 
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Interactive 3D Model</h3>
              
              {/* 3D preview area */}
              <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video mb-6 relative group shadow-inner">
                <img 
                  src={projectType === 'residential' ? 
                    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=90&w=1200" :
                    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=90&w=1200"
                  } 
                  alt="3D Scan Preview" 
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                />
                
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"></div>
                
                {/* Dimension overlay lines with labels */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* Width line - blue */}
                  <div className="absolute top-[35%] left-[15%] right-[15%] h-[3px] bg-blue-500/70">
                    <div className="absolute left-0 top-0 h-[12px] w-[3px] bg-blue-500/70 -translate-y-1/2"></div>
                    <div className="absolute right-0 top-0 h-[12px] w-[3px] bg-blue-500/70 -translate-y-1/2"></div>
                    <div className="absolute top-[-24px] left-1/2 -translate-x-1/2 bg-blue-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                      Width: {projectType === 'residential' ? '4.7 m' : '12.5 m'}
                    </div>
                  </div>
                  
                  {/* Length line - green */}
                  <div className="absolute left-[25%] top-[25%] bottom-[25%] w-[3px] bg-green-500/70">
                    <div className="absolute left-0 top-0 h-[3px] w-[12px] bg-green-500/70 -translate-x-1/2"></div>
                    <div className="absolute left-0 bottom-0 h-[3px] w-[12px] bg-green-500/70 -translate-x-1/2"></div>
                    <div className="absolute top-1/2 -translate-y-1/2 left-[8px] bg-green-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                      Length: {projectType === 'residential' ? '5.8 m' : '15.2 m'}
                    </div>
                  </div>
                  
                  {/* Height line - purple */}
                  <div className="absolute right-[25%] top-[25%] bottom-[25%] w-[3px] bg-purple-500/70">
                    <div className="absolute right-0 top-0 h-[3px] w-[12px] bg-purple-500/70 translate-x-1/2"></div>
                    <div className="absolute right-0 bottom-0 h-[3px] w-[12px] bg-purple-500/70 translate-x-1/2"></div>
                    <div className="absolute top-1/2 -translate-y-1/2 right-[8px] bg-purple-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                      Height: {projectType === 'residential' ? '2.7 m' : '3.8 m'}
                    </div>
                  </div>
                </div>
                
                {/* 3D model badge */}
                <div className="absolute left-2 bottom-2 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded">
                  3D MODEL PREVIEW
                </div>
                
                {/* Interaction controls */}
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white/80 backdrop-blur-sm p-1.5 rounded text-gray-800 hover:bg-white transition-colors shadow-sm" title="Rotate">
                    <Compass className="w-4 h-4" />
                  </button>
                  <button className="bg-white/80 backdrop-blur-sm p-1.5 rounded text-gray-800 hover:bg-white transition-colors shadow-sm" title="Zoom">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button className="bg-white/80 backdrop-blur-sm p-1.5 rounded text-gray-800 hover:bg-white transition-colors shadow-sm" title="Layers">
                    <Layers className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Floorplan preview */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <FileText className="w-6 h-6 text-blue-600 mr-3" />
                  <div>
                    <span className="text-blue-800 font-semibold">2D Floor Plan Generated</span>
                    <p className="text-xs text-blue-600">Click to view and download</p>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors">View Plan</button>
              </div>
            </div>
            
            {/* Right Column: Specifications & Details */} 
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Room Specifications & Scan Details</h3>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6 shadow-sm">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Project Type</div>
                    <div className="font-semibold text-gray-800 text-lg">
                      {projectType === 'residential' ? 'Residential' : 'Commercial'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Approx. Area</div>
                    <div className="font-semibold text-gray-800 text-lg">
                      {projectType === 'residential' ? '293 ft²' : '2,066 ft²'} / {projectType === 'residential' ? '27.2 m²' : '191.9 m²'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Wall Area</div>
                    <div className="font-semibold text-gray-800 text-lg">
                      {projectType === 'residential' ? '568 ft²' : '3,472 ft²'} / {projectType === 'residential' ? '52.8 m²' : '322.5 m²'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Avg. Ceiling Height</div>
                    <div className="font-semibold text-gray-800 text-lg">
                      {projectType === 'residential' ? '8.9 ft' : '12.5 ft'} / {projectType === 'residential' ? '2.7 m' : '3.8 m'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Detected features */}
              <h4 className="font-medium text-gray-700 mb-3">Detected Features</h4>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center bg-green-50 border border-green-200 rounded-lg p-2 shadow-xs">
                  <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-sm text-green-800">
                    {projectType === 'residential' ? '1 Doorway' : '2 Entrances'}
                  </span>
                </div>
                <div className="flex items-center bg-green-50 border border-green-200 rounded-lg p-2 shadow-xs">
                  <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-sm text-green-800">
                    {projectType === 'residential' ? '2 Windows' : '8 Windows'}
                  </span>
                </div>
                <div className="flex items-center bg-green-50 border border-green-200 rounded-lg p-2 shadow-xs">
                  <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-sm text-green-800">
                    {projectType === 'residential' ? 'Ceiling Fixture' : 'HVAC Vents'}
                  </span>
                </div>
                <div className="flex items-center bg-green-50 border border-green-200 rounded-lg p-2 shadow-xs">
                  <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-sm text-green-800">
                    {projectType === 'residential' ? 'Electrical Outlets' : 'Support Columns'}
                  </span>
                </div>
              </div>
              
              {/* Accuracy rating */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center mb-6 shadow-sm">
                <div className="bg-emerald-100 rounded-full p-2 mr-3">
                  <Target className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-emerald-800 font-semibold">High Accuracy Scan Achieved</div>
                  <div className="text-emerald-700 text-sm">Estimated 98.7% dimensional confidence</div>
                </div>
              </div>
              
              {/* Scan metadata */}
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>Scan ID:</span>
                  <span className="font-mono">SCAN-{Date.now().toString().slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created On:</span>
                  <span>{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Scanner Version:</span>
                  <span>Pro Scanner v4.2.1</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={() => setScanStep('instructions')}
              className="w-full sm:w-auto px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Scan Another Room
            </button>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <button className="w-full sm:w-auto px-5 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors flex items-center justify-center font-medium">
                <Download className="w-4 h-4 mr-2" />
                Download Results
              </button>
              
              <button
                onClick={handleSubmitScan}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors flex items-center justify-center font-semibold text-lg transform hover:scale-105"
              >
                <Send className="w-5 h-5 mr-2" />
                Submit with Estimate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - Further Reduced Padding x3 */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-1 lg:py-2 relative overflow-hidden"> {/* Further reduced padding x3 here */}
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-repeat" 
               style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-block bg-white/10 backdrop-blur-sm text-sm font-semibold px-3 py-1 rounded-full mb-4">
                NEW PRO FEATURES
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Design Your Space with <span className="text-blue-300">3D Visualization</span> Technology
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-xl mx-auto lg:mx-0">
                Transform your renovation project with our advanced 3D room scanner and material visualizer. See your dream space before it's built.
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
                <button 
                  onClick={() => setActiveTab('visualizer')}
                  className="bg-white text-blue-900 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold flex items-center justify-center transition-colors shadow-lg hover:shadow-xl"
                >
                  <Eye className="mr-2 w-5 h-5" />
                  Start Visualizing
                </button>
                <button 
                  onClick={() => {setActiveTab('scanner'); setScanStep('intro');}}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center transition-colors shadow-md group"
                >
                  <Scan className="mr-2 w-5 h-5 group-hover:animate-pulse" />
                  Try 3D Scanner
                </button>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="relative mx-auto w-full max-w-md">
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-blue-400 rounded-lg opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-indigo-400 rounded-lg opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
                
                <div className="bg-gradient-to-tr from-blue-100/20 to-white/30 backdrop-blur-sm rounded-2xl p-3 shadow-2xl border border-white/20 relative z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=90&w=1200" 
                    alt="3D Room Visualization" 
                    className="rounded-xl w-full h-auto shadow-inner"
                  />
                  
                  <div className="absolute bottom-8 right-8 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center">
                    <Scan className="w-4 h-4 mr-1.5" />
                    3D Scan Complete
                  </div>
                  
                  <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-1 shadow-lg">
                    <Check className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content navigation tabs */}
      <div className="container mx-auto px-4 py-8 animate-fade-in animation-delay-200">
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('visualizer')}
            className={`px-6 py-3 font-medium text-lg relative ${
              activeTab === 'visualizer' 
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-px' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <div className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Room Visualizer
            </div>
          </button>
          <button
            onClick={() => {setActiveTab('scanner'); setScanStep('intro');}}
            className={`px-6 py-3 font-medium text-lg relative ${
              activeTab === 'scanner' 
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-px' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <div className="flex items-center">
              <Scan className="w-5 h-5 mr-2" />
              3D Room Scanner
            </div>
          </button>
        </div>
      
        {/* Content area */}
        <div className="mb-16">
          {activeTab === 'visualizer' ? (
            <div key="visualizer-content" className="animate-fade-in">
              {/* Visualizer content here */}
              {renderVisualizer()}
            </div>
          ) : (
            <div key="scanner-content" className="animate-fade-in">
              {/* Scanner content here */}
              {scanStep === 'intro' && renderScanIntro()}
              {scanStep === 'instructions' && renderScanInstructions()}
              {scanStep === 'scanning' && renderScanning()}
              {scanStep === 'preview' && renderScanPreview()}
            </div>
          )}
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-gray-50 py-16 animate-fade-in animation-delay-400">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Design Tools</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our visualization tools help you plan your project with confidence and precision
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">360° Visualization</h3>
              <p className="text-gray-600">
                See your space from every angle with our interactive 360° view tools.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Scan className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3D Room Scanning</h3>
              <p className="text-gray-600">
                Capture precise measurements and dimensions with our easy-to-use 3D scanner.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Material Library</h3>
              <p className="text-gray-600">
                Choose from hundreds of materials to visualize in your space before purchasing.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Demo Section */}
      <div className="py-16 bg-gradient-to-b from-white to-gray-50 animate-fade-in animation-delay-600">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">See How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Watch our quick demo to learn how to use the 3D scanner and visualizer for your project
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-300">
              {showDemo ? (
                <video 
                  ref={videoRef}
                  controls
                  className="w-full h-full object-cover"
                  poster="https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=90&w=1200"
                >
                  <source src="demo-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="relative w-full h-full">
                  <img 
                    src="https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=90&w=1200" 
                    alt="Video thumbnail"
                    className="w-full h-full object-cover opacity-80" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={playDemoVideo}
                      className="bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-110"
                    >
                      <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                    </button>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black to-transparent h-1/3"></div>
                  <div className="absolute bottom-4 left-4 text-white font-medium">
                    3D Scanner & Visualizer Tutorial
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-blue-900 text-white py-16 animate-fade-in animation-delay-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Space?</h2>
          <p className="text-blue-100 max-w-xl mx-auto mb-8">
            Get precise measurements and visualize your dream space with our professional tools
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/free-estimate" 
              className="bg-white text-blue-900 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold flex items-center justify-center transition-colors"
            >
              Request Free Estimate
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button 
              onClick={() => {setActiveTab('scanner'); setScanStep('intro');}}
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center transition-colors border border-blue-600"
            >
              Try Scanner Now
              <Scan className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizeIt;

// Add CSS animations for the scanner
const scannerStyles = document.createElement('style');
scannerStyles.innerHTML = `
  @keyframes progress-animation {
    0% {
      background-position: 0% 0%;
    }
    100% {
      background-position: 100% 100%;
    }
  }
  
  @keyframes scan-line {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(100%);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  .scan-active {
    position: relative;
    overflow: hidden;
  }
  
  .scan-active::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(to right, transparent, rgba(59, 130, 246, 0.5), transparent);
    animation: scan-line 2s ease-in-out infinite;
    z-index: 1;
  }
`;

// Only run in browser environment
if (typeof document !== 'undefined') {
  document.head.appendChild(scannerStyles);
}