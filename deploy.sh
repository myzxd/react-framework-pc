env=$1

sendToDev(){
  rm -rf ./dist.zip
  zip -r ./dist.zip ./dist/*
  scp ./dist.zip qhfront@123.124.17.55:/data/project/web/dev/aoao-boss-app/dist.zip
  echo "send file to server boss dev"
  ssh qhfront@123.124.17.55 "echo A | bash deployJS.sh boss dev"
}

sendToQA(){
  rm -rf ./dist.zip
  zip -r ./dist.zip ./dist/*
  scp ./dist.zip qhfront@123.124.17.55:/data/project/web/qa/aoao-boss-app/dist.zip
  echo "send file to server boss qa"
  ssh qhfront@123.124.17.55 "echo A | bash deployJS.sh boss qa"
}

sendToCode(){
  rm -rf ./dist.zip
  zip -r ./dist.zip ./dist/*
  scp ./dist.zip qhfront@123.124.17.55:/data/project/uat/boss-quhuo/dist.zip
  echo "send file to server boss code"
  ssh qhfront@123.124.17.55 "echo A | bash deployJS.sh boss code"
}

sendToXingDaCode(){
  rm -rf ./dist.zip
  zip -r ./dist.zip ./dist/*
  scp ./dist.zip qhfront@123.124.17.55:/data/project/uat/boss-xingda/dist.zip
  echo "send file to server boss xingDa code"
  ssh qhfront@123.124.17.55 "echo A | bash deployJS.sh boss xingDaCode"
}

sendTo2081Boss(){
  rm -rf ./dist.zip
  zip -r ./dist.zip ./dist/*
  scp ./dist.zip qhfront@123.124.17.55:/data/project/apps/boss/dist.zip
  echo "send file to server boss 2081"
  ssh qhfront@123.124.17.55 "echo A | bash deploy2081.sh boss"
}

sendTo2081Rdteam(){
  rm -rf ./dist.zip
  zip -r ./dist.zip ./dist/*
  scp ./dist.zip qhfront@123.124.17.55:/data/project/apps/rdteam/dist.zip
  echo "send file to server rdteam 2081"
  ssh qhfront@123.124.17.55 "echo A | bash deploy2081.sh rdteam"
}

sendToOABoss(){
  rm -rf ./dist.zip
  zip -r ./dist.zip ./dist/*
  scp ./dist.zip root@172.18.22.33:/data/project/apps/aoao-boss-app//dist.zip
  echo "send file to server OA boss"
  ssh root@172.18.22.33 "echo A | bash deployJS.sh boss"
}

if [ $env == "dev" ]
then
  sendToDev

elif [ $env == "code" ]
then
  sendToCode

elif [ $env == "xingDaCode" ]
then
  sendToXingDaCode

elif [ $env == "qa" ]
then
  sendToQA

elif [ $env == "oa" ]
then
  sendToOABoss

elif [ $env == "2081" ]
then
  sendTo2081Boss
  sendTo2081Rdteam

else
  echo "type error, not find"
fi
