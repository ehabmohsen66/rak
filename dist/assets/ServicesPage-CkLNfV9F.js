import{r as g,j as e}from"./vendor-react-Gea9DQ9A.js";import{W as I,S as B,P as F,C as E,V as L,M as H,a as W,R as q}from"./vendor-three-CJVTFr_q.js";import{b as V,u as D,B as G,a as T,R as X,f as R}from"./index-D9_f3xbw.js";import{S as z,A as P,j as Y,w as $,T as O,x as K,y as U,z as J,D as Q,C as Z}from"./vendor-icons-DnoMsrMi.js";import"./vendor-motion-JPKABafB.js";const ee=({width:c="100%",height:u="100%",cameraZ:s=125,planeSize:r=256,speed:d=.5,colorRgb:a=[.93,0,.55]})=>{const x=g.useRef(null),n=g.useRef(null);return g.useEffect(()=>{if(!x.current||!n.current)return;const p=window.innerWidth<768,t=p?140:220,m=p?100:140,b=760,y=340;class w{constructor(){this.uniforms={time:{type:"f",value:0},uColor:{type:"v3",value:new L(...a)}},this.mesh=this.createMesh(),this.time=d}createMesh(){return new H(new W(b,y,t,m),new q({uniforms:this.uniforms,vertexShader:`
              #define GLSLIFY 1
              attribute vec3 position;
              uniform mat4 projectionMatrix;
              uniform mat4 modelViewMatrix;
              uniform float time;
              varying vec3 vPosition;

              mat4 rotateMatrixX(float radian) {
                return mat4(
                  1.0, 0.0, 0.0, 0.0,
                  0.0, cos(radian), -sin(radian), 0.0,
                  0.0, sin(radian), cos(radian), 0.0,
                  0.0, 0.0, 0.0, 1.0
                );
              }

              vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
              vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
              vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
              vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
              vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

              float cnoise(vec3 P) {
                vec3 Pi0 = floor(P);
                vec3 Pi1 = Pi0 + vec3(1.0);
                Pi0 = mod289(Pi0);
                Pi1 = mod289(Pi1);
                vec3 Pf0 = fract(P);
                vec3 Pf1 = Pf0 - vec3(1.0);
                vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
                vec4 iy = vec4(Pi0.yy, Pi1.yy);
                vec4 iz0 = Pi0.zzzz;
                vec4 iz1 = Pi1.zzzz;

                vec4 ixy = permute(permute(ix) + iy);
                vec4 ixy0 = permute(ixy + iz0);
                vec4 ixy1 = permute(ixy + iz1);

                vec4 gx0 = ixy0 * (1.0 / 7.0);
                vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
                gx0 = fract(gx0);
                vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
                vec4 sz0 = step(gz0, vec4(0.0));
                gx0 -= sz0 * (step(0.0, gx0) - 0.5);
                gy0 -= sz0 * (step(0.0, gy0) - 0.5);

                vec4 gx1 = ixy1 * (1.0 / 7.0);
                vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
                gx1 = fract(gx1);
                vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
                vec4 sz1 = step(gz1, vec4(0.0));
                gx1 -= sz1 * (step(0.0, gx1) - 0.5);
                gy1 -= sz1 * (step(0.0, gy1) - 0.5);

                vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
                vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
                vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
                vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
                vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
                vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
                vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
                vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

                vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
                g000 *= norm0.x;
                g010 *= norm0.y;
                g100 *= norm0.z;
                g110 *= norm0.w;
                vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
                g001 *= norm1.x;
                g011 *= norm1.y;
                g101 *= norm1.z;
                g111 *= norm1.w;

                float n000 = dot(g000, Pf0);
                float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
                float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
                float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
                float n001 = dot(g001, Pf0.xy, Pf1.z);
                float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
                float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
                float n111 = dot(g111, Pf1);

                vec3 fade_xyz = fade(Pf0);
                vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
                vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
                float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
                return 2.2 * n_xyz;
              }

              void main(void) {
                vec3 updatePosition = (rotateMatrixX(radians(90.0)) * vec4(position, 1.0)).xyz;
                float waveEnv = 0.65 + 0.35 * cos(updatePosition.x * 0.018);
                vec3 noisePosition = updatePosition + vec3(0.0, 0.0, time * -28.0);
                float noise1 = cnoise(noisePosition * 0.045);
                float noise2 = cnoise(noisePosition * 0.09);
                float noise3 = cnoise(noisePosition * 0.28);
                float elevation = (noise1 * 14.0 + noise2 * 9.0 + noise3 * 2.5) * waveEnv + waveEnv * 22.0;
                vec3 lastPosition = updatePosition + vec3(0.0, elevation, 0.0);

                vPosition = lastPosition;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(lastPosition, 1.0);
              }
            `,fragmentShader:`
              precision highp float;
              #define GLSLIFY 1
              varying vec3 vPosition;
              uniform vec3 uColor;

              void main(void) {
                float depthFade = smoothstep(-165.0, 40.0, vPosition.z) * (1.0 - smoothstep(75.0, 130.0, vPosition.z));
                float heightBoost = clamp((vPosition.y + 10.0) / 45.0, 0.25, 1.0);
                float opacity = depthFade * heightBoost * 0.78;
                gl_FragColor = vec4(uColor, max(0.0, opacity));
              }
            `,wireframe:!0,transparent:!0}))}render(f){this.uniforms.time.value+=f*this.time}}let k;const M=x.current,i=n.current,o=new I({canvas:M,antialias:!0,alpha:!0,powerPreference:"high-performance"});o.setPixelRatio(Math.min(window.devicePixelRatio||1,2));const N=new B,l=new F(45,(i.clientWidth||window.innerWidth)/(i.clientHeight||600),1,1e4),A=new E,C=new w,v=()=>{if(!i||!o||!l)return;const j=i.clientWidth||window.innerWidth,f=i.clientHeight||600;l.aspect=j/f,l.updateProjectionMatrix(),o.setSize(j,f,!1)},_=()=>{C.render(A.getDelta()),o.render(N,l)},S=()=>{_(),k=requestAnimationFrame(S)};let h;return(()=>{o.setClearColor(0,0),l.position.set(0,22,s),l.lookAt(new L(0,22,0)),N.add(C.mesh),window.addEventListener("resize",v),typeof ResizeObserver<"u"&&(h=new ResizeObserver(()=>v()),h.observe(i)),v(),S()})(),()=>{window.removeEventListener("resize",v),h&&h.disconnect(),k&&cancelAnimationFrame(k),o.dispose()}},[s,r,d,a]),e.jsx("div",{ref:n,style:{position:"relative",width:c,height:u,overflow:"hidden"},className:"w-full h-full",children:e.jsx("canvas",{ref:x,style:{position:"absolute",top:0,right:0,bottom:0,left:0,width:"100%",height:"100%",zIndex:1,pointerEvents:"none"}})})},oe=({onOpenPlanner:c})=>{const{content:u}=V(),s=u.pillars||[],[r,d]=g.useState("All"),a=D("services",{count:s.length}),x=g.useMemo(()=>["All",...Array.from(new Set(s.map(m=>m.category).filter(Boolean)))],[s]),n=r==="All"?s:s.filter(t=>t.category===r),p=t=>{switch(t){case"Compass":return Z;case"BarChart3":return Q;case"Share2":return J;case"Code":return U;case"Search":return K;case"Target":return O;case"Video":return $;default:return z}};return e.jsxs("div",{className:"pb-16 space-y-16 sm:space-y-24 bg-slate-50 dark:bg-rak-slate-950 text-slate-900 dark:text-white transition-colors duration-300",children:[e.jsxs("section",{className:"relative w-full min-h-[80vh] md:min-h-[88vh] pt-28 pb-16 bg-slate-950 flex flex-col items-center justify-center overflow-hidden border-b border-slate-200 dark:border-rak-slate-800/80",children:[e.jsx("div",{className:"absolute inset-0 w-full h-full z-0",children:e.jsx(G,{banner:a,fallback:e.jsx(ee,{width:"100%",height:"100%",speed:.4,colorRgb:[.93,0,.55]})})}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-b from-slate-950/65 via-transparent to-slate-950 z-[1] pointer-events-none"}),e.jsx(T,{banner:a,className:"z-[1]"}),e.jsxs("div",{className:"relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8 py-8",children:[a.eyebrow&&e.jsxs("div",{className:"inline-flex items-center space-x-2 px-4 py-1.5 bg-slate-900/90 border border-rak-magenta/40 text-rak-magenta rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-magenta-sm",children:[e.jsx(z,{className:"w-4 h-4"}),e.jsx("span",{children:a.eyebrow})]}),a.title&&e.jsx("h1",{className:"text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white uppercase leading-tight font-heading px-2",children:e.jsx(X,{text:a.title})}),a.subtitle&&e.jsx("p",{className:"text-sm sm:text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal px-2",children:a.subtitle}),(a.primaryCtaLabel||a.secondaryCtaLabel&&(s[0]||a.secondaryCtaHref))&&e.jsxs("div",{className:"flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2",children:[a.primaryCtaLabel&&e.jsxs("button",{type:"button",onClick:()=>{R(a.primaryCtaHref)||c()},className:"px-6 sm:px-8 py-3.5 sm:py-4 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-magenta-glow transition-all flex items-center space-x-2 hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",children:[e.jsx("span",{children:a.primaryCtaLabel}),e.jsx(P,{className:"w-4 h-4"})]}),a.secondaryCtaLabel&&(s[0]||a.secondaryCtaHref)&&e.jsx("a",{href:a.secondaryCtaHref||`#${s[0].id}`,onClick:t=>{a.secondaryCtaHref&&(t.preventDefault(),R(a.secondaryCtaHref))},className:"px-6 sm:px-8 py-3.5 sm:py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-md transition-all hover:scale-105 cursor-pointer",children:e.jsx("span",{children:a.secondaryCtaLabel})})]}),e.jsxs("div",{className:"pt-6 sm:pt-8 border-t border-white/10",children:[e.jsx("p",{className:"text-[11px] font-bold uppercase tracking-widest text-slate-300 mb-4 font-mono",children:"Filter Capabilities by Domain"}),e.jsx("div",{className:"flex flex-wrap items-center justify-center gap-2",children:x.map(t=>e.jsx("button",{type:"button",onClick:()=>d(t),className:`px-3.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta ${r===t?"bg-rak-magenta text-white shadow-magenta-sm scale-105":"bg-slate-900/90 border border-slate-800 text-slate-300 hover:border-rak-magenta/40 hover:text-white backdrop-blur-md"}`,children:t},t))})]})]})]}),e.jsx("section",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10",children:n.length===0?e.jsxs("div",{className:"p-12 text-center rounded-3xl bg-white dark:bg-rak-slate-900/80 border border-slate-200 dark:border-rak-slate-800 space-y-3",children:[e.jsxs("h2",{className:"text-xl font-bold text-slate-900 dark:text-white",children:['No capabilities match "',r,'"']}),e.jsx("p",{className:"text-xs text-slate-600 dark:text-rak-slate-300",children:"Reset the filter to view all agency capability units."}),e.jsx("button",{type:"button",onClick:()=>d("All"),className:"px-5 py-2.5 bg-rak-magenta text-white text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer",children:"Show All Capabilities"})]}):n.map((t,m)=>{const b=p(t.icon);return e.jsx("div",{id:t.id,className:"p-8 sm:p-12 rounded-3xl bg-white dark:bg-rak-slate-900/80 border border-slate-200 dark:border-rak-slate-800 space-y-8 hover:border-rak-magenta/40 transition-all group backdrop-blur-xl shadow-sm hover:shadow-md scroll-mt-28",children:e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-8 items-center",children:[e.jsx("div",{className:`lg:col-span-5 ${m%2===1?"lg:order-2":""}`,children:e.jsxs("div",{className:"relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 dark:bg-rak-slate-950",children:[e.jsx("img",{src:t.featuredImage,alt:t.title,loading:"lazy",decoding:"async",className:"w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"}),e.jsx("div",{className:"absolute top-4 left-4 flex items-center space-x-2",children:e.jsx("span",{className:"px-3 py-1 bg-rak-magenta text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-magenta-sm",children:t.tag})}),e.jsxs("div",{className:"absolute bottom-6 left-6 right-6 flex items-center space-x-3 p-4 rounded-xl bg-slate-900/90 dark:bg-rak-slate-950/90 border border-white/10 backdrop-blur-xl shadow-2xl",children:[e.jsx("div",{className:"p-2.5 rounded-xl bg-rak-magenta text-white shrink-0 shadow-magenta-sm",children:e.jsx(b,{className:"w-5 h-5"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-xs font-bold text-white tracking-wide font-heading",children:t.title}),e.jsx("div",{className:"text-[11px] text-slate-300 font-medium mt-0.5 leading-snug",children:t.subtitle})]})]})]})}),e.jsxs("div",{className:"lg:col-span-7 space-y-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("span",{className:"text-xs font-bold text-rak-magenta uppercase tracking-widest font-mono",children:t.category}),e.jsx("h2",{className:"text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading",children:t.title}),e.jsx("p",{className:"text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 leading-relaxed",children:t.description})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2",children:[e.jsx(z,{className:"w-3.5 h-3.5 text-rak-magenta"}),e.jsx("span",{children:"Capabilities & Services Breakdown"})]}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2.5",children:(t.items||[]).map((y,w)=>e.jsxs("div",{className:"p-3 bg-slate-50 dark:bg-rak-slate-950/80 border border-slate-200 dark:border-rak-slate-800/90 rounded-xl text-xs font-medium text-slate-700 dark:text-rak-slate-200 flex items-start space-x-2.5",children:[e.jsx(Y,{className:"w-4 h-4 text-rak-magenta shrink-0 mt-0.5"}),e.jsx("span",{className:"leading-snug",children:y})]},w))})]}),e.jsx("div",{className:"pt-2",children:e.jsxs("button",{type:"button",onClick:c,className:"inline-flex items-center space-x-2 px-6 py-3 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-magenta-sm transition-all hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta",children:[e.jsx("span",{children:"Inquire About This Pillar"}),e.jsx(P,{className:"w-4 h-4"})]})})]})]})},t.id)})}),e.jsx("section",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:e.jsxs("div",{className:"p-8 sm:p-12 bg-gradient-to-r from-rak-magenta/10 via-white to-slate-50 dark:from-rak-magenta/20 dark:via-rak-slate-900 dark:to-rak-slate-900 border border-rak-magenta/30 rounded-3xl text-center space-y-6 shadow-xl backdrop-blur-xl",children:[e.jsx("h2",{className:"text-3xl font-extrabold text-slate-900 dark:text-white font-heading",children:"Need an end-to-end strategy built for your brand?"}),e.jsx("p",{className:"text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 max-w-xl mx-auto",children:"From ground zero to new heights, RAK4Creative brings brand strategy, creative production, and digital performance marketing under one roof."}),e.jsxs("button",{type:"button",onClick:c,className:"px-8 py-3.5 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-magenta-glow inline-flex items-center space-x-2 hover:scale-105 transition-all cursor-pointer",children:[e.jsx("span",{children:"Start a Project"}),e.jsx(P,{className:"w-4 h-4"})]})]})})]})};export{oe as ServicesPage,oe as default};
