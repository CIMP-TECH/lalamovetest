<h1>Lever jobs API search and filtering example with list.js</h1>
<div id="new-list"><input id="lever-jobs-search" class="search" type="text" placeholder="Search">
<div id="lever-jobs-filter"><select class="lever-jobs-filter-locations">
<option disabled="disabled" selected="selected" value="">Filter by location</option>
</select><select class="lever-jobs-filter-departments">
<option disabled="disabled" selected="selected" value="">Filter by department</option>
</select><select class="lever-jobs-filter-teams">
<option disabled="disabled" selected="selected" value="">Filter by team</option>
</select><select class="lever-jobs-filter-work-types">
<option disabled="disabled" selected="selected" value="">Filter by work type</option>
</select><a id="lever-clear-filters" style="display: none;" data-hs-anchor="true" href="#">Clear filters</a></div>
<ul class="list">
<li>&nbsp;</li>
</ul>
<div id="lever-no-results" style="display: none;">No results</div>
</div>
<div id="lever-jobs-container">&nbsp;</div>
<script type="text/javascript">window.leverJobsOptions = {accountName: 'lalamove', includeCss: false};</script>
<script src="https://henrytam-ai.github.io/lalamovetest/lalamovetest-api.js"></script>
<script type="text/javascript">
  window.addEventListener('leverJobsRendered', function() {
    
       $(".lever-job").clone().appendTo("#new-list ul");

       var options = {
         valueNames: [
           'lever-job-title',
           { data: ['location'] },
           { data: ['department'] },
           { data: ['team'] },
           { data: ['commitment'] }
         ]
       };

        var jobList = new List('new-list', options);

        console.log(jobList);

        var locations = [];
        var departments = [];
        var teams = [];
        var workTypes = [];
        for (var i = 0; i < jobList.items.length; i++) {
          var item = jobList.items[i]._values;
          var location = item.location;
          if(jQuery.inArray(location, locations) == -1) {
            locations.push(location);
          }
          var department = item.department;
          if(jQuery.inArray(department, departments) == -1) {
            departments.push(department);
          }
          var team = item.team;
          if(jQuery.inArray(team, teams) == -1) {
            teams.push(team);
          }
          var workType = item["work-type"];
          if(jQuery.inArray(workType, workTypes) == -1) {
            workTypes.push(workType);
          }
        }

      locations.sort();
      departments.sort();
      teams.sort();
      workTypes.sort();
      for (var j = 0; j < locations.length; j++ ) {
          $( "#lever-jobs-filter .lever-jobs-filter-locations").append('<option>' + locations[j] + '</option>');
      }
      for (var j = 0; j < departments.length; j++ ) {
          $( "#lever-jobs-filter .lever-jobs-filter-departments").append('<option class=department>' + departments[j] + '</option>');
      }
      for (var j = 0; j < teams.length; j++ ) {
          $( "#lever-jobs-filter .lever-jobs-filter-teams").append('<option>' + teams[j] + '</option>');
      }
      for (var j = 0; j < workTypes.length; j++ ) {
          $( "#lever-jobs-filter .lever-jobs-filter-work-types").append('<option>' + workTypes[j] + '</option>');
      }

      function showFilterResults() {
        $('#new-list .list').show();
        $('#lever-jobs-container').hide();
      }
      function hideFilterResults() {
        $('#new-list .list').hide();
        $('#lever-jobs-container ').show();
      }

      // Show the unfiltered list by default
      hideFilterResults();

     $('#lever-jobs-filter select').change(function(){

      var selectedFilters = {
        location: $('#lever-jobs-filter select.lever-jobs-filter-locations').val(),
        department: $('#lever-jobs-filter select.lever-jobs-filter-departments').val(),
        team: $('#lever-jobs-filter select.lever-jobs-filter-teams').val(),
        'work-type': $('#lever-jobs-filter select.lever-jobs-filter-work-types').val(),
      }

      //Filter the list
      jobList.filter(function(item) {
        var itemValue = item.values();
        // Check the itemValue against all filter properties (location, team, work-type).
        for (var filterProperty in selectedFilters) {
          var selectedFilterValue = selectedFilters[filterProperty];

          // For a <select> that has no option selected, JQuery's val() will return null.
          // We only want to compare properties where the user has selected a filter option,
          // which is when selectedFilterValue is not null.
          if (selectedFilterValue !== null) {
            if (itemValue[filterProperty] !== selectedFilterValue) {
              // Found mismatch with a selected filter, can immediately exclude this item.
              return false;
            }
          }
        }
        // This item passes all selected filters, include this item.
        return true;
      });

      //Show the 'no results' message if there are no matching results
      if (jobList.visibleItems.length >= 1) {
        $('#lever-no-results').hide();
      }
      else {
        $('#lever-no-results').show();
      }

      console.log("filtered?", jobList.filtered);


      $('#lever-clear-filters').show();

      //Show the list with filtered results
      showFilterResults();

    });


    $('#new-list').on('click', '#lever-clear-filters', function() {
      console.log("clicked clear filters");
      jobList.filter();
      console.log("jobList filtered?", jobList.filtered);
      if (jobList.filtered == false) {
        hideFilterResults();
      }
      $('#lever-jobs-filter select').prop('selectedIndex',0);
      $('#lever-clear-filters').hide();
      $('#lever-no-results').hide();
    });

     // Showing/hiding search results when the search box is empty
     $('#new-list').on('input', '#lever-jobs-search', function() {
        if($(this).val().length || jobList.filtered == true) {
          showFilterResults();
          if (jobList.visibleItems.length >= 1) {
            $('#lever-no-results').hide();
          } else {
            $('#lever-no-results').show();
          }
        } else {
          hideFilterResults();
          $('#lever-no-results').hide();
        }
      });

  })


</script>
