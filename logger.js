import pino, { destination } from "pino";
import PinoHttp from "pino-http";
import { fileURLToPath } from "node:url";
import PinoPretty from "pino-pretty";

// const __dirname = fileURLToPath(new URL(".", import.meta.url));
const __dirname = import.meta.dirname;

const transport = pino.transport({
  targets: [
    {
      target: "pino/file",
      options: { destination: `${__dirname}/app.log` },
    },
    {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
  ],
});

const logger = pino(
  {
    level: "info",
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport,
);

export default logger;
