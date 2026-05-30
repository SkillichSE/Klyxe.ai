import Script from 'next/script';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News — Klyxe',
  description: 'Latest releases, research, and announcements from AI providers.',
  openGraph: {
    title: 'AI News — Klyxe',
    description: 'Latest releases, research, and announcements from AI providers.',
  },
};

export default function NewsPage() {
  return (
    <>
      <Script src="/style-spacing.css" strategy="afterInteractive" />
      <Script src="/style.css" strategy="afterInteractive" />
      <Script src="/animations.css" strategy="afterInteractive" />

      <div className="page-hero">
        <div className="page-hero-inner">
          <h1 className="page-hero-title">AI News</h1>
          <p className="page-hero-sub">Latest releases, research, and announcements from AI providers.</p>
        </div>
      </div>

      <main className="container">
        <div style={{ background: 'var(--color-surf-cont-low)', border: '1px solid var(--color-outline-var)', borderLeft: '3px solid var(--color-primary)', borderRadius: '12px', padding: '16px 20px', marginBottom: '28px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--color-primary)', marginBottom: '6px' }}>Editor&apos;s note &middot; week of Apr 21</div>
          <p style={{ fontSize: '13px', color: 'var(--color-on-surface)', lineHeight: 1.6, margin: 0 }}>
            Gemini 2.5 Flash continues to dominate the translation category while smaller open models from Meta and Qwen close the gap on reasoning tasks. The most interesting development this week: Cerebras inference speeds have surpassed 1000 tok/s on some models — redefining what &quot;fast&quot; means for real-time apps.
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <span id="last-update" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}></span>
        </div>

        <div className="filters" id="source-filters" style={{ marginBottom: '24px' }}>
          <button className="filter-btn active" data-source="all">All</button>
          <button className="filter-btn" data-source="Google AI Blog">Google</button>
          <button className="filter-btn" data-source="Anthropic">Anthropic</button>
          <button className="filter-btn" data-source="Meta AI">Meta</button>
          <button className="filter-btn" data-source="NVIDIA Developer">NVIDIA</button>
          <button className="filter-btn" data-source="OpenAI">OpenAI</button>
          <button className="filter-btn" data-source="Hugging Face">Hugging Face</button>
          <button className="filter-btn" data-source="Mistral AI">Mistral</button>
        </div>

        <div id="news-feed"></div>
        <div id="no-news" style={{ display: 'none', textAlign: 'center', padding: '64px', color: 'var(--text-secondary)' }}>
          No news yet — check back after the next daily run.
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

      <Script id="news-logic" strategy="afterInteractive">{`
        let allNews=[], currentSource='all';
        async function loadNews(){
          try{
            const r=await fetch('data/results/news.json');
            const data=await r.json();
            const el=document.getElementById('last-update');
            if(el) el.textContent='Updated '+new Date(data.updated).toLocaleString();
            allNews=data.items||[];
            if(allNews.length===0){
              document.getElementById('news-feed').innerHTML='';
              document.getElementById('no-news').style.display='block';
              return;
            }
            displayNews();
          }catch(e){
            console.error('Error loading news:',e);
            document.getElementById('news-feed').innerHTML='';
            document.getElementById('no-news').style.display='block';
          }
        }
        function displayNews(){
          const feed=document.getElementById('news-feed');
          const none=document.getElementById('no-news');
          const filtered=currentSource==='all'?allNews:allNews.filter(i=>i.source===currentSource);
          if(!filtered.length){
            feed.innerHTML=''; none.style.display='block'; return;
          }
          none.style.display='none';
          feed.innerHTML=filtered.map(item=>'<div class="news-item"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;"><span class="news-date">'+new Date(item.date).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'})+'</span><span style="font-size:11px;font-weight:500;color:var(--text-secondary);">'+item.source+'</span></div><h3 class="news-title"><a href="'+item.link+'" target="_blank" rel="noopener">'+item.title+'</a></h3>'+(item.summary?'<p class="news-summary">'+item.summary+'</p>':'')+'</div>').join('');
        }
        document.addEventListener('DOMContentLoaded',()=>{
          loadNews();
          document.getElementById('source-filters').addEventListener('click',e=>{
            if(!e.target.classList.contains('filter-btn'))return;
            document.querySelectorAll('#source-filters .filter-btn').forEach(b=>b.classList.remove('active'));
            e.target.classList.add('active');
            currentSource=e.target.dataset.source;
            displayNews();
          });
        });
      `}</Script>

      <Script id="news-reveal" strategy="afterInteractive">{`
        (function(){
          var io=new IntersectionObserver(function(entries){
            entries.forEach(function(e){
              if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}
            });
          },{threshold:0.1,rootMargin:'0px 0px -30px 0px'});
          function observe(){document.querySelectorAll('.reveal:not([data-obs]), .news-item:not([data-obs])').forEach(function(el){el.setAttribute('data-obs','1');io.observe(el);});}
          observe();
          new MutationObserver(observe).observe(document.body,{childList:true,subtree:true});
        })();
      `}</Script>
    </>
  );
}
