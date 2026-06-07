import Script from 'next/script';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trends — Klyxe',
  description: 'Score trends and comparisons within each size tier — Large, Medium, Small.',
  openGraph: {
    title: 'AI Model Trends — Klyxe',
    description: 'Score comparisons within each size tier — Large vs Large, Medium vs Medium, Small vs Small.',
  },
};

export default function TrendsPage() {
  return (
    <>
      <Script src="/style-spacing.css" strategy="afterInteractive" />
      <Script src="/style.css" strategy="afterInteractive" />
      <Script src="/animations.css" strategy="afterInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js" strategy="afterInteractive" />

      <div className="page-hero">
        <div className="page-hero-inner">
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: '0 0 6px 0' }}>Trends</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '560px', lineHeight: 1.6, margin: 0 }}>
            Score comparisons within each size tier — Large vs Large, Medium vs Medium, Small vs Small. Scores are normalized per tier, so cross-tier comparisons are not meaningful.
          </p>
        </div>
      </div>

      <main className="container">
        <div id="tier-large" className="tier-section"></div>
        <div id="tier-medium" className="tier-section"></div>
        <div id="tier-small" className="tier-section"></div>
      </main>

      <div style={{ borderTop: '1px solid var(--border)', marginTop: '48px' }}>
        <footer className="footer">
          <div className="footer-links">
            <a href="https://skillichse.github.io/Klyxe/" className="footer-link">GitHub</a>
            <a href="/about" className="footer-link">About</a>
            <a href="/news" className="footer-link">News</a>
          </div>
          <div className="footer-copy">Open source &middot; Updated daily via GitHub Actions</div>
        </footer>
      </div>

      <Script id="trends-logic" strategy="afterInteractive">{`
        var TIER_LABELS={large:'Large (50B+)',medium:'Medium (10–50B)',small:'Small (≤10B)'};
        var BENCH=[
          {key:'code',label:'HumanEval — Code',color:'#6366f1',fn:function(m){return m.tests&&m.tests.code?m.tests.code.avg_score||0:0;}},
          {key:'reasoning',label:'GSM8K — Reasoning',color:'#3b82f6',fn:function(m){return m.tests&&m.tests.reasoning?m.tests.reasoning.score||0:0;}},
          {key:'instruction',label:'MMLU — Knowledge',color:'#06b6d4',fn:function(m){return m.tests&&m.tests.instruction?m.tests.instruction.avg_score||0:0;}},
          {key:'translation',label:'Translation',color:'#10b981',fn:function(m){return m.tests&&m.tests.translation?m.tests.translation.avg_score||0:0;}},
          {key:'speed',label:'Speed (tok/s)',color:'#f59e0b',fn:function(m){return m.raw_speed||0;}},
        ];
        function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
        function short(n,max){max=max||20;return n.length>max?n.slice(0,max-1)+'…':n;}
        function isDark(){return document.documentElement.getAttribute('data-theme')!=='light';}
        function gridC(){return isDark()?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.06)';}
        function labelC(){return isDark()?'rgba(255,255,255,0.45)':'rgba(0,0,0,0.45)';}
        function ttBg(){return isDark()?'rgba(15,20,30,0.95)':'rgba(255,255,255,0.97)';}
        function ttColor(){return isDark()?'#e8eaed':'#111827';}
        var chartInstances=[];
        function buildChart(canvasId,labels,data,colors,yMax,tips){
          var ctx=document.getElementById(canvasId);
          if(!ctx)return;
          var bgColors=labels.map(function(_,i){return colors[i%colors.length]+'cc';});
          var bdColors=labels.map(function(_,i){return colors[i%colors.length];});
          var c=new Chart(ctx,{type:'bar',data:{labels:labels,datasets:[{data:data,backgroundColor:bgColors,borderColor:bdColors,borderWidth:1,borderRadius:6,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:ttBg(),titleColor:ttColor(),bodyColor:ttColor(),borderColor:isDark()?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.1)',borderWidth:1,padding:10,cornerRadius:8,displayColors:false,callbacks:{title:function(items){return labels[items[0].dataIndex]||'';},label:function(item){var lines=[item.raw+(yMax===100?'/100':' tok/s')];if(tips&&tips[item.dataIndex])lines.push(tips[item.dataIndex]);return lines;}}}},scales:{y:{beginAtZero:true,max:yMax||undefined,grid:{color:gridC()},border:{display:false},ticks:{color:labelC(),font:{size:10},maxTicksLimit:5}},x:{grid:{display:false},border:{display:false},ticks:{color:labelC(),font:{size:10},maxRotation:30,maxTicksLimit:12}}},animation:{duration:700,easing:'easeOutQuart'}});
          chartInstances.push(c);
        }
        function buildTier(tier,models){
          var el=document.getElementById('tier-'+tier);
          var baseColor={large:'#6366f1',medium:'#3b82f6',small:'#10b981'}[tier];
          var multiColors=[baseColor,baseColor+'bb',baseColor+'88',baseColor+'66',baseColor+'55'];
          el.innerHTML='<div class="tier-heading reveal"><span class="tier-dot '+tier+'"></span><span class="tier-heading-name">'+TIER_LABELS[tier]+'</span><span class="tier-heading-sub">'+models.length+' model'+(models.length!==1?'s':'')+'</span></div>';
          if(!models.length){el.innerHTML+='<div class="no-data">No '+TIER_LABELS[tier]+' models in this run.</div>';return;}
          var sorted=[].concat(models).sort(function(a,b){return (b.quality_score||0)-(a.quality_score||0);});
          var sortedSpd=[].concat(models).sort(function(a,b){return (b.raw_speed||0)-(a.raw_speed||0);});
          var fastest=sortedSpd[0];
          var avgQ=models.reduce(function(s,m){return s+(m.quality_score||0);},0)/models.length;
          var fullR=models.filter(function(m){return m.tests_completed===5;}).length;
          var html='<div class="insights-grid reveal"><div class="insight-card"><div class="insight-label">Top scorer</div><div class="insight-value" title="'+esc(sorted[0].model_name)+'"><em>'+esc(short(sorted[0].model_name,18))+'</em></div><div class="insight-sub">'+esc(sorted[0].provider)+' &middot; '+Math.round(sorted[0].quality_score||0)+'/100</div></div><div class="insight-card"><div class="insight-label">Fastest</div><div class="insight-value" title="'+esc(fastest.model_name)+'"><em>'+esc(short(fastest.model_name,18))+'</em></div><div class="insight-sub">'+esc(fastest.provider)+' &middot; '+Math.round(fastest.raw_speed||0)+' tok/s</div></div><div class="insight-card"><div class="insight-label">Avg quality</div><div class="insight-value"><em>'+Math.round(avgQ)+'</em><span style="font-size:13px;color:var(--text-secondary);font-weight:400;"> /100</span></div><div class="insight-sub">across '+models.length+' model'+(models.length!==1?'s':'')+'</div></div><div class="insight-card"><div class="insight-label">Full tests</div><div class="insight-value"><em>'+fullR+'</em><span style="font-size:13px;color:var(--text-secondary);font-weight:400;"> /'+models.length+'</span></div><div class="insight-sub">completed all 5 benchmarks</div></div></div>';
          var qId='chart-q-'+tier,sId='chart-s-'+tier;
          html+='<div class="charts-grid reveal"><div class="chart-card"><div class="chart-card-title">Quality Score</div><div class="chart-card-sub">Overall score 0–100 &middot; best to worst</div><div class="chart-wrap"><canvas id="'+qId+'"></canvas></div></div><div class="chart-card"><div class="chart-card-title">Speed (tok/s)</div><div class="chart-card-sub">Tokens per second &middot; fastest to slowest</div><div class="chart-wrap"><canvas id="'+sId+'"></canvas></div></div></div>';
          html+='<div class="bench-section-title reveal">Benchmark Breakdown</div><div class="bench-grid">';
          BENCH.forEach(function(bench){
            var ranked=[].concat(models).map(function(m){return {name:m.model_name,provider:m.provider,score:bench.fn(m)};}).filter(function(m){return m.score>0;}).sort(function(a,b){return b.score-a.score;});
            if(!ranked.length)return;
            var maxS=ranked[0].score,isSpd=bench.key==='speed';
            html+='<div class="bench-card reveal"><div class="bench-card-label"><span class="bench-color-dot" style="background:'+bench.color+'"></span>'+bench.label+'</div>';
            ranked.forEach(function(m,i){
              var pct=maxS>0?m.score/maxS*100:0;
              var display=isSpd?Math.round(m.score)+' t/s':Math.round(m.score);
              var vc=isSpd?bench.color:(m.score>=75?'#10b981':m.score>=40?'#f59e0b':'#ef4444');
              html+='<div class="bench-row"><span class="bench-rank">#'+(i+1)+'</span><div style="flex:1;min-width:0;"><div style="display:flex;align-items:center;gap:4px;"><span class="bench-model" title="'+esc(m.name)+'">'+esc(short(m.name))+'</span><span class="bench-val" style="color:'+vc+'">'+display+'</span></div><div class="bench-bar-wrap"><div class="bench-bar-fill" style="width:'+pct+'%;background:'+bench.color+'"></div></div></div></div>';
            });
            html+='</div>';
          });
          html+='</div>';
          el.innerHTML+=html;
          requestAnimationFrame(function(){
            buildChart(qId,sorted.map(function(m){return short(m.model_name);}),sorted.map(function(m){return Math.round(m.quality_score||0);}),multiColors,100,sorted.map(function(m){return 'Provider: '+m.provider;}));
            buildChart(sId,sortedSpd.map(function(m){return short(m.model_name);}),sortedSpd.map(function(m){return Math.round(m.raw_speed||0);}),multiColors,null,sortedSpd.map(function(m){return 'Provider: '+m.provider;}));
          });
          var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});},{threshold:0.07});
          el.querySelectorAll('.reveal').forEach(function(r){io.observe(r);});
        }
        function loadData(){
          fetch('data/results/leaderboard_speed.json').then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}).then(function(all){
            var byTier={large:[],medium:[],small:[]};
            all.forEach(function(m){var t=m.tier||m.size_category||'medium';if(t==='unknown')t='medium';if(byTier[t])byTier[t].push(m);else byTier.medium.push(m);});
            ['large','medium','small'].forEach(function(t){buildTier(t,byTier[t]);});
          }).catch(function(e){console.error('loadData error:',e);['large','medium','small'].forEach(function(t){var el=document.getElementById('tier-'+t);if(el)el.innerHTML='<div class="no-data">Failed to load data. Please refresh.</div>';});});
        }
        document.addEventListener('DOMContentLoaded',loadData);
      `}</Script>
    </>
  );
}
