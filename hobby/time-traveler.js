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
  ['cheap','ارزان‌ترین ماشین هر سال (پراید، بعد پراید ۱۱۱، بعد کوییک)'],
  ['mid','ماشین متوسط هر سال (پژو ۴۰۵، بعد تارا)'],
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
  var W=Math.max(320,box.clientWidth||700),Hh=opts.height||300,m={l:58,r:12,t:12,b:30};
  if(W<480)m.l=50;
  var svg=el('svg',{viewBox:'0 0 '+W+' '+Hh,role:'img','aria-label':opts.label||''},box);
  svg.style.direction='ltr';
  var iw=W-m.l-m.r,ih=Hh-m.t-m.b,n=opts.n;
  var all=[];opts.series.forEach(function(s){s.values.forEach(function(v){if(v!=null&&isFinite(v)&&(!opts.yLog||v>0)&&!(opts.yMax&&v>opts.yMax))all.push(v);});});
  if(!all.length)return;
  var lo=Math.min.apply(null,all),hi=Math.max.apply(null,all),ys,ticks;
  if(opts.yLog){lo=lo/1.3;hi=hi*1.3;var L0=Math.log10(lo),L1=Math.log10(hi);ys=function(v){return m.t+ih-(Math.log10(v)-L0)/(L1-L0)*ih;};ticks=logTicks(lo,hi);}
  else{ticks=niceLin(Math.max(hi,opts.yMin||0));var top=ticks[ticks.length-1];ys=function(v){return m.t+ih-v/top*ih;};}
  var xs=function(i){return m.l+(n<=1?iw/2:i/(n-1)*iw);};
  var g=el('g',{},svg);
  ticks.forEach(function(t){var y=ys(t);el('line',{x1:m.l,x2:W-m.r,y1:y,y2:y,stroke:css('--grid'),'stroke-width':1},g);
    var tx=el('text',{x:m.l-6,y:y+3.5,'text-anchor':'end'},g);tx.textContent=opts.yFmt(t);});
  (opts.xTicks||[]).forEach(function(i){var x=xs(i);el('line',{x1:x,x2:x,y1:m.t+ih,y2:m.t+ih+4,stroke:css('--axis')},g);
    var tx=el('text',{x:x,y:Hh-10,'text-anchor':'middle'},g);tx.textContent=opts.xLabel(i);});
  el('line',{x1:m.l,x2:W-m.r,y1:m.t+ih,y2:m.t+ih,stroke:css('--axis'),'stroke-width':1},g);
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
      if(open){var cy=ys(v2);el('path',{d:'M'+(xs(i2)-3)+' '+(cy-7)+'L'+xs(i2)+' '+(cy-11)+'L'+(xs(i2)+3)+' '+(cy-7),fill:'none',stroke:col,'stroke-width':1.5},svg);}
    }}
    if(s.dots){s.dots.forEach(function(i3){var v3=s.values[i3];if(v3==null)return;el('circle',{cx:xs(i3),cy:ys(v3),r:4.5,fill:col,stroke:css('--card'),'stroke-width':2},svg);});}
  });
  (opts.marks||[]).forEach(function(mk){var x=xs(mk.i);el('line',{x1:x,x2:x,y1:m.t,y2:m.t+ih,stroke:css('--axis'),'stroke-width':1,'stroke-dasharray':'2 3'},svg);});
  /* hover layer */
  var cross=el('line',{x1:0,x2:0,y1:m.t,y2:m.t+ih,stroke:css('--axis'),'stroke-width':1,visibility:'hidden'},svg);
  var hit=el('rect',{x:m.l,y:m.t,width:iw,height:ih,fill:'transparent',style:'cursor:'+(opts.onClick?'pointer':'crosshair')},svg);
  var tip=document.createElement('div');tip.className='tip';box.appendChild(tip);
  function at(ev){var r=svg.getBoundingClientRect(),x=(ev.clientX-r.left)*W/r.width;var i=Math.round((x-m.l)/iw*(n-1));return Math.max(0,Math.min(n-1,i));}
  function show(ev){var i=at(ev),html=opts.tip(i);if(!html){tip.style.display='none';cross.setAttribute('visibility','hidden');return;}
    cross.setAttribute('x1',xs(i));cross.setAttribute('x2',xs(i));cross.setAttribute('visibility','visible');
    tip.innerHTML=html;tip.style.display='block';
    var r=box.getBoundingClientRect(),px=ev.clientX-r.left,py=ev.clientY-r.top,tw=tip.offsetWidth,th=tip.offsetHeight;
    var left=px+14;if(left+tw>r.width)left=px-tw-14;if(left<0)left=Math.max(0,r.width-tw);
    var tp=py-th-10;if(tp<0)tp=py+16;
    tip.style.left=left+'px';tip.style.top=tp+'px';}
  hit.addEventListener('pointermove',show);
  hit.addEventListener('pointerdown',function(ev){show(ev);if(opts.onClick&&ev.pointerType==='mouse')opts.onClick(at(ev));});
  hit.addEventListener('click',function(ev){if(opts.onClick)opts.onClick(at(ev));});
  hit.addEventListener('pointerleave',function(){tip.style.display='none';cross.setAttribute('visibility','hidden');});
}

