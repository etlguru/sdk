const fs = require("fs");
const path = require("path");
const anymatch = require("anymatch");

//NOTE: cleanPath function prevents access to the files or folders outside files directory
const { cleanPath } = require("./utils");

actionParameters.ExecutionResult = SUCCESS;
try {
  const fileName = cleanPath(actionParameters.file);
  const directory = path.dirname(fileName);
  const mask = path.basename(fileName);
  const files = fs.readdirSync(directory).filter((fn) => anymatch(mask, fn));
  files.forEach((fn) => {
    const file = path.resolve(directory, fn);
    fs.unlinkSync(file);
    logger.debug(`Deleted: ${file}`);
  });
} catch (e) {
  actionParameters.ExecutionResult = ERROR;
  stepExecutionInfo.message = e.message;
  logger.error(e.message);
}
return actionParameters.ExecutionResult;
