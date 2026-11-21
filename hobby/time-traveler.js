/* مسافر زمان و خانه در تهران — engine + charts. Data: /hobby/data/time-traveler/data.json (built from cited sources). */
'use strict';
(function(){
var FA='۰۱۲۳۴۵۶۷۸۹';
function fa(s){return String(s).replace(/\d/g,function(d){return FA[+d];});}
var MONTHS=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
function $(s,r){return (r||document).querySelector(s);}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function css(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim()||'#888';}

/* ---------- number formatting ---------- */
function trimNum(x){
  var s=x>=100?String(Math.round(x)):x>=10?x.toFixed(1):x.toFixed(2);
  if(s.indexOf('.')>=0)s=s.replace(/0+$/,'').replace(/\.$/,'');
  return fa(s.replace('.','٫'));
}
var UNITS=[[1e15,' میلیون میلیارد'],[1e12,' هزار میلیارد'],[1e9,' میلیارد'],[1e6,' میلیون'],[1e3,' هزار']];
function moneyShort(v){
  if(v==null||!isFinite(v))return '—';
  var a=Math.abs(v);
  if(a>=1e18){var e=Math.floor(Math.log10(a));return trimNum(v/Math.pow(10,e))+' × ۱۰ به توان '+fa(e);}
  for(var i=0;i<UNITS.length;i++){
    if(a>=UNITS[i][0]*0.9995){
      var x=v/UNITS[i][0];
      /* 999.96 million would print as 1000 million: move up a unit instead */
      if(i>0&&Math.abs(Math.round(x))>=1000)return trimNum(v/UNITS[i-1][0])+UNITS[i-1][1];
      return trimNum(x)+UNITS[i][1];
    }
  }
  return trimNum(v);
}
function money(v){
  if(v==null||!isFinite(v))return '—';
  return moneyShort(v)+' تومان';
}
function years(m){ /* months -> «۲ سال و ۳ ماه» */
  var y=Math.floor(m/12),mo=m%12;
  if(y===0)return fa(mo)+' ماه';
  if(mo===0)return fa(y)+' سال';
  return fa(y)+' سال و '+fa(mo)+' ماه';
}

var D=null,N=0,Y0=1370;
function ym(i){return [Y0+Math.floor(i/12),i%12+1];}
function mlabel(i){var a=ym(i);return MONTHS[a[1]-1]+' '+fa(a[0]);}
function idx(y,m){return (y-Y0)*12+(m-1);}

/* ---------- assets the traveller can hold ----------
   c = one-way cost (buy OR sell) as a fraction: exchange spread + fees, a deliberately plain estimate */
var ASSETS=[
  {k:'cash',  name:'نقد',          c:0,     col:'--neutral', fixed:true},
  {k:'dep',   name:'سپردهٔ بانکی',  c:0,     col:'--s3'},
  {k:'usd',   name:'دلار',          c:0.01,  col:'--s2'},
  {k:'gold',  name:'طلا',           c:0.02,  col:'--s4'},
  {k:'coin',  name:'سکهٔ امامی',    c:0.015, col:'--s5'},
  {k:'tedpix',name:'بورس تهران',    c:0.006, col:'--s6'},
  {k:'btc',   name:'بیت‌کوین',       c:0.01,  col:'--s7'},
  {k:'eth',   name:'اتریوم',         c:0.01,  col:'--s8'}
];
var STRATS=[
  {k:'trav',name:'مسافر زمان',          col:'--s1', note:'با دانستن همهٔ قیمت‌های آینده، بهترین ترتیب خرید و فروش را با حساب کارمزد انتخاب می‌کند'},
  {k:'usd', name:'پس‌انداز دلاری',      col:'--s2', note:'هر ماه دلار می‌خرد و نگه می‌دارد'},
  {k:'dep', name:'سپردهٔ بانکی',        col:'--s3', note:'هر ماه پول را در سپردهٔ یک‌ساله می‌گذارد'},
  {k:'gold',name:'پس‌انداز طلا',        col:'--s4', note:'هر ماه طلا می‌خرد و نگه می‌دارد'}
];
var CARS=[
  ['none','بدون ماشین'],
  ['cheap','ارزان‌ترین ماشین هر سال'],
  ['mid','ماشین متوسط هر سال'],
  ['pride','پراید (صبا)'],['pride_111','پراید ۱۱۱'],['pride_131','پراید ۱۳۱'],['saina','ساینا'],['quick','کوییک'],
  ['tiba2','تیبا ۲'],['peugeot_206_t2','پژو ۲۰۶ تیپ ۲'],['peugeot_405','پژو ۴۰۵'],['peugeot_pars','پژو پارس'],
  ['samand','سمند'],['dena','دنا'],['dena_plus','دنا پلاس'],['tara','تارا'],['shahin','شاهین'],['toyota_camry','تویوتا کمری']
];
function carName(k){for(var i=0;i<CARS.length;i++)if(CARS[i][0]===k)return CARS[i][1];return k;}
function carModelAt(key,t){
  var y=ym(t)[0];
  if(key==='cheap')return y<=1389?'pride':y<=1401?'pride_111':'quick';
  if(key==='mid')return y<=1401?'peugeot_405':'tara';
  return key;
}

/* ---------- state ---------- */
var S={salary:200e6, save:50, index:'cpi', area:75, district:0, car:'cheap', fee:1, est:true,
  assets:{dep:true,usd:true,gold:true,coin:true,tedpix:true,btc:true,eth:true}, cohort:1370};
var FIRST_BORN=1352, LAST_BORN=1385;

/* ---------- prepared arrays ---------- */
var P={}, F={};
function prep(){
  N=D.n; Y0=D.start[0];
  var s=D.series;
  ASSETS.forEach(function(a){
    var arr=new Float64Array(N);
    if(a.k==='cash'){for(var i=0;i<N;i++)arr[i]=1;}
    else if(a.k==='dep'){
      /* deposit as an index: the year's one-year rate as an effective annual rate, (1+r)^(1/12) a month */
      var v=1,last=null;
      for(var i=0;i<N;i++){arr[i]=v;var r=s.dep[i]!=null?s.dep[i]:last;if(r!=null)last=r;v*=Math.pow(1+(r||0)/100,1/12);}
    }else{for(var i=0;i<N;i++)arr[i]=s[a.k][i]==null?NaN:s[a.k][i];}
    P[a.k]=arr; F[a.k]=s[a.k+'_f']||[];
  });
}
/* annual average CPI or minimum wage, used to scale the 1405 salary back in time */
function yearAvg(arr){
  var m={};
  for(var i=0;i<N;i++){if(arr[i]==null)continue;var y=ym(i)[0];(m[y]=m[y]||[]).push(arr[i]);}
  var o={};for(var y in m){var a=m[y];o[y]=a.reduce(function(x,z){return x+z;},0)/a.length;}
  return o;
}
var CPIY=null, WAGEY=null, CPI_MONTHS_1405=0;
function salaryArr(){
  var ref=S.index==='wage'?WAGEY:CPIY, base=ref[1405], out=new Float64Array(N);
  for(var i=0;i<N;i++){var y=ym(i)[0];out[i]=ref[y]!=null?S.salary*ref[y]/base:NaN;}
  return out;
}
/* a model's price in month t. Outside the years it was on sale, its nearest real price is carried with CPI
   (a car "with the same real price"), flagged 'x' so the page can say so. */
function cpiAt(t){
  var c=D.series.cpi,last=-1;for(var i=N-1;i>=0;i--)if(c[i]!=null){last=i;break;}
  if(t>last&&last>0&&c[last-1]!=null)return c[last]*Math.pow(c[last]/c[last-1],t-last);
  for(var j=Math.min(t,N-1);j>=0;j--)if(c[j]!=null)return c[j];
  for(var k=t;k<N;k++)if(c[k]!=null)return c[k];return null;}
function carAt(key,t){
  var m=D.cars[carModelAt(key,t)];if(!m)return null;
  if(m.v[t]!=null)return {v:m.v[t],f:m.f[t],m:m};
  var first=-1,last=-1;for(var i=0;i<N;i++)if(m.v[i]!=null){if(first<0)first=i;last=i;}
  if(first<0)return null;
  var ref=t<first?first:last;
  return {v:m.v[ref]*cpiAt(t)/cpiAt(ref),f:'x',m:m};
}
function targetArr(){
  var hs=D.series.house, ratio=S.district?D.district_ratio[S.district][0]:1, out=new Float64Array(N), q=[];
  for(var i=0;i<N;i++){
    var h=hs[i];
    if(h==null||(!S.est&&i>D.house_official_end)){out[i]=NaN;continue;}
    var car=0;
    if(S.car!=='none'){
      var ca=carAt(S.car,i);
      if(!ca){out[i]=NaN;continue;}
      car=ca.v;
    }
    out[i]=h*S.area*ratio+car;
  }
  return out;
}

/* ---------- engine ----------
   For each month T, a backward pass gives B[k] = the most a toman saved in month k can be worth, in cash, at T,
   if you trade with perfect knowledge of every later monthly price, paying the one-way cost on each buy and sell.
   H[a] = value (at T, in cash) of one toman's worth of asset a in month k, before trading;
   K[a] = the same, committed to hold a until month k+1. Every saved toman can follow its own best path, so the
   maximum wealth at T is a plain sum: W_s(T) = Σ_{k=s..T} saving[k] · B[k]. */
function costs(){
  return ASSETS.map(function(a){return Math.min(0.4,a.c*S.fee);});
}
function activeMask(){return ASSETS.map(function(a){return a.fixed||!!S.assets[a.k];});}
function backward(T,kmin,c,act,store){
  var A=ASSETS.length,H=new Float64Array(A),K=new Float64Array(A),B=new Float64Array(T+1),i,a;
  for(a=0;a<A;a++){var p=P[ASSETS[a].k][T];H[a]=act[a]&&p===p?1-c[a]:-Infinity;}
  B[T]=1;
  if(store){store.K[T]=null;store.C[T]=1;}
  for(var k=T-1;k>=kmin;k--){
    var C=-Infinity;
    for(a=0;a<A;a++){
      var pk=P[ASSETS[a].k][k],pn=P[ASSETS[a].k][k+1];
      K[a]=(act[a]&&pk===pk&&pn===pn&&H[a]>-Infinity)?pn/pk*H[a]:-Infinity;
      var v=(1-c[a])*K[a];if(v>C)C=v;
    }
    for(a=0;a<A;a++){
      var pk2=P[ASSETS[a].k][k];
      if(!act[a]||pk2!==pk2){H[a]=-Infinity;continue;}
      var sell=(1-c[a])*C;H[a]=K[a]>sell?K[a]:sell;
    }
    B[k]=C;
    if(store){store.K[k]=Float64Array.from(K);store.C[k]=C;}
  }
  return B;
}
function compute(){
  var c=costs(),act=activeMask(),sal=salaryArr(),tgt=targetArr(),rate=S.save/100;
  var cohorts=[];for(var b=FIRST_BORN;b<=LAST_BORN;b++){var s=idx(b+20,1);if(s>=0&&s<N)cohorts.push({born:b,s:s});}
  var kmin=cohorts[0].s;
  var res={cohorts:cohorts,sal:sal,tgt:tgt,W:{}};
  STRATS.forEach(function(st){res.W[st.k]=cohorts.map(function(){var a=new Float64Array(N);a.fill(NaN);return a;});});
  /* traveller */
  for(var T=kmin;T<N;T++){
    var B=backward(T,kmin,c,act,null),acc=0,suf=new Float64Array(T+1);
    for(var k=T;k>=kmin;k--){var x=sal[k];if(x===x)acc+=x*B[k];suf[k]=acc;}
    for(var j=0;j<cohorts.length;j++)if(cohorts[j].s<=T)res.W.trav[j][T]=rate*suf[cohorts[j].s];
  }
  /* plain savers: buy every month, hold, sell at T */
  [['usd',2],['dep',1],['gold',3]].forEach(function(p){
    var key=p[0],a=p[1],pr=P[key],cc=Math.min(0.4,ASSETS[a].c*S.fee),f=(1-cc)*(1-cc);
    cohorts.forEach(function(co,j){
      var acc=0;
      for(var T=co.s;T<N;T++){
        var cash=sal[T]===sal[T]?sal[T]:0;
        res.W[key][j][T]=pr[T]===pr[T]?rate*(f*acc*pr[T]+cash):NaN;
        if(pr[T]===pr[T]&&sal[T]===sal[T])acc+=sal[T]/pr[T];
      }
    });
  });
  /* first month the wealth covers house + car */
  res.lastKnown=-1;for(var q=N-1;q>=0;q--)if(tgt[q]===tgt[q]){res.lastKnown=q;break;}
  res.hit={};
  STRATS.forEach(function(st){
    res.hit[st.k]=cohorts.map(function(co,j){
      var W=res.W[st.k][j];
      for(var T=co.s;T<N;T++){if(tgt[T]===tgt[T]&&W[T]>=tgt[T])return T;}
      return -1;
    });
  });
  return res;
}
/* the traveller's actual moves for one cohort, up to month T */
function replay(co,T){
  var c=costs(),act=activeMask(),sal=salaryArr(),rate=S.save/100,A=ASSETS.length;
  var store={K:[],C:[]};backward(T,co.s,c,act,store);
  var h=new Float64Array(A),comp=[],log=[];
  for(var k=co.s;k<=T;k++){
    var x=sal[k];if(x===x)h[0]+=rate*x;
    if(k<T){
      var K=store.K[k],C=store.C[k],moved=[];
      for(var a=1;a<A;a++){if(h[a]>0&&K[a]<(1-c[a])*C){h[0]+=h[a]*(1-c[a]);moved.push(a);h[a]=0;}}
      var best=0,bv=K[0];
      for(var a2=1;a2<A;a2++){var v=(1-c[a2])*K[a2];if(v>bv){bv=v;best=a2;}}
      if(best!==0&&h[0]>0){h[best]+=h[0]*(1-c[best]);h[0]=0;}
      var tot=0,dom=0;for(var a3=0;a3<A;a3++){tot+=h[a3];if(h[a3]>h[dom])dom=a3;}
      comp.push({k:k,dom:dom,tot:tot});
      for(var a4=0;a4<A;a4++){var pk=P[ASSETS[a4].k][k],pn=P[ASSETS[a4].k][k+1];if(h[a4]>0)h[a4]*=pn/pk;}
    }else{
      var tot2=0;for(var a5=0;a5<A;a5++)if(h[a5]>0)tot2+=h[a5]*(1-c[a5]);
      comp.push({k:k,dom:0,tot:tot2,final:true});
    }
  }
  /* compress into the moments the bulk of the money changed asset */
  var prev=-1;
  comp.forEach(function(e){if(!e.final&&e.dom!==prev){log.push(e);prev=e.dom;}});
  return {comp:comp,log:log};
}

/* ---------- tiny SVG chart ---------- */
var NS='http://www.w3.org/2000/svg';
function el(tag,attrs,parent){var e=document.createElementNS(NS,tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e;}
function niceLin(max){var p=Math.pow(10,Math.floor(Math.log10(max||1))),n=max/p,step=n<=2?0.5:n<=5?1:2;step*=p;var t=[];for(var v=0;v<=max+1e-9;v+=step)t.push(v);if(t[t.length-1]<max)t.push(t[t.length-1]+step);return t;}
function logTicks(lo,hi){var t=[];for(var e=Math.floor(Math.log10(lo));e<=Math.ceil(Math.log10(hi));e++){var v=Math.pow(10,e);if(v>=lo/1.01&&v<=hi*1.01)t.push(v);}
  if(t.length>7){var st=Math.ceil(t.length/6),t3=[];for(var q=0;q<t.length;q+=st)t3.push(t[q]);return t3;}
  if(t.length<3){var t2=[];for(var e2=Math.floor(Math.log10(lo));e2<=Math.ceil(Math.log10(hi));e2++){[1,3].forEach(function(m){var v=m*Math.pow(10,e2);if(v>=lo/1.01&&v<=hi*1.01)t2.push(v);});}t=t2;}return t;}
/* opts: n, xLabel(i), xTicks[], series[{key,color,values[],dash,open[],markers,width}], yLog, yFmt, height, tip(i), onClick(i), marks[{i,label}] */
function chart(box,opts){
  box.innerHTML='';
  var W=Math.max(300,box.clientWidth||700),Hh=opts.height||300,m={l:52,r:12,t:opts.yTitle?30:14,b:opts.xTitle?48:30};
  if(W<480)m.l=44;
  if(opts.ml)m.l=opts.ml;
  var svg=el('svg',{viewBox:'0 0 '+W+' '+Hh,role:'img','aria-label':opts.label||''},box);
  svg.style.direction='ltr';
  var iw=W-m.l-m.r,ih=Hh-m.t-m.b,n=opts.n;
  var all=[];opts.series.forEach(function(s){s.values.forEach(function(v){if(v!=null&&isFinite(v)&&(!opts.yLog||v>0)&&!(opts.yMax&&v>opts.yMax))all.push(v);});});
  if(!all.length)return;
  var lo=Math.min.apply(null,all),hi=Math.max.apply(null,all),ys,ticks;
  if(opts.yLog){lo=lo/1.3;hi=hi*1.3;var L0=Math.log10(lo),L1=Math.log10(hi);ys=function(v){return m.t+ih-(Math.log10(v)-L0)/(L1-L0)*ih;};ticks=logTicks(lo,hi);}
  else{ticks=niceLin(Math.max(hi,opts.yMin||0));var top=ticks[ticks.length-1];ys=function(v){return m.t+ih-v/top*ih;};
    if(opts.tickMax!=null)ticks=ticks.filter(function(t){return t<=opts.tickMax;});}
  var xs=function(i){return m.l+(n<=1?iw/2:i/(n-1)*iw);};
  var g=el('g',{},svg);
  ticks.forEach(function(t){var y=ys(t);el('line',{x1:m.l,x2:W-m.r,y1:y,y2:y,stroke:css('--grid'),'stroke-width':1},g);
    var tx=el('text',{x:m.l-6,y:y+3.5,'text-anchor':'end'},g);tx.textContent=opts.yFmt(t);});
  (opts.xTicks||[]).forEach(function(i){var x=xs(i);el('line',{x1:x,x2:x,y1:m.t+ih,y2:m.t+ih+4,stroke:css('--axis')},g);
    var tx=el('text',{x:x,y:m.t+ih+17,'text-anchor':'middle'},g);tx.textContent=opts.xLabel(i);});
  el('line',{x1:m.l,x2:W-m.r,y1:m.t+ih,y2:m.t+ih,stroke:css('--axis'),'stroke-width':1},g);
  if(opts.yTitle){var yt=el('text',{x:4,y:13,'text-anchor':'start','class':'ttl'},g);yt.textContent=opts.yTitle;}
  if(opts.xTitle){var xt2=el('text',{x:m.l+iw/2,y:Hh-6,'text-anchor':'middle','class':'ttl'},g);xt2.textContent=opts.xTitle;}
  (opts.bands||[]).forEach(function(bd){var y=ys(bd.v);
    el('line',{x1:m.l,x2:W-m.r,y1:y,y2:y,stroke:css('--axis'),'stroke-width':1,'stroke-dasharray':'4 4'},g);
    /* the label sits in the y-axis column (side) or, for a line at the very top, in the margin above it */
    var atTop=y-16<m.t,bt=bd.side?el('text',{x:m.l-6,y:y+3.5,'text-anchor':'end','class':'band'},g):
      el('text',{x:atTop?W-m.r-4:m.l+6,y:atTop?m.t-10:y-6,'text-anchor':atTop?'end':'start','class':'band'},g);
    bt.textContent=bd.label;});
  opts.series.forEach(function(s){
    var col=s.color,segs=[],cur=[];
    for(var i=0;i<n;i++){var v=s.values[i];var ok=v!=null&&isFinite(v)&&(!opts.yLog||v>0)&&!(s.open&&s.open[i])&&!(opts.yMax&&v>opts.yMax);
      if(ok){cur.push([xs(i),ys(v),s.style?s.style[i]:null]);}else if(cur.length){segs.push(cur);cur=[];}}
    if(cur.length)segs.push(cur);
    segs.forEach(function(seg){
      if(s.style){ /* split by data-quality style */
        for(var q=1;q<seg.length;q++){var st=seg[q][2]||'o';
          el('line',{x1:seg[q-1][0],y1:seg[q-1][1],x2:seg[q][0],y2:seg[q][1],stroke:col,'stroke-width':2,'stroke-linecap':'round',
            'stroke-dasharray':st==='i'?'5 4':st==='e'?'1.5 3.5':st==='f'?'8 3':''},svg);}
        if(seg.length===1)el('circle',{cx:seg[0][0],cy:seg[0][1],r:2.5,fill:col},svg);
      }else{
        var d=seg.map(function(p,j){return (j?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1);}).join('');
        el('path',{d:d,fill:'none',stroke:col,'stroke-width':s.width||2,'stroke-linejoin':'round','stroke-linecap':'round','stroke-dasharray':s.dash||''},svg);
      }
    });
    if(s.markers){for(var i2=0;i2<n;i2++){var v2=s.values[i2];if(v2==null||!isFinite(v2))continue;
      var open=s.open&&s.open[i2];
      el('circle',{cx:xs(i2),cy:ys(Math.max(v2,opts.yLog?lo:0)),r:open?3.6:4,fill:open?css('--card'):col,stroke:open?col:css('--card'),'stroke-width':open?1.8:1.5},svg);
    }}
    if(s.dots){s.dots.forEach(function(i3){var v3=s.values[i3];if(v3==null)return;el('circle',{cx:xs(i3),cy:ys(v3),r:4.5,fill:col,stroke:css('--card'),'stroke-width':2},svg);});}
  });
  var markEls=(opts.marks||[]).map(function(mk){var x=xs(mk.i);return el('line',{x1:x,x2:x,y1:m.t,y2:m.t+ih,stroke:css('--axis'),'stroke-width':1,'stroke-dasharray':'2 3'},svg);});
  /* hover layer */
  var cross=el('line',{x1:0,x2:0,y1:m.t,y2:m.t+ih,stroke:css('--axis'),'stroke-width':1,visibility:'hidden'},svg);
  var hit=el('rect',{x:m.l,y:m.t,width:iw,height:ih,fill:'transparent',style:'touch-action:pan-y;cursor:'+(opts.onClick?'pointer':'crosshair')},svg);
  var tip=document.createElement('div');tip.className='tip';box.appendChild(tip);
  function at(ev){var r=svg.getBoundingClientRect(),x=(ev.clientX-r.left)*W/r.width;var i=Math.round((x-m.l)/iw*(n-1));return Math.max(0,Math.min(n-1,i));}
  var lastI=-1;
  function show(ev){var i=at(ev),html=opts.tip(i);lastI=i;if(!html){tip.style.display='none';cross.setAttribute('visibility','hidden');return;}
    cross.setAttribute('x1',xs(i));cross.setAttribute('x2',xs(i));cross.setAttribute('visibility','visible');
    tip.innerHTML=html;tip.style.display='block';
    var r=box.getBoundingClientRect(),px=ev.clientX-r.left,py=ev.clientY-r.top,tw=tip.offsetWidth,th=tip.offsetHeight;
    var left=px+14;if(left+tw>r.width)left=px-tw-14;if(left<0)left=Math.max(0,r.width-tw);
    var tp=py-th-10;if(tp<0)tp=py+16;
    tip.style.left=left+'px';tip.style.top=tp+'px';}
  function hide(){tip.style.display='none';cross.setAttribute('visibility','hidden');}
  var lastType='mouse';
  hit.addEventListener('pointermove',function(ev){lastType=ev.pointerType;show(ev);});
  hit.addEventListener('pointerdown',function(ev){lastType=ev.pointerType;show(ev);});
  hit.addEventListener('click',function(ev){if(opts.onClick)opts.onClick(lastI>=0?lastI:at(ev));});
  /* on a phone the finger lifts right away: keep the tip until the next tap elsewhere */
  hit.addEventListener('pointerleave',function(){if(lastType==='mouse')hide();});
  box._hideTip=hide;
  return {setMark:function(i){markEls.forEach(function(l){var x=xs(i);l.setAttribute('x1',x);l.setAttribute('x2',x);});}};
}

/* ---------- UI ---------- */
var R=null;
function goal(){return S.car==='none'?'خانه':'خانه و ماشین';}
function carShort(k){return carName(k).replace(/ \(.*\)$/,'');}
function houseRatio(){return S.district?D.district_ratio[S.district][0]:1;}
function lastHouseIdx(){for(var i=N-1;i>=0;i--){if(D.series.house[i]!=null&&(S.est||i<=D.house_official_end))return i;}return -1;}
function faN(n){return fa(Math.round(n).toLocaleString('en-US').replace(/,/g,'٬'));}
function saveWords(){return S.save===50?'نصف حقوقش':S.save===100?'همهٔ حقوقش':S.save===25?'یک‌چهارم حقوقش':fa(S.save)+'٪ حقوقش';}
function growWords(g,a){ /* «۴ برابر شد» or «۳۵٪ گران شد»; a deposit earns, it does not get dearer */
  if(a==='dep')return g>=2?'پولش '+trimNum(g)+' برابر شد':fa(Math.round((g-1)*100))+'٪ سود گرفت';
  if(g>=2)return trimNum(g)+' برابر شد';
  return fa(Math.round((g-1)*100))+'٪ گران شد';
}
function pctOf(w,tg){return Math.floor(w/tg*100);}
/* what the purchase costs in month t: house + car, in words */
function needParts(t){
  var h=D.series.house[t]*S.area*houseRatio(),ca=S.car==='none'?null:carAt(S.car,t);
  return {house:h,car:ca?ca.v:0,carName:ca?carShort(carModelAt(S.car,t)):'',total:h+(ca?ca.v:0)};
}
function needWords(t,noTotal){
  var p=needParts(t),h='خانهٔ '+fa(S.area)+' متری '+(S.district?'در منطقهٔ '+fa(S.district):'در تهران')+' به قیمت '+money(p.house);
  if(S.car==='none')return h;
  return h+' و '+p.carName+' به قیمت '+money(p.car)+(noTotal?'':'؛ روی هم '+money(p.total));
}

function distOptions(){
  var L=lastHouseIdx(),base=L>=0?D.series.house[L]:null,o='';
  o+='<option value="0">میانگین تهران'+(base?' — متری '+moneyShort(base):'')+'</option>';
  for(var d=1;d<=22;d++){if(!D.district_ratio[d])continue;
    o+='<option value="'+d+'">منطقهٔ '+fa(d)+(base?' — متری '+moneyShort(base*D.district_ratio[d][0]):'')+'</option>';}
  return o;
}
function controlsHTML(){
  var cars=CARS.map(function(c){var m=D.cars[c[0]];
    if(c[0]!=='none'&&c[0]!=='cheap'&&c[0]!=='mid'&&!m)return '';
    return '<option value="'+c[0]+'">'+esc(c[1])+'</option>';}).join('');
  var chips=ASSETS.filter(function(a){return !a.fixed;}).map(function(a){
    return '<button class="chip" data-asset="'+a.k+'" aria-pressed="true" style="--c:var('+a.col+')"><span class="sw"></span>'+a.name+'</button>';}).join('');
  return ''+
  '<div class="card controls" id="controls">'+
    '<div class="ctl"><label for="c-sal">حقوق ماهانه در ۱۴۰۵</label>'+
      '<div class="salrow"><input id="c-sal" type="text" dir="ltr" inputmode="decimal" autocomplete="off" value="۲۰۰" aria-describedby="e-sal h-sal"><span>میلیون تومان در ماه</span></div>'+
      '<div class="chips presets" id="c-salp" role="group" aria-label="مبلغ‌های آماده">'+[30,50,100,200,300,500].map(function(v){return '<button type="button" data-v="'+v+'" aria-pressed="'+(v===200)+'">'+fa(v)+' میلیون</button>';}).join('')+'</div>'+
      '<span class="err" id="e-sal" role="status"></span>'+
      '<span class="hint" id="h-sal"></span></div>'+
    '<div class="ctl"><label for="c-save">چقدر از حقوقش را کنار می‌گذارد؟ <span class="val" id="v-save"></span></label>'+
      '<input type="range" id="c-save" min="10" max="100" step="5" value="50"><span class="hint" id="h-save"></span></div>'+
    '<div class="ctl"><span class="lbl">حقوقش در سال‌های قبل چقدر بود؟</span>'+
      '<div class="seg" id="c-index"><button data-v="cpi" class="on">هم‌پای گرانی</button><button data-v="wage">هم‌پای حقوق کارگری</button></div>'+
      '<span class="hint" id="h-index"></span></div>'+
    '<div class="ctl"><label for="c-area">خانه چند متری باشد؟ <span class="val" id="v-area"></span></label>'+
      '<input type="range" id="c-area" min="40" max="200" step="5" value="75"><span class="hint">بیشتر خانه‌هایی که در تهران خرید و فروش می‌شوند بین ۵۰ تا ۸۰ متر هستند.</span></div>'+
    '<div class="ctl"><label for="c-dist">کدام منطقهٔ تهران؟</label><select id="c-dist"></select>'+
      '<span class="hint" id="h-dist"></span></div>'+
    '<div class="ctl"><label for="c-car">کدام ماشین؟</label><select id="c-car">'+cars+'</select>'+
      '<span class="hint" id="h-car"></span></div>'+
    '<div class="ctl wide"><span class="lbl">مسافر زمان پولش را کجاها می‌تواند بگذارد؟</span>'+
      '<div class="chips" id="c-assets">'+chips+'</div><span class="hint" id="h-assets"></span></div>'+
    '<div class="ctl"><span class="lbl">هزینهٔ هر خرید و فروش</span>'+
      '<div class="seg" id="c-fee"><button data-v="0">صفر</button><button data-v="1" class="on">معمولی</button><button data-v="2">دو برابر</button><button data-v="3">سه برابر</button></div>'+
      '<span class="hint" id="h-fee"></span></div>'+
    '<div class="ctl"><span class="lbl">قیمت خانه در دو سال اخیر</span>'+
      '<div class="seg" id="c-est"><button data-v="1" class="on">با تخمین</button><button data-v="0">فقط آمار رسمی</button></div>'+
      '<span class="hint">بانک مرکزی از شهریور ۱۴۰۳ قیمت خانه را اعلام نکرده است. «با تخمین» برای بعد از آن از آمار مرکز آمار و قیمت آگهی‌ها استفاده می‌کند. «فقط آمار رسمی» حساب را در مرداد ۱۴۰۳ تمام می‌کند.</span></div>'+
  '</div>'+
  '<div class="card chartcard"><h3 id="t1"></h3>'+
    '<p class="cap" id="cap1"></p><p class="cond" id="cond1"></p><div class="ytable" id="ch1"></div>'+
    '<p class="hint" id="hint1"></p></div>'+
  '<h2 class="sec" id="d-title"></h2><p class="sub" id="d-sub"></p>'+
  '<div class="pick"><span>سال تولد دیگری را ببین:</span><div class="cohorts" id="cohorts"></div></div>'+
  '<div class="story" id="tiles"></div>'+
  '<div class="card chartcard"><h3 id="t2"></h3>'+
    '<p class="cap" id="cap2"></p>'+
    '<div class="legend" id="leg2"></div><div class="chartbox" id="ch2"></div></div>'+
  '<div class="stories" id="stories"></div>'+
  '<div id="qnote"></div>'+
  '<h2 class="sec">داده‌ها را خودت ببین</h2>'+
  '<p class="sub">هر عدد این صفحه از یک منبع مشخص آمده است. یک سری را انتخاب کن تا ببینی از اول تا امروز چطور تغییر کرده است.</p>'+
  '<div class="card chartcard"><div class="ctl" style="max-width:420px"><label for="c-series">کدام قیمت؟</label><select id="c-series"></select></div>'+
    '<p class="cap" id="cap3"></p><div class="legend" id="leg3"></div><div class="chartbox" id="ch3"></div>'+
    '<label class="logbox"><input type="checkbox" id="c-log"> بزرگ‌نمایی سال‌های قدیم (هر خط افقی ده برابر خط پایینی)</label></div>'+
  '<h2 class="sec">منبع هر داده</h2><div class="card tblwrap" id="sources"></div>'+
  '<h2 class="sec">فرض‌های شبیه‌سازی</h2><ul class="assume" id="assume"></ul>';
}

function wire(){
  /* custom salary, typed in millions of tomans; Persian or Latin digits, ٬ or , as separators */
  var salT,salIn=$('#c-sal');
  function paintPresets(){Array.prototype.forEach.call($('#c-salp').children,function(b){b.setAttribute('aria-pressed',String(+b.getAttribute('data-v')*1e6===S.salary));});}
  /* "150", "۱۵۰", "1,500", "۲٬۵۰۰" (thousands), "12,5" / "۷۵٫۵" / "7.5" (decimal). Anything else is an error. */
  function parseMillions(text){
    var t=String(text).replace(/[‌-‏‪-‮⁦-⁩\s]/g,'')
      .replace(/[۰-۹]/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d);}).replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d);})
      .replace(/٬/g,'').replace(/٫/g,'.');
    if(t==='')return {err:'empty'};
    if(/^[+-]/.test(t))return {err:t[0]==='-'?'neg':'nan'};
    if(/^\d{1,3}([,.]\d{3})+$/.test(t)&&!(/,/.test(t)&&/\./.test(t)))t=t.replace(/[,.]/g,'');   /* 1,500 or 1.000.000 */
    else t=t.replace(',','.');                                                               /* 12,5 */
    if(!/^\d+(\.\d+)?$/.test(t))return {err:'nan'};
    return {v:Number(t)};
  }
  var lastGood=S.salary;
  function showErr(msg){$('#e-sal').textContent=msg;salIn.setAttribute('aria-invalid',msg?'true':'false');}
  function readSalary(){
    var r=parseMillions(salIn.value),v=r.v,err='';
    if(r.err==='neg')err='حقوق نمی‌تواند منفی باشد.';
    else if(r.err)err='یک عدد بنویس، مثلاً ۱۵۰ (یعنی ۱۵۰ میلیون تومان).';
    else if(v<1)err='حقوق باید دست‌کم ۱ میلیون تومان باشد.';
    else if(v>100000)err='بیشتر از ۱۰۰ هزار میلیون (۱۰۰ میلیارد) تومان را حساب نمی‌کنیم.';
    showErr(err);
    if(err)return false;
    S.salary=Math.round(v*1e6);lastGood=S.salary;paintPresets();update();return true;
  }
  salIn.addEventListener('input',function(){clearTimeout(salT);showErr('');salT=setTimeout(readSalary,350);});
  salIn.addEventListener('keydown',function(e){if(e.key==='Enter'){clearTimeout(salT);readSalary();}});
  /* leaving the field with a bad value puts back the last salary that was used */
  salIn.addEventListener('blur',function(){clearTimeout(salT);if(!readSalary()){salIn.value=trimNum(lastGood/1e6);showErr('');}});
  $('#c-salp').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var v=+b.getAttribute('data-v');
    clearTimeout(salT);salIn.value=fa(v);showErr('');S.salary=v*1e6;lastGood=S.salary;paintPresets();update();});
  $('#c-save').addEventListener('input',function(e){S.save=+e.target.value;update();});
  $('#c-area').addEventListener('input',function(e){S.area=+e.target.value;update();});
  $('#c-dist').addEventListener('change',function(e){S.district=+e.target.value;update();});
  $('#c-car').addEventListener('change',function(e){S.car=e.target.value;update();});
  $('#c-car').value=S.car;
  [['#c-index','index',function(v){return v;}],['#c-est','est',function(v){return v==='1';}],['#c-fee','fee',function(v){return +v;}]].forEach(function(x){
    $(x[0]).addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
      S[x[1]]=x[2](b.getAttribute('data-v'));
      Array.prototype.forEach.call($(x[0]).querySelectorAll('button'),function(z){z.className=z===b?'on':'';});update();});
  });
  $('#c-assets').addEventListener('click',function(e){var b=e.target.closest('.chip');if(!b)return;var k=b.getAttribute('data-asset');
    S.assets[k]=!S.assets[k];b.setAttribute('aria-pressed',S.assets[k]?'true':'false');update();});
  $('#c-series').innerHTML=DATASERIES.map(function(s,i){return '<option value="'+i+'">'+s.name+'</option>';}).join('');
  $('#c-series').addEventListener('change',drawData);
  $('#ch1').addEventListener('click',function(e){
    if(e.target.closest('.go')){e.preventDefault();$('#d-title').scrollIntoView({behavior:'smooth',block:'start'});return;}
    var tr=e.target.closest('tbody tr');if(tr)selectRow(+tr.getAttribute('data-j'));});
  $('#ch1').addEventListener('keydown',function(e){if(e.target.closest('.go'))return;var tr=e.target.closest('tbody tr');if(!tr)return;
    var j=+tr.getAttribute('data-j');
    if(e.key==='Enter'||e.key===' '){e.preventDefault();selectRow(j);}
    else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();var k=Math.max(0,Math.min(R.cohorts.length-1,j+(e.key==='ArrowDown'?1:-1)));
      selectRow(k);var nx=$('#ch1 tbody tr[data-j="'+k+'"]');if(nx)nx.focus();}});
  $('#c-log').addEventListener('change',drawData);
  var t,lastW=window.innerWidth;window.addEventListener('resize',function(){if(window.innerWidth===lastW)return;lastW=window.innerWidth;clearTimeout(t);t=setTimeout(render,150);});
  window.addEventListener('vb-theme',render);
  document.addEventListener('pointerdown',function(ev){Array.prototype.forEach.call(document.querySelectorAll('.chartbox'),function(b){if(b._hideTip&&!b.contains(ev.target))b._hideTip();});});
  try{var mq=matchMedia('(prefers-color-scheme:dark)');if(mq.addEventListener)mq.addEventListener('change',render);else if(mq.addListener)mq.addListener(render);}catch(e){}
}
var pending=null;
function update(){if(pending)return;pending=requestAnimationFrame(function(){pending=null;R=compute();render();});}

