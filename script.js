// Naama Melzer portfolio — lightweight interactions
(() => {
  "use strict";
  function initProjectSliders(){
    document.querySelectorAll(".project-slider").forEach(slider=>{
      const track=slider.querySelector(".project-track");
      const images=track ? Array.from(track.querySelectorAll("img")) : [];
      const prev=slider.querySelector(".project-prev");
      const next=slider.querySelector(".project-next");
      const counter=slider.querySelector(".project-frame-count");
      if(!track || images.length<2)return;
      let index=0;
      const show=()=>{
        track.style.transform=`translateX(-${index*100}%)`;
        if(counter)counter.textContent=`${String(index+1).padStart(2,"0")} / ${String(images.length).padStart(2,"0")}`;
      };
      if(prev)prev.addEventListener("click",()=>{index=(index-1+images.length)%images.length;show();});
      if(next)next.addEventListener("click",()=>{index=(index+1)%images.length;show();});
      let startX=null;
      slider.addEventListener("touchstart",event=>{startX=event.changedTouches[0].clientX;},{passive:true});
      slider.addEventListener("touchend",event=>{
        if(startX===null)return;
        const delta=event.changedTouches[0].clientX-startX;
        if(delta < -40)index=(index+1)%images.length;
        if(delta > 40)index=(index-1+images.length)%images.length;
        startX=null;show();
      },{passive:true});
      show();
    });
  }
  function initContactForm(){
    const form=document.getElementById("contact-form");
    if(!form)return;
    const button=document.getElementById("submit-btn");
    const status=document.getElementById("form-status");
    const endpoint="https://formsubmit.co/ajax/naamamelzer@gmail.com";
    if(!button||!status)return;
    const original=button.innerHTML;
    form.addEventListener("submit",async event=>{
      event.preventDefault();
      if(!form.reportValidity())return;
      button.disabled=true;button.setAttribute("aria-disabled","true");form.setAttribute("aria-busy","true");
      button.textContent="SENDING…";status.textContent="Sending your message…";status.className="form-status";
      try{
        const payload=new URLSearchParams();
        for(const [key,value] of new FormData(form).entries())payload.append(key,value);
        const response=await fetch(endpoint,{method:"POST",headers:{"Accept":"application/json","Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},body:payload.toString()});
        const result=await response.json();
        if(!response.ok||!(result.success===true||result.success==="true"))throw new Error(result.message||"Message not accepted");
        status.textContent="Thank you — your message has been sent. Naama will get back to you soon.";
        status.classList.add("is-success");form.reset();
      }catch(error){
        console.error("Contact form submission failed:",error);
        status.textContent="Sorry, the message could not be sent. Please email naamamelzer@gmail.com or contact Naama on WhatsApp.";
        status.classList.add("is-error");
      }finally{
        button.disabled=false;button.removeAttribute("aria-disabled");form.removeAttribute("aria-busy");button.innerHTML=original;
      }
    });
  }
  document.addEventListener("DOMContentLoaded",()=>{
    initProjectSliders();initContactForm();
    document.querySelectorAll(".current-year").forEach(node=>node.textContent=String(new Date().getFullYear()));
  });
})();