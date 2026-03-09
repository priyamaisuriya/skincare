"use strict";

$("[data-checkboxes]").each(function () {
  var me = $(this),
    group = me.data('checkboxes'),
    role = me.data('checkbox-role');

  me.change(function () {
    var all = $('[data-checkboxes="' + group + '"]:not([data-checkbox-role="dad"])'),
      checked = $('[data-checkboxes="' + group + '"]:not([data-checkbox-role="dad"]):checked'),
      dad = $('[data-checkboxes="' + group + '"][data-checkbox-role="dad"]'),
      total = all.length,
      checked_length = checked.length;

    if (role == 'dad') {
      if (me.is(':checked')) {
        all.prop('checked', true);
      } else {
        all.prop('checked', false);
      }
    } else {
      if (checked_length >= total) {
        dad.prop('checked', true);
      } else {
        dad.prop('checked', false);
      }
    }
  });
});

$("#table-1").dataTable({
  "columnDefs": [
    { "sortable": false, "targets": [2, 3] }
  ]
});
$("#table-2").dataTable({
  "columnDefs": [
    { "sortable": false, "targets": [0, 2, 3] }
  ]
});

function initDataTables() {
  $(".data-table:visible").each(function () {
    if (!$.fn.DataTable.isDataTable(this)) {
      $(this).dataTable({
        "columnDefs": [
          { "sortable": false, "targets": [0, 2, 3] }
        ]
      });
    }
  });
}

// Initial check
initDataTables();

// Use MutationObserver for elements added dynamically or becoming visible
let dtTimeout;
const observer = new MutationObserver(function (mutations) {
  let shouldCheck = false;
  for (let i = 0; i < mutations.length; i++) {
    if (mutations[i].addedNodes.length > 0 || mutations[i].type === 'attributes') {
      shouldCheck = true;
      break;
    }
  }

  if (shouldCheck) {
    clearTimeout(dtTimeout);
    dtTimeout = setTimeout(initDataTables, 1000);
  }
});

if (document.body) {
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  });
}
