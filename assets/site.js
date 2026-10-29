/* Dream Team Consulting: menu, dropdowns, accordions and the email form.
   No cookies, no storage, no network requests. */
(function () {
  "use strict";

  /* ---- dropdowns (Projects, Contact) */
  var dds = Array.prototype.slice.call(document.querySelectorAll(".dd"));
  function setDd(dd, open) {
    dd.classList.toggle("open", open);
    dd.querySelector(".dd-btn").setAttribute("aria-expanded", String(open));
  }
  function closeAll(except) { dds.forEach(function (d) { if (d !== except) setDd(d, false); }); }
  dds.forEach(function (dd) {
    var btn = dd.querySelector(".dd-btn");
    btn.addEventListener("click", function () {
      var open = !dd.classList.contains("open");
      closeAll(dd);
      setDd(dd, open);
    });
    dd.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && dd.classList.contains("open")) { setDd(dd, false); btn.focus(); }
    });
    dd.addEventListener("focusout", function (e) {
      if (e.relatedTarget && !dd.contains(e.relatedTarget)) setDd(dd, false);
    });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".dd")) closeAll();
  });

  /* ---- small-screen menu */
  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.getElementById("site-nav");
  function setMenu(open) {
    if (!menuBtn) return;
    menuBtn.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
  }
  if (menuBtn) {
    menuBtn.addEventListener("click", function () { setMenu(menuBtn.getAttribute("aria-expanded") !== "true"); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) { setMenu(false); closeAll(); } });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); menuBtn.focus(); }
    });
  }

  /* ---- accordions */
  function setAcc(item, open) {
    item.classList.toggle("open", open);
    item.querySelector(".acc-btn").setAttribute("aria-expanded", String(open));
  }
  Array.prototype.forEach.call(document.querySelectorAll(".acc-item"), function (item) {
    item.querySelector(".acc-btn").addEventListener("click", function () {
      setAcc(item, !item.classList.contains("open"));
    });
  });
  function openFromHash() { /* a link to #svc-visualization opens that service */
    var id = decodeURIComponent(location.hash.slice(1));
    var target = id && document.getElementById(id);
    var item = target && target.closest(".acc-item");
    if (item) setAcc(item, true);
  }
  openFromHash();
  window.addEventListener("hashchange", openFromHash);

  /* ---- enquiry form: opens the visitor's email app; nothing is sent to or stored on this site */
  var form = document.getElementById("enquiry");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var f = form.elements;
      var subject = "Project enquiry from " + f.name.value.trim();
      var body = [
        "Name: " + f.name.value.trim(),
        "Email: " + f.email.value.trim(),
        f.org.value.trim() ? "Organization: " + f.org.value.trim() : "",
        "How can you help: " + f.help.value,
        "",
        f.project.value.trim()
      ].filter(function (line, i) { return line !== "" || i === 4; }).join("\n");
      var to = form.getAttribute("data-to");
      window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      var status = document.getElementById("form-status");
      status.textContent = "Your email app should open with your message filled in. If it didn't, email " + to + " directly.";
    });
  }
})();
