const helpMe = () => {
  const faqs = require("./data/faq.json");

  let faqBlocks = faqs.map((faq) => {
    return {
      type: "section",
      text: {
        type: "mrkdwn",
        text: faq.question,
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          emoji: true,
          text: "Click",
        },
        value: faq.id,
      },
    };
  });

  return {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Hey, how can I help?",
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*FAQs and Quick Actions*",
        },
      },
      ...faqBlocks,
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Create a new task in Asana",
              emoji: true,
            },
            style: "primary",
            value: "new_task_asana",
            action_id: "actionId-0",
          },
        ],
      },
    ],
  };
};

module.exports = {
  helpMe: helpMe(),
};
