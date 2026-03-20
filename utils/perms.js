import express, { application } from "express";
import "dotenv/config";
import axios from "axios";
import { setTimeout as delay } from "node:timers/promises";
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
    "INT-ENGINEERING": "Full",
    "INT-ACCOUNTING": "Full",
    "INT-DESIGN": "Full",
    "INT-SALES": "Editor",
    "INT-PROJECT_MANAGEMENT": "Full",
    "INT-MANAGEMENT": "Full",
  },
});

const writePerms = JSON.stringify({
  groupPerms: {
    "ZPI-READ": "Viewer",
    "ZPI-WRITE": "Full",
    "INT-ENGINEERING": "Full",
    "INT-ACCOUNTING": "Full",
    "INT-DESIGN": "Full",
    "INT-SALES": "Editor",
    "INT-PROJECT_MANAGEMENT": "Full",
    "INT-MANAGEMENT": "Full",
  },
});

const read_folders = ["6. Engineering", "7. Submittals & Approvals"];

const write_folders = ["12. Solidworks Files", "12. Solidworks files"];

// Enabled users with Full access to move items
const options = {
  restrict_move_delete: "false",
};
export async function getFiles(path, touchedFiles = []) {
  // let touchedFiles = [];
  // if (touchedFiles.includes(path)) {
  //   return;
  // }

  try {
    const req = await axios.get(`${fsURL}${path}`, { headers });

    if (req.status !== 200) {
      console.log("there was an error fetching data", req.status);
      return;
    }

    const { data } = req;
    const { folders } = req.data;
    const route = req.data.path;

    await setPerms(route);
    touchedFiles.push(route);

    // await delay(3000);
    await setOptions(route);
    // await delay(3000);
    if (!folders) {
      return touchedFiles;
    }
    for (const folder of folders) {
      const newPath = folder.path;
      const folderName = folder.name.trim();

      if (read_folders.includes(folderName)) {
        await setZRead(newPath);
        // await delay(3000);
      } else if (write_folders.includes(folderName)) {
        await setZWrite(newPath);
        // await delay(3000);
      }

      await getFiles(newPath, touchedFiles);
    }
    // const text = "this the returned text";
    // return text;
  } catch (err) {
    console.log("caught error:", err);
    return;
  }
  return touchedFiles;
}

// Sets permissions
export async function setPerms(path) {
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
export async function setOptions(path) {
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
export async function setZRead(path) {
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
export async function setZWrite(path) {
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
