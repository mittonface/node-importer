import {
  handleDirectory,
  handleDocument,
  handleSettings,
  handleTemplates,
  readSettings,
} from "./importer";

const projectDirectory = process.argv[2];

const settings = readSettings(projectDirectory);

// read in content
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

// read in templates
handleTemplates(projectDirectory);

// read in project settings
handleSettings(projectDirectory);
