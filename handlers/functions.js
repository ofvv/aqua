module.exports = async (client) => {
  client.sleep = async function(ms) {
    if (!ms) ms = 1;
    return new Promise(async resolve => setTimeout(resolve, ms));
  };
  client.translate = require("@iamtraction/google-translate");
  client.randomHex = Math.floor(Math.random() * 16777215).toString(16);
  client.codeblock = async function(code, language) {
    if (!language) language = 'yaml';
    if (!code) return `No Code Provided!`;
    return `\`\`\`${language}\n${code}\n\`\`\``;
  };
  client.formatms = async function(ms) {
    const sec = Math.floor((ms / 1000) % 60).toString();
    const min = Math.floor((ms / (1000 * 60)) % 60).toString();
    const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
    const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();
    return `${days.padStart(1, "0")}d ${hrs.padStart(2, "0")}h ${min.padStart(2, "0")}m ${sec.padStart(2, "0")}s`;
  };
  client.randomArray = async function(array) {
    if (!array) array = [];
    return array[Math.floor(Math.random() * array.length)];
  };
  client.trimArray = async function(arr, maxlen) {
    if (!arr) arr = [];
    if (!maxlen) maxlen = 20;
    if (arr.length > maxlen) {
      const len = arr.length - maxlen;
      arr = arr.slice(0, maxlen);
      arr.push(`And ${len} More...`);
    }
    return arr;
  };
  client.trimArr = async function(arr, maxlen) {
    if (!arr) arr = [];
    if (!maxlen) maxlen = 20;
    if (arr.length > maxlen) {
      const len = arr.length - maxlen;
      arr = arr.slice(0, maxlen);
    }
    return arr;
  };
}
