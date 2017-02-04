#takes measurements from the sensor every minute and stores them into the file
import datetime;
import time;
import Adafruit_DHT as dht
import shelve

timeout = 60
while True:
    print('Reading sensor values ...')
    key = datetime.datetime.now().isoformat()
    storagekey = key.split('T')[0]
    h,t = dht.read_retry(dht.DHT22,4)
    datastore = shelve.open('files/'+storagekey+'.db')
    value = {'d':key,'t':round(t,2),'h':round(h,2)}
    datastore[key] = value
    datastore.close()
    print('Written values',key,value)    
    time.sleep(timeout)
