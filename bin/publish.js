const axios = require("axios");
const fs = require("fs");
const yaml = require("js-yaml");

const API_KEY = process.env.SWAGGERHUB_KEY;

const openAPIPath = "./docs/openapi.yml";
const owner = "SmartBearTPM_Org";
const api = "Book";
const version = getVersion();

const PUBLISH_URL = `https://52.16.125.35/apis/v1/${owner}/${api}/${version}/settings/lifecycle?force=false`;
const MARK_DEFAULT_URL = `https://52.16.125.35/apis/v1/${owner}/${api}/settings/default`;

function getVersion() {
  const doc = yaml.safeLoad(fs.readFileSync(openAPIPath, "utf8"));
  return doc.info.version;
}

async function publish() {
  try {
    // Publish
    console.log(`Publishing ${version}`);
    await axios({
      url: PUBLISH_URL,
      method: "PUT",
      headers: {
        authorization: API_KEY,
        "Content-Type": "application/json",
      },
      data: {
        published: true,
      },
    });

    console.log(`Marking ${version} as default`);
    await axios({
      url: MARK_DEFAULT_URL,
      method: "PUT",
      headers: {
        authorization: API_KEY,
        "Content-Type": "application/json",
      },
      data: {
        version,
      },
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
  console.log("Complete!");
}

(async function () {
  await publish();
})();
