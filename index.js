const { App } = require("@slack/bolt");
const logger = require("pino")();
const Asana = require("asana");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const slack = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 6969,
});

const asana = Asana.Client.create().useAccessToken(
  process.env.ASANA_PERSONAL_TOKEN
);

/* Add functionality here */
slack.message("", async ({ message, say }) => {
  const username = await asana.users.me().then((me) => {
    return me.name;
  });

  await say(`Hey there, ${username}!`);
});

// Start bot
(async () => {
  // Start the app
  await slack.start();
  logger.info("⚡️ Bolt app is running!");
})();

process.on("SIGINT", function () {
  logger.info("\nGracefully shutting down from SIGINT (Ctrl-C)");
  // some other closing procedures go here
  process.exit();
});