function cohortIndex(){for(var j=0;j<R.cohorts.length;j++)if(R.cohorts[j].born===S.cohort)return j;return R.cohorts.length-1;}
function render(){
  if(!R)return;
  var g=goal();
  /* the intro follows the controls */
  $('#lede-sal').textContent=money(S.salary);
  $('#lede-index').textContent=S.index==='cpi'?'هم‌پای گرانی':'هم‌پای حقوق کارگری';
  Array.prototype.forEach.call(document.querySelectorAll('.lede-goal'),function(e){e.textContent=g;});
  $('#v-save').textContent=fa(S.save)+'٪';
  $('#v-area').textContent=fa(S.area)+' متر';
  var w05=D.min_wage_1405,usdNow=P.usd[N-1];
  $('#h-sal').textContent='حداقل حقوق پایهٔ کارگری در ۱۴۰۵ ماهی '+money(w05)+' است. حقوق '+moneyShort(S.salary)+' تومانی یعنی حدود '+trimNum(S.salary/w05)+' برابر آن. با دلارِ '+mlabel(N-1)+' (هر دلار '+money(usdNow)+')، این حقوق ماهی حدود '+faN(S.salary/usdNow)+' دلار می‌شود.';
  $('#h-save').textContent='یعنی با حقوق ۱۴۰۵ ماهی '+money(S.salary*S.save/100)+' کنار می‌گذارد.'+(S.save<100?' بقیه خرج اجاره و زندگی می‌شود.':' یعنی همهٔ حقوق؛ این فقط برای مقایسه است.');
  var s90=R.sal[idx(1390,1)],s80=R.sal[idx(1380,1)];
  $('#h-index').textContent=(S.index==='cpi'?'یعنی حقوقش همیشه همان قدرت خرید امروز را داشت و فقط هم‌پای گرانی بالا رفت.':'یعنی همیشه همین چند برابرِ حداقل حقوق کارگری را می‌گرفت.')+' با این حساب حقوقش در ۱۳۸۰ ماهی '+money(s80)+' و در ۱۳۹۰ ماهی '+money(s90)+' بود.';
  var dsel=$('#c-dist');dsel.innerHTML=distOptions();dsel.value=String(S.district);
  var L=lastHouseIdx();
  $('#h-dist').textContent=L>=0?'یعنی خانهٔ '+fa(S.area)+' متری '+(S.district?'در این منطقه':'با قیمت میانگین تهران')+' در '+mlabel(L)+' حدود '+money(D.series.house[L]*S.area*houseRatio())+' می‌ارزید.'+(S.district?' قیمت هر منطقه از آمار بانک مرکزی (۱۳۹۶ تا ۱۴۰۳) نسبت به کل تهران حساب شده است.':''):'';
  if(S.car==='none')$('#h-car').textContent='فقط خانه حساب می‌شود.';
  else{var tm=L>=0?L:N-1,ca=carAt(S.car,tm),nm=carShort(carModelAt(S.car,tm));
    $('#h-car').textContent=(S.car==='cheap'?'تا ۱۳۸۹ پراید، تا ۱۴۰۱ پراید ۱۱۱ و بعد کوییک. ':S.car==='mid'?'تا ۱۴۰۱ پژو ۴۰۵ و بعد تارا. ':'')+(ca?(ca.f==='x'?nm+' در '+mlabel(tm)+' در بازار نیست؛ ماشینی با همان ارزش حدود '+money(ca.v)+' است. ':nm+' در '+mlabel(tm)+' حدود '+money(ca.v)+' است. '):'')+'در سال‌هایی که این مدل در بازار نبود، ماشینی با همان ارزش حساب می‌شود.';}
  $('#h-fee').textContent='وقتی دلار یا طلا یا سهام می‌خری و بعد می‌فروشی، کمی از پولت می‌رود: کارمزد صرافی، اجرت طلا، کارمزد کارگزاری. در حالت «معمولی»، برای هر ۱۰۰ میلیون خرید یا فروش، دلار ۱ میلیون، طلا ۲، سکه ۱٫۵، سهام ۰٫۶ و رمزارز ۱ میلیون هزینه دارد.';
  var anyOn=Object.keys(S.assets).some(function(k){return S.assets[k];});
  $('#h-assets').textContent=anyOn?'روی هر کدام بزنی، از دست مسافر زمان خارج می‌شود.':'هیچ‌کدام انتخاب نشده، پس مسافر زمان فقط پول نقد نگه می‌دارد و از بقیه هم عقب می‌ماند.';
  drawMain();drawDetail();drawData();
}
function legend(box,items){
  box.innerHTML=items.map(function(it){return '<span><i class="'+(it.cls||'')+'" style="--c:var('+it.col+')"></i>'+it.name+'</span>';}).join('');
}
function notYet(){return R.lastKnown<N-1?'تا '+mlabel(R.lastKnown)+' نه':'هنوز نه';}
function drawMain(){
  var co=R.cohorts,g=goal(),L=R.lastKnown,sel=cohortIndex();
  $('#t1').textContent='چند سال طول می‌کشید تا '+g+' بخرد؟';
  $('#cap1').textContent='هر ردیف یک سال تولد است. در هر خانه نوشته آن نفر چند سال بعد از بیست‌سالگی توانست '+g+' بخرد. هر چه میله کوتاه‌تر، زودتر خریده.';
  $('#cond1').textContent='خانهٔ '+fa(S.area)+' متری '+(S.district?'در منطقهٔ '+fa(S.district):'با قیمت میانگین تهران')+(S.car==='none'?'، بدون ماشین':'، با '+carShort(S.car))+'. حقوق در ۱۴۰۵: '+money(S.salary)+'. پس‌انداز: '+fa(S.save)+'٪ حقوق.';
  $('#hint1').textContent='خانه‌های راه‌راه یعنی آن نفر '+(L<N-1?'تا '+mlabel(L)+'، آخرین آمار رسمی قیمت خانه،':'تا امروز')+' نتوانسته بخرد؛ کنارش نوشته چند درصد پول را دارد. روی هر ردیف بزن تا داستانش را پایین‌تر بخوانی.';
  var maxY=0;STRATS.forEach(function(st){co.forEach(function(c,j){var h=R.hit[st.k][j];if(h>=0)maxY=Math.max(maxY,(h-c.s+1)/12);});});
  if(!maxY)maxY=1;
  var h='<table class="ytbl"><thead><tr><th class="yb">متولد</th>'+STRATS.map(function(st){return '<th><i style="--c:var('+st.col+')"></i>'+st.name+'</th>';}).join('')+'</tr></thead><tbody>';
  co.forEach(function(c,j){
    var on=j===sel;
    h+='<tr data-j="'+j+'" tabindex="'+(on?0:-1)+'" class="'+(on?'on':'')+'"'+(on?' aria-current="true"':'')+'><th class="yb" scope="row">'+fa(c.born)+'<a class="go" href="#d-title"'+(on?'':' tabindex="-1"')+'>داستان پایین‌تر</a></th>';
    STRATS.forEach(function(st){var t=R.hit[st.k][j],cell;
      if(t>=0){var y=(t-c.s+1)/12;
        cell='<div class="cell" style="--c:var('+st.col+')"><span class="t">'+yearsCell(t-c.s+1)+'</span><span class="bar" style="width:'+Math.max(4,y/maxY*100).toFixed(1)+'%"></span></div>';}
      else if(L<c.s)cell='<div class="cell na"><span class="t">آمار نیست</span></div>';
      else cell='<div class="cell no" style="--c:var('+st.col+')"><span class="t">'+(L<N-1?'تا '+MONTHS[ym(L)[1]-1]+' '+fa(ym(L)[0])+' نه':'هنوز نه')+'</span><span class="p">'+fa(pctOf(R.W[st.k][j][L],R.tgt[L]))+'٪ پول را دارد</span><span class="bar"></span></div>';
      h+='<td>'+cell+'</td>';});
    h+='</tr>';});
  var fj=document.activeElement&&document.activeElement.closest?document.activeElement.closest('#ch1 tbody tr'):null;
  fj=fj?fj.getAttribute('data-j'):null;
  $('#ch1').innerHTML=h+'</tbody></table>';
  if(fj!=null){var back=$('#ch1 tbody tr[data-j="'+fj+'"]');if(back)back.focus({preventScroll:true});}
}
/* «۵ سال و ۳ ماه» that breaks only between the two parts on a narrow screen */
function yearsCell(m){
  var y=Math.floor(m/12),mo=m%12,nb=function(x){return '<span class="nw">'+x+'</span>';};
  if(y===0)return nb(fa(mo)+' ماه');
  if(mo===0)return nb(fa(y)+' سال');
  return nb(fa(y)+' سال')+' '+nb('و '+fa(mo)+' ماه');
}
function selectRow(j){
  S.cohort=R.cohorts[j].born;
  Array.prototype.forEach.call(document.querySelectorAll('#ch1 tbody tr'),function(tr){
    var on=+tr.getAttribute('data-j')===j;tr.className=on?'on':'';tr.tabIndex=on?0:-1;
    if(on)tr.setAttribute('aria-current','true');else tr.removeAttribute('aria-current');
    var go=tr.querySelector('.go');if(on)go.removeAttribute('tabindex');else go.setAttribute('tabindex','-1');});
  drawDetail();
}

