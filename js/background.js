// Update events once on storage change (triggered by upload)
// chrome.storage.local.onChanged.addListener((changes, namespace) => {
//     if (changes.events) {
//       const storedEvents = changes.events.newValue;
//       const todayEvents = storedEvents.filter(
//         event => isToday(event.startDate) // Custom function to check if it's today
//       );
//       // chrome.tabs.query({ url: "newtab.html" }, (tabs) => {
//       //   if (tabs[0]) {
//       //     chrome.tabs.sendMessage(tabs[0].id, { action: "updateDisplay", data: todayEvents });
//       //   }
//       // });
//     }
//   });
  
  // Handle daily update at midnight for cached events
  // chrome.alarms.create("dailyUpdate", { delayInMinutes: 1440 }); // Set alarm for midnight
  // chrome.alarms.onAlarm.addListener(async () => {
  //   const storedEvents = await chrome.storage.local.get("events");
  //   const todayEvents = storedEvents.events.filter(
  //     event => isToday(event.startDate) // Custom function to check if it's today
  //   );
  //   chrome.tabs.query({ url: "newtab.html" }, (tabs) => {
  //     if (tabs[0]) {
  //       chrome.tabs.sendMessage(tabs[0].id, { action: "updateDisplay", data: todayEvents });
  //     }
  //   });
  // });


  chrome.action.onClicked.addListener(function() {
    chrome.tabs.create({'url': chrome.runtime.getURL('options.html')});
  });