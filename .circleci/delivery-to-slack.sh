#!/bin/bash

### start of getting version
VERSION="$(jq -r '.version' ./package.json)"
if [ "$VERSION" == "0.0.0" ]
then
  VERSION="dev"
else
  VERSION="v$VERSION"
fi
echo "version : $VERSION"
### end of getting version

NEW_LINE=$'\n'

curl -F channel="#_general" \
    -F text="운영페이지 $VERSION 버전이 릴리즈 되었습니다!${NEW_LINE}:point_right::skin-tone-2: <https://fomes-admin-frontend.herokuapp.com|운영페이지 확인하러 가기>" \
    -F token=$SLACK_BOT_TOKEN \
    -F as_user=true \
    https://slack.com/api/chat.postMessage