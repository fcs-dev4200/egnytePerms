import fs from "node:fs";

const testObj = {
  name: "FCS-Test",
  lastModified: 1756906060000,
  uploaded: 1756906060742,
  count: 0,
  offset: 0,
  path: "/Shared/ProjectsTest/FCS-Test",
  folder_id: "ad94c178-e723-40cf-a939-db7455a83b79",
  total_count: 5,
  parent_id: "5c43fbf5-9a2a-4d47-9811-dd11b45e746c",
  allow_links: true,
  restrict_move_delete: false,
  public_links: "files_folders",
  is_folder: true,
  folders: [
    {
      name: "1. Bid Docs",
      lastModified: 1773691010000,
      uploaded: 1773691010433,
      path: "/Shared/ProjectsTest/FCS-Test/1. Bid Docs",
      folder_id: "8cb82451-5b7b-4f34-b022-cad85c602f3f",
      parent_id: "ad94c178-e723-40cf-a939-db7455a83b79",
      folders: [
        {
          path: "bd1",
        },
        {
          path: "bd2",
        },
      ],
    },
    {
      name: "12. Solidworks files",
      lastModified: 1773691053000,
      uploaded: 1773691053778,
      path: "/Shared/ProjectsTest/FCS-Test/12. Solidworks files",
      folder_id: "22afea3f-874a-4ca5-974a-793bae3a4a11",
      parent_id: "ad94c178-e723-40cf-a939-db7455a83b79",
      folders: [
        {
          path: "sf 1",
        },
        {
          path: "sf 2",
        },
      ],
    },
    {
      name: "2. Design",
      lastModified: 1773691020000,
      uploaded: 1773691020893,
      path: "/Shared/ProjectsTest/FCS-Test/2. Design",
      folder_id: "da677cba-3c85-42fd-a236-70dc8938f556",
      parent_id: "ad94c178-e723-40cf-a939-db7455a83b79",
      is_folder: true,
    },
    {
      name: "6. Engineering",
      lastModified: 1773691028000,
      uploaded: 1773691028625,
      path: "/Shared/ProjectsTest/FCS-Test/6. Engineering",
      folder_id: "90c73b3c-4d41-4820-9835-9d854d53306b",
      parent_id: "ad94c178-e723-40cf-a939-db7455a83b79",
      is_folder: true,
    },
    {
      name: "7. Submittals and Approvals",
      lastModified: 1773691555000,
      uploaded: 1773691043698,
      path: "/Shared/ProjectsTest/FCS-Test/7. Submittals and Approvals",
      folder_id: "7b9f4cfd-2019-4aed-812a-05f02c3a0a21",
      parent_id: "ad94c178-e723-40cf-a939-db7455a83b79",
      folders: [
        {
          path: "sa 1",
        },
        {
          path: "sa 2",
        },
      ],
    },
    {
      name: "Albany, NY - Lincoln Park - 12924",
      lastModified: 1711977202000,
      uploaded: 1711727442741,
      path: "/Shared/Projects/Albany, NY - Lincoln Park - 12924",
      folder_id: "84c64d55-3fab-4c00-b764-88a7c3d18b9e",
      parent_id: "ed0a8d90-75d9-4500-8295-a356efadb431",
      folders: [
        {
          name: "12. Solidworks files",
          lastModified: 1773691053000,
          uploaded: 1773691053778,
          path: "/Shared/Projects/FCS-Test/12. Solidworks files",
          folder_id: "22afea3f-874a-4ca5-974a-793bae3a4a11",
          parent_id: "ad94c178-e723-40cf-a939-db7455a83b79",
          folders: [
            {
              path: "sf 1",
            },
            {
              path: "sf 2",
            },
          ],
        },
        {
          name: "2. Design",
          lastModified: 1773691020000,
          uploaded: 1773691020893,
          path: "/Shared/Projects/FCS-Test/2. Design",
          folder_id: "da677cba-3c85-42fd-a236-70dc8938f556",
          parent_id: "ad94c178-e723-40cf-a939-db7455a83b79",
          is_folder: true,
        },
        {
          name: "6. Engineering",
          lastModified: 1773691028000,
          uploaded: 1773691028625,
          path: "/Shared/Projects/FCS-Test/6. Engineering",
          folder_id: "90c73b3c-4d41-4820-9835-9d854d53306b",
          parent_id: "ad94c178-e723-40cf-a939-db7455a83b79",
          is_folder: true,
        },
        {
          name: "7. Submittals and Approvals",
          lastModified: 1773691555000,
          uploaded: 1773691043698,
          path: "/Shared/Projects/FCS-Test/7. Submittals and Approvals",
          folder_id: "7b9f4cfd-2019-4aed-812a-05f02c3a0a21",
          parent_id: "ad94c178-e723-40cf-a939-db7455a83b79",
          folders: [
            {
              path: "sa 1",
            },
            {
              path: "sa 2",
            },
          ],
        },
      ],
    },
  ],
};

