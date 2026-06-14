const themeValues = ["light", "auto", "dark"] as const;

export type Theme = (typeof themeValues)[number];

export const DEFAULT_THEME: Theme = "auto";
const THEME_STORAGE_KEY = "theme";

const serializedThemeValues = JSON.stringify(themeValues);

export const themeInitScript = `(function(){try{var k=${JSON.stringify(
  THEME_STORAGE_KEY,
)},d=${JSON.stringify(
  DEFAULT_THEME,
)},m=${serializedThemeValues},r=document.documentElement;function v(t){return m.indexOf(t)!==-1}function g(){try{var t=localStorage.getItem(k);return v(t)?t:d}catch(e){return d}}function s(t){var i=document.querySelector('input[name="theme"][value="'+t+'"]');if(i)i.checked=true}function a(t){r.dataset.theme=t;s(t)}var t=g();a(t);document.addEventListener("change",function(e){var i=e.target;if(!i||i.name!=="theme")return;var n=i.value;if(!v(n))return;r.dataset.theme=n;try{localStorage.setItem(k,n)}catch(e){}s(n)});if(document.readyState==="loading"){var o=new MutationObserver(function(){var i=document.querySelector('input[name="theme"]');if(i){s(g());o.disconnect()}});o.observe(r,{childList:true,subtree:true});document.addEventListener("DOMContentLoaded",function(){s(g());o.disconnect()},{once:true})}else{s(g())}}catch(e){}})();`;
