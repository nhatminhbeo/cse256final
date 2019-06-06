export FLASK_APP=backend.py
export PRIVATE=/etc/letsencrypt/live/lightsail.vnmb.xyz/privkey.pem
export CERT=/etc/letsencrypt/live/lightsail.vnmb.xyz/fullchain.pem
expot HOST=0.0.0.0
flask run --host $HOST --cert $CERT --key $KEY