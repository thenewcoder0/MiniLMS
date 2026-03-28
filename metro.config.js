const { getDefaultConfig } = require("expo/metro-config");

let config = getDefaultConfig(__dirname);

try {
    const { withNativeWind } = require("nativewind/metro");
    config = withNativeWind(config, { input: "./global.css" });
} catch (e) {
    console.log("NativeWind metro config skipped");
}

module.exports = config;