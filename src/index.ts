import { handleDirectory, handleDocument, readSettings } from "./importer";

const projectDirectory = process.argv[2];

const settings = readSettings(projectDirectory);

settings.sections.map((section) => {
  switch (section.type) {
    case "directory":
      handleDirectory(projectDirectory, section.path, section.match);
      break;
    case "document":
      handleDocument(projectDirectory, section.path);
      break;
    default:
      console.log("other");
  }
});
