publish:
	- git add -A
	- git commit -m "Preparing to publish content"
	- git push
	- curl https://docs.openmove.com/sidecar/mark-as-dead
	- echo "Openmove docs will be updated soon at https://docs.openmove.com/"