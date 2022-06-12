// Define "require"
const { App } = require("@slack/bolt");
const logger = require("pino")();
const Asana = require("asana");
const { helpMe } = require("./blockController.js");

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

const asana = Asana.Client.create({
  defaultHeaders: {
    "asana-enable": "new_project_templates,new_user_task_lists",
  },
}).useAccessToken(process.env.ASANA_PERSONAL_TOKEN);

slack.message("help", async ({ message, say }) => {
  const user_id = message.user;
  slack.client.chat.postMessage({
    channel: user_id,
    text: "I'm here to help you with your tasks!",
    ...helpMe,
  });
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

const createTask = async (body) => {
  const defaults = {
    assignee: process.env.ASANA_USER_ID,
    parent: null,
    projects: ["1202432208571108"],
    workspace: process.env.ASANA_WORKSPACE_ID,
    pretty: true,
  };

  body = Object.assign(body, defaults);

  try {
    const task = await asana.tasks.create(body);
    return task;
  } catch (e) {
    logger.error(e);
    return e;
  }
};
