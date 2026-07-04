const fs = require('fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously" });
try {
  dom.window.eval(js);
  console.log("No syntax errors in script.js");
} catch (e) {
  console.error("Error evaluating script.js:", e);
}
