const dayjs = require("dayjs");
const { setTimeout } = require("timers/promises");
actionParameters.ExecutionResult = SUCCESS;

try {
  let buffer = actionParameters.Pause.split(":");
  let minutes = parseInt(buffer[0]);
  let seconds = parseInt(buffer[1]);

  const startDateTime = new Date();
  startDateTime.setMinutes(startDateTime.getMinutes() + minutes);
  startDateTime.setSeconds(startDateTime.getSeconds() + seconds);

  logger.info(`Waiting until: ${dayjs(startDateTime).toISOString()}`);
  let now = new Date();
  let tmp = 0;
  do {
    tmp++;
    // Checking every 10 seconds if user aborted/paused execution
    if (tmp === 10) {
      if (isPaused()) throw new Error("Execution aborted");
      tmp = 0;
    }
    // Every second
    await setTimeout(1000);
    now = new Date();
  } while (now < startDateTime);
  logger.info(`Current time: ${dayjs(now).toISOString()}`);
} catch (e) {
  actionParameters.ExecutionResult = ERROR;
  stepExecutionInfo.message = e.message;
  logger.error(e.message);
}
return actionParameters.ExecutionResult;
