# MobileHelper

Shared code between ChurchApps react native applications

## To Test

1. After making changes run `npm run build` followed by `npm link` to expose the package locally
2. In your test project run `@npm link @churchapps/mobilehelper`
3. Rerun both after changes

## To Publish

1. Update version number in package.json
2. Run `npm run build`
3. Run `npm publish --access=public`
