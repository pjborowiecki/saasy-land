import { Config } from "@remotion/cli/config"

Config.setRspack(true)
// PNG frames preserve sharp text and hairlines during video encoding.
Config.setVideoImageFormat("png")
Config.setOverwriteOutput(true)
