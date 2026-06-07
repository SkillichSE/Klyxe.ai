import Script from 'next/script';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search — Klyxe',
  description: 'Search and compare AI models by name, provider, speed or quality.',
  openGraph: {
    title: 'Search AI Models — Klyxe',
    description: 'Find and compare AI models by name, provider, quality, or speed.',
  },
};

export default function SearchPage() {
  return (
    <>
      <Script src="/style-spacing.css" strategy="afterInteractive" />
      <Script src="/style.css" strategy="afterInteractive" />
      <Script src="/animations.css" strategy="afterInteractive" />

      <div className="page-hero">
        <div className="page-hero-inner">
          <h1 className="page-hero-title">Search models</h1>
          <p className="page-hero-sub">Find and compare AI models by name, provider, quality, or speed.</p>
        </div>
      </div>

      <main className="container">
        <div className="search-container">
          <div className="search-box">
            <span className="search-icon">&there4;</span>
            <input type="text" className="search-input" id="search-input" placeholder="Llama, Gemini, Mistral..." />
          </div>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>Tier</div>
              <div className="filters" id="tier-filters">
                <button className="filter-btn active" data-tier="all">All</button>
                <button className="filter-btn" data-tier="large">Large 50B+</button>
                <button className="filter-btn" data-tier="medium">Medium</button>
                <button className="filter-btn" data-tier="small">Small</button>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>Provider</div>
              <div className="filters" id="provider-filters">
                <button className="filter-btn active" data-provider="all">All</button>
                <button className="filter-btn" data-provider="Groq">Groq</button>
                <button className="filter-btn" data-provider="Google">Google</button>
                <button className="filter-btn" data-provider="OpenRouter">OpenRouter</button>
                <button className="filter-btn" data-provider="Cerebras">Cerebras</button>
                <button className="filter-btn" data-provider="SambaNova">SambaNova</button>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>Sort by</div>
              <div className="filters" id="sort-filters">
                <button className="filter-btn active" data-sort="quality">Quality</button>
                <button className="filter-btn" data-sort="speed">Speed</button>
                <button className="filter-btn" data-sort="code">Code</button>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>Min score: <span id="min-score-val">0</span></div>
              <input type="range" id="min-score" min="0" max="100" value="0" style={{ width: '140px', accentColor: 'var(--color-primary)', cursor: 'pointer' }} />
            </div>
          </div>
        </div>

        <div id="results-count" style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}></div>
        <div className="grid-cards" id="search-results"></div>
        <div id="no-results" style={{ display: 'none', textAlign: 'center', padding: '64px', color: 'var(--text-secondary)' }}>
          No models match &apos;<span id="no-results-query"></span>&apos;. Try a provider name or model family (Llama, Gemini, Qwen...).
        </div>
      </main>

      <footer className="footer">
        <div className="footer-links">
          <a href="https://skillichse.github.io/Klyxe/" className="footer-link">GitHub</a>
          <a href="/about" className="footer-link">About</a>
          <a href="/news" className="footer-link">News</a>
        </div>
        <p>AI models, tested daily</p>
      </footer>

      <Script id="search-logic" strategy="afterInteractive">{`
        let allModels=[], currentProvider='all', currentTier='all', currentSort='quality', searchQuery='', minScore=0;
        function sizeBadge(cat){
          const cls={small:'size-small',medium:'size-medium',large:'size-large',unknown:'size-unknown'};
          const lbl={small:'Small',medium:'Medium',large:'Large',unknown:'?'};
          return '<span class="'+cls[cat]+' size-unknown" style="font-size:10px;font-weight:600;padding:2px 8px;border-radius:99px;margin-left:6px;background:var(--accent-dim);color:var(--accent);">'+(lbl[cat]||cat)+'</span>';
        }
        function scoreLine(label,val,cls){
          return '<div class="score-line"><span class="score-line-label">'+label+'</span><span class="score-line-bar"><span class="score-line-fill '+cls+'" style="width:'+val+'%"></span></span><span class="score-line-val">'+Math.round(val)+'</span></div>';
        }
        async function loadData(){
          try{
            const today=new Date().toISOString().split('T')[0];
            let data;
            const todayR=await fetch('data/results/'+today+'.json');
            if(todayR.ok){const arr=await todayR.json();data={results:arr};}
            else{const r=await fetch('data/results/latest.json');data=await r.json();}
            allModels=(data.results||[]).map(m=>({...m,quality_score:m.quality_score??m.overall_score??0,raw_speed:m.raw_speed??m.tests?.speed?.avg_tokens_per_sec??0,size_category:m.size_category??'unknown'})).filter(m=>m.quality_score>0||m.raw_speed>0);
            filterAndDisplay();
          }catch(e){console.error(e);}
        }
        function filterAndDisplay(){
          let list=[...allModels];
          if(currentProvider!=='all') list=list.filter(m=>m.provider===currentProvider);
          if(currentTier!=='all') list=list.filter(m=>m.size_category===currentTier);
          if(minScore>0) list=list.filter(m=>(m.quality_score||0)>=minScore);
          if(searchQuery) list=list.filter(m=>m.model_name.toLowerCase().includes(searchQuery)||m.provider.toLowerCase().includes(searchQuery)||(m.model_id||'').toLowerCase().includes(searchQuery));
          list.sort((a,b)=>{if(currentSort==='speed')return (b.raw_speed||0)-(a.raw_speed||0);if(currentSort==='code')return (b.tests?.code?.avg_score||0)-(a.tests?.code?.avg_score||0);return (b.quality_score||0)-(a.quality_score||0);});
          const rc=document.getElementById('results-count');
          const nr=document.getElementById('no-results');
          const sr=document.getElementById('search-results');
          if(!list.length){sr.innerHTML='';sr.style.display='none';nr.style.display='block';rc.textContent='';const nrq=document.getElementById('no-results-query');if(nrq)nrq.textContent=searchQuery||'these filters';return;}
          nr.style.display='none';sr.style.display='grid';rc.textContent=list.length+' model'+(list.length!==1?'s':'')+' found';
          sr.innerHTML=list.map((m,i)=>{const q=m.quality_score||0;const c=m.tests?.code?.avg_score||0;const rs=m.tests?.reasoning?.score||0;const spd=m.raw_speed||0;return '<div class="model-card"><div class="model-header"><div><div class="model-name">'+m.model_name+sizeBadge(m.size_category)+'</div><div class="model-provider">'+m.provider+' &middot; '+m.size+'</div></div><div class="rank-badge">#'+(i+1)+'</div></div><div class="score-block" style="display:flex;flex-direction:column;gap:4px;">'+scoreLine('Quality',q,'fill-mmlu')+scoreLine('Code',c,'fill-code')+scoreLine('Reasoning',rs,'fill-reason')+'</div><div style="margin-top:10px;display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid var(--border-subtle);"><span style="font-size:12px;color:var(--text-secondary);font-family:var(--font-mono);">'+(spd>0?Math.round(spd)+' tok/s':'')+'</span><div style="display:flex;align-items:center;gap:10px;"><span style="font-size:18px;font-weight:700;color:var(--color-primary);">'+Math.round(q)+'<span style="font-size:11px;font-weight:400;color:var(--text-secondary);">/100</span></span><a href="model.html?id='+encodeURIComponent(m.model_id||m.model_name)+'" style="font-size:12px;font-weight:500;color:var(--color-primary);text-decoration:none;">Details &rarr;</a></div></div></div>';}).join('');
        }
        document.addEventListener('DOMContentLoaded',()=>{
          loadData();
          document.getElementById('search-input').addEventListener('input',e=>{searchQuery=e.target.value.toLowerCase();filterAndDisplay();});
          document.getElementById('provider-filters').addEventListener('click',e=>{if(!e.target.classList.contains('filter-btn'))return;document.querySelectorAll('#provider-filters .filter-btn').forEach(b=>b.classList.remove('active'));e.target.classList.add('active');currentProvider=e.target.dataset.provider;filterAndDisplay();});
          document.getElementById('tier-filters').addEventListener('click',e=>{if(!e.target.classList.contains('filter-btn'))return;document.querySelectorAll('#tier-filters .filter-btn').forEach(b=>b.classList.remove('active'));e.target.classList.add('active');currentTier=e.target.dataset.tier;filterAndDisplay();});
          const minScoreInput=document.getElementById('min-score');
          const minScoreVal=document.getElementById('min-score-val');
          if(minScoreInput){minScoreInput.addEventListener('input',()=>{minScore=parseInt(minScoreInput.value)||0;if(minScoreVal)minScoreVal.textContent=minScore;filterAndDisplay();});}
          document.getElementById('sort-filters').addEventListener('click',e=>{if(!e.target.classList.contains('filter-btn'))return;document.querySelectorAll('#sort-filters .filter-btn').forEach(b=>b.classList.remove('active'));e.target.classList.add('active');currentSort=e.target.dataset.sort;filterAndDisplay();});
        });
      `}</Script>
    </>
  );
}
