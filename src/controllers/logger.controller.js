export const loggerTest = (req, res) => {
    const currentDate = new Date();
    const dateStr = currentDate.toLocaleDateString();
    const timeStr = currentDate.toLocaleTimeString();
    const method = req.method;
    const url = req.url;

    req.logger.fatal(`Test Logger Level Fatal --> ${method} en ${url} - at ${dateStr} - ${timeStr}`);
    req.logger.error(`Test Logger Level Error --> ${method} en ${url} - at ${dateStr} - ${timeStr}`);
    req.logger.warning(`Test Logger Level Warning --> ${method} en ${url} - at ${dateStr} - ${timeStr}`);
    req.logger.info(`Test Logger Level Info --> ${method} en ${url} - at ${dateStr} - ${timeStr}`);
    req.logger.http(`Test Logger Level Http --> ${method} en ${url} - at ${dateStr} - ${timeStr}`);
    req.logger.debug(`Test Logger Level Debug --> ${method} en ${url} - at ${dateStr} - ${timeStr}`);

    res.status(200).send('Logger Test');
};