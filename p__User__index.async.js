"use strict";(self.webpackChunkface_train=self.webpackChunkface_train||[]).push([[522],{27049:function(ze,b,n){n.r(b),n.d(b,{default:function(){return We},upurls:function(){return Le}});var te=n(15009),j=n.n(te),re=n(99289),S=n.n(re),ie=n(5574),H=n.n(ie),se=n(46561),L=n(94283),$=n(26713),le=n(96074),ue=n(86738),K=n(32983),B=n(71577),I=n(67294),oe=n(97857),J=n.n(oe),ce=n(19632),O=n.n(ce),de=n(68432),fe=n(58831),ve=n(45699),he=n(8751),Q=n(50888),X=n(99611),me=n(48689),z=n(97269),Y=n(5966),ge=n(97462),W=n(69400),q=n(81005),pe=n(91978),_=n(31324),ye=n(72004),xe=n.n(ye),je=n(12444),Ce=n.n(je),Re=n(25098),Ze=n.n(Re),Ie=n(31996),we=n.n(Ie),Me=n(26037),Se=n.n(Me),ke=n(9783),Oe=n.n(ke),Te=n(49520),Ee=function(C){we()(u,C);var g=Se()(u);function u(){var x;return Ce()(this,u),x=g.call(this,"Database"),Oe()(Ze()(x),"faceInfos",void 0),x.version(1).stores({faceInfos:"++id,name,phone,*faces"}),x}return xe()(u)}(Te.ZP),E=new Ee,U,ee=function(){var C=S()(j()().mark(function g(){var u;return j()().wrap(function(p){for(;;)switch(p.prev=p.next){case 0:return U||(u=new Worker("./faceWorker5.js"),U=new Promise(function(r){var h=function v(t){t.data.action==="init"&&(u.removeEventListener("message",v),r(u))};u.addEventListener("message",h),u.postMessage({action:"init"})})),p.next=3,U;case 3:return p.abrupt("return",p.sent);case 4:case"end":return p.stop()}},g)}));return function(){return C.apply(this,arguments)}}(),e=n(85893),V,Ve=function(C){var g,u=(0,I.useRef)(null),x=function(){var p=S()(j()().mark(function r(h){var v,t,d;return j()().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:if(!u.current){i.next=12;break}if(!(h.data.action==="res"&&h.data.name===C.img.name&&g)){i.next=12;break}return V.removeEventListener("message",x),v=h.data.data,t=v.map(function(l,f){var o=g.getImageData(l.x,l.y,l.width,l.height),a=new OffscreenCanvas(l.width,l.height),c=a.getContext("2d");return c.putImageData(o,0,0),a.convertToBlob().then(function(s){return{file:new File([s],"".concat(f,"_").concat(C.img.name),{type:s.type}),x:l.x,y:l.y,i:f}})}),i.next=7,Promise.all(t);case 7:d=i.sent,C.onOk({name:C.img.name,faces:d}),g.lineWidth=5,g.strokeStyle="deepskyblue",v.forEach(function(l){g.strokeRect(l.x,l.y,l.width,l.height)});case 12:case"end":return i.stop()}},r)}));return function(h){return p.apply(this,arguments)}}();return(0,I.useEffect)(function(){return console.log("imgcanvas.load"),ee().then(function(p){V=p,u.current&&(g=u.current.getContext("2d",{willReadFrequently:!0}),createImageBitmap(C.img).then(function(r){if(u.current&&g){u.current.width=r.width,u.current.height=r.height,g.drawImage(r,0,0);var h=g.getImageData(0,0,r.width,r.height).data.buffer;V.addEventListener("message",x),V.postMessage({action:"detection",name:C.img.name,buffer:h,width:r.width,height:r.height},[h])}}))}),function(){var p;(p=V)===null||p===void 0||p.removeEventListener("message",x)}},[]),(0,e.jsx)("canvas",{ref:u,id:C.img.name,style:{maxWidth:"100%",maxHeight:"400px"}})},De=n(34041),G,w,D,A,P,F,Pe=function(C){var g=(0,I.useRef)(null),u=(0,I.useRef)(null),x=(0,I.useRef)(null),p=(0,I.useState)(),r=H()(p,2),h=r[0],v=r[1],t=function(){var o,a=(o=x.current)===null||o===void 0?void 0:o.getVideoTracks();return(a==null?void 0:a.length)===1?a[0].label:"cameraNameReturnUndefined"},d=function(){var f=S()(j()().mark(function o(){var a;return j()().wrap(function(s){for(;;)switch(s.prev=s.next){case 0:if(!(u.current&&D)){s.next=5;break}return D.drawImage(u.current,0,0),a=D.getImageData(0,0,P,F).data.buffer,s.next=5,G.then(function(m){m.postMessage({action:"detection",name:t(),buffer:a,width:P,height:F},[a])});case 5:A=setTimeout(function(){d()},3e3);case 6:case"end":return s.stop()}},o)}));return function(){return f.apply(this,arguments)}}(),y=function(){var f=S()(j()().mark(function o(a){var c,s,m,M,k;return j()().wrap(function(R){for(;;)switch(R.prev=R.next){case 0:return(c=x.current)===null||c===void 0||c.getTracks().forEach(function(Z){Z.stop()}),s={video:a?{deviceId:{exact:a}}:!0},R.prev=2,R.next=5,navigator.mediaDevices.getUserMedia(s);case 5:m=R.sent,x.current=m,M=m.getVideoTracks(),M.length>0&&(k=M[0].getSettings(),P=k.width,F=k.height,D=new OffscreenCanvas(P,F).getContext("2d",{willReadFrequently:!0})),u.current&&(u.current.srcObject=m),R.next=16;break;case 12:R.prev=12,R.t0=R.catch(2),W.Z.error({title:R.t0.message}),C.onOk(void 0);case 16:case"end":return R.stop()}},o,null,[[2,12]])}));return function(a){return f.apply(this,arguments)}}(),i=function(){var f=S()(j()().mark(function o(a){var c,s,m,M,k;return j()().wrap(function(R){for(;;)switch(R.prev=R.next){case 0:if(!(a.data.action==="res"&&a.data.name===t())){R.next=10;break}return clearTimeout(A),c=a.data.data,s=c.map(function(Z,T){var $e=D.getImageData(Z.x,Z.y,Z.width,Z.height),ne=new OffscreenCanvas(Z.width,Z.height),Be=ne.getContext("2d");return Be.putImageData($e,0,0),ne.convertToBlob().then(function(ae){return{file:new File([ae],"".concat(T,"_").concat(t()),{type:ae.type}),x:Z.x,y:Z.y,i:T}})}),R.next=6,Promise.all(s);case 6:m=R.sent,w&&(M=w.canvas.width/P,k=w.canvas.height/F,w.clearRect(0,0,w.canvas.width,w.canvas.height),w.lineWidth=3,w.strokeStyle="deepskyblue",c.forEach(function(Z){var T;(T=w)===null||T===void 0||T.strokeRect(Z.x*M,Z.y*k,Z.width*M,Z.height*k)})),C.onOk({name:t(),faces:m,ctx:w}),A=setTimeout(function(){d()},500);case 10:case"end":return R.stop()}},o)}));return function(a){return f.apply(this,arguments)}}(),l=function(){var f=S()(j()().mark(function o(){var a;return j()().wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return s.next=2,navigator.mediaDevices.enumerateDevices();case 2:return a=s.sent,s.abrupt("return",a.filter(function(m){return m.kind==="videoinput"}).map(function(m){return{label:m.label,value:m.deviceId,selected:!0}}));case 4:case"end":return s.stop()}},o)}));return function(){return f.apply(this,arguments)}}();return(0,I.useEffect)(function(){var f;w=(f=g.current)===null||f===void 0?void 0:f.getContext("2d");var o=l();return G=ee().then(function(a){return a.addEventListener("message",i),a}),y().then(S()(j()().mark(function a(){var c;return j()().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return m.next=2,o;case 2:c=m.sent,c.length>0&&v(c);case 4:case"end":return m.stop()}},a)}))),function(){var a;clearTimeout(A),G.then(function(c){c.removeEventListener("message",i)}),(a=x.current)===null||a===void 0||a.getTracks().forEach(function(c){c.stop()})}},[]),(0,e.jsxs)("div",{style:{position:"relative"},children:[h?(0,e.jsx)(De.Z,{defaultValue:t(),style:{width:140,position:"absolute",top:-37,right:30},onChange:function(o){return y(o)},options:h}):null,(0,e.jsx)("video",{ref:u,onCanPlay:function(){console.log("onCanPlay"),d()},autoPlay:!0,playsInline:!0,style:{maxWidth:"100%",height:"100%"}}),(0,e.jsx)("canvas",{ref:g,style:{width:"100%",height:"100%",left:0,position:"absolute"}})]})},Fe=function(C){var g=(0,I.useRef)(null),u=C.modalVisible,x=C.onCancel,p=C.faceinfo,r=(0,I.useRef)();(0,I.useEffect)(function(){if(u===2){var v;(v=r.current)===null||v===void 0||v.setFieldsValue(p)}else{var t;(t=r.current)===null||t===void 0||t.resetFields()}},[u]);var h=(0,_.useIntl)();return(0,e.jsx)(W.Z,{title:u===1?h.formatMessage({id:"user.adduser"}):h.formatMessage({id:"user.edituser"}),width:420,open:u>0,maskClosable:!1,onCancel:function(){x()},onOk:function(){var t;(t=r.current)===null||t===void 0||t.submit()},children:(0,e.jsxs)(z.A,{formRef:r,initialValues:void 0,onChange:function(){},submitter:!1,layout:"horizontal",onFinish:function(){var v=S()(j()().mark(function t(d){return j()().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:if(!(d.faces&&d.faces.length>0)){i.next=13;break}if(u!==1){i.next=6;break}return i.next=4,E.faceInfos.add(d);case 4:i.next=9;break;case 6:if(u!==2){i.next=9;break}return i.next=9,E.faceInfos.put(d);case 9:q.ZP.success(h.formatMessage({id:"success"})),x(),i.next=14;break;case 13:q.ZP.warning(h.formatMessage({id:"user.faceeditwarn"}));case 14:case"end":return i.stop()}},t)}));return function(t){return v.apply(this,arguments)}}(),children:[(0,e.jsx)(z.A.Item,{name:"id",noStyle:!0}),(0,e.jsx)(Y.Z,{name:"name",rules:[{required:!0}],labelCol:{span:4},label:h.formatMessage({id:"user.name"})}),(0,e.jsx)(Y.Z,{name:"phone",labelCol:{span:4},label:h.formatMessage({id:"user.phone"})}),(0,e.jsxs)($.Z,{wrap:!0,children:[(0,e.jsx)(B.Z,{style:{marginBottom:10},icon:(0,e.jsx)(de.Z,{}),onClick:S()(j()().mark(function v(){var t;return j()().wrap(function(y){for(;;)switch(y.prev=y.next){case 0:t=W.Z.info({title:h.formatMessage({id:"user.Testing"}),icon:(0,e.jsx)(fe.Z,{}),closable:!0,centered:!0,content:(0,e.jsx)("div",{style:{marginLeft:-35},children:(0,e.jsx)(Pe,{onOk:function(l){if(r.current&&l&&l.faces.length>0){var f,o=(f=r.current.getFieldValue("faces"))!==null&&f!==void 0?f:[];r.current.setFieldValue("faces",[].concat(O()(o),O()(l.faces.map(function(a){return a.file})))),t.destroy()}}})})});case 1:case"end":return y.stop()}},v)})),children:h.formatMessage({id:"user.facebyvideo"})}),(0,e.jsx)(B.Z,{onClick:function(){var t;(t=g.current)===null||t===void 0||t.click()},style:{marginBottom:10},icon:(0,e.jsx)(ve.Z,{}),children:h.formatMessage({id:"user.facebyimg"})}),(0,e.jsx)("input",{ref:g,style:{display:"none"},type:"file",multiple:!0,onChange:function(t){if(r.current&&t.target.files&&t.target.files.length>0)var d,y=(d=r.current.getFieldValue("faces"))!==null&&d!==void 0?d:[],i=O()(t.target.files),l=[],f=function(c){l.push(c);var s=l.filter(function(m){return m.faces}).length===i.length;o.update(function(m){return J()(J()({},m),{},{title:h.formatMessage({id:"user.testResult"},{faces:(l==null?void 0:l.flatMap(function(M){return M.faces}).length)||0,imgs:(l==null?void 0:l.filter(function(M){return M.faces}).length)||0,imgcount:(i==null?void 0:i.length)||0}),okButtonProps:{loading:!s},icon:s?(0,e.jsx)(he.Z,{}):(0,e.jsx)(Q.Z,{})})})},o=W.Z.confirm({title:h.formatMessage({id:"user.Testing"}),icon:(0,e.jsx)(Q.Z,{}),closable:!0,width:500,centered:!0,onOk:function(){var c;r==null||(c=r.current)===null||c===void 0||c.setFieldValue("faces",[].concat(O()(y),O()(l.flatMap(function(s){return s.faces}).map(function(s){return s.file}))))},content:(0,e.jsx)("div",{style:{textAlign:"center",marginLeft:-34},children:(0,e.jsx)(pe.Z,{style:{display:"grid"},infinite:!1,draggable:!0,children:i.map(function(a){return(0,e.jsx)("div",{children:(0,e.jsx)(Ve,{img:a,onOk:f})},a.name)})})})})}})]}),(0,e.jsx)(z.A.Item,{name:"faces",noStyle:!0,children:(0,e.jsx)(ge.Z,{name:["faces"],children:function(t){var d=t.faces;return(0,e.jsx)(L.Z.PreviewGroup,{children:(0,e.jsx)($.Z,{wrap:!0,children:d==null?void 0:d.map(function(y,i){return(0,e.jsx)("div",{style:{padding:8,border:"1px solid #d9d9d9",borderRadius:8},children:(0,e.jsx)(L.Z,{src:URL.createObjectURL(y),width:100,height:100,preview:{mask:(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(X.Z,{style:{padding:5}}),(0,e.jsx)(me.Z,{style:{padding:5},onClick:function(f){var o,a;f.stopPropagation();var c=(o=r.current)===null||o===void 0?void 0:o.getFieldValue("faces");c.splice(i,1),(a=r.current)===null||a===void 0||a.setFieldValue("faces",O()(c))}})]})}})},i)})})})}})})]})})},Le,N=void 0,We=function(){var C=(0,I.useState)(0),g=H()(C,2),u=g[0],x=g[1],p=(0,I.useRef)(),r=(0,_.useIntl)(),h=[{title:"ID",dataIndex:"id",width:40},{title:r.formatMessage({id:"user.name"}),dataIndex:"name"},{title:r.formatMessage({id:"user.phone"}),dataIndex:"phone"},{title:r.formatMessage({id:"user.faceimg"}),dataIndex:"faces",render:function(t,d){var y;return(0,e.jsx)(L.Z.PreviewGroup,{children:(0,e.jsx)($.Z,{wrap:!0,children:(y=d.faces)===null||y===void 0?void 0:y.map(function(i,l){return(0,e.jsx)(L.Z,{width:30,height:30,src:URL.createObjectURL(i),preview:{mask:(0,e.jsx)(X.Z,{})}},l)})})},"facesimg")}},{title:r.formatMessage({id:"user.handle"}),valueType:"option",width:100,align:"center",render:function(t,d){return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)("a",{onClick:function(){N=d,x(2)},children:r.formatMessage({id:"user.edit"})}),(0,e.jsx)(le.Z,{type:"vertical"}),(0,e.jsx)(ue.Z,{title:r.formatMessage({id:"user.deleteprompt"}),onConfirm:function(){var i;E.faceInfos.delete(d.id),(i=p.current)===null||i===void 0||i.reload()},children:(0,e.jsx)("a",{children:r.formatMessage({id:"user.delete"})})})]})}}];return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(se.Z,{tableLayout:"auto",headerTitle:r.formatMessage({id:"user.header"}),actionRef:p,rowKey:"id",columns:h,scroll:{y:"calc(100vh - 280px)"},search:!1,cardBordered:!0,options:{setting:!1,density:!1},pagination:{pageSize:5},locale:{emptyText:(0,e.jsx)(K.Z,{image:K.Z.PRESENTED_IMAGE_SIMPLE,description:r.formatMessage({id:"user.datatip"})})},toolBarRender:function(){return[(0,e.jsx)(B.Z,{type:"primary",onClick:function(){N=void 0,x(1)},children:r.formatMessage({id:"user.adduser"})},"1")]},request:function(){var v=S()(j()().mark(function t(d){var y,i,l,f,o,a;return j()().wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return l=(y=d.pageSize)!==null&&y!==void 0?y:15,f=l*(((i=d.current)!==null&&i!==void 0?i:1)-1),s.next=4,E.faceInfos.count();case 4:return o=s.sent,s.next=7,E.faceInfos.orderBy("id").reverse().offset(f).limit(l).toArray();case 7:return a=s.sent,s.abrupt("return",{data:a,total:o});case 9:case"end":return s.stop()}},t)}));return function(t){return v.apply(this,arguments)}}()}),(0,e.jsx)(Fe,{onCancel:function(){var t;x(0),(t=p.current)===null||t===void 0||t.reload()},faceinfo:N,modalVisible:u})]})}}}]);
