  // actionLogger.jsy
const logger = require("../logger");
const logAction = (action, additionalInfo = '') => {
  const logMessage = `${action}${additionalInfo ? ' - ' + additionalInfo : ''}`;
  logger.info(logMessage); 
};

module.exports = logAction;