/* ---------- UI ---------- */
var R=null;
function controlsHTML(){
  var dist='<option value="0">میانگین کل تهران</option>';
  for(var d=1;d<=22;d++){if(D.district_ratio[d])dist+='<option value="'+d+'">منطقهٔ '+fa(d)+' (حدود '+trimNum(D.district_ratio[d][0])+' برابر میانگین)</option>';}
  var cars=CARS.map(function(c){var m=D.cars[c[0]],yr=m?' — '+fa(m.years[0])+' تا '+fa(m.years[1]):'';
    if(c[0]!=='none'&&c[0]!=='cheap'&&c[0]!=='mid'&&!m)return '';
    return '<option value="'+c[0]+'">'+esc(c[1])+yr+'</option>';}).join('');
  var chips=ASSETS.filter(function(a){return !a.fixed;}).map(function(a){
    return '<button class="chip" data-asset="'+a.k+'" aria-pressed="true" style="--c:var('+a.col+')"><span class="sw"></span>'+a.name+'</button>';}).join('');
  return ''+
  '<div class="card controls" id="controls">'+
    '<div class="ctl"><label for="c-sal">حقوق ماهانه در ۱۴۰۵</label>'+
      '<select id="c-sal"><option value="50000000">۵۰ میلیون تومان</option><option value="100000000">۱۰۰ میلیون تومان</option><option value="200000000" selected>۲۰۰ میلیون تومان</option><option value="300000000">۳۰۰ میلیون تومان</option><option value="500000000">۵۰۰ میلیون تومان</option></select>'+
      '<span class="hint" id="h-sal"></span></div>'+
    '<div class="ctl"><label for="c-save">چه سهمی از حقوق پس‌انداز می‌شود؟ <span class="val" id="v-save"></span></label>'+
      '<input type="range" id="c-save" min="10" max="100" step="5" value="50"><span class="hint">بقیهٔ حقوق خرج زندگی می‌شود.</span></div>'+
    '<div class="ctl"><span class="lbl">حقوق در سال‌های قبل با چه چیزی بالا می‌رفت؟</span>'+
      '<div class="seg" id="c-index"><button data-v="cpi" class="on">تورم</button><button data-v="wage">حداقل دستمزد پایه</button></div>'+
      '<span class="hint" id="h-index"></span></div>'+
    '<div class="ctl"><label for="c-area">متراژ خانه: <span class="val" id="v-area"></span></label>'+
      '<input type="range" id="c-area" min="40" max="200" step="5" value="75"><span class="hint">میانهٔ واحدهای معامله‌شده در تهران حدود ۷۵ متر است.</span></div>'+
    '<div class="ctl"><label for="c-dist">محلهٔ خانه</label><select id="c-dist">'+dist+'</select>'+
      '<span class="hint">قیمت هر منطقه به نسبت میانگین تهران در سال‌های ۱۳۹۶ تا ۱۴۰۳ حساب شده است.</span></div>'+
    '<div class="ctl"><label for="c-car">ماشین</label><select id="c-car">'+cars+'</select>'+
      '<span class="hint">در سال‌هایی که یک مدل تولید نمی‌شد، ماشینی با همان قیمت واقعی (تعدیل‌شده با تورم) حساب می‌شود.</span></div>'+
    '<div class="ctl wide"><span class="lbl">مسافر زمان از قیمت کدام‌ها خبر دارد و با کدام‌ها معامله می‌کند؟</span>'+
      '<div class="chips" id="c-assets">'+chips+'</div><span class="hint" id="h-assets"></span></div>'+
    '<div class="ctl"><label for="c-fee">کارمزد و اختلاف قیمت خرید و فروش: <span class="val" id="v-fee"></span></label>'+
      '<input type="range" id="c-fee" min="0" max="3" step="0.5" value="1"><span class="hint">۱ یعنی تخمین معمولی: دلار ۱٪، طلا ۲٪، سکه ۱٫۵٪، بورس ۰٫۶٪، رمزارز ۱٪ در هر خرید یا فروش.</span></div>'+
    '<div class="ctl"><span class="lbl">قیمت خانه بعد از مرداد ۱۴۰۳</span>'+
      '<div class="seg" id="c-est"><button data-v="1" class="on">با برآورد</button><button data-v="0">فقط دادهٔ رسمی</button></div>'+
      '<span class="hint">بانک مرکزی از شهریور ۱۴۰۳ گزارش قیمت مسکن تهران را منتشر نکرده است.</span></div>'+
  '</div>'+
  '<div class="card chartcard"><h3>چند سال بعد از بیست‌سالگی خانه و ماشین می‌خرید؟</h3>'+
    '<p class="cap" id="cap1"></p><div class="legend" id="leg1"></div><div class="chartbox" id="ch1"></div>'+
    '<p class="hint" id="hint1"></p></div>'+
  '<h2 class="sec" id="d-title"></h2><p class="sub" id="d-sub"></p>'+
  '<div class="cohorts" id="cohorts"></div>'+
  '<div class="story" id="tiles"></div>'+
  '<div class="card chartcard"><h3>بیشترین پولی که هر ماه می‌شد نقد کرد، در برابر قیمت خانه و ماشین</h3>'+
    '<p class="cap" id="cap2"></p>'+
    '<div class="legend" id="leg2"></div><div class="chartbox" id="ch2"></div>'+
    '<div class="trades" id="trades"></div></div>'+
  '<div id="qnote"></div>'+
  '<h2 class="sec">داده‌ها را خودت ببین</h2>'+
  '<p class="sub">هر عدد این صفحه از یک منبع مشخص آمده است. خط پر یعنی عدد ماهانهٔ منبع، خط‌چین بلند یعنی عدد سالانه یا فصلی که بین ماه‌ها پخش شده، خط‌چین کوتاه یعنی درون‌یابی بین دو عدد واقعی و نقطه‌چین یعنی برآورد از یک سری ضعیف‌تر.</p>'+
  '<div class="card chartcard"><div class="ctl" style="max-width:360px"><label for="c-series">کدام سری؟</label><select id="c-series"></select></div>'+
    '<p class="cap" id="cap3"></p><div class="chartbox" id="ch3"></div></div>'+
  '<h2 class="sec">منبع هر داده</h2><div class="card tblwrap" id="sources"></div>'+
  '<h2 class="sec">فرض‌های شبیه‌سازی</h2><ul class="assume" id="assume"></ul>';
}

