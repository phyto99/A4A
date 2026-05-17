import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ixshtcvtchqpumwecmrd.supabase.co',
  'sb_publishable_OAwMCMrD31IB6gwEqny2kA_JwHcDY7P'
);

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL STYLES
// ═══════════════════════════════════════════════════════════════════════════════
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{background:#07070f;color:#d8d8f0;font-family:'DM Sans',sans-serif;min-height:100vh}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:#0a0a12}
::-webkit-scrollbar-thumb{background:#1e1e30;border-radius:2px}
::-webkit-scrollbar-thumb:hover{background:#2a2a42}
.mono{font-family:'IBM Plex Mono',monospace}
input,button,select,textarea{font-family:'DM Sans',sans-serif}

@keyframes blink{0%,100%{opacity:1}50%{opacity:0.12}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes slideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideInR{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes dataflow{0%{stroke-dashoffset:20}100%{stroke-dashoffset:0}}
@keyframes nodeIn{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes barGrow{from{width:0}to{width:var(--w)}}
@keyframes pulse{0%,100%{opacity:0.5}50%{opacity:1}}

.blink{animation:blink 1.4s ease-in-out infinite}
.spin{animation:spin 0.8s linear infinite;display:inline-block}
.slide-up{animation:slideUp 0.16s ease-out both}
.slide-r{animation:slideInR 0.2s ease-out both}
.fade-in{animation:fadeIn 0.2s ease-out both}

.stage-bar{display:flex;align-items:stretch;background:#09090f;border-bottom:1px solid #16162a;overflow-x:auto}
.stage-item{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px 10px;border-right:1px solid #13132a;min-width:82px;cursor:pointer;transition:background 0.12s;position:relative;user-select:none}
.stage-item:last-child{border-right:none}
.stage-item.running{background:#0d0d1e}
.stage-item.complete{background:#08110a}
.stage-item.error{background:#110808}
.stage-item.skipped{opacity:0.3;cursor:default}
.stage-item.active-viz{background:#0e0e20;box-shadow:inset 0 -2px 0 #fbbf24}
.stage-item:not(.skipped):not(.idle):hover{background:#0c0c1c}

.result-card{background:#0c0c18;border:1px solid #181828;border-radius:4px;overflow:hidden;transition:border-color 0.12s,transform 0.1s}
.result-card:hover{border-color:#262640;transform:translateY(-1px)}
.result-card.multi-museum{border-left:3px solid #fbbf24}
.result-card.wikidata-verified{border-left:3px solid #22c55e}
.museum-tag{display:inline-block;padding:1px 5px;border-radius:2px;font-size:10px;font-family:'IBM Plex Mono',monospace;font-weight:500;letter-spacing:0.02em}
.conf-badge{display:inline-flex;align-items:center;gap:3px;padding:2px 6px;border-radius:2px;font-size:10px;font-family:'IBM Plex Mono',monospace}

.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px}
.modal{background:#0c0c18;border:1px solid #222238;border-radius:6px;max-width:700px;width:100%;max-height:90vh;overflow:hidden;display:flex;flex-direction:column}

.toggle-btn{display:flex;align-items:center;gap:5px;padding:4px 10px;border-radius:3px;border:1px solid #222238;background:transparent;color:#6666a0;font-size:11px;cursor:pointer;transition:all 0.12s}
.toggle-btn.on{background:#12121e;border-color:#33334e;color:#c8c8e8}
.toggle-btn:hover:not(.on){border-color:#222242}

.search-input{width:100%;background:#0c0c18;border:1px solid #222238;border-radius:4px;color:#d8d8f0;padding:10px 14px 10px 36px;font-size:14px;outline:none;transition:border-color 0.12s}
.search-input:focus{border-color:#33334e}
.search-input::placeholder{color:#2a2a40}

.run-btn{padding:10px 22px;background:#fbbf24;color:#07070f;border:none;border-radius:4px;font-weight:600;font-size:14px;cursor:pointer;transition:background 0.12s;white-space:nowrap;letter-spacing:0.01em}
.run-btn:hover:not(:disabled){background:#f0b020}
.run-btn:disabled{background:#1c1808;color:#4a4020;cursor:not-allowed}

.stat-chip{background:#09090f;border:1px solid #161626;border-radius:3px;padding:3px 9px;display:flex;gap:5px;align-items:baseline}

.viz-wrap{background:#07070d;border-bottom:1px solid #141422;animation:fadeIn 0.18s ease-out}
.viz-head{padding:7px 12px;border-bottom:1px solid #111120;display:flex;align-items:center;justify-content:space-between;background:#08080e}

.log-row{display:flex;align-items:baseline;gap:8px;padding:2px 0;font-size:11px;border-bottom:1px solid #0e0e18}

.deck-panel{position:fixed;right:0;top:0;bottom:0;width:296px;background:#08080d;border-left:1px solid #161626;z-index:50;display:flex;flex-direction:column;transform:translateX(100%);transition:transform 0.22s cubic-bezier(0.4,0,0.2,1);overflow:hidden}
.deck-panel.open{transform:translateX(0)}
.deck-card{background:#0c0c18;border:1px solid #181828;border-radius:3px;overflow:hidden;transition:border-color 0.1s}
.deck-card:hover{border-color:#242438}

.credit-strip{height:2px;border-radius:1px;transition:width 0.5s ease}
.phash-cell{transition:opacity 0.1s}

.suggest-pill{padding:3px 10px;border-radius:11px;border:1px solid #191930;background:transparent;color:#44447a;font-size:11px;cursor:pointer;transition:all 0.12s}
.suggest-pill:hover{border-color:#2a2a48;color:#7777aa;background:#0c0c18}

.richness-track{background:#141424;border-radius:1px;height:3px;overflow:hidden;margin-top:3px}
.richness-fill{height:100%;border-radius:1px;transition:width 0.5s ease}

.admin-panel{position:fixed;left:0;top:0;bottom:0;width:310px;background:#07070d;border-right:1px solid #161626;z-index:60;display:flex;flex-direction:column;transform:translateX(-100%);transition:transform 0.22s cubic-bezier(0.4,0,0.2,1);overflow:hidden}
.admin-panel.open{transform:translateX(0)}
.mode-btn{display:flex;align-items:flex-start;gap:9px;padding:9px 12px;border-radius:4px;border:1px solid #161628;background:transparent;cursor:pointer;transition:all 0.12s;text-align:left;width:100%}
.mode-btn.active{border-color:var(--mc,#fbbf24);background:rgba(251,191,36,0.05)}
.mode-btn:hover:not(.active){border-color:#222238;background:#0a0a14}
.city-pill{padding:4px 8px;border-radius:4px;border:1px solid #161626;background:transparent;cursor:pointer;transition:all 0.12s;display:flex;align-items:center;gap:4px;font-size:11px}
.city-pill.selected{border-color:var(--cc,#06b6d4);background:rgba(6,182,212,0.07);color:#c8c8e8}
.city-pill:hover:not(.selected){border-color:#222238;background:#0a0a14}
.phase-bar{height:5px;border-radius:2px;transition:width 0.4s ease}
.tier-badge{display:inline-block;padding:1px 5px;border-radius:2px;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600}
`;

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
const API_KEYS = {
  harvard:     'a3035be7-f66f-43fe-9062-4ab34c9a3875',
  rijks:       null,   // key expired (410 Gone) — set a valid key from data.rijksmuseum.nl to re-enable
  smithsonian: 'Za1PpHOkwo3bCWaBVJzP68yM8Fr61aSeUMnMaUgc',
  europeana:   'athtyllial',
};

const MUSEUM_META = {
  harvard:     { label:'Harvard',     color:'#ef4444', bg:'rgba(239,68,68,0.1)',    dailyLimit:2500  },
  met:         { label:'Met',         color:'#f97316', bg:'rgba(249,115,22,0.1)',   dailyLimit:null  },
  rijks:       { label:'Rijks',       color:'#3b82f6', bg:'rgba(59,130,246,0.1)',   dailyLimit:10000 },
  aic:         { label:'AIC',         color:'#8b5cf6', bg:'rgba(139,92,246,0.1)',   dailyLimit:null  },
  cleveland:   { label:'Cleveland',   color:'#06b6d4', bg:'rgba(6,182,212,0.1)',    dailyLimit:null  },
  smithsonian: { label:'Smithsonian', color:'#10b981', bg:'rgba(16,185,129,0.1)',   dailyLimit:1000  },
  europeana:   { label:'Europeana',   color:'#f59e0b', bg:'rgba(245,158,11,0.1)',   dailyLimit:10000 },
  wikidata:    { label:'Wikidata',    color:'#fbbf24', bg:'rgba(251,191,36,0.1)',   dailyLimit:1000  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// CITY AFFINITY SYSTEM
// Each city has match dicts keyed by lowercase substrings.
// computeCityScore checks cluster fields against these dicts for multipliers.
// identity × movement stack multiplicatively; dynasty adds partial bonus.
// ═══════════════════════════════════════════════════════════════════════════════
const CITY_AFFINITIES = {
  paris:     { name:'Paris',     flag:'🇫🇷', region:'W. Europe',
    culture:    {french:2.0,flemish:1.4,burgundian:1.5},
    movement:   {impressionism:2.0,'post-impressionism':1.8,'art nouveau':1.7,rococo:1.6,realism:1.5,fauvism:1.8,cubism:1.6,naturalism:1.4,symbolism:1.5,'barbizon school':1.6},
    nationality:{french:1.9,belgian:1.5},
    origin:     {france:1.7,paris:1.9,'île-de-france':1.8},
    dynasty:    {},
  },
  amsterdam: { name:'Amsterdam', flag:'🇳🇱', region:'W. Europe',
    culture:    {dutch:2.0,flemish:1.8,netherlandish:2.0},
    movement:   {'dutch golden age':2.0,baroque:1.6,'northern renaissance':1.7,'dutch realism':1.8},
    nationality:{dutch:2.0,flemish:1.8,netherlandish:1.9},
    origin:     {netherlands:1.9,amsterdam:2.0,delft:1.9,leiden:1.8,haarlem:1.8,'the hague':1.6},
    dynasty:    {},
  },
  tokyo:     { name:'Tokyo',     flag:'🇯🇵', region:'E. Asia',
    culture:    {japanese:2.0,japan:1.9,'east asian':1.6,asian:1.3},
    movement:   {'ukiyo-e':2.0,impressionism:1.6,'post-impressionism':1.5,japonisme:2.0,'nihonga':1.9},
    nationality:{japanese:2.0},
    origin:     {japan:2.0,tokyo:1.9,kyoto:1.9,edo:2.0,osaka:1.7},
    dynasty:    {edo:2.0,meiji:1.9,heian:1.6,muromachi:1.5,momoyama:1.6,kamakura:1.5},
  },
  new_york:  { name:'New York',  flag:'🇺🇸', region:'N. America',
    culture:    {american:1.9,'north american':1.6},
    movement:   {'abstract expressionism':2.0,'new york school':2.0,modern:1.8,'pop art':1.9,minimalism:1.8,contemporary:1.7},
    nationality:{american:1.9},
    origin:     {'united states':1.8,'new york':2.0},
    dynasty:    {},
  },
  london:    { name:'London',    flag:'🇬🇧', region:'W. Europe',
    culture:    {british:1.9,english:1.8,celtic:1.4},
    movement:   {'pre-raphaelite':1.9,romanticism:1.7,'british romanticism':1.9,'arts and crafts':1.6,impressionism:1.4},
    nationality:{british:1.9,english:1.8,scottish:1.6,irish:1.5},
    origin:     {'united kingdom':1.8,'great britain':1.8,england:1.7,london:1.9},
    dynasty:    {},
  },
  rome:      { name:'Rome',      flag:'🇮🇹', region:'S. Europe',
    culture:    {italian:2.0,roman:1.9},
    movement:   {renaissance:2.0,baroque:1.8,'high renaissance':2.0,mannerism:1.7,neoclassicism:1.7},
    nationality:{italian:2.0},
    origin:     {italy:1.8,rome:2.0,florence:1.8,venice:1.8,naples:1.6},
    dynasty:    {},
  },
  madrid:    { name:'Madrid',    flag:'🇪🇸', region:'S. Europe',
    culture:    {spanish:2.0,castilian:1.8},
    movement:   {baroque:1.9,surrealism:1.8,'spanish baroque':2.0,cubism:1.6,romanticism:1.5},
    nationality:{spanish:2.0,catalan:1.7},
    origin:     {spain:1.9,madrid:2.0,seville:1.8,'toledo':1.7,barcelona:1.7},
    dynasty:    {},
  },
  cairo:     { name:'Cairo',     flag:'🇪🇬', region:'N. Africa',
    culture:    {'ancient egyptian':1.9,egyptian:1.9,islamic:2.0,coptic:1.7,byzantine:1.5},
    movement:   {'islamic art':2.0,'ancient art':1.8},
    nationality:{egyptian:1.9},
    origin:     {egypt:1.9,cairo:2.0},
    dynasty:    {'eighteenth dynasty':2.0,'new kingdom':1.9,'old kingdom':1.8,'middle kingdom':1.8,ptolemaic:1.9,fatimid:1.8,mamluk:1.7},
  },
  beijing:   { name:'Beijing',   flag:'🇨🇳', region:'E. Asia',
    culture:    {chinese:2.0,china:1.9,'east asian':1.7,tibetan:1.5},
    movement:   {'chinese painting':2.0,'ink painting':1.9,'buddhist art':1.6,'literati':1.8},
    nationality:{chinese:2.0},
    origin:     {china:2.0,beijing:2.0,'imperial china':1.9,tibet:1.6},
    dynasty:    {ming:2.0,qing:2.0,song:1.9,tang:1.9,yuan:1.8,han:1.8,zhou:1.7,sui:1.6},
  },
  sao_paulo: { name:'São Paulo', flag:'🇧🇷', region:'S. America',
    culture:    {'latin american':2.0,brazilian:2.0,'south american':1.7},
    movement:   {'latin american modernism':2.0,modernism:1.6,baroque:1.4},
    nationality:{brazilian:2.0},
    origin:     {brazil:2.0,'latin america':1.9,'south america':1.7},
    dynasty:    {},
  },
  berlin:    { name:'Berlin',    flag:'🇩🇪', region:'C. Europe',
    culture:    {german:1.9,'austro-hungarian':1.5,austrian:1.4},
    movement:   {expressionism:2.0,bauhaus:2.0,'german expressionism':2.0,'new objectivity':1.9,romanticism:1.6,'northern renaissance':1.6},
    nationality:{german:1.9,austrian:1.5,swiss:1.4},
    origin:     {germany:1.9,berlin:2.0,munich:1.8,dresden:1.6},
    dynasty:    {},
  },
  moscow:    { name:'Moscow',    flag:'🇷🇺', region:'E. Europe',
    culture:    {russian:2.0},
    movement:   {'russian avant-garde':2.0,constructivism:2.0,suprematism:1.9,realism:1.7,'socialist realism':1.6,symbolism:1.5},
    nationality:{russian:2.0,soviet:1.7,ukrainian:1.5},
    origin:     {russia:2.0,moscow:2.0,'saint petersburg':1.8},
    dynasty:    {romanov:1.7},
  },
  vienna:    { name:'Vienna',    flag:'🇦🇹', region:'C. Europe',
    culture:    {austrian:2.0,'austro-hungarian':1.9,german:1.4,czech:1.4},
    movement:   {'viennese secession':2.0,'vienna secession':2.0,'art nouveau':1.9,symbolism:1.8,expressionism:1.6,baroque:1.6},
    nationality:{austrian:2.0},
    origin:     {austria:2.0,vienna:2.0},
    dynasty:    {habsburg:1.9},
  },
  istanbul:  { name:'Istanbul',  flag:'🇹🇷', region:'Middle East',
    culture:    {ottoman:2.0,byzantine:1.9,turkish:1.9,islamic:1.7},
    movement:   {'islamic art':1.9,'ottoman miniature':2.0},
    nationality:{turkish:2.0},
    origin:     {turkey:1.9,istanbul:2.0,constantinople:1.9},
    dynasty:    {ottoman:2.0,byzantine:1.9,seljuk:1.6},
  },
  florence:  { name:'Florence',  flag:'🇮🇹', region:'S. Europe',
    culture:    {italian:2.0,florentine:2.0,tuscan:1.9},
    movement:   {renaissance:2.0,'early renaissance':2.0,'high renaissance':1.9,'italian renaissance':2.0,mannerism:1.8},
    nationality:{italian:2.0},
    origin:     {florence:2.0,tuscany:1.9,italy:1.7},
    dynasty:    {medici:2.0},
  },
  chicago:   { name:'Chicago',   flag:'🇺🇸', region:'N. America',
    culture:    {american:1.8},
    movement:   {impressionism:1.9,'post-impressionism':1.9,'american modernism':1.7,realism:1.6,'regionalism':1.7},
    nationality:{american:1.8,french:1.5},
    origin:     {'united states':1.6,chicago:2.0},
    dynasty:    {},
  },
  seoul:     { name:'Seoul',     flag:'🇰🇷', region:'E. Asia',
    culture:    {korean:2.0,korea:1.9,'east asian':1.6},
    movement:   {'korean painting':2.0,dansaekhwa:1.9,'minjung art':1.7},
    nationality:{korean:2.0},
    origin:     {korea:2.0,seoul:2.0},
    dynasty:    {joseon:2.0,goryeo:1.9,silla:1.6,chosun:2.0},
  },
  mumbai:    { name:'Mumbai',    flag:'🇮🇳', region:'S. Asia',
    culture:    {indian:2.0,'south asian':1.7,mughal:1.9,rajput:1.7,buddhist:1.5},
    movement:   {'mughal painting':2.0,'rajput painting':1.9,'company painting':1.7,'bengal school':1.7},
    nationality:{indian:2.0},
    origin:     {india:2.0,mumbai:1.8,rajasthan:1.7,bengal:1.6},
    dynasty:    {mughal:2.0,maurya:1.6,gupta:1.6,rajput:1.7},
  },
  sydney:    { name:'Sydney',    flag:'🇦🇺', region:'Oceania',
    culture:    {australian:2.0,aboriginal:2.0,'pacific':1.5,british:1.4},
    movement:   {'australian impressionism':2.0,'heidelberg school':2.0,contemporary:1.5},
    nationality:{australian:2.0,british:1.4},
    origin:     {australia:2.0,sydney:2.0},
    dynasty:    {},
  },
  lisbon:    { name:'Lisbon',    flag:'🇵🇹', region:'W. Europe',
    culture:    {portuguese:2.0,iberian:1.5},
    movement:   {baroque:1.7,'portuguese renaissance':2.0,azulejo:1.9,mannerism:1.5},
    nationality:{portuguese:2.0},
    origin:     {portugal:2.0,lisbon:2.0},
    dynasty:    {avis:1.7,braganza:1.6},
  },
};

const SEARCH_MODES = [
  { id:'standard', icon:'◈', label:'Standard',    color:'#fbbf24', desc:'Full 8-stage pipeline across all museums. Best for known artists and titles.' },
  { id:'artist',   icon:'◉', label:'Artist',      color:'#ef4444', desc:'Expands artist name variants aggressively. Prioritizes artist match in ranking.' },
  { id:'movement', icon:'⬡', label:'Movement',    color:'#8b5cf6', desc:'Searches by art movement via Wikidata SPARQL + AIC style filter.' },
  { id:'city',     icon:'⊞', label:'City Scout',  color:'#06b6d4', desc:'Finds paintings that perform best in a chosen city. Re-ranks by city affinity.' },
  { id:'demand',   icon:'▲', label:'Top Demand',  color:'#10b981', desc:'Surfaces the most-viewed works globally. Emphasizes Harvard pageViews and rank.' },
  { id:'curate',   icon:'⊕', label:'Curate Hunt', color:'#f97316', desc:'Rich color + thematic metadata for building visually coherent curated sets.' },
];

const STAGE_DEFS = [
  { key:'graph',       icon:'◈', label:'Graph',       perf:'0ms'  },
  { key:'wikidata',    icon:'⬡', label:'Wikidata',    perf:'~2s'  },
  { key:'fetch',       icon:'⤓', label:'Fetch',       perf:'~5s'  },
  { key:'phash',       icon:'⊞', label:'pHash',       perf:'<1ms' },
  { key:'fingerprint', icon:'◉', label:'Fingerprint', perf:'0ms'  },
  { key:'cluster',     icon:'⋈', label:'Cluster',     perf:'~3ms' },
  { key:'score',       icon:'▲', label:'Score',       perf:'0ms'  },
  { key:'enrich',      icon:'⊕', label:'Enrich',      perf:'~4s'  },
];

const INIT_STAGES = Object.fromEntries(
  STAGE_DEFS.map(s => [s.key, { status:'idle', count:0, message:'', perMuseum:{} }])
);

const TITLE_VARIANTS = {
  'water lilies':  ['nymphéas','waterlelies','seerosen','nenúfares'],
  'starry night':  ['nuit étoilée','sterrennacht','notte stellata'],
  'sunflowers':    ['tournesols','zonnebloemen','sonnenblumen','girasoles'],
  'self portrait': ['autoportrait','zelfportret','autoritratto','selbstporträt'],
  'landscape':     ['paysage','landschaft','landschap','paesaggio'],
  'portrait':      ['portret','ritratto','retrato','bildnis'],
  'madonna':       ['vierge','virgin','maria','madonne'],
};

const ARTIST_VARIANTS = {
  'monet':      ['claude monet','oscar-claude monet'],
  'van gogh':   ['vincent van gogh','vincent willem van gogh'],
  'rembrandt':  ['rembrandt van rijn','rembrandtus van rijn'],
  'picasso':    ['pablo picasso','pablo ruiz picasso'],
  'cezanne':    ['paul cézanne','paul cezanne'],
  'renoir':     ['pierre-auguste renoir','auguste renoir'],
  'degas':      ['edgar degas','edgar de gas'],
  'vermeer':    ['johannes vermeer','jan vermeer'],
  'rubens':     ['peter paul rubens','petrus paulus rubens'],
  'raphael':    ['raffaello sanzio','raffaello'],
  'titian':     ['tiziano vecellio','tiziano'],
  'velazquez':  ['diego velázquez','diego velazquez'],
  'goya':       ['francisco goya','francisco de goya'],
  'caravaggio': ['michelangelo merisi','merisi da caravaggio'],
  'klimt':      ['gustav klimt'],
  'matisse':    ['henri matisse'],
};

const RELATED_ARTISTS = {
  'monet':     ['renoir','pissarro','degas','sisley'],
  'van gogh':  ['gauguin','seurat','cezanne'],
  'rembrandt': ['vermeer','hals'],
  'picasso':   ['braque','matisse'],
  'klimt':     ['schiele'],
  'raphael':   ['michelangelo','titian'],
};

const CONF_COLORS = {
  exact:  { text:'#22c55e', bg:'rgba(34,197,94,0.09)',  border:'rgba(34,197,94,0.22)' },
  high:   { text:'#3b82f6', bg:'rgba(59,130,246,0.09)', border:'rgba(59,130,246,0.22)' },
  medium: { text:'#f59e0b', bg:'rgba(245,158,11,0.09)', border:'rgba(245,158,11,0.22)' },
  low:    { text:'#f97316', bg:'rgba(249,115,22,0.09)', border:'rgba(249,115,22,0.22)' },
  none:   { text:'#404060', bg:'rgba(64,64,96,0.09)',   border:'rgba(64,64,96,0.18)'  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: CREDIT TRACKER
// ═══════════════════════════════════════════════════════════════════════════════
class CreditTracker {
  constructor() {
    this.session = {};
    this.daily   = {};
    this._listeners = [];
    Object.keys(MUSEUM_META).forEach(m => {
      this.session[m] = { req:0, res:0, err:0 };
      this.daily[m]   = 0;
    });
  }
  async load() {
    try {
      const today = new Date().toDateString();
      const d = await window.storage.get(`art-credits-${today}`);
      if (d?.value) this.daily = { ...this.daily, ...JSON.parse(d.value) };
    } catch(_) {}
  }
  async save() {
    try {
      const today = new Date().toDateString();
      await window.storage.set(`art-credits-${today}`, JSON.stringify(this.daily));
    } catch(_) {}
  }
  record(museum, type = 'req', n = 1) {
    if (!this.session[museum]) this.session[museum] = { req:0, res:0, err:0 };
    if (type === 'req')  { this.session[museum].req += n; this.daily[museum] = (this.daily[museum]||0) + n; }
    else if (type==='res') this.session[museum].res += n;
    else if (type==='err') this.session[museum].err += n;
    this._listeners.forEach(fn => fn());
  }
  totalSessionReqs() { return Object.values(this.session).reduce((s,v) => s+v.req, 0); }
  pctUsed(museum) {
    const lim = MUSEUM_META[museum]?.dailyLimit;
    return lim ? Math.min(100, ((this.daily[museum]||0) / lim) * 100) : 0;
  }
  nearLimit(museum) { const p = this.pctUsed(museum); return p >= 80; }
  atLimit(museum)   { const p = this.pctUsed(museum); return p >= 100; }
  subscribe(fn) { this._listeners.push(fn); return () => { this._listeners = this._listeners.filter(f => f !== fn); }; }
  snapshot() { return { session: JSON.parse(JSON.stringify(this.session)), daily: { ...this.daily } }; }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: SELF-LEARNER
// ═══════════════════════════════════════════════════════════════════════════════
class SelfLearner {
  constructor() { this.data = { queries:{}, museumPerf:{} }; }
  async load() {
    try {
      const d = await window.storage.get('art-learner-v2');
      if (d?.value) this.data = { ...this.data, ...JSON.parse(d.value) };
    } catch(_) {}
  }
  async save() {
    try {
      const trimmed = Object.entries(this.data.queries)
        .sort((a,b) => (b[1].hits||0)-(a[1].hits||0)).slice(0,80);
      this.data.queries = Object.fromEntries(trimmed);
      await window.storage.set('art-learner-v2', JSON.stringify(this.data));
    } catch(_) {}
  }
  record(query, resultCount, multiCount, museumBreakdown) {
    const q = query.toLowerCase().trim();
    if (!this.data.queries[q]) this.data.queries[q] = { hits:0, totalResults:0, multi:0 };
    this.data.queries[q].hits++;
    this.data.queries[q].totalResults += resultCount;
    this.data.queries[q].multi += multiCount;
    this.data.queries[q].lastSearch = Date.now();
    if (!this.data.museumPerf[q]) this.data.museumPerf[q] = {};
    Object.entries(museumBreakdown||{}).forEach(([m,v]) => {
      this.data.museumPerf[q][m] = (this.data.museumPerf[q][m]||0) + v;
    });
    this.save();
  }
  getSuggestions(query) {
    const q = query.toLowerCase().trim();
    const s = new Set();
    for (const [a, related] of Object.entries(RELATED_ARTISTS)) {
      if (q.includes(a)) related.forEach(r => s.add(r));
      if (related.some(r => q.includes(r))) s.add(a);
    }
    Object.entries(this.data.queries)
      .filter(([k,v]) => k !== q && (v.multi||0) > 0)
      .sort((a,b) => (b[1].multi||0)-(a[1].multi||0))
      .slice(0,3).forEach(([k]) => s.add(k));
    return [...s].slice(0,6);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: CONNECTION GRAPH
// ═══════════════════════════════════════════════════════════════════════════════
class ConnectionGraph {
  constructor() { this.connections = []; this.loaded = false; }
  async load() {
    try {
      const d = await window.storage.get('art-graph-v3');
      if (d?.value) this.connections = JSON.parse(d.value);
      this.loaded = true;
    } catch(_) { this.connections = []; this.loaded = true; }
  }
  async save() {
    try {
      this.connections = this.connections
        .sort((a,b) => (b.hitCount||0)-(a.hitCount||0))
        .slice(0, 600);
      await window.storage.set('art-graph-v3', JSON.stringify(this.connections));
    } catch(_) {}
  }
  lookup(qNorm) {
    if (!qNorm) return [];
    return this.connections.filter(c =>
      c.signals?.artistLast?.includes(qNorm) ||
      c.signals?.titleNorm?.includes(qNorm)   ||
      c.signals?.queryTerms?.includes(qNorm)
    );
  }
  addConnection(cluster, queryTerm) {
    if (!cluster.artistNorm && !cluster.titleNorm) return;
    const key = `${cluster.artistNorm}::${cluster.titleNorm}`;
    const existing = this.connections.find(c => c.key === key);
    if (existing) {
      const newNodes = cluster.sources.filter(s =>
        !existing.nodes.find(n => n.museum===s.source && n.accId===s.id)
      );
      existing.nodes.push(...newNodes.map(s => ({ museum:s.source, accId:s.id })));
      existing.hitCount = (existing.hitCount||0) + 1;
      existing.verifiedAt = Date.now();
    } else {
      this.connections.push({
        id: `g${Date.now().toString(36)}`,
        key,
        nodes: cluster.sources.map(s => ({ museum:s.source, accId:s.id })),
        signals: {
          artistLast: cluster.artistNorm||'',
          titleNorm:  cluster.titleNorm||'',
          decade:     cluster.decade,
          queryTerms: queryTerm,
        },
        confidence: cluster.confidence,
        hitCount: 1,
        verifiedAt: Date.now(),
        createdAt: Date.now(),
      });
    }
  }
  async clear() { this.connections = []; await this.save(); }
  getStats() {
    const totalNodes  = this.connections.reduce((s,c) => s+(c.nodes?.length||0), 0);
    const multiMuseum = this.connections.filter(c => (c.nodes?.length||0) > 1).length;
    return {
      total: this.connections.length,
      nodes: totalNodes,
      multi: multiMuseum,
      avg:   this.connections.length ? (totalNodes/this.connections.length).toFixed(1) : '0',
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: COLLECTION MANAGER
// ═══════════════════════════════════════════════════════════════════════════════
class CollectionManager {
  constructor() { this.cols = {}; }
  async load() {
    try {
      const d = await window.storage.get('art-collections-v2');
      if (d?.value) this.cols = JSON.parse(d.value);
    } catch(_) {}
  }
  async save() {
    try { await window.storage.set('art-collections-v2', JSON.stringify(this.cols)); } catch(_) {}
  }
  create(name) {
    const id = `c${Date.now().toString(36)}`;
    this.cols[id] = { id, name, items:[], createdAt:Date.now() };
    this.save(); return id;
  }
  add(colId, artwork) {
    const col = this.cols[colId]; if (!col) return false;
    const key = `${artwork.sources?.[0]?.source}:${artwork.id}`;
    if (col.items.find(i => `${i.sources?.[0]?.source}:${i.id}` === key)) return false;
    col.items.push({
      id:artwork.id, title:artwork.title, artist:artwork.artist,
      date:artwork.date, imageUrl:artwork.imageUrl, sources:artwork.sources,
      confidence:artwork.confidence, richness:artwork.richness,
    });
    this.save(); return true;
  }
  remove(colId, itemId) {
    if (!this.cols[colId]) return;
    this.cols[colId].items = this.cols[colId].items.filter(i => i.id !== itemId);
    this.save();
  }
  delete(colId) { delete this.cols[colId]; this.save(); }
  all() { return Object.values(this.cols); }
  exportJSON(colId) {
    const col = this.cols[colId];
    if (!col) return null;
    return JSON.stringify({
      collection: col.name,
      exported: new Date().toISOString(),
      count: col.items.length,
      artworks: col.items,
    }, null, 2);
  }
  totalItems() { return Object.values(this.cols).reduce((s,c) => s+c.items.length, 0); }
  museumDiversity(colId) {
    const col = this.cols[colId]; if (!col) return [];
    const counts = {};
    col.items.forEach(item => {
      (item.sources||[]).forEach(s => { counts[s.source] = (counts[s.source]||0)+1; });
    });
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: WIKIDATA RESOLVER
// ═══════════════════════════════════════════════════════════════════════════════
class WikidataResolver {
  async query(term, credits) {
    credits?.record('wikidata','req',1);
    const sparql = `
SELECT DISTINCT ?item ?itemLabel ?image ?metId ?harvardId ?rijksId ?aicId ?date
  ?movementLabel ?genreLabel ?materialLabel ?locationLabel ?originLabel ?wikidataId WHERE {
  ?item wdt:P31 wd:Q3305213.
  {
    ?item wdt:P170 ?artist.
    ?artist rdfs:label ?al FILTER(CONTAINS(LCASE(STR(?al)),"${term.toLowerCase()}"))
  } UNION {
    ?item rdfs:label ?tl FILTER(CONTAINS(LCASE(STR(?tl)),"${term.toLowerCase()}"))
  }
  OPTIONAL { ?item wdt:P3634 ?metId }
  OPTIONAL { ?item wdt:P9063 ?harvardId }
  OPTIONAL { ?item wdt:P350  ?rijksId }
  OPTIONAL { ?item wdt:P3372 ?aicId }
  OPTIONAL { ?item wdt:P18   ?image }
  OPTIONAL { ?item wdt:P571  ?date }
  OPTIONAL { ?item wdt:P135  ?movement }
  OPTIONAL { ?item wdt:P136  ?genre }
  OPTIONAL { ?item wdt:P186  ?material }
  OPTIONAL { ?item wdt:P276  ?location }
  OPTIONAL { ?item wdt:P495  ?origin }
  BIND(STRAFTER(STR(?item), "entity/") AS ?wikidataId)
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} LIMIT 80`;
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 8000);
      const resp = await fetch(
        `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(sparql)}`,
        { headers:{'Accept':'application/sparql-results+json'}, signal:ctrl.signal }
      );
      clearTimeout(t);
      if (!resp.ok) return { items:[], directIds:[] };
      const data = await resp.json();
      const items = (data.results?.bindings||[]).map(b => ({
        wikidataId: b.wikidataId?.value || b.item?.value?.split('/').pop(),
        title:    b.itemLabel?.value || 'Unknown',
        imageUrl: b.image?.value,
        date:     b.date?.value?.slice(0,4) || null,
        movement: b.movementLabel?.value || null,
        genre:    b.genreLabel?.value || null,
        material: b.materialLabel?.value || null,
        location: b.locationLabel?.value || null,
        origin:   b.originLabel?.value || null,
        knownIds: { met:b.metId?.value||null, harvard:b.harvardId?.value||null, rijks:b.rijksId?.value||null, aic:b.aicId?.value||null },
      }));
      credits?.record('wikidata','res',items.length);
      const directIds = [];
      for (const it of items) for (const [m,id] of Object.entries(it.knownIds)) if(id) directIds.push({museum:m,id,item:it});
      return { items, directIds };
    } catch(_) { credits?.record('wikidata','err',1); return { items:[], directIds:[] }; }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: pHASH ENGINE
// ═══════════════════════════════════════════════════════════════════════════════
class PHashEngine {
  async hash(imageUrl, onDebug) {
    return new Promise(resolve => {
      if (!imageUrl) return resolve(null);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      const timer = setTimeout(() => resolve(null), 6000);
      img.onload = () => {
        clearTimeout(timer);
        try {
          // 32×32 for DCT
          const c32 = document.createElement('canvas'); c32.width=32; c32.height=32;
          const ctx32 = c32.getContext('2d'); ctx32.drawImage(img,0,0,32,32);
          const px32 = ctx32.getImageData(0,0,32,32).data;

          // 8×8 colour thumbnail
          const c8 = document.createElement('canvas'); c8.width=8; c8.height=8;
          c8.getContext('2d').drawImage(img,0,0,8,8);
          const px8 = c8.getContext('2d').getImageData(0,0,8,8).data;
          const thumb = Array.from({length:64},(_,i)=>({ r:px8[i*4],g:px8[i*4+1],b:px8[i*4+2] }));

          // 8×8 grayscale (from 32×32 sampled every 4)
          const gray = Array.from({length:8},(_,row)=>
            Array.from({length:8},(_,col)=>{
              const i=(row*4*32+col*4); return 0.299*px32[i*4]+0.587*px32[i*4+1]+0.114*px32[i*4+2];
            })
          );

          // DCT 8×8
          const N=8;
          const dct = Array.from({length:N},(_,u)=>
            Array.from({length:N},(_,v)=>{
              let s=0;
              for(let x=0;x<N;x++) for(let y=0;y<N;y++) s+=gray[x][y]*Math.cos((2*x+1)*u*Math.PI/(2*N))*Math.cos((2*y+1)*v*Math.PI/(2*N));
              return (2/N)*(u===0?1/Math.SQRT2:1)*(v===0?1/Math.SQRT2:1)*s;
            })
          );

          // Hash: skip DC [0][0], compare rest to mean
          const vals = dct.flat().slice(1,65);
          const avg  = vals.reduce((s,v)=>s+v,0)/vals.length;
          const bits = vals.map(v=>v>avg?1:0);
          const hash = bits.join('');

          if (onDebug) {
            // Normalize DCT excl DC for colour mapping
            const flat = dct.flat().slice(1);
            const mn=Math.min(...flat), mx=Math.max(...flat);
            const norm = dct.map((row,r)=>row.map((v,c)=>(r===0&&c===0)?0.5:(v-mn)/(mx-mn+1e-9)));
            onDebug({ imageUrl, thumb, gray, dctNorm:norm, bits, hash });
          }
          resolve(hash);
        } catch(_){ resolve(null); }
      };
      img.onerror = ()=>{ clearTimeout(timer); resolve(null); };
      img.src = imageUrl;
    });
  }
  hamming(a,b){ if(!a||!b||a.length!==b.length)return 99; let d=0; for(let i=0;i<a.length;i++)if(a[i]!==b[i])d++; return d; }
  similar(a,b,t=12){ return this.hamming(a,b)<=t; }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: QUERY EXPANDER
// ═══════════════════════════════════════════════════════════════════════════════
function expandQuery(query) {
  const q = query.toLowerCase().trim();
  const v = new Set([query]);
  for (const [k,ns] of Object.entries(ARTIST_VARIANTS)) {
    if (q.includes(k)||ns.some(n=>q.includes(n.toLowerCase()))) { ns.forEach(n=>v.add(n)); v.add(k); }
  }
  for (const [k,ts] of Object.entries(TITLE_VARIANTS)) {
    if (q.includes(k)) ts.forEach(t=>v.add(t));
  }
  return [...v];
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: SUPABASE POOL  (shared across all users/sessions)
// ═══════════════════════════════════════════════════════════════════════════════
function clusterToRow(a) {
  return {
    source_key:          `${a.source}:${a.id}`,
    source:              a.source || null,
    source_id:           String(a.id),
    title:               a.title || null,
    artist:              a.artist !== 'Unknown' ? a.artist : null,
    artist_nationality:  a.artistNationality || null,
    artist_begin_date:   a.artistBeginDate || null,
    artist_end_date:     a.artistEndDate || null,
    date_display:        a.date !== 'N/A' ? a.date : null,
    medium:              a.medium || null,
    dimensions:          a.dimensions || null,
    culture:             a.culture || null,
    period:              a.period || null,
    movement:            a.movement || null,
    genre:               a.genre || null,
    place_of_origin:     a.placeOfOrigin || null,
    credit_line:         a.creditLine || null,
    accession_year:      a.accessionYear || null,
    provenance_text:     typeof a.provenanceText==='string' ? a.provenanceText : null,
    exhibition_history:  typeof a.exhibitionHistory==='string' ? a.exhibitionHistory : null,
    publication_history: typeof a.publicationHistory==='string' ? a.publicationHistory : null,
    fun_fact:            a.funFact || null,
    wall_description:    a.wallDescription || null,
    inscriptions:        a.inscriptions || null,
    century:             a.century || null,
    icon_class:          a.iconClass || null,
    object_name:         a.objectName || null,
    object_url:          typeof a.objectURL==='string' ? a.objectURL : null,
    gallery_title:       a.galleryTitle || null,
    gallery_number:      a.galleryNumber || null,
    tags:                a.tags?.length ? a.tags : null,
    subject_titles:      a.subjectTitles?.length ? a.subjectTitles : null,
    style_titles:        a.styleTitles?.length ? a.styleTitles : null,
    materials:           a.materials?.length ? a.materials : null,
    techniques:          a.techniques?.length ? a.techniques : null,
    production_places:   a.productionPlaces?.length ? a.productionPlaces : null,
    constituents:        a.constituents?.length ? a.constituents : null,
    colors:              a.colors?.length ? a.colors : null,
    harvard_colors:      a.harvardColors?.length ? a.harvardColors : null,
    aic_dominant_color:  a.aicDominantColor || null,
    colorfulness:        a.colorfulness ?? null,
    is_highlight:        !!a.isHighlight,
    is_public_domain:    !!a.isPublicDomain,
    is_on_view:          !!a.isOnView,
    wikidata_id:         a.wikidataId || null,
    wikidata_verified:   !!a.wikidataVerified,
    confidence:          a.confidence || null,
    richness_score:      a.richness?.total ?? null,
    total_page_views:    a.totalPageViews || null,
    harvard_rank:        a.rank || null,
    exhibition_count:    a.exhibitionCount || null,
    publication_count:   a.publicationCount || null,
    fiscal_year_acq:     a.fiscalYearAcquisition || null,
    image_url:           a.imageUrl || null,
    enriched_at:         new Date().toISOString(),
  };
}

function rowToArtwork(r) {
  return {
    id:                  r.source_id,
    source:              r.source,
    title:               r.title || 'Untitled',
    artist:              r.artist || 'Unknown',
    artistNationality:   (r.artist_nationality && r.artist_nationality.length <= 50 && !/produced by|inc\.|designed by/i.test(r.artist_nationality)) ? r.artist_nationality : null,
    artistBeginDate:     r.artist_begin_date,
    artistEndDate:       r.artist_end_date,
    date:                r.date_display || 'N/A',
    medium:              r.medium,
    dimensions:          r.dimensions,
    culture:             r.culture,
    period:              r.period,
    movement:            r.movement,
    genre:               r.genre,
    placeOfOrigin:       r.place_of_origin,
    creditLine:          r.credit_line,
    accessionYear:       r.accession_year,
    provenanceText:      r.provenance_text,
    exhibitionHistory:   r.exhibition_history,
    publicationHistory:  r.publication_history,
    funFact:             r.fun_fact,
    wallDescription:     r.wall_description,
    inscriptions:        r.inscriptions,
    century:             r.century,
    iconClass:           r.icon_class,
    objectName:          r.object_name,
    objectURL:           r.object_url,
    galleryTitle:        r.gallery_title,
    galleryNumber:       r.gallery_number,
    tags:                r.tags || [],
    subjectTitles:       r.subject_titles || [],
    styleTitles:         r.style_titles || [],
    materials:           r.materials || [],
    techniques:          r.techniques || [],
    productionPlaces:    r.production_places || [],
    constituents:        r.constituents || [],
    colors:              r.colors || [],
    harvardColors:       r.harvard_colors || [],
    aicDominantColor:    r.aic_dominant_color,
    colorfulness:        r.colorfulness,
    isHighlight:         r.is_highlight,
    isPublicDomain:      r.is_public_domain,
    isOnView:            r.is_on_view,
    wikidataId:          r.wikidata_id,
    wikidataVerified:    r.wikidata_verified,
    confidence:          r.confidence,
    totalPageViews:      r.total_page_views,
    rank:                r.harvard_rank,
    exhibitionCount:     r.exhibition_count,
    publicationCount:    r.publication_count,
    fiscalYearAcquisition: r.fiscal_year_acq,
    imageUrl:            r.stored_image_url || r.image_url,
    pHash:               null,
  };
}

// LIMITED_CREDIT_SOURCES: APIs with daily caps — save their images to avoid re-fetching
const LIMITED_CREDIT_SOURCES = new Set(['harvard','smithsonian','europeana']);

async function storePublicImage(imageUrl, sourceKey) {
  if (!imageUrl || typeof imageUrl !== 'string') return null;
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return null;
    const blob = await res.blob();
    const ext = blob.type.includes('png') ? 'png' : 'jpg';
    const path = `${sourceKey.replace(':','/')}.${ext}`;
    const { error } = await supabase.storage.from('painting-images').upload(path, blob, { upsert: true, contentType: blob.type });
    if (error) return null;
    const { data } = supabase.storage.from('painting-images').getPublicUrl(path);
    return data?.publicUrl || null;
  } catch(e) { return null; }
}

// Accepts both raw mkArt objects and enriched cluster objects.
// Saves one row per source entry so the clustering step can re-merge on load.
async function poolSave(items) {
  if (!items?.length) return;
  try {
    const rows = [];
    for (const item of items) {
      // Cluster object (has sources[]) — save one row per source
      const sources = item.sources?.length ? item.sources : [{ source: item.source, id: item.id }];
      for (const s of sources) {
        if (!s.source || !s.id) continue;
        const sourceKey = `${s.source}:${s.id}`;
        let storedImageUrl = null;
        // Save image only for public domain paintings from limited-credit APIs
        if (item.isPublicDomain && LIMITED_CREDIT_SOURCES.has(s.source) && item.imageUrl) {
          storedImageUrl = await storePublicImage(item.imageUrl, sourceKey);
        }
        rows.push({ ...clusterToRow({ ...item, source: s.source, id: s.id }), stored_image_url: storedImageUrl });
      }
    }
    if (!rows.length) return;
    const { error } = await supabase.from('paintings').upsert(rows, { onConflict: 'source_key', ignoreDuplicates: false });
    if (error) console.warn('[pool] save error:', error.message);
  } catch(e) { console.warn('[pool] save failed:', e.message); }
}

async function poolLoad() {
  try {
    const { data } = await supabase
      .from('paintings')
      .select('*')
      .order('richness_score', { ascending: false })
      .limit(500);
    return (data || []).map(rowToArtwork);
  } catch(e) { return []; }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: FETCHERS
// ═══════════════════════════════════════════════════════════════════════════════
// Strips "(Nationality, YYYY–YYYY)" from Met/AIC display strings and extracts metadata.
// Returns { name, nationality, beginDate, endDate } — all nullable except name.
const _INLINE_PAREN = /^(.*?)\s*\(([A-Z][a-z][^,)0-9]{0,25}?)(?:,\s*(?:born\s+)?(\d{4})(?:\s*[–\-]\s*(\d{4}))?)?\)\s*$/;
const _NAT_META     = /^([A-Za-z][^,\d]*?)(?:,\s*(?:born\s+)?(\d{4})(?:\s*[–\-]\s*(\d{4}))?)?$/;
function parseArtistDisplay(str) {
  if (!str) return { name: null, nationality: null, beginDate: null, endDate: null };
  // AIC: "Name\nNationality, YYYY–YYYY" (may have extra lines for production credits)
  const nl = str.indexOf('\n');
  if (nl > 0) {
    const name = str.slice(0, nl).trim();
    // Use only the first meta line; further lines are production credits, not nationality
    const meta = str.slice(nl + 1).split('\n')[0].trim();
    const m = meta.match(_NAT_META);
    if (m) return { name, nationality: m[1].trim() || null, beginDate: m[2] || null, endDate: m[3] || null };
    // meta wasn't a clean nationality — try inline parenthetical in name
    const mInline = name.match(_INLINE_PAREN);
    if (mInline?.[2]) return { name: mInline[1].trim(), nationality: mInline[2].trim(), beginDate: mInline[3] || null, endDate: mInline[4] || null };
    return { name, nationality: null, beginDate: null, endDate: null };
  }
  // Met / inline: "Name (Nationality, YYYY–YYYY)" or "Name (Nationality)"
  const m = str.match(_INLINE_PAREN);
  if (m?.[2]) return { name: m[1].trim(), nationality: m[2].trim(), beginDate: m[3] || null, endDate: m[4] || null };
  return { name: str.trim(), nationality: null, beginDate: null, endDate: null };
}

const mkArt=(id,title,artist,date,imageUrl,source,extra={})=>({
  id:String(id||Math.random().toString(36).slice(2)),
  title:title||'Untitled', artist:artist||'Unknown', date:date||'N/A',
  imageUrl:imageUrl||null, source, pHash:null, ...extra,
});
const dedup=arr=>{const s=new Set();return arr.filter(a=>{const k=a.source+a.id;return s.has(k)?false:(s.add(k),true);});};

function makeFetchers(credits) {
  return {
    harvard: async (q, deep) => {
      const queries=expandQuery(q).slice(0,deep?3:2); const res=[];
      for(const qq of queries) for(const p of (deep?[1,2]:[1])){
        credits.record('harvard','req',1);
        try{
          const r=await fetch(`https://api.harvardartmuseums.org/object?classification=Paintings&q=${encodeURIComponent(qq)}&size=60&page=${p}&fields=id,title,people,dated,primaryimageurl,technique,dimensions&apikey=${API_KEYS.harvard}`).then(r=>r.json());
          const items=r.records||[]; credits.record('harvard','res',items.length);
          items.forEach(x=>res.push(mkArt(x.id,x.title,x.people?.[0]?.name,x.dated,x.primaryimageurl,'harvard',{medium:x.technique,dimensions:x.dimensions})));
        }catch{credits.record('harvard','err',1);}
      }
      return dedup(res);
    },
    met: async (q, deep) => {
      try{
        credits.record('met','req',1);
        const s=await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${encodeURIComponent(q)}&hasImages=true`).then(r=>r.json());
        const ids=(s.objectIDs||[]).slice(0,deep?80:50); const res=[];
        for(let i=0;i<ids.length;i+=8){
          const batch=ids.slice(i,i+8); credits.record('met','req',batch.length);
          const settled=await Promise.allSettled(batch.map(id=>fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`).then(r=>r.json())));
          settled.forEach(r=>{if(r.status==='fulfilled'&&r.value.primaryImage){const d=r.value;const _ap=parseArtistDisplay(d.artistDisplayName);res.push(mkArt(d.objectID,d.title,_ap.name||d.artistDisplayName,d.objectDate,d.primaryImage,'met',{
            medium:d.medium,
            dimensions:(d.objectHeight||d.objectWidth)?`${d.objectHeight||'?'}×${d.objectWidth||'?'}`:null,
            culture:d.culture||null,
            period:d.period||null,
            dynasty:d.dynasty||null,
            artistNationality:d.artistNationality||null,
            artistBeginDate:d.artistBeginDate||null,
            artistEndDate:d.artistEndDate||null,
            creditLine:d.creditLine||null,
            galleryNumber:d.GalleryNumber?String(d.GalleryNumber):null,
            isHighlight:!!d.isHighlight,
            isPublicDomain:!!d.isPublicDomain,
            classification:d.classification||null,
            tags:(d.tags||[]).map(t=>t.term||String(t)).filter(Boolean),
            objectName:d.objectName||null,
            objectURL:d.objectURL||null,
            isOnView:!!(d.GalleryNumber),
            galleryTitle:d.GalleryNumber?`Gallery ${d.GalleryNumber}`:null,
            constituents:(d.constituents||[]).map(c=>c.name).filter(Boolean),
          }));}});
        }
        credits.record('met','res',res.length); return res;
      }catch{credits.record('met','err',1);return[];}
    },
    rijks: async (q, deep) => {
      if (!API_KEYS.rijks) return []; // key not configured
      const queries=expandQuery(q).slice(0,deep?3:2); const res=[];
      for(const qq of queries) for(const p of (deep?[1,2]:[1])){
        credits.record('rijks','req',1);
        try{
          const r=await fetch(`https://www.rijksmuseum.nl/api/en/collection?key=${API_KEYS.rijks}&q=${encodeURIComponent(qq)}&type=painting&imgonly=True&ps=60&p=${p}`).then(r=>r.json());
          const items=r.artObjects||[]; credits.record('rijks','res',items.length);
          items.forEach(x=>res.push(mkArt(x.objectNumber,x.title,x.principalOrFirstMaker,x.dating?.presentingDate,x.webImage?.url,'rijks',{
            productionPlaces:(x.productionPlaces||[]),
            subjectTitles:(x.objectTypes||[]),
          })));
        }catch{credits.record('rijks','err',1);}
      }
      return dedup(res);
    },
    aic: async (q, deep) => {
      const res=[];
      for(const p of (deep?[1,2,3]:[1,2])){
        credits.record('aic','req',1);
        try{
          const r=await fetch(`https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(q)}&query[term][artwork_type_id]=1&page=${p}&limit=60&fields=id,title,artist_display,date_display,image_id,medium_display,dimensions`).then(r=>r.json());
          const items=r.data||[]; credits.record('aic','res',items.length);
          items.forEach(x=>{const _ap=parseArtistDisplay(x.artist_display);res.push(mkArt(x.id,x.title,_ap.name||x.artist_display,x.date_display,x.image_id?`https://www.artic.edu/iiif/2/${x.image_id}/full/843,/0/default.jpg`:null,'aic',{medium:x.medium_display,dimensions:x.dimensions,artistNationality:_ap.nationality||null,artistBeginDate:_ap.beginDate||null,artistEndDate:_ap.endDate||null}));});
        }catch{credits.record('aic','err',1);}
      }
      return res;
    },
    cleveland: async (q, deep) => {
      const res=[];
      for(const p of (deep?[1,2]:[1])){
        credits.record('cleveland','req',1);
        try{
          const r=await fetch(`https://openaccess-api.clevelandart.org/api/artworks/?q=${encodeURIComponent(q)}&type=Painting&has_image=1&limit=60&skip=${(p-1)*60}`).then(r=>r.json());
          const items=r.data||[]; credits.record('cleveland','res',items.length);
          items.forEach(x=>res.push(mkArt(x.id,x.title,x.creators?.[0]?.description,x.creation_date,x.images?.web?.url,'cleveland',{medium:x.technique,dimensions:x.measurements})));
        }catch{credits.record('cleveland','err',1);}
      }
      return res;
    },
    smithsonian: async (q, deep) => {
      const res=[];
      for(const p of (deep?[1,2]:[1])){
        credits.record('smithsonian','req',1);
        try{
          const r=await fetch(`https://api.si.edu/openaccess/api/v1.0/search?q=${encodeURIComponent(q)}&type=edanmdm&online_media_type=Images&rows=40&start=${(p-1)*40}&api_key=${API_KEYS.smithsonian}`).then(r=>r.json());
          const items=r.response?.rows||[]; credits.record('smithsonian','res',items.length);
          items.forEach(x=>res.push(mkArt(x.id,x.title,x.content?.freetext?.name?.[0]?.content,x.content?.freetext?.date?.[0]?.content,x.content?.descriptiveNonRepeating?.online_media?.media?.[0]?.thumbnail,'smithsonian')));
        }catch{credits.record('smithsonian','err',1);}
      }
      return res;
    },
    europeana: async (q, deep) => {
      const res=[];
      for(const p of (deep?[1,2]:[1])){
        credits.record('europeana','req',1);
        try{
          const r=await fetch(`https://api.europeana.eu/record/v2/search.json?wskey=${API_KEYS.europeana}&query=${encodeURIComponent(q)}&qf=TYPE:IMAGE&rows=40&start=${(p-1)*40+1}`).then(r=>r.json());
          const items=r.items||[]; credits.record('europeana','res',items.length);
          items.forEach(x=>res.push(mkArt(x.id,Array.isArray(x.title)?x.title[0]:x.title,Array.isArray(x.dcCreator)?x.dcCreator[0]:x.dcCreator,x.year?.[0],x.edmPreview?.[0],'europeana')));
        }catch{credits.record('europeana','err',1);}
      }
      return res;
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: MATCHER
// ═══════════════════════════════════════════════════════════════════════════════
class Matcher {
  clean(t){
    if(!t||t==='N/A'||t==='Unknown')return'';
    return t.toLowerCase().replace(/[^\w\s]/g,'').replace(/\b(the|a|an|le|la|les|el|il|de|het|van|der|des|du)\b/g,'').replace(/\s+/g,' ').trim();
  }
  lastName(a){if(!a||a==='Unknown')return'';const p=this.clean(a).split(' ');return p[p.length-1]||'';}
  decade(d){if(!d)return null;const m=d.match(/\d{4}/);return m?Math.floor(parseInt(m[0])/10)*10:null;}
  similarity(a,b){
    if(!a||!b)return 0;
    const l=a.length>=b.length?a:b,s=a.length<b.length?a:b;
    if(!l.length)return 1;
    return(l.length-this._ed(l,s))/l.length;
  }
  _ed(a,b){
    const dp=Array.from({length:a.length+1},(_,i)=>[i]);
    for(let j=0;j<=b.length;j++)dp[0][j]=j;
    for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j-1],dp[i-1][j],dp[i][j-1]);
    return dp[a.length][b.length];
  }
  match(a1,a2){
    const t1=this.clean(a1.title),t2=this.clean(a2.title);
    const ar1=this.clean(a1.artist),ar2=this.clean(a2.artist);
    const l1=this.lastName(a1.artist),l2=this.lastName(a2.artist);
    if(!t1||!t2)return{score:0,reasons:[],confidence:'none'};
    if(t1===t2&&ar1===ar2)return{score:1.0,reasons:['Exact title+artist'],confidence:'exact'};
    let score=0;const reasons=[];
    if(l1&&l1===l2){
      score+=0.4;reasons.push('Artist ✓');
      const w1=t1.split(' ').filter(w=>w.length>3),w2=t2.split(' ').filter(w=>w.length>3);
      if(w1.length&&w2.length){const ov=w1.filter(w=>w2.includes(w)).length/Math.max(w1.length,w2.length);if(ov>0.4){score+=ov*0.5;reasons.push(`Title ${Math.round(ov*100)}%`);}}
    }
    const ts=this.similarity(t1,t2),as=this.similarity(ar1,ar2);
    if(as>0.7){const f=ts*0.4+as*0.3;if(f>score){score=f;reasons.push(`Fuzzy A${Math.round(as*100)}%T${Math.round(ts*100)}%`);}}
    const d1=this.decade(a1.date),d2=this.decade(a2.date);
    if(d1&&d2){if(d1===d2){score+=0.05;reasons.push('Decade ✓');}else if(Math.abs(d1-d2)>20){score*=0.7;reasons.push('⚠ Date gap');}}
    const conf=score>=0.85?'exact':score>=0.70?'high':score>=0.50?'medium':score>=0.32?'low':'none';
    return{score,reasons,confidence:conf};
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: FINGERPRINTER
// ═══════════════════════════════════════════════════════════════════════════════
class Fingerprinter {
  mediumClass(m){
    if(!m)return'?';const s=m.toLowerCase();
    if(s.includes('oil'))return'oil';if(s.includes('watercolor')||s.includes('watercolour'))return'wc';
    if(s.includes('tempera'))return'tmp';if(s.includes('acrylic'))return'acr';
    if(s.includes('fresco'))return'fre';if(s.includes('pastel'))return'pas';
    if(s.includes('gouache'))return'gou';return'oth';
  }
  dimBucket(d){
    if(!d)return null;const m=d.match(/(\d+\.?\d*)\s*[x×]\s*(\d+\.?\d*)/i);
    if(!m)return null;return`${Math.round(parseFloat(m[1])/5)*5}x${Math.round(parseFloat(m[2])/5)*5}`;
  }
  buildMap(artworks, matcher){
    const map=new Map();
    artworks.forEach((aw,i)=>{
      const last=matcher.lastName(aw.artist),dec=matcher.decade(aw.date),med=this.mediumClass(aw.medium);
      if(!last)return;
      const wk=`${last}__${dec}__${med}`;
      const dim=this.dimBucket(aw.dimensions);
      const key=dim?`${wk}__${dim}`:wk;
      if(!map.has(key))map.set(key,[]);
      map.get(key).push(i);
    });
    return map;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: RICHNESS SCORER
// query + matcher are required for relevance component — always pass them.
// ═══════════════════════════════════════════════════════════════════════════════
function scoreRichness(cluster, query='', matcher=null){
  const bd={};let raw=0;
  const museums=[...new Set(cluster.sources.map(s=>s.source))];

  // ── QUERY RELEVANCE (highest weight — determines ranking within results) ────
  // Without this, unrelated AIC/Harvard paintings dominate every search.
  if(query&&matcher){
    const qt=matcher.clean(query);
    const ct=matcher.clean(cluster.title||'');
    const ca=matcher.clean(cluster.artist||'');
    const cl=matcher.lastName(cluster.artist||'');
    // Title match — most important
    const tScore=ct?matcher.similarity(qt,ct):0;
    // Artist match — secondary (searching "monet" should surface his paintings)
    const aScore=cl?(qt.includes(cl)?1:matcher.similarity(qt,ca)):0;
    const relevance=Math.max(tScore, aScore*0.85);
    bd.queryTitle  = Math.round(tScore*60);    raw+=bd.queryTitle;   // max 60
    bd.queryArtist = Math.round(aScore*40);    raw+=bd.queryArtist;  // max 40
    // Exact artist-last-name hit: flat bonus so "monet" → all Monet paintings rise
    bd.queryExact  = (cl&&qt===cl)?20:0;       raw+=bd.queryExact;
  }

  // ── CROSS-DATABASE PRESENCE (exponential — multi-museum = objectively verified) ──
  // Single-source paintings should never outrank multi-museum ones.
  const n=museums.length;
  bd.museums = n===1?8 : n===2?50 : n===3?75 : n===4?90 : 100;      raw+=bd.museums;
  bd.wikidata  = cluster.wikidataVerified ? 25 : 0;                   raw+=bd.wikidata;
  bd.pHash     = cluster.pHashMatched     ? 18 : 0;                   raw+=bd.pHash;
  bd.conns     = Math.min(cluster.connections.length,8)*5;            raw+=bd.conns;    // max 40
  bd.graphHit  = cluster.graphHit         ? 10 : 0;                   raw+=bd.graphHit;

  // ── CORE IDENTITY ───────────────────────────────────────────────────────────
  bd.image     = cluster.imageUrl ? 15 : 0;                           raw+=bd.image;
  bd.date      = (cluster.date&&cluster.date!=='N/A') ? 10 : 0;      raw+=bd.date;
  bd.artist    = (cluster.artist&&cluster.artist!=='Unknown') ? 10 : 0; raw+=bd.artist;
  bd.medium    = cluster.artworks.some(a=>a.medium)     ?  8 : 0;    raw+=bd.medium;
  bd.dims      = cluster.artworks.some(a=>a.dimensions) ?  5 : 0;    raw+=bd.dims;

  // ── PRESTIGE / LEGAL ────────────────────────────────────────────────────────
  bd.highlight = cluster.isHighlight    ? 15 : 0;                     raw+=bd.highlight;
  bd.pubDomain = cluster.isPublicDomain ?  8 : 0;                     raw+=bd.pubDomain;
  bd.onView    = cluster.isOnView       ?  6 : 0;                     raw+=bd.onView;

  // ── MARKET DEMAND ───────────────────────────────────────────────────────────
  const pvLog  = cluster.totalPageViews?Math.min(12,Math.round(Math.log10(cluster.totalPageViews+1)*3.5)):0;
  bd.pageViews = pvLog;                                                raw+=bd.pageViews;
  bd.rank      = cluster.rank?(cluster.rank<=500?12:cluster.rank<=2000?7:cluster.rank<=10000?3:0):0; raw+=bd.rank;

  // ── EXHIBITION / PUBLICATION HISTORY (capped — text presence alone shouldn't dominate) ──
  bd.exhibitions  = Math.min(cluster.exhibitionCount  ||0,8)*2;      raw+=bd.exhibitions;  // max 16
  bd.publications = Math.min(cluster.publicationCount ||0,6)*1;      raw+=bd.publications; // max  6
  // Text bonuses are small — they indicate depth not fame
  bd.exhibitText  = cluster.exhibitionHistory  ?  4 : 0;             raw+=bd.exhibitText;
  bd.publicatText = cluster.publicationHistory ?  2 : 0;             raw+=bd.publicatText;

  // ── CURATORIAL METADATA (curate phase signals) ──────────────────────────────
  const hasColors=(cluster.colors?.length||0)+(cluster.harvardColors?.length||0)>0;
  bd.colors       = hasColors ? 15 : 0;                               raw+=bd.colors;
  bd.culture      = cluster.culture            ?  8 : 0;             raw+=bd.culture;
  bd.period       = cluster.period             ?  6 : 0;             raw+=bd.period;
  bd.nationality  = cluster.artistNationality  ?  4 : 0;             raw+=bd.nationality;
  bd.origin       = cluster.placeOfOrigin      ?  4 : 0;             raw+=bd.origin;
  bd.movement     = cluster.movement           ?  5 : 0;             raw+=bd.movement;
  bd.genre        = cluster.genre              ?  4 : 0;             raw+=bd.genre;

  // ── SUBJECT / THEMATIC DEPTH (capped — AIC returns 30+ tags, others return 3) ──
  const tagTotal=(cluster.tags?.length||0)+(cluster.subjectTitles?.length||0)+(cluster.styleTitles?.length||0);
  bd.subjects     = Math.min(tagTotal,8)*1;                           raw+=bd.subjects;  // max 8 (was 12)
  bd.iconClass    = cluster.iconClass ?  5 : 0;                      raw+=bd.iconClass;
  bd.depicts      = (cluster.depicts?.length||0)>0 ? 4 : 0;         raw+=bd.depicts;

  // ── PROVENANCE / ACQUISITION ────────────────────────────────────────────────
  bd.provenance   = cluster.provenanceText   ?  5 : 0;               raw+=bd.provenance;
  bd.creditLine   = cluster.creditLine       ?  3 : 0;               raw+=bd.creditLine;
  bd.acqYear      = cluster.accessionYear    ?  3 : 0;               raw+=bd.acqYear;
  bd.fiscalYear   = cluster.fiscalYearAcquisition ? 2 : 0;           raw+=bd.fiscalYear;

  // ── PHYSICAL / DISPLAY CONTEXT ──────────────────────────────────────────────
  bd.gallery      = cluster.galleryTitle     ?  4 : 0;               raw+=bd.gallery;
  bd.materials    = (cluster.materials?.length||0)>0 ? 5 : 0;       raw+=bd.materials;
  bd.techniques   = (cluster.techniques?.length||0)>0 ? 4 : 0;      raw+=bd.techniques;
  bd.prodPlaces   = (cluster.productionPlaces?.length||0)>0 ? 4 : 0; raw+=bd.prodPlaces;
  bd.colorfulness = cluster.colorfulness!=null ? 3 : 0;              raw+=bd.colorfulness;

  // ── EXTRA FACTS ─────────────────────────────────────────────────────────────
  bd.funFact      = cluster.funFact         ?  4 : 0;                raw+=bd.funFact;
  bd.inscriptions = cluster.inscriptions    ?  3 : 0;                raw+=bd.inscriptions;
  bd.artistDates  = cluster.artistBeginDate ?  3 : 0;                raw+=bd.artistDates;
  bd.objectURL    = cluster.objectURL       ?  2 : 0;                raw+=bd.objectURL;

  // Confidence multiplier: exact cross-museum match → strong boost; unverified → penalty
  const mult={exact:1.5,high:1.25,medium:1.0,low:0.65,none:0.45};
  const total=Math.round(raw*(mult[cluster.confidence]||1.0));
  const max=520;
  return{total,breakdown:bd,max,pct:Math.min(100,Math.round(total/max*100))};
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: CITY AFFINITY SCORER
// Handles the varied metadata coverage problem fairly:
// - A Dutch painting with only 'culture' field still gets 2.0× in Amsterdam
// - A well-documented French Impressionist can reach 4.0× in Paris (culture × movement)
// - Works with zero cultural metadata get the baseline 1.0× everywhere (no penalty)
// ═══════════════════════════════════════════════════════════════════════════════
// City keywords found in provenance/exhibition/publication text → soft boost.
// These are intentionally conservative (max 1.3×) so text never dominates over hard metadata.
const CITY_TEXT_HINTS = {
  paris:     ['paris','versailles','louvre','france','french'],
  amsterdam: ['amsterdam','netherlands','dutch','holland','rijksmuseum'],
  new_york:  ['new york','nyc','manhattan','durand-ruel new york','sotheby\'s new york','christie\'s new york'],
  london:    ['london','england','british','tate','national gallery london'],
  berlin:    ['berlin','germany','german','munich','munich'],
  chicago:   ['chicago','art institute of chicago'],
  rome:      ['rome','italy','italian','naples','milan'],
  madrid:    ['madrid','spain','spanish','prado'],
  moscow:    ['moscow','russia','russian','st. petersburg','hermitage'],
  vienna:    ['vienna','austria','austrian','kunsthistorisches'],
  florence:  ['florence','florentine','uffizi','tuscany'],
  tokyo:     ['tokyo','japan','japanese','kyoto','osaka'],
  beijing:   ['beijing','china','chinese','shanghai'],
  istanbul:  ['istanbul','ottoman','constantinople','turkey','turkish'],
  cairo:     ['cairo','egypt','egyptian'],
  sao_paulo: ['são paulo','sao paulo','brazil','brazilian','rio de janeiro'],
  seoul:     ['seoul','korea','korean'],
  mumbai:    ['mumbai','india','indian','delhi','calcutta'],
};
function textCityBoost(cluster, cityKey) {
  const hints = CITY_TEXT_HINTS[cityKey];
  if (!hints) return 1.0;
  const text = [cluster.provenanceText, cluster.exhibitionHistory, cluster.publicationHistory]
    .filter(s => typeof s === 'string').join(' ').toLowerCase();
  if (!text) return 1.0;
  let hits = 0;
  for (const h of hints) { let i = 0; while ((i = text.indexOf(h, i)) !== -1) { hits++; i += h.length; } }
  return hits >= 5 ? 1.3 : hits >= 2 ? 1.15 : hits >= 1 ? 1.05 : 1.0;
}

function computeCityScore(cluster, cityKey) {
  const city = CITY_AFFINITIES[cityKey];
  if (!city) return { mult:1.0, adjusted:100, factors:[], tier:'D', name:'?', flag:'' };

  const factors = [];

  // Checks a single string value against a match-dict; returns best mult found.
  // Mutates factors[] as a side-effect (only adds entries when mult > 1.0).
  function bestMatch(val, dict, fieldLabel) {
    if (!val || !dict) return 1.0;
    const v = (typeof val === 'string' ? val : String(val)).toLowerCase();
    if (!v) return 1.0;
    let top = 1.0, topKey = '';
    for (const [k, m] of Object.entries(dict)) {
      if (v.includes(k) && m > top) { top = m; topKey = k; }
    }
    if (top > 1.0) factors.push({ field: fieldLabel, value: val, matched: topKey, mult: top });
    return top;
  }

  // ── Identity axis: culture / nationality / place of origin ──────────────────
  const cM = bestMatch(cluster.culture,          city.culture,    'culture');
  const nM = bestMatch(cluster.artistNationality, city.nationality,'nationality');
  const oM = bestMatch(cluster.placeOfOrigin,     city.origin,     'origin');

  // ── Dynasty axis: dynasty / period (partial bonus, doesn't multiply fully) ──
  const dM = bestMatch(cluster.dynasty, city.dynasty, 'dynasty');
  const pM = bestMatch(cluster.period,  city.dynasty, 'period');
  const dynastyMult = Math.max(dM, pM); // pick best dynasty signal

  // ── Movement axis: cluster.movement + all styleTitles entries ───────────────
  const movSources = [cluster.movement, ...(cluster.styleTitles || [])].filter(Boolean);
  let mM = 1.0;
  for (const s of movSources) {
    const m = bestMatch(s, city.movement, 'movement');
    if (m > mM) mM = m;
  }

  // ── Combine ─────────────────────────────────────────────────────────────────
  // Identity and movement are independent cultural axes → multiply.
  // Dynasty adds a partial bonus (60% of its excess) so it rewards but doesn't dominate.
  const identity = Math.max(cM, nM, oM);
  let mult = identity * mM;
  if (dynastyMult > 1.0) mult = mult * (1 + (dynastyMult - 1) * 0.6);
  // Provenance / exhibition text mentions — soft final layer
  const tB = textCityBoost(cluster, cityKey);
  if (tB > 1.0) { mult *= tB; factors.push({ field:'text', value:`provenance/exhibition mentions`, matched:cityKey, mult:tB }); }
  mult = Math.round(Math.min(4.5, mult) * 100) / 100;

  const adjusted = Math.round(100 * mult);
  const tier = adjusted >= 350 ? 'S' : adjusted >= 240 ? 'A' : adjusted >= 160 ? 'B' : adjusted >= 115 ? 'C' : 'D';

  return { mult, adjusted, factors, tier, name: city.name, flag: city.flag };
}

function computeAllCityScores(cluster) {
  return Object.entries(CITY_AFFINITIES)
    .map(([key]) => ({ key, ...computeCityScore(cluster, key) }))
    .sort((a, b) => b.mult - a.mult);
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: PHASE SCORE CALCULATOR
// Consistent formula regardless of which DBs hold the painting.
// Uses only fields actually present; no field absence is penalized beyond
// what the richness scorer already handles.
// ═══════════════════════════════════════════════════════════════════════════════
function computePhaseScores(cluster) {
  const medium = (cluster.medium || cluster.artworks?.find(a => a.medium)?.medium || '').toLowerCase();
  const hasColors = (cluster.colors?.length || 0) + (cluster.harvardColors?.length || 0) > 0;

  // ── BIDDING: 0–100 market value signal ──────────────────────────────────────
  let bid = 35;
  const bidBreak = {};
  if (cluster.isHighlight)      { bid += 20; bidBreak['★ Highlight']     = '+20'; }
  const n = cluster.sources.length;
  const mBonus = n >= 4 ? 20 : n >= 3 ? 14 : n >= 2 ? 8 : 0;
  if (mBonus)                   { bid += mBonus; bidBreak[`${n} museums`] = `+${mBonus}`; }
  if (cluster.wikidataVerified) { bid +=  5; bidBreak['Wikidata ✓']       = '+5'; }
  if (cluster.totalPageViews) {
    const pv = Math.min(15, Math.round(Math.log10(cluster.totalPageViews + 1) * 4));
    bid += pv; bidBreak[`${cluster.totalPageViews.toLocaleString()} views`] = `+${pv}`;
  }
  if (cluster.rank) {
    const rb = cluster.rank <= 100 ? 15 : cluster.rank <= 500 ? 10 : cluster.rank <= 2000 ? 5 : 2;
    bid += rb; bidBreak[`Rank #${cluster.rank}`] = `+${rb}`;
  }
  if (cluster.provenanceText)               { bid += 6; bidBreak['Provenance doc.'] = '+6'; }
  if ((cluster.exhibitionCount || 0) >= 5)  { bid += 5; bidBreak[`${cluster.exhibitionCount} exhibitions`] = '+5'; }
  if (cluster.isPublicDomain)               { bid += 3; bidBreak['Public domain']   = '+3'; }
  bid = Math.min(100, bid);

  // ── EXHIBITION BASE: 0–100 (multiply by city affinity for actual value) ─────
  let exh = 35;
  const exhBreak = {};
  if (cluster.isHighlight) { exh += 20; exhBreak['★ Highlight']    = '+20'; }
  if (cluster.isOnView)    { exh +=  8; exhBreak['On view']         = '+8'; }
  if (hasColors)           { exh +=  8; exhBreak['Color data']      = '+8'; }
  if (cluster.colorfulness != null) {
    const cv = Math.min(8, Math.round(cluster.colorfulness / 12));
    exh += cv; exhBreak['Colorfulness'] = `+${cv}`;
  }
  if (cluster.funFact)                            { exh += 6; exhBreak['Fun fact']        = '+6'; }
  if (cluster.movement || cluster.styleTitles?.length) { exh += 5; exhBreak['Movement ID'] = '+5'; }
  if ((cluster.exhibitionCount || 0) >= 3)        { exh += 5; exhBreak['Exhibition track record'] = '+5'; }
  if (cluster.wallDescription || cluster.inscriptions) { exh += 4; exhBreak['Wall text']  = '+4'; }
  exh = Math.min(100, exh);

  // ── TRAVEL: qualitative fragility + cost + size ──────────────────────────────
  let fragility = 'Standard', travelCost = 'Medium', travelNote = '';
  if (medium.includes('fresco') || medium.includes('mural')) {
    fragility = 'Immovable'; travelCost = 'N/A'; travelNote = 'Fresco cannot travel';
  } else if (medium.includes('panel') || medium.includes('wood')) {
    fragility = 'Fragile'; travelCost = 'High'; travelNote = 'Panel needs climate control';
  } else if (medium.includes('paper') || medium.includes('watercolor') || medium.includes('drawing')) {
    fragility = 'Delicate'; travelCost = 'Low'; travelNote = 'Light but light-sensitive';
  } else if (medium.includes('canvas')) {
    fragility = 'Standard'; travelCost = 'Medium';
  }
  if (!cluster.isOnView && cluster.isOnView !== undefined) {
    travelNote = travelNote ? travelNote + ' · not on loan' : 'Not currently on loan';
  }
  let size = '?';
  const dimStr = cluster.dimensions || cluster.artworks?.find(a => a.dimensions)?.dimensions || '';
  const dm = dimStr.match(/(\d+\.?\d*)\s*[x×]\s*(\d+\.?\d*)/i);
  if (dm) {
    const area = parseFloat(dm[1]) * parseFloat(dm[2]);
    size = area > 40000 ? 'Monumental' : area > 10000 ? 'Large' : area > 2500 ? 'Medium' : 'Small';
  }

  // ── CURATE: signals for arrangement quality ──────────────────────────────────
  // Uses only fields actually present — fairly accounts for varied DB coverage.
  const curateSignals = {
    medium:   !!(medium),
    color:    hasColors || !!cluster.aicDominantColor,
    thematic: (cluster.tags?.length || 0) + (cluster.subjectTitles?.length || 0) >= 3,
    movement: !!(cluster.movement || cluster.styleTitles?.length),
    date:     !!(cluster.date && cluster.date !== 'N/A'),
    cultural: !!(cluster.culture || cluster.period || cluster.artistNationality),
  };
  const curateScore = Object.values(curateSignals).filter(Boolean).length; // 0–6

  // Anchor: well-documented prestigious works anchor curated sets
  const anchorPts = (cluster.isHighlight ? 2 : 0) + (n >= 3 ? 2 : 0) + ((cluster.totalPageViews || 0) >= 10000 ? 1 : 0);
  const isAnchor = anchorPts >= 3;

  return {
    bid:        { score: bid, breakdown: bidBreak },
    exhibition: { score: exh, breakdown: exhBreak, note: '× city affinity multiplier' },
    travel:     { fragility, cost: travelCost, size, note: travelNote },
    curate:     { score: curateScore, max: 6, signals: curateSignals, isAnchor },
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: DETAIL FETCHER  (fires after clustering, top N only)
// ═══════════════════════════════════════════════════════════════════════════════
async function fetchDetail(source, id, credits) {
  try {
    switch(source) {
      case 'rijks': {
        credits.record('rijks','req',1);
        const r=await fetch(`https://www.rijksmuseum.nl/api/en/collection/${id}?key=${API_KEYS.rijks}&format=json`).then(r=>r.json());
        credits.record('rijks','res',1);
        const a=r.artObject; if(!a) return null;
        return {
          colors:       (a.colors||[]).map(c=>({hex:c.hex,pct:c.percentage})),
          materials:    (a.materials||[]).filter(Boolean),
          techniques:   (a.techniques||[]).filter(Boolean),
          productionPlaces:(a.productionPlaces||[]).filter(Boolean),
          historicalPersons:(a.historicalPersons||[]).filter(Boolean),
          iconClass:    (a.classification?.iconClassDescription||[]).join('; ')||null,
          subjectTitles:(a.objectTypes||[]).filter(Boolean),
          isOnView:     !!a.location,
          galleryTitle: a.location||null,
          provenanceText: a.acquisition?.creditLine||null,
          creditLine:   a.acquisition?.creditLine||null,
          inscriptions: a.physicalMedium||null,
          objectURL:    a.links?.web||null,
        };
      }
      case 'harvard': {
        credits.record('harvard','req',1);
        const r=await fetch(`https://api.harvardartmuseums.org/object/${id}?fields=rank,totalPageViews,exhibitioncount,publicationcount,colors,classification,culture,period,century,accessionyear,accessionmethod,creditline,provenance,url,technique,dimensions,century&apikey=${API_KEYS.harvard}`).then(r=>r.json());
        credits.record('harvard','res',1);
        return {
          rank:            r.rank||null,
          totalPageViews:  r.totalPageViews||null,
          exhibitionCount: r.exhibitioncount||0,
          publicationCount:r.publicationcount||0,
          harvardColors:   (r.colors||[]).map(c=>({hex:c.color,pct:c.spectrum})),
          classification:  r.classification||null,
          culture:         r.culture||null,
          period:          r.period||null,
          century:         r.century||null,
          accessionYear:   r.accessionyear||null,
          creditLine:      r.creditline||null,
          provenanceText:  r.provenance||null,
          objectURL:       r.url||null,
        };
      }
      case 'aic': {
        credits.record('aic','req',1);
        const r=await fetch(`https://api.artic.edu/api/v1/artworks/${id}?fields=exhibition_history,publication_history,subject_titles,style_title,classification_titles,is_on_view,gallery_title,fiscal_year_of_acquisition,provenance_text,inscriptions,place_of_origin,colorfulness,color,copyright_notice`).then(r=>r.json());
        credits.record('aic','res',1);
        const d=r.data; if(!d) return null;
        return {
          exhibitionHistory:   d.exhibition_history||null,
          publicationHistory:  d.publication_history||null,
          subjectTitles:       (d.subject_titles||[]).filter(Boolean),
          styleTitles:         [d.style_title].filter(Boolean),
          classificationTitles:(d.classification_titles||[]).filter(Boolean),
          isOnView:            !!d.is_on_view,
          galleryTitle:        d.gallery_title||null,
          fiscalYearAcquisition:d.fiscal_year_of_acquisition||null,
          provenanceText:      d.provenance_text||null,
          inscriptions:        d.inscriptions||null,
          placeOfOrigin:       d.place_of_origin||null,
          colorfulness:        d.colorfulness??null,
          aicDominantColor:    d.color?`hsl(${d.color.h},${d.color.s}%,${d.color.l}%)`:null,
        };
      }
      case 'cleveland': {
        credits.record('cleveland','req',1);
        const r=await fetch(`https://openaccess-api.clevelandart.org/api/artworks/${id}`).then(r=>r.json());
        credits.record('cleveland','res',1);
        const d=r.data; if(!d) return null;
        return {
          provenanceText:    Array.isArray(d.provenance)?d.provenance.map(p=>typeof p==='string'?p:(p.description||'').trim()).filter(Boolean).join('\n'):(d.provenance||null),
          exhibitionHistory: Array.isArray(d.exhibitions)?d.exhibitions.map(e=>typeof e==='string'?e:(e.title||e.description||'')).filter(Boolean).join('\n'):null,
          exhibitionCount:   Array.isArray(d.exhibitions)?d.exhibitions.length:0,
          creditLine:        d.creditline||null,
          culture:           d.culture||null,
          period:            d.department||null,
          funFact:           d.fun_fact||null,
          wallDescription:   d.wall_description||null,
          inscriptions:      d.inscriptions||null,
          techniques:        d.technique?[d.technique]:[],
          isOnView:          !!d.current_location,
          galleryTitle:      d.current_location||null,
          objectURL:         d.url||null,
        };
      }
      default: return null;
    }
  } catch(_) { return null; }
}

function mergeDetail(cluster, source, detail) {
  if (!cluster.detail) cluster.detail={};
  cluster.detail[source]=detail;

  // Scalar fields: first-wins
  const scalars=['culture','period','dynasty','creditLine','galleryNumber','isHighlight','isPublicDomain',
    'classification','objectName','objectURL','isOnView','galleryTitle','artistNationality',
    'artistBeginDate','artistEndDate','accessionYear','provenanceText','exhibitionHistory',
    'publicationHistory','placeOfOrigin','funFact','wallDescription','fiscalYearAcquisition',
    'inscriptions','rank','totalPageViews','century','colorfulness','iconClass','aicDominantColor'];
  scalars.forEach(f=>{if(!cluster[f]&&detail[f]!=null)cluster[f]=detail[f];});

  // Booleans: OR (any source says true → true)
  if(detail.isHighlight)   cluster.isHighlight=true;
  if(detail.isPublicDomain)cluster.isPublicDomain=true;
  if(detail.isOnView)      cluster.isOnView=true;

  // Numerics: take max
  if((detail.exhibitionCount||0)>(cluster.exhibitionCount||0))   cluster.exhibitionCount=detail.exhibitionCount;
  if((detail.publicationCount||0)>(cluster.publicationCount||0)) cluster.publicationCount=detail.publicationCount;
  if((detail.totalPageViews||0)>(cluster.totalPageViews||0))     cluster.totalPageViews=detail.totalPageViews;
  if(detail.rank&&(!cluster.rank||detail.rank<cluster.rank))     cluster.rank=detail.rank;

  // Arrays: union merge (deduplicated strings)
  const arrFields={
    colors:'colors', harvardColors:'harvardColors', materials:'materials',
    techniques:'techniques', productionPlaces:'productionPlaces',
    historicalPersons:'historicalPersons', tags:'tags', subjectTitles:'subjectTitles',
    styleTitles:'styleTitles', classificationTitles:'classificationTitles', depicts:'depicts',
  };
  Object.entries(arrFields).forEach(([df,cf])=>{
    if(detail[df]?.length){
      const existing=new Set((cluster[cf]||[]).map(x=>typeof x==='string'?x:x.hex||JSON.stringify(x)));
      const newItems=(detail[df]||[]).filter(x=>{const k=typeof x==='string'?x:x.hex||JSON.stringify(x);return!existing.has(k);});
      cluster[cf]=[...(cluster[cf]||[]),...newItems];
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: CLUSTER BUILDER
// ═══════════════════════════════════════════════════════════════════════════════
function buildClusters(artworks, matcher, pHashEngine, fpMap, wikidataItems){
  const processed=new Set(),clusters=[],confOrd={exact:4,high:3,medium:2,low:1,none:0};
  const hashed=artworks.filter(a=>a.pHash);
  const pPairs=new Set();
  for(let i=0;i<hashed.length;i++)for(let j=i+1;j<hashed.length;j++)
    if(pHashEngine.similar(hashed[i].pHash,hashed[j].pHash))
      pPairs.add(`${hashed[i].source}:${hashed[i].id}__${hashed[j].source}:${hashed[j].id}`);
  const isPair=(a,b)=>pPairs.has(`${a.source}:${a.id}__${b.source}:${b.id}`)||pPairs.has(`${b.source}:${b.id}__${a.source}:${a.id}`);
  const fpMem=new Map();
  for(const[k,idxs]of fpMap.entries())for(const idx of idxs){if(!fpMem.has(idx))fpMem.set(idx,new Set());fpMem.get(idx).add(k);}
  artworks.forEach((a1,i)=>{
    if(processed.has(i))return; processed.add(i);
    const cl={
      id:`c${i}`,artworks:[a1],sources:[{source:a1.source,id:a1.id}],
      title:a1.title,artist:a1.artist,date:a1.date,imageUrl:a1.imageUrl,
      connections:[],confidence:'none',pHashMatched:false,wikidataVerified:false,graphHit:false,
      titleNorm:matcher.clean(a1.title),artistNorm:matcher.lastName(a1.artist),decade:matcher.decade(a1.date),
      // Identity enrichment (from Met search which already returns full objects)
      medium:a1.medium||null,
      dimensions:a1.dimensions||null,
      culture:a1.culture||null,
      period:a1.period||null,
      dynasty:a1.dynasty||null,
      placeOfOrigin:a1.placeOfOrigin||null,
      artistNationality:a1.artistNationality||null,
      artistBeginDate:a1.artistBeginDate||null,
      artistEndDate:a1.artistEndDate||null,
      creditLine:a1.creditLine||null,
      galleryNumber:a1.galleryNumber||null,
      isHighlight:a1.isHighlight||false,
      isPublicDomain:a1.isPublicDomain||false,
      classification:a1.classification||null,
      tags:a1.tags||[],
      objectName:a1.objectName||null,
      objectURL:a1.objectURL||null,
      isOnView:a1.isOnView||false,
      galleryTitle:a1.galleryTitle||null,
      constituents:a1.constituents||[],
      productionPlaces:a1.productionPlaces||[],
      subjectTitles:a1.subjectTitles||[],
      // Fields populated by enrich stage
      colors:[],harvardColors:[],materials:[],techniques:[],
      historicalPersons:[],styleTitles:[],classificationTitles:[],depicts:[],
      rank:null,totalPageViews:null,exhibitionCount:0,publicationCount:0,
      exhibitionHistory:null,publicationHistory:null,
      colorfulness:null,inscriptions:null,
      provenanceText:null,funFact:null,wallDescription:null,
      fiscalYearAcquisition:null,accessionYear:null,century:null,iconClass:null,
      movement:null,genre:null,aicDominantColor:null,
      detail:{},
    };
    artworks.forEach((a2,j)=>{
      if(i>=j||processed.has(j))return;
      let r=matcher.match(a1,a2);
      if(isPair(a1,a2)){r={score:0.95,reasons:[...r.reasons,'🖼 pHash'],confidence:'exact'};cl.pHashMatched=true;}
      const f1=fpMem.get(i)||new Set(),f2=fpMem.get(j)||new Set();
      if([...f1].some(k=>f2.has(k))&&r.score<0.5){r.score=Math.max(r.score,0.35);r.reasons.push('Fingerprint');if(r.confidence==='none')r.confidence='low';}
      if(r.confidence!=='none'&&r.score>=0.32){
        processed.add(j);
        if(!cl.imageUrl&&a2.imageUrl)cl.imageUrl=a2.imageUrl;
        cl.artworks.push(a2);cl.sources.push({source:a2.source,id:a2.id});
        cl.connections.push({artwork:a2,...r});
        if((confOrd[r.confidence]||0)>(confOrd[cl.confidence]||0))cl.confidence=r.confidence;
        // Merge enriched scalar fields from a2 (first-wins)
        ['culture','period','dynasty','artistNationality','artistBeginDate','artistEndDate',
         'creditLine','galleryNumber','classification','objectName','objectURL','galleryTitle',
         'placeOfOrigin','provenanceText','medium','dimensions','century','iconClass']
          .forEach(f=>{if(!cl[f]&&a2[f])cl[f]=a2[f];});
        if(a2.isHighlight)   cl.isHighlight=true;
        if(a2.isPublicDomain)cl.isPublicDomain=true;
        if(a2.isOnView)      cl.isOnView=true;
        // Merge arrays
        ['tags','subjectTitles','productionPlaces','constituents'].forEach(f=>{
          if(a2[f]?.length){const s=new Set(cl[f]);a2[f].forEach(v=>{if(!s.has(v)){cl[f].push(v);s.add(v);}});}
        });
      }
    });
    const wdMatch=wikidataItems.find(w=>{const wt=matcher.clean(w.title),ct=matcher.clean(a1.title);return wt&&ct&&matcher.similarity(wt,ct)>0.75;});
    if(wdMatch){
      cl.wikidataVerified=true;
      if(wdMatch.wikidataId&&!cl.wikidataId)cl.wikidataId=wdMatch.wikidataId;
      if(wdMatch.movement&&!cl.movement)cl.movement=wdMatch.movement;
      if(wdMatch.genre&&!cl.genre)cl.genre=wdMatch.genre;
      if(wdMatch.material&&!cl.materials?.length)cl.materials=[wdMatch.material];
      if(wdMatch.location&&!cl.galleryTitle)cl.galleryTitle=wdMatch.location;
      if(wdMatch.origin&&!cl.placeOfOrigin)cl.placeOfOrigin=wdMatch.origin;
    }
    clusters.push(cl);
  });
  return clusters;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE: BROWSE — native-sorted endpoints, no search query needed
// ═══════════════════════════════════════════════════════════════════════════════
async function fetchBrowseArtworks(){
  const settled=await Promise.allSettled([
    // Harvard — most-viewed paintings first
    fetch(`https://api.harvardartmuseums.org/object?classification=Paintings&sort=totalpageviews&sortorder=desc&size=60&fields=id,title,people,dated,primaryimageurl,technique,dimensions&apikey=${API_KEYS.harvard}`)
      .then(r=>r.json()).then(r=>(r.records||[]).map(x=>mkArt(x.id,x.title,x.people?.[0]?.name,x.dated,x.primaryimageurl,'harvard',{medium:x.technique,dimensions:x.dimensions}))).catch(()=>[]),
    // AIC — most-viewed paintings (editorial sort)
    fetch(`https://api.artic.edu/api/v1/artworks?query[term][artwork_type_id]=1&sort[total_views][order]=desc&limit=60&fields=id,title,artist_display,date_display,image_id,medium_display,dimensions`)
      .then(r=>r.json()).then(r=>(r.data||[]).map(x=>{const _ap=parseArtistDisplay(x.artist_display);return mkArt(x.id,x.title,_ap.name||x.artist_display,x.date_display,x.image_id?`https://www.artic.edu/iiif/2/${x.image_id}/full/843,/0/default.jpg`:null,'aic',{medium:x.medium_display,dimensions:x.dimensions,artistNationality:_ap.nationality||null,artistBeginDate:_ap.beginDate||null,artistEndDate:_ap.endDate||null});})).catch(()=>[]),
    // Cleveland — full collection browse, no query
    fetch(`https://openaccess-api.clevelandart.org/api/artworks/?type=Painting&has_image=1&limit=60`)
      .then(r=>r.json()).then(r=>(r.data||[]).map(x=>mkArt(x.id,x.title,x.creators?.[0]?.description,x.creation_date,x.images?.web?.url,'cleveland',{medium:x.technique,dimensions:x.measurements}))).catch(()=>[]),
    // Met — curated editorial highlights
    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?isHighlight=true&q=painting&hasImages=true`)
      .then(r=>r.json()).then(async r=>{
        const ids=(r.objectIDs||[]).slice(0,50); const res=[];
        for(let i=0;i<ids.length;i+=8){
          const batch=ids.slice(i,i+8);
          const items=await Promise.allSettled(batch.map(id=>fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`).then(r=>r.json())));
          items.forEach(r=>{if(r.status==='fulfilled'&&r.value.primaryImage){const d=r.value;
            res.push(mkArt(d.objectID,d.title,d.artistDisplayName,d.objectDate,d.primaryImage,'met',{
              medium:d.medium,culture:d.culture||null,isHighlight:true,isPublicDomain:!!d.isPublicDomain,
              creditLine:d.creditLine||null,tags:(d.tags||[]).map(t=>t.term||String(t)).filter(Boolean),
              objectURL:d.objectURL||null,isOnView:!!(d.GalleryNumber),galleryTitle:d.GalleryNumber?`Gallery ${d.GalleryNumber}`:null,
            }));
          }});
        }
        return res;
      }).catch(()=>[]),
  ]);
  return dedup(settled.flatMap(r=>r.status==='fulfilled'?r.value:[]));
}

async function runBrowse(credits, poolArtworks=[]){
  const matcher=new Matcher(), fp=new Fingerprinter();
  const pHashStub={hamming:()=>999}; // skip cross-image matching for browse speed
  const fresh=await fetchBrowseArtworks();
  const merged=dedup([...fresh,...poolArtworks]);
  const fpMap=fp.buildMap(merged,matcher);
  const clusters=buildClusters(merged,matcher,pHashStub,fpMap,[]);
  const scored=clusters.map(c=>({...c,richness:scoreRichness(c,'',matcher)})).sort((a,b)=>b.richness.total-a.richness.total);
  // Enrich top 15 with detail APIs
  await Promise.allSettled(scored.slice(0,15).map(async cluster=>{
    const uniq=[...new Map(cluster.sources.map(s=>[s.source,s])).values()];
    await Promise.allSettled(uniq.map(async({source,id})=>{
      if(!['rijks','harvard','aic','cleveland'].includes(source))return;
      const detail=await fetchDetail(source,id,credits);
      if(detail)mergeDetail(cluster,source,detail);
    }));
    cluster.richness=scoreRichness(cluster,'',matcher);
  }));
  scored.sort((a,b)=>b.richness.total-a.richness.total);
  return{scored,fresh};
}

// ═══════════════════════════════════════════════════════════════════════════════
// PIPELINE ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════════
async function runPipeline(query, graph, settings, credits, onStage, onLog, onViz){
  const matcher=new Matcher(), wdRes=new WikidataResolver(), pHash=new PHashEngine(), fp=new Fingerprinter();
  const FETCHERS=makeFetchers(credits);
  const log=(stage,msg,type='info')=>onLog({stage,msg,type,ts:Date.now()});
  const upd=(stage,u)=>onStage(stage,u);

  // ①  Graph
  upd('graph',{status:'running',message:'Checking memory graph…'});
  const qNorm=matcher.clean(query);
  const hits=graph.lookup(qNorm);
  log('graph',`${hits.length} cached connections for "${qNorm}"`);
  onViz('graph',{hits:hits.slice(0,30),query:qNorm,all:graph.connections.slice(0,60)});
  upd('graph',{status:'complete',count:hits.length,message:`${hits.length} cached connections`});

  // ②  Wikidata
  let wdItems=[];
  if(settings.useWikidata){
    upd('wikidata',{status:'running',message:'SPARQL query…'});
    log('wikidata',`Querying for "${query}"`);
    const wd=await wdRes.query(query,credits);
    wdItems=wd.items;
    onViz('wikidata',{items:wdItems.slice(0,30),directIds:wd.directIds});
    log('wikidata',`${wdItems.length} artworks · ${wd.directIds.length} cross-IDs`,'success');
    upd('wikidata',{status:'complete',count:wdItems.length,message:`${wdItems.length} artworks · ${wd.directIds.length} IDs`});
  }else{upd('wikidata',{status:'skipped',message:'Disabled'});onViz('wikidata',null);}

  // ③  Fetch
  upd('fetch',{status:'running',message:'Querying 7 museums…'});
  const allArt=[]; const mbk={};
  const fetchResults=await Promise.allSettled(Object.entries(FETCHERS).map(async([museum,fn])=>{
    upd('fetch',{perMuseum:{[museum]:'running'}});
    log('fetch',`→ ${museum}`);
    try{
      const r=await fn(query,settings.deepFetch);
      mbk[museum]=r.length;
      upd('fetch',{perMuseum:{[museum]:r.length}});
      log('fetch',`← ${museum}: ${r.length}`,'success');
      return r;
    }catch(e){
      upd('fetch',{perMuseum:{[museum]:'error'}});
      log('fetch',`✗ ${museum}: ${e.message}`,'error');
      return[];
    }
  }));
  fetchResults.forEach(r=>{if(r.status==='fulfilled')allArt.push(...r.value);});
  const duped=dedup(allArt);
  onViz('fetch',{breakdown:mbk,raw:allArt.length,deduped:duped.length});
  log('fetch',`${allArt.length} raw → ${duped.length} deduped`);
  upd('fetch',{status:'complete',count:duped.length,message:`${duped.length} after dedup`});

  // ④  pHash
  const pHashFrames=[];
  if(settings.usePHash){
    upd('phash',{status:'running',message:'DCT fingerprinting…'});
    const withImg=duped.filter(a=>a.imageUrl).slice(0,40);
    log('phash',`Hashing ${withImg.length} images`);
    let done=0;
    await Promise.allSettled(withImg.map(async aw=>{
      const h=await pHash.hash(aw.imageUrl, frame=>{
        pHashFrames.push(frame);
        onViz('phash',{frames:pHashFrames.slice(-16),done:pHashFrames.length,total:withImg.length,pairs:[]});
      });
      aw.pHash=h; done++;
      if(done%8===0) upd('phash',{message:`${done}/${withImg.length} hashed…`});
    }));
    // find similar pairs for viz
    const pairs=[];
    for(let i=0;i<pHashFrames.length&&pairs.length<6;i++)
      for(let j=i+1;j<pHashFrames.length&&pairs.length<6;j++){
        const d=pHash.hamming(pHashFrames[i].hash,pHashFrames[j].hash);
        if(d<=12) pairs.push({a:pHashFrames[i],b:pHashFrames[j],hamming:d});
      }
    onViz('phash',{frames:pHashFrames,done:pHashFrames.length,total:withImg.length,pairs});
    log('phash',`${duped.filter(a=>a.pHash).length} fingerprinted · ${pairs.length} similar pairs`,'success');
    upd('phash',{status:'complete',count:duped.filter(a=>a.pHash).length,message:`${duped.filter(a=>a.pHash).length} fingerprints · ${pairs.length} pairs`});
  }else{upd('phash',{status:'skipped',message:'Disabled'});onViz('phash',null);}

  // ⑤  Fingerprint
  upd('fingerprint',{status:'running',message:'Metadata clustering…'});
  const fpMap=fp.buildMap(duped,matcher);
  const fpGroups=[...fpMap.entries()].filter(([,idxs])=>idxs.length>1)
    .map(([key,idxs])=>({key,count:idxs.length,artworks:idxs.slice(0,4).map(i=>duped[i]),museums:[...new Set(idxs.map(i=>duped[i].source))]}))
    .sort((a,b)=>b.count-a.count).slice(0,40);
  onViz('fingerprint',{groups:fpGroups,total:fpMap.size,multiGroups:fpGroups.length});
  log('fingerprint',`${fpMap.size} keys · ${fpGroups.length} multi-record groups`);
  upd('fingerprint',{status:'complete',count:fpGroups.length,message:`${fpGroups.length} overlap groups`});

  // ⑥  Cluster
  upd('cluster',{status:'running',message:'Cross-museum clustering…'});
  const clusters=buildClusters(duped,matcher,pHash,fpMap,wdItems);
  const multi=clusters.filter(c=>c.sources.length>1).length;
  onViz('cluster',{
    clusters:clusters.slice(0,80).map(c=>({id:c.id,title:c.title?.slice(0,28),sources:c.sources.length,confidence:c.confidence,connections:c.connections.length,museums:[...new Set(c.sources.map(s=>s.source))]})),
    total:clusters.length, multi,
  });
  clusters.forEach(c=>{if(c.sources.length>1)graph.addConnection(c,qNorm);});
  await graph.save();
  log('cluster',`${clusters.length} clusters · ${multi} cross-museum`);
  upd('cluster',{status:'complete',count:clusters.length,message:`${clusters.length} unique · ${multi} multi-museum`});

  // ⑦  Score
  upd('score',{status:'running',message:'Scoring richness…'});
  clusters.forEach(c=>{c.graphHit=hits.some(h=>h.signals?.artistLast===c.artistNorm||h.signals?.titleNorm===c.titleNorm);});
  const scored=clusters.map(c=>({...c,richness:scoreRichness(c,query,matcher)})).sort((a,b)=>b.richness.total-a.richness.total);
  const avg=scored.length?Math.round(scored.reduce((s,c)=>s+c.richness.total,0)/scored.length):0;
  onViz('score',{items:scored.slice(0,20).map(c=>({title:c.title?.slice(0,22),score:c.richness.total,pct:c.richness.pct,museums:c.sources.length,confidence:c.confidence})),avg});
  log('score',`Sorted · avg richness ${avg}`,'success');
  upd('score',{status:'complete',count:scored.length,message:`Avg richness ${avg}`});

  // ⑧  Enrich — fire detail fetches for top 20 clusters, non-blocking per source
  upd('enrich',{status:'running',message:'Deep enriching top results…'});
  const toEnrich=scored.slice(0,20);
  let enriched=0;
  await Promise.allSettled(toEnrich.map(async cluster=>{
    // Deduplicate sources to avoid double-fetching same museum for same cluster
    const sourcesUniq=[...new Map(cluster.sources.map(s=>[s.source,s])).values()];
    await Promise.allSettled(sourcesUniq.map(async({source,id})=>{
      // Skip museums where detail fetching isn't implemented or too expensive
      if(!['rijks','harvard','aic','cleveland'].includes(source))return;
      upd('enrich',{perMuseum:{[source]:'running'}});
      const detail=await fetchDetail(source,id,credits);
      if(detail)mergeDetail(cluster,source,detail);
      upd('enrich',{perMuseum:{[source]:detail?'ok':'skip'}});
    }));
    cluster.richness=scoreRichness(cluster,query,matcher); // re-score with enriched data
    enriched++;
    upd('enrich',{message:`${enriched}/${toEnrich.length} enriched…`});
  }));
  // Re-sort after enrichment (scores may have changed)
  scored.sort((a,b)=>b.richness.total-a.richness.total);
  const avgEnriched=scored.length?Math.round(scored.reduce((s,c)=>s+c.richness.total,0)/scored.length):0;
  log('enrich',`${enriched} clusters enriched · new avg ${avgEnriched}`,'success');
  upd('enrich',{status:'complete',count:enriched,message:`${enriched} enriched · avg ${avgEnriched}`});

  return{results:scored,museumBreakdown:mbk};
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED UI ATOMS
// ═══════════════════════════════════════════════════════════════════════════════
const MusTag=({m})=>{const M=MUSEUM_META[m];if(!M)return null;return<span className="museum-tag" style={{color:M.color,background:M.bg,border:`1px solid ${M.color}28`}}>{M.label}</span>;};
const ConfBadge=({c})=>{const C=CONF_COLORS[c]||CONF_COLORS.none;return<span className="conf-badge" style={{color:C.text,background:C.bg,border:`1px solid ${C.border}`}}>{c}</span>;};

const ColorSwatches=({colors=[],harvardColors=[],aicColor=null,label='Colors'})=>{
  const all=[...colors,...harvardColors].filter(c=>c?.hex);
  if(!all.length&&!aicColor)return null;
  return(
    <div style={{marginBottom:8}}>
      <div className="mono" style={{fontSize:8,color:'#2a2a40',marginBottom:4,letterSpacing:'0.08em'}}>{label.toUpperCase()}</div>
      <div style={{display:'flex',gap:3,flexWrap:'wrap',alignItems:'center'}}>
        {all.map((c,i)=>(
          <div key={i} title={`${c.hex}${c.pct?` · ${c.pct}%`:''}`}
            style={{width:18,height:18,background:c.hex,borderRadius:2,border:'1px solid rgba(255,255,255,0.08)',flexShrink:0,cursor:'default'}}/>
        ))}
        {aicColor&&!all.length&&(
          <div title={`AIC dominant: ${aicColor}`}
            style={{width:18,height:18,background:aicColor,borderRadius:2,border:'1px solid rgba(255,255,255,0.08)'}}/>
        )}
        {all.length>0&&<span className="mono" style={{fontSize:8,color:'#2a2a40',marginLeft:2}}>{all.length} tones</span>}
      </div>
    </div>
  );
};

const MetaRow=({label,value,mono=false})=>{
  if(!value&&value!==0)return null;
  return(
    <div style={{display:'flex',gap:8,marginBottom:3,alignItems:'flex-start'}}>
      <span style={{fontSize:9,color:'#2a2a40',minWidth:90,flexShrink:0,fontFamily:'IBM Plex Mono',letterSpacing:'0.04em',paddingTop:1}}>{label}</span>
      <span style={{fontSize:10,color:'#8888b0',flex:1,lineHeight:1.4,fontFamily:mono?'IBM Plex Mono':'inherit'}}>{value}</span>
    </div>
  );
};

const TagList=({items=[],color='#444466',bg='rgba(68,68,102,0.12)'})=>{
  if(!items?.length)return null;
  return(
    <div style={{display:'flex',flexWrap:'wrap',gap:3,marginTop:3,marginBottom:6}}>
      {items.slice(0,20).map((t,i)=>(
        <span key={i} style={{fontSize:9,color,background:bg,border:`1px solid ${color}33`,padding:'1px 5px',borderRadius:2,fontFamily:'IBM Plex Mono'}}>{t}</span>
      ))}
      {items.length>20&&<span style={{fontSize:9,color:'#2a2a40'}}>+{items.length-20}</span>}
    </div>
  );
};

const SectionHead=({label})=>(
  <div className="mono" style={{fontSize:9,color:'#2a2a40',marginBottom:5,marginTop:12,letterSpacing:'0.1em',borderBottom:'1px solid #0f0f1e',paddingBottom:3}}>{label}</div>
);

const RBar=({r,compact})=>{
  if(!r)return null;
  const col=r.pct>=70?'#22c55e':r.pct>=40?'#fbbf24':'#444460';
  if(compact)return<div style={{display:'flex',alignItems:'center',gap:5}}><div className="richness-track" style={{flex:1}}><div className="richness-fill" style={{width:`${r.pct}%`,background:col}}/></div><span className="mono" style={{fontSize:9,color:'#3a3a58',minWidth:22}}>{r.total}</span></div>;
  return<div><div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}><span style={{fontSize:10,color:'#3a3a58'}}>Richness</span><span className="mono" style={{fontSize:10,color:col}}>{r.total}/{r.max}</span></div><div className="richness-track" style={{height:4}}><div className="richness-fill" style={{width:`${r.pct}%`,background:col}}/></div><div style={{display:'flex',flexWrap:'wrap',gap:3,marginTop:5}}>{Object.entries(r.breakdown).map(([k,v])=>v>0&&<span key={k} className="mono" style={{fontSize:8,color:'#2e2e48'}}>{k}+{v}</span>)}</div></div>;
};

// ═══════════════════════════════════════════════════════════════════════════════
// VISUALIZATION: pHASH — most detailed
// ═══════════════════════════════════════════════════════════════════════════════
function PHashViz({ data }) {
  const [tab, setTab] = useState('dct'); // 'dct' | 'pixel' | 'pairs'
  if (!data) return <div style={{padding:20,textAlign:'center',color:'#222240',fontSize:11}}>Awaiting pHash stage…</div>;
  const frames = data.frames?.slice(0, 12) || [];

  return (
    <div style={{padding:10}}>
      {/* Tab strip */}
      <div style={{display:'flex',gap:6,marginBottom:10,alignItems:'center'}}>
        {[
          {k:'dct',  label:'DCT Heatmap'},
          {k:'pixel',label:'Pixel Grid'},
          {k:'pairs',label:`Similar Pairs (${data.pairs?.length||0})`},
        ].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} style={{
            padding:'3px 10px',border:'1px solid',borderRadius:3,fontSize:10,cursor:'pointer',
            borderColor:tab===t.k?'#fbbf2466':'#1a1a2e',
            background:tab===t.k?'rgba(251,191,36,0.08)':'transparent',
            color:tab===t.k?'#fbbf24':'#444466',fontFamily:'IBM Plex Mono',letterSpacing:'0.04em',
          }}>{t.label}</button>
        ))}
        <span className="mono" style={{marginLeft:'auto',fontSize:9,color:'#222240'}}>
          {data.done}/{data.total} imgs · render &lt;0.1ms/img · 0 net calls
        </span>
      </div>

      {/* DCT HEATMAP TAB */}
      {tab==='dct' && (
        <div>
          <div style={{fontSize:9,color:'#2a2a40',marginBottom:6,fontFamily:'IBM Plex Mono'}}>
            8×8 DCT COEFFICIENTS — color=freq magnitude · opacity=hash bit (1=above avg, dim=below)
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:8}}>
            {frames.map((f,fi)=>(
              <div key={fi} className="slide-r" style={{animationDelay:`${fi*0.025}s`,background:'#09090f',border:'1px solid #14142a',borderRadius:3,padding:6}}>
                {/* 8×8 DCT grid */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:1.5,marginBottom:5}}>
                  {f.dctNorm.flat().map((v,ci)=>{
                    // Purple (low) → Black → Orange (high)
                    const r=ci===0?60:v>0.5?Math.round((v-0.5)*2*200+55):20;
                    const g=ci===0?60:v>0.5?Math.round((v-0.5)*2*80):20;
                    const b=ci===0?60:v<0.5?Math.round((0.5-v)*2*180+30):20;
                    return(
                      <div key={ci} style={{
                        paddingTop:'100%',
                        background:`rgb(${r},${g},${b})`,
                        borderRadius:1,
                        opacity:ci===0?0.3:(f.bits[ci-1]===1?1:0.22),
                        position:'relative',
                      }}/>
                    );
                  })}
                </div>
                {/* Hash bit row */}
                <div style={{display:'flex',flexWrap:'wrap',gap:1,marginBottom:4}}>
                  {f.bits.map((b,bi)=>(
                    <div key={bi} style={{width:6,height:6,borderRadius:1,background:b===1?'#fbbf24':'#1a1a2e',opacity:b===1?0.9:0.4}}/>
                  ))}
                </div>
                <div className="mono" style={{fontSize:7,color:'#2a2a40',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                  {f.hash?.slice(0,20)}…
                </div>
              </div>
            ))}
          </div>
          {/* Axis labels */}
          <div style={{display:'flex',gap:16,marginTop:6}}>
            <span style={{fontSize:8,color:'#1e1e30',fontFamily:'IBM Plex Mono'}}>↑ Vertical spatial freq (u)</span>
            <span style={{fontSize:8,color:'#1e1e30',fontFamily:'IBM Plex Mono'}}>→ Horizontal spatial freq (v)</span>
            <span style={{fontSize:8,color:'#1e1e30',fontFamily:'IBM Plex Mono'}}>DC component [0,0] excluded from hash</span>
          </div>
        </div>
      )}

      {/* PIXEL GRID TAB */}
      {tab==='pixel' && (
        <div>
          <div style={{fontSize:9,color:'#2a2a40',marginBottom:6,fontFamily:'IBM Plex Mono'}}>
            8×8 COLOUR THUMBNAIL — actual pixel values from 8×8 downsample of each image
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:8}}>
            {frames.map((f,fi)=>(
              <div key={fi} className="slide-r" style={{animationDelay:`${fi*0.025}s`,background:'#09090f',border:'1px solid #14142a',borderRadius:3,padding:6}}>
                {/* 8×8 actual pixel colours */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:2,marginBottom:5}}>
                  {(f.thumb||[]).map((px,pi)=>(
                    <div key={pi} style={{
                      paddingTop:'100%',
                      background:`rgb(${px.r},${px.g},${px.b})`,
                      borderRadius:1,
                    }}/>
                  ))}
                </div>
                {/* 8×8 grayscale equivalent */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:1,marginBottom:4}}>
                  {(f.gray||[]).flat().map((v,gi)=>(
                    <div key={gi} style={{paddingTop:'100%',background:`rgb(${Math.round(v)},${Math.round(v)},${Math.round(v)})`,borderRadius:1}}/>
                  ))}
                </div>
                <div style={{fontSize:8,color:'#2a2a40',fontFamily:'IBM Plex Mono'}}>
                  <span style={{color:'#fbbf2466'}}>● </span>colour
                  <span style={{color:'#444466',marginLeft:6}}>● grey</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAIRS TAB */}
      {tab==='pairs' && (
        <div>
          <div style={{fontSize:9,color:'#2a2a40',marginBottom:8,fontFamily:'IBM Plex Mono'}}>
            VISUALLY SIMILAR PAIRS — Hamming distance ≤12 out of 63 bits
          </div>
          {(!data.pairs||data.pairs.length===0) && (
            <div style={{padding:'24px 0',textAlign:'center',color:'#1e1e30',fontSize:11}}>No similar pairs found in hashed set</div>
          )}
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {(data.pairs||[]).map((pair,pi)=>(
              <div key={pi} style={{background:'#09090f',border:'1px solid #1a2a1a',borderRadius:3,padding:8,display:'flex',gap:10,alignItems:'center'}}>
                {/* Frame A pixel grid */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:1,width:48,flexShrink:0}}>
                  {(pair.a.thumb||[]).map((px,i)=><div key={i} style={{paddingTop:'100%',background:`rgb(${px.r},${px.g},${px.b})`,borderRadius:1}}/>)}
                </div>
                {/* Distance display */}
                <div style={{flex:1,textAlign:'center'}}>
                  <div className="mono" style={{fontSize:18,color:'#22c55e',fontWeight:600,lineHeight:1}}>{pair.hamming}</div>
                  <div style={{fontSize:9,color:'#333355',marginTop:2}}>Hamming bits diff</div>
                  <div style={{display:'flex',justifyContent:'center',gap:1,marginTop:4}}>
                    {pair.a.bits?.map((b,i)=>{
                      const diff=pair.b.bits&&pair.b.bits[i]!==b;
                      return<div key={i} style={{width:4,height:4,borderRadius:0.5,background:diff?'#ef4444':b===1?'#22c55e':'#1a1a2e'}}/>;
                    })}
                  </div>
                  <div style={{fontSize:8,color:'#2a2a40',marginTop:2,fontFamily:'IBM Plex Mono'}}>red=diff bit</div>
                </div>
                {/* Frame B pixel grid */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:1,width:48,flexShrink:0}}>
                  {(pair.b.thumb||[]).map((px,i)=><div key={i} style={{paddingTop:'100%',background:`rgb(${px.r},${px.g},${px.b})`,borderRadius:1}}/>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUALIZATION: FINGERPRINT
// ═══════════════════════════════════════════════════════════════════════════════
function FingerprintViz({ data }) {
  if (!data?.groups?.length) return <div style={{padding:20,textAlign:'center',color:'#1e1e30',fontSize:11}}>Building fingerprints…</div>;
  const maxC = Math.max(...data.groups.map(g=>g.count));
  return (
    <div style={{padding:10}}>
      <div style={{fontSize:9,color:'#2a2a40',marginBottom:8,fontFamily:'IBM Plex Mono'}}>
        METADATA FINGERPRINT CLUSTERS — {data.total} unique keys · {data.multiGroups} multi-artwork groups · key = artist+decade+medium+dims
      </div>
      <div style={{display:'flex',flexWrap:'wrap',gap:5,alignItems:'flex-end',marginBottom:10}}>
        {data.groups.slice(0,30).map((g,gi)=>{
          const parts=g.key.split('__');
          const h=Math.max(18,Math.round((g.count/maxC)*72));
          const primaryM=g.museums[0];
          const col=MUSEUM_META[primaryM]?.color||'#444466';
          return(
            <div key={gi} className="slide-r" style={{animationDelay:`${gi*0.02}s`,display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
              <span className="mono" style={{fontSize:7,color:col}}>{g.count}</span>
              <div style={{width:28,height:h,background:`linear-gradient(to top,${col}66,${col}18)`,border:`1px solid ${col}33`,borderRadius:2,position:'relative',overflow:'hidden'}}
                title={`${g.key}\n${g.artworks.map(a=>a.title?.slice(0,20)).join('\n')}`}>
                {g.museums.map((m,mi)=>(
                  <div key={mi} style={{position:'absolute',bottom:mi*4,left:0,right:0,height:2,background:MUSEUM_META[m]?.color||'#444'}}/>
                ))}
              </div>
              <div style={{display:'flex',gap:1}}>
                {g.museums.slice(0,3).map(m=><div key={m} style={{width:5,height:5,borderRadius:1,background:MUSEUM_META[m]?.color||'#444'}}/>)}
              </div>
              <span className="mono" style={{fontSize:6,color:'#222238',maxWidth:30,textAlign:'center',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{parts[2]||'?'}</span>
            </div>
          );
        })}
      </div>
      <div style={{fontSize:8,color:'#1a1a28',fontFamily:'IBM Plex Mono'}}>⊞ perf: pure render · map pre-built · 0 ops</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUALIZATION: CLUSTER GRAPH — museum-coloured nodes
// ═══════════════════════════════════════════════════════════════════════════════
function ClusterViz({ data }) {
  if (!data?.clusters?.length) return <div style={{padding:20,textAlign:'center',color:'#1e1e30',fontSize:11}}>Building clusters…</div>;
  const W=560, H=160;
  const multi = data.clusters.filter(c=>c.sources>1);
  const single = data.clusters.filter(c=>c.sources===1).slice(0,24);

  // Lay multi clusters in a gentle arc, singles along bottom
  const positions = {};
  multi.forEach((c,i)=>{
    const t=(multi.length>1)?i/(multi.length-1):0.5;
    positions[c.id]={x:W*0.1+W*0.8*t, y:H*0.32+Math.sin(t*Math.PI)*H*0.14};
  });
  single.forEach((c,i)=>{
    const t=(single.length>1)?i/(single.length-1):0.5;
    positions[c.id]={x:W*0.04+W*0.92*t, y:H*0.78};
  });

  return (
    <div style={{padding:10}}>
      <div style={{fontSize:9,color:'#2a2a40',marginBottom:4,fontFamily:'IBM Plex Mono'}}>
        {data.total} clusters · <span style={{color:'#fbbf24'}}>{data.multi} cross-museum</span> (upper arc) · node size=source count · colours=museums
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:'visible',maxHeight:160}}>
        {/* Faint edge lines between close multi-museum nodes */}
        {multi.map((c,i)=>multi.slice(0,i).map((c2,j)=>{
          const p1=positions[c.id],p2=positions[c2.id]; if(!p1||!p2)return null;
          const dist=Math.hypot(p1.x-p2.x,p1.y-p2.y);
          if(dist>W*0.35)return null;
          return<line key={`${i}-${j}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#fbbf2418" strokeWidth={0.5} style={{strokeDasharray:'4 3',animation:'dataflow 1s linear infinite'}}/>;
        }))}
        {/* Single-source dots */}
        {single.map(c=>{
          const p=positions[c.id]; if(!p)return null;
          const col=MUSEUM_META[c.museums?.[0]]?.color||'#333355';
          return<circle key={c.id} cx={p.x} cy={p.y} r={2} fill={col} opacity={0.4}/>;
        })}
        {/* Multi-museum nodes */}
        {multi.map(c=>{
          const p=positions[c.id]; if(!p)return null;
          const r=Math.min(4+c.sources*2.5,16);
          const CC=CONF_COLORS[c.confidence]||CONF_COLORS.none;
          const museums=c.museums||[];
          return(
            <g key={c.id} style={{animation:'nodeIn 0.3s ease-out both'}}>
              {/* Outer ring */}
              <circle cx={p.x} cy={p.y} r={r+3} fill="none" stroke="#fbbf2426" strokeWidth={1}/>
              {/* Museum colour segments (rough pie) */}
              {museums.slice(0,4).map((m,mi)=>(
                <circle key={mi} cx={p.x} cy={p.y} r={r-(mi*1.5)} fill="none"
                  stroke={MUSEUM_META[m]?.color||'#444'} strokeWidth={1.5} opacity={0.7}
                  style={{strokeDasharray:`${2*Math.PI*r/museums.length*0.7} ${2*Math.PI*r}`,strokeDashoffset:-mi*2*Math.PI*r/museums.length}}
                />
              ))}
              {/* Core */}
              <circle cx={p.x} cy={p.y} r={r-2} fill={CC.bg} stroke={CC.text} strokeWidth={1.2}/>
              <text x={p.x} y={p.y-r-4} textAnchor="middle" fontSize={7} fill={CC.text} fontFamily="IBM Plex Mono" opacity={0.85}>{c.title?.slice(0,14)}</text>
            </g>
          );
        })}
        {/* Labels */}
        <text x={6} y={H-4} fontSize={7} fill="#242440" fontFamily="IBM Plex Mono">single-source ({single.length})</text>
        <text x={W*0.36} y={12} fontSize={7} fill="#fbbf2488" fontFamily="IBM Plex Mono">— cross-museum matches ({multi.length}) —</text>
      </svg>
      <div style={{fontSize:8,color:'#1a1a28',fontFamily:'IBM Plex Mono',marginTop:2}}>⊞ perf: ~3ms render · static layout · capped 80 nodes</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUALIZATION: GRAPH MEMORY
// ═══════════════════════════════════════════════════════════════════════════════
function GraphViz({ data }) {
  if (!data) return null;
  if (!data.hits?.length && !data.all?.length) return (
    <div style={{padding:16,textAlign:'center',color:'#1a1a28',fontSize:11}}>No graph data yet · builds as you search</div>
  );
  const showHits = data.hits?.length > 0;
  const allConns = (showHits ? data.hits : data.all)||[];
  return (
    <div style={{padding:10}}>
      <div style={{fontSize:9,color:'#2a2a40',marginBottom:6,fontFamily:'IBM Plex Mono'}}>
        {showHits
          ? `GRAPH HIT — ${data.hits.length} cached connections matching "${data.query}"`
          : `GRAPH MEMORY — ${allConns.length} total connections`}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:3,maxHeight:160,overflowY:'auto'}}>
        {allConns.slice(0,12).map((conn,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:6,padding:'4px 8px',background:'#08080e',border:`1px solid ${showHits?'#1a2a1a':'#141420'}`,borderRadius:3}}>
            <span className="mono" style={{fontSize:8,color:showHits?'#22c55e':'#fbbf2466'}}>◈</span>
            <div style={{flex:1,minWidth:0}}>
              <span style={{fontSize:10,color:'#9090b0',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',display:'block'}}>
                {conn.signals?.titleNorm||'(untitled)'} · <span style={{color:'#444466'}}>{conn.signals?.artistLast}</span>
              </span>
            </div>
            <div style={{display:'flex',gap:2,flexShrink:0}}>
              {conn.nodes?.slice(0,5).map((n,ni)=>(
                <div key={ni} title={n.museum} style={{width:6,height:6,borderRadius:1,background:MUSEUM_META[n.museum]?.color||'#333'}}/>
              ))}
            </div>
            <span className="mono" style={{fontSize:8,color:'#2a2a40',minWidth:14}}>{conn.hitCount||1}×</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUALIZATION: FETCH BREAKDOWN
// ═══════════════════════════════════════════════════════════════════════════════
function FetchViz({ data }) {
  if (!data) return null;
  const entries = Object.entries(data.breakdown||{}).sort((a,b)=>b[1]-a[1]);
  const maxV = Math.max(...entries.map(e=>e[1]),1);
  return (
    <div style={{padding:10}}>
      <div style={{fontSize:9,color:'#2a2a40',marginBottom:8,fontFamily:'IBM Plex Mono'}}>
        FETCH RESULTS — {data.raw} raw · {data.deduped} after dedup
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        {entries.map(([m,n])=>{
          const M=MUSEUM_META[m]; const pct=(n/maxV)*100;
          return(
            <div key={m} style={{display:'flex',alignItems:'center',gap:8}}>
              <MusTag m={m}/>
              <div style={{flex:1,background:'#131320',borderRadius:2,height:11,overflow:'hidden'}}>
                <div style={{width:`${pct}%`,height:'100%',background:M?.color+'38',borderLeft:`2px solid ${M?.color}`,borderRadius:2,transition:'width 0.6s ease'}}/>
              </div>
              <span className="mono" style={{fontSize:10,color:M?.color||'#888',minWidth:28}}>{n}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUALIZATION: WIKIDATA
// ═══════════════════════════════════════════════════════════════════════════════
function WikidataViz({ data }) {
  if (!data?.items?.length) return <div style={{padding:16,textAlign:'center',color:'#1e1e30',fontSize:11}}>No Wikidata results</div>;
  return (
    <div style={{padding:10}}>
      <div style={{fontSize:9,color:'#2a2a40',marginBottom:6,fontFamily:'IBM Plex Mono'}}>
        WIKIDATA CROSS-LINKS — {data.items.length} artworks · {data.directIds?.length||0} accession IDs resolved
      </div>
      <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
        {data.items.slice(0,18).map((item,i)=>{
          const ids=Object.entries(item.knownIds||{}).filter(([,v])=>v);
          return(
            <div key={i} className="slide-r" style={{animationDelay:`${i*0.025}s`,background:'#08080e',border:`1px solid ${ids.length?'#fbbf2428':'#131320'}`,borderRadius:3,padding:'4px 8px',minWidth:90,maxWidth:160}}>
              <div style={{fontSize:10,color:'#9090b0',marginBottom:3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.title}</div>
              <div style={{display:'flex',gap:2,flexWrap:'wrap'}}>
                {ids.map(([m])=><MusTag key={m} m={m}/>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUALIZATION: SCORE
// ═══════════════════════════════════════════════════════════════════════════════
function ScoreViz({ data }) {
  if (!data?.items?.length) return null;
  const max = Math.max(...data.items.map(c=>c.score));
  return (
    <div style={{padding:10}}>
      <div style={{fontSize:9,color:'#2a2a40',marginBottom:6,fontFamily:'IBM Plex Mono'}}>RICHNESS RANKING — avg {data.avg}</div>
      <div style={{display:'flex',flexDirection:'column',gap:3}}>
        {data.items.slice(0,14).map((c,i)=>{
          const col=c.pct>=70?'#22c55e':c.pct>=40?'#fbbf24':'#444460';
          const CC=CONF_COLORS[c.confidence]||CONF_COLORS.none;
          return(
            <div key={i} style={{display:'flex',alignItems:'center',gap:6}}>
              <span className="mono" style={{fontSize:8,color:'#2a2a40',width:14,textAlign:'right'}}>{i+1}</span>
              <div style={{flex:1,background:'#131320',borderRadius:2,height:14,position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',inset:0,width:`${(c.score/max)*100}%`,background:`${col}2a`,borderRadius:2}}/>
                <span style={{position:'absolute',left:6,top:0,bottom:0,display:'flex',alignItems:'center',fontSize:9,color:'#8888b0',whiteSpace:'nowrap'}}>{c.title}</span>
              </div>
              <span className="mono" style={{fontSize:9,color:col,minWidth:26}}>{c.score}</span>
              <span style={{fontSize:8,padding:'1px 4px',borderRadius:2,background:CC.bg,color:CC.text,fontFamily:'IBM Plex Mono',minWidth:34,textAlign:'center'}}>{c.confidence}</span>
              {c.museums>1&&<span style={{fontSize:8,color:'#fbbf24',minWidth:14}}>{c.museums}×</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CREDIT DISPLAY PANEL
// ═══════════════════════════════════════════════════════════════════════════════
function CreditPanel({ credits }) {
  const [snap, setSnap] = useState(()=>credits.snapshot());
  useEffect(()=>{
    const unsub = credits.subscribe(()=>setSnap(credits.snapshot()));
    return unsub;
  },[credits]);

  return (
    <div style={{padding:'10px 14px'}}>
      <div style={{fontSize:9,color:'#2a2a40',marginBottom:8,fontFamily:'IBM Plex Mono',letterSpacing:'0.08em'}}>
        API CREDIT USAGE — SESSION
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        {Object.entries(MUSEUM_META).map(([m,meta])=>{
          const s=snap.session[m]||{req:0,res:0,err:0};
          const daily=snap.daily[m]||0;
          const lim=meta.dailyLimit;
          const pct=lim?Math.min(100,(daily/lim)*100):0;
          const col=pct>=80?'#ef4444':pct>=50?'#f59e0b':'#22c55e';
          if(s.req===0&&daily===0)return(
            <div key={m} style={{display:'flex',alignItems:'center',gap:6,opacity:0.25}}>
              <MusTag m={m}/><span className="mono" style={{fontSize:8,color:'#1e1e30'}}>idle</span>
            </div>
          );
          return(
            <div key={m} style={{display:'flex',alignItems:'center',gap:6}}>
              <MusTag m={m}/>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2}}>
                  <span className="mono" style={{fontSize:9,color:'#8888a8'}}>{s.req}req</span>
                  {s.res>0&&<span className="mono" style={{fontSize:8,color:'#444460'}}>→{s.res}</span>}
                  {s.err>0&&<span className="mono" style={{fontSize:8,color:'#ef4444'}}>✗{s.err}</span>}
                  <span style={{marginLeft:'auto'}} className="mono">
                    {lim ? <span style={{fontSize:8,color:col}}>{daily}/{lim}</span> : <span style={{fontSize:8,color:'#2a2a40'}}>∞</span>}
                  </span>
                </div>
                {lim&&(
                  <div style={{background:'#131320',borderRadius:1,height:2,overflow:'hidden'}}>
                    <div className="credit-strip" style={{width:`${pct}%`,background:col}}/>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{marginTop:8,padding:'6px 8px',background:'#09090f',border:'1px solid #131320',borderRadius:3}}>
        <div className="mono" style={{fontSize:9,color:'#3a3a58'}}>
          SESSION TOTAL: <span style={{color:'#c8c8e8'}}>{credits.totalSessionReqs()} requests</span>
        </div>
        <div style={{fontSize:8,color:'#1a1a28',marginTop:2}}>All APIs are free-tier. Limits shown are daily quotas.</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COLLECTION DECK PANEL
// ═══════════════════════════════════════════════════════════════════════════════
function DeckPanel({ manager, open, onClose }) {
  const [cols, setCols]       = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [newName, setNewName]  = useState('');
  const [showNew, setShowNew]  = useState(false);
  const [copied, setCopied]    = useState(false);

  const refresh = useCallback(()=>setCols(manager.all()),[manager]);
  useEffect(()=>refresh(),[manager]);
  useEffect(()=>{ if(open) refresh(); },[open,refresh]);

  const active = cols.find(c=>c.id===activeId);

  const create = () => {
    if (!newName.trim()) return;
    const id = manager.create(newName.trim());
    setNewName(''); setShowNew(false); setActiveId(id); refresh();
  };

  const exportCol = () => {
    const json = manager.exportJSON(activeId);
    if (!json) return;
    const blob = new Blob([json],{type:'application/json'});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href=url; a.download=`${active?.name||'collection'}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const diversity = activeId ? manager.museumDiversity(activeId) : [];

  return (
    <div className={`deck-panel ${open?'open':''}`}>
      {/* Header */}
      <div style={{padding:'11px 14px',borderBottom:'1px solid #161626',display:'flex',justifyContent:'space-between',alignItems:'center',background:'#07070c',flexShrink:0}}>
        <span className="mono" style={{fontSize:11,color:'#fbbf24',letterSpacing:'0.06em'}}>⊟ DECK</span>
        <button onClick={onClose} style={{background:'none',border:'none',color:'#2a2a40',cursor:'pointer',fontSize:16,lineHeight:1}}>×</button>
      </div>

      {/* Collection tabs */}
      <div style={{padding:'8px 10px',borderBottom:'1px solid #111120',display:'flex',gap:4,flexWrap:'wrap',flexShrink:0}}>
        {cols.map(col=>(
          <button key={col.id} onClick={()=>setActiveId(col.id)} style={{
            padding:'3px 8px',borderRadius:3,border:'1px solid',fontSize:10,cursor:'pointer',transition:'all 0.1s',
            borderColor:activeId===col.id?'#fbbf2455':'#161628',
            background:activeId===col.id?'rgba(251,191,36,0.08)':'transparent',
            color:activeId===col.id?'#fbbf24':'#444466',
          }}>
            {col.name}
            <span style={{marginLeft:4,color:activeId===col.id?'#fbbf2466':'#2a2a40'}}>{col.items.length}</span>
          </button>
        ))}
        <button onClick={()=>setShowNew(s=>!s)} style={{padding:'3px 8px',borderRadius:3,border:'1px dashed #1a1a2c',fontSize:10,cursor:'pointer',background:'transparent',color:'#2a2a40'}}>+</button>
      </div>

      {/* New collection input */}
      {showNew && (
        <div style={{padding:'8px 10px',borderBottom:'1px solid #0f0f1e',display:'flex',gap:6,flexShrink:0}}>
          <input value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&create()}
            placeholder="Name…"
            style={{flex:1,background:'#0c0c18',border:'1px solid #1e1e30',borderRadius:3,color:'#c8c8e8',padding:'4px 8px',fontSize:11,outline:'none'}}
          />
          <button onClick={create} style={{padding:'4px 10px',background:'#fbbf24',color:'#07070f',border:'none',borderRadius:3,fontSize:11,fontWeight:600,cursor:'pointer'}}>Create</button>
        </div>
      )}

      {/* Museum diversity bar for active collection */}
      {active && diversity.length > 0 && (
        <div style={{padding:'6px 10px',borderBottom:'1px solid #0f0f1e',flexShrink:0}}>
          <div style={{fontSize:8,color:'#2a2a40',marginBottom:4,fontFamily:'IBM Plex Mono'}}>MUSEUM DIVERSITY</div>
          <div style={{display:'flex',gap:2}}>
            {diversity.map(([m,n])=>(
              <div key={m} title={`${MUSEUM_META[m]?.label||m}: ${n}`}
                style={{flex:n,height:4,background:MUSEUM_META[m]?.color||'#444',borderRadius:1,minWidth:4}}/>
            ))}
          </div>
          <div style={{display:'flex',gap:4,marginTop:4,flexWrap:'wrap'}}>
            {diversity.map(([m,n])=><span key={m} style={{fontSize:8,color:MUSEUM_META[m]?.color||'#888'}}>{MUSEUM_META[m]?.label} {n}</span>)}
          </div>
        </div>
      )}

      {/* Artwork list */}
      <div style={{flex:1,overflowY:'auto',padding:'8px 10px',display:'flex',flexDirection:'column',gap:6}}>
        {!activeId && (
          <div style={{textAlign:'center',padding:'32px 0',color:'#1a1a28',fontSize:11}}>
            {cols.length===0?'Create a collection to begin curating':'Select a collection above'}
          </div>
        )}
        {active?.items.length===0 && (
          <div style={{textAlign:'center',padding:'24px 0',color:'#1a1a28',fontSize:11}}>
            Empty — add artworks via "+ deck" on results
          </div>
        )}
        {active?.items.map((item,i)=>(
          <div key={i} className="deck-card">
            {item.imageUrl && (
              <div style={{position:'relative'}}>
                <img src={item.imageUrl} alt={item.title} style={{width:'100%',height:80,objectFit:'cover',display:'block',opacity:0.88}}/>
                <button onClick={()=>{manager.remove(activeId,item.id);refresh();}}
                  style={{position:'absolute',top:4,right:4,background:'rgba(0,0,0,0.7)',border:'none',color:'#666',cursor:'pointer',fontSize:12,borderRadius:2,width:20,height:20,display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
              </div>
            )}
            <div style={{padding:'5px 8px'}}>
              <div style={{fontSize:11,color:'#b0b0d0',marginBottom:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.title}</div>
              <div style={{fontSize:9,color:'#3a3a58',marginBottom:4}}>{item.artist?.slice(0,30)} · {item.date}</div>
              <div style={{display:'flex',gap:2,flexWrap:'wrap',alignItems:'center'}}>
                {[...new Set(item.sources?.map(s=>s.source)||[])].map(m=><MusTag key={m} m={m}/>)}
                {item.confidence&&<ConfBadge c={item.confidence}/>}
              </div>
              {item.richness&&<RBar r={item.richness} compact/>}
            </div>
          </div>
        ))}
      </div>

      {/* Footer actions */}
      {active && (
        <div style={{padding:'8px 10px',borderTop:'1px solid #101020',display:'flex',gap:6,flexShrink:0}}>
          <button onClick={exportCol} style={{flex:1,padding:'6px',background:'transparent',border:'1px solid #1a1a2c',borderRadius:3,color:'#444466',fontSize:11,cursor:'pointer'}}>
            ↓ Export JSON
          </button>
          <button onClick={()=>{manager.delete(activeId);setActiveId(null);refresh();}}
            style={{padding:'6px 10px',background:'transparent',border:'1px solid #2a1010',borderRadius:3,color:'#442222',fontSize:11,cursor:'pointer'}}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADD-TO-DECK MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function AddToDeckModal({ artwork, manager, onClose }) {
  const [cols, setCols]     = useState(()=>manager.all());
  const [added, setAdded]   = useState(null);
  const [newName, setNewName]=useState('');
  const [showNew, setShowNew]=useState(false);

  const add = (colId) => {
    const ok = manager.add(colId, artwork);
    setAdded(colId);
    if (ok) setTimeout(onClose, 700);
  };
  const create = () => {
    if (!newName.trim()) return;
    const id = manager.create(newName.trim());
    setCols(manager.all());
    setNewName(''); setShowNew(false);
    add(id);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div style={{background:'#0c0c18',border:'1px solid #202038',borderRadius:6,width:260,padding:16}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:12,color:'#8888b0',marginBottom:4}}>Add to collection</div>
        <div style={{fontSize:11,color:'#4a4a68',marginBottom:12,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{artwork.title}</div>
        <div style={{display:'flex',flexDirection:'column',gap:5}}>
          {cols.map(col=>(
            <button key={col.id} onClick={()=>add(col.id)} style={{
              padding:'8px 12px',background:added===col.id?'rgba(34,197,94,0.1)':'#09090f',
              border:`1px solid ${added===col.id?'rgba(34,197,94,0.3)':'#161628'}`,
              borderRadius:3,color:added===col.id?'#22c55e':'#a0a0c0',fontSize:12,cursor:'pointer',textAlign:'left',transition:'all 0.15s',
            }}>
              {added===col.id?'✓ ':''}{col.name} <span style={{color:'#2a2a40'}}>({col.items.length})</span>
            </button>
          ))}
          {cols.length===0&&<div style={{fontSize:11,color:'#2a2a40',padding:'12px 0',textAlign:'center'}}>No collections yet</div>}
          <button onClick={()=>setShowNew(s=>!s)} style={{padding:'6px',background:'transparent',border:'1px dashed #1a1a2c',borderRadius:3,color:'#2a2a40',fontSize:11,cursor:'pointer'}}>+ New collection</button>
          {showNew && (
            <div style={{display:'flex',gap:5}}>
              <input value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&create()} placeholder="Name…"
                style={{flex:1,background:'#0a0a14',border:'1px solid #1a1a2e',borderRadius:3,color:'#c8c8e8',padding:'4px 8px',fontSize:11,outline:'none'}}
              />
              <button onClick={create} style={{padding:'4px 10px',background:'#fbbf24',color:'#07070f',border:'none',borderRadius:3,fontSize:11,fontWeight:600,cursor:'pointer'}}>+</button>
            </div>
          )}
        </div>
        <button onClick={onClose} style={{marginTop:10,width:'100%',padding:'6px',background:'transparent',border:'1px solid #141424',borderRadius:3,color:'#2a2a40',fontSize:11,cursor:'pointer'}}>Cancel</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN PANEL — Search Modes + City Scout + Coverage Inspector
// ═══════════════════════════════════════════════════════════════════════════════
function AdminPanel({ open, onClose, searchMode, onModeSelect, scoutCity, onCitySelect, results }) {
  const [tab, setTab] = React.useState('modes');

  // City scout: live re-rank current results by selected city — zero API calls
  const cityRanked = React.useMemo(() => {
    if (!results.length || !scoutCity) return [];
    return [...results]
      .map(r => ({ ...r, _cs: computeCityScore(r, scoutCity) }))
      .sort((a, b) => b._cs.mult - a._cs.mult)
      .slice(0, 15);
  }, [results, scoutCity]);

  const tierColor = { S:'#fbbf24', A:'#22c55e', B:'#3b82f6', C:'#8b5cf6', D:'#444466' };

  return (
    <div className={`admin-panel ${open ? 'open' : ''}`}>
      {/* Header */}
      <div style={{padding:'11px 14px',borderBottom:'1px solid #161626',display:'flex',justifyContent:'space-between',alignItems:'center',background:'#06060c',flexShrink:0}}>
        <span className="mono" style={{fontSize:11,color:'#06b6d4',letterSpacing:'0.08em'}}>⚙ ADMIN</span>
        <button onClick={onClose} style={{background:'none',border:'none',color:'#2a2a40',cursor:'pointer',fontSize:16,lineHeight:1,padding:2}}>×</button>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',borderBottom:'1px solid #111120',flexShrink:0}}>
        {[{id:'modes',label:'Modes'},{id:'city',label:'City Scout'},{id:'coverage',label:'Coverage'}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            flex:1,padding:'8px 4px',background:'transparent',border:'none',borderBottom:`2px solid ${tab===t.id?'#06b6d4':'transparent'}`,
            color:tab===t.id?'#06b6d4':'#2a2a44',fontSize:11,cursor:'pointer',fontFamily:'IBM Plex Mono',letterSpacing:'0.04em',transition:'color 0.12s',
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{flex:1,overflowY:'auto'}}>

        {/* ── MODES TAB ── */}
        {tab==='modes' && (
          <div style={{padding:'10px 10px',display:'flex',flexDirection:'column',gap:6}}>
            <div className="mono" style={{fontSize:8,color:'#1e1e30',marginBottom:4,letterSpacing:'0.06em'}}>SEARCH METHOD — applies on next ▶ Run</div>
            {SEARCH_MODES.map(m=>(
              <button key={m.id} className={`mode-btn ${searchMode===m.id?'active':''}`}
                style={{'--mc':m.color}}
                onClick={()=>onModeSelect(m.id)}>
                <span style={{fontSize:14,color:searchMode===m.id?m.color:'#2a2a40',flexShrink:0,fontFamily:'IBM Plex Mono'}}>{m.icon}</span>
                <div>
                  <div style={{fontSize:11,fontWeight:500,color:searchMode===m.id?m.color:'#8080a0',marginBottom:2}}>{m.label}</div>
                  <div style={{fontSize:10,color:'#2a2a40',lineHeight:1.4}}>{m.desc}</div>
                </div>
              </button>
            ))}
            <div style={{marginTop:8,padding:'8px 10px',background:'#09090f',border:'1px solid #0f0f1e',borderRadius:4}}>
              <div className="mono" style={{fontSize:8,color:'#1e1e30',marginBottom:5,letterSpacing:'0.06em'}}>HOW MODES DIFFER</div>
              <div style={{fontSize:10,color:'#303050',lineHeight:1.6}}>
                <strong style={{color:'#404060'}}>Standard</strong> — richness-ranked, all museums<br/>
                <strong style={{color:'#404060'}}>Artist</strong> — same pipeline, artist-score priority<br/>
                <strong style={{color:'#404060'}}>Movement</strong> — Wikidata movement SPARQL<br/>
                <strong style={{color:'#404060'}}>City Scout</strong> — re-ranks by city affinity ×<br/>
                <strong style={{color:'#404060'}}>Top Demand</strong> — pageViews + rank sort<br/>
                <strong style={{color:'#404060'}}>Curate Hunt</strong> — color + thematic priority
              </div>
            </div>
          </div>
        )}

        {/* ── CITY SCOUT TAB ── */}
        {tab==='city' && (
          <div style={{padding:'10px'}}>
            <div className="mono" style={{fontSize:8,color:'#1e1e30',marginBottom:8,letterSpacing:'0.06em'}}>SELECT CITY — re-ranks current results instantly, no API calls</div>

            {/* City grid */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:4,marginBottom:10}}>
              {Object.entries(CITY_AFFINITIES).map(([key,city])=>(
                <button key={key} className={`city-pill ${scoutCity===key?'selected':''}`}
                  style={{'--cc':'#06b6d4'}}
                  onClick={()=>onCitySelect(key)}>
                  <span>{city.flag}</span>
                  <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:56}}>{city.name}</span>
                </button>
              ))}
            </div>

            {/* Selected city affinities */}
            {scoutCity && CITY_AFFINITIES[scoutCity] && (
              <div style={{marginBottom:10,padding:'8px 10px',background:'#09090f',border:'1px solid #0f0f1e',borderRadius:4}}>
                <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:6}}>
                  <span style={{fontSize:16}}>{CITY_AFFINITIES[scoutCity].flag}</span>
                  <div>
                    <div style={{fontSize:12,fontWeight:500,color:'#c8c8e8'}}>{CITY_AFFINITIES[scoutCity].name}</div>
                    <div style={{fontSize:9,color:'#2a2a40'}}>{CITY_AFFINITIES[scoutCity].region}</div>
                  </div>
                </div>
                {/* Movement affinities */}
                <div className="mono" style={{fontSize:8,color:'#1e1e30',marginBottom:3,letterSpacing:'0.05em'}}>MOVEMENT BONUSES</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:3,marginBottom:6}}>
                  {Object.entries(CITY_AFFINITIES[scoutCity].movement||{}).map(([k,m])=>(
                    <span key={k} style={{fontSize:9,padding:'1px 5px',borderRadius:2,
                      background:m>=2.0?'rgba(251,191,36,0.12)':m>=1.7?'rgba(34,197,94,0.1)':'rgba(59,130,246,0.08)',
                      color:m>=2.0?'#fbbf24':m>=1.7?'#22c55e':'#3b82f6',
                      border:`1px solid ${m>=2.0?'rgba(251,191,36,0.2)':m>=1.7?'rgba(34,197,94,0.2)':'rgba(59,130,246,0.18)'}`,
                      fontFamily:'IBM Plex Mono'}}>
                      {k} {m.toFixed(1)}×
                    </span>
                  ))}
                </div>
                <div className="mono" style={{fontSize:8,color:'#1e1e30',marginBottom:3,letterSpacing:'0.05em'}}>CULTURE BONUSES</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:3}}>
                  {Object.entries(CITY_AFFINITIES[scoutCity].culture||{}).map(([k,m])=>(
                    <span key={k} style={{fontSize:9,padding:'1px 5px',borderRadius:2,
                      background:'rgba(139,92,246,0.1)',color:'#8b5cf6',border:'1px solid rgba(139,92,246,0.2)',fontFamily:'IBM Plex Mono'}}>
                      {k} {m.toFixed(1)}×
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ranked results */}
            {cityRanked.length > 0 ? (
              <div style={{display:'flex',flexDirection:'column',gap:4}}>
                <div className="mono" style={{fontSize:8,color:'#1e1e30',marginBottom:2,letterSpacing:'0.05em'}}>
                  TOP RESULTS IN {CITY_AFFINITIES[scoutCity]?.name?.toUpperCase()||''}
                </div>
                {cityRanked.map((item, i) => {
                  const cs = item._cs;
                  const tc = tierColor[cs.tier] || '#444466';
                  return (
                    <div key={item.id} style={{background:'#0a0a14',border:'1px solid #141424',borderRadius:3,padding:'6px 8px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:6,marginBottom:3}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:10,color:'#9090b0',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.title?.slice(0,30)}</div>
                          <div style={{fontSize:9,color:'#2a2a40'}}>{item.artist?.slice(0,22)}</div>
                        </div>
                        <div style={{flexShrink:0,textAlign:'right'}}>
                          <span className="tier-badge" style={{background:`${tc}18`,color:tc,border:`1px solid ${tc}44`}}>{cs.tier}</span>
                          <div className="mono" style={{fontSize:10,color:tc,marginTop:1}}>{cs.mult.toFixed(1)}×</div>
                        </div>
                      </div>
                      {/* Mult bar */}
                      <div style={{background:'#0d0d1a',borderRadius:2,height:3,overflow:'hidden'}}>
                        <div className="phase-bar" style={{width:`${Math.min(100,(cs.mult/4.5)*100)}%`,background:tc}}/>
                      </div>
                      {/* Match factors */}
                      {cs.factors.length > 0 && (
                        <div style={{display:'flex',flexWrap:'wrap',gap:2,marginTop:4}}>
                          {cs.factors.map((f,fi)=>(
                            <span key={fi} style={{fontSize:8,color:'#3a3a58',fontFamily:'IBM Plex Mono',background:'#0e0e1c',padding:'0 3px',borderRadius:1}}>
                              {f.field}:{f.matched} {f.mult.toFixed(1)}×
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{padding:'24px 0',textAlign:'center',color:'#1e1e30',fontSize:11}}>
                Run a search first, then select a city to see rankings
              </div>
            )}
          </div>
        )}

        {/* ── COVERAGE TAB ── */}
        {tab==='coverage' && (
          <div style={{padding:'10px'}}>
            <div className="mono" style={{fontSize:8,color:'#1e1e30',marginBottom:8,letterSpacing:'0.06em'}}>METADATA COVERAGE — which fields the top results carry</div>
            {results.length === 0 ? (
              <div style={{padding:'24px 0',textAlign:'center',color:'#1e1e30',fontSize:11}}>Run a search to inspect coverage</div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:3}}>
                {[
                  {label:'Color data',     fn: r => (r.colors?.length||0)+(r.harvardColors?.length||0)+(r.aicDominantColor?1:0) > 0},
                  {label:'Movement',       fn: r => !!(r.movement||r.styleTitles?.length)},
                  {label:'Culture',        fn: r => !!r.culture},
                  {label:'Provenance',     fn: r => !!r.provenanceText},
                  {label:'PageViews',      fn: r => !!r.totalPageViews},
                  {label:'ExhibitionCount',fn: r => (r.exhibitionCount||0) > 0},
                  {label:'IconClass',      fn: r => !!r.iconClass},
                  {label:'Dynasty',        fn: r => !!r.dynasty},
                  {label:'Techniques',     fn: r => (r.techniques?.length||0) > 0},
                  {label:'Tags (3+)',      fn: r => (r.tags?.length||0) >= 3},
                  {label:'On View',        fn: r => !!r.isOnView},
                  {label:'Highlight',      fn: r => !!r.isHighlight},
                ].map(({label,fn})=>{
                  const top = results.slice(0, 20);
                  const hits = top.filter(fn).length;
                  const pct = Math.round((hits / top.length) * 100);
                  const col = pct >= 70 ? '#22c55e' : pct >= 40 ? '#fbbf24' : '#444466';
                  return (
                    <div key={label} style={{display:'flex',alignItems:'center',gap:8}}>
                      <span style={{fontSize:10,color:'#404060',minWidth:105,flexShrink:0,fontFamily:'IBM Plex Mono'}}>{label}</span>
                      <div style={{flex:1,height:4,background:'#0f0f1e',borderRadius:2,overflow:'hidden'}}>
                        <div className="phase-bar" style={{width:`${pct}%`,background:col}}/>
                      </div>
                      <span className="mono" style={{fontSize:9,color:col,minWidth:30,textAlign:'right'}}>{hits}/{top.length}</span>
                    </div>
                  );
                })}
                <div style={{marginTop:8,fontSize:9,color:'#2a2a40',lineHeight:1.6}}>
                  Coverage shows top 20 results. Low coverage means the formula relies more on multi-museum consensus than per-field data.
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

const VIZ_MAP = {
  graph:       GraphViz,
  wikidata:    WikidataViz,
  fetch:       FetchViz,
  phash:       PHashViz,
  fingerprint: FingerprintViz,
  cluster:     ClusterViz,
  score:       ScoreViz,
};

export default function ArtNexus() {
  const [query,      setQuery]      = useState('');
  const [loading,    setLoading]    = useState(false);
  const [results,    setResults]    = useState([]);
  const [stages,     setStages]     = useState(INIT_STAGES);
  const [selected,   setSelected]   = useState(null);
  const [log,        setLog]        = useState([]);
  const [showLog,    setShowLog]    = useState(false);
  const [gStats,     setGStats]     = useState({total:0,nodes:0,multi:0,avg:'0'});
  const [settings,   setSettings]   = useState({useWikidata:true,usePHash:true,deepFetch:false});
  const [graphLoaded,setGraphLoaded]= useState(false);
  const [deckOpen,   setDeckOpen]   = useState(false);
  const [activeViz,  setActiveViz]  = useState(null);
  const [vizData,    setVizData]    = useState({});
  const [showCredits,setShowCredits]= useState(false);
  const [suggestions,setSuggestions]= useState([]);
  const [deckTarget, setDeckTarget] = useState(null);
  const [creditTick, setCreditTick] = useState(0);
  const [adminOpen,  setAdminOpen]  = useState(false);
  const [searchMode, setSearchMode] = useState('standard');
  const [scoutCity,  setScoutCity]  = useState('paris');
  const [browseLoading, setBrowseLoading] = useState(true);
  const [isBrowseMode,  setIsBrowseMode]  = useState(true);

  const graphRef    = useRef(new ConnectionGraph());
  const creditsRef  = useRef(new CreditTracker());
  const learnerRef  = useRef(new SelfLearner());
  const collRef     = useRef(new CollectionManager());
  const logRef      = useRef([]);

  useEffect(()=>{
    Promise.all([
      graphRef.current.load(),
      creditsRef.current.load(),
      learnerRef.current.load(),
      collRef.current.load(),
    ]).then(()=>{
      setGStats(graphRef.current.getStats());
      setGraphLoaded(true);
    });
    const unsub = creditsRef.current.subscribe(()=>setCreditTick(t=>t+1));
    return unsub;
  },[]);

  // Auto-populate discover feed on mount: fresh API browse + pool
  useEffect(()=>{
    (async()=>{
      setBrowseLoading(true);
      try{
        const [pool,freshArtworks]=await Promise.all([poolLoad(),fetchBrowseArtworks()]);
        const matcher=new Matcher(), fp=new Fingerprinter(), pHashStub={hamming:()=>999};
        const merged=dedup([...freshArtworks,...pool]);
        const fpMap=fp.buildMap(merged,matcher);
        const clusters=buildClusters(merged,matcher,pHashStub,fpMap,[]);
        const scored=clusters.map(c=>({...c,richness:scoreRichness(c,'',matcher)})).sort((a,b)=>b.richness.total-a.richness.total);
        // Enrich top 15 with detail APIs
        await Promise.allSettled(scored.slice(0,15).map(async cluster=>{
          const uniq=[...new Map(cluster.sources.map(s=>[s.source,s])).values()];
          await Promise.allSettled(uniq.map(async({source,id})=>{
            if(!['rijks','harvard','aic','cleveland'].includes(source))return;
            const detail=await fetchDetail(source,id,creditsRef.current);
            if(detail)mergeDetail(cluster,source,detail);
          }));
          cluster.richness=scoreRichness(cluster,'',matcher);
        }));
        scored.sort((a,b)=>b.richness.total-a.richness.total);
        setResults(scored);
        setIsBrowseMode(true);
        poolSave(freshArtworks).catch(()=>{});
      }catch(e){/* silent */}
      setBrowseLoading(false);
    })();
  },[]);

  const addLog = useCallback(entry=>{
    logRef.current = [...logRef.current.slice(-49), entry];
    setLog([...logRef.current]);
  },[]);

  const updateStage = useCallback((key, upd)=>{
    setStages(prev=>({
      ...prev,
      [key]:{
        ...prev[key], ...upd,
        perMuseum:{...(prev[key]?.perMuseum||{}), ...(upd.perMuseum||{})},
      },
    }));
    if (upd.message) addLog({stage:key, msg:upd.message, type:upd.status==='error'?'error':'info', ts:Date.now()});
  },[addLog]);

  const updateViz = useCallback((stage, data)=>{
    setVizData(prev=>({...prev,[stage]:data}));
    if (data !== null) setActiveViz(stage);
  },[]);

  const handleSearch = async () => {
    if (!query.trim()||loading) return;
    setLoading(true); setResults([]); setStages(INIT_STAGES);
    logRef.current=[]; setLog([]); setVizData({}); setActiveViz(null);
    try {
      let {results:scored, museumBreakdown} = await runPipeline(
        query, graphRef.current, settings, creditsRef.current,
        updateStage, addLog, updateViz
      );

      // ── Mode-based post-processing (zero extra API calls) ──────────────────
      if (searchMode === 'city') {
        // City Scout: re-rank by affinity for the selected city
        scored = [...scored].sort((a,b) =>
          computeCityScore(b, scoutCity).mult - computeCityScore(a, scoutCity).mult
        );
        addLog({stage:'score',msg:`City Scout: re-ranked for ${CITY_AFFINITIES[scoutCity]?.name}`,type:'success',ts:Date.now()});
      } else if (searchMode === 'demand') {
        // Top Demand: sort by Harvard pageViews + rank signal
        scored = [...scored].sort((a,b) => {
          const dA = (a.totalPageViews||0) + (a.rank ? Math.max(0, 50000 - a.rank) * 0.5 : 0);
          const dB = (b.totalPageViews||0) + (b.rank ? Math.max(0, 50000 - b.rank) * 0.5 : 0);
          return dB - dA;
        });
        addLog({stage:'score',msg:'Top Demand: re-ranked by pageViews + rank',type:'success',ts:Date.now()});
      } else if (searchMode === 'curate') {
        // Curate Hunt: sort by richness of color + thematic metadata
        scored = [...scored].sort((a,b) => {
          const cA = computePhaseScores(a).curate.score * 20 + (a.richness?.total||0) * 0.3;
          const cB = computePhaseScores(b).curate.score * 20 + (b.richness?.total||0) * 0.3;
          return cB - cA;
        });
        addLog({stage:'score',msg:'Curate Hunt: re-ranked by thematic/color depth',type:'success',ts:Date.now()});
      } else if (searchMode === 'artist') {
        // Artist mode: boost artist-match component; re-sort by queryArtist+queryExact
        scored = [...scored].sort((a,b) => {
          const aA = (a.richness?.breakdown?.queryArtist||0) + (a.richness?.breakdown?.queryExact||0);
          const bA = (b.richness?.breakdown?.queryArtist||0) + (b.richness?.breakdown?.queryExact||0);
          if (bA !== aA) return bA - aA;
          return (b.richness?.total||0) - (a.richness?.total||0);
        });
        addLog({stage:'score',msg:'Artist mode: re-ranked by artist match score',type:'success',ts:Date.now()});
      }

      setResults(scored);
      setIsBrowseMode(false);
      setGStats(graphRef.current.getStats());
      learnerRef.current.record(query, scored.length, scored.filter(c=>c.sources.length>1).length, museumBreakdown);
      setSuggestions(learnerRef.current.getSuggestions(query));
      // Grow the discover pool with every search (non-blocking)
      poolSave(scored).catch(()=>{});
    } catch(e) {
      addLog({stage:'system',msg:`Pipeline error: ${e.message}`,type:'error',ts:Date.now()});
    } finally { setLoading(false); }
  };

  const totalFetched = Object.values(stages.fetch.perMuseum||{}).reduce((s,v)=>s+(typeof v==='number'?v:0),0);
  const multiCount   = results.filter(r=>r.sources.length>1).length;
  const sessionReqs  = creditsRef.current.totalSessionReqs();
  const nearLimit    = Object.keys(MUSEUM_META).some(m=>creditsRef.current.nearLimit(m));

  const ActiveVizComp = activeViz ? VIZ_MAP[activeViz] : null;

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div style={{borderBottom:'1px solid #161626',background:'#06060d',padding:'9px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
        <div style={{display:'flex',alignItems:'baseline',gap:10}}>
          <span className="mono" style={{fontSize:13,fontWeight:600,color:'#fbbf24',letterSpacing:'0.06em'}}>ART∷NEXUS</span>
          <span style={{fontSize:10,color:'#22223a'}}>cross-museum intelligence</span>
        </div>
        <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
          {results.length>0&&<>
            <span className="stat-chip"><span style={{fontSize:9,color:'#3a3a58'}}>total</span><span className="mono" style={{fontSize:11,color:'#c8c8e8'}}>{results.length}</span></span>
            <span className="stat-chip"><span style={{fontSize:9,color:'#3a3a58'}}>multi</span><span className="mono" style={{fontSize:11,color:'#fbbf24'}}>{multiCount}</span></span>
            <span className="stat-chip"><span style={{fontSize:9,color:'#3a3a58'}}>fetched</span><span className="mono" style={{fontSize:11,color:'#c8c8e8'}}>{totalFetched}</span></span>
          </>}
          {/* Credit chip — color-warns when near limit */}
          <span className="stat-chip" style={{cursor:'pointer',borderColor:nearLimit?'#f59e0b44':'#161626'}} onClick={()=>setShowCredits(s=>!s)} title="API credit usage">
            <span style={{fontSize:9,color:'#3a3a58'}}>api</span>
            <span className="mono" style={{fontSize:11,color:nearLimit?'#f59e0b':sessionReqs>50?'#fbbf24':'#22c55e'}}>{sessionReqs}req</span>
          </span>
          <span className="stat-chip"><span style={{fontSize:9,color:'#3a3a58'}}>◈</span><span className="mono" style={{fontSize:11,color:'#22c55e'}}>{gStats.total}</span></span>
          <button className={`toggle-btn ${adminOpen?'on':''}`} onClick={()=>setAdminOpen(s=>!s)} title="Admin panel — search modes, city scout, coverage">
            <span style={{fontSize:9,color:adminOpen?'#06b6d4':'inherit'}}>⚙</span>
            <span style={{color:adminOpen?'#06b6d4':'inherit'}}>Admin</span>
            {searchMode!=='standard'&&<span className="mono" style={{fontSize:8,color:'#06b6d4'}}>{SEARCH_MODES.find(m=>m.id===searchMode)?.icon}</span>}
          </button>
          <button className={`toggle-btn ${deckOpen?'on':''}`} onClick={()=>setDeckOpen(s=>!s)}>
            <span style={{fontSize:9}}>⊟</span> Deck
            {collRef.current.totalItems()>0&&<span className="mono" style={{color:'#fbbf24',fontSize:9}}>{collRef.current.totalItems()}</span>}
          </button>
        </div>
      </div>

      {/* ── CREDIT PANEL ─────────────────────────────────────────── */}
      {showCredits && (
        <div style={{background:'#07070c',borderBottom:'1px solid #141424'}} className="fade-in">
          <CreditPanel credits={creditsRef.current}/>
        </div>
      )}

      {/* ── STAGE BAR ─────────────────────────────────────────────── */}
      <div className="stage-bar">
        {STAGE_DEFS.map((def,idx)=>{
          const s = stages[def.key];
          const isActive = activeViz===def.key;
          const hasViz = vizData[def.key] !== undefined;
          return(
            <div key={def.key} className={`stage-item ${s.status} ${isActive?'active-viz':''}`}
              style={{flex:def.key==='fetch'?2:1}}
              onClick={()=>hasViz&&setActiveViz(isActive?null:def.key)}
              title={`${def.label} · render ${def.perf}\n${s.message||''}`}>
              <div style={{display:'flex',alignItems:'center',gap:4,marginBottom:2}}>
                <span className="mono" style={{fontSize:9,color:'#1e1e30'}}>{String(idx+1).padStart(2,'0')}</span>
                <span style={{fontSize:12,color:s.status==='complete'?'#22c55e':s.status==='running'?'#fbbf24':'#1e1e30'}}>{def.icon}</span>
                {s.status==='running'&&<span className="spin" style={{fontSize:8,color:'#fbbf24'}}>◌</span>}
                {s.status==='complete'&&<span style={{fontSize:7,color:'#22c55e'}}>●</span>}
                {s.status==='error'&&<span style={{fontSize:7,color:'#ef4444'}}>●</span>}
              </div>
              <div className="mono" style={{fontSize:9,color:s.status==='complete'?'#9090b0':s.status==='running'?'#6060a0':'#1e1e30',letterSpacing:'0.05em'}}>{def.label}</div>
              {s.status==='complete'&&s.count>0&&<div className="mono" style={{fontSize:8,color:'#22c55e44',marginTop:1}}>{s.count}</div>}
              {s.status==='running'&&<div style={{fontSize:8,color:'#fbbf2466',marginTop:1,maxWidth:76,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.message?.slice(0,18)}</div>}
              {/* Render perf dot */}
              <div className="mono" style={{fontSize:7,color:'#1a1a28',marginTop:2}}>{def.perf}</div>
              {/* Museum fetch breakdown */}
              {def.key==='fetch'&&Object.keys(s.perMuseum).length>0&&(
                <div style={{display:'flex',gap:2,marginTop:3,flexWrap:'wrap',justifyContent:'center'}}>
                  {Object.entries(s.perMuseum).map(([m,v])=>(
                    <span key={m} className="mono" style={{fontSize:7,padding:'1px 2px',borderRadius:2,
                      background:v==='running'?'rgba(251,191,36,0.1)':v==='error'?'rgba(239,68,68,0.1)':'rgba(34,197,94,0.07)',
                      color:v==='running'?'#fbbf24':v==='error'?'#ef4444':'#22c55e'}}>
                      {MUSEUM_META[m]?.label}
                    </span>
                  ))}
                </div>
              )}
              {hasViz&&!isActive&&<div style={{fontSize:6,color:'#1e1e30',marginTop:2,fontFamily:'IBM Plex Mono'}}>tap·viz</div>}
            </div>
          );
        })}
      </div>

      {/* ── ACTIVE VIZ PANEL ──────────────────────────────────────── */}
      {activeViz && vizData[activeViz] && ActiveVizComp && (
        <div className="viz-wrap">
          <div className="viz-head">
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <span style={{fontSize:11,color:'#fbbf24'}}>{STAGE_DEFS.find(s=>s.key===activeViz)?.icon}</span>
              <span className="mono" style={{fontSize:10,color:'#8888b0',letterSpacing:'0.05em'}}>{activeViz.toUpperCase()}</span>
              <span className="mono" style={{fontSize:8,color:'#2a2a44',padding:'1px 5px',border:'1px solid #1a1a28',borderRadius:2}}>{STAGE_DEFS.find(s=>s.key===activeViz)?.perf}</span>
            </div>
            <button onClick={()=>setActiveViz(null)} style={{background:'none',border:'none',color:'#2a2a40',cursor:'pointer',fontSize:14,padding:2}}>×</button>
          </div>
          <div style={{maxHeight:300,overflowY:'auto'}}>
            <ActiveVizComp data={vizData[activeViz]}/>
          </div>
        </div>
      )}

      {/* ── SEARCH BAR ────────────────────────────────────────────── */}
      <div style={{padding:'12px 16px',borderBottom:'1px solid #0f0f1e',background:'#08080d'}}>
        <div style={{display:'flex',gap:8,marginBottom:9}}>
          <div style={{flex:1,position:'relative'}}>
            <span style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:'#22223a',fontSize:13,pointerEvents:'none'}}>⌕</span>
            <input className="search-input" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSearch()} placeholder="Artist or title — monet, starry night, rembrandt…"/>
          </div>
          <button className="run-btn" onClick={handleSearch} disabled={loading||!query.trim()}>
            {loading?<span className="spin">◌</span>:'▶ Run'}
          </button>
        </div>
        <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
          <span className="mono" style={{fontSize:9,color:'#1e1e30',marginRight:2}}>PIPELINE:</span>
          {[
            {key:'useWikidata',label:'⬡ Wikidata',tip:'1 SPARQL query · cross-DB IDs'},
            {key:'usePHash',   label:'⊞ pHash',   tip:'DCT 8×8 · <0.1ms render/img'},
            {key:'deepFetch',  label:'⤓ Deep',    tip:'2-3× pages · 2-3× API requests'},
          ].map(opt=>(
            <button key={opt.key} className={`toggle-btn ${settings[opt.key]?'on':''}`}
              onClick={()=>setSettings(s=>({...s,[opt.key]:!s[opt.key]}))} title={opt.tip}>
              <span style={{fontSize:8,color:settings[opt.key]?'#22c55e':'#2a2a40'}}>{settings[opt.key]?'●':'○'}</span>
              {opt.label}
            </button>
          ))}
          <div style={{marginLeft:'auto',display:'flex',gap:5}}>
            <button className="toggle-btn" onClick={()=>setShowLog(s=>!s)}>
              {showLog?'▲':'▼'} log <span className="mono" style={{fontSize:9,color:'#2a2a40'}}>{log.length}</span>
            </button>
            <button className="toggle-btn" onClick={()=>{graphRef.current.clear();setGStats(graphRef.current.getStats());}} title="Clear stored graph">⌫ graph</button>
          </div>
        </div>
        {/* Smart suggestions */}
        {suggestions.length>0 && (
          <div style={{marginTop:8,display:'flex',gap:5,flexWrap:'wrap',alignItems:'center'}}>
            <span className="mono" style={{fontSize:8,color:'#1a1a2c'}}>EXPLORE:</span>
            {suggestions.map(s=>(
              <button key={s} className="suggest-pill" onClick={()=>setQuery(s)}>{s}</button>
            ))}
          </div>
        )}
      </div>

      {/* ── LOG ───────────────────────────────────────────────────── */}
      {showLog && log.length>0 && (
        <div style={{background:'#07070c',borderBottom:'1px solid #0f0f1e',padding:'7px 16px',maxHeight:120,overflowY:'auto'}}>
          {[...log].reverse().map((e,i)=>{
            const stageColor={graph:'#22c55e',wikidata:'#fbbf24',fetch:'#3b82f6',phash:'#8b5cf6',fingerprint:'#06b6d4',cluster:'#f97316',score:'#ef4444'}[e.stage]||'#333355';
            return(
              <div key={i} className="log-row">
                <span className="mono" style={{fontSize:8,color:'#1a1a28',minWidth:50}}>{new Date(e.ts).toLocaleTimeString('en',{hour12:false})}</span>
                <span className="mono" style={{fontSize:8,minWidth:68,color:stageColor}}>{e.stage}</span>
                <span style={{fontSize:10,color:e.type==='error'?'#ef4444':e.type==='success'?'#22c55e':'#2a2a40'}}>{e.msg}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── GRAPH MEMORY BAR ──────────────────────────────────────── */}
      {graphLoaded && gStats.total>0 && (
        <div style={{padding:'4px 16px',background:'#06060c',borderBottom:'1px solid #0d0d1a',display:'flex',gap:14,alignItems:'center'}}>
          <span className="mono" style={{fontSize:8,color:'#1e1e30'}}>◈ MEMORY</span>
          <span className="mono" style={{fontSize:8,color:'#22c55e'}}>{gStats.total} connections</span>
          <span className="mono" style={{fontSize:8,color:'#2a2a40'}}>{gStats.multi} multi-museum</span>
          <span className="mono" style={{fontSize:8,color:'#2a2a40'}}>avg {gStats.avg} nodes</span>
          <span style={{fontSize:7,color:'#1a1a28',marginLeft:'auto',fontFamily:'IBM Plex Mono'}}>persists · accelerates future lookups</span>
        </div>
      )}

      {/* ── ADMIN PANEL ───────────────────────────────────────────── */}
      <AdminPanel
        open={adminOpen} onClose={()=>setAdminOpen(false)}
        searchMode={searchMode} onModeSelect={m=>{setSearchMode(m);if(m==='city')setAdminOpen(true);}}
        scoutCity={scoutCity} onCitySelect={setScoutCity}
        results={results}
      />

      {/* ── RESULTS GRID ──────────────────────────────────────────── */}
      <div style={{padding:'12px 16px 80px',marginRight:deckOpen?296:0,marginLeft:adminOpen?310:0,transition:'margin 0.22s ease'}}>
        {results.length===0 && browseLoading && (
          <div style={{textAlign:'center',padding:'64px 0'}}>
            <div style={{fontSize:11,fontFamily:'IBM Plex Mono',letterSpacing:'0.1em',color:'#2a2a40',marginBottom:8}}>DISCOVER · LOADING</div>
            <div style={{fontSize:9,color:'#1a1a28',fontFamily:'IBM Plex Mono'}}>Fetching most documented paintings…</div>
          </div>
        )}
        {isBrowseMode && results.length>0 && (
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:10,paddingBottom:8,borderBottom:'1px solid #0d0d1a'}}>
            <span style={{fontSize:9,fontFamily:'IBM Plex Mono',letterSpacing:'0.1em',color:'#2a2a40'}}>DISCOVER</span>
            <span style={{fontSize:9,fontFamily:'IBM Plex Mono',color:'#1e1e30'}}>{results.length} paintings · sorted by richness</span>
            {browseLoading&&<span style={{fontSize:9,fontFamily:'IBM Plex Mono',color:'#1a1a28'}}>· updating…</span>}
          </div>
        )}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(228px,1fr))',gap:10}}>
          {results.map((item,idx)=>{
            const museums=[...new Set(item.sources.map(s=>s.source))];
            const isMulti=museums.length>1;
            return(
              <div key={item.id} className={`result-card slide-up ${isMulti?(item.wikidataVerified?'wikidata-verified':'multi-museum'):''}`}
                style={{animationDelay:`${Math.min(idx*0.018,0.36)}s`}}>
                {item.imageUrl && (
                  <div style={{aspectRatio:'4/3',background:'#0a0a14',overflow:'hidden',position:'relative'}}>
                    <img src={item.imageUrl} alt={item.title} style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.88}} loading="lazy"/>
                    <div style={{position:'absolute',top:5,left:5,background:'rgba(6,6,14,0.8)',border:'1px solid #161626',borderRadius:2,padding:'1px 5px'}}>
                      <span className="mono" style={{fontSize:8,color:'#2a2a40'}}>#{idx+1}</span>
                    </div>
                    <div style={{position:'absolute',top:5,right:5,display:'flex',gap:2}}>
                      {item.isHighlight&&(()=>{const hs=[...new Set(item.artworks.filter(a=>a.isHighlight).map(a=>MUSEUM_META[a.source]?.label||a.source))];return<span title={`${hs.join(' · ')} Highlight`} style={{fontSize:9,background:'rgba(251,191,36,0.18)',color:'#fbbf24',padding:'1px 4px',borderRadius:2,lineHeight:1}}>★</span>;})()}
                      {item.wikidataVerified&&<span title="Wikidata" style={{fontSize:8,background:'rgba(34,197,94,0.18)',color:'#22c55e',padding:'1px 4px',borderRadius:2}}>⬡</span>}
                      {item.pHashMatched&&<span title="pHash match" style={{fontSize:8,background:'rgba(139,92,246,0.18)',color:'#8b5cf6',padding:'1px 4px',borderRadius:2}}>⊞</span>}
                      {item.graphHit&&<span title="Graph cache hit" style={{fontSize:8,background:'rgba(251,191,36,0.18)',color:'#fbbf24',padding:'1px 4px',borderRadius:2}}>◈</span>}
                    </div>
                    <button onClick={e=>{e.stopPropagation();setDeckTarget(item);}}
                      style={{position:'absolute',bottom:5,right:5,background:'rgba(6,6,14,0.85)',border:'1px solid #1e1e2e',borderRadius:2,color:'#44446a',fontSize:9,cursor:'pointer',padding:'2px 6px',fontFamily:'IBM Plex Mono'}}>
                      +deck
                    </button>
                  </div>
                )}
                <div style={{padding:'8px 10px'}}>
                  <div style={{fontSize:11,fontWeight:500,color:'#b8b8d8',marginBottom:2,lineHeight:1.3}} title={item.title}>
                    {item.title.length>44?item.title.slice(0,44)+'…':item.title}
                  </div>
                  <div style={{fontSize:10,color:'#303050',marginBottom:5,display:'flex',gap:5}}>
                    <span>{item.artist!=='Unknown'?(item.artist.length>28?item.artist.slice(0,28)+'…':item.artist):'—'}</span>
                    {item.date!=='N/A'&&<><span style={{color:'#1a1a2c'}}>·</span><span className="mono" style={{fontSize:9}}>{item.date}</span></>}
                  </div>
                  <RBar r={item.richness} compact/>
                  <div style={{display:'flex',flexWrap:'wrap',gap:3,margin:'5px 0 4px'}}>
                    {museums.map(m=><MusTag key={m} m={m}/>)}
                  </div>
                  {(()=>{
                    // Best-city badge: top affinity city for this painting
                    const topCity = computeAllCityScores(item)[0];
                    const tierColor = {S:'#fbbf24',A:'#22c55e',B:'#3b82f6',C:'#8b5cf6',D:'#444466'};
                    const tc = topCity?.tier !== 'D' ? (tierColor[topCity?.tier]||'#444466') : null;
                    return tc ? (
                      <div style={{display:'flex',gap:4,alignItems:'center',marginBottom:3}}>
                        <span title={`Best city: ${topCity.name} (${topCity.mult.toFixed(1)}×)`}
                          style={{fontSize:10,padding:'1px 6px',borderRadius:2,background:`${tc}12`,color:tc,border:`1px solid ${tc}33`,cursor:'default',fontFamily:'IBM Plex Mono',display:'flex',alignItems:'center',gap:3}}>
                          {CITY_AFFINITIES[topCity.key]?.flag} {topCity.mult.toFixed(1)}×
                        </span>
                        <span style={{fontSize:8,color:'#2a2a40'}}>{topCity.name}</span>
                      </div>
                    ) : null;
                  })()}
                  <div style={{display:'flex',gap:4,alignItems:'center',marginBottom:6}}>
                    <ConfBadge c={item.confidence}/>
                    {isMulti&&<span className="mono" style={{fontSize:8,padding:'2px 5px',borderRadius:2,background:'rgba(251,191,36,0.07)',color:'#fbbf2488',border:'1px solid rgba(251,191,36,0.18)'}}>{museums.length}× overlap</span>}
                  </div>
                  <button onClick={()=>setSelected(item)}
                    style={{width:'100%',padding:'5px',background:'#0a0a14',border:'1px solid #181828',borderRadius:3,color:'#303050',fontSize:11,cursor:'pointer',transition:'all 0.1s'}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor='#242440';e.currentTarget.style.color='#6060a0';}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='#181828';e.currentTarget.style.color='#303050';}}>
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── DETAIL MODAL ──────────────────────────────────────────── */}
      {selected && (
        <div className="modal-overlay" onClick={()=>setSelected(null)}>
          <div className="modal" style={{maxWidth:780}} onClick={e=>e.stopPropagation()}>
            {/* Header */}
            <div style={{padding:'13px 16px',borderBottom:'1px solid #181828',display:'flex',justifyContent:'space-between',alignItems:'flex-start',background:'#08080e',flexShrink:0}}>
              <div style={{flex:1,marginRight:12}}>
                <div style={{fontSize:14,fontWeight:500,color:'#d0d0f0',marginBottom:3,lineHeight:1.3}}>{selected.title}</div>
                <div style={{fontSize:11,color:'#4a4a68',display:'flex',gap:8,flexWrap:'wrap'}}>
                  {selected.artist!=='Unknown'&&<span>{selected.artist}</span>}
                  {selected.artistBeginDate&&selected.artistEndDate&&<span className="mono" style={{fontSize:9}}>({selected.artistBeginDate}–{selected.artistEndDate})</span>}
                  {selected.date!=='N/A'&&<><span style={{color:'#2a2a3a'}}>·</span><span className="mono" style={{fontSize:9}}>{selected.date}</span></>}
                  {selected.artistNationality&&<span style={{color:'#3a3a58'}}>· {selected.artistNationality}</span>}
                </div>
              </div>
              <div style={{display:'flex',gap:5,alignItems:'center'}}>
                {selected.isHighlight&&<span title="Museum highlight" style={{fontSize:10,background:'rgba(251,191,36,0.1)',color:'#fbbf24',border:'1px solid rgba(251,191,36,0.2)',padding:'2px 6px',borderRadius:2}}>★ Highlight</span>}
                {selected.isPublicDomain&&<span style={{fontSize:10,background:'rgba(34,197,94,0.08)',color:'#22c55e',border:'1px solid rgba(34,197,94,0.2)',padding:'2px 6px',borderRadius:2}}>CC0</span>}
                {selected.isOnView&&<span style={{fontSize:10,background:'rgba(59,130,246,0.08)',color:'#3b82f6',border:'1px solid rgba(59,130,246,0.2)',padding:'2px 6px',borderRadius:2}}>On View</span>}
                <button onClick={()=>{setDeckTarget(selected);setSelected(null);}}
                  style={{padding:'4px 10px',background:'transparent',border:'1px solid #1e1e2c',borderRadius:3,color:'#44446a',fontSize:11,cursor:'pointer'}}>+deck</button>
                <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',color:'#2a2a40',fontSize:18,cursor:'pointer',padding:4}}>×</button>
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'300px 1fr',flex:1,minHeight:0,overflow:'hidden'}}>
              {/* Left: image + richness + badges */}
              <div style={{borderRight:'1px solid #111120',overflowY:'auto',overscrollBehavior:'contain'}}>
                {selected.imageUrl&&(
                  <img src={selected.imageUrl} alt={selected.title}
                    style={{width:'100%',maxHeight:300,objectFit:'contain',background:'#06060e',display:'block'}}/>
                )}
                <div style={{padding:'10px 12px'}}>
                  <div style={{marginBottom:8,padding:'8px',background:'#09090f',border:'1px solid #101020',borderRadius:4}}>
                    <RBar r={selected.richness}/>
                  </div>
                  <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:8}}>
                    {selected.wikidataVerified&&<span style={{fontSize:9,background:'rgba(34,197,94,0.08)',color:'#22c55e',border:'1px solid rgba(34,197,94,0.2)',padding:'1px 5px',borderRadius:2}}>⬡ Wikidata</span>}
                    {selected.pHashMatched&&<span style={{fontSize:9,background:'rgba(139,92,246,0.08)',color:'#8b5cf6',border:'1px solid rgba(139,92,246,0.2)',padding:'1px 5px',borderRadius:2}}>⊞ pHash</span>}
                    {selected.graphHit&&<span style={{fontSize:9,background:'rgba(251,191,36,0.08)',color:'#fbbf24',border:'1px solid rgba(251,191,36,0.18)',padding:'1px 5px',borderRadius:2}}>◈ Cached</span>}
                    <ConfBadge c={selected.confidence}/>
                  </div>

                  {/* Color palette */}
                  <ColorSwatches colors={selected.colors} harvardColors={selected.harvardColors} aicColor={selected.aicDominantColor}/>

                  {/* Sources */}
                  <SectionHead label={`SOURCES (${selected.sources.length})`}/>
                  <div style={{display:'flex',flexDirection:'column',gap:2}}>
                    {selected.sources.map((s,i)=>(
                      <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'3px 6px',background:'#09090f',border:'1px solid #101020',borderRadius:2}}>
                        <MusTag m={s.source}/>
                        <span className="mono" style={{fontSize:8,color:'#1e1e30'}}>{String(s.id).slice(0,18)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Connections */}
                  {selected.connections.length>0&&<>
                    <SectionHead label={`CONNECTIONS (${selected.connections.length})`}/>
                    <div style={{display:'flex',flexDirection:'column',gap:2}}>
                      {selected.connections.map((conn,i)=>(
                        <div key={i} style={{padding:'4px 6px',background:'#09090f',border:'1px solid #101020',borderRadius:2}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:2}}>
                            <div style={{display:'flex',gap:4,alignItems:'center'}}>
                              <MusTag m={conn.artwork.source}/>
                              <span style={{fontSize:9,color:'#7070a0'}}>{conn.artwork.title?.slice(0,22)}</span>
                            </div>
                            <span className="mono" style={{fontSize:8,color:'#3a3a58'}}>{Math.round(conn.score*100)}%</span>
                          </div>
                          <div style={{display:'flex',gap:2,flexWrap:'wrap'}}>
                            {conn.reasons.map((r,ri)=><span key={ri} style={{fontSize:7,color:'#333355',background:'#0e0e1c',padding:'0 3px',borderRadius:1}}>{r}</span>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>}
                </div>
              </div>

              {/* Right: full metadata */}
              <div style={{overflowY:'auto',overscrollBehavior:'contain',padding:'10px 14px'}}>

                {/* ── IDENTITY ── */}
                <SectionHead label="IDENTITY"/>
                {/* Show object type only if it adds info beyond classification (normalize singular/plural) */}
                {selected.objectName&&
                 selected.objectName.toLowerCase().replace(/s$/,'')!==selected.classification?.toLowerCase().replace(/s$/,'')&&
                  <MetaRow label="Object type" value={selected.objectName}/>}
                <MetaRow label="Classification" value={selected.classification}/>
                <MetaRow label="Medium"        value={selected.medium||selected.artworks.find(a=>a.medium)?.medium}/>
                <MetaRow label="Dimensions"    value={selected.dimensions||selected.artworks.find(a=>a.dimensions)?.dimensions} mono/>
                <MetaRow label="Century"       value={selected.century}/>
                <MetaRow label="Dynasty"       value={selected.dynasty}/>
                {typeof selected.objectURL==='string'&&selected.objectURL&&(
                  <MetaRow label="Object URL" value={
                    <a href={selected.objectURL} target="_blank" rel="noreferrer"
                      style={{color:'#3b82f6',textDecoration:'none',fontSize:9,fontFamily:'IBM Plex Mono'}}>
                      {selected.objectURL.slice(0,50)}…
                    </a>}/>
                )}

                {/* ── CULTURAL ORIGIN ── */}
                <SectionHead label="CULTURAL ORIGIN"/>
                <MetaRow label="Culture"       value={selected.culture}/>
                <MetaRow label="Period"        value={selected.period}/>
                <MetaRow label="Place of origin" value={selected.placeOfOrigin}/>
                <MetaRow label="Movement"      value={selected.movement}/>
                <MetaRow label="Genre"         value={selected.genre}/>
                {selected.productionPlaces?.length>0&&(
                  <>
                    <div style={{fontSize:9,color:'#2a2a40',marginBottom:3,fontFamily:'IBM Plex Mono',letterSpacing:'0.04em'}}>Production places</div>
                    <TagList items={selected.productionPlaces} color='#06b6d4' bg='rgba(6,182,212,0.08)'/>
                  </>
                )}

                {/* ── ARTIST ── */}
                <SectionHead label="ARTIST"/>
                <MetaRow label="Nationality"   value={selected.artistNationality}/>
                <MetaRow label="Dates"         value={selected.artistBeginDate&&selected.artistEndDate?`${selected.artistBeginDate} – ${selected.artistEndDate}`:selected.artistBeginDate} mono/>
                {selected.historicalPersons?.length>0&&(
                  <>
                    <div style={{fontSize:9,color:'#2a2a40',marginBottom:3,fontFamily:'IBM Plex Mono',letterSpacing:'0.04em'}}>Historical persons depicted</div>
                    <TagList items={selected.historicalPersons} color='#f97316' bg='rgba(249,115,22,0.08)'/>
                  </>
                )}
                {selected.constituents?.length>1&&(
                  <>
                    <div style={{fontSize:9,color:'#2a2a40',marginBottom:3,fontFamily:'IBM Plex Mono',letterSpacing:'0.04em'}}>Constituents</div>
                    <TagList items={selected.constituents} color='#f97316' bg='rgba(249,115,22,0.08)'/>
                  </>
                )}

                {/* ── SUBJECT & THEMATIC ── */}
                <SectionHead label="SUBJECT & THEMATIC TAGS"/>
                {selected.tags?.length>0&&<>
                  <div style={{fontSize:9,color:'#2a2a40',marginBottom:3,fontFamily:'IBM Plex Mono'}}>Met tags</div>
                  <TagList items={selected.tags} color='#f97316' bg='rgba(249,115,22,0.08)'/>
                </>}
                {selected.subjectTitles?.length>0&&<>
                  <div style={{fontSize:9,color:'#2a2a40',marginBottom:3,fontFamily:'IBM Plex Mono'}}>Subject titles</div>
                  <TagList items={selected.subjectTitles} color='#8b5cf6' bg='rgba(139,92,246,0.08)'/>
                </>}
                {selected.styleTitles?.length>0&&<>
                  <div style={{fontSize:9,color:'#2a2a40',marginBottom:3,fontFamily:'IBM Plex Mono'}}>Style</div>
                  <TagList items={selected.styleTitles} color='#3b82f6' bg='rgba(59,130,246,0.08)'/>
                </>}
                {selected.classificationTitles?.length>0&&<>
                  <div style={{fontSize:9,color:'#2a2a40',marginBottom:3,fontFamily:'IBM Plex Mono'}}>Classification</div>
                  <TagList items={selected.classificationTitles} color='#22c55e' bg='rgba(34,197,94,0.08)'/>
                </>}
                <MetaRow label="IconClass"     value={selected.iconClass}/>
                <MetaRow label="Inscriptions"  value={selected.inscriptions}/>

                {/* ── TECHNICAL ── */}
                {((selected.materials?.length||0)+(selected.techniques?.length||0))>0&&<>
                  <SectionHead label="MATERIALS & TECHNIQUE"/>
                  {selected.materials?.length>0&&<>
                    <div style={{fontSize:9,color:'#2a2a40',marginBottom:3,fontFamily:'IBM Plex Mono'}}>Materials</div>
                    <TagList items={selected.materials} color='#fbbf24' bg='rgba(251,191,36,0.08)'/>
                  </>}
                  {selected.techniques?.length>0&&<>
                    <div style={{fontSize:9,color:'#2a2a40',marginBottom:3,fontFamily:'IBM Plex Mono'}}>Techniques</div>
                    <TagList items={selected.techniques} color='#fbbf24' bg='rgba(251,191,36,0.08)'/>
                  </>}
                </>}

                {/* ── DISPLAY & LOCATION ── */}
                <SectionHead label="DISPLAY & LOCATION"/>
                <MetaRow label="On view"       value={selected.isOnView?'Yes':'No'} mono/>
                <MetaRow label="Gallery"       value={selected.galleryTitle}/>
                <MetaRow label="Gallery #"     value={selected.galleryNumber} mono/>

                {/* ── DEMAND & POPULARITY ── */}
                <SectionHead label="DEMAND & POPULARITY"/>
                <MetaRow label="Page views"    value={selected.totalPageViews?.toLocaleString()} mono/>
                <MetaRow label="Harvard rank"  value={selected.rank} mono/>
                <MetaRow label="Exhibitions"   value={selected.exhibitionCount||null} mono/>
                <MetaRow label="Publications"  value={selected.publicationCount||null} mono/>
                <MetaRow label="Colorfulness"  value={selected.colorfulness!=null?selected.colorfulness.toFixed(1):null} mono/>

                {/* ── PROVENANCE & ACQUISITION ── */}
                <SectionHead label="PROVENANCE & ACQUISITION"/>
                <MetaRow label="Credit line"   value={selected.creditLine}/>
                <MetaRow label="Accession year" value={selected.accessionYear} mono/>
                <MetaRow label="Fiscal year"   value={selected.fiscalYearAcquisition} mono/>
                {selected.provenanceText&&(
                  <div style={{marginBottom:6}}>
                    <div style={{fontSize:9,color:'#2a2a40',marginBottom:3,fontFamily:'IBM Plex Mono',letterSpacing:'0.04em'}}>Provenance</div>
                    <div style={{fontSize:10,color:'#5a5a78',lineHeight:1.5,background:'#08080e',border:'1px solid #0f0f1e',borderRadius:3,padding:'6px 8px',maxHeight:80,overflowY:'auto'}}>{typeof selected.provenanceText==='string'?selected.provenanceText:JSON.stringify(selected.provenanceText)}</div>
                  </div>
                )}

                {/* ── EXHIBITION HISTORY ── */}
                {selected.exhibitionHistory&&(
                  <>
                    <SectionHead label="EXHIBITION HISTORY"/>
                    <div style={{fontSize:10,color:'#5a5a78',lineHeight:1.5,background:'#08080e',border:'1px solid #0f0f1e',borderRadius:3,padding:'6px 8px',maxHeight:100,overflowY:'auto'}}>{typeof selected.exhibitionHistory==='string'?selected.exhibitionHistory:JSON.stringify(selected.exhibitionHistory)}</div>
                  </>
                )}

                {/* ── PUBLICATION HISTORY ── */}
                {selected.publicationHistory&&(
                  <>
                    <SectionHead label="PUBLICATION HISTORY"/>
                    <div style={{fontSize:10,color:'#5a5a78',lineHeight:1.5,background:'#08080e',border:'1px solid #0f0f1e',borderRadius:3,padding:'6px 8px',maxHeight:80,overflowY:'auto'}}>{typeof selected.publicationHistory==='string'?selected.publicationHistory:JSON.stringify(selected.publicationHistory)}</div>
                  </>
                )}

                {/* ── EXTRA ── */}
                {(selected.funFact||selected.wallDescription)&&<>
                  <SectionHead label="ADDITIONAL CONTEXT"/>
                  {selected.funFact&&<>
                    <div style={{fontSize:9,color:'#2a2a40',marginBottom:3,fontFamily:'IBM Plex Mono'}}>Fun fact</div>
                    <div style={{fontSize:10,color:'#5a5a78',lineHeight:1.5,marginBottom:6}}>{selected.funFact}</div>
                  </>}
                  {selected.wallDescription&&<>
                    <div style={{fontSize:9,color:'#2a2a40',marginBottom:3,fontFamily:'IBM Plex Mono'}}>Wall description</div>
                    <div style={{fontSize:10,color:'#5a5a78',lineHeight:1.5,marginBottom:6,background:'#08080e',border:'1px solid #0f0f1e',borderRadius:3,padding:'6px 8px'}}>{selected.wallDescription}</div>
                  </>}
                </>}

                {/* ── GAME SIGNALS ── */}
                <SectionHead label="GAME SIGNALS"/>
                {(()=>{
                  const ps = computePhaseScores(selected);
                  const cityScores = computeAllCityScores(selected).slice(0, 8);
                  const tierColor = { S:'#fbbf24', A:'#22c55e', B:'#3b82f6', C:'#8b5cf6', D:'#444466' };
                  const fragilityColor = { Immovable:'#ef4444', Fragile:'#f97316', Delicate:'#f59e0b', Standard:'#22c55e' };
                  const costColor = { 'N/A':'#444466', High:'#f97316', Medium:'#fbbf24', Low:'#22c55e', Unavailable:'#444466' };

                  return (
                    <div>
                      {/* Phase score bars */}
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,marginBottom:8}}>
                        {/* BID */}
                        <div style={{background:'#09090f',border:'1px solid #101020',borderRadius:3,padding:'7px 9px'}}>
                          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                            <span style={{fontSize:9,color:'#f59e0b',fontFamily:'IBM Plex Mono',letterSpacing:'0.05em'}}>💰 BID VALUE</span>
                            <span style={{fontSize:11,color:'#f59e0b',fontFamily:'IBM Plex Mono',fontWeight:600}}>{ps.bid.score}</span>
                          </div>
                          <div style={{background:'#141424',borderRadius:2,height:5,overflow:'hidden',marginBottom:4}}>
                            <div style={{width:`${ps.bid.score}%`,height:'100%',background:'#f59e0b',borderRadius:2,transition:'width 0.5s ease'}}/>
                          </div>
                          <div style={{display:'flex',flexDirection:'column',gap:1}}>
                            {Object.entries(ps.bid.breakdown).slice(0,4).map(([k,v])=>(
                              <div key={k} style={{display:'flex',justifyContent:'space-between'}}>
                                <span style={{fontSize:8,color:'#2a2a40'}}>{k}</span>
                                <span style={{fontSize:8,color:'#f59e0b',fontFamily:'IBM Plex Mono'}}>{v}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* EXHIBITION */}
                        <div style={{background:'#09090f',border:'1px solid #101020',borderRadius:3,padding:'7px 9px'}}>
                          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                            <span style={{fontSize:9,color:'#8b5cf6',fontFamily:'IBM Plex Mono',letterSpacing:'0.05em'}}>🏛️ EXHIBITION</span>
                            <span style={{fontSize:11,color:'#8b5cf6',fontFamily:'IBM Plex Mono',fontWeight:600}}>{ps.exhibition.score}</span>
                          </div>
                          <div style={{background:'#141424',borderRadius:2,height:5,overflow:'hidden',marginBottom:4}}>
                            <div style={{width:`${ps.exhibition.score}%`,height:'100%',background:'#8b5cf6',borderRadius:2,transition:'width 0.5s ease'}}/>
                          </div>
                          <div style={{fontSize:8,color:'#2a2a40',lineHeight:1.4}}>{ps.exhibition.note}</div>
                          <div style={{display:'flex',flexDirection:'column',gap:1,marginTop:2}}>
                            {Object.entries(ps.exhibition.breakdown).slice(0,3).map(([k,v])=>(
                              <div key={k} style={{display:'flex',justifyContent:'space-between'}}>
                                <span style={{fontSize:8,color:'#2a2a40'}}>{k}</span>
                                <span style={{fontSize:8,color:'#8b5cf6',fontFamily:'IBM Plex Mono'}}>{v}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* TRAVEL */}
                        <div style={{background:'#09090f',border:'1px solid #101020',borderRadius:3,padding:'7px 9px'}}>
                          <div style={{marginBottom:3}}>
                            <span style={{fontSize:9,color:'#06b6d4',fontFamily:'IBM Plex Mono',letterSpacing:'0.05em'}}>✈️ TRAVEL</span>
                          </div>
                          <div style={{display:'flex',flexDirection:'column',gap:3}}>
                            <div style={{display:'flex',justifyContent:'space-between'}}>
                              <span style={{fontSize:8,color:'#2a2a40'}}>Fragility</span>
                              <span style={{fontSize:9,color:fragilityColor[ps.travel.fragility]||'#444466',fontFamily:'IBM Plex Mono'}}>{ps.travel.fragility}</span>
                            </div>
                            <div style={{display:'flex',justifyContent:'space-between'}}>
                              <span style={{fontSize:8,color:'#2a2a40'}}>Cost tier</span>
                              <span style={{fontSize:9,color:costColor[ps.travel.cost]||'#444466',fontFamily:'IBM Plex Mono'}}>{ps.travel.cost}</span>
                            </div>
                            <div style={{display:'flex',justifyContent:'space-between'}}>
                              <span style={{fontSize:8,color:'#2a2a40'}}>Size</span>
                              <span style={{fontSize:9,color:'#6060a0',fontFamily:'IBM Plex Mono'}}>{ps.travel.size}</span>
                            </div>
                            {ps.travel.note&&<div style={{fontSize:8,color:'#1e1e30',marginTop:1}}>{ps.travel.note}</div>}
                          </div>
                        </div>

                        {/* CURATE */}
                        <div style={{background:'#09090f',border:'1px solid #101020',borderRadius:3,padding:'7px 9px'}}>
                          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                            <span style={{fontSize:9,color:'#10b981',fontFamily:'IBM Plex Mono',letterSpacing:'0.05em'}}>🎨 CURATE</span>
                            <span style={{fontSize:11,color:'#10b981',fontFamily:'IBM Plex Mono',fontWeight:600}}>{ps.curate.score}/{ps.curate.max}</span>
                          </div>
                          <div style={{background:'#141424',borderRadius:2,height:5,overflow:'hidden',marginBottom:5}}>
                            <div style={{width:`${(ps.curate.score/ps.curate.max)*100}%`,height:'100%',background:'#10b981',borderRadius:2,transition:'width 0.5s ease'}}/>
                          </div>
                          <div style={{display:'flex',flexWrap:'wrap',gap:3}}>
                            {Object.entries(ps.curate.signals).map(([k,v])=>(
                              <span key={k} style={{fontSize:8,padding:'1px 4px',borderRadius:2,fontFamily:'IBM Plex Mono',
                                background:v?'rgba(16,185,129,0.1)':'rgba(68,68,102,0.1)',
                                color:v?'#10b981':'#222238',border:`1px solid ${v?'rgba(16,185,129,0.2)':'rgba(68,68,102,0.15)'}`}}>
                                {k}
                              </span>
                            ))}
                          </div>
                          {ps.curate.isAnchor&&<div style={{marginTop:4,fontSize:8,color:'#fbbf24'}}>★ Anchor piece</div>}
                        </div>
                      </div>

                      {/* City affinity chart */}
                      <div style={{background:'#09090f',border:'1px solid #101020',borderRadius:3,padding:'8px 10px',marginBottom:8}}>
                        <div className="mono" style={{fontSize:8,color:'#2a2a40',marginBottom:7,letterSpacing:'0.06em'}}>
                          CITY AFFINITY — exhibition value multiplier
                        </div>
                        <div style={{display:'flex',flexDirection:'column',gap:4}}>
                          {cityScores.map(cs=>{
                            const tc = tierColor[cs.tier]||'#444466';
                            const pct = Math.round((cs.mult / 4.5) * 100);
                            return (
                              <div key={cs.key} style={{display:'flex',alignItems:'center',gap:7}}>
                                <span style={{fontSize:13,flexShrink:0}}>{cs.flag}</span>
                                <span style={{fontSize:10,color:'#5a5a78',minWidth:76,flexShrink:0}}>{cs.name}</span>
                                <div style={{flex:1,height:5,background:'#141424',borderRadius:2,overflow:'hidden'}}>
                                  <div style={{width:`${pct}%`,height:'100%',background:tc,borderRadius:2,transition:'width 0.5s ease'}}/>
                                </div>
                                <span className="tier-badge" style={{background:`${tc}18`,color:tc,border:`1px solid ${tc}44`,flexShrink:0}}>{cs.tier}</span>
                                <span className="mono" style={{fontSize:10,color:tc,minWidth:32,textAlign:'right',flexShrink:0}}>{cs.mult.toFixed(1)}×</span>
                              </div>
                            );
                          })}
                        </div>
                        {cityScores[0]?.factors?.length > 0 && (
                          <div style={{marginTop:7,paddingTop:6,borderTop:'1px solid #0f0f1e'}}>
                            <div className="mono" style={{fontSize:8,color:'#1e1e30',marginBottom:4}}>BEST MATCH FACTORS ({cityScores[0].name})</div>
                            <div style={{display:'flex',flexWrap:'wrap',gap:3}}>
                              {cityScores[0].factors.map((f,i)=>(
                                <span key={i} style={{fontSize:8,padding:'1px 5px',borderRadius:2,background:'rgba(251,191,36,0.08)',color:'#fbbf24',border:'1px solid rgba(251,191,36,0.18)',fontFamily:'IBM Plex Mono'}}>
                                  {f.field}:{f.matched} {f.mult.toFixed(1)}×
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* ── RAW SOURCE METADATA ── */}
                {selected.artworks.some(a=>a.medium||a.dimensions)&&<>
                  <SectionHead label="PER-SOURCE METADATA"/>
                  {selected.artworks.filter(a=>a.medium||a.dimensions).map((a,i)=>(
                    <div key={i} style={{display:'flex',gap:6,fontSize:10,color:'#3a3a58',marginBottom:3,alignItems:'flex-start',background:'#08080e',border:'1px solid #0d0d1a',borderRadius:2,padding:'4px 6px'}}>
                      <MusTag m={a.source}/>
                      <div style={{flex:1}}>
                        {a.medium&&<div style={{fontSize:9,color:'#5a5a78',marginBottom:1}}>{a.medium.slice(0,60)}</div>}
                        {a.dimensions&&<div className="mono" style={{fontSize:8,color:'#3a3a50'}}>{a.dimensions.slice(0,36)}</div>}
                      </div>
                    </div>
                  ))}
                </>}

                <div style={{height:16}}/>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD TO DECK MODAL ─────────────────────────────────────── */}
      {deckTarget && (
        <AddToDeckModal artwork={deckTarget} manager={collRef.current} onClose={()=>setDeckTarget(null)}/>
      )}

      {/* ── COLLECTION DECK PANEL ─────────────────────────────────── */}
      <DeckPanel manager={collRef.current} open={deckOpen} onClose={()=>setDeckOpen(false)}/>
    </>
  );
}