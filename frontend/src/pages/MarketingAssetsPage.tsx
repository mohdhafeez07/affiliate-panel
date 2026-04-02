import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { 
  Download, 
  Image as ImageIcon, 
  Search, 
  Maximize2,
  ExternalLink,
  Cpu,
  Layers,
  Globe
} from 'lucide-react';
import EmptyState from '../components/EmptyState';

const MarketingAssetsPage: React.FC = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await api.get('/assets');
        setAssets(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (error) {
        console.error('Failed to fetch assets', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const filteredAssets = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return assets;
    return assets.filter(asset => String(asset?.title ?? '').toLowerCase().includes(q));
  }, [assets, searchTerm]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="page-shell">
      <motion.div 
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-4"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Layers size={14} className="text-cyber-blue shrink-0" />
            <span className="page-header-kicker">Creative library</span>
          </div>
          <h2 className="page-title">Marketing assets</h2>
          <p className="page-desc">Banners and creatives approved for your campaigns.</p>
        </div>
        
        <div className="relative w-full lg:max-w-sm group shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-text-muted group-focus-within:text-cyber-blue transition-colors pointer-events-none" size={16} />
          <input 
            type="search" 
            placeholder="Search by title…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-cyber-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder:text-cyber-text-muted/60 focus:outline-none focus:ring-2 focus:ring-cyber-blue/20 focus:border-cyber-blue/40 transition-all"
            aria-label="Search assets"
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="card aspect-[16/10] animate-pulse bg-white/5 border border-white/5" />
          ))}
        </div>
      ) : filteredAssets.length > 0 ? (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {filteredAssets.map((asset) => (
            <motion.div 
              key={asset.id} 
              variants={item}
              whileHover={{ y: -2 }}
              className="card group p-3 sm:p-4 border-white/5 bg-cyber-deep/25 hover:bg-cyber-deep/40 hover:border-cyber-blue/25 transition-colors duration-300 overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-3 bg-cyber-black border border-white/10 group-hover:border-cyber-blue/30 transition-colors">
                <img 
                  src={asset.imageUrl} 
                  alt={String(asset.title ?? 'Marketing asset')} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02] opacity-80 group-hover:opacity-100"
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      className="p-2 bg-cyber-blue/20 backdrop-blur rounded-md text-cyber-blue hover:bg-cyber-blue hover:text-white transition-colors border border-cyber-blue/30"
                      aria-label="Preview"
                    >
                      <Maximize2 size={16} />
                    </button>
                    <a 
                      href={asset.imageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2 bg-white/10 backdrop-blur rounded-md text-white hover:bg-white/20 transition-colors border border-white/10"
                      aria-label="Open image in new tab"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex-1 px-0.5 min-w-0">
                <div className="flex items-center gap-1.5 mb-1.5">
                   <Cpu size={11} className="text-cyber-purple shrink-0" />
                   <p className="text-[10px] text-cyber-text-secondary font-medium uppercase tracking-wide truncate">Static creative</p>
                </div>
                <h4 className="text-base font-semibold font-outfit mb-2 group-hover:text-cyber-blue transition-colors text-white line-clamp-2">
                  {asset.title ?? 'Untitled'}
                </h4>
                <div className="flex flex-wrap gap-1.5 mb-3">
                   <span className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[9px] font-medium text-cyber-text-muted uppercase tracking-wide">Image</span>
                   <span className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[9px] font-medium text-cyber-text-muted uppercase tracking-wide">Hi-res</span>
                   <span className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[9px] font-medium text-cyber-text-muted uppercase tracking-wide inline-flex items-center gap-0.5">
                      <Globe size={9} /> Brand-safe
                   </span>
                </div>
              </div>

              <motion.a 
                whileTap={{ scale: 0.99 }}
                href={asset.downloadUrl}
                className="w-full btn-secondary flex items-center justify-center gap-2 py-2.5 border-white/10 group-hover:bg-cyber-blue group-hover:text-cyber-black group-hover:border-cyber-blue transition-colors duration-300"
              >
                <Download size={16} strokeWidth={2} />
                <span className="text-xs font-semibold uppercase tracking-wide">Download</span>
              </motion.a>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="py-12">
          <EmptyState 
            title={assets.length === 0 ? 'No assets available' : 'No matches'} 
            description={
              assets.length === 0
                ? 'Creatives will appear here when your manager publishes them.'
                : `No results for “${searchTerm.trim()}”. Try a different search.`
            } 
            icon={ImageIcon} 
          />
        </div>
      )}
    </div>
  );
};

export default MarketingAssetsPage;