function wire(){
  $('#c-sal').addEventListener('change',function(e){S.salary=+e.target.value;update();});
  $('#c-save').addEventListener('input',function(e){S.save=+e.target.value;update();});
  $('#c-area').addEventListener('input',function(e){S.area=+e.target.value;update();});
  $('#c-dist').addEventListener('change',function(e){S.district=+e.target.value;update();});
  $('#c-car').addEventListener('change',function(e){S.car=e.target.value;update();});
  $('#c-fee').addEventListener('input',function(e){S.fee=+e.target.value;update();});
  $('#c-car').value=S.car;
  [['#c-index','index',function(v){return v;}],['#c-est','est',function(v){return v==='1';}]].forEach(function(x){
    $(x[0]).addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
      S[x[1]]=x[2](b.getAttribute('data-v'));
      Array.prototype.forEach.call($(x[0]).querySelectorAll('button'),function(z){z.className=z===b?'on':'';});update();});
  });
  $('#c-assets').addEventListener('click',function(e){var b=e.target.closest('.chip');if(!b)return;var k=b.getAttribute('data-asset');
    S.assets[k]=!S.assets[k];b.setAttribute('aria-pressed',S.assets[k]?'true':'false');update();});
  $('#c-series').innerHTML=DATASERIES.map(function(s,i){return '<option value="'+i+'">'+s.name+'</option>';}).join('');
  $('#c-series').addEventListener('change',drawData);
  var t;window.addEventListener('resize',function(){clearTimeout(t);t=setTimeout(render,150);});
  window.addEventListener('vb-theme',render);
  try{var mq=matchMedia('(prefers-color-scheme:dark)');if(mq.addEventListener)mq.addEventListener('change',render);else if(mq.addListener)mq.addListener(render);}catch(e){}
}
var pending=null;
function update(){if(pending)return;pending=requestAnimationFrame(function(){pending=null;R=compute();render();});}

