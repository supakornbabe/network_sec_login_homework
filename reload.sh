cd ~/loginServer/
rm -rf network_sec_login_homework
git clone https://github.com/supakornbabe/network_sec_login_homework
cd ~/loginServer/network_sec_login_homework
forever stopall
forever start app.js
forever list
cd