/* the four stories */
function storyTrav(j,c,T,hit){
  var rp=replay(c,T),comp=rp.comp,runs=[];
  comp.forEach(function(e){if(e.final)return;var l=runs[runs.length-1];if(l&&l.a===e.dom)l.k1=e.k+1;else runs.push({a:e.dom,k0:e.k,k1:e.k+1});});
  runs.forEach(function(r){var p=P[ASSETS[r.a].k];r.g=p[r.k1]/p[r.k0];});
  var big=runs.filter(function(r){return r.a!==0&&r.g>=1.03;}).sort(function(a,b){return b.g-a.g;}).slice(0,5).sort(function(a,b){return a.k0-b.k0;});
  var invested=runs.some(function(r){return r.a!==0;});
  var saved=0;for(var k=c.s;k<=T;k++){var x=R.sal[k];if(x===x)saved+=x*S.save/100;}
  var W=R.W.trav[j][T];
  if(!invested)return '<p>این بار مسافر زمان هیچ جایی برای گذاشتن پول نداشت (همهٔ گزینه‌ها بالا خاموش است)، پس فقط پول نقد نگه داشت. خودش روی هم '+money(saved)+' کنار گذاشت و در '+mlabel(T)+' همین قدر پول داشت.</p>';
  var h='<p>مسافر زمان از قبل می‌دانست هر چیزی کِی گران و کِی ارزان می‌شود. پس پولش را هر بار جایی گذاشت که قرار بود بیشتر از همه بالا برود و پیش از افت، آن را فروخت.</p>';
  if(big.length){
    h+='<p class="mini">مهم‌ترین حرکت‌هایش:</p><ol>'+big.map(function(r){var nm=ASSETS[r.a].name;
      return '<li>از <b>'+mlabel(r.k0)+'</b> تا '+mlabel(r.k1)+' پولش را در '+nm+' گذاشت. در این مدت '+(ASSETS[r.a].k==='dep'?growWords(r.g,'dep'):nm+' '+growWords(r.g))+'.</li>';}).join('')+'</ol>';
    if(runs.length-1>big.length)h+='<p class="mini">روی هم '+fa(runs.length-1)+' بار پولش را جابه‌جا کرد. بقیهٔ جابه‌جایی‌ها سود کمتری داشتند.</p>';
  }
  var tot=Math.max(1,comp.length-1),strip=runs.map(function(r){return '<div title="'+ASSETS[r.a].name+'" style="width:'+((r.k1-r.k0)/tot*100)+'%;background:var('+ASSETS[r.a].col+')"></div>';}).join('');
  var used={};runs.forEach(function(r){used[r.a]=1;});
  h+='<p class="mini">هر رنگ یعنی آن ماه بیشتر پولش کجا بود، از '+mlabel(c.s)+' (چپ) تا '+mlabel(T)+' (راست):</p><div class="strip">'+strip+'</div><div class="legend">'+
    Object.keys(used).map(function(a){return '<span><i class="dot" style="--c:var('+ASSETS[a].col+')"></i>'+ASSETS[a].name+'</span>';}).join('')+'</div>';
  h+='<p>خودش روی هم '+money(saved)+' از حقوقش کنار گذاشت. با این خرید و فروش‌ها، در '+mlabel(T)+' دارایی‌اش به <b>'+money(W)+'</b> رسید؛ یعنی هر تومانی که کنار گذاشته بود به‌طور میانگین '+trimNum(W/saved)+' تومان شد.</p>';
  return h;
}
function storySaver(st,j,c,T){
  var a=st.k,ai=a==='usd'?2:a==='gold'?3:1,cc=Math.min(0.4,ASSETS[ai].c*S.fee),p=P[a],units=0,saved=0;
  for(var k=c.s;k<=T;k++){var x=R.sal[k];if(x!==x)continue;saved+=x*S.save/100;if(k<T)units+=x*S.save/100*(1-cc)/p[k];}
  var W=R.W[a][j][T];
  if(a==='usd')return '<p>هر ماه با پس‌اندازش دلار خرید و نگه داشت. تا '+mlabel(T)+' روی هم <b>'+faN(units)+' دلار</b> جمع کرد و برایش '+money(saved)+' داده بود. آن ماه هر دلار '+faN(p[T])+' تومان بود. پس بعد از کارمزد فروش، کل پولش <b>'+money(W)+'</b> می‌شد.</p>';
  if(a==='gold')return '<p>هر ماه با پس‌اندازش طلا خرید (به قیمت جهانی طلای ۱۸ عیار) و نگه داشت. تا '+mlabel(T)+' روی هم <b>'+faN(units)+' گرم طلا</b> جمع کرد و برایش '+money(saved)+' داده بود. آن ماه هر گرم '+faN(p[T])+' تومان بود. پس بعد از کارمزد فروش، کل پولش <b>'+money(W)+'</b> می‌شد.</p>';
  var lo=1e9,hi=0;for(var k2=c.s;k2<=T;k2++){var r=D.series.dep[k2];if(r!=null){lo=Math.min(lo,r);hi=Math.max(hi,r);}}
  return '<p>هر ماه پس‌اندازش را در سپردهٔ بانکی گذاشت. سود سالانهٔ بانک در این سال‌ها '+(lo===hi?fa(trimNum(lo))+'٪':'بین '+trimNum(lo)+'٪ و '+trimNum(hi)+'٪')+' بود. خودش '+money(saved)+' گذاشت و با سود، در '+mlabel(T)+' پولش به <b>'+money(W)+'</b> رسید.</p>';
}
function drawDetail(){
  var j=cohortIndex(),c=R.cohorts[j],g=goal();S.cohort=c.born;
  var hadFocus=document.activeElement&&document.activeElement.classList&&document.activeElement.classList.contains('cohort');
  $('#cohorts').innerHTML=R.cohorts.map(function(x){return '<button class="cohort'+(x.born===c.born?' on':'')+'" data-b="'+x.born+'">'+fa(x.born)+'</button>';}).join('');
  $('#cohorts').onclick=function(e){var b=e.target.closest('.cohort');if(!b)return;S.cohort=+b.getAttribute('data-b');selectRow(cohortIndex());};
  var on=$('#cohorts .on'),pc=$('#cohorts');
  if(on&&hadFocus)on.focus({preventScroll:true});
  if(on){var r1=on.getBoundingClientRect(),r2=pc.getBoundingClientRect();
    if(!drawDetail.once||r1.left<r2.left||r1.right>r2.right){pc.scrollLeft+=(r1.left+r1.width/2)-(r2.left+r2.width/2);drawDetail.once=1;}}
  $('#d-title').textContent='داستان متولد '+fa(c.born);
  var sal0=R.sal[c.s];
  $('#d-sub').textContent='در فروردین '+fa(c.born+20)+' بیست ساله شد. اولین حقوقش ماهی '+money(sal0)+' بود و '+saveWords()+' ('+money(sal0*S.save/100)+') را کنار می‌گذاشت. چهار نفر با همین حقوق را کنار هم ببین: یکی مسافر زمان است و سه نفر آدم معمولی.';
  var hits=STRATS.map(function(st){return R.hit[st.k][j];}),L=R.lastKnown;
  $('#tiles').innerHTML=STRATS.map(function(st,si){var t=hits[si];
    var v=t>=0?years(t-c.s+1):notYet(),d,need='';
    if(t>=0){d='در '+mlabel(t)+'، حدود '+fa(20+Math.floor((t-c.s)/12))+' سالگی';need='پول لازم آن ماه: '+money(needParts(t).total);}
    else if(L<c.s){v='—';d='آمار رسمی خانه برای این سال‌ها نیست';}
    else{d=(L<N-1?'در '+mlabel(L)+'، ':'امروز ')+fa(pctOf(R.W[st.k][j][L],R.tgt[L]))+'٪ پول '+g+' را '+(L<N-1?'داشت':'دارد');need='پول لازم: '+money(needParts(L).total);}
    return '<div class="tile"><div class="k"><i style="--c:var('+st.col+')"></i>'+st.name+'</div><div class="v">'+v+'</div><div class="d">'+d+'</div>'+(need?'<div class="d need">'+need+'</div>':'')+'</div>';}).join('');
  var noData=L<c.s;
  $('#ch2').parentNode.style.display=noData?'none':'';
  if(noData){$('#stories').innerHTML='<div class="note">آمار رسمی قیمت خانه تا مرداد ۱۴۰۳ است و این نفر بعد از آن بیست ساله شد. برای دیدن داستانش، بالا «با تخمین» را انتخاب کن.</div>';$('#qnote').innerHTML='';return;}
  /* progress chart: share of the price saved, 0-100%, each line stops on the day it buys */
  var lastHit=hits.indexOf(-1)>=0?L:Math.max.apply(null,hits);
  var end=Math.min(N-1,Math.max(c.s+11,lastHit+12)),start=c.s,n=end-start+1,ser=[];
  STRATS.forEach(function(st,si){var v=[];for(var i=0;i<n;i++){var t=start+i,w=R.W[st.k][j][t],tg=R.tgt[t];
      if((hits[si]>=0&&t>hits[si])||tg!==tg||w!==w){v.push(null);continue;}
      v.push(Math.min(100,w/tg*100));}
    ser.push({key:st.k,color:css(st.col),values:v,width:st.k==='trav'?2.6:2,dots:hits[si]>=0?[hits[si]-start]:[]});});
  $('#t2').textContent='هر کدام چند درصد از پول '+g+' را جمع کرده بودند؟';
  $('#cap2').textContent='همه از صفر شروع می‌کنند. هر خطی که زودتر به خط بالا (۱۰۰٪) برسد، آن نفر زودتر خریده و خطش همان‌جا تمام می‌شود. قیمت '+g+' هم مدام بالا می‌رود، برای همین خط‌ها گاهی پایین می‌آیند.';
  legend($('#leg2'),STRATS.map(function(s){return {col:s.col,name:s.name};}));
  var narrow=$('#ch2').clientWidth<520,mstep=narrow?6:3,step=n<=80?12:n<=200?(narrow?60:36):(narrow?120:60),xt=[];
  for(var i2=0;i2<n;i2++){var mm=ym(start+i2);if(n<=30?(i2%mstep===0):(mm[1]===1&&((mm[0]-ym(start)[0])*12)%step===0))xt.push(i2);}
  chart($('#ch2'),{n:n,height:narrow?280:300,series:ser,yMin:100,bands:[{v:100,label:'پول کامل شد'}],
    yTitle:'درصدِ پول جمع‌شده',label:'درصد پول جمع‌شده برای خرید',
    yFmt:function(v){return fa(v)+'٪';},xTicks:xt,
    xLabel:function(i){var a=ym(start+i);return n<=30?MONTHS[a[1]-1]+' '+fa(a[0]):fa(a[0]);},
    tip:function(i){var t=start+i,h='<b>'+mlabel(t)+'</b>';
      STRATS.forEach(function(st,si){var w=R.W[st.k][j][t],tg=R.tgt[t],txt;
        if(hits[si]>=0&&t>hits[si])txt='خریده ✓';else txt=tg===tg&&w===w?fa(Math.min(999,pctOf(w,tg)))+'٪':'—';
        h+='<div class="r"><i style="--c:var('+st.col+')"></i><span>'+st.name+'</span><b>'+txt+'</b></div>';});
      if(R.tgt[t]===R.tgt[t])h+='<div class="muted">قیمت '+g+' در این ماه: '+money(R.tgt[t])+'</div>';
      return h;}});
  /* stories */
  $('#stories').innerHTML=STRATS.map(function(st,si){
    var t=hits[si],T=t>=0?t:L;
    if(T<c.s)return '';
    var body=st.k==='trav'?storyTrav(j,c,T,t>=0):storySaver(st,j,c,T);
    var past=L<N-1;
    var endTxt=t>=0?'<p class="ok">همان ماه '+g+' را خرید: '+needWords(t)+'.</p>':
      '<p class="no">ولی در '+mlabel(T)+'، '+g+' روی هم '+money(needParts(T).total)+' می‌ارزید'+(S.car==='none'?'':' ('+needWords(T,true)+')')+'. پس '+(past?'تا آن ماه':'هنوز')+' فقط '+fa(pctOf(R.W[st.k][j][T],R.tgt[T]))+'٪ پولش را '+(past?'داشت':'دارد')+'.</p>';
    return '<div class="scard" style="--c:var('+st.col+')"><h4><i></i>'+st.name+' — '+(t>=0?years(t-c.s+1):notYet())+'</h4>'+body+endTxt+'</div>';}).join('');
  qualityNote(j,hits);
}
function qualityNote(j,hits){
  var bits=[],t=hits[0],c=R.cohorts[j];
  function fl(arr,i){return arr&&arr[i];}
  if(t>=0){
    var hf=fl(D.series.house_f,t);
    if(hf==='e')bits.push('قیمت خانه در '+mlabel(t)+' تخمینی است، چون بانک مرکزی بعد از مرداد ۱۴۰۳ آماری نداده است.');
    if(hf==='i')bits.push('قیمت خانه در '+mlabel(t)+' بین دو عدد واقعی حدس زده شده است.');
    if(S.car!=='none'){var ca=carAt(S.car,t);
      if(ca&&ca.f==='i')bits.push('قیمت ماشین در '+mlabel(t)+' بین دو سالی که قیمت دارند حدس زده شده است.');
      if(ca&&ca.f==='f')bits.push('قیمت ماشین در '+mlabel(t)+' قیمت کارخانه است، نه بازار.');
      if(ca&&ca.f==='x')bits.push(carShort(carModelAt(S.car,t))+' در '+mlabel(t)+' در بازار نبود. برای همین قیمت ماشینی با همان ارزش حساب شده است.');}
  }
  var annual=0;for(var k=c.s;k<=(t>=0?t:R.lastKnown);k++)if(D.series.usd_f[k]!=='o')annual++;
  if(annual>12&&S.assets.usd)bits.push('برای '+fa(Math.round(annual/12))+' سال از این دوره فقط قیمت سالانهٔ دلار را داریم. پس مسافر زمان بالا و پایین‌های داخل سال را نمی‌بیند و در واقعیت می‌توانست زودتر بخرد.');
  $('#qnote').innerHTML=bits.length?'<div class="note"><b>این نتیجه چقدر دقیق است؟</b> '+bits.join(' ')+'</div>':'';
}