function cohortIndex(){for(var j=0;j<R.cohorts.length;j++)if(R.cohorts[j].born===S.cohort)return j;return R.cohorts.length-1;}
function render(){
  if(!R)return;
  $('#v-save').textContent=fa(S.save)+'٪';
  $('#v-area').textContent=fa(S.area)+' متر';
  $('#v-fee').textContent=S.fee===0?'بدون کارمزد':trimNum(S.fee)+' برابر تخمین معمولی';
  var w05=D.min_wage_1405,usdNow=P.usd[N-1];
  $('#h-sal').textContent=(w05?'حدود '+trimNum(S.salary/w05)+' برابر حداقل دستمزد پایهٔ ۱۴۰۵':'')+(usdNow===usdNow?' و حدود '+fa(Math.round(S.salary/usdNow).toLocaleString('en-US').replace(/,/g,'٬'))+' دلار در ماه با دلار آبان ۱۴۰۵.':'');
  var anyOn=Object.keys(S.assets).some(function(k){return S.assets[k];});
  $('#h-assets').textContent=anyOn?'':'هیچ دارایی‌ای انتخاب نشده، پس مسافر زمان فقط پول نقد نگه می‌دارد و از سه پس‌اندازکنندهٔ معمولی هم عقب می‌ماند.';
  $('#h-index').textContent=S.index==='cpi'?'حقوق هر سال = حقوق ۱۴۰۵ ضرب در نسبت شاخص تورم آن سال به ۱۴۰۵ (برای ۱۴۰۵ میانگین '+fa(CPI_MONTHS_1405)+' ماهِ منتشرشده).':'حقوق هر سال همان چند برابرِ حداقل دستمزد پایهٔ آن سال است.';
  drawMain();drawDetail();drawData();
}
function legend(box,items){
  box.innerHTML=items.map(function(it){return '<span><i class="'+(it.cls||'')+'" style="--c:var('+it.col+')"></i>'+it.name+'</span>';}).join('');
}
function notYet(){return R.lastKnown<N-1?'تا '+mlabel(R.lastKnown)+' نه':'هنوز نه';}
function drawMain(){
  var co=R.cohorts,n=co.length;
  $('#hint1').textContent=(R.lastKnown<N-1?'دایرهٔ توخالی با فلش یعنی تا '+mlabel(R.lastKnown)+'، آخرین ماهی که قیمت رسمی خانه را داریم، نتوانسته بخرد. بعد از آن داده نیست.':'دایرهٔ توخالی با فلش یعنی تا امروز ('+mlabel(N-1)+') هنوز نتوانسته بخرد. عدد آن، سال‌هایی است که تا امروز گذشته.')+' روی هر سال بزن تا جزئیاتش را ببینی.';
  legend($('#leg1'),STRATS.map(function(s){return {col:s.col,name:s.name,cls:'dot'};}));
  var houseTxt=fa(S.area)+' متری در '+(S.district?'منطقهٔ '+fa(S.district):'تهران (میانگین)');
  $('#cap1').textContent='خانهٔ '+houseTxt+(S.car==='none'?' بدون ماشین':' به‌علاوهٔ '+carName(S.car).replace(/ \(.*\)$/,''))+'، با پس‌انداز '+fa(S.save)+'٪ از حقوقی که در ۱۴۰۵ برابر '+money(S.salary)+' است.';
  var series=STRATS.map(function(st){
    var vals=[],open=[];
    co.forEach(function(c,j){var h=R.hit[st.k][j];
      if(h>=0){vals.push((h-c.s+1)/12);open.push(false);}
      else if(R.lastKnown>=c.s){vals.push((R.lastKnown-c.s+1)/12);open.push(true);}
      else{vals.push(null);open.push(true);}});
    return {key:st.k,color:css(st.col),values:vals,open:open,markers:true};
  });
  /* draw lines only through solved points: hollow points are kept off the line */
  var xt=[];for(var i=0;i<n;i++)if((co[i].born%5)===0)xt.push(i);
  chart($('#ch1'),{n:n,height:320,series:series,yLog:false,yMin:5,label:'سال‌های لازم برای خرید خانه و ماشین، به تفکیک سال تولد',
    yFmt:function(v){return fa(v)+' سال';},xTicks:xt,xLabel:function(i){return fa(co[i].born);},
    marks:[{i:Math.max(0,cohortIndex())}],
    onClick:function(i){S.cohort=co[i].born;drawMain();drawDetail();},
    tip:function(i){var c=co[i];var h='<b>متولد '+fa(c.born)+'</b> <span class="muted">(بیست‌ساله در '+fa(c.born+20)+')</span>';
      STRATS.forEach(function(st){var t=R.hit[st.k][i];
        h+='<div class="r"><i style="--c:var('+st.col+')"></i><span>'+st.name+'</span><b>'+(t>=0?years(t-c.s+1):notYet())+'</b></div>';});
      return h;}});
}
function drawDetail(){
  var j=cohortIndex(),c=R.cohorts[j];S.cohort=c.born;
  $('#cohorts').innerHTML=R.cohorts.map(function(x){return '<button class="cohort'+(x.born===c.born?' on':'')+'" data-b="'+x.born+'">'+fa(x.born)+'</button>';}).join('');
  $('#cohorts').onclick=function(e){var b=e.target.closest('.cohort');if(!b)return;S.cohort=+b.getAttribute('data-b');drawMain();drawDetail();};
  var on=$('#cohorts .on'),pc=$('#cohorts');
  if(on){var r1=on.getBoundingClientRect(),r2=pc.getBoundingClientRect();
    if(!drawDetail.once||r1.left<r2.left||r1.right>r2.right){pc.scrollLeft+=(r1.left+r1.width/2)-(r2.left+r2.width/2);drawDetail.once=1;}}
  $('#d-title').textContent='متولد '+fa(c.born)+' — بیست‌ساله در فروردین '+fa(c.born+20);
  var sal0=R.sal[c.s];
  $('#d-sub').textContent='در فروردین '+fa(c.born+20)+' حقوقش '+money(sal0)+' بود و '+fa(S.save)+'٪ آن را پس‌انداز می‌کرد. '+(R.tgt[c.s]===R.tgt[c.s]?'خانه و ماشین در همان ماه '+money(R.tgt[c.s])+' می‌ارزید. ':'قیمت رسمی خانه برای آن ماه در دست نیست. ')+'هر سال تولد دیگری را از ردیف زیر انتخاب کن.';
  $('#tiles').innerHTML=STRATS.map(function(st){var t=R.hit[st.k][j];
    var v=t>=0?years(t-c.s+1):notYet();
    var d=t>=0?'در '+mlabel(t)+'، حدود '+fa(20+Math.floor((t-c.s)/12))+' سالگی':(function(){
      var L=R.lastKnown;if(L<c.s)return 'برای این دوره قیمت رسمی خانه نداریم';
      var W=R.W[st.k][j][L],tg=R.tgt[L];return (L<N-1?'در '+mlabel(L)+' ':'امروز ')+fa(Math.round(W/tg*100))+'٪ پول خانه و ماشین را داشت';})();
    return '<div class="tile"><div class="k"><i style="--c:var('+st.col+')"></i>'+st.name+'</div><div class="v">'+v+'</div><div class="d">'+d+'</div></div>';}).join('');
  var hits=STRATS.map(function(st){return R.hit[st.k][j];});
  /* show up to two years after the last of the four purchases (or to today if one never buys) */
  var lastHit=hits.indexOf(-1)>=0?N-1:Math.max.apply(null,hits);
  var end=Math.min(N-1,lastHit+24),start=c.s,n=end-start+1;
  var tg=[],ser=[];for(var i=0;i<n;i++)tg.push(R.tgt[start+i]===R.tgt[start+i]?R.tgt[start+i]:null);
  STRATS.forEach(function(st,si){var v=[];for(var i=0;i<n;i++){var w=R.W[st.k][j][start+i];v.push(w===w&&w>0?w:null);}
    ser.push({key:st.k,color:css(st.col),values:v,width:st.k==='trav'?2.4:1.8,dots:hits[si]>=0?[hits[si]-start]:[]});});
  ser.push({key:'tgt',color:css('--target'),values:tg,dash:'6 4',width:1.6});
  legend($('#leg2'),STRATS.map(function(s){return {col:s.col,name:s.name};}).concat([{col:'--target',name:'خانه + ماشین',cls:'dash'}]));
  var xt=[];for(var i2=0;i2<n;i2++){var mm=ym(start+i2);if(mm[1]===1&&(n<150||mm[0]%5===0))xt.push(i2);}
  if(n<=24){xt=[];for(var i3=0;i3<n;i3+=3)xt.push(i3);}
  var tmax=0;tg.forEach(function(v){if(v>tmax)tmax=v;});
  var clipped=tmax>0&&ser[0].values.some(function(v){return v>tmax*100;});
  $('#cap2').textContent='محور عمودی لگاریتمی است، یعنی هر خط افقی ده برابر خط پایینی است. خط‌چین، قیمت خانه به‌علاوهٔ ماشین در همان ماه است.'+(clipped?' خط مسافر زمان جایی که از صد برابر قیمت خانه بالاتر می‌رود از نمودار بیرون می‌زند. عددش را با بردن نشانگر روی نمودار ببین.':'');
  chart($('#ch2'),{n:n,height:300,series:ser,yLog:true,yMax:tmax>0?tmax*100:null,yFmt:moneyShort,xTicks:xt,label:'ثروت در برابر قیمت خانه و ماشین',
    xLabel:function(i){return n<=24?MONTHS[ym(start+i)[1]-1].slice(0,3)+' '+fa(ym(start+i)[0]%100):fa(ym(start+i)[0]);},
    tip:function(i){var t=start+i,h='<b>'+mlabel(t)+'</b>';
      STRATS.forEach(function(st){var w=R.W[st.k][j][t];h+='<div class="r"><i style="--c:var('+st.col+')"></i><span>'+st.name+'</span><b>'+money(w)+'</b></div>';});
      h+='<div class="r"><i style="--c:var(--target)"></i><span>خانه + ماشین</span><b>'+money(R.tgt[t])+'</b></div>';
      return h;}});
  /* the traveller's moves */
  var T=hits[0]>=0?hits[0]:end;
  var rp=replay(c,T),strip='',tot=rp.comp.length;
  var runs=[];rp.comp.forEach(function(e){if(e.final)return;var l=runs[runs.length-1];if(l&&l.dom===e.dom)l.n++;else runs.push({dom:e.dom,n:1});});
  strip=runs.map(function(r){return '<div title="'+ASSETS[r.dom].name+'" style="width:'+(r.n/Math.max(1,tot-1)*100)+'%;background:var('+ASSETS[r.dom].col+')"></div>';}).join('');
  var used={};runs.forEach(function(r){used[r.dom]=1;});
  var lg=Object.keys(used).map(function(a){return '<span><i class="dot" style="--c:var('+ASSETS[a].col+')"></i>'+ASSETS[a].name+'</span>';}).join('');
  var items=rp.log.slice(0,14).map(function(e){return '<li><b>'+mlabel(e.k)+'</b>: بیشتر پولش را برد به '+ASSETS[e.dom].name+' (دارایی کل '+money(e.tot)+')</li>';}).join('');
  var more=rp.log.length>14?'<li>و '+fa(rp.log.length-14)+' جابه‌جایی بزرگ دیگر</li>':'';
  $('#trades').innerHTML='<div><b>مسافر زمان پولش را کجا نگه داشت؟</b> '+(hits[0]>=0?'از '+mlabel(start)+' تا روز خرید خانه':'از '+mlabel(start)+' تا امروز')+'، چپ به راست:</div>'+
    '<div class="strip">'+strip+'</div><div class="legend">'+lg+'</div><ol>'+items+more+'</ol>';
  qualityNote(j,hits);
}
function qualityNote(j,hits){
  var bits=[],t=hits[0],c=R.cohorts[j];
  function fl(arr,i){return arr&&arr[i];}
  if(t>=0){
    var hf=fl(D.series.house_f,t),uf=fl(D.series.usd_f,t);
    if(hf==='e')bits.push('قیمت خانه در '+mlabel(t)+' برآورد است (بعد از مرداد ۱۴۰۳ بانک مرکزی آماری منتشر نکرده است).');
    if(hf==='i')bits.push('قیمت خانه در '+mlabel(t)+' بین دو عدد واقعی درون‌یابی شده است.');
    if(S.car!=='none'){var ca=carAt(S.car,t);
      if(ca&&ca.f==='i')bits.push('قیمت ماشین در '+mlabel(t)+' بین دو سالِ دارای قیمت درون‌یابی شده است.');
      if(ca&&ca.f==='f')bits.push('قیمت ماشین در '+mlabel(t)+' قیمت کارخانه است، نه بازار.');
      if(ca&&ca.f==='x')bits.push(carName(carModelAt(S.car,t))+' در '+mlabel(t)+' در بازار نبود. قیمتش از نزدیک‌ترین سالی که قیمت دارد ('+fa(ca.m.years[0])+' تا '+fa(ca.m.years[1])+') با تورم جابه‌جا شده است، یعنی «ماشینی با همان قیمت واقعی».');}
  }
  var annual=0;for(var k=c.s;k<=(t>=0?t:N-1);k++)if(D.series.usd_f[k]!=='o')annual++;
  if(annual>12)bits.push('در '+fa(Math.round(annual/12))+' سال از این دوره قیمت دلار فقط سالانه در دست است، پس مسافر زمان نوسان‌های داخل سال را نمی‌بیند و نتیجه‌اش محافظه‌کارانه است.');
  $('#qnote').innerHTML=bits.length?'<div class="note"><b>دربارهٔ دقت این نتیجه:</b> '+bits.join(' ')+'</div>':'';
}

