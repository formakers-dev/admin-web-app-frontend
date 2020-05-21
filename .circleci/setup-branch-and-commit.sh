#!/bin/bash
git checkout $1 2>/dev/null || git checkout -b $1

### start of getting version
VERSION="$(jq -r '.version' ./package.json)"
if [ "$VERSION" == "0.0.0" ]
then
  VERSION="dev"
else
  VERSION="v$VERSION"
fi
echo "add deploy for $VERSION"
### end of getting version

git config --global user.email "appbee1018@gmail.com"
git config --global user.name "AppBee Admin"

### [For only Vue.js] Heroku의 Express 환경 구성을 위한 Dummy 파일들
cp .circleci/package.json dist/
cp .circleci/server.js dist/
cp .circleci/static.json dist/

cp .gitignore .gitignore_original
sed -i '/dist/d' .gitignore
git add dist && git commit -m "add deploy for $VERSION"
mv .gitignore_original .gitignore
