/**
 * Below classes is mere not needed when we only work with zip/compressed file
 * (which is natively supported by webamp-modern),
 * but we made it like this to support more wider range of skins file format.
 */

import JSZip, { JSZipObject } from "jszip";
// import { getCaseInsensitiveFile } from "../utils";

/**
 * Special class that do only extract files from a skin file
 */
export abstract class FileExtractor {
  //

  abstract prepare(skinPath: string): Promise<void>;

  abstract getFileAsString(filePath: string): Promise<string>;
  abstract getFileAsBytes(filePath: string): Promise<ArrayBuffer>;
  abstract getFileAsBlob(filePath: string): Promise<Blob>;
}

/**
 * Works only with Zip
 */
export class ZipFileExtractor {
  _zip: JSZip;

  async prepare(skinPath: string) {
    const response = await fetch(skinPath);
    const skinZipBlob = await response.blob();
    this._zip = await JSZip.loadAsync(skinZipBlob);
  }

  async getFileAsString(filePath: string): Promise<string> {
    if (!filePath) return "";
    const zipObj = getCaseInsensitiveFile(this._zip, filePath);
    if (!zipObj) return "";
    return await zipObj.async("text");
  }

  async getFileAsBytes(filePath: string): Promise<ArrayBuffer> {
    if (!filePath) return new ArrayBuffer(0);
    const zipObj = getCaseInsensitiveFile(this._zip, filePath);
    if (!zipObj) return new ArrayBuffer(0);
    return await zipObj.async("arraybuffer");
  }

  async getFileAsBlob(filePath: string): Promise<Blob> {
    if (!filePath) return new Blob();
    const zipObj = getCaseInsensitiveFile(this._zip, filePath);
    if (!zipObj) return new Blob();
    return await zipObj.async("blob");
  }
}

/**
 * Works only with path (url)
 * It do same as zip, but with path based world
 */
export class PathFileExtractor {
  _skinDir: string;

  async prepare(skinPath: string) {
    if (!skinPath.endsWith("/")) skinPath += "/";
    this._skinDir = skinPath;
  }

  async getFileAsString(filePath: string): Promise<string> {
    const response = await fetch(this._skinDir + filePath);
    return await response.text();
  }

  async getFileAsBytes(filePath: string): Promise<ArrayBuffer> {
    const response = await fetch(this._skinDir + filePath);
    return await response.arrayBuffer();
  }

  async getFileAsBlob(filePath: string): Promise<Blob> {
    const response = await fetch(this._skinDir + filePath);
    return await response.blob();
  }
}

export function getCaseInsensitiveFile(
  zip: JSZip,
  filePath: string
): JSZipObject | null {
  const normalized = filePath.replace(/[\/\\]/g, `[/\\\\]`);
  const files = zip.file(new RegExp(normalized, "i"));
  if (files && files.length > 1) {
    // console.log('asking',filePath,'got files:', files);
    const requestName = filePath.split("/").pop()?.toLowerCase();
    for (let i = 0; i < files.length; i++) {
      const responseName = files[i].name.split("/").pop()?.toLowerCase();
      if (responseName == requestName) {
        return files[i];
      }
    }
    return zip.file(new RegExp(`^${normalized}$`, "i"))[0] ?? null;
  }
  return files[0] ?? null;
}
