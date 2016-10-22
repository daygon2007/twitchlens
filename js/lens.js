// This file is full of (hopefully) well named
// helper functions that might be used throughout
// the application but not page function specific.
// Keith Murphy, 10-2016

$(document).ready(function() {
  removeWWWFromUrl();
  addReusableSiteSections();
});

function removeWWWFromUrl()
{
  window.onload = function(){
    if (location.href.indexOf('www.') > -1) {
      location.href = location.href.replace(/www./, '');
    }
  };
}

function addReusableSiteSections()
{
  $('#nav').load("reuse/nav.html");
  $('#ad').load("reuse/ad.html");
  $('#tags').load("reuse/tags.html");
}

function isKeypressANumber(e) {
  try {
    var charCode = (e.which) ? e.which : e.keyCode;
    if ((charCode >= 48 && charCode <= 57)) {
      return true;
    }
  } catch (err) {
    console.log(err);
  }
  return false;
}

function removeTableRows(tableName)
{
  // Page specific helper function]
  $("." + tableName).find("tr:gt(0)").remove();
}

function sortTable(tableName) {
  var rows = $("." + tableName + " tbody tr").get();

  rows.sort(function(a, b) {
    var A = $(a).children('td').eq(0).text().toUpperCase();
    var B = $(b).children('td').eq(0).text().toUpperCase();
    if (A < B) {
      return -1;
    }

    if (A > B) {
      return 1;
    }

    return 0;
  });

  $.each(rows, function(index, row) {
    $("." + tableName).children('tbody').append(row);
  });
}