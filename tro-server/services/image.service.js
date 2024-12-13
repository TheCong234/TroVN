import ImageModel from "../models/image.model.js";
import { MAX_IMAGE_SIZE } from "./listing.service.js";
import UserService from "./user.service.js";
import { analyzeImage } from "../core/analyze.image.js";
import { deleteImage } from "../config/cloundinary.js";
import { fileURLToPath } from "url";
import fs from "fs";
import { logger } from "../config/winston.js";
import path from "path";
import sharp from "sharp";
import { uploader } from "../utils/uploader.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ImageService = {
  async createManyImage(urls) {
    try {
      return await ImageModel.methods.insertManyImage(urls);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
  async createImage(url) {
    try {
      return await ImageModel.methods.insertImage(url);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
  async deleteImage(imageId) {
    try {
      return await ImageModel.methods.deleteImageById(imageId);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
  async deleteImageByListingId(listingId) {
    try {
      return await ImageModel.methods.deleteImageListingId(listingId);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
  async uploadImage(file, userId) {
    try {
      if (file.size > MAX_IMAGE_SIZE) {
        throw new Error(
          `Dung lượng của ảnh phải <= 5MB, file name: ${
            file.originalname
          }: is ${file.size / 1024 / 1024}MB`
        );
      }

      const { path: inputPath } = file;
      const logoPath = path.join(__dirname, "../public/logo.png");
      const watermarkText = "TROVN";

      const watermarkedImagePath = await this.addWatermark(
        inputPath,
        logoPath,
        watermarkText
      );

      const newPath = await uploader(watermarkedImagePath);
      const analyze = await analyzeImage(newPath?.url);

      if (analyze.isAdultContent || analyze.isRacyContent) {
        await deleteImage(newPath.url);
        await UserService.checkBanned(userId);
        throw new Error(
          `Image contains ${analyze.isAdultContent ? "adult" : "racy"} content.`
        );
      }
      fs.unlinkSync(inputPath);
      fs.unlinkSync(watermarkedImagePath);

      return newPath;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async uploadManyImages(files, userId) {
    const validImages = [];
    const watermarkText = "TROVN";
    const logoPath = path.join(__dirname, "../public/logo.png");

    for (const file of files) {
      if (file.size > MAX_IMAGE_SIZE) {
        throw new Error(
          `Image size must be <= 5MB. File name: ${
            file.originalname
          } has size ${file.size / 1024 / 1024}MB`
        );
      }
    }

    for (const file of files) {
      const inputPath = file.path;
      const watermarkedImagePath = await this.addWatermark(
        inputPath,
        logoPath,
        watermarkText
      );
      const newPath = await uploader(watermarkedImagePath);
      const analysis = await analyzeImage(newPath.url);

      if (analysis.isAdultContent || analysis.isRacyContent) {
        await Promise.all(validImages.map((item) => deleteImage(item.url)));
        await UserService.checkBanned(listingData.userId);
        await this.deleteListing(listingData.id);
        throw new Error(
          `Image contains ${
            analysis.isAdultContent ? "adult" : "racy"
          } content.`
        );
      }

      validImages.push(newPath);
      fs.unlinkSync(inputPath);
    }

    return validImages.map((item) => item.url);
  },

  async addWatermark(inputPath, logoPath, text) {
    const outputDir = path.join(__dirname, "../output");
    const outputPath = path.join(
      outputDir,
      "watermarked_" + path.basename(inputPath)
    );

    try {
      const logo = await this.resizeLogo(logoPath, 100, 100);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      const imageWithLogo = await sharp(inputPath)
        .composite([{ input: logo, gravity: "southeast", blend: "over" }])
        .toBuffer();

      const textOverlay = Buffer.from(
        `<svg width="500" height="500">
          <text x="10" y="40" font-size="32" fill="white" opacity="0.5">${text}</text>
        </svg>`
      );

      await sharp(imageWithLogo)
        .composite([{ input: textOverlay, gravity: "northwest" }])
        .toFile(outputPath);

      return outputPath;
    } catch (err) {
      console.error("Error adding watermark:", err);
      throw err;
    }
  },
  async getImageDimensions(imagePath) {
    const { width, height } = await sharp(imagePath).metadata();
    return { width, height };
  },

  async resizeLogo(logoPath, maxWidth, maxHeight) {
    const { width, height } = await this.getImageDimensions(logoPath);

    if (width > maxWidth || height > maxHeight) {
      return sharp(logoPath)
        .resize({
          width: Math.min(maxWidth, width),
          height: Math.min(maxHeight, height),
          fit: sharp.fit.inside,
        })
        .toBuffer();
    }

    return sharp(logoPath).toBuffer();
  },
};
export default ImageService;