/* ---------- data explorer ---------- */
var DATASERIES=[
  {k:'usd',name:'دلار بازار آزاد (تومان)'},
  {k:'gold',name:'یک گرم طلای ۱۸ عیار به قیمت جهانی (تومان)'},
  {k:'coin',name:'سکهٔ امامی (تومان)'},
  {k:'house',name:'قیمت هر متر خانه در تهران (تومان)'},
  {k:'cpi',name:'شاخص قیمت مصرف‌کننده'},
  {k:'wage',name:'حداقل دستمزد ماهانه (تومان)'},
  {k:'tedpix',name:'شاخص کل بورس تهران'},
  {k:'btc',name:'بیت‌کوین (تومان)'},
  {k:'eth',name:'اتریوم (تومان)'},
  {k:'dep',name:'سود سپردهٔ یک‌ساله (درصد)',lin:true},
  {k:'car',name:'قیمت ماشین انتخاب‌شده (تومان)'}
];
function drawData(){
  var s=DATASERIES[+$('#c-series').value||0],vals=[],st=[];
  if(s.k==='car'){
    var key=S.car==='none'?'cheap':S.car;
    for(var i=0;i<N;i++){var ca=carAt(key,i);vals.push(ca?ca.v:null);st.push(ca?(ca.f==='x'?'e':ca.f==='a'?'f':ca.f):null);}
    $('#cap3').textContent=carName(key)+'. برای عوض کردن مدل، ماشین را در بالای صفحه عوض کن.';
  }else{
    vals=D.series[s.k].slice();st=(D.series[s.k+'_f']||[]).map(function(f){return f==='a'?'f':f;});
    var have=vals.map(function(v,i){return v!=null?i:-1;}).filter(function(i){return i>=0;});
    $('#cap3').textContent=have.length?'از '+mlabel(have[0])+' تا '+mlabel(have[have.length-1])+'. محور عمودی '+(s.lin?'خطی':'لگاریتمی')+' است.':'';
  }
  var xt=[];for(var k=0;k<N;k++)if(ym(k)[1]===1&&ym(k)[0]%5===0)xt.push(k);
  chart($('#ch3'),{n:N,height:280,series:[{key:s.k,color:css('--s1'),values:vals,style:st}],yLog:!s.lin,
    yFmt:s.lin?function(v){return fa(v)+'٪';}:(s.k==='cpi'||s.k==='tedpix'?function(v){return moneyShort(v);}:moneyShort),
    xTicks:xt,xLabel:function(i){return fa(ym(i)[0]);},label:s.name,
    tip:function(i){var v=vals[i];if(v==null)return '';var q={o:'عدد ماهانهٔ منبع',a:'عدد سالانه یا فصلی',f:'عدد سالانه یا فصلی',i:'درون‌یابی',e:'برآورد از سری ضعیف‌تر'}[st[i]]||'';
      return '<b>'+mlabel(i)+'</b><div>'+(s.lin?trimNum(v)+'٪':(s.k==='cpi'||s.k==='tedpix'?trimNum(v):money(v)))+'</div><div class="muted">'+q+'</div>';}});
}

function sourcesHTML(){
  var rows=(D.sources||[]).map(function(s){
    return '<tr><td><b>'+esc(s.series)+'</b></td><td class="mono" style="white-space:nowrap">'+esc(s.period)+'</td><td>'+s.html+'</td><td><span class="conf">'+esc(s.conf)+'</span></td></tr>';}).join('');
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
