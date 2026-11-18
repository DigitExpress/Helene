var SV=[
["Bureautique et impression","🖨️","Impression noir & blanc","La page A4",50],
["Bureautique et impression","🎨","Impression couleur","La page A4",150],
["Bureautique et impression","⌨️","Saisie de document","La page",500],
["Bureautique et impression","📑","Mise en page mémoire / rapport","Forfait",2500],
["Bureautique et impression","📄","CV professionnel","Rédaction et design",3000],
["Assistance informatique et numérique","💻","Installation Windows / Office","Par ordinateur",5000],
["Assistance informatique et numérique","🛠️","Maintenance et nettoyage PC","Par ordinateur",5000],
["Assistance informatique et numérique","📧","Création de comptes e-mail","Par compte",1000],
["Création de supports de communication","✏️","Création de logo","Identité visuelle",15000],
["Création de supports de communication","💳","Carte de visite","Conception",5000],
["Création de supports de communication","📣","Flyer / Affiche","Conception",5000],
["Création de supports de communication","📱","Visuels réseaux sociaux","Lot de 3",3000],
["Services administratifs aux professionnels","🧾","Courrier, devis ou facture","Rédaction",2500],
["Services administratifs aux professionnels","🗂️","Dossier administratif","Préparation",4000],
["Fournitures et personnalisation","☕","Tasse personnalisée","À l’unité",3500],
["Fournitures et personnalisation","👕","T-shirt personnalisé","À l’unité",5000],
["Vente d’appareils","💻","Vente d’ordinateur portable","À partir de · neuf ou occasion",150000],
["Vente d’appareils","📱","Vente de téléphone portable","À partir de · neuf ou occasion",50000]
].map(function(s,i){return{id:i,cat:s[0],ico:s[1],nom:s[2],desc:s[3],prix:s[4]}});

var W3F_KEY="7b5912d9-c59e-42af-9363-23d920b165d3";
var WA="221711569524",cart={},cat="Tous";
function $(i){return document.getElementById(i)}
function f(n){return n.toLocaleString("fr-FR").replace(/[\u202f\u00a0]/g," ")+" FCFA"}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function toast(t){var e=$("toast");e.textContent=t;e.style.display="block";clearTimeout(toast.t);toast.t=setTimeout(function(){e.style.display="none"},1800)}
function total(){var t=0,n=0;for(var k in cart){t+=SV[k].prix*cart[k];n+=cart[k]}return{t:t,n:n}}
function save(){try{localStorage.setItem("dx_cart",JSON.stringify(cart))}catch(e){}}

function renderFilters(){var cs=["Tous"];SV.forEach(function(s){if(cs.indexOf(s.cat)<0)cs.push(s.cat)});
$("filters").innerHTML=cs.map(function(c){return'<button class="chip'+(c===cat?" on":"")+'" data-c="'+esc(c)+'">'+esc(c)+'</button>'}).join("")}
function renderGrid(){$("grid").innerHTML=SV.filter(function(s){return cat==="Tous"||s.cat===cat}).map(function(s,i){
return'<div class="card" style="animation-delay:'+i*40+'ms"><div class="ico">'+s.ico+'</div><h3>'+s.nom+'</h3><small>'+s.desc+'</small><div class="row"><div class="price">'+f(s.prix)+'</div><button class="add" data-a="'+s.id+'">🛒 Ajouter</button></div></div>'}).join("")}
function lines(){return Object.keys(cart).map(function(k){var s=SV[k];return'<div class="item"><div class="n">'+s.ico+' '+s.nom+'<small>'+f(s.prix)+'</small></div><div class="qty"><button data-m="'+k+'">−</button><b>'+cart[k]+'</b><button data-p="'+k+'">+</button></div><button class="del" data-d="'+k+'" aria-label="Supprimer">🗑️</button></div>'}).join("")}
function renderCart(){var T=total();$("cnt").textContent=T.n;save();
var empty='<div class="empty">Votre panier est vide 🛍️<br><br><a class="btn" href="#services" data-close="cartOv">Voir les services</a></div>';
$("cartBody").innerHTML=T.n?lines()+'<div class="tot"><span>Total</span><span>'+f(T.t)+'</span></div><a class="btn full" href="#commande" data-close="cartOv">Passer la commande →</a>':empty;
$("sumBody").innerHTML=T.n?lines():empty.replace(' data-close="cartOv"','');
$("sumTot").textContent=f(T.t)}

