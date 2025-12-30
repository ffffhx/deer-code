import fs from 'fs';
import path from 'path';

export class Project {
  private _rootDir: string;

  constructor(projectPath: string) {
    this._rootDir = projectPath;
  }

  get rootDir(): string {
    return this._rootDir;
  }

  set rootDir(projectPath: string) {
    if (!fs.existsSync(projectPath)) {
      throw new Error(`Project root directory ${projectPath} does not exist`);
    }
    if (!fs.statSync(projectPath).isDirectory()) {
      throw new Error(`Project root directory ${projectPath} is not a directory`);
    }
    this._rootDir = path.resolve(projectPath);
  }
}

export const project = new Project(process.cwd());