/* ---------- data explorer ---------- */
var DATASERIES=[
  {k:'usd',name:'قیمت دلار در بازار آزاد'},
  {k:'gold',name:'قیمت یک گرم طلای ۱۸ عیار (قیمت جهانی)'},
  {k:'coin',name:'قیمت سکهٔ امامی'},
  {k:'house',name:'قیمت هر متر خانه در تهران'},
  {k:'wage',name:'حداقل حقوق پایهٔ کارگری (ماهانه)'},
  {k:'car',name:'قیمت ماشینی که بالا انتخاب کرده‌ای'},
  {k:'btc',name:'قیمت بیت‌کوین'},
  {k:'eth',name:'قیمت اتریوم'},
  {k:'tedpix',name:'شاخص کل بورس تهران',idx:true},
  {k:'cpi',name:'شاخص تورم (۱۴۰۰ = ۱۰۰)',idx:true},
  {k:'dep',name:'سود سالانهٔ سپردهٔ بانکی',pct:true}
];
var QSTYLE={o:['عدد ماهانهٔ منبع',''],f:['عدد سالانه یا فصلی','ldash'],i:['حدس بین دو عدد واقعی','dash'],e:['تخمین','dott']};
function drawData(){
  var s=DATASERIES[+$('#c-series').value||0],vals=[],st=[],logOn=$('#c-log').checked;
  $('.logbox').style.display=s.pct?'none':'';
  if(s.k==='car'){
    var key=S.car==='none'?'cheap':S.car;
    for(var i=0;i<N;i++){var ca=carAt(key,i);vals.push(ca?ca.v:null);st.push(ca?(ca.f==='x'?'e':ca.f==='a'?'f':ca.f):null);}
  }else{
    vals=D.series[s.k].slice();st=(D.series[s.k+'_f']||[]).map(function(f){return f==='a'?'f':f;});
  }
  var have=vals.map(function(v,i){return v!=null?i:-1;}).filter(function(i){return i>=0;});
  var fmtV=s.pct?function(v){return trimNum(v)+'٪';}:s.idx?function(v){return moneyShort(v);}:function(v){return money(v);};
  var cap='';
  if(have.length){var a=have[0],b=have[have.length-1];
    cap=(s.k==='car'?carName(S.car==='none'?'cheap':S.car)+'. ':'')+'در '+mlabel(a)+': '+fmtV(vals[a])+' · در '+mlabel(b)+': '+fmtV(vals[b])+(s.pct?'':' · یعنی حدود '+(vals[b]/vals[a]>=1000?moneyShort(vals[b]/vals[a]):vals[b]/vals[a]>=10?fa(Math.round(vals[b]/vals[a])):trimNum(vals[b]/vals[a]))+' برابر.');}
  $('#cap3').textContent=cap;
  var seen={};st.forEach(function(f,i){if(vals[i]!=null&&f)seen[f==='a'?'f':f]=1;});
  $('#leg3').innerHTML=Object.keys(QSTYLE).filter(function(f){return seen[f];}).map(function(f){return '<span><i class="'+QSTYLE[f][1]+'" style="--c:var(--s1)"></i>'+QSTYLE[f][0]+'</span>';}).join('');
  var narrow=$('#ch3').clientWidth<520,xt=[];for(var k=0;k<N;k++)if(ym(k)[1]===1&&ym(k)[0]%(narrow?10:5)===0)xt.push(k);
  chart($('#ch3'),{n:N,height:narrow?260:280,ml:s.pct?44:62,series:[{key:s.k,color:css('--s1'),values:vals,style:st}],yLog:logOn&&!s.pct,
    yFmt:s.pct?function(v){return fa(v)+'٪';}:moneyShort,yTitle:s.pct?'درصد':s.idx?'':'تومان',
    xTicks:xt,xLabel:function(i){return fa(ym(i)[0]);},label:s.name,
    tip:function(i){var v=vals[i];if(v==null)return '';var q=(QSTYLE[st[i]==='a'?'f':st[i]]||[''])[0];
      return '<b>'+mlabel(i)+'</b><div>'+fmtV(v)+'</div><div class="muted">'+q+'</div>';}});
}