const readFolders = ["6. Engineering", "7. Submittals and Approvals"];
const writeFolders = ["12. Solidworks files"];
let readArr = [];
let writeArr = [];

const format = (i) => {
  let arr = [];
  const { path } = i;
  const { folders } = i;
  if (!folders) {
    arr.push(path);
  }
  arr.push(path);
};

function test(data) {
  if (arr.includes(data.path)) {
    console.log("path alreaedy added");
    return;
  }
  arr.push(data.path);

  if (data.folders) {
    const { folders } = data;
    console.log("folders", folders);

    folders.forEach((folder) => {
      arr.push(folder.path);
      const subfolders = folder.folders;
      if (!subfolders) {
        return;
      } else {
        subfolders.forEach((subfolder) => {
          test(subfolder);
        });
      }
    });

    // for (const i of folders) {
    //   console.log("i", i);
    //   const { path, folders } = i;
    //   if (!folders) {
    //     arr.push(path);
    //   }
    //   arr.push(path);
    //   const subFolders = i.folders;
    //   if (subFolders) {
    //     for (const t of subFolders) {
    //       console.log("t", t);
    //       const { path, folder } = t;
    //       test(t);
    //     }
    //   }
    // }
  }
  console.log("final array", arr);
}

// test(testObj);

function combineStrings(data) {
  let moreFolders = true;
  while (moreFolders) {
    if (arr.includes(data.path)) {
      continue;
    } else {
      setPerms(data.path);
      if (data.folders) {
        const { folders } = data;
        console.log("156 folders:", folders);
        for (const i of folders) {
          // console.log("folder name:", folder.name);
          // setPerms(folder.path);
          // setOptions(folder.path);

          if (readFolders.includes(i.name) && !arr.includes(i.path)) {
            setRead(i.path);
            setOptions(i.path);
          } else if (writeFolders.includes(i.name) && !arr.includes(i.path)) {
            setWrite(i.path);
            setOptions(i.path);
          } else {
            setPerms(i.path);
            setOptions(i.path);
          }

          console.log("folders 166", i.folders);

          if (i.folders) {
            console.log("more folders");
            const { folders } = i;
            for (const t of folders) {
              console.log("folder 173", t.name);
              combineStrings(t);
            }
          } else {
            console.log("no more folders");
            moreFolders = false;
          }
        }
      } else {
        moreFolders = false;
      }
    }
  }
  console.log("final array", arr);
}

//     if (folder.folders) {
//       const { folders } = folder;

//       folders.forEach((folder) => {
//       const fOptions = "options set on: " + folder.name;
//       arr.push(fOptions);
//       if (readFolders.includes(folder.name)) {
//         const path = "rFolder" + ":" + folder.name;
//         arr.push(path);
//       } else if (writeFolders.includes(folder.name)) {
//         const path = "wFolder" + ":" + " " + folder.name;
//         arr.push(path);
//       } else {
//         arr.push(folder.path);
//       }

//       } else {
//         moreFolders = false;
//       }
//     });
//   }
//   moreFolders = false;
//   console.log(arr);
// }

// function checkFolders() {

// }

function setPerms(path) {
  arr.push(path);
  // console.log(`Perms set on ${path}`);
}

function setOptions(path) {
  arr.push(path);
  console.log(`Options set on ${path}`);
}

function setRead(path) {
  const fPath = "zRead:" + " " + path;
  arr.push(fPath);
  console.log(`Read perms set on ${fPath}`);
}

function setWrite(path) {
  const fPath = "zWrite:" + " " + path;
  arr.push(fPath);
  // console.log(`Write perms set on ${fPath}`);
}

// combineStrings(fString, sString);
// combineStrings("This is the third path", "This is the fourth path");
// combineStrings("this is the fifth path", "this is the 6th path");

// console.log(data.folders);

// combineStrings(testObj);

function getArray() {
  let touchedFiles = [];
  const path = "this is the path";
  touchedFiles.push(path);
  return touchedFiles;
}

function test2() {
  console.log(getArray.touchedFiles);
}

test2();
