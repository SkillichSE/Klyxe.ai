import Script from 'next/script';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Providers — Klyxe',
  description: 'Which AI providers actually respond? See response rates, average quality, and top models per provider.',
  openGraph: {
    title: 'AI Model Providers — Klyxe',
    description: 'Provider reliability rankings — response rates, average quality scores, and top models per provider.',
  },
};

export default function ProvidersPage() {
  return (
    <>
      <Script src="/style-spacing.css" strategy="afterInteractive" />
      <Script src="/style.css" strategy="afterInteractive" />
      <Script src="/animations.css" strategy="afterInteractive" />

      <div className="page-hero">
        <div className="page-hero-inner">
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: '0 0 6px 0' }}>Providers</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '560px', lineHeight: 1.6, margin: 0 }}>
            Not all models answer all tests. This page shows which providers are most reliable — ranked by response rate across all benchmark categories, and which of their models perform best.
          </p>
        </div>
      </div>

      <main className="container">
        <div className="prov-summary-grid" id="summary-grid"></div>

        <div className="response-legend">
          <div className="response-legend-item"><div className="response-legend-dot dot-full"></div> All 5 tests completed</div>
          <div className="response-legend-item"><div className="response-legend-dot dot-partial"></div> 2–4 tests completed</div>
          <div className="response-legend-item"><div className="response-legend-dot dot-none"></div> 0–1 tests completed</div>
        </div>

        <div className="provider-grid" id="provider-grid">
          <div className="page-error"><h2>Loading&hellip;</h2></div>
        </div>
      </main>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 48px 64px' }}>
        <h2 style={{ fontFamily: "'Google Sans',sans-serif", fontSize: '20px', fontWeight: 700, color: 'var(--color-on-surface)', margin: '48px 0 6px' }}>Free Tier Limits</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Rate limits for free API keys. Updated manually — check provider docs for latest values.</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-outline-var)' }}>
                <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.5px' }}>Provider</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.5px' }}>RPM</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.5px' }}>TPM</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.5px' }}>Daily limit</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.5px' }}>Docs</th>
              </tr>
            </thead>
            <tbody id="free-tier-tbody">
              <tr style={{ borderBottom: '1px solid var(--color-outline-var)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Groq</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>30</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>6,000</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>&mdash;</td>
                <td style={{ padding: '12px 16px' }}><a href="https://console.groq.com/docs/rate-limits" target="_blank" rel="noopener" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '12px' }}>console.groq.com &rarr;</a></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--color-outline-var)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Google (AI Studio)</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>15</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>1,000,000</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>1,500 req</td>
                <td style={{ padding: '12px 16px' }}><a href="https://ai.google.dev/gemini-api/docs/rate-limits" target="_blank" rel="noopener" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '12px' }}>ai.google.dev &rarr;</a></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--color-outline-var)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-on-surface)' }}>OpenRouter (free tier)</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>20</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>&mdash;</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>50 req</td>
                <td style={{ padding: '12px 16px' }}><a href="https://openrouter.ai/docs/limits" target="_blank" rel="noopener" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '12px' }}>openrouter.ai &rarr;</a></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--color-outline-var)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Cerebras</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>30</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>60,000</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>&mdash;</td>
                <td style={{ padding: '12px 16px' }}><a href="https://inference-docs.cerebras.ai/rate-limits" target="_blank" rel="noopener" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '12px' }}>cerebras.ai &rarr;</a></td>
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-on-surface)' }}>SambaNova</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>10</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>40,000</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>&mdash;</td>
                <td style={{ padding: '12px 16px' }}><a href="https://community.sambanova.ai/t/rate-limits" target="_blank" rel="noopener" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: '12px' }}>sambanova.ai &rarr;</a></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '12px' }}>RPM = requests per minute &middot; TPM = tokens per minute &middot; Limits apply to individual model endpoints unless noted.</p>
      </div>

      <div style={{ borderTop: '1px solid var(--color-outline-var)', marginTop: '48px' }}>
        <footer className="footer">
          <div className="footer-links">
            <a href="https://skillichse.github.io/Klyxe/" className="footer-link">GitHub</a>
            <a href="/about" className="footer-link">About</a>
            <a href="/news" className="footer-link">News</a>
          </div>
          <div className="footer-copy">Open source &middot; Updated daily via GitHub Actions &middot; All models are free to use</div>
        </footer>
      </div>

      <Script id="providers-logic" strategy="afterInteractive">{`
        function reliabilityBadge(rate){if(rate>=95)return {label:'Excellent',cls:'badge-excellent'};if(rate>=75)return {label:'Good',cls:'badge-good'};if(rate>=40)return {label:'Partial',cls:'badge-partial'};return {label:'Unreliable',cls:'badge-low'};}
        function dotClass(tests){if(tests>=5)return 'dot-full';if(tests>=2)return 'dot-partial';return 'dot-none';}
        function esc(str){return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
        function providerColor(name){const colors={'Groq':'#f97316','Google':'#3b82f6','OpenRouter':'#8b5cf6','Cerebras':'#10b981','SambaNova':'#ec4899'};return colors[name]||'#6366f1';}
        function countTests(m){const t=m.tests||{};let n=0;if(t.code?.avg_score)n++;if(t.reasoning?.score)n++;if(t.instruction?.avg_score)n++;if(t.translation?.avg_score)n++;const spd=m.raw_speed||t.speed?.avg_tokens_per_sec||0;if(spd>0)n++;return n;}
        async function loadData(){
          try{
            const today=new Date().toISOString().split('T')[0];let data;
            const r1=await fetch('data/results/'+today+'.json');
            if(r1.ok){data={results:await r1.json()};}else{const r2=await fetch('data/results/latest.json');if(!r2.ok)throw new Error('HTTP '+r2.status);data=await r2.json();}
            const all=(data.results||[]).map(m=>({...m,quality_score:m.quality_score??m.overall_score??0,raw_speed:m.raw_speed??m.tests?.speed?.avg_tokens_per_sec??0,tests_completed:countTests(m)}));
            if(!all.length){document.getElementById('provider-grid').innerHTML='<div class="page-error"><h2>No data yet</h2></div>';return;}
            const provMap={};
            all.forEach(m=>{const p=m.provider||'Unknown';if(!provMap[p])provMap[p]=[];provMap[p].push(m);});
            const providers=Object.entries(provMap).map(([name,models])=>{const totalTests=models.length*5;const doneTests=models.reduce((s,m)=>s+m.tests_completed,0);const responseRate=totalTests>0?doneTests/totalTests*100:0;const respondedModels=models.filter(m=>m.quality_score>0);const avgQuality=respondedModels.length>0?respondedModels.reduce((s,m)=>s+m.quality_score,0)/respondedModels.length:0;const topModel=[...models].sort((a,b)=>b.quality_score-a.quality_score)[0];return {name,models,responseRate,avgQuality,respondedModels:respondedModels.length,topModel};}).sort((a,b)=>b.responseRate-a.responseRate||b.avgQuality-a.avgQuality);
            const totalModels=all.length;const fullyResponded=all.filter(m=>m.tests_completed===5).length;const partiallyResponded=all.filter(m=>m.tests_completed>=2&&m.tests_completed<5).length;const noResponse=all.filter(m=>m.tests_completed<2).length;
            const summaryGrid=document.getElementById('summary-grid');
            summaryGrid.innerHTML=[{val:totalModels,label:'Models Tested'},{val:fullyResponded,label:'Fully Responded'},{val:partiallyResponded,label:'Partial Response'},{val:noResponse,label:'Low Response'},{val:providers.length,label:'Providers'}].map(s=>'<div class="summary-stat-card reveal"><div class="summary-stat-val">'+s.val+'</div><div class="summary-stat-label">'+s.label+'</div></div>').join('');
            const grid=document.getElementById('provider-grid');
            grid.innerHTML=providers.map(prov=>{const rb=reliabilityBadge(prov.responseRate);const color=providerColor(prov.name);const sortedModels=[...prov.models].sort((a,b)=>b.quality_score-a.quality_score);const modelRows=sortedModels.map((m,i)=>{const dot=dotClass(m.tests_completed);const q=m.quality_score;const scoreColor=q>=80?'#10b981':q>=50?'#f59e0b':'#ef4444';return '<div class="prov-model-row"><div class="prov-model-responded '+dot+'"></div><span class="prov-model-rank">#'+(i+1)+'</span><span class="prov-model-name" title="'+esc(m.model_name)+'">'+esc(m.model_name)+'</span><span class="prov-model-tests">'+m.tests_completed+'/5</span><span class="prov-model-score" style="color:'+scoreColor+'">'+Math.round(q)+'</span></div>';}).join('');
              return '<div class="provider-card reveal"><div class="prov-card-header"><div class="prov-card-name" style="color:'+color+'">'+esc(prov.name)+'</div><span class="prov-reliability-badge '+rb.cls+'">'+rb.label+'</span></div><div class="prov-stat-row"><div class="prov-stat-item"><div class="prov-stat-val">'+Math.round(prov.responseRate)+'%</div><div class="prov-stat-label">Response rate</div></div><div class="prov-stat-item"><div class="prov-stat-val">'+Math.round(prov.avgQuality)+'</div><div class="prov-stat-label">Avg quality</div></div><div class="prov-stat-item"><div class="prov-stat-val">'+prov.models.length+'</div><div class="prov-stat-label">Models</div></div></div><div class="prov-bar-wrap"><div class="prov-bar-fill" style="background:linear-gradient(90deg,'+color+','+color+'99);width:0%" data-w="'+prov.responseRate+'"></div></div><div class="prov-section-label">Models — ranked by quality score</div><div class="prov-model-list">'+modelRows+'</div></div>';
            }).join('');
            setTimeout(()=>{document.querySelectorAll('.prov-bar-fill[data-w]').forEach(bar=>{bar.style.width=bar.dataset.w+'%';});},150);
            const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});},{threshold:0.08});
            document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
          }catch(err){document.getElementById('provider-grid').innerHTML='<div class="page-error"><h2>Could not load data</h2><p>'+esc(String(err))+'</p></div>';}
        }
        document.addEventListener('DOMContentLoaded',loadData);
      `}</Script>
    </>
  );
}
