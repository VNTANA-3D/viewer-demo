## Events
### error
Dispatched when an error is encountered during load.
### load
Dispatched when model load is complete. During the next animation frame the poster will be removed 
 and the model will become visible. Model's loading time in milliseconds can be obtained through `event.detail.time`.
### ar-mode-change
Triggers when the `ARMode` changes and is used to identify whether AR can be started.
### enter-ar
Triggered when AR is launched.
### exit-ar
Triggered when returned from AR.
