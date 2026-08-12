/**
 * Render defaults for the landing page's concept loops.
 *
 * Note: when using the Node.JS APIs, this file does not apply; pass options directly.
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config"

Config.setRspack(true)
// PNG, not JPEG: these are flat vector surfaces on a near-black ground, and JPEG's chroma
// subsampling puts visible mosquito noise around the hairlines and the accent text.
Config.setVideoImageFormat("png")
Config.setOverwriteOutput(true)
