#!/usr/bin/env node
/* eslint-disable no-undef */
/* eslint-env node */
import readline from "readline";
import { createComponent } from "./component.js";
import { createDashboardPage } from "./dashboard-page.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const options = [
  { key: "1", label: "Component", handler: createComponent },
  { key: "2", label: "Dashboard Page", handler: createDashboardPage },
];

async function main() {
  console.log("\nVida Creator\n");
  console.log("What would you like to create?\n");

  options.forEach(({ key, label }) => {
    console.log(`  ${key}. ${label}`);
  });

  console.log("");

  const choice = await new Promise((resolve) => rl.question("Select an option: ", resolve));
  const selected = options.find((o) => o.key === choice);

  if (!selected) {
    console.log("\nInvalid option.");
    rl.close();
    process.exit(1);
  }

  await selected.handler(rl);
  rl.close();
}

main();
