import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import time
import RPi.GPIO as GPIO

# Raspberry Pi Setup
GPIO.setmode(GPIO.BCM)
DOOR_SENSOR = 5
INTERIOR_SENSORS = [ 6, 7, 8 ]
GPIO.setup(DOOR_SENSOR, GPIO.IN)
for sensor in INTERIOR_SENSORS:
	GPIO.setup(sensor, GPIO.IN)

# Firebase Setup
cred = credentials.Certificate('firebasekey.json')
firebase_admin.initialize_app(cred)
db = firestore.client()
doc = db.collection(u'rooms').document(u'Arc 155')
status = doc.get().to_dict()['Status']
ignore = False

def setStatus( status ):
	doc.update({
		'Status': status
	})

last_seen_movement = time.time()

while True: 
	# if status is closed we don't update room status
	status = doc.get().to_dict()['Status']
	if status == 'Closed':
		continue

	inside_movement = -1
	for sensor in INTERIOR_SENSORS:
		if GPIO.input(sensor):
			inside_movement = sensor
	if GPIO.input(DOOR_SENSOR):
		print("MOVEMENT AT DOOR!")
		if status == 'Occupied':
			status = 'Available'
			setStatus( status )
		else:
			status = 'Occupied'
			setStatus( status )
		ignore = True
		last_seen_movement = time.time()
		time.sleep(10)
	elif inside_movement != -1:
		print(f'MOVEMENT INSIDE AT SENSOR {inside_movement}!')
		last_seen_movement = time.time()
		if status == 'Available':
			status = 'Occupied'
			setStatus( status )
	else:
		if (time.time() - last_seen_movement) > (60) * 5:
			print('no movement for 5 minutes')
			status = 'Available'
			setStatus( status )
		print('0')

	time.sleep(1)


