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

curl -F channels="#_general" \
    -F initial_comment="운영페이지 $VERSION 버전이 릴리즈 되었습니다!\n:point_right: <https://fomes-admin-frontend.herokuapp.com|운영페이지 확인하러 가기>" \
    -F token=$SLACK_BOT_TOKEN \
    https://slack.com/api/chat.postMessage