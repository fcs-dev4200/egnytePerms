import express, { application } from "express";
import "dotenv/config";
import axios from "axios";
import { setTimeout } from "timers/promises";
import { json } from "stream/consumers";
import path from "path";
const app = express();

const headers = {
  Authorization: `Bearer ${process.env.ADMIN_TOKEN}`,
  "Content-Type": "application/json",
};

const fsURL = `${process.env.URL}v1/fs`;
const permURL = `${process.env.URL}v2/perms`;

// Perms that should be set on all folders
const data = JSON.stringify({
  groupPerms: {
    "INT-ENGINEERING": "Full",
    "INT-ACCOUNTING": "Full",
    "INT-DESIGN": "Full",
    "INT-SALES": "Editor",
    "INT-PROJECT_MANAGEMENT": "Full",
    "INT-MANAGEMENT": "Full",
  },
});

const readPerms = JSON.stringify({
  groupPerms: {
    "ZPI-READ": "Viewer",
    "ZPI-WRITE": "Viewer",
  },
});

const writePerms = JSON.stringify({
  groupPerms: {
    "ZPI-READ": "Viewer",
    "ZPI-WRITE": "Full",
  },
});

const read_folders = ["6. Engineering", "7. Submittals and Approvals"];

const write_folders = ["12. Solidworks Files"];

// Enabled users with Full access to move items
const options = {
  restrict_move_delete: "false",
};

export async function getFiles(path) {
  let touchedFiles = [];
  let moreFolders = true;
  let folderArray = [];
  while (moreFolders) {
    try {
      const req = await axios.get(`${fsURL}${path}`, { headers });
      if (req.status !== 200) {
        console.log("there was an error fetching data", req.status);
      }
      const { data } = req;
      const { folders, name } = req.data;
      const route = req.data.path;
      if (touchedFiles.includes(route)) {
        continue;
      }
      setPerms(route);
      // touchedFiles.push(route);
      // console.log(touchedFiles);
      await setTimeout(3000);
      setOptions(route);
      await setTimeout(3000);
      for (const i of folders) {
        const newPath = `${i.path}`;
        getFiles(newPath);
        if (read_folders.includes(i.name)) {
          setZRead(newPath);
          await setTimeout(3000);
        } else if (write_folders.includes(i.name)) {
          setZWrite(newPath);
          await setTimeout(3000);
        } else {
          continue;
        }
        await setTimeout(3000);
      }
      if (!folders) {
        moreFolders = false;
      }
    } catch (err) {
      console.log("error", err);
      break;
    }
  }
  console.log("finished");
}

// Sets permissions
async function setPerms(path) {
  try {
    const reqURL = permURL + path;
    const req = await axios.post(reqURL, data, { headers });
    if (req.status === 204) {
      console.log(`Folder ${path} permissions changed succesfully`);
    } else {
      console.log("error changing permissions");
    }
  } catch (err) {
    console.log("error", err);
  }
}

// Sets move options
async function setOptions(path) {
  try {
    const reqURL = fsURL + path;
    const req = await axios.patch(reqURL, options, { headers });
    if (req.status === 200) {
      console.log(`Folder options for ${path} change successfully`);
    } else {
      console.log("error changing options");
    }
  } catch (err) {
    console.log("error", err);
  }
}

// Set Zephyr Read permissions
async function setZRead(path) {
  try {
    const reqURL = permURL + path;
    const req = await axios.post(reqURL, readPerms, { headers });
    if (req.status === 204) {
      console.log(`Z Read perms set on ${path}`);
    } else {
      console.log("error changing read perms");
    }
  } catch (err) {
    console.log("error", err);
  }
}

// Set Zephyr Write permissions
async function setZWrite(path) {
  try {
    const reqURL = permURL + path;
    const req = await axios.post(reqURL, writePerms, { headers });
    if (req.status === 204) {
      console.log(`Z Write perms set on ${path}`);
    } else {
      console.log("error changing read perms");
    }
  } catch (err) {
    console.log("error", err);
  }
}

// getFiles("/Shared/ProjectsTest/Austin, TX - Dell JCC - 10621 & 30621");/