function open(i){$(i).classList.add("on")}function close(i){$(i).classList.remove("on")}
document.addEventListener("click",function(e){var t=e.target,d;
if(t.closest("#openCart")){open("cartOv");return}
if(d=t.getAttribute("data-close")){close(d);return}
if(t.classList.contains("ov")){t.classList.remove("on");return}
if(t.dataset.c){cat=t.dataset.c;renderFilters();renderGrid();return}
if(t.dataset.a!==undefined){cart[t.dataset.a]=(cart[t.dataset.a]||0)+1;renderCart();toast("✓ "+SV[t.dataset.a].nom+" ajouté au panier");var b=$("openCart");b.classList.remove("pop");void b.offsetWidth;b.classList.add("pop");return}
if(t.dataset.p){cart[t.dataset.p]++;renderCart();return}
if(t.dataset.m){if(--cart[t.dataset.m]<=0)delete cart[t.dataset.m];renderCart();return}
if(t.dataset.d){delete cart[t.dataset.d];renderCart()}
});
document.querySelectorAll('input[name="pay"]').forEach(function(r){r.addEventListener("change",function(){document.querySelectorAll(".pay").forEach(function(p){p.classList.toggle("sel",p.querySelector("input").checked)})})});
function bad(id,msg){var el=$(id);el.classList.add("err");el.nextElementSibling.textContent=msg;return false}

function sendMail(ref,nom,tel,mail,pay,msg,tot){
if(!W3F_KEY||W3F_KEY.indexOf("COLLEZ")===0)return Promise.resolve(false);
var data={access_key:W3F_KEY,subject:"Nouvelle commande Digit’Express "+ref,from_name:"Digit’Express — site web",name:nom,phone:tel,reference:ref,paiement:pay,total:f(tot),message:msg,botcheck:""};
if(mail)data.email=mail;
return fetch("https://api.web3forms.com/submit",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(data)})
.then(function(r){return r.json()}).then(function(r){return!!r.success}).catch(function(){return false})}

$("confirm").addEventListener("click",function(){
["f_nom","f_tel","f_mail"].forEach(function(i){$(i).classList.remove("err");$(i).nextElementSibling.textContent=""});
var ok=true,nom=$("f_nom").value.trim(),tel=$("f_tel").value.trim(),mail=$("f_mail").value.trim(),T=total();
if(!T.n){toast("Ajoutez d’abord un service au panier");location.hash="services";return}
if(nom.length<3)ok=bad("f_nom","Entrez votre nom complet");
if(tel.replace(/\D/g,"").length<9)ok=bad("f_tel","Numéro invalide (9 chiffres min.)");
if(mail&&!/^\S+@\S+\.\S+$/.test(mail))ok=bad("f_mail","Adresse e-mail invalide");
if(!ok){$("orderForm").scrollIntoView({behavior:"smooth",block:"start"});return}
var pay=document.querySelector('input[name="pay"]:checked').value,d=new Date();
var ref="DX-"+String(d.getFullYear()).slice(2)+("0"+(d.getMonth()+1)).slice(-2)+("0"+d.getDate()).slice(-2)+"-"+Math.floor(1000+Math.random()*9000);
var txt=Object.keys(cart).map(function(k){return"• "+cart[k]+" × "+SV[k].nom+" = "+f(SV[k].prix*cart[k])}).join("\n");
var msg="Bonjour Digit’Express 👋\nNouvelle commande "+ref+"\n\n"+txt+"\n\nTOTAL : "+f(T.t)+"\nPaiement : "+pay+"\n\nClient : "+nom+"\nTél : "+tel+(mail?"\nE-mail : "+mail:"")+"\nRéception : "+$("f_mode").value+($("f_adr").value?" — "+$("f_adr").value:"")+($("f_note").value?"\nRemarques : "+$("f_note").value:"");
$("okNom").textContent=nom;$("okRef").textContent=ref;
$("okInstr").innerHTML="<b>💳 Paiement par "+esc(pay)+"</b><br>1. Envoyez <b>"+f(T.t)+"</b> au <b>71 156 95 24</b> (Digit’Express) via "+esc(pay)+".<br>2. Indiquez la référence <b>"+ref+"</b>.<br>3. Cliquez ci-dessous pour nous transmettre votre commande et la preuve de paiement.<br><br>Nous confirmons le prix et le délai avant de commencer.";
$("okWa").href="https://wa.me/"+WA+"?text="+encodeURIComponent(msg);
var st=$("okMail");st.textContent="📧 Envoi de la notification par e-mail…";
sendMail(ref,nom,tel,mail,pay,msg,T.t).then(function(r){st.textContent=r?"📧 Commande aussi transmise par e-mail à Digit’Express ✅":"⚠️ E-mail non envoyé : utilisez le bouton WhatsApp ci-dessous."});
open("okOv");cart={};renderCart();$("orderForm").reset();
document.querySelectorAll(".pay").forEach(function(p,i){p.classList.toggle("sel",i===0)})});
$("okClose").addEventListener("click",function(){close("okOv")});

try{var s=JSON.parse(localStorage.getItem("dx_cart")||"{}");for(var k in s)if(SV[k])cart[k]=s[k]}catch(e){}
renderFilters();renderGrid();renderCart();
