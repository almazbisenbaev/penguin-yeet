(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const c of document.querySelectorAll('link[rel="modulepreload"]'))s(c);new MutationObserver(c=>{for(const p of c)if(p.type==="childList")for(const g of p.addedNodes)g.tagName==="LINK"&&g.rel==="modulepreload"&&s(g)}).observe(document,{childList:!0,subtree:!0});function n(c){const p={};return c.integrity&&(p.integrity=c.integrity),c.referrerPolicy&&(p.referrerPolicy=c.referrerPolicy),c.crossOrigin==="use-credentials"?p.credentials="include":c.crossOrigin==="anonymous"?p.credentials="omit":p.credentials="same-origin",p}function s(c){if(c.ep)return;c.ep=!0;const p=n(c);fetch(c.href,p)}})();const ut=.12,dt=.85,pt=.6,gt=.5,D=15,I=100,T=60,Q=15,ft=.02,tt=-Math.PI/2,et=0,H=200,Y=30,mt=2,it=10,vt=100,nt=[30,60,90],X=40,xt=300,wt=1200,yt=1e3,_t=5,at=.35,bt=.992,Et=2.5,At=.2,lt=8,St=60,Ct=65,$t=1.5,e={canvas:null,ctx:null,gameState:"aiming",penguin:{x:I,y:400-D,vx:0,vy:0,mass:1,isDiving:!1},springs:[],cameraX:0,lastSpringX:0,maxDistance:0,canJumpFromRoll:!0,cannonAngle:-Math.PI/4,cannonRotationDirection:1,powerValue:50,powerDirection:1,GROUND_Y:400,CANNON_Y:400,rng:Math.random,tuning:{GRAVITY:ut,BOUNCE_DAMPING:pt,MIN_ENERGY_THRESHOLD:gt,ROLLING_FRICTION:bt,ROLLING_SPEED_MULTIPLIER:Et,ROLLING_THRESHOLD:At,SPRING_BOOST:_t,MIN_SPRING_DISTANCE:xt,MAX_SPRING_DISTANCE:wt,SPRING_SPAWN_DISTANCE:yt}};/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.21.0
 * @author George Michael Brower
 * @license MIT
 */class M{constructor(t,n,s,c,p="div"){this.parent=t,this.object=n,this.property=s,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(p),this.domElement.classList.add("lil-controller"),this.domElement.classList.add(c),this.$name=document.createElement("div"),this.$name.classList.add("lil-name"),M.nextNameID=M.nextNameID||0,this.$name.id=`lil-gui-name-${++M.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("lil-widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",g=>g.stopPropagation()),this.domElement.addEventListener("keyup",g=>g.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(s)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled?this:(this._disabled=t,this.domElement.classList.toggle("lil-disabled",t),this.$disable.toggleAttribute("disabled",t),this)}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){const n=this.parent.add(this.object,this.property,t);return n.name(this._name),this.destroy(),n}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Dt extends M{constructor(t,n,s){super(t,n,s,"lil-boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function B(i){let t,n;return(t=i.match(/(#|0x)?([a-f0-9]{6})/i))?n=t[2]:(t=i.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?n=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=i.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(n=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),n?"#"+n:!1}const Nt={isPrimitive:!0,match:i=>typeof i=="string",fromHexString:B,toHexString:B},V={isPrimitive:!0,match:i=>typeof i=="number",fromHexString:i=>parseInt(i.substring(1),16),toHexString:i=>"#"+i.toString(16).padStart(6,0)},Ot={isPrimitive:!1,match:i=>Array.isArray(i)||ArrayBuffer.isView(i),fromHexString(i,t,n=1){const s=V.fromHexString(i);t[0]=(s>>16&255)/255*n,t[1]=(s>>8&255)/255*n,t[2]=(s&255)/255*n},toHexString([i,t,n],s=1){s=255/s;const c=i*s<<16^t*s<<8^n*s<<0;return V.toHexString(c)}},Mt={isPrimitive:!1,match:i=>Object(i)===i,fromHexString(i,t,n=1){const s=V.fromHexString(i);t.r=(s>>16&255)/255*n,t.g=(s>>8&255)/255*n,t.b=(s&255)/255*n},toHexString({r:i,g:t,b:n},s=1){s=255/s;const c=i*s<<16^t*s<<8^n*s<<0;return V.toHexString(c)}},Lt=[Nt,V,Ot,Mt];function It(i){return Lt.find(t=>t.match(i))}class Rt extends M{constructor(t,n,s,c){super(t,n,s,"lil-color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=It(this.initialValue),this._rgbScale=c,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const p=B(this.$text.value);p&&this._setValueFromHexString(p)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){const n=this._format.fromHexString(t);this.setValue(n)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class U extends M{constructor(t,n,s){super(t,n,s,"lil-function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",c=>{c.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class kt extends M{constructor(t,n,s,c,p,g){super(t,n,s,"lil-number"),this._initInput(),this.min(c),this.max(p);const u=g!==void 0;this.step(u?g:this._getImplicitStep(),u),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,n=!0){return this._step=t,this._stepExplicit=n,this}updateDisplay(){const t=this.getValue();if(this._hasSlider){let n=(t-this._min)/(this._max-this._min);n=Math.max(0,Math.min(n,1)),this.$fill.style.width=n*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const n=()=>{let m=parseFloat(this.$input.value);isNaN(m)||(this._stepExplicit&&(m=this._snap(m)),this.setValue(this._clamp(m)))},s=m=>{const _=parseFloat(this.$input.value);isNaN(_)||(this._snapClampSetValue(_+m),this.$input.value=this.getValue())},c=m=>{m.key==="Enter"&&this.$input.blur(),m.code==="ArrowUp"&&(m.preventDefault(),s(this._step*this._arrowKeyMultiplier(m))),m.code==="ArrowDown"&&(m.preventDefault(),s(this._step*this._arrowKeyMultiplier(m)*-1))},p=m=>{this._inputFocused&&(m.preventDefault(),s(this._step*this._normalizeMouseWheel(m)))};let g=!1,u,l,a,h,r;const o=5,d=m=>{u=m.clientX,l=a=m.clientY,g=!0,h=this.getValue(),r=0,window.addEventListener("mousemove",f),window.addEventListener("mouseup",y)},f=m=>{if(g){const _=m.clientX-u,x=m.clientY-l;Math.abs(x)>o?(m.preventDefault(),this.$input.blur(),g=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(_)>o&&y()}if(!g){const _=m.clientY-a;r-=_*this._step*this._arrowKeyMultiplier(m),h+r>this._max?r=this._max-h:h+r<this._min&&(r=this._min-h),this._snapClampSetValue(h+r)}a=m.clientY},y=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",f),window.removeEventListener("mouseup",y)},S=()=>{this._inputFocused=!0},v=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",n),this.$input.addEventListener("keydown",c),this.$input.addEventListener("wheel",p,{passive:!1}),this.$input.addEventListener("mousedown",d),this.$input.addEventListener("focus",S),this.$input.addEventListener("blur",v)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("lil-slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("lil-fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("lil-has-slider");const t=(v,m,_,x,w)=>(v-m)/(_-m)*(w-x)+x,n=v=>{const m=this.$slider.getBoundingClientRect();let _=t(v,m.left,m.right,this._min,this._max);this._snapClampSetValue(_)},s=v=>{this._setDraggingStyle(!0),n(v.clientX),window.addEventListener("mousemove",c),window.addEventListener("mouseup",p)},c=v=>{n(v.clientX)},p=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",c),window.removeEventListener("mouseup",p)};let g=!1,u,l;const a=v=>{v.preventDefault(),this._setDraggingStyle(!0),n(v.touches[0].clientX),g=!1},h=v=>{v.touches.length>1||(this._hasScrollBar?(u=v.touches[0].clientX,l=v.touches[0].clientY,g=!0):a(v),window.addEventListener("touchmove",r,{passive:!1}),window.addEventListener("touchend",o))},r=v=>{if(g){const m=v.touches[0].clientX-u,_=v.touches[0].clientY-l;Math.abs(m)>Math.abs(_)?a(v):(window.removeEventListener("touchmove",r),window.removeEventListener("touchend",o))}else v.preventDefault(),n(v.touches[0].clientX)},o=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",r),window.removeEventListener("touchend",o)},d=this._callOnFinishChange.bind(this),f=400;let y;const S=v=>{if(Math.abs(v.deltaX)<Math.abs(v.deltaY)&&this._hasScrollBar)return;v.preventDefault();const _=this._normalizeMouseWheel(v)*this._step;this._snapClampSetValue(this.getValue()+_),this.$input.value=this.getValue(),clearTimeout(y),y=setTimeout(d,f)};this.$slider.addEventListener("mousedown",s),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",S,{passive:!1})}_setDraggingStyle(t,n="horizontal"){this.$slider&&this.$slider.classList.toggle("lil-active",t),document.body.classList.toggle("lil-dragging",t),document.body.classList.toggle(`lil-${n}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:n,deltaY:s}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(n=0,s=-t.wheelDelta/120,s*=this._stepExplicit?1:10),n+-s}_arrowKeyMultiplier(t){let n=this._stepExplicit?1:10;return t.shiftKey?n*=10:t.altKey&&(n/=10),n}_snap(t){let n=0;return this._hasMin?n=this._min:this._hasMax&&(n=this._max),t-=n,t=Math.round(t/this._step)*this._step,t+=n,t=parseFloat(t.toPrecision(15)),t}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){const t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class Ft extends M{constructor(t,n,s,c){super(t,n,s,"lil-option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("lil-focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("lil-focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(c)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(n=>{const s=document.createElement("option");s.textContent=n,this.$select.appendChild(s)}),this.updateDisplay(),this}updateDisplay(){const t=this.getValue(),n=this._values.indexOf(t);return this.$select.selectedIndex=n,this.$display.textContent=n===-1?t:this._names[n],this}}class Pt extends M{constructor(t,n,s){super(t,n,s,"lil-string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",c=>{c.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}var Tt=`.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.lil-root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.lil-root > .lil-children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.lil-allow-touch-styles, .lil-gui.lil-allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.lil-force-touch-styles, .lil-gui.lil-force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.lil-auto-place, .lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-controller.lil-disabled {
  opacity: 0.5;
}
.lil-controller.lil-disabled, .lil-controller.lil-disabled * {
  pointer-events: none !important;
}
.lil-controller > .lil-name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-controller .lil-widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-controller.lil-string input {
  color: var(--string-color);
}
.lil-controller.lil-boolean {
  cursor: pointer;
}
.lil-controller.lil-color .lil-display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-controller.lil-color .lil-display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-controller.lil-color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-controller.lil-color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-controller.lil-option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-controller.lil-option .lil-display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-display.lil-focus {
    background: var(--focus-color);
  }
}
.lil-controller.lil-option .lil-display.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-option .lil-display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-controller.lil-option .lil-widget,
.lil-controller.lil-option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-widget:hover .lil-display {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number input {
  color: var(--number-color);
}
.lil-controller.lil-number.lil-has-slider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-controller.lil-number .lil-slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-controller.lil-number .lil-slider:hover {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number .lil-slider.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-number .lil-slider.lil-active .lil-fill {
  opacity: 0.95;
}
.lil-controller.lil-number .lil-fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-dragging * {
  cursor: ew-resize !important;
}
.lil-dragging.lil-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .lil-title {
  height: var(--title-height);
  font-weight: 600;
  padding: 0 var(--padding);
  width: 100%;
  text-align: left;
  background: none;
  text-decoration-skip: objects;
}
.lil-gui .lil-title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .lil-title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-dragging) .lil-gui .lil-title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .lil-title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.lil-root > .lil-title:focus {
  text-decoration: none !important;
}
.lil-gui.lil-closed > .lil-title:before {
  content: "▸";
}
.lil-gui.lil-closed > .lil-children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.lil-closed:not(.lil-transition) > .lil-children {
  display: none;
}
.lil-gui.lil-transition > .lil-children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .lil-children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.lil-root > .lil-children > .lil-gui > .lil-title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.lil-root > .lil-children > .lil-gui.lil-closed > .lil-title {
  border-bottom-color: transparent;
}
.lil-gui + .lil-controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .lil-title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .lil-children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .lil-controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  border: none;
}
.lil-gui .lil-controller button {
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
}
@media (hover: hover) {
  .lil-gui .lil-controller button:hover {
    background: var(--hover-color);
  }
  .lil-gui .lil-controller button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui .lil-controller button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff2;charset=utf-8;base64,d09GMgABAAAAAALkAAsAAAAABtQAAAKVAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDMgqBBIEbATYCJAMUCwwABCAFhAoHgQQbHAbIDiUFEYVARAAAYQTVWNmz9MxhEgodq49wYRUFKE8GWNiUBxI2LBRaVnc51U83Gmhs0Q7JXWMiz5eteLwrKwuxHO8VFxUX9UpZBs6pa5ABRwHA+t3UxUnH20EvVknRerzQgX6xC/GH6ZUvTcAjAv122dF28OTqCXrPuyaDER30YBA1xnkVutDDo4oCi71Ca7rrV9xS8dZHbPHefsuwIyCpmT7j+MnjAH5X3984UZoFFuJ0yiZ4XEJFxjagEBeqs+e1iyK8Xf/nOuwF+vVK0ur765+vf7txotUi0m3N0m/84RGSrBCNrh8Ee5GjODjF4gnWP+dJrH/Lk9k4oT6d+gr6g/wssA2j64JJGP6cmx554vUZnpZfn6ZfX2bMwPPrlANsB86/DiHjhl0OP+c87+gaJo/gY084s3HoYL/ZkWHTRfBXvvoHnnkHvngKun4KBE/ede7tvq3/vQOxDXB1/fdNz6XbPdcr0Vhpojj9dG+owuSKFsslCi1tgEjirjXdwMiov2EioadxmqTHUCIwo8NgQaeIasAi0fTYSPTbSmwbMOFduyh9wvBrESGY0MtgRjtgQR8Q1bRPohn2UoCRZf9wyYANMXFeJTysqAe0I4mrherOekFdKMrYvJjLvOIUM9SuwYB5DVZUwwVjJJOaUnZCmcEkIZZrKqNvRGRMvmFZsmhP4VMKCSXBhSqUBxgMS7h0cZvEd71AWkEhGWaeMFcNnpqyJkyXgYL7PQ1MoSq0wDAkRtJIijkZSmqYTiSImfLiSWXIZwhRh3Rug2X0kk1Dgj+Iu43u5p98ghopcpSo0Uyc8SnjlYX59WUeaMoDqmVD2TOWD9a4pCRAzf2ECgwGcrHjPOWY9bNxq/OL3I/QjwEAAAA=") format("woff2");
}`;function Vt(i){const t=document.createElement("style");t.innerHTML=i;const n=document.querySelector("head link[rel=stylesheet], head style");n?document.head.insertBefore(t,n):document.head.appendChild(t)}let st=!1;class j{constructor({parent:t,autoPlace:n=t===void 0,container:s,width:c,title:p="Controls",closeFolders:g=!1,injectStyles:u=!0,touchStyles:l=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("button"),this.$title.classList.add("lil-title"),this.$title.setAttribute("aria-expanded",!0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("lil-children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(p),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("lil-root"),l&&this.domElement.classList.add("lil-allow-touch-styles"),!st&&u&&(Vt(Tt),st=!0),s?s.appendChild(this.domElement):n&&(this.domElement.classList.add("lil-auto-place","autoPlace"),document.body.appendChild(this.domElement)),c&&this.domElement.style.setProperty("--width",c+"px"),this._closeFolders=g}add(t,n,s,c,p){if(Object(s)===s)return new Ft(this,t,n,s);const g=t[n];switch(typeof g){case"number":return new kt(this,t,n,s,c,p);case"boolean":return new Dt(this,t,n);case"string":return new Pt(this,t,n);case"function":return new U(this,t,n)}console.error(`gui.add failed
	property:`,n,`
	object:`,t,`
	value:`,g)}addColor(t,n,s=1){return new Rt(this,t,n,s)}addFolder(t){const n=new j({parent:this,title:t});return this.root._closeFolders&&n.close(),n}load(t,n=!0){return t.controllers&&this.controllers.forEach(s=>{s instanceof U||s._name in t.controllers&&s.load(t.controllers[s._name])}),n&&t.folders&&this.folders.forEach(s=>{s._title in t.folders&&s.load(t.folders[s._title])}),this}save(t=!0){const n={controllers:{},folders:{}};return this.controllers.forEach(s=>{if(!(s instanceof U)){if(s._name in n.controllers)throw new Error(`Cannot save GUI with duplicate property "${s._name}"`);n.controllers[s._name]=s.save()}}),t&&this.folders.forEach(s=>{if(s._title in n.folders)throw new Error(`Cannot save GUI with duplicate folder "${s._title}"`);n.folders[s._title]=s.save()}),n}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("lil-closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const n=this.$children.clientHeight;this.$children.style.height=n+"px",this.domElement.classList.add("lil-transition");const s=p=>{p.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("lil-transition"),this.$children.removeEventListener("transitionend",s))};this.$children.addEventListener("transitionend",s);const c=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("lil-closed",!t),requestAnimationFrame(()=>{this.$children.style.height=c+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(s=>s.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),this._onChange!==void 0&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),this._onOpenClose!==void 0&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(n=>{t=t.concat(n.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(n=>{t=t.concat(n.foldersRecursive())}),t}}var k=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Gt(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function Ht(i){if(i.__esModule)return i;var t=i.default;if(typeof t=="function"){var n=function s(){return this instanceof s?Reflect.construct(t,arguments,this.constructor):t.apply(this,arguments)};n.prototype=t.prototype}else n={};return Object.defineProperty(n,"__esModule",{value:!0}),Object.keys(i).forEach(function(s){var c=Object.getOwnPropertyDescriptor(i,s);Object.defineProperty(n,s,c.get?c:{enumerable:!0,get:function(){return i[s]}})}),n}var z={exports:{}};z.exports;(function(i){(function(t,n,s){function c(l){var a=this,h=u();a.next=function(){var r=2091639*a.s0+a.c*23283064365386963e-26;return a.s0=a.s1,a.s1=a.s2,a.s2=r-(a.c=r|0)},a.c=1,a.s0=h(" "),a.s1=h(" "),a.s2=h(" "),a.s0-=h(l),a.s0<0&&(a.s0+=1),a.s1-=h(l),a.s1<0&&(a.s1+=1),a.s2-=h(l),a.s2<0&&(a.s2+=1),h=null}function p(l,a){return a.c=l.c,a.s0=l.s0,a.s1=l.s1,a.s2=l.s2,a}function g(l,a){var h=new c(l),r=a&&a.state,o=h.next;return o.int32=function(){return h.next()*4294967296|0},o.double=function(){return o()+(o()*2097152|0)*11102230246251565e-32},o.quick=o,r&&(typeof r=="object"&&p(r,h),o.state=function(){return p(h,{})}),o}function u(){var l=4022871197,a=function(h){h=String(h);for(var r=0;r<h.length;r++){l+=h.charCodeAt(r);var o=.02519603282416938*l;l=o>>>0,o-=l,o*=l,l=o>>>0,o-=l,l+=o*4294967296}return(l>>>0)*23283064365386963e-26};return a}n&&n.exports?n.exports=g:this.alea=g})(k,i)})(z);var Xt=z.exports,W={exports:{}};W.exports;(function(i){(function(t,n,s){function c(u){var l=this,a="";l.x=0,l.y=0,l.z=0,l.w=0,l.next=function(){var r=l.x^l.x<<11;return l.x=l.y,l.y=l.z,l.z=l.w,l.w^=l.w>>>19^r^r>>>8},u===(u|0)?l.x=u:a+=u;for(var h=0;h<a.length+64;h++)l.x^=a.charCodeAt(h)|0,l.next()}function p(u,l){return l.x=u.x,l.y=u.y,l.z=u.z,l.w=u.w,l}function g(u,l){var a=new c(u),h=l&&l.state,r=function(){return(a.next()>>>0)/4294967296};return r.double=function(){do var o=a.next()>>>11,d=(a.next()>>>0)/4294967296,f=(o+d)/(1<<21);while(f===0);return f},r.int32=a.next,r.quick=r,h&&(typeof h=="object"&&p(h,a),r.state=function(){return p(a,{})}),r}n&&n.exports?n.exports=g:this.xor128=g})(k,i)})(W);var Yt=W.exports,q={exports:{}};q.exports;(function(i){(function(t,n,s){function c(u){var l=this,a="";l.next=function(){var r=l.x^l.x>>>2;return l.x=l.y,l.y=l.z,l.z=l.w,l.w=l.v,(l.d=l.d+362437|0)+(l.v=l.v^l.v<<4^(r^r<<1))|0},l.x=0,l.y=0,l.z=0,l.w=0,l.v=0,u===(u|0)?l.x=u:a+=u;for(var h=0;h<a.length+64;h++)l.x^=a.charCodeAt(h)|0,h==a.length&&(l.d=l.x<<10^l.x>>>4),l.next()}function p(u,l){return l.x=u.x,l.y=u.y,l.z=u.z,l.w=u.w,l.v=u.v,l.d=u.d,l}function g(u,l){var a=new c(u),h=l&&l.state,r=function(){return(a.next()>>>0)/4294967296};return r.double=function(){do var o=a.next()>>>11,d=(a.next()>>>0)/4294967296,f=(o+d)/(1<<21);while(f===0);return f},r.int32=a.next,r.quick=r,h&&(typeof h=="object"&&p(h,a),r.state=function(){return p(a,{})}),r}n&&n.exports?n.exports=g:this.xorwow=g})(k,i)})(q);var Ut=q.exports,J={exports:{}};J.exports;(function(i){(function(t,n,s){function c(u){var l=this;l.next=function(){var h=l.x,r=l.i,o,d;return o=h[r],o^=o>>>7,d=o^o<<24,o=h[r+1&7],d^=o^o>>>10,o=h[r+3&7],d^=o^o>>>3,o=h[r+4&7],d^=o^o<<7,o=h[r+7&7],o=o^o<<13,d^=o^o<<9,h[r]=d,l.i=r+1&7,d};function a(h,r){var o,d=[];if(r===(r|0))d[0]=r;else for(r=""+r,o=0;o<r.length;++o)d[o&7]=d[o&7]<<15^r.charCodeAt(o)+d[o+1&7]<<13;for(;d.length<8;)d.push(0);for(o=0;o<8&&d[o]===0;++o);for(o==8?d[7]=-1:d[o],h.x=d,h.i=0,o=256;o>0;--o)h.next()}a(l,u)}function p(u,l){return l.x=u.x.slice(),l.i=u.i,l}function g(u,l){u==null&&(u=+new Date);var a=new c(u),h=l&&l.state,r=function(){return(a.next()>>>0)/4294967296};return r.double=function(){do var o=a.next()>>>11,d=(a.next()>>>0)/4294967296,f=(o+d)/(1<<21);while(f===0);return f},r.int32=a.next,r.quick=r,h&&(h.x&&p(h,a),r.state=function(){return p(a,{})}),r}n&&n.exports?n.exports=g:this.xorshift7=g})(k,i)})(J);var Bt=J.exports,K={exports:{}};K.exports;(function(i){(function(t,n,s){function c(u){var l=this;l.next=function(){var h=l.w,r=l.X,o=l.i,d,f;return l.w=h=h+1640531527|0,f=r[o+34&127],d=r[o=o+1&127],f^=f<<13,d^=d<<17,f^=f>>>15,d^=d>>>12,f=r[o]=f^d,l.i=o,f+(h^h>>>16)|0};function a(h,r){var o,d,f,y,S,v=[],m=128;for(r===(r|0)?(d=r,r=null):(r=r+"\0",d=0,m=Math.max(m,r.length)),f=0,y=-32;y<m;++y)r&&(d^=r.charCodeAt((y+32)%r.length)),y===0&&(S=d),d^=d<<10,d^=d>>>15,d^=d<<4,d^=d>>>13,y>=0&&(S=S+1640531527|0,o=v[y&127]^=d+S,f=o==0?f+1:0);for(f>=128&&(v[(r&&r.length||0)&127]=-1),f=127,y=4*128;y>0;--y)d=v[f+34&127],o=v[f=f+1&127],d^=d<<13,o^=o<<17,d^=d>>>15,o^=o>>>12,v[f]=d^o;h.w=S,h.X=v,h.i=f}a(l,u)}function p(u,l){return l.i=u.i,l.w=u.w,l.X=u.X.slice(),l}function g(u,l){u==null&&(u=+new Date);var a=new c(u),h=l&&l.state,r=function(){return(a.next()>>>0)/4294967296};return r.double=function(){do var o=a.next()>>>11,d=(a.next()>>>0)/4294967296,f=(o+d)/(1<<21);while(f===0);return f},r.int32=a.next,r.quick=r,h&&(h.X&&p(h,a),r.state=function(){return p(a,{})}),r}n&&n.exports?n.exports=g:this.xor4096=g})(k,i)})(K);var jt=K.exports,Z={exports:{}};Z.exports;(function(i){(function(t,n,s){function c(u){var l=this,a="";l.next=function(){var r=l.b,o=l.c,d=l.d,f=l.a;return r=r<<25^r>>>7^o,o=o-d|0,d=d<<24^d>>>8^f,f=f-r|0,l.b=r=r<<20^r>>>12^o,l.c=o=o-d|0,l.d=d<<16^o>>>16^f,l.a=f-r|0},l.a=0,l.b=0,l.c=-1640531527,l.d=1367130551,u===Math.floor(u)?(l.a=u/4294967296|0,l.b=u|0):a+=u;for(var h=0;h<a.length+20;h++)l.b^=a.charCodeAt(h)|0,l.next()}function p(u,l){return l.a=u.a,l.b=u.b,l.c=u.c,l.d=u.d,l}function g(u,l){var a=new c(u),h=l&&l.state,r=function(){return(a.next()>>>0)/4294967296};return r.double=function(){do var o=a.next()>>>11,d=(a.next()>>>0)/4294967296,f=(o+d)/(1<<21);while(f===0);return f},r.int32=a.next,r.quick=r,h&&(typeof h=="object"&&p(h,a),r.state=function(){return p(a,{})}),r}n&&n.exports?n.exports=g:this.tychei=g})(k,i)})(Z);var zt=Z.exports,ht={exports:{}};const Wt={},qt=Object.freeze(Object.defineProperty({__proto__:null,default:Wt},Symbol.toStringTag,{value:"Module"})),Jt=Ht(qt);(function(i){(function(t,n,s){var c=256,p=6,g=52,u="random",l=s.pow(c,p),a=s.pow(2,g),h=a*2,r=c-1,o;function d(x,w,A){var E=[];w=w==!0?{entropy:!0}:w||{};var b=v(S(w.entropy?[x,_(n)]:x??m(),3),E),C=new f(E),N=function(){for(var $=C.g(p),L=l,O=0;$<a;)$=($+O)*c,L*=c,O=C.g(1);for(;$>=h;)$/=2,L/=2,O>>>=1;return($+O)/L};return N.int32=function(){return C.g(4)|0},N.quick=function(){return C.g(4)/4294967296},N.double=N,v(_(C.S),n),(w.pass||A||function($,L,O,R){return R&&(R.S&&y(R,C),$.state=function(){return y(C,{})}),O?(s[u]=$,L):$})(N,b,"global"in w?w.global:this==s,w.state)}function f(x){var w,A=x.length,E=this,b=0,C=E.i=E.j=0,N=E.S=[];for(A||(x=[A++]);b<c;)N[b]=b++;for(b=0;b<c;b++)N[b]=N[C=r&C+x[b%A]+(w=N[b])],N[C]=w;(E.g=function($){for(var L,O=0,R=E.i,G=E.j,P=E.S;$--;)L=P[R=r&R+1],O=O*c+P[r&(P[R]=P[G=r&G+L])+(P[G]=L)];return E.i=R,E.j=G,O})(c)}function y(x,w){return w.i=x.i,w.j=x.j,w.S=x.S.slice(),w}function S(x,w){var A=[],E=typeof x,b;if(w&&E=="object")for(b in x)try{A.push(S(x[b],w-1))}catch{}return A.length?A:E=="string"?x:x+"\0"}function v(x,w){for(var A=x+"",E,b=0;b<A.length;)w[r&b]=r&(E^=w[r&b]*19)+A.charCodeAt(b++);return _(w)}function m(){try{var x;return o&&(x=o.randomBytes)?x=x(c):(x=new Uint8Array(c),(t.crypto||t.msCrypto).getRandomValues(x)),_(x)}catch{var w=t.navigator,A=w&&w.plugins;return[+new Date,t,A,t.screen,_(n)]}}function _(x){return String.fromCharCode.apply(0,x)}if(v(s.random(),n),i.exports){i.exports=d;try{o=Jt}catch{}}else s["seed"+u]=d})(typeof self<"u"?self:k,[],Math)})(ht);var Kt=ht.exports,Zt=Xt,Qt=Yt,te=Ut,ee=Bt,ie=jt,ne=zt,F=Kt;F.alea=Zt;F.xor128=Qt;F.xorwow=te;F.xorshift7=ee;F.xor4096=ie;F.tychei=ne;var le=F;const se=Gt(le);function re(){e.canvas=document.getElementById("gameCanvas"),e.ctx=e.canvas.getContext("2d"),ot(),window.addEventListener("resize",ot),e.canvas.addEventListener("click",rt),window.addEventListener("keydown",s=>{s.code==="Space"&&(s.preventDefault(),rt())});const i=new j,t=i.addFolder("Tuning");t.add(e.tuning,"GRAVITY",.05,.5,.001),t.add(e.tuning,"BOUNCE_DAMPING",.3,.9,.01),t.add(e.tuning,"SPRING_BOOST",2,20,.5),t.add(e.tuning,"ROLLING_FRICTION",.95,.999,5e-4),t.add(e.tuning,"ROLLING_THRESHOLD",.05,1,.01),t.add(e.tuning,"MIN_ENERGY_THRESHOLD",.1,2,.05),t.add(e.tuning,"MIN_SPRING_DISTANCE",100,2e3,10),t.add(e.tuning,"MAX_SPRING_DISTANCE",200,3e3,10),t.add(e.tuning,"SPRING_SPAWN_DISTANCE",200,2e3,10);const n={seed:""};i.add(n,"seed").onFinishChange(s=>{e.rng=s?se(s):Math.random})}function rt(){if(e.gameState==="aiming")e.gameState="power_select";else if(e.gameState==="power_select")oe();else if(e.gameState==="flying"&&!e.penguin.isDiving&&e.penguin.y<e.GROUND_Y-D-5){e.penguin.isDiving=!0;const t=Math.sqrt(e.penguin.vx*e.penguin.vx+e.penguin.vy*e.penguin.vy)*$t,n=Ct*Math.PI/180;e.penguin.vx=t*Math.cos(n),e.penguin.vy=t*Math.sin(n)}else if(e.gameState==="rolling"&&e.canJumpFromRoll){const i=St*Math.PI/180;e.penguin.vy=-lt*Math.sin(i),e.penguin.vx+=lt*Math.cos(i),e.gameState="flying",e.canJumpFromRoll=!1}else e.gameState==="finished"&&ae()}function ot(){e.canvas.width=window.innerWidth,e.canvas.height=window.innerHeight,e.GROUND_Y=e.canvas.height*dt,e.CANNON_Y=e.GROUND_Y,e.gameState==="aiming"&&(e.penguin.x=I+Math.cos(e.cannonAngle)*T,e.penguin.y=e.CANNON_Y+Math.sin(e.cannonAngle)*T)}function oe(){const i=(it+e.powerValue/100*(vt-it))*at;e.penguin.vx=i*Math.cos(e.cannonAngle),e.penguin.vy=i*Math.sin(e.cannonAngle),e.gameState="flying",e.springs=[],e.lastSpringX=I,e.maxDistance=0,e.canJumpFromRoll=!0}function ae(){e.penguin.x=I,e.penguin.y=e.CANNON_Y-D,e.penguin.vx=0,e.penguin.vy=0,e.penguin.isDiving=!1,e.springs=[],e.cameraX=0,e.lastSpringX=0,e.maxDistance=0,e.gameState="aiming",e.canJumpFromRoll=!0,e.cannonAngle=-Math.PI/4,e.cannonRotationDirection=1,e.powerValue=50,e.powerDirection=1}function he(){for(;e.lastSpringX<e.penguin.x+e.tuning.SPRING_SPAWN_DISTANCE;){const i=e.tuning.MIN_SPRING_DISTANCE+e.rng()*(e.tuning.MAX_SPRING_DISTANCE-e.tuning.MIN_SPRING_DISTANCE),t=e.lastSpringX+i,n=e.GROUND_Y-X,s=nt[Math.floor(e.rng()*nt.length)];e.springs.push({x:t,y:n,width:s,used:!1}),e.lastSpringX=t}e.springs=e.springs.filter(i=>i.x>e.cameraX-200)}function ce(){for(const i of e.springs){if(i.used)continue;const t=X*.2,n=i.y,s=i.y+t,c=i.width*.3,p=i.x-c,g=i.x+i.width+c,u=e.penguin.x-D,l=e.penguin.x+D,a=e.penguin.y-D,h=e.penguin.y+D;if(l>p&&u<g&&h>n&&a<s&&e.penguin.vy>=0){const r=Math.max(Math.sqrt(e.penguin.vx*e.penguin.vx+e.penguin.vy*e.penguin.vy),e.tuning.SPRING_BOOST),o=Math.PI/4;e.penguin.vx=r*Math.cos(o),e.penguin.vy=-r*Math.sin(o),i.used=!0,e.canJumpFromRoll=!0,e.penguin.isDiving=!1}}}function ue(){if(e.gameState==="aiming"){e.cannonAngle+=ft*e.cannonRotationDirection,e.cannonAngle>=et?(e.cannonAngle=et,e.cannonRotationDirection=-1):e.cannonAngle<=tt&&(e.cannonAngle=tt,e.cannonRotationDirection=1),e.penguin.x=I+Math.cos(e.cannonAngle)*T,e.penguin.y=e.CANNON_Y+Math.sin(e.cannonAngle)*T;return}if(e.gameState==="power_select"){e.powerValue+=mt*e.powerDirection,e.powerValue>=100?(e.powerValue=100,e.powerDirection=-1):e.powerValue<=0&&(e.powerValue=0,e.powerDirection=1);return}if(e.gameState==="rolling"){e.penguin.vx*=e.tuning.ROLLING_FRICTION,e.penguin.x+=e.penguin.vx,e.penguin.y=e.GROUND_Y-D,Math.abs(e.penguin.vx)<e.tuning.ROLLING_THRESHOLD&&(e.gameState="finished");const t=Math.max(0,e.penguin.x-I);e.maxDistance=Math.max(e.maxDistance,t),e.cameraX=Math.max(0,e.penguin.x-e.canvas.width/3);return}if(e.gameState!=="flying")return;e.penguin.vy+=e.tuning.GRAVITY,e.penguin.x+=e.penguin.vx,e.penguin.y+=e.penguin.vy,e.penguin.y>=e.GROUND_Y-D&&(e.penguin.y=e.GROUND_Y-D,e.penguin.vy=-e.penguin.vy*e.tuning.BOUNCE_DAMPING,e.penguin.vx*=.95,e.penguin.isDiving=!1,.5*e.penguin.mass*(e.penguin.vx*e.penguin.vx+e.penguin.vy*e.penguin.vy)<e.tuning.MIN_ENERGY_THRESHOLD&&Math.abs(e.penguin.vy)<8&&(e.gameState="rolling",e.penguin.vy=0,e.penguin.vx*=e.tuning.ROLLING_SPEED_MULTIPLIER)),ce(),he();const i=Math.max(0,e.penguin.x-I);e.maxDistance=Math.max(e.maxDistance,i),e.cameraX=Math.max(0,e.penguin.x-e.canvas.width/3)}function de(){const i=e.ctx;i.clearRect(0,0,e.canvas.width,e.canvas.height);const t=i.createLinearGradient(0,0,0,e.GROUND_Y);if(t.addColorStop(0,"#87CEEB"),t.addColorStop(1,"#E0F6FF"),i.fillStyle=t,i.fillRect(0,0,e.canvas.width,e.GROUND_Y),i.fillStyle="#8B7355",i.fillRect(0,e.GROUND_Y,e.canvas.width,e.canvas.height-e.GROUND_Y),i.save(),i.translate(-e.cameraX,0),i.strokeStyle="#654321",i.lineWidth=3,i.beginPath(),i.moveTo(0,e.GROUND_Y),i.lineTo(e.cameraX+e.canvas.width,e.GROUND_Y),i.stroke(),(e.gameState==="aiming"||e.gameState==="power_select")&&(i.save(),i.translate(I,e.CANNON_Y),i.rotate(e.cannonAngle),i.fillStyle="#000",i.fillRect(0,-Q/2,T,Q),i.restore(),i.fillStyle="#333",i.beginPath(),i.arc(I,e.CANNON_Y,15,0,Math.PI*2),i.fill()),e.springs.forEach(n=>{i.fillStyle=n.used?"#999":"#32CD32",i.fillRect(n.x,n.y,n.width,X),i.strokeStyle=n.used?"#666":"#228B22",i.lineWidth=2;for(let c=0;c<5;c++){const p=n.y+c*X/5;i.beginPath(),i.moveTo(n.x,p),i.lineTo(n.x+n.width,p),i.stroke()}i.font="20px Arial";const s=n.x+n.width/2-10;i.fillText("🌀",s,n.y+25)}),e.gameState==="rolling"&&(i.fillStyle="red",i.beginPath(),i.arc(e.penguin.x,e.penguin.y,D+5,0,Math.PI*2),i.fill()),i.fillStyle="#4169E1",i.beginPath(),i.arc(e.penguin.x,e.penguin.y,D,0,Math.PI*2),i.fill(),i.font="25px Arial",i.fillText("🐧",e.penguin.x-12,e.penguin.y+8),i.restore(),e.gameState==="power_select"){const n=e.canvas.width/2-H/2,s=100;i.fillStyle="rgba(0, 0, 0, 0.5)",i.fillRect(n-10,s-10,H+20,Y+40),i.fillStyle="white",i.font="20px Arial",i.textAlign="center",i.fillText("POWER",e.canvas.width/2,s-20),i.strokeStyle="white",i.lineWidth=2,i.strokeRect(n,s,H,Y);const c=e.powerValue/100*H;i.fillStyle="#4CAF50",i.fillRect(n,s,c,Y),i.textAlign="left"}if(e.gameState==="aiming"&&(i.fillStyle="white",i.font="bold 24px Arial",i.textAlign="center",i.fillText("Press SPACE or CLICK to lock angle",e.canvas.width/2,100),i.textAlign="left"),e.gameState==="finished"){i.fillStyle="rgba(0, 0, 0, 0.7)",i.fillRect(0,0,e.canvas.width,e.canvas.height);const n=400,s=250,c=e.canvas.width/2-n/2,p=e.canvas.height/2-s/2;i.fillStyle="white",i.fillRect(c,p,n,s),i.fillStyle="#333",i.font="bold 36px Arial",i.textAlign="center",i.fillText("Game Over!",e.canvas.width/2,p+60);const g=Math.max(0,Math.round(e.maxDistance/10));i.font="bold 48px Arial",i.fillStyle="#4CAF50",i.fillText(g+"m",e.canvas.width/2,p+120);const u=200,l=50,a=e.canvas.width/2-u/2,h=p+s-80;i.fillStyle="#4CAF50",i.fillRect(a,h,u,l),i.fillStyle="white",i.font="bold 24px Arial",i.fillText("Play Again",e.canvas.width/2,h+33),i.textAlign="left"}pe()}function pe(){const i=Math.max(0,Math.round(e.maxDistance/10)),n=(Math.sqrt(e.penguin.vx*e.penguin.vx+e.penguin.vy*e.penguin.vy)/at).toFixed(1),s=document.getElementById("distance"),c=document.getElementById("speed-display");s&&(s.textContent=String(i)),c&&(c.textContent=e.gameState==="flying"||e.gameState==="rolling"?String(n):"0")}function ct(){ue(),de(),requestAnimationFrame(ct)}window.addEventListener("load",()=>{re(),requestAnimationFrame(ct)});
