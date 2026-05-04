#!/usr/bin/env node
/**
 * Image Optimization Script
 * Converts large PNG files to optimized WebP format
 * Preserves originals with .original extension
 */

import sharp from "sharp"
import { readdir, rename, stat } from "fs/promises"
import { join, extname, basename } from "path"

const IMAGE_DIR = "./public/images"
const MIN_SIZE_MB = 0.0 // Only convert images larger than 500KB
const WEBP_QUALITY = 85 // High quality WebP

async function getFileSizeMB(filePath) {
  const stats = await stat(filePath)
  return stats.size / (1024 * 1024)
}

async function convertToWebP(inputPath, outputPath) {
  try {
    await sharp(inputPath).webp({ quality: WEBP_QUALITY, effort: 6 }).toFile(outputPath)

    const originalSize = await getFileSizeMB(inputPath)
    const webpSize = await getFileSizeMB(outputPath)
    const savings = (((originalSize - webpSize) / originalSize) * 100).toFixed(1)

    console.log(
      `✓ ${basename(inputPath)}: ${originalSize.toFixed(2)}MB → ${webpSize.toFixed(2)}MB (${savings}% smaller)`,
    )
    return { originalSize, webpSize, savings }
  } catch (error) {
    console.error(`✗ Failed to convert ${basename(inputPath)}:`, error.message)
    return null
  }
}

async function optimizeImages() {
  console.log("🎨 Starting image optimization...\n")

  const files = await readdir(IMAGE_DIR)
  const pngFiles = files.filter((f) => [".png", ".jpg", ".jpeg"].includes(extname(f).toLowerCase()))

  let totalOriginal = 0
  let totalWebP = 0
  let convertedCount = 0

  for (const file of pngFiles) {
    const inputPath = join(IMAGE_DIR, file)
    const sizeMB = await getFileSizeMB(inputPath)

    // Skip small files
    if (sizeMB < MIN_SIZE_MB) {
      console.log(`⊘ Skipping ${file} (${sizeMB.toFixed(2)}MB - below threshold)`)
      continue
    }

    // Check if WebP version already exists
    const webpFile = file.replace(/\.(png|jpg|jpeg)$/i, ".webp")
    const outputPath = join(IMAGE_DIR, webpFile)
    const webpExists = files.includes(webpFile)

    if (webpExists) {
      console.log(`⊘ Skipping ${file} - WebP version exists`)
      continue
    }

    // Convert to WebP
    const result = await convertToWebP(inputPath, outputPath)
    if (result) {
      totalOriginal += result.originalSize
      totalWebP += result.webpSize
      convertedCount++

      // Backup original by renaming
      const backupPath = inputPath + ".original"
      await rename(inputPath, backupPath)
      console.log(`  → Original backed up to ${basename(backupPath)}`)
    }
  }

  console.log("\n" + "=".repeat(60))
  console.log("📊 Summary:")
  console.log(`   Files converted: ${convertedCount}`)
  console.log(`   Total original size: ${totalOriginal.toFixed(2)}MB`)
  console.log(`   Total WebP size: ${totalWebP.toFixed(2)}MB`)
  console.log(
    `   Total savings: ${(totalOriginal - totalWebP).toFixed(2)}MB (${(((totalOriginal - totalWebP) / totalOriginal) * 100).toFixed(1)}%)`,
  )
  console.log("=".repeat(60))
}

optimizeImages().catch(console.error)
