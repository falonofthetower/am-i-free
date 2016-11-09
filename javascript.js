// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = "927794111158-c1im4nc55l4r5ri6k7kijr9kfgiftjl2.apps.googleusercontent.com";

var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

function onApiLoad() {
  fetchNumber();
  gapi.client.load('calendar', 'v3', authenticateWithGoogle);
}

function fetchNumber() {
  var number = Cookies.get('phone')
  updateNumber(number);
}

function updateNumber(phone) {
  var link = document.getElementById('phone-link');
  link.href = link.href.replace(/sms:.*&/, "sms:" + phone + "&");
  document.getElementById('number').value = phone;
}

function authenticateWithGoogle() {
  window.gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
    }, handleAuthResult);
}

function handleAuthResult(authResult) {
  console.log("handleAuthResult")
  var authorizeDiv = document.getElementById('authorize-div');
  var calendarDiv = document.getElementById('calendar-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    calendarDiv.style.display = 'block';
    loadCalendarApi();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    calendarDiv.style.display = 'none';
    authorizeDiv.style.display = 'inline';
  }
}
/**
 * Check if current user has authorized this application.
 */
      function checkAuth() {
        gapi.auth.authorize(
            {
              'client_id': CLIENT_ID,
              'scope': SCOPES.join(' '),
              'immediate': true
            }, handleAuthResult);
      }

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick() {
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResult);
}

/**
 * Load Google Calendar client library. List upcoming events
 * once client library is loaded.
 */
function loadCalendarApi() {
  var start = formatDateStart(moment());
  var end = formatDateEnd(moment());

  gapi.client.load('calendar', 'v3', listEventsForToday);
  gapi.client.load('calendar', 'v3', listEventsForTomorrow);
}

function formatDateStart(moment) {
  var start = moment.set({'hour': 06, 'minute': 00, 'second': 00}).toISOString();
  return start;
}

function formatDateEnd(moment) {
  var end = moment.set({'hour': 16, 'minute': 00, 'second': 00}).toISOString();
  return end;
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listEventsForToday() {
  var start = moment().set({'hour': 06, 'minute': 00, 'second': 00}).toISOString();
  var end = moment().set({'hour': 16, 'minute': 00, 'second': 00}).toISOString();
  var request = gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': start,
    'timeMax': end,
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  });

  request.execute(function(resp) {
    var events = resp.items;

    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var table = document.getElementById("today-table");
        var row = table.insertRow(-1);
        var num = row.insertCell(0);
        var time = row.insertCell(1);
        var desc = row.insertCell(2);
        var event = events[i];
        var when = event.start.dateTime;
        var row
        if (!when) {
          when = event.start.date;
        }
        num.innerHTML = i + 1;
        time.innerHTML = moment(when).format("ddd hA");
        desc.innerHTML = event.summary
      }
    }

  });
}

function listEventsForTomorrow() {
  var start = moment().add(1, 'days').set({'hour': 06, 'minute': 00, 'second': 00}).toISOString();
  var end = moment().add(1, 'days').set({'hour': 16, 'minute': 00, 'second': 00}).toISOString();
  var request = gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': start,
    'timeMax': end,
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  });

  request.execute(function(resp) {
    var events = resp.items;

    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var table = document.getElementById("tomorrow-table");
        var row = table.insertRow(-1);
        var num = row.insertCell(0);
        var time = row.insertCell(1);
        var desc = row.insertCell(2);
        var event = events[i];
        var when = event.start.dateTime;
        var row
        if (!when) {
          when = event.start.date;
        }
        num.innerHTML = i + 1;
        time.innerHTML = moment(when).format("ddd hA");
        desc.innerHTML = event.summary
      }
    }

  });
}

function listEventsForNext() {
  var start = moment().add(2, 'days').set({'hour': 06, 'minute': 00, 'second': 00}).toISOString();
  var end = moment().add(2, 'days').set({'hour': 16, 'minute': 00, 'second': 00}).toISOString();
  var request = gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': start,
    'timeMax': end,
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  });

  request.execute(function(resp) {
    var events = resp.items;

    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var table = document.getElementById("next-table");
        var row = table.insertRow(-1);
        var num = row.insertCell(0);
        var time = row.insertCell(1);
        var desc = row.insertCell(2);
        var event = events[i];
        var when = event.start.dateTime;
        var row
        if (!when) {
          when = event.start.date;
        }
        num.innerHTML = i + 1;
        time.innerHTML = moment(when).format("ddd hA");
        desc.innerHTML = event.summary
      }
    }

  });
}
/**
 * Append a pre element to the body containing the given message
 * as its text node.
 *
 * @param {string} message Text to be placed in pre element.
 */

function updateCookie() {
  var number = document.getElementById('number').value;
  Cookies.set('phone', number);
  swal("Number Set!");
  location.reload();
}

$( "#phone-form").submit(function( event) {
  var number = document.getElementById('number')
  Cookies.set('phone', number)
  updateCookie();
  event.preventDefault();
});
