import fs from "node:fs";
import path from "node:path";
import { config } from 'config';

async function ensureDirExist(dir: string): Promise<void> {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
}

async function clearDir(dir: string): Promise<void> {
  if (fs.existsSync(dir)) {
    for (const file of fs.readdirSync(dir)) {
      fs.unlinkSync(path.join(dir, file));
    }
  }
}

async function deleteFile(filePath: string): Promise<void> {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

async function clearAllureResults(): Promise<void> {
  fs.readdir(config.allure, (err, files) => {
    if (!err) {
      files.forEach(file => {
        const ext = file.split('.')[1];
        if(ext == 'json' || ext == 'png' || ext == 'imagediff') fs.unlinkSync(config.allure + '/' + file);       
      });
    }
  });
}

export { clearDir, clearAllureResults, ensureDirExist, deleteFile }