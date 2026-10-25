# Publishing the Applications

## Updating the Application
Before building a publishing any artifacts, run this command:
`mms update-scouting-version {year}.{major}.{minor}`

This will update the version in a few files like the `package.json` so that the resulting builds have the correctly labeled version.

## Sentinel
Sentinel is built using Expo, you can access the builds [here](https://expo.dev/accounts/systemmeltdown2357/projects/scouting-sentinel)

### Dev build
1. Navigate to the Sentinel directory in the terminal
2. Run `npm run build:dev`
3. This will create a dev build on Expo. This build only includes the hardware-necessary components and can connect to your dev server

### Production build
1. Navigate to the Sentinel directory in the terminal
2. Run `npm run build:prod`
3. This will create a production build on Expo. This is the standalone app that will be installed on the tablets for competition.

## Overseer
To build Overseer for production:

1. Navigate to the Sentinel directory in the terminal
2. Run `npm run make`
3. This will create a Windows compatible executable at `scouting/overseer/out/scouting-overseer-win32-x64/scouting-overseer.exe`

## Creating a GitHub Release
1. Tag the commit that the build artifacts you generated are based from in the format `v{year}.{major}.{minor}`
2. Create a release on GitHub using the tag as the ref.
3. Add the version, description and changelog to th release. Just copy the previous release's format and update it.
4. Upload the build artifacts for Sentinel and Overseer. Make sure the artifacts are named in this format:
   
     - `scouting-overseer-{year}.{major}.{minor}.exe`, ex: `scouting-overseer-2025.1.0.exe`
    
    - `scouting-sentinel-{year}.{major}.{minor}.apk`, ex: `scouting-sentinel-2025.1.0.apk`