function sourcesHTML(){
  var rows=(D.sources||[]).map(function(s){
    return '<tr><td><b>'+esc(s.series)+'</b></td><td class="per">'+esc(s.period)+'</td><td>'+s.html+'</td><td><span class="conf">'+esc(s.conf)+'</span></td></tr>';}).join('');
  return '<table class="src"><thead><tr><th>داده</th><th>دوره</th><th>منبع</th><th>اعتماد</th></tr></thead><tbody>'+rows+'</tbody></table>';
}
function assumeHTML(){
  return (D.assumptions||[]).map(function(a){return '<li>'+a+'</li>';}).join('');
}

/* ---------- boot ---------- */
fetch('/hobby/data/time-traveler/data.json?v=1').then(function(r){return r.json();}).then(function(d){
  D=d;prep();CPIY=yearAvg(D.series.cpi);WAGEY=yearAvg(D.series.wage);
  for(var i=idx(1405,1);i<N;i++)if(D.series.cpi[i]!=null)CPI_MONTHS_1405++;
  $('#app').innerHTML=controlsHTML();
  $('#sources').innerHTML=sourcesHTML();$('#assume').innerHTML=assumeHTML();
  wire();R=compute();render();
  window.TT={S:S,compute:compute,replay:replay,D:D};
}).catch(function(e){$('#app').innerHTML='<div class="card loading">داده‌ها بارگذاری نشد. صفحه را دوباره باز کن.</div>';if(window.console)console.error(e);});
})();
