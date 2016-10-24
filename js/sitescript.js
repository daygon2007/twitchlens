// This file has sitewide javascript.
// Keith Murphy, 10-2016

$(document).ready(function() {
  removeWWWFromUrl();
  addReusableSiteSections();
});

function removeWWWFromUrl()
{
  if (location.href.indexOf('www.') > -1) {
    location.href = location.href.replace(/www./, '');
  }
}

function addReusableSiteSections()
{
  $('#nav').load("reuse/nav.html");
  $('#ad').load("reuse/ad.html");
}