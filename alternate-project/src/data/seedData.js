export const moduleDefinitions = {
  strategy: {
    key: "strategy",
    title: "Strategy",
    shortTitle: "Strategy",
    route: "/rep/strategy",
    description:
      "Daily execution tools for tours, closes, goal discipline, financial planning, and performance analytics.",
    adminDescription:
      "Manage the operational templates and live assets reps use to hit daily numbers on the floor.",
    pillars: [
      "Daily Performance",
      "Goal Sheet",
      "Financial Planner",
      "Analytics",
    ],
    repWorkflow: [
      "Open the daily performance board before the first tour.",
      "Submit the goal sheet by midday and close it out before leaving the floor.",
      "Use the financial planner to keep monthly income targets visible.",
      "Review analytics to spot where control or value is being lost.",
    ],
    statHighlights: [
      { label: "Core tools", value: "4" },
      { label: "Cadence", value: "Daily" },
      { label: "Audience", value: "Reps + leaders" },
    ],
  },
  topProducerPath: {
    key: "topProducerPath",
    title: "Top Producer Path",
    shortTitle: "Path",
    route: "/rep/path",
    description:
      "A staged training journey organized around the Training Library, session-based skill progression, and Skool course reinforcement.",
    adminDescription:
      "Control the curriculum, session publishing, Skool-linked lessons, and the progression path reps use to reach top producer standards.",
    pillars: [
      "Training Library",
      "Session 1",
      "Session 2",
      "Session 3",
      "Session 4+",
    ],
    repWorkflow: [
      "Start from the current session and complete the recap before moving forward.",
      "Use the Training Library to replay the exact module connected to today's blocker.",
      "Open Skool challenge content when you need extra repetition between live sessions.",
      "Pair session viewing with live coaching or role play when the issue is tactical.",
      "Download support material and keep one key move for the next tour.",
    ],
    statHighlights: [
      { label: "Sessions", value: "6+" },
      { label: "Progression", value: "Structured" },
      { label: "Mode", value: "On demand + Skool" },
    ],
  },
  coaching: {
    key: "coaching",
    title: "Coaching",
    shortTitle: "Coaching",
    route: "/rep/coaching",
    description:
      "Live reinforcement through events, group coaching, role play sessions, and weekly Q and A rooms.",
    adminDescription:
      "Publish the live coaching calendar, role play agendas, and Q and A sessions that reinforce field behavior.",
    pillars: [
      "Event",
      "Group Live Coaching",
      "Role Play Live Session",
      "Q and A Sessions",
    ],
    repWorkflow: [
      "Reserve live sessions directly from the coaching module.",
      "Use role play rooms for objections that break momentum on the floor.",
      "Bring current deal blockers into Q and A sessions for direct feedback.",
      "Turn every live coaching note into one applied move before the next tour.",
    ],
    statHighlights: [
      { label: "Formats", value: "4" },
      { label: "Mode", value: "Live" },
      { label: "Goal", value: "Reinforcement" },
    ],
  },
  resources: {
    key: "resources",
    title: "Resources",
    shortTitle: "Resources",
    route: "/rep/resources",
    description:
      "Downloadable PDFs, ebooks, checklists, and Skool video lessons that reps and managers can use immediately.",
    adminDescription:
      "Curate and publish assets, downloads, and linked lessons that support pre-tour, during-tour, post-tour, and manager-led coaching moments.",
    pillars: [
      "PDF deliverables",
      "Ebooks",
      "Worksheets",
      "Video lessons",
    ],
    repWorkflow: [
      "Pull the exact checklist or script before the tour starts.",
      "Use short-form resources for live objection recovery.",
      "Open Skool video lessons when you need a fast reset between tours.",
      "Review manager packets after huddles or session debriefs.",
      "Download bundles that match the current training theme.",
    ],
    statHighlights: [
      { label: "Asset types", value: "PDF + video" },
      { label: "Access", value: "Download + link" },
      { label: "Coverage", value: "Rep + admin" },
    ],
  },
};
