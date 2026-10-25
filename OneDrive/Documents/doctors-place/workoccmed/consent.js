/*
 * WorkOccMed cookie consent.
 * - Google tags (Analytics / Ads) do NOT load until the visitor clicks Accept.
 * - "Reject" and the browser's Global Privacy Control signal both keep them off.
 * - The choice is stored in this browser only (localStorage). "Cookie settings" reopens the banner.
 */
(function () {
  var KEY = 'wom_cookie_consent_v1';
  var GOOGLE_TAG = 'GT-K8FTWVMH';
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  // Everything denied until the visitor says otherwise.
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied'
  });

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var loaded = false;
  function loadGoogle() {
    if (loaded) return;
    loaded = true;
    gtag('consent', 'update', {
      ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted'
    });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GOOGLE_TAG;
    document.head.appendChild(s);
  }

  var gpc = !!(navigator.globalPrivacyControl);
  var saved = read();
  if (gpc && !saved) saved = 'rejected';

  function removeEl(id) { var e = document.getElementById(id); if (e && e.parentNode) e.parentNode.removeChild(e); }

  function settingsLink() {
    if (document.getElementById('wom-cc-link')) return;
    var a = document.createElement('button');
    a.id = 'wom-cc-link';
    a.type = 'button';
    a.textContent = 'Cookie settings';
    a.setAttribute('style', 'position:fixed;left:12px;bottom:12px;z-index:2147483000;background:#fff;color:#0f2347;border:1px solid #cbd5e1;border-radius:8px;padding:6px 10px;font:500 12px/1.2 "DM Sans",Arial,sans-serif;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.12)');
    a.onclick = function () { removeEl('wom-cc-link'); banner(); };
    document.body.appendChild(a);
  }

  function choose(v) {
    write(v);
    removeEl('wom-cc');
    if (v === 'accepted') loadGoogle();
    else if (loaded) { try { window.location.reload(); } catch (e) {} }
    settingsLink();
  }

  function banner() {
    if (document.getElementById('wom-cc')) return;
    var d = document.createElement('div');
    d.id = 'wom-cc';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-label', 'Cookie consent');
    d.setAttribute('style', 'position:fixed;left:0;right:0;bottom:0;z-index:2147483001;background:#0f2347;color:#fff;padding:16px;font:400 14px/1.5 "DM Sans",Arial,sans-serif;box-shadow:0 -2px 12px rgba(0,0,0,.25)');
    var btn = 'border:2px solid #fff;border-radius:8px;padding:10px 20px;font:600 14px "DM Sans",Arial,sans-serif;cursor:pointer;background:#fff;color:#0f2347;min-width:110px';
    d.innerHTML =
      '<div style="max-width:960px;margin:0 auto;display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:space-between">' +
      '<div style="flex:1 1 420px">We use cookies from Google (Analytics and Google Ads) to measure how our site is used and how our ads perform. They are off unless you accept. ' +
      '<a href="/privacy-policy#cookies" style="color:#99f6e4;text-decoration:underline">Privacy policy</a></div>' +
      '<div style="display:flex;gap:10px"><button type="button" id="wom-cc-reject" style="' + btn + '">Reject</button>' +
      '<button type="button" id="wom-cc-accept" style="' + btn + '">Accept</button></div></div>';
    document.body.appendChild(d);
    document.getElementById('wom-cc-accept').onclick = function () { choose('accepted'); };
    document.getElementById('wom-cc-reject').onclick = function () { choose('rejected'); };
  }

  function start() {
    if (saved === 'accepted') { loadGoogle(); settingsLink(); }
    else if (saved === 'rejected') { settingsLink(); }
    else { banner(); }